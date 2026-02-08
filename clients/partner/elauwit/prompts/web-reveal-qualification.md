# Web Reveal Qualification — Elauwit

## Purpose

When a web reveal (Vector, Midbound, or similar) fires on Elauwit properties, qualify the visitor against ICP before routing to sales or enrichment.

## Qualification Prompt

```
You are qualifying a web visitor for Elauwit (Nasdaq: ELWT), a multifamily WiFi and Network-as-a-Service provider.

Given the following company information from a web reveal:
- Company name: {company_name}
- Domain: {domain}
- Industry: {industry}
- Employee count: {employee_count}

Evaluate against these criteria:

1. Is this a multifamily owner-operator, developer, or property management company?
2. Estimated portfolio size (look for unit count signals): target is 1,000–20,000 units
3. Asset class signals: Class B (2000–2015 vintage) = NaaS fit, Class A (post-2015) = Managed WiFi fit
4. Geographic presence in priority markets: DMV, Southeast (FL, GA, Carolinas), Texas

Return:
- QUALIFIED / NOT QUALIFIED / NEEDS RESEARCH
- Product fit: NaaS / Managed WiFi / Both / Unknown
- Confidence: High / Medium / Low
- Reasoning: 1-2 sentences
- Suggested next step: [enrich contacts / skip / flag for manual review]
```

## Scoring Logic

| Signal | Points |
|--------|--------|
| Multifamily owner-operator confirmed | +3 |
| Portfolio 1,000–20,000 units | +3 |
| Properties with 200+ units | +2 |
| Class B vintage 2000–2015 | +2 (NaaS) |
| Class A post-2015 | +2 (Managed WiFi) |
| In priority geography | +1 |
| Privately held | +1 |

**Qualified**: 6+ points
**Needs Research**: 3–5 points
**Not Qualified**: <3 points

## Routing

- **Qualified + NaaS fit** → Enrich for Tier 2 ops personas → Queue for "Quote the Switch" sequence
- **Qualified + Managed WiFi fit** → Enrich for development personas → Queue for managed WiFi sequence
- **Needs Research** → Flag for manual review, enrich company data
- **Not Qualified** → Skip, log reason
