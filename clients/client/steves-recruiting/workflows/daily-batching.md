# Daily Batching — SteveS Recruiting

## The Workflow

Steve cold calls 20–50 leads per day on direct lines. This workflow produces his daily call list.

## Target Cadence

| Metric | Target |
|--------|--------|
| Daily calls | 20–50 |
| Monthly calls | 600–800 |
| List size | ~10,000 contacts |
| Full list cycle | ~3–4 months at pace |

## Daily Batch Process

### Morning Prep

1. Pull contacts with: mobile + full name + company
2. Score by signal strength (see `prompts/lead-prioritization.md`)
3. Filter out recently called (within re-queue window)
4. Take top 20–50 by score
5. Format as simple call sheet

### Call Sheet Format

```
| # | Name | Company | Title | Mobile | Signal |
|---|------|---------|-------|--------|--------|
| 1 | ... | ... | ... | ... | Active SWE posting (2 days ago) |
| 2 | ... | ... | ... | ... | 3 tech roles open |
```

### Post-Call Logging

After each call, Steve logs:
- **No answer** → re-queue 3–5 days
- **Voicemail** → re-queue 7 days
- **Connected, bad timing** → re-queue 30 days
- **Not interested** → mark inactive
- **Interested** → move to pipeline (candidate matching begins)

## Integration Points

### Before CRM Decision
- Batching runs from CSV/spreadsheet
- Manual tracking of call outcomes

### After CRM Decision
- Batching runs from CRM views/filters
- Automated re-queue based on disposition
- Pipeline tracking for interested leads
- Candidate matching workflow triggered on "interested"

## Optimization Notes

- Signal freshness matters most — companies with job postings from this week should be first
- Multiple open roles = higher urgency (they're actively struggling to hire)
- Hiring manager contacts outperform HR contacts for cold calls (peer-level conversation)
- Track conversion rate by signal type to refine prioritization over time
