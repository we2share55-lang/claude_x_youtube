#!/usr/bin/env python3
"""Add a finished reel to the Instagram posting queue (a DRAFT release on this repo).

  python scripts/queue_reel.py 2026-10-15-001              # latest take in media/drafts/<name>/
  python scripts/queue_reel.py 2026-10-15-001 --version 2  # a specific take

Copies the chosen take to media/ready/<name>.mp4 (+ _caption.txt, _thumbnail.png) and uploads
those to a draft release `reel-<name>`. Drafts are not public. The 24h workflow posts the
oldest one. Remove a reel from the queue with: gh release delete reel-<name> --cleanup-tag --yes
"""
import argparse
import re
import shutil
import subprocess
import sys

from media_paths import DRAFTS, GH_REPO, READY

ap = argparse.ArgumentParser()
ap.add_argument("name")
ap.add_argument("--version", type=int, help="take number (default: latest)")
a = ap.parse_args()

d = DRAFTS / a.name
takes = {int(m.group(1)): f for f in d.glob("v*.mp4") if (m := re.fullmatch(r"v(\d+)\.mp4", f.name))}
if not takes:
    sys.exit(f"no takes in {d} (run render_reel.py first)")
v = a.version or max(takes)
if v not in takes:
    sys.exit(f"take v{v} not found; have {sorted(takes)}")
caption = d / "caption.txt"
if not caption.is_file():
    sys.exit(f"missing caption: {caption}")

READY.mkdir(parents=True, exist_ok=True)
mp4 = READY / f"{a.name}.mp4"
cap = READY / f"{a.name}_caption.txt"
shutil.copy2(takes[v], mp4)
shutil.copy2(caption, cap)
files = [mp4, cap]
if (d / "thumbnail.png").is_file():
    thumb = READY / f"{a.name}_thumbnail.png"
    shutil.copy2(d / "thumbnail.png", thumb)
    files.append(thumb)

tag = f"reel-{a.name}"
p = subprocess.run(["gh", "release", "create", tag, *map(str, files), "--repo", GH_REPO, "--draft",
                    "--title", f"queued {a.name}", "--notes", "Queued for Instagram (draft = not public)."],
                   capture_output=True, text=True, encoding="utf-8")
if p.returncode != 0:
    sys.exit(p.stderr.strip()[:400])
print(f"queued {tag} (take v{v}): " + ", ".join(f.name for f in files))
