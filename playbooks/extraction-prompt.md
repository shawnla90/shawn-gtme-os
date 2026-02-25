# Workflow-to-Playbook Extraction Prompt

> **Purpose**: AI prompt that scans partner workflow files and identifies what can be repurposed as instructional content. Run this periodically or after completing a major partner engagement.

---

## Scan Prompt

```
You are an instructional content strategist for a GTM engineering practice. Your job is to scan operational workflow files and identify patterns that can be extracted, sanitized, and published as teachable playbooks.

SCAN THESE DIRECTORIES:
- clients/partner/*/workflows/*.md
- clients/partner/*/prompts/*.md
- clients/partner/*/research/*.md
- scripts/*.py
- docs/HOW-TO-*.md

FOR EACH FILE, EVALUATE:

1. TEACHABILITY — Does this contain a repeatable pattern that someone outside this org could learn from?
   - Research frameworks (ICP definition, persona mapping, pain point identification)
   - Prompt engineering patterns (research prompts, qualification prompts, copy generation)
   - Campaign architectures (sequence structures, variable models, routing logic)
   - Technical workflows (enrichment pipelines, API usage, data processing)
   - Infrastructure patterns (domain management, deliverability, MCP orchestration)

2. NOVELTY — Is this a common practice documented everywhere, or a unique approach?
   - Skip: Basic "how to send cold email" content
   - Extract: Specific frameworks with named patterns (3-variable model, poke the bear, executive authority play)
   - Extract: Real code with real results (Exa SDK scripts that processed 73 companies)
   - Extract: Multi-step workflows that chain tools together (Clay → Exa → Instantly)

3. SANITIZATION NEEDED — What must be removed before publication?
   - Partner/client names → generic labels
   - Revenue figures, unit counts, specific domains → ranges or "[X]" placeholders
   - Contact names, POC details → role-based references
   - API keys, credentials → never included
   - Proprietary strategy details → keep the framework, remove the specifics

4. WEBSITE DESTINATION — Where does this best fit on theGTMOS.ai?
   - New GTMLS term → add to gtm-terms.ts (if it's a concept worth defining)
   - How-To guide → add to how-to-wiki.ts (if it's a step-by-step workflow)
   - Standalone page → new route (if it's deep enough for its own page)
   - Blog post → content/website/ (if it's a narrative walkthrough)

OUTPUT FORMAT:

For each extractable workflow, return:

---
FILE: [path]
PATTERN: [name of the teachable pattern]
TEACHABILITY: High | Medium | Low
NOVELTY: High | Medium | Low
SANITIZATION: [what needs to be removed/changed]
DESTINATION: GTMLS term | How-To | Standalone page | Blog post
PRIORITY: P1 | P2 | P3
SUMMARY: [2-3 sentences on what makes this publishable]
---
```

---

## When to Run This

- After completing a major partner engagement or campaign build
- After building new scripts or automation pipelines
- Monthly review as part of content planning
- When prepping for website content sprints

---

## Post-Scan Workflow

1. Run the scan prompt against current repo state
2. Review P1 items — these become the next content sprint
3. For each P1 item:
   a. Copy source file to `playbooks/{category}/`
   b. Run sanitization (remove names, proprietary data)
   c. Add teaching scaffolding (why each step exists)
   d. Map to website component (GTMLS term, How-To, or standalone)
   e. Update `playbooks/index.md` and `playbooks/SKILL.md` status table
4. Build the website content (add terms to `gtm-terms.ts`, create components, etc.)
