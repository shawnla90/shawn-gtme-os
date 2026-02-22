#!/usr/bin/env python3
"""
generate_content_json.py — Query index.db and output JSON for Mission Control.

Reads the SQLite content index and produces:
  1. public/data/content.json  — full content pipeline data
  2. Updates metrics.json drafts[] with real counts

Designed to run after build_index.py in the daily cron pipeline.

Usage:
    python3 scripts/generate_content_json.py
"""

import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = REPO_ROOT / "data" / "index.db"
CONTENT_JSON = REPO_ROOT / "website" / "apps" / "mission-control" / "public" / "data" / "content.json"
METRICS_JSON = REPO_ROOT / "website" / "apps" / "mission-control" / "public" / "metrics.json"


def get_db():
    """Connect to the index database."""
    if not DB_PATH.exists():
        print(f"ERROR: {DB_PATH} not found. Run build_index.py first.", file=sys.stderr)
        sys.exit(1)
    return sqlite3.connect(str(DB_PATH))


def query_content(db):
    """Fetch all content rows as dicts."""
    db.row_factory = sqlite3.Row
    rows = db.execute(
        "SELECT * FROM content ORDER BY date DESC, platform ASC"
    ).fetchall()
    return [dict(r) for r in rows]


def query_links(db):
    """Fetch all content links with resolved file paths."""
    db.row_factory = sqlite3.Row
    rows = db.execute("""
        SELECT
            cl.link_type,
            s.file_path AS source_path,
            s.platform AS source_platform,
            s.slug AS source_slug,
            s.date AS source_date,
            t.file_path AS target_path,
            t.platform AS target_platform,
            t.slug AS target_slug,
            t.date AS target_date
        FROM content_links cl
        JOIN content s ON cl.source_id = s.id
        JOIN content t ON cl.target_id = t.id
        ORDER BY s.date DESC, s.slug ASC
    """).fetchall()
    return [dict(r) for r in rows]


def query_stats(db):
    """Fetch recent daily log stats."""
    db.row_factory = sqlite3.Row
    rows = db.execute(
        "SELECT * FROM daily_logs ORDER BY date DESC LIMIT 14"
    ).fetchall()
    return [dict(r) for r in rows]


def build_pipeline_summary(content_items):
    """Build platform x stage summary counts."""
    summary = {}
    for item in content_items:
        plat = item["platform"]
        stage = item["stage"]
        if plat not in summary:
            summary[plat] = {"draft": 0, "final": 0, "total": 0, "words": 0}
        summary[plat][stage] = summary[plat].get(stage, 0) + 1
        summary[plat]["total"] += 1
        summary[plat]["words"] += item.get("word_count") or 0
    return summary


def build_series_groups(content_items):
    """Group content by arc/series for pipeline visualization."""
    groups = {}
    for item in content_items:
        arc = item.get("arc")
        if not arc:
            continue
        if arc not in groups:
            groups[arc] = {
                "arc": arc,
                "pillar": item.get("pillar"),
                "items": [],
            }
        groups[arc]["items"].append({
            "platform": item["platform"],
            "title": item["title"],
            "slug": item["slug"],
            "date": item["date"],
            "stage": item["stage"],
            "series_position": item.get("series_position"),
            "word_count": item.get("word_count"),
        })
    # Sort items within each group by position then date
    for group in groups.values():
        group["items"].sort(key=lambda x: (x.get("series_position") or 99, x.get("date") or ""))
    return list(groups.values())


def build_content_json(content_items, links, stats):
    """Build the full content.json structure."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

    pipeline = build_pipeline_summary(content_items)
    series = build_series_groups(content_items)

    # Recent drafts (last 14 days)
    recent = [
        {
            "platform": c["platform"],
            "title": c["title"],
            "slug": c["slug"],
            "date": c["date"],
            "stage": c["stage"],
            "pillar": c.get("pillar"),
            "arc": c.get("arc"),
            "word_count": c.get("word_count"),
            "file_path": c["file_path"],
        }
        for c in content_items[:50]  # most recent 50
    ]

    # Link groups
    link_groups = {}
    for link in links:
        key = f"{link['source_date']}_{link['source_slug']}"
        if key not in link_groups:
            link_groups[key] = {
                "date": link["source_date"],
                "slug": link["source_slug"],
                "platforms": set(),
                "link_types": set(),
            }
        link_groups[key]["platforms"].add(link["source_platform"])
        link_groups[key]["platforms"].add(link["target_platform"])
        link_groups[key]["link_types"].add(link["link_type"])

    cross_platform = [
        {
            "date": g["date"],
            "slug": g["slug"],
            "platforms": sorted(g["platforms"]),
            "link_types": sorted(g["link_types"]),
            "platform_count": len(g["platforms"]),
        }
        for g in link_groups.values()
    ]
    cross_platform.sort(key=lambda x: x["date"] or "", reverse=True)

    # Daily stats (for sparkline / trend data)
    daily = [
        {
            "date": s["date"],
            "grade": s.get("letter_grade"),
            "score": s.get("output_score"),
            "words": s.get("words_today"),
            "shipped": s.get("shipped_count"),
            "cost": s.get("agent_cost"),
        }
        for s in stats
    ]

    totals = {
        "total_content": len(content_items),
        "total_drafts": sum(1 for c in content_items if c["stage"] == "draft"),
        "total_final": sum(1 for c in content_items if c["stage"] == "final"),
        "total_words": sum(c.get("word_count") or 0 for c in content_items),
        "platforms_active": len(pipeline),
        "cross_platform_groups": len(cross_platform),
        "series_count": len(series),
    }

    return {
        "generated": now,
        "totals": totals,
        "pipeline": pipeline,
        "recent": recent,
        "series": series,
        "crossPlatform": cross_platform,
        "dailyStats": daily,
    }


def update_metrics_drafts(content_items):
    """Update the drafts[] section of metrics.json with real data."""
    if not METRICS_JSON.exists():
        return

    try:
        metrics = json.loads(METRICS_JSON.read_text())
    except (json.JSONDecodeError, OSError):
        return

    drafts = [
        c for c in content_items
        if c["stage"] == "draft" and c.get("date")
    ]
    drafts.sort(key=lambda x: x["date"] or "", reverse=True)

    metrics["drafts"] = [
        {
            "type": d["platform"],
            "title": d.get("title") or d.get("slug") or "Untitled",
            "status": "draft",
            "date": d.get("date"),
            "pillar": d.get("pillar"),
        }
        for d in drafts[:10]  # most recent 10
    ]

    metrics["telemetry"]["draftsTracked"] = len(drafts)
    metrics["generated"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

    METRICS_JSON.write_text(json.dumps(metrics, indent=2) + "\n")
    print(f"  Updated {METRICS_JSON.name}: {len(drafts)} drafts tracked")


def main():
    print("Generating content JSON from index.db")

    db = get_db()

    content_items = query_content(db)
    links = query_links(db)
    stats = query_stats(db)

    print(f"  Content: {len(content_items)} items")
    print(f"  Links:   {len(links)} connections")
    print(f"  Stats:   {len(stats)} days")

    # Build and write content.json
    data = build_content_json(content_items, links, stats)
    CONTENT_JSON.parent.mkdir(parents=True, exist_ok=True)
    CONTENT_JSON.write_text(json.dumps(data, indent=2) + "\n")
    print(f"  Wrote {CONTENT_JSON.relative_to(REPO_ROOT)}")

    # Update metrics.json drafts section
    update_metrics_drafts(content_items)

    db.close()
    print("Done.")


if __name__ == "__main__":
    main()
