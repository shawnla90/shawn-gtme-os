---
name: web-reveal-workflow
description: Generate the full Clay web reveal qualification flow for a partner. Creates 3 prompts (company qualification, persona qualification, routing decision) plus email waterfall and domain-based routing (Instantly for Google, HeyReach for non-Google). Use when the user types /webreveal or "web reveal workflow start" with a partner name.
---

# Web Reveal Workflow

## Trigger

User says `/webreveal <partner>` or `web reveal workflow start <partner>`.

## What This Produces

A complete Clay web reveal flow for a specific partner, consisting of:

1. **Company Qualification Prompt** — evaluates company against partner ICP
2. **Persona Qualification Prompt** — evaluates job title against partner buyer personas
3. **Routing Decision Prompt** — combines both results into a route/skip/review decision
4. **Email Waterfall Strategy** — order of enrichment providers for finding email
5. **Domain Routing Rule** — Google MX → Instantly, non-Google → HeyReach

All prompts follow the prompt-formatting rule: inputs at the bottom, JSON array output.

## Workflow

### Step 1: Load Partner Research

Read the partner's research files:

```
clients/partner/<partner>/research/icp.md       → company qualification criteria
clients/partner/<partner>/research/personas.md   → persona tiers and Clay queries
clients/partner/<partner>/prompts/web-reveal-qualification.md  → existing prompts (if any)
```

If `web-reveal-qualification.md` already has all 3 prompts populated, show them and ask if the user wants to regenerate or modify.

### Step 2: Generate Company Qualification Prompt

Build from the partner's `icp.md`. Structure:

```
You are a B2B sales qualification analyst for {{Partner Name}}, {{one-line description}}.

## Qualification Criteria
{{Numbered list from icp.md qualification criteria}}

## Scoring
{{Scoring table from icp.md — identify the PRIMARY GATE}}

- QUALIFIED: {{threshold}} (must include {{primary gate}})
- NEEDS_RESEARCH: {{range}}
- NOT_QUALIFIED: {{threshold}} OR {{disqualifiers}}

## Output
Return a JSON array with the following fields:
[{"company_qualified": "QUALIFIED|NOT_QUALIFIED|NEEDS_RESEARCH", "score": 0, "service_fit": "{{partner service categories}}", "confidence": "High|Medium|Low", "reasoning": "1-2 sentences", "next_step": "enrich contacts|validate {{primary gate}}|skip|flag for manual review"}]

## Input
- Company name: {company_name}
- Domain: {domain}
- Industry: {industry}
- Employee count: {employee_count}
- Revenue (if available): {revenue}
- Tech stack (if available): {tech_stack}
```

### Step 3: Generate Persona Qualification Prompt

Build from the partner's `personas.md`. Structure:

```
You are qualifying a contact's job title to determine if they are a valid buyer persona for {{Partner Name}}.

## Valid Persona Tiers
{{Copy tiers from personas.md with all titles}}

## Rules
- The contact's title must match or closely align with one of the tiers above
- {{Tier priority notes from personas.md}}
- If the title does not match any tier, mark as NOT_MATCHED

## Output
Return a JSON array with the following fields:
[{"persona_qualified": "MATCHED|NOT_MATCHED", "tier": "1|2|3|4|5|none", "tier_name": "{{tier names}}", "outreach_priority": "primary|secondary|champion|not_target", "reasoning": "1 sentence"}]

## Input
- Job title: {job_title}
- Department (if available): {department}
- Seniority (if available): {seniority}
```

### Step 4: Generate Routing Decision Prompt

This prompt takes the outputs of steps 2 and 3:

```
You are making the final qualification and routing decision for a web reveal lead for {{Partner Name}}.

## Routing Rules
- QUALIFIED company + MATCHED persona → route to outreach
- QUALIFIED company + NOT_MATCHED persona → skip contact, flag company for enrichment
- NEEDS_RESEARCH company + MATCHED persona → flag for manual review
- NOT_QUALIFIED company → skip entirely

## Outreach Priority
- Tier 1-2 + QUALIFIED + High confidence → high
- Tier 3-4 + QUALIFIED → medium
- Tier 5 + QUALIFIED → low
- NEEDS_RESEARCH → review

## Output
Return a JSON array with the following fields:
[{"route": "outreach|enrich_company|manual_review|skip", "priority": "high|medium|low|review|none", "company_result": "...", "persona_result": "...", "persona_tier": "...", "service_fit": "...", "reasoning": "1-2 sentences"}]

## Input
- Company qualification result: {company_qualified}
- Company score: {company_score}
- Company service fit: {service_fit}
- Company reasoning: {company_reasoning}
- Persona qualification result: {persona_qualified}
- Persona tier: {persona_tier}
- Persona outreach priority: {persona_outreach_priority}
- Contact email: {email}
- Contact name: {contact_name}
```

### Step 5: Email Waterfall Strategy

After qualification, append the waterfall order for finding email:

```markdown
## Email Waterfall (Clay)

Order of enrichment providers:
1. Apollo
2. Hunter.io
3. Clearbit / Breeze
4. RocketReach
5. Prospeo
6. Dropcontact

Accept first valid result. If no email found after waterfall, route to HeyReach (LinkedIn only).
```

Adjust waterfall providers based on what the user has available. Ask if unsure.

### Step 6: Domain Routing Rule

```markdown
## Email Domain Routing

| Email MX Provider | Route To | Reason |
|-------------------|----------|--------|
| Google Workspace (Google MX records) | **Instantly** | Google-only sending infrastructure purchased |
| Non-Google (Microsoft 365, Exchange, other) | **HeyReach** (LinkedIn) | Cannot deliver reliably to non-Google from our Instantly setup |
| No email found | **HeyReach** (LinkedIn) | Fallback to LinkedIn outreach |

Clay checks MX records on the email domain to determine provider.
```

### Step 7: Save to Partner

Write all prompts to the partner's `prompts/web-reveal-qualification.md` file:

```
clients/partner/<partner>/prompts/web-reveal-qualification.md
```

Format: all 3 prompts in one file with `---` separators, plus the email waterfall and domain routing sections at the bottom.

### Step 8: Summary

Print:
- Partner name
- 3 prompts generated (company, persona, routing)
- Primary gate identified
- Email routing rule
- Any TODOs remaining

> **FUTURE TODO**: Add n8n automation step to trigger this flow automatically when web reveal fires. Currently manual Clay setup. When n8n integration is ready, this skill should generate the n8n workflow JSON alongside the prompts.

## Prompt Formatting Rules

All prompts MUST follow `.cursor/rules/prompt-formatting.md`:
- Inputs always at the bottom
- Always instruct JSON array output
- Structure: Role/Context → Criteria → Scoring → Output format → Input fields

## Partner-Specific Examples

- **Praecipio**: Primary gate = Atlassian footprint. See `clients/partner/praecipio/prompts/web-reveal-qualification.md`
- **Elauwit**: Primary gate = portfolio size (1,000-20,000 units). See `clients/partner/elauwit/prompts/web-reveal-qualification.md`
- **Connext**: Primary gate = 100+ physical locations. See `clients/partner/connext/prompts/web-reveal-qualification.md`
