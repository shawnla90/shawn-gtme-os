# Context Handoff
> Generated: 2026-02-20 ~22:30 | Machine: MacBook | Session: Remotion video V2 build

## What Was Done This Session

**Built V2 Lead Magnet video** — 30s (down from 60s), 4 scenes with transitions + audio:

### New Files Created
| File | Purpose |
|------|---------|
| `src/LeadMagnetV2.tsx` | Main 30s composition using `TransitionSeries` + `<Audio>` layers |
| `src/lib/timing-v2.ts` | V2 timing: 900 frames, 4 scenes, 15f transition overlaps |
| `src/lib/sounds.ts` | Audio file paths + volume constants |
| `src/scenes/HookV2.tsx` | Immediate stat punch (90f), `ParticleField` background |
| `src/scenes/BootWikiBlitz.tsx` | Merged boot terminal + 5 wiki rapid-fire cards (350f) |
| `src/scenes/ProgressionV2.tsx` | Compressed RPG moment (250f) with `Trail` motion blur on level-up |
| `src/scenes/CtaNetwork.tsx` | Merged 3-site network reveal + CTA with `ConnectionLines` (255f) |
| `src/components/ParticleField.tsx` | `@remotion/noise` `noise2D` driven ambient particles |
| `src/components/ConnectionLines.tsx` | SVG path draw-on via `@remotion/paths` `evolvePath()` |
| `scripts/generate-sounds.ts` | WAV synthesizer — generates 7 audio files to `public/audio/` |
| `public/audio/*.wav` | 7 files: bgm-loop, boot-beep, key-click, whoosh, card-flip, level-up, resolve |

### Modified Files
| File | Change |
|------|--------|
| `src/Root.tsx` | Added 3 V2 compositions (LinkedIn, Reels, Landscape) above V1 |
| `src/components/MatrixRain.tsx` | Swapped to `@remotion/noise` `noise2D` for organic character generation |
| `package.json` | Added 5 `@remotion/*` deps (transitions, noise, paths, animation-utils, motion-blur) + V2 render scripts |

### Packages Added
All pinned to `4.0.427` (matching existing remotion version):
- `@remotion/transitions` — `TransitionSeries`, `fade()`, `wipe()`, `linearTiming()`
- `@remotion/noise` — `noise2D` for particles + matrix rain
- `@remotion/paths` — `evolvePath()` for SVG connection line draw-on
- `@remotion/animation-utils` — `makeTransform()` (available but not yet used heavily)
- `@remotion/motion-blur` — `Trail` component on level-up moment

### V2 Scene Structure (900 frames @ 30fps)
```
Hook (90f) →fade(15f)→ BootWikiBlitz (350f) →wipe(15f)→ Progression (250f) →fade(15f)→ CtaNetwork (255f)
= 945 - 45 = 900 frames = 30s
```

### Verified
- `npx tsc --noEmit` = 0 errors
- `npx remotion compositions` = 6 compositions (3 V2 + 3 V1)
- Remotion Studio launches on port 3003, V2 plays through

## Current State
- **Git**: `main`, uncommitted V2 changes (not yet committed)
- **Last commit**: `e324458` (V1)
- **Blocked on**: nothing

## V3 Polish — What the User Wants Next

Three requests for the next iteration:

### 1. Showcase ALL avatars in Progression scene
Currently `ProgressionV2.tsx` only shows tier-3 → tier-5 with "Voice Alchemist" title. User wants to show **all character classes**: Builder, Scribe, Strategist, Alchemist, Polymath.

**Avatar asset locations** (full set lives in ShawnOS app, only tier-3/4/5 copied to video app):
- ShawnOS (source of truth): `website/apps/shawnos/public/progression/avatars/`
  - Tier 1-6: `tier-{1-6}-{idle.gif,action.gif,static.png}` + `-advanced` variants
  - Classes: `class-{builder,scribe,strategist,alchemist,polymath}-{idle.gif,static.png}`
- Video app (current): `website/apps/video/public/progression/avatars/` — only `tier-{3,4,5}-static.png`

**RPG title table** (from `packages/shared/lib/rpg.ts`):
| Level | Title | Tier |
|-------|-------|------|
| 1 | Terminal Initiate | 1 |
| 10 | Repo Architect | 2 |
| 20 | Context Weaver | 3 |
| 30 | Voice Alchemist | 4 |
| 40 | OS Architect | 5 |
| 45 | **Cursor Slayer** | 5 |
| 50 | **Grand Master Cursor Slayer** | 6 |

**Class colors** (from `apps/shawnos/app/rpg-preview/constants.ts`):
- Builder: `#f59e0b` (amber)
- Scribe: `#06b6d4` (cyan)
- Strategist: `#3b82f6` (blue)
- Alchemist: `#a855f7` (purple)
- Polymath: `#00ff41` (neon green)

**Approach**: Copy class avatar PNGs to video app `public/`, then redesign the Progression scene to rapid-fire through the 5 classes (similar to wiki card montage pattern) before the level-up moment.

### 2. Pacing feels too slow at 1x — needs 2x to feel right
User is playing at 2x speed in Remotion Studio to get the right energy. This means all animation durations are ~2x too long. Options:
- **Option A**: Cut total to 15s (450 frames) — literally half all timing
- **Option B**: Keep 30s but double animation speeds (faster springs, shorter holds, tighter cuts)
- **Option C**: Increase FPS to 60 but keep 30s — more frames, same wall-clock time, smoother motion
- **Ask the user** which approach they prefer. Option A is the most dramatic change. Option B preserves length for platform requirements (LinkedIn prefers 15-30s).

### 3. Components feel "floating" — not blended into backgrounds
React components look like they're sitting on top of the canvas rather than being part of it. User wants more visual integration. Techniques to try:
- **Shared background textures** across scenes (noise grain, subtle vignette)
- **Drop shadows / glow** on cards and text to anchor them
- **Background blur layers** behind floating elements
- **Consistent scanline overlay** at low opacity across all scenes (currently only BootWikiBlitz has it)
- **Depth-of-field illusion**: components slightly larger than expected, subtle scale differences between foreground/background
- **Shared color bleeding**: tint backgrounds with scene accent color at very low opacity
- **Film grain overlay**: uniform noise texture at 2-3% opacity across everything

## Files to Read First (V2)

1. `website/apps/video/src/LeadMagnetV2.tsx` — V2 composition, TransitionSeries + Audio
2. `website/apps/video/src/lib/timing-v2.ts` — V2 timing constants
3. `website/apps/video/src/scenes/ProgressionV2.tsx` — scene to redesign for avatar showcase
4. `website/apps/video/src/lib/sounds.ts` — audio file paths
5. `website/apps/shawnos/app/rpg-preview/constants.ts` — class names + colors (source of truth)
6. `website/packages/shared/lib/rpg.ts` — TITLE_TABLE with all level/tier/title data

## Key API Signatures (for next session)

```typescript
// @remotion/transitions
TransitionSeries.Sequence durationInFrames={N}
TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: N })}
fade({ shouldFadeOutExitingScene?: boolean })
wipe({ direction: 'from-left' | 'from-right' | ... })
slide({ direction: 'from-left' | ... })

// @remotion/noise
noise2D(seed: string | number, x: number, y: number): number  // returns -1 to 1

// @remotion/paths
evolvePath(progress: number, path: string): { strokeDasharray: string, strokeDashoffset: number }

// @remotion/motion-blur
<Trail layers={4} lagInFrames={0.5} trailOpacity={0.4}>{children}</Trail>

// Audio (from 'remotion' core)
<Audio src={staticFile('audio/file.wav')} volume={0.5} />
```
