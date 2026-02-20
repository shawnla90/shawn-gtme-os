# ShawnOS Architecture

> Single source of truth for how the entire system fits together.
> Last updated: 2026-02-20

## System Overview

ShawnOS is a personal AI operating system that gamifies daily engineering output with RPG progression mechanics. It spans 2 machines, 4 websites, 49 skills, 17 MCP servers, and a nightly automation pipeline that scans work, scores it, and deploys fresh data.

```
┌─────────────────────────────────────────────────────────────────┐
│                        SHAWN AI OS                              │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│  Skill Tree  │  Client Ops  │   Websites   │  Data Pipeline    │
│  (49 skills) │  (3 partners │  (4 Next.js  │  (6 Python + 2   │
│              │   1 client)  │   apps)      │   shell scripts)  │
├──────────────┴──────────────┴──────────────┴───────────────────┤
│                     2 Machines (git + rsync)                    │
│              MacBook (shawntenam) + Mac Mini (shawnos.ai)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Machine Topology

See [MACHINE-SETUP.md](./MACHINE-SETUP.md) for full machine identity details.

| Machine | User | Role | Repo Path |
|---------|------|------|-----------|
| MacBook Pro | `shawntenam` | Primary dev (human at keyboard) | `/Users/shawntenam/Desktop/shawn-gtme-os` |
| Mac Mini | `shawnos.ai` | Always-on server (OpenClaw, cron) | `/Users/shawnos.ai/shawn-gtme-os` |

**Sync model**: Git handles tracked files. The `/sync-machines` skill uses rsync for gitignored dirs (clients/, partners/, .env files).

---

## Nightly Cron Pipeline

The most critical piece of automation. Two launchd jobs fire in sequence every night.

### Timing

```
23:58  sync_main.sh      ← Pre-sync: stash, pull --rebase, push (clean repo)
00:00  daily_cron.sh      ← Main pipeline: scan → score → commit → deploy → validate
00:00  elauwit automation ← Partner: fetch Instantly replies (parallel, independent)
```

### Data Flow

```
23:58 ─ sync_main.sh
         ├─ git stash
         ├─ git pull --rebase origin main
         ├─ resolve conflicts (remote wins)
         ├─ git stash pop
         └─ git push
              ↓ CLEAN REPO STATE
00:00 ─ daily_cron.sh
         │
         ├─ Step 1: daily_scan.py --date YYYY-MM-DD
         │    Reads: file mtimes, git log, Claude Code JSONL, Cursor tracking
         │    Writes: data/daily-log/YYYY-MM-DD.json
         │    (accomplishments, XP scores, token costs, letter grade)
         │
         ├─ Step 1b: session_cost_tracker.py (non-fatal)
         │    Reads: ~/.openclaw/agents/main/sessions/ JSONL
         │    Writes: data/daily-log/cost-tracker/YYYY-MM-DD.json
         │
         ├─ Step 1c: progression_engine.py (non-fatal)
         │    Reads: all data/daily-log/*.json
         │    Writes: data/progression/profile.json
         │    (XP total, level, title, class, milestones, avatar tier)
         │
         ├─ Step 1d: website_scanner.py (non-fatal)
         │    Reads: website/ monorepo
         │    Writes: data/website-stats.json
         │    (LOC, routes, features, site scores, Nio tier)
         │
         ├─ Step 1e: repo_stats.py (non-fatal)
         │    Reads: git ls-files
         │    Writes: data/repo-stats.json
         │    (file counts, LOC, skill count, content inventory)
         │
         ├─ Step 2: daily_dashboard.py (non-fatal)
         │    Reads: daily JSON + profile
         │    Writes: data/daily-log/YYYY-MM-DD.png (gitignored)
         │
         ├─ Step 3: Check if JSON was produced
         │    No JSON → exit clean
         │
         ├─ Step 4: git add + commit
         │    Stages: daily-log/*.json, cost-tracker/*.json,
         │            profile.json, website-stats.json, repo-stats.json
         │    Message: "chore: daily tracker scan YYYY-MM-DD"
         │
         ├─ Step 5: git push origin HEAD
         │    Triggers: Vercel auto-deploy (all 3 public sites)
         │    Fallback: pull --rebase + retry on failure
         │
         └─ Step 6: validate_feeds.sh (non-fatal)
              Curls 11 RSS feed endpoints
              Validates: HTTP 200, valid XML, has <item>s
```

### Failure Modes

| Component | Failure | Impact |
|-----------|---------|--------|
| daily_scan.py | Fatal (exit 1) | Entire cron stops — no data for the day |
| session_cost_tracker.py | Non-fatal (WARN) | Cost data missing, cron continues |
| progression_engine.py | Non-fatal (WARN) | Profile not updated, cron continues |
| website_scanner.py | Non-fatal (WARN) | Website stats stale, cron continues |
| repo_stats.py | Non-fatal (WARN) | Repo stats stale, cron continues |
| git push | Retry once | Pulls --rebase then retries |
| validate_feeds.sh | Non-fatal (WARN) | Logged but cron succeeds |

### Logs

| Log | Path |
|-----|------|
| Cron execution | `data/daily-log/cron.log` |
| Sync pre-check | `data/daily-log/sync-main-stdout.log` |
| LaunchAgent stdout | `data/daily-log/launchd-stdout.log` |
| LaunchAgent stderr | `data/daily-log/launchd-stderr.log` |

---

## Websites

All 4 sites share a Turborepo monorepo at `website/`.

**Stack**: Next.js 15, React 19, TailwindCSS 4, TypeScript

| Site | Domain | Dev Port | Purpose |
|------|--------|----------|---------|
| **ShawnOS** | shawnos.ai | 3000 | Main dashboard: RPG progression, daily logs, knowledge base, feeds |
| **TheGTMOS** | thegtmos.ai | 3001 | GTM operations: Clay wiki, email guides, GTM knowledge |
| **TheContentOS** | thecontentos.ai | 3002 | Content portfolio: content wiki, guides |
| **Mission Control** | mission-control.shawnos.ai | 3003 | Internal: system metrics, task board, team, calendar |

### Shared Package

`website/packages/shared/` — 27 reusable components used across all sites:
AvatarBadge, TerminalChrome, TypewriterHero, DailyLogView, Navigation, Footer, KnowledgeGuidePage, QuestBoardPage, etc.

### RSS Feeds (11 total)

| Site | Feed | Path |
|------|------|------|
| ShawnOS | blog, all, knowledge, how-to, nio-terminal, daily-logs | `/feed.xml`, `/feed/*.xml` |
| TheGTMOS | main, clay-wiki, knowledge | `/feed.xml`, `/feed/*.xml` |
| TheContentOS | main, content-wiki | `/feed.xml`, `/feed/*.xml` |

Validated nightly by `scripts/validate_feeds.sh` (XML well-formedness, item count, HTTP status).

### Deploy Flow

```
git push origin main → Vercel webhook → Build all 3 public sites → Edge deploy
```

Mission Control pre-generates `public/metrics.json` at build time via `scripts/generate-metrics.js`.

---

## Data Layer

### Directory Structure

```
data/
├── daily-log/                    # Per-day activity snapshots
│   ├── YYYY-MM-DD.json           # Accomplishments, scores, grades, tokens
│   ├── cost-tracker/             # Per-day OpenClaw token costs
│   │   └── YYYY-MM-DD.json
│   ├── briefings/                # Optional pre-written summaries
│   ├── cron.log                  # Nightly cron execution log
│   └── YYYY-MM-DD.png           # Dashboard image (gitignored)
├── progression/
│   ├── profile.json              # Current RPG state (level, XP, class, milestones)
│   └── avatars/                  # Per-tier animated sprites (GIF)
├── repo-stats.json               # Repository statistics snapshot
├── website-stats.json            # Website monorepo scoring
└── skill-tree/                   # Skill tree snapshots
```

### Key Schemas

**daily-log/YYYY-MM-DD.json**: `accomplishments[]` (type, path, value_score, shipped), `stats` (output_score, letter_grade, efficiency_rating), `token_usage[]`, `git_summary`

**progression/profile.json**: `name`, `title`, `level` (1-50), `xp_total`, `class` (Builder/Scribe/Strategist), `avatar_tier` (1-6), `milestones[]`

**website-stats.json**: `total_score`, `grade`, `nio_tier`, `sites{}` (per-site LOC, routes, features), `infra` (monorepo, technical features)

**repo-stats.json**: `counts` (files, LOC), `by_area` (skills, playbooks, content, clients), `git` (commits)

---

## Scripts

| Script | Purpose | Called By | Output |
|--------|---------|-----------|--------|
| `daily_scan.py` | Scan daily work, compute XP | daily_cron.sh | daily-log/YYYY-MM-DD.json |
| `session_cost_tracker.py` | Track OpenClaw token costs | daily_cron.sh | cost-tracker/YYYY-MM-DD.json |
| `progression_engine.py` | Aggregate XP, resolve level/class | daily_cron.sh | progression/profile.json |
| `website_scanner.py` | Score website monorepo | daily_cron.sh | website-stats.json |
| `repo_stats.py` | Repo file/LOC inventory | daily_cron.sh | repo-stats.json |
| `daily_dashboard.py` | Render dashboard PNG | daily_cron.sh | daily-log/YYYY-MM-DD.png |
| `rpg_sprites.py` | Generate avatar GIFs | progression_engine.py | avatars/tier-*.gif |
| `daily_cron.sh` | Orchestrate nightly pipeline | launchd (00:00) | Commit + push + validate |
| `sync_main.sh` | Pre-sync git state | launchd (23:58) | Clean repo |
| `validate_feeds.sh` | Smoke test RSS feeds | daily_cron.sh | PASS/WARN/FAIL report |
| `mission_control_updater.py` | Update Mission Control data | NOT integrated | Orphaned |
| `nio_commit_tracker.py` | Track NIO commit productivity | NOT integrated | Orphaned |

### Orphaned Scripts (need integration or removal)

- `mission_control_updater.py` — Has hardcoded Mac Mini paths, not called by cron
- `nio_commit_tracker.py` — Has hardcoded Mac Mini paths, not called by cron

---

## Skills (49 total)

### By Category

**Content Creation** (15): final-copy, final-substack, substack-post, substack-note, email-copy, viral-hooks, linkedin-comments, value-pin-comments, x-tip, x-tip-image, aios-image, content-images, tiktok-script, faceless-script, image-to-content

**GTM Operations** (9): partner-onboard, web-reveal-workflow, campaign-copy-workflow, domain-calc, heyreach-export, heyreach-conversations, heyreach-partner-handoff, instantly-replies, partner-comms

**Website & Dev** (5): deploy, webfix, website-feature, edit, xlsx

**System & Infrastructure** (12): daily-tracker, repo-stats, skill-tree, skill-play, plan-format, slack-sync, slack-mcp, slack-reminder, notion-sync, linkedin-recon, sync-machines, agent-context-handoff, add-mcp, avatar-develop, idea-bank, clickup-time-track

**Content Distribution** (5): play-draft, skill-play, substack-note, heyreach-partner-handoff, partner-comms

**Maintenance/Safety** (3, in `.claude/skills/`): restart-openclaw, sync-main, update-github

### Skill Locations

- `.cursor/skills/` — 46 skills (Cursor IDE)
- `.claude/skills/` — 3 skills (Claude Code terminal)

---

## MCP Servers (17 configured)

| Server | Auth Type | Used By |
|--------|-----------|---------|
| Slack (Lead Alchemy) | Bot Token | /slack-*, /partner-comms |
| Slack (RevPartners) | Bot Token | /slack-*, /partner-comms |
| GitHub | PAT | /update-github, PRs |
| Instantly | API Key | /instantly-replies |
| HeyReach | MCP Key (URL) | /heyreach-* |
| Browserbase | API Key | /linkedin-recon |
| Figma | OAuth | Design reference |
| Notion | OAuth | /notion-sync |
| ClickUp | OAuth | /partner-onboard, /clickup-time-track |
| Typefully | API Key | /final-copy |
| Substack | Session Token | /final-substack, /substack-* |
| Vercel | OAuth | /deploy |
| Fathom | API Key | Analytics |
| ElevenLabs | API Key | Voice/audio |
| Google Sheets | Service Account | Spreadsheet ops |
| Firecrawl | API Key | Web scraping |
| Reddit | None | Research |

---

## Voice & Content System (SKILL.md)

Three-tier marketing voice architecture (v4.0):

- **Tier 1 — Voice DNA**: core-voice.md, anti-slop.md, safety-filters.md
- **Tier 2 — Context Playbooks**: linkedin.md, x-twitter.md, tiktok.md, client-comms.md, internal-team.md
- **Tier 3 — Content Ops**: substance-requirements.md, pre-publish-checklist.md, improvement-protocol.md, pitfalls.md, success-patterns.md + pillar definitions + workflows

---

## Client Operations

```
clients/
├── partner/          # GTM engineering (employer work)
│   ├── elauwit/      # Multifamily WiFi/NaaS (Nasdaq: ELWT)
│   ├── connext/      # Multi-site enterprise tech deployment
│   └── exol/         # Warehouse-as-a-Service (GreenBox)
└── client/           # Lead Alchemy consulting ($200/hr)
    └── steves/       # Legacy Recruiting (cold call-first)
```

Each entity follows the standard structure: SKILL.md, research/, prompts/, workflows/, resources/.

---

## OpenClaw

OpenClaw is a persistent AI gateway running as a macOS LaunchAgent (`KeepAlive: true`) on the Mac Mini. It provides:

- IPC communication bridge for the AI OS
- Workspace memory at `~/.openclaw/workspace/memory/`
- Session logging at `~/.openclaw/agents/main/sessions/` (consumed by cost tracker)
- Health monitoring via Mission Control integration

Restart procedure: `.claude/skills/restart-openclaw/SKILL.md`

---

## IP Protection

`IP_REGISTRY.md` defines tiered protection levels:
- **Tier 1 (All Rights Reserved)**: Scoring algorithms, progression engine, voice DNA
- **Tier 2 (MIT/Educational)**: UI components, website templates
- **Tier 3 (Public)**: Blog content, RSS feeds

The `/update-github` skill enforces a blocklist scan before every push to the public repo.

---

## Known Gaps (as of 2026-02-20)

1. **No git hooks** — Safety scans require manual `/update-github` invocation
2. **No GitHub Actions** — No automated validation of what Mac Mini pushes
3. **No cron failure alerting** — Silent failures go unnoticed
4. **Orphaned scripts** — mission_control_updater.py and nio_commit_tracker.py have hardcoded paths and aren't wired into the pipeline
5. **No auto-generated skill manifest** — 49 skills with no auto-index
6. **Discord placeholders** — Mission Control reports 'connected' but no bot exists

---

## Change Log

| Date | Change |
|------|--------|
| 2026-02-20 | Initial creation (Phase 1 audit) |
