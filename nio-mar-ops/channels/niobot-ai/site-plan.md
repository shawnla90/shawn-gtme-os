# niobot.ai Site Plan

## Domain

**Status**: Purchasing this week
**Registrar**: TBD
**DNS**: Point to Vercel

---

## Architecture

### Option: Standalone Next.js App (Recommended)
- New app in monorepo: `website/apps/niobot-ai/`
- Shares design tokens with nio-chat and mission-control
- Deploys independently on Vercel
- Can import components from nio-chat where useful

### Why Standalone vs. Adding to Existing Sites
- niobot.ai is a product site, not a personal site
- Different audience than shawnos.ai (developers vs. GTM audience)
- Clean URL structure without path prefixes
- Independent deploy cycle

---

## Pages

### / (Landing)

**Hero:**
- Animated Nio sprite (tier 2 idle, 256px, centered)
- H1: "The AI that levels up with you."
- Subtitle: "Nio is your build partner. Ships code. Has opinions. Evolves."
- CTA 1: "See the Evolution" (scroll)
- CTA 2: "Join Discord" (external)

**Evolution Section:**
- H2: "Your Nio grows as you ship."
- 6 tier sprites in horizontal scroll/grid
- Brief label per tier: Spark, Learner, Builder, Specialist, Master, Legend
- "Every message, every deploy, every build session earns XP."

**Personality Section:**
- H2: "AI with a soul file."
- 3 cards:
  - "Opinionated" - Pushes back on bad ideas
  - "Anti-slop" - 13 rules for clean communication
  - "Evolving" - Personality deepens with context
- Link: "Read the full soul file"

**Social Proof Section (Post-Launch):**
- Discord member count
- Messages processed
- Levels earned collectively
- Testimonials/quotes

**Footer:**
- Built by Shawn Tenam
- Part of GTMe OS
- Links: shawnos.ai, thegtmos.ai, GitHub
- RSS feed links

### /evolution
- Full avatar gallery
- All 6 tiers with descriptions and unlock conditions
- All 5 classes with descriptions
- Tool mastery avatars
- Interactive: hover/click to see action animations

### /soul
- Nio's personality philosophy
- Voice rules and anti-slop patterns
- How soul files work
- Why personality matters for AI tools
- Link to source on GitHub

### /changelog
- Reverse-chronological feature list
- Each entry: date, title, description, tag (feature/fix/improvement)
- Auto-generated from git or manual entries

### /blog
- Syndicated from nio.terminal
- Individual post pages for SEO
- Tags/categories
- RSS auto-discovery

### /quiz (Post-Launch)
- "What class is your Nio?"
- 5-7 questions about building style
- Maps to: Alchemist, Builder, Polymath, Scribe, Strategist
- Shareable result card with class avatar

---

## Design System

### Colors
- Background: `#0D1117` (GitHub dark)
- Surface: `#161B22`
- Border: `#30363D`
- Text primary: `#E6EDF3`
- Text secondary: `#8B949E`
- Nio Green: `#4EC373` (accent, links, CTAs)
- Architect Blue: `#6B8AFF` (secondary)
- Writer Orange: `#FF8A6B` (tertiary)

### Typography
- Headings: System monospace or JetBrains Mono
- Body: System sans-serif (Inter or system stack)
- Code: JetBrains Mono

### Components
- Dark theme only (no light mode)
- Pixel art sprites rendered at integer scales (no anti-aliasing blur)
- CSS `image-rendering: pixelated` for all sprite elements
- Subtle green glow on interactive elements
- Terminal-aesthetic cards and containers

---

## SEO Strategy

### Target Keywords
- "AI build partner"
- "AI assistant with personality"
- "AI Tamagotchi"
- "pixel art AI tool"
- "AI that evolves"
- "AI soul file"
- "developer AI companion"

### Meta Tags (Home)
```
title: NioBot - The AI That Levels Up With You
description: Nio is your AI build partner with pixel art avatars,
  evolution tiers, and a soul file. Ship code. Earn XP. Evolve.
og:image: [Nio sprite on dark background with tagline]
```

### Structured Data
- SoftwareApplication schema
- FAQ schema on /soul page
- Blog posting schema on /blog posts

---

## Analytics

- Vercel Analytics (built-in, free)
- Track: page views, unique visitors, referral sources
- Goals: Discord click, blog read, evolution page scroll depth
- No third-party trackers (respect privacy, match builder audience values)
