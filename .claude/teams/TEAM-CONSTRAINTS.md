# Agent Team Constraints
> Every teammate MUST read this file before making any changes.
> This is the management layer. Without it, parallel agents create chaos.
> Last updated: 2026-02-20

---

## Rule 0: Voice System — Read Before You Create Any Content

Shawn's voice and content system lives in the skill tree. It is NOT optional.
Do NOT write content from scratch using your own patterns. Load the voice first.

**All paths are relative to repo root: `/Users/shawntenam/Desktop/shawn-gtme-os/`**

### Required Reading by Role

**Writer / Content Creator — read ALL of these before writing anything:**
1. `SKILL.md` (repo root) — skill tree map, shows how tiers compose
2. `skills/tier-1-voice-dna/core-voice.md` — who Shawn is, voice characteristics, identity anchors, audience, tool stack
3. `skills/tier-1-voice-dna/anti-slop.md` — 14 anti-AI-slop patterns + natural patterns whitelist
4. `skills/tier-1-voice-dna/safety-filters.md` — pattern vs. person test
5. Platform-specific playbook (pick ONE based on target):
   - `skills/tier-2-context-playbooks/linkedin.md` — LinkedIn posts
   - `skills/tier-2-context-playbooks/substack.md` — newsletter/long-form
   - `skills/tier-2-context-playbooks/x-twitter.md` — X/Twitter
   - `skills/tier-2-context-playbooks/tiktok.md` — short-form video scripts
   - `skills/tier-2-context-playbooks/client-comms.md` — client-facing emails/decks

**Reviewer — read ALL of these before reviewing:**
1. `skills/tier-1-voice-dna/core-voice.md` — know the voice to check against it
2. `skills/tier-1-voice-dna/anti-slop.md` — the flags you're scanning for
3. `skills/tier-3-content-ops/pre-publish-checklist.md` — structure, substance, safety, voice checks
4. `skills/tier-3-content-ops/substance-requirements.md` — what qualifies as substance
5. `skills/tier-3-content-ops/pitfalls.md` — thought leader trap, generic advice, over-polish, too technical
6. `skills/ai-pattern-detection/SKILL.md` — full 29-flag AI content detection (deep scan)

**SEO Agent — read these:**
1. The target data file (for existing keyword patterns and description formats)
2. `skills/tier-1-voice-dna/core-voice.md` — audience and positioning context (so keywords match the actual audience, not generic SEO bait)

**Deploy / Next.js / Git agents — voice system not required.** These roles are mechanical.

### The Rule

If your role is Writer or Reviewer and you did not read the files above, your output will be rejected. No exceptions. Generic Claude voice is not Shawn's voice. The skill tree IS the difference.

---

## Rule 1: File Ownership — One Writer Per File

No two agents may write to the same file in the same wave.

Before editing ANY file, the agent MUST:
1. Check the task list for who owns what
2. If another agent's task description mentions that file, DO NOT TOUCH IT
3. If unclear, message the team lead and wait for assignment

**Violations of this rule cause silent data loss.** The last write wins. There is no merge.

---

## Rule 2: Shared Decisions Log

When an agent makes an architectural decision (pattern choice, naming convention, data structure, import path), it MUST:

1. Record it in a message to the team lead with prefix `[DECISION]`
2. The decision is then available to all other agents via team communication

Examples of decisions that MUST be logged:
- "Using `anti-pattern` section type for the disclaimer"
- "Placing the new entry at the top of the array, not the bottom"
- "Import from `@shawnos/shared/data/` not `../../../packages/`"
- "Using date format `2026-02-20` not `Feb 20, 2026`"

**If you make a decision and don't log it, another agent WILL make a conflicting one.**

---

## Rule 3: Read Before You Write

Every agent must read at least ONE existing example of whatever it's about to create or modify.

- Writing a wiki entry? Read an existing entry in the same data file first.
- Adding a page? Read an existing page in the same app directory first.
- Updating a config? Read the current config first.
- Creating a component? Read a sibling component first.

This prevents pattern drift. The existing code IS the style guide.

---

## Rule 4: Wave Discipline

Work is organized in sequential waves. Each wave contains parallel tasks.

```
Wave 1: Foundation (data files, types, shared code)
  ↓ VERIFY before proceeding
Wave 2: Consumers (pages, components that import from Wave 1)
  ↓ VERIFY before proceeding
Wave 3: Integration (navigation, cross-links, exports, sitemap)
  ↓ VERIFY before proceeding
Wave 4: Validation (build, test, deploy)
```

**Rules:**
- Agents in the same wave CAN run in parallel (they touch different files)
- Agents in different waves MUST run sequentially (later waves depend on earlier ones)
- Between waves, the team lead verifies output before launching the next wave
- NO agent may skip ahead to a later wave

---

## Rule 5: Build Gate

No deploy agent may push until:
1. `npx turbo build --filter=@shawnos/web` passes clean
2. Pre-push safety scan passes (Husky hook)
3. Team lead confirms all teammate output is merged and verified

---

## Rule 6: Context Before Action

Every teammate receives:
1. This constraints file (non-negotiable rules)
2. A specific task description (what to do)
3. File references (what to read for patterns)
4. Clear ownership boundaries (what files this agent owns)

If any of these are missing, the agent MUST ask the team lead before proceeding.

---

## Codebase-Specific Constraints

### Website Structure
```
website/
├── apps/
│   ├── shawnos/       ← Primary site (shawnos.ai)
│   ├── gtmos/         ← GTM OS site
│   ├── contentos/     ← Content OS site
│   └── mission-control/ ← Dashboard
├── packages/
│   └── shared/        ← Shared data, components, lib
│       ├── data/      ← Wiki entries, terms, content data
│       ├── components/ ← Shared React components
│       └── lib/       ← RSS, feed helpers, utilities
```

### Data File Patterns
- Wiki entries: typed arrays exported from `packages/shared/data/*.ts`
- Each entry has: `id` (slug), `title`, `subtitle`, `category`, `description`, `keywords`, `sections[]`, `related[]`, `difficulty`, `canonicalSite`
- Sections have: `heading`, `type` (prose|code|pattern|pro-tip|formula|anti-pattern), `content`

### Deploy Flow
1. Build: `cd website && npx turbo build --filter=@shawnos/web`
2. Commit: descriptive message, Co-Authored-By trailer
3. Push: `git push origin main` (triggers Husky pre-push scan + Vercel auto-deploy)

### Updates Page
- Feature milestones: add to `FEATURE_MILESTONES[]` in `apps/shawnos/app/updates/page.tsx`
- Content feed: auto-generated from wiki/blog data — no manual entry needed
- RSS: auto-generated from the same data sources

### Safety
- Pre-push hook scans for blocklist terms (partner/client names)
- Never commit `.env`, `clients/`, `partners/`, `data/` CSVs
- Public repo (`gtme-os` remote) gets sanitized pushes via `/update-github`

---

## Content Pillar Routing (Writer Agent)

When creating content, the Writer must also load the matching pillar template:

| Content Type | Pillar File |
|-------------|-------------|
| "GTM plays I use every day" series | `skills/tier-3-content-ops/pillars/plays-series.md` |
| Origin stories, tool journeys, BTS | `skills/tier-3-content-ops/pillars/building-sharing.md` |
| Pop culture + GTM memes | `skills/tier-3-content-ops/pillars/gtm-memes.md` |
| Takes on new tool features | `skills/tier-3-content-ops/pillars/release-reactions.md` |
| Sharing frameworks/skill files | `skills/tier-3-content-ops/pillars/skill-system-shares.md` |
| Newsletter editorial | `skills/tier-3-content-ops/pillars/newsletter-editorial.md` |
| Newsletter growth | `skills/tier-3-content-ops/pillars/newsletter-growth.md` |
| Newsletter repurpose | `skills/tier-3-content-ops/pillars/newsletter-repurpose.md` |
| Reddit/SEO growth | `skills/tier-3-content-ops/pillars/reddit-growth-seo.md` |
| YouTube builder systems | `skills/tier-3-content-ops/pillars/youtube-builder-systems.md` |
| X micro-tips | `skills/tier-3-content-ops/pillars/x-micro-tips.md` |
| Twitch/gaming/Discord | `skills/tier-3-content-ops/pillars/twitch-gaming-discord.md` |

For wiki/how-to articles (website content), pillars don't apply — use the existing data file entries as the pattern instead.

### Improvement Protocol

If the Reviewer sends feedback, the Writer follows:
`skills/tier-3-content-ops/improvement-protocol.md` — 6-step draft improvement process

### Success Patterns Reference

Writer and Reviewer should both be aware of:
`skills/tier-3-content-ops/success-patterns.md` — what works vs. what doesn't from Shawn's best content

---

## Anti-Patterns (What NOT To Do)

1. **Two agents editing the same data file** — even different entries. One agent owns the file per wave.
2. **Agent guessing import paths** — read the existing file to see how imports work. Never guess.
3. **Skipping the build check** — "it's a small change" is how broken deploys happen.
4. **Agent making decisions without logging them** — context drift starts here.
5. **Deploying without team lead sign-off** — the deploy agent waits for explicit approval.
6. **Adding content without updating the updates page** — every new feature/article gets a milestone entry.
7. **Writing content without loading the voice system** — generic Claude output gets rejected. Read Rule 0.
8. **Duplicating voice rules into agent skill files** — the voice system lives in `skills/`. Point to it, don't copy it.
