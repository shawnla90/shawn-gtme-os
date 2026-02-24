#!/usr/bin/env python3
"""
SEO Keyword Pipeline for shawnos.ai
====================================
Generates keyword-targeted content briefs for the daily blog generator.

How it works:
1. Maintains a seed keyword list (AI assistant, personal AI, etc.)
2. Uses Google autocomplete API to expand into long-tail keywords
3. Scores keywords by relevance to shawnos.ai content pillars
4. Generates a daily content brief with target keyword + outline
5. Saves to workspace for the blog generator cron to pick up

Run: python3 scripts/seo_keyword_pipeline.py
Cron: Schedule before the blog generator (e.g., 7:45 AM ET)
"""

import json
import os
import random
import sys
from datetime import datetime, date
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.parse import quote

# ── Config ──────────────────────────────────────────────────────────────

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(REPO_ROOT, "data", "seo")
BRIEF_PATH = os.path.join(OUTPUT_DIR, "daily-brief.json")
KEYWORD_LOG = os.path.join(OUTPUT_DIR, "keyword-log.json")
USED_KEYWORDS_PATH = os.path.join(OUTPUT_DIR, "used-keywords.json")

# Content pillars for shawnos.ai
CONTENT_PILLARS = [
    "personal AI assistant",
    "AI infrastructure",
    "build in public",
    "GTM automation",
    "AI agent setup",
]

# Seed keywords — expanded via autocomplete
SEED_KEYWORDS = [
    "how to build AI assistant",
    "personal AI chatbot setup",
    "AI assistant with memory",
    "Claude API tutorial",
    "AI agent automation",
    "build your own AI",
    "AI cron jobs automation",
    "SQLite AI memory",
    "AI assistant cost",
    "self hosted AI assistant",
    "AI evolution system",
    "Claude Code tutorial",
    "AI assistant for solopreneurs",
    "build AI with Claude",
    "AI agent orchestration",
    "personal AI infrastructure",
    "AI assistant daily blog",
    "MCP server setup",
    "AI knowledge graph",
    "programmatic SEO AI",
    "AI skill system",
    "tamagotchi AI concept",
    "AI assistant XP system",
    "claude opus vs sonnet",
    "AI assistant Mac Mini",
    "run AI locally",
    "AI agent memory system",
    "AI assistant Next.js",
    "monorepo AI project",
]


# ── Google Autocomplete ─────────────────────────────────────────────────

def get_autocomplete_suggestions(query: str) -> list[str]:
    """Fetch Google autocomplete suggestions for a query."""
    try:
        url = f"http://suggestqueries.google.com/complete/search?client=firefox&q={quote(query)}"
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data[1] if len(data) > 1 else []
    except Exception:
        return []


def expand_keywords(seeds: list[str], max_per_seed: int = 5) -> list[str]:
    """Expand seed keywords using Google autocomplete."""
    expanded = set(seeds)
    for seed in seeds:
        suggestions = get_autocomplete_suggestions(seed)
        for suggestion in suggestions[:max_per_seed]:
            expanded.add(suggestion.lower().strip())

        # Also try "how to" and "best" prefixes
        for prefix in ["how to", "best", "free"]:
            if not seed.startswith(prefix):
                more = get_autocomplete_suggestions(f"{prefix} {seed}")
                for s in more[:3]:
                    expanded.add(s.lower().strip())

    return list(expanded)


# ── Keyword Scoring ─────────────────────────────────────────────────────

def score_keyword(keyword: str) -> float:
    """Score a keyword based on relevance to content pillars."""
    score = 0.0
    kw_lower = keyword.lower()

    # Pillar match bonus
    for pillar in CONTENT_PILLARS:
        words = pillar.lower().split()
        matches = sum(1 for w in words if w in kw_lower)
        score += matches * 10

    # Length bonus (long-tail keywords are easier to rank for)
    word_count = len(keyword.split())
    if 4 <= word_count <= 8:
        score += 15  # sweet spot
    elif word_count >= 3:
        score += 8

    # Intent signals
    intent_words = ["how to", "setup", "tutorial", "guide", "build", "create", "best", "vs"]
    for intent in intent_words:
        if intent in kw_lower:
            score += 12
            break

    # Brand relevance
    brand_words = ["ai assistant", "claude", "mcp", "agent", "memory", "skill"]
    for brand in brand_words:
        if brand in kw_lower:
            score += 8

    # Penalty for overly generic terms
    generic = ["ai", "chatgpt", "openai", "google"]
    if kw_lower in generic:
        score -= 20

    return score


# ── Brief Generation ────────────────────────────────────────────────────

def load_used_keywords() -> set:
    """Load previously used keywords to avoid repetition."""
    if os.path.exists(USED_KEYWORDS_PATH):
        with open(USED_KEYWORDS_PATH) as f:
            return set(json.load(f))
    return set()


def save_used_keyword(keyword: str):
    """Track that a keyword has been used."""
    used = load_used_keywords()
    used.add(keyword)
    # Keep only last 90 entries to allow keyword recycling
    used_list = sorted(used)[-90:]
    os.makedirs(os.path.dirname(USED_KEYWORDS_PATH), exist_ok=True)
    with open(USED_KEYWORDS_PATH, "w") as f:
        json.dump(used_list, f, indent=2)


def generate_outline(keyword: str) -> list[str]:
    """Generate a simple article outline for a keyword."""
    templates = [
        [
            f"What is {keyword}?",
            "Why this matters in 2026",
            "Step-by-step setup guide",
            "Real costs and trade-offs",
            "My actual results",
            "Next steps + resources",
        ],
        [
            f"The problem {keyword} solves",
            "Common approaches (and why they fall short)",
            "The approach I use",
            "Implementation walkthrough",
            "Lessons learned",
            "Try it yourself",
        ],
        [
            f"Why everyone is talking about {keyword}",
            "What most guides get wrong",
            "The 3-step framework",
            "Tools and infrastructure",
            "Real-world performance",
            "Get started today",
        ],
    ]
    return random.choice(templates)


def generate_daily_brief() -> dict:
    """Generate today's SEO-targeted content brief."""
    print("[SEO] Expanding seed keywords via Google autocomplete...")
    all_keywords = expand_keywords(SEED_KEYWORDS, max_per_seed=3)
    print(f"[SEO] Expanded to {len(all_keywords)} keywords")

    # Score and rank
    used = load_used_keywords()
    scored = []
    for kw in all_keywords:
        if kw in used:
            continue
        score = score_keyword(kw)
        scored.append((kw, score))

    scored.sort(key=lambda x: x[1], reverse=True)

    if not scored:
        # All keywords used, reset
        print("[SEO] All keywords used. Resetting pool.")
        os.remove(USED_KEYWORDS_PATH) if os.path.exists(USED_KEYWORDS_PATH) else None
        return generate_daily_brief()

    # Pick top keyword
    target = scored[0]
    keyword = target[0]
    score = target[1]

    # Generate brief
    outline = generate_outline(keyword)
    brief = {
        "date": date.today().isoformat(),
        "target_keyword": keyword,
        "score": score,
        "outline": outline,
        "content_pillar": max(CONTENT_PILLARS, key=lambda p: sum(1 for w in p.lower().split() if w in keyword.lower())),
        "seo_title": f"{keyword.title()} — A Builder's Guide",
        "meta_description": f"Learn {keyword} with real code, real costs, and no gatekeeping. From the builder behind shawnos.ai.",
        "slug_suggestion": keyword.lower().replace(" ", "-").replace("'", "")[:60],
        "runner_up_keywords": [k for k, s in scored[1:6]],
        "generated_at": datetime.now().isoformat(),
    }

    # Save brief
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(BRIEF_PATH, "w") as f:
        json.dump(brief, f, indent=2)

    # Log this keyword selection
    log_entry = {
        "date": brief["date"],
        "keyword": keyword,
        "score": score,
        "total_candidates": len(scored),
    }
    log = []
    if os.path.exists(KEYWORD_LOG):
        with open(KEYWORD_LOG) as f:
            log = json.load(f)
    log.append(log_entry)
    with open(KEYWORD_LOG, "w") as f:
        json.dump(log[-90:], f, indent=2)  # keep last 90 days

    # Mark as used
    save_used_keyword(keyword)

    print(f"[SEO] Target keyword: '{keyword}' (score: {score})")
    print(f"[SEO] Brief saved to: {BRIEF_PATH}")
    print(f"[SEO] Outline: {outline}")

    return brief


# ── Main ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    brief = generate_daily_brief()
    print(json.dumps(brief, indent=2))
