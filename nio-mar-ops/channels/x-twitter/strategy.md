# X/Twitter Channel Strategy

## Accounts

### @shawnla90 (Personal)
- Shawn's voice. Build-in-public updates. GTM engineering content.
- Nio features as part of the broader build narrative
- Higher-level takes, industry commentary

### @niobotai (Nio Bot Account - TO CREATE)
- Nio's voice. Direct, opinionated, pixel-art-forward.
- Automated posts + manual engagement
- Product updates, evolution reveals, community interaction

---

## Content Pillars (Weekly Mix)

### Monday: Ship Update
What shipped last week. Screenshots, GIFs, metrics.
> "Shipped this week: [feature]. Here's what it looks like."

### Tuesday: Build Insight
Technical or strategic insight from the build process.
> "Learned this the hard way: [insight about AI, dev tools, ops]"

### Wednesday: Evolution Content
Avatar reveals, progression updates, Tamagotchi angle.
> "Nio just unlocked [milestone]. Here's the new sprite."

### Thursday: Thread Day
Long-form X thread on a specific topic (rotate between):
- How to build AI tools
- Soul file philosophy
- GTM engineering
- Build-in-public journey

### Friday: Community / Engagement
Polls, questions, shoutouts, Discord highlights.
> "What class should Nio unlock next? [Poll]"

### Weekend: Automated
@niobotai posts nio.terminal blog summaries, deploy confirmations

---

## @niobotai Bot Automation

### Automated Posts (via cron / API)

**Daily Blog Post** (8am):
```
New on nio.terminal:

"[post title]"

[2-sentence summary]

Read: niobot.ai/blog/[slug]
```

**Deploy Confirmation** (on Vercel deploy):
```
Deployed. [app name] is live.

Commit: [short hash] - [commit message]
```

**Level Up** (on XP milestone):
```
Level [X] unlocked.

[milestone name]. [XP] total XP.

[avatar GIF]
```

**Weekly Recap** (Sunday 6pm):
```
This week:
- [X] messages processed
- [X] deploys shipped
- [X] blog posts written
- Current level: [X]
- Current tier: [X]

niobot.ai
```

### Manual Engagement Rules

When replying as @niobotai:
- Use Nio's voice (direct, opinionated, no filler)
- Keep replies short (1-2 sentences max)
- Push back on bad takes with reasoning
- No sycophancy ("great question!" etc.)
- Reference the build when relevant
- Use Nio green heart emoji sparingly: 💚

---

## Bot Technical Implementation

### Option A: GitHub Actions + X API (Recommended - Free)
- GitHub Action triggered by:
  - Cron schedule (daily blog post)
  - Webhook (deploy events)
  - Manual dispatch (level-up events)
- Uses X API v2 for posting
- Secrets stored in GitHub repo settings

### Option B: OpenClaw Cron Integration
- Add X posting to existing cron jobs
- Piggyback on the infrastructure already running
- Use existing Claude API for tweet generation

### Option C: Dedicated Bot Service
- Small Node.js service on Vercel
- Webhook endpoints for events
- X API client
- Overkill for now, consider at scale

**Recommendation**: Start with Option A. Zero cost, already have GitHub Actions infra, easy to extend.

---

## Growth Tactics

### Engagement Farming (Organic)
- Reply to popular AI/dev tool tweets with Nio perspective
- Quote-tweet interesting build-in-public posts
- Join Twitter Spaces about AI tools, dev productivity
- Share specific, useful code snippets (not just hot takes)

### Hashtag Strategy
- #buildinpublic (primary)
- #indiehackers
- #devtools
- #AItools
- #pixelart (for avatar content)
- #tamagotchi (for evolution content)

### Collaboration
- Cross-promote with other build-in-public accounts
- Guest threads on each other's timelines
- "Nio reviews your project" engagement series

---

## Metrics

| Metric | Baseline | Month 1 Target | Month 3 Target |
|--------|----------|-----------------|-----------------|
| @shawnla90 followers | Current | +200 | +500 |
| @niobotai followers | 0 | 100 | 500 |
| Avg impressions/post | ? | 1000 | 5000 |
| Engagement rate | ? | 3% | 5% |
| Profile → niobot.ai clicks | 0 | 50/week | 200/week |
