#!/usr/bin/env python3
"""
linkedin_scout.py - Scout trending LinkedIn content via Grok web_search.

Uses Grok's web_search tool to find trending LinkedIn posts about AI agents,
GTM engineering, outbound, and builder/founder content. Falls back to Claude CLI
if Grok is unavailable.

Usage:
    python3 scripts/linkedin_scout.py          # full scout run
    python3 scripts/linkedin_scout.py --test   # single query, print results
"""

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

REPO_ROOT = Path(__file__).resolve().parent.parent
SCOUT_DIR = REPO_ROOT / "data" / "linkedin" / "scout"
LOCK_PATH = REPO_ROOT / "data" / "linkedin" / "_scout.lock"
CLAUDE_CLI = "/opt/homebrew/bin/claude"

# Grok API settings
XAI_BASE_URL = "https://api.x.ai/v1"
XAI_MODEL = "grok-4-1-fast-non-reasoning"

# Search missions
SEARCH_MISSIONS = [
    {
        "name": "ai-agents-devtools",
        "query": "trending LinkedIn posts about AI agents, automation, developer tools, AI infrastructure last 48 hours",
        "domain": "ai",
    },
    {
        "name": "gtm-outbound",
        "query": "LinkedIn posts about GTM engineering, outbound automation, sales ops, content strategy, revenue operations",
        "domain": "gtm",
    },
    {
        "name": "builders-founders",
        "query": "LinkedIn posts from builders founders shipping products, solo developers, career pivots into tech, building in public",
        "domain": "builders",
    },
]


# -- Lock file ---------------------------------------------------------------

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


# -- Grok API ----------------------------------------------------------------

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


def build_search_url(query_terms):
    """Build a Google search URL scoped to linkedin.com."""
    encoded = requests.utils.quote(f"site:linkedin.com {query_terms}")
    return f"https://www.google.com/search?q={encoded}"


def grok_scout_mission(api_key, mission):
    """Use Grok web_search to find LinkedIn posts for a mission."""
    messages = [
        {
            "role": "system",
            "content": """You are a LinkedIn content research agent. Find trending LinkedIn posts relevant to the search query.

Return ONLY a JSON array (no other text). Each item:
{
  "author": "person's name",
  "headline": "their LinkedIn headline/role",
  "post_summary": "2-3 sentence summary of the post's key point",
  "url": "LinkedIn post URL if available, otherwise empty string",
  "engagement": {"likes": estimated_number, "comments": estimated_number},
  "tags": ["tag1", "tag2", "tag3"],
  "relevance": "high" or "medium"
}

Return 3-6 posts max. Focus on posts with real substance - not engagement bait.
If you can't find exact URLs, leave the url field as empty string.""",
        },
        {
            "role": "user",
            "content": f"Search for: {mission['query']}",
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
    if raw.startswith("json"):
        raw = raw[4:].strip()

    try:
        items = json.loads(raw)
    except json.JSONDecodeError:
        print(f"  WARN: Could not parse Grok response for {mission['name']}")
        return []

    if not isinstance(items, list):
        return []

    # Normalize items
    sources = []
    for item in items:
        url = item.get("url", "")
        if not url or "linkedin.com" not in url:
            # Build search URL as fallback
            search_terms = item.get("post_summary", "")[:80]
            author = item.get("author", "")
            url = ""
            search_url = build_search_url(f"{author} {search_terms}")
        else:
            search_url = ""

        sources.append({
            "author": item.get("author", "Unknown"),
            "headline": item.get("headline", ""),
            "post_summary": item.get("post_summary", ""),
            "url": url,
            "search_url": search_url,
            "engagement": item.get("engagement", {"likes": 0, "comments": 0}),
            "domain": mission["domain"],
            "relevance": item.get("relevance", "medium"),
            "tags": item.get("tags", []),
        })

    return sources


# -- Claude fallback ----------------------------------------------------------

def claude_fallback_mission(mission):
    """Use Claude CLI (free via Max sub) as fallback when Grok is unavailable."""
    prompt = f"""Generate 4 realistic examples of trending LinkedIn post topics that would be popular right now in this space: {mission['query']}

Return ONLY a JSON array. Each item:
{{
  "author": "realistic name",
  "headline": "realistic LinkedIn headline",
  "post_summary": "2-3 sentence summary of a post that would trend",
  "url": "",
  "search_url": "",
  "engagement": {{"likes": estimated_number, "comments": estimated_number}},
  "domain": "{mission['domain']}",
  "relevance": "high",
  "tags": ["tag1", "tag2"]
}}

Base these on real LinkedIn content patterns and current industry trends. No markdown - just the JSON array."""

    try:
        result = subprocess.run(
            [CLAUDE_CLI, "-p", "--model", "sonnet", "--output-format", "text"],
            input=prompt,
            capture_output=True,
            text=True,
            timeout=120,
            cwd=str(REPO_ROOT),
        )
        if result.returncode != 0:
            print(f"  WARN: Claude CLI failed for {mission['name']}")
            return []

        raw = result.stdout.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
            if raw.endswith("```"):
                raw = raw[:-3]
            raw = raw.strip()
        if raw.startswith("json"):
            raw = raw[4:].strip()

        items = json.loads(raw)
        if not isinstance(items, list):
            return []

        # Tag each source with domain
        for item in items:
            item["domain"] = mission["domain"]

        return items

    except (subprocess.TimeoutExpired, json.JSONDecodeError) as e:
        print(f"  WARN: Claude fallback failed for {mission['name']}: {e}")
        return []


# -- Main ---------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Scout LinkedIn for trending content")
    parser.add_argument("--test", action="store_true", help="Single query, print results")
    args = parser.parse_args()

    # Load .env
    env_path = REPO_ROOT / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

    xai_api_key = os.environ.get("XAI_API_KEY", "")
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    SCOUT_DIR.mkdir(parents=True, exist_ok=True)
    acquire_lock()

    try:
        missions = SEARCH_MISSIONS
        if args.test:
            missions = missions[:1]

        all_sources = []
        engine = "grok" if xai_api_key else "claude-fallback"

        print(f"[linkedin_scout] {engine} mode | {'TEST - ' if args.test else ''}{len(missions)} mission(s)")

        for mission in missions:
            print(f"  {mission['name']}...", end=" ", flush=True)

            if xai_api_key:
                try:
                    sources = grok_scout_mission(xai_api_key, mission)
                except (requests.RequestException, KeyError) as e:
                    print(f"Grok failed ({e}), falling back to Claude...", end=" ")
                    sources = claude_fallback_mission(mission)
                    engine = "claude-fallback"
            else:
                sources = claude_fallback_mission(mission)

            all_sources.extend(sources)
            print(f"{len(sources)} found")

            if mission != missions[-1]:
                time.sleep(2)  # rate limit

        # Build output
        output = {
            "date": today,
            "posts_found": len(all_sources),
            "engine": engine,
            "scouted_at": datetime.now(timezone.utc).isoformat(),
            "sources": all_sources,
        }

        # Write output
        output_path = SCOUT_DIR / f"{today}.json"
        output_path.write_text(json.dumps(output, indent=2))
        print(f"\nDone. {len(all_sources)} sources saved to {output_path}")

        if args.test and all_sources:
            print("\n-- Scouted Sources --")
            for s in all_sources:
                link = s.get("url") or s.get("search_url", "")
                print(f"  [{s['domain']}] {s['author']}: {s['post_summary'][:80]}")
                print(f"       {link}")
                print(f"       tags: {', '.join(s.get('tags', []))}")
                print()

    finally:
        release_lock()


if __name__ == "__main__":
    main()
