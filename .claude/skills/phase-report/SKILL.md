---
name: phase-report
description: Generate a phase report when building multi-session features. Creates both a technical report (for Claude/dev continuity) and a plain-English report (for Shawn to explain to anyone). Auto-invoked when completing significant planning or build work, or manually via /phase-report.
---

# Phase Report

Generate structured reports for any multi-session, multi-phase, or significant feature build. Two reports per phase: one technical, one plain-English.

## When to Auto-Invoke

**This skill is MANDATORY after big initiatives.** Do not wait for the user to ask — fire it automatically when any of these are true:

- After completing a build session that created a new system, integration, or pipeline (this session = json-render, previous = sprite system, etc.)
- After finishing a significant build session (3+ files created/modified)
- After completing a planning session that maps out multiple phases
- When a feature involves multiple tools, scripts, or systems wired together
- When the user explicitly says to plan in phases or mentions "phase 1", "phase 2", etc.
- User says `/phase-report`, "write a report", "document this", or "save this output"
- After any commit with a `feat:` prefix that touches 5+ files

## Inline Summary Rule

**Before writing reports to disk, ALWAYS present the plain-English breakdown directly in the conversation.** Shawn should see the non-technical summary immediately without having to open a file. Then write both reports to `reports/`. The inline summary replaces nothing — it's in addition to the files.

## Output Location

Always write to: `reports/YYYY-MM-DD_slug/`

- `technical-report.md` — for dev continuity (Claude, Nio, future sessions)
- `plain-english-report.md` — for Shawn to explain to himself or anyone else

The `slug` should be a short kebab-case description of the work (e.g., `growth-engine-buildout`, `nio-v3-message-fix`, `tiktok-pipeline`).

## Technical Report Template

```markdown
# [Feature Name] — Technical Report

**Date:** YYYY-MM-DD
**Session scope:** [1-line description of what was planned/built]
**Status:** Phase N complete. Phase N+1 pending.

---

## What Was Done

[Detailed description of the work. Include:]
- Source/trigger (what prompted this work)
- Specific files created/modified (table format)
- Architecture decisions and why
- How components connect

## What Still Needs To Be Done (Phase N+1)

### High Priority
- [ ] [Specific, actionable items with file paths]

### Medium Priority
- [ ] [Items that enhance but aren't blocking]

### Long-Term
- [ ] [Items for future sessions]

## Key Decisions Made

[If a CONTEXT.md exists for this feature, import all items from its `## Decisions` section here.
Then add any additional decisions made during execution that weren't in the original CONTEXT.md.]

[Numbered list of architectural/approach decisions the next session must respect]

## Deferred Ideas

[If a CONTEXT.md exists, import all items from its `## Deferred Ideas` section here.
These are ideas that were explicitly out of scope for this phase but should be preserved for future work.
If no CONTEXT.md exists, list any ideas that came up during execution but were deferred.]

- [ ] [Deferred item with brief rationale]

## Key File Locations

[Code block with tree of relevant files]
```

## Plain-English Report Template

```markdown
# [Feature Name] — Plain English

**Date:** [Human-readable date]
**What this is:** [1-line summary anyone can understand]

---

## The Spark
[What prompted this work — in conversational tone]

## What We Built
[For each major piece:]
### [Name]
**The idea:** [Why this matters, in normal words]
**What we did:** [What was built, no jargon]
**What it needs next:** [Honest next steps]

## Why This Matters
[Before vs. after comparison. What changed.]

## What's Next
**Immediate:** [This week]
**Soon:** [Next 2-3 sessions]
**Long term:** [Vision]

## The Bottom Line
[2-3 sentence summary. Punchy.]
```

## Rules

1. **Always create both reports** — technical AND plain-English. No exceptions.
2. **Be specific in technical** — file paths, cron times, env vars, commands to run.
3. **Be honest in plain-English** — don't oversell. Say what works, what doesn't yet, what's blocked.
4. **Keep plain-English jargon-free** — if your mom couldn't follow it, rewrite it.
5. **Use tables** in technical reports for file listings. Scannable > readable.
6. **Include "What Still Needs To Be Done"** with checkboxes — this is the handoff for the next session.
7. **Link reports to each other** — if Phase 2 builds on Phase 1, reference the Phase 1 report path.
8. **One folder per phase** — don't overwrite. Each significant session gets its own dated folder.
9. **Slug should be descriptive** — `growth-engine-buildout` not `report-1`.
10. **Create the report folder at the END of the build**, not the beginning. You need to know what was actually done.
11. **Read CONTEXT.md first** — if a CONTEXT.md exists for this feature (in `reports/YYYY-MM-DD_slug/` or the feature working directory), read it before writing the report. Locked decisions and deferred ideas MUST appear in the report. The phase-report is the permanent archive; CONTEXT.md may be cleaned up after.
