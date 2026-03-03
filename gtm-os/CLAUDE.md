# GTM-OS - AI Operating Instructions

> This is the self-contained GTM operations folder for Lead Alchemy / theGTMOS.ai.
> If you're an AI assistant opening this folder, everything you need is here or symlinked.

## Identity

**Who:** Shawn Tenam - founder of Lead Alchemy, building theGTMOS.ai
**What:** An automated ABM pipeline that discovers companies, researches them, generates personalized landing pages, syncs to CRM, and runs multi-touch outbound sequences.
**Product:** The landing page IS the pitch. A custom page at `thegtmos.ai/for/company-name` showing: research, challenges, deliverables, timeline, tech stack. The page itself is the demo.

## Tool Inventory

| Tool | Role | Status | MCP? | Config |
|------|------|--------|------|--------|
| **Exa** | Discovery + deep research | Active | Yes | `scripts/.env` → `EXA_API_KEY` |
| **Apollo** | Contact enrichment (name, email, title, LinkedIn) | Active | Yes | `scripts/.env` → `APOLLO_API_KEY` |
| **Grok (xAI)** | AI copy generation (page data, vibes) | Active | No | `scripts/.env` → `XAI_API_KEY` |
| **Supabase** | System of record - warehouse | Active | No | `scripts/.env` → `SUPABASE_URL`, `SUPABASE_KEY` |
| **Attio** | Human-facing CRM - workbench | Active | Yes | `scripts/.env` → `ATTIO_API_TOKEN` |
| **Lemlist** | Campaign sequencing + warmup | Active | Yes | Lemlist dashboard |
| **Maildoso** | Sending infrastructure (8 accounts, 2 domains) | Active | No | `scripts/maildoso_accounts.json` |
| **PostHog** | Page view analytics | Active | Yes | Project 325806, Dashboard 1319078 |
| **Firecrawl** | Website scraping for enrichment | Active | No | `scripts/.env` → `FIRECRAWL_API_KEY` |
| **Clay** | Enrichment waterfalls, Claygents | Planned | No | - |
| **HubSpot** | CRM (migration path, demo config) | Planned | Yes | - |
| **Instantly** | Outbound at scale | Planned | No | - |
| **Prospeo** | Email verification | Planned | No | - |
| **HeyReach** | LinkedIn automation | Planned | No | - |
| **Blitz** | Blitz API | Planned | No | - |

## Data Flow

```
 ┌─────────┐     ┌──────────┐     ┌────────────┐     ┌──────────┐
 │   Exa   │────>│  Apollo   │────>│ Exa + Grok │────>│ Supabase │
 │ discover│     │ enrich    │     │ generate   │     │ warehouse│
 └─────────┘     └──────────┘     └────────────┘     └────┬─────┘
                                                          │
                              ┌────────────────────────────┤
                              │                            │
                         ┌────▼────┐              ┌───────▼────────┐
                         │  Attio  │              │ thegtmos.ai    │
                         │ CRM     │              │ /for/{slug}    │
                         └────┬────┘              └───────┬────────┘
                              │                           │
                         ┌────▼──────────┐         ┌─────▼──────┐
                         │ Lemlist       │         │  PostHog   │
                         │ sequencing    │         │  analytics │
                         └────┬──────────┘         └────────────┘
                              │
                         ┌────▼──────────┐
                         │ Maildoso      │
                         │ 8 accounts    │
                         │ 24 emails/day │
                         └───────────────┘
```

## Key Conventions

### Naming
- Campaigns: `YYYY-MM-slug` (e.g., `2026-03-abm-v1`)
- Landing page slugs: max 40 chars, company name only, no blog URLs
- Partner folders: `partners/<name>/SKILL.md` as entry point

### Architecture Split
- **Supabase = the warehouse.** Every account ever researched, every contact, every page, every send. Full universe. Thousands of rows.
- **Attio = the workbench.** Only accounts actively being worked. Clean, curated, human-usable. Accounts graduate from Supabase to Attio when ready for outreach.

### Partner Loading
When working on a specific partner/client, always load their `SKILL.md` first:
```
partners/<name>/SKILL.md    # capabilities, context, constraints
partners/<name>/research/   # gathered intel
partners/<name>/prompts/    # custom AI prompts
partners/<name>/workflows/  # step-by-step playbooks
```

## Workflow Rules

### Pipeline Execution
```bash
# Safe daily pipeline (research + prospect + generate + sync + depersonalize)
python3 scripts/pipeline.py --step all --limit 10

# Individual steps
python3 scripts/pipeline.py --step research --limit 5
python3 scripts/pipeline.py --step prospect --limit 5
python3 scripts/pipeline.py --step generate --limit 5
python3 scripts/pipeline.py --step sync --limit 50
python3 scripts/pipeline.py --step depersonalize

# DESTRUCTIVE - outreach is explicit only, never in --step all
python3 scripts/pipeline.py --step outreach --limit 5 --dry-run
python3 scripts/pipeline.py --step outreach --limit 5
```

### Preflight Before Outreach
1. Verify email addresses are populated (not empty strings)
2. Check landing page renders at `thegtmos.ai/for/{slug}`
3. Run `--dry-run` first, always
4. Confirm daily send capacity (8 accounts x 3/day = 24 max)

### What --step all Does NOT Include
- `outreach` - destructive, explicit only
- `check_replies` - manual
- `gap_analysis` - manual
- `find_similar` - manual
- `push_to_lemlist` - manual

## Folder Map

```
gtm-os/
├── CLAUDE.md              ← you are here
├── status.md              ← current pipeline health, blockers, metrics
├── log.md                 ← append-only session log
├── demand/                ← WHO buys (ICP, positioning, competitors)
├── segments/              ← target groups within ICP
├── messaging/             ← WHAT we say (angles, proof points, templates)
├── campaigns/             ← HOW we execute (active + archived campaigns)
├── engine/                ← THE MACHINE (one doc per tool, architecture)
├── scripts/    → symlink  ← ../scripts/abm/ (38 Python files, don't move)
├── partners/   → symlink  ← ../clients/partner/ (4 active partners)
├── playbooks/  → symlink  ← ../playbooks/ (playbook library)
└── content/               ← publishing side-effects (seeds, case studies)
```

## External Service IDs

| Service | Reference |
|---------|-----------|
| Attio Target List (companies) | `9c6e26b5-b3b6-494d-8e43-b6726a38a6af` |
| Attio Target List (people) | `ba966502-f512-4c3a-bf8d-1be3cf54cd16` |
| PostHog Project | 325806 |
| PostHog Dashboard | 1319078 |
| Lemlist Tracking ID | `tea_Z2cdZTSqWMD4qevy4` |
| Supabase Project | `uohlxmupujhxhbffspzs` |

## Automation Schedule (Mac Mini)

| Time | Job | Script |
|------|-----|--------|
| 22:00 | Full pipeline (research + prospect + generate + sync + depersonalize) | `pipeline.py --step all --limit 10 --resume` |
| 06:00 | TTL depersonalization | `depersonalize.py` |
| Manual | Outreach sends | `outreach.py --limit N` |
| Manual | Reply checking | `check_replies.py` |
| Manual | Lemlist push | `push_to_lemlist.py` |

## Safety

- **Never commit** `scripts/.env`, `scripts/maildoso_accounts.json`, or anything in `partners/` to public repos
- **Outreach is destructive** - always `--dry-run` first, explicit step only
- **Pre-push blocklist** enforced via Husky hook - never bypass with `--no-verify`
- **Partner data** stays in `partners/` (symlinked from `clients/partner/`) - never copy into gtm-os/ directly
- **Pattern vs person** - critique approaches and architectures, never name specific clients or individuals
