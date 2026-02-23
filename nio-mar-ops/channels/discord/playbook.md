# Discord Community Playbook

## Server Name: NioBot HQ

## Server Identity
- Icon: Nio tier 2 sprite on `#0D1117` background
- Banner: Evolution strip (tier 1-6) with "NioBot HQ" text
- Accent color: `#4EC373` (Nio green)
- Description: "Build with Nio. Ship code. Level up."

---

## Channel Structure

### WELCOME (Category)

**#welcome**
- Nio auto-greets new members
- Pinned: What is Nio, how to get started, rules
- Read-only except for bot

**#rules**
- Keep it real. No slop, no spam, no gatekeeping.
- Share what you're building. Help others ship.
- Nio's anti-slop rules apply to the whole server.
- Read-only

**#introductions**
- Template: "What are you building? What's your stack? What's your Nio class?"
- Encourage short intros, not essays

**#roles** (Self-assign via reactions)
- Builder (green) - ships code
- Explorer (blue) - learning, exploring
- Lurker (gray) - just watching, that's cool too
- Beta Tester (gold) - testing V3 features

### NIO (Category)

**#nio-updates** (Read-only, bot posts)
- V3 feature ships
- Deploy confirmations
- Changelog entries
- Level-up announcements

**#nio-terminal** (Read-only, bot posts)
- Daily blog posts from nio.terminal
- Discussion thread per post

**#avatar-showcase**
- Members share screenshots of their Nio evolution
- Before/after comparisons
- Custom sprite concepts

**#feature-requests**
- What should Nio do next?
- Upvote via reactions
- Tag requests: chimes, avatars, personality, tools

### BUILD (Category)

**#ship-it**
- Daily accountability. Post what you shipped today.
- Nio bot reacts to posts (acknowledgment)
- Weekly "most shipped" highlight

**#code-help**
- Ask for help, share solutions
- Nio-adjacent topics preferred but not required
- Tag by language/framework

**#gtm-engineering**
- GTM ops, Clay, outreach, pipeline discussions
- Shawn's domain expertise community

**#build-in-public**
- Share progress on projects
- Screenshots, demos, learnings
- Cross-pollinate ideas

### COMMUNITY (Category)

**#general**
- Hang out. Talk about whatever.
- No rules beyond the basics.

**#memes**
- Pixel art, AI memes, Nio edits, tech humor
- Best memes get pinned monthly

**#off-topic**
- Gaming, music, life stuff
- Souls-like gaming crossover community potential

**#feedback**
- Meta feedback about the Discord, the product, the content
- Direct line to improvement

### VOICE (Category)

**#vibe-session**
- Co-working voice channel
- Screen share while building
- Nio ambient chimes playing (stretch goal)

---

## Bot Features (Nio Discord Bot)

### Welcome Message
When a new member joins:
```
Welcome to HQ, {username}.

Here's the deal: we build here. No fluff, no gatekeeping.

Drop your intro in #introductions.
Check #nio-updates for what's shipping.
Post what you're building in #ship-it.

Let's go. 💚
```

### Commands

**!nio** - Random Nio quote/tip from the soul file
**!level** - Show your current Nio level and XP
**!class** - Show your Nio class
**!shipped** - Log a ship (increments personal ship counter)
**!leaderboard** - Top shippers this week
**!evolution** - Show Nio's current avatar tier
**!soul** - Link to Nio's soul file

### Automated Posts

**Daily (8am):**
- nio.terminal blog post to #nio-terminal

**On Deploy:**
- Deploy confirmation to #nio-updates

**On Level-Up:**
- Level announcement to #nio-updates with new avatar if tier changes

**Weekly (Sunday):**
- Week recap: ships logged, messages sent, new members
- Top shipper highlight

---

## Growth Strategy

### Phase 1: Seed (0-50 members)
- Invite from X following
- Invite from blog/newsletter readers
- Personal invites to builder friends
- Post invite link in relevant communities (respectfully)

### Phase 2: Grow (50-200 members)
- Weekly challenges with recognition (not prizes, recognition)
- "Ship It" weekly challenge (most creative/ambitious ship wins spotlight)
- Cross-promote in X threads
- Guest builders for voice sessions

### Phase 3: Sustain (200+)
- Community moderators (trusted members)
- Monthly themes or build challenges
- Exclusive avatar unlocks for active members
- Community-created Nio sprite variants

---

## Moderation

### Rules (Simple)
1. No spam or self-promo without context
2. No slop (AI-generated walls of nothing)
3. Help each other ship
4. Keep it constructive
5. Nio's 13 anti-slop rules are the vibe check

### Enforcement
- Warning → Timeout → Ban
- Nio bot flags slop patterns automatically (stretch goal)
- Community self-moderates via reactions (flag system)

---

## Technical Implementation

### Bot Stack
- discord.js (Node.js)
- Hosted on Vercel Edge Functions or small VPS
- Webhook integration with OpenClaw for events
- SQLite for member progression data (or sync with NioBot DB)

### Webhooks Needed
- Vercel deploy events → #nio-updates
- Blog post publish → #nio-terminal
- Level-up events → #nio-updates
- GitHub push events → #nio-updates (optional)

---

## Metrics

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Total members | 50 | 200 | 500 |
| Daily active | 10 | 40 | 100 |
| Messages/day | 20 | 100 | 300 |
| Ships logged/week | 10 | 50 | 150 |
| 7-day retention | 40% | 50% | 60% |
