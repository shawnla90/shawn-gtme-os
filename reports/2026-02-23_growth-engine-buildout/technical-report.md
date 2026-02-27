# Growth Engine Buildout — Technical Report

**Date:** 2026-02-23
**Session scope:** Analyze Nevo David's growth hack article, map opportunities to Nio Chat, build 3 parallel growth systems
**Status:** Phase 1 complete. Phase 2 pending.

---

## What Was Done

### Source Analysis

Scraped and analyzed [@wickedguro's X article](https://x.com/wickedguro/status/2025967492359913862) (124K views, 1.3K bookmarks). Nevo David lays out 5 strategies for monetizing with OpenClaw:

1. TikTok slideshow growth hack (automated AI-generated slideshows at scale)
2. SEO content machine (agent-browser + keyword research + daily auto-publish)
3. CLI-first SaaS in crowded markets (agentic tools = blue ocean)
4. Sell Skills/templates (sell results, not tools)
5. Credibility proof (Postiz: $18k → $28k MRR in 2 weeks)

### What We Built (Phase 1)

#### 1. TikTok Slideshow Scene (Remotion)

| File | Purpose |
|------|---------|
| `website/apps/video/src/lib/timing-tiktok.ts` | 16s at 30fps, 5 slides x 3s each |
| `website/apps/video/src/lib/slideshow-data.ts` | Data-driven slide definitions, 2 slideshows ready |
| `website/apps/video/src/scenes/TikTokSlide.tsx` | Single slide component (spring animations, progress dots, brand watermark) |
| `website/apps/video/src/TikTokSlideshow.tsx` | Full composition (slide-from-right transitions, BGM, card flip sounds) |
| `website/apps/video/src/Root.tsx` | Registered `TikTokSlideshow` composition (9:16, 1080x1920) |
| `website/apps/video/package.json` | Added `npm run render:tiktok` script |

**Visual style:** Inherits Nio's dark canvas (#0D1117), JetBrains Mono, SceneWrapper (vignette + particles + grain + scanlines), accent color glow per slide. Slide-from-right transitions between cards.

**To render:** `cd website/apps/video && npm run render:tiktok`

**To add new slideshows:** Edit `slideshow-data.ts`, add a `Slide[]` array. Each slide has: headline, body, accent color, icon.

#### 2. SEO Keyword Pipeline

| File | Purpose |
|------|---------|
| `scripts/seo_keyword_pipeline.py` | Expands 30 seed keywords via Google autocomplete → scores by relevance → generates daily brief |
| `~/.openclaw/workspace/seo/daily-brief.json` | Output: target keyword + outline + meta description + runner-up keywords |
| `~/.openclaw/workspace/seo/keyword-log.json` | History of keyword selections (last 90 days) |
| `~/.openclaw/workspace/seo/used-keywords.json` | Prevents keyword repetition |
| `~/.openclaw/cron/jobs.json` | Added "SEO Keyword Pipeline" cron at 7:45 AM ET (enabled) |

**Pipeline flow:**
```
7:45 AM → seo_keyword_pipeline.py runs
         → expands 30 seeds to ~159 keywords via Google autocomplete
         → scores by: pillar relevance + long-tail bonus + intent signals + brand relevance
         → writes daily-brief.json

8:00 AM → nio daily blog generator reads daily-brief.json
         → uses target_keyword + outline to write SEO-optimized nio.log post
         → deploys to shawnos.ai
```

**Blog generator cron updated:** Now checks for SEO brief before writing. Incorporates target keyword naturally.

**First keyword selected:** "how to build ai assistant using python" (score: 95.0)

#### 3. X/Twitter Auto-Poster

| File | Purpose |
|------|---------|
| `scripts/x_auto_poster.py` | Scans content/x/final/, parses threads, posts via tweepy |
| `data/x-posting-state.json` | Tracks which files have been posted |
| `~/.openclaw/cron/jobs.json` | Added "X Auto-Poster" cron at 9 AM ET weekdays (disabled — needs API keys) |

**Content scan results:**
- 9 posts queued in `content/x/final/`
- Supports `=== TWEET N ===` delimited .txt threads + frontmatter .md posts
- Dry-run mode by default, `--live` to actually post
- `--scan` to see queue status

**Blockers:** Needs X API credentials (X_BEARER_TOKEN, X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET). Get from developer.x.com.

---

## What Still Needs To Be Done (Phase 2+)

### High Priority

- [ ] **Get X API keys** — sign up at developer.x.com, set env vars in OpenClaw
- [ ] **Enable X Auto-Poster cron** — flip `enabled: true` once keys are set
- [ ] **Review 2 over-280-char tweets** in skill-tree thread — trim before posting
- [ ] **Test TikTok render** — run `npm run render:tiktok` and review output
- [ ] **Post first TikTok slideshow** — manually upload rendered video to TikTok

### Medium Priority (SEO Enhancement)

- [ ] Extend Post frontmatter with `target_keywords`, `search_volume`, `keyword_difficulty`
- [ ] Add keyword tables to `scripts/build_index.py` SQLite schema
- [ ] Internal linking strategy based on keyword clustering
- [ ] Google Search Console API integration for real ranking data
- [ ] SEMRush/Ahrefs API for competition analysis (optional, costs money)

### Medium Priority (Content Scale)

- [ ] Auto-render TikTok slideshows via cron (wire Remotion render to scheduled task)
- [ ] Cross-post TikTok → Instagram Reels → YouTube Shorts (same 9:16 video)
- [ ] LinkedIn auto-posting API integration
- [ ] Instagram infrastructure from scratch (zero exists today)

### Long-Term (Nevo's Play #3 and #4)

- [ ] Package Nio skills for marketplace (ClaHub or similar)
- [ ] CLI interface for Nio (agentic access point for other tools)
- [ ] Sell "how to set up personal AI assistant" skill template
- [ ] Affiliate links inside skills for tools we use

---

## Key Decisions Made

1. **Python for scripts, not Node** — matches existing script patterns (build_index.py, crew_orchestrator.py, etc.)
2. **SEO runs before blog generator** — 7:45 AM keyword selection → 8:00 AM content generation
3. **X poster disabled by default** — safety-first, needs explicit API key setup
4. **Slideshow data-driven** — add new topic slideshows by editing a single data file
5. **Slide transitions use `@remotion/transitions/slide`** — not fade, because TikTok carousels feel like swiping

---

## Key File Locations

```
reports/                                          ← NEW: Phase reports live here
scripts/seo_keyword_pipeline.py                   ← SEO keyword expansion + scoring
scripts/x_auto_poster.py                          ← X/Twitter auto-posting
website/apps/video/src/TikTokSlideshow.tsx        ← TikTok slideshow composition
website/apps/video/src/scenes/TikTokSlide.tsx     ← Individual slide component
website/apps/video/src/lib/slideshow-data.ts      ← Slideshow content definitions
website/apps/video/src/lib/timing-tiktok.ts       ← TikTok timing constants
~/.openclaw/workspace/seo/daily-brief.json        ← Daily SEO target keyword
~/.openclaw/cron/jobs.json                        ← Updated with 2 new cron jobs
data/x-posting-state.json                         ← X posting tracker (created on first run)
```
