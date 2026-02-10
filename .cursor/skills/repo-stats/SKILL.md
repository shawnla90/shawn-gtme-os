---
name: repo-stats
description: Computes repo size, file counts, and value-oriented stats (skills, content, scripts), writes data/repo-stats.json, and prints a short summary. Use when the user types /repostats or asks for repo stats, repo value, or baseline for a dashboard.
---

# Repo Stats

When the user types `/repostats` or asks for **repo stats**, **repo value**, or a **baseline for a dashboard**, refresh the canonical stats file and show a short summary.

## Command pattern

- `/repostats` — refresh stats and print summary
- "repo stats", "repo value", "what's my repo worth", "baseline for dashboard" — same behavior

## Workflow

### 1. Run the refresh script

- From the **repo root**, run: `python3 scripts/repo_stats.py`
- The script uses `git ls-files` (tracked files only), counts by extension and by area, and writes `data/repo-stats.json`. Schema: [data/repo-stats-schema.md](data/repo-stats-schema.md).

### 2. If the script is missing or fails

- Compute counts by walking the repo (respecting .gitignore): count files under `.cursor/skills`, `skills`, `content`, `scripts`, `clients`, `data`, `workflows`; count lines in .md, .py, .json.
- Write `data/repo-stats.json` with the same shape as in the schema. Set `generated_at` to current ISO 8601 UTC.

### 3. Read the generated file

- Load `data/repo-stats.json` to confirm it was written and to build the summary.

### 4. Print a short markdown summary

Include:

- **Generated**: `generated_at`
- **Volume**: files total, lines (md+py+json)
- **By area**: cursor_skills (files + skills_invokable), voice_playbooks, content (drafts + finalized), scripts, clients, data, workflows
- **Git**: commits_total, commits_since_2025
- **Reminder**: "Stats file: `data/repo-stats.json` — use it as the source of truth for a future dashboard."

Keep the summary brief; no need to read every file. The script does the work; the skill runs it and reports.
