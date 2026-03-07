#!/usr/bin/env python3
"""
linkedin_post_generator.py - Generate LinkedIn posts from scout data.

Reads today's scout output, generates 10 LinkedIn posts using Claude CLI
with voice rules and anti-slop validation.

Usage:
    python3 scripts/linkedin_post_generator.py          # generate today's posts
    python3 scripts/linkedin_post_generator.py --test   # generate 3 posts, print only
    python3 scripts/linkedin_post_generator.py --date 2026-02-28  # specific date
"""

import argparse
import json
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SCOUT_DIR = REPO_ROOT / "data" / "linkedin" / "scout"
POSTS_DIR = REPO_ROOT / "data" / "linkedin" / "posts"
CORE_VOICE_PATH = REPO_ROOT / "skills" / "tier-1-voice-dna" / "core-voice.md"
ANTI_SLOP_PATH = REPO_ROOT / "skills" / "tier-1-voice-dna" / "anti-slop.md"
CLAUDE_CLI = "/opt/homebrew/bin/claude"


# -- Anti-Slop Patterns (from nio_blog_generator.py) -------------------------

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
    (r"[Gg]reat question!", "sycophantic opener", True, lambda m: ""),
    (r"[Aa]bsolutely!", "sycophantic opener", True, lambda m: ""),
]


def validate_anti_slop(text: str) -> tuple[float, list[str], str]:
    """Validate text against anti-slop rules. Returns (score, violations, fixed_text)."""
    violations = []
    fixed = text

    for pattern, desc, auto_fixable, fix_func in ANTI_SLOP_RULES:
        matches = list(re.finditer(pattern, fixed))
        if matches:
            violations.append(f"{desc}: {len(matches)} occurrence(s)")
            if auto_fixable and fix_func:
                fixed = re.sub(pattern, fix_func, fixed)

    # Clean up artifacts
    fixed = re.sub(r"  +", " ", fixed)
    fixed = re.sub(r"\n{3,}", "\n\n", fixed)
    fixed = re.sub(r"^\.\s*$", "", fixed, flags=re.MULTILINE)

    score = max(0.0, 100.0 - len(violations) * 10.0)
    return score, violations, fixed


# -- System Prompt Construction -----------------------------------------------

def build_system_prompt() -> str:
    """Build system prompt with voice rules and anti-slop."""
    parts = []

    if CORE_VOICE_PATH.exists():
        voice = CORE_VOICE_PATH.read_text(errors="replace")
        parts.append(f"# VOICE PRINCIPLES\n\n{voice[:2000]}")

    if ANTI_SLOP_PATH.exists():
        parts.append(f"# ANTI-SLOP RULES (mandatory)\n\n{ANTI_SLOP_PATH.read_text(errors='replace')}")

    parts.append("""# LINKEDIN POST RULES

You are generating LinkedIn posts for a practitioner-builder audience. The voice is someone who actually builds things with AI, GTM tools, and code. Not an advisor, not a thought leader. A builder.

CRITICAL - VARIETY RULES:
- NEVER repeat the same origin story or personal arc across posts. No "I used to send 200 emails" or "I went from X to Y" in more than 1 post per batch.
- Each post must use a DIFFERENT narrative angle. Rotate between: industry observation, tactical how-to, tool comparison, contrarian take, pattern recognition, build log, failure story, future prediction, framework breakdown, market shift analysis.
- Mix the protagonist: some posts are first-person builder perspective, some are observational ("teams that do X outperform"), some are analytical ("the data on Y shows"), some tell a composite story of multiple builders.
- Vary specificity: some posts name exact tools/numbers, some discuss patterns at a higher level.
- NEVER use the same hook structure twice in a batch.

Post rules:
- NO em-dashes. Use periods or commas instead.
- Practitioner tone. Sound like you build things, not like you advise people who build things.
- Lowercase energy. Substance over polish.
- Each post: 150-300 words. Hook line first, body, then CTA.
- Be specific where it matters. Name tools, share numbers, describe real workflows.
- No engagement bait. No "agree?" endings. Real questions only.
- Posts should teach, share a perspective, or challenge conventional thinking.
- Vary the format: some tactical how-tos, some hot takes, some pattern observations, some build logs, some contrarian takes, some future predictions.""")

    return "\n\n---\n\n".join(parts)


def build_user_prompt(scout_data: dict, count: int = 10) -> str:
    """Build user prompt from scout data."""
    sources_summary = []
    for s in scout_data.get("sources", [])[:15]:
        tags = ", ".join(s.get("tags", []))
        eng = s.get("engagement", {})
        likes = eng.get("likes", 0)
        comments = eng.get("comments", 0)
        sources_summary.append(
            f"- [{s.get('domain', '?')}] {s.get('author', '?')}: {s.get('post_summary', '')[:120]} "
            f"(likes: {likes}, comments: {comments}) tags: {tags}"
        )

    sources_text = "\n".join(sources_summary) if sources_summary else "No specific sources available. Generate posts based on current AI/GTM/builder trends."

    return f"""Generate {count} LinkedIn posts inspired by these trending topics.

Each post should be a COMPLETE, ready-to-post LinkedIn post. Draw inspiration from the topics but make the posts original - Shawn's perspective, Shawn's experiences, Shawn's voice.

--- TRENDING SOURCES ---
{sources_text}

--- OUTPUT FORMAT ---
Return ONLY a JSON array. Each item:
{{
  "title": "short internal title for the post",
  "hook": "the first 1-2 lines that grab attention (this appears before the 'see more' fold)",
  "body": "the full post body including the hook (150-300 words total)",
  "cta": "closing question or call to action",
  "tags": ["tag1", "tag2", "tag3"],
  "inspired_by_index": index_of_source_that_inspired_this (0-based, or -1 if general)
}}

Vary the styles: some tactical how-tos, some hot takes, some personal stories, some pattern observations. No two posts should feel the same."""


# -- Claude CLI Call ----------------------------------------------------------

def call_claude(system_prompt: str, user_prompt: str, timeout: int = 300) -> str:
    """Call Claude via CLI (Max subscription, no API key needed)."""
    full_prompt = f"{system_prompt}\n\n---\n\n{user_prompt}"

    result = subprocess.run(
        [CLAUDE_CLI, "-p", "--model", "opus", "--output-format", "text"],
        input=full_prompt,
        capture_output=True,
        text=True,
        timeout=timeout,
        cwd=str(REPO_ROOT),
    )

    if result.returncode != 0:
        print(f"ERROR: claude CLI failed (exit {result.returncode})", file=sys.stderr)
        if result.stderr:
            print(f"  stderr: {result.stderr[:500]}", file=sys.stderr)
        sys.exit(1)

    return result.stdout.strip()


def parse_json_response(raw: str) -> list | dict | None:
    """Extract JSON from Claude response, handling code fences."""
    text = raw.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
    if text.startswith("json"):
        text = text[4:].strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
    return None


# -- Variation Generation -----------------------------------------------------

def _build_variation_prompt(summaries: list[dict]) -> str:
    """Build the variation prompt for a batch of posts."""
    return f"""You are generating variations of LinkedIn posts. For each post below, generate:

1. TWO remix variants - completely different angles on the same topic. New hook, body, and CTA. Same core insight, fresh narrative approach.
2. TWO tone variants of the body text only:
   - "advisor": authoritative, consulting-style. "Here's what I recommend..." energy.
   - "provocateur": edgy, contrarian, challenges assumptions. Spicy takes.
3. TWO platform variants of the body text only:
   - "x": Twitter/X format. Punchy, under 280 chars, or a thread with numbered points (1/, 2/, 3/).
   - "newsletter": Personal newsletter intro style. Warmer, more conversational, as if writing to subscribers.

RULES:
- NO em-dashes anywhere. Use periods or commas.
- Remixes should be 150-300 words each.
- Tone variants are body-only rewrites, 150-300 words.
- X format: either one punchy tweet (<280 chars) or a thread (use "1/ ... 2/ ... 3/ ..." format).
- Newsletter format: 100-200 words, personal tone.
- Keep anti-slop rules: no "game-changer", "unleash", "supercharge", no sycophantic openers.

--- POSTS TO VARY ---
{json.dumps(summaries, indent=2)}

--- OUTPUT FORMAT ---
Return ONLY a JSON array. Each item:
{{
  "post_id": <id>,
  "remixes": [
    {{ "label": "short label like contrarian-flip or tactical-breakdown", "hook": "...", "body": "...", "cta": "..." }},
    {{ "label": "...", "hook": "...", "body": "...", "cta": "..." }}
  ],
  "tones": {{
    "advisor": "full body text in advisor tone",
    "provocateur": "full body text in provocateur tone"
  }},
  "platforms": {{
    "x": "tweet or thread format",
    "newsletter": "newsletter intro format"
  }}
}}"""


def _merge_variations(posts: list[dict], var_result: list[dict]):
    """Merge parsed variation results into posts."""
    var_map = {v["post_id"]: v for v in var_result if isinstance(v, dict)}
    for post in posts:
        v = var_map.get(post["id"])
        if not v:
            continue

        # Remixes - apply anti-slop
        remixes = []
        for remix in v.get("remixes", []):
            _, _, fixed_body = validate_anti_slop(remix.get("body", ""))
            remixes.append({
                "label": remix.get("label", "remix"),
                "hook": remix.get("hook", ""),
                "body": fixed_body,
                "cta": remix.get("cta", ""),
            })
        if remixes:
            post["remixes"] = remixes

        # Tones - apply anti-slop, include original as builder
        tones_raw = v.get("tones", {})
        if tones_raw:
            _, _, advisor_fixed = validate_anti_slop(tones_raw.get("advisor", ""))
            _, _, provocateur_fixed = validate_anti_slop(tones_raw.get("provocateur", ""))
            post["tones"] = {
                "builder": post["body"],
                "advisor": advisor_fixed,
                "provocateur": provocateur_fixed,
            }

        # Platforms - apply anti-slop, include original as linkedin
        plats_raw = v.get("platforms", {})
        if plats_raw:
            _, _, x_fixed = validate_anti_slop(plats_raw.get("x", ""))
            _, _, newsletter_fixed = validate_anti_slop(plats_raw.get("newsletter", ""))
            post["platforms"] = {
                "linkedin": post["body"],
                "x": x_fixed,
                "newsletter": newsletter_fixed,
            }


VARIATION_BATCH_SIZE = 5


def generate_variations(posts: list[dict]) -> list[dict]:
    """Generate remix, tone, and platform variations for each post in batches."""
    system = "You generate content variations. Return only valid JSON. No commentary."

    print(f"  generating variations in batches of {VARIATION_BATCH_SIZE}...")
    var_start = time.time()
    total_merged = 0

    for batch_start in range(0, len(posts), VARIATION_BATCH_SIZE):
        batch = posts[batch_start:batch_start + VARIATION_BATCH_SIZE]
        batch_num = batch_start // VARIATION_BATCH_SIZE + 1
        total_batches = (len(posts) + VARIATION_BATCH_SIZE - 1) // VARIATION_BATCH_SIZE

        summaries = []
        for p in batch:
            summaries.append({
                "id": p["id"],
                "title": p["title"],
                "hook": p["hook"],
                "body": p["body"][:400],
                "cta": p["cta"],
                "tags": p["tags"],
            })

        print(f"    batch {batch_num}/{total_batches} (posts {batch[0]['id']}-{batch[-1]['id']})...", end=" ", flush=True)

        try:
            variation_prompt = _build_variation_prompt(summaries)
            raw = call_claude(system, variation_prompt, timeout=600)
            result = parse_json_response(raw)
            if not result or not isinstance(result, list):
                print("parse failed, skipping batch")
                continue

            _merge_variations(posts, result)
            merged = sum(1 for p in batch if p.get("tones"))
            total_merged += merged
            print(f"{merged}/{len(batch)} merged")

        except subprocess.TimeoutExpired:
            print("TIMEOUT, skipping batch")
        except Exception as e:
            print(f"failed: {e}")

    var_elapsed = time.time() - var_start
    print(f"  variations done: {total_merged}/{len(posts)} posts enriched ({var_elapsed:.1f}s)")

    return posts


# -- Main ---------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Generate LinkedIn posts from scout data")
    parser.add_argument("--test", action="store_true", help="Generate 3 posts, print only")
    parser.add_argument("--date", help="Target date (YYYY-MM-DD). Default: today.")
    args = parser.parse_args()

    target_date = args.date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    post_count = 3 if args.test else 10

    # Check for scout data
    scout_path = SCOUT_DIR / f"{target_date}.json"
    if not scout_path.exists():
        print(f"No scout data found for {target_date} at {scout_path}")
        print("Run linkedin_scout.py first, or specify --date")
        sys.exit(1)

    scout_data = json.loads(scout_path.read_text())
    print(f"[linkedin_post_generator] {target_date} | {len(scout_data.get('sources', []))} sources | generating {post_count} posts")

    # Verify Claude CLI
    if not Path(CLAUDE_CLI).exists():
        print(f"ERROR: claude CLI not found at {CLAUDE_CLI}", file=sys.stderr)
        sys.exit(1)

    # Build prompts
    system_prompt = build_system_prompt()
    user_prompt = build_user_prompt(scout_data, count=post_count)

    # Generate
    start_time = time.time()
    raw = call_claude(system_prompt, user_prompt)
    elapsed = time.time() - start_time

    # Parse JSON
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()
    if raw.startswith("json"):
        raw = raw[4:].strip()

    try:
        posts_raw = json.loads(raw)
    except json.JSONDecodeError:
        # Try to extract JSON array from response
        match = re.search(r'\[.*\]', raw, re.DOTALL)
        if match:
            try:
                posts_raw = json.loads(match.group(0))
            except json.JSONDecodeError:
                print("ERROR: Could not parse Claude response as JSON")
                print(f"Raw output (first 500 chars): {raw[:500]}")
                sys.exit(1)
        else:
            print("ERROR: Could not find JSON array in Claude response")
            print(f"Raw output (first 500 chars): {raw[:500]}")
            sys.exit(1)

    if not isinstance(posts_raw, list):
        print("ERROR: Expected JSON array")
        sys.exit(1)

    # Process posts with anti-slop validation
    sources = scout_data.get("sources", [])
    posts = []

    for i, post in enumerate(posts_raw):
        body = post.get("body", "")
        score, violations, fixed_body = validate_anti_slop(body)

        if violations:
            print(f"  post {i+1}: anti-slop caught {len(violations)} issue(s), auto-fixed")

        # Link to source if available
        inspired_idx = post.get("inspired_by_index", -1)
        inspired_by = None
        if isinstance(inspired_idx, int) and 0 <= inspired_idx < len(sources):
            src = sources[inspired_idx]
            inspired_by = {
                "author": src.get("author", ""),
                "summary": src.get("post_summary", ""),
                "url": src.get("url", "") or src.get("search_url", ""),
                "engagement": src.get("engagement", {}),
            }

        posts.append({
            "id": i + 1,
            "title": post.get("title", f"Post {i+1}"),
            "hook": post.get("hook", ""),
            "body": fixed_body,
            "cta": post.get("cta", ""),
            "tags": post.get("tags", []),
            "inspired_by": inspired_by,
            "anti_slop_score": score,
            "platform": "linkedin",
        })

    # Generate variations (remixes, tones, platforms)
    if posts and not args.test:
        posts = generate_variations(posts)
    elif posts and args.test:
        print("  (skipping variations in test mode)")

    # Calculate aggregate score
    avg_score = sum(p["anti_slop_score"] for p in posts) / len(posts) if posts else 0

    output = {
        "date": target_date,
        "generated_count": len(posts),
        "avg_anti_slop_score": round(avg_score, 1),
        "generation_time_seconds": round(elapsed, 1),
        "engine": "claude-cli-opus",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "posts": posts,
    }

    if args.test:
        print(f"\n=== TEST OUTPUT ({len(posts)} posts, avg slop: {avg_score:.0f}%, {elapsed:.1f}s) ===\n")
        for p in posts:
            print(f"--- Post {p['id']}: {p['title']} (slop: {p['anti_slop_score']:.0f}%) ---")
            print(p["body"][:300])
            print(f"\nCTA: {p['cta']}")
            print(f"Tags: {', '.join(p['tags'])}")
            if p["inspired_by"]:
                print(f"Inspired by: {p['inspired_by']['author']}")
            print()
        return

    # Write output
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    output_path = POSTS_DIR / f"{target_date}.json"
    output_path.write_text(json.dumps(output, indent=2))
    print(f"\nDone. {len(posts)} posts saved to {output_path}")
    print(f"  avg anti-slop: {avg_score:.0f}% | time: {elapsed:.1f}s")


if __name__ == "__main__":
    main()
