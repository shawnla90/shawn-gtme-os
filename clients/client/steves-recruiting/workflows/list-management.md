# List Management — SteveS Recruiting

## The Master List

- **Source**: Provided by Steve, originally worked by a previous operator
- **Size**: ~10,000 contacts (unique title-to-company)
- **Format**: CSV
- **Data quality**: Inconsistent (see issues below)

## Data Quality Status

| Field | Coverage | Status |
|-------|----------|--------|
| Full name | Partial | Some rows missing — needs gap-fill |
| Company name | Partial | Some rows missing — needs gap-fill |
| Mobile number | ~90% (~9,000) | Enriched from 60% → 90% |
| Email | In progress | Currently being enriched |
| Title | Present | Varies in specificity |
| Geography | Present | Mostly Ohio, some Great Lakes |

## Enrichment Pipeline

### Phase 1: Mobile Enrichment (DONE)
- Started at 60% coverage
- Now at ~90% (~9,000 mobile numbers)
- Remaining 10% likely unreachable or bad data

### Phase 2: Email Enrichment (IN PROGRESS)
- Working on filling email gaps
- Priority: contacts WITH mobile who need email for follow-up
- Secondary: contacts WITHOUT mobile where email is the only reach method

### Phase 3: Company Data Enrichment (PLANNED)
- Enrich with Semrush for recruitment signals
- Add company size, industry, tech stack where available
- Validate Ohio geography

### Phase 4: Data Cleanup (PLANNED)
- Deduplicate (same person, multiple entries)
- Standardize company names
- Gap-fill names from email patterns
- Gap-fill companies from email domains
- Remove clearly unqualified entries (non-Ohio, non-tech)

## CSV Handling Workflow

When loading Steve's CSV for work:
1. Load CSV into Cursor / working environment
2. Reference `prompts/list-cleaning.md` for cleanup prompts
3. Run data quality audit (counts, gaps, issues)
4. Apply fixes in batch
5. Export cleaned version
6. Track changes in `resources/csv-notes.md`

> This CSV handling pattern will repeat across clients. Reusable workflows should be documented here and cross-referenced.

## CRM Migration (Pending)

Once Steve picks a CRM (Zoho / PipeDrive / HubSpot — Shawn recommends HubSpot):
1. Map CSV columns to CRM fields
2. Clean data to CRM import requirements
3. Import in batches
4. Validate import quality
5. Set up views for daily batching
