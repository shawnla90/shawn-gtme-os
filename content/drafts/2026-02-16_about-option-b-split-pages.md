# About Page — Option B: Split Pages (/about + /arc)

> Route: `/about` (clean profile) + `/arc` (deep narrative)
> Modifies: `website/apps/shawnos/app/about/page.tsx`
> Creates: `website/apps/shawnos/app/arc/page.tsx`

---

# PAGE 1: /about — Clean Profile Card

> Terminal header: `$ cat ~/about.md`

---

## identity

GTM engineer. builder. shipped from a monorepo.

I build AI-native pipelines, agent-driven workflows, and content systems that compound. every skill, every post, every campaign runs through a single codebase. the site you're on right now is the proof of work.

---

## tool stack

*(Same grid as current — Cursor IDE, Claude, Vercel, Turborepo, Next.js, Python + Pillow, HeyReach, Instantly, Clay)*

---

## the network

shawnos.ai is one node in a three-site system. each site owns a domain of the stack.

**thegtmos.ai** → the GTM operating system. frameworks, playbooks, and live builds for go-to-market engineering.

**thecontentos.ai** → the content operating system. voice-first publishing, repurpose pipelines, and content-as-code.

---

## connect

- [LinkedIn](https://linkedin.com/in/shawntenam)
- [X / Twitter](https://x.com/shawntenam)
- [Substack](https://shawntenam.substack.com)
- [GitHub](https://github.com/shawnla90)

---

## CTA

**want the full story?** → [/arc](/arc)

---
---

# PAGE 2: /arc — The Full Arc

> Terminal header: `$ cat ~/arc.md`

---

## skip this if you want the boring version

every GTM creator has the same about page.

"I was an SDR. then I found Clay. now I teach people how to use it."

cool. that's not this.

this is the version where I start with copper pipe and a blowtorch, end up building an operating system from a monorepo, and somehow both of those things connect.

---

## the layers

three careers. none of them define me. all of them shaped how I build.

### layer 1: plumber

actual plumbing. not a metaphor. diagnosing problems by listening to walls, tracing systems nobody documented, fixing things under pressure while water sprayed everywhere.

**the lesson:** every system has a logic. trace the flow. fix upstream or everything downstream breaks.

### layer 2: SDR

200+ cold emails a day. primary domains, no warmup, SalesLoft on manual. building buying committees in Salesforce by hand, one contact at a time.

**the lesson:** volume is a teacher. rejection is data. the people who grind through outreach manually are the ones who actually understand what should be automated.

### layer 3: GTM engineer

stopped working inside the systems. started building them. Clay enrichment, HubSpot automation, Instantly sequences, web reveal qualification, Cursor as the IDE, Claude as the reasoning engine.

**the lesson:** the best builders did the job before they automated it. you can't engineer what you don't understand.

---

## the thesis

this is not vibe coding.

I don't prompt once and ship whatever comes back. plan mode before writing a single line. ask mode when something breaks. sub-agents for parallel execution. test, break, read the error, fix it, ship it.

AI accelerates the work you already understand. it doesn't replace the understanding.

every page on this site was iterated. every skill was debugged before documentation. every campaign template was battle-tested on real pipeline.

the repo has 400+ files. zero one-shot prompts.

---

## three sites, one system

this is architecture, not vanity.

**shawnos.ai** — the builder. personal operating system, daily tracker, RPG progression, avatar system, API layer. the infrastructure.

**thegtmos.ai** — the playbook. GTM engineering frameworks, campaign architectures, workflow breakdowns. the systems behind pipeline.

**thecontentos.ai** — the voice engine. content-as-code, voice DNA, repurpose pipelines. how the words get made.

one monorepo. three domains. every page, API route, and generated image comes from the same codebase. nothing here is an accident.

---

## build with me

this isn't a portfolio. it's a system you can fork.

the API is documented. the quest board has real challenges. the starter prompt gets you from zero to your first generated build receipt.

take it. break it. rebuild it better.

- [the API](/api) — endpoints, schemas, live data
- [quest board](/log/quests) — challenges for builders who learn by doing
- [build your own](/log/build-your-own) — the starter prompt
- [skill guide](/log/skill-guide) — how the RPG layer works

---

## connect

- [LinkedIn](https://linkedin.com/in/shawntenam)
- [X / Twitter](https://x.com/shawntenam)
- [Substack](https://shawntenam.substack.com)
- [GitHub](https://github.com/shawnla90)

---

## Implementation Notes

### /about page changes
- Strips narrative sections, keeps: identity statement, tool stack grid, network cards, connect links
- Adds prominent CTA card at bottom: "want the full story?" linking to /arc
- Cleaner, faster, profile-card energy
- OG metadata: "GTM Engineer. Builder. Shipped from a monorepo."

### /arc page (new)
- New file: `website/apps/shawnos/app/arc/page.tsx`
- Terminal header: `$ cat ~/arc.md`
- Layer cards with the plumber/SDR/GTM engineer narrative
- Same CSS variable system as about and skill-guide
- Card-based sections, accent highlights, monospace throughout
- Ends with quest board invitation
- OG metadata: "Plumber. SDR. GTM Engineer. The full arc."
- Navigation: add "arc" link to nav alongside about
