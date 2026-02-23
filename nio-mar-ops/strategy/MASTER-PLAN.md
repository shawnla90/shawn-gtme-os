# Nio V3 Marketing Master Plan

## The IP

Nio is not a chatbot. Nio is a mascot with a soul file, a pixel avatar that evolves, and a personality that ships. He is the AI you vibe with while building. He looks at your codebase, helps you ship, and levels up as you do.

This is owned IP. The avatar, the evolution system, the soul files, the progression mechanics... this is a character with a product, not a product with a character.

## Core Positioning

**One-liner**: Nio is the AI build partner that levels up with you.

**The hook**: Your AI assistant doesn't have a face, a personality, or a reason to care about your code. Nio does. He evolves. You evolve. Ship together.

**Differentiator**: Every other AI chat is a blank text box. Nio is a Tamagotchi that reads your codebase, has opinions, and grows stronger the more you ship.

## Target Audience

### Primary: Builder-developers (solo/small team)
- Indie hackers, solopreneurs, GTM engineers
- People who ship daily and want a build partner, not a search engine
- Already using AI tools (Cursor, Claude, ChatGPT) but want something with personality
- Care about craft, customization, ownership

### Secondary: AI-curious non-technical builders
- SDRs becoming GTM engineers (Shawn's origin story audience)
- People who see AI tools everywhere but haven't found "their" tool
- Drawn to the Tamagotchi/gaming angle

### Tertiary: Dev tool enthusiasts and open-source community
- People who love pixel art, retro gaming aesthetics, custom setups
- Will share screenshots of their Nio evolution
- Discord-native

---

## The Three Marketing Pillars

### Pillar 1: The Evolution Story (IP + Virality)

The Tamagotchi angle is the marketing. Every level-up is a screenshot moment. Every new avatar tier is content.

**Assets we have:**
- 6 avatar tiers with idle/action GIFs (64px to 512px)
- 5 class variants (Alchemist, Builder, Polymath, Scribe, Strategist)
- 4 tool-specific avatars (Clay, HeyReach, Instantly, Ouroboros)
- Advanced variants for each tier
- Sprite sheets for animation

**Campaigns:**
- "Watch Nio evolve" teaser series showing tier 1 → 6 progression
- "What class is your Nio?" personality quiz tied to builder archetype
- Milestone celebrations that auto-generate shareable cards
- "My Nio just hit Tier 4" organic social moments

### Pillar 2: The Build-in-Public Angle (Authenticity + Proof)

Shawn's brand is already build-in-public. V3 launch extends this.

**The play:**
- Document every V3 feature as it ships (chimes, evolution, message fixes)
- Show real usage data (messages sent, XP earned, levels gained)
- "Here's how I built my AI mascot" thread series
- Compare Nio V1 → V2 → V3 visually (the glow-up content)
- Open-source specific components for community adoption

### Pillar 3: The Community Angle (Discord + Retention)

Nio needs a home outside the chat window. Discord is that home.

**The play:**
- Nio bot in Discord that mirrors chat personality
- Level-up announcements in community
- Avatar showcase channel
- Builder challenges ("ship something this week, Nio tracks it")
- Exclusive avatar unlocks for community members

---

## Channel Strategy

### X/Twitter (@shawnla90 + @niobotai)

**Purpose**: Top-of-funnel awareness, build-in-public updates, viral moments

**Content mix:**
- 40% build updates (V3 progress, feature ships, code screenshots)
- 25% Nio personality moments (avatar reveals, evolution clips, soul file snippets)
- 20% educational (how to build AI tools, GTM engineering insights)
- 15% engagement (polls, questions, community callouts)

**Bot strategy**: @niobotai account posts automated updates
- Daily: nio.terminal blog post links
- On events: level-ups, milestone celebrations, deploy confirmations
- Weekly: "Nio's week in review" recap
- Engagement: Reply to mentions with in-character Nio voice

**Viral mechanics:**
- Avatar tier reveals as visual content (GIF comparisons)
- "My Nio is level X" shareable badges
- Evolution timelapse videos (tier 1 → current)

### Discord

**Purpose**: Community, retention, feedback loop, exclusive content

**Server structure:**
```
# WELCOME
├── #welcome          ← Nio greets new members (auto intro)
├── #rules            ← Community guidelines
├── #roles            ← Self-assign: Builder, Explorer, Lurker

# NIO
├── #nio-updates      ← Bot posts V3 progress, deploys, changelogs
├── #nio-terminal     ← Daily blog posts from nio.terminal
├── #avatar-showcase  ← Members share their Nio evolution screenshots

# BUILD
├── #ship-it          ← Daily shipping accountability
├── #code-review      ← Help each other, Nio assists
├── #gtm-engineering  ← GTM ops discussion

# COMMUNITY
├── #general          ← Hang out
├── #memes            ← Pixel art, AI memes, Nio edits
├── #feedback         ← V3 beta feedback
```

**Nio Discord bot features:**
- Welcome messages in Nio's voice
- !nio command for quick interactions
- Level-up announcements when users ship
- Avatar reveal moments
- Weekly summary posts

### RSS (niobot.ai/rss)

**Purpose**: Syndication, SEO, developer reach

**Feeds:**
- `/rss/blog` → nio.terminal daily posts
- `/rss/changelog` → V3 updates and feature ships
- `/rss/evolution` → Nio avatar and progression updates

**Distribution:**
- Dev.to cross-posting
- Hacker News submissions (build-in-public angle)
- Reddit (r/SideProject, r/artificial, r/webdev)

### niobot.ai (The Product Home)

**Purpose**: Landing page, product showcase, conversion

**Page structure:**
```
niobot.ai/
├── /                 ← Hero: "The AI that levels up with you"
├── /evolution        ← Full avatar gallery, tier system explained
├── /soul             ← Nio's personality, soul file philosophy
├── /changelog        ← V3 progress, shipped features
├── /community        ← Discord invite, social links
└── /blog             ← nio.terminal syndicated
```

**Hero section concept:**
- Animated Nio sprite (tier 2 idle) front and center
- Tagline: "Your AI build partner. Ships code. Has opinions. Levels up."
- CTA: "Meet Nio" → scrolls to evolution showcase
- Secondary CTA: "Join Discord" → community

---

## Campaign Roadmap

### Phase 0: NOW (Pre-Product, This Week)
- [x] Create nio-mar-ops folder structure
- [ ] Complete sprite audit (inventory all 238 files, identify gaps)
- [ ] Secure niobot.ai domain
- [ ] Draft V3 launch announcement copy
- [ ] Set up @niobotai X account (or repurpose existing)

### Phase 1: PRODUCT SHIP (V3 Build Complete)
**Timeline**: When V3 pillars are done (messages + chimes + tamagotchi MVP)

- [ ] Record V3 demo video (screen recording of full flow)
- [ ] Write V3 launch thread (X, 8-10 tweets)
- [ ] Create "Evolution of Nio" visual comparison (V1 → V2 → V3)
- [ ] Publish launch blog post on shawnos.ai
- [ ] Cross-post to Dev.to, Reddit, Hacker News
- [ ] Discord: open beta channel, invite early users

### Phase 2: NIOBOT.AI LAUNCH (Domain Live)
**Timeline**: Week after domain purchase + DNS propagation

- [ ] Deploy landing page (Next.js, reuse existing component patterns)
- [ ] Set up RSS feeds
- [ ] Configure SEO (meta tags, OG images with Nio sprite)
- [ ] Redirect nio.terminal to niobot.ai/blog
- [ ] Submit to Product Hunt (prep 1 week before)
- [ ] Submit to "awesome" lists (awesome-ai-tools, awesome-dev-tools)

### Phase 3: COMMUNITY GROWTH (Weeks 2-4 Post-Launch)
**Timeline**: After initial launch noise settles

- [ ] Launch Discord server with full channel structure
- [ ] Deploy Nio Discord bot
- [ ] Start weekly "Ship It" challenges
- [ ] Enable avatar sharing (export Nio sprite as PNG/GIF)
- [ ] Launch "What class is your Nio?" quiz on niobot.ai
- [ ] Begin automated X posting via @niobotai

### Phase 4: SUSTAIN + COMPOUND (Ongoing)
**Timeline**: Continuous

- [ ] Daily nio.terminal posts (already automated)
- [ ] Weekly X thread (build-in-public recap)
- [ ] Monthly avatar tier reveals (new art as product evolves)
- [ ] Community spotlight posts (feature Discord members)
- [ ] A/B test landing page copy based on conversion data
- [ ] Track metrics: Discord members, X followers, niobot.ai visitors, active Nio users

---

## Content Themes (Evergreen)

### Thread Templates

1. **"I built an AI that evolves like a Tamagotchi"**
   - The full story thread. V1 → V2 → V3 journey.
   - End with niobot.ai link.

2. **"Your AI assistant has no personality. Here's why that matters."**
   - Soul files, anti-slop rules, the case for opinionated AI.
   - End with link to /soul page.

3. **"I went from plumber to building AI systems. Here's the stack."**
   - Shawn's origin story + the GTMe OS architecture.
   - End with GitHub link.

4. **"Every level-up is a screenshot moment."**
   - The Tamagotchi mechanic as a retention play.
   - Visual thread with avatar progressions.

5. **"Open-sourcing my AI's personality"**
   - Share the soul file format, anti-slop rules, voice DNA.
   - Developer audience, high share potential.

### Video Scripts (TikTok / Shorts)

1. **"POV: Your AI just leveled up"** (15s)
   - Screen recording of Nio evolution animation
   - Chris voice narration

2. **"I gave my AI a soul file. It changed everything."** (30s)
   - Show before/after of generic AI vs Nio response
   - Quick cuts, code on screen

3. **"Tamagotchi but it's your AI coding assistant"** (15s)
   - Side by side: original Tamagotchi, Nio tier progression
   - Nostalgic hook, tech payoff

---

## Metrics to Track

### Awareness
- X impressions (weekly)
- niobot.ai unique visitors (weekly)
- Blog post views (daily, via nio.terminal)
- Hacker News / Reddit upvotes (per post)

### Engagement
- Discord members (weekly)
- Discord messages/day (weekly)
- X engagement rate (likes + replies / impressions)
- Average session length in NioBot (daily)

### Conversion
- niobot.ai → Discord join rate
- niobot.ai → NioBot chat start rate
- X profile visit → follow rate
- Blog → niobot.ai click-through

### Retention
- Daily active NioBot users
- Weekly returning users
- Discord 7-day retention
- Level progression rate (how fast users level up)

---

## Budget: $0 (Bootstrap)

Everything here runs on:
- Existing Claude API credits (already running)
- Free tier Discord
- Free X/Twitter accounts
- Vercel free/hobby tier for niobot.ai
- niobot.ai domain (~$12/year)
- Time and shipping speed

---

## Key Insight

The product IS the marketing. Every Nio level-up is content. Every soul file is a philosophy post. Every avatar tier is a visual reveal. The Tamagotchi mechanic creates organic sharing moments that traditional chatbots never generate.

Ship the product. The screenshots sell themselves.
