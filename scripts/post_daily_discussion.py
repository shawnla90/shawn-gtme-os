#!/usr/bin/env python3
"""
post_daily_discussion.py — Post a daily stats discussion to GitHub.

Reads the daily log JSON and progression profile, composes a formatted
discussion post, and publishes it to the repo's Announcements category
via the GitHub GraphQL API.

Usage:
    python3 scripts/post_daily_discussion.py --date 2026-02-21
    python3 scripts/post_daily_discussion.py  # defaults to yesterday
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent.parent
REPO_ID = "R_kgDORLzDtw"
ANNOUNCEMENTS_CATEGORY_ID = "DIC_kwDORLzDt84C3AWO"
GH_BIN = "/Users/shawntenam/.local/bin/gh"


def load_json(path: Path) -> Optional[dict]:
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def xp_bar(current: int, target: int, width: int = 20) -> str:
    pct = min(current / target, 1.0) if target > 0 else 0
    filled = int(pct * width)
    empty = width - filled
    return f"{'█' * filled}{'░' * empty} {pct:.0%}"


def format_accomplishments(accomplishments: list) -> str:
    if not accomplishments:
        return "_No accomplishments logged._"
    shipped = [a for a in accomplishments if a.get("shipped")]
    lines = []
    for a in shipped[:15]:
        title = a.get("title", "untitled")
        atype = a.get("type", "").replace("_", " ")
        score = a.get("value_score", 0)
        lines.append(f"- **{title}** ({atype}) — {score} pts")
    if len(shipped) > 15:
        lines.append(f"- _...and {len(shipped) - 15} more_")
    return "\n".join(lines)


def build_body(daily: dict, profile: dict, repo_stats: Optional[dict]) -> str:
    date = daily["date"]
    stats = daily.get("stats", {})
    grade = stats.get("letter_grade", "?")
    output_score = stats.get("output_score", 0)

    # Find this date's scoring entry in profile
    scoring = {}
    for entry in profile.get("scoring_log", []):
        if entry.get("date") == date:
            scoring = entry
            break

    xp_earned = scoring.get("xp", 0)
    commits = scoring.get("commits", 0)
    streak = profile.get("current_streak", 0)
    multiplier = profile.get("streak_multiplier", 1.0)
    level = profile.get("level", 1)
    title = profile.get("title", "Unknown")
    char_class = profile.get("class", "Unknown")
    xp_total = profile.get("xp_total", 0)
    xp_next = profile.get("xp_next_level", 0)
    tier = profile.get("avatar_tier", 1)
    milestones = profile.get("milestones", [])

    accomplishments = daily.get("accomplishments", [])
    shipped_count = sum(1 for a in accomplishments if a.get("shipped"))
    total_words = sum(a.get("words", 0) for a in accomplishments)

    body = f"""## Daily Log: {date}

| Metric | Value |
|--------|-------|
| **Grade** | {grade} |
| **Output Score** | {output_score} |
| **XP Earned** | +{xp_earned} |
| **Commits** | {commits} |
| **Items Shipped** | {shipped_count} |
| **Words Written** | {total_words:,} |
| **Streak** | {streak} days ({multiplier}x multiplier) |

---

### RPG Status

| | |
|---|---|
| **Level** | {level} — {title} |
| **Class** | {char_class} |
| **XP** | `{xp_bar(xp_total, xp_next)}` {xp_total:,} / {xp_next:,} |
| **Avatar Tier** | {tier} |
| **Milestones** | {len(milestones)} unlocked |

---

### What Shipped

{format_accomplishments(accomplishments)}
"""

    # Add repo stats if available
    if repo_stats:
        counts = repo_stats.get("counts", {})
        git = repo_stats.get("git", {})
        body += f"""
---

### Repo Snapshot

| Metric | Value |
|--------|-------|
| **Files Tracked** | {counts.get('files_total', '?')} |
| **Total Commits** | {git.get('commits_total', '?')} |
| **Lines (md/py/json)** | {counts.get('lines_md_py_json', 0):,} |
"""

    body += "\n---\n_Auto-posted by the GTME-OS nightly pipeline._"
    return body


def post_discussion(title: str, body: str) -> Optional[str]:
    mutation = """
    mutation($repoId: ID!, $catId: ID!, $title: String!, $body: String!) {
      createDiscussion(input: {
        repositoryId: $repoId,
        categoryId: $catId,
        title: $title,
        body: $body
      }) {
        discussion {
          url
        }
      }
    }
    """
    result = subprocess.run(
        [
            GH_BIN, "api", "graphql",
            "-f", f"query={mutation}",
            "-f", f"repoId={REPO_ID}",
            "-f", f"catId={ANNOUNCEMENTS_CATEGORY_ID}",
            "-f", f"title={title}",
            "-f", f"body={body}",
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"ERROR: gh api failed: {result.stderr}", file=sys.stderr)
        return None
    data = json.loads(result.stdout)
    return data.get("data", {}).get("createDiscussion", {}).get("discussion", {}).get("url")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="Target date (YYYY-MM-DD). Defaults to yesterday.")
    args = parser.parse_args()

    if args.date:
        target_date = args.date
    else:
        target_date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    daily_path = REPO_ROOT / "data" / "daily-log" / f"{target_date}.json"
    profile_path = REPO_ROOT / "data" / "progression" / "profile.json"
    repo_stats_path = REPO_ROOT / "data" / "repo-stats.json"

    daily = load_json(daily_path)
    if not daily:
        print(f"No daily log found for {target_date} — skipping discussion post.")
        return

    profile = load_json(profile_path)
    if not profile:
        print("No progression profile found — skipping discussion post.")
        return

    repo_stats = load_json(repo_stats_path)

    title = f"Daily Log: {target_date}"
    body = build_body(daily, profile, repo_stats)
    url = post_discussion(title, body)

    if url:
        print(f"Discussion posted: {url}")
    else:
        print("Failed to post discussion.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
