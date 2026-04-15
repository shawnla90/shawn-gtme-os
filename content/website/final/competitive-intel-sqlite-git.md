---
title: "I Committed My Competitive Intel Database to Git"
date: "2026-04-15"
excerpt: "Your competitive intel lives in a vendor dashboard. I committed mine to git. SQLite in the repo, Apify and Claude as a subprocess, a d3-force graph on top. The fourth layer almost no stack ships."
category: "ships"
featured: true
---

**tl;dr:** I open sourced my competitive intel engine as Chapter 12 of the GTM Coding Agent repo. It runs on SQLite committed to git, Apify CLI scrapers, the Claude CLI as a subprocess for analysis, and a d3-force graph for the UI. Most intel stacks already have a cloud database, an enrichment layer, and an orchestrator. The fourth layer almost no one ships is version control for the data itself. Five instances of this codebase run on my machine, one per industry. Clone it, seed it, deploy it to Railway, own your intel.

---

Your competitive intel lives in a vendor dashboard.

You pay every month. You cannot diff a snapshot from last quarter. You have no audit trail when the data changes. When the vendor gets acquired or raises their price, your history goes with it.

I got tired of that. So I committed my intel database to git.

### the path that got me here

The stack did not arrive fully formed. It fell out of iteration.

I started on direct SQL plus the Claude SDK. Opus credits evaporated at batch sizes that made me stop and count. The model was right. The bill was not.

Then I added Apify for scraping and Clay for enrichment. Both good tools. Together, slow to iterate because every config change is a UI click in software I do not own.

Then I moved to the Claude CLI as a subprocess. Same model, far fewer dollars, full context prompts piped in, structured JSON piped out.

Then I moved the intel database to SQLite committed to git. Every signal is a row. Every scrape is a commit. A diff between two commits is a changelog for the data itself.

None of those steps was wasted. The Clay instincts transfer to SQL joins. The SDK instincts transfer to the subprocess pattern. The Apify pipeline transfers to whatever orchestrator you drop on top. Every tool you invest time into becomes a skill that codifies your go to market muscle.

This repo is where my detour landed.

### why this drop, why now

Drop 1 was 10 chapters on using coding agents for go to market. Drop 2 added a signals dashboard built on Supabase. This one goes the other way. It pushes the data layer down into a file you own.

Chapter 12 of the GTM Coding Agent repo is now live. It ships with a full starter called `nexus-intel`: Next.js 16, React 19, a d3-force graph, Apify CLI scrapers, and a SQLite database that lives in `data/intel.db`. You clone it, run one Python script, and `npm run dev`. The graph renders against real seeded data from public competitors and thought leaders.

I have been running five instances of this same codebase for most of the year, one per industry. Same engine, different seed, different ICP. It is the most reused pattern I own.

### the stack most people already have

An intel stack usually looks like this today.

1. A cloud database. Supabase for Postgres.
2. An enrichment and review layer. Clay for waterfalls, Airtable, Sheets, or Retool for manual review.
3. An orchestration layer. Cargo AI for agentic runs, cron plus Python when you need raw control.

Three layers. Most people stop there.

The layer I want to argue for is the fourth one.

### the fourth layer: version control for the data

**`data/intel.db` is a file. Committed to git.**

`git log data/intel.db` shows me when every signal landed. `git checkout <sha> -- data/intel.db` time travels me to any prior snapshot. A diff between two commits is a changelog for the data itself.

None of that exists when your intel only lives in a managed Postgres or a vendor dashboard. Those are durable. They are not diffable.

SQLite gives me that git native snapshot layer without replacing anything above it. Supabase still handles the multi user warehouse. Clay still handles enrichment workflows. Sheets still handles manual review. SQLite is the slice that lets me audit, roll back, fork, and hand off a full analysis dataset as a single file.

### the visual: what a graph gives you that a table cannot

I have lived in spreadsheets for a decade. They flatten everything.

A competitor launching a new product is one row. An account you track engaging with that competitor is another row. A thought leader with 80K followers who mentioned both of them in the last 72 hours is a third row. In a spreadsheet those three rows are unrelated.

A force directed graph makes the relationship visible. The node sizes, the proximities, the clusters. When I open `/nexus` in my browser, I see what I actually have. Who is connected to whom. Which companies share thought leaders. Which sources cluster around which topics.

It is a different kind of legibility than a table. You see the shape of your market.

### the connectors are not magic

I use Apify CLI for scrapers. LinkedIn via `harvestapi`. X via `apidojo/tweet-scraper`. Reddit via `trudax/reddit-scraper-lite`. They are public actors. Python wraps them, writes directly to SQLite.

Claude runs as a subprocess for analysis. Not the SDK. Not an API wrapper. The actual CLI, called from Python, with full context inputs piped in and structured JSON piped out. The model reads the SQLite rows, extracts signals, writes them back into `data/signals`.

No SaaS middle layer for the core loop. I own the actors. I own the cadence. I own the cost.

### the UI is just react. the logic is the database.

This is the part that matters most, and it is the part you see last.

The whole Next.js app is about 30 components. The graph is one of them. The drawers are others. The filter bar, the momentum chart, the lead review panel. That is all presentation. Swap any of them out. Build a new page. Put it on a Rust desktop app with `rusqlite`. Point a Retool instance at the SQLite file. Change the theme. It does not matter.

The logic is in the database. The schema enforces what a signal looks like. A trigger decays scores over time. A view joins engagers to sources to topics. When I want to change how something works, I change the SQL. I do not hunt through a React component tree.

This is why I can run five instances of the same codebase in five different industries. The UI is identical. The seed data, the ICP, the signal taxonomy, the weights, those change. They all live in the database or in config files loaded into the database.

### what a version controlled database unlocks

Once the data is a file in git, a lot of things compose cleanly.

- **Webhooks.** A trigger fires when a signal crosses a score threshold. Hit Zapier, hit HubSpot, hit Slack.
- **Emails.** Generate a weekly digest from a SQL query. `SELECT * FROM signals WHERE urgency > 0.7 AND created_at > date('now', '-7 days')`. Pipe that through a template. Send.
- **Agent workflows.** Claude can analyze the database directly. Ask a question about your accounts and it writes the SQL, runs it, summarizes the result. The agent operates on the data, not on a vendor API.
- **Scripts.** A Python script can read the database, enrich with Apollo, rewrite. A bash script can diff two snapshots. A Rust binary can read the same file over WebSocket for a local dashboard.
- **Handoffs.** Email a `.db` file to a collaborator. 200 KB. They open it in TablePlus or DB Browser. They see the exact snapshot I was looking at.

The database is the logic. The UI is the presentation. The connectors are swappable. The graph is a nice view on top. The git layer is the time machine.

### low cost iteration

Moving fast on this stack looks like this.

- Change a signal taxonomy: edit `scripts/analyze_content.py`, rerun. 5 seconds.
- Change how urgency decays: edit `scripts/_decay.py`, rerun. 10 seconds.
- Add a new source: `INSERT INTO sources ...`, commit, push. 30 seconds.
- Roll back last week of scoring: `git checkout HEAD~7 -- data/intel.db`. 1 second.
- Spin up a sibling instance for a new industry: `cp -r ~/apollo-intel ~/new-intel; rm -rf .git; git init`. 5 minutes.

No vendor migration. No schema review call. No waiting on an integrations roadmap. The cost of iterating is the cost of editing a file.

### what ships in the starter

`starters/nexus-intel/` inside the GTM Coding Agent repo. One clone gets you everything.

```
nexus-intel/
  data/
    schema.sql            full schema for signals, engagers, sources, topics
    seed-sources.sql      41 public competitors, thought leaders, subreddits
    icp-profile.json      example B2B SaaS ICP
    intel.db              pre-built demo DB (204 KB, committed)
  scripts/
    init_db.py            build the DB from schema plus seed
    scrape_linkedin.py    Apify harvestapi wrapper
    scrape_x.py           Apify tweet-scraper wrapper
    scrape_reddit.py      Apify reddit-scraper-lite wrapper
    analyze_content.py    Claude subprocess for signal extraction
    score_icp.py          scaffolded four dimension ICP scoring
    _decay.py             urgency decay helpers
  src/
    app/                  Next.js 16 pages (/, /signals, /nexus, /leads)
    components/           React components (graph, drawers, filters)
    lib/db.ts             better-sqlite3 setup
  docs/
    architecture.md
    railway-deploy.md
    adding-connectors.md
    voice-dna.md
```

Chapter 12 in the repo walks through the whole thing. The architecture, why SQLite was the right call, how to swap the seed for your own, and how to deploy to Railway behind basic auth.

### what stays closed

To be clear about what is in the starter and what is not.

The starter ships the scaffolding. The scoring weights are calibrated for the public seed, not for any specific account. The taxonomy prompts are minimal. The decay half lives default to generic values. The graph layout is generic.

My production instance has coefficients tuned from 12 months of real data, taxonomy prompts that match how my buyers talk, and a ring structure I have not yet shipped in my own UI. That stays on my laptop until I am ready.

The starter is the bones. The calibration is the product. If you want help with the calibration for your market, that is what the managed tier is for.

### what is next

This is where the repo goes from here.

- **Railway deploy.** The starter deploys to Railway behind basic auth. I will ship a public demo at `nexus-intel.shawnos.ai` once the public seed scrapers have run for a week.
- **More connectors.** GitHub activity. Product Hunt. Crunchbase. I will add them as Apify actors become available.
- **Sibling intel patterns.** Chapter 13 will likely cover a different sibling instance. Same engine, different vertical.

I will be updating the repo as this happens. Star it if you want to follow along.

### the thesis

SaaS vendors sold us the idea that our data should live in their dashboard. That was true when writing a database meant hiring a team. It is not true anymore.

A coding agent can spin up the scaffolding in an afternoon. A SQLite file is 200 KB. Git handles the snapshots. The UI is React you can swap out. The connectors are Apify actors you already know how to write.

Your intel belongs in a file you own. The vendor dashboard is the view, not the source of truth.

### fork it

GitHub: https://github.com/shawnla90/gtm-coding-agent

Chapter 12 has the full walkthrough. The starter is in `starters/nexus-intel/`. MIT license. Clone it, seed it with your own sources, deploy it to Railway.

If you build on it, open a PR or send me the repo. I want to see what you make.
