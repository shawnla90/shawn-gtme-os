#!/usr/bin/env python3
"""
Scout — Content Research Agent (Grok-powered)
Uses xAI Grok API with x_search + web_search tools for real-time
social media and web research. Outputs a daily content briefing.

Usage:
  python3 scripts/agents/scout.py           # full run
  python3 scripts/agents/scout.py --test    # dry run, fewer queries, prints to stdout
"""

import argparse
import json
import os
import pathlib
import time
from datetime import datetime, timezone

import requests

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
LOG_DIR = REPO_ROOT / "data" / "agent-logs" / "scout"

# Load from .env if not in environment
ENV_FILE = REPO_ROOT / ".env"
if ENV_FILE.exists():
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, val = line.split("=", 1)
            os.environ.setdefault(key.strip(), val.strip())

XAI_API_KEY = os.environ.get("XAI_API_KEY", "")
XAI_BASE_URL = "https://api.x.ai/v1"
MODEL = "grok-4-1-fast-non-reasoning"

# Fallback: Claude Opus 4.6
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
ANTHROPIC_BASE_URL = "https://api.anthropic.com/v1"
FALLBACK_MODEL = "claude-opus-4-6"

# ── Research missions ─────────────────────────────────────────────

X_SEARCHES = [
    {
        "prompt": "Search X/Twitter for the most talked-about AI agent projects, tools, and frameworks in the last 24 hours. Focus on: autonomous agents, Claude Code, Cursor IDE, OpenClaw, multi-agent systems, AI automation. Find 3-5 posts with real engagement (likes, replies, retweets). For each, give me: the post author, what they said (brief summary), the URL, and why it matters.",
        "domain": "ai-agents",
        "tags": ["ai-agents", "automation"],
    },
    {
        "prompt": "Search X/Twitter for conversations about GTM engineering, outbound automation, cold email infrastructure, Clay data enrichment, sales pipeline automation, or AI-powered sales tools in the last 48 hours. Find 3-5 posts from practitioners (not vendors selling). For each: author, summary, URL, and the tactical insight.",
        "domain": "gtm",
        "tags": ["gtm", "outbound", "pipeline"],
    },
    {
        "prompt": "Search X/Twitter for indie hackers, solopreneurs, and builders sharing what they shipped this week — especially AI-powered tools, SaaS products, or developer tools. Find 3-5 posts with real builds (not just talk). For each: author, what they built, URL, and what's interesting about the approach.",
        "domain": "builder",
        "tags": ["builder", "shipping", "indie"],
    },
    {
        "prompt": "Search X/Twitter for posts about full-stack web development with Next.js, Vercel deployments, AI-accelerated development, or building websites fast. Find 2-3 recent posts from developers sharing tips, launches, or workflows. For each: author, summary, URL.",
        "domain": "web-dev",
        "tags": ["web-dev", "nextjs", "deployment"],
    },
]

WEB_SEARCHES = [
    {
        "prompt": "Search the web for the top Hacker News posts from today about AI agents, autonomous systems, developer tools, or building in public. Find 2-3 posts that are getting discussion. For each: title, URL, comment count, and what the HN crowd thinks about it.",
        "domain": "hn",
        "tags": ["ai-agents", "builder", "hn"],
    },
    {
        "prompt": "Search the web for recent Reddit posts in r/SideProject, r/artificial, r/webdev, or r/Entrepreneur about AI tools, shipping products, or career transitions into tech. Find 2-3 posts with real discussion. For each: title, subreddit, URL, and the thread consensus.",
        "domain": "reddit",
        "tags": ["builder", "career", "reddit"],
    },
]

# ── Angle templates ───────────────────────────────────────────────

ANGLE_PROMPT = """Based on this topic, suggest a specific content angle for Shawn Tenam — a GTM engineer who builds AI-native infrastructure, ships from a monorepo, and went from plumber to SDR to AI builder. He runs 4 live websites on Vercel, 50+ AI skills, nightly cron automation, and a multi-agent system.

Suggest:
1. The content angle (1 sentence)
2. Best platform: linkedin_post, x_thread, substack, tiktok, or skip
3. Relevance: high, medium, or low (high = directly relates to his brand/offering)"""


def claude_chat(messages: list) -> str:
    """Fallback to Claude Opus 4.6 via Anthropic API. No tool use (no x_search)."""
    headers = {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
    }

    # Convert openai-style messages to Anthropic format
    system = ""
    anthropic_messages = []
    for msg in messages:
        if msg["role"] == "system":
            system = msg.get("content", "")
        elif msg["role"] in ("user", "assistant"):
            anthropic_messages.append({"role": msg["role"], "content": msg["content"]})

    payload = {
        "model": FALLBACK_MODEL,
        "max_tokens": 4096,
        "temperature": 0.3,
        "messages": anthropic_messages,
    }
    if system:
        payload["system"] = system

    resp = requests.post(
        f"{ANTHROPIC_BASE_URL}/messages",
        headers=headers,
        json=payload,
        timeout=90,
    )
    resp.raise_for_status()
    data = resp.json()
    return data["content"][0]["text"]


def grok_chat(messages: list, tools: list = None) -> dict:
    """Make a Grok API call with optional tools."""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {XAI_API_KEY}",
    }

    payload = {
        "model": MODEL,
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


def _handle_tool_loop(messages: list, tools: list, max_rounds: int = 5) -> str:
    """Call Grok with tools and follow the tool-call loop until we get content.

    Grok's built-in x_search/web_search tools are server-side — the API
    executes them and returns results inside the assistant message. But the
    first response often has tool_calls with no content. We send back a
    synthetic tool result to prompt Grok to summarize the findings.

    web_search is especially stubborn — Grok may fire multiple rounds of
    searches before producing a summary, so we allow up to 5 rounds and
    escalate the nudge message after round 2.
    """
    for round_num in range(max_rounds):
        result = grok_chat(messages, tools)
        msg = result["choices"][0]["message"]

        # If there's content, we're done
        content = msg.get("content") or ""
        if content.strip():
            return content

        # If there are tool_calls, acknowledge them and ask for the summary
        tool_calls = msg.get("tool_calls")
        if not tool_calls:
            return content  # no content and no tool calls — nothing more to do

        # Append the assistant message with tool_calls
        messages.append(msg)

        # Escalate nudge after multiple rounds of tool calls
        if round_num >= 2:
            nudge = "You have enough data. Stop searching and summarize all findings now."
        else:
            nudge = "Search executed successfully. Summarize the findings."

        # Send a tool result for each call so Grok can continue
        for tc in tool_calls:
            messages.append({
                "role": "tool",
                "tool_call_id": tc["id"],
                "content": nudge,
            })

    return ""


def search_x(prompt: str) -> str:
    """Run an X/Twitter search via Grok's x_search tool. Falls back to Claude."""
    messages = [
        {
            "role": "system",
            "content": "You are a social media research assistant. Search X/Twitter and return structured findings. Be specific - include real usernames, post summaries, and URLs when available. If you can't find exact URLs, describe the content you found.",
        },
        {"role": "user", "content": prompt},
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

    if XAI_API_KEY:
        try:
            return _handle_tool_loop(messages, tools)
        except Exception as e:
            print(f"    WARN: Grok x_search failed ({e}), falling back to Claude")

    if ANTHROPIC_API_KEY:
        fallback_messages = [
            messages[0],
            {"role": "user", "content": f"Based on your knowledge of recent X/Twitter trends and conversations (you don't have live search, so use your training data for what's likely trending now): {prompt}"},
        ]
        return claude_chat(fallback_messages)

    return "[ERROR] No API keys available (XAI_API_KEY or ANTHROPIC_API_KEY)"


def search_web(prompt: str) -> str:
    """Run a web search via Grok's web_search tool. Falls back to Claude."""
    messages = [
        {
            "role": "system",
            "content": "You are a web research assistant. Search the web and return structured findings. Include URLs, titles, and key takeaways.",
        },
        {"role": "user", "content": prompt},
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

    if XAI_API_KEY:
        try:
            return _handle_tool_loop(messages, tools)
        except Exception as e:
            print(f"    WARN: Grok web_search failed ({e}), falling back to Claude")

    if ANTHROPIC_API_KEY:
        fallback_messages = [
            messages[0],
            {"role": "user", "content": f"Based on your knowledge of recent web trends (you don't have live search, so use your training data): {prompt}"},
        ]
        return claude_chat(fallback_messages)

    return "[ERROR] No API keys available (XAI_API_KEY or ANTHROPIC_API_KEY)"


def analyze_and_angle(raw_findings: list) -> list:
    """Send all findings to Grok for angle analysis in one call."""
    findings_text = ""
    for i, finding in enumerate(raw_findings):
        findings_text += f"\n--- Topic {i+1} ({finding['domain']}) ---\n{finding['raw']}\n"

    messages = [
        {
            "role": "system",
            "content": """You are a content strategy advisor for Shawn Tenam - a GTM engineer who builds AI-native infrastructure. He went from plumber to SDR to AI builder. He runs 4 live websites on Vercel, 50+ AI skills, nightly cron automation, a multi-agent system, and an AI chatbot mascot called Nio.

He's about to go independent and sell:
- Full-stack website builds ($3,500-7,500)
- AI operating system builds ($10,000-25,000)
- AI ops retainers ($5,000/month)

Based on the research findings, generate exactly 10 post ideas for X/Twitter. Each idea should be a specific, ready-to-write post concept that connects trending conversations to Shawn's builder experience.

Mix of formats: hot takes, meme-style one-liners, build log teasers, thread starters, and remix/reaction posts.

Return a JSON array of exactly 10 items:
{
  "idea": "the actual post idea written as a 1-2 sentence pitch (not the full post, just the concept)",
  "format": "hot_take|meme|build_log|thread|remix|reaction",
  "source_trend": "what trending topic or conversation this riffs on",
  "relevance": "high|medium|low",
  "tags": ["tag1", "tag2"]
}

Return ONLY the JSON array, no other text.""",
        },
        {
            "role": "user",
            "content": f"Here are today's {len(raw_findings)} research findings from X and the web. Generate 10 post ideas:\n{findings_text}",
        },
    ]

    content = ""
    if XAI_API_KEY:
        try:
            result = grok_chat(messages)
            content = result["choices"][0]["message"].get("content", "[]")
        except Exception as e:
            print(f"    WARN: Grok analysis failed ({e}), falling back to Claude")

    if not content.strip() and ANTHROPIC_API_KEY:
        content = claude_chat(messages)

    if not content.strip():
        return [{"idea": "No API keys available", "relevance": "low"}]

    # Parse JSON from response (handle markdown code blocks)
    content = content.strip()
    if content.startswith("```"):
        content = content.split("\n", 1)[1] if "\n" in content else content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return [{"idea": "Analysis parse error", "relevance": "low", "raw_response": content[:500]}]


def run_scout(test_mode: bool = False) -> dict:
    """Run all research missions and compile the daily briefing."""
    if not XAI_API_KEY and not ANTHROPIC_API_KEY:
        return {
            "agent": "scout",
            "error": "Neither XAI_API_KEY nor ANTHROPIC_API_KEY set. Add at least one to .env.",
        }
    if not XAI_API_KEY:
        print("[scout] WARN: XAI_API_KEY missing, running on Claude Opus 4.6 fallback (no live x_search)")
    else:
        print(f"[scout] using Grok ({MODEL}) with Claude fallback")

    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    raw_findings = []
    total_cost_ticks = 0

    # ── X/Twitter searches ──
    x_searches = X_SEARCHES[:2] if test_mode else X_SEARCHES
    for search in x_searches:
        try:
            print(f"  [x_search] {search['domain']}...")
            raw = search_x(search["prompt"])
            raw_findings.append({
                "domain": search["domain"],
                "source_type": "x",
                "tags": search["tags"],
                "raw": raw,
            })
            time.sleep(1)
        except Exception as e:
            raw_findings.append({
                "domain": search["domain"],
                "source_type": "x",
                "tags": search["tags"],
                "raw": f"[ERROR] {e}",
            })

    # ── Web searches ──
    web_searches = WEB_SEARCHES[:1] if test_mode else WEB_SEARCHES
    for search in web_searches:
        try:
            print(f"  [web_search] {search['domain']}...")
            raw = search_web(search["prompt"])
            raw_findings.append({
                "domain": search["domain"],
                "source_type": "web",
                "tags": search["tags"],
                "raw": raw,
            })
            time.sleep(1)
        except Exception as e:
            raw_findings.append({
                "domain": search["domain"],
                "source_type": "web",
                "tags": search["tags"],
                "raw": f"[ERROR] {e}",
            })

    # ── Analyze all findings for angles ──
    print("  [analyze] generating content angles...")
    topics = []
    try:
        topics = analyze_and_angle(raw_findings)
    except Exception as e:
        topics = [{"title": f"Analysis failed: {e}", "relevance": "low"}]

    # ── Build summary ──
    high_count = len([t for t in topics if t.get("relevance") == "high"])
    med_count = len([t for t in topics if t.get("relevance") == "medium"])
    total = len(topics)

    top_pick = None
    high_ideas = [t for t in topics if t.get("relevance") == "high"]
    if high_ideas:
        top_pick = high_ideas[0].get("idea", "Unknown")
    elif topics:
        top_pick = topics[0].get("idea", "Unknown")

    summary = f"{total} post ideas generated ({high_count} high, {med_count} medium relevance). "
    if high_count >= 5:
        summary += "Strong content day - plenty of high-relevance ideas."
    elif high_count >= 2:
        summary += "Decent day - a few strong ideas to pick from."
    else:
        summary += "Quiet day - consider evergreen content or system posts."

    return {
        "agent": "scout",
        "timestamp": now.isoformat(),
        "briefing_date": today,
        "model": MODEL,
        "searches": {
            "x_search": len(x_searches),
            "web_search": len(web_searches),
            "analysis": 1,
        },
        "topics": topics,
        "raw_findings": raw_findings,
        "summary": summary,
        "top_pick": top_pick,
        "test_mode": test_mode,
    }


def main():
    parser = argparse.ArgumentParser(description="Scout — Content Research Agent")
    parser.add_argument(
        "--test", action="store_true",
        help="Dry run — fewer queries, includes raw findings, prints to stdout",
    )
    args = parser.parse_args()

    print("[scout] starting daily research...")
    briefing = run_scout(test_mode=args.test)

    if args.test:
        print(json.dumps(briefing, indent=2, default=str))
        return

    # Write log file
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{briefing['briefing_date']}.json"
    log_path = LOG_DIR / filename

    with open(log_path, "w") as f:
        json.dump(briefing, f, indent=2, default=str)

    # Print summary + all ideas to stdout for cron logs
    print(f"[scout] {briefing['summary']}")
    for i, idea in enumerate(briefing.get("topics", []), 1):
        rel = idea.get("relevance", "?")[0].upper()
        fmt = idea.get("format", "post")
        print(f"  {i:2d}. [{rel}] ({fmt}) {idea.get('idea', '???')}")
    if briefing.get("top_pick"):
        print(f"\n  TOP PICK: {briefing['top_pick']}")

    # Post to Slack
    bot_token = os.environ.get("SLACK_BOT_TOKEN")
    channel_id = os.environ.get("SLACK_X_CHANNEL_ID")
    if bot_token and channel_id:
        slack_msg = format_slack_digest(briefing)
        post_to_slack(channel_id, slack_msg, bot_token)
    else:
        print("[scout] WARN: SLACK_BOT_TOKEN or SLACK_X_CHANNEL_ID missing, skipping Slack post")


def format_slack_digest(briefing):
    """Format the 10 post ideas into a Slack message."""
    date = briefing.get("briefing_date", "today")
    topics = briefing.get("topics", [])
    summary = briefing.get("summary", "")

    lines = [f":zap: *Daily Post Ideas* - {date}\n_{summary}_\n"]

    for i, idea in enumerate(topics, 1):
        rel = idea.get("relevance", "?")
        fmt = idea.get("format", "post")
        text = idea.get("idea", "???")
        trend = idea.get("source_trend", "")

        emoji = ":fire:" if rel == "high" else ":eyes:" if rel == "medium" else ":grey_question:"
        lines.append(f"{emoji} *{i}.* `{fmt}` {text}")
        if trend:
            lines.append(f"    _riffs on: {trend}_")
        lines.append("")

    if briefing.get("top_pick"):
        lines.append(f":trophy: *Top pick:* {briefing['top_pick']}")

    return "\n".join(lines)


def post_to_slack(channel_id, text, bot_token):
    """Post a message to Slack."""
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
    if data.get("ok"):
        print("[scout] Posted digest to Slack")
    else:
        print(f"[scout] WARN: Slack error: {data.get('error', 'unknown')}")


if __name__ == "__main__":
    main()
