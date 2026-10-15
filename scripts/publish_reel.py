#!/usr/bin/env python3
"""Publish a rendered reel to Instagram, using a temporary GitHub Release as the public video URL.

Instagram's API only accepts a publicly reachable video_url, so the mp4 is attached to a
throw-away release on this repo, handed to Instagram, and the release (and tag) is deleted
again once the post is live.

Default is a DRY RUN: nothing is uploaded or posted. Pass --publish to do it for real.

  python scripts/publish_reel.py ../media/posted/2026-10-11-001.mp4 \
      --caption-file ../media/posted/2026-10-11-001_caption.txt \
      --cover ../media/posted/2026-10-11-001_thumbnail.png --publish

Reads IG_ACCESS_TOKEN and IG_USER_ID from a .env found by walking up from this file
(or --env). Secrets are never printed. Requires the `gh` CLI, logged in.
"""
import argparse
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

GRAPH = "https://graph.instagram.com/v21.0"


def find_env(explicit):
    if explicit:
        return Path(explicit)
    d = Path(__file__).resolve().parent
    for _ in range(6):
        if (d / ".env").is_file():
            return d / ".env"
        d = d.parent
    sys.exit("no .env found (pass --env)")


def load_env(path):
    env = {}
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def call(method, url, params=None):
    data = urllib.parse.urlencode(params).encode() if params is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        try:
            body = json.loads(e.read())
        except Exception:
            body = {}
        err = body.get("error", {})
        sys.exit(f"Instagram API error {e.code}: {err.get('message', 'unknown')} (code {err.get('code')})")


def gh(*args, check=True):
    p = subprocess.run(["gh", *args], capture_output=True, text=True, encoding="utf-8")
    if check and p.returncode != 0:
        sys.exit(f"gh {' '.join(args[:2])} failed: {p.stderr.strip()[:300]}")
    return p


def check_url(url, want_video):
    """Follow redirects like a fetcher would and report what Instagram will see."""
    req = urllib.request.Request(url, method="GET", headers={"Range": "bytes=0-1023"})
    with urllib.request.urlopen(req, timeout=60) as r:
        ctype = r.headers.get("Content-Type", "")
        final = r.geturl()
    host = urllib.parse.urlparse(final).netloc
    print(f"  url check: final host={host} content-type={ctype}")
    if want_video and not ctype.startswith(("video/", "application/octet-stream", "binary/")):
        sys.exit("hosted file does not look like a video")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--caption-file", required=True)
    ap.add_argument("--cover", help="optional cover image (png/jpg)")
    ap.add_argument("--repo", default=None, help="owner/name; default = repo of the current dir via gh")
    ap.add_argument("--env")
    ap.add_argument("--keep-release", action="store_true", help="do not delete the temporary release afterwards")
    ap.add_argument("--publish", action="store_true", help="actually upload and post (default: dry run)")
    a = ap.parse_args()

    video = Path(a.video).resolve()
    caption_path = Path(a.caption_file).resolve()
    cover = Path(a.cover).resolve() if a.cover else None
    for p in (video, caption_path, *([cover] if cover else [])):
        if not p.is_file():
            sys.exit(f"missing file: {p}")
    caption = caption_path.read_text(encoding="utf-8-sig").strip()
    if len(caption) > 2200:
        sys.exit(f"caption too long: {len(caption)} > 2200")

    env = load_env(find_env(a.env))
    token, uid = env.get("IG_ACCESS_TOKEN", ""), env.get("IG_USER_ID", "")
    if not token or not uid.isdigit():
        sys.exit("IG_ACCESS_TOKEN / numeric IG_USER_ID missing in .env")

    me = call("GET", f"{GRAPH}/me?" + urllib.parse.urlencode(
        {"fields": "user_id,username", "access_token": token}))
    if str(me.get("user_id")) != uid:
        sys.exit("IG_USER_ID does not match the token's account")

    repo = a.repo or gh("repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner").stdout.strip()
    tag = "reel-" + re.sub(r"[^A-Za-z0-9._-]", "-", video.stem)
    base = f"https://github.com/{repo}/releases/download/{tag}/"
    size_mb = video.stat().st_size / 1e6

    print(f"account : @{me.get('username')}")
    print(f"video   : {video.name} ({size_mb:.1f} MB)")
    print(f"cover   : {cover.name if cover else '(none)'}")
    print(f"caption : {len(caption)} chars")
    print(f"hosting : temporary release {tag} on {repo} (public while it exists)")
    if not a.publish:
        print("\nDRY RUN - nothing uploaded or posted. Re-run with --publish.")
        return

    assets = [video] + ([cover] if cover else [])
    print("\n[1/4] uploading temporary release")
    gh("release", "create", tag, *map(str, assets), "--repo", repo,
       "--title", f"temp {video.stem}", "--notes", "Temporary hosting for an Instagram upload; deleted afterwards.")
    try:
        video_url = base + urllib.parse.quote(video.name)
        check_url(video_url, want_video=True)

        print("[2/4] creating Instagram container")
        params = {"media_type": "REELS", "video_url": video_url, "caption": caption, "access_token": token}
        if cover:
            params["cover_url"] = base + urllib.parse.quote(cover.name)
        cid = call("POST", f"{GRAPH}/{uid}/media", params)["id"]

        print("[3/4] waiting for processing")
        status = ""
        for i in range(1, 41):
            s = call("GET", f"{GRAPH}/{cid}?" + urllib.parse.urlencode(
                {"fields": "status_code,status", "access_token": token}))
            status = s.get("status_code", "UNKNOWN")
            print(f"  ({i}) {status}")
            if status == "FINISHED":
                break
            if status in ("ERROR", "EXPIRED"):
                sys.exit(f"processing failed: {s.get('status')}")
            time.sleep(8)
        else:
            sys.exit("processing timed out (container left unpublished)")

        print("[4/4] publishing")
        mid = call("POST", f"{GRAPH}/{uid}/media_publish", {"creation_id": cid, "access_token": token})["id"]
        link = call("GET", f"{GRAPH}/{mid}?" + urllib.parse.urlencode(
            {"fields": "permalink", "access_token": token})).get("permalink")
        print(f"\nPUBLISHED: {link}")
    finally:
        if a.keep_release:
            print(f"release kept: {base}")
        else:
            gh("release", "delete", tag, "--repo", repo, "--yes", "--cleanup-tag", check=False)
            print("temporary release deleted")


if __name__ == "__main__":
    main()
