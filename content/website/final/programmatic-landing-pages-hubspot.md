---
title: "A HubSpot CMS Engine I Pulled Out of the Archive"
date: "2026-05-21"
excerpt: "Six to ten minutes for fifty personalized DRAFT landing pages in your HubSpot portal. Built originally inside a HubSpot agency. Rebuilt this week as an open-source starter on Claude Code Opus 4.7. Brief, subagent columns, Pages API. Everything in git."
category: "plays"
featured: true
---

**tl;dr:** I rebuilt a HubSpot CMS landing-page engine I originally shipped inside an agency, this time as an open-source starter in the GTM Coding Agent repo. Markdown brief, Claude subagent columns, HubSpot Pages API v3. Per-account quality at Opus 4.7. Per-account cost in the dimes on BYOK, zero on Max via the `claude` CLI. DRAFT-first, slug-collision-safe, idempotent re-runs.

## Why this one came back out of the archive

Three weeks ago I was in a thread inside the Slack Claude Code challenge community, talking with Ben about programmatic content workflows. Someone mentioned they were using Claude to design HubSpot landing pages directly. That sentence made me sit up. I had a version of this engine that worked at scale, but it was sitting in an old agency repo that I had not touched since leaving.

The original version was built for a HubSpot agency I worked at before going independent. It generated personalized landing pages from HubSpot CMS, programmatically, for ABM cohorts and nurture revisitors. The visual layer was a single HubL template. The personalization layer was a research-then-generate pipeline. The publishing layer was the Pages API.

When I left the agency, the engine stayed. The pattern stayed in my head. The Slack conversation made me pull the pattern back out and rebuild it on Claude Code Opus 4.7. Different machine. Different model. Same pattern. This time it lives in a public starter folder anyone can fork.

## What Level Up GTM is, briefly, before the play

If this is your first time reading the newsletter: Level Up GTM is a growing weekly drop where I share the GTM coding agents I have built or am building. A live manifest of workflows. Raw. You can learn from them, fork them, ask questions. Do not expect perfection. Do not expect an automated service that replaces anybody. That is not what this is.

I do not use Claude Code to replace you. I do not use it to write your content for you. It helps you distribute, think, and orchestrate. That is the signature.

Now the play.

## The shape of the engine

Three artifacts. Three review surfaces.

```
1. BRIEF (input)
   A markdown file with YAML frontmatter and variable placeholders. Lives
   either as a local file in your repo or as a Blog Post in your HubSpot
   CMS under a "Brief" category. The marketing lead edits this without
   touching code.

2. COLUMNS (enrichment)
   One Claude subagent prompt file per insight. Five ship with the
   starter: pain points, tech stack, hook angle, ICP score, hero copy.
   Each returns one JSON object matching a declared schema.

3. PUBLISH (output)
   HubSpot Pages API v3. Private app token, one scope (`content`), POST
   /cms/v3/pages/landing-pages with state DRAFT. Slug collisions auto-
   retry with -v2, -v3. Nothing goes live without a separate publish
   call.
```

The model tier per row is the part most "AI for marketing" tools cannot match. They have to amortize model cost across thousands of customers. They cannot afford Opus 4.7 per row, so they default to mid-tier models. You are working a 50-500 account list. You can afford the top tier. Per-account quality goes up by a step function. The wedge is structural.

Per-account cost on a fifty-row batch is roughly $0.12-$0.20 on BYOK, zero metered tokens on Claude Code Max via the `claude` CLI subprocess. The starter ships both paths.

## What changes when the chapter ships

People who already have HubSpot stop having to choose between drag-and-drop and not personalizing. The engine sits next to your existing stack and writes to it. The marketing lead still owns the brief. The designer still owns the HubL template. The GTM engineer owns the column prompts. Three roles, three review surfaces, all in git.

When the RevOps lead asks why the Q3 messaging is different from Q2, the answer is a git log entry. That is the surface no SaaS dashboard gives you.

## The worked example

```bash
cd starters/hubspot-landing-engine
cp .env.example .env
# Edit: paste HUBSPOT_PRIVATE_APP_TOKEN and HUBSPOT_TEMPLATE_PATH

# Upload the bundled HubL template once
hs init
hs upload hubspot-template /landing-engine

# Real run on 3 sample accounts, DRAFT state
python scripts/pipeline.py --step all --limit 3 --state DRAFT
```

Output in the terminal:

```
[pipeline] loaded brief: abm-mid-market-saas (abm-q2-mid-market, 5 columns)
[pipeline] loaded 3 accounts from targets/accounts.csv.example
[enrich] Stripe (stripe.com)
  + pain-points, hook-angle, hero-copy, tech-stack, icp-score: ok
[enrich] Linear (linear.app)
  ...
[publish] 1/3 -> LP - Stripe - abm-q2-mid-market
[publish] 2/3 -> LP - Linear - abm-q2-mid-market
[publish] 3/3 -> LP - Vercel - abm-q2-mid-market
```

Three DRAFT landing pages now exist in your portal under Marketing -> Landing Pages. Each references the account by name. Each leads with a research-anchored hero block. Each links to the CTA from your brief.

Re-runs are idempotent. The starter caches every column output by `(domain, column_slug)` in `cache.db`. Editing a column prompt and re-running with `--force` re-enriches without losing the others.

## One caveat to name directly

Anthropic plan terms may shift around mid-June. The starter accepts an `ANTHROPIC_API_KEY` and a `--use-sdk` flag specifically so the same pipeline keeps running on BYOK if Max-plan subprocess economics change. The wedge - top-tier model per row on a controlled list - survives because the asymmetry is structural, not contingent on one economic shape.

## frequently asked questions

**Does this work with Webflow, WordPress, or Ghost?**
The publishing layer is HubSpot-specific. The brief format, the columns, and the enrichment pipeline are not. To port to another CMS, replace `_publish_pages.py` with a writer for that platform's API and update `_generate_pages.py::build_layout_sections`. Brief format and column files stay the same.

**Do I need Claude Code Max?**
No. Two paths ship in the starter: the `claude` CLI (Max subscription, zero metered tokens) and the official `anthropic` Python SDK (API key). `--use-sdk` toggles between them.

**What HubSpot scope do I need?**
One: `content`. Umbrella scope for CMS pages. Set it on a private app, copy the token to `.env`, you are done. The chapter walks through the steps.

**How do I keep pages from going live by accident?**
The publisher caps state at `HUBSPOT_PAGE_STATE_CAP` in `.env`, default DRAFT. To actually publish you raise the cap AND pass `--state PUBLISHED_OR_SCHEDULED` on the CLI. Two-key gate.

## The repo

github.com/shawnla90/gtm-coding-agent

Chapter 16 in `chapters/`. Starter in `starters/hubspot-landing-engine/`. Bundled HubL template runs against any portal with CMS Hub. MIT licensed.

If you fork it and ship something, drop a note. If you wire it to a different CMS, even better. The next Level Up GTM drop is whichever angle gets the most "go deeper on this" comments.

---

*Building this stuff daily at shawnos.ai. If you want me to build the engine for you, shawn@leadalchemy.co.*
