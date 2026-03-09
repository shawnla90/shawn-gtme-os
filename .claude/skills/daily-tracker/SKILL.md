---
name: daily-tracker
description: Track daily accomplishments, TODOs, and content pipeline. Auto-scans git + content folders, detects Claude Code tokens, computes weighted output scores with letter grades, generates Pillow dashboard cards. Use when the user types /tracker or asks about daily progress.
---

# Daily Activity Tracker

Run typically once per evening (~20:00). Captures all work for the calendar day.

## Commands

| Command | Action |
|---------|--------|
| `/tracker` | Full scan + score + dashboard image |
| `/tracker add <desc>` | Add manual accomplishment |
| `/tracker todo <task>` | Add TODO (use `todo high` for high priority) |
| `/tracker done <id>` | Mark TODO complete |
| `/tracker next` | Show pending TODOs + pipeline |
| `/tracker week` | Last 7 days summary table |

## Workflow (`/tracker`)

0. **Pre-flight**: Compare SCORE_WEIGHTS/GRADE_THRESHOLDS in `scripts/daily_scan.py` against this doc. Code is source of truth.
1. Run `python3 scripts/daily_scan.py`
2. Generate dashboard: `python3 scripts/daily_dashboard.py`
3. Read + display `data/daily-log/YYYY-MM-DD.png` and print markdown summary

## Privacy Rule

**NEVER include partner/client names** in output. Use generic labels: "partner web reveal qualification" not "acme web reveal qualification". Applies to dashboard image and all visible output.

## Auto-Detection Sources

- **Git commits**: files added/modified today
- **Content pipeline**: `content/*/drafts/` and `content/*/final/`
- **Mtime scan**: `clients/`, `.cursor/skills/`, `.claude/skills/`, `workflows/`, `scripts/`, `content/`
- **Claude Code tokens**: parsed from `~/.claude/projects/.../*.jsonl` session transcripts

## Scoring (code in daily_scan.py is authoritative)

Key tiers: monorepo_build/system_engine (50) > feature_system/feature_script (30) > landing_page/complex_script (25) > code_infra (15) > finals (10) > partner_onboard (8) > skills/prompts/research (5) > rules/routes/libs (3) > drafts/resources/styles (2) > config (1)

Grades: S+ (>500) | S (350-500) | A+ (150-299) | A (50-149) | B (15-49) | C (5-14) | D (<5)

## Data Locations

- Daily logs: `data/daily-log/YYYY-MM-DD.json`
- Dashboard images: `data/daily-log/YYYY-MM-DD.png`
- Scanner: `scripts/daily_scan.py`
- Dashboard renderer: `scripts/daily_dashboard.py`

## Dependencies

Python 3, Pillow (`pip install Pillow`), Menlo font (macOS built-in)
