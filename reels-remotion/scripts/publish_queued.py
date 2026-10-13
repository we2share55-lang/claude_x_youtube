#!/usr/bin/env python3
"""Post the next queued reel to Instagram (run daily by .github/workflows/publish-reel.yml).

Queue = DRAFT releases on this repo whose tag starts with `reel-` (created by queue_reel.py).
Drafts are invisible to the public. The oldest tag (sorted by name) is posted next:

  1. download its mp4 / caption / cover from the draft release
  2. publish the release (the assets get a public URL) -> Instagram fetches the video
  3. container -> wait -> media_publish
  4. delete the release and its tag. If anything fails before Instagram accepted the post,
     the release goes back to draft so the reel stays at the front of the queue.

Env: IG_ACCESS_TOKEN, IG_USER_ID, GITHUB_REPOSITORY, GH_TOKEN (set by the workflow).
Use --dry-run to only report what would be posted.
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from publish_reel import GRAPH, call, check_url  # noqa: E402


def gh_api(path, *args, binary_to=None):
    cmd = ["gh", "api", path, *args]
    if binary_to:
        with open(binary_to, "wb") as f:
            p = subprocess.run(cmd, stdout=f, stderr=subprocess.PIPE)
        err = p.stderr.decode("utf-8", "replace")
    else:
        p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        err = p.stderr
    if p.returncode != 0:
        sys.exit(f"gh api {path} failed: {err.strip()[:300]}")
    return None if binary_to else (json.loads(p.stdout) if p.stdout.strip() else None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--min-gap-hours", type=float, default=0,
                    help="skip if the account already posted within this many hours (lets the schedule retry safely)")
    a = ap.parse_args()

    repo = os.environ.get("GITHUB_REPOSITORY") or sys.exit("GITHUB_REPOSITORY missing")
    token, uid = os.environ.get("IG_ACCESS_TOKEN", "").strip(), os.environ.get("IG_USER_ID", "").strip()
    if not token or not uid.isdigit():
        sys.exit("IG_ACCESS_TOKEN / numeric IG_USER_ID missing")

    rels = gh_api(f"repos/{repo}/releases?per_page=100")
    queue = sorted((r for r in rels if r["draft"] and r["tag_name"].startswith("reel-")),
                   key=lambda r: r["tag_name"])
    print(f"queue: {len(queue)} reel(s) -> {[r['tag_name'] for r in queue]}")
    if not queue:
        print("nothing to post")
        return
    rel = queue[0]
    tag = rel["tag_name"]
    name = tag[len("reel-"):]
    assets = {x["name"]: x for x in rel["assets"]}
    video_name, cap_name, cover_name = f"{name}.mp4", f"{name}_caption.txt", f"{name}_thumbnail.png"
    for need in (video_name, cap_name):
        if need not in assets:
            sys.exit(f"release {tag} is missing asset {need}")

    me = call("GET", f"{GRAPH}/me?" + urllib.parse.urlencode({"fields": "user_id,username", "access_token": token}))
    if str(me.get("user_id")) != uid:
        sys.exit("IG_USER_ID does not match the token's account")
    if a.min_gap_hours > 0:
        latest = call("GET", f"{GRAPH}/me/media?" + urllib.parse.urlencode(
            {"fields": "timestamp", "limit": 1, "access_token": token})).get("data", [])
        if latest:
            ts = datetime.strptime(latest[0]["timestamp"], "%Y-%m-%dT%H:%M:%S%z")
            age_h = (datetime.now(timezone.utc) - ts).total_seconds() / 3600
            print(f"latest post on the account: {age_h:.1f} h ago")
            if age_h < a.min_gap_hours:
                print(f"skip: already posted within {a.min_gap_hours:g} h")
                return
    print(f"account: @{me.get('username')} | next: {name} ({assets[video_name]['size'] / 1e6:.1f} MB)"
          f" | cover: {'yes' if cover_name in assets else 'no'}")
    if a.dry_run:
        print("DRY RUN - nothing published")
        return

    tmp = Path(tempfile.mkdtemp())
    cap_path = tmp / cap_name
    gh_api(f"repos/{repo}/releases/assets/{assets[cap_name]['id']}", "-H", "Accept: application/octet-stream", binary_to=cap_path)
    caption = cap_path.read_text(encoding="utf-8").strip()
    if not caption or len(caption) > 2200:
        sys.exit(f"bad caption length: {len(caption)}")

    print("[1/4] making the release public")
    gh_api(f"repos/{repo}/releases/{rel['id']}", "-X", "PATCH", "-F", "draft=false", "-f", "make_latest=false")
    base = f"https://github.com/{repo}/releases/download/{tag}/"
    accepted = False
    try:
        video_url = base + urllib.parse.quote(video_name)
        check_url(video_url, want_video=True)

        print("[2/4] creating Instagram container")
        params = {"media_type": "REELS", "video_url": video_url, "caption": caption, "access_token": token}
        if cover_name in assets:
            params["cover_url"] = base + urllib.parse.quote(cover_name)
        cid = call("POST", f"{GRAPH}/{uid}/media", params)["id"]

        print("[3/4] waiting for processing")
        for i in range(1, 61):
            s = call("GET", f"{GRAPH}/{cid}?" + urllib.parse.urlencode({"fields": "status_code,status", "access_token": token}))
            status = s.get("status_code", "UNKNOWN")
            print(f"  ({i}) {status}")
            if status == "FINISHED":
                break
            if status in ("ERROR", "EXPIRED"):
                sys.exit(f"processing failed: {s.get('status')}")
            time.sleep(10)
        else:
            sys.exit("processing timed out")

        print("[4/4] publishing")
        mid = call("POST", f"{GRAPH}/{uid}/media_publish", {"creation_id": cid, "access_token": token})["id"]
        accepted = True
        link = call("GET", f"{GRAPH}/{mid}?" + urllib.parse.urlencode({"fields": "permalink", "access_token": token})).get("permalink")
        print(f"PUBLISHED {name}: {link}")
        summary = os.environ.get("GITHUB_STEP_SUMMARY")
        if summary:
            with open(summary, "a", encoding="utf-8") as f:
                f.write(f"### Posted `{name}`\n\n{link}\n")
    finally:
        if accepted:
            subprocess.run(["gh", "release", "delete", tag, "--repo", repo, "--yes", "--cleanup-tag"], capture_output=True)
            print("release deleted (reel left the queue)")
        else:
            gh_api(f"repos/{repo}/releases/{rel['id']}", "-X", "PATCH", "-F", "draft=true")
            print("release set back to draft (reel stays in the queue)")


if __name__ == "__main__":
    main()
