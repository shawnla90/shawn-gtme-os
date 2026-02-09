---
name: gtme-marketing-voice
version: "4.0"
description: Marketing voice and content evaluation for GTME/builder-focused content. Built from analysis of 24 real LinkedIn posts. Checks for authenticity, substance, anti-AI-slop patterns, and brand safety for Shawn's Lead Alchemy brand.
---

# GTME Marketing Voice & Content Evaluation

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
| [`core-voice.md`](skills/tier-1-voice-dna/core-voice.md) | SDR origin, priority hierarchy, voice characteristics, voice modes, builder code, identity anchors, tool stack, audience, strengths, risks |
| [`anti-slop.md`](skills/tier-1-voice-dna/anti-slop.md) | 14 patterns (10 critical + 4 context-dependent) + your natural patterns whitelist |
| [`safety-filters.md`](skills/tier-1-voice-dna/safety-filters.md) | Pattern vs. person test |

### Standalone Skills

| File | What it covers |
|------|---------------|
| [`ai-pattern-detection/SKILL.md`](skills/ai-pattern-detection/SKILL.md) | Full 29-flag AI content detection system. Runs as secondary deep scan. |

### Tier 2: Context Playbooks (how voice adapts - grows over time)

Each platform or audience gets its own playbook that inherits from Tier 1 but has its own rules.

| File | Status | What it covers |
|------|--------|---------------|
| [`linkedin.md`](skills/tier-2-context-playbooks/linkedin.md) | Active | 5 content pillars, emoji system, sign-off style, CTA types, comment strategy |
| [`client-comms.md`](skills/tier-2-context-playbooks/client-comms.md) | Active | Email/deck/recap tone, diagnosis-impact-next structure |
| [`internal-team.md`](skills/tier-2-context-playbooks/internal-team.md) | Active | Slack/Notion operational updates |
| [`x-twitter.md`](skills/tier-2-context-playbooks/x-twitter.md) | Stub | Thread format, migration from LinkedIn plays |
| [`youtube.md`](skills/tier-2-context-playbooks/youtube.md) | Stub | Expanded walkthroughs, episode format |
| [`tiktok.md`](skills/tier-2-context-playbooks/tiktok.md) | Stub | Short-form clips, 30-sec workflow moments |

### Tier 3: Content Operations (what you do with the voice - used per task)

**Checklists & Protocols:**

| File | What it covers |
|------|---------------|
| [`substance-requirements.md`](skills/tier-3-content-ops/substance-requirements.md) | What qualifies as substance, checklist |
| [`pre-publish-checklist.md`](skills/tier-3-content-ops/pre-publish-checklist.md) | Structure, substance, safety, voice checks |
| [`improvement-protocol.md`](skills/tier-3-content-ops/improvement-protocol.md) | 6-step draft improvement process |
| [`pitfalls.md`](skills/tier-3-content-ops/pitfalls.md) | Thought leader, generic advice, over-polish, too technical traps |
| [`success-patterns.md`](skills/tier-3-content-ops/success-patterns.md) | What works vs. what doesn't from your best content |

**Content Pillars** (templates for each post type, built from real post analysis):

| File | Pillar | Performance |
|------|--------|-------------|
| [`plays-series.md`](skills/tier-3-content-ops/pillars/plays-series.md) | "GTM plays I use every day" numbered series | Highest |
| [`building-sharing.md`](skills/tier-3-content-ops/pillars/building-sharing.md) | Origin stories, tool journeys, behind-the-scenes | High |
| [`gtm-memes.md`](skills/tier-3-content-ops/pillars/gtm-memes.md) | Pop culture + GTM pain points, always a lesson underneath | High |
| [`release-reactions.md`](skills/tier-3-content-ops/pillars/release-reactions.md) | First-hand builder takes on new tool features | Medium-High |
| [`skill-system-shares.md`](skills/tier-3-content-ops/pillars/skill-system-shares.md) | Sharing frameworks, skill files, validation systems | High |

### Workflows

| File | What it covers |
|------|---------------|
| [`plays-index.md`](workflows/plays-index.md) | Master index of all 15 GTM plays + unnumbered canonical workflows, tool frequency, repurpose potential |

---

## How Commands Use This Tree

Commands compose pieces from each tier based on what they need:

- **`/review`** loads Tier 1 (all) + relevant Tier 2 context + pre-publish checklist + ai-pattern-detection
- **`/linkedin`** loads Tier 1 (all) + LinkedIn playbook + chosen pillar template
- **`/slop-check`** loads anti-slop.md for fast check, or ai-pattern-detection for full 29-flag scan
- **`/client-update`** loads Tier 1 core-voice + client-comms playbook
- **`/new-play`** loads plays-series pillar + plays-index + LinkedIn playbook
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
