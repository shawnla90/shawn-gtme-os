---
title: "Reddit is where AI decides who to recommend"
date: "2026-07-21"
excerpt: "Stay human where it counts, automate the research off it, and turn the signal into pipeline. The open skills, the outputs, and the plays that depend on your company."
category: "ships"
featured: true
---

Ask an AI assistant for the best tool in your category and it answers from what it can read. A lot of what it reads is Reddit, because that is where people say what they actually bought and what they regret. Recommendations get decided there now, and most companies are not in the conversation at all.

The instinct is to automate your way in. That gets accounts banned, and it should. The better move is to treat Reddit as two separate halves and automate only the half that is safe to automate.

![Human on Reddit, data in your stack: stay human on the platform, automate the research off it, connect the signal into whatever tools you already run, then act.](/blog/reddit-ai-visibility.png)

## The two halves

The posting stays human. Real account, real comments, karma earned the slow way. That half never gets automated, because human behavior is exactly what Reddit's detection is built to catch. Comment first, earn the right to take up space, then post. The full ramp is written up as a report at [shawnos.ai/reddit](https://shawnos.ai/reddit).

The research is the half worth automating. The threads where your buyers describe their problem in their own words are the best copy research on the internet. Pulling them, scoring them, and routing them into your stack is work a machine should do every day without being asked.

## The skill, and the outputs it hands you

The research half is open as a skill in GTM Coding Agents, called [reddit-buyer-signals](https://github.com/shawnla90/gtm-coding-agent/tree/main/starters/reddit-buyer-signals). It lives on GitHub, so it drops straight into a coding agent, Claude Code, Codex, or Gemini, and runs. Five steps:

1. **Connect.** It authorizes your workspace once over the CLI, so an agent can write your sheets, docs, and slides as you. The step guides skip, and the reason a copied script fails on the first run.
2. **Pull.** It pulls the recent threads from the subreddits and buyer keywords you set. Two guardrails run at ingest.
3. **Mine.** It reads titles, bodies, and top comments and pulls out the real questions, comparisons, and complaints, in the buyer's own words.
4. **Score.** It ranks every topic one to five on intent, demand, and fit, with a one-line reason you keep.
5. **Build.** It renders a color-coded Google Sheet of the plan and an editable Slides deck you can hand to a client or a team.

The outputs are real artifacts you own, a scored sheet and a deck, not a dashboard you rent.

![The ingestion pipeline: subreddits into the engine, extracted into lead, competitor, and engagement signals, out through your agent CLI into lead magnets, content, and copy.](/blog/aura-pipeline.png)

## Connect any stack

The stack does not matter. The connect step is one authorization and one config file. Google Workspace, Notion, ClickUp, they all have an API. Point the connector at it with a token and the signal lands where you already work. Nothing gets migrated. One script gets wired to the tool you open every morning.

## The guardrails that keep it real

**Recency.** The default window is the last thirty days. Nothing older enters the database. A thread from three years ago is dead, and building outreach on it means quoting a conversation that already ended.

**Relevance.** A broad keyword search drags in off-topic subreddits. The relevance gate keeps only the threads actually about what you do. What you act on has to be real, or it loses trust the first time someone reads it.

## What a scraper misses

The skill runs on two sources. RapidAPI is the quick baseline, fast and cheap, enough to see the signal and prove the loop. Clearbox is the accurate version. It reads Reddit by buying intent instead of keywords, off real content consumption, and adds sentiment and competitor context. "Best CRM for small teams" and "frustrated with HubSpot" are both buying signals, and only one has the keyword in it. A keyword tool catches the first. Clearbox catches both, scores them, and returns the few that matter.

![Scraping versus understanding: a raw scraper returns 3,000 unranked, noisy maybes. Clearbox returns the twelve that matter, intent-scored and ranked.](/blog/clearbox-vs-scraper.png)

## The plays depend on your company

This is where people want one answer, and there is not one. What you do with the signal has many avenues, and the right one depends on the company, the motion, and the buyer.

- Some build a community they own and become the room their buyers live in.
- Some feed the real language straight into cold email and landing pages.
- Some use it for ICP and positioning research, pulled from people telling on themselves in public.
- Some are agencies, and they package the whole thing for a client.

One partner ran that last play. Their client did not show up in AI at all, their buyers were comparing the exact products they sell on Reddit, and the client was in none of it. The signal got pulled, the plan and the deck got built, and the client walked in with a way to win the room. An agency can run this for every client on its roster.

Which avenue is yours is not a guess. That is part of what Clearbox is for. It reads the signal, scores it for intent, and shows where the real conversations are, so the avenue picks itself.

## Where it all lives

The packaging is the point, not any single piece.

- **The skills** are on GitHub, in GTM Coding Agents, ready to drop into a coding agent and run.
- **The plain-language playbook** is in [the vault](https://shawnos.ai/vault/reddit/reddit-ai-visibility), the version to read before running anything.
- **The full story with the receipts** is this post, which is also how the work earns its own authority and gets read by the models later.
- **Clearbox** is the engine underneath, for when you want the accurate read, hands-off.

## The short version

Reddit decides who AI recommends. Stay human on it, automate the research off it, and pick the play that fits your company.

## Try it, and come talk to me

The fastest way to feel it is to start free. [Clearbox](https://clearbox.to) reads Reddit by intent and hands you the conversations that matter, and that signal plugs straight into whatever you already orchestrate with, Claude Code, Clay, or your own scripts. Point it at your stack and you have rich, real buyer context today instead of a whiteboard guess.

If you want to go deeper, DM me. I am sharing all of it. My co-founder and I get on calls to walk through how it works and the technical builds you can run on top of it, and if you would rather we just build it with you, we do that too.

Shawn Tenam
the GTM alchemist
*stay human on reddit. automate off it.*
