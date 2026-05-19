#!/usr/bin/env python3
"""
reddit_self_pull.py — Pull Shawn's own Reddit submissions into a JSON cache.

Fetches https://www.reddit.com/user/<USERNAME>/submitted.json and writes a
JSON cache consumed by the blog timeline at /blog (TimelineItem source =
"reddit"). Idempotent — overwrites cache on every run.

Output: <repo_root>/data/reddit/self-posts.json
  {
    "fetchedAt": "2026-05-19T07:00:00.000Z",
    "username": "shawnla90",
    "items": [
      { "id", "title", "selftext", "permalink", "subreddit",
        "score", "numComments", "createdUtc" }
    ]
  }

Schedule: launchd plist com.shawn.reddit-self-pull every 6h.

Failure mode: writes nothing on network/parse error so the blog timeline
gracefully degrades to blog + substack only.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "data" / "reddit"
OUT_PATH = OUT_DIR / "self-posts.json"
LOG_DIR = Path.home() / "logs"

DEFAULT_USERNAME = "shawntenam"
USER_AGENT = "shawnos-blog-feed/1.0 (by u/shawntenam)"
REQUEST_TIMEOUT = 30
MAX_ITEMS = 50


def log(msg: str) -> None:
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    print(f"[reddit-self-pull {ts}] {msg}", file=sys.stderr)


def fetch_submissions(username: str) -> dict:
    url = f"https://www.reddit.com/user/{username}/submitted.json?limit={MAX_ITEMS}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


def parse_items(payload: dict) -> list[dict]:
    children = (payload or {}).get("data", {}).get("children", []) or []
    items: list[dict] = []
    for c in children:
        d = c.get("data") or {}
        post_id = d.get("id")
        title = (d.get("title") or "").strip()
        permalink = d.get("permalink") or ""
        if not (post_id and title and permalink):
            continue
        items.append({
            "id": post_id,
            "title": title,
            "selftext": d.get("selftext") or "",
            "permalink": permalink,
            "subreddit": d.get("subreddit") or "",
            "score": int(d.get("score") or 0),
            "numComments": int(d.get("num_comments") or 0),
            "createdUtc": int(d.get("created_utc") or 0),
        })
    items.sort(key=lambda i: i["createdUtc"], reverse=True)
    return items[:MAX_ITEMS]


def write_cache(items: list[dict], username: str) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "username": username,
        "items": items,
    }
    tmp = OUT_PATH.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    tmp.replace(OUT_PATH)


def main() -> int:
    username = os.environ.get("REDDIT_USERNAME", DEFAULT_USERNAME).strip() or DEFAULT_USERNAME
    try:
        payload = fetch_submissions(username)
    except urllib.error.HTTPError as e:
        log(f"http error {e.code} for u/{username}: {e}")
        return 2
    except urllib.error.URLError as e:
        log(f"fetch failed for u/{username}: {e}")
        return 2

    items = parse_items(payload)
    write_cache(items, username)
    log(f"wrote {len(items)} items → {OUT_PATH}")
    return 0


if __name__ == "__main__":
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    sys.exit(main())
