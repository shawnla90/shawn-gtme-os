---
title: "10 More Repos I Use in My Actual GTM Stack"
date: "2026-06-15"
excerpt: "The follow-up list: repos I use to source data, scrape pages, build dashboards, connect tools, plan work, and give coding agents better context. Plus three of my own."
category: "gtm-engineering"
featured: false
---

# 10 More Repos I Use in My Actual GTM Stack

The first repo list I posted pulled more views in a week than anything else I'd written that month, and the comments all asked the same thing: what else is in the stack? These are repos I use to source data, scrape pages, build dashboards, connect tools, plan work, and give coding agents better context.

Same rules as last time. Everything here runs in my actual workflow, and I'll tell you exactly what job each one does.

*originally posted on [r/GTMbuilders](https://www.reddit.com/r/GTMbuilders/comments/1u61m4s/10_more_repos_i_use_in_my_actual_gtm_stack/)*

## 1. PostHog

[github.com/PostHog/posthog](https://github.com/PostHog/posthog)

PostHog tracks UTMs, visits, product events, and campaign attribution.

did anything happen after the click?

## 2. Apify CLI

[github.com/apify/apify-cli](https://github.com/apify/apify-cli)

Apify is the one I reach for when I need public data fast.

Use it for competitor followers, Reddit threads, Meta ads, public directories, and Y Combinator lists.

Turn that public data into tables before a campaign starts.

The CLI matters because the agent can run it from the terminal, fetch the dataset, and keep working.

## 3. Playwright

[github.com/microsoft/playwright](https://github.com/microsoft/playwright)

Playwright CLI headless is the browser layer.

Scraping, screenshots, QA checks, form tests, app verification. If an agent needs to read a real page or prove something worked, Playwright is usually the way in.

I use it for checking pages, verifying dashboards, grabbing screenshots, and confirming the API result actually looks right on screen.

## 4. Supabase

[github.com/supabase/supabase](https://github.com/supabase/supabase)

Supabase is my cloud SQL.

When a GTM system needs to live beyond my Mac, this is where it goes. Campaign state, lead tables, product data, dashboards, auth, cloud Postgres.

Local-first works until another person or process needs the data too.

## 5. better-sqlite3

[github.com/WiseLibs/better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

SQLite is my local SQL.

Fast, boring, inspectable. I use SQLite for local campaign state, intel databases, enrichment caches, and anything I want an agent to read without asking a SaaS dashboard for permission.

Cloud SQL plus local SQL is the pattern.

Supabase when it needs to be shared. SQLite when I need speed, git, and iteration.

## 6. HubSpot CLI

[github.com/HubSpot/hubspot-cli](https://github.com/HubSpot/hubspot-cli)

I have my own HubSpot pattern here, but the official CLI and docs are still the place to start.

Private app token. Scoped permissions. Create the properties you need. Write enrichment back to the exact fields your team actually uses.

Use HubSpot as the CRM layer. Keep the operating system in the repo.

## 7. Superpowers + Get Shit Done

[github.com/obra/superpowers](https://github.com/obra/superpowers)

[github.com/gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done)

These are useful because they show different versions of agent orchestration.

Superpowers is more skill/methodology driven. GSD is more spec/context/planning driven.

Test both and keep only the parts that produce shipped work.

## 8. Obsidian Nexus

[github.com/ProfSynapse/nexus](https://github.com/ProfSynapse/nexus)

I am a fan of Obsidian.

You should test your own note-taker and figure out what actually connects to your workflow, but Obsidian is a good choice if you care about local notes, backlinks, graph views, and long-term thinking.

Nexus connects Obsidian to agents. That means notes can become working context for agents.

## 9. d3-force

[github.com/d3/d3-force](https://github.com/d3/d3-force)

d3-force is for when the data is actually a graph.

Competitors, followers, signals, accounts, posts, comments, tools, people. Sometimes the shape matters more than the table.

d3-force surfaces clusters and relationships that a normal table hides.

## 10. xyflow

[github.com/xyflow/xyflow](https://github.com/xyflow/xyflow)

xyflow maps nodes, edges, decisions, and handoffs.

xyflow is great for connector maps, CRM flows, campaign systems, agent workflows, onboarding boards, and basically any GTM system where a paragraph would make the thing harder to understand.

## Bonus 3 from my own GitHub

These three hold the rest of the stack together.

### 11. Recursive Drift

[github.com/shawnla90/recursive-drift](https://github.com/shawnla90/recursive-drift)

This one is mine.

This repo shows how I structure recurring work across content, product, outbound, CRM, agents, handoffs, and long-running builds.

It gives the work a shape the agent can keep returning to.

### 12. Context Handoff Engine

[github.com/shawnla90/context-handoff-engine](https://github.com/shawnla90/context-handoff-engine)

Also mine.

This keeps context alive for Claude Code across sessions, terminals, and agents.

After a while the real constraint is whether the agent can find where the work actually lives.

Handoffs are how I keep sessions from becoming disposable.

### 13. Website With Soul

[github.com/shawnla90/website-with-soul](https://github.com/shawnla90/website-with-soul)

Also mine.

Memory, voice, personality, and a real system behind the site.

Good for anyone building a founder site, personal OS, content hub, or AI-native website that needs to feel like a person lives inside the work.

## Special mention: GTM Coding Agents

[github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent)

This is still the main one.

It is up to Chapter 17 now and I keep updating it as I learn what actually works.

Next up is programmatic emails. I am still testing the workflow before I write the chapter, because I do not want to publish the pattern until I know where it breaks.

## The closing note

The reception on round one told me the appetite for real stack breakdowns is bigger than the appetite for takes. More of these coming.

Shawn Tenam
the GTM alchemist
"Boring tools, inspectable data, shipped work."
