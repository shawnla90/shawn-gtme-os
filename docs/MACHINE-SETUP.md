# Machine Setup

> Canonical machine identity document. Single-machine setup.
> Last updated: 2026-03-05

## The Machine

| Property | Value |
|----------|-------|
| **Machine** | Mac Mini |
| **Hostname** | `Shawns-Mac-mini.local` |
| **macOS User** | `shawnos.ai` |
| **Home Dir** | `/Users/shawnos.ai` |
| **Repo Path** | `/Users/shawnos.ai/shawn-gtme-os` |
| **Role** | Dev + always-on server (single machine) |
| **AI Tools** | Claude Code (Max subscription, Opus 4.6), Nio (Sonnet 4), Qwen 2.5 14B (local Ollama) |
| **Cron** | Nightly pipeline (daily_cron.sh), ABM pipeline, agent crons |
| **Network** | Wired, always on LAN |

## Path Convention

Scripts MUST use dynamic path resolution:

```bash
# Shell — use REPO_ROOT (already used by daily_cron.sh, sync_main.sh)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
```

```python
# Python — use script location
import pathlib
REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
```

**Do NOT hardcode** `/Users/shawnos.ai/` in scripts. Use dynamic resolution.

For home-directory resources (Claude Code):
```python
import os
HOME = os.path.expanduser("~")
```

## What Runs Here

| Component | Notes |
|-----------|-------|
| Nightly cron (daily_cron.sh) | Main pipeline, fires at midnight via launchd |
| Sync-main (sync_main.sh) | Fires at 23:58 via launchd |
| ABM pipeline | 22:00 daily |
| Agent crons (sentinel, scout, etc.) | Various schedules |
| Claude Code terminal | Primary dev environment |
| `.claude/skills/` | Agent skills for Claude Code |
| Git push/pull | Commits to origin/main |
| Python scripts | All data pipeline scripts |
| validate_feeds.sh | Post-deploy RSS checks |

## LaunchAgent Plists

All plists target the Mac Mini (`/Users/shawnos.ai/`).

| Plist | Schedule | Script |
|-------|----------|--------|
| `com.shawnos.sync-main` | 23:58 | sync_main.sh |
| `com.shawnos.daily-tracker` | 00:00 | daily_cron.sh |
| `com.shawnos.abm-pipeline` | 22:00 | ABM pipeline |
| `com.shawnos.abm-depersonalize` | 06:00 | depersonalize.py |

**Installation**: Copy to `~/Library/LaunchAgents/` and `launchctl load`.

## MCP Server Config

MCP configs live at `~/.mcp.json` (per-machine, not in repo). See `.cursor/mcp-servers.md` in the repo for the canonical list of servers, auth types, and setup status.

Servers with local paths that need machine-specific setup:
- Instantly MCP (`~/instantly-mcp/`)
- Fathom MCP (`~/fathom-mcp/`)
- Google Sheets (service account at `~/.config/gcp/sheets-service-account.json`)

## Known Path Issues

All previously hardcoded paths have been resolved (2026-03-01):

| File | Issue | Status |
|------|-------|--------|
| `scripts/nio_commit_tracker.py` | Was hardcoded | Fixed — uses `Path(__file__).resolve().parent.parent` |
| `scripts/mission_control_updater.py` | Was hardcoded | Fixed — uses `REPO_ROOT` |
| `scripts/launchd/com.shawnos.obsidian-sync.plist` | Was `/Users/shawntenam/` | Fixed 2026-03-05 — updated to `/Users/shawnos.ai/` |

## Change Log

| Date | Change |
|------|--------|
| 2026-02-20 | Initial creation (Phase 1 audit). |
| 2026-03-01 | Added session role assignments (now removed - single machine). |
| 2026-03-05 | Rewrote for single-machine setup. Removed dual-machine topology, SSH config, sync-machines, session role assignments. Mac Mini is now dev + server. |
