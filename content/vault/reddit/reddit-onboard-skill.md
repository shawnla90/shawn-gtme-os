---
title: The reddit-onboard skill
description: Build a personalized Reddit onboarding doc for a new signup, grounded in their real product data, and push it to Notion. Routes them through the public playbook instead of re-explaining it, with a fact-check gate born from real shipped mistakes.
source: ~/.claude/skills/reddit-onboard/SKILL.md
updated: 2026-08-06
order: 7
---

# reddit-onboard — their route through the playbook, from their real data

## What this is

The public playbook at shawnos.ai/reddit is the method. This skill builds the other half for a new signup: a personalized Notion doc that says what to read first, what their real data shows, and what applies to their market. It never re-explains the playbook; it links into it with deep anchors.

## The pipeline

1. **Pull their real record** from the primary signup store, never an enrichment table (enrichment providers routinely miss small operators, and a workflow keyed on enrichment will claim a real signup does not exist).
2. **Read their raw event stream before forming any opinion.** The goal is finding the moment the product worked for them; that moment opens the doc.
3. **Suggest rings, never verdicts.** Practitioner subs they already track are useful for reading competitors; the suggested second ring is where their buyers talk: buyer's trade, then the business layer, then local only if geography is a real advantage.
4. **Write short, link deep.** Their result first, their rings, a reading order with anchors, next experiments.
5. **Push to Notion** with stable URLs (re-publish in place so a shared link never breaks).

## The fact-check gate

Every rule maps to a claim that shipped once and was false:

- Every number traces to a query. If a database knows a number, generate it, never type it.
- Behavioral claims come from raw events, not derived columns. One user's summary row implied a broken setup; the raw stream showed their first result arrived 19 minutes after they configured it.
- A narrow proxy never proves a broad claim.
- Platform mechanics get attributed or cut.
- Describe what works. Never render a verdict on their setup, and never reference anything they would not recognize as their own visible result.

## Where it lives publicly

The public variant ships in the ClearboxGTM repo (github.com/shawnla90/ClearboxGTM) under skills/reddit-onboard, next to the offer-pack skill, the engage loop, and the agency package.
