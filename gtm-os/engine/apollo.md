# Apollo - Contact Enrichment

> Finds the right people at each company. VP/Director/Manager level, up to 3 per company.

## API

- Endpoint: `mixed_people/api_search`
- Filters: seniority + domain
- Returns: name, title, email, LinkedIn URL
- 3 contacts per company, first marked `is_primary = true`
- MCP available (Apollo.io MCP)

## Title Filtering

Apollo filters by **seniority** but NOT by **department/function**. This means HR directors, engineering managers, and talent VPs leak through.

### Target Titles (YES)
VP Sales, VP Revenue, VP Growth, VP Marketing, Director RevOps, Director Sales Ops, Head of Growth, CRO, CMO, Director Demand Gen, Director Sales Dev, Director Customer Success, Sales Manager, BDM, Account Exec Lead, Sales Enablement

### Reject Titles (NO)
HR, Talent, Recruiting, Engineering, Software, Creative, Community, Social Media, Product Manager, Editor, Data (unless Data Ops)

**Current state:** 28% of contacts have irrelevant titles. Title filtering needs to be baked into `prospect.py`.

## Script

`prospect.py` - queries Apollo, stores contacts linked to accounts via `account_id`.

## Rate Limits

Check Apollo dashboard for current usage. Reduce `--limit` if hitting caps.

## Known Issues

- Contact fields (last_name, email, linkedin_url) came through as empty strings after SQLite migration
- Re-enrichment via apollo_id needed to backfill
