---
platform: substack
structure: tactical-breakdown
series_post: 5
status: draft
source: original
date: 2026-02-25
---

## Subject Line
how I set up my own AI assistant through Claude Code

## Preview Text
the full setup. soul files, SQLite persistence, XP evolution, multi-agent architecture. a real database you can query from anywhere. documented while building it.

---

I tried the separate platform route. built Nio on OpenClaw. GPT-based. WhatsApp, Discord, cron jobs, the whole stack. it worked. the API bill didn't.

$50/day was the floor for real work. not testing. not casual prompting. building production systems, debugging infrastructure, generating content, coordinating agents. Sonnet for daily ops. Opus for anything that needed actual reasoning. the costs compound fast when you're shipping every day.

so I stopped and looked at what I was already paying for.

Claude Code Max. $200/month flat. unlimited CLI. no per-token billing. the same tool I was using to build the repo could power the agents running inside it. I was paying twice for the same capability.

I'm not knocking OpenClaw or Windsurf or any other platform. the architecture is solid. if you're on a full top-tier plan on one of those platforms and the budget works... keep going. but if you're already on Claude Code Max and running a separate system on top of it, you're overpaying for what you already have.

so I consolidated everything into the repo. and I documented the process while building it, not after. here's exactly what I set up.

---

## the foundation: CLAUDE.md

every time Claude Code starts a session in your repo, it reads a file called `CLAUDE.md` from the root. this is your operating system. it tells the model how to behave, what to remember, where things live, what rules to follow.

mine has context handoff instructions, key file paths, model routing preferences, and rules for when to ask versus when to act. it grows with the system. start with 20 lines. add rules when you discover patterns that need enforcing.

this is the most important file in the entire setup. every agent, every session, every slash command... they all inherit from this file. get this right and everything downstream works. get it wrong and you're re-explaining context every session.

## soul files: personality as infrastructure

a soul file is a markdown document that defines who your agent is. not what it can do. who it is.

Nio's soul file has identity, decision rules, personality constraints, anti-slop filters, capability boundaries. it's not a chatbot prompt. it's infrastructure with opinions.

Claude Code has a flag: `--append-system-prompt-file`. point it at a soul file. that file becomes part of the system prompt. different soul file, different agent. same CLI. same subscription.

I run Nio for ops and infrastructure. an Architect agent for system design. a Writer for content in my voice. each one has its own soul file, its own memory, its own session state. adding a new agent takes 15 minutes of writing markdown.

## memory: files, not databases

Claude Code sessions are stateless. you close the terminal, the context is gone. you fix this with files.

`MEMORY.md` at a known path. CLAUDE.md tells the model to read it on startup and write to it when something worth remembering happens. architectural decisions, user preferences, recurring solutions, key file paths.

context handoffs go further. at the end of every session, write a handoff file with what was done, what still needs fixing, key decisions, active TODOs. at the start of the next session, read it first. now your new session has full context of what just happened. no re-explaining.

I automated this in my CLAUDE.md. the instruction says: when the conversation wraps up, write the handoff. don't ask. just do it. sessions compound instead of starting from zero.

## skills: repeatable workflows

skills are markdown files that define workflows you'd otherwise type manually every time. write it once, invoke it with a slash command.

`/commit` stages files, diffs changes, writes a commit message in my style.
`/publish` converts a draft to final, rebuilds the SQLite index, deploys.
`/sync-main` pulls from remote, handles conflicts, pushes.

each skill is version-controlled. it evolves with the system. I have 54 skills now. started with 3.

don't build 54 on day one. build the 3 workflows you repeat most. add more when you catch yourself typing the same prompt twice.

## MCP servers: external tool access

MCP (Model Context Protocol) servers give Claude Code access to tools outside the terminal. browsers, databases, APIs, file systems.

I run a Playwright MCP server that gives Claude Code a full browser. navigate pages, fill forms, take screenshots, run accessibility audits. all from the CLI.

SQLite MCP for querying my content index. GitHub integration. filesystem access. each server extends what the assistant can do without writing custom API integrations.

config is JSON. project-level `.mcp.json` or global `~/.claude/settings.json`. add a server, restart Claude Code, the capability is available.

## the real unlock: a queryable database

this is the part most people skip and it's the part that matters most.

Nio doesn't store state in localStorage or flat files. it writes to SQLite. a real database. server-authoritative. every message, every conversation, every token cost, every XP event — tracked in tables you can query from anywhere.

```sql
SELECT xp, tier, streak, skill_xp FROM dna_state;
```

that's freedom. your agent's entire evolution — XP, skill trees, memory, conversation history — sitting in a database you own. not locked in some platform's cloud. not hidden behind an API. on your machine. queryable from Claude Code, from an MCP server, from a cron job, from a browser.

the XP system is the key. every conversation writes XP. the agent evolves through 5 tiers — Spark to Ascended. 3 skill trees (Ops, Architecture, Writing) level independently based on which agent you're talking to. streak multipliers reward daily usage. the agent you talk to on day 1 is not the same agent on day 30.

but the XP isn't the point. the database is the point. once your agent has a real persistence layer, everything else becomes possible. memory with full-text search. cost tracking. evolution history. daily analytics. you can query your own system the way you'd query any production database. because it is one.

I built a landing page where you can see the DNA system in action:

👉 [meet Nio — shawnos.ai/nio](https://shawnos.ai/nio)

## the cost math after consolidating

**before:**
- Claude Code Max: $200/month
- API for Sonnet + Opus via OpenClaw: $50 to $200/month
- total: $250 to $400/month

**after:**
- Claude Code Max: $200/month
- local Ollama for high-frequency crons: $0
- API for content-only Opus calls: ~$15/month
- total: ~$215/month

the API costs don't disappear completely. I still route automated blog generation through Opus API. but daily interaction, building, debugging, agent conversations... all covered by the subscription.

## why I'm writing this now

this is new territory. there's no established playbook for running your entire workflow through a CLI-based AI assistant. everyone building this way is figuring it out at the same time. my processes change weekly. the architecture evolves as the tools evolve.

this post was written in Claude Code. the system it describes is the system that produced it. the CLAUDE.md it references loaded when I started this session. the memory system it explains will remember I wrote this.

that's not a flex. that's the architecture working as designed. the system produces the content that describes the system. the loop compounds.

I published the full technical walkthrough on the blog — step-by-step setup instructions, SQL migrations, config snippets, the whole evolution system. if you want the complete how-to with copy-paste commands, it's there.

👉 [full how-to: set up your own AI assistant through Claude Code](https://shawnos.ai/blog/how-to-setup-your-own-ai-assistant)

👉 [meet Nio — the landing page](https://shawnos.ai/nio)

this how-to will update. if something here is wrong next month, it's because I found something better. the repo is the source of truth. the commit history is the changelog.

---

shawn ⚡ the gtme alchemist 🧙‍♂️

*building this in public. documenting while building, not after. if you want the full mess and the wins, follow along.*
