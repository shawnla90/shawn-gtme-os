# Pipeline Status

> Last updated: 2026-03-03

## Data Snapshot

| Metric | Count | Health |
|--------|-------|--------|
| Accounts | 182 | Name + domain only. Zero enrichment. |
| Contacts | 146 | first_name + title + apollo_id. Email/last_name/linkedin empty. |
| Landing pages | 62 | Generated. Content quality not audited. |
| Emails sent | 0 | Outreach not yet live. |
| Page views | 0 | No traffic (nothing sent yet). |

## Active Campaign

**2026-03-abm-v1** - Series A SaaS. Status: Building.
See: `campaigns/active/2026-03-abm-v1/brief.md`

## Blockers

1. **Contacts broken** - email, last_name, linkedin_url are empty strings. Migration from old SQLite didn't map Apollo fields. Need re-enrichment via apollo_id.
2. **28% bad titles** - HR/talent/engineering contacts mixed in. prospect.py filters seniority but not department.
3. **5+ junk accounts** - Articles and aggregator pages, not companies (linkedin.com, crunchbase.com domains).
4. **No email verification** - Apollo emails unverified. Bounce rate unknown. Domain reputation risk.
5. **Lemlist not connected** - Maildoso accounts need to be connected to Lemlist for sequencing.

## What's Working

- Nightly pipeline runs at 22:00 (research + prospect + generate + sync + depersonalize)
- Daily TTL enforcement at 06:00
- Landing pages rendering at thegtmos.ai/for/{slug}
- Attio CRM sync functional
- PostHog tracking code deployed on pages

## Known Limitations

1. Attio MCP list filtering broken (Modes 3/4)
2. No bounce handling in check_replies.py
3. No automatic retry - pipeline moves on after failures
4. Exa junk leaks through (articles get into accounts)
5. Single email template exists (no follow-up templates)
6. No A/B testing framework
