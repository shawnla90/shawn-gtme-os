---
name: discuss
description: Decision-lock workflow for complex features. Asks targeted domain-specific questions, locks scope, and writes a CONTEXT.md that downstream skills consume. Auto-invoked when a feature touches 3+ files across 2+ concerns, or manually via /discuss.
---

# Discuss — Decision-Lock Before Execution

Lock all decisions BEFORE any code gets written. One CONTEXT.md per feature. No agent re-asks what's already decided.

---

## When to Invoke

- **Auto:** agent-routing Step 0 detects 3+ files across 2+ concerns and no CONTEXT.md exists
- **Manual:** User types `/discuss` or "let's discuss this first"
- **Skip:** Task is 1-2 files in a single concern, or CONTEXT.md already exists for this feature

---

## Step 1: Domain Detection

Classify the work into one or more domains. Each domain has its own question bank — never ask generic questions.

| Domain | Signals | Question Focus |
|--------|---------|----------------|
| **Visual/UI** | Components, pages, layouts, CSS, animations | Responsive breakpoints, existing component reuse, design system tokens, interaction states |
| **API/Data** | Endpoints, data files, types, schemas, database | Data shape, validation rules, error handling, existing type patterns |
| **Operations** | Crons, deploy, CI, scripts, infra | Schedule, failure handling, monitoring, rollback strategy |
| **Content** | Blog posts, wiki entries, social, copy | Voice compliance (Rule 0), platform, pillar, audience segment |
| **Organizational** | Skills, constraints, workflows, team config | Scope of impact, backward compatibility, which skills consume the output |

Multi-domain tasks get questions from each relevant domain.

---

## Step 2: Scope Boundary Lock

State the scope explicitly in 2-3 sentences:

> **Scope:** We are building [X]. This includes [A, B, C]. This does NOT include [D, E].

Present to user. They confirm with "yes", narrow with "remove X", or expand with "also include Y."

Anything the user mentions that falls outside the stated scope → add to Deferred Ideas (Step 4).

---

## Step 3: Ask 5-7 Targeted Questions

Pull from the domain question banks detected in Step 1. Rules:

- **Max 7 questions.** If you need more, the scope is too broad — split into two `/discuss` sessions.
- **Reference existing code by path.** Not "what pattern?" but "should this follow the pattern in `apps/shawnos/app/wiki/[slug]/page.tsx` or a new layout?"
- **Offer recommended defaults.** Every question should have a `(recommended: X)` when Claude has an informed opinion.
- **No vibes.** Every answer must be a concrete, implementable decision. "Make it look good" is not a decision. "Use the existing `CardGrid` component with 3 columns on desktop, 1 on mobile" is.
- **Ask all questions at once.** Do not drip-feed. Present the full batch and let the user answer in one pass.

### Example (Visual/UI domain):

> 1. **Layout:** Should this use the existing `PageShell` wrapper or a custom layout? *(recommended: PageShell — matches all other app pages)*
> 2. **Data source:** Pull from the existing `wiki-entries.ts` array or a new dedicated data file? *(recommended: new file — keeps wiki entries clean)*
> 3. **Responsive:** Desktop-first with mobile breakpoint at 768px, matching the rest of the site? *(recommended: yes)*

---

## Step 4: Write CONTEXT.md

Save to `reports/YYYY-MM-DD_slug/CONTEXT.md` (same folder the phase-report will use) or the feature's working directory if one exists.

```markdown
# [Feature Name] — Decision Lock

**Date:** YYYY-MM-DD
**Scope:** [The locked scope from Step 2]
**Domains:** [Visual/UI, API/Data, etc.]

---

## Decisions

[Numbered list. Each decision is final. Agents MUST NOT re-ask these.]

1. [Decision from Q1 answer]
2. [Decision from Q2 answer]
3. [Decision from Q3 answer]
...

## Deferred Ideas

[Ideas mentioned but explicitly out of scope. Preserved for future sessions.]

- [ ] [Deferred item 1 — brief rationale for deferring]
- [ ] [Deferred item 2]

## Claude's Discretion

[Items where the user said "you decide" or "whatever makes sense." Claude picks the best option during execution without asking again.]

- [Discretion item 1 — Claude's chosen approach and why]
- [Discretion item 2]
```

---

## Step 5: User Confirmation

Display the full CONTEXT.md content. User responds with:

- **"yes"** → Lock it. No further changes.
- **"edit N"** → Modify decision N, re-display.
- **"add deferred: [idea]"** → Append to Deferred Ideas, re-display.

Once locked, announce:

> Decision lock complete. CONTEXT.md saved to `[path]`.

---

## Step 6: Downstream Handoff

Announce which skills will consume this file:

> **Downstream consumers:**
> - `/agent-routing` → Will read Decisions to inform the 5-dimension analysis
> - `TEAM-CONSTRAINTS.md` → Executors will load CONTEXT.md as part of Rule 8 context chain
> - `/phase-report` → Will import Decisions and Deferred Ideas into the final report

---

## Rules

1. **Never re-ask a locked decision.** If it's in CONTEXT.md under `## Decisions`, it's settled. Agents that contradict a locked decision are wrong.
2. **One CONTEXT.md per feature.** Don't create multiple. If scope changes, edit the existing one.
3. **Max 7 questions.** More means the scope is too broad.
4. **Reference existing code paths.** Every question should ground itself in what already exists in the repo.
5. **Deferred is not deleted.** Deferred ideas survive into the phase-report archive. They are future work, not rejected work.
6. **Claude's Discretion is earned.** Only items the user explicitly delegates go here. Claude does not self-grant discretion.
