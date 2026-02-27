#!/usr/bin/env python3
"""
Reddit scout — scans target subreddits for engagement opportunities.

Two modes:
  1. Grok mode (default when XAI_API_KEY is set): Uses Grok web_search to find
     relevant Reddit threads, then validates with PRAW for metadata. Smarter
     discovery — understands context, not just keywords.
  2. PRAW-only mode (fallback): Scans hot/new posts and keyword-matches.
     Works without Grok but less intelligent.

Usage:
    python3 scripts/reddit_scout.py              # auto-detect mode, scan Tier 1
    python3 scripts/reddit_scout.py --test       # scan 1 sub, print results
    python3 scripts/reddit_scout.py --tier 2     # include Tier 2 subs
    python3 scripts/reddit_scout.py --praw-only  # force PRAW keyword mode
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
CONFIG_PATH = REPO_ROOT / "data" / "reddit" / "config.json"
QUEUE_PATH = REPO_ROOT / "data" / "reddit" / "queue.json"
LOCK_PATH = REPO_ROOT / "data" / "reddit" / "_scout.lock"

# Grok API settings (same pattern as scripts/agents/scout.py)
XAI_BASE_URL = "https://api.x.ai/v1"
XAI_MODEL = "grok-4-1-fast-non-reasoning"

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
    with open(QUEUE_PATH, "w") as f:
        json.dump(queue, f, indent=2)

# ── Grok API (reuses pattern from scripts/agents/scout.py) ──────────────

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

# ── URL validation & search URL fallback ─────────────────────────────────

def validate_reddit_url(url):
    """Check if a Reddit post URL is real using Reddit's public JSON API."""
    if not url or "reddit.com" not in url:
        return False
    try:
        json_url = url.rstrip("/") + ".json"
        resp = requests.get(
            json_url,
            headers={"User-Agent": "ShawnOS Reddit Scout/1.0"},
            timeout=10,
            allow_redirects=True,
        )
        return resp.status_code == 200
    except requests.RequestException:
        return False


def build_reddit_search_url(sub_name, item):
    """Build a Reddit search URL scoped to a subreddit + keywords."""
    tags = item.get("relevance_tags", [])
    title = item.get("post_title", "")

    # Use first few words of title + tags for a targeted search
    query_parts = []
    if title:
        words = [w for w in title.split()[:6] if len(w) > 2]
        query_parts.extend(words[:4])
    for tag in tags[:2]:
        if tag.lower() not in " ".join(query_parts).lower():
            query_parts.append(tag)

    query = " ".join(query_parts)
    encoded = requests.utils.quote(query)
    return f"https://www.reddit.com/r/{sub_name}/search/?q={encoded}&restrict_sr=1&sort=new&t=week"


def validate_and_fix_urls(sub_name, opportunities):
    """Validate Reddit URLs. Replace bad ones with search links."""
    for opp in opportunities:
        url = opp.get("post_url", "")
        if url and validate_reddit_url(url):
            # URL is real - extract actual metadata from JSON API
            try:
                resp = requests.get(
                    url.rstrip("/") + ".json",
                    headers={"User-Agent": "ShawnOS Reddit Scout/1.0"},
                    timeout=10,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    if isinstance(data, list) and data:
                        post = data[0]["data"]["children"][0]["data"]
                        opp["post_score"] = post.get("score")
                        opp["post_comments"] = post.get("num_comments")
                        opp["post_title"] = post.get("title", opp["post_title"])
                        opp["post_id"] = post.get("id", opp["post_id"])
                        opp["id"] = post.get("id", opp["id"])
            except Exception:
                pass
        else:
            # URL is fake - replace with search link
            search_url = build_reddit_search_url(sub_name, opp)
            opp["post_url_unverified"] = url
            opp["post_url"] = search_url
            opp["url_verified"] = False
            print(f"    replaced (fake URL): {url[:60]}...")

    return opportunities

# ── Grok-powered Reddit discovery ───────────────────────────────────────

def grok_scout_subreddit(api_key, sub_name, config, existing_ids):
    """Use Grok web_search to find relevant Reddit threads in a subreddit."""
    keywords_str = ", ".join(config["keywords"])

    messages = [
        {
            "role": "system",
            "content": """You are a Reddit research agent for Shawn Tenam -- a GTM engineer who builds AI-native infrastructure, ships from a monorepo, and went from plumber to SDR to AI builder. He runs 50+ AI skills, 17 MCP servers, nightly cron automation, and 4 live websites.

Find Reddit posts where Shawn could add genuine value by commenting -- sharing his builder experience, technical insights, or career perspective. Focus on threads with active discussion where a practitioner's perspective would be welcomed.

Return ONLY a JSON array (no other text). Each item:
{
  "post_id": "reddit post ID from URL (the alphanumeric part after /comments/)",
  "post_title": "exact post title",
  "post_url": "full reddit URL",
  "relevance_score": 50-100 (how well Shawn's experience maps to this thread),
  "relevance_tags": ["tag1", "tag2"],
  "relevance_reason": "1-2 sentences on why Shawn should engage and what angle to take"
}

Only include posts from the last 48 hours with real engagement (5+ upvotes or 3+ comments). Return 3-8 posts max.""",
        },
        {
            "role": "user",
            "content": f"Search r/{sub_name} for recent posts related to any of these topics: {keywords_str}. Find threads where a builder/practitioner could add value with a comment.",
        },
    ]

    tools = [
        {
            "type": "function",
            "function": {
                "name": "web_search",
                "description": "Search the web",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
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
        print(f"  WARN: Could not parse Grok response for r/{sub_name}")
        return []

    if not isinstance(items, list):
        return []

    # Convert to queue format, skipping already-queued items
    opportunities = []
    for item in items:
        post_id = item.get("post_id", "")
        if not post_id or post_id in existing_ids:
            continue

        opportunities.append({
            "id": post_id,
            "type": "comment",
            "status": "scouted",
            "subreddit": sub_name,
            "post_id": post_id,
            "post_title": item.get("post_title", ""),
            "post_url": item.get("post_url", ""),
            "post_score": None,  # filled by PRAW enrichment if available
            "post_comments": None,
            "relevance_score": item.get("relevance_score", 50),
            "relevance_tags": item.get("relevance_tags", []),
            "relevance_reason": item.get("relevance_reason", ""),
            "scouted_by": "grok",
            "draft_text": None,
            "approved_text": None,
            "rejected_reason": None,
            "posted_comment_id": None,
            "scouted_at": datetime.now(timezone.utc).isoformat(),
            "drafted_at": None,
            "approved_at": None,
            "posted_at": None,
        })

    # Validate URLs and replace fakes with search links
    if opportunities:
        opportunities = validate_and_fix_urls(sub_name, opportunities)

    return opportunities


def enrich_with_praw(reddit, opportunities):
    """Use PRAW to fill in post_score and post_comments for Grok-scouted items."""
    if not reddit:
        return opportunities

    for item in opportunities:
        try:
            submission = reddit.submission(id=item["post_id"])
            item["post_score"] = submission.score
            item["post_comments"] = submission.num_comments
            item["post_url"] = f"https://reddit.com{submission.permalink}"
            item["post_title"] = submission.title
        except Exception:
            pass  # keep Grok's data as-is

    return opportunities

# ── PRAW keyword-matching fallback ───────────────────────────────────────

def get_reddit_client():
    try:
        import praw
    except ImportError:
        return None

    client_id = os.environ.get("REDDIT_CLIENT_ID")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
    username = os.environ.get("REDDIT_USERNAME")
    password = os.environ.get("REDDIT_PASSWORD")

    if not all([client_id, client_secret, username, password]):
        return None

    return praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        username=username,
        password=password,
        user_agent="ShawnOS Reddit Scout v1.0 (by u/{})".format(username),
    )


def score_post_keywords(post, keywords):
    """Score a post's relevance based on keyword matches and engagement."""
    title_lower = post.title.lower()
    body_lower = (post.selftext or "").lower()
    text = f"{title_lower} {body_lower}"

    matched_keywords = []
    for kw in keywords:
        if kw.lower() in text:
            matched_keywords.append(kw)

    if not matched_keywords:
        return 0, [], ""

    score = len(matched_keywords) * 20
    engagement = min(post.score + post.num_comments, 200)
    score += int(engagement / 5)

    reason = f"Matches: {', '.join(matched_keywords)}. "
    reason += f"Post score: {post.score}, comments: {post.num_comments}"

    return score, matched_keywords, reason


def praw_scout_subreddit(reddit, sub_name, config, existing_ids):
    """PRAW-only fallback: scan a subreddit with keyword matching."""
    scout_cfg = config["scout"]
    keywords = config["keywords"]
    max_age_seconds = scout_cfg["max_age_hours"] * 3600
    now = time.time()

    opportunities = []
    subreddit = reddit.subreddit(sub_name)

    try:
        if scout_cfg["sort"] == "hot":
            posts = subreddit.hot(limit=scout_cfg["max_posts_per_sub"])
        else:
            posts = subreddit.new(limit=scout_cfg["max_posts_per_sub"])
    except Exception as e:
        print(f"  WARN: Could not fetch r/{sub_name}: {e}")
        return []

    for post in posts:
        if now - post.created_utc > max_age_seconds:
            continue
        if post.score < scout_cfg["min_score"]:
            continue
        if post.id in existing_ids:
            continue

        relevance_score, tags, reason = score_post_keywords(post, keywords)
        if relevance_score == 0:
            continue

        opportunities.append({
            "id": post.id,
            "type": "comment",
            "status": "scouted",
            "subreddit": sub_name,
            "post_id": post.id,
            "post_title": post.title,
            "post_url": f"https://reddit.com{post.permalink}",
            "post_score": post.score,
            "post_comments": post.num_comments,
            "relevance_score": relevance_score,
            "relevance_tags": tags,
            "relevance_reason": reason,
            "scouted_by": "praw",
            "draft_text": None,
            "approved_text": None,
            "rejected_reason": None,
            "posted_comment_id": None,
            "scouted_at": datetime.now(timezone.utc).isoformat(),
            "drafted_at": None,
            "approved_at": None,
            "posted_at": None,
        })

    return opportunities

# ── Main ─────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Scout Reddit for engagement opportunities")
    parser.add_argument("--test", action="store_true", help="Scan only 1 subreddit, print results")
    parser.add_argument("--tier", type=int, default=1, choices=[1, 2], help="Include up to this tier (default: 1)")
    parser.add_argument("--praw-only", action="store_true", help="Force PRAW keyword mode (skip Grok)")
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
    use_grok = bool(xai_api_key) and not args.praw_only

    acquire_lock()
    try:
        config = load_config()
        queue = load_queue()
        existing_ids = {item["id"] for item in queue}

        # Build subreddit list
        subs = list(config["subreddits"]["tier_1"])
        if args.tier >= 2:
            subs.extend(config["subreddits"]["tier_2"])

        if args.test:
            subs = subs[:1]

        # Try to get PRAW client (optional for Grok mode, required for PRAW-only)
        reddit = get_reddit_client()
        if not use_grok and not reddit:
            print("ERROR: No scouting backend available.")
            print("  Set XAI_API_KEY for Grok mode, or REDDIT_* creds for PRAW mode.")
            sys.exit(1)

        mode = "grok" if use_grok else "praw"
        print(f"[{mode} mode] {'TEST — ' if args.test else ''}Scanning {len(subs)} subreddit(s)")
        total_new = 0

        for sub_name in subs:
            print(f"  r/{sub_name}...", end=" ", flush=True)

            if use_grok:
                new_items = grok_scout_subreddit(xai_api_key, sub_name, config, existing_ids)
                # Enrich with PRAW metadata if available
                if reddit and new_items:
                    new_items = enrich_with_praw(reddit, new_items)
                time.sleep(2)  # rate limit Grok calls
            else:
                new_items = praw_scout_subreddit(reddit, sub_name, config, existing_ids)

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
            print("\n── Scouted Items ──")
            for item in queue:
                if item["status"] == "scouted":
                    score_str = f"[{item['relevance_score']}]"
                    by_str = f"({item.get('scouted_by', '?')})"
                    print(f"  {score_str} r/{item['subreddit']}: {item['post_title']} {by_str}")
                    print(f"       {item['post_url']}")
                    if item.get("relevance_reason"):
                        print(f"       {item['relevance_reason']}")
                    print()

    finally:
        release_lock()

if __name__ == "__main__":
    main()
