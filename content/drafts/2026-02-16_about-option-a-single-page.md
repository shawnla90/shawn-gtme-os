# About Page — Option A: Single Page Reimagined

> Route: `/about`
> Replaces: `website/apps/shawnos/app/about/page.tsx`
> Terminal header: `$ cat ~/about.md`

---

## Section 1: skip this if you want the boring version

every GTM creator has the same about page.

"I was an SDR. then I found Clay. now I teach people how to use it."

cool. here's mine.

except mine starts with copper pipe and a blowtorch.

---

## Section 2: the layers

I didn't go from SDR to GTM engineer in a straight line. I went through three layers, and each one rewired how I think about building.

### layer 1: plumber

before tech, I was a plumber. not a metaphor. actual plumbing. diagnosing problems by listening to walls, tracing pipes nobody else wanted to touch, fixing systems under pressure with no documentation.

**what it taught me:** every system has a logic. follow the flow. if something breaks upstream, everything downstream fails. and nobody respects the fix until the water stops leaking.

### layer 2: SDR

200+ cold emails a day. primary domains, no warmup, SalesLoft sequences, Salesforce activity logging by hand. building buying committees from scratch in accounts nobody wanted.

**what it taught me:** volume is a teacher. rejection is data. and the people who manually grind through outreach are the ones who actually understand what should be automated later.

### layer 3: GTM engineer

I stopped working inside the systems and started building them. Clay tables, HubSpot automation, Instantly sequences, web reveal workflows, enrichment pipelines. the same work I used to do by hand, now running on infrastructure I designed.

**what it taught me:** the best builders are the ones who did the job before they automated it. you can't engineer what you don't understand.

none of these define me. all of them sharpen what I ship.

---

## Section 3: the thesis

this is not vibe coding.

I don't prompt once and ship whatever comes back. I use plan mode before I write a single line. I use ask mode when something breaks. I run sub-agents for parallel work. I test, I break things, I read the error, I fix it, I ship it.

AI doesn't do the work for you. it accelerates the work you already understand.

every page on this site was iterated, not generated. every skill was debugged before it was documented. every campaign template was tested on real pipeline before it became a playbook.

the repo has over 400 files. zero of them were one-shot prompts.

---

## Section 4: three sites, one system

this isn't vanity. it's architecture.

**shawnos.ai** — the builder. the personal operating system. daily tracker, RPG progression, avatar system, API layer. this is where the infrastructure lives.

**thegtmos.ai** — the playbook. GTM engineering frameworks, workflow breakdowns, campaign architectures. the systems behind pipeline generation.

**thecontentos.ai** — the voice engine. content-as-code publishing, voice DNA, repurpose pipelines. how the words get made and where they go.

three domains. one monorepo. every page, every API route, every generated image comes from the same codebase. nothing here is an accident.

---

## Section 5: build with me

this isn't a portfolio you look at. it's a system you can fork.

the API is open. the progression engine is documented. the quest board has challenges for builders who want to learn by doing, not by watching.

take the approach. break it. rebuild it better. come at me with a better pixel.

- [the API](/api) — endpoints, schemas, live data
- [quest board](/log/quests) — challenges for builders
- [build your own](/log/build-your-own) — the starter prompt
- [skill guide](/log/skill-guide) — how the RPG system works

---

## Section 6: connect

- [LinkedIn](https://linkedin.com/in/shawntenam)
- [X / Twitter](https://x.com/shawntenam)
- [Substack](https://shawntenam.substack.com)
- [GitHub](https://github.com/shawnla90)

---

## Implementation Notes

- Rewrite `website/apps/shawnos/app/about/page.tsx`
- Same CSS variable system, monospace aesthetic, terminal chrome
- "the layers" section uses card components (one card per layer)
- Each card: title, one-line summary, "what it taught me" block
- "three sites" section reuses existing network card pattern
- "build with me" links are accent-colored CTAs
- OG metadata update: "Plumber. SDR. GTM Engineer. The arc and the operating system."
