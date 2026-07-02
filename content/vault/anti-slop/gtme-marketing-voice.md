---
title: GTME Marketing Voice & Content Evaluation
description: The root skill that orchestrates the whole voice system — a 3-tier skill tree (voice DNA, context playbooks, content ops) built from analysis of 24 real LinkedIn posts, with command composition patterns.
source: SKILL.md (gtme-marketing-voice, repo root)
updated: 2026-07-02
order: 3
---

# GTME Marketing Voice & Content Evaluation

Marketing voice and content evaluation for GTME/builder-focused content. Built from analysis of 24 real LinkedIn posts. Checks for authenticity, substance, anti-AI-slop patterns, and brand safety.

## The Core Problem This Solves

You're a **builder-first GTME with ADHD pattern recognition** who creates content that performs well when it's authentic and tactical. Your voice is an asset (casual, competent, technical, builder energy), but you have specific risks:

1. **AI slop detection**: You can spot it in others but sometimes miss it in your drafts
2. **Over-optimization**: Can spend hours perfecting posts instead of shipping
3. **Substance vs. performance**: Risk of sounding like content instead of a person
4. **Technical depth calibration**: Finding the right level for your mixed audience

**This skill helps you create authentic, high-performing content that builds your GTME brand while staying true to your builder voice.**

---

## Skill Tree

### Tier 1: Voice DNA (who you are - rarely changes)

These are your foundation. Every command, every platform, every context references these.

| File | What it covers |
|------|---------------|
| `core-voice.md` | SDR origin, priority hierarchy, voice characteristics, voice modes, builder code, identity anchors, tool stack, audience, strengths, risks |
| `anti-slop-core.md` | 14 patterns (10 critical + 4 context-dependent) + your natural patterns whitelist |
| safety filters (internal) | Pattern vs. person test — critique architectures and approaches, never specific companies or named individuals |

### Standalone Skills

| File | What it covers |
|------|---------------|
| `ai-pattern-detection.md` | Full 29-flag AI content detection system. Runs as secondary deep scan. |

### Tier 2: Context Playbooks (how voice adapts - grows over time)

Each platform or audience gets its own playbook that inherits from Tier 1 but has its own rules.

| File | Status | What it covers |
|------|--------|---------------|
| `linkedin-playbook.md` | Active | 5 content pillars, emoji system, sign-off style, CTA types, comment strategy |
| client-comms playbook | Active | Email/deck/recap tone, diagnosis-impact-next structure |
| internal-team playbook | Active | Slack/Notion operational updates |
| `x-playbook.md` | Active | Thread format, compression rules, cross-posting from LinkedIn |
| youtube playbook | Stub | Expanded walkthroughs, episode format |
| tiktok playbook | Active | Short-form video (TikTok/Reels/Shorts), 16-sec structure, 6 content series, cross-platform distribution |

### Tier 3: Content Operations (what you do with the voice - used per task)

**Checklists & Protocols:**

| File | What it covers |
|------|---------------|
| `substance-requirements.md` | What qualifies as substance, checklist |
| `pre-publish-checklist.md` | Structure, substance, safety, voice checks |
| `improvement-protocol.md` | 6-step draft improvement process |
| `pitfalls.md` | Thought leader, generic advice, over-polish, too technical traps |
| `success-patterns.md` | What works vs. what doesn't from your best content |

**Content Pillars** (templates for each post type, built from real post analysis):

| Pillar | Format | Performance |
|--------|--------|-------------|
| Plays series | "GTM plays I use every day" numbered series | Highest |
| Building & sharing | Origin stories, tool journeys, behind-the-scenes | High |
| GTM memes | Pop culture + GTM pain points, always a lesson underneath | High |
| Release reactions | First-hand builder takes on new tool features | Medium-High |
| Skill/system shares | Sharing frameworks, skill files, validation systems | High |

### Workflows

| File | What it covers |
|------|---------------|
| plays index | Master index of all 16 GTM plays + unnumbered canonical workflows, tool frequency, repurpose potential |
| tiktok index | TikTok series tracking, episode queues, repurpose tracker, content calendar |

---

## How Commands Use This Tree

Commands compose pieces from each tier based on what they need:

- **`/review`** loads Tier 1 (all) + relevant Tier 2 context + pre-publish checklist + ai-pattern-detection
- **`/linkedin`** loads Tier 1 (all) + LinkedIn playbook + chosen pillar template
- **`/slop-check`** loads anti-slop core for fast check, or ai-pattern-detection for full 29-flag scan
- **`/client-update`** loads Tier 1 core-voice + client-comms playbook
- **`/new-play`** loads plays-series pillar + plays index + LinkedIn playbook
- **`/tiktokscript`** loads TikTok playbook + tiktok index + viral-hooks + source material
- **`/finalcopy`** runs final review pass + strips markdown to platform-ready plain text for copy-paste

---

## When to Use This Skill

**Trigger on**:
- Creating LinkedIn posts (any pillar)
- Reviewing content before publishing
- Writing client emails or status updates
- Drafting SOPs or documentation
- Any time you're creating public-facing GTM content
- Brand positioning questions
- "Does this sound like me?" checks
- Planning content for X, YouTube, TikTok expansion

**Output**:
- Evaluated content with specific improvements
- Rewritten content following voice principles
- Risk assessment for brand/business implications
- Pattern recognition about recurring issues
- Substance checks with concrete suggestions
- Pillar identification (which content type is this?)
