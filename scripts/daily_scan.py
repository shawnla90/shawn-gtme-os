#!/usr/bin/env python3
"""
Daily activity scanner v4 — commit-based classification, scoring, and dev equivalent metrics.
Writes data/daily-log/YYYY-MM-DD.json. Safe to run multiple times (merges, never deletes manual entries).

v4: Commit-level scoring (replaces file-level), dev equivalent explainer, token efficiency,
    dual cost tracking (API equivalent vs actual $0 on Max subscription).
v3: Auto-detect Claude Code tokens from JSONL, scoring engine with letter grades, efficiency rating.

Usage:
    python3 scripts/daily_scan.py              # scan today
    python3 scripts/daily_scan.py --date 2026-02-11   # scan specific date
"""

import argparse
import json
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
LOG_DIR = REPO_ROOT / "data" / "daily-log"
CONTENT_DIR = REPO_ROOT / "content"
WORKFLOWS_DIR = REPO_ROOT / "workflows"
SKILLS_DIR = REPO_ROOT / ".cursor" / "skills"
CLIENTS_DIR = REPO_ROOT / "clients"
CLAUDE_SKILLS_DIR = REPO_ROOT / ".claude" / "skills"
CURSOR_RULES_DIR = REPO_ROOT / ".cursor" / "rules"
SCRIPTS_DIR = REPO_ROOT / "scripts"
WEBSITE_DIR = REPO_ROOT / "website"

PLATFORMS = ["linkedin", "x", "substack", "tiktok", "reddit"]

# ── LOC classification by file extension ──────────────────────────────
CODE_EXTENSIONS = {".py", ".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".sh", ".sql", ".go", ".rs"}
CONTENT_EXTENSIONS = {".md", ".txt", ".mdx"}
# Everything else (.json, .yaml, .csv, .env, etc.) = "data"

# Directories to scan by file modification time (mtime) for daily work detection.
# This catches files that don't have date prefixes in their names (e.g., icp.md, SKILL.md).
MTIME_SCAN_DIRS = [
    CLIENTS_DIR,
    SKILLS_DIR,
    CLAUDE_SKILLS_DIR,
    WORKFLOWS_DIR,
    CURSOR_RULES_DIR,
    SCRIPTS_DIR,
    CONTENT_DIR,
    WEBSITE_DIR,
]

# ── Claude Code project dir (for token auto-detection) ───────────────
# Claude Code stores JSONL transcripts per-session in ~/.claude/projects/<slug>/
CLAUDE_PROJECTS_DIR = Path.home() / ".claude" / "projects"

# Map repo root to the Claude Code project slug
# Claude Code uses the full path with / replaced by - (keeps leading -)
_repo_str = str(REPO_ROOT).replace("/", "-")
CLAUDE_PROJECT_SLUG = CLAUDE_PROJECTS_DIR / _repo_str

# ── Cursor IDE local data (for token auto-detection) ─────────────────
# Cursor stores code-block tracking in a SQLite DB and conversation logs as txt files.
CURSOR_PROJECTS_DIR = Path.home() / ".cursor" / "projects"
_cursor_slug = str(REPO_ROOT).replace("/", "-").lstrip("-")
CURSOR_PROJECT_DIR = CURSOR_PROJECTS_DIR / _cursor_slug
CURSOR_TRANSCRIPTS_DIR = CURSOR_PROJECT_DIR / "agent-transcripts"
CURSOR_TRACKING_DB = Path.home() / ".cursor" / "ai-tracking" / "ai-code-tracking.db"

# ── Token pricing (per million tokens) ───────────────────────────────
# Cache pricing: read = 10% of input, creation = 125% of input
TOKEN_PRICING = {
    "opus":   {"input": 15.00, "output": 75.00, "cache_read": 1.50,  "cache_write": 18.75},
    "sonnet": {"input": 3.00,  "output": 15.00, "cache_read": 0.30,  "cache_write": 3.75},
    "haiku":  {"input": 0.25,  "output": 1.25,  "cache_read": 0.025, "cache_write": 0.3125},
    "gpt4o":  {"input": 2.50,  "output": 10.00, "cache_read": 0.25,  "cache_write": 3.125},
    "gemini": {"input": 1.25,  "output": 5.00,  "cache_read": 0.3125, "cache_write": 1.5625},
    "cursor": {"input": 0.00,  "output": 0.00,  "cache_read": 0.00,  "cache_write": 0.00},
    "max":    {"input": 0.00,  "output": 0.00,  "cache_read": 0.00,  "cache_write": 0.00},
}

# ── Scoring weights ──────────────────────────────────────────────────
# High-value types (real building): monorepo, features, landing, infra
SCORE_WEIGHTS = {
    "monorepo_build":      50,  # Turborepo scaffold, project_scaffold
    "feature_system":     30,  # RPG, dashboard, complex shared components
    "landing_page":        25,  # Home/full page build
    "system_engine":       50,  # rpg_sprites.py — multi-layered animation/timer/unlock system
    "feature_script":      30,  # Named complex scripts (FEATURE_SCRIPTS set)
    "complex_script":      25,  # Auto-detected: 400+ lines, not in named sets
    "code_infra":          15,  # Real infrastructure scripts (scripts/*.py, custom configs)
    "config_file":          0,  # Boilerplate config (package.json, tsconfig.json, vercel.json, next.config.ts)
    "final":               10,  # *_final
    "manual":               5,
    "skill_updated":       5,
    "skill_created":       5,
    "workflow_updated":    5,
    "lead_magnet":         5,
    # GTM ops — partner/client deliverables
    "partner_onboard":     8,  # Full partner SKILL.md = high-value deliverable
    "partner_prompt":      5,  # Prompts (web-reveal, campaign-copy, etc.)
    "partner_research":    5,  # ICP, personas, strategy docs
    "partner_workflow":    5,  # Campaign monitoring, patterns, etc.
    "partner_resource":    2,  # Contacts, transcripts, etc.
    "client_onboard":      8,
    "client_prompt":       5,
    "client_research":     5,
    "client_workflow":     5,
    "client_resource":     2,
    # Website — pages, components, shared libs, config (base weights)
    "website_page":        5,  # Full page (app/**/page.tsx)
    "website_component":   5,  # Shared UI component
    "website_lib":         3,  # Shared utility / lib
    "website_route":       3,  # API route, RSS, OG image
    "website_style":       2,  # CSS / design tokens
    "website_config":      1,  # Fallback when not upgraded to code_infra
    "cursor_rule":         3,  # .cursor/rules/*.md
    "draft":               2,  # *_draft
    "script":              2,  # Fallback when not upgraded to code_infra
    # Video / design assets
    "video_rendered":     20,  # New video output
    "thumbnail_rendered": 10,  # New thumbnail/carousel image
    "avatar_generated":    5,  # New avatar/sprite asset
}

# Components that count as feature_system (RPG, dashboard, complex UI)
FEATURE_COMPONENTS = frozenset({
    "DailyLogView", "LogCard", "LogHero", "LogDetailIntro", "AvatarBadge",
    "TypewriterHero", "SkillGuidePage",
})

# rpg_sprites is system_engine (50 pts) — handled separately in classify_file()
FEATURE_SCRIPTS = frozenset({
    "avatar_generator", "progression_engine",
    "daily_scan", "daily_dashboard",
})

GRADE_THRESHOLDS = [
    (300, "S+"),   # Legendary session
    (200, "S"),
    (100, "A+"),
    (40,  "A"),
    (15,  "B"),
    (5,   "C"),
    (0,   "D"),
]

# ── V4 Commit-Based Scoring ─────────────────────────────────────────

V4_GRADE_THRESHOLDS = [
    (500, "S+"),   # Historic day — multiple systems built
    (300, "S"),    # Monster day — major feature + supporting work
    (150, "A+"),   # Strong day — a real feature shipped
    (75,  "A"),    # Solid day — meaningful progress
    (30,  "B"),    # Light day — fixes, content, small adds
    (10,  "C"),    # Maintenance — chores, minor edits
    (0,   "D"),    # Rest day
]

# Dev equivalent constants
DEV_LINES_PER_DAY = 150   # Industry average for meaningful, reviewed code
DEV_COST_PER_DAY = 500    # $125K/yr fully loaded

# ── Helpers ──────────────────────────────────────────────────────────

def run_git(*args):
    """Run a git command and return stdout lines."""
    result = subprocess.run(
        ["git", "-C", str(REPO_ROOT)] + list(args),
        capture_output=True, text=True
    )
    return result.stdout.strip().splitlines() if result.stdout.strip() else []


def classify_file(path_str):
    """Return (type_code, platform, title) for a repo-relative path, or None if not relevant."""
    p = path_str.replace("\\", "/")

    # Content files
    for plat in PLATFORMS:
        # Finalized content (check both .md and .txt for finals)
        if p.startswith(f"content/{plat}/final/") and (p.endswith(".md") or p.endswith(".txt")):
            slug = Path(p).stem
            title = re.sub(r"^\d{4}-\d{2}-\d{2}_", "", slug).replace("-", " ").replace("_", " ")
            return (f"{plat}_final", plat, title)

        # Draft content
        if p.startswith(f"content/{plat}/drafts/") and p.endswith(".md"):
            slug = Path(p).stem
            title = re.sub(r"^\d{4}-\d{2}-\d{2}_", "", slug).replace("-", " ").replace("_", " ")
            return (f"{plat}_draft", plat, title)

    # Lead magnet content
    if p.startswith("content/substack/lead-magnet/") and p.endswith(".md"):
        slug = Path(p).stem
        title = slug.replace("-", " ").replace("_", " ")
        return ("lead_magnet", "substack", title)

    # ── GTM Ops: Partner files ──────────────────────────────────────
    # PRIVACY: Never include partner/client names in titles — the dashboard
    # and tracker output are shareable. Use generic labels like
    # "partner campaign copy" instead of "<name> campaign copy".
    partner_match = re.match(r"clients/partner/([^/]+)/(.+)", p)
    if partner_match:
        sub_path = partner_match.group(2)

        # Partner SKILL.md — full onboard artifact
        if sub_path == "SKILL.md":
            return ("partner_onboard", None, "partner onboard skill")

        # Prompts (web-reveal, campaign-copy, personalization-research, signal-retrieval)
        if sub_path.startswith("prompts/") and sub_path.endswith(".md"):
            slug = Path(sub_path).stem
            title = f"partner {slug.replace('-', ' ')}"
            return ("partner_prompt", None, title)

        # Research (ICP, personas, strategy, pain-points, TAM)
        if sub_path.startswith("research/") and sub_path.endswith(".md"):
            slug = Path(sub_path).stem
            title = f"partner {slug.replace('-', ' ')}"
            return ("partner_research", None, title)

        # Workflows (campaign-monitoring, campaign-patterns, domain-management)
        if sub_path.startswith("workflows/") and sub_path.endswith(".md"):
            slug = Path(sub_path).stem
            title = f"partner {slug.replace('-', ' ')}"
            return ("partner_workflow", None, title)

        # Resources (contacts, transcripts, etc.)
        if sub_path.startswith("resources/") and sub_path.endswith(".md"):
            slug = Path(sub_path).stem
            title = f"partner {slug.replace('-', ' ')}"
            return ("partner_resource", None, title)

    # ── GTM Ops: Client files ───────────────────────────────────────
    client_match = re.match(r"clients/client/([^/]+)/(.+)", p)
    if client_match:
        sub_path = client_match.group(2)

        if sub_path == "SKILL.md":
            return ("client_onboard", None, "client onboard skill")

        if sub_path.startswith("prompts/") and sub_path.endswith(".md"):
            slug = Path(sub_path).stem
            title = f"client {slug.replace('-', ' ')}"
            return ("client_prompt", None, title)

        if sub_path.startswith("research/") and sub_path.endswith(".md"):
            slug = Path(sub_path).stem
            title = f"client {slug.replace('-', ' ')}"
            return ("client_research", None, title)

        if sub_path.startswith("workflows/") and sub_path.endswith(".md"):
            slug = Path(sub_path).stem
            title = f"client {slug.replace('-', ' ')}"
            return ("client_workflow", None, title)

        if sub_path.startswith("resources/") and sub_path.endswith(".md"):
            slug = Path(sub_path).stem
            title = f"client {slug.replace('-', ' ')}"
            return ("client_resource", None, title)

    # ── Website files ──────────────────────────────────────────────
    # Skip noise: node_modules, .next, .turbo, next-env.d.ts, lock files
    if p.startswith("website/") and not any(skip in p for skip in (
        "node_modules/", ".next/", ".turbo/", "next-env.d.ts", "package-lock.json"
    )):
        basename = Path(p).name
        stem = Path(p).stem

        # Monorepo scaffold — turbo.json signals Turborepo
        if "turbo.json" in p and p.startswith("website/"):
            return ("monorepo_build", None, "Turborepo monorepo scaffold")

        # Video renders — website/apps/video/out/*.mp4
        if re.match(r"website/apps/video/out/.*\.mp4$", p):
            return ("video_rendered", None, "brand format video")

        # Thumbnail renders — website/apps/video/out/*.png
        if re.match(r"website/apps/video/out/.*\.png$", p):
            return ("thumbnail_rendered", None, "brand variant thumbnail")

        # Avatar/sprite assets — website/apps/*/public/progression/avatars/*.gif or *.png
        if re.match(r"website/apps/[^/]+/public/progression/avatars/.*\.(gif|png)$", p):
            return ("avatar_generated", None, "tier/class avatar")

        # Pages — website/apps/<app>/app/**/page.tsx
        page_match = re.match(r"website/apps/([^/]+)/app/(.+/)?page\.tsx$", p)
        if page_match:
            app_name = page_match.group(1)
            route = page_match.group(2) or ""
            route_label = route.rstrip("/").replace("[", "").replace("]", "").replace("/", " ") if route else "home"
            # Home/landing page = high-value full page build
            if not route or route.rstrip("/") == "":
                return ("landing_page", None, f"{app_name} home page")
            return ("website_page", None, f"{app_name} {route_label} page")

        # API routes — website/apps/<app>/app/**/route.ts|tsx
        route_match = re.match(r"website/apps/([^/]+)/app/(.+/)?route\.tsx?$", p)
        if route_match:
            app_name = route_match.group(1)
            route = route_match.group(2) or ""
            route_label = route.rstrip("/").replace("/", " ") if route else "root"
            return ("website_route", None, f"{app_name} {route_label} route")

        # Shared components — website/packages/shared/components/*.tsx
        if p.startswith("website/packages/shared/components/") and p.endswith(".tsx"):
            comp_name = stem
            if stem in FEATURE_COMPONENTS:
                return ("feature_system", None, comp_name)
            return ("website_component", None, comp_name)

        # Shared pages (SkillGuidePage etc.) — feature_system when in list
        if p.startswith("website/packages/shared/pages/") and p.endswith(".tsx"):
            if stem in FEATURE_COMPONENTS:
                return ("feature_system", None, stem)
            return ("website_page", None, stem)

        # Shared lib — website/packages/shared/lib/*.ts
        if p.startswith("website/packages/shared/lib/") and p.endswith(".ts"):
            lib_name = stem
            return ("website_lib", None, f"shared {lib_name}")

        # Shared barrel exports (index.ts)
        if p.startswith("website/packages/shared/") and basename in ("index.ts",):
            return ("website_lib", None, "shared index")

        # Styles — any .css file
        if p.endswith(".css"):
            return ("website_style", None, f"{stem} styles")

        # Taxonomy / config — code infra
        if basename == "taxonomy.yaml":
            return ("code_infra", None, "taxonomy")

        # Layout files — website/apps/<app>/app/layout.tsx
        layout_match = re.match(r"website/apps/([^/]+)/app/layout\.tsx$", p)
        if layout_match:
            app_name = layout_match.group(1)
            return ("website_page", None, f"{app_name} layout")

        # Next.js config — next.config.ts (boilerplate config, 0 pts)
        if basename == "next.config.ts":
            app_match = re.match(r"website/apps/([^/]+)/", p)
            app_name = app_match.group(1) if app_match else "root"
            return ("config_file", None, f"{app_name} next config")

        # Other config — tsconfig.json, vercel.json, package.json (boilerplate, 0 pts)
        # turbo.json handled earlier as monorepo_build (50 pts)
        if basename in ("tsconfig.json", "turbo.json", "vercel.json", "package.json"):
            if basename == "turbo.json":
                return ("monorepo_build", None, "Turborepo monorepo scaffold")
            parts_list = p.split("/")
            if len(parts_list) >= 3:
                context = parts_list[-2]  # e.g., "shawnos", "shared", "website"
            else:
                context = "root"
            return ("config_file", None, f"{context} {stem}")

    # Skills (.cursor/skills/)
    if p.startswith(".cursor/skills/") and p.endswith("SKILL.md"):
        parts = p.split("/")
        if len(parts) >= 3:
            skill_name = parts[2]
            return ("skill_updated", None, skill_name)

    # Skills (.claude/skills/)
    if p.startswith(".claude/skills/") and p.endswith("SKILL.md"):
        parts = p.split("/")
        if len(parts) >= 3:
            skill_name = parts[2]
            return ("skill_updated", None, skill_name)

    # Cursor rules
    if p.startswith(".cursor/rules/") and p.endswith(".md"):
        slug = Path(p).stem
        return ("cursor_rule", None, slug)

    # Workflow indexes
    if p.startswith("workflows/") and p.endswith(".md"):
        slug = Path(p).stem
        return ("workflow_updated", None, slug)

    # Python scripts — tiered scoring based on complexity
    if p.endswith(".py") and p.startswith("scripts/"):
        slug = Path(p).stem
        # System engine — one-of-a-kind multi-layered systems
        if slug == "rpg_sprites":
            return ("system_engine", None, slug)
        # Named feature scripts (known high-complexity systems)
        if slug in FEATURE_SCRIPTS:
            return ("feature_script", None, slug)
        # Auto-detect complex scripts by line count (400+ lines)
        full_path = REPO_ROOT / p
        if full_path.exists():
            try:
                loc = sum(1 for _ in open(full_path, encoding="utf-8", errors="ignore"))
                if loc >= 400:
                    return ("complex_script", None, slug)
            except OSError:
                pass
        return ("code_infra", None, slug)

    # Other .py files (e.g. content/images) — lower weight
    if p.endswith(".py"):
        slug = Path(p).stem
        return ("script", None, slug)

    return None


def extract_date_from_filename(filename):
    """Extract YYYY-MM-DD from a filename like 2026-02-11_slug.md, or None."""
    m = re.match(r"(\d{4}-\d{2}-\d{2})_", filename)
    return m.group(1) if m else None


def get_file_timestamp(filepath):
    """Get file modification time as HH:MM local time string, or None."""
    full = REPO_ROOT / filepath
    try:
        mtime = os.path.getmtime(full)
        return datetime.fromtimestamp(mtime).strftime("%H:%M")
    except OSError:
        return None


def count_words(filepath):
    """Count words in a text file, return 0 on error."""
    full = REPO_ROOT / filepath
    try:
        text = full.read_text(errors="replace")
        # Strip YAML frontmatter
        text = re.sub(r"^---.*?---\s*", "", text, flags=re.DOTALL)
        return len(text.split())
    except OSError:
        return 0


# ── Claude Code token auto-detection ─────────────────────────────────

def _map_model_name(raw_model):
    """Map Claude Code / Cursor IDE model identifiers to short pricing names."""
    if not raw_model:
        return "unknown"
    m = raw_model.lower()
    if "opus" in m:
        return "opus"
    if "sonnet" in m:
        return "sonnet"
    if "haiku" in m:
        return "haiku"
    if "gpt-4o" in m or "gpt4o" in m:
        return "gpt4o"
    if m.startswith("gpt-5") or "codex" in m:
        return "gpt4o"
    if "gemini" in m:
        return "gemini"
    if m.startswith("composer-"):
        return "cursor"
    return raw_model


def compute_token_cost(entry):
    """Compute cost for a token_usage entry, returns USD.

    Uses cache-aware pricing when cache fields are present.
    Falls back to explicit cost if set.
    """
    if entry.get("cost") is not None:
        return entry["cost"]

    model = entry.get("model", "sonnet").lower()
    pricing = TOKEN_PRICING.get(model, TOKEN_PRICING["sonnet"])

    inp = entry.get("input_tokens", 0)
    out = entry.get("output_tokens", 0)
    cache_read = entry.get("cache_read_tokens", 0)
    cache_write = entry.get("cache_write_tokens", 0)

    cost = (
        (inp / 1_000_000 * pricing["input"])
        + (out / 1_000_000 * pricing["output"])
        + (cache_read / 1_000_000 * pricing["cache_read"])
        + (cache_write / 1_000_000 * pricing["cache_write"])
    )
    return round(cost, 4)


def scan_claude_code_tokens(target_date):
    """Parse Claude Code JSONL transcripts for today's sessions.

    Walks ~/.claude/projects/<project-slug>/*.jsonl, filters messages
    with usage data that occurred on target_date.

    Returns list of token_usage entries (one per session).
    """
    date_str = target_date.strftime("%Y-%m-%d")
    entries = []

    if not CLAUDE_PROJECT_SLUG.exists():
        return entries

    for jsonl_file in sorted(CLAUDE_PROJECT_SLUG.glob("*.jsonl")):
        session_id = jsonl_file.stem
        # Per-session accumulators
        total_input = 0
        total_output = 0
        total_cache_read = 0
        total_cache_write = 0
        models = set()
        first_ts = None
        last_ts = None
        msg_count = 0
        has_today = False

        try:
            with open(jsonl_file, "r") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        obj = json.loads(line)
                    except json.JSONDecodeError:
                        continue

                    ts = obj.get("timestamp", "")
                    msg = obj.get("message", {})
                    if not isinstance(msg, dict):
                        continue

                    # Only count messages with usage data
                    usage = msg.get("usage")
                    if not usage:
                        continue

                    # Check if this message is from today
                    if not ts.startswith(date_str):
                        continue

                    has_today = True
                    msg_count += 1

                    total_input += usage.get("input_tokens", 0)
                    total_output += usage.get("output_tokens", 0)
                    total_cache_read += usage.get("cache_read_input_tokens", 0)
                    total_cache_write += usage.get("cache_creation_input_tokens", 0)

                    model_raw = msg.get("model", "unknown")
                    models.add(_map_model_name(model_raw))

                    if first_ts is None or ts < first_ts:
                        first_ts = ts
                    if last_ts is None or ts > last_ts:
                        last_ts = ts

        except OSError:
            continue

        if not has_today or msg_count == 0:
            continue

        # Build the entry
        model = sorted(models)[0] if len(models) == 1 else ",".join(sorted(models))
        entry = {
            "session_id": session_id,
            "input_tokens": total_input,
            "output_tokens": total_output,
            "cache_read_tokens": total_cache_read,
            "cache_write_tokens": total_cache_write,
            "model": model,
            "source": "claude-code",
            "messages": msg_count,
            "logged_at": datetime.now().strftime("%H:%M"),
            "cost": None,  # computed later
        }
        # Add context from time range
        if first_ts:
            try:
                start_hm = datetime.fromisoformat(first_ts.replace("Z", "+00:00")).strftime("%H:%M")
                entry["context"] = f"claude-code {start_hm}"
            except (ValueError, OSError):
                entry["context"] = "claude-code session"

        # Compute cost
        entry["cost"] = compute_token_cost(entry)

        entries.append(entry)

    return entries


# ── Cursor IDE token auto-detection ───────────────────────────────────

def scan_cursor_tokens(target_date):
    """Estimate Cursor IDE token usage from the local SQLite DB + transcript files.

    The DB (ai_code_hashes) gives us per-model block counts and time ranges.
    Transcript files give us byte sizes as a token proxy (~4 chars/token).
    Neither source includes explicit token counts, so everything is estimated.

    Returns list of token_usage entries (one per model per day), each flagged
    with "estimated": True.
    """
    import sqlite3

    date_str = target_date.strftime("%Y-%m-%d")
    entries = []

    # ── Step 1: Query SQLite DB for per-model stats ──────────────────
    model_stats = {}  # model -> {blocks, conversations, first_ts, last_ts}

    if CURSOR_TRACKING_DB.exists():
        try:
            conn = sqlite3.connect(f"file:{CURSOR_TRACKING_DB}?mode=ro", uri=True)
            cursor = conn.cursor()
            cursor.execute("""
                SELECT model, conversationId, count(*) as cnt,
                       min(timestamp) as first_ts, max(timestamp) as last_ts
                FROM ai_code_hashes
                WHERE date(timestamp/1000, 'unixepoch', 'localtime') = ?
                GROUP BY model, conversationId
            """, (date_str,))

            for row in cursor.fetchall():
                raw_model, conv_id, cnt, first_ts, last_ts = row
                mapped = _map_model_name(raw_model)
                if mapped not in model_stats:
                    model_stats[mapped] = {
                        "blocks": 0,
                        "conversations": set(),
                        "first_ts": first_ts,
                        "last_ts": last_ts,
                    }
                ms = model_stats[mapped]
                ms["blocks"] += cnt
                ms["conversations"].add(conv_id or "unknown")
                if first_ts and (ms["first_ts"] is None or first_ts < ms["first_ts"]):
                    ms["first_ts"] = first_ts
                if last_ts and (ms["last_ts"] is None or last_ts > ms["last_ts"]):
                    ms["last_ts"] = last_ts

            conn.close()
        except (sqlite3.Error, OSError) as exc:
            print(f"  [cursor-db] SQLite error: {exc}")

    if not model_stats:
        return entries

    # ── Step 2: Sum transcript bytes for target_date ─────────────────
    total_transcript_bytes = 0
    if CURSOR_TRANSCRIPTS_DIR.exists():
        for fp in CURSOR_TRANSCRIPTS_DIR.iterdir():
            if not fp.is_file():
                continue
            try:
                mtime = os.path.getmtime(fp)
                mtime_date = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
                if mtime_date == date_str:
                    total_transcript_bytes += fp.stat().st_size
            except OSError:
                continue

    # ── Step 3: Estimate tokens per model ────────────────────────────
    total_blocks = sum(ms["blocks"] for ms in model_stats.values())

    for model_name, ms in model_stats.items():
        # Allocate transcript bytes proportionally by block count
        if total_blocks > 0 and total_transcript_bytes > 0:
            model_bytes = int(total_transcript_bytes * (ms["blocks"] / total_blocks))
        else:
            # Fallback: ~150 tokens per code block
            model_bytes = ms["blocks"] * 150 * 4

        estimated_tokens = max(model_bytes // 4, ms["blocks"] * 150)
        estimated_input = int(estimated_tokens * 0.75)
        estimated_output = estimated_tokens - estimated_input

        # Time range from millisecond timestamps
        context_str = "cursor-ide"
        if ms["first_ts"] and ms["last_ts"]:
            try:
                start_hm = datetime.fromtimestamp(ms["first_ts"] / 1000).strftime("%H:%M")
                end_hm = datetime.fromtimestamp(ms["last_ts"] / 1000).strftime("%H:%M")
                context_str = f"cursor-ide {start_hm}-{end_hm}"
            except (ValueError, OSError):
                pass

        entry = {
            "session_id": "cursor-aggregate",
            "input_tokens": estimated_input,
            "output_tokens": estimated_output,
            "cache_read_tokens": 0,
            "cache_write_tokens": 0,
            "model": model_name,
            "source": "cursor-db",
            "messages": ms["blocks"],
            "conversations": len(ms["conversations"]),
            "logged_at": datetime.now().strftime("%H:%M"),
            "context": context_str,
            "cost": None,
            "estimated": True,
        }
        entry["cost"] = compute_token_cost(entry)
        entries.append(entry)

    return entries


# ── Ship detection ───────────────────────────────────────────────────

def is_shipped(type_code):
    """Return True if this type represents shipped/production output."""
    if "draft" in type_code:
        return False
    return True


# ── Scoring engine ───────────────────────────────────────────────────

def _get_score_for_type(type_code):
    """Return point value for an accomplishment type."""
    # Direct match first (highest priority)
    if type_code in SCORE_WEIGHTS:
        return SCORE_WEIGHTS[type_code]
    # Pattern-based fallbacks
    if "final" in type_code:
        return SCORE_WEIGHTS["final"]
    if type_code == "manual":
        return SCORE_WEIGHTS["manual"]
    if type_code in ("skill_updated", "skill_created"):
        return SCORE_WEIGHTS["skill_updated"]
    if type_code == "workflow_updated":
        return SCORE_WEIGHTS["workflow_updated"]
    if type_code == "lead_magnet":
        return SCORE_WEIGHTS["lead_magnet"]
    if "draft" in type_code:
        return SCORE_WEIGHTS["draft"]
    if type_code == "script":
        return SCORE_WEIGHTS["script"]
    return 0


def _letter_grade(score):
    """Return letter grade for a given score."""
    for threshold, grade in GRADE_THRESHOLDS:
        if score >= threshold:
            return grade
    return "D"


def compute_score(accomplishments):
    """Compute weighted output score from accomplishments.

    Returns dict with output_score, letter_grade, score_breakdown.
    """
    breakdown = []
    total = 0
    for acc in accomplishments:
        t = acc.get("type", "")
        pts = _get_score_for_type(t)
        if pts > 0:
            breakdown.append({
                "type": t,
                "title": acc.get("title", "untitled"),
                "points": pts,
            })
            total += pts

    return {
        "output_score": total,
        "letter_grade": _letter_grade(total),
        "score_breakdown": breakdown,
    }


def compute_efficiency(output_score, token_usage):
    """Compute efficiency rating = output_score / total_cost.

    Returns efficiency_rating (float) or None if no cost data.
    """
    if not token_usage or output_score == 0:
        return None

    total_cost = sum(
        e.get("cost") if e.get("cost") is not None else compute_token_cost(e)
        for e in token_usage
    )
    if total_cost <= 0:
        return None

    return round(output_score / total_cost, 2)


def compute_cost_metrics(output_score, total_cost):
    """Compute honest cost metrics based on actual point output vs agent cost.

    Returns dict with:
    - cost_per_point: how much each point of real work cost ($/pt)
    - efficiency_ratio: points per dollar (pts/$)
    """
    return {
        "cost_per_point": round(total_cost / output_score, 2) if output_score > 0 else None,
        "efficiency_ratio": round(output_score / total_cost, 2) if total_cost > 0 else None,
    }


# ── V4 Commit-Based Scoring Engine ──────────────────────────────────

def get_commit_hashes(target_date):
    """Get all commit hashes for the target date, oldest first."""
    date_str = target_date.strftime("%Y-%m-%d")
    lines = run_git(
        "log",
        f"--since={date_str} 00:00",
        f"--until={date_str} 23:59:59",
        "--format=%H",
        "--reverse"
    )
    return [h.strip() for h in lines if h.strip()]


def classify_commit(commit_hash):
    """Classify a single commit by examining message, files, and line counts.

    Returns a dict with hash, message, type, score, files_changed,
    lines_added, lines_removed, lines_net, directories, timestamp.
    """
    # Get commit message
    msg_lines = run_git("log", "--format=%s", "-1", commit_hash)
    message = msg_lines[0] if msg_lines else ""

    # Get timestamp (local time)
    ts_lines = run_git("log", "--format=%cd", "--date=format:%H:%M", "-1", commit_hash)
    timestamp = ts_lines[0].strip() if ts_lines else ""

    # Get numstat (lines added/removed per file)
    numstat_lines = run_git("show", "--numstat", "--format=", commit_hash)

    files = []
    total_added = 0
    total_removed = 0
    directories = set()

    for line in numstat_lines:
        line = line.strip()
        if not line:
            continue
        parts = line.split("\t")
        if len(parts) == 3:
            filepath = parts[2]
            try:
                added = int(parts[0]) if parts[0] != "-" else 0
                removed = int(parts[1]) if parts[1] != "-" else 0
            except ValueError:
                continue
            total_added += added
            total_removed += removed
            files.append(filepath)
            top_dir = filepath.split("/")[0] + "/"
            directories.add(top_dir)

    msg_lower = message.lower()
    file_count = len(files)

    # ── Classification (priority order) ──

    # Revert
    if msg_lower.startswith("revert") or message.startswith("Revert"):
        return _build_commit_entry(
            commit_hash, message, "revert", 0,
            files, total_added, total_removed, directories, timestamp)

    # Chore
    if msg_lower.startswith("chore"):
        return _build_commit_entry(
            commit_hash, message, "chore", 1,
            files, total_added, total_removed, directories, timestamp)

    # Fix
    if msg_lower.startswith("fix"):
        if file_count >= 4:
            score = 8
        elif file_count >= 2:
            score = 5
        else:
            score = 3
        return _build_commit_entry(
            commit_hash, message, "bug_fix", score,
            files, total_added, total_removed, directories, timestamp)

    # Feat / docs — determine subtype
    if msg_lower.startswith("feat") or msg_lower.startswith("docs"):
        commit_type, score = _classify_feat_commit(
            msg_lower, files, file_count, total_added, directories)
        return _build_commit_entry(
            commit_hash, message, commit_type, score,
            files, total_added, total_removed, directories, timestamp)

    # Unknown prefix — default to chore
    return _build_commit_entry(
        commit_hash, message, "chore", 1,
        files, total_added, total_removed, directories, timestamp)


def _classify_feat_commit(msg_lower, files, file_count, total_added, directories):
    """Determine the commit type and score for feat/docs commits."""
    # Count app directories touched
    app_dirs = set()
    for f in files:
        m = re.match(r"website/apps/([^/]+)/", f)
        if m:
            app_dirs.add(m.group(1))

    # monorepo_scaffold: 20+ files across 3+ apps, or +1000 lines in project config
    if file_count >= 20 and len(app_dirs) >= 3:
        return "monorepo_scaffold", 80
    if total_added >= 1000 and len(app_dirs) >= 3:
        return "monorepo_scaffold", 80

    # system_engine: modifies scripts/*.py with +500 lines
    script_files = [f for f in files if f.startswith("scripts/") and f.endswith(".py")]
    if script_files and total_added >= 500:
        return "system_engine", 60

    # video_build: touches website/apps/video/
    if any(f.startswith("website/apps/video/") for f in files):
        return "video_build", 30

    # wiki_section: touches 3+ wiki/how-to pages
    wiki_files = [f for f in files if "how-to" in f or "wiki" in f]
    if len(wiki_files) >= 3:
        return "wiki_section", 20

    # feature_build: touches website/apps/*/ (scale by website file count)
    website_app_files = [f for f in files if f.startswith("website/apps/")]
    if website_app_files:
        fc = len(website_app_files)
        if fc >= 13:
            score = 40
        elif fc >= 7:
            score = 30
        else:
            score = 25
        return "feature_build", score

    # component: 1-2 component files with +100 lines
    comp_files = [f for f in files if "component" in f.lower() or "packages/shared" in f]
    if comp_files and len(comp_files) <= 3 and total_added >= 100:
        return "component", 15

    # infra_build: touches scripts/, configs, CI/CD
    if script_files or any(f.startswith("scripts/") for f in files):
        if total_added >= 200:
            return "infra_build", 25
        return "infra_build", 15

    # content_ship: touches content/ with "final" or "post" or "blog"
    content_files = [f for f in files if f.startswith("content/")]
    if content_files and any(kw in msg_lower for kw in ("final", "post", "blog")):
        return "content_ship", 10

    # wiki_page: single wiki/how-to page
    if wiki_files:
        return "wiki_page", 8

    # content_draft: draft content
    if any("drafts/" in f for f in files):
        return "content_draft", 5

    # Default: if touches website, feature_build; else infra_build
    if any(f.startswith("website/") for f in files):
        return "feature_build", 25
    return "infra_build", 15


def _build_commit_entry(commit_hash, message, commit_type, score,
                        files, total_added, total_removed, directories, timestamp):
    """Build the commit classification entry dict."""
    return {
        "hash": commit_hash[:7],
        "message": message,
        "type": commit_type,
        "score": score,
        "files_changed": len(files),
        "lines_added": total_added,
        "lines_removed": total_removed,
        "lines_net": total_added - total_removed,
        "directories": sorted(directories),
        "timestamp": timestamp,
    }


def score_commits(commits):
    """Compute total output score from classified commits.

    Uses V4 grade thresholds (higher bar for top grades).
    """
    total = 0
    breakdown = []
    for c in commits:
        pts = c.get("score", 0)
        if pts > 0:
            breakdown.append({
                "type": c["type"],
                "title": c["message"][:60],
                "points": pts,
            })
        total += pts

    grade = "D"
    for threshold, g in V4_GRADE_THRESHOLDS:
        if total >= threshold:
            grade = g
            break

    return {
        "output_score": total,
        "letter_grade": grade,
        "score_breakdown": breakdown,
    }


def compute_dev_equivalent(git_summary):
    """Compute dev equivalent metrics with explainer text.

    Strategic metric for demos: shows what today's output would cost
    if done by human developers at industry rates.
    """
    net_lines = git_summary.get("lines_net", 0)
    if net_lines <= 0:
        return {
            "net_lines": net_lines,
            "dev_days": 0,
            "cost_estimate": 0,
            "explanation": "No net new lines today.",
            "assumptions": {
                "lines_per_day": DEV_LINES_PER_DAY,
                "cost_per_day": DEV_COST_PER_DAY,
                "basis": "Industry average for meaningful, reviewed, production-quality code",
            }
        }

    dev_days = round(net_lines / DEV_LINES_PER_DAY, 1)
    cost_estimate = round(dev_days * DEV_COST_PER_DAY)

    # Build human-readable explanation
    months = dev_days / 22  # ~22 working days per month
    if months >= 1:
        time_desc = f"{months:.0f}+ month{'s' if months >= 2 else ''}"
    else:
        weeks = dev_days / 5
        time_desc = f"{weeks:.0f}+ week{'s' if weeks >= 2 else ''}"

    explanation = (
        f"A mid-level developer writes ~{DEV_LINES_PER_DAY} lines of production code "
        f"per day at ~${DEV_COST_PER_DAY}/day (fully loaded). Today's {net_lines:,} net "
        f"lines represent approximately {dev_days:.0f} developer-days of output \u2014 what a "
        f"small team would produce in {time_desc}."
    )

    return {
        "net_lines": net_lines,
        "dev_days": dev_days,
        "cost_estimate": cost_estimate,
        "explanation": explanation,
        "assumptions": {
            "lines_per_day": DEV_LINES_PER_DAY,
            "cost_per_day": DEV_COST_PER_DAY,
            "basis": "Industry average for meaningful, reviewed, production-quality code",
        }
    }


def compute_token_efficiency(token_usage, output_score, commit_count, net_lines):
    """Compute token efficiency metrics (informational, does not affect score).

    Tracks "am I getting better at prompting?" over time.
    """
    total_tokens = sum(
        e.get("input_tokens", 0) + e.get("output_tokens", 0) +
        e.get("cache_read_tokens", 0) + e.get("cache_write_tokens", 0)
        for e in token_usage
    )
    total_sessions = len(token_usage)

    # API equivalent cost
    api_cost = sum(
        compute_token_cost(e) if e.get("cost") is None else e["cost"]
        for e in token_usage
    )

    # Context utilization: average (session_tokens / 200000) capped at 1.0
    context_utils = []
    for e in token_usage:
        session_tokens = e.get("input_tokens", 0) + e.get("cache_read_tokens", 0)
        context_utils.append(min(session_tokens / 200_000, 1.0))
    avg_context = round(sum(context_utils) / len(context_utils), 2) if context_utils else 0

    return {
        "total_tokens": total_tokens,
        "total_sessions": total_sessions,
        "tokens_per_point": round(total_tokens / output_score) if output_score > 0 else None,
        "tokens_per_commit": round(total_tokens / commit_count) if commit_count > 0 else None,
        "tokens_per_loc": round(total_tokens / net_lines) if net_lines > 0 else None,
        "avg_context_utilization": avg_context,
        "pricing_mode": "max",
        "api_equivalent_cost": round(api_cost, 2),
        "actual_cost": 0.00,
    }


# ── Git scanning ─────────────────────────────────────────────────────

def scan_git(target_date):
    """Get files added/modified in git commits on target_date.

    Returns (added, modified, commit_count, lines_added_total, lines_removed_total,
             code_loc, content_loc, data_loc).
    """
    date_str = target_date.strftime("%Y-%m-%d")
    lines = run_git(
        "log",
        f"--since={date_str} 00:00",
        f"--until={date_str} 23:59:59",
        "--name-status",
        "--pretty=format:"
    )

    added = set()
    modified = set()
    for line in lines:
        line = line.strip()
        if not line:
            continue
        parts = line.split("\t", 1)
        if len(parts) != 2:
            continue
        status, filepath = parts
        if status.startswith("A"):
            added.add(filepath)
        elif status.startswith("M"):
            modified.add(filepath)

    # Also count commits
    commit_lines = run_git(
        "log",
        f"--since={date_str} 00:00",
        f"--until={date_str} 23:59:59",
        "--oneline"
    )
    commit_count = len(commit_lines)

    # LOC via numstat — also classify by file extension category
    numstat_lines = run_git(
        "log",
        f"--since={date_str} 00:00",
        f"--until={date_str} 23:59:59",
        "--numstat",
        "--pretty=format:"
    )
    lines_added_total = 0
    lines_removed_total = 0
    code_loc = 0
    content_loc = 0
    data_loc = 0
    for line in numstat_lines:
        parts = line.split("\t")
        if len(parts) == 3 and parts[0] != "-":
            try:
                added_count = int(parts[0])
                lines_added_total += added_count
                lines_removed_total += int(parts[1])
                # Classify added lines by file extension
                ext = Path(parts[2]).suffix.lower()
                if ext in CODE_EXTENSIONS:
                    code_loc += added_count
                elif ext in CONTENT_EXTENSIONS:
                    content_loc += added_count
                else:
                    data_loc += added_count
            except ValueError:
                continue

    return added, modified, commit_count, lines_added_total, lines_removed_total, code_loc, content_loc, data_loc


def scan_untracked_for_date(target_date):
    """Find untracked files that have today's date in the filename."""
    date_str = target_date.strftime("%Y-%m-%d")
    untracked_lines = run_git("ls-files", "--others", "--exclude-standard")
    matched = set()
    for f in untracked_lines:
        basename = Path(f).name
        file_date = extract_date_from_filename(basename)
        if file_date == date_str:
            matched.add(f)
    return matched


def scan_mtime_for_date(target_date):
    """Find files modified on target_date by checking filesystem mtime.

    This catches files that don't have date prefixes in their names — like
    clients/partner/praecipio/prompts/web-reveal-qualification.md, icp.md,
    SKILL.md, etc. Walks MTIME_SCAN_DIRS and collects any .md or .py file
    whose mtime falls on the target date.

    Returns a set of repo-relative paths.
    """
    date_str = target_date.strftime("%Y-%m-%d")
    matched = set()

    # Skip patterns — don't count generated outputs, data files, or node_modules
    SKIP_PATTERNS = [
        "node_modules/",
        "data/daily-log/",
        ".git/",
        "__pycache__/",
        "/schemas/",        # xlsx schema files aren't hand-authored
        "/office/",         # xlsx office files aren't hand-authored
        ".next/",           # Next.js build output
        ".turbo/",          # Turborepo cache
        "next-env.d.ts",    # Auto-generated Next.js type file
        ".vercel/",         # Vercel project metadata
        "package-lock.json",  # Lock files aren't hand-authored
    ]

    # Extensions we care about (includes web files for website/ tracking)
    VALID_EXTENSIONS = {".md", ".py", ".txt", ".csv", ".tsx", ".ts", ".css", ".yaml", ".json"}

    for scan_dir in MTIME_SCAN_DIRS:
        if not scan_dir.exists():
            continue
        for fpath in scan_dir.rglob("*"):
            if not fpath.is_file():
                continue
            if fpath.suffix not in VALID_EXTENSIONS:
                continue

            rel = str(fpath.relative_to(REPO_ROOT))

            # Skip noisy paths
            if any(pat in rel for pat in SKIP_PATTERNS):
                continue

            # Skip files that start with _ (internal/generator scripts)
            if fpath.name.startswith("_"):
                continue

            try:
                mtime = os.path.getmtime(fpath)
                mtime_date = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
                if mtime_date == date_str:
                    matched.add(rel)
            except OSError:
                continue

    return matched


# ── Pipeline scanning ────────────────────────────────────────────────

def scan_pipeline():
    """Walk content/*/drafts/ and content/*/final/ to get current pipeline state."""
    drafts_active = []
    for plat in PLATFORMS:
        drafts_dir = CONTENT_DIR / plat / "drafts"
        if not drafts_dir.exists():
            continue
        for f in sorted(drafts_dir.iterdir()):
            if not f.name.endswith(".md") or f.name == "README.md":
                continue
            if f.name.startswith("_"):
                continue  # Skip generator scripts / internal files
            slug = f.stem
            title = re.sub(r"^\d{4}-\d{2}-\d{2}_", "", slug).replace("-", " ").replace("_", " ")
            target_date = extract_date_from_filename(f.name)
            rel_path = str(f.relative_to(REPO_ROOT))
            entry = {
                "platform": plat,
                "title": title,
                "path": rel_path,
            }
            if target_date:
                entry["target_date"] = target_date
            # Word count for each draft
            wc = count_words(rel_path)
            if wc > 0:
                entry["words"] = wc
            drafts_active.append(entry)

    return drafts_active


def scan_substack_index():
    """Parse workflows/substack-index.md for post pipeline status."""
    idx_file = WORKFLOWS_DIR / "substack-index.md"
    if not idx_file.exists():
        return []

    posts = []
    in_table = False
    text = idx_file.read_text()
    for line in text.splitlines():
        # Look for the "New Era Posts" table rows
        if "| # |" in line and "Status" in line:
            in_table = True
            continue
        if in_table and line.startswith("|---"):
            continue
        if in_table and line.startswith("|"):
            cells = [c.strip() for c in line.split("|")]
            # cells[0] is empty (before first |), then #, Title, Date, Structure, Source, Visual, Status
            if len(cells) >= 8:
                post_num = cells[1]
                title = cells[2]
                date = cells[3]
                status = cells[7].lower() if len(cells) > 7 else ""
                posts.append({
                    "number": post_num,
                    "title": title,
                    "date": date,
                    "status": status
                })
        elif in_table and not line.startswith("|"):
            in_table = False

    return posts


# ── Accomplishment builder ───────────────────────────────────────────

def build_accomplishments(added, modified, untracked, mtime_files, target_date):
    """Build accomplishment entries from git changes + untracked files + mtime-discovered files."""
    accomplishments = []
    seen_paths = set()

    # Set of files confirmed in git (added, modified, or untracked with today's date)
    git_confirmed = added | modified | untracked

    # Process added + modified files from git
    all_files = [(f, "auto") for f in added | modified]
    # Process untracked files with today's date
    all_files += [(f, "auto") for f in untracked]
    # Process mtime-discovered files (catches non-date-prefixed work like client deliverables)
    all_files += [(f, "auto-mtime") for f in mtime_files]

    for filepath, source in all_files:
        if filepath in seen_paths:
            continue
        seen_paths.add(filepath)

        info = classify_file(filepath)
        if info is None:
            continue

        type_code, platform, title = info
        entry = {
            "type": type_code,
            "title": title,
            "path": filepath,
            "source": source
        }

        # Add file timestamp (last modified time as HH:MM)
        ts = get_file_timestamp(filepath)
        if ts:
            entry["timestamp"] = ts

        # Add word count for text files and code files
        COUNTABLE_EXTS = (".md", ".txt", ".tsx", ".ts", ".css", ".yaml", ".py")
        if any(filepath.endswith(ext) for ext in COUNTABLE_EXTS):
            wc = count_words(filepath)
            if wc > 0:
                entry["words"] = wc

        # Per-item value score + shipped flag
        entry["value_score"] = _get_score_for_type(type_code)
        entry["shipped"] = is_shipped(type_code)

        # mtime-only penalty: if detected via mtime but NOT confirmed in git,
        # the file was likely touched by a build process or git checkout — not
        # real work.  Record it for visibility but zero out the score.
        if source == "auto-mtime" and filepath not in git_confirmed:
            entry["value_score"] = 0
            entry["shipped"] = False
            entry["mtime_only"] = True

        accomplishments.append(entry)

    return accomplishments


# ── Finalized-today detection ────────────────────────────────────────

def detect_finalized_today(added, modified, untracked):
    """Find files in content/*/final/ that were added/changed today."""
    finalized = []
    all_files = added | modified | untracked
    for filepath in all_files:
        # Skip placeholder files — not real deliverables
        if filepath.endswith(".gitkeep"):
            continue
        for plat in PLATFORMS:
            if filepath.startswith(f"content/{plat}/final/"):
                finalized.append({
                    "platform": plat,
                    "path": filepath
                })
                break
    return finalized


# ── Stats computation ────────────────────────────────────────────────

def compute_stats(accomplishments, drafts_active, finalized_today, git_summary):
    """Compute extended stats for the dashboard."""
    # Platform breakdown — now includes "ops" category for GTM work
    platform_counts = {}
    for acc in accomplishments:
        t = acc.get("type", "")
        # Map GTM ops types to "ops" category
        if t.startswith("partner_") or t.startswith("client_"):
            platform_counts["ops"] = platform_counts.get("ops", 0) + 1
            continue
        # Map website types to "website" category
        if t.startswith("website_"):
            platform_counts["website"] = platform_counts.get("website", 0) + 1
            continue
        for plat in PLATFORMS:
            if t.startswith(plat):
                platform_counts[plat] = platform_counts.get(plat, 0) + 1
                break
        else:
            platform_counts["other"] = platform_counts.get("other", 0) + 1

    # Total words in touched files (upper bound — includes full file content of
    # existing files that may have been only slightly modified, not net new words)
    total_words = sum(a.get("words", 0) for a in accomplishments)

    # Draft words (pipeline total)
    pipeline_words = sum(d.get("words", 0) for d in drafts_active)

    # Finals count
    finals_count = len(finalized_today)

    # Time range of activity
    timestamps = [a.get("timestamp") for a in accomplishments if a.get("timestamp")]
    first_activity = min(timestamps) if timestamps else None
    last_activity = max(timestamps) if timestamps else None

    return {
        "platform_breakdown": platform_counts,
        "words_in_touched_files": total_words,
        "pipeline_words": pipeline_words,
        "finals_count": finals_count,
        "first_activity": first_activity,
        "last_activity": last_activity,
    }


# ── Main merge + write ───────────────────────────────────────────────

def load_existing(log_path):
    """Load existing daily log if it exists."""
    if log_path.exists():
        try:
            return json.loads(log_path.read_text())
        except (json.JSONDecodeError, OSError):
            pass
    return None


def merge_log(existing, new_data):
    """Merge new auto-detected data with existing manual entries + todos.

    Token merge strategy:
    - claude-code entries: replaced on re-scan (keyed by session_id)
    - cursor-estimate entries: preserved (agent appends these)
    - manual entries: preserved
    """
    if existing is None:
        return new_data

    # Preserve manual accomplishments from existing
    manual_entries = [a for a in existing.get("accomplishments", []) if a.get("source") == "manual"]

    # Combine: new auto entries + preserved manual entries
    new_data["accomplishments"] = new_data["accomplishments"] + manual_entries

    # Preserve todos entirely (scanner never touches them)
    new_data["todos"] = existing.get("todos", [])

    # Token usage merge:
    # - New claude-code entries replace old ones (keyed by session_id)
    # - cursor-estimate and manual entries are always preserved
    existing_tokens = existing.get("token_usage", [])
    new_auto_tokens = new_data.get("token_usage", [])

    # Separate non-auto entries from existing (preserve them)
    preserved_tokens = [
        e for e in existing_tokens
        if e.get("source") not in ("claude-code", "cursor-db")
    ]

    # Merge: auto-detected (fresh) + preserved (cursor-estimate + manual)
    new_data["token_usage"] = new_auto_tokens + preserved_tokens

    return new_data


def main():
    parser = argparse.ArgumentParser(description="Daily activity scanner")
    parser.add_argument("--date", type=str, help="Date to scan (YYYY-MM-DD). Defaults to today.")
    args = parser.parse_args()

    if args.date:
        target_date = datetime.strptime(args.date, "%Y-%m-%d").date()
    else:
        target_date = datetime.now().date()

    date_str = target_date.strftime("%Y-%m-%d")
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log_path = LOG_DIR / f"{date_str}.json"

    # Scan git
    added, modified, commit_count, lines_added_total, lines_removed_total, code_loc, content_loc, data_loc = scan_git(target_date)
    untracked = scan_untracked_for_date(target_date)

    # Scan by file modification time (catches non-date-prefixed files like client deliverables)
    mtime_files = scan_mtime_for_date(target_date)

    # Build accomplishments (backward compat — kept for downstream consumers)
    accomplishments = build_accomplishments(added, modified, untracked, mtime_files, target_date)

    # V4: Classify commits
    commit_hashes = get_commit_hashes(target_date)
    commits = [classify_commit(h) for h in commit_hashes]

    # Scan pipeline
    drafts_active = scan_pipeline()
    finalized_today = detect_finalized_today(added, modified, untracked)

    # Compute extended stats
    git_summary = {
        "commits_today": commit_count,
        "files_added": sorted(added),
        "files_modified": sorted(modified),
        "lines_added_count": lines_added_total,
        "lines_removed_count": lines_removed_total,
        "lines_net": lines_added_total - lines_removed_total,
        "code_loc": code_loc,
        "content_loc": content_loc,
        "data_loc": data_loc,
    }
    stats = compute_stats(accomplishments, drafts_active, finalized_today, git_summary)

    # Auto-detect token usage (Claude Code CLI + Cursor IDE)
    auto_tokens = scan_claude_code_tokens(target_date)
    cursor_tokens = scan_cursor_tokens(target_date)
    auto_tokens = auto_tokens + cursor_tokens

    # V4 commit-based scoring (replaces V3 file-based scoring)
    score_data = score_commits(commits)
    stats["output_score"] = score_data["output_score"]
    stats["letter_grade"] = score_data["letter_grade"]
    stats["score_breakdown"] = score_data["score_breakdown"]

    # Dev equivalent
    dev_equivalent = compute_dev_equivalent(git_summary)

    # Build new data
    new_data = {
        "date": date_str,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "version": 4,
        "accomplishments": accomplishments,
        "commits": commits,
        "pipeline": {
            "drafts_active": drafts_active,
            "finalized_today": finalized_today
        },
        "todos": [],
        "token_usage": auto_tokens,
        "stats": stats,
        "git_summary": git_summary,
        "dev_equivalent": dev_equivalent,
    }

    # Merge with existing
    existing = load_existing(log_path)
    merged = merge_log(existing, new_data)

    # Post-merge: compute efficiency with final token_usage
    all_tokens = merged.get("token_usage", [])
    efficiency = compute_efficiency(stats["output_score"], all_tokens)
    merged["stats"]["efficiency_rating"] = efficiency

    # Total agent cost across all token sessions (API equivalent)
    total_cost = sum(
        e.get("cost") if e.get("cost") is not None else compute_token_cost(e)
        for e in all_tokens
    )

    # V4 cost section — api_equivalent vs actual
    merged["cost"] = {
        "api_equivalent": round(total_cost, 2),
        "actual_cost": 0.00,
        "pricing_mode": "max",
    }

    # Token efficiency (informational — does not affect score)
    merged["token_efficiency"] = compute_token_efficiency(
        all_tokens,
        stats["output_score"],
        commit_count,
        git_summary.get("lines_net", 0),
    )

    # Ship rate
    shipped = [a for a in merged["accomplishments"] if a.get("shipped", True)]
    drafts = [a for a in merged["accomplishments"] if not a.get("shipped", True)]
    total_acc = len(merged["accomplishments"])
    merged["stats"]["shipped_count"] = len(shipped)
    merged["stats"]["draft_count"] = len(drafts)
    merged["stats"]["ship_rate"] = round(len(shipped) / total_acc, 2) if total_acc > 0 else 0.0

    # Agent cost (total across all token sessions — API equivalent)
    merged["stats"]["agent_cost"] = round(total_cost, 2)

    # Cost metrics — honest $/pt and pts/$
    cost_metrics = compute_cost_metrics(stats["output_score"], total_cost)
    merged["stats"]["cost_per_point"] = cost_metrics["cost_per_point"]
    merged["stats"]["efficiency_ratio"] = cost_metrics["efficiency_ratio"]

    # Backward-compat alias — downstream consumers (website, dashboard, progression)
    # still reference "words_today".  Emit both keys until those are migrated.
    merged["stats"]["words_today"] = merged["stats"].get("words_in_touched_files", 0)

    # LOC in stats for easy dashboard access
    merged["stats"]["lines_added"] = merged.get("git_summary", {}).get("lines_added_count", 0)
    merged["stats"]["lines_removed"] = merged.get("git_summary", {}).get("lines_removed_count", 0)
    merged["stats"]["lines_net"] = merged.get("git_summary", {}).get("lines_net", 0)
    merged["stats"]["code_loc"] = merged.get("git_summary", {}).get("code_loc", 0)
    merged["stats"]["content_loc"] = merged.get("git_summary", {}).get("content_loc", 0)
    merged["stats"]["data_loc"] = merged.get("git_summary", {}).get("data_loc", 0)

    # Sanitize partner names from paths before writing (pre-push blocklist)
    # V4: also covers commit messages and file paths in the commits array
    blocklist_path = REPO_ROOT / ".claude" / "blocklist.txt"
    if blocklist_path.exists():
        terms = [t.strip().lower() for t in blocklist_path.read_text().splitlines() if t.strip()]
        raw = json.dumps(merged, indent=2)
        for term in terms:
            raw = re.sub(re.escape(term), "[redacted]", raw, flags=re.IGNORECASE)
        merged = json.loads(raw)

    # Write
    log_path.write_text(json.dumps(merged, indent=2) + "\n")

    # Summary output
    acc_count = len(merged["accomplishments"])
    commit_count_v4 = len(merged.get("commits", []))
    todo_pending = len([t for t in merged.get("todos", []) if t.get("status") == "pending"])
    drafts_count = len(merged["pipeline"]["drafts_active"])
    final_count = len(merged["pipeline"]["finalized_today"])
    token_count = len(all_tokens)
    dev_eq = merged.get("dev_equivalent", {})

    print(f"Daily scan v4 complete for {date_str}")
    print(f"  Commits scored:  {commit_count_v4}")
    print(f"  Score:           {stats['output_score']} pts ({stats['letter_grade']})")
    print(f"  Accomplishments: {acc_count} (backward compat)")
    print(f"  Drafts active:   {drafts_count}")
    print(f"  Finalized today: {final_count}")
    print(f"  Git commits:     {commit_count}")
    print(f"  LOC:             +{lines_added_total} / -{lines_removed_total} (net {lines_added_total - lines_removed_total})")
    print(f"  Dev equivalent:  {dev_eq.get('dev_days', 0)} dev-days (${dev_eq.get('cost_estimate', 0):,})")
    print(f"  Token sessions:  {token_count} (auto-detected)")
    print(f"  API equiv cost:  ${total_cost:.2f}")
    print(f"  Actual cost:     $0.00 (Max subscription)")
    print(f"  Ship rate:       {merged['stats']['ship_rate']*100:.0f}% ({merged['stats']['shipped_count']}/{total_acc})")
    print(f"  Output: {log_path.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
