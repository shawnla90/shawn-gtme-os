# Content Plan — "How I'm Getting My First Users" week

> Created: 2026-07-15 (Tue) | Branch: `claude/content-user-acquisition-plan-0phi6m`
> Owner: Shawn | Status: **PLAN — awaiting sign-off, no content drafted yet**
> Voice system loaded: core-voice.md + anti-slop.md + linkedin.md playbook

---

## 0. What this is

A one-week, single-arc content run built from the founder brain-dump on how Clearbox
is actually acquiring users. The arc is your real motion, told as receipts, not theory:

**Two acquisition engines + one moat.**
1. **Referrals / affiliate** — Gummy Search front-page affiliate → 30–50 visitors/day, 5–10 signups/day. Landing page converts; the open problem is trial→paid stickiness.
2. **Network-led founder outreach** — scrape own LinkedIn following (your #1 database) → prioritize followers/known contacts via Phantom Buster → HeyReach, 40 DMs/day → unapologetic automated send, human reply. 25%+ reply rate, zero non-interest.
3. **The moat = showing everything.** Build-in-public. The tool exists because you lived the problem (used Reddit to grow your own channel → built Clearbox so others can). Signal→DM loop: user signs up → track them → founder DMs same day.

Anti-thesis you're arguing against: "blast as many cold emails as possible to expand your network." Doesn't outweigh network-led content + outreach when you already *have* a network. That's why you're doubling down on content.

---

## 1. Decisions I defaulted (override any in one line)

The interactive question tool got cut off, so I picked the strongest defaults and marked them. Reply with a correction on any and I'll re-cut the calendar before drafting.

| # | Decision | Default I'm running | Alternatives |
|---|----------|---------------------|--------------|
| Q1 | **Cadence** | **Daily LinkedIn-led, Wed→Sun.** 5 LinkedIn long-forms, each repurposed to X, 2 Reddit long-forms placed where native, 1 blog+Beehiiv anchor for the week. | "3 anchor pieces" (lower volume, deeper) / "Full multi-channel blast" (daily X too, Reddit 3x) |
| Q2 | **Frame** | **Single arc: getting my first users.** Every piece is a chapter. | Two-pillar split / Acquisition arc + existing pillars mixed |
| Q3 | **Tool transparency** | **Name the safe ones, abstract the grey.** Full receipts on Gummy Search affiliate, HeyReach cadence, LinkedIn newsletter, signal→DM. Own-cookie / headless LinkedIn scraping stays abstracted ("I pull my own network data") — naming the cookie method invites ToS heat + copycats. | Name everything / Framework-level only |
| Q4 | **Video transcription** | **Build now, video folds in later.** Context is rich enough to draft the full week. Video key points layered in as a revision pass once available — doesn't block Wed-morning readiness. | Paste transcript here / lands in a repo file (give path) |

---

## 2. Hard reality: what this remote session can and can't do

This session runs in an ephemeral cloud container. It **cannot** reach your Mac Mini,
`niobot.db`, the Discord webhooks, or the Typefully/Notion dispatch scripts. So:

- **I do:** draft every piece into the repo on this branch, voice + anti-slop + safety passed, review-ready, with front-matter carrying the URL-tracking + repurpose metadata. Commit + push.
- **You do (on the Mini):** run the `/code` dispatch flow to fan the approved pack out to Typefully (LinkedIn + X, drafted not scheduled), Notion (review board), Discord (review channels), and blog/Beehiiv. `final` on blog-newsletters is the only verb that deploys.
- **Review loop stays yours:** nothing schedules or publishes until you say so. Typefully = visualize-as-post + draft. Notion + Discord = your review surfaces. You approve → then schedule.

If you'd rather I *also* try to push anything reachable from here (e.g. a Google Drive copy of the calendar for phone review), say the word — Drive MCP is connected this session.

---

## 3. The week (default cadence: Daily LinkedIn-led, Wed→Sun)

Each day = one flagship LinkedIn long-form (the anchor) → repurposed to X (thread or single) → Reddit on the 2 days where the story is natively useful → the week's throughline collected into 1 blog post (shawnos.ai) + 1 Beehiiv newsletter send.

| Day | Chapter | LinkedIn anchor angle | Hook direction (lowercase, receipts-first) | X repurpose | Reddit | Substance proof (≥2 of 5) |
|-----|---------|----------------------|--------------------------------------------|-------------|--------|---------------------------|
| **Wed** | Ch.1 — The affiliate engine | Gummy Search front-page affiliate is quietly doing my top-of-funnel. What the numbers actually look like. | "an affiliate placement is sending me 5–10 signups a day and I didn't spend a dollar on ads." | thread: the affiliate math + why the landing page converts | — | numbers (30–50 visits, 5–10 signups), reasoning (why that crowd converts), the open gap (trial→paid) |
| **Thu** | Ch.2 — Why I built the tool I sell | I grew my own channel on Reddit, then built the tool I wished existed. Build what you've lived. | "I used reddit to grow my channel. so I built a tool to do it better. that's the whole origin." | single: build-what-you-lived, one line + link | r/GTMbuilders or r/gtmengineering: founder origin + what Clearbox reads (intent not keywords) | example (your own channel), reasoning (proximity = product insight), consequence (co-founder came in after v1) |
| **Fri** | Ch.3 — The network is the database | Your existing network beats a cold list you rent. How I prioritize + run 40 DMs/day. | "everyone says build a bigger list. I mined the one I already had. 25% reply rate, zero non-interest." | thread: the outreach mechanics (abstracted scraping → prioritize → HeyReach 40/day → human reply) | — | implementation (prioritize followers → HeyReach cadence), numbers (40/day, 25%+ reply), gotcha (automation isn't the point, the message + value is) |
| **Sat** | Ch.4 — Signal→DM loop | Signup is a signal, not a finish line. Track it, then talk to the human same day. | "you can't get your first 100 users without talking to them. so I DM every signup the day they join." | single: signal→founder-DM, the anti-scale take | — | implementation (track signup → LinkedIn → same-day founder DM), reasoning (first-100 rule), consequence (feedback loop = stickiness work) |
| **Sun** | Ch.5 — Showing everything is the moat | The build-in-public thesis tied off. Everyone can build now; the moat is showing the receipts. | "anybody can build in 2026. the moat is showing all of it. here's my whole acquisition motion in one post." | thread: recap the 4 engines as a numbered motion | r/GTMbuilders: the full motion write-up, ungated, native format | reasoning (builders are commodity), the whole system shown, invitation to co-build |

**Blog + Beehiiv anchor (publish mid-week, e.g. Fri):** long-form essay = the full arc in one place ("How I'm getting Clearbox's first users — the two engines and the moat"). Same body → shawnos.ai blog + Beehiiv send, both with tracked URLs. Follows the SEO/AEO conventions already in the blog: TL;DR up top, question-format H2s, FAQ block, zero em-dashes.

---

## 4. Distribution + tracking spec

**Channels & tools**
- **LinkedIn** long-form → Typefully (draft, visualize-as-post) + Notion + Discord review.
- **X** repurpose → Typefully (draft) + Notion + Discord.
- **Reddit** → drafted in-repo (native format per lessons.md — no essay-ification of repo/list posts); posted manually, not via Typefully.
- **Blog** → shawnos.ai via `/publish-blog` conventions.
- **Newsletter** → Beehiiv (same body as blog, newsletter scaffolding).
- **Discord** → review channels via existing webhooks (resolve from `secrets`, never hardcode).
- **Notion** → review board so you can review off-terminal.

**URL tracking + post-hoc lineage** (build the rails now)
- Every outbound link gets a UTM'd, trackable URL. Proposed scheme:
  `?utm_source={channel}&utm_medium={format}&utm_campaign=first-users-2026-07&utm_content={day-chapter}`
  e.g. `...utm_source=linkedin&utm_medium=post&utm_campaign=first-users-2026-07&utm_content=wed-ch1-affiliate`
- Blog + Beehiiv links carry the same campaign tag so signups can be traced back to the exact chapter/channel that drove them.
- Log the lineage (piece → channel → URL → intended signal) in a small campaign table so post-hoc attribution is possible. Store in `niobot.db` (campaign/content table) on the Mini — I'll write the schema + insert rows into the plan; you run it.
- Signals to watch: site visits, signups, LinkedIn profile visits on people we DM'd, reply rate. Ties into the existing Clearbox open-tracking work already in `todo.md`.

**Front-matter each draft carries** (so dispatch is one command):
```yaml
campaign: first-users-2026-07
day: wed
chapter: 1-affiliate-engine
channels: [linkedin, x]     # reddit/blog vary by day
utm_content: wed-ch1-affiliate
status: draft               # draft -> approved -> scheduled
video_pending: true         # flip when transcription folded in
```

---

## 5. Quality gates (run on every piece before it's "review-ready")

Sequential, per improvement-protocol: **Slop → Specificity → Depth → Performance → Safety → Voice.**
- **Anti-slop:** zero em-dashes, no authority-signal phrases, no narrator setups, no 3-parallel-sentence drama, no colon-listed PowerPoint lines. 3+ flags = rewrite not patch.
- **Substance:** every substantive claim carries ≥2 of 5 (example / implementation / reasoning / consequence / gotcha).
- **Safety:** pattern-vs-person (no named clients/individuals). Grey-area tactic (own-cookie scraping) stays abstracted per Q3 default. Pre-push blocklist scan (Husky) must pass — never `--no-verify`.
- **Voice:** lowercase first line (except I), receipts-first, no gatekeeping, feed sign-off `shawn ⚡`; long-form sign-off `Shawn Tenam / the GTM alchemist / <line>`.

---

## 6. Open items for you

1. **Confirm or override the 4 defaults in §1.**
2. **Video transcription** — if you want it in *before* first drafts, tell me the path or paste it; otherwise I draft now and layer it as a revision pass.
3. **Beehiiv** — confirm it's the newsletter of record for this send (vs. Substack, which is where prior newsletters lived).
4. **Gummy Search affiliate** — okay to name them explicitly and cite the 30–50/5–10 numbers publicly? (Default: yes, it's a partner win, reads as generous not braggy.)
5. **First live piece = Wed morning.** After sign-off I draft all 5 LinkedIn anchors + X repurposes + 2 Reddit + blog/Beehiiv, commit to this branch, and hand you the `/code` dispatch list.

---

## Review (filled in after execution)

_TBD_
