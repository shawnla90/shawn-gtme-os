# Task Tracker

> Write plans here with checkable items before starting work.
> Mark items complete as you go. Add a review section when done.

---

<!-- Tasks will be added below per session -->

## 2026-07-15 "How I'm Getting My First Users" content week

> Full plan: `tasks/2026-07-15_user-acquisition-week-plan.md`
> Branch: `claude/content-user-acquisition-plan-0phi6m` | Cadence default: Daily LinkedIn-led, Wed→Sun

**Planning**
- [x] Load voice system (core-voice, anti-slop, linkedin playbook), read lessons + handoff.
- [x] Write single-arc week plan (2 acquisition engines + build-in-public moat).
- [ ] Get Shawn's sign-off / overrides on the 4 defaults (cadence, frame, transparency, video).

**Drafting (after sign-off)**
- [ ] Wed — Ch.1 affiliate engine: LinkedIn anchor + X repurpose.
- [ ] Thu — Ch.2 why I built the tool: LinkedIn + X + Reddit (founder origin).
- [ ] Fri — Ch.3 network is the database: LinkedIn + X.
- [ ] Sat — Ch.4 signal→DM loop: LinkedIn + X.
- [ ] Sun — Ch.5 showing everything is the moat: LinkedIn + X + Reddit (full motion).
- [ ] Blog + Beehiiv anchor essay (mid-week) with tracked URLs.
- [ ] Fold video key-points transcription in as revision pass (when available).

**Rails / tracking**
- [ ] Apply UTM scheme to every outbound link (`utm_campaign=first-users-2026-07`).
- [ ] Draft niobot.db campaign-lineage schema + insert rows (piece → channel → URL → signal).

**Dispatch (Shawn runs on Mini)**
- [ ] `/code` → Typefully drafts (LinkedIn + X, not scheduled), Notion board, Discord review.
- [ ] Review in Notion/Discord/Typefully → approve → schedule.
- [ ] Blog/Beehiiv `final` when approved.

## 2026-06-12 Clearbox Email Open Tracking

- [ ] Store Clearbox PostHog credentials in `niobot.db`.
- [ ] Add a public email-open pixel route to the Vercel app serving `clearbox.to`.
- [ ] Add local outbound open-event tables/helpers and insert the pixel into campaign HTML sends.
- [ ] Update Mission Control campaign metrics to show opens.
- [ ] Verify with build checks, local API checks, and a manual pixel request.
