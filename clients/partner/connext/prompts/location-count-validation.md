# Location Count Validation — Connext

## Purpose

The 100+ location count is the HARD GATE for Connext qualification. This prompt validates location counts via web scraping and data enrichment.

## Claygent Prompt (Store Locator Scrape)

```
You are validating the physical location count for a company to determine if they meet the 100+ site threshold.

Company: {company_name}
Domain: {domain}

Instructions:
1. Look for a store locator, locations page, or "find a store" feature on their website
2. If a store locator exists, determine the total number of locations listed
3. If no store locator, look for location count references in:
   - About page ("serving X locations")
   - Press releases or investor materials
   - Footer or contact pages listing regions/states
4. Cross-reference with any available third-party data

Return:
- Location count: [number or "UNABLE TO DETERMINE"]
- Source: [where you found this — URL or description]
- Confidence: High (store locator with count) / Medium (referenced in content) / Low (estimated)
- Store locator URL: [if found]
- Notes: [any relevant context — e.g., "includes international locations" or "franchise vs. corporate"]
```

## Validation Rules

| Result | Action |
|--------|--------|
| 100+ confirmed (High confidence) | QUALIFIED — proceed to contact enrichment |
| 100+ estimated (Medium confidence) | Flag for manual verification, proceed cautiously |
| 50–99 locations | BELOW THRESHOLD — monitor for growth |
| <50 locations | DISQUALIFIED — skip |
| Unable to determine | Flag for manual research — don't discard |

## Data Quality Notes

- Corporate-owned vs. franchise locations both count for Connext (they deploy at both)
- International locations are relevant only for US/Canada/Mexico
- If a company has a store locator API, capture the endpoint for batch validation
- Log the validation source and date — location counts change

## Batch Validation Workflow

<!-- Document Clay table setup for batch location validation across TAM list here -->
