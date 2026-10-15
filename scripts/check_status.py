#!/usr/bin/env python3
"""Quick status of the Instagram posting automation (no secrets printed).

  python scripts/check_status.py

Shows: the queue (draft releases), the latest workflow runs, and the latest posts on the
Instagram account (so you can tell whether today's scheduled post went out).
Needs `gh` logged in and a .env with IG_ACCESS_TOKEN (found by walking up from this file).
"""
import json
import subprocess
import sys
import urllib.parse
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from publish_reel import GRAPH, call, find_env, load_env  # noqa: E402

KST = timezone(timedelta(hours=9))
REPO = "we2share55-lang/moneystudy"


def gh_json(*args):
    p = subprocess.run(["gh", *args], capture_output=True, text=True, encoding="utf-8")
    return json.loads(p.stdout) if p.returncode == 0 and p.stdout.strip() else None


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    now = datetime.now(KST)
    print(f"now (KST): {now:%Y-%m-%d %H:%M}")

    rels = gh_json("api", f"repos/{REPO}/releases?per_page=100") or []
    queue = sorted(r["tag_name"] for r in rels if r["draft"] and r["tag_name"].startswith("reel-"))
    print(f"\nqueue ({len(queue)} waiting, posted in this order):")
    for t in queue:
        print("  -", t[len("reel-"):])

    runs = gh_json("run", "list", "--repo", REPO, "--workflow", "publish-reel", "--limit", "8",
                   "--json", "createdAt,event,conclusion,status") or []
    print("\nlatest workflow runs (UTC -> KST):")
    for r in runs:
        ts = datetime.strptime(r["createdAt"], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc).astimezone(KST)
        print(f"  {ts:%m-%d %H:%M}  {r['event']:<17} {r['status']:<10} {r['conclusion'] or ''}")
    if not any(r["event"] == "schedule" for r in runs):
        print("  (no scheduled run recorded yet)")

    env = load_env(find_env(None))
    token = env.get("IG_ACCESS_TOKEN", "")
    uid = env.get("IG_USER_ID", "")
    if token and uid:
        data = call("GET", f"{GRAPH}/{uid}/media?" + urllib.parse.urlencode(
            {"fields": "timestamp,permalink,caption", "limit": 6, "access_token": token})).get("data", [])
        print("\nlatest Instagram posts:")
        for m in data:
            ts = datetime.strptime(m["timestamp"], "%Y-%m-%dT%H:%M:%S%z").astimezone(KST)
            first = (m.get("caption") or "").splitlines()[0][:40]
            print(f"  {ts:%m-%d %H:%M}  {m['permalink']}  {first}")
    else:
        print("\n(no IG token in .env; skipped Instagram check)")


if __name__ == "__main__":
    main()
