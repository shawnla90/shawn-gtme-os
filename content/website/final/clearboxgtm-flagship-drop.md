---
title: "the flagship drop: clearboxgtm v0.3.0"
date: "2026-08-07"
excerpt: "I published our failures today. The transparency folder, the cold-email postmortem, and a repo where every number is generated from a database instead of typed."
category: "ships"
keywords: ["clearboxgtm", "reddit gtm", "transparency", "cold email postmortem", "build in public", "open source gtm"]
---

I published our failures today.

Not as a stunt. ClearboxGTM v0.3.0 ships a transparency folder with the honest channel ranking of what actually built the Clearbox user base, including a full postmortem of the cold-email machine we spent weeks engineering. It produced 5 signups. One referral relationship produced more than ten times that. The folder exists because growth content usually shows you the winning channel and buries the rest, and the buried part is where the lessons are.

## what shipped

[ClearboxGTM](https://github.com/shawnla90/ClearboxGTM) is the open repo with the full Reddit motion: real account, real replies, everything else automated off-platform. v0.3.0 is the flagship drop:

**Generated, never typed.** Every number in the repo now comes out of a script that reads the tracking databases and refuses to render stale or out-of-bounds stats. Current output: 1.5M+ tracked views (1,561,082 exact), 2,499 karma, 25 tracked wins, 724 inbound replies across 246 tracked items, one real account, 5.3 months. A stat without a query behind it gets cut. That rule killed a claim I liked this week, which is the system working.

**The transparency folder.** Where signups actually came from, first-touch: 54 referral, 51 web, 8 LinkedIn, 7 search, 5 email, 1 X. The cold-email postmortem has the deliverability findings worth keeping: authentication was clean everywhere and one major provider still hard-bounced a third of everything on domain reputation alone, and the click-throughs turned out to be security scanners, not buyers. Human replies: 5 on roughly 4,600 sends.

**The interview as portable IP.** The onboarding form you rush through is the highest-leverage artifact in your GTM stack. v0.3.0 elevates it: 80-character one-liner discipline (counted, not eyeballed), seven falsifiable selling-point shapes, competitors from research instead of the brief, communities verified or cut, and a fact-check gate where every claim traces to a URL. Runs in Claude Code, Cursor, Codex, or as JSON input to any workflow engine.

**Three new tracks.**

- Agencies: the reverse-uno method. When a client talks channels at you, show them what their buyers said on Reddit this week instead of a pitch.
- Students: a free semester of Clearbox Pro plus monthly group office hours, for students who build in public. Sign up with a .edu email, then email partners@clearbox.to.
- Partners: referral and delivery tracks, terms by email: partners@clearbox.to.

Plus two new skills (GEO visibility with a retrieval-visibility score that refuses to call itself a citation, and long-tail content built for attribution), a release pipeline, and a scan gate every release passes before it tags.

## why this matters if you're not a clearbox user

The repo is MIT. The provenance rule, the interview pattern, the automation boundary (research and drafting automated, every send a human), the scan gate: all of it is liftable into whatever you're building. Take the parts, run them for yourself or your clients.

Watch [Releases](https://github.com/shawnla90/ClearboxGTM/releases) on the repo to catch the next drop.
