---
platform: x
type: thread
angle: builder-take
status: draft
date: 2026-03-14
source: content/website/final/context-handoff-engine-open-source.md
---

1/

open sourced 6 layers of context infrastructure for Claude Code.

the problem: every session starts from zero. scale to 4-6 parallel terminals and you get race conditions, memory truncation, and decision drift.

the fix: github.com/shawnla90/context-handoff-engine

---

2/

layer 1: parallel-safe handoffs. timestamped files in ~/.claude/handoffs/. two terminals finish at the same time? both write. nothing lost.

layer 2: structured memory. index file + topic files. MEMORY.md stays under 200 lines (Claude's load limit). details live in linked topic files.

---

3/

layer 3: self-improvement. every correction becomes a permanent rule in tasks/lessons.md. reviewed at session start. mistake rate drops over time.

layer 4: agent-to-agent context. standalone docs, not summaries. the receiving agent gets full context, not a lossy handoff.

---

4/

layer 5: team coordination. 9 rules for parallel agents. decision logging, file ownership, merge protocols.

layer 6: routing. 5-dimension scoring to decide: work solo, use subagents, or spin up a team.

---

5/

3-tier setup. tier 1 takes 5 minutes. one curl command.

companion to recursive-drift. MIT licensed.

repo: github.com/shawnla90/context-handoff-engine
