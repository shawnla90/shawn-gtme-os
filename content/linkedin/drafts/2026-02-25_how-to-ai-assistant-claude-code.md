> **Platform**: LinkedIn
> **Pillar**: Building & Sharing
> **Date**: 2026-02-25
> **Status**: draft
> **Backlink**: https://shawnos.ai/blog/how-to-setup-your-own-ai-assistant

---

## Post

I was paying $50/day in API costs to run my AI agent.

then I realized I was already paying for unlimited access.

Claude Code Max. $200/month flat. unlimited CLI. the same tool building my repo could power the agents inside it.

so I stopped paying twice and consolidated everything into the repo.

here's what the setup looks like now:

⚡ CLAUDE.md — one file that loads every session. tells the model how to behave, what to remember, where things live. the operating system for your operating system.

🧠 soul files — markdown documents that define who each agent is. not what it does. who it is. personality, decision rules, anti-slop filters. different soul file, different agent. same CLI.

🔧 memory + context handoffs — file-based persistence. MEMORY.md for long-term knowledge. context handoff files for session continuity. sessions compound instead of starting from zero.

⚡ 54 skills as slash commands — repeatable workflows. /commit, /publish, /sync-main. started with 3. added more every time I caught myself typing the same prompt twice.

🔗 MCP servers — browser automation, SQLite queries, GitHub integration. each one extends what the assistant can do without custom API code.

cost went from $400/month to $215/month. same output. same quality where it matters.

the recursive part: this post was written in Claude Code. the system it describes is the system that produced it.

I published the full technical how-to with step-by-step setup, code examples, and config snippets on the blog.

full how-to 👇

---

## Comment 1 (pin immediately)

full walkthrough with copy-paste commands, config examples, and the complete setup process:

https://shawnos.ai/blog/how-to-setup-your-own-ai-assistant

no gatekeeping. no email gate. just the how-to.

---

## Comment 2

the take on separate AI platforms:

I'm not knocking OpenClaw or Windsurf or anything else. the architecture is solid.

but if you're already on Claude Code Max and running a separate system on top of it... you're paying twice for the same capability.

the CLI is the API. the subscription is the infrastructure budget. everything else is plumbing.

---

## Comment 3

for people asking "where do I start":

1. create a CLAUDE.md in your repo root
2. write one soul file for one agent
3. set up MEMORY.md and context handoffs
4. build one skill for your most repeated workflow
5. add one MCP server
6. use it for a week. then decide what's missing.

don't build the whole system in a weekend. build one piece. use it. discover what's missing. build that.

---

shawn ⚡ the gtme alchemist 🧙‍♂️
