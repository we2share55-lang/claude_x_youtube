#!/usr/bin/env python3
"""Tidy the big local files. Dry run by default; add --apply to really delete/move.

  python scripts/cleanup_media.py            # show what would happen
  python scripts/cleanup_media.py --apply

Rules (days are configurable):
  media/drafts/<name>/   all takes are deleted once <name> is queued/posted (it is in ready/ or
                         posted/), or when the folder is older than --draft-days (default 7)
  media/ready/<name>*    moved to posted/ when its draft release is no longer in the queue
                         (= it was posted); never touched while still queued
  media/posted/          deleted after --posted-days (default 14)
  media/cache/           deleted after --cache-days (default 14)
  public/20*.wav|json    generated voice files, deleted after --audio-days (default 14)
inbox/ and keep/ are never touched.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import time

from media_paths import CACHE, DRAFTS, GH_REPO, POSTED, READY, REPO

ap = argparse.ArgumentParser()
ap.add_argument("--apply", action="store_true")
ap.add_argument("--draft-days", type=float, default=7)
ap.add_argument("--posted-days", type=float, default=14)
ap.add_argument("--cache-days", type=float, default=14)
ap.add_argument("--audio-days", type=float, default=14)
a = ap.parse_args()
now = time.time()
freed = 0


def newest(path):
    """latest mtime inside a file or folder"""
    if path.is_file():
        return path.stat().st_mtime
    times = [p.stat().st_mtime for p in path.rglob("*") if p.is_file()]
    return max(times, default=path.stat().st_mtime)


def size(path):
    if path.is_file():
        return path.stat().st_size
    return sum(p.stat().st_size for p in path.rglob("*") if p.is_file())


def age_days(path):
    return (now - newest(path)) / 86400


def delete(path, why):
    global freed
    n = size(path)
    freed += n
    print(f"  delete {path}  ({n / 1e6:.1f} MB) - {why}")
    if a.apply:
        shutil.rmtree(path) if path.is_dir() else path.unlink()


def queued_names():
    p = subprocess.run(["gh", "release", "list", "--repo", GH_REPO, "--limit", "100",
                        "--json", "tagName,isDraft"], capture_output=True, text=True, encoding="utf-8")
    if p.returncode != 0:
        return None
    return {r["tagName"][5:] for r in json.loads(p.stdout) if r["tagName"].startswith("reel-") and r["isDraft"]}


# 1) ready -> posted
queue = queued_names()
print("ready/")
if queue is None:
    print("  (gh not available: skipping ready -> posted move)")
else:
    names = {f.name.split("_")[0].removesuffix(".mp4") for f in READY.glob("20*")}
    for n in sorted(names):
        if n in queue:
            print(f"  keep {n} (still in the queue)")
            continue
        print(f"  move {n} -> posted/ (no longer queued)")
        if a.apply:
            POSTED.mkdir(parents=True, exist_ok=True)
            for f in READY.glob(f"{n}*"):
                shutil.move(str(f), POSTED / f.name)
                os.utime(POSTED / f.name)  # age counts from the day it was posted

# 2) drafts
print("drafts/")
final = {f.name.split("_")[0].removesuffix(".mp4") for d in (READY, POSTED) for f in d.glob("20*")}
for d in sorted(DRAFTS.glob("*")) if DRAFTS.is_dir() else []:
    if d.name in final:
        delete(d, "already queued/posted")
    elif age_days(d) > a.draft_days:
        delete(d, f"older than {a.draft_days:g} days")
    else:
        print(f"  keep {d} ({age_days(d):.1f} days old)")

# 3) posted
print("posted/")
for f in sorted(POSTED.glob("*")) if POSTED.is_dir() else []:
    if age_days(f) > a.posted_days:
        delete(f, f"older than {a.posted_days:g} days")

# 4) cache
print("cache/")
for f in sorted(CACHE.glob("*")) if CACHE.is_dir() else []:
    if age_days(f) > a.cache_days:
        delete(f, f"older than {a.cache_days:g} days")
    else:
        print(f"  keep {f} ({age_days(f):.1f} days old)")

# 5) generated voice files in the Remotion public folder
print("public/ (voice files)")
for f in sorted((REPO / "public").glob("20*")):
    if f.suffix in {".wav", ".json"} and age_days(f) > a.audio_days:
        delete(f, f"older than {a.audio_days:g} days")

print(f"\n{'freed' if a.apply else 'would free'} {freed / 1e6:.1f} MB" + ("" if a.apply else "  (dry run: add --apply)"))
