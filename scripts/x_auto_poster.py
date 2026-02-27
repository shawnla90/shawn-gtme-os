#!/usr/bin/env python3
"""
X/Twitter Auto-Posting Pipeline
================================
Scans content/x/final/ for ready-to-post content,
tracks what's been posted, and queues the next post.

Setup:
  1. Get X API v2 credentials: https://developer.x.com/
  2. Set env vars: X_BEARER_TOKEN, X_API_KEY, X_API_SECRET,
     X_ACCESS_TOKEN, X_ACCESS_SECRET
  3. Run: python3 scripts/x_auto_poster.py
  4. Or schedule via OpenClaw cron at desired posting time

The script is designed to post ONE item per run (not bulk).
Schedule it at your desired frequency (e.g., 2x daily at 9AM and 2PM ET).
"""

import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = REPO_ROOT / "content" / "x" / "final"
DRAFTS_DIR = REPO_ROOT / "content" / "x" / "drafts"
STATE_FILE = REPO_ROOT / "data" / "x-posting-state.json"

# ── State Management ────────────────────────────────────────────────────

def load_state() -> dict:
    """Load posting state (which files have been posted)."""
    if STATE_FILE.exists():
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"posted": [], "queue": [], "last_posted_at": None}


def save_state(state: dict):
    """Save posting state."""
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


# ── Content Parsing ─────────────────────────────────────────────────────

def parse_x_post(filepath: Path) -> dict | None:
    """Parse an X post file into structured data.

    Supports two formats:
    - .txt files: plain text, one tweet per file
    - .md files: frontmatter + thread separated by ---
    """
    try:
        content = filepath.read_text(encoding="utf-8").strip()
    except Exception as e:
        print(f"[X] Error reading {filepath}: {e}")
        return None

    filename = filepath.name

    if filepath.suffix == ".md":
        return parse_md_post(content, filename)
    else:
        return parse_txt_post(content, filename)


def parse_md_post(content: str, filename: str) -> dict:
    """Parse a markdown X post with optional frontmatter."""
    # Strip frontmatter
    body = content
    metadata = {}
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            fm_text = parts[1].strip()
            body = parts[2].strip()
            # Simple key: value parsing
            for line in fm_text.split("\n"):
                if ":" in line:
                    key, val = line.split(":", 1)
                    metadata[key.strip()] = val.strip()

    # Split into tweets by ---
    tweets = []
    sections = re.split(r"\n---\n", body)
    for section in sections:
        section = section.strip()
        if not section:
            continue
        # Skip sections that are purely metadata (## reply, ## image notes, etc.)
        if section.startswith("## "):
            # Extract the actual content after the header
            lines = section.split("\n", 1)
            if len(lines) > 1:
                tweet_text = lines[1].strip()
                if tweet_text and not tweet_text.startswith("##"):
                    tweets.append(tweet_text)
        else:
            tweets.append(section)

    if not tweets:
        return None

    return {
        "filename": filename,
        "tweets": tweets,
        "is_thread": len(tweets) > 1,
        "metadata": metadata,
    }


def parse_txt_post(content: str, filename: str) -> dict:
    """Parse a plain text X post.

    Supports === TWEET N === delimited threads.
    """
    # Check for === TWEET N === format
    tweet_sections = re.split(r"===\s*TWEET\s*\d+[^=]*===", content)
    tweets = []
    for section in tweet_sections:
        text = section.strip()
        if text:
            tweets.append(text)

    if not tweets:
        tweets = [content]

    return {
        "filename": filename,
        "tweets": tweets,
        "is_thread": len(tweets) > 1,
        "metadata": {},
    }


# ── X API Integration ──────────────────────────────────────────────────

def get_x_credentials() -> dict | None:
    """Check for X API credentials in environment."""
    required = ["X_BEARER_TOKEN", "X_API_KEY", "X_API_SECRET",
                "X_ACCESS_TOKEN", "X_ACCESS_SECRET"]
    creds = {}
    for key in required:
        val = os.environ.get(key)
        if val:
            creds[key] = val

    if len(creds) < 3:
        return None
    return creds


def post_to_x(tweets: list[str], dry_run: bool = True) -> dict:
    """Post a tweet or thread to X.

    Args:
        tweets: List of tweet texts. Single item = tweet, multiple = thread.
        dry_run: If True, just print what would be posted.

    Returns:
        dict with status and tweet IDs.
    """
    if dry_run:
        print(f"[X] DRY RUN — would post {len(tweets)} tweet(s):")
        for i, tweet in enumerate(tweets):
            print(f"  [{i+1}] {tweet[:100]}{'...' if len(tweet) > 100 else ''}")
            if len(tweet) > 280:
                print(f"      WARNING: {len(tweet)} chars (over 280 limit)")
        return {"status": "dry_run", "tweet_ids": []}

    creds = get_x_credentials()
    if not creds:
        print("[X] ERROR: No X API credentials found.")
        print("[X] Set env vars: X_BEARER_TOKEN, X_API_KEY, X_API_SECRET,")
        print("[X]               X_ACCESS_TOKEN, X_ACCESS_SECRET")
        return {"status": "no_credentials", "tweet_ids": []}

    try:
        import tweepy
    except ImportError:
        print("[X] ERROR: tweepy not installed. Run: pip install tweepy")
        return {"status": "missing_dependency", "tweet_ids": []}

    # Authenticate
    client = tweepy.Client(
        bearer_token=creds.get("X_BEARER_TOKEN"),
        consumer_key=creds.get("X_API_KEY"),
        consumer_secret=creds.get("X_API_SECRET"),
        access_token=creds.get("X_ACCESS_TOKEN"),
        access_token_secret=creds.get("X_ACCESS_SECRET"),
    )

    tweet_ids = []
    reply_to = None

    for i, tweet_text in enumerate(tweets):
        if len(tweet_text) > 280:
            print(f"[X] WARNING: Tweet {i+1} is {len(tweet_text)} chars, truncating to 280")
            tweet_text = tweet_text[:277] + "..."

        try:
            if reply_to:
                response = client.create_tweet(text=tweet_text, in_reply_to_tweet_id=reply_to)
            else:
                response = client.create_tweet(text=tweet_text)

            tweet_id = response.data["id"]
            tweet_ids.append(tweet_id)
            reply_to = tweet_id
            print(f"[X] Posted tweet {i+1}/{len(tweets)}: {tweet_id}")
        except Exception as e:
            print(f"[X] ERROR posting tweet {i+1}: {e}")
            return {"status": "error", "tweet_ids": tweet_ids, "error": str(e)}

    return {"status": "posted", "tweet_ids": tweet_ids}


# ── Queue Management ────────────────────────────────────────────────────

def scan_content() -> list[dict]:
    """Scan content/x/final/ for postable content."""
    posts = []
    for filepath in sorted(CONTENT_DIR.glob("*")):
        if filepath.suffix in (".txt", ".md"):
            parsed = parse_x_post(filepath)
            if parsed:
                posts.append(parsed)
    return posts


def get_next_post(state: dict) -> dict | None:
    """Get the next unposted content item."""
    posted_files = set(state.get("posted", []))
    posts = scan_content()

    for post in posts:
        if post["filename"] not in posted_files:
            return post

    print("[X] No new posts to publish. All content/x/final/ files have been posted.")
    return None


# ── Main ────────────────────────────────────────────────────────────────

def main():
    dry_run = "--dry-run" in sys.argv or "--live" not in sys.argv
    scan_only = "--scan" in sys.argv

    state = load_state()
    posted_count = len(state.get("posted", []))

    if scan_only:
        posts = scan_content()
        posted_files = set(state.get("posted", []))
        print(f"[X] Content scan:")
        print(f"  Total files in final/: {len(posts)}")
        print(f"  Already posted: {posted_count}")
        print(f"  Queued (unposted): {len(posts) - posted_count}")
        print()
        for post in posts:
            status = "POSTED" if post["filename"] in posted_files else "QUEUED"
            thread = f" (thread: {len(post['tweets'])} tweets)" if post["is_thread"] else ""
            print(f"  [{status}] {post['filename']}{thread}")
        return

    print(f"[X] Auto-poster running ({'DRY RUN' if dry_run else 'LIVE'})")
    print(f"[X] Previously posted: {posted_count} files")

    next_post = get_next_post(state)
    if not next_post:
        return

    print(f"[X] Next post: {next_post['filename']}")
    result = post_to_x(next_post["tweets"], dry_run=dry_run)

    if result["status"] in ("posted", "dry_run"):
        if not dry_run or result["status"] == "posted":
            state.setdefault("posted", []).append(next_post["filename"])
            state["last_posted_at"] = datetime.now().isoformat()
            state["last_posted_file"] = next_post["filename"]
            save_state(state)
            print(f"[X] State saved. {next_post['filename']} marked as posted.")
        else:
            print(f"[X] Dry run complete. Use --live to actually post.")
            print(f"[X] Required: X API credentials in env vars.")


if __name__ == "__main__":
    main()
