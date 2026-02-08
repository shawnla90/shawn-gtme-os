# Lead Prioritization — SteveS Recruiting

## Purpose

Steve calls 20–50 leads per day (~600–800/month). With ~10,000 contacts, prioritization determines what he calls first and what gets queued.

## Prioritization Scoring

### Data Completeness (Required)

| Field | Status | Priority Impact |
|-------|--------|----------------|
| Mobile number | Present | Required for batch (Steve calls direct lines) |
| Full name | Present | Required for batch |
| Company name | Present | Required for batch |
| Email | Present | Bonus (enables follow-up) |

**No mobile = not in the call batch.** Steve calls on direct lines.

### Signal Score

| Signal | Points | Source |
|--------|--------|--------|
| Active tech job posting (last 14 days) | +5 | Job board scrape |
| Active tech job posting (15–30 days) | +3 | Job board scrape |
| Multiple open tech roles | +3 | Job board scrape |
| Company in Ohio | +2 | List data |
| Company in Great Lakes (not Ohio) | +1 | List data |
| Hiring manager title (Engineering/IT lead) | +2 | List data |
| Previous recruiter usage signals | +2 | Enrichment |
| Recently funded / growing | +1 | Enrichment |

### Daily Batch Logic

```
1. Filter: mobile number present + full name + company name
2. Sort by signal score (highest first)
3. Take top 20–50 for today's batch
4. Mark as "batched" with date to avoid re-calling within [X] days
5. When signal score ties, prefer:
   a. Fresher job postings
   b. Ohio over Great Lakes
   c. Hiring manager over HR
```

## Batch Output Format

Steve needs a simple daily list he can work from:

```
[Name] | [Company] | [Title] | [Mobile] | [Signal: why they're in today's batch]
```

## Re-Queue Rules

- No answer → re-queue in 3–5 days
- Voicemail left → re-queue in 7 days
- Connected but timing wrong → re-queue in 30 days
- Not interested → remove from active list
- Interested → move to Steve's pipeline
