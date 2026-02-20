---
name: context-handoff
description: Generate a context handoff document at the end of a session so the next Claude Code session can pick up where this one left off. Auto-invoked when ending significant work, or manually via /handoff.
---

# Context Handoff

Generate a structured handoff document that preserves session context for the next Claude Code agent.

## When to Invoke

- End of any session that made meaningful changes
- Before switching between MacBook and Mac Mini work
- When context window is getting large and a fresh session is needed
- User says `/handoff`, "wrap up", "hand off", or "create a handoff"

## Output Location

Always write to: `.claude/context-handoff.md`

This file is checked by every new session via the MEMORY.md auto-load instruction.

## Handoff Template

Write the handoff using this exact structure:

```markdown
# Context Handoff
> Generated: YYYY-MM-DD HH:MM | Machine: [MacBook/Mac Mini] | Session: [brief label]

## What Was Done This Session
[Bullet list of completed work — files created, edited, fixed. Be specific with paths.]

## Current State
- **Git**: [branch, clean/dirty, last commit hash + message]
- **Uncommitted changes**: [list or "none"]
- **Blocked on**: [anything that couldn't be completed and why]

## Next Steps
[Ordered list of what the next session should pick up. Include file paths and specific instructions.]

## Key Decisions Made
[Any architectural or approach decisions the next agent needs to know about to avoid re-litigating.]

## Files to Read First
[Top 3-5 files the next session should read to get oriented, in priority order.]
```

## Rules

1. **Be specific** — file paths, commit hashes, line numbers. Vague handoffs are useless.
2. **Don't summarize the whole repo** — that's what `docs/ARCHITECTURE.md` is for. Only include what changed THIS session.
3. **Include blockers** — if something failed or was skipped, say why.
4. **Keep it under 100 lines** — this is a handoff, not a novel.
5. **Always run `git status` and `git log -1 --oneline`** before writing the handoff to capture accurate state.
