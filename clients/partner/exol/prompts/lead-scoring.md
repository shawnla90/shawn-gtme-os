# Lead Scoring — Exol (GreenBox)

## Scoring Model (200 Points Max)

### Fit Score (100 Points)

**Persona Match (30 pts)**:
| Persona | Points |
|---------|--------|
| Strategic Sam (VP/Director Supply Chain) | 30 |
| Scale-Minded Shawn (COO/EVP) | 30 |
| Ops Olivia (Director Ecommerce Ops) | 25 |
| Adjacent title (Manager-level supply chain/ops) | 15 |
| Non-match | 0 |

**Revenue Band (25 pts)**:
| Revenue | Points |
|---------|--------|
| $50M–$500M (mid-market sweet spot) | 25 |
| $500M+ (enterprise overflow) | 20 |
| $20M–$49M (emerging) | 10 |
| <$20M | 0 |

**Vertical Match (25 pts)**:
| Vertical | Points |
|----------|--------|
| Mid-Market CPG & F&B | 25 |
| Retail (omni-channel) | 25 |
| Large CPG & F&B | 20 |
| Wholesale/Distribution | 20 |
| Non-target | 0 |

**Tech Stack Signals (20 pts)**:
| Signal | Points |
|--------|--------|
| Shopify / Shopify Plus confirmed | 10 |
| ERP (NetSuite, SAP) confirmed | 5 |
| Currently using a 3PL | 5 |
| No tech signals | 0 |

### Engagement Score (100 Points)

| Action | Points |
|--------|--------|
| Email open | 5 |
| Email click | 15 |
| Website visit (any page) | 10 |
| Website visit (pricing/demo page) | 25 |
| Content download | 20 |
| Ad click (Google/LinkedIn) | 10 |
| Event/webinar registration | 25 |
| Demo request (inbound) | 50 |

## Tier Routing

| Tier | Score Range | Action |
|------|-----------|--------|
| Tier 1 | 150+ | Immediate SDR outreach |
| Tier 2 | 100–149 | Nurture sequence + active monitoring |
| Tier 3 | <100 | Passive monitoring, re-score monthly |

## Clay→HubSpot Pipeline

### Current State
- Fit scoring calculated in Clay
- Contacts pushed to HubSpot with scores
- Engagement scoring tracked in HubSpot

### Scoring Prompt (Clay)

```
You are scoring a lead for GreenBox Logistics (Warehouse-as-a-Service).

Given the following contact and company data:
- Name: {name}
- Title: {title}
- Company: {company}
- Industry: {industry}
- Revenue: {revenue}
- Tech stack: {tech_stack}

Score this lead using the Fit Score model (100 pts max):
1. Persona match (0-30 pts)
2. Revenue band (0-25 pts)
3. Vertical match (0-25 pts)
4. Tech stack signals (0-20 pts)

Return:
- Fit score: [number]/100
- Persona archetype: Strategic Sam / Ops Olivia / Scale-Minded Shawn / None
- Tier (fit only): Tier 1 (75+) / Tier 2 (50-74) / Tier 3 (<50)
- Reasoning: 1-2 sentences
- Recommended play: 3PL Switcher / Tech Stack Friction / Funding Trigger / None
```
