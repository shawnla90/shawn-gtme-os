#!/usr/bin/env python3
"""
X/Twitter scout — scans X for engagement opportunities using Grok x_search.

Uses Grok's native x_search tool for intelligent discovery of conversations
where Shawn can add genuine value. Finds tweets/threads to reply to, not
just content ideas.

Usage:
    python3 scripts/x_scout.py              # scan all topic areas
    python3 scripts/x_scout.py --test       # scan 1 topic, print results
    python3 scripts/x_scout.py --praw-only  # (not applicable, Grok-only)
"""

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

REPO_ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = REPO_ROOT / "data" / "x" / "config.json"
QUEUE_PATH = REPO_ROOT / "data" / "x" / "queue.json"
LOCK_PATH = REPO_ROOT / "data" / "x" / "_scout.lock"

# Grok API settings
XAI_BASE_URL = "https://api.x.ai/v1"
XAI_MODEL = "grok-4-1-fast-non-reasoning"

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

# ── Config / Queue I/O ──────────────────────────────────────────────────

def load_config():
    with open(CONFIG_PATH) as f:
        return json.load(f)

def load_queue():
    if QUEUE_PATH.exists():
        with open(QUEUE_PATH) as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    return []

def save_queue(queue):
    QUEUE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(QUEUE_PATH, "w") as f:
        json.dump(queue, f, indent=2)

# ── Grok API ─────────────────────────────────────────────────────────────

def grok_chat(api_key, messages, tools=None):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload = {
        "model": XAI_MODEL,
        "messages": messages,
        "stream": False,
        "temperature": 0.3,
    }
    if tools:
        payload["tools"] = tools

    resp = requests.post(
        f"{XAI_BASE_URL}/chat/completions",
        headers=headers,
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()


def grok_tool_loop(api_key, messages, tools, max_rounds=5):
    """Call Grok with tools, follow tool-call loop until content is returned."""
    for round_num in range(max_rounds):
        result = grok_chat(api_key, messages, tools)
        msg = result["choices"][0]["message"]

        content = msg.get("content") or ""
        if content.strip():
            return content

        tool_calls = msg.get("tool_calls")
        if not tool_calls:
            return content

        messages.append(msg)

        nudge = (
            "You have enough data. Stop searching and return the JSON now."
            if round_num >= 2
            else "Search executed successfully. Summarize the findings as JSON."
        )

        for tc in tool_calls:
            messages.append({
                "role": "tool",
                "tool_call_id": tc["id"],
                "content": nudge,
            })

    return ""

# ── URL validation via Grok ──────────────────────────────────────────────

def build_search_url(item):
    """Build an X search URL that will find the conversation.

    Since Grok fabricates tweet URLs, we generate a search link instead.
    The user clicks this to find the actual thread on X.
    """
    # Build a search query from the most specific terms
    author = item.get("author_handle", "").lstrip("@")
    tags = item.get("relevance_tags", [])
    text = item.get("tweet_text", "")

    # Use author + first two keywords for a targeted search
    parts = []
    if author:
        parts.append(f"from:{author}")
    for tag in tags[:2]:
        parts.append(tag)

    if not parts:
        # Fall back to first few meaningful words from tweet text
        words = [w for w in text.split()[:5] if len(w) > 3]
        parts = words[:3]

    query = " ".join(parts)
    encoded = requests.utils.quote(query)
    return f"https://x.com/search?q={encoded}&f=live"

# ── Grok-powered X discovery ────────────────────────────────────────────

def grok_scout_topic(api_key, topic, config, existing_ids):
    """Use Grok x_search to find relevant X conversations for a topic area."""
    keywords_str = ", ".join(topic["keywords"])

    messages = [
        {
            "role": "system",
            "content": """You are an X/Twitter research agent for Shawn Tenam - a GTM engineer who builds AI-native infrastructure, ships from a monorepo, and went from plumber to SDR to AI builder. He runs 50+ AI skills, 17 MCP servers, nightly cron automation, and 4 live websites.

Find tweets and threads where Shawn could add genuine value by replying - sharing his builder experience, technical insights, or career perspective. Focus on:
- Tweets asking questions or seeking advice (not announcements)
- Threads with active discussion where a practitioner's reply would be welcomed
- Posts from builders sharing challenges Shawn has solved
- Conversations about tools/workflows Shawn uses daily

Avoid:
- Viral dunks or drama threads
- Corporate announcements with no discussion value
- Threads already dominated by promotional replies
- Posts from massive accounts where replies get buried

Return ONLY a JSON array (no other text). Each item:
{
  "tweet_id": "numeric tweet ID from URL",
  "author_handle": "@username",
  "tweet_text": "first 200 chars of the tweet",
  "tweet_url": "full URL like https://x.com/username/status/1234567890",
  "relevance_score": 50-100 (how well Shawn's experience maps to this conversation),
  "relevance_tags": ["tag1", "tag2"],
  "relevance_reason": "1-2 sentences on why Shawn should reply and what angle to take",
  "engagement": {"likes": 0, "replies": 0, "retweets": 0}
}

Only include tweets from the last 48 hours with real engagement (5+ likes or 3+ replies). Return 3-8 tweets max.""",
        },
        {
            "role": "user",
            "content": f"Search X for recent tweets about: {keywords_str}. Topic area: {topic['name']}. Find conversations where a builder/practitioner could add value with a reply.",
        },
    ]

    tools = [
        {
            "type": "function",
            "function": {
                "name": "x_search",
                "description": "Search X/Twitter posts",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "from_date": {"type": "string"},
                        "to_date": {"type": "string"},
                    },
                },
            },
        }
    ]

    raw = grok_tool_loop(api_key, messages, tools)

    # Parse JSON from response
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()

    try:
        items = json.loads(raw)
    except json.JSONDecodeError:
        print(f"  WARN: Could not parse Grok response for topic '{topic['name']}'")
        return []

    if not isinstance(items, list):
        return []

    # Convert to queue format, skipping already-queued and dead-link items
    opportunities = []
    for item in items:
        tweet_id = str(item.get("tweet_id", ""))
        if not tweet_id or tweet_id in existing_ids:
            continue

        tweet_url = item.get("tweet_url", "")

        opportunities.append({
            "id": tweet_id,
            "type": "reply",
            "status": "scouted",
            "topic": topic["name"],
            "tweet_id": tweet_id,
            "author_handle": item.get("author_handle", ""),
            "tweet_text": item.get("tweet_text", ""),
            "tweet_url": tweet_url,
            "engagement": item.get("engagement", {}),
            "relevance_score": item.get("relevance_score", 50),
            "relevance_tags": item.get("relevance_tags", []),
            "relevance_reason": item.get("relevance_reason", ""),
            "scouted_by": "grok",
            "draft_text": None,
            "approved_text": None,
            "rejected_reason": None,
            "posted_tweet_id": None,
            "scouted_at": datetime.now(timezone.utc).isoformat(),
            "drafted_at": None,
            "approved_at": None,
            "posted_at": None,
        })

    # Replace fabricated URLs with X search links
    for opp in opportunities:
        opp["search_url"] = build_search_url(opp)
        opp["tweet_url_unverified"] = opp.get("tweet_url", "")
        opp["tweet_url"] = opp["search_url"]

    return opportunities

# ── Main ─────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Scout X for engagement opportunities")
    parser.add_argument("--test", action="store_true", help="Scan only 1 topic, print results")
    args = parser.parse_args()

    # Load .env if present
    env_path = REPO_ROOT / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

    xai_api_key = os.environ.get("XAI_API_KEY", "")
    if not xai_api_key:
        print("ERROR: XAI_API_KEY not set. Required for X scouting (Grok x_search).")
        sys.exit(1)

    acquire_lock()
    try:
        config = load_config()
        queue = load_queue()
        existing_ids = {item["id"] for item in queue}

        # Build topic list
        topics = config["topics"]
        if args.test:
            topics = topics[:1]

        print(f"[x_scout] {'TEST - ' if args.test else ''}Scanning {len(topics)} topic(s)")
        total_new = 0

        for topic in topics:
            print(f"  {topic['name']}...", end=" ", flush=True)

            new_items = grok_scout_topic(xai_api_key, topic, config, existing_ids)
            time.sleep(2)  # rate limit Grok calls

            if new_items:
                queue.extend(new_items)
                for item in new_items:
                    existing_ids.add(item["id"])
                total_new += len(new_items)
                print(f"{len(new_items)} found")
            else:
                print("0 found")

        # Sort queue: scouted items by relevance score (highest first)
        queue.sort(key=lambda x: (
            0 if x["status"] == "scouted" else 1,
            -x.get("relevance_score", 0),
        ))

        save_queue(queue)
        print(f"\nDone. {total_new} new opportunities added ({len(queue)} total in queue)")

        if args.test and total_new > 0:
            print("\n-- Scouted Items --")
            for item in queue:
                if item["status"] == "scouted":
                    score_str = f"[{item['relevance_score']}]"
                    print(f"  {score_str} {item['author_handle']}: {item['tweet_text'][:100]}")
                    print(f"       {item['tweet_url']}")
                    if item.get("relevance_reason"):
                        print(f"       {item['relevance_reason']}")
                    print()

    finally:
        release_lock()

if __name__ == "__main__":
    main()
