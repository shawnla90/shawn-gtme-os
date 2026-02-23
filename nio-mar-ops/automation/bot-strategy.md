# Automation & Bot Strategy

## Overview

Three automated systems feed the marketing machine. All run on existing infrastructure (OpenClaw crons, GitHub Actions, Vercel).

---

## System 1: X/Twitter Bot (@niobotai)

### Purpose
Automated content posting + engagement in Nio's voice

### Event Triggers

| Event | Source | Action |
|-------|--------|--------|
| Blog post published | nio.terminal cron (8am) | Tweet blog title + link |
| Vercel deploy | Vercel webhook | Tweet deploy confirmation |
| Level up | Progression system | Tweet level + avatar |
| Milestone unlocked | Progression system | Tweet milestone |
| Weekly recap | Sunday 6pm cron | Tweet week stats |

### Implementation Plan

**Phase 1: Manual posting via scripts**
- Node.js script that posts to X API v2
- Run manually or via GitHub Actions dispatch
- Template-based: fill in variables, script formats and posts

**Phase 2: Cron-automated posting**
- Add to OpenClaw cron jobs
- Blog post trigger: watch for new files in nio-blog/
- Deploy trigger: Vercel webhook → OpenClaw → tweet
- Level trigger: watch progression profile.json for changes

**Phase 3: AI-generated engagement**
- Use Qwen 2.5 14B (local, free) to draft replies
- Human review queue before posting
- Reply to mentions, relevant AI/dev conversations

### X API Requirements
- Developer account (free tier: 1500 tweets/month)
- OAuth 2.0 with PKCE
- Scopes: tweet.write, tweet.read, users.read
- Rate limit: 200 requests/15min

### Config Location
```
~/.openclaw/workspace/nio-x-bot/
├── config.json       ← API keys, templates
├── queue.json        ← Pending tweets
├── posted.json       ← Tweet history
└── templates/        ← Tweet templates
```

---

## System 2: Discord Bot (NioBot)

### Purpose
Community management, welcome messages, ship tracking, content syndication

### Commands

| Command | Action |
|---------|--------|
| !nio | Random Nio quote from soul file |
| !level | Show community member's engagement level |
| !shipped [desc] | Log a ship, increment counter |
| !leaderboard | Top shippers this week |
| !evolution | Current Nio tier and avatar |
| !soul | Link to soul file |
| !help | Command list |

### Automated Messages

| Event | Channel | Message |
|-------|---------|---------|
| Member join | #welcome | Nio greeting in character |
| Blog post | #nio-terminal | Post title + link + summary |
| Deploy | #nio-updates | Deploy confirmation |
| Level up | #nio-updates | Level announcement + avatar |
| Weekly | #general | Week recap stats |

### Implementation Plan

**Phase 1: Webhook-only**
- Discord webhooks for #nio-updates and #nio-terminal
- Post from OpenClaw crons or GitHub Actions
- No bot application needed yet

**Phase 2: Full bot**
- discord.js application
- Host on Vercel Edge Functions or small VPS
- Command handling + event listeners
- SQLite for member data

### Discord API Requirements
- Bot application in Discord Developer Portal
- Permissions: Send Messages, Manage Messages, Embed Links, Add Reactions
- Gateway intents: Guild Members, Guild Messages

---

## System 3: RSS Content Pipeline

### Purpose
Auto-generate and serve RSS feeds from existing content

### Feeds & Sources

| Feed | Source | Update Frequency |
|------|--------|------------------|
| /rss/blog | nio.terminal posts | Daily (8am) |
| /rss/changelog | git tags + manual entries | On ship |
| /rss/evolution | progression profile.json | On level-up |

### Implementation
- Next.js API routes in niobot.ai app
- Generate XML on request (cached 1hr)
- Source data from SQLite or file system

---

## Automation Timeline

### Week 1 (Now)
- [ ] Create @niobotai X account
- [ ] Get X API developer access
- [ ] Write tweet posting script (Node.js)
- [ ] Create Discord server with channel structure
- [ ] Set up Discord webhook for #nio-updates

### Week 2 (Product Building)
- [ ] Add blog post → tweet automation to cron
- [ ] Add deploy → Discord webhook to Vercel
- [ ] Test end-to-end: ship → deploy → tweet + Discord post

### Week 3 (Pre-Launch)
- [ ] Queue launch week tweets
- [ ] Configure weekly recap cron
- [ ] Test level-up → tweet flow
- [ ] Discord bot Phase 1 (webhooks) live

### Week 4+ (Post-Launch)
- [ ] Discord bot Phase 2 (commands) if community active
- [ ] RSS feeds live on niobot.ai
- [ ] AI engagement replies (Qwen, human review)
- [ ] Content syndication to Dev.to, Hashnode via RSS

---

## Cost

| System | Cost |
|--------|------|
| X API (free tier) | $0 |
| Discord bot hosting | $0 (Vercel/webhooks) |
| RSS generation | $0 (Next.js routes) |
| AI tweet generation (Qwen local) | $0 |
| Total | $0 |

Everything runs on existing infrastructure.
