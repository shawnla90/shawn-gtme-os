---
title: "the GTM coding agent hit 100 stars: I ran its Quick Start live in Claude Code"
date: "2026-07-06"
excerpt: "Episode 2 of Founder's Journey is live. The GTM coding agent repo crossed 100 GitHub stars, so I open it up, define go-to-market engineering, and run the repo's own Quick Start — `help me set up` — until Claude scaffolds a whole GTM knowledge base: a CLAUDE.md under 200 lines, a README, and a clean folder tree."
category: "gtm-engineering"
featured: true
keywords: ["GTM coding agent", "go-to-market engineering", "Claude Code quick start", "context engineering", "coding agents for GTM"]
---

**tl;dr:** The GTM coding agent repo crossed 100 GitHub stars, so episode 2 of Founder's Journey is a live walkthrough. I open the repo, explain what go-to-market engineering actually is, then run the repo's own Quick Start: you boot Claude Code inside the repo and type `help me set up`. It interviews you, and by the end it has scaffolded a real knowledge base — a CLAUDE.md that stays under 200 lines, a README, and a clean folder tree you can point any agent at. The whole episode is below.

{{youtube:_RH4CUFnlrw}}

## 100 stars, and what the repo actually is

The GTM Coding Agent repo just hit 100 stars on GitHub. Small internet math, but I'm proud of it, because I'm not a software engineer by trade. Plumber for over a decade, then an SDR, then a go-to-market engineer, now building a startup called Clearbox. Every step has been a learning process, and the repo is where I document it.

It's been live about three months. North of thirty forks and stars — software engineers, agency owners, everyone in between. It's not a drop-in repo, though. You don't clone it and inherit a hundred million skills. It's for people who actually want to learn how to run coding agents for GTM, keep tokens efficient, and understand what context engineering means when you're the one paying the bill.

I document every workflow and script that worked. The ones that didn't, I call the gotchas, and they're in there too. No false claims, no bolder-than-reality promises. You get to build and learn alongside me.

## what's in the 17 chapters

The repo is 17 chapters, continuously updated as I run new workflows. They cover:

- coding agents vs coding editors — Cursor versus Claude Code, and when each one wins
- context engineering, and how it actually works
- token efficiency
- OAuth: connecting your CLI to GitHub, Cloudflare, and Vercel, and exactly what access to grant
- safety first — connecting to the cloud without leaking client info that could cost you a job

The landing page shows where this goes as you grow: a signals dashboard, and a Nexus graph that maps relationships between your accounts, contacts, and leads. Every piece is a workflow I've built and mostly still use, and the ones I've retired, I say so.

## what go-to-market engineering actually is

Go-to-market is the whole motion: sales, marketing, and product together. A go-to-market engineer orchestrates the data points, the tools, and the layers behind that motion — sized to your volume and your total addressable market.

Which data do we need to find the right accounts? Which data converts them? How do we track it afterward? A GTM engineer answers those with code instead of a 47-step UI nobody wants to debug. The brain behind it uses coding agents, but the real skill is knowing which way to execute, then reiterating as the data changes.

For most GTM tools right now, Opus 4.8 is your best bet. But the real question is how you pull databases, scrape them, enrich them, and orchestrate on them without blowing your limits. That's context engineering, and it's the whole game.

## the Quick Start, live: `help me set up`

Here's the part I walked on camera. This is the Claude Code quick start built into the repo.

1. `git clone` the repo (I own it, so I just `cd` in).
2. Boot Claude Code inside the folder.
3. Type `help me set up`.

That's it. Claude reads the repo's setup instructions and starts interviewing you: who you are, what you sell, what motions you run, what's in your stack. I answer by talking, not typing. If you've got WhisperFlow or any dictation app, use it. You build way faster by speaking, and don't be afraid to talk the hell out of the thing. That's how the agent gets context.

You don't have to take my word for it — run the same three questions right here and take the CLAUDE.md it builds for you:

{{quickstart-terminal}}

When I ran it on camera, I answered as Clearbox: a Reddit opportunity inbox that surfaces high-intent leads, competitor mentions, and engagement opportunities. Motions: outbound, content, ABM, partnerships, PLG and SLG. Then it asked for my stack, and this is the real one:

- Attio as the CRM
- Claude Code in the terminal, Codex in the app
- DeepLine for waterfall enrichment
- Playwright for headless scraping
- SQL relationship databases: YC, Sequoia, and a16z portfolios scraped and matched against bigger lists
- Apollo for the go-to-market data layer
- my LinkedIn following, 8,000 scraped, for first-connection relationships
- SQLite on an always-on Mac mini M4 Pro holding all the context
- a mission-control dashboard for email and LinkedIn sends
- HeyReach for LinkedIn automation, ACS for programmatic email

## cached = house money

The more you talk to the agent, the longer it takes to answer, because it's reading everything you say as context. That's your context window filling up. Sounds like a downside. It isn't, if you already have a real codebase loaded.

When Claude Code reads a big repo you've already built, you're working with cached sessions. Playing with house money. Have it read your SQLite database or the context you've handed it and the marginal cost is tiny, so you're very unlikely to hit limits. That's why the terminal beats the editor on tokens for me. The exception is Fable: I used it on my website build and all it did was cause two-day delays because I kept hitting limits. I don't hit limits with anything else. Opus 4.8 has been the best since mid-February; 4.6 was peak. That's my take.

One more rule: don't mix repos. If you run an agency and build your own product, scaffold them separately. I keep Lead Alchemy (the agency) and Clearbox (the SaaS) as two repos so the context and taxonomy stay specific to each and I always control where I'm pointing the agent.

And a skill I built the same day I recorded this: auto-open. Any time an agent produces a file or folder I'd otherwise have to go dig for, it opens automatically. Finder on a Mac is not great, and when you run multi-session across a dozen folders like I do, that one skill saves real friction. [Grab it from the vault](/vault/context-engineering/auto-open-skill) — and while you're there, the [copy-to-clipboard skill](/vault/content-ops/copy-to-clipboard-skill) I use to drop a finished LinkedIn or Reddit post straight onto my clipboard, formatted, no markdown to clean up.

## the payoff: a CLAUDE.md under 200 lines and a README

By the end of `help me set up`, Claude had already answered the last questions on its own, because I'd fed it enough context that it knew what I meant, and it opened two folders: one for Lead Alchemy, one for Clearbox.

Each one has two things that matter:

- a **CLAUDE.md** — the file Claude reads at the start of every session. Keep it under 200 lines and reiterate on it constantly. As your projects grow and change, what the agent reads first has to stay current. This is the single biggest hack I'll give you.
- a **README** — the same idea, but it's your read on the project, and it's how you populate the repo's front page on GitHub.

Then the tree: `clients`, `shared`, and a `template`. Inside the template, an operating-system folder holding campaigns, demand-gen, and an engine folder that documents the client's tool stack, with the instructions sitting right next to it. When you land in a folder and don't know what it is, start with the READMEs. They give you the logic.

Once Claude builds this skeleton, you reiterate on it. Feed it more data, turn recurring workflows into skills, and immerse yourself in context engineering: full control over what the agents read and write, so you don't burn limits. Manage it right and a $100 plan goes a long way. From here you can build apps, websites, workflows, and proposals you clone and send to multiple clients.

## FAQ

### do I have to use Claude Code, or does Cursor work?

Both are in the repo. Cursor gives you more visibility but boxes you into one folder. I run multi-session across multiple clients, so Claude Code in the terminal is more token-efficient for me. Situation-dependent, and chapter one breaks down the trade-off.

### do I need to be able to code?

No, I'm not a CS major. The point is dictating in natural language and knowing exactly where you're pointing the agent. The 17 chapters exist so you can read up on coding agents vs editors, OAuth, and safe cloud access before you ever open the terminal.

## star the repo

If you're building GTM in a coding agent's way, the repo is where to start. Fork it, run the Quick Start, and send me the workflow you end up with.

It's at [github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent). Star it if it helps.

And if you want to see the kind of product that comes out of this operating style, Clearbox is the Reddit opportunity inbox I built with my co-founder from this exact workflow. It's at [clearbox.to](https://clearbox.to), with a 7-day free trial.

That's episode two of Founder's Journey. Signing off.

Shawn Tenam
the GTM alchemist
"you learn more from building and trying things, even if you fail"
