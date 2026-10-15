#!/usr/bin/env python3
"""Render a reel into media/drafts/<name>/vN.mp4 (a new version every time).

  python scripts/render_reel.py 2026-10-15-001            # new version + thumbnail
  python scripts/render_reel.py 2026-10-15-001 --no-thumb

Re-rendering never overwrites an earlier take; cleanup_media.py removes old takes after
the reel is queued/posted or after a few days. The caption lives next to the takes as
media/drafts/<name>/caption.txt (write it by hand or copy an earlier one).
"""
import argparse
import re
import subprocess
import sys

from media_paths import DRAFTS, REPO

ap = argparse.ArgumentParser()
ap.add_argument("name", help="e.g. 2026-10-15-001")
ap.add_argument("--no-thumb", action="store_true")
ap.add_argument("--thumb-frame", type=int, default=110)
a = ap.parse_args()

d = DRAFTS / a.name
d.mkdir(parents=True, exist_ok=True)
taken = [int(m.group(1)) for f in d.glob("v*.mp4") if (m := re.fullmatch(r"v(\d+)\.mp4", f.name))]
out = d / f"v{max(taken, default=0) + 1}.mp4"

def run(*args):
    r = subprocess.run(["npx", "remotion", *args], cwd=REPO, shell=True)
    if r.returncode != 0:
        sys.exit(f"remotion failed: {' '.join(args)}")

run("render", "src/index.ts", f"Reel-{a.name}", str(out))
print("rendered", out)
if not a.no_thumb:
    run("still", "src/index.ts", f"Thumb-{a.name}", str(d / "thumbnail.png"), f"--frame={a.thumb_frame}")
    print("thumbnail", d / "thumbnail.png")
if not (d / "caption.txt").is_file():
    print(f"note: write the caption to {d / 'caption.txt'} before queueing")
