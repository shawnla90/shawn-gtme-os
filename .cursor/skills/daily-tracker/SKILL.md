---
name: daily-tracker
description: Track daily accomplishments, TODOs, and content pipeline. Auto-scans git + content folders, auto-detects Claude Code token usage, computes output scores with letter grades, generates Pillow dashboard cards. Use when the user types /tracker or asks about daily progress, what's next, or what they did today.
---

# Daily Activity Tracker v3.1

Track **everything** you shipped — content, GTM ops, partner deliverables, skills, scripts, and workflows. Auto-detects accomplishments from git, content folders, client/partner work, and file modification times. Auto-pulls Claude Code token usage from JSONL transcripts. Computes weighted output scores with letter grades and efficiency ratings. Visual dashboard card always generated. No manual steps required.

## Timing & Usage Context

The tracker is typically run **once per evening around ~20:00 (8 PM)** as an end-of-day log. It captures all work from the current calendar day (00:00 – 23:59). The next run will be ~24 hours later. Plan for this cadence — the scan window is always the full calendar day of the target date.

**This is a full-day output log** — not just content drafts. It must capture:
- Content creation (drafts, finals, lead magnets)
- GTM operations (partner/client onboarding, prompts, research, workflows)
- Skill creation and updates
- Workflow updates
- Cursor rules
- Scripts
- Git activity

## Privacy Rule — No Partner/Client Names in Output

**CRITICAL**: The dashboard image and tracker summary are shareable content. **Never include partner or client names** in accomplishment titles, score breakdowns, or any visible output. Use generic labels:
- "partner web reveal qualification" — NOT "acme web reveal qualification"
- "partner onboard skill" — NOT "acme partner skill"
- "client signal retrieval" — NOT "steves-recruiting signal retrieval"

This applies to the scanner (`daily_scan.py`), dashboard image, and any markdown summary the agent prints. The underlying JSON `path` field still contains the real path (for internal reference), but `title` must be scrubbed.

## Command Pattern

| Command | What it does |
|---------|-------------|
| `/tracker` or `/tracker today` | Scan + auto-detect tokens + compute score + **always generate dashboard image** |
| `/tracker add <description>` | Add manual accomplishment |
| `/tracker todo <task>` | Add a TODO (default priority: normal) |
| `/tracker todo high <task>` | Add a high-priority TODO |
| `/tracker done <id>` | Mark a TODO complete |
| `/tracker next` | Show pending TODOs + upcoming pipeline |
| `/tracker dashboard` | (Alias) Same as `/tracker` — always generates image |
| `/tracker tokens <input> <output> <model> [context]` | Override: manually log token usage for non-auto sources |
| `/tracker week` | Show last 7 days' accomplishment counts |

Also triggers on: "what did I do today", "what's next", "daily progress", "daily recap", "tracker".

## Workflow

### `/tracker` or `/tracker today` — Daily Summary + Dashboard

**IMPORTANT**: Always generate the dashboard image on every `/tracker` call.

1. Run the scanner (auto-detects accomplishments + Claude Code tokens + computes score):
   ```bash
   python3 scripts/daily_scan.py
   ```
2. **Auto-estimate Cursor tokens** for the current session (see Cursor Estimation below).
3. Generate the dashboard image:
   ```bash
   python3 scripts/daily_dashboard.py
   ```
4. Read `data/daily-log/YYYY-MM-DD.json` (where YYYY-MM-DD is today).
5. Show the dashboard image to the user (read `data/daily-log/YYYY-MM-DD.png`).
6. Print a brief markdown summary beneath it:

```markdown
## Daily Tracker — Thursday, Feb 12 2026  [A+ — 143 pts]

### Accomplishments (34)

**GTM Ops (13)**
- 16:55 [Partner onboard] partner onboard skill (508w) — 8 pts
- 18:12 [Partner prompt] partner web reveal qualification (1,576w) — 5 pts
- 17:28 [Partner prompt] partner campaign copy (376w) — 5 pts
- 14:54 [Partner prompt] partner web reveal qualification (959w) — 5 pts
- ...

**Content (9)**
- 21:58 [LI FINAL] content flywheel masterplan (635w) — 10 pts
- 21:42 [LI draft] content flywheel masterplan (1,463w) — 2 pts
- ...

**Skills & System (8)**
- 17:55 [Skill] partner-comms (863w) — 5 pts
- 17:28 [Skill] campaign-copy-workflow (887w) — 5 pts
- ...

### TODOs
- [ ] Finalize cursor-discovery substack for 2/14 (high)

### Stats
- 29,325 words written | 44 drafts in pipeline | active 00:46 – 23:08
- Score: 143 pts (A+) | Efficiency: 19.46 pts/$
- Tokens: 3.1M (2 claude-code, 1 cursor-est) | Est. cost: $7.75
- Breakdown: OPS:13 | SUB:5 | LI:3 | X:1 | Skills:8 | Scripts:2 | Other:2

### Pipeline (N drafts active)
- [SUB] build-day (Feb 13)
- [SUB] cursor-discovery (Feb 14)
- [LI] build-your-own-os (Feb 17)

### Git
- N commits | N files added | N files modified
```

### Cursor Token Estimation (Auto, Step 2)

Since Cursor IDE does not expose token data anywhere on disk, the agent auto-estimates usage for the current session when running `/tracker`:

1. Read the existing JSON.
2. Estimate the current Cursor session's token usage based on conversation length:
   - **Short session** (~5 exchanges): ~5,000 input / ~2,000 output
   - **Medium session** (~15 exchanges): ~20,000 input / ~8,000 output
   - **Large session** (~30+ exchanges): ~50,000+ input / ~20,000+ output
3. Check if a cursor-estimate entry already exists for approximately this time window. If so, update it; if not, append a new entry.
4. Use this format:
   ```json
   {
     "input_tokens": 20000,
     "output_tokens": 8000,
     "cache_read_tokens": 0,
     "cache_write_tokens": 0,
     "model": "sonnet",
     "source": "cursor-estimate",
     "confidence": "rough",
     "context": "cursor tracker session",
     "logged_at": "HH:MM",
     "cost": null
   }
   ```
   Leave `cost` as null — it will be computed from the model pricing.
5. Write the JSON back.

**The agent should always do this automatically** — never ask the user to manually log Cursor tokens.

### `/tracker add <description>` — Manual Accomplishment

1. Run the scanner first (to ensure the JSON exists):
   ```bash
   python3 scripts/daily_scan.py
   ```
2. Read `data/daily-log/YYYY-MM-DD.json`.
3. Append to the `accomplishments` array:
   ```json
   {
     "type": "manual",
     "title": "<description from the user>",
     "source": "manual",
     "timestamp": "HH:MM"
   }
   ```
   Use current time for the timestamp.
4. Write the JSON back.
5. Confirm: "Added: <description>"

### `/tracker todo <task>` — Add TODO

1. Run the scanner first.
2. Read the JSON.
3. Auto-generate the next `id` (find highest `tN` and increment).
4. Append to `todos`:
   ```json
   {
     "id": "tN",
     "task": "<task>",
     "status": "pending",
     "priority": "normal"
   }
   ```
   If the user said `/tracker todo high <task>`, set `"priority": "high"`.
5. Write the JSON back.
6. Confirm: "TODO t<N>: <task>"

### `/tracker done <id>` — Mark TODO Complete

1. Read the JSON.
2. Find the todo with matching `id`.
3. Set `"status": "done"`.
4. Write the JSON back.
5. Confirm: "Done: <task>"

### `/tracker next` — What's Next

1. Run the scanner.
2. Read the JSON.
3. Show:
   - All pending TODOs (high priority first)
   - Pipeline drafts sorted by target_date (soonest first)
   - Any substack posts with status "draft" from `workflows/substack-index.md`
4. Format as a focused list — just the actionable items, no noise.

### `/tracker tokens <input> <output> <model> [context]` — Manual Override

For sources that aren't auto-detected (e.g., ChatGPT, other tools). Claude Code sessions are auto-detected — you don't need this for those.

1. Read the JSON.
2. Append to the `token_usage` array:
   ```json
   {
     "input_tokens": 12500,
     "output_tokens": 3400,
     "cache_read_tokens": 0,
     "cache_write_tokens": 0,
     "model": "gpt4o",
     "source": "manual",
     "context": "chatgpt research session",
     "logged_at": "HH:MM",
     "cost": null
   }
   ```
3. Write the JSON back.
4. Confirm with running totals.

### `/tracker dashboard` — Visual Card (alias)

Same as `/tracker` — always generates the image. Kept for backward compatibility.

### `/tracker week` — Weekly Summary

1. Read the last 7 JSON files from `data/daily-log/`.
2. For each day, count accomplishments, score, pending TODOs, tokens used, and estimated cost.
3. Print a text table:

```markdown
## Weekly Summary (Feb 5 - Feb 11)

| Day | Shipped | Score | Grade | Words | Tokens | Cost | Commits |
|-----|---------|-------|-------|-------|--------|------|---------|
| Tue Feb 11 | 15 | 34 | A | 11,831 | 4.1M | $12.89 | 1 |
| Mon Feb 10 | 3 | 12 | C | 2,100 | 1.2M | $3.45 | 5 |
| ... | | | | | | | |
```

No image for weekly view yet — that's a future enhancement.

## Auto-Detection: How It Works

### Accomplishments (git + content + mtime)

The scanner (`scripts/daily_scan.py`) finds accomplishments from **four** sources:

1. **Git commits**: Files added or modified in today's commits
2. **Untracked files**: New files with today's date in the filename (e.g., `2026-02-11_slug.md`)
3. **Content pipeline**: Walks `content/*/drafts/` and `content/*/final/` for current state
4. **File modification time (mtime)**: Walks key directories and finds ANY file modified today, regardless of filename pattern. This is the critical source for GTM ops work — partner prompts, research docs, skills, and workflows that don't have date-prefixed filenames.

**Directories scanned by mtime:**
- `clients/` — partner and client deliverables (prompts, research, workflows, resources, SKILL.md)
- `.cursor/skills/` — Cursor agent skills
- `.claude/skills/` — Claude Code agent skills
- `workflows/` — Workflow indexes
- `.cursor/rules/` — Cursor rules
- `scripts/` — Python scripts
- `content/` — Content drafts and finals

Each accomplishment includes:
- **timestamp**: File's last-modified time as HH:MM
- **words**: Word count for .md/.txt files (YAML frontmatter stripped)
- **source**: `"auto"` (git/date-match), `"auto-mtime"` (modification time), or `"manual"`

### Classification Rules (full list)

**Content:**
- `content/{platform}/final/*.md|*.txt` -> `{platform}_final`
- `content/{platform}/drafts/*.md` -> `{platform}_draft`
- `content/substack/lead-magnet/*.md` -> `lead_magnet`

**GTM Ops — Partner:**
- `clients/partner/{name}/SKILL.md` -> `partner_onboard`
- `clients/partner/{name}/prompts/*.md` -> `partner_prompt`
- `clients/partner/{name}/research/*.md` -> `partner_research`
- `clients/partner/{name}/workflows/*.md` -> `partner_workflow`
- `clients/partner/{name}/resources/*.md` -> `partner_resource`

**GTM Ops — Client:**
- `clients/client/{name}/SKILL.md` -> `client_onboard`
- `clients/client/{name}/prompts/*.md` -> `client_prompt`
- `clients/client/{name}/research/*.md` -> `client_research`
- `clients/client/{name}/workflows/*.md` -> `client_workflow`
- `clients/client/{name}/resources/*.md` -> `client_resource`

**Skills & System:**
- `.cursor/skills/*/SKILL.md` -> `skill_updated`
- `.claude/skills/*/SKILL.md` -> `skill_updated`
- `.cursor/rules/*.md` -> `cursor_rule`
- `workflows/*.md` -> `workflow_updated`
- `*.py` -> `script`

### Token Usage (auto-detected from Claude Code)

The scanner auto-parses Claude Code session transcripts:

- **Source**: `~/.claude/projects/-Users-shawntenam-Desktop-shawn-gtme-os/*.jsonl`
- **What it reads**: Each JSONL file is a session. Lines with `message.usage` contain per-request token data.
- **Filters**: Only messages with timestamps matching the target date
- **Aggregates per session**: input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens, model
- **Model mapping**: `claude-opus-4-6` -> `opus`, `claude-sonnet-4-5-*` -> `sonnet`
- **Cost calculation**: Cache-aware pricing (cache read = 10% of input price, cache write = 125% of input price)
- **Stored as**: `source: "claude-code"` entries in token_usage

### Cursor Token Estimation

- **Source**: Agent self-estimation based on conversation length
- **Method**: Heuristic based on exchange count (see Cursor Token Estimation section above)
- **Stored as**: `source: "cursor-estimate"` with `confidence: "rough"`
- **When**: Auto-appended by the agent during `/tracker` execution

## Scoring System

### Point Weights

| Item Type | Type Code | Points |
|-----------|-----------|--------|
| Monorepo / project scaffold | `monorepo_build` / `project_scaffold` | 50 |
| Feature system (RPG, dashboard, complex feature) | `feature_system` | 30 |
| Landing page / full page build | `landing_page` / `full_page_build` | 25 |
| Code infrastructure (scripts, config, CI/CD) | `code_infra` | 15 |
| Finalized content (in `final/`) | `*_final` | 10 |
| Partner/client onboard (SKILL.md) | `partner_onboard` / `client_onboard` | 8 |
| Manual accomplishment | `manual` | 5 |
| New skill or workflow | `skill_updated` / `workflow_updated` | 5 |
| Partner/client prompt | `partner_prompt` / `client_prompt` | 5 |
| Partner/client research | `partner_research` / `client_research` | 5 |
| Partner/client workflow | `partner_workflow` / `client_workflow` | 5 |
| Lead magnet | `lead_magnet` | 5 |
| Cursor rule | `cursor_rule` | 3 |
| Draft content (in `drafts/`) | `*_draft` | 2 |
| Partner/client resource | `partner_resource` / `client_resource` | 2 |
| Script | `script` | 2 |
| Pipeline draft (untouched) | — | 0 |

### Computed Metrics

- **Output Score**: Sum of weighted points from accomplishments
- **Efficiency Rating**: Output Score / Total Token Cost (pts/$ — higher is better)
- **Letter Grade**:

| Score | Grade |
|-------|-------|
| > 500 | S+ |
| 300-500 | S |
| 150-299 | A+ |
| 50-149 | A |
| 15-49 | B |
| 5-14 | C |
| < 5 | D |

### Dashboard Display

- **Grade badge**: Large colored pill next to "DAILY TRACKER" title
- **Score text**: "34 pts" next to the badge
- **Score breakdown**: Compact formula in the subheader area (e.g., `10+10+5+5+2+2 = 34 pts`)
- **Efficiency**: Shown in the token panel (e.g., `Efficiency: 2.6 pts/$`)

## Data

- **Daily logs**: `data/daily-log/YYYY-MM-DD.json`
- **Dashboard images**: `data/daily-log/YYYY-MM-DD.png`
- **Scanner script**: `scripts/daily_scan.py`
- **Dashboard script**: `scripts/daily_dashboard.py`

## JSON Schema (v3)

```json
{
  "date": "2026-02-11",
  "generated_at": "2026-02-11T18:30:00Z",
  "version": 3,
  "accomplishments": [
    {
      "type": "substack_final",
      "title": "identity not tools",
      "path": "content/substack/final/2026-02-11_identity-not-tools.md",
      "source": "auto",
      "timestamp": "09:14",
      "words": 1240
    }
  ],
  "pipeline": {
    "drafts_active": [
      {
        "platform": "substack",
        "title": "cursor discovery",
        "path": "content/substack/drafts/2026-02-14_cursor-discovery.md",
        "target_date": "2026-02-14",
        "words": 890
      }
    ],
    "finalized_today": []
  },
  "todos": [],
  "token_usage": [
    {
      "session_id": "e801554c-0a22-469a-9353-15f2b93edf18",
      "input_tokens": 155,
      "output_tokens": 743,
      "cache_read_tokens": 3709248,
      "cache_write_tokens": 387734,
      "model": "opus",
      "source": "claude-code",
      "messages": 88,
      "context": "claude-code 16:42",
      "logged_at": "21:05",
      "cost": 12.89
    },
    {
      "input_tokens": 20000,
      "output_tokens": 8000,
      "cache_read_tokens": 0,
      "cache_write_tokens": 0,
      "model": "sonnet",
      "source": "cursor-estimate",
      "confidence": "rough",
      "context": "cursor tracker session",
      "logged_at": "21:10",
      "cost": null
    }
  ],
  "stats": {
    "platform_breakdown": {"ops": 13, "linkedin": 3, "x": 1, "substack": 5, "other": 8},
    "words_today": 4200,
    "pipeline_words": 18500,
    "finals_count": 1,
    "first_activity": "09:14",
    "last_activity": "17:45",
    "output_score": 34,
    "letter_grade": "A",
    "score_breakdown": [
      {"type": "substack_final", "title": "identity not tools", "points": 10},
      {"type": "linkedin_draft", "title": "daily tracker system", "points": 2}
    ],
    "efficiency_rating": 2.6
  },
  "git_summary": {
    "commits_today": 3,
    "files_added": [],
    "files_modified": []
  }
}
```

## Merge Safety

The scanner **never deletes** manual accomplishments, TODOs, or non-auto token entries. Merge rules:
- **Auto-detected accomplishments** (`source: "auto"` and `"auto-mtime"`): Refreshed each scan
- **Manual accomplishments**: Preserved forever
- **TODOs**: Preserved forever (status changes stick)
- **Claude Code tokens** (`source: "claude-code"`): Replaced on re-scan (idempotent)
- **Cursor estimates** (`source: "cursor-estimate"`): Preserved (agent appends)
- **Manual tokens** (`source: "manual"`): Preserved forever

Safe to run multiple times per day.

## Dependencies

- Python 3 (stdlib only for scanner)
- Pillow (`pip install Pillow`) for dashboard image generation
- Menlo font (pre-installed on macOS)

## Error Handling

- **No JSON exists yet**: Scanner creates it from scratch
- **Pillow not installed**: Dashboard command will fail — install via `pip install Pillow`
- **Git not available**: Scanner skips git section, still scans content directories
- **~/.claude/ not found**: Scanner skips token auto-detection, still works for everything else
- **No token_usage yet**: Dashboard shows 2-column layout (no token panel)
- **Malformed JSON**: Scanner overwrites with fresh data (manual entries lost — edge case)
