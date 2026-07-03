---
title: "70 GitHub Stars, 17 Chapters, and the Operating System Behind My GTM Work"
date: "2026-06-11"
excerpt: "The GTM Coding Agent repo crossed 70 stars. Small internet math, but it started as a Reddit post and turned into a living playbook: the stack, four workflows that still hold up, the Miro onboarding play, and where Clearbox fits."
category: "methodology"
featured: false
---

# 70 GitHub Stars, 17 Chapters, and the Operating System Behind My GTM Work

The GTM Coding Agent repo crossed 70 stars on GitHub.

That is small internet math, but it matters to me because this started as a Reddit post a while back. Since then the thing has turned into a living playbook.

It is now 17 chapters, MIT licensed, and built around one rule: if the work can be expressed as files, scripts, APIs, CLIs, docs, and screenshots, a coding agent can help you run it as an operator sitting beside the system.

*originally an issue of Level Up GTM, my LinkedIn newsletter*

## The stack

The core stack is still simple:

- Claude Code or Codex for orchestration
- Python for glue
- Apify CLI for scraping
- Apollo.io API for enrichment and job-change checks
- Supabase or SQLite for the data layer
- Google Sheets for the human-facing surface
- Google Workspace CLI for Gmail, Calendar, Drive, Docs, and Sheets from the terminal
- HubSpot where the CRM or CMS layer needs to live
- Miro when the system needs to become visible to a client

Each tool has a clean boundary.

Scrape with a scraper. Enrich with an enrichment API. Store the data somewhere you control. Expose it somewhere a human can read. Let the coding agent move between those surfaces without turning the whole operation into a 47-step UI workflow nobody wants to debug.

## Four workflows from the original post that still hold up

### 1. Competitor displacement lists

Scrape the followers or visible audience around three competitors. Then ask the agent to find the overlaps.

The companies showing up across multiple competitors are often evaluating the category, learning the market, or trying to solve the problem already. That makes them better outbound targets than a cold static list.

The pattern:

```
apify call api-ninja/x-twitter-followers-scraper --input='{"username": "competitor_a", "maxFollowers": 10000}'
apify call api-ninja/x-twitter-followers-scraper --input='{"username": "competitor_b", "maxFollowers": 10000}'
apify call api-ninja/x-twitter-followers-scraper --input='{"username": "competitor_c", "maxFollowers": 10000}'
```

Then:

> Find companies that appear in two or more follower lists. Rank them by frequency and ICP fit.

That sentence is where the coding agent earns its keep.

### 2. Scrape, enrich, score, warehouse

The workflow is:

```
Apify CLI -> JSON
Python -> CSV cleanup
Apollo API -> enrichment
Python -> ICP scoring
Supabase or SQLite -> warehouse
Google Sheets -> team view
```

Each step is boring by itself. Together they become the spine of a GTM system.

And because the steps are files and scripts, you can inspect them, rerun them, cache them, and recover when something fails halfway through.

### 3. Apollo job-change sweeps

Every quarter, run your old contacts through Apollo's people matching flow and flag the ones who changed companies.

That does two useful things:

- stops you from emailing stale contacts
- surfaces people who may have buying influence in a new company

The boring operational detail matters here: batch it, cache it, and make the script resumable. The real failure mode is losing progress at row 8,000 because the script was written like a demo.

### 4. Background monitoring

Some workflows should just run in the background.

I have used cron jobs on a Mac Mini for recurring scrapes, checks, and lightweight monitoring. Instagram, Reddit, LinkedIn, ad libraries, competitor pages, inboxes, CRM states.

The output does not need to be fancy. A CSV, SQLite table, Discord message, or Google Sheet is usually enough. The agent wakes up to state that already exists.

## What changed since the Reddit post

The first version of this was mostly "here are the tools and commands."

The newer version is more opinionated: your GTM system should be legible. Make the system legible to you, your collaborators, and the coding agent.

That is why the repo has moved from tool notes into full chapters:

- coding agents vs editors
- context engineering
- OAuth, CLI, and API patterns
- local-first GTM
- Python for GTM
- voice DNA and content workflows
- terminal mastery
- dashboards
- competitive intel
- CRM automation
- voice invocation
- Meta Ad Library intelligence
- programmatic HubSpot landing pages
- and now Miro onboarding boards

Chapter 17 is the newest one.

## Chapter 17: the Miro onboarding play

I used to send proposals. Now, for serious client work, I build the client a map of their engine first.

Sources, database, enrichment, CRM, outreach, website, content, funnel, measurement. The whole system on one board.

Then I pair it with four docs:

- week-one checklist
- tech-stack doc
- API-access doc
- roadmap

A proposal asks the client to grade a promise. A board lets them react to their actual operating system. The first time they see the work, they are already inside it.

The repo now has the chapter and a small starter folder with the board templates: a Miro board template, a six-column pipeline YAML, and the operating rule that if the value is unknown, the agent writes NEEDS INPUT.

Only real tools, real costs, and honest gaps.

The other important lesson from that chapter: a Miro API 200 OK does not mean the board looks good. It only means the request worked.

You still need screenshots. You still need to catch the stacked logos, clipped labels, and connector arrows that run straight through boxes. That screenshot loop is the difference between automation that technically ran and automation you would put in front of a client.

## Where Clearbox fits

Clearbox is the product my co-founder and I have been building from this same operating style.

It is ready and already launched in the practical sense: early users are trying it, the system is running, and we are learning from real usage. We have not done the official launch yet.

The core idea is simple: read Reddit for buying intent signals like frustration in comparison threads. A keyword search misses the person in a comparison thread saying they are fed up with their current tool. Clearbox is built to surface that kind of signal so a human can show up with a useful answer.

The future role here is closer to social growth engineer: someone who understands the product, reads the signal, and replies like a human because there is a real person on the other side of the thread.

Clearbox came out of the same work as the repo:

- scrape the public surface
- structure the signal
- keep the data somewhere inspectable
- use models where they help
- keep humans in the judgment loop

GTM work is becoming more technical, but that does not mean every marketer needs to become a software engineer. It means the best operators will know how to make their work legible to software.

repo.script.doc. schema.screenshot.board.

A command that can be run again tomorrow.

The GTM Coding Agent repo is my attempt to make that learnable in public. It has the workflows I am using, the chapters I wish I had when I started, and enough starter material that you can fork it instead of staring at a blank terminal.

If you are building in this direction, star the repo, fork it, and send me the workflow you are running.

The repo is at [github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent).

I am going to keep adding the pieces as I prove them in the field.

Shawn Tenam
the GTM alchemist
"Make the work legible to software."
