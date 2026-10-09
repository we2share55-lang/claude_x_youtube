#!/usr/bin/env python3
"""Watch a YouTube video using Gemini's video understanding API, with transcript fallback."""

import sys
import os
import re

# Force UTF-8 stdout/stderr so non-ASCII output (e.g. Korean, em-dashes) doesn't
# crash on Windows consoles that default to a legacy codepage like cp949.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass


def extract_video_id(url: str) -> str | None:
    """Extract YouTube video ID from URL."""
    patterns = [
        r'(?:v=|youtu\.be/)([A-Za-z0-9_-]{11})',
        r'(?:embed/)([A-Za-z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def get_transcript_fallback(url: str, prompt: str) -> str:
    """Fallback: fetch transcript via youtube_transcript_api and return it with the prompt."""
    from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, VideoUnavailable

    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError(f"Could not extract video ID from URL: {url}")

    ytt_api = YouTubeTranscriptApi()
    transcript_list = ytt_api.fetch(video_id)

    # Format transcript with timestamps
    lines = []
    for entry in transcript_list:
        start = entry.start
        minutes = int(start // 60)
        seconds = int(start % 60)
        lines.append(f"[{minutes:02d}:{seconds:02d}] {entry.text}")

    transcript_text = "\n".join(lines)

    # Return transcript with instruction to answer the prompt
    result = f"""[TRANSCRIPT FALLBACK — Gemini video API unavailable]

Prompt: {prompt}

--- TRANSCRIPT ---
{transcript_text}
---

Note: The above is the raw transcript. Answer the prompt based on this content.
"""
    return result


def watch(url: str, prompt: str, model: str = "gemini-3.5-flash"):
    """Analyze a YouTube video. Tries Gemini first, falls back to transcript on failure."""
    # Try Gemini first
    try:
        from google import genai
        from google.genai import types

        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise EnvironmentError("GEMINI_API_KEY (or GOOGLE_API_KEY) not set")

        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=model,
            contents=types.Content(
                parts=[
                    types.Part(
                        file_data=types.FileData(file_uri=url)
                    ),
                    types.Part(text=prompt)
                ]
            )
        )
        print(response.text)
        return

    except Exception as gemini_err:
        err_str = str(gemini_err).lower()
        # Detect quota, token limit, or API key issues — fall back to transcript
        is_fallback_error = any(k in err_str for k in [
            "quota", "resource_exhausted", "429",
            "token", "context", "too long", "exceeds",
            "api_key", "google_api_key", "not set",
            "video", "unavailable", "unsupported",
        ])
        if not is_fallback_error:
            # Unexpected error — re-raise so caller sees it
            raise

        print(f"[watch-youtube] Gemini failed ({type(gemini_err).__name__}: {gemini_err}), falling back to transcript...", file=sys.stderr)

    # Fallback: transcript
    try:
        result = get_transcript_fallback(url, prompt)
        print(result)
    except Exception as transcript_err:
        print(f"Error: Both Gemini and transcript fallback failed.\nGemini error logged above.\nTranscript error: {transcript_err}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: watch.py <youtube_url> <prompt> [model]")
        sys.exit(1)

    url = sys.argv[1]
    prompt = sys.argv[2]
    model = sys.argv[3] if len(sys.argv) > 3 else "gemini-3.5-flash"
    watch(url, prompt, model)
