---
title: "i package the reddit skills, hand you the outputs, and show you how to work them"
date: "2026-07-21"
excerpt: "I package the Reddit workflows I run as skills you drop into a coding agent, hand you the outputs, and show you how to work them. The full walkthrough: the engine, the guardrails, the plays, and where it all lives."
category: "ships"
featured: true
---

here is what i actually do, in one line: i take the reddit workflows i run every day, package them as skills you can drop into a coding agent, hand you the outputs they produce, and show you how to work them. all of it is open. this issue is the whole walkthrough, not a teaser.

![Human on Reddit, data in your stack: stay human on the platform, automate the research off it, connect the signal into whatever tools you already run, then act.](/blog/reddit-ai-visibility.png)

## the shift, and it is only part of the story

ai decides who gets recommended now. when a buyer asks an assistant "best tool for x" or "x vs y," the answer is built from what the models can read, and a lot of what they read is reddit. so part of the game is showing up where ai reads, staying human where it counts, and automating where it helps.

that is real. it is also one thread. the bigger story is what you do with the signal once you have it, and that depends entirely on your company. i will get to the avenues. first the machine.

## the two halves

the posting stays human. real account, real comments, karma earned the slow way. that half never gets automated, because human behavior is exactly what reddit's detection is built to catch. comment first, earn the right to take up space, then post. i wrote the whole ramp up as a report at [shawnos.ai/reddit](https://shawnos.ai/reddit).

the research is the half worth automating. the threads where your buyers describe your problem in their own words are the best copy research you will ever get, and pulling them, scoring them, and routing them into your stack is work a machine should do every day without being asked.

## the skill, and the outputs it hands you

i open-sourced the research half as a skill in gtm coding agents. it is called [reddit-buyer-signals](https://github.com/shawnla90/gtm-coding-agent/tree/main/starters/reddit-buyer-signals), and because it lives on github you drop it straight into your coding agent, claude code, codex, or gemini, and run it. five steps:

1. **connect.** it authorizes your workspace once over the cli, so an agent can write your sheets, docs, and slides as you. the step most guides skip, and the reason a copied script fails on the first run.
2. **pull.** it pulls the recent threads from the subreddits and buyer keywords you set. two guardrails run at ingest.
3. **mine.** it reads titles, bodies, and top comments and pulls out the real questions, comparisons, and complaints, in the buyer's own words.
4. **score.** it ranks every topic one to five on intent, demand, and fit, with a one-line reason you keep.
5. **build.** it renders a color-coded google sheet of the plan and an editable slides deck you can hand to a client or a team.

the outputs are real artifacts you own: a scored sheet and a deck, not a dashboard you rent.

![The ingestion pipeline: subreddits into the engine, extracted into lead, competitor, and engagement signals, out through your agent CLI into lead magnets, content, and copy.](/blog/aura-pipeline.png)

## how to connect (any stack)

it does not matter what your stack is. the connect step is one authorization and one config file. google workspace, notion, clickup, they all have an api. you point the connector at it with a token and the signal lands where you already work. you are not migrating anything, you are wiring one script to the tool you open every morning.

## the guardrails that keep it real

**recency.** the default window is the last thirty days. nothing older enters the database. a thread from three years ago is dead, and building outreach on it means quoting a conversation that already ended.

**relevance.** a broad keyword search drags in off-topic subreddits. the relevance gate keeps only the threads actually about what you do. what you act on has to be real, or it loses trust the first time someone reads it.

## rapidapi vs clearbox

the skill runs on two sources. rapidapi is the quick baseline, fast and cheap, enough to see the signal and prove the loop. clearbox is the accurate version. it reads reddit by buying intent instead of keywords, off real content consumption, and adds sentiment and competitor context. "best crm for small teams" and "frustrated with hubspot" are both buying signals, and only one has the keyword in it. a keyword tool catches the first. clearbox catches both, scores them, and hands you the few that matter.

![Scraping versus understanding: a raw scraper returns 3,000 unranked, noisy maybes. clearbox returns the twelve that matter, intent-scored and ranked.](/blog/clearbox-vs-scraper.png)

## the plays: it depends on your company

here is where people want one answer, and there isn't one. what you do with the signal has many avenues, and the right one depends on your company, your motion, and your buyer.

- some build a community they own and become the room their buyers live in.
- some feed the real language straight into cold email and landing pages.
- some use it for icp and positioning research pulled from people telling on themselves in public.
- some are agencies, and they package the whole thing for a client.

i helped a partner run that last one. their client did not show up in ai at all, their buyers were comparing the exact products they sell on reddit, and the client was in none of it. we pulled the signal, built the plan and the deck, and handed them a way in. an agency can run this for every client on their roster.

you do not have to guess which avenue is yours. that is part of what clearbox is for. it reads the signal, scores it for intent, and shows you where the real conversations are, so the avenue picks itself.

## where it all lives, and why

i share the whole thing because the packaging is the point, not any one piece.

- **the skills** are on github, in gtm coding agents, so you drop them into your coding agent and run them yourself.
- **the plain-language playbook** is in [the vault](https://shawnos.ai/vault/reddit/reddit-ai-visibility), the version to read before you run anything.
- **the full story with the receipts** is this post, which is also how the work earns its own authority over time and gets read by the models later.
- **clearbox** is the engine underneath, for when you want the accurate read, hands-off.

## the short version

i package the skills, hand you the outputs, and show you how to work them. stay human on reddit, automate the research off it, and pick the avenue that fits your company. the skill is open, the outputs are yours, and [clearbox](https://clearbox.to) is there when you want it accurate.

Shawn Tenam
the GTM alchemist
*stay human on reddit. automate off it.*
