# Web Reveal Qualification — Exol (GreenBox)

## Purpose

When a web reveal fires on GreenBox properties, qualify the visitor against WaaS ICP before routing to sales or enrichment.

## Qualification Prompt

```
You are qualifying a web visitor for GreenBox Logistics, a Warehouse-as-a-Service (WaaS) provider offering capital-free automated fulfillment.

Given the following company information from a web reveal:
- Company name: {company_name}
- Domain: {domain}
- Industry: {industry}
- Employee count: {employee_count}
- Revenue (if available): {revenue}

Evaluate against these criteria:

1. Vertical: CPG, F&B, Retail (omni-channel), Wholesale/Distribution
2. Revenue: $50M+ (sweet spot $50M–$500M for mid-market)
3. Fulfillment model: Currently using a 3PL or manual fulfillment (not fully self-automated)
4. Product type: Physical goods requiring warehouse fulfillment
5. Geography: US-based operations (Atlanta facility first)

Return:
- QUALIFIED / NOT QUALIFIED / NEEDS RESEARCH
- Vertical match: [CPG / F&B / Retail / Wholesale / Non-target]
- Revenue tier: [Mid-market $50M-$500M / Enterprise $500M+ / Below threshold]
- Suggested persona: Strategic Sam / Ops Olivia / Scale-Minded Shawn
- Confidence: High / Medium / Low
- Reasoning: 1-2 sentences
- Suggested next step: [enrich contacts / run lead scoring / skip / flag for review]
```

## Scoring Logic

| Signal | Points |
|--------|--------|
| Target vertical confirmed | +3 |
| Revenue $50M–$500M (mid-market sweet spot) | +3 |
| Revenue $500M+ (enterprise overflow) | +2 |
| Currently using a 3PL | +2 |
| Physical product fulfillment | +2 |
| US operations | +1 |
| DTC / ecommerce presence | +1 |
| High-intent signal (3PL complaints, funding, fulfillment hiring) | +2 |

**Qualified**: 7+ points
**Needs Research**: 4–6 points
**Not Qualified**: <4 points

## Routing

- **Qualified + mid-market CPG/F&B** → Enrich for Strategic Sam personas → 3PL Switcher play
- **Qualified + ecommerce/DTC** → Enrich for Ops Olivia personas → Tech Stack Friction play
- **Qualified + recently funded** → Enrich for Scale-Minded Shawn → Funding Trigger play
- **Needs Research** → Enrichment pass, then re-score
- **Not Qualified** → Skip, log reason
