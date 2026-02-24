#!/usr/bin/env python3
"""
nio_blog_generator.py — Daily nio.log blog post generator.

Self-contained Python script with soul/voice injection, anti-slop validation,
SQLite self-learning from past posts, and audit logging.

Usage:
    python3 scripts/nio_blog_generator.py                     # generate today's post
    python3 scripts/nio_blog_generator.py --dry-run            # print without writing
    python3 scripts/nio_blog_generator.py --date 2026-02-25   # specific date
    python3 scripts/nio_blog_generator.py --stats              # show generation history
"""

import argparse
import json
import re
import sqlite3
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = REPO_ROOT / "data" / "index.db"
NIO_LOG_DIR = REPO_ROOT / "content" / "nio-log"
SOUL_PATH = REPO_ROOT / "website" / "apps" / "nio-chat" / "souls" / "nio-soul.md"
WRITER_SOUL_PATH = REPO_ROOT / "website" / "apps" / "nio-chat" / "souls" / "writer-soul.md"
ANTI_SLOP_PATH = REPO_ROOT / "skills" / "tier-1-voice-dna" / "anti-slop.md"
CORE_VOICE_PATH = REPO_ROOT / "skills" / "tier-1-voice-dna" / "core-voice.md"
CANONICAL_SOUL_PATH = Path.home() / ".openclaw" / "workspace" / "SOUL.md"
SEO_BRIEF_PATH = Path.home() / ".openclaw" / "workspace" / "seo" / "daily-brief.json"
CLAUDE_CLI = "/opt/homebrew/bin/claude"

# ── Anti-Slop Patterns ───────────────────────────────────────────────

ANTI_SLOP_RULES = [
    # (pattern, description, auto_fixable, fix_func_or_None)
    (r"—", "em-dash", True, lambda m: "."),
    (r"–", "en-dash", True, lambda m: "."),
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

    # Clean up double spaces and empty lines from removals
    fixed = re.sub(r"  +", " ", fixed)
    fixed = re.sub(r"\n{3,}", "\n\n", fixed)
    fixed = re.sub(r"^\.\s*$", "", fixed, flags=re.MULTILINE)

    # Score: 100 = perfect, -10 per violation type
    score = max(0.0, 100.0 - len(violations) * 10.0)
    return score, violations, fixed


# ── System Prompt Construction ────────────────────────────────────────

def build_system_prompt() -> str:
    """Layer soul files into a system prompt."""
    parts = []

    # Layer 1: Nio identity
    if SOUL_PATH.exists():
        parts.append(f"# IDENTITY\n\n{SOUL_PATH.read_text(errors='replace')}")

    # Layer 2: Core voice principles
    if CORE_VOICE_PATH.exists():
        voice = CORE_VOICE_PATH.read_text(errors="replace")
        # Extract just the voice characteristics and rules, skip GTM-specific stuff
        parts.append(f"# VOICE PRINCIPLES (apply to blog writing)\n\n{voice[:2000]}")

    # Layer 3: Anti-slop rules
    if ANTI_SLOP_PATH.exists():
        parts.append(f"# ANTI-SLOP RULES (mandatory)\n\n{ANTI_SLOP_PATH.read_text(errors='replace')}")

    # Layer 4: Blog canonical structure from SOUL.md
    if CANONICAL_SOUL_PATH.exists():
        soul_text = CANONICAL_SOUL_PATH.read_text(errors="replace")
        struct_match = re.search(
            r"## Blog Canonical Structure.*?(?=^## |\Z)",
            soul_text,
            re.MULTILINE | re.DOTALL,
        )
        if struct_match:
            parts.append(f"# BLOG STRUCTURE (mandatory)\n\n{struct_match.group(0)}")

    # Layer 5: Writer soul
    if WRITER_SOUL_PATH.exists():
        parts.append(f"# WRITER MODE\n\n{WRITER_SOUL_PATH.read_text(errors='replace')}")

    return "\n\n---\n\n".join(parts)


# ── Context Injection (SQLite-powered) ────────────────────────────────

def get_daily_log_context(db: sqlite3.Connection, target_date: str) -> str:
    """Get recent daily logs from SQLite for context injection."""
    rows = db.execute(
        """SELECT date, letter_grade, commits_today, shipped_count, output_score
           FROM daily_logs
           WHERE date <= ?
           ORDER BY date DESC LIMIT 3""",
        (target_date,),
    ).fetchall()

    if not rows:
        return "no recent daily logs available."

    lines = ["recent daily logs:"]
    for date, grade, commits, shipped, score in rows:
        parts = [f"  {date}:"]
        if grade:
            parts.append(f"grade={grade}")
        if commits:
            parts.append(f"commits={commits}")
        if shipped:
            parts.append(f"shipped={shipped}")
        if score:
            parts.append(f"score={score}")
        lines.append(" ".join(parts))
    return "\n".join(lines)


def get_past_posts_context(db: sqlite3.Connection, target_date: str) -> str:
    """Get recent nio-log posts from SQLite body column."""
    rows = db.execute(
        """SELECT slug, title, body FROM content
           WHERE platform = 'nio-log' AND date < ? AND body IS NOT NULL
           ORDER BY date DESC LIMIT 3""",
        (target_date,),
    ).fetchall()

    if not rows:
        return "no previous posts to reference."

    lines = ["recent posts (study voice and avoid repeating themes):"]
    for slug, title, body in rows:
        # Truncate body to ~500 chars for context
        excerpt = body[:500].strip()
        if len(body) > 500:
            excerpt += "..."
        lines.append(f"\n--- {slug}: {title} ---\n{excerpt}")
    return "\n".join(lines)


def check_topic_overlap(db: sqlite3.Connection, proposed_topic: str) -> str:
    """Use FTS5 to check if a topic was already covered."""
    if not proposed_topic:
        return ""

    try:
        rows = db.execute(
            "SELECT title FROM content_fts WHERE content_fts MATCH ? LIMIT 5",
            (proposed_topic,),
        ).fetchall()
        if rows:
            titles = [r[0] for r in rows if r[0]]
            return f"topic overlap warning. these posts already cover similar ground: {', '.join(titles)}. find a fresh angle."
        return ""
    except sqlite3.OperationalError:
        return ""


def get_anti_slop_trend(db: sqlite3.Connection) -> str:
    """Check recent generation anti-slop scores for trend warnings."""
    try:
        rows = db.execute(
            """SELECT anti_slop_score, anti_slop_violations
               FROM blog_generations
               ORDER BY created_at DESC LIMIT 5"""
        ).fetchall()
    except sqlite3.OperationalError:
        return ""

    if not rows:
        return ""

    scores = [r[0] for r in rows if r[0] is not None]
    if not scores:
        return ""

    avg = sum(scores) / len(scores)
    if avg < 80:
        # Parse violation patterns
        all_violations = []
        for _, violations_json in rows:
            if violations_json:
                try:
                    all_violations.extend(json.loads(violations_json))
                except json.JSONDecodeError:
                    pass
        common = {}
        for v in all_violations:
            key = v.split(":")[0].strip()
            common[key] = common.get(key, 0) + 1
        worst = sorted(common.items(), key=lambda x: -x[1])[:3]
        patterns = ", ".join(f"{k} ({v}x)" for k, v in worst)
        return f"anti-slop scores trending low (avg {avg:.0f}/100). watch out for: {patterns}"

    return ""


def get_seo_context() -> str:
    """Read SEO brief for today's keyword target."""
    if not SEO_BRIEF_PATH.exists():
        return ""

    try:
        data = json.loads(SEO_BRIEF_PATH.read_text())
        kw = data.get("target_keyword", "")
        pillar = data.get("content_pillar", "")
        if kw:
            return f"SEO target keyword (weave naturally, don't force): {kw}\ncontent pillar: {pillar}"
    except (json.JSONDecodeError, OSError):
        pass
    return ""


def get_git_context() -> str:
    """Get recent git activity for 'what was built' context."""
    try:
        result = subprocess.run(
            ["git", "-C", str(REPO_ROOT), "log", "--oneline", "-10", "--since=yesterday"],
            capture_output=True,
            text=True,
        )
        if result.stdout.strip():
            return f"recent commits (since yesterday):\n{result.stdout.strip()}"
    except OSError:
        pass
    return "no recent git commits found."


def build_user_prompt(target_date: str, db: sqlite3.Connection) -> str:
    """Assemble context-rich user prompt."""
    parts = [
        f"write the nio.log entry for {target_date}.",
        "",
        "follow the 6-section canonical structure exactly:",
        "1. system status (one honest line)",
        "2. what was built/changed (explain what changed and WHY it matters, not a file-by-file inventory. your reader is a curious non-technical person who wants to learn how AI development works. use plain language. say what the improvement does for the user or the system, not which .tsx file was edited.)",
        "3. observations (pattern recognition, original thought. connect the work to bigger ideas someone outside tech could appreciate.)",
        "4. gaps / honest critique (mandatory. no all-sunshine posts)",
        "5. tomorrow's focus (specific next actions)",
        "6. random thought (optional, philosophical/meta)",
        "",
        "output ONLY the markdown body (no frontmatter, no title heading).",
        "start directly with ## system status.",
        "use lowercase for headings and body text (except I and proper nouns).",
        "your audience is builders and curious people, not engineers reading a changelog. teach, don't list.",
        "",
        "--- CONTEXT ---",
        "",
        get_daily_log_context(db, target_date),
        "",
        get_git_context(),
        "",
        get_past_posts_context(db, target_date),
    ]

    seo = get_seo_context()
    if seo:
        parts.extend(["", seo])

    overlap = check_topic_overlap(db, "context switching workflow automation")
    if overlap:
        parts.extend(["", overlap])

    trend = get_anti_slop_trend(db)
    if trend:
        parts.extend(["", trend])

    return "\n".join(parts)


# ── Claude CLI Call ───────────────────────────────────────────────────

def call_claude(system_prompt: str, user_prompt: str) -> dict:
    """Call Claude via the claude CLI (Max subscription, no API key needed).

    Uses `claude -p` (print mode) with --system-prompt for non-interactive generation.
    Returns dict with content and estimated token counts.
    """
    full_prompt = f"{system_prompt}\n\n---\n\n{user_prompt}"

    result = subprocess.run(
        [CLAUDE_CLI, "-p", "--model", "opus", "--output-format", "text"],
        input=full_prompt,
        capture_output=True,
        text=True,
        timeout=180,
        cwd=str(REPO_ROOT),
    )

    if result.returncode != 0:
        print(f"ERROR: claude CLI failed (exit {result.returncode})", file=sys.stderr)
        if result.stderr:
            print(f"  stderr: {result.stderr[:500]}", file=sys.stderr)
        sys.exit(1)

    content = result.stdout.strip()

    # Estimate token counts (CLI doesn't report exact usage)
    est_input = len(full_prompt) // 4
    est_output = len(content) // 4

    return {
        "content": content,
        "input_tokens": est_input,
        "output_tokens": est_output,
    }


# ── Output Pipeline ──────────────────────────────────────────────────

def build_frontmatter(target_date: str, title: str, body: str, seo_keyword: str) -> str:
    """Build YAML frontmatter for the post."""
    # Extract preview from first paragraph after first heading
    preview_text = ""
    for line in body.split("\n"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        preview_text = line[:200]
        break

    return f"""---
title: "{title}"
date: "{target_date}"
timestamp: "8:00am EST"
preview: "{preview_text}"
seo_keyword: "{seo_keyword}"
---"""


def extract_title(body: str) -> str:
    """Extract a title from the post body (first ## heading content or first line)."""
    for line in body.split("\n"):
        line = line.strip()
        if line.startswith("## system status"):
            # Use the status line content as title hint
            status = line.replace("## system status:", "").replace("## system status", "").strip()
            if status:
                return status.upper()
    # Fallback: use first non-empty non-heading line
    for line in body.split("\n"):
        line = line.strip()
        if line and not line.startswith("#"):
            words = line.split()[:6]
            return " ".join(words).upper()
    return "DAILY LOG"


def write_post(target_date: str, body: str, seo_keyword: str, dry_run: bool = False) -> Path:
    """Write the post to content/nio-log/."""
    title = extract_title(body)
    frontmatter = build_frontmatter(target_date, title, body, seo_keyword)
    full_content = f"{frontmatter}\n\n{body}\n\n---\n*automated by nio via daily cron*\n*builder mode active.*\n"

    filepath = NIO_LOG_DIR / f"{target_date}.md"

    if dry_run:
        print("\n=== DRY RUN OUTPUT ===\n")
        print(full_content)
        print(f"\n=== Would write to: {filepath} ===")
        return filepath

    NIO_LOG_DIR.mkdir(parents=True, exist_ok=True)
    filepath.write_text(full_content)
    print(f"wrote: {filepath}")
    return filepath


def log_generation(db: sqlite3.Connection, target_date: str, slug: str,
                   input_tokens: int, output_tokens: int, cost_cents: float,
                   score: float, violations: list, retries: int,
                   seo_keyword: str, generation_time_ms: int):
    """Log generation metadata to blog_generations table."""
    try:
        db.execute(
            """INSERT OR REPLACE INTO blog_generations
               (date, slug, model, input_tokens, output_tokens, cost_cents,
                anti_slop_score, anti_slop_violations, retries, seo_keyword,
                daily_log_date, generation_time_ms)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                target_date, slug, "claude-code-max-opus",
                input_tokens, output_tokens, cost_cents,
                score, json.dumps(violations), retries, seo_keyword,
                target_date, generation_time_ms,
            ),
        )
        db.commit()
    except sqlite3.OperationalError as e:
        print(f"warning: could not log generation: {e}", file=sys.stderr)


def reindex():
    """Run build_index.py to update the SQLite index."""
    script = REPO_ROOT / "scripts" / "build_index.py"
    result = subprocess.run(
        [sys.executable, str(script)],
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )
    if result.returncode != 0:
        print(f"warning: reindex failed: {result.stderr}", file=sys.stderr)
    else:
        print("reindexed successfully.")


def git_commit_and_push(target_date: str):
    """Git add, commit, and push the new post."""
    post_path = f"content/nio-log/{target_date}.md"
    try:
        subprocess.run(
            ["git", "-C", str(REPO_ROOT), "add", post_path],
            check=True,
            capture_output=True,
        )
        subprocess.run(
            ["git", "-C", str(REPO_ROOT), "commit", "-m",
             f"feat: nio.log {target_date} — automated daily post"],
            check=True,
            capture_output=True,
        )
        subprocess.run(
            ["git", "-C", str(REPO_ROOT), "push"],
            check=True,
            capture_output=True,
        )
        print(f"committed and pushed: {post_path}")
    except subprocess.CalledProcessError as e:
        print(f"warning: git operation failed: {e.stderr.decode() if e.stderr else e}", file=sys.stderr)


# ── Stats Command ─────────────────────────────────────────────────────

def show_stats():
    """Print generation history from blog_generations table."""
    if not DB_PATH.exists():
        print("no index.db found. run build_index.py first.")
        return

    db = sqlite3.connect(str(DB_PATH))
    try:
        rows = db.execute(
            """SELECT date, slug, model, input_tokens, output_tokens, cost_cents,
                      anti_slop_score, retries, generation_time_ms, created_at
               FROM blog_generations
               ORDER BY created_at DESC"""
        ).fetchall()
    except sqlite3.OperationalError:
        print("blog_generations table not found. run build_index.py to create schema.")
        return

    if not rows:
        print("no generation history yet.")
        return

    total_cost = 0.0
    total_tokens = 0
    print(f"\n{'date':<12} {'slug':<16} {'tokens':>8} {'cost':>8} {'slop':>6} {'retries':>8} {'time':>8}")
    print("-" * 78)
    for date, slug, model, inp, out, cost, score, retries, time_ms, created in rows:
        tokens = (inp or 0) + (out or 0)
        total_tokens += tokens
        total_cost += cost or 0
        print(
            f"{date:<12} {slug:<16} {tokens:>8} ${(cost or 0)/100:>6.2f} "
            f"{score or 0:>5.0f}% {retries or 0:>7} {(time_ms or 0)/1000:>6.1f}s"
        )
    print("-" * 78)
    print(f"{'total':<12} {'':<16} {total_tokens:>8} ${total_cost/100:>6.2f}")
    print(f"\n{len(rows)} generations logged.")
    db.close()


# ── Main ──────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generate daily nio.log blog post")
    parser.add_argument("--date", help="Target date (YYYY-MM-DD). Default: today.")
    parser.add_argument("--dry-run", action="store_true", help="Print output without writing files.")
    parser.add_argument("--stats", action="store_true", help="Show generation history and exit.")
    parser.add_argument("--no-push", action="store_true", help="Skip git commit and push.")
    args = parser.parse_args()

    if args.stats:
        show_stats()
        return

    target_date = args.date or datetime.now().strftime("%Y-%m-%d")
    slug = target_date

    # Check if post already exists
    existing = NIO_LOG_DIR / f"{target_date}.md"
    if existing.exists() and not args.dry_run:
        print(f"post already exists: {existing}")
        print("use --dry-run to preview or delete the existing post first.")
        return

    # Verify claude CLI exists
    if not Path(CLAUDE_CLI).exists():
        print(f"ERROR: claude CLI not found at {CLAUDE_CLI}", file=sys.stderr)
        sys.exit(1)

    # Connect to SQLite
    if not DB_PATH.exists():
        print("warning: index.db not found. running without SQLite context.")
        db = sqlite3.connect(":memory:")
    else:
        db = sqlite3.connect(str(DB_PATH))

    # Build prompts
    print(f"generating nio.log for {target_date}...")
    system_prompt = build_system_prompt()
    user_prompt = build_user_prompt(target_date, db)

    # Get SEO keyword
    seo_keyword = ""
    if SEO_BRIEF_PATH.exists():
        try:
            seo_data = json.loads(SEO_BRIEF_PATH.read_text())
            seo_keyword = seo_data.get("target_keyword", "")
        except (json.JSONDecodeError, OSError):
            pass

    # Generate with retries for anti-slop
    max_retries = 2
    best_body = ""
    best_score = 0.0
    best_violations = []
    total_input = 0
    total_output = 0
    start_time = time.time()

    for attempt in range(max_retries + 1):
        if attempt > 0:
            print(f"  retry {attempt}/{max_retries} (anti-slop score was {best_score:.0f}%)...")
            # Add violation feedback to prompt
            violation_list = "\n".join(f"  - {v}" for v in best_violations)
            retry_prompt = (
                f"{user_prompt}\n\n"
                f"IMPORTANT: your previous attempt had these anti-slop violations:\n"
                f"{violation_list}\n"
                f"avoid these patterns completely in this attempt."
            )
        else:
            retry_prompt = user_prompt

        result = call_claude(system_prompt, retry_prompt)
        total_input += result["input_tokens"]
        total_output += result["output_tokens"]

        body = result["content"].strip()
        score, violations, fixed_body = validate_anti_slop(body)

        print(f"  attempt {attempt + 1}: {result['input_tokens']}+{result['output_tokens']} tokens, anti-slop: {score:.0f}%")
        if violations:
            for v in violations:
                print(f"    caught: {v}")

        if score >= 80 or attempt == max_retries:
            best_body = fixed_body
            best_score = score
            best_violations = violations
            break

        best_body = fixed_body
        best_score = score
        best_violations = violations

    elapsed_ms = int((time.time() - start_time) * 1000)

    # No API cost — runs on Claude Code Max subscription
    cost_cents = 0.0

    print(f"\nfinal: ~{total_input + total_output} tokens (est), anti-slop: {best_score:.0f}%, {elapsed_ms/1000:.1f}s")

    # Write post
    filepath = write_post(target_date, best_body, seo_keyword, dry_run=args.dry_run)

    if not args.dry_run:
        # Log generation metadata
        log_generation(
            db, target_date, slug, total_input, total_output,
            cost_cents, best_score, best_violations,
            max_retries - (max_retries + 1 - (best_score >= 80)),
            seo_keyword, elapsed_ms,
        )

        # Reindex
        reindex()

        # Git commit and push
        if not args.no_push:
            git_commit_and_push(target_date)

    db.close()
    print("done.")


if __name__ == "__main__":
    main()
