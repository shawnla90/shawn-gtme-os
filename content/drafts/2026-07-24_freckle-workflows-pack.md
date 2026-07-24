---
pack: freckle-cli-workflows
date: 2026-07-24
status: drafted, needs receipts before dispatch
pillar: gtm-engineering / release-reaction
---

# Pack: three workflows through the Freckle CLI

## The through-line

Enrichment was the last thing in the stack that made me leave the terminal. Freckle
shipped a CLI, Andy gave us first dibs, and I ran it against Clearbox on three jobs.
The tool stops being a destination and becomes a step.

The repeated idea across every piece: **gate before you spend.** The reveal is the cheap
part in all three workflows. The filtering and the restraint are what turn it into
pipeline instead of a list nobody calls.

## The three workflows

**01. Signups out of Convex.** Clearbox runs on Convex, so a signup lands as a row the
second someone creates an account. Pull new rows, gate on domain type, enrich company
domain first and person second, write the profile back next to the signup row, render a
three-sentence brief into Notion before the call. The point is showing up on Thursday
with something they can use whether or not they buy.

**02. De-masking site traffic.** Resolve anonymous session to company, filter on page
path (pricing and docs stay, homepage bounces drop), enrich the survivors, score ICP fit
against the page signal, route only the top slice to a human.

**03. AI answer citations (GEO).** Build a query set from real buyer questions, capture
the answers and the sources they cite, extract the domains behind those citations,
enrich them, then diff which sources repeat and which ones we are absent from. Output is
a ranked list of where to show up, derived from what the models actually cite.

**Connective tissue:** Connect pushes run output into Notion so the workflow lives where
the team already reads. Enrichment hours price the work rather than the row, which
changes how you sequence and batch. All three ship as skill files in GTM Coding Agents.

## Assets

| piece | file |
|---|---|
| Blog (anchor) | `content/blog/2026-07-24_freckle-cli-three-workflows.md` |
| LinkedIn newsletter + feed teaser | `content/linkedin/drafts/2026-07-24_freckle-cli-workflows-newsletter.md` |
| Reddit (r/GTMbuilders + 2 alts) | `content/reddit/drafts/2026-07-24_freckle-cli-three-workflows.md` |
| X thread (9) + 4 singles | `content/x/drafts/2026-07-24_freckle-cli-workflows-thread.md` |
| Carousel, 8 slides SVG | `content/images/freckle-workflows/` |
| Clearbox runbook | `clearbox-gtm: gtm/workflows/freckle-cli-workflows.md` |

## Sequence

1. Blog goes up first, it's the link target for everything else.
2. LinkedIn newsletter same day, carousel attached, blog link in comments.
3. Reddit next day. No link in the body, link in comments only if mods allow.
4. X thread 1-2 days after LinkedIn. Singles spaced out across the following week.
5. LinkedIn feed teaser drives back to the newsletter once it's live.

## Before dispatch: fill these in

The pack is written around real structure but the exact commands and numbers are on the
Mac Mini, not in either repo. Every one is marked `[[like this]]` in the drafts.

- `[[exact freckle CLI command + flags]]` for the enrich step
- `[[exact convex query/export command]]` for the signup pull
- `[[de-masking data source / command]]`
- `[[capture method]]` for the GEO answer runs
- `[[confirm enrichment-hours definition]]` before the pricing-unit section publishes
- `[[final starter paths]]` in GTM Coding Agents once the branch merges
- `[[screenshot]]` of the gate output for X single A
- Real receipts wherever a number would land harder than a description: rows processed,
  match rate on company vs personal domains, hours consumed per run

Nothing in the drafts invents a metric. If a number doesn't get filled in, the sentence
still reads, it just reads qualitatively.

## Voice check

Run before dispatch:

- `skills/tier-1-voice-dna/anti-slop.md` (done on draft: no em dashes, no narrator
  setups, no triple-parallel, no quoted phrases, capital I throughout)
- `skills/tier-3-content-ops/pre-publish-checklist.md`
- `skills/ai-pattern-detection/` for the deep 29-pattern scan

## Safety

Freckle and Andy are referenced positively, with permission implied by the early access.
No client or partner names anywhere. Clay appears once in the blog as the category
reference, not as a target. Person-level identification is explicitly hedged in the blog
FAQ, which is the right call given de-masking is the subject.
