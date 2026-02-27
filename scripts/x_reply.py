#!/usr/bin/env python3
"""
X reply poster — posts approved replies from the queue via tweepy.

Reads queue.json, filters for status: "approved", posts replies,
updates queue status to "posted", and appends to history.json.

Usage:
    python3 scripts/x_reply.py          # post all approved items
    python3 scripts/x_reply.py --test   # dry run, print what would post
    python3 scripts/x_reply.py --limit 3  # post at most 3 items
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
QUEUE_PATH = REPO_ROOT / "data" / "x" / "queue.json"
HISTORY_PATH = REPO_ROOT / "data" / "x" / "history.json"
LOCK_PATH = REPO_ROOT / "data" / "x" / "_post.lock"

# ── Lock file ────────────────────────────────────────────────────────────

def acquire_lock():
    if LOCK_PATH.exists():
        pid = LOCK_PATH.read_text().strip()
        print(f"ERROR: Lock file exists (PID {pid}). Remove {LOCK_PATH} if stale.")
        sys.exit(1)
    LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
    LOCK_PATH.write_text(str(os.getpid()))

def release_lock():
    if LOCK_PATH.exists():
        LOCK_PATH.unlink()

# ── File I/O ─────────────────────────────────────────────────────────────

def load_json(path):
    if path.exists():
        with open(path) as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    return []

def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

# ── Tweepy setup ─────────────────────────────────────────────────────────

def get_x_client():
    try:
        import tweepy
    except ImportError:
        print("ERROR: tweepy not installed. Run: pip3 install tweepy")
        sys.exit(1)

    bearer = os.environ.get("X_BEARER_TOKEN")
    api_key = os.environ.get("X_API_KEY")
    api_secret = os.environ.get("X_API_SECRET")
    access_token = os.environ.get("X_ACCESS_TOKEN")
    access_secret = os.environ.get("X_ACCESS_SECRET")

    if not all([api_key, api_secret, access_token, access_secret]):
        print("ERROR: Missing X API credentials in environment.")
        print("Required: X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET")
        sys.exit(1)

    return tweepy.Client(
        bearer_token=bearer,
        consumer_key=api_key,
        consumer_secret=api_secret,
        access_token=access_token,
        access_token_secret=access_secret,
    )

# ── Rate limit check ────────────────────────────────────────────────────

def check_daily_limits(history):
    """Check if we've hit daily reply limits."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    today_items = [h for h in history if h.get("posted_at", "").startswith(today)]
    replies_today = len(today_items)

    # Conservative: max 10 replies per day to avoid looking spammy
    return {
        "replies_remaining": 10 - replies_today,
        "delay_seconds": 120,  # 2 min between replies
    }

# ── Post a single item ──────────────────────────────────────────────────

def post_item(client, item, test_mode=False):
    """Post a single approved reply to X. Returns reply tweet ID or None."""
    text = item.get("approved_text") or item.get("draft_text")
    if not text:
        print(f"  SKIP {item['id']}: no approved or draft text")
        return None

    if len(text) > 280:
        print(f"  WARN: Reply is {len(text)} chars, truncating to 280")
        text = text[:277] + "..."

    if test_mode:
        print(f"  [DRY RUN] Would reply to {item['author_handle']}:")
        print(f"    Tweet: {item['tweet_text'][:100]}")
        print(f"    Reply: {text}")
        return "test_id"

    try:
        response = client.create_tweet(
            text=text,
            in_reply_to_tweet_id=item["tweet_id"],
        )
        reply_id = response.data["id"]
        print(f"  Posted reply to {item['author_handle']}: {reply_id}")
        return reply_id
    except Exception as e:
        print(f"  ERROR replying to {item['id']}: {e}")
        return None

# ── Main ─────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Post approved X replies from queue")
    parser.add_argument("--test", action="store_true", help="Dry run, print what would post")
    parser.add_argument("--limit", type=int, default=0, help="Max items to post (0 = all approved)")
    args = parser.parse_args()

    # Load .env if present
    env_path = REPO_ROOT / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

    acquire_lock()
    try:
        queue = load_json(QUEUE_PATH)
        history = load_json(HISTORY_PATH)

        # Filter approved items
        approved = [item for item in queue if item.get("status") == "approved"]
        if not approved:
            print("No approved items in queue. Run /x-engage to draft and approve replies first.")
            return

        # Check daily limits
        limits = check_daily_limits(history)
        print(f"Daily limits: {limits['replies_remaining']} replies remaining")

        if not args.test:
            client = get_x_client()
        else:
            client = None
            print("[TEST MODE] Dry run, nothing will be posted\n")

        # Apply limit
        if args.limit > 0:
            approved = approved[:args.limit]

        posted_count = 0
        for i, item in enumerate(approved):
            if limits["replies_remaining"] <= 0:
                print(f"  SKIP {item['id']}: daily reply limit reached")
                continue

            # Rate limit delay (skip for first item and test mode)
            if i > 0 and not args.test:
                delay = limits["delay_seconds"]
                print(f"  Waiting {delay}s (rate limit)...")
                time.sleep(delay)

            result_id = post_item(client, item, test_mode=args.test)
            if result_id:
                now = datetime.now(timezone.utc).isoformat()
                item["status"] = "posted"
                item["posted_tweet_id"] = result_id
                item["posted_at"] = now

                history.append(dict(item))
                limits["replies_remaining"] -= 1
                posted_count += 1

        # Save updated queue and history
        if not args.test:
            save_json(QUEUE_PATH, queue)
            save_json(HISTORY_PATH, history)

        print(f"\nDone. {posted_count} items {'would be ' if args.test else ''}posted.")

    finally:
        release_lock()

if __name__ == "__main__":
    main()
