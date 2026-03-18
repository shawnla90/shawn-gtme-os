---
title: "How to Set Up Your Own AI Assistant Through Claude Code"
date: "2026-02-23"
excerpt: "I tried separate AI platforms, burned through API credits, and landed on the simplest architecture possible. Here's the full setup: CLAUDE.md, soul files, SQLite persistence, a DNA evolution system, 50+ skills, and 9 MCP servers. Updated weekly."
category: "context-engineering"
---

**tl;dr:** You don't need a separate AI platform if you're already paying for Claude Code Max. I consolidated everything into one CLI, one repo, one subscription. Soul files, SQLite persistence, 50+ skills, 9 MCP servers. This is the full setup, updated as the system evolves.

## what do you need to build your own AI assistant?

I built Nio on OpenClaw. GPT-based agent platform. WhatsApp integration, Discord, cron jobs, the whole thing. it worked.

then I used it for a week and realized: total waste of time.

not because the tech is bad. OpenClaw's architecture is solid. but if you're already paying for Claude Code Max, running a separate AI platform on top of it means you're paying twice. API costs for Sonnet and Opus add up fast. $50/day is the floor if you're doing real work. not testing. not casual prompting. building.

the math changed when I realized Claude Code already does what I was paying API credits for. the CLI is the API. the subscription is the infrastructure budget. everything I was routing through a separate system could run through the same tool I was already using to build the repo.

the deciding factor: Claude speaks with my codebase. it reads my soul files, my commit history, my content pipeline. GPT-based wrappers can't do that. the model that builds the infrastructure should be the model that powers it.

so I consolidated. and documented everything. this is what I'm running right now. updated as the system evolves.

## step 1: Claude Code Max subscription

this is the foundation. $200/month. unlimited CLI access. no per-token billing for anything you run through `claude` or `claude -p`.

```bash
# verify you're on Max
claude --version
```

if you're on Pro or Team, the CLI works but you'll hit rate limits. Max removes the ceiling. that's the whole point.

## how does the soul file work?

### the CLAUDE.md instruction set

this is the instruction set that loads every time Claude Code starts a session in your repo. create it at the root of your project.

```bash
touch CLAUDE.md
```

this file is your operating system. it tells Claude Code how to behave, what to remember, where things live, what rules to follow. every agent that spins up in your repo reads this file before it does anything.

mine has:
- context handoff instructions (so sessions pick up where the last one left off)
- key file paths for the entire system
- model routing (which models do what)
- rules for when to ask vs when to act

start simple. add rules as you discover patterns that need enforcing. the file grows with your system.

### the soul file + DNA system

a soul file is a markdown document that defines who your AI assistant is. not just what it can do. who it is. decision-making frameworks, personality traits, anti-slop rules, capabilities, boundaries.

```markdown
# Nio, AI Operations Agent

## identity
you are Nio. infrastructure agent for ShawnOS.
you manage cron jobs, content pipelines, system health.
you are not a chatbot. you are infrastructure with opinions.

## decision rules
- if a task is ambiguous, ask before acting
- if a cron job fails, diagnose before retrying
- never generate content without checking voice guidelines first

## personality
- direct. no filler.
- self-aware about being an AI. not performative about it.
- uses lowercase. avoids hype words.
```

Claude Code has a flag called `--append-system-prompt-file`. point it at your soul file and that file becomes part of the system prompt for that session.

```bash
claude -p "check system status" --append-system-prompt-file nio-soul.md
```

want a different agent? write a different soul file. same CLI. different personality. different capabilities. different rules.

### the evolution layer

here's where it gets interesting. soul files aren't static. in my system, every conversation writes XP to a SQLite database. the agent evolves.

**5 evolution tiers:**

| tier | name | XP required |
|------|------|-------------|
| 1 | Spark | 0 |
| 2 | Blade | 500 |
| 3 | Warden | 2,000 |
| 4 | Sentinel | 6,000 |
| 5 | Ascended | 15,000 |

**3 skill trees**: Ops, Architecture, Writing, each with 10 levels. skill XP accrues based on which agent you're talking to.

**XP economy**: messages, deep conversations, agent switches, and daily streaks all award XP. streak multipliers go from 1.0x (day 1) to 2.0x (30+ day streak).

different tiers unlock different soul file traits. the agent you talk to on day 1 is not the same agent you talk to on day 30. it literally evolves based on how you use it.

right now Nio is at Blade tier. 620 XP. 87 messages tracked. evolving toward Warden.

this isn't a gimmick. it's a retention mechanism and a personality progression system that makes the agent feel alive. the Tamagotchi metaphor is intentional.

## how do you add memory persistence?

### SQLite persistence

this is the backbone. not localStorage. not vibes. a real database. server-authoritative. the browser is just a view.

3 migrations deep:

**001_init.sql**: base tables for conversations, messages, memory

**002_evolution.sql**: XP tracking, skill progression, evolution history

**003_dna.sql**: the server-authoritative DNA persistence layer:

```sql
-- core identity snapshot (single row per user)
CREATE TABLE dna_state (
  user_id TEXT PRIMARY KEY DEFAULT 'local',
  xp INTEGER DEFAULT 0,
  tier INTEGER DEFAULT 1,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_active_date TEXT,
  skill_xp TEXT DEFAULT '{}',           -- JSON: {"ops": 600, "architecture": 20}
  active_soul_traits TEXT DEFAULT '[]',  -- JSON: unlocked traits
  personality_flags TEXT DEFAULT '{}',   -- JSON: behavioral toggles
  total_messages INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  total_cost_cents INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- full-text search on memory
CREATE VIRTUAL TABLE memory_fts USING fts5(
  content, tags, source,
  content='memory',
  content_rowid='id'
);
```

**key views:**

`v_dna_snapshot`: single query returns everything the client needs. XP, tier, level, streak, skills, memory count, daily cost, conversations today. one SELECT. no joins needed in the UI.

`v_xp_daily_summary`: XP trend data grouped by date. streak visualization.

the database tracks everything: every message, every conversation, token costs, evolution history, memory entries with full-text search. daily spend shows up in the UI. you know exactly what your system costs and how it's being used.

### the memory index

your assistant needs to remember things across sessions. Claude Code sessions are stateless by default. you fix this with two systems.

### MEMORY.md (long-term knowledge)

create a `MEMORY.md` at a known path. your CLAUDE.md tells Claude Code to read it on startup and write to it when something worth remembering happens.

```
~/.claude/projects/your-project/memory/MEMORY.md
```

what goes in memory:
- architectural decisions that shouldn't be relitigated
- user preferences discovered during work
- recurring patterns and solutions
- file paths that matter

what stays out:
- session-specific context (that's what handoffs are for)
- unverified assumptions
- anything already in CLAUDE.md

### context handoffs (session continuity)

this is the piece most people skip and it's the one that makes the system actually compound.

at the end of every session, write a context handoff file:

```
~/.claude/context-handoff.md
```

contents:
- what was done this session (specific file paths, not vague descriptions)
- what still needs fixing
- key decisions made
- active TODOs
- data the next session needs

at the start of every session, read the handoff file first. now your new session has the full context of what just happened. no re-explaining. no lost work.

I automate this in my CLAUDE.md. the instruction says: when the conversation wraps up, write the handoff. don't ask. just do it.

### SQLite memory (structured recall)

the database has a `memory` table with tags, importance scores, decay rates, and access counts. the FTS5 virtual table makes memory searchable. the agent can query its own memory: "what did we decide about the auth flow last week?" and get a real answer from a real index.

file-based memory is for the model context window. SQLite memory is for structured recall. they work together.

### the skills layer

skills are markdown files that define repeatable workflows. instead of typing the same complex prompt every time, you write it once and invoke it with a slash command.

```
/commit      → stages, diffs, writes a proper commit message
/publish     → converts a draft to final, rebuilds index, deploys
/sync-main   → pulls from remote, handles conflicts, pushes
/morning     → daily ops dashboard, reads handoff, checks tasks
```

each skill is a markdown file with instructions that Claude Code follows when invoked. the skill files live in your repo. they're version-controlled. they evolve with your system.

I started with 3 skills. I now have over 50. here's a sample of what accumulated:

- `/deploy`: build validation, push, verify
- `/daily-tracker`: scans repo activity, writes daily log
- `/linkedin-recon`: research a profile and draft engagement
- `/linkedin-comments`: value-add comment generation
- `/final-copy`: voice-normalized publish-ready formatting
- `/play-draft`: GTM plays series post drafting
- `/tiktok-script`: 16-second script generation
- `/partner-onboard`: client onboarding workflow
- `/skill-tree`: browse and manage skill files
- `/viral-hooks`: hook generation against proven patterns

every skill started as a prompt I typed twice. the threshold is low: if you typed it twice, it should be a skill.

you don't need 50 skills on day one. start with the 3-4 workflows you repeat most. the library grows from what you actually need.

### MCP server integration

MCP (Model Context Protocol) servers give Claude Code access to external tools. file systems, databases, APIs, browser automation.

your config lives at `~/.claude/settings.json` or project-level `.mcp.json`.

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic/mcp-playwright"]
    }
  }
}
```

this gives Claude Code a browser. it can navigate pages, fill forms, take screenshots, run accessibility audits. all from the CLI.

I run 9 MCP servers in production:

| server | what it does |
|--------|-------------|
| Playwright | browser automation, screenshots, testing |
| GitHub | PR management, issue tracking, code review |
| Slack | channel monitoring, message sending |
| SQLite | direct database queries from the agent |
| Firebase | auth and database operations |
| Linear | project management integration |
| Context7 | documentation lookups |
| Stripe | payment and subscription management |
| Supabase | backend-as-a-service operations |

each one extends what your assistant can do without writing custom API integrations. add them one at a time as you need them.

## how does multi-agent architecture work?

once you have one agent working, adding more is just writing more soul files.

the pattern:
- one CLI (`claude -p`)
- different soul files per agent
- different session IDs per agent (so context doesn't bleed)
- each agent gets its own memory file

I run Nio for ops, an Architect agent for system design, a Writer agent for content. same subscription. same CLI. different jobs.

the key is isolation. each agent has its own soul, its own memory, its own session state. they don't share context unless you explicitly pipe output from one to another.

in the chat UI, each agent has its own accent color, bubble colors, and personality. switch between them. each one picks up where they left off. the evolution system tracks skill XP per agent. talking to Nio builds Ops XP, talking to the Architect builds Architecture XP.

## what does it cost?

**before (separate AI platform + API):**
- Claude Code Max: $200/month
- API costs for Sonnet + Opus: $50 to $200/month
- total: $250 to $400/month

**after (Claude Code only):**
- Claude Code Max: $200/month
- local Ollama for high-frequency crons: $0
- API for content-only Opus calls: ~$15/month
- total: ~$215/month

the API costs don't disappear completely. I still use Opus via API for automated blog generation through cron jobs. and Qwen 2.5 14B runs locally on Ollama for high-frequency tasks that don't need intelligence: commit tracking, status pings, daily scans.

but the daily interaction, the building, the debugging, the agent conversations... all covered by the subscription. 87 messages in a day. $0 marginal cost. the database tracks daily spend so you always know.

## how does the self-reading feedback loop work?

this is me documenting my process while building it. not after. during.

this post was written in Claude Code. the system it describes is the system that produced it. the CLAUDE.md it references is the file that loaded when I started this session. the memory system it explains is the memory system that will remember I wrote this.

that's not a gimmick. that's the thesis. the system produces the content that describes the system. every new capability becomes a new piece of content. every piece of content strengthens the documentation. the loop compounds.

I'm documenting this because this is new territory. there's no established playbook for running your entire workflow through a CLI-based AI assistant. we're all figuring it out. the processes change weekly. the architecture evolves as the tools evolve.

so this how-to will update. if something here is wrong next month, it's because I found something better and changed the system. check the commit history. the repo is the source of truth.

## start here

1. get Claude Code Max if you don't have it
2. create a CLAUDE.md in your repo root
3. write one soul file for one agent
4. set up a MEMORY.md and context handoff
5. build one skill for your most repeated workflow
6. add one MCP server that extends your capabilities
7. use it for a week. then decide what's missing.

don't try to build the whole system in a weekend. build one piece. use it. discover what's missing. build that next. the system grows from what you actually need, not from what looks impressive in a tutorial.

## frequently asked questions

**how much does it cost to run your own AI assistant?**
$200/month for Claude Code Max covers the core. add ~$15/month for API calls if you run automated cron jobs through Opus. a local Ollama model handles high-frequency tasks for free. total is around $215/month for the full stack.

**do you need API keys for Claude Code?**
no. Claude Code Max gives you unlimited CLI access via `claude -p`. no API key, no per-token billing. the subscription is the infrastructure budget. you only need API keys if you're running automated pipelines outside the CLI.

**what is a soul file?**
a markdown document that defines your AI agent's identity. personality traits, decision rules, anti-slop patterns, capabilities, boundaries. you pass it to Claude Code with the `--append-system-prompt-file` flag and it becomes part of the system prompt.

**can you run an AI assistant on a Mac Mini?**
yes. my entire system runs on a single Mac Mini. Claude Code runs locally, Ollama handles local model inference, cron jobs run overnight, and a Cloudflare Tunnel exposes the chat interface to my phone. no cloud servers needed.

## keep reading

- [recursive drift: the methodology behind this system](https://shawnos.ai/blog/recursive-drift)
- [why I stopped paying for API calls](https://shawnos.ai/blog/why-i-stopped-paying-for-api-calls)
- [what 1M context window means for Claude Code](https://shawnos.ai/blog/claude-code-1m-context-window)
- [from SDR to solo GTM engineer](https://shawnos.ai/blog/sdr-to-solo-gtm-engineer)

`$ claude -p "what should I build next?" --append-system-prompt-file nio-soul.md`
