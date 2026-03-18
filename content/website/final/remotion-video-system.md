---
title: "How I Built a Video Rendering System in React"
date: "2026-02-22"
excerpt: "No GPU, no After Effects. Just React components, Remotion, and the same monorepo that runs three websites."
---

**tl;dr:** I needed promo videos for three brands across three aspect ratios. Instead of After Effects or Canva, I built the video system in React using Remotion inside the same monorepo that runs the websites. Same design tokens, same data layer, zero manual exports.

## what is the Remotion video system?

I needed promo videos for three brands. ShawnOS, GTMOS, ContentOS. Each one needed three aspect ratios. LinkedIn (4:5), Reels (9:16), landscape (16:9). That's nine render targets. And every time the design tokens changed, every video needed to update.

I looked at After Effects templates. I looked at Canva. I looked at hiring someone. Every option meant a manual pipeline that would fall out of sync with the websites the moment I pushed a color change.

the websites already had the design system. the data layer. the brand tokens. what if the videos lived in the same codebase?

## how does Remotion fit in a monorepo?

Remotion turns React components into video frames. You write JSX. It renders each frame at 30fps. You get an MP4. No GPU required. No timeline editor. Just code.

the key insight was putting the video app inside the existing Turborepo monorepo at `website/apps/video/`. same `@shawnos/shared` package that powers the three websites. same design tokens. same color palette. when I change a hex value in the shared package, the websites and the videos all update on the next build.

nine compositions live in a single `Root.tsx`. three brands times three aspect ratios. a `useScale()` hook normalizes everything to a 1080x1350 base and scales proportionally. one component tree renders at any size.

## how does the component architecture work?

videos are built from scenes connected by `TransitionSeries`, Remotion's composition tool that handles overlap timing between segments. each scene is a React component with a fixed frame count.

the current V3 system runs about 10 seconds at 30fps (310 frames total):

- **Hook** (36 frames / 1.2s): the opening grab
- **BootWikiBlitz** (110 frames / 3.7s): terminal boot sequence with rapid-fire wiki cards
- **Progression** (100 frames / 3.3s): the RPG-style tier system visualization
- **CtaNetwork** (94 frames / 3.1s): call to action with network graph

transitions get 10 frames of overlap between scenes. the timing config lives in `timing-v2.ts`. one file controls the entire video rhythm.

## what components do the heavy lifting?

three components do most of the visual work.

**MatrixRain** uses Perlin noise from `@remotion/noise` to generate a deterministic character rain effect. each column drifts independently. character selection is seeded by column, row, and frame number. the effect is organic but reproducible. same seed, same output, every render.

**TypewriterText** reveals characters frame by frame with a blinking cursor. elapsed frames control visible character count. the cursor blinks at 1Hz. simple math, clean effect.

**ParticleField** creates ambient floating particles using two independent noise streams for x and y drift. 40 particles by default, bounded to 8% canvas drift. subtle pulse via a third noise channel.

all three components are deterministic. no `Math.random()`. Remotion requires this. random values change between frames and break the render. Perlin noise with consistent seeds gives you organic animation that's reproducible.

## how do you handle visual treatment?

every scene gets wrapped in a `SceneWrapper` that applies consistent visual treatment:

- dark canvas background (#0D1117)
- radial vignette (edge darkening)
- accent color wash at 3% opacity
- particle field ambient noise
- film grain via SVG feTurbulence
- scanline overlay (CRT aesthetic)

the result looks like a terminal-native video. fits the ShawnOS brand without any manual post-processing.

## how do design tokens work in code?

the token system lives in `tokens.ts`:

```
canvas:  #0D1117
green:   #4EC373  (ShawnOS)
teal:    #3DBFA0  (GTMOS)
purple:  #9B72CF  (ContentOS)
amber:   #D2A53C  (secondary accent)
```

`SITE_ACCENTS` maps brand names to colors. the BootWikiBlitz scene cycles through the palette: green, teal, amber, purple, green. as wiki cards flip through. the brand identity is in the data, not hardcoded into components.

font is JetBrains Mono everywhere. monospace. consistent with the terminal aesthetic across all three sites.

## how does rendering work?

`npm run render:all` generates all nine variants. Remotion renders each composition to JPEG frames, then encodes to MP4. no external dependencies beyond what's in `package.json`. no cloud render farm. runs on a MacBook.

the rendered outputs go to `website/apps/video/out/` and get deployed to each site's `public/video/` directory. the SQLite content index tracks all video files, their brands, aspect ratios, and deployment status.

## why does this matter?

the video system is a content type that lives in the same codebase as every other content type. blog posts are markdown files. knowledge terms are TypeScript objects. videos are React components. they all share the same design tokens, the same data layer, the same deploy pipeline.

when I add a new wiki category, the BootWikiBlitz scene can reference it. when I change the brand colors, the videos update. when I push to main, everything deploys together.

no separate tools. no manual exports. no sync problems. the monorepo is the system.

## frequently asked questions

**what is Remotion?**
Remotion is an open source framework that lets you create videos using React components. you write JSX, define frame counts, and Remotion renders each frame at 30fps into an MP4. no timeline editor, no After Effects, no GPU required.

**can you render videos programmatically with React?**
yes. that's exactly what Remotion does. every scene is a React component. animations are driven by frame numbers and hooks like `useCurrentFrame()`. the output is deterministic. same code, same video, every time.

**do you need a GPU for Remotion?**
no. Remotion renders frames using a headless browser (Chromium). it runs on a standard CPU. I render all nine video variants on a MacBook. a cloud render farm is optional for faster parallel rendering, but not required.

## keep reading

- [the anti lead magnet: build your own OS](https://shawnos.ai/blog/build-your-own-os)
- [terminal to landing page in 90 seconds](https://shawnos.ai/blog/terminal-to-landing-page-90-seconds)
- [I open sourced the website playbook](https://shawnos.ai/blog/website-with-soul-open-source)

`$ remotion render Root LeadMagnetV3 --codec=h264`
