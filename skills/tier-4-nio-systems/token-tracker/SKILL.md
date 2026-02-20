# Token Usage Tracker

Nio's personal token tracking system - reports usage and estimated cost after each task.

## Core Function

After completing any task, calculate and report:
- Input tokens used
- Output tokens generated  
- Estimated cost (based on current model)
- Cumulative session totals

## Pricing Reference (Feb 2026)

**Claude Opus 4.6 (claude-opus-4-20250514):**
- Input: $15.00 / 1M tokens
- Output: $75.00 / 1M tokens

**Claude Sonnet 4.5 (claude-sonnet-4-20250514):**
- Input: $3.00 / 1M tokens
- Output: $15.00 / 1M tokens

## Response Format

Include this at the end of task completions:
```
---
📊 **Token Usage:**
- Input: X,XXX tokens (~$X.XX)
- Output: X,XXX tokens (~$X.XX)
- Task Cost: ~$X.XX
- Session Total: ~$XX.XX
```

## Integration Points

1. **Memory System** - Track daily/weekly costs in memory files
2. **Mission Control** - Update cost metrics dashboard
3. **Daily Logs** - Include in build summaries
4. **Alerts** - Notify if session exceeds $10

## Implementation

This skill should be auto-invoked after:
- Complex multi-tool operations
- Long-form content generation
- Sub-agent spawning
- Heavy analysis tasks

Keep running totals in `/tmp/nio_token_usage.json` for session tracking.