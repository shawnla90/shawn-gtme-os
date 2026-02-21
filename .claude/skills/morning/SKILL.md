---
name: morning
description: Daily ops dashboard. Reads context handoff, checks git status, queries ClickUp for due/overdue tasks, scans partner SKILL.md files for blockers, and prints a scannable morning brief. Use when the user types /morning or starts a new work day.
---

# Morning Ops Dashboard

Print a concise daily operations dashboard so Shawn can see what needs attention in < 10 seconds.

## When to Invoke

- User types `/morning`
- User says "what's on today", "morning brief", "daily check", or similar
- Start of a new work session when the user asks what to pick up

## Steps

### Step 1: Read Context Handoff

Read `.claude/context-handoff.md` and extract:
- **"What Was Done This Session"** — brief summary of last session
- **"Next Steps"** — the numbered list of carryover work
- **"Current State"** — git branch and dirty/clean status noted in handoff

If the file does not exist or is empty, note: "No handoff from previous session."

### Step 2: Live Git Status

Run these commands:
```bash
git status -s
git stash list
```

Count: modified files, untracked files, stashed changes. Compare against the handoff's "Current State" to flag if anything changed since last session (e.g., someone else committed, or a sync happened).

### Step 3: ClickUp — Due Today & Overdue

Query ClickUp for actionable tasks across all partner workspaces.

1. Call `get_workspace_hierarchy` to get the current folder/list structure
2. For each known partner folder, call `get_tasks` on every list within that folder. Discover partner names dynamically by listing subdirectories of `clients/partner/`.
3. From the returned tasks, filter for:
   - **Due today or overdue**: `due_date` exists AND `due_date <= end of today` AND status is NOT `completed` / `closed` / `done`
   - **Urgent priority**: any task with priority = 1 (urgent), regardless of due date
4. Sort: overdue first (oldest due date at top), then due today, then urgent-no-date

**If ClickUp auth fails or MCP is unavailable**: Print "ClickUp: unavailable (skipped)" and continue — do NOT block the dashboard.

### Step 4: Partner Pulse

Read the "Current Status" section from each partner SKILL.md. Discover partners dynamically:

```bash
ls -d clients/partner/*/SKILL.md 2>/dev/null
```

For each file, scan for lines containing any of these keywords (case-insensitive):
- `blocked`
- `waiting`
- `overdue`
- `urgent`
- `limited`

Collect matching lines with partner name prefix. Skip partners that have no flagged lines.

### Step 5: Print Dashboard

Format the output as markdown using the template below. **Omit any section that has zero items** — do not print empty tables or blank sections.

```
# Morning Ops — [DayOfWeek], [Month] [Date]

## Pickup (from last session)
- [Next step 1 from handoff]
- [Next step 2 from handoff]
- ...
- Git: [X modified, Y untracked | clean]

## Due Today
| Partner | Task | Priority | Status |
|---------|------|----------|--------|
| [name] | [task name] | [priority] | [status] |

## Overdue
| Partner | Task | Due | Status |
|---------|------|-----|--------|
| [name] | [task name] | [date] | [status] |

## Blocked / Waiting
- [Partner] [description of blocked/waiting item]

---
What do you want to work on?
```

## Rules

1. **Speed over completeness** — if a ClickUp call is slow or fails, skip it and note the skip. Never let one failing source block the whole dashboard.
2. **No handoff modification** — read `.claude/context-handoff.md` but never write to it. That is the context-handoff skill's job.
3. **No git changes** — this is a read-only dashboard. Do not stage, commit, stash, or modify anything.
4. **Keep it scannable** — no paragraphs, no explanations. Bullets and tables only.
5. **End with the prompt** — always close with "What do you want to work on?" to hand control back to the user.
