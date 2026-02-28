---
name: landing-page
description: Generate an immersive, custom-branded landing page for a prospect or client. Researches the company, builds a motion-enabled page at /for/{slug} on thegtmos.ai, verifies the build, and optionally deploys via /update-github. Use when the user types /landing-page or says "generate landing page."
---

# Landing Page — Custom Prospect Page Generator

Build an immersive, custom-branded landing page for a specific company. The page lives at `thegtmos.ai/for/{slug}`, is noindexed, and serves as both a sales tool and a proof of concept — the page itself demonstrates what you can build.

---

## Command Patterns

- `/landing-page` — generate from conversation context (transcript, notes, company name)
- `/landing-page <company>` — generate for a named company (will research automatically)

---

## Inputs Required

The user must provide at least ONE of:

1. **Company name** — minimum viable input; the skill will research everything else
2. **Call transcript or meeting notes** — provides context on pain points, proposed engagement, and the contact person
3. **Contact name + role** — personalizes the page to the decision-maker

If only a company name is given, ask:
> "Who's the contact, and what's the engagement angle? Or should I research and build a general capabilities page?"

---

## Step 0: Research the Company

Use the Exa MCP tool or web search to research the company deeply. Collect:

| Data Point | Why |
|-----------|-----|
| **What they do** | Product, value prop, target market |
| **Brand identity** | Primary color (hex), secondary color, font family, design language |
| **Company stage** | Funding, headcount, growth rate, valuation |
| **Sales/GTM stack** | CRM, outreach tools, enrichment tools (Salesforce, Outreach, etc.) |
| **GTM challenges** | What a company at this stage struggles with |
| **Recent news** | Funding rounds, product launches, awards, press |
| **Key competitors** | Who else is in their space |

**Brand color is critical** — check the company's website for their primary brand color. This becomes the accent color for the entire page. If you can't find it, default to their industry's conventional color palette.

Store research findings — they feed directly into page content.

---

## Step 1: Define the Theme

Create a theme object based on research. This replaces the site's default terminal aesthetic.

**Template** (adapt colors per company):
```typescript
const THEME = {
  primary: '#XXXXXX',        // Company's primary brand color
  primaryLt: '#XXXXXX',      // Lighter variant for hover/tags
  primaryGlow: 'rgba(X,X,X, 0.12)', // Subtle glow for backgrounds
  primaryBorder: 'rgba(X,X,X, 0.25)', // Border accent
  dark: '#0A0F1C',           // Page background (keep dark)
  darkSubtle: '#0F1629',     // Alternate section background
  darkCard: '#131A2E',       // Card background
  border: '#1C2640',         // Default borders
  text: '#E2E8F0',           // Primary text
  textSecondary: '#94A3B8',  // Secondary text
  textMuted: '#64748B',      // Muted text
  white: '#F8FAFC',          // Bright white
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, 'Helvetica Neue', sans-serif",
} as const
```

**Key rules:**
- Always use **sans-serif** font — NOT JetBrains Mono / monospace
- Keep dark background (cohesive with site nav/footer) but use **company's accent color** instead of GTMOS gold
- The visual contrast between nav (terminal) and content (their brand) IS the proof

---

## Step 2: Define Page Content

Build content from the research and any transcript/notes provided.

### Required Sections (in order):

#### 1. Hero (100dvh)
- Radial gradient with company's brand color
- "Built for {Company}" headline
- Subtitle describing the engagement angle
- Two MagneticHover CTAs: "View the Engagement" + "See What I Build"
- Scroll indicator at bottom
- Badge pill: "Custom Proposal"

#### 2. Stats Strip
- 4-5 key company metrics (valuation, customers, headcount, growth, awards)
- Tagline: "We did our homework."

#### 3. The Challenge
- 3-4 pain points specific to their role/stage/industry
- Each in a numbered card with stagger reveal
- Source from: transcript pain points > researched GTM challenges > stage-appropriate defaults

#### 4. What I Build (Deliverables)
- 4 cards showing specific systems to build
- Each card: title, description, 3 tool/integration tags
- Map to their actual stack (Salesforce → "Salesforce", HubSpot → "HubSpot", etc.)
- Default deliverables (adapt per company):
  - Signal Engine (trigger-based outbound)
  - AI Enrichment Layer (research automation)
  - Pipeline Intelligence (CRM automation)
  - SDR/Sales Enablement (playbooks, coaching)

#### 5. The Engagement (Timeline)
- ProcessSteps vertical timeline with numbered circles
- Default 3-month structure (adapt if discussed differently):
  - Month 1: Audit & Architecture
  - Month 2: Build & Deploy
  - Month 3: Enable & Transfer
- If a different timeline was discussed, use that instead

#### 6. The Meta Proof
- Centered statement: "This page is the demo."
- "Custom-branded. Deeply researched. Built and deployed in a single session."
- "Now imagine what {engagement_length} of focused work delivers."

#### 7. Stack Integration
- Cards showing their tools + what gets added
- Source from research (CRM, outreach, enrichment, etc.)

#### 8. FAQ Accordion
- 5-6 common engagement questions
- Default set (customize if specific concerns came up):
  - How does the engagement start?
  - What access do you need?
  - How does pricing work?
  - Can I manage this independently after?
  - What makes this different from an agency?
  - What if we need to extend?

#### 9. CTA
- "Let's explore what's possible."
- MagneticHover mailto button → shawn@leadalchemy.co
- Subject line pre-filled with company name

#### 10. Footer Attribution
- "Built with theGTMOS.ai — the go-to-market operating system"

---

## Step 3: Build the Page

### File Structure
```
website/apps/gtmos/app/for/{slug}/
├── page.tsx              ← Server component (metadata, noindex)
└── {Company}Content.tsx  ← Client component (all interactive UI)
```

### page.tsx Template
```typescript
import type { Metadata } from 'next'
import { {Company}Content } from './{Company}Content'

export const metadata: Metadata = {
  title: 'Built for {Company} | AI Sales Development Infrastructure',
  description: 'A custom proposal for {engagement_angle} at {Company}.',
  robots: { index: false, follow: false },
}

export default function {Company}Page() {
  return <{Company}Content />
}
```

### Content Component Rules
- **'use client'** directive at top
- Import motion components from `../../components/motion`
- All styles inline (React.CSSProperties) — no external CSS files
- Scoped `<style>` tag for responsive overrides and animations
- Theme object at top of file
- Data arrays (stats, challenges, deliverables, steps, FAQ) at top of file
- Section wrapper components (MXSection, SectionLabel, SectionTitle) defined in file
- FAQ accordion defined in file (MaintainX-styled, not terminal-styled)

### Motion Components Available
Already installed at `website/apps/gtmos/app/components/motion/`:
- `MotionReveal` — scroll-triggered entrance (fadeUp, fadeIn, slideLeft, slideRight, scale)
- `StaggerContainer` + `StaggerItem` — sequential child reveals
- `MagneticHover` — cursor-following magnetic effect for CTAs
- `ScrollRevealSection` — full-bleed section with motion

### Reference Implementation
The MaintainX page is the gold standard:
- `website/apps/gtmos/app/for/maintainx/MaintainXContent.tsx` — full pattern reference
- Copy the structural patterns, adapt the content and theme

---

## Step 4: Verify Build

Run the build to ensure the page compiles:
```bash
cd website && npx turbo run build --filter=@shawnos/gtmos
```

If the build fails, fix TypeScript errors and rebuild. Common issues:
- Missing `'use client'` on components using framer-motion
- Unescaped apostrophes (use `&apos;`)
- Missing motion component imports

---

## Step 5: Deploy (Optional)

Ask the user:
> "Page is built and verified. Want me to push via `/update-github`?"

If yes, invoke the `update-github` skill.

---

## Quality Checklist

Before considering the page done:

- [ ] Company brand color used throughout (not GTMOS gold)
- [ ] Sans-serif font (not monospace)
- [ ] No terminal prompts ($, cat, boot sequences) — clean enterprise language
- [ ] All stats are accurate and sourced from research
- [ ] Engagement structure matches what was discussed (or sensible defaults)
- [ ] Tools/stack references match their actual stack
- [ ] mailto CTA has correct subject line with company name
- [ ] `robots: { index: false, follow: false }` in metadata
- [ ] Page builds clean with no TypeScript errors
- [ ] Mobile-responsive (2-col → 1-col grid on 768px)
- [ ] Hero is 100dvh with scroll indicator
- [ ] Motion animations fire on scroll (MotionReveal, StaggerContainer)
- [ ] MagneticHover on all CTA buttons
- [ ] FAQ accordion expands/collapses smoothly

---

## Adapting for Different Engagement Types

The default template assumes a **3-month build + enable** engagement. Adapt as needed:

| Engagement Type | Adjust |
|----------------|--------|
| **Advisory/consulting** | Replace "What I Build" with "What I Advise On", soften deliverables to recommendations |
| **One-time audit** | Collapse timeline to single phase, emphasize deliverable (audit report) |
| **Ongoing retainer** | Replace 3-month timeline with "How We Work Together" recurring cadence |
| **Training/enablement only** | Lead with curriculum, replace deliverables with learning outcomes |
| **Full GTM buildout** | Expand timeline, add more deliverable cards, emphasize scale |

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| URL slug | lowercase, hyphenated | `/for/maintainx`, `/for/acme-corp` |
| Content component | PascalCase + "Content" | `MaintainXContent.tsx`, `AcmeCorpContent.tsx` |
| Theme object | ALL_CAPS short name | `MX`, `AC`, `THEME` |
| Page component | PascalCase + "Page" | `MaintainXPage`, `AcmeCorpPage` |
