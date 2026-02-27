#!/usr/bin/env python3
"""
Reddit poster — posts approved items from the queue via PRAW.

Reads queue.json, filters for status: "approved", posts comments or
original posts, updates queue status to "posted", and appends to history.json.

Usage:
    python3 scripts/reddit_post.py          # post all approved items
    python3 scripts/reddit_post.py --test   # dry run, print what would post
    python3 scripts/reddit_post.py --limit 3  # post at most 3 items
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = REPO_ROOT / "data" / "reddit" / "config.json"
QUEUE_PATH = REPO_ROOT / "data" / "reddit" / "queue.json"
HISTORY_PATH = REPO_ROOT / "data" / "reddit" / "history.json"
LOCK_PATH = REPO_ROOT / "data" / "reddit" / "_post.lock"

# ── Lock file ────────────────────────────────────────────────────────────

def acquire_lock():
    if LOCK_PATH.exists():
        pid = LOCK_PATH.read_text().strip()
        print(f"ERROR: Lock file exists (PID {pid}). Remove {LOCK_PATH} if stale.")
        sys.exit(1)
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
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def load_config():
    with open(CONFIG_PATH) as f:
        return json.load(f)

# ── PRAW setup ───────────────────────────────────────────────────────────

def get_reddit():
    try:
        import praw
    except ImportError:
        print("ERROR: praw not installed. Run: pip3 install praw")
        sys.exit(1)

    client_id = os.environ.get("REDDIT_CLIENT_ID")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
    username = os.environ.get("REDDIT_USERNAME")
    password = os.environ.get("REDDIT_PASSWORD")

    if not all([client_id, client_secret, username, password]):
        print("ERROR: Missing Reddit credentials in environment.")
        print("Required: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD")
        sys.exit(1)

    return praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        username=username,
        password=password,
        user_agent="ShawnOS Reddit Poster v1.0 (by u/{})".format(username),
    )

# ── Rate limit check ────────────────────────────────────────────────────

def check_daily_limits(history, config):
    """Check if we've hit daily post/comment limits."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    today_items = [h for h in history if h.get("posted_at", "").startswith(today)]

    posts_today = sum(1 for h in today_items if h.get("type") == "post")
    comments_today = sum(1 for h in today_items if h.get("type") == "comment")

    limits = config["rate_limits"]
    return {
        "posts_remaining": limits["max_posts_per_day"] - posts_today,
        "comments_remaining": limits["max_comments_per_day"] - comments_today,
        "delay_seconds": limits["delay_between_posts_seconds"],
    }

# ── Post a single item ──────────────────────────────────────────────────

def post_item(reddit, item, test_mode=False):
    """Post a single approved item to Reddit. Returns comment/post ID or None."""
    text = item.get("approved_text") or item.get("draft_text")
    if not text:
        print(f"  SKIP {item['id']}: no approved or draft text")
        return None

    if test_mode:
        print(f"  [DRY RUN] Would post to r/{item['subreddit']}:")
        print(f"    Type: {item['type']}")
        print(f"    Post: {item['post_title']}")
        print(f"    Text: {text[:200]}{'...' if len(text) > 200 else ''}")
        return "test_id"

    try:
        if item["type"] == "comment":
            submission = reddit.submission(id=item["post_id"])
            comment = submission.reply(text)
            print(f"  Posted comment on r/{item['subreddit']}: {item['post_title']}")
            return comment.id
        elif item["type"] == "post":
            subreddit = reddit.subreddit(item["subreddit"])
            submission = subreddit.submit(
                title=item.get("post_title", ""),
                selftext=text,
            )
            print(f"  Posted to r/{item['subreddit']}: {submission.title}")
            return submission.id
    except Exception as e:
        print(f"  ERROR posting {item['id']}: {e}")
        return None

# ── Main ─────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Post approved Reddit items from queue")
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
        config = load_config()
        queue = load_json(QUEUE_PATH)
        history = load_json(HISTORY_PATH)

        # Filter approved items
        approved = [item for item in queue if item.get("status") == "approved"]
        if not approved:
            print("No approved items in queue. Run /reddit-engage to draft and approve comments first.")
            return

        # Check daily limits
        limits = check_daily_limits(history, config)
        print(f"Daily limits: {limits['posts_remaining']} posts, {limits['comments_remaining']} comments remaining")

        if not args.test:
            reddit = get_reddit()
        else:
            reddit = None
            print("[TEST MODE] Dry run, nothing will be posted\n")

        # Apply limit
        if args.limit > 0:
            approved = approved[:args.limit]

        posted_count = 0
        for i, item in enumerate(approved):
            # Check per-type limits
            if item["type"] == "post" and limits["posts_remaining"] <= 0:
                print(f"  SKIP {item['id']}: daily post limit reached")
                continue
            if item["type"] == "comment" and limits["comments_remaining"] <= 0:
                print(f"  SKIP {item['id']}: daily comment limit reached")
                continue

            # Rate limit delay (skip for first item and test mode)
            if i > 0 and not args.test:
                delay = limits["delay_seconds"]
                print(f"  Waiting {delay}s (rate limit)...")
                time.sleep(delay)

            result_id = post_item(reddit, item, test_mode=args.test)
            if result_id:
                now = datetime.now(timezone.utc).isoformat()
                # Update queue item
                item["status"] = "posted"
                item["posted_comment_id"] = result_id
                item["posted_at"] = now

                # Add to history
                history.append(dict(item))

                # Update limit counters
                if item["type"] == "post":
                    limits["posts_remaining"] -= 1
                else:
                    limits["comments_remaining"] -= 1

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
