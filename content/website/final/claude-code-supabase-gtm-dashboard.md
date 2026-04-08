---
title: "Claude Code + Supabase = GTM Dashboard"
date: "2026-04-08"
excerpt: "I built a GTM dashboard in one Claude Code session. it's incomplete. I still use HubSpot. and that's the whole point. drop #2 of the GTM coding agent starter kit."
category: "gtm-engineering"
featured: true
---

**tl;dr:** drop #2 of the [gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent) repo. a deployable signals dashboard built with Claude Code and Supabase. 5 pages, 16 intent signal types, exponential decay scoring. I still use HubSpot and Instantly. this is not about replacing tools. it's about learning to build alongside them, because that skill is going to matter more than any single tool in your stack.

## something shifted

six months ago I could not have built this.

not because the tools didn't exist. Claude Code existed. Supabase existed. Next.js existed. but the speed at which you can go from "I want a dashboard that shows my signal data" to "here's a deployed 5-page app with charts, filters, and a scoring engine" -- that changed. dramatically. in the past few months.

I sat down, described what each page should show, and Claude Code wrote it. when something was off I described the fix. the iteration loop was fast enough that I shipped 48 files in a single session. schema, API routes, components, pipeline scripts, the works.

this is not me flexing on a tool. this is me telling you that the barrier to building production software just dropped by an order of magnitude. and it's still dropping. every month the sessions get tighter, the output gets cleaner, the things you can build in an afternoon get more ambitious.

which means the people who learn to build now -- even imperfectly, even incompletely -- are going to have a compounding advantage over the people who wait until it's "easy enough."

## what I actually built

the dashboard is the visual layer on top of a go-to-market database I'm building in Supabase. companies, contacts, intent signals, campaign infrastructure.

5 pages:

**Campaigns** -- the operations page. KPI cards for companies in the database, active campaigns, today's send volume, reply rate, bounce rate, active domains. a 24-hour send volume chart. domain health grid showing warmup status and reputation. active campaigns table with per-campaign metrics.

**Database Intelligence** -- data quality scorecard. enrichment coverage across dimensions. pipeline stage distribution. ICP score distribution. top 20 companies ranked by score.

**Accounts Browser** -- the workhorse. searchable, filterable table. click a company to expand and see ranked contacts with unified scores, mapped signals with type badges and snippets, engagement history.

**Signals** -- signal intelligence. 16 intent signal types with their distribution. source breakdown. top 30 signal-rich companies.

**Segments** -- live-computed campaign segments. each segment is a query: high ICP + signals, multi-source signals, engagement warm, ready for outreach. expandable preview tables.

everything polls every 15-30 seconds from Supabase via Next.js API routes. no websockets. for an operational dashboard that refreshes a few times a minute, polling is simpler and it just works.

## the signal model

this is the part I'm most interested in stress-testing.

16 intent signal types, each with a configurable weight. the idea: a signal that someone is evaluating tools in your category (weight 10) is more valuable than a signal that they liked a post (weight 3). and a signal from yesterday is more valuable than a signal from two months ago.

the scoring formula uses exponential decay with a 14-day half-life:

```
score = weight * source_reliability * e^(-0.0495 * days_old)
```

a signal from 2 weeks ago is worth half its original value. from 2 months ago, about 5%. this forces recency. stale intent is not intent.

diversity bonuses reward breadth: +2 per distinct signal type, +3 per distinct data source. a company showing intent across hiring, tool evaluation, and pain expression from both LinkedIn and Reddit scores higher than a company with 10 content engagement signals from one platform.

the weights are my best guess right now. real data will tell me if they're right. that's part of why I'm sharing this now.

## the 3-contact rule

one design decision worth calling out.

the schema enforces a maximum of 3 ranked contacts per company. a Postgres trigger blocks a 4th from being inserted. this is not a limitation. it's the whole point.

when you can only have 3 contacts, you have to decide: who is the decision maker? who is the champion? who is the technical evaluator? you have to rank by quality. you have to think about the buying committee before you sequence.

the rest go into an overflow table for reference. but your outbound targets the 3 people who actually matter.

this is the kind of constraint that SaaS tools don't give you because it would make their numbers look smaller. "10,000 contacts in your database" sounds better than "1,200 contacts, 400 companies, 3 ranked per company." but the second one is the one that converts.

## I still use HubSpot and Instantly

let me be direct about this because it's central to what I'm doing.

I use HubSpot as my CRM. I use Instantly for outbound sequences. I use Apollo for enrichment. those tools are good at what they do.

this dashboard is not a replacement. it's the layer I'm building on top, alongside, and in sync with those tools. I'm building my own database. writing my own signal logic. designing my own segments. the dashboard visualizes all of that.

it stays in sync because I built both sides. the database schema matches how I actually think about my market. the signal weights reflect what I actually care about. the segments are queries I wrote, not someone else's abstraction.

when I need a new view next week, I add it in 20 minutes. when something looks off, I know which table to check. when a scoring weight feels wrong, I change one number in a config file.

you cannot do that with a vendor's dashboard. you can configure it. you can customize it within their parameters. but you can't fundamentally change how it thinks about your data.

## why I'm sharing this incomplete

I haven't sent a single email campaign through this dashboard yet. the campaign pages show seed data. the signal pipeline is running against sample data, not live intent.

I'm sharing it anyway. on purpose.

because what you see today will look different next week when I start sending. the campaign pages will light up with real send volume. the signals page will show live intent data flowing from a cron. the scoring weights will get tuned based on what actually correlates with replies.

and then I'll push those updates to the repo. and the next week. and the week after.

this is the content model I believe in. not "I built a finished thing, here's the final version." but "I'm building this thing, here's where it is right now, here's where it's going." because the building process is where the learning happens. the finished product is just the last frame.

## the growth engineering movement

there's a shift happening right now that I don't think enough people are paying attention to.

six months ago, building a custom dashboard required a team, or at minimum a frontend engineer who knew React, a backend engineer who knew SQL, and weeks of development time. today a single person with Claude Code can build the same thing in an afternoon.

this is not an exaggeration and it's not hype. I did it. the repo is public. you can verify every file.

and it's not just dashboards. it's enrichment pipelines. it's scoring engines. it's automation scripts. it's content systems. it's operational infrastructure that used to require headcount and now requires a CLAUDE.md file and a clear description of what you need.

the people who learn to build these things now -- even messy, even incomplete, even alongside the SaaS they're already paying for -- those are the people who are going to get picked up by the companies that realize they need this skill. or they're going to build their own thing. either way, they win.

because the tools are only going to get better. the context windows are getting larger. the models are getting faster. the iteration loops are getting tighter. what took me one session today will take 20 minutes in six months.

but the skill of knowing what to build, how to describe it, how to structure the context, how to direct a session -- that compounds. the person who starts building today is not just building a dashboard. they're building the muscle that lets them build the next thing, and the thing after that, faster and better every time.

## why I open source this

I'm not going to pretend this is purely altruistic. open-sourcing builds credibility, attracts the right people, creates conversations I want to be in.

but the real reason is simpler. this stuff works. and the people who would benefit most from learning it are the ones who can't afford the courses, can't afford the consultants, can't afford to spend six months figuring out the stack on their own.

you can still buy every SaaS tool on the market. you probably should buy some of them. the point of this repo is not "stop paying for HubSpot." the point is: experience what it feels like to build your own system. understand how a database schema shapes your outbound strategy. see how signal scoring works under the hood. learn what happens when you can add a dashboard page in 20 minutes instead of waiting for a vendor.

and then see where that takes you.

maybe it takes you to a better understanding of the tools you're already using. maybe it takes you to building internal tools at a company that values that skill. maybe it takes you to building something entirely your own.

I don't know where it takes you. I just know the skill matters, it's learnable, and the barrier to entry has never been lower.

## what's in the drop

everything is in the [gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent) repo.

the dashboard starter: `starters/signals-dashboard/` -- 48 files, Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, Recharts, Supabase.

the schema: `starters/signals-dashboard/schema/` -- 3 SQL files. run them in order in Supabase and you have a working backend with seed data.

the pipeline: `starters/signals-dashboard/pipeline/` -- 3 Python scripts. discover companies via Exa API, score signals with exponential decay, load everything to Supabase with domain dedup. swap Exa for Apollo, Clay, or a CSV and the rest still works.

the chapter: `chapters/11-build-your-dashboard.md` -- full walkthrough of the architecture, signal model, every page, and the pipeline.

MIT license. fork it. build on it. if you make something, open a PR.

## what's next

- sending actual email campaigns through the dashboard and watching the pages light up with real data
- connecting the signal pipeline to a cron for live intent data
- tuning the scoring weights based on what actually correlates with replies
- adding more segment logic as patterns emerge from real outbound
- pushing every update to the repo as it happens

star the repo if you want to follow along. I'll be updating it weekly.

---

**related posts:** [the AI is the teacher](https://shawnos.ai/blog/terminals-not-courses) | [6 weeks of building with Claude Code](https://shawnos.ai/blog/6-weeks-of-building-with-claude-code)

the full repo and all scripts are on [GitHub](https://github.com/shawnla90/gtm-coding-agent). the dashboard starter is in `starters/signals-dashboard/`.
