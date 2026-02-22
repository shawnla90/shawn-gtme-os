#!/usr/bin/env python3
"""
build_index.py — Build a SQLite content/data index from repo source files.

Scans content drafts/finals, daily logs, session handoffs, and skills.
Produces data/index.db — a local, gitignored, queryable index.

The .db file is derived from git-tracked files. Delete it and re-run
to rebuild. Safe to run on any machine after git pull.

Usage:
    python3 scripts/build_index.py
"""

import json
import os
import re
import socket
import sqlite3
import subprocess
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = REPO_ROOT / "data" / "index.db"
CONTENT_DIR = REPO_ROOT / "content"
LOG_DIR = REPO_ROOT / "data" / "daily-log"
HANDOFF_PATH = REPO_ROOT / ".claude" / "context-handoff.md"
SKILL_DIRS = [
    REPO_ROOT / ".cursor" / "skills",
    REPO_ROOT / ".claude" / "skills",
]

PLATFORMS = ["linkedin", "x", "substack", "tiktok", "reddit", "website"]

# ── Schema ────────────────────────────────────────────────────────────

SCHEMA = """
CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path TEXT UNIQUE NOT NULL,
    platform TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'draft',
    title TEXT,
    slug TEXT,
    date TEXT,
    pillar TEXT,
    arc TEXT,
    series TEXT,
    series_position INTEGER,
    status_text TEXT,
    energy TEXT,
    cta TEXT,
    structure TEXT,
    source TEXT,
    word_count INTEGER,
    created_at TEXT,
    updated_at TEXT,
    indexed_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS daily_logs (
    date TEXT PRIMARY KEY,
    output_score INTEGER,
    letter_grade TEXT,
    words_today INTEGER,
    shipped_count INTEGER,
    draft_count INTEGER,
    agent_cost REAL,
    roi_multiplier REAL,
    commits_today INTEGER,
    efficiency_rating REAL,
    indexed_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_date TEXT NOT NULL,
    machine TEXT,
    summary TEXT,
    next_steps TEXT,
    key_decisions TEXT,
    raw_content TEXT,
    indexed_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    file_path TEXT UNIQUE,
    category TEXT,
    last_modified TEXT,
    indexed_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS content_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER REFERENCES content(id),
    target_id INTEGER REFERENCES content(id),
    link_type TEXT NOT NULL,
    UNIQUE(source_id, target_id, link_type)
);
"""

# ── Helpers ───────────────────────────────────────────────────────────

def run_git(*args):
    """Run a git command and return stdout."""
    result = subprocess.run(
        ["git", "-C", str(REPO_ROOT)] + list(args),
        capture_output=True, text=True
    )
    return result.stdout.strip() if result.stdout else ""


def get_git_date(filepath):
    """Get last modified date from git log for a file."""
    out = run_git("log", "-1", "--format=%ai", "--", str(filepath))
    if out:
        return out.split(" ")[0]
    return None


def count_words(filepath):
    """Count words in a text file."""
    try:
        text = filepath.read_text(errors="replace")
        text = re.sub(r"^---.*?---\s*", "", text, flags=re.DOTALL)
        return len(text.split())
    except OSError:
        return 0


def get_machine_name():
    """Get short hostname to identify which machine built the index."""
    hostname = socket.gethostname().lower()
    if "macbook" in hostname or "laptop" in hostname:
        return "macbook"
    if "mini" in hostname or "mac-mini" in hostname:
        return "mac-mini"
    return hostname.split(".")[0]


# ── Content metadata parsing ─────────────────────────────────────────

def parse_blockquote_metadata(text):
    """Parse > **Key**: Value metadata from content drafts.

    Handles the format used across LinkedIn, X, and Substack drafts:
        > **Platform**: LinkedIn
        > **Pillar**: Building & Sharing
        > **Arc**: Anti-Lead Magnet Series (Day 1 of 4)
    """
    meta = {}
    for match in re.finditer(r"^>\s*\*\*(.+?)\*\*:\s*(.+)$", text, re.MULTILINE):
        key = match.group(1).strip().lower()
        value = match.group(2).strip()
        meta[key] = value
    return meta


def parse_yaml_frontmatter(text):
    """Parse YAML frontmatter (--- delimited) from website drafts."""
    match = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
    if not match:
        return {}
    meta = {}
    for line in match.group(1).splitlines():
        m = re.match(r'^(\w+):\s*"?(.+?)"?\s*$', line)
        if m:
            meta[m.group(1).lower()] = m.group(2)
    return meta


def extract_date_from_filename(filename):
    """Extract YYYY-MM-DD from a filename like 2026-02-11_slug.md."""
    m = re.match(r"(\d{4}-\d{2}-\d{2})_", filename)
    return m.group(1) if m else None


def extract_slug(filename):
    """Extract slug from filename (strip date prefix and extension)."""
    name = Path(filename).stem
    return re.sub(r"^\d{4}-\d{2}-\d{2}_", "", name)


def parse_series_position(arc_text):
    """Extract series position from arc text like 'Series (Day 2 of 4)'."""
    if not arc_text:
        return None
    m = re.search(r"Day\s+(\d+)", arc_text)
    return int(m.group(1)) if m else None


def parse_content_file(filepath, platform, stage):
    """Parse a content file and return a dict of metadata."""
    try:
        text = filepath.read_text(errors="replace")
    except OSError:
        return None

    # Try blockquote metadata first (most drafts), then YAML frontmatter (website)
    meta = parse_blockquote_metadata(text)
    if not meta:
        meta = parse_yaml_frontmatter(text)

    filename = filepath.name
    file_date = extract_date_from_filename(filename)
    slug = extract_slug(filename)

    # Extract title from first # heading if not in metadata
    title = meta.get("title")
    if not title:
        title_match = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
        if title_match:
            title = title_match.group(1).strip()
        else:
            title = slug.replace("-", " ").replace("_", " ")

    # Use date from metadata if available, fall back to filename
    date = meta.get("date", file_date)
    # Clean date — some have extra text like "2026-02-25 or 2026-02-26 (...)"
    if date:
        date_match = re.match(r"(\d{4}-\d{2}-\d{2})", date)
        date = date_match.group(1) if date_match else date

    # Status from metadata or inferred from stage
    status = meta.get("status", stage)

    # Git timestamps
    rel_path = str(filepath.relative_to(REPO_ROOT))
    created = get_git_date(rel_path)
    updated = created  # same query — git log -1 gives latest

    return {
        "file_path": rel_path,
        "platform": platform,
        "stage": stage,
        "title": title,
        "slug": slug,
        "date": date,
        "pillar": meta.get("pillar"),
        "arc": meta.get("arc"),
        "series": meta.get("series"),
        "series_position": parse_series_position(meta.get("arc")),
        "status_text": status,
        "energy": meta.get("energy"),
        "cta": meta.get("cta"),
        "structure": meta.get("structure"),
        "source": meta.get("source"),
        "word_count": count_words(filepath),
        "created_at": created,
        "updated_at": updated,
    }


# ── Scanners ─────────────────────────────────────────────────────────

def scan_content():
    """Scan all content directories for drafts and finals."""
    items = []

    for platform in PLATFORMS:
        platform_dir = CONTENT_DIR / platform

        # Drafts
        drafts_dir = platform_dir / "drafts"
        if drafts_dir.exists():
            for f in sorted(drafts_dir.iterdir()):
                if not f.is_file():
                    continue
                if f.name.startswith(("_", ".", "README")):
                    continue
                if f.suffix not in (".md", ".txt"):
                    continue
                item = parse_content_file(f, platform, "draft")
                if item:
                    items.append(item)

        # Finals
        final_dir = platform_dir / "final"
        if final_dir.exists():
            for f in sorted(final_dir.iterdir()):
                if not f.is_file():
                    continue
                if f.name.startswith(("_", ".", "README")) or f.name == ".gitkeep":
                    continue
                if f.suffix not in (".md", ".txt"):
                    continue
                item = parse_content_file(f, platform, "final")
                if item:
                    items.append(item)

    return items


def scan_daily_logs():
    """Scan daily log JSON files and extract stats."""
    logs = []
    if not LOG_DIR.exists():
        return logs

    for f in sorted(LOG_DIR.glob("*.json")):
        try:
            data = json.loads(f.read_text())
        except (json.JSONDecodeError, OSError):
            continue

        stats = data.get("stats", {})
        git = data.get("git_summary", {})

        logs.append({
            "date": data.get("date", f.stem),
            "output_score": stats.get("output_score"),
            "letter_grade": stats.get("letter_grade"),
            "words_today": stats.get("words_today"),
            "shipped_count": stats.get("shipped_count"),
            "draft_count": stats.get("draft_count"),
            "agent_cost": stats.get("agent_cost"),
            "roi_multiplier": stats.get("roi_multiplier"),
            "commits_today": git.get("commits_today"),
            "efficiency_rating": stats.get("efficiency_rating"),
        })

    return logs


def scan_session_handoff():
    """Read context-handoff.md and return a session record."""
    if not HANDOFF_PATH.exists():
        return None

    try:
        text = HANDOFF_PATH.read_text(errors="replace")
    except OSError:
        return None

    if not text.strip():
        return None

    # Parse the header line: > Generated: 2026-02-21 | Machine: MacBook | Session: ...
    session_date = None
    machine = get_machine_name()
    header_match = re.search(r"Generated:\s*(\d{4}-\d{2}-\d{2})", text)
    if header_match:
        session_date = header_match.group(1)
    else:
        session_date = datetime.now().strftime("%Y-%m-%d")

    machine_match = re.search(r"Machine:\s*(\w+)", text)
    if machine_match:
        machine = machine_match.group(1).lower()

    # Extract sections
    summary = _extract_section(text, "What Was Done This Session")
    next_steps = _extract_section(text, "Next Steps")
    key_decisions = _extract_section(text, "Key Decisions Made")

    return {
        "session_date": session_date,
        "machine": machine,
        "summary": summary,
        "next_steps": next_steps,
        "key_decisions": key_decisions,
        "raw_content": text,
    }


def _extract_section(text, heading):
    """Extract content under a ## heading until the next ## or end."""
    pattern = rf"^##\s+{re.escape(heading)}\s*\n(.*?)(?=^##\s|\Z)"
    match = re.search(pattern, text, re.MULTILINE | re.DOTALL)
    if match:
        return match.group(1).strip()
    return None


def scan_skills():
    """Scan skill directories for SKILL.md files."""
    skills = []

    for skill_dir in SKILL_DIRS:
        if not skill_dir.exists():
            continue

        # Determine category from path
        if ".cursor" in str(skill_dir):
            category = "cursor"
        else:
            category = "claude"

        for entry in sorted(skill_dir.iterdir()):
            skill_md = entry / "SKILL.md"
            if not skill_md.is_file():
                continue

            slug = entry.name
            rel_path = str(skill_md.relative_to(REPO_ROOT))

            # Extract frontmatter
            name, description = _extract_skill_frontmatter(skill_md)
            if not name:
                name = slug

            git_date = get_git_date(rel_path)

            skills.append({
                "name": name,
                "slug": slug,
                "description": description,
                "file_path": rel_path,
                "category": category,
                "last_modified": git_date,
            })

    return skills


def _extract_skill_frontmatter(filepath):
    """Extract name and description from SKILL.md YAML frontmatter."""
    try:
        text = filepath.read_text(errors="replace")
    except OSError:
        return None, None

    match = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
    if not match:
        return None, None

    fm = match.group(1)
    name = None
    desc = None

    name_match = re.search(r"^name:\s*(.+)$", fm, re.MULTILINE)
    if name_match:
        name = name_match.group(1).strip().strip("\"'")

    desc_match = re.search(r"^description:\s*(.+)$", fm, re.MULTILINE)
    if desc_match:
        desc = desc_match.group(1).strip().strip("\"'")

    return name, desc


def detect_content_links(db):
    """Detect cross-platform links by matching date+slug patterns."""
    cursor = db.execute("SELECT id, slug, date, platform FROM content WHERE slug IS NOT NULL AND date IS NOT NULL")
    rows = cursor.fetchall()

    # Group by (date, slug)
    groups = {}
    for row_id, slug, date, platform in rows:
        key = (date, slug)
        if key not in groups:
            groups[key] = []
        groups[key].append((row_id, platform))

    # Link siblings that share date+slug across platforms
    links = []
    for (date, slug), members in groups.items():
        if len(members) < 2:
            continue
        for i, (src_id, src_plat) in enumerate(members):
            for dst_id, dst_plat in members[i + 1:]:
                links.append((src_id, dst_id, "series_sibling"))

    return links


# ── Database operations ──────────────────────────────────────────────

def init_db():
    """Create or recreate the database with schema."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    # Drop and rebuild for idempotent runs
    if DB_PATH.exists():
        DB_PATH.unlink()

    db = sqlite3.connect(str(DB_PATH))
    db.executescript(SCHEMA)
    return db


def insert_content(db, items):
    """Insert content records."""
    for item in items:
        db.execute("""
            INSERT OR REPLACE INTO content
            (file_path, platform, stage, title, slug, date, pillar, arc, series,
             series_position, status_text, energy, cta, structure, source,
             word_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item["file_path"], item["platform"], item["stage"],
            item["title"], item["slug"], item["date"],
            item["pillar"], item["arc"], item["series"],
            item["series_position"], item["status_text"],
            item["energy"], item["cta"], item["structure"],
            item["source"], item["word_count"],
            item["created_at"], item["updated_at"],
        ))
    db.commit()


def insert_daily_logs(db, logs):
    """Insert daily log records."""
    for log in logs:
        db.execute("""
            INSERT OR REPLACE INTO daily_logs
            (date, output_score, letter_grade, words_today, shipped_count,
             draft_count, agent_cost, roi_multiplier, commits_today, efficiency_rating)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            log["date"], log["output_score"], log["letter_grade"],
            log["words_today"], log["shipped_count"], log["draft_count"],
            log["agent_cost"], log["roi_multiplier"],
            log["commits_today"], log["efficiency_rating"],
        ))
    db.commit()


def insert_session(db, session):
    """Insert a session handoff record (append-only, skip duplicates)."""
    if session is None:
        return 0

    # Check if this exact session already exists (by date + machine + raw content hash)
    existing = db.execute(
        "SELECT id FROM sessions WHERE session_date = ? AND machine = ? AND summary = ?",
        (session["session_date"], session["machine"], session["summary"])
    ).fetchone()

    if existing:
        return 0

    db.execute("""
        INSERT INTO sessions (session_date, machine, summary, next_steps, key_decisions, raw_content)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        session["session_date"], session["machine"],
        session["summary"], session["next_steps"],
        session["key_decisions"], session["raw_content"],
    ))
    db.commit()
    return 1


def insert_skills(db, skills):
    """Insert skill records."""
    for skill in skills:
        db.execute("""
            INSERT OR REPLACE INTO skills
            (name, slug, description, file_path, category, last_modified)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            skill["name"], skill["slug"], skill["description"],
            skill["file_path"], skill["category"], skill["last_modified"],
        ))
    db.commit()


def insert_content_links(db, links):
    """Insert content link records."""
    for src_id, dst_id, link_type in links:
        db.execute("""
            INSERT OR IGNORE INTO content_links (source_id, target_id, link_type)
            VALUES (?, ?, ?)
        """, (src_id, dst_id, link_type))
    db.commit()


# ── Main ─────────────────────────────────────────────────────────────

def main():
    print(f"Building index: {DB_PATH.relative_to(REPO_ROOT)}")

    db = init_db()

    # Content
    content_items = scan_content()
    insert_content(db, content_items)
    print(f"  Content:      {len(content_items)} files indexed")

    # Platform breakdown
    platforms = {}
    for item in content_items:
        platforms[item["platform"]] = platforms.get(item["platform"], 0) + 1
    for plat, count in sorted(platforms.items()):
        print(f"    {plat}: {count}")

    # Daily logs
    logs = scan_daily_logs()
    insert_daily_logs(db, logs)
    print(f"  Daily logs:   {len(logs)} days indexed")

    # Session handoff
    session = scan_session_handoff()
    session_count = insert_session(db, session)
    total_sessions = db.execute("SELECT COUNT(*) FROM sessions").fetchone()[0]
    print(f"  Sessions:     {total_sessions} archived ({session_count} new)")

    # Skills
    skills = scan_skills()
    insert_skills(db, skills)
    print(f"  Skills:       {len(skills)} indexed")

    # Content links (cross-platform detection)
    links = detect_content_links(db)
    insert_content_links(db, links)
    print(f"  Content links: {len(links)} cross-platform pairs detected")

    db.close()
    print(f"Done. Index at {DB_PATH}")


if __name__ == "__main__":
    main()
