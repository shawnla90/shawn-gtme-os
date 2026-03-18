#!/usr/bin/env python3
"""
daily_content_intel.py — Daily content intelligence pipeline.

Scans Reddit ecosystem, analyzes trends, generates multi-platform content
angles (Reddit/X/LinkedIn), auto-publishes a Claude Daily blog digest,
and notifies via Slack.

5 phases, each independently runnable:
  1. COLLECT  — PRAW scan of subreddits for trending posts
  2. ANALYZE  — Claude CLI scores 10 content angles
  3. GENERATE — Multi-platform versions (Claude + Grok)
  4. BLOG     — Claude CLI generates daily digest blog post
  5. PUBLISH  — Git push + Slack notification

Usage:
    python3 scripts/daily_content_intel.py                          # full pipeline
    python3 scripts/daily_content_intel.py --dry-run                # no writes/push
    python3 scripts/daily_content_intel.py --phase collect          # single phase
    python3 scripts/daily_content_intel.py --phase collect --dry-run
    python3 scripts/daily_content_intel.py --date 2026-03-18
    python3 scripts/daily_content_intel.py --stats
"""

import argparse
import json
import os
import re
import sqlite3
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

# ── Paths ─────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = REPO_ROOT / "data" / "index.db"
CONFIG_PATH = REPO_ROOT / "data" / "content-intel" / "config.json"
RAW_DIR = REPO_ROOT / "data" / "content-intel" / "raw"
ANALYSIS_DIR = REPO_ROOT / "data" / "content-intel" / "analysis"
BRIEFING_DIR = REPO_ROOT / "data" / "content-intel" / "briefing"
BRIEFING_MD_DIR = REPO_ROOT / "content" / "content-intel"
BLOG_DIR = REPO_ROOT / "content" / "website" / "final"
CORE_VOICE_PATH = REPO_ROOT / "skills" / "tier-1-voice-dna" / "core-voice.md"
ANTI_SLOP_PATH = REPO_ROOT / "skills" / "tier-1-voice-dna" / "anti-slop.md"
CLAUDE_CLI = "/opt/homebrew/bin/claude"

# ── .env loader ───────────────────────────────────────────────────────

def load_env():
    env_path = REPO_ROOT / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

# ── Config ────────────────────────────────────────────────────────────

def load_config():
    with open(CONFIG_PATH) as f:
        return json.load(f)

# ── Anti-Slop ─────────────────────────────────────────────────────────

ANTI_SLOP_RULES = [
    (r"\u2014", "em-dash", True, lambda m: "."),
    (r"\u2013", "en-dash", True, lambda m: "."),
    (r"[Tt]he uncomfortable truth", "authority signaling", True, lambda m: ""),
    (r"[Ll]et me be clear", "authority signaling", True, lambda m: ""),
    (r"[Hh]ere'?s what nobody tells you", "authority signaling", True, lambda m: ""),
    (r"[Tt]he hard truth is", "authority signaling", True, lambda m: ""),
    (r"[Hh]ere'?s the reality", "authority signaling", True, lambda m: ""),
    (r"[Ww]hat most people miss", "authority signaling", True, lambda m: ""),
    (r"[Hh]ere'?s the thing about", "narrator setup", True, lambda m: ""),
    (r"[Hh]ere'?s where it gets interesting", "narrator setup", True, lambda m: ""),
    (r"[Bb]ut here'?s the part where", "dramatic rhetorical", True, lambda m: ""),
    (r"[Aa]nd that'?s when it clicked", "dramatic rhetorical", True, lambda m: ""),
    (r"[Ww]ant to know the crazy part", "dramatic rhetorical", True, lambda m: ""),
    (r"[Tt]his is what I call", "self-branded concept", True, lambda m: ""),
    (r"\b(?:game.?changer|unleash|supercharge|next.?level)\b", "hype word", False, None),
    (r'"[^"]{5,}"', "quotation marks around phrase", False, None),
]


def validate_anti_slop(text):
    """Validate text against anti-slop rules. Returns (score, violations, fixed_text)."""
    violations = []
    fixed = text

    for pattern, desc, auto_fixable, fix_func in ANTI_SLOP_RULES:
        matches = list(re.finditer(pattern, fixed))
        if matches:
            violations.append(f"{desc}: {len(matches)} occurrence(s)")
            if auto_fixable and fix_func:
                fixed = re.sub(pattern, fix_func, fixed)

    fixed = re.sub(r"  +", " ", fixed)
    fixed = re.sub(r"\n{3,}", "\n\n", fixed)
    fixed = re.sub(r"^\.\s*$", "", fixed, flags=re.MULTILINE)

    score = max(0.0, 100.0 - len(violations) * 10.0)
    return score, violations, fixed

# ── PRAW Client ───────────────────────────────────────────────────────

def get_reddit_client():
    try:
        import praw
    except ImportError:
        print("ERROR: praw not installed. pip install praw", file=sys.stderr)
        sys.exit(1)

    client_id = os.environ.get("REDDIT_CLIENT_ID")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
    username = os.environ.get("REDDIT_USERNAME")
    password = os.environ.get("REDDIT_PASSWORD")

    if not all([client_id, client_secret, username, password]):
        print("ERROR: Reddit credentials not set in .env", file=sys.stderr)
        print("Required: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD")
        sys.exit(1)

    return praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        username=username,
        password=password,
        user_agent=f"ShawnOS ContentIntel/1.0 (by u/{username})",
    )

# ── Grok API ──────────────────────────────────────────────────────────

def grok_chat(api_key, messages, config):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload = {
        "model": config.get("model", "grok-4-1-fast-non-reasoning"),
        "messages": messages,
        "stream": False,
        "temperature": 0.7,
    }
    resp = requests.post(
        f"{config.get('base_url', 'https://api.x.ai/v1')}/chat/completions",
        headers=headers,
        json=payload,
        timeout=90,
    )
    resp.raise_for_status()
    return resp.json()

# ── Claude CLI ────────────────────────────────────────────────────────

def call_claude(system_prompt, user_prompt, model="sonnet"):
    """Call Claude via CLI. Uses sonnet for speed, opus for blog quality."""
    full_prompt = f"{system_prompt}\n\n---\n\n{user_prompt}"

    result = subprocess.run(
        [CLAUDE_CLI, "-p", "--model", model, "--output-format", "text", "--allowedTools", ""],
        input=full_prompt,
        capture_output=True,
        text=True,
        timeout=300,
        cwd=str(REPO_ROOT),
    )

    if result.returncode != 0:
        print(f"ERROR: claude CLI failed (exit {result.returncode})", file=sys.stderr)
        if result.stderr:
            print(f"  stderr: {result.stderr[:500]}", file=sys.stderr)
        return None

    return result.stdout.strip()

# ── Voice System ──────────────────────────────────────────────────────

def load_voice_system():
    """Load core voice + anti-slop rules for prompt injection."""
    parts = []
    if CORE_VOICE_PATH.exists():
        parts.append(f"# VOICE PRINCIPLES\n\n{CORE_VOICE_PATH.read_text(errors='replace')}")
    if ANTI_SLOP_PATH.exists():
        parts.append(f"# ANTI-SLOP RULES (mandatory)\n\n{ANTI_SLOP_PATH.read_text(errors='replace')}")
    return "\n\n---\n\n".join(parts)

# ── Shawn Identity Context ───────────────────────────────────────────

SHAWN_CONTEXT = """You are generating content for Shawn Tenam (@shawntenam).

Who Shawn is:
- GTM engineer who went from plumber to SDR to AI builder
- Runs shawnos.ai, builds from a monorepo with 50+ AI skills, 17 MCP servers
- Active in r/ClaudeCode (1,177 karma in 1 month), growing authority on Claude Code
- Building "Reddit as a service" for B2B SaaS companies
- Uses Claude Code, PRAW, Grok, and automated content pipelines daily
- Voice: builder-first, casual competence, no gatekeeping, lowercase-first style
- Brand: Lead Alchemy, the gtme alchemist

His audience:
- Developers and builders using Claude Code
- GTM engineers and agency builders
- People exploring AI-native workflows
- Reddit community participants"""

# ══════════════════════════════════════════════════════════════════════
#  PHASE 1: COLLECT
# ══════════════════════════════════════════════════════════════════════

def phase_collect(target_date, config, dry_run=False):
    """Scan subreddits via PRAW for trending posts."""
    print("\n── PHASE 1: COLLECT ──")

    reddit = get_reddit_client()
    all_subs = config["subreddits"]["primary"] + config["subreddits"]["secondary"]
    collect_config = config.get("collection", {})
    hot_limit = collect_config.get("hot_limit", 50)
    new_limit = collect_config.get("new_limit", 25)
    top_comments = collect_config.get("top_comments", 5)
    hours_lookback = collect_config.get("hours_lookback", 24)

    now = datetime.now(timezone.utc)
    cutoff = now.timestamp() - (hours_lookback * 3600)

    collected = []

    for sub_name in all_subs:
        print(f"  scanning r/{sub_name}...")
        try:
            subreddit = reddit.subreddit(sub_name)
        except Exception as e:
            print(f"    ERROR: could not access r/{sub_name}: {e}")
            continue

        seen_ids = set()
        posts = []

        # Hot posts
        try:
            for post in subreddit.hot(limit=hot_limit):
                if post.created_utc < cutoff or post.id in seen_ids:
                    continue
                seen_ids.add(post.id)
                posts.append(post)
        except Exception as e:
            print(f"    WARN: hot scan failed: {e}")

        # New posts
        try:
            for post in subreddit.new(limit=new_limit):
                if post.created_utc < cutoff or post.id in seen_ids:
                    continue
                seen_ids.add(post.id)
                posts.append(post)
        except Exception as e:
            print(f"    WARN: new scan failed: {e}")

        for post in posts:
            hours_old = max(0.1, (now.timestamp() - post.created_utc) / 3600)
            velocity_score = round(post.score / hours_old, 2)
            engagement_ratio = round(post.num_comments / max(1, post.score), 2)

            # Get top comments
            post_comments = []
            try:
                post.comment_sort = "best"
                post.comments.replace_more(limit=0)
                for comment in post.comments[:top_comments]:
                    post_comments.append({
                        "author": str(comment.author) if comment.author else "[deleted]",
                        "score": comment.score,
                        "body": comment.body[:300] if comment.body else "",
                    })
            except Exception:
                pass

            collected.append({
                "id": post.id,
                "subreddit": sub_name,
                "title": post.title,
                "selftext_preview": (post.selftext or "")[:500],
                "score": post.score,
                "num_comments": post.num_comments,
                "upvote_ratio": post.upvote_ratio,
                "created_utc": post.created_utc,
                "hours_old": round(hours_old, 1),
                "velocity_score": velocity_score,
                "engagement_ratio": engagement_ratio,
                "url": f"https://reddit.com{post.permalink}",
                "top_comments": post_comments,
                "is_primary": sub_name in config["subreddits"]["primary"],
            })

        print(f"    collected {len(posts)} posts from r/{sub_name}")

    # Sort by velocity score
    collected.sort(key=lambda x: -x["velocity_score"])

    output = {
        "date": target_date,
        "collected_at": now.isoformat(),
        "total_posts": len(collected),
        "subreddits_scanned": len(all_subs),
        "posts": collected,
    }

    output_path = RAW_DIR / f"{target_date}.json"

    if dry_run:
        print(f"\n  DRY RUN: would write {len(collected)} posts to {output_path}")
        print(f"  top 5 by velocity:")
        for p in collected[:5]:
            print(f"    [{p['velocity_score']}] r/{p['subreddit']}: {p['title'][:80]}")
        return output

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(output, indent=2))
    print(f"  wrote {len(collected)} posts to {output_path}")
    return output


# ══════════════════════════════════════════════════════════════════════
#  PHASE 2: ANALYZE
# ══════════════════════════════════════════════════════════════════════

def phase_analyze(target_date, config, dry_run=False):
    """Analyze collected data to identify 10 content angles."""
    print("\n── PHASE 2: ANALYZE ──")

    raw_path = RAW_DIR / f"{target_date}.json"
    if not raw_path.exists():
        print(f"  ERROR: no raw data for {target_date}. Run collect first.")
        sys.exit(1)

    raw_data = json.loads(raw_path.read_text())
    voice_system = load_voice_system()
    diversity = config.get("style_diversity", {})

    system_prompt = f"""{voice_system}

---

{SHAWN_CONTEXT}

---

# TASK: Content Angle Analysis

You are analyzing Reddit ecosystem data to identify the 10 best content angles for Shawn to post today.

Score each angle on:
- viral_potential (1-10): how likely to get engagement
- voice_fit (1-10): how well it matches Shawn's authentic voice
- gap_score (1-10): is anyone else saying this? lower = more covered, higher = bigger gap
- effort_level: "low" (< 15 min), "medium" (15-45 min), "high" (45+ min)

Enforce style diversity. Target distribution:
{json.dumps(diversity, indent=2)}

Each angle needs:
- angle_id (1-10)
- post_type: one of [tutorial, hot_take, personal_story, meme, psa, resource_share, question, contrarian]
- title: the hook/headline
- thesis: 1-2 sentence core argument
- source_posts: list of Reddit post IDs that inspired this
- target_subreddit: best subreddit for the Reddit version
- scores: viral_potential, voice_fit, gap_score, effort_level

Output ONLY valid JSON. No markdown, no explanation. Just the JSON array of 10 angles."""

    # Prepare condensed raw data for the prompt
    condensed_posts = []
    for p in raw_data.get("posts", [])[:75]:  # Top 75 by velocity
        condensed_posts.append({
            "id": p["id"],
            "sub": p["subreddit"],
            "title": p["title"],
            "preview": p["selftext_preview"][:200],
            "score": p["score"],
            "comments": p["num_comments"],
            "velocity": p["velocity_score"],
            "engagement": p["engagement_ratio"],
            "top_comments": [c["body"][:150] for c in p.get("top_comments", [])[:3]],
        })

    user_prompt = f"""Analyze these {len(condensed_posts)} Reddit posts from the Claude/AI ecosystem (collected {raw_data['date']}) and identify 10 content angles.

{json.dumps(condensed_posts, indent=2)}"""

    content = call_claude(system_prompt, user_prompt, model="sonnet")
    if not content:
        print("  ERROR: Claude analysis failed")
        sys.exit(1)

    # Parse JSON from response
    content = content.strip()
    if content.startswith("```"):
        content = content.split("\n", 1)[1] if "\n" in content else content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

    try:
        angles = json.loads(content)
    except json.JSONDecodeError as e:
        print(f"  ERROR: could not parse analysis JSON: {e}")
        print(f"  raw output: {content[:500]}")
        sys.exit(1)

    if not isinstance(angles, list):
        # Handle wrapped response like {"angles": [...]}
        if isinstance(angles, dict):
            for key in ["angles", "content_angles", "data"]:
                if key in angles and isinstance(angles[key], list):
                    angles = angles[key]
                    break

    # Validate diversity
    type_counts = {}
    for angle in angles:
        pt = angle.get("post_type", "unknown")
        type_counts[pt] = type_counts.get(pt, 0) + 1

    print(f"  identified {len(angles)} angles")
    print(f"  type distribution: {type_counts}")

    output = {
        "date": target_date,
        "analyzed_at": datetime.now(timezone.utc).isoformat(),
        "source_posts": raw_data.get("total_posts", 0),
        "angles": angles,
        "type_distribution": type_counts,
    }

    output_path = ANALYSIS_DIR / f"{target_date}.json"

    if dry_run:
        print(f"\n  DRY RUN: would write analysis to {output_path}")
        for a in angles[:5]:
            print(f"    [{a.get('post_type', '?')}] {a.get('title', '?')[:60]}")
        return output

    ANALYSIS_DIR.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(output, indent=2))
    print(f"  wrote analysis to {output_path}")
    return output


# ══════════════════════════════════════════════════════════════════════
#  PHASE 3: GENERATE
# ══════════════════════════════════════════════════════════════════════

def generate_reddit_version(angle, voice_system):
    """Generate Reddit version via Claude CLI."""
    system_prompt = f"""{voice_system}

---

{SHAWN_CONTEXT}

---

# TASK: Reddit Post Draft

Write a Reddit post for r/{angle.get('target_subreddit', 'ClaudeCode')}.

Rules:
- Match the subreddit culture. r/ClaudeCode is builder-focused, r/ClaudeAI is broader.
- Authentic builder tone. No corporate speak.
- Lowercase first line style (except I and proper nouns).
- Include specific details, code examples, or workflow steps where relevant.
- No self-promotion. Pure value contribution.
- Output ONLY the post text. No metadata, no markdown fences."""

    user_prompt = f"""Post type: {angle.get('post_type', 'tutorial')}
Title/hook: {angle.get('title', '')}
Thesis: {angle.get('thesis', '')}

Write the full Reddit post body."""

    return call_claude(system_prompt, user_prompt, model="sonnet")


def generate_x_version(angle, grok_config, api_key):
    """Generate X/Twitter version via Grok API."""
    messages = [
        {
            "role": "system",
            "content": f"""You write X/Twitter threads for Shawn Tenam (@shawntenam), a GTM engineer and Claude Code power user.

Rules:
- Hook-first. First tweet must stop the scroll.
- Thread format (3-7 tweets). Each tweet stands alone but builds.
- Algorithm-optimized: use line breaks, no links in first tweet.
- Builder voice: casual, competent, specific.
- Include at least one concrete example or number.
- No em-dashes. No corporate speak. No "here's the thing about..."
- Output format: each tweet separated by ---""",
        },
        {
            "role": "user",
            "content": f"""Post type: {angle.get('post_type', 'tutorial')}
Hook: {angle.get('title', '')}
Thesis: {angle.get('thesis', '')}

Write the X/Twitter thread.""",
        },
    ]

    result = grok_chat(api_key, messages, grok_config)
    return result["choices"][0]["message"].get("content", "").strip()


def generate_linkedin_version(angle, voice_system):
    """Generate LinkedIn version via Claude CLI."""
    system_prompt = f"""{voice_system}

---

{SHAWN_CONTEXT}

---

# TASK: LinkedIn Post Draft

Write a LinkedIn post for Shawn's builder audience.

Rules:
- Professional builder narrative. Not corporate, not casual-sloppy.
- Whitespace-heavy. Short paragraphs (1-2 sentences max per block).
- Hook in first line (shows in feed preview).
- Include a takeaway or lesson. Builders share what they learned.
- End with engagement prompt only if it fits naturally.
- 800-1500 characters ideal.
- No em-dashes. No authority signaling phrases.
- Output ONLY the post text. No metadata."""

    user_prompt = f"""Post type: {angle.get('post_type', 'tutorial')}
Hook: {angle.get('title', '')}
Thesis: {angle.get('thesis', '')}

Write the full LinkedIn post."""

    return call_claude(system_prompt, user_prompt, model="sonnet")


def phase_generate(target_date, config, dry_run=False):
    """Generate multi-platform versions for each angle."""
    print("\n── PHASE 3: GENERATE ──")

    analysis_path = ANALYSIS_DIR / f"{target_date}.json"
    if not analysis_path.exists():
        print(f"  ERROR: no analysis for {target_date}. Run analyze first.")
        sys.exit(1)

    analysis = json.loads(analysis_path.read_text())
    angles = analysis.get("angles", [])
    voice_system = load_voice_system()
    grok_config = config.get("grok", {})
    api_key = os.environ.get("XAI_API_KEY")

    if not api_key:
        print("  WARN: XAI_API_KEY not set. X/Twitter versions will be skipped.")

    briefing = []

    for i, angle in enumerate(angles):
        print(f"  [{i+1}/{len(angles)}] {angle.get('post_type', '?')}: {angle.get('title', '?')[:50]}...")

        entry = {
            "angle": angle,
            "versions": {},
        }

        # Reddit version (Claude)
        if config["platforms"].get("reddit"):
            reddit_text = generate_reddit_version(angle, voice_system)
            if reddit_text:
                score, violations, fixed = validate_anti_slop(reddit_text)
                if score < 80:
                    print(f"    reddit anti-slop: {score:.0f}% - rewriting...")
                    reddit_text = generate_reddit_version(angle, voice_system)
                    if reddit_text:
                        _, _, fixed = validate_anti_slop(reddit_text)
                entry["versions"]["reddit"] = fixed or reddit_text
            print(f"    reddit: done")

        # X/Twitter version (Grok)
        if config["platforms"].get("x") and api_key:
            try:
                x_text = generate_x_version(angle, grok_config, api_key)
                if x_text:
                    score, violations, fixed = validate_anti_slop(x_text)
                    entry["versions"]["x"] = fixed or x_text
                print(f"    x: done")
            except Exception as e:
                print(f"    x: ERROR - {e}")

        # LinkedIn version (Claude)
        if config["platforms"].get("linkedin"):
            linkedin_text = generate_linkedin_version(angle, voice_system)
            if linkedin_text:
                score, violations, fixed = validate_anti_slop(linkedin_text)
                if score < 80:
                    print(f"    linkedin anti-slop: {score:.0f}% - rewriting...")
                    linkedin_text = generate_linkedin_version(angle, voice_system)
                    if linkedin_text:
                        _, _, fixed = validate_anti_slop(linkedin_text)
                entry["versions"]["linkedin"] = fixed or linkedin_text
            print(f"    linkedin: done")

        briefing.append(entry)

    # Save JSON briefing
    briefing_output = {
        "date": target_date,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "count": len(briefing),
        "entries": briefing,
    }

    json_path = BRIEFING_DIR / f"{target_date}.json"
    md_path = BRIEFING_MD_DIR / f"{target_date}-briefing.md"

    if dry_run:
        print(f"\n  DRY RUN: would write {len(briefing)} entries")
        print(f"    JSON: {json_path}")
        print(f"    MD:   {md_path}")
        for b in briefing[:3]:
            a = b["angle"]
            platforms = list(b["versions"].keys())
            print(f"    [{a.get('post_type')}] {a.get('title', '')[:50]} -> {platforms}")
        return briefing_output

    BRIEFING_DIR.mkdir(parents=True, exist_ok=True)
    BRIEFING_MD_DIR.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(briefing_output, indent=2))

    # Generate human-readable markdown briefing
    md_lines = [
        f"# Content Intelligence Briefing: {target_date}",
        f"",
        f"Generated: {datetime.now().strftime('%I:%M %p')}",
        f"Angles: {len(briefing)}",
        f"",
        f"---",
        f"",
    ]

    for i, entry in enumerate(briefing, 1):
        a = entry["angle"]
        md_lines.append(f"## {i}. [{a.get('post_type', '?').upper()}] {a.get('title', 'Untitled')}")
        md_lines.append(f"")
        md_lines.append(f"**Thesis:** {a.get('thesis', '')}")
        md_lines.append(f"**Target sub:** r/{a.get('target_subreddit', '?')}")

        scores = a.get("scores", a)
        md_lines.append(f"**Scores:** viral={scores.get('viral_potential', '?')} voice={scores.get('voice_fit', '?')} gap={scores.get('gap_score', '?')} effort={scores.get('effort_level', '?')}")
        md_lines.append(f"")

        for platform, text in entry.get("versions", {}).items():
            md_lines.append(f"### {platform.upper()} Version")
            md_lines.append(f"")
            md_lines.append(text or "(generation failed)")
            md_lines.append(f"")

        md_lines.append(f"---")
        md_lines.append(f"")

    md_path.write_text("\n".join(md_lines))
    print(f"  wrote briefing: {json_path}")
    print(f"  wrote briefing: {md_path}")
    return briefing_output


# ══════════════════════════════════════════════════════════════════════
#  PHASE 4: BLOG DIGEST
# ══════════════════════════════════════════════════════════════════════

def phase_blog(target_date, config, dry_run=False):
    """Generate Claude Code Daily blog digest."""
    print("\n── PHASE 4: BLOG DIGEST ──")

    raw_path = RAW_DIR / f"{target_date}.json"
    analysis_path = ANALYSIS_DIR / f"{target_date}.json"

    if not raw_path.exists():
        print(f"  ERROR: no raw data for {target_date}")
        sys.exit(1)

    raw_data = json.loads(raw_path.read_text())
    analysis = json.loads(analysis_path.read_text()) if analysis_path.exists() else None

    voice_system = load_voice_system()

    # Build stats summary
    posts = raw_data.get("posts", [])
    total_posts = len(posts)
    total_comments = sum(p.get("num_comments", 0) for p in posts)
    total_upvotes = sum(p.get("score", 0) for p in posts)
    subs_covered = list(set(p.get("subreddit", "") for p in posts))
    top_posts = sorted(posts, key=lambda x: -x.get("velocity_score", 0))[:5]

    # Get analysis angles if available
    angles_summary = ""
    if analysis:
        angles = analysis.get("angles", [])
        angles_lines = []
        for a in angles[:5]:
            angles_lines.append(f"- [{a.get('post_type', '?')}] {a.get('title', '')}")
        angles_summary = "\n".join(angles_lines)

    system_prompt = f"""{voice_system}

---

{SHAWN_CONTEXT}

---

# TASK: Claude Code Daily Blog Digest

Write the "Claude Code Daily: {target_date}" blog post for shawnos.ai.

This is a daily digest covering what happened in the Claude Code ecosystem today.
It makes shawnos.ai the go-to source for Claude Code news.

Structure (use these exact headings):
## ecosystem overview
1-2 paragraph summary of the day's activity across the Claude/AI subreddits.

## trending discussions
Cover 3-5 notable threads. For each:
- What the discussion is about
- Why it matters for builders
- Key insights from the community

## builder takeaways
3-5 actionable takeaways for Claude Code users. What should they know or try?

## community pulse
Quick stats and vibes. What's the community feeling? Any shifts in sentiment?

## by the numbers
Raw stats in a clean list format.

Rules:
- Lowercase headings (## ecosystem overview, not ## Ecosystem Overview)
- Builder voice. You're reporting from inside the community, not above it.
- No em-dashes. Period.
- Specific. Name real threads, real users (where appropriate), real numbers.
- AEO-optimized excerpt in the frontmatter (answers a question someone would ask).
- Don't use quotation marks around phrases.
- Output ONLY the markdown body. No frontmatter. No title heading.
- Start directly with ## ecosystem overview."""

    user_prompt = f"""Today's data ({target_date}):

Posts collected: {total_posts}
Total comments: {total_comments}
Total upvotes: {total_upvotes}
Subreddits: {', '.join(subs_covered)}

Top 5 posts by velocity:
{json.dumps([{"title": p["title"], "sub": p["subreddit"], "score": p["score"], "comments": p["num_comments"], "velocity": p["velocity_score"], "preview": p["selftext_preview"][:200]} for p in top_posts], indent=2)}

Content angles identified:
{angles_summary or "(analysis not yet run)"}

All posts data:
{json.dumps([{"title": p["title"], "sub": p["subreddit"], "score": p["score"], "comments": p["num_comments"], "preview": p["selftext_preview"][:150]} for p in posts[:30]], indent=2)}

Write the blog digest."""

    content = call_claude(system_prompt, user_prompt, model="opus")
    if not content:
        print("  ERROR: blog generation failed")
        sys.exit(1)

    # Anti-slop validation with retry
    score, violations, fixed = validate_anti_slop(content)
    print(f"  anti-slop: {score:.0f}%")
    if violations:
        for v in violations:
            print(f"    caught: {v}")

    if score < 80:
        print("  retrying for better anti-slop score...")
        violation_list = "\n".join(f"  - {v}" for v in violations)
        retry_prompt = (
            f"{user_prompt}\n\n"
            f"IMPORTANT: avoid these patterns:\n{violation_list}"
        )
        retry_content = call_claude(system_prompt, retry_prompt, model="opus")
        if retry_content:
            score2, violations2, fixed2 = validate_anti_slop(retry_content)
            if score2 > score:
                fixed = fixed2
                score = score2
                print(f"  retry anti-slop: {score:.0f}%")

    body = fixed or content

    # Build frontmatter
    formatted_date = datetime.strptime(target_date, "%Y-%m-%d").strftime("%B %d, %Y")

    # Extract first meaningful paragraph for excerpt
    excerpt = ""
    for line in body.split("\n"):
        line = line.strip()
        if line and not line.startswith("#") and len(line) > 40:
            excerpt = line[:200]
            break
    if not excerpt:
        excerpt = f"Daily digest of the Claude Code ecosystem for {formatted_date}. Trending discussions, builder takeaways, and community pulse."

    slug = f"claude-daily-{target_date}"
    frontmatter = f"""---
title: "Claude Code Daily: {formatted_date}"
date: "{target_date}"
excerpt: "{excerpt}"
category: "claude-daily"
featured: false
---"""

    full_content = f"{frontmatter}\n\n{body}\n"

    output_path = BLOG_DIR / f"{slug}.md"

    if dry_run:
        print(f"\n  DRY RUN: would write to {output_path}")
        print(f"\n=== BLOG PREVIEW ===\n")
        print(full_content[:1500])
        print(f"\n=== ({len(full_content)} chars total) ===")
        return output_path

    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    output_path.write_text(full_content)
    print(f"  wrote blog: {output_path}")
    return output_path


# ══════════════════════════════════════════════════════════════════════
#  PHASE 5: PUBLISH
# ══════════════════════════════════════════════════════════════════════

def phase_publish(target_date, config, dry_run=False):
    """Git push + Slack notification."""
    print("\n── PHASE 5: PUBLISH ──")

    slug = f"claude-daily-{target_date}"
    blog_path = f"content/website/final/{slug}.md"
    briefing_path = f"content/content-intel/{target_date}-briefing.md"

    files_to_add = []
    if (REPO_ROOT / blog_path).exists():
        files_to_add.append(blog_path)
    if (REPO_ROOT / briefing_path).exists():
        files_to_add.append(briefing_path)

    if not files_to_add:
        print("  no files to publish")
        return

    if dry_run:
        print(f"  DRY RUN: would commit and push: {files_to_add}")
        return

    # Git add, commit, push
    try:
        for f in files_to_add:
            subprocess.run(
                ["git", "-C", str(REPO_ROOT), "add", f],
                check=True, capture_output=True,
            )
        subprocess.run(
            ["git", "-C", str(REPO_ROOT), "commit", "-m",
             f"feat: claude daily digest {target_date}"],
            check=True, capture_output=True,
        )
        subprocess.run(
            ["git", "-C", str(REPO_ROOT), "push"],
            check=True, capture_output=True,
        )
        print(f"  committed and pushed: {files_to_add}")
    except subprocess.CalledProcessError as e:
        print(f"  WARN: git operation failed: {e.stderr.decode() if e.stderr else e}", file=sys.stderr)

    # Slack notification
    bot_token = os.environ.get("SLACK_BOT_TOKEN")
    channel_id = os.environ.get("SLACK_CONTENT_INTEL_CHANNEL_ID") or os.environ.get("SLACK_REDDIT_CHANNEL_ID")

    if bot_token and channel_id:
        # Load briefing for preview
        briefing_json_path = BRIEFING_DIR / f"{target_date}.json"
        preview = ""
        if briefing_json_path.exists():
            briefing_data = json.loads(briefing_json_path.read_text())
            entries = briefing_data.get("entries", [])[:3]
            lines = []
            for i, entry in enumerate(entries, 1):
                a = entry.get("angle", {})
                lines.append(f"  {i}. [{a.get('post_type', '?')}] {a.get('title', '')[:60]}")
            preview = "\n".join(lines)

        msg = (
            f":newspaper: *Content Intelligence Briefing* -- {target_date}\n\n"
            f"*Top 3 angles:*\n{preview}\n\n"
            f":globe_with_meridians: Blog published: https://shawnos.ai/blog/{slug}\n"
            f":page_facing_up: Full briefing: `content/content-intel/{target_date}-briefing.md`"
        )

        try:
            resp = requests.post(
                "https://slack.com/api/chat.postMessage",
                headers={
                    "Authorization": f"Bearer {bot_token}",
                    "Content-Type": "application/json",
                },
                json={
                    "channel": channel_id,
                    "text": msg,
                    "unfurl_links": False,
                    "unfurl_media": False,
                },
                timeout=15,
            )
            data = resp.json()
            if data.get("ok"):
                print(f"  posted to Slack")
            else:
                print(f"  WARN: Slack error: {data.get('error', 'unknown')}")
        except Exception as e:
            print(f"  WARN: Slack notification failed: {e}")
    else:
        print("  skipping Slack (no token or channel ID)")

    # SQLite logging
    log_run(target_date)


def log_run(target_date):
    """Log the pipeline run to SQLite."""
    if not DB_PATH.exists():
        return

    try:
        db = sqlite3.connect(str(DB_PATH))
        db.execute(
            """CREATE TABLE IF NOT EXISTS content_intel_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                phase TEXT NOT NULL DEFAULT 'all',
                posts_collected INTEGER,
                angles_generated INTEGER,
                blog_published INTEGER DEFAULT 0,
                slack_notified INTEGER DEFAULT 0,
                created_at TEXT DEFAULT (datetime('now')),
                UNIQUE(date, phase)
            )"""
        )

        # Count collected posts
        raw_path = RAW_DIR / f"{target_date}.json"
        posts_count = 0
        if raw_path.exists():
            raw = json.loads(raw_path.read_text())
            posts_count = raw.get("total_posts", 0)

        # Count angles
        analysis_path = ANALYSIS_DIR / f"{target_date}.json"
        angles_count = 0
        if analysis_path.exists():
            analysis = json.loads(analysis_path.read_text())
            angles_count = len(analysis.get("angles", []))

        slug = f"claude-daily-{target_date}"
        blog_exists = 1 if (BLOG_DIR / f"{slug}.md").exists() else 0

        db.execute(
            """INSERT OR REPLACE INTO content_intel_runs
               (date, phase, posts_collected, angles_generated, blog_published)
               VALUES (?, 'all', ?, ?, ?)""",
            (target_date, posts_count, angles_count, blog_exists),
        )
        db.commit()
        db.close()
    except Exception as e:
        print(f"  WARN: SQLite logging failed: {e}", file=sys.stderr)


# ── Stats ─────────────────────────────────────────────────────────────

def show_stats():
    """Print pipeline history from SQLite."""
    if not DB_PATH.exists():
        print("no index.db found. run build_index.py first.")
        return

    db = sqlite3.connect(str(DB_PATH))
    try:
        rows = db.execute(
            """SELECT date, posts_collected, angles_generated, blog_published, created_at
               FROM content_intel_runs
               ORDER BY created_at DESC LIMIT 30"""
        ).fetchall()
    except sqlite3.OperationalError:
        print("content_intel_runs table not found. run the pipeline first.")
        db.close()
        return

    if not rows:
        print("no pipeline runs logged yet.")
        db.close()
        return

    print(f"\n{'date':<12} {'posts':>8} {'angles':>8} {'blog':>6} {'run_at':<20}")
    print("-" * 60)
    for date, posts, angles, blog, created_at in rows:
        blog_str = "yes" if blog else "no"
        print(f"{date:<12} {posts or 0:>8} {angles or 0:>8} {blog_str:>6} {created_at or '':>20}")
    print(f"\n{len(rows)} runs logged.")
    db.close()


# ── Main ──────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Daily content intelligence pipeline")
    parser.add_argument("--date", help="Target date (YYYY-MM-DD). Default: today.")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing/pushing.")
    parser.add_argument("--phase", choices=["collect", "analyze", "generate", "blog", "publish", "all"],
                        default="all", help="Run a specific phase.")
    parser.add_argument("--stats", action="store_true", help="Show pipeline history.")
    args = parser.parse_args()

    if args.stats:
        show_stats()
        return

    load_env()
    target_date = args.date or datetime.now().strftime("%Y-%m-%d")
    config = load_config()

    print(f"content intelligence pipeline: {target_date}")
    print(f"phase: {args.phase}")
    if args.dry_run:
        print("mode: DRY RUN")

    start = time.time()

    if args.phase in ("collect", "all"):
        phase_collect(target_date, config, dry_run=args.dry_run)

    if args.phase in ("analyze", "all"):
        phase_analyze(target_date, config, dry_run=args.dry_run)

    if args.phase in ("generate", "all"):
        phase_generate(target_date, config, dry_run=args.dry_run)

    if args.phase in ("blog", "all"):
        phase_blog(target_date, config, dry_run=args.dry_run)

    if args.phase in ("publish", "all"):
        phase_publish(target_date, config, dry_run=args.dry_run)

    elapsed = time.time() - start
    print(f"\ndone. {elapsed:.1f}s elapsed.")


if __name__ == "__main__":
    main()
