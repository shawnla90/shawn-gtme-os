# how I run 4 AI models for under $1/day

most people pick one AI model and use it for everything. that's like using a sledgehammer to hang a picture frame. it works. but you're overpaying and overbuilding.

I run 4 models. each one has a job. total daily cost dropped from $50 to under $1. here's exactly how.

---

## the squad

### 1. Ollama / Qwen 2.5 14B — the grunt worker (FREE)

runs locally on my Mac Mini M4 Pro. handles all the repetitive stuff that doesn't need genius-level reasoning.

**what it does:**
- commit tracking (scans git log, summarizes what shipped)
- RSS feed monitoring (checks feeds, flags new content)
- mission control dashboard updates (regenerates data JSONs)
- status reports (writes system health snapshots)

**why it works:** these tasks run 4+ times per day. at Opus pricing ($75/M output tokens), that was 96 API calls burning real money for work a 14B model handles fine. M4 Pro with 24GB runs it comfortably at ~9GB VRAM.

**config (openclaw.json):**
```json
{
  "id": "commit-tracker",
  "name": "Commit Tracker",
  "payload": {
    "model": "ollama/qwen2.5:14b"
  },
  "enabled": true
}
```

### 2. Claude Sonnet 4 — the commander ($15/M output)

handles all conversations, orchestration, and agent coordination. this is Nio, the main agent.

**what it does:**
- WhatsApp and Discord conversations
- task routing and agent coordination
- memory management (reads/writes daily memory files)
- real-time decision making

**why it works:** Sonnet is 5x cheaper than Opus but handles conversation and orchestration just as well. the quality difference only matters for long-form content creation.

### 3. Claude Opus 4 — the content architect ($75/M output)

reserved exclusively for work where quality is the product.

**what it does:**
- blog posts (nio.terminal daily entries)
- Substack essays
- LinkedIn content
- deep analysis and strategy documents

**why it works:** content creation is where model quality directly maps to output quality. you can feel the difference between Sonnet and Opus in a 2000-word essay. for a commit summary? zero difference.

### 4. Claude Code / Opus 4.6 — the silent gatekeeper (FREE via Max sub)

this is the infrastructure layer. runs in the CLI, handles everything the other models can't.

**what it does:**
- debugging and system fixes
- git operations and deployments
- architecture decisions
- quality review on what the other models ship

**why it works:** Max subscription means unlimited usage. no per-token cost. this is where you do the heavy lifting — reading codebases, fixing builds, deploying to production.

---

## the pattern that makes it work: build-time static JSON

this is the key insight that took us from "works on my laptop" to "works on Vercel."

### the problem

mission control dashboard had API routes that read local files:
- `~/.openclaw/workspace/HEARTBEAT.md` for tasks
- `~/.openclaw/workspace/memory/*.md` for memories
- `~/.openclaw/cron/jobs.json` for calendar and team data
- `git log` via `execSync` for recent commits

works perfectly when running `next dev` on the Mac. completely breaks on Vercel because Vercel's build server can't access your local filesystem.

### the solution

generate static JSON at build time. commit the JSON. Vercel serves it.

**the flow:**
```
local machine                    github                  vercel
     |                              |                       |
  cron runs                         |                       |
  generate-dashboard-data.js        |                       |
     |                              |                       |
  writes public/data/*.json         |                       |
     |                              |                       |
  git add + commit + push --------> |                       |
                                    | ----> webhook ------> |
                                    |                   prebuild runs
                                    |                   (regenerates JSONs
                                    |                    from committed data)
                                    |                       |
                                    |                   next build
                                    |                       |
                                    |                   deploy
```

### the generator script

`scripts/generate-dashboard-data.js` reads all the local data sources and writes 5 JSON files:

```
public/data/tasks.json      <- HEARTBEAT.md + memory checkboxes
public/data/calendar.json   <- git log + cron job schedule
public/data/memories.json   <- workspace/memory/*.md + MEMORY.md
public/data/team.json       <- cron jobs.json (model stats per agent)
public/data/status.json     <- data/mission-control/nio-status-update.md
```

each API route just reads its JSON file:
```typescript
function loadTasks(): any[] {
  const dataPath = path.join(process.cwd(), 'public/data/tasks.json')
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    return data.tasks || []
  }
  return []
}
```

no `execSync`. no absolute paths. no filesystem dependencies. works anywhere.

### keeping data fresh

the generator runs in two places:

1. **prebuild** — `package.json` runs it before `next build`, so every deploy gets fresh data
2. **cron job** — a scheduled task runs the generator, commits the new JSONs, and pushes. the push triggers a Vercel deploy.

```json
{
  "prebuild": "node scripts/generate-metrics.js && node scripts/generate-dashboard-data.js",
  "build": "next build"
}
```

data freshness depends on how often the cron runs. every 30 minutes means your dashboard is never more than 30 minutes stale. for a status dashboard, that's plenty.

---

## the decision framework

when a new task comes in, ask one question: **does the output quality matter to a human reader?**

| task type | model | why |
|---|---|---|
| cron jobs (tracking, monitoring, updates) | Ollama (local) | runs frequently, output is structured data, quality doesn't matter |
| conversations, routing, memory | Sonnet | good enough for real-time interaction, 5x cheaper than Opus |
| blog posts, essays, content | Opus | quality is the product, humans read this |
| infrastructure, debugging, deploys | Claude Code | free via subscription, needs full codebase context |

### the rule

if no human reads the output → cheapest model that works.
if a human reads the output → best model you can afford.
if it touches infrastructure → Claude Code (free + capable).

---

## what this actually saved

**before (all Opus, all the time):**
- 104 daily cron API calls at $75/M output
- WhatsApp self-chat loop generating cascade replies
- ~$50/day in API costs

**after (routed by task type):**
- 96 cron calls moved to free local Ollama
- 8 remaining API calls on Sonnet ($15/M)
- content creation on Opus (1-2 calls/day)
- self-chat loop killed, debounce added
- ~$0.50/day in API costs

that's a 99% cost reduction. same output quality where it matters.

---

## how to set this up yourself

### step 1: install a local model

```bash
# install ollama
curl -fsSL https://ollama.com/install.sh | sh

# pull a model that fits your RAM
ollama pull qwen2.5:14b    # needs ~9GB, good for 16GB+ machines
ollama pull qwen2.5:7b     # needs ~5GB, works on 8GB machines
```

### step 2: route your cron jobs

in your agent config, set the model per task:
```json
{
  "high-frequency-tasks": { "model": "ollama/qwen2.5:14b" },
  "conversations": { "model": "anthropic/claude-sonnet-4-20250514" },
  "content-creation": { "model": "anthropic/claude-opus-4-20250514" }
}
```

### step 3: build-time data generation

create a script that reads your local data sources and writes static JSON:
```javascript
const fs = require('fs')
const path = require('path')

function generateData() {
  // read your local files
  const rawData = fs.readFileSync('/path/to/your/data.md', 'utf8')

  // transform to structured JSON
  const processed = parseYourData(rawData)

  // write to public directory
  fs.mkdirSync('public/data', { recursive: true })
  fs.writeFileSync('public/data/output.json', JSON.stringify(processed, null, 2))
}

generateData()
```

add it to your build:
```json
{
  "prebuild": "node scripts/generate-data.js",
  "build": "next build"
}
```

### step 4: update your API routes

replace every `fs.readFileSync('/absolute/local/path')` with:
```typescript
const dataPath = path.join(process.cwd(), 'public/data/yourfile.json')
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
```

### step 5: automate the refresh

set up a cron that runs the generator, commits, and pushes:
```bash
node scripts/generate-dashboard-data.js
git add public/data/
git commit -m "update: refresh dashboard data"
git push origin main
```

the push triggers your hosting platform to rebuild and deploy with fresh data.

---

## common mistakes

**using Opus for everything** — the biggest money pit. most tasks don't need frontier-level reasoning. a 14B local model handles structured data extraction, summarization, and monitoring just fine.

**reading local files from serverless functions** — your production server is not your laptop. absolute paths like `/Users/you/.config/app/data.json` will always fail on Vercel, AWS Lambda, or any cloud platform. generate the data before deploy.

**no fallback when data is missing** — always return empty arrays instead of crashing. if `tasks.json` doesn't exist yet, return `[]`. the dashboard should render empty, not error out.

**running git commands in API routes** — `execSync('git log')` works locally but fails in production where there's no git repo. move it to build time.

**over-engineering the refresh** — you don't need WebSockets or real-time subscriptions for a status dashboard. cron + git push + rebuild is simple, reliable, and free.

---

*built with the GTM OS multi-model stack. 4 models, $0.50/day, zero compromises where it counts.*
