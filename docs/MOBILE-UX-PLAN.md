# Mobile UX Overhaul — Monoreaper Website Suite

> **Status**: PLAN (no code changes yet)
> **Created**: 2026-02-23
> **Scope**: ShawnOS, GTMOS, ContentOS, Mission Control
> **Goal**: Make every site fully functional and pleasant on mobile, then improve the desktop homepage experience

---

## Executive Summary

The shared `Navigation` component renders all links (up to 15 on ShawnOS) in a single horizontal flex row with zero mobile breakpoints. On phones, links overflow off-screen and require horizontal scrolling to reach. The body padding is fixed at 24px, eating more real estate. Progression/build-log pages have partial responsive support but several components (stat grids, chart labels, grade tables) lack mobile breakpoints entirely. The updates page timeline cards are fixed-width with no mobile adaptation.

**The fix is a 4-phase rollout**, starting with the shared Navigation component (highest impact, one fix serves all three sites), then page-level mobile polish, then progression/build-log improvements, and finally a desktop homepage redesign.

---

## Current Architecture (Key Facts)

| Aspect | Detail |
|--------|--------|
| **Framework** | Next.js 15 / React 19 / TypeScript 5 |
| **Styling** | Inline `style` objects + scoped `<style>` tags (NOT Tailwind classes in shared components) |
| **Design tokens** | CSS variables in `packages/shared/styles/tokens.css` |
| **Font** | JetBrains Mono (monospace-first aesthetic) |
| **Shared nav** | `packages/shared/components/Navigation.tsx` — used by ShawnOS, GTMOS, ContentOS |
| **Mission Control** | Separate layout — Tailwind grid cards, no shared nav component |
| **Existing breakpoints** | 480px (grids), 600px (LogHero), 900px (DailyLogView panels) — Navigation uses NONE |

### Per-App Navigation Link Counts

| App | Links | Severity on Mobile |
|-----|-------|--------------------|
| ShawnOS | **15** | Critical — most links completely hidden off-screen |
| ContentOS | 8 | Bad — last 3-4 links hidden |
| GTMOS | 8 | Bad — same as ContentOS |
| Mission Control | 0 (card nav) | OK — already uses responsive grid |

---

## Phase 1: Mobile Navigation (Highest Impact)

**Target file**: `website/packages/shared/components/Navigation.tsx`
**Impact**: Fixes mobile nav for ShawnOS, GTMOS, and ContentOS simultaneously.

### 1A. Hamburger Menu (< 768px)

**What to build:**
- Add a hamburger icon button (three horizontal lines), visible only below 768px
- On tap, open a **slide-down drawer** (not a sidebar — keeps the terminal/code aesthetic)
- Drawer renders all nav links vertically, full-width, with 48px touch targets (Apple HIG minimum: 44px)
- Drawer has a backdrop overlay; tapping outside closes it
- Current page gets an accent-colored left border or highlight
- Animate with `max-height` transition (matches existing codebase pattern from `dlv-expand-panel`)

**Why a dropdown drawer (not sidebar/bottom nav):**
- Drawer is the simplest pattern that works with inline CSS (no portal needed)
- Stays consistent with the terminal aesthetic (slides down like a terminal panel)
- Bottom nav would require choosing only 4-5 items — ShawnOS has 15 routes
- Sidebar requires z-index/portal management that adds complexity

**Implementation notes:**
- Use React `useState` for open/closed toggle — no external dependency
- Media query in a `<style>` block (matches existing pattern): hide link row + show hamburger below 768px
- Link grouping for ShawnOS's 15 items:
  - **Core**: Home, Blog, How-To, Log, About
  - **Knowledge**: Knowledge, Clay Wiki, Content Wiki, Context Wiki
  - **System**: RPG, Vitals, Updates, Method, API, Search
- Grouped sections in the drawer with subtle dividers or category labels
- GTMOS/ContentOS have 8 links — single flat list, no grouping needed

**CSS classes to add:**
```
.nav-hamburger        — button, hidden on desktop
.nav-link-row         — existing link row, hidden on mobile
.nav-drawer           — vertical link list, hidden on desktop
.nav-drawer-open      — active state with max-height transition
.nav-backdrop         — overlay behind drawer
```

### 1B. Desktop Link Row Improvement

**What to build:**
- On desktop (>= 768px), keep the horizontal link row
- For ShawnOS's 15 links: group into a dropdown or use a "More..." overflow pattern
  - **Option A (recommended)**: Show top 6-7 links inline, "More" dropdown for the rest
  - **Option B**: Horizontal scroll with fade indicators (quick but less polished)
- Add active-page indicator (accent underline or color change) — currently missing entirely

### 1C. Body Padding Responsive Adjustment

**Target files**: Each app's `globals.css`
- `website/apps/shawnos/app/globals.css`
- `website/apps/contentos/app/globals.css`
- `website/apps/gtmos/app/globals.css`

**Change:**
```css
html body {
  padding: 24px;  /* current — fixed */
}

/* Add: */
@media (max-width: 768px) {
  html body {
    padding: 12px;  /* halve padding on mobile */
  }
}

@media (max-width: 480px) {
  html body {
    padding: 8px;  /* minimal on small phones */
  }
}
```

### 1D. NetworkBanner Mobile Polish

**Target file**: `packages/shared/components/NetworkBanner.tsx`
- Currently renders 3 site links horizontally
- Only 3 items, so it works on most phones, but check touch target sizes
- Ensure labels don't truncate below 360px width

---

## Phase 2: Page-Level Mobile Polish

### 2A. Home Page Layouts (All 3 Sites)

**Target files:**
- `website/apps/shawnos/app/page.tsx`
- `website/apps/contentos/app/page.tsx`
- `website/apps/gtmos/app/page.tsx`

**Current state:** ContentOS and GTMOS use `flex-wrap` and `auto-fit` grids — decent but not optimized. ShawnOS homepage needs review.

**Changes:**
- Verify hero sections stack properly below 600px
- Feature grids: confirm `minmax(280px, 1fr)` doesn't cause horizontal scroll on 320px screens — may need `minmax(240px, 1fr)` or `minmax(min(280px, 100%), 1fr)`
- CTA buttons: ensure they're full-width on mobile
- TypewriterHero: check that animated text doesn't overflow on narrow screens

### 2B. Content Pages (Blog, How-To, Wiki)

**Pattern check:**
- These use `maxWidth: 720px` containers — should be fine on mobile
- Verify code blocks have `overflow-x: auto` and don't blow out page width
- Check image widths are constrained with `max-width: 100%`

### 2C. Search Page

- Verify search input is full-width on mobile
- Check result cards stack properly

---

## Phase 3: Progression & Build Log Mobile Fix

### 3A. ProgressionClient.tsx (Progression Dashboard)

**Target file**: `website/apps/shawnos/app/log/progression/ProgressionClient.tsx`

**Issues identified:**
1. **TokenEfficiency stat grid**: `gridTemplateColumns: repeat(3, 1fr)` at all widths — cramped on phones
2. **XPGraph date labels**: Rotated -45deg, may overlap with many data points on narrow screens
3. **GradeTable**: Relies on horizontal scroll — functional but not ideal

**Fixes:**
```
Stat grid:
  @media (max-width: 640px) → repeat(2, 1fr)
  @media (max-width: 400px) → 1fr (single column)

XP graph labels:
  @media (max-width: 480px) → show only day number, skip month
  OR: show every other label to reduce density

Grade table:
  Already has overflowX: auto — acceptable
  Optional: hide "Commits" column on < 480px to reduce scroll need
```

### 3B. DailyLogView.tsx (Individual Build Log Pages)

**Target file**: `packages/shared/components/DailyLogView.tsx`

**Already has:**
- 900px breakpoint: 3 columns → 1 column stacking
- `@media (hover: none)` to hide tooltips on touch devices
- Commit rows with ellipsis truncation + expandable detail

**Issues:**
1. **Stat boxes** (`flex: 1 1 0, minWidth: 80px`): On very narrow screens, 7 stat boxes wrap to multiple rows but the spacing gets tight
2. **Commit expanded detail**: `whiteSpace: pre-wrap` can create very wide content from long file paths
3. **Weekly bar chart day labels** (9px): Readable but tight

**Fixes:**
```
Stat boxes:
  @media (max-width: 480px) → minWidth: 70px, padding: 8px 10px, fontSize: 11px

Expanded commit detail:
  Add word-break: break-all for long paths
  Add max-width: 100%, overflow-x: auto as fallback

Chart:
  Acceptable as-is — flex: 1 1 0 handles narrow screens
```

### 3C. Build Log Commit Visibility (Key User Complaint)

**User says**: "You can't see the actual commits" on mobile.

**Root cause analysis:**
- Commit messages use `textOverflow: ellipsis` + `whiteSpace: nowrap` — on mobile, messages are truncated to just a few characters
- The expand chevron (12px) is small and may not be obviously tappable
- Touch targets on commit rows are only the row height (~24px) — below 44px minimum

**Fixes:**
1. Increase commit row padding on mobile: `padding: 8px` (currently 4px)
2. Make the entire row a larger touch target: `minHeight: 44px` on mobile
3. Add a subtle "tap to expand" affordance (e.g., down-arrow icon or "..." indicator)
4. Consider showing the first 2 lines of the commit message instead of 1 truncated line on mobile
5. Expanded detail: ensure it's full-width with proper word wrapping

### 3D. LogHero Responsive (Already Partially Done)

**Already has 600px breakpoint** — stacks avatar above content, 2x2 stat grid. Acceptable.

**Minor polish:**
- Avatar size could shrink from 80px to 60px on < 480px
- Stat labels could use smaller font

---

## Phase 4: Desktop Homepage Redesign + Updates Page

### 4A. Desktop Homepage — Navigation Categorization

**User request**: "Creating a dropdown on the home page for the computer experience as well, with having a dropdown and maybe just categorizing."

**Concept:**
- On the ShawnOS desktop homepage, instead of (or in addition to) the header nav, add a **section-based category grid** that organizes 15 pages into logical groups:

```
[Learn]               [Build]               [System]
 Blog                  Log                   RPG
 How-To                Progression           Vitals
 Knowledge             Quests                Updates
 Method                Build Your Own        API

[Wikis]               [About]
 Clay Wiki             About
 Content Wiki          Search
 Context Wiki          Arc
```

- Each category card could be expandable or always-visible
- This serves as both navigation and a site map / landing experience
- Consider making this the hero section or a prominent section below the fold

### 4B. Updates Page Improvements

**Target file**: `website/apps/shawnos/app/updates/page.tsx`

**Issues:**
1. **Feature timeline**: Cards are `flex: 0 0 280px` — on phones, you see barely one card at a time
2. **Content structure**: Needs better hierarchy and readability

**Fixes:**
```
Timeline cards:
  @media (max-width: 600px) → flex: 0 0 220px (narrower cards fit 1.5 visible)
  OR: switch to vertical stack on mobile (no horizontal scroll)

Feed items:
  Already decent with line clamping and flex layout
  Polish: increase padding, improve date visibility
```

### 4C. Desktop "More" Dropdown for Navigation

For ShawnOS's 15 links on desktop:
- Show: Home, Blog, How-To, Log, Knowledge, Vitals, Updates (7 primary)
- "More" dropdown: Clay Wiki, Content Wiki, Context Wiki, RPG, About, Search, Method, API (8 secondary)
- Dropdown opens on hover (desktop) with a subtle animation
- Same grouped sections as the mobile drawer

---

## Implementation Strategy

### Recommended Execution Order

| Step | Phase | Effort | Impact | Files Modified |
|------|-------|--------|--------|----------------|
| 1 | 1A | Medium | **Critical** | `Navigation.tsx` |
| 2 | 1C | Small | High | 3x `globals.css` |
| 3 | 1B | Medium | High | `Navigation.tsx` |
| 4 | 3C | Small | High | `DailyLogView.tsx`, `ProgressionClient.tsx` |
| 5 | 3A | Small | Medium | `ProgressionClient.tsx` |
| 6 | 3B | Small | Medium | `DailyLogView.tsx` |
| 7 | 2A | Medium | Medium | 3x `page.tsx` |
| 8 | 4B | Small | Medium | `updates/page.tsx` |
| 9 | 4A | Large | Nice-to-have | `shawnos/page.tsx` |
| 10 | 4C | Medium | Nice-to-have | `Navigation.tsx` |

### Technical Constraints

1. **Styling approach**: Use inline CSS + `<style>` blocks (existing pattern). Do NOT introduce a new CSS framework.
2. **No new dependencies**: Hamburger menu and dropdown should be pure React + CSS.
3. **Mobile-first breakpoints**: 480px (small phone), 768px (tablet/hamburger threshold), 900px (existing panel breakpoint).
4. **Touch targets**: Minimum 44px per Apple HIG / WCAG 2.5.8.
5. **Performance**: No layout shift — hamburger menu should be pre-rendered, toggled via CSS `max-height`.
6. **Testing**: Each phase should be verified on iPhone SE (375px), iPhone 14 (390px), and iPad (768px) viewports.

### Key Files Reference

```
SHARED (one change serves all 3 sites):
  website/packages/shared/components/Navigation.tsx     ← Phase 1A, 1B, 4C
  website/packages/shared/components/NetworkBanner.tsx   ← Phase 1D
  website/packages/shared/components/DailyLogView.tsx    ← Phase 3B, 3C
  website/packages/shared/styles/tokens.css              ← Reference only

PER-APP:
  website/apps/shawnos/app/globals.css                   ← Phase 1C
  website/apps/contentos/app/globals.css                 ← Phase 1C
  website/apps/gtmos/app/globals.css                     ← Phase 1C
  website/apps/shawnos/app/page.tsx                      ← Phase 2A, 4A
  website/apps/contentos/app/page.tsx                    ← Phase 2A
  website/apps/gtmos/app/page.tsx                        ← Phase 2A

SHAWNOS-SPECIFIC:
  website/apps/shawnos/app/log/progression/ProgressionClient.tsx  ← Phase 3A
  website/apps/shawnos/app/updates/page.tsx                       ← Phase 4B
  website/apps/shawnos/app/log/LogIndexClient.tsx                 ← Phase 2 (verify)
```

---

## Verification Checklist (Per Phase)

### Phase 1 (Navigation)
- [ ] Hamburger icon visible on < 768px, hidden on >= 768px
- [ ] Drawer opens/closes with animation
- [ ] All links accessible and tappable (44px+ targets)
- [ ] Drawer closes on link tap and backdrop tap
- [ ] Active page highlighted
- [ ] Body padding reduces on mobile
- [ ] No horizontal page overflow at 320px width
- [ ] Desktop link row unchanged (no regression)

### Phase 2 (Pages)
- [ ] Hero sections stack vertically on mobile
- [ ] Feature grids don't cause horizontal scroll at 320px
- [ ] Code blocks scroll horizontally (not page)
- [ ] Images constrained to container width

### Phase 3 (Progression/Build Log)
- [ ] Stat grids readable at 375px width
- [ ] Commit rows have 44px+ touch targets
- [ ] Expanded commit detail wraps long paths
- [ ] Grade table scrollable without page overflow
- [ ] Chart labels readable at 375px

### Phase 4 (Desktop + Updates)
- [ ] Homepage category grid renders cleanly
- [ ] "More" dropdown works on hover
- [ ] Updates timeline usable on mobile
- [ ] Feed items properly spaced

---

## Notes for Context Handoff

- This plan was generated from a deep 4-agent parallel analysis of the entire website monorepo
- NO code has been modified — this is analysis + plan only
- The Navigation component is the single highest-leverage fix (serves 3 sites)
- Mission Control is excluded from Phase 1 (already uses a different, adequate pattern)
- The existing codebase uses inline CSS + `<style>` blocks, NOT Tailwind utility classes in shared components (Mission Control is the exception)
- All existing responsive breakpoints were cataloged: 480px, 600px, 820px, 900px
- The user wants to be able to hand this plan off to a future session for execution
