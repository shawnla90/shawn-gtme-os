---
name: context-handoff
description: Generate a context handoff document at the end of a session so the next Claude Code session can pick up where this one left off. Auto-invoked when ending significant work, or manually via /handoff.
---

# Context Handoff

Generate a structured handoff document that preserves session context for the next Claude Code agent. Supports parallel sessions - multiple handoffs can coexist without overwriting each other.

## When to Invoke

- End of any session that made meaningful changes
- Before switching between MacBook and Mac Mini work
- When context window is getting large and a fresh session is needed
- User says `/handoff`, "wrap up", "hand off", or "create a handoff"

## Output Location

Write to: `~/.claude/handoffs/<timestamp>_<slug>.md`

- **Format:** `YYYY-MM-DD_HHMMSS_<slug>.md`
- **Slug:** 2-4 word kebab-case label for the session's work (e.g., `content-pipeline-fix`, `nio-v3-messaging`, `reddit-engage-setup`)
- **Example:** `~/.claude/handoffs/2026-02-27_143022_memory-restructure.md`

Create the directory if it doesn't exist:
```bash
mkdir -p ~/.claude/handoffs
```

**IMPORTANT:** Never overwrite or delete other handoff files in this directory. Each session writes its own file. Multiple parallel sessions can coexist safely.

### Legacy Compatibility

If `~/.claude/context-handoff.md` (the old single-file location) exists, leave it alone. New sessions will read from both the old location and the new `handoffs/` directory.

## On Session Start (Reading Handoffs)

Before doing anything else:

1. Check for handoffs to consume:
```bash
ls ~/.claude/handoffs/*.md 2>/dev/null | grep -v '_done.md$'
```

2. Also check the legacy location:
```bash
test -f ~/.claude/context-handoff.md && echo "Legacy handoff exists"
```

3. Read ALL unconsumed handoffs. Print a brief summary:
```
## Active Handoffs
- [2026-02-27 14:30] memory-restructure - Memory files restructured, topic index created
- [2026-02-27 15:45] reddit-pipeline - Reddit scout + engage flow built
```

4. After reading, mark consumed handoffs by renaming with `_done` suffix:
```bash
mv ~/.claude/handoffs/2026-02-27_143022_memory-restructure.md ~/.claude/handoffs/2026-02-27_143022_memory-restructure_done.md
```

Only mark a handoff as done AFTER you've read it and confirmed the context is loaded. If the session is focused on different work and a handoff isn't relevant, still mark it done - you read it, that's enough.

5. Periodically clean up old consumed handoffs (older than 7 days):
```bash
find ~/.claude/handoffs -name '*_done.md' -mtime +7 -delete 2>/dev/null
```

## Handoff Template

Write the handoff using this exact structure:

```markdown
# Context Handoff
> Generated: YYYY-MM-DD HH:MM | Session: [brief label]

## What Was Done This Session
[Bullet list of completed work - files created, edited, fixed. Be specific with paths.]

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

## Post-Handoff: Auto-Compact

After writing the handoff file, **always run `/compact`** to compress the conversation context. This lets the user continue working in the same session with a fresh context window.

Steps:
1. Write the handoff file (as above)
2. Print a brief confirmation: "handoff written to ~/.claude/handoffs/... - compacting context now."
3. Tell the user: "handoff saved. run `/compact` to free up context and keep working."

The user prefers to stay in-session rather than starting fresh. The handoff + compact combo gives them a checkpoint without losing their terminal state.

## Rules

1. **Be specific** - file paths, commit hashes, line numbers. Vague handoffs are useless.
2. **Don't summarize the whole repo** - only include what changed THIS session.
3. **Include blockers** - if something failed or was skipped, say why.
4. **Keep it under 100 lines** - this is a handoff, not a novel.
5. **Always run `git status` and `git log -1 --oneline`** before writing the handoff to capture accurate state.
6. **Never overwrite another session's handoff.** Each session gets its own file.
7. **Consume on read.** Mark handoffs `_done` after reading them so they don't pile up.
8. **Auto-clean.** Delete `_done` handoffs older than 7 days.
9. **Always suggest `/compact` after writing.** The user wants to continue in-session.
