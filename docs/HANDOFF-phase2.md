# Phase 2 Handoff — Safety Enforcement
> Generated: 2026-02-20 | For: Fresh Claude Code session on MacBook

## Context

A full system audit was completed today. Phase 1 (Foundation Docs) is done:
- `docs/ARCHITECTURE.md` — Complete system map (cron pipeline, websites, data layer, 49 skills, 17 MCP servers, model allocation)
- `docs/MACHINE-SETUP.md` — Canonical machine identity (MacBook=shawntenam, Mini=shawnos.ai)
- `scripts/daily_cron.sh` — Now includes repo_stats.py as Step 1e
- `.cursor/skills/sync-machines/SKILL.md` — Fixed MacBook username, dynamic rsync paths
- Merge conflicts in profile.json + website-stats.json resolved
- 6 corrections from Mac Mini merged (Vercel Pro, Discord operational, blog inline pattern, model allocation table, build-time JSON, .vercel gitignore)

Git state: Clean on main, synced with origin. Both machines current.

## Phase 2 Tasks (3 items)

### Task 1: Install Husky + pre-push hook
**Why**: The `/update-github` skill runs a 7-step safety scan (blocklist for partner/client names, IP exposure detection, commit message audit). But it's manual-only. One sleepy `git push` and client names hit the public repo.

**What to do**:
- Install Husky in the repo root (not in website/)
- Create a pre-push hook (NOT pre-commit — too noisy during rapid dev)
- The hook should run the blocklist scan from `.claude/blocklist.txt` against staged/tracked files
- Look at `.claude/skills/update-github/SKILL.md` for the existing scan logic to wire up
- The hook must work on both machines (MacBook + Mac Mini) — use relative paths

**Key files**:
- `.claude/blocklist.txt` — The existing blocklist of partner/client names
- `.claude/skills/update-github/SKILL.md` — Existing 7-step scan logic (the source of truth for what to check)

### Task 2: Post-cron Slack notification
**Why**: If the nightly pipeline fails on either machine, nobody knows until manual cron.log check. With two machines running independently, silent failures can go days.

**What to do**:
- Add a Slack webhook call at the end of `scripts/daily_cron.sh`
- Fire on both success and failure (different messages)
- Include: date, success/fail status, any WARN messages from the run
- Slack MCP is already configured (2 workspaces: Lead Alchemy + RevPartners). Use a webhook URL stored in `.env` (e.g., `SLACK_CRON_WEBHOOK`)
- Keep it simple — one `curl` call. Don't overcomplicate.

**Key files**:
- `scripts/daily_cron.sh` — Add the webhook call at the end (and in the fatal exit path)

### Task 3: Auto-generated skill inventory
**Why**: 49 skills and growing. No auto-generated index. If a skill gets renamed, moved, or deprecated, nothing catches it.

**What to do**:
- Create `scripts/skill_inventory.py` — Scans `.cursor/skills/` and `.claude/skills/`
- For each skill: extract name, description (from YAML frontmatter or first heading), trigger pattern, last-modified date
- Output: `docs/_generated/skill-manifest.md` (markdown table)
- Add to `scripts/daily_cron.sh` as Step 1f (non-fatal, after repo_stats.py)
- Add `$GIT add docs/_generated/skill-manifest.md` to the staging step

**Key files**:
- `.cursor/skills/*/SKILL.md` — Each has YAML frontmatter with `name` and `description`
- `.claude/skills/*/SKILL.md` — Same format
- `scripts/daily_cron.sh` — Add Step 1f

## Architecture Reference

Read `docs/ARCHITECTURE.md` first — it's the single source of truth for how the system fits together. The nightly cron pipeline section shows exactly where new steps should be inserted.

## After Phase 2

Update `docs/ARCHITECTURE.md`:
- Remove "No git hooks" from Known Gaps
- Remove "No cron failure alerting" from Known Gaps
- Remove "No auto-generated skill manifest" from Known Gaps
- Add the skill inventory script to the Scripts table
- Add Husky to the system overview
- Update the Change Log
