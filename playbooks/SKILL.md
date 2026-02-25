# Playbooks — Instructional Content Extraction

> **Owner**: Shawn Tenam
> **Purpose**: Sanitized, teachable versions of real GTM workflows — extracted from partner operations, stripped of proprietary details, and ready to publish on theGTMOS.ai or feed to content pipelines.
> **Location**: `/playbooks/` (top-level, outside of `clients/`)

---

## What This Is

Partner work generates validated workflows every week — research prompts, campaign patterns, enrichment scripts, scoring models. Most of it is proprietary and lives in `clients/partner/`. But the **patterns** behind those workflows are universally teachable.

This folder holds the sanitized, instructional versions. Each playbook is a real workflow that's been:
1. Stripped of partner names, proprietary data, and client-specific details
2. Rewritten as a "how-to" that anyone can follow
3. Structured for website publication (GTMLS terms, How-To guides, or standalone pages)

---

## Folder Structure

```
playbooks/
├── SKILL.md                          ← This file (entry point)
├── extraction-prompt.md              ← The AI prompt that identifies & extracts
├── index.md                          ← Master index of all published playbooks
│
├── personalization/                  ← Variable model, icebreakers, poke the bear
│   └── 3-variable-model.md
│
├── enrichment/                       ← Exa SDK, Clay research, data pipelines
│   ├── exa-icebreaker-search.md
│   ├── exa-signal-detection.md
│   ├── exa-persona-widening.md
│   └── exa-tam-expansion.md
│
├── campaign-patterns/                ← Validated email plays (sanitized)
│   ├── executive-authority-play.md
│   ├── gatekeeper-referral-play.md
│   └── signal-triggered-play.md
│
├── qualification/                    ← ICP, scoring, routing frameworks
│   ├── icp-framework.md
│   ├── lead-scoring-model.md
│   └── persona-hierarchy.md
│
└── infrastructure/                   ← Domain management, deliverability, MCP
    ├── mailbox-rotation.md
    └── mcp-orchestration.md
```

---

## Extraction Rules

When converting a partner workflow to a playbook:

1. **Replace all partner names** with generic labels ("Partner A", "the client", or industry-generic descriptions)
2. **Remove proprietary data**: contact names, company names, domains, revenue figures, unit counts
3. **Keep the pattern**: The framework, decision logic, prompt structure, and quality checks are the value
4. **Add teaching scaffolding**: Explain *why* each step exists, not just *what* it does
5. **Include real output examples**: Sanitize them but keep the quality bar visible
6. **Map to website destination**: Every playbook should know where it'll publish (GTMLS term, How-To page, standalone guide)

---

## Website Destinations

| Playbook Type | Website Location | Format |
|---------------|-----------------|--------|
| Term definitions (e.g., Exa, MCP) | `/knowledge/gtm` (GTMLS) | `GTMTerm` in `gtm-terms.ts` |
| How-to workflows | `/how-to` | How-To Wiki entry |
| Deep-dive guides | Standalone page or blog post | Full page component |
| Code tutorials | `/knowledge/gtm` + code blocks | New `examples` field on terms |

---

## Status

| Playbook | Source | Status | Website Destination |
|----------|--------|--------|-------------------|
| 3-Variable Personalization Model | `docs/HOW-TO-ICEBREAKER-PAIN-POINT-PROMPTS.md` | Draft complete | GTMLS terms + How-To |
| Exa Icebreaker Search | `scripts/exa_icebreaker_enrichment.py` | Source ready | GTMLS "Exa" term + tutorial |
| Exa Signal Detection | `scripts/exa_signal_detection.py` | Source ready | GTMLS "Exa" term + tutorial |
| Exa Persona Widening | `scripts/exa_influencer_widening.py` | Source ready | GTMLS "Exa" term + tutorial |
| Exa TAM Expansion | `scripts/exa_find_similar.py` | Source ready | GTMLS "Exa" term + tutorial |
| Executive Authority Play | `clients/partner/elauwit/prompts/campaign-copy.md` | Needs extraction | Campaign Patterns guide |
| Gatekeeper Referral Play | `clients/partner/elauwit/prompts/campaign-copy.md` | Needs extraction | Campaign Patterns guide |
| Signal-Triggered Play | `clients/partner/exol/workflows/campaign-patterns.md` | Needs extraction | Campaign Patterns guide |
| Lead Scoring (200-pt) | `clients/partner/exol/prompts/lead-scoring.md` | Needs extraction | GTMLS "Scoring" term expansion |
| ICP Framework | Multiple partner `icp.md` files | Needs extraction | GTMLS "ICP" term expansion |
| Mailbox Rotation | `clients/partner/elauwit/workflows/domain-management.md` | Needs extraction | How-To guide |
