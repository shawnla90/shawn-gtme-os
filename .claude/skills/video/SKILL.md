# /video — Render the ShawnOS Highlight Reel

Re-renders the 60-second programmatic highlight reel video using Remotion. The video pulls live data from the shared wiki/knowledge base files, so rendering after adding new entries automatically updates the counts.

## When to Use

- After adding new wiki entries (counts update automatically)
- After changing design tokens or branding
- When you want fresh video files for social media
- User types `/video`

## Render Commands

Run from the monorepo root (`website/`):

```bash
# Open Remotion Studio for live preview and timing adjustments
cd website/apps/video && npx remotion studio src/index.ts

# Render LinkedIn format (1080x1350, primary)
cd website/apps/video && npm run render:linkedin

# Render Instagram Reels / TikTok format (1080x1920)
cd website/apps/video && npm run render:reels

# Render YouTube / website embed format (1920x1080)
cd website/apps/video && npm run render:landscape

# Render all three formats
cd website/apps/video && npm run render:all
```

## Output Locations

Rendered videos go to `website/apps/video/out/`:
- `lead-magnet-linkedin.mp4` — LinkedIn feed (4:5)
- `lead-magnet-reels.mp4` — IG Reels / TikTok (9:16)
- `lead-magnet-landscape.mp4` — YouTube / website (16:9)

## Deploying to Website

After rendering the landscape version for the website embed:

```bash
cp website/apps/video/out/lead-magnet-landscape.mp4 website/apps/shawnos/public/video/lead-magnet.mp4
```

The homepage `VideoShowcase` component loads from `/video/lead-magnet.mp4`.

## Architecture

```
website/apps/video/
├── src/
│   ├── index.ts              # Remotion entry point
│   ├── Root.tsx               # 3 compositions (LinkedIn, Reels, Landscape)
│   ├── LeadMagnet.tsx         # Main 60s composition (6 scenes)
│   ├── scenes/                # 6 scene components (Hook → CTA)
│   ├── components/            # 7 reusable Remotion components
│   └── lib/
│       ├── tokens.ts          # Design tokens (from shared CSS)
│       ├── timing.ts          # Scene timing (frames, FPS, presets)
│       └── data.ts            # Live data imports from @shawnos/shared
├── public/progression/avatars/ # RPG avatar PNGs
└── out/                        # Rendered MP4s (gitignored)
```

## Data-Driven Content

The video imports entry counts directly from `@shawnos/shared/data/*`:
- Clay Wiki, Context Wiki, How-To Wiki, Content Wiki entries
- GTM Terms, Email Infrastructure, Engineering Terms

When you add a wiki entry, the next render automatically shows the updated count. No manual editing needed.

## First-Time Setup

Remotion requires Chromium for rendering. On first render, it may download Chromium automatically. If it doesn't:

```bash
npx remotion browser ensure
```

## Troubleshooting

- **"Cannot find module 'remotion'"** — Run `npm install` from `website/` root
- **Render fails with Chromium error** — Run `npx remotion browser ensure`
- **TypeScript errors** — Run `cd website/apps/video && npx tsc --noEmit` to check
- **Counts look wrong** — Check the data files in `packages/shared/data/`
