# List Cleaning Prompts — SteveS Recruiting

## Purpose

Steve's master list (~10,000 contacts) has data quality issues. These prompts handle CSV cleanup, gap-filling, and deduplication.

## Known Data Issues

- Sometimes full name present, sometimes missing
- Sometimes full company present, sometimes missing
- Not always both name AND company on same row
- Email coverage incomplete (enrichment in progress)
- Mobile coverage at ~90% (~9,000 numbers)
- Potential duplicates (same person, different title entries)

## CSV Cleanup Prompt

```
You are cleaning a recruiting contact list for an Ohio-based technical recruiter.

Given a CSV with columns: [POPULATE ACTUAL COLUMN NAMES]

Perform the following:
1. Flag rows missing first name OR last name
2. Flag rows missing company name
3. Flag rows missing both email AND mobile (no way to reach)
4. Identify potential duplicates (same name at same company, or same email)
5. Standardize company names (e.g., "ABC Corp" vs "ABC Corporation" vs "abc corp")
6. Flag entries outside Ohio/Great Lakes region
7. Validate email format where present

Return a summary:
- Total rows
- Complete rows (name + company + at least one contact method)
- Rows needing enrichment (missing name, company, or contact)
- Potential duplicates
- Out-of-geography entries
- Recommended actions for each issue category
```

## Name Gap-Fill Prompt

```
Given a row with company name and email but missing contact name, attempt to:
1. Infer name from email format (firstname.lastname@company.com)
2. If email doesn't contain name, flag for manual lookup or LinkedIn enrichment
```

## Company Gap-Fill Prompt

```
Given a row with contact name and email but missing company, attempt to:
1. Extract company from email domain (exclude gmail, yahoo, outlook, etc.)
2. If personal email, flag for LinkedIn enrichment
```

## CSV Loading Notes

CSVs from Steve can be loaded directly into Cursor for cleaning and enrichment work. The skill tree provides the context so Claude knows what to do with the data without re-explaining every time.

> This pattern (CSV handling for client lists) will repeat across clients. Document reusable patterns here.
