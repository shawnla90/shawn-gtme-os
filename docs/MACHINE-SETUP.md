# Machine Setup

> Canonical machine identity document. Which machine is which, actual paths, what runs where.
> Last updated: 2026-02-20

## The Two Machines

| Property | MacBook Pro | Mac Mini |
|----------|-------------|----------|
| **Hostname** | `Shawns-MacBook-Pro.local` | `Shawns-Mac-mini.local` |
| **macOS User** | `shawntenam` | `shawnos.ai` |
| **Home Dir** | `/Users/shawntenam` | `/Users/shawnos.ai` |
| **Repo Path** | `/Users/shawntenam/Desktop/shawn-gtme-os` | `/Users/shawnos.ai/shawn-gtme-os` |
| **Role** | Primary dev (human at keyboard) | Always-on server |
| **AI Tools** | Claude Code, Cursor IDE | OpenClaw gateway (24/7) |
| **Cron** | Nightly pipeline (daily_cron.sh) | Nightly pipeline (daily_cron.sh) |
| **Network** | Portable (Wi-Fi/ethernet) | Wired, always on LAN |

## Path Convention

Scripts that run on both machines MUST use dynamic path resolution:

```bash
# Shell — use REPO_ROOT (already used by daily_cron.sh, sync_main.sh)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
```

```python
# Python — use script location
import pathlib
REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
```

**Do NOT hardcode** `/Users/shawnos.ai/` or `/Users/shawntenam/` in scripts.

For home-directory resources (OpenClaw, Claude Code, Cursor):
```python
import os
HOME = os.path.expanduser("~")
```

## What Runs Where

### Both Machines

| Component | Notes |
|-----------|-------|
| Nightly cron (daily_cron.sh) | Same pipeline, different launchd plist per machine |
| Sync-main (sync_main.sh) | Fires at 23:58 via launchd |
| Git push/pull | Both commit to origin/main |
| Python scripts | All data pipeline scripts |
| validate_feeds.sh | Post-deploy RSS checks |

### MacBook Only

| Component | Notes |
|-----------|-------|
| Cursor IDE | Primary development environment |
| `.cursor/skills/` (46 skills) | Agent skills for Cursor |
| `.cursor/mcp.json` | MCP server configs (home-dir, not in repo) |
| Human interaction | Where Shawn sits and works |

### Mac Mini Only

| Component | Notes |
|-----------|-------|
| OpenClaw gateway | Persistent LaunchAgent, KeepAlive: true |
| `~/.openclaw/` | Workspace memory, session logs |
| Claude Code terminal | Runs via OpenClaw |
| `.claude/skills/` (3 skills) | restart-openclaw, sync-main, update-github |
| Partner-Alpha automation | fetch-replies-automation.py at midnight |

## LaunchAgent Plists

Each machine needs its own plist because paths differ. The repo contains reference copies.

| Plist | Target Machine | Schedule | Script |
|-------|---------------|----------|--------|
| `scripts/com.shawnos.sync-main.plist` | Mac Mini | 23:58 | sync_main.sh |
| `scripts/com.shawnos.daily-tracker.plist` | MacBook | 00:00 | daily_cron.sh |
| `clients/partner/partner-alpha/workflows/com.partner-alpha.instantly-replies.plist` | MacBook | 00:00 | fetch-replies-automation.py |

**Installation**: Copy to `~/Library/LaunchAgents/` and `launchctl load`.

**Machine-specific plist generation**: When setting up a new machine or fixing paths, update the plist to use that machine's actual paths. The `bootstrap.sh` script handles initial installation.

## Sync Between Machines

**Tracked files (git)**: Both machines push/pull from `origin/main`. The 23:58 pre-sync ensures clean state before nightly cron.

**Gitignored files (rsync)**: Use the `/sync-machines` skill:
- `/sync-to-mini` — Push from MacBook to Mac Mini
- `/sync-from-mini` — Pull from Mac Mini to MacBook

Synced dirs: `clients/`, `partners/`, `scripts/`, `.env*`, `.notion-sync-state.json`, `content/internal/`, `.internal/`

**NOT synced**: `node_modules/`, `.DS_Store`, `screenshots/`, `~/.cursor/mcp.json`, `~/.openclaw/`

## SSH Config

Both machines must have passwordless SSH configured:

```bash
# From MacBook
ssh shawnos.ai@Shawns-Mac-mini.local echo "ok"

# From Mac Mini
ssh shawntenam@Shawns-MacBook-Pro.local echo "ok"
```

## MCP Server Config

MCP configs live at `~/.cursor/mcp.json` (per-machine, not in repo). See `.cursor/mcp-servers.md` in the repo for the canonical list of all 17 servers, auth types, and setup status per machine.

Servers with local paths that need per-machine setup:
- Instantly MCP (`~/instantly-mcp/`)
- Fathom MCP (`~/fathom-mcp/`)
- Google Sheets (service account at `~/.config/gcp/sheets-service-account.json`)

## Known Path Issues

Files with hardcoded machine-specific paths that should be made dynamic:

| File | Issue | Severity |
|------|-------|----------|
| `scripts/nio_commit_tracker.py` | Hardcodes `/Users/shawnos.ai/` (line 150) | High — breaks on MacBook |
| `scripts/mission_control_updater.py` | Hardcodes `/Users/shawnos.ai/` (lines 17, 28) | High — breaks on MacBook |
| `website/apps/mission-control/app/api/tasks/route.ts` | Hardcodes `/Users/shawnos.ai/` (lines 8-9) | High — API fails on MacBook |

These should be fixed by using environment variables or `__dirname`-relative resolution.

## Change Log

| Date | Change |
|------|--------|
| 2026-02-20 | Initial creation (Phase 1 audit). Fixed sync-machines SKILL.md to reflect actual MacBook username. |
