---
title: "How to Set Up Your Own AI Assistant Through Claude Code"
date: "2026-02-22"
excerpt: "I tried separate AI platforms, burned through API credits, and landed on the simplest architecture possible. Here's the full setup process I'm documenting as I build it."
---

## the updated take on AI assistant platforms

I built Nio on OpenClaw. GPT-based agent platform. WhatsApp integration, Discord, cron jobs, the whole thing. it worked. and for people running a full-tier subscription on a platform like that... it might still be worth it.

but here's where I landed after building with it for weeks: if you're already paying for Claude Code Max, running a separate AI platform on top of it means you're paying twice. API costs for Sonnet and Opus add up fast. $50/day is the floor if you're doing real work. not testing. not casual prompting. building.

I'm not knocking OpenClaw or any other platform. the architecture is solid. but the math changed when I realized Claude Code already does what I was paying API credits for. the CLI is the API. the subscription is the infrastructure budget. everything I was routing through a separate system could run through the same tool I was already using to build the repo.

so I documented how to set it up from scratch. this is what I'm running right now. it changes weekly because this is new territory for all of us.

## step 1: Claude Code Max subscription

this is the foundation. $200/month. unlimited CLI access. no per-token billing for anything you run through `claude` or `claude -p`.

```bash
# verify you're on Max
claude --version
```

if you're on Pro or Team, the CLI works but you'll hit rate limits. Max removes the ceiling. that's the whole point.

## step 2: your CLAUDE.md file

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

## step 3: soul files for personality

a soul file is a markdown document that defines who your AI assistant is. not just what it can do. who it is. decision-making frameworks, personality traits, anti-slop rules, capabilities, boundaries.

```markdown
# Nio — AI Operations Agent

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

## step 4: file-based memory

your assistant needs to remember things across sessions. Claude Code sessions are stateless by default. you fix this with files.

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
- session-specific context (that's what context handoffs are for)
- unverified assumptions
- anything already in CLAUDE.md

the memory file is append-and-edit. it grows over time. prune it when it gets stale.

## step 5: context handoffs

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

## step 6: skills as slash commands

skills are markdown files that define repeatable workflows. instead of typing the same complex prompt every time, you write it once and invoke it with a slash command.

```
/commit    → stages, diffs, writes a proper commit message
/publish   → converts a draft to final, rebuilds index, deploys
/sync-main → pulls from remote, handles conflicts, pushes
```

each skill is a markdown file with instructions that Claude Code follows when invoked. the skill files live in your repo. they're version-controlled. they evolve with your system.

you don't need dozens of skills on day one. start with the 3-4 workflows you repeat most. add more when you catch yourself typing the same prompt twice.

## step 7: MCP servers for tool access

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

other MCP servers I run: filesystem access, SQLite queries, GitHub integration. each one extends what your assistant can do without writing custom API integrations.

## step 8: multi-agent architecture

once you have one agent working, adding more is just writing more soul files.

the pattern:
- one CLI (`claude -p`)
- different soul files per agent
- different session IDs per agent (so context doesn't bleed)
- each agent gets its own memory file

I run Nio for ops, an Architect agent for system design, a Writer agent for content. same subscription. same CLI. different jobs.

the key is isolation. each agent has its own soul, its own memory, its own session state. they don't share context unless you explicitly pipe output from one to another.

## the cost math

**before (separate AI platform + API):**
- Claude Code Max: $200/month
- API costs for Sonnet + Opus: $50 to $200/month
- total: $250 to $400/month

**after (Claude Code only):**
- Claude Code Max: $200/month
- local Ollama for high-frequency crons: $0
- API for content-only Opus calls: ~$15/month
- total: ~$215/month

the API costs don't disappear completely. I still use Opus via API for automated blog generation through cron jobs. but the daily interaction, the building, the debugging, the agent conversations... all covered by the subscription.

## what this post is

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

`$ claude -p "what should I build next?" --append-system-prompt-file nio-soul.md`
