---
title: "Three workflows I ran through the Freckle CLI"
date: "2026-07-24"
excerpt: "Enriching Clearbox signups out of Convex, de-masking site traffic, and checking where we surface in AI answers. The steps, the gotchas, and the skill files, ungated."
category: "gtm-engineering"
featured: true
---

**TL;DR:** Freckle shipped a CLI, and I ran it against Clearbox for three jobs. One, enrich new signups sitting in Convex and turn them into a three-sentence pre-call brief. Two, de-mask anonymous traffic on the site and score the companies before anyone gets a message. Three, check which sources AI assistants cite when someone asks about our category, then enrich the domains behind those citations. All three are skill files, the run logs land in Notion through Connect, and the unit you spend is enrichment hours instead of credits.

Enrichment has lived behind a UI for years. You open a tab, build a table, wait on a run, export a CSV, and hand it to whatever actually needed the data. The table was never the point. The thing downstream was the point.

A CLI collapses that. The agent calls enrichment mid-run, gets rows back, and keeps going. No tab, no export, no handoff. If I don't see it in my terminal, I don't really see it, and now I see this.

Andy at Freckle gave us first dibs on the CLI. Everything below came out of that week.

## What actually changes when enrichment gets a CLI?

The tool stops being a destination and becomes a step.

That sounds small until you look at what it does to the shape of your scripts. Every workflow I run is already a Python file plus a skill file plus a SQLite table. Enrichment was the one link in that chain that made me leave the terminal. Now it's a subprocess call with rows going in and rows coming out, which means it can sit inside a cron job, inside an agent run, inside a pre-call routine that fires the morning of the meeting.

It also means the workflow is diffable. The enrichment logic lives in git next to everything else, so when a run gets weird I can look at what changed instead of guessing which UI setting somebody toggled.

## Workflow one: how do I enrich Clearbox signups?

Clearbox runs on Convex, so signups land in the app database as rows the moment someone creates an account. Email, domain, timestamp, plan.

The run is five steps:

1. **Pull.** Query Convex for signups since the last run. `[[exact convex query/export command]]`
2. **Gate.** Split the rows on domain type. Free and personal domains go to a holding table, company domains continue.
3. **Enrich.** Freckle CLI on the company domain first, the person second. `[[exact freckle CLI command + flags]]`
4. **Write back.** Store the enriched profile alongside the signup row so the app and the GTM side read the same record.
5. **Brief.** Render three sentences into Notion through Connect, ahead of the call.

The gate in step two is the whole reason this run is cheap. Enriching a person on a gmail address is a coin flip that costs the same as a real one. Domain first, person second, and only where the domain resolved to a company.

The brief is three sentences on purpose. Nobody reads a full page before a call. What I want on screen is who they are, what they're likely hunting on Reddit, and one thing they'd be glad I already knew.

That last part is where the trust gets built. Someone signs up on Tuesday and gets on a call Thursday. If I show up Thursday with the threads their buyers are already posting in, the call stops being a demo and starts being useful. Show up with something they can use whether or not they buy.

## Workflow two: what does de-masking actually give you?

Anonymous traffic on clearbox.sh resolves to companies. That's the reveal, and on its own the reveal is close to useless. A list of company names is not a list of people who want to talk.

The run that makes it worth something:

1. **Resolve.** Anonymous session to company. `[[exact de-masking command / data source]]`
2. **Filter on path.** Pricing page and docs stay. Homepage bounces and blog reads drop out.
3. **Enrich.** Freckle CLI on the surviving domains, then on the roles worth reaching.
4. **Score.** Fit against ICP, combined with the page signal.
5. **Route.** Only the top slice goes to a human. Everything else goes to the database and waits.

Filtering on path before enriching is the step that makes the math work. Someone who read one blog post is not in market. Someone who sat on pricing and then opened docs is telling you something. Enriching both costs the same hours and only one of them pays.

The pattern is the same one I keep landing on with signal work generally. The reveal is the cheap part. The scoring and the restraint are what turn it into pipeline instead of a list nobody calls.

## Workflow three: how do I use the CLI for GEO?

This one has nothing to do with contact data and it's the one I keep thinking about.

Ask an AI assistant to recommend a tool in our category and it answers from what it can read. GEO is figuring out what it reads, then being in that.

The run:

1. **Build the query set.** The actual questions a buyer asks, not the keywords a marketer picks.
2. **Capture the answers.** Run the set, save what comes back and which sources get cited. `[[capture method / tooling]]`
3. **Extract citations.** Pull every domain the answers lean on.
4. **Enrich the citations.** Freckle CLI on those domains. Who are they, what are they, are they a publisher, a community, a competitor, a review site.
5. **Diff.** Which sources appear over and over, and which of them we are entirely absent from.

Step five is the output that matters. It gives you a ranked list of the places worth being, derived from what the models actually cite rather than from a guess about what they might. In our case it kept pointing back at the same handful of communities, which lines up with what I've been arguing about Reddit for a year now. Nice to have it fall out of a data run instead of out of my own opinion.

## Where does Notion fit in this?

Freckle Connect pushes the run output into the workspace the team already opens.

I care about this more than it probably sounds. The failure mode of terminal-first work is that everything real lives on one machine and nobody else can see it. Screenshots in Slack are not documentation. When the run writes its own log and its own diagram into Notion, the workflow becomes something a teammate can read on Monday without me narrating it.

Connect is one authorization and one config. The same way the Google Workspace connect step works in the Reddit skill, point it at the workspace and the output lands where people already work. Nothing gets migrated.

## What are enrichment hours and why does the unit matter?

Credits price a row. Hours price the work.

`[[confirm exact enrichment-hours definition and rate from the Freckle docs before publishing]]`

The mental shift is the interesting part regardless of the exact billing. When you're counting credits you hoard them, you run smaller batches than you should, and you skip the exploratory run that would have taught you something. When you're spending time you schedule it. You batch the boring stuff overnight and keep the daylight hours for the runs where you're actually looking at the output.

It changed how I sequence: gate first, enrich the survivors, and let the expensive passes run while I'm asleep.

## Where do the skill files live?

All three are packaged as starters in [GTM Coding Agents](https://github.com/shawnla90/gtm-coding-agent), the same shape as [reddit-buyer-signals](https://github.com/shawnla90/gtm-coding-agent/tree/main/starters/reddit-buyer-signals). Drop one into Claude Code, Codex, or Gemini and it runs.

`[[final starter paths once the branch is merged]]`

Each one is a skill file, a Python script, a `.env.example`, and a README with the schema. No dashboard, no seat, no export step. You own the run and you own the rows.

## What I got wrong on the way

**Enriched people before gating domains.** Burned hours on personal email addresses that were never going to resolve. The gate took ten minutes to write and should have been step one.

**Wrote a long pre-call brief.** Nobody reads a page before a call. I didn't read my own. Three sentences, on the screen, or it doesn't get used.

**De-masked every page.** Homepage traffic is noise, and enriching it costs the same as enriching the pricing page. Filter before you spend, not after.

**Tried to make the GEO run answer why.** It tells you which sources get cited. It doesn't tell you why the model trusts them. I wasted a pass trying to get a causal answer out of a descriptive tool.

## FAQ

**Is the Freckle CLI a replacement for a UI enrichment tool?**
For me it replaces the reason I opened one. The work I was doing in a table was always feeding a script, so moving enrichment into the script removed a step rather than adding a tool.

**Do you need to be technical to run these?**
You need to be comfortable in a terminal with a coding agent doing the typing. That's the actual bar now. The skill files exist so the agent has the context, which is most of the work.

**Does de-masking identify individual people?**
The workflows above resolve to companies and then enrich roles at those companies. Treat anything at the person level as regulated, check your jurisdiction, and keep the routing human.

**Why enrich the sources AI assistants cite?**
Because a domain in a citation list is just a string. Enriched, it tells you whether the model is leaning on a community, a publisher, a competitor's own content, or a review site, and each of those implies a different play.

**Where do I get the skill files?**
[GTM Coding Agents](https://github.com/shawnla90/gtm-coding-agent). Ungated, MIT, no email wall.

---

Thanks to Andy at Freckle for the early access. Building against a CLI on week one is the fastest way I know to find out whether a tool fits the way you actually work.

Shawn Tenam
the GTM alchemist
build the pipes, don't rent them.
