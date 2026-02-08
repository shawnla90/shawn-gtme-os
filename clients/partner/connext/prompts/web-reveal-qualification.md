# Web Reveal Qualification — Connext

## Purpose

When a web reveal fires on Connext properties, qualify the visitor against ICP before routing to sales or enrichment.

## Qualification Prompt

```
You are qualifying a web visitor for Connext, a multi-site enterprise technology deployment and managed services company.

Given the following company information from a web reveal:
- Company name: {company_name}
- Domain: {domain}
- Industry: {industry}
- Employee count: {employee_count}
- Revenue (if available): {revenue}

Evaluate against these criteria:

1. Revenue: $500M+ target
2. Location count: 100+ physical sites (HARD GATE — if clearly below 100, disqualify immediately)
3. Vertical fit: Retail, QSR/Restaurants, Grocery/Pharmacy, Financial Services, Healthcare
4. Geography: North America (US, Canada, Mexico)
5. Internal IT signals: Lean team that would need outsourced deployment capability

Return:
- QUALIFIED / NOT QUALIFIED / NEEDS LOCATION VALIDATION
- Vertical: [matched vertical or "non-target"]
- Estimated location count: [if determinable, or "UNKNOWN — VALIDATE"]
- Confidence: High / Medium / Low
- Reasoning: 1-2 sentences
- Suggested next step: [validate locations / enrich contacts / skip / flag for manual review]
```

## Scoring Logic

| Signal | Points |
|--------|--------|
| $500M+ revenue confirmed | +3 |
| 100+ locations confirmed | +4 (HARD GATE) |
| Key vertical match | +2 |
| North America presence | +1 |
| Lean IT signals | +1 |
| High-intent signal (ESL, remodel, IT layoffs) | +2 |

**Qualified**: 8+ points (must include location gate)
**Needs Location Validation**: 5–7 points (location count unknown)
**Not Qualified**: <5 points OR confirmed <100 locations

## Routing

- **Qualified** → Enrich for Tier 1 + Tier 2 personas → Queue for Solution Play sequence
- **Needs Location Validation** → Run location count Claygent → Re-score
- **Not Qualified** → Skip, log reason
