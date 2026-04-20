# Nexus — Week Plan (V1 → Wednesday Full Build)

> Planning doc only. Hand this to the working session as the source of truth.
> Branch for planning: `claude/nexus-agent-planning-TTGAs`.
> Partner working directory (private, gitignored): `clients/partner/nexus/`.

---

## 0. Context & Goals

Stand up a full Nexus agent stack this week. Parity with the Ellie/Midbound model (voice-DNA agent + daily content ops), but:

- **Comms channel**: WhatsApp group (already exists) instead of Discord.
- **Agent**: new FBA (full-build agent) with a Hermes harness.
- **Call capture**: Fireflies (remote) **and** PLAUD (on-site / in-person).
- **Reddit growth**: parallel channel, blocked on email provisioning.
- **Website**: build this week.
- **V1 deadline**: before Monday. **Full cutover**: Wednesday.

---

## 1. Decisions Needed From Partner (BLOCKERS)

Put these in the WhatsApp group at the top of the week. Nothing else unblocks until these land.

### 1.1 Domain
Available, recommended priority:
1. `nexuslaconstruction.com`
2. `nexusladesign.com`
3. `lanexusconstruction.com` / `lanexusdesign.com`

Recommendation: **`nexuslaconstruction.com`** — "Nexus LA" reads better than "LA Nexus" and "construction" is the broader service bucket. If they own more than roofing, lead with Construction and use Design as a sub-path.

**Needed from partner**: pick one. Register same day.

### 1.2 Email Source of Truth
Two paths — we need one written answer, not both:

- **Path A — Partner uses their existing emails.** We get delegated access / app passwords / OAuth for: inbox, Google Workspace admin (if any), and any existing Reddit/Fireflies/PLAUD accounts.
- **Path B — We provision new emails on the new domain.** Google Workspace on `nexuslaconstruction.com` (or whichever), 2–3 seats, forwarding rules back to their existing inbox if they want.

**Recommendation**: hybrid. New domain emails for *system* accounts (Reddit, Fireflies, PLAUD, Anthropic, content tooling) so we own the auth chain. Partner keeps their existing emails for client-facing comms. Document the mapping in a "Source of Truth" table (see §6).

**Needed from partner**: confirm hybrid, or override.

### 1.3 Reddit
Reddit account creation requires an email. This unlocks once §1.2 is answered.

- If Path A: they give us access to an email they don't mind tying to Reddit, or create the account themselves and share credentials.
- If Path B/hybrid: we create `reddit@nexuslaconstruction.com` and spin up the account ourselves.

---

## 2. Assets To Collect From Partner

Ask in WhatsApp, single message, bulleted:

- [ ] Roofing project photos (cloud folder or zipped download — Drive / Dropbox / iCloud link, whichever they use).
- [ ] Any other service imagery (exteriors, builds, before/after).
- [ ] Service pricing sheet (or range — enough to give the agent context).
- [ ] Current service list with short descriptions.
- [ ] Logo files (SVG preferred, PNG fallback).
- [ ] Brand colors / fonts if they have a style guide.
- [ ] Existing website copy (if any) — so we don't rewrite their voice.
- [ ] List of existing tools they already pay for (so we don't double-provision).

Drop-off location (private, gitignored): `clients/partner/nexus/assets/`.

---

## 3. Agent Build — Nexus FBA + Hermes Harness

Target: Anthropic API key wired, voice system loaded, WhatsApp I/O by Monday.

### 3.1 Scaffold
- [ ] Create `clients/partner/nexus/SKILL.md` — partner profile, services, voice notes, asset index. Read-first at session start per CLAUDE.md §Session Startup.
- [ ] Create `clients/partner/nexus/agent/` — Hermes harness config, tool bindings, system prompt.
- [ ] Load voice stack in order: `skills/tier-1-voice-dna/core-voice.md` → `anti-slop.md` → partner-specific tone notes → `skills/tier-3-content-ops/improvement-protocol.md`.

### 3.2 Anthropic API
- [ ] Provision API key on the account that'll pay for it (decision in §1.2 determines which email).
- [ ] Store in `.env` (never committed — gitignored). Reference only via env var.
- [ ] Default model: `claude-opus-4-7` for heavy generation, `claude-sonnet-4-6` for chat. `claude-haiku-4-5-20251001` for routing/classification.
- [ ] Enable prompt caching on the system prompt + voice files (they're long and stable — big win).

### 3.3 Hermes Harness
- [ ] Define tool set: WhatsApp send/receive, Fireflies transcript fetch, PLAUD transcript fetch, asset library read, content drafts write.
- [ ] Define role: partner-facing content + intake agent. Not client-facing yet.
- [ ] Define handoff rules: when to ping Shawn vs. when to act autonomously.

### 3.4 Mirror of Ellie/Midbound Pattern
- [ ] Daily content draft cadence (same as Ellie, adapted for WhatsApp delivery).
- [ ] Approval loop: agent drafts → Shawn reviews → approved drafts go to partner.
- [ ] Voice gate: 3+ anti-slop flags = rewrite, not patch (per CLAUDE.md).

---

## 4. Call Capture Stack

### 4.1 Fireflies (remote calls)
- [ ] Provision account under decided email (§1.2).
- [ ] Connect to partner's calendar(s) — only if Path A grants access, otherwise partner adds Fireflies bot to their own invites.
- [ ] Storage: transcripts pipe into `clients/partner/nexus/calls/fireflies/`.
- [ ] Downstream: agent ingests transcripts as context for content + memory.

### 4.2 PLAUD (in-person / on-site)
- [ ] Confirm partner has the device or decide if we're shipping one.
- [ ] Account under decided email.
- [ ] Storage: transcripts pipe into `clients/partner/nexus/calls/plaud/`.
- [ ] Tag on-site recordings with project/address for later asset matching (photo + audio from same visit = huge content signal).

### 4.3 Why Both
Fireflies covers Zoom/Meet/Teams. PLAUD covers roof walks, client site visits, supplier conversations — the stuff Fireflies can't touch. Missing PLAUD = we lose the highest-value content source (on-site color, client language, real project context).

---

## 5. Website Build

- [ ] Domain purchased (§1.1) → DNS pointed at hosting.
- [ ] Stack: match existing pattern in `website/apps/` (Next.js). Add `website/apps/nexus/` if we want it in the monorepo, or stand alone if partner wants to own the repo long-term — flag this decision.
- [ ] Use assets from §2.
- [ ] V1 scope (before Monday): home, services, contact. That's it.
- [ ] V2 scope (Wednesday): project gallery (roofing photos), about, geo/service-area pages.
- [ ] Deploy: Vercel, project linkage verified before deploy (lesson 2026-03-03 in `tasks/lessons.md`).

---

## 6. Source of Truth — Email & Account Mapping

Create `clients/partner/nexus/accounts.md` with this table. Fill as accounts are provisioned. This is the single place we look when adding a new tool.

| System | Email used | Who owns it | 2FA to | Notes |
|---|---|---|---|---|
| Domain registrar | | | | |
| Google Workspace (if new) | | | | |
| Anthropic API | | | | |
| WhatsApp Business (if upgraded) | | | | |
| Fireflies | | | | |
| PLAUD | | | | |
| Reddit | | | | |
| Website hosting (Vercel) | | | | |
| Analytics (GA / Plausible) | | | | |
| Social (IG / LI / X if used) | | | | |

---

## 7. Reddit Growth Lane

Blocked on §1.2 + §1.3. Once unblocked:

- [ ] Create account.
- [ ] Subreddit list: localized (r/LosAngeles, r/AskLosAngeles, r/LARealEstate) + vertical (r/Roofing, r/HomeImprovement, r/Construction, r/HomeOwners).
- [ ] Warm the account for ~7 days before any branded activity (karma floor, join subs, passive engagement).
- [ ] Use existing `reddit-engage` skill flow for voice-matched replies.

---

## 8. Content Ops (Ellie-equivalent, WhatsApp-native)

- [ ] WhatsApp group already exists — confirm bot/webhook path. Options:
  - WhatsApp Business Cloud API (Meta-hosted) — official, needs FB Business verification.
  - Twilio WhatsApp API — faster to wire, costs more.
  - Manual copy-paste in the group short-term, automate in week 2. **Recommended for V1.**
- [ ] Daily drop: agent posts 1–2 draft posts + 1 question/insight to group each morning.
- [ ] Approval loop runs in the group — emoji react = approve, reply = edit.
- [ ] Voice system loaded per §3.1.

---

## 9. Repo Gotchas (pre-flight checks for the working session)

Hits found while scanning the repo:

1. **`clients/` is gitignored** via `.gitnexusignore`. All partner-identifiable data (name, emails, credentials, call transcripts, photos) **must** live under `clients/partner/nexus/`. Never under `gtm-os/partners/` directly (it's a symlink — same destination, but commit the canonical path if anything does get tracked).
2. **Husky pre-push blocklist scan** runs on every push (`.husky/pre-push`, loads `.claude/blocklist.txt`). **Add the partner's company name and personal names to `.claude/blocklist.txt` before the first push this week.** Otherwise a typo in a tracked file will get blocked mid-push or, worse, leak.
3. **Never use `--no-verify`** to bypass the hook (CLAUDE.md §Safety).
4. **Pattern vs. person test** (CLAUDE.md §Safety): in any public content (blog, LinkedIn, repo commits), critique *approaches*, never name the partner or their clients.
5. **No node on Neo**. If you're on MacBook Neo, don't try to run website builds — switch to Mac Mini.
6. **Lockfile hazard** (lesson 2026-03-03): don't add SDK packages to the shared website package as direct deps. Use peerDependencies.
7. **Vercel project linkage** (lesson 2026-03-03): verify `vercel link` target before first deploy of the Nexus site.
8. **Anthropic API key goes in `.env` only** — `.env` is gitignored. Never paste into a tracked file.
9. **`.claude/` is gitignored**, so `.claude/blocklist.txt` and `.claude/context-handoff.md` stay local. Fine for secrets, but remember: they don't sync across machines automatically.
10. **Plan mode default** (CLAUDE.md §Workflow Orchestration): this task is multi-step + architectural — the working session should enter plan mode, confirm with Shawn, then execute. Don't freewheel.
11. **Subagent strategy**: research (asset inventory, tool pricing, WhatsApp API choice) is a good fit for subagents. Agent build + website build stay in the main thread.

---

## 10. Sequenced Plan (This Week)

### Today → Sunday
- [ ] Send decisions + asset request to WhatsApp group (§1, §2).
- [ ] Register chosen domain the moment §1.1 lands.
- [ ] Provision Anthropic API key.
- [ ] Add partner names to `.claude/blocklist.txt`.
- [ ] Scaffold `clients/partner/nexus/{SKILL.md, agent/, assets/, calls/, accounts.md}`.
- [ ] Fireflies + PLAUD accounts provisioned (pending §1.2).

### Monday (V1 live)
- [ ] Website V1 deployed (home / services / contact).
- [ ] Agent online with voice system + Anthropic key, posting drafts to WhatsApp.
- [ ] Fireflies capturing the first call.
- [ ] Reddit account created + warming (passive).

### Tuesday
- [ ] PLAUD used on first on-site visit; transcript lands in `clients/partner/nexus/calls/plaud/`.
- [ ] Agent drafts using real call context.
- [ ] Asset library populated from partner's cloud dump.

### Wednesday (full cutover)
- [ ] Website V2 with gallery + geo pages.
- [ ] WhatsApp automation path chosen + wired (or deferred to week 2 with manual copy-paste running).
- [ ] Reddit first branded engagement.
- [ ] Source-of-truth `accounts.md` fully populated.
- [ ] Review: what broke, what's next week.

---

## 11. Open Questions (flag to Shawn before build)

- Website: monorepo (`website/apps/nexus/`) or standalone repo they can take with them? Affects hosting, deploy pipeline, and how much code leaves our repo.
- WhatsApp automation tier: pay for Cloud API / Twilio on day one, or ride manual through V1?
- PLAUD device: do they already own one, or are we shipping/buying? Affects start date for on-site capture.
- Anthropic billing: on our account (rebill) or their card? Affects account ownership in the source-of-truth table.
- Content scope: is the agent drafting for the partner's social + email + blog, or just one channel for V1? Don't boil the ocean — start narrow.

---

## Review (fill in after the week)

- What shipped:
- What slipped:
- What the agent produced (volume + approval rate):
- Lessons → `tasks/lessons.md`.
