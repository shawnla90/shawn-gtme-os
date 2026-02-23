# niobot.ai Domain Launch Campaign

## Campaign: "Nio Has a Home"

**Objective**: Establish niobot.ai as the product hub for Nio
**Timing**: Week of domain purchase (this week target)
**Duration**: Launch sprint (3 days) then ongoing content

---

## Domain Strategy

### DNS Setup
- Primary: niobot.ai → Vercel deployment
- Subdomain: app.niobot.ai → nio-chat (future, when ready for public)
- Subdomain: docs.niobot.ai → documentation (future)

### SEO Targets
- "AI Tamagotchi"
- "AI build partner"
- "AI assistant with personality"
- "pixel art AI tool"
- "AI that levels up"

---

## Landing Page (V1 - Minimal)

Ship fast. One page. No over-engineering.

### Structure

```
[Nav: Logo | Evolution | Soul | Discord]

[Hero]
  Nio sprite (animated, tier 2, centered)
  "The AI that levels up with you."
  [Meet Nio] → scroll to evolution
  [Join Discord] → invite link

[Evolution Section]
  "Your Nio evolves as you build."
  6 tier sprites in a row with labels
  Brief description of each tier
  XP mechanics explained in 2 sentences

[Soul Section]
  "Nio has opinions."
  3 key personality traits
  Anti-slop rules highlight
  Link to full soul file (on GitHub)

[Community Section]
  "Build with others."
  Discord invite embed
  X/Twitter follow
  RSS feed link

[Footer]
  Built by Shawn Tenam
  Part of the GTMe OS
  shawnos.ai | thegtmos.ai
```

### Tech Stack
- Next.js (consistent with existing apps)
- Tailwind CSS
- Dark theme (`#0D1117` background)
- Nio green (`#4EC373`) accents
- Deploy on Vercel

---

## Content Plan for niobot.ai

### Pages (Launch)

1. **/** - Landing page (above)
2. **/evolution** - Full avatar gallery with tier descriptions
3. **/soul** - Nio's personality philosophy, voice rules, anti-slop
4. **/changelog** - V3 features, shipped updates
5. **/blog** - Syndicated from nio.terminal

### Pages (Post-Launch)

6. **/quiz** - "What class is your Nio?" personality quiz
7. **/community** - Discord, X, links, contributor info
8. **/docs** - API docs if/when Nio becomes a public tool

---

## RSS Feeds

### /rss/blog
- Source: nio.terminal daily posts
- Format: RSS 2.0 + Atom
- Auto-generated from blog content
- Syndicate to: Dev.to, Feedly, various aggregators

### /rss/changelog
- Source: git commits + manual entries
- Format: RSS 2.0
- Subscribers get notified of every feature ship

---

## Launch Announcement

### X Post (Day of DNS propagation):
> niobot.ai is live.
>
> Nio has a home now.
>
> - Evolution tiers
> - Soul file philosophy
> - Community Discord
> - Daily blog via nio.terminal
>
> This is where it all compounds.
>
> [Screenshot of landing page]

### Blog Post:
**Title**: "Why Nio Needed His Own Domain"
**Angle**: When your AI mascot outgrows being a feature and becomes a product

---

## Metrics

| Metric | Target (Month 1) |
|--------|-------------------|
| Unique visitors | 2000+ |
| Avg time on site | 45s+ |
| Discord click-through | 5%+ |
| RSS subscribers | 50+ |
| Return visitors | 20%+ |
