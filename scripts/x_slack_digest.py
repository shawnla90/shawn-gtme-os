#!/usr/bin/env python3
"""
X/Twitter Slack digest — posts top 10 scouted opportunities to Slack.

Runs at 10 AM via launchd. Reads the X queue, picks the top 10
scouted items by relevance score, and posts a formatted digest to the
#x-pipeline channel in Lead Alchemy Slack.

Usage:
    python3 scripts/x_slack_digest.py          # post digest to Slack
    python3 scripts/x_slack_digest.py --test   # print what would be posted
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

REPO_ROOT = Path(__file__).resolve().parent.parent
QUEUE_PATH = REPO_ROOT / "data" / "x" / "queue.json"

# ── Load .env ────────────────────────────────────────────────────────────

def load_env():
    env_path = REPO_ROOT / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

# ── Queue I/O ────────────────────────────────────────────────────────────

def load_queue():
    if QUEUE_PATH.exists():
        with open(QUEUE_PATH) as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    return []

# ── Slack posting ────────────────────────────────────────────────────────

def post_to_slack(channel_id, text, bot_token):
    """Post a message to Slack using the Bot Token API."""
    resp = requests.post(
        "https://slack.com/api/chat.postMessage",
        headers={
            "Authorization": f"Bearer {bot_token}",
            "Content-Type": "application/json",
        },
        json={
            "channel": channel_id,
            "text": text,
            "unfurl_links": False,
            "unfurl_media": False,
        },
        timeout=15,
    )
    data = resp.json()
    if not data.get("ok"):
        print(f"ERROR: Slack API error: {data.get('error', 'unknown')}")
        return False
    return True

# ── Format digest ────────────────────────────────────────────────────────

def format_digest(items):
    """Format top scouted items into a Slack message."""
    today = datetime.now(timezone.utc).strftime("%A, %b %d")
    lines = [f":bird: *X Scout Digest* -- {today}\n"]

    for i, item in enumerate(items, 1):
        score = item.get("relevance_score", "?")
        topic = item.get("topic", "?")
        author = item.get("author_handle", "?")
        text = item.get("tweet_text", "")[:120]
        url = item.get("tweet_url", "")
        reason = item.get("relevance_reason", "")
        engagement = item.get("engagement", {})

        stats = ""
        likes = engagement.get("likes")
        replies = engagement.get("replies")
        retweets = engagement.get("retweets")
        if likes is not None:
            stats = f" | :heart: {likes}"
        if replies is not None:
            stats += f" :speech_balloon: {replies}"
        if retweets is not None:
            stats += f" :repeat: {retweets}"

        lines.append(f"*{i}.* [{score}] {author} ({topic}){stats}")
        lines.append(f"    {text}")
        lines.append(f"    <{url}|:mag: Search on X>")
        if reason:
            lines.append(f"    _{reason}_")
        lines.append("")

    # Queue summary
    queue = load_queue()
    status_counts = {}
    for q in queue:
        s = q.get("status", "unknown")
        status_counts[s] = status_counts.get(s, 0) + 1

    summary_parts = [f"{v} {k}" for k, v in sorted(status_counts.items())]
    lines.append(f"*Queue:* {' | '.join(summary_parts)}")
    lines.append("\n:point_right: Run `/x-engage` in Claude Code to draft replies")

    return "\n".join(lines)

# ── Main ─────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Post X scout digest to Slack")
    parser.add_argument("--test", action="store_true", help="Print digest without posting")
    parser.add_argument("--limit", type=int, default=10, help="Number of items to show (default: 10)")
    args = parser.parse_args()

    load_env()

    bot_token = os.environ.get("SLACK_BOT_TOKEN")
    channel_id = os.environ.get("SLACK_X_CHANNEL_ID")

    if not bot_token and not args.test:
        print("ERROR: SLACK_BOT_TOKEN not set in .env")
        sys.exit(1)

    if not channel_id and not args.test:
        print("ERROR: SLACK_X_CHANNEL_ID not set in .env")
        print("Create a #x-pipeline channel in Lead Alchemy, then add the channel ID to .env")
        sys.exit(1)

    queue = load_queue()

    # Get top N scouted items by relevance score
    scouted = [item for item in queue if item.get("status") == "scouted"]
    scouted.sort(key=lambda x: -x.get("relevance_score", 0))
    top_items = scouted[:args.limit]

    if not top_items:
        msg = "No scouted X opportunities in the queue. Scout may not have run or found matches."
        if args.test:
            print(msg)
        else:
            post_to_slack(channel_id, f":bird: X Scout -- {msg}", bot_token)
        return

    digest = format_digest(top_items)

    if args.test:
        print("-- Would post to Slack --\n")
        print(digest)
        print(f"\n-- {len(top_items)} items, {len(scouted)} total scouted --")
        return

    if post_to_slack(channel_id, digest, bot_token):
        print(f"Posted digest with {len(top_items)} items to Slack")
    else:
        print("Failed to post digest to Slack")
        sys.exit(1)

if __name__ == "__main__":
    main()
