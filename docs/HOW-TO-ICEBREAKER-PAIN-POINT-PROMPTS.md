# How-To: Icebreaker, Poke the Bear & Pain Point Prompts

> **Audience**: Team members writing outbound campaigns or building AI research prompts.
> **Purpose**: Understand the 3-variable personalization model, learn the rules, see real examples, and write your own.

---

## The 3-Variable Model

Every outbound campaign we build uses three personalization variables. Each one has a different job and lands in a different part of the email sequence.

| Variable | Job | Tone | Where It Goes |
|----------|-----|------|--------------|
| **{icebreaker}** | Prove you researched the person/company | Warm, observational, specific | Email 1, opening line |
| **{poke_the_bear}** | Challenge their status quo — pattern interrupt | Edgy, confident, peer-to-peer | Email 2 opener (or Email 3 for 3-touch) |
| **{pain_point}** | Name a specific problem they're facing | Direct, company-specific, problem-focused | Email 1 body or Email 2 body |

**Key distinction**: These are NOT the same thing. An icebreaker says "I see you." A poke the bear says "I see what you're ignoring." A pain point says "Here's the problem you're dealing with."

---

## Variable 1: Icebreaker

### What It Is

The opening line of a cold email that proves you researched the person. A specific observation, recent activity, shared interest, or company signal. It earns the reader's attention for the next sentence.

### Rules

1. **ONE sentence.** It opens the email cold — right after "Hey {first_name},"
2. **Specific > generic.** Reference something real: a career move, a LinkedIn post, a company milestone, an event connection
3. **Pull from LinkedIn first**: about section, headline, experience, skills, recent posts
4. **If LinkedIn is thin**, fall back to company-level signals: tech stack, recent news, hiring patterns, funding
5. **Must stand alone as an opener** — conversational, like a human noticed something real
6. **Never generic flattery**: "love what you're doing" or "as a leader in your space" is instant delete
7. **Never fabricate**: If you can't find something real, flag it — don't make something up

### What Makes a Good Icebreaker

| Good | Bad |
|------|-----|
| References a real, verifiable detail | Generic industry observation |
| Feels like someone actually looked | Could apply to any person in the role |
| Conversational, natural tone | Sycophantic or overly formal |
| Specific to this person or company | "I noticed you're a VP at {company}" |

### Examples (By Partner)

**Exol (ShopTalk event context)**:
> "Saw you're heading to ShopTalk — and that you just expanded into Target doors last quarter. That kind of retail velocity usually breaks a 3PL relationship before the first OTIF review."

**Praecipio (web reveal context)**:
> "Noticed you've been scaling an Atlassian footprint since the Zendesk migration last year — that kind of transition usually surfaces some ugly workflow gaps by month six."

**Connext (account research context)**:
> "Saw you just announced 200 new locations by Q3 — that's a lot of site readiness to coordinate with a lean IT team."

### Data Sources (Priority Order)

1. LinkedIn profile (best for contact-level icebreakers)
2. Company domain / tech stack (best for company-level fallback)
3. Recent news, press releases, earnings
4. Event context (if applicable — e.g., ShopTalk, industry conference)
5. Title + industry + size inference (last resort — flag as Low confidence)

---

## Variable 2: Poke the Bear

### What It Is

A provocative, uncomfortable observation that challenges how the company is probably handling something today. It creates tension — makes the reader feel the cost of their status quo WITHOUT pitching a solution. It's a pattern interrupt.

### Rules

1. **1-2 sentences max.** Slightly edgy. Should make the reader pause.
2. **Specific enough to feel researched**, not a generic jab
3. **Reference their reality**: industry pain, bucket-specific pressures, known operational gaps
4. **Tone: confident peer**, not salesperson. Think "someone who's seen this movie before"
5. **Do NOT mention your product, solution, or company name.** Just name the problem sharply.
6. **Do NOT offer a solution.** The poke is the entire point — sit in the discomfort.
7. **Should create the reaction**: "...damn, that's actually true"

### What Makes a Good Poke the Bear

| Good | Bad |
|------|-----|
| Makes the reader feel the cost of inaction | Generic industry complaint |
| Specific to their vertical/segment/bucket | Could apply to any company |
| Confident, peer-level tone | Sounds like a sales pitch in disguise |
| Names the uncomfortable truth nobody says out loud | Obvious observation everyone already knows |
| Stands alone — doesn't need context | Requires explanation to land |

### Examples (By Partner)

**Exol — CPG brand**:
> "Most $200M CPG brands are still paying 2019 3PL rates on 2026 volume — and calling it a logistics strategy."

**Exol — F&B brand**:
> "Scaling frozen meal fulfillment through a manual 3PL while keeping OTIF above 95% for Walmart is a math problem that gets worse every quarter."

**Exol — Retail brand**:
> "Running omni-channel fulfillment from three separate inventory pools and calling it 'operational flexibility' is just a polite way of saying nobody has the budget to fix it."

**Praecipio (Email 1 body — "poke the bear" style)**:
> "Here's what I keep seeing at orgs your size — everyone knows the tooling is creating drag, but nobody wants to be the one to say it out loud. The workarounds become the process, and the process becomes 'how we've always done it.'"

**Connext (hypothetical — built from pain points)**:
> "Most enterprise IT teams running 500+ site refreshes are still coordinating it the same way they did when they had 50 locations — spreadsheets, regional vendors, and a prayer that site 400 looks like site 1."

### How to Write One

1. **Start with the bucket/vertical.** What industry is this company in? What are the known operational pressures?
2. **Identify the status quo behavior.** What are they probably doing today that's "good enough" but not actually working?
3. **Name the gap between what they're doing and what they need.** Don't say what they *should* do — just make the gap visible.
4. **Write it like you've seen 50 companies make this same mistake.** You're not guessing. You've watched this pattern play out.

---

## Variable 3: Pain Point

### What It Is

A data point or observation that identifies a specific problem the company is facing. Not a generic industry challenge — a company-specific signal that makes the reader think "how did they know that?"

### Rules

1. **ONE sentence.** Standalone paragraph in the email.
2. **Tie to a service fit** based on domain/tech stack/industry signals
3. **Frame as observation or question** — not a pitch
4. **Company-specific.** If you can't be specific, use role-based inference and flag confidence as Low
5. **The signal has to be real.** If you can't prove it from research, don't use it.

### Pain Point Sources

| Source | What It Tells You | Example Signal |
|--------|------------------|---------------|
| Job postings | Hiring urgency, scaling problems | "Posting for 5 SDR roles = scaling outbound" |
| Tech stack data | Legacy tools, integration gaps | "Running Atlassian DC = forced cloud migration" |
| LinkedIn posts | Public frustration, recent challenges | "VP of Ops posting about 3PL failures" |
| Earnings/press | Financial pressure, growth pains | "Revenue up 40% but margins shrinking" |
| Review sites (G2, etc.) | Customer complaints, product gaps | "G2 reviews mention slow onboarding" |
| Website signals | Fulfillment model, channel complexity | "Shopify + 3 retail partners = omni-channel pain" |

### Examples (By Partner)

**Exol — mapped to pain point library**:

| Pain Point | Example Variable Output |
|------------|----------------------|
| Manual labor scaling | "Fulfilling 50K orders/month through manual labor is manageable until peak season doubles your volume and your 3PL can't hire fast enough." |
| OTIF fines | "One missed OTIF cycle with Walmart doesn't just cost the chargeback — it costs the shelf space." |
| CapEx barriers | "You're evaluating automation but the $100M price tag keeps pushing it to 'next year's budget.'" |
| WISMO tickets | "Your support team is fielding 200 WISMO tickets a week because your 3PL's inventory sync is 6 hours behind your Shopify store." |

**Praecipio — mapped to service fit**:

| Service Fit | Example Variable Output |
|-------------|----------------------|
| Cloud Migration | "Running Atlassian Data Center with end-of-support approaching usually means someone's quietly scoping a migration nobody wants to own." |
| ITSM | "When your Jira Service Management instance has 47 custom workflows and nobody remembers why half of them exist, the problem isn't Jira — it's that nobody's had time to untangle it." |
| Tool sprawl | "Three project management tools across four teams isn't a 'best of breed' strategy — it's a sign that nobody had time to consolidate after the last reorg." |

**Connext — mapped to pain points**:

| Pain Point | Example Variable Output |
|------------|----------------------|
| Deployment pressure | "Rolling out new POS systems across 300 locations by Q3 with a 4-person IT team usually means someone's about to learn what 'scope creep' really feels like." |
| Downtime risk | "A failed install at one site is a support ticket. A failed install at 200 sites is a board conversation." |

---

## How These Layer Into Email Sequences

### 3-Touch Sequence (Full Model)

```
EMAIL 1 — Day 0 (Icebreaker + Pain Point)
Subject: {first_name} — quick question

{icebreaker}

{pain_point}

[Light CTA — resource offer or quick call]

— {sender}
```

```
EMAIL 2 — Day 3 (Poke the Bear)
Subject: Re: {first_name} — quick question

{poke_the_bear}

[Proof points + low-friction CTA]

— {sender}
```

```
EMAIL 3 — Day 7 (Breakup / Value Add)
Subject: Re: quick question

[Final touch — breakup frame or value-add resource]

— {sender}
```

### 2-Touch Sequence (Praecipio Model)

```
EMAIL 1 — Day 0 (Poke the Bear w/ Icebreaker)
Subject: {first_name} — honest question

{icebreaker}

[Static poke-the-bear body — challenges status quo]
[Value offer before CTA]

— {sender}
```

```
EMAIL 2 — Day 3 (Pain Point Follow-up)
Subject: Re: {first_name} — honest question

Circling back — no pressure either way.

{pain_point}

[Proof points + low-friction CTA]

— {sender}
```

### Event-Based Sequence (Exol/ShopTalk Model)

```
EMAIL 1 — Pre-Event
Subject: ShopTalk + {company_name} fulfillment

{icebreaker}

{pain_point}

We're heading to ShopTalk too — would a 15-min conversation on the expo floor be worth it?

— {sender}
```

```
EMAIL 2 — Follow-up (Non-Responders)
Subject: re: ShopTalk

{poke_the_bear}

Happy to share how brands in your space are solving this — grab 15 min at the show?

— {sender}
```

---

## Writing Your Own Research Prompt

When you're building a new campaign and need to generate these variables, here's the prompt structure to follow.

### Prompt Template

```
You are a [role] researching [target type] for [your company/partner].
[1-2 sentences about what your company does — enough context for the AI to write relevant outputs.]

You are researching: {company_name} ({domain})
[Any other input fields: industry, employee count, LinkedIn URL, etc.]

RESEARCH INSTRUCTIONS:

Visit {domain} and gather:
- [What to look for — products, channels, tech stack, recent news]
- [Industry-specific signals relevant to your offering]

Then produce EXACTLY [2 or 3] outputs. Each must be 1-2 sentences max.
Write in second person ("you" / "your").
Do not use [your company name] in any output.

---

OUTPUT 1 — ICEBREAKER
[Icebreaker rules from above]
[Sources to pull from, in priority order]
Format: 1-2 sentences. Conversational, not sycophantic.
Example: "[A real example from your vertical]"

---

OUTPUT 2 — PAIN POINT
[Pain point rules from above]
[Bucket-specific pain mapping if applicable]
Format: A short statement that names the pain without offering a solution.
Example: "[A real example from your vertical]"

---

OUTPUT 3 — POKE THE BEAR (if using 3-variable model)
[Poke the bear rules from above]
Format: 1-2 sentences. Slightly edgy. Should make the reader pause.
Example: "[A real example from your vertical]"

---

Return your response in EXACTLY this format:

Icebreaker: [your output]
Pain Point: [your output]
Poke the Bear: [your output]
```

### Prompt Design Principles

1. **Embed the email bodies** in the prompt (as context, not output). The AI writes better variables when it knows exactly where they'll land.
2. **Give bucket-specific pain maps** when your ICP spans multiple verticals. Don't make the AI guess which pains matter — tell it.
3. **Include real examples** for each output. The AI calibrates its tone and specificity to your examples.
4. **Set the "do NOT fabricate" rule explicitly.** Without it, the AI will invent plausible-sounding details.
5. **Define a fallback hierarchy**: LinkedIn first, then domain, then role-based inference. Always flag low-confidence outputs.

---

## Quality Control Checklist

Before deploying any batch of generated variables, spot-check 20-30 outputs:

- [ ] **Icebreakers** reference real, verifiable details (not fabricated milestones or news)
- [ ] **Pain points** are specific to the company's actual products/channels/industry — not generic
- [ ] **Poke the bears** are specific to the company's segment/bucket — not interchangeable across all targets
- [ ] **No outputs mention your company name**, product name, or solution — variables are problem-only
- [ ] **Tone reads as peer-to-peer**, not vendor pitch or sales script
- [ ] **Each variable makes sense in its email position** — read the full email with the variable inserted
- [ ] **Low-confidence outputs are flagged** and routed to manual review
- [ ] **Nothing is fabricated** — if the AI couldn't find a real signal, it should say so

---

## Quick Reference: Partner Pain Point Libraries

Use these when building prompts for specific partners. Map your poke-the-bear and pain-point outputs to these known pressures.

### Exol (GreenBox) — Warehouse-as-a-Service

| Pain Point | Bucket | Signal to Look For |
|------------|--------|-------------------|
| Manual labor can't scale during peaks | F&B, CPG | Hiring fulfillment roles, negative 3PL reviews |
| OTIF chargebacks from retail partners | CPG, F&B | Retail-facing brands with Walmart/Target exposure |
| Can't justify $100M+ CapEx for automation | CPG, Retail | "Exploring automation" signals, no owned facilities |
| Black box 3PL — no visibility into inventory | All | Complaints about 3PL reporting, seeking visibility tools |
| WISMO tickets crushing customer experience | Retail, DTC | Shopify stores, high return rates, support tool usage |

### Praecipio — Atlassian Platinum Partner

| Pain Point | Service Fit | Signal to Look For |
|------------|------------|-------------------|
| Atlassian DC end-of-support / forced migration | Cloud Migration | Running Data Center, no cloud footprint |
| Tool sprawl across teams | Professional Services | Multiple PM or ITSM platforms visible |
| Failed or stalled Atlassian rollout | Managed Services | Atlassian admin job postings, incomplete implementations |
| ServiceNow contract renewal window | ITSM | ServiceNow in tech stack + renewal timing |
| New CIO/CTO in first 90 days | Multiple | Recent leadership hire visible on LinkedIn |

### Connext — Multi-Site Tech Deployment

| Pain Point | Solution Play | Signal to Look For |
|------------|--------------|-------------------|
| Can't deploy new tech across 100+ sites fast enough | National Deployment | Store modernization announcements, rollout RFPs |
| Refresh cycles creating recurring project chaos | Managed Services (ARR) | Public remodel programs, tech upgrade mentions |
| Lean IT team stretched across national footprint | TaaS / Smart Hands | IT layoffs, "return to core" signals |
| Failed installs causing revenue-impacting downtime | First-Visit Success | Negative reviews mentioning outages, POS failures |
| Inconsistent site experiences, rework, second truck rolls | Staging & Logistics | Multiple vendor contracts, standardization complaints |

### Elauwit — Multifamily WiFi/NaaS

| Pain Point | Campaign Type | Signal to Look For |
|------------|--------------|-------------------|
| Resident WiFi complaints driving churn | NaaS | Properties with 200+ units, resident review sites |
| Bulk WiFi contract expiration | Quote the Switch | Contract renewal windows, outdated ISP partnerships |
| Revenue opportunity from managed WiFi as amenity | Managed WiFi | Class A properties, amenity-focused marketing |
| Network infrastructure aging out | NaaS | Properties built 10+ years ago, no recent tech upgrades |

---

## Feeding This to Your Own System

If you're feeding this doc to an AI assistant or building your own prompt pipeline:

1. **Start with the pain point library** for your partner/vertical. This is the foundation.
2. **Copy the prompt template** from the "Writing Your Own Research Prompt" section and fill in your specifics.
3. **Include 2-3 real examples** per variable — the examples set the quality bar.
4. **Embed your email bodies** in the prompt so the AI knows the insertion context.
5. **Run on 5-10 test rows first**, manually review, then scale.
6. **Set up the QC checklist** as a gate before any batch goes live.

The goal is always the same: every email should feel like someone actually looked at the company, not like it came from a template. The variables do the heavy lifting — the static email body provides the structure.
