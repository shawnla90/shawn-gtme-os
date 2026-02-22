#!/usr/bin/env python3
"""
query_index.py — CLI query wrapper for the SQLite content index.

Reads data/index.db (built by build_index.py) and provides filtered,
formatted views of content, skills, daily stats, cross-platform links,
and session history.

No external dependencies — stdlib only.

Usage:
    python3 scripts/query_index.py content --platform linkedin --since 2026-02-15
    python3 scripts/query_index.py stats --latest 3
    python3 scripts/query_index.py skills --category claude
    python3 scripts/query_index.py links --date 2026-02-17
    python3 scripts/query_index.py sessions --latest 5
    python3 scripts/query_index.py content --json
    python3 scripts/query_index.py stats --count
"""

import argparse
import json
import sqlite3
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = REPO_ROOT / "data" / "index.db"


# ── Helpers ───────────────────────────────────────────────────────────

def connect():
    """Open read-only connection to the index database."""
    if not DB_PATH.exists():
        print(f"Error: index not found at {DB_PATH.relative_to(REPO_ROOT)}", file=sys.stderr)
        print("Run: python3 scripts/build_index.py", file=sys.stderr)
        sys.exit(1)
    db = sqlite3.connect(str(DB_PATH))
    db.row_factory = sqlite3.Row
    return db


def truncate(text, length=80):
    """Truncate text to a maximum length, adding ellipsis if needed."""
    if not text:
        return ""
    text = text.replace("\n", " ").strip()
    if len(text) <= length:
        return text
    return text[: length - 3] + "..."


def fmt_number(n):
    """Format a number with comma separators, or dash if None."""
    if n is None:
        return "-"
    return f"{n:,}"


def fmt_value(v):
    """Format a value for table display."""
    if v is None:
        return "-"
    return str(v)


def print_table(columns, rows):
    """Print rows as an aligned column table.

    columns: list of (header, key, min_width) tuples.
    rows: list of sqlite3.Row or dict objects.
    """
    if not rows:
        print("(no results)")
        return

    # Build string grid
    grid = []
    for row in rows:
        grid.append([fmt_value(row[col[1]]) if isinstance(row, sqlite3.Row) else fmt_value(row.get(col[1])) for col in columns])

    # Calculate widths
    widths = []
    for i, col in enumerate(columns):
        header_w = len(col[0])
        data_w = max((len(grid[r][i]) for r in range(len(grid))), default=0)
        widths.append(max(header_w, data_w, col[2]))

    # Print header
    header_line = "  ".join(col[0].ljust(widths[i]) for i, col in enumerate(columns))
    print(header_line)

    # Print rows
    for row_data in grid:
        line = "  ".join(row_data[i].ljust(widths[i]) for i in range(len(columns)))
        print(line)


def output_json(rows):
    """Print rows as JSON array."""
    items = [dict(row) for row in rows]
    print(json.dumps(items, indent=2, default=str))


# ── Subcommands ───────────────────────────────────────────────────────

def cmd_content(args):
    """List/filter content."""
    db = connect()
    query = "SELECT date, platform, stage, title, slug, pillar, series, word_count FROM content WHERE 1=1"
    params = []

    if args.platform:
        query += " AND platform = ?"
        params.append(args.platform)
    if args.stage:
        query += " AND stage = ?"
        params.append(args.stage)
    if args.date:
        query += " AND date = ?"
        params.append(args.date)
    if args.since:
        query += " AND date >= ?"
        params.append(args.since)
    if args.until:
        query += " AND date <= ?"
        params.append(args.until)
    if args.pillar:
        query += " AND pillar LIKE ?"
        params.append(f"%{args.pillar}%")
    if args.series:
        query += " AND (series LIKE ? OR arc LIKE ?)"
        params.append(f"%{args.series}%")
        params.append(f"%{args.series}%")
    if args.slug:
        query += " AND slug LIKE ?"
        params.append(f"%{args.slug}%")

    query += " ORDER BY date DESC, platform ASC"

    rows = db.execute(query, params).fetchall()
    db.close()

    if args.count:
        print(len(rows))
        return

    if args.json:
        output_json(rows)
        return

    display = []
    for row in rows:
        display.append({
            "date": row["date"],
            "platform": row["platform"],
            "stage": row["stage"],
            "title": truncate(row["title"], 40),
            "words": fmt_number(row["word_count"]),
        })

    columns = [
        ("DATE", "date", 10),
        ("PLATFORM", "platform", 10),
        ("STAGE", "stage", 5),
        ("TITLE", "title", 30),
        ("WORDS", "words", 6),
    ]
    print_table(columns, display)


def cmd_skills(args):
    """List/search skills."""
    db = connect()
    query = "SELECT name, slug, category, description, last_modified FROM skills WHERE 1=1"
    params = []

    if args.category:
        query += " AND category = ?"
        params.append(args.category)
    if args.search:
        query += " AND name LIKE ?"
        params.append(f"%{args.search}%")

    query += " ORDER BY category ASC, name ASC"

    rows = db.execute(query, params).fetchall()
    db.close()

    if args.count:
        print(len(rows))
        return

    if args.json:
        output_json(rows)
        return

    display = []
    for row in rows:
        display.append({
            "category": row["category"],
            "name": truncate(row["name"], 40),
            "slug": row["slug"],
            "modified": row["last_modified"] or "-",
        })

    columns = [
        ("CATEGORY", "category", 8),
        ("NAME", "name", 30),
        ("SLUG", "slug", 25),
        ("MODIFIED", "modified", 10),
    ]
    print_table(columns, display)


def cmd_stats(args):
    """Daily log summary."""
    db = connect()
    query = "SELECT date, letter_grade, output_score, words_today, shipped_count, agent_cost FROM daily_logs WHERE 1=1"
    params = []

    if args.since:
        query += " AND date >= ?"
        params.append(args.since)
    if args.until:
        query += " AND date <= ?"
        params.append(args.until)

    query += " ORDER BY date DESC"

    if not args.since and not args.until:
        query += " LIMIT ?"
        params.append(args.latest)

    rows = db.execute(query, params).fetchall()
    db.close()

    if args.count:
        print(len(rows))
        return

    if args.json:
        output_json(rows)
        return

    display = []
    for row in rows:
        display.append({
            "date": row["date"],
            "grade": row["letter_grade"] or "-",
            "score": fmt_number(row["output_score"]),
            "words": fmt_number(row["words_today"]),
            "shipped": fmt_number(row["shipped_count"]),
            "cost": f"${row['agent_cost']:.2f}" if row["agent_cost"] is not None else "-",
        })

    columns = [
        ("DATE", "date", 10),
        ("GRADE", "grade", 5),
        ("SCORE", "score", 6),
        ("WORDS", "words", 8),
        ("SHIPPED", "shipped", 7),
        ("COST", "cost", 8),
    ]
    print_table(columns, display)


def cmd_links(args):
    """Cross-platform links."""
    db = connect()

    if args.slug:
        # Find all content matching the slug, then find their siblings
        query = """
            SELECT c1.date, c1.platform AS src_platform, c1.slug,
                   c2.platform AS linked_platform, cl.link_type
            FROM content_links cl
            JOIN content c1 ON cl.source_id = c1.id
            JOIN content c2 ON cl.target_id = c2.id
            WHERE c1.slug LIKE ? OR c2.slug LIKE ?
            ORDER BY c1.date DESC, c1.slug ASC
        """
        params = [f"%{args.slug}%", f"%{args.slug}%"]

    elif args.date:
        query = """
            SELECT c1.date, c1.platform AS src_platform, c1.slug,
                   c2.platform AS linked_platform, cl.link_type
            FROM content_links cl
            JOIN content c1 ON cl.source_id = c1.id
            JOIN content c2 ON cl.target_id = c2.id
            WHERE c1.date = ? OR c2.date = ?
            ORDER BY c1.slug ASC, c1.platform ASC
        """
        params = [args.date, args.date]

    else:
        query = """
            SELECT c1.date, c1.platform AS src_platform, c1.slug,
                   c2.platform AS linked_platform, cl.link_type
            FROM content_links cl
            JOIN content c1 ON cl.source_id = c1.id
            JOIN content c2 ON cl.target_id = c2.id
            ORDER BY c1.date DESC, c1.slug ASC
        """
        params = []

    rows = db.execute(query, params).fetchall()
    db.close()

    if args.count:
        print(len(rows))
        return

    if args.json:
        output_json(rows)
        return

    display = []
    for row in rows:
        display.append({
            "date": row["date"],
            "slug": truncate(row["slug"], 35),
            "from": row["src_platform"],
            "to": row["linked_platform"],
            "type": row["link_type"],
        })

    columns = [
        ("DATE", "date", 10),
        ("SLUG", "slug", 30),
        ("FROM", "from", 10),
        ("TO", "to", 10),
        ("TYPE", "type", 15),
    ]
    print_table(columns, display)


def cmd_sessions(args):
    """Session history."""
    db = connect()
    query = "SELECT session_date, machine, summary FROM sessions WHERE 1=1"
    params = []

    if args.machine:
        query += " AND machine = ?"
        params.append(args.machine)

    query += " ORDER BY session_date DESC LIMIT ?"
    params.append(args.latest)

    rows = db.execute(query, params).fetchall()
    db.close()

    if args.count:
        print(len(rows))
        return

    if args.json:
        output_json(rows)
        return

    display = []
    for row in rows:
        display.append({
            "date": row["session_date"],
            "machine": row["machine"] or "-",
            "summary": truncate(row["summary"], 80),
        })

    columns = [
        ("DATE", "date", 10),
        ("MACHINE", "machine", 10),
        ("SUMMARY", "summary", 60),
    ]
    print_table(columns, display)


# ── CLI setup ─────────────────────────────────────────────────────────

def build_parser():
    """Build the argparse parser with all subcommands."""
    parser = argparse.ArgumentParser(
        prog="query_index",
        description="Query the SQLite content index (data/index.db).",
    )

    # Global flags
    parser.add_argument("--json", action="store_true", help="Output as JSON instead of table")
    parser.add_argument("--count", action="store_true", help="Show only row count")

    subparsers = parser.add_subparsers(dest="command", help="Subcommand")

    # content
    p_content = subparsers.add_parser("content", help="List/filter content")
    p_content.add_argument("--platform", choices=["linkedin", "x", "substack", "reddit", "tiktok", "website"])
    p_content.add_argument("--stage", choices=["draft", "final"])
    p_content.add_argument("--date", help="Exact date (YYYY-MM-DD)")
    p_content.add_argument("--since", help="Start date (YYYY-MM-DD)")
    p_content.add_argument("--until", help="End date (YYYY-MM-DD)")
    p_content.add_argument("--pillar", help="Filter by pillar (substring)")
    p_content.add_argument("--series", help="Filter by series/arc name (substring)")
    p_content.add_argument("--slug", help="Filter by slug (substring)")

    # skills
    p_skills = subparsers.add_parser("skills", help="List/search skills")
    p_skills.add_argument("--category", choices=["cursor", "claude"])
    p_skills.add_argument("--search", help="Name substring match")

    # stats
    p_stats = subparsers.add_parser("stats", help="Daily log summary")
    p_stats.add_argument("--since", help="Start date (YYYY-MM-DD)")
    p_stats.add_argument("--until", help="End date (YYYY-MM-DD)")
    p_stats.add_argument("--latest", type=int, default=7, help="Show most recent N days (default: 7)")

    # links
    p_links = subparsers.add_parser("links", help="Cross-platform content links")
    p_links.add_argument("--slug", help="Show siblings for a slug")
    p_links.add_argument("--date", help="Show all linked content for a date")

    # sessions
    p_sessions = subparsers.add_parser("sessions", help="Session history")
    p_sessions.add_argument("--latest", type=int, default=5, help="Show most recent N sessions (default: 5)")
    p_sessions.add_argument("--machine", help="Filter by machine name")

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    commands = {
        "content": cmd_content,
        "skills": cmd_skills,
        "stats": cmd_stats,
        "links": cmd_links,
        "sessions": cmd_sessions,
    }

    commands[args.command](args)


if __name__ == "__main__":
    main()
