# /video — Remotion Video Production Skill

Renders programmatic highlight reel videos for the ShawnOS network using Remotion. Videos pull live data from shared wiki/knowledge base files — counts update automatically on re-render.

## When to Use

- After adding new wiki entries (counts auto-update)
- When creating a new site video (theGTMOS.ai, theContentOS.ai)
- After changing design tokens or branding
- When you want fresh video files for social media
- User types `/video`

---

## V3 Production Formula (The Standard)

Every site video follows this exact formula. Content changes per site, but structure/timing/speed stays locked.

### Timing

| Parameter | Value |
|-----------|-------|
| **FPS** | 30 |
| **Total duration** | 10-11 seconds (300-330 frames) |
| **Transition overlap** | 10 frames (~0.33s) between scenes |
| **Playback on homepage** | 1.2x speed |

### 4-Scene Structure

Every video has exactly 4 scenes in this order:

| Scene | Frames | Duration | Purpose |
|-------|--------|----------|---------|
| **1. Hook** | 36f | 1.2s | Big stat punch — dynamic count + "and growing" |
| **2. Boot + Blitz** | 110f | 3.7s | Terminal boot (22f) → rapid-fire content cards (15f each) |
| **3. Progression/Showcase** | 100f | 3.3s | Visual montage → reveal → hold |
| **4. CTA + Network** | 94f | 3.1s | Site network → stats → CTA end card |

### Speed Rules

- **Wiki/content cards**: 15 frames each (0.5s). Slide-in: 3f. Hold: 8f. Wipe-out: 4f.
- **Boot sequence**: 22 frames. Typewriter at 1.5x speed. Bar fills in 12f.
- **Montage items**: 10 frames each. Snappy spring (stiffness: 300).
- **Transitions**: fade or wipe, always 10f overlap.
- **Springs**: damping 10-14, stiffness 180-300. Higher stiffness = snappier.
- **No dead air**: every frame should have motion or purpose.

### Visual Standards

- **Big numbers**: s(96) font, weight 800, green glow shadow
- **Stats**: stacked column layout — big bold number on top, small label below
- **Content cards**: slide in from right (+50px), wipe out to left (-40px)
- **Avatars/images**: centered vertically, `alignItems: 'center'`, never clip off-screen
- **Sequential reveals**: stagger springs 6 frames apart per item
- **Particles**: SceneWrapper with 20-30 noise particles per scene
- **Flash transitions**: white overlay, peak 0.8 opacity, 10-12 frame duration

### Audio

Every video has these layers:
- **BGM**: looping ambient track, fade in 10f, fade out 10f
- **Boot beep**: frame 0 of Hook
- **Key clicks**: during typewriter sequences
- **Card flip**: at start of each content card
- **Level-up/whoosh**: at scene transitions or reveals
- **Resolve**: at CTA reveal

---

## Creating a New Site Video

### Step 1: Plan the Content

Each site maps to different content in the 4-scene structure:

| Scene | shawnos.ai | theGTMOS.ai | theContentOS.ai |
|-------|-----------|-------------|-----------------|
| **Hook** | "200+ free wiki pages" | GTM-specific stat | Content-specific stat |
| **Blitz** | Wiki categories | GTM tools/plays | Platform playbooks (LinkedIn, X, Reddit, etc.) |
| **Showcase** | RPG class avatars | GTM pipeline stages or plays | Content formats or platform icons |
| **CTA** | 3-site network | GTM ecosystem | Content ecosystem |

### Step 2: Create the Data

In `website/apps/video/src/lib/data.ts`, add site-specific montage data:

```typescript
// Example: theContentOS.ai blitz cards
export const CONTENT_OS_MONTAGE = [
  { name: 'LinkedIn', count: XX, label: 'playbooks', highlights: ['Algorithm', 'Hooks', 'Carousel'] },
  { name: 'X / Twitter', count: XX, label: 'templates', highlights: ['Threads', 'Micro-tips', 'Compression'] },
  { name: 'Reddit', count: XX, label: 'strategies', highlights: ['SEO Growth', 'Community', 'AMAs'] },
  { name: 'Substack', count: XX, label: 'guides', highlights: ['Newsletter', 'Growth', 'Repurpose'] },
  { name: 'YouTube', count: XX, label: 'formats', highlights: ['Walkthroughs', 'Builder Systems', 'Shorts'] },
];
```

### Step 3: Create Scene Components

Copy the V3 scene files as templates:
- `HookV2.tsx` → `HookGTM.tsx` or `HookContent.tsx`
- `BootWikiBlitz.tsx` → adapt card data
- `ProgressionV2.tsx` → swap avatars/images for site-specific visuals
- `CtaNetwork.tsx` → update site names, taglines, CTA URL

### Step 4: Create Composition

In `Root.tsx`, add new compositions:

```typescript
<Composition
  id="ContentOSLandscape"
  component={ContentOSVideo}
  durationInFrames={310}
  fps={30}
  width={1920}
  height={1080}
/>
```

### Step 5: Render + Deploy

```bash
cd website/apps/video

# Preview in Remotion Studio
npx remotion studio src/index.ts

# Render landscape for website embed
npx remotion render src/index.ts ContentOSLandscape out/contentos-landscape.mp4

# Deploy to site
cp out/contentos-landscape.mp4 ../thecontentos/public/video/highlight-reel.mp4
```

---

## Render Commands (Current)

```bash
cd website/apps/video

# Remotion Studio (live preview)
npx remotion studio src/index.ts

# V3 renders (10s, with audio + transitions)
npm run render:linkedin     # 1080x1350 (4:5)
npm run render:reels        # 1080x1920 (9:16)
npm run render:landscape    # 1920x1080 (16:9)
npm run render:all          # All three

# Deploy landscape to shawnos.ai homepage
cp out/lead-magnet-v3-landscape.mp4 ../shawnos/public/video/lead-magnet.mp4
```

## Output Locations

```
website/apps/video/out/
├── lead-magnet-v3-linkedin.mp4   # LinkedIn feed (4:5)
├── lead-magnet-v3-reels.mp4      # IG Reels / TikTok (9:16)
└── lead-magnet-v3-landscape.mp4  # YouTube / website (16:9)
```

## Architecture

```
website/apps/video/
├── src/
│   ├── index.ts                  # Remotion entry point
│   ├── Root.tsx                   # All compositions (3 sizes × N videos)
│   ├── LeadMagnetV2.tsx          # V3 main composition (4 scenes + BGM)
│   ├── scenes/
│   │   ├── HookV2.tsx            # Scene 1: stat punch
│   │   ├── BootWikiBlitz.tsx     # Scene 2: terminal boot + content cards
│   │   ├── ProgressionV2.tsx     # Scene 3: visual montage + reveal
│   │   └── CtaNetwork.tsx        # Scene 4: network + CTA end card
│   ├── components/
│   │   ├── SceneWrapper.tsx      # Shared scene container (gradient + particles)
│   │   ├── TerminalChrome.tsx    # macOS-style terminal window
│   │   ├── WikiCard.tsx          # Content card (count + highlights)
│   │   ├── TypewriterText.tsx    # Animated typewriter text
│   │   ├── ConnectionLines.tsx   # SVG connection lines between elements
│   │   └── MatrixRain.tsx        # Matrix-style background effect
│   └── lib/
│       ├── tokens.ts             # Design tokens (colors, fonts)
│       ├── timing-v2.ts          # Scene timing (310 frames, 30fps)
│       ├── data.ts               # Live data from @shawnos/shared
│       ├── sounds.ts             # Audio file paths + volume levels
│       └── useScale.ts           # Responsive scaling hook
├── public/
│   ├── audio/                    # SFX + BGM audio files
│   └── progression/avatars/      # RPG avatar PNGs
└── out/                           # Rendered MP4s (gitignored)
```

## Data-Driven Content

Videos import entry counts from `@shawnos/shared/data/*`:
- Clay Wiki, Context Wiki, How-To Wiki, Content Wiki (page counts)
- GTM Terms, Email Infrastructure, Engineering Terms (term counts)

Adding a wiki entry → next render auto-updates the count. No manual editing.

## Troubleshooting

- **"Cannot find module 'remotion'"** — Run `npm install` from `website/` root
- **Render fails with Chromium error** — Run `npx remotion browser ensure`
- **TypeScript errors** — Run `cd website/apps/video && npx tsc --noEmit`
- **Counts look wrong** — Check data files in `packages/shared/data/`
- **Video doesn't play on site** — Verify `public/video/lead-magnet.mp4` exists, check browser autoplay policies
