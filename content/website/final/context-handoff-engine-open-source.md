---
title: "I Open Sourced the Context Engine Behind Recursive Drift"
date: "2026-03-14"
excerpt: "6 layers of context infrastructure for Claude Code. Parallel-safe handoffs, structured memory, self-improvement loops, agent coordination, and routing. The plumbing that makes multi-terminal AI development work."
category: "ships"
---

**tl;dr:** Claude Code starts every session from zero. the context handoff engine is 6 layers of infrastructure that fix this. parallel-safe handoffs, structured memory, self-improvement loops, agent coordination, and routing. all open source, copy-paste ready, 5 minutes to start.

## the problem compounds

Claude Code starts every session with zero memory. for a single terminal, that's annoying. for 4-6 parallel terminals running all day, it breaks things.

I hit five failure modes in order as I scaled up.

**zero context on restart.** open a terminal Monday morning. spend 10 minutes re-explaining what you built Friday. multiply that by every session, every day.

**race conditions across terminals.** two terminals finish at the same time. both write to `context-handoff.md`. the last one wins. an entire session's context vanishes.

**memory truncation.** MEMORY.md grows to 400 lines over a few weeks. Claude only loads the first 200. half your project knowledge silently disappears. you don't notice until Claude makes a decision you already corrected three weeks ago.

**lossy agent handoffs.** spawn a subagent for research. it makes architectural decisions. reports back a summary. the parent doesn't know what was decided. the next agent re-litigates the same choices.

**decision drift in teams.** three agents work in parallel. one picks snake_case. one picks camelCase. one picks whatever it feels like. nobody logged the decision. the merge is a mess.

each failure mode appeared after I leveled up the previous one. and each one required its own solution.

## how does the layered architecture work?

[context-handoff-engine](https://github.com/shawnla90/context-handoff-engine) is 6 layers of context infrastructure. each layer solves one failure mode. use as many as you need.

```
Layer 6: Routing ─────────── which execution pattern fits this task?
Layer 5: Teams ───────────── how do parallel agents coordinate?
Layer 4: Agent Handoffs ──── how does context transfer between agents?
Layer 3: Self-Improvement ── how do mistakes become rules?
Layer 2: Memory ──────────── how does knowledge persist across sessions?
Layer 1: Handoffs ────────── how does session state transfer?
```

### layer 1: parallel-safe handoffs

the fix for race conditions was simple. stop using a single file. each session writes to `~/.claude/handoffs/YYYY-MM-DD_HHMMSS_<slug>.md`. timestamped. no overwrites.

on session start, Claude reads all unconsumed handoffs, prints a summary, then renames them with a `_done` suffix. consumed handoffs older than 7 days get cleaned up automatically.

four operations. write, read, consume, clean. that's the whole system.

### layer 2: structured memory

the 200-line truncation problem required restructuring how Claude stores persistent knowledge.

MEMORY.md becomes an index file - stays under 200 lines, links to topic files. topic files (`identity.md`, `infrastructure.md`, `completed-work.md`) hold the details and get loaded on-demand when relevant.

the index always loads. the details load when needed. nothing gets truncated.

### layer 3: self-improvement loop

after every correction from the user, Claude writes a lesson to `tasks/lessons.md`. date, context, and a rule. on session start, Claude reads all lessons and follows them.

the cycle: correction, lesson, rule, prevention.

over time, the rules accumulate. mistakes that happened in week 1 don't happen in week 8 because the rule exists. simple mechanism, compounding effect.

### layer 4: agent-to-agent context

session handoffs assume familiarity with the project. agent handoffs assume nothing.

when handing context to a different agent, produce a standalone document with 6 sections: context, accomplishments, key files, open questions, next steps, workflow hooks. the receiving agent understands immediately with no prior conversation.

the biggest value isn't the summary - it's preserving the decisions. "we chose cursor-based pagination because X" prevents the next agent from spending 20 minutes arriving at the same conclusion.

### layer 5: team coordination

9 rules that prevent chaos when multiple agents work simultaneously. file ownership (one writer per file per wave). shared decisions log. read before write. wave discipline with verification gates. build gates before deploy. scope isolation. fresh context per executor.

the rules sound obvious. they are obvious. but without making them explicit in a constraints file that every agent reads, parallel agents silently create the exact chaos the rules prevent.

### layer 6: routing

not every task needs a team. not every task should be solo. the routing framework scores each task across 5 dimensions - file count, concern separation, handoff requirements, review needs, quality gates - and routes to the right pattern.

pattern A: single focused session. pattern B: parallel subagents. pattern C: agent teams. count which pattern gets 3+ matches. route there.

the anti-pattern this prevents: spinning up a full team with task lists and messaging for a 2-file edit that takes 3 minutes solo.

## what's in the repo?

the repo is designed for copy-paste adoption. three tiers.

**tier 1 (5 minutes):** curl one file into your project root. you have parallel-safe handoffs.

```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/shawnla90/context-handoff-engine/main/templates/claude-md-minimal.md
mkdir -p ~/.claude/handoffs
```

**tier 2 (15 minutes):** add memory persistence and the self-improvement loop.

**tier 3 (30 minutes):** full engine with team constraints and routing.

every template file has working bash commands. every example directory shows what the file structure looks like in practice. solo developer, parallel terminals, and multi-agent team setups.

## companion to recursive-drift

[recursive-drift](https://github.com/shawnla90/recursive-drift) defines the methodology - six non-linear states, the self-reading feedback loop, the evolution system. this engine handles the plumbing underneath - making sure context persists between sessions, agents coordinate without conflicts, and corrections become permanent rules.

you can use either without the other. they're better together.

the repo is MIT licensed.

## frequently asked questions

**what is the context handoff engine?**
an open source system with 6 layers of context infrastructure for Claude Code. it solves the problem of sessions starting from zero by providing parallel-safe handoffs, structured memory, a self-improvement loop, agent-to-agent context transfer, team coordination rules, and task routing. each layer is independent and you can adopt them incrementally.

**how many layers does the handoff system have?**
six. layer 1 is parallel-safe session handoffs. layer 2 is structured memory with an index file linking to topic files. layer 3 is a self-improvement loop where corrections become permanent rules. layer 4 handles agent-to-agent context transfer. layer 5 provides team coordination rules for parallel agents. layer 6 routes tasks to the right execution pattern.

**can I use this with other AI tools besides Claude Code?**
the principles apply to any AI coding tool that reads files from a project directory. the templates are written for Claude Code's CLAUDE.md convention, but the handoff format, memory structure, and self-improvement loop are just markdown files. if your tool can read markdown on session start, you can adapt the system.

---

**related posts:** [parallel-safe context handoffs](https://shawnos.ai/blog/parallel-safe-context-handoffs) | [recursive drift](https://shawnos.ai/blog/recursive-drift)

[github.com/shawnla90/context-handoff-engine](https://github.com/shawnla90/context-handoff-engine)
