---
name: clickup-time-track
description: Auto-log tracked time on ClickUp tasks after completing work. Fires after any ClickUp task update, status change, or task completion. Uses the task's time estimate as the logged duration. Use when the user completes a ClickUp task, updates a task status, or types /tracktime.
---

# ClickUp Auto Time Tracking

## When This Fires

Trigger this skill **automatically** whenever:
1. A ClickUp task status is updated (via `clickup_update_task`)
2. A ClickUp task is marked as submitted, delivered, or published/done
3. The user explicitly says to track time or types `/tracktime`

Do NOT fire when:
- Only reading/searching ClickUp tasks (no work was done)
- The task was just created (no work to log yet)

## Workflow

### Step 1: Determine the Duration

Check the task for a time estimate:

1. **If the task has a `time_estimate`**: Use that value as the tracked time duration. Convert from milliseconds (ClickUp stores estimates in ms). Example: `14400000` ms = 4 hours.
2. **If no time estimate exists**: Ask the user how long the work took. Default suggestion: 30 minutes.
3. **If the user provides a duration**: Use their value exactly.

### Step 2: Log the Time Entry

Use `clickup_add_time_entry` with:
- `task_id`: The task that was worked on
- `start`: Current date + a reasonable start time (default: 1 hour before now)
- `duration`: The determined duration from Step 1
- `description`: Brief summary of what was done (pull from conversation context)

### Step 3: Confirm

Tell the user: "[duration] tracked on [task name]"

## Example

```
User updates task 86dzvct14 to "submitted"
→ Task has time_estimate: 7200000 (2 hours)
→ Log 2h time entry with description from context
→ "2h tracked on Company & Contact Enrichment Documentation"
```

## Edge Cases

- If a task is updated multiple times in one session, only log time on the FIRST status change (don't double-count)
- If the estimate seems unreasonably high (>8h) for the work done, ask the user to confirm before logging
- Round to nearest 15 minutes if the user gives an imprecise answer ("about an hour" = 1h)
