---
title: "Your HubSpot Is Now an Outbound Engine"
date: "2026-04-20"
excerpt: "Friday I showed you the connection. Today: step two. Pull qualified contacts, enrich them in Apollo, run them through a Claude subprocess that returns three angles per contact, write all three back as custom HubSpot properties."
category: "ships"
featured: true
---

# Your HubSpot Is Now an Outbound Engine

Your HubSpot is now an outbound engine.

Friday I showed you the connection. Private app token, Claude Code skill, your terminal moves deals. That was step one. This post is step two.

Pull qualified contacts. Enrich them. Have Claude reason on each one. Write three new angles back as custom HubSpot properties. Your CRM doesn't just have names anymore. It has the angles you'd otherwise be filling in by hand at 11pm.

Here's what it looks like running:

![Engine workflow: HubSpot pull, Apollo enrich, Claude subprocess, prospect card flip](/blog/hubspot-outbound-engine.gif)

## The four stages

### Stage 1: pull

The skill you built Friday already knows how to talk to HubSpot. The first move is just a query: contacts where `lifecycle = MQL` in the last 7 days, give me the list. About 23 contacts in my run today, including Sarah Chen, VP Growth at Ramp.

This is the one stage where you don't need anything new. If Friday's skill is wired right, this is a single function call.

### Stage 2: enrich

Apollo's `people/match` endpoint. You feed it an email, you get back a profile: title, company size, stack, LinkedIn URL, location. The thing I care about most is the stack. Knowing whether someone runs Outreach + Apollo or whether they're on HeyReach + lemlist changes the angle.

Apollo is also where you backfill missing emails. Some contacts come into HubSpot via form fills with personal emails. Apollo has the work email. You patch the contact record on the way through.

### Stage 3: subprocess

This is the part I want you to pay attention to.

Three sequential Claude calls per contact would work. Three prompts, three responses, average it out. But it's slow and you lose the benefit of running all three with the same shared context.

The better pattern is a Claude subprocess that fans three children out in parallel. Each child gets the same context (the enriched contact profile) but asks a different question:

- What pain points are specific to their stack?
- What's an ice breaker grounded in something real about this person or company?
- What's the angle you take when you actually want a reply, not just a polite skip?

Each child returns a JSON object with one field. The parent merges them into one payload. Concurrency capped at five so the token spend stays sane. Responses cached by contact ID so re-runs cost almost nothing.

If you're using Claude Code's Skills, this is genuinely a few dozen lines.

### Stage 4: write

Three new HubSpot custom properties on the Contact object:

- `engine_pain_points` (multi-line text)
- `engine_ice_breaker` (multi-line text)
- `engine_poke_the_bear` (multi-line text)

All three live in a custom property group called "Engine Intelligence." On the contact card in HubSpot, the SDR sees them rendered as readable paragraphs alongside Email and Phone. They're not tags. They're not scores. They're sentences your reps can read out loud and then act on.

The PATCH is one call per contact. `/contacts/{id}`, three properties, done. About 80ms in my run.

> **Heads up: a newsletter is dropping Monday — Level Up GTM.**
>
> Each Sunday evening, one play I shipped that week, runnable, with the prompt and the gotchas. The inaugural issue is the engine you're reading about right now. Subscribe link goes live on the LinkedIn newsletter Monday morning.

## The actual code

You don't need to write the code. You need to write the prompt that writes the code. Paste this into your Claude Code session:

```
Extend the HubSpot skill we built Friday. Add an Apollo client (key in env). 
Add three new HubSpot custom contact properties: engine_pain_points, 
engine_ice_breaker, engine_poke_the_bear, all in a new group called 
"Engine Intelligence." 

Build a loop that:
1. Pulls all contacts where lifecycle changed to MQL in the last 7 days
2. Runs each through Apollo people/match for enrichment
3. Sends the enriched profile through a Claude subprocess that returns 
   those three fields as JSON
4. PATCHes the contact with all three values

Cap subprocess concurrency at 5. Cache Apollo responses in SQLite by 
contact ID to stay under rate limits. Walk me through the property 
setup in HubSpot first, then scaffold the script.
```

Let it ask you the questions. It will. The first one is usually about whether to enrich-then-reason or reason-then-enrich. The second one is about what to do when Apollo returns nothing.

## Two paths to ship it

**Path 1: extend Friday's CLI skill.** About 80 lines on top of what you already have. Three new endpoints, one new database table, one Apollo client. If you live in your terminal anyway, this is the obvious move. Loop runs in about 4 minutes for 23 contacts.

**Path 2: Claude Cowork.** For folks who don't want to live in the terminal. Build the same engine inside Claude Cowork. Add the HubSpot and Apollo connectors. Save the engine prompt as a Skill. Wire a folder connector at `~/engine-inbox/` so dropped CSVs trigger the Skill. Each row runs through the same enrich, reason, write loop.

It's slower than the CLI loop because Cowork runs each task interactively, but it removes the terminal entirely. Hand someone a shared folder, they're using the engine before lunch. Bonus: Cowork keeps a run log so you can replay any contact's enrichment after the fact.

## Three honest gotchas

**Apollo rate limits.** 180 requests per minute on the credits plan. Cache in SQLite by company domain. You'll thank yourself the first time you re-run a batch and it costs nothing.

**Subprocess concurrency.** Cap at 5 parallel or you'll burn tokens fast on the first run of a vertical. The pain-point prompts run cold for the first contact in a new vertical and warm after that. Let prompt caching do the work.

**HubSpot custom property scope.** Friday's setup probably didn't include `crm.schemas.contacts.write`. Add it now or property creation silently fails and you spend 20 minutes wondering why nothing landed.

## What changed for me

I used to fill these in by hand at 11pm. Pain point. Opener. Why-now. That was the part of the day that felt the most "GTM" and the least useful. Now they write themselves before I open the laptop.

The same engine takes website-visitor signals as input. That's next week's play.

---

**Level Up GTM** is a weekly LinkedIn newsletter dropping Monday with one play like this every Sunday evening. Inaugural issue is this post.

*Building this stuff daily at [shawnos.ai](https://shawnos.ai). If you want me to build the engine for you, [shawn@leadalchemy.co](mailto:shawn@leadalchemy.co).*
