---
name: sync-machines
description: Sync gitignored directories (clients/, partners/, scripts/, .env) between MacBook and Mac Mini over SSH using rsync. Use when the user types /sync-to-mini, /sync-from-mini, /sync-to-macbook, /sync-from-macbook, or /sync-machines.
---

# Sync Machines — rsync Between MacBook & Mac Mini

Bidirectional rsync of gitignored operational directories between the two dev machines. Git handles tracked files; this skill handles everything git doesn't.

## Command Pattern

- `/sync-to-mini` — push local-only files FROM MacBook TO Mac Mini
- `/sync-from-mini` — pull local-only files FROM Mac Mini TO MacBook
- `/sync-to-macbook` — push local-only files FROM Mac Mini TO MacBook
- `/sync-from-macbook` — pull local-only files FROM MacBook TO Mac Mini
- `/sync-machines` — auto-detect current machine and prompt for direction

## Machine Config

| Machine | Hostname | User | Repo Path |
|---------|----------|------|-----------|
| Mac Mini | `Shawns-Mac-mini.local` | `shawnos.ai` | `/Users/shawnos.ai/shawn-gtme-os` |
| MacBook | `Shawns-MacBook-Pro.local` | `shawntenam` | `/Users/shawntenam/Desktop/shawn-gtme-os` |

**Prerequisite**: SSH key auth must be configured between machines (no password prompts). Test with:
```bash
# From MacBook:
ssh shawnos.ai@Shawns-Mac-mini.local echo "ok"
# From Mac Mini:
ssh shawntenam@Shawns-MacBook-Pro.local echo "ok"
```

## What Gets Synced

These directories/files are gitignored and ONLY exist locally. They must be synced explicitly.

| Path | Contents |
|------|----------|
| `clients/` | All partner work — research, prompts, workflows, resources |
| `partners/` | Partner integrations |
| `scripts/` | Automation scripts |
| `.env` | Primary environment variables |
| `.env.*` | Additional env files (.env.local, .env.production, etc.) |
| `.notion-sync-state.json` | Notion sync cursor state |
| `content/internal/` | Internal content drafts |
| `.internal/` | Internal operational files |
| `data/` (gitignored portions) | Local data files (excluding tracked daily-log/, progression/, website-stats.json) |

## What Does NOT Get Synced

- `node_modules/` — reinstall locally (`npm install` in `website/`)
- `.DS_Store` — OS artifacts
- `screenshots/` — ephemeral captures
- MCP config (`~/.cursor/mcp.json`) — handled separately via `/addmcp` or the MCP mirror doc

## Workflow

### Step 1: Detect Current Machine

Run `hostname` to determine which machine we're on:

```bash
hostname
```

- `Shawns-Mac-mini.local` → we are on the Mac Mini
- `Shawns-MacBook-Pro.local` → we are on the MacBook

### Step 2: Determine Direction

Based on the command used:

| Command | Source | Destination |
|---------|--------|-------------|
| `/sync-to-mini` | MacBook (local) | Mac Mini (remote) |
| `/sync-from-mini` | Mac Mini (remote) | MacBook (local) |
| `/sync-to-macbook` | Mac Mini (local) | MacBook (remote) |
| `/sync-from-macbook` | MacBook (remote) | Mac Mini (local) |

If `/sync-machines` is used, ask the user which direction.

**Validation**: If the command implies the current machine is the source but we're on the wrong machine, warn and offer the correct command. For example, if the user says `/sync-to-mini` but we're on the Mini, suggest `/sync-from-macbook` instead.

### Step 3: Pre-Sync Check

Before running rsync, display what will happen:

```
Sync Pre-Flight
────────────────
Source:      MacBook (local)
Destination: Mac Mini (Shawns-Mac-mini.local)

Directories:
  → clients/
  → partners/
  → scripts/
  → content/internal/
  → .internal/

Files:
  → .env, .env.*
  → .notion-sync-state.json

Mode: --dry-run first, then execute
```

### Step 4: Dry Run

Always do a dry run first to show what would transfer:

Determine the local repo path dynamically based on current machine:

```bash
# Auto-detect repo root (works on both machines)
REPO_ROOT="$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)" || REPO_ROOT="$(git rev-parse --show-toplevel)"
```

Then dry-run:

```bash
rsync -avzn --delete \
  --include='clients/***' \
  --include='partners/***' \
  --include='scripts/***' \
  --include='content/internal/***' \
  --include='.internal/***' \
  --include='.env' \
  --include='.env.*' \
  --include='.notion-sync-state.json' \
  --exclude='*' \
  "$REPO_ROOT/" \
  <REMOTE_USER>@<REMOTE_HOST>:<REMOTE_REPO_PATH>/
```

The `-n` flag makes this a dry run. Display the output to the user:

```
Dry Run Results
───────────────
Files to transfer: 47
Files to delete:   2 (removed on source since last sync)
Total size:        12.3 MB

Proceed? (showing deltas only)
```

### Step 5: Execute Sync

Run the actual rsync (remove `-n` flag):

```bash
rsync -avz --delete \
  --include='clients/***' \
  --include='partners/***' \
  --include='scripts/***' \
  --include='content/internal/***' \
  --include='.internal/***' \
  --include='.env' \
  --include='.env.*' \
  --include='.notion-sync-state.json' \
  --exclude='*' \
  "$REPO_ROOT/" \
  <REMOTE_USER>@<REMOTE_HOST>:<REMOTE_REPO_PATH>/
```

**For pulling FROM remote** (when remote is source), swap the paths:

```bash
rsync -avz --delete \
  --include='clients/***' \
  --include='partners/***' \
  --include='scripts/***' \
  --include='content/internal/***' \
  --include='.internal/***' \
  --include='.env' \
  --include='.env.*' \
  --include='.notion-sync-state.json' \
  --exclude='*' \
  <REMOTE_USER>@<REMOTE_HOST>:<REMOTE_REPO_PATH>/ \
  "$REPO_ROOT/"
```

**Machine-specific values** (see [docs/MACHINE-SETUP.md](../../docs/MACHINE-SETUP.md)):

| If you're on... | REMOTE_USER | REMOTE_HOST | REMOTE_REPO_PATH |
|-----------------|-------------|-------------|-------------------|
| MacBook → Mini | `shawnos.ai` | `Shawns-Mac-mini.local` | `/Users/shawnos.ai/shawn-gtme-os` |
| Mini → MacBook | `shawntenam` | `Shawns-MacBook-Pro.local` | `/Users/shawntenam/Desktop/shawn-gtme-os` |

### Step 6: Post-Sync Report

```
Sync Complete
─────────────
Direction:    MacBook → Mac Mini
Transferred:  47 files (12.3 MB)
Deleted:      2 files (stale on destination)
Duration:     4.2s

Synced directories:
  ✓ clients/       (34 files)
  ✓ partners/      (8 files)
  ✓ scripts/       (3 files)
  ✓ .env files     (2 files)
```

## Error Handling

- **SSH connection refused**: "Can't reach `<host>`. Is the machine awake and on the same network? Test with: `ssh <REMOTE_USER>@<host> echo ok`"
- **Permission denied**: "SSH key auth not set up. Run `ssh-copy-id <REMOTE_USER>@<host>` from this machine first."
- **Host not found**: "Hostname `<host>` not resolving. Try the machine's IP address instead, or check if both machines are on the same network."
- **Partial transfer**: rsync is resumable — re-run the same command to pick up where it left off.
- **Conflict concern**: rsync overwrites the destination. If both machines edited the same file, the source wins. The `--dry-run` step catches this — review deletions carefully.

## Safety Rules

1. **Always dry-run first** — never skip the `-n` pass
2. **Direction matters** — always sync FROM the machine you just worked on TO the other
3. **Git first** — commit and push tracked changes before syncing. Run `git status` to confirm clean working tree for tracked files
4. **Review deletions** — the `--delete` flag removes files on the destination that don't exist on the source. The dry run shows these. If unexpected, abort and investigate
5. **Never sync node_modules** — reinstall locally instead

## Session Ritual Integration

**Start of session** (on whichever machine you sit down at):
```
1. git pull --rebase origin main
2. /sync-from-<other-machine>
3. Work normally
```

**End of session**:
```
1. /deploy (or just commit + push)
2. /sync-to-<other-machine>
```
