---
subreddit: r/GTMBuilders
flair: Repo
title: "I open sourced the context infrastructure I use to run 4-6 Claude Code terminals in parallel"
---

I run 4-6 Claude Code sessions simultaneously. after a few weeks of scaling up I hit 5 failure modes that compounded on each other:

1. zero context on restart (10 min re-explaining every session start)
2. race conditions when multiple terminals write handoff files (last write wins, context lost)
3. MEMORY.md growing past 200 lines and silently truncating
4. agent handoffs losing the decisions that mattered most
5. parallel agents making conflicting architectural choices because nobody logged anything

built a 6-layer system to fix all of them. just open sourced it.

**what's in it:**

- parallel-safe session handoffs (timestamped files, no overwrites)
- structured memory persistence (index + topic files, nothing gets truncated)
- self-improvement loop (corrections become permanent rules)
- agent-to-agent context transfer (standalone documents, not summaries)
- multi-agent team coordination (9 rules for parallel work)
- routing framework (5-dimension scoring to pick solo vs subagents vs teams)

**3-tier setup:**

- tier 1 (5 min): curl one CLAUDE.md template, create handoffs dir. done.
- tier 2 (15 min): add memory + self-improvement loop
- tier 3 (30 min): full engine with team constraints and routing

everything is copy-paste ready. working bash commands, example directory structures for solo/parallel/team setups.

it's the infrastructure layer behind recursive-drift. you can use either independently.

repo: https://github.com/shawnla90/context-handoff-engine

MIT licensed. interested in hearing how others handle multi-terminal context persistence.
