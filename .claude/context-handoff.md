# Context Handoff
> Generated: 2026-02-20 ~21:00 | Machine: MacBook | Session: Remotion video app v1 build

## What Was Done This Session

**Built complete Remotion video app** (`website/apps/video/`) — 22 files:
- **Scaffold**: `package.json`, `tsconfig.json`, `remotion.config.ts`, `.gitignore`, `src/index.ts`
- **Compositions**: `src/Root.tsx` (3 format presets), `src/LeadMagnet.tsx` (6-scene sequencer)
- **Foundation**: `src/lib/tokens.ts` (design tokens), `src/lib/timing.ts` (scene timing), `src/lib/data.ts` (live imports from @shawnos/shared)
- **7 Components**: `src/components/` — TerminalChrome, TypewriterText, AnimatedCounter, MatrixRain, ScanlineOverlay, WikiCard, AvatarSprite
- **6 Scenes**: `src/scenes/` — Hook (0-3s), BootSequence (3-8s), WikiMontage (8-25s), Progression (25-40s), NetworkReveal (40-52s), CTA (52-60s)
- **Avatar assets**: Copied tier-3, tier-4, tier-5 static PNGs to `public/progression/avatars/`

**Homepage video embed** (`website/apps/shawnos/`):
- **Created** `app/VideoShowcase.tsx` — click-to-play client component in terminal chrome wrapper
- **Edited** `app/page.tsx` — added video section after hero (line ~240), imported VideoShowcase

**Created `/video` skill** (`.claude/skills/video/SKILL.md`) — render commands, deployment steps, architecture docs

**Verified**: TypeScript compiles clean (`npx tsc --noEmit` = 0 errors), shawnos build passes (30s), Remotion Studio launches on port 3003

## Current State
- **Git**: `main`, dirty, last commit `a37db6c`
- **Uncommitted changes**:
  - Modified: `website/apps/shawnos/app/page.tsx`, `website/package-lock.json`, `sitemap-0.xml`
  - New dirs: `website/apps/video/` (entire Remotion app), `.claude/skills/video/`, `.claude/skills/morning/`, `.claude/teams/`
  - New file: `website/apps/shawnos/app/VideoShowcase.tsx`
- **Blocked on**: nothing — v1 complete, ready for commit

## Next Steps

1. **Commit v1** — all changes are build-verified. Use `/update-github` for safety scan.
2. **Build v2 of the video** — improve with:
   - Audio: background track + 8-bit level-up chime (pre-render `sounds.ts` Web Audio API → WAV files)
   - `@remotion/transitions` for proper scene transitions (replace manual interpolate wipes)
   - `@remotion/layout-utils` for responsive text sizing
   - `@remotion/noise` for organic matrix rain
   - `@remotion/paths` for SVG network connection line animations
3. **Add React/Remotion how-to wiki entry** — document animation patterns (spring, interpolate, frame-based design, Sequence composition)
4. **Render actual MP4** — run `npm run render:linkedin` in `website/apps/video/`, then copy landscape version to `apps/shawnos/public/video/lead-magnet.mp4`
5. **Polish in Remotion Studio** — scrub timeline, adjust scene timing, verify visual flow

## Key Decisions Made

- **Data-driven counts** — video imports live from `@shawnos/shared/data/*`. Adding a wiki entry auto-updates the video count on next render. Hook says "190+ free knowledge entries" (actual: 191).
- **Static MP4 for website** (not `@remotion/player`) — lighter bundle, simpler deployment. VideoShowcase uses HTML5 `<video>` with click-to-play poster overlay.
- **3 render presets** — LinkedIn 1080x1350 (primary), Reels 1080x1920, Landscape 1920x1080. Same composition, different dimensions.
- **Site accent colors from actual tokens** — gtmos = teal (#3DBFA0), not amber. Matches the real site design.
- **Fan-out agent pattern** — scaffolded foundation myself, spawned 2 parallel agents (components + scenes) with `bypassPermissions`. Both succeeded — agents CAN write files with this mode.
- **Sounds.ts not yet integrated** — Web Audio API (browser-only) needs offline rendering to WAV for Remotion. Deferred to v2.

## Files to Read First

1. `website/apps/video/src/LeadMagnet.tsx` — main composition, shows scene sequencing
2. `website/apps/video/src/lib/timing.ts` — all scene timing constants
3. `website/apps/video/src/lib/data.ts` — data-driven imports, wiki counts, site info
4. `website/apps/video/src/scenes/WikiMontage.tsx` — most complex scene (7 wiki fast cuts)
5. `website/apps/shawnos/app/VideoShowcase.tsx` — homepage embed component
