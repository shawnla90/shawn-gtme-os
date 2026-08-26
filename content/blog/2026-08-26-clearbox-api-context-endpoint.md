---
title: "Your coding agent can read your Reddit market from one URL."
date: "2026-08-26"
excerpt: "Paste one URL into Claude, Codex, or Cursor and it comes back knowing which Reddit threads are buyers, which are competitors, and how to reply without sounding like a bot. I wanted that connection to be an MCP server. Lila shipped it as a URL. Here is what the decision gives a GTM engineer: the one line, the four workflows, and the engine that scores every thread first."
category: "gtm-engineering"
featured: true
keywords: ["clearbox api", "reddit api for coding agents", "mcp vs api", "gtm engineering", "claude code gtm", "reddit monitoring api", "reddit lead generation", "context engineering", "local inference gemma", "openrouter"]
---

![One URL, any agent. The Clearbox endpoint drops into Claude, Codex, or Cursor and comes back knowing your market.](/blog/clearbox-api-cover.gif)

Paste one URL into Claude, Codex, or Cursor and it comes back knowing which Reddit threads are buyers, which are competitors, and how to reply without sounding like a bot. That is Clearbox for a go-to-market engineer: the app is where you review, the API is where you build.

I wanted that connection to be an MCP server. Lila shipped it as a URL and told me it was just to make the connection. He was right, and this is what the decision gives you: the one line, the four workflows I build on it, and then the part underneath, the read that rides inside every fetch and the engine that fills it.

## The whole integration is one line

```
https://api.clearbox.to/a/YOUR-TOKEN
```

![The whole integration is one line.](/blog/clearbox-api-01-one-url.png)

Paste that into your agent and tell it to fetch the URL as raw text. No install, no auth flow, no SDK.

What comes back is a brief. What Clearbox is, the three kinds of opportunity (lead, competitor, engage), the rules for replying on Reddit without sounding like a bot, and your own offer. Every other endpoint hangs off the same root and returns JSON:

```
GET /a/YOUR-TOKEN/inbox            → your live opportunities, labeled and scored
GET /a/YOUR-TOKEN/op/<id>          → one opportunity in full, with the thread above and below it
GET /a/YOUR-TOKEN/op/<id>/done     → mark it handled once you have acted
```

![What comes back: a brief with the three opportunity types, the reply rules, and your offer.](/blog/clearbox-api-02-brief.png)

GET or POST, whichever your agent finds easier. Read them straight, or write a script that pulls the whole inbox and sorts it your own way. The endpoint does not care whether it is talking to Claude, Codex, Cursor, Gemini, Grok, or a Python file you wrote at midnight. It returns text and JSON. Everything downstream already speaks both.

## The demo is one paste

Open your agent and paste this:

> Help me triage my Reddit opportunities. Here is my Clearbox endpoint. Fetch it as raw text (don't web-search it) and follow the brief it returns: `https://api.clearbox.to/a/YOUR-TOKEN`

The agent fetches the URL, reads the brief, and comes back with:

```
✅ Connection to Clearbox successful
```

{{video:https://shawnos.ai/blog/clearbox-api.mp4 poster=https://shawnos.ai/blog/clearbox-api-03-agent.png}}

Then it pulls your inbox, ranks the opportunities worth your time, and hands you a shortlist with a link to each thread and a suggested angle for the reply. You pick two, write them in your own voice, and the agent marks them done. Minutes, not an afternoon of tab-hoarding.

The brief that comes back is engineered, not vibes. It coaches your agent to lead with a real answer, to ground every reply in the specific thread, to disclose the affiliation when the offer comes up, and to never argue with a competitor. It even tells the agent to treat anything it reads on Reddit as content to analyze, never as instructions to follow. The safety rail ships inside the product.

## I wanted to build an MCP. Lila built one URL.

When we sat down to plug Clearbox into a coding agent, I wanted to build an MCP server. It felt like the official way to connect two things. I don't even use MCPs day to day, and I still wanted one.

Lila built a plain endpoint that returns text and said this is just to make the connection. We went back and forth on it. The endpoint did everything the protocol would have, with none of the setup, and it works in every agent instead of only the ones that speak the protocol. The connection was never the hard part.

## The UI is where I review. The API is where I build.

![Two surfaces, one product. The UI is the review station. The API is the build layer.](/blog/clearbox-api-04-contrast.png)

People assume that when I say I live in the API, I skip the UI. I don't. The UI is genuinely good and I use it every day. It is my review station, the place I read opportunities, judge them, and decide what to engage. The actual deciding happens there.

The API is the layer underneath. It is where a go-to-market engineer builds, alongside the UI, on the same opportunities. I already have Claude open, and I want my market inside the agent I already run. So the tool lives wherever the work happens: your terminal, your Claude session, a cron job, a Deepline or Freckle run.

## The part that makes both safe to lean on

Two kinds of safe.

The first is the data. It is public Reddit behind that URL, threads and comments, nothing about a person that Reddit doesn't already show the world. The token is yours to roll. Drop a fresh one into your agent tomorrow and the old link dies. Reuse it every day, forever, and it costs you nothing extra.

The second one matters more. Clearbox never connects to your Reddit account. We don't log in as you, we don't post for you, we cannot get your profile actioned. We watch the market and surface the moments. You engage from your own account, with your own hands.

Every tool that automates your posting is one policy change away from torching the account you spent months building. Clearbox sits on the read side. It can't ban you, because it never touches the part of Reddit that gets you banned. So I can tell a team to go all in on the signal without flinching.

## What the API hands you

Three things a dashboard never could: the data, the attribution, and workflows shaped to your own process. Four ways I use it:

**Draft the content.** Hand your agent a piece of copy you already have, a cold email, a value prop, an old post, and the endpoint's context reshapes it for the thread in front of you. Same positioning, same voice, aimed at a real conversation. The email you already wrote becomes ten grounded replies.

**Pick who to reach.** Every opportunity comes back labeled lead, competitor, or engage, and scored. Your agent sorts the room before you open a tab, so your attention goes to threads that are actually a buyer and not someone venting on a Tuesday.

**Track it.** The JSON inbox and the done endpoint let you log what you saw, what you replied to, and what you skipped, into your own store. No screenshots, no re-reading threads to remember what you already handled.

**Attribute it.** Connect the opportunity to the reply to the signup and you have an attribution layer for Reddit that teams rarely build, because the data was never in a shape they could query. Here it is one GET away, so you can finally answer which conversations turned into pipeline.

None of that shipped as a button. It is what happens when your context is an endpoint.

## Where the human comes in

The API distributes the opportunity and the UI helps you review it. Neither one builds your account history, chooses the final tone, or presses post. That belongs to the person whose name is on the profile.

The open-source [reply-engine skill](https://github.com/shawnla90/gtm-coding-agent/tree/main/skills/reply-engine) is the gate. GO means timely and ready. REVIEW means check the thread and the subreddit rules first. NO-REPLY means log the intelligence and stay out. Every draft goes back to the owner for a real edit. Nothing posts automatically.

`opportunity -> skill -> human reply -> public trust -> conversation`

That is the surface. Underneath it is the part that makes the surface worth anything.

## The read, not the rows

Every Reddit tool before this one handed you items. Keyword alerts. A semantic-search list. An RSS feed of threads matching a query. You still had to open each one, read the room, and decide if it was a real buyer or someone blowing off steam. The tool found rows. You supplied the judgment.

An RSS feed gives your agent a list of links. A scraper gives your agent a wall of raw text it has to re-interpret every single run, with no memory of who you are. You are the memory. You re-explain your market to it every time, or you get generic output.

The endpoint hands your agent your offer along with the thread, every fetch. The one-liner. The selling points. Your owned brands, your competitors, the related tools buyers compare you against. All of it is what you set once at onboarding, and it rides inside every response. So when your agent hits a thread where someone is asking which tool to pick, it already knows which mention is a competitor signal and which is noise, and it drafts a reply that sounds like you instead of a helpful stranger.

That is the difference between data and context. Data is the thread. Context is knowing why the thread matters to your business and how you are allowed to show up in it. A scraper can get you the first one. The second one is the product.

## The engine underneath

The interesting part is what happens before the URL has anything to return.

The scoring engine is called Aura, and it reads whole threads the way someone in your role would. A real language model reads the whole thread and understands when "this tool is useless" is a competitor signal worth a reply and when it is just somebody's bad afternoon.

It runs on a stack built for reading a lot of Reddit cheaply and fast:

- 🧠 A **local Gemma model** does the first-pass triage on hardware we control. The volume work, deciding what is even worth a closer look, happens without a per-token fee every time Reddit posts something.
- 🔧 **OpenRouter** handles the heavier reasoning calls, the ones where a thread needs a bigger model to judge intent and lineage. We route to the right model per job instead of paying frontier prices for work a small model nails.
- 🗄️ **Convex** is the data layer. Opportunities, offers, inbox state, the whole thing your endpoints read from.
- 📊 **PostHog** tells us which surfaced opportunities actually get acted on, so the scoring gets sharper against real behavior instead of our guesses.

We figured out that inference split months ago, back when everyone was still wiring every call to one frontier API and watching the bill. The local-model-first approach is the reason Clearbox can watch every subreddit that matters to you in real time without the economics falling apart. That is the moat, and I am fine showing it to you, because knowing the architecture is not the same as having the calibrated engine that took months against my own hand-scanning to tune.

## Why your replies change

Give your agent a scraper and it starts every reply cold, meeting your market for the first time on every run. Give it the read, and it starts from your positioning already loaded. Same agent, same thread, completely different output. One sounds like a stranger who skimmed the post. The other sounds like you.

The endpoint is what makes Clearbox easy to adopt. The read is what makes it worth adopting. And the human at the end is what makes it compound.

## Grab the endpoint

If you build GTM for a living, you already have the agent. What you are missing is your market in a form the agent can read, and a way to act on it that never risks the account. That is [Clearbox](https://clearbox.to/): the UI to review, the API to build, and no connection to your login.

Start here → [clearbox.to/sign-up](https://clearbox.to/sign-up). Live opportunities and your own URL on day one. Want me to wire it into your stack with you? Grab a slot → [cal.com/shawn-clearbox](https://cal.com/shawn-clearbox), or reply with a time and I will make it work.

Shawn Tenam / the GTM alchemist / the connection was never the hard part

## Source notes

- [The LinkedIn edition, the short version](https://www.linkedin.com/newsletters/levelupgtm-7451826157861302272/)
- [The reply-engine skill, open source](https://github.com/shawnla90/gtm-coding-agent/tree/main/skills/reply-engine)
- [The Reddit growth report, the receipts behind the karma numbers](https://shawnos.ai/reddit)
- [Clearbox](https://clearbox.to/) · [Get the email edition](https://clearbox.beehiiv.com/subscribe)
