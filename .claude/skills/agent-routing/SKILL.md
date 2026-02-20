---
name: agent-routing
description: Decides whether a task needs Agent Teams, subagents, or a single focused session. Auto-invoked when the user mentions teams, agents, parallel work, or asks to "use agents" on a task. Also invoked when Claude is about to spawn a team or parallel agents. This skill MUST be consulted before creating any team or spawning more than 2 subagents.
---

# Agent Routing — Choose the Right Execution Pattern

Before spinning up agents or teams, run this decision framework. The goal is to match the execution pattern to the task, not default to the most complex option.

---

## Step 1: Task Analysis

Evaluate the task against these 5 dimensions. Be honest — do not inflate complexity to justify a team.

### 1. File Count
How many files will be WRITTEN or EDITED (not read)?

- **1-2 files**: Single session territory
- **3-4 files**: Subagent territory
- **5+ files across different concerns**: Team territory

### 2. Concern Separation
Are the outputs independent or do they need coordination?

- **All outputs go in the same file or closely related files**: Single session
- **Outputs are in different files but follow the same pattern**: Subagents (each mirrors a known pattern independently)
- **Outputs are in different files AND require different expertise (content vs code vs config vs deploy)**: Team

### 3. Handoff Requirement
Does any task need the OUTPUT of another task before it can start?

- **No handoffs — all tasks can run with existing context**: Subagents
- **Linear handoff — A feeds B feeds C**: Single session (sequential in one context is faster than agent-to-agent messaging)
- **Fan-out handoff — A feeds B, C, D simultaneously**: Team (A completes, then B/C/D run in parallel)

### 4. Review Requirement
Does output need human-style judgment before the next step?

- **No review needed — mechanical output**: Subagents
- **Self-review sufficient — one agent can check its own work**: Single session
- **Cross-review needed — one agent's output should be evaluated by a different agent with different context**: Team

### 5. Voice/Quality Gate
Does the output require voice compliance, brand checking, or quality enforcement?

- **No voice requirements (code, config, data)**: Any pattern works
- **Voice required but I (the main session) am writing it**: Single session (I already have voice context loaded)
- **Voice required AND someone other than the main session is writing**: Team with Writer + Reviewer roles (per TEAM-CONSTRAINTS.md Rule 0)

---

## Step 2: Route to Pattern

Score the task. Count how many dimensions point to each pattern:

### Pattern A: Single Focused Session
**Use when:** 3+ dimensions point to "single session"

The main Claude Code session handles everything. Use Explore subagents (Haiku, read-only) for initial research and Haiku subagents for web lookups, but all writing/editing stays in the main session.

**Typical tasks:**
- Adding 1-2 wiki entries to a data file
- Updating a page + its data source
- Writing a new skill file
- Bug fixes across a few related files
- Any task where YOU are the only writer

**Subagent budget:** 1-2 lightweight agents (Explore for repo scan, Haiku for web research). These protect context window, not parallelize work.

### Pattern B: Parallel Subagents
**Use when:** 3+ dimensions point to "subagents"

Launch independent subagents via the Task tool. Each gets a specific prompt, works in isolation, reports back. No inter-agent communication. Parent orchestrates waves.

**Typical tasks:**
- Building 3+ pages that mirror an existing pattern
- Writing multiple independent data entries
- Running research across several unrelated topics
- Parallel file generation where outputs do not reference each other

**Subagent budget:** 2-5 agents. Assign Haiku to mechanical tasks (copy-pattern, scan, format). Assign Sonnet/Opus to creative or judgment tasks. Use the wave pattern from the parallel agents how-to.

### Pattern C: Agent Teams
**Use when:** 3+ dimensions point to "team" AND at least one of these is true:
- Multiple agents need to MESSAGE each other (not just report to parent)
- A shared task list with dependencies is needed to enforce sequencing
- Different agents need different ROLES with different context (Writer reads voice files, Reviewer reads checklist, Deploy reads build config)
- The task will take 15+ minutes and agents need to self-coordinate

**Typical tasks:**
- Full website feature: data file + page components + navigation + deploy
- Content pipeline: research agent feeds writer, writer feeds reviewer, reviewer approves deploy
- Multi-system changes: frontend + backend + tests + CI config where each agent owns a layer
- Any task where 3+ agents need to coordinate across 5+ files with handoffs

**Team budget:** 2-4 agents maximum. Every teammate runs its own context window (~7x token multiplier). Keep teams small and focused. Clean up immediately when done.

---

## Step 3: Announce the Decision

Before executing, state the routing decision to the user:

> **Routing: [Pattern A/B/C]**
> - Files to edit: [count]
> - Concerns: [list]
> - Handoffs needed: [yes/no]
> - Review needed: [yes/no]
> - Voice gate: [yes/no]
> - Why this pattern: [1 sentence]

This gives the user a chance to override. If they say "use teams anyway" after seeing the analysis, respect that — they may want to test the infrastructure or have context you do not.

---

## Anti-Patterns (What NOT to Do)

1. **Team for a 1-2 file edit.** The coordination overhead (TeamCreate, 5+ TaskCreate calls, SendMessage, shutdown) costs more than just writing the code.

2. **Redundant research agents.** Do not spawn a team researcher AND a subagent researcher for the same topic. Pick one. Haiku subagent for mechanical lookups, Opus team researcher for deep analysis requiring judgment.

3. **Team where you are the only writer.** If the main session is writing all the code anyway, teammates become expensive advisors who report after the work is done. Use subagents for research and write the code yourself.

4. **Subagents for sequential tasks.** If task B needs the output of task A, running them as subagents means A finishes, reports back, then you launch B. That is just a slower single session with extra overhead. Keep sequential work in one context.

5. **Defaulting to teams because the user said "agents."** The user may say "use agents on this" meaning "parallelize where it makes sense," not "create a full team with task lists and messaging." Run this framework first. Often "use agents" means Pattern B (2-3 subagents), not Pattern C (full team).

---

## Quick Reference

| Signal | Route |
|--------|-------|
| "Add a wiki entry" | A — Single session |
| "Build 5 pages that mirror the existing pattern" | B — Parallel subagents |
| "Build a new feature with data, pages, nav, and deploy" | C — Team |
| "Research this topic thoroughly" | A — Single session + 1 Haiku subagent |
| "Update the how-to and push to GitHub" | A — Single session |
| "Build the content pipeline with writer and reviewer" | C — Team |
| "Create 3 independent data files" | B — Parallel subagents |
| "I want to see teams work" | C — Team (user override, respect it) |
