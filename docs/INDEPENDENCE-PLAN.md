# Independence Plan: ShawnOS as a Product

> Created: 2026-02-25
> Status: ACTIVE — 2-week countdown to independence
> Mission: Build the infrastructure to sell AI-powered web development and AI operating system builds

---

## Infrastructure Reality

- **Mac Mini** — Single machine: dev + always-on server, Claude Code CLI (24/7), nightly cron pipeline
- **No OpenClaw** — Sunset and removed. Everything runs Mac Mini CLI direct.
- **4 live websites** — ShawnOS, TheGTMOS, TheContentOS, Mission Control (all Next.js 15 / Vercel)
- **Nio** — Multi-agent chatbot (Nio/Architect/Writer), Tamagotchi evolution, soul files, SQLite, PWA
- **50 skills, 17 MCP servers, nightly cron pipeline**

---

## The Offering: Lead Alchemy — AI-Powered Engineering Services

### Tier 1: Full-Stack Website Build ($3,500-7,500)
**Duration**: 1-2 weeks
**The hook**: "I'll build your website and deploy it while you go get coffee."

**Deliverable**: A production-ready, deployed website built with AI-accelerated development.
- Next.js 15 / React 19 / TailwindCSS 4 site
- Responsive design, mobile-first
- Vercel deployment with CI/CD (push → live)
- SEO fundamentals (meta tags, OG images, sitemap, robots.txt)
- 1 integration (CRM form, analytics, email capture, etc.)
- DNS + domain configuration
- 30 days post-launch support
- Content population assistance

**The demo**: Screen recording — edit a page in Claude Code → git push → site live in 60 seconds. That's the sell.

**Who it's for**: Founders, small businesses, solopreneurs who need a real site fast — not a Squarespace template, not a 3-month agency timeline.

**Upsell path**: "Your site is live. Want it to update itself? That's the AI OS."

### Tier 2: AI Ops Audit ($2,500)
**Duration**: 1 week
**Deliverable**: Full audit of current tool stack, workflows, and automation gaps.
- Map current tools and manual processes
- Identify 5-10 automation opportunities (ranked by ROI)
- Deliver custom ARCHITECTURE.md + gap analysis + build roadmap
- 1-hour walkthrough call

**Who it's for**: Companies that know AI matters but don't know where to start. Executives who need a plan before a build.

### Tier 3: AI Operating System Build ($10,000-25,000)
**Duration**: 4-8 weeks
**The hook**: "I build the AI operating system your company doesn't know it needs — in weeks, not quarters."

**Deliverable**: A custom AI OS — autonomous agents, nightly cron pipelines, multi-site dashboards, content machines, lead enrichment, progression tracking.
- Custom skill tree architecture
- Nightly cron pipeline (scan → score → commit → deploy)
- Multi-site Turborepo architecture (dashboard + public site)
- Multi-agent system (custom soul files, personality, memory)
- Key integrations (CRM, email, Slack, enrichment tools)
- Content pipeline (voice DNA, anti-slop, platform playbooks)
- Signal detection + lead scoring pipeline
- IP protection strategy (gitignore policy, blocklist enforcement)
- Full documentation (ARCHITECTURE.md, SKILL.md, MACHINE-SETUP.md)
- Weekly check-ins + 30 days post-launch support

**Who it's for**: Companies that want the full "AI guy" — not an agency, not a contractor, a builder who moves in and builds the machine.

### Retainer: AI Ops Partner ($5,000/month)
**Duration**: Ongoing
- 20 hours/month of build time
- Priority async support
- Monthly system health audit
- New skill/workflow development
- Quarterly IP and system review

---

## The 2-Week Build Plan

### Phase 0: OFFERING + SALES PAGE (Days 1-2) ← START HERE TODAY
**Goal**: Define the product, make it visible on shawnos.ai, start building agent infrastructure

**Sales page** (`shawnos.ai/build`):
- [ ] Hero: "I build websites in a day. I build AI operating systems in a month."
- [ ] Package tiers with clear deliverables and pricing
- [ ] "Book a call" CTA (Calendly or Cal.com)
- [ ] Proof wall — screenshots of the system: cron logs, dashboards, skill tree, Nio, 4 live sites
- [ ] Anonymized case study snippets from partner work
- [ ] Stack showcase (Next.js, Claude, Vercel, 17 integrations)

**Agent scaffolding** (parallel — start the infrastructure):
- [ ] Create `scripts/agents/` directory structure
- [ ] Create `data/agent-souls/` with soul files
- [ ] Build first agent: **Sentinel** (system health monitor — easiest, immediate value)

### Phase 1: AGENT ARMY (Days 2-5)
**Goal**: Expand beyond Nio — autonomous agents doing real work via Mac Mini Claude Code CLI

**Agent roster:**

| Agent | Role | Trigger | Runtime |
|-------|------|---------|---------|
| **Sentinel** | System health — checks all 4 sites, RSS feeds, cron success, API status | Every 4 hours | Mac Mini CLI cron |
| **Scout** | Content research — scans X, Reddit, HN for AI/GTM/builder topics, compiles briefing | Daily 6am | Mac Mini CLI cron |
| **Scribe** | Draft generator — takes Scout's findings + content bank, drafts LinkedIn/X posts | Daily 7am | Mac Mini CLI cron (after Scout) |
| **Herald** | Distribution — posts approved content to X, Discord webhooks, queues LinkedIn drafts | Daily 9am | Mac Mini CLI cron (after review) |

**Implementation pattern** (each agent):
- Python script in `scripts/agents/{name}.py`
- Soul file in `data/agent-souls/{name}.md` (personality, constraints, output format)
- Output logs to `data/agent-logs/{name}/YYYY-MM-DD.json`
- Uses Claude API (Sonnet for routine, Opus for reasoning-heavy)
- Orchestrated by `scripts/agent_cron.sh` → launchd plist on Mac Mini

**Herald flow** (critical — no fully autonomous posting):
```
Scout output → Scribe drafts → JSON review queue → Human approves → Herald posts
```
Trust builds over time. Start with human-in-the-loop.

### Phase 2: DEMO FACTORY (Days 5-8)
**Goal**: Create proof assets that sell the offering

**Demo recordings:**
1. **"60-Second Deploy"** — Edit site in Claude Code → push → live. The website Tier 1 money shot.
2. **"Overnight Agent Run"** — Morning laptop open: see what agents did overnight (briefing ready, drafts written, health checked)
3. **"Lead Enrichment in 5 Minutes"** — Run signal detection on a prospect list → 342 signals in minutes
4. **"Nio Evolution"** — Chat with Nio → XP ticks up → tier progression animation
5. **"The Stack Tour"** — Walk through ARCHITECTURE.md, the system map, what runs where

**Promotional assets:**
- 30-second social clips from each demo
- OG images for /build page
- "Before/After" graphics (manual ops vs. AI OS)
- Anonymized case study cards from partner work

### Phase 3: DISTRIBUTION ENGINE (Days 8-12)
**Goal**: Turn on the autonomous content + community loop

**Discord launch** (use existing playbook at `nio-mar-ops/channels/discord/playbook.md`):
- [ ] Create NioBot HQ server with channel structure
- [ ] Deploy webhook-based posting (Phase 1 from bot-strategy.md — 2 hours of work)
- [ ] Wire Herald agent to post to #nio-updates and #nio-terminal
- [ ] Seed with 10-20 personal invites

**X/Twitter activation:**
- [ ] Herald agent posts daily (approved queue)
- [ ] Queue launch week threads from `nio-mar-ops/content-bank/`
- [ ] Cross-post demo clips as native video

**LinkedIn push:**
- [ ] Daily posts from content drafts already queued (5 days ready)
- [ ] /build page link in every post
- [ ] Comment engagement on AI/GTM content

### Phase 4: LAUNCH WEEK (Days 12-14)
**Goal**: Public announcement — Shawn is independent and open for business

- [ ] LinkedIn: "I built an AI operating system. Now I build them for companies."
- [ ] X thread: full build-in-public story with system screenshots
- [ ] Substack: "Why I Left to Build AI Systems Full-Time"
- [ ] Discord: open doors, start community
- [ ] DM 20 warm contacts with the offering + /build link
- [ ] Post in communities (IndieHackers, r/SideProject, HN Show)

---

## Shawn vs. Alex Finn — The Positioning

| Dimension | Alex Finn | Shawn |
|-----------|-----------|-------|
| **Proof** | Screenshots of ClawdBot doing tasks | 3 real partners, 280 contacts enriched, deployed production systems |
| **Offering** | Course/community about AI agents | Custom builds for companies (websites + AI OS) |
| **Entry point** | "Watch my agent work" content | "I'll build your site while you get coffee" demo |
| **Moat** | Content volume, audience size | GTM engineering expertise + proprietary systems + Nio IP |
| **Price point** | $97-497 info product | $3,500-25,000 services |
| **Infrastructure** | Mac Studio + local LLMs + OpenClaw | Mac Mini + Claude Code CLI direct + Vercel + 17 MCPs |
| **Scalability** | Infinite (content/course) | Limited (bespoke) → expand later with templates/productized tools |

---

## Architecture Decisions

1. **Agents are Python scripts on Mac Mini CLI cron** — Not separate Claude Code instances. Simple, debuggable, cost-controlled. Each agent calls the Claude API directly.

2. **Herald posts to a review queue first** — No fully autonomous social posting day 1. Agent drafts → JSON queue → human approves → Herald posts. Earn trust, then automate.

3. **shawnos.ai/build is the landing page** — Don't create a new domain. The system IS the proof. The services page lives inside the system it's selling.

4. **Website build is Tier 1, AI OS is Tier 3** — Website build is the easy yes ($3,500-7,500, 1-2 weeks, tangible output). AI OS is the big play ($10K-25K) that follows naturally. "Your site is live. Want it to run itself?"

5. **Discord webhooks first, full bot later** — Match bot-strategy.md Phase 1. Webhooks = 2 hours. Full discord.js bot = a week. Ship the webhook version.

6. **Demo recordings > live demos** — Pre-recorded demos are more reliable and reusable. Build live demo capability for actual client calls later.

---

## Files to Create

| File | Purpose | Phase |
|------|---------|-------|
| `website/apps/shawnos/app/build/page.tsx` | Services/offering landing page | 0 |
| `scripts/agents/sentinel.py` | System health monitor agent | 0 |
| `scripts/agents/scout.py` | Content research agent | 1 |
| `scripts/agents/scribe.py` | Content draft generator agent | 1 |
| `scripts/agents/herald.py` | Content distribution agent | 1 |
| `scripts/agent_cron.sh` | Agent orchestration cron script | 1 |
| `data/agent-souls/sentinel.md` | Sentinel personality/instructions | 0 |
| `data/agent-souls/scout.md` | Scout personality/instructions | 1 |
| `data/agent-souls/scribe.md` | Scribe personality/instructions | 1 |
| `data/agent-souls/herald.md` | Herald personality/instructions | 1 |
| `data/agent-logs/` | Per-agent daily output logs | 0 |
| `scripts/discord_webhook.py` | Discord webhook posting utility | 3 |

---

## Week 1 Success Metrics

| Metric | Target |
|--------|--------|
| /build page live on shawnos.ai | Yes |
| Sentinel agent running on Mac Mini cron | Yes |
| Scout + Scribe agents running | Yes |
| Demo recordings captured | 3+ |
| Content pieces published | 5+ |
| Discord server created (even if private) | Yes |

## Week 2 Success Metrics

| Metric | Target |
|--------|--------|
| Herald agent posting approved content | Yes |
| Discord open with webhooks active | Yes |
| Independence announcement published | Yes |
| Warm DMs sent about offering | 10+ |
| Inbound inquiries | 1+ |
| Full agent army on daily cron | 4/4 |
