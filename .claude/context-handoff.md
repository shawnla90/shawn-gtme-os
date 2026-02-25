# Context Handoff
> Generated: 2026-02-25 afternoon | Machine: MacBook | Session: Playbook skill + GTMLS Sprint 1

## What Was Done This Session

### 1. Icebreaker/Pain Point How-To Guide
- Created `docs/HOW-TO-ICEBREAKER-PAIN-POINT-PROMPTS.md` — full instructional doc on the 3-variable personalization model ({icebreaker}, {poke_the_bear}, {pain_point})
- Rules, real examples from all 4 partners (Partner Gamma, Praecipio, Partner Beta, Partner Alpha), prompt templates, QC checklist
- Team-ready — can be handed to anyone or fed to an AI system

### 2. Playbooks Folder + Extraction Skill
- Created `/playbooks/` — Shawn's personal instructional content workspace, outside of `clients/`
- `playbooks/SKILL.md` — entry point, extraction rules, sanitization guidelines, status tracker
- `playbooks/extraction-prompt.md` — AI prompt that scans partner workflows and identifies what can be repurposed as website content
- `playbooks/index.md` — master index of 12 identified playbooks with priority and destination
- `playbooks/personalization/3-variable-model.md` — first playbook populated (copy of the how-to doc)
- Created subdirs: `enrichment/`, `campaign-patterns/`, `qualification/`, `infrastructure/`

### 3. GTMLS Optimization Plan
- Created `docs/GTMLS-OPTIMIZATION-PLAN.md` — 5-sprint plan to expand the GTM Lexicon
- Covers: new terms, React components (UseCaseBlock, CodeShowcase, ToolIntegrationMap, MCPShowcase), SEO, cross-linking, `/playbooks` website route

### 4. GTMLS Sprint 1 — SHIPPED
- **10 new terms** added to `website/packages/shared/data/gtm-terms.ts`:
  - AI & MCP category: `mcp-server`, `exa`, `smartlead`, `orchestration`, `parallel-agents`
  - Automation & Scripts category: `enrichment-pipeline`, `rate-limiting`, `batch-processing`, `deduplication`, `find-similar`
- **6 existing terms expanded** with Exa use cases and real data:
  - `icebreaker` — added Exa SDK path (73 companies, 150KB research)
  - `poke-the-bear` — added 3-variable model, bucket-specific examples
  - `pain-point-signal` — added signal detection (6 types, 342 hits)
  - `signals` — added full 6-category sweep pattern
  - `enrichment` — added Exa as second enrichment path alongside Clay
  - `scoring` — added 200-point composite model
- **SEO updated** on `website/apps/gtmos/app/knowledge/gtm/page.tsx` — 13 new keywords, updated OG/Twitter descriptions
- **Build verified clean** — TypeScript compiles, Next.js builds, 43 terms across 8 categories

## Current State

- **Git**: branch `main`, commit `99e0809` (fix: remaining blocklist term in CRM import page)
- **Uncommitted changes**:
  - Modified: `website/packages/shared/data/gtm-terms.ts`, `website/apps/gtmos/app/knowledge/gtm/page.tsx`
  - New: `docs/GTMLS-OPTIMIZATION-PLAN.md`, `docs/HOW-TO-ICEBREAKER-PAIN-POINT-PROMPTS.md`, `playbooks/` (entire folder)
- **Blocked on**: nothing — Sprint 1 complete, ready for Sprint 2 or commit+deploy

## Next Steps

1. **Commit + deploy** — the GTMLS changes and playbooks folder are ready to push. Run `/update-github` for safe push.
2. **GTMLS Sprint 2** — build `UseCaseBlock` React component in `website/packages/shared/components/UseCaseBlock.tsx`. Add `useCases` optional field to `GTMTerm` interface. Populate Exa and icebreaker terms with real use case data. See `docs/GTMLS-OPTIMIZATION-PLAN.md` Phase 2 for full spec.
3. **GTMLS Sprint 3** — build `CodeShowcase` component with terminal-styled code blocks. Extract sanitized snippets from `scripts/exa_*.py`. See plan Phase 2 section 2B.
4. **GTMLS Sprint 4** — build `MCPShowcase` and `ToolIntegrationMap` components. Visual tool chain diagrams.
5. **GTMLS Sprint 5** — SEO cross-linking, playbook backlinks on term pages, `/playbooks` website route, HowTo structured data.
6. **Playbook extraction** — run `playbooks/extraction-prompt.md` against the repo to identify additional workflows worth publishing.
7. **Partner Gamma email enrichment** — 280 contacts still need work emails (from previous session handoff).

## Key Decisions Made

- **Playbooks live at `/playbooks/`** — top-level, outside of `clients/`. This is Shawn's personal instructional workspace.
- **Extraction is a skill, not a one-time task** — `playbooks/extraction-prompt.md` is a repeatable scan prompt meant to run after every major partner engagement.
- **GTMLS expansion follows a 5-sprint plan** — data first (Sprint 1, done), then components (Sprints 2-4), then SEO (Sprint 5).
- **Every new GTMLS term must reference real work** — no hypothetical examples. Exa terms reference 73-company enrichment. Scoring references 200-point composite. This is the differentiator.
- **New terms written in Shawn's voice** — lowercase, first-person, builder perspective, same tone as existing 33 terms.

## Files to Read First

1. `docs/GTMLS-OPTIMIZATION-PLAN.md` — full 5-sprint plan with component specs and file change list
2. `website/packages/shared/data/gtm-terms.ts` — the expanded data file (43 terms, 8 categories)
3. `playbooks/SKILL.md` — playbook extraction skill entry point
4. `docs/HOW-TO-ICEBREAKER-PAIN-POINT-PROMPTS.md` — the team-ready instructional doc
5. `website/apps/gtmos/app/knowledge/[term]/page.tsx` — term detail page (needs playbook backlinks in Sprint 5)
