# Gap Analysis Prompt

Runs a site audit for Touch 2 content. Produces specific, actionable findings - not generic advice.

## What It Checks

- Missing meta tags, thin content, no blog
- Technical SEO gaps (speed, mobile, structured data)
- Keyword gaps vs competitors
- Content opportunities they're not capturing
- Site performance issues

## Output

- Gap score (0-100, lower = more gaps)
- Top 3 specific issues with evidence
- Priority recommendation

## Script

`gap_analysis.py` - uses Firecrawl for scraping + AI for analysis.
