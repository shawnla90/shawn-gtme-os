# Context Handoff
> Generated: 2026-02-20 23:20 | Machine: MacBook | Session: video-v3-final-cut + video-skill

## What Was Done This Session

### Lead Magnet Video V3 — Final Cut
- Compressed 15s → 10.3s (310 frames at 30fps). Wiki cards: 28f → 15f each. Classes: 15f → 10f.
- Dynamic hook count from `TOTAL_ENTRIES` (shows "200+"), replaces hardcoded "190+"
- Labels: "entries" → "pages"/"guides"/"terms". Added "and growing" messaging.
- Stats overlay: flat inline → stacked columns with bold s(36) numbers
- Progression avatars: centered vertically, sequential stagger (6f apart), sizes 130/150/190
- Homepage poster: split layout — big 48px count, label, "and growing", "10s highlight reel"
- Play handler: `.play().then()` pattern, autoplay fallback to muted, `currentTime = 0` reset
- Rendered landscape → copied to `website/apps/shawnos/public/video/lead-magnet.mp4`
- Committed as `db7230c`, pushed to `origin/main`

### Video Production Skill Updated
- `.claude/skills/video/SKILL.md` — complete V3 production formula
- 4-scene structure, exact frame budgets, speed rules, visual standards, audio layers
- Step-by-step guide for creating new site videos (theGTMOS.ai, theContentOS.ai)
- Content mapping table per site

## Current State
- **Git**: `main`, `db7230c` pushed. 2 uncommitted: video skill update + this handoff
- **Uncommitted**: `.claude/skills/video/SKILL.md`, `.claude/context-handoff.md`
- **Blocked on**: nothing

## Next Steps

### 1. theContentOS.ai Highlight Video (priority)
Follow `.claude/skills/video/SKILL.md` formula exactly. Content:
- **Hook**: Content stat (e.g., "6 platforms. One voice." or platform count + playbook count)
- **Blitz cards** (5 cards, 15f each): LinkedIn, X/Twitter, Reddit, Substack, YouTube — each with playbook count + 3 highlight topics (algorithm, hooks, threads, SEO growth, newsletter, etc.)
- **Showcase**: Platform montage → connected reveal (like the dynamite feel — all platforms unified)
- **CTA**: theContentOS.ai end card, "Your content. Every platform. One system."

### 2. theGTMOS.ai Highlight Video
Same formula, GTM content:
- **Hook**: GTM stat (pipeline count, play count, or similar)
- **Blitz cards**: Cold Email, Clay Enrichment, Signal Triggers, Domain Warming, Lead Scoring
- **Showcase**: Pipeline stages or GTM workflow montage
- **CTA**: theGTMOS.ai end card

### 3. Implementation Path
1. Add `CONTENT_OS_MONTAGE` + `GTM_OS_MONTAGE` arrays in `data.ts`
2. Create new composition components (reuse scene components with different data props)
3. Add compositions to `Root.tsx` (3 aspect ratios each)
4. Render + deploy to each site's `public/video/` dir
5. Add `VideoShowcase` component to each site's homepage

## Key Decisions Made
- 10.3s is the locked duration — all future videos match this
- 15f per content card, 10f per montage item — non-negotiable speed
- Entry counts use floor-to-10 rounding with "+" suffix
- Homepage playback at 1.2x speed
- Sequential avatar/element reveals stagger 6 frames apart
- `preload="auto"` on video elements for instant play

## Files to Read First
1. `.claude/skills/video/SKILL.md` — full production formula (READ THIS FIRST)
2. `website/apps/video/src/lib/data.ts` — add new site montage arrays here
3. `website/apps/video/src/LeadMagnetV2.tsx` — composition template to copy
4. `website/apps/video/src/lib/timing-v2.ts` — timing constants (310f, 30fps)
5. `website/apps/video/src/scenes/` — 4 scene components to adapt
