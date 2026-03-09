---
name: web-reveal
description: Generate full Clay web reveal qualification flow for a partner. Creates 3 prompts (company, persona, routing) + email waterfall + domain routing. Use when the user types /webreveal <partner>.
---

# Web Reveal Workflow

## Trigger

`/webreveal <partner>`

## What This Produces

1. **Company Qualification Prompt** - evaluates company against partner ICP
2. **Persona Qualification Prompt** - evaluates job title against buyer personas
3. **Routing Decision Prompt** - combines both into route/skip/review
4. **Email Waterfall** - enrichment provider order (Apollo > Hunter > Clearbit > RocketReach > Prospeo > Dropcontact)
5. **Domain Routing** - Google MX -> Instantly, non-Google -> HeyReach (LinkedIn)

## Workflow

1. **Load research**: `clients/partner/<partner>/research/icp.md` + `personas.md` + existing `prompts/web-reveal-qualification.md`
2. **Company prompt**: Role/context -> qualification criteria from ICP -> scoring with PRIMARY GATE -> JSON array output -> input fields at bottom
3. **Persona prompt**: Valid persona tiers from personas.md -> tier matching rules -> JSON output
4. **Routing prompt**: Combines company + persona results -> routing rules (qualified+matched=outreach, qualified+unmatched=enrich company, needs_research+matched=manual review, not_qualified=skip)
5. **Save** to `clients/partner/<partner>/prompts/web-reveal-qualification.md`
6. **Summary**: partner, prompts generated, primary gate, routing rule

## Prompt Formatting Rules

All prompts: inputs at bottom, JSON array output, structure is Role -> Criteria -> Scoring -> Output format -> Input fields.
