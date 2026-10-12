#!/usr/bin/env python3
"""Add a finished reel to the Instagram posting queue (a DRAFT release on this repo).

  python scripts/queue_reel.py out/2026-10-13-001      # base path, without extension

Uploads <base>.mp4, <base>_caption.txt and <base>_thumbnail.png (if present) to a draft
release `reel-<name>`. Drafts are not public. The daily workflow posts the oldest one.
Remove a reel from the queue with: gh release delete reel-<name> --cleanup-tag --yes
"""
import subprocess
import sys
from pathlib import Path

base = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else sys.exit(__doc__)
name = base.name
files = [base.with_suffix(".mp4"), Path(f"{base}_caption.txt"), Path(f"{base}_thumbnail.png")]
for f in files[:2]:
    if not f.is_file():
        sys.exit(f"missing: {f}")
files = [f for f in files if f.is_file()]
tag = f"reel-{name}"
p = subprocess.run(["gh", "release", "create", tag, *map(str, files), "--draft",
                    "--title", f"queued {name}", "--notes", "Queued for Instagram (draft = not public)."],
                   capture_output=True, text=True, encoding="utf-8")
if p.returncode != 0:
    sys.exit(p.stderr.strip()[:400])
print(f"queued {tag}: " + ", ".join(f.name for f in files))
