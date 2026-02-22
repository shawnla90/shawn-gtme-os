> **Platform**: X
> **Pillar**: Building & Sharing
> **Date**: 2026-02-25
> **Status**: draft
> **Format**: Thread (7 tweets)
> **Backlink**: https://shawnos.ai/blog/how-to-setup-your-own-ai-assistant

---

## Thread

### 1/7
I was paying $50/day to run my AI agent through API calls.

then I realized Claude Code Max already gives me unlimited CLI access.

stopped paying twice. consolidated everything into the repo.

here's the full setup 🧵

### 2/7
CLAUDE.md at your repo root.

one file. loads every session. tells the model how to behave, what to remember, where things live.

this is the operating system for your AI assistant. get this right and everything downstream works.

### 3/7
soul files.

markdown documents that define who each agent is. personality, decision rules, anti-slop filters.

different soul file → different agent. same CLI. same subscription.

I run 3 agents. took 15 minutes each to write.

### 4/7
memory + context handoffs.

MEMORY.md for long-term knowledge. context handoff files for session continuity.

sessions compound instead of starting from zero. the model picks up where the last one left off.

### 5/7
54 skills as slash commands.

/commit, /publish, /sync-main.

started with 3. added more every time I typed the same prompt twice.

### 6/7
cost before: $400/month (CC Max + API)
cost after: $215/month (CC Max + $15 API for content crons)

same output. same quality where it matters.

the CLI is the API. the subscription is the infrastructure budget.

### 7/7
wrote the full technical how-to with step-by-step setup, code examples, and config snippets.

no email gate. no paywall.

https://shawnos.ai/blog/how-to-setup-your-own-ai-assistant

- shawn ⚡
