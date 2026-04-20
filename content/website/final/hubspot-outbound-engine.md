---
title: "Your HubSpot Is Now an Outbound Engine"
date: "2026-04-20"
excerpt: "Connect HubSpot to Claude Code with a private app token. Pull qualified contacts, enrich them in Apollo, run them through a Claude subprocess that returns three angles per contact, write all three back as custom HubSpot properties. The full setup, the engine, the trade-offs, and the gotchas in one post."
category: "ships"
featured: true
---

# Your HubSpot Is Now an Outbound Engine

Your HubSpot is now an outbound engine.

Two pieces. The connection is your terminal talking to HubSpot directly, no MCP server, no marketplace app, no browser tab. The engine sits on top of that connection. Pull qualified contacts, enrich them, have Claude reason on each one, write three new angles back as custom HubSpot properties.

Your CRM doesn't just have names anymore. It has the angles you'd otherwise be filling in by hand at 11pm.

Here's the engine running on a single contact:

![Engine workflow: HubSpot pull, Apollo enrich, Claude subprocess, prospect card flip](/blog/hubspot-outbound-engine.gif)

The whole thing fits in this post. Setup first, then the engine, then the trade-offs.

## Part 1: Connect HubSpot to your terminal

Five minutes if you've never done it. Ten if you have to find your password.

### Create a private app

In HubSpot: Settings → Integrations → Private Apps → Create app. Name it something honest. "claude-code" or "terminal" works.

The scopes are where most people slow down. Pick these:

- `crm.objects.contacts.read` and `crm.objects.contacts.write`
- `crm.objects.deals.read` and `crm.objects.deals.write`
- `crm.schemas.contacts.read` and `crm.schemas.contacts.write` (this one matters for the engine. Without it, custom property creation fails silently)
- `content` if you want the terminal to also build and publish landing pages
- Anything else you know you'll touch

Click create. Copy the access token (it starts with `pat-na1-`). Treat it like a password, because that's what it is.

### Save the token

Drop it into a `.env` file. Lock the file down to your user only:

```bash
# .env
HUBSPOT_TOKEN=pat-na1-...

chmod 600 .env
```

If your repo is on GitHub, double-check `.env` is in `.gitignore`.

### Build the Claude Code skill

The skill is the thin wrapper that loads the token and exposes a few HubSpot calls. The shape, in a sentence: a SKILL.md that tells Claude when to use it, plus a small Python or TypeScript module that handles auth and the API.

You don't write the skill by hand. Open Claude Code in your repo and prompt it:

```
Create a Claude Code skill called "hubspot" that loads HUBSPOT_TOKEN from 
.env and exposes functions for: read/write contacts, read/write deals, 
search by lifecycle stage, and create custom contact properties. Use the 
official hubspot-api-client. Add a SKILL.md so Claude auto-invokes when 
I ask anything HubSpot-related. Walk me through any scope I'm missing 
in HubSpot before you scaffold.
```

Let it ask the questions. The first one is usually about scopes. The second is about whether to cache responses.

### First test

Once the skill exists, prompt your terminal:

```
Show me deals over $20,000 still in Discovery, and move them to Negotiation.
```

If everything's wired right, Claude opens the skill, runs the search, prints the matched deals, asks you to confirm the move, and patches them. No HubSpot tab. No clicks.

That's the connection. Now the engine.

## Part 2: The engine

The connection lets your terminal touch HubSpot. The engine is what you build on top so HubSpot becomes a place where work originates, not just where work gets logged.

Four stages.

### Stage 1: pull

Contacts where `lifecycle = MQL` in the last 7 days. Give me the list.

This is the one stage where you don't need anything new. The skill from Part 1 already knows how to search by lifecycle stage. About 23 contacts in my run today, including Sarah Chen, VP Growth at Ramp.

The query is the input to the rest of the engine. You can swap MQL for any segment your team cares about. Opportunities stuck in Negotiation past 14 days. Contacts where the deal owner is unassigned. Accounts where last activity was more than 30 days ago. Same plumbing, different filter.

### Stage 2: enrich

Apollo's `people/match` endpoint. You feed it an email, you get back a profile.

Here's what's actually knowable from this endpoint, because everyone overstates it.

**Reliable:** title, seniority, company size and revenue, industry, work email if you only had a personal one, LinkedIn URL, location, phone when published.

**Tech-detection adds:** primary CRM (HubSpot or Salesforce, sometimes both), productivity stack (Google Workspace or Microsoft 365), some marketing automation that fingerprints publicly, occasional website tech.

**Not reliable:** the full sales engagement stack. Apollo can't tell you if they use Outreach versus Salesloft, or HeyReach versus lemlist. Anything not visible on a public website is invisible to Apollo.

What you do get is enough. Knowing they're on Salesforce instead of HubSpot changes the angle. Salesforce shops have a different buying motion, longer cycles, more stakeholders. Knowing they're a Microsoft shop tells you their IT org has a bias toward enterprise contracts and probably some Azure relationships you can poke at. Combined with title and company size, you have enough context for Claude to reason from.

Apollo is also where you backfill missing emails. Some contacts come into HubSpot via form fills with personal addresses. Apollo has the work email almost always. You patch the contact record on the way through.

One unobvious thing about the cache: cache by company domain, not contact ID. Domains repeat across contacts and that's where the savings are. A re-run of 23 contacts where 14 share 6 domains pays for 6 lookups, not 23. Stash the responses in SQLite and re-runs cost zero.

### Stage 3: subprocess

This is the part I want you to pay attention to.

Three sequential Claude calls per contact would work. Three prompts, three responses, average it out. But it's slow and you lose the benefit of running all three with the same shared context.

The better pattern is a Claude subprocess that fans three children out in parallel. Each child gets the same context (the enriched contact profile from Stage 2) but asks a different question:

- What pain points are specific to a company their size, on their CRM, in their industry?
- What's an ice breaker grounded in something real about this person or company (recent role change, fresh funding round, public hiring spree)?
- What's the angle you take when you actually want a reply, not just a polite skip? The "poke the bear" line.

Each child returns a JSON object with one field. The parent merges them into one payload. Concurrency capped at five so the token spend stays sane. Responses cached by contact ID so re-runs cost almost nothing.

Why fan-out instead of one prompt with three asks? Two reasons.

First, per-field quality is meaningfully better when each prompt has a single objective. The "ice breaker" prompt produces stronger ice breakers when it isn't also being asked to think about pain points in the same response. Tunnel vision is the feature, not the bug.

Second, you can use a smaller model per child without blowing total latency. I'm running haiku-4-5 per child. Total cost ends up lower than one big sonnet call, and latency is lower because the children run in parallel.

The cap that matters is concurrency. Use 5 children max. Above that, prompt-cache hit rate drops because warm prompts don't get reused fast enough. Below 3 and you're not getting the parallelism win. Five is the sweet spot.

The pattern works for any 1-input → N-outputs problem. Not just contacts. Same fan-out for one webpage → 6 SEO meta variants. One transcript → 4 social posts. One commit message → release notes + Slack alert + changelog entry. Same shape, different writers.

### Stage 4: write

Three new HubSpot custom properties on the Contact object. This is where the `crm.schemas.contacts.write` scope from Part 1 earns its keep.

- `engine_pain_points` (multi-line text)
- `engine_ice_breaker` (multi-line text)
- `engine_poke_the_bear` (multi-line text)

All three live in a custom property group called "Engine Intelligence." On the contact card in HubSpot, the SDR sees them rendered as readable paragraphs alongside Email and Phone. They're not tags. They're not scores. They're sentences your reps can read out loud and then act on.

The PATCH is one call per contact. `/contacts/{id}`, three properties, done. About 80ms in my run.

### What makes each of the three actually useful

The prompts are doing real work. Worth understanding what each one is trying to do.

**Pain points.** The trap is generic pain like "scaling outbound is hard." Useless. The fix is anchoring the prompt to size + CRM + industry. "What pain points are specific to a 200-person company on Salesforce in fintech." Now you get "ramp-up time on new SDRs given Salesforce's lead routing complexity." Actionable.

**Ice breakers.** Tied to a real signal. The prompt asks for a single-sentence ice breaker tied to a recent role change, a fresh funding round, a public hiring spree, a podcast appearance. If Apollo doesn't surface a signal, the ice breaker prompt returns null and the SDR knows to skip the personalization or pick a different play. Empty is better than fake.

**Poke the bear.** This is the one that surprised me. The prompt asks: "What angle do you take when you actually want a reply, not just a polite skip?" The output is usually a contrarian observation about their stack or motion. "Apollo + Outreach plateau past 5 SDRs" is the kind of line that earns a defensive reply. Defensive replies are still replies. You're in the conversation now.

The three outputs hit different parts of the SDR's playbook. Pain for the body of the email. Ice breaker for the opener. Poke for the follow-up. One contact, three usable plays.

> **Heads up: a new newsletter is dropping Monday. Level Up GTM.**
>
> Each Sunday evening, one play I shipped that week, runnable, with the prompt and the gotchas. The inaugural issue is the engine you're reading about right now, in tighter form. The blog is the deep dive. The newsletter is the one-cup-of-coffee version that lands in your LinkedIn inbox. Subscribe link goes live Monday morning.

## The actual prompt

You don't need to write the code. You need to write the prompt that writes the code. Paste this into your Claude Code session after Part 1's skill is in place:

```
Extend the hubspot skill we built. Add an Apollo client (key in env). 
Add three new HubSpot custom contact properties: engine_pain_points, 
engine_ice_breaker, engine_poke_the_bear, all in a new group called 
"Engine Intelligence." 

Build a loop that:
1. Pulls all contacts where lifecycle changed to MQL in the last 7 days
2. Runs each through Apollo people/match for enrichment (capture CRM, 
   email provider, company size, title; that's what we'll reason on)
3. Sends the enriched profile through a Claude subprocess that returns 
   those three fields as JSON
4. PATCHes the contact with all three values

Cap subprocess concurrency at 5. Cache Apollo responses in SQLite by 
company domain (not contact ID, since domains repeat) to stay under rate 
limits. Walk me through the property setup in HubSpot first, then 
scaffold the script.
```

Let it ask you the questions. The first is usually about whether to enrich-then-reason or reason-then-enrich. The second is about what to do when Apollo returns nothing. Sensible defaults exist for both. Let Claude propose them and approve.

## Two paths to ship it

**Path 1: extend the CLI skill from Part 1.** About 80 lines on top of what you already have. Three new endpoints, one new database table for Apollo cache, one Apollo client. If you live in your terminal anyway, this is the obvious move. Loop runs in about 4 minutes for 23 contacts. Cost in my run was around $0.02 per contact in API spend.

**Path 2: Claude Cowork.** For folks who don't want to live in the terminal. Build the same engine inside Claude Cowork. Add the HubSpot and Apollo connectors. Save the engine prompt as a Skill. Wire a folder connector at `~/engine-inbox/` so dropped CSVs trigger the Skill. Each row runs through the same enrich, reason, write loop and lands back on the contact in HubSpot.

It's slower than the CLI loop because Cowork runs each task interactively, but it removes the terminal entirely. Hand someone a shared folder, they're using the engine before lunch. Bonus: Cowork keeps a run log so you can replay any contact's enrichment after the fact.

## Trade-offs before you go all-in

A few things I want you to weigh before you build this and start running it weekly.

**Token consumption bites.** Subprocess fan-out plus a tight loop burns tokens fast on first runs. Cap concurrency at 5. Cache aggressively by stable key. Monitor your daily spend the first week so the bill matches your mental model. After the first run on a new vertical, prompt caching kicks in and the cost stabilizes.

**Claude Code vs your IDE or terminal.** Claude Code gives more freedom (skills, file ops, git ops, agent loops), but you have to live in the CLI. If you want a UI, Claude Cowork is the answer, or pin the script to a Raycast/Alfred shortcut so it runs without opening a terminal at all. Pick your interface and commit to it.

**Learning curve is real.** You're learning prompts, scope hygiene, .env discipline, when to subprocess vs inline a call. Steeper than clicking through a SaaS UI for a week. Pays back fast once you're past it because you can build five workflows in the time a SaaS would let you configure one.

**Local vs cloud.** Local CLI is fast, cheap, and tied to your laptop. Cloud (Cowork, Lambda, Modal) keeps it running when your laptop sleeps but adds secrets-management overhead and slower iteration loops. Start local. Move loops you actually re-run weekly to the cloud. Don't move things you only run once.

## Three honest gotchas (the play-specific ones)

**Apollo rate limits.** 180 requests per minute on the credits plan. Cache in SQLite by company domain (not contact ID, since domains repeat across contacts and that's where the savings are). You'll thank yourself the first time you re-run a batch and it costs nothing.

**Subprocess concurrency.** Cap at 5 parallel or you'll burn tokens fast on the first run of a vertical. The pain-point prompts run cold for the first contact in a new vertical and warm after that. Let prompt caching do the work.

**HubSpot custom property scope.** If you skipped `crm.schemas.contacts.write` in Part 1, custom property creation will silently fail and you'll spend 20 minutes wondering why nothing landed. The skill's error message will help, but the underlying HubSpot API returns a misleading 200 in some cases. Add the scope upfront.

## What changed for me

I used to fill these in by hand at 11pm. Pain point. Opener. Why-now. That was the part of the day that felt the most "GTM" and the least useful. Now they write themselves before I open the laptop.

The contact cards in HubSpot read differently now too. Before the engine, every contact looked the same. Name, title, company, lifecycle stage, owner. Now each one carries three short paragraphs underneath that tell you why this contact is interesting and how to open the conversation. The SDR doesn't have to think. They can just act.

## What's next

The same engine takes website-visitor signals as input instead of MQL filters. If a stranger lands on your pricing page tomorrow morning, by lunch HubSpot has the company, the relevant tech-stack signals, the pain points, and the opener. The SDR has a reason to reach out before the visitor goes cold.

That's next week's play. It's the difference between a CRM that records what happened and a CRM that surfaces what to do next.

---

**Level Up GTM** is a weekly LinkedIn newsletter dropping Monday. One play like this every Sunday evening, with the hook, the prompt, the gotchas. The inaugural issue is this post in newsletter form.

*Building this stuff daily at [shawnos.ai](https://shawnos.ai). If you want me to build the engine for you, [shawn@leadalchemy.co](mailto:shawn@leadalchemy.co).*
