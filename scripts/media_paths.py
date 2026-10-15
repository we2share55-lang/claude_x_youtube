"""Shared folder layout for the local (not committed) media files.

D:\\Claude\\moneystudy\\
  repo\\            this git project (Remotion app + scripts)
  media\\drafts\\<name>\\v1.mp4 v2.mp4 ...  every render attempt, plus thumbnail.png / caption.txt
  media\\ready\\    final files that are queued for Instagram (name.mp4, name_caption.txt, name_thumbnail.png)
  media\\posted\\   files that already went out
  media\\cache\\    old scratch files that can be deleted at any time
  inbox\\          files the user drops in for Claude to use
  keep\\           originals that must not be auto-deleted
"""
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO.parent
MEDIA = ROOT / "media"
DRAFTS = MEDIA / "drafts"
READY = MEDIA / "ready"
POSTED = MEDIA / "posted"
CACHE = MEDIA / "cache"
INBOX = ROOT / "inbox"
GH_REPO = "we2share55-lang/moneystudy"
