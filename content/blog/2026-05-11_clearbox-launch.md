---
title: "Two Months on Reddit, One Thing to Build"
date: "2026-05-11"
excerpt: "Two months ago I changed how I showed up on Reddit. Less posting, more lurking. Less link-dropping, more answering the question the original poster actually asked. The signal was there. The tax was crushing. So we built the thing."
category: "ships"
featured: true
---

# Two Months on Reddit, One Thing to Build

Two months ago I changed how I showed up on Reddit. Less posting, more lurking. Less link-dropping, more answering the question the original poster actually asked, in subs where they already had the problem.

The change worked. Real conversations, a few DMs, a couple of intros that turned into something. The signal was there.

The tax was crushing.

To do it well meant being on Reddit constantly. Three or four subs at a time, scanning for the right thread before the moment scrolled off the page. Reading enough context to enter the conversation as a person. Then deciding whether the thread was worth a reply, a DM, or a quiet upvote.

After two weeks I was checking Reddit the way people check email. After four I was missing more than I was catching.


The first attempt that didn't work.

I tried to wrap Claude Code through the API to automate the scan. Couldn't get it stable. The Code CLI wants to be a CLI, not a programmatic backend. Dropped it after a weekend.

It told me I'd been pointing the automation at the wrong half. The part worth moving off my brain was the surveillance and the triage. The conversation itself was the part that needed to stay human, and trying to script around that was the reason the build kept breaking.


The second attempt that told me what to build.

Spent the next weekend embedded in GTM-engineering channels. Slack groups, Discord servers, a couple of subreddits where the operators actually live.

I went in to give upfront value. SaaS tribal knowledge that takes three years of in-house RevOps to learn. Stuff like how the Apollo person/match endpoint behaves on senior titles, the order you have to wire HubSpot association labels so the workflow actually fires, the specific way Cargo's templateExpression evaluator silently no-ops a multi-statement filter callback.

What I noticed is what people kept asking back. They wanted to know how to find the conversations where their buyers already were, and how to read a noisy thread well enough to tell a real lead from someone venting on a Tuesday. The competitor-mention question came up almost every time. They could see the conversations were happening. They couldn't get to them fast enough.

That's when the product clarified itself. The signal I'd been mining by hand for two months was the same one nobody had built a tool around.


Your tribal knowledge is now extractable.

Six months ago, what I just described would have meant hiring a junior dev or living inside Zapier. Today you describe the workflow in plain English to a coding agent, it writes the script, you read it, you commit it, you iterate on it like code.

Anything an experienced operator does in their head can be moved out of their head and into a repository. Version-controlled, runnable, handed off to someone else when you go on vacation. The mechanism is context engineering. What changed is that a workflow which used to require a developer now requires a clear thinker with a terminal and a CLAUDE.md file that tells the agent what good looks like.

Karpathy and Dorsey have both been pointing at this since December 2025. Most go-to-market people haven't taken it seriously yet. The ones who do over the next two quarters will be running a different kind of operation than everyone else.


What I'm building.

Clearbox surfaces the right Reddit conversations before they disappear.

A founder mentioning your competitor in r/sales. A technical buyer asking the question your product answers. A complaint about a workflow you fixed last quarter. Surfaced in the moment, with enough context that you can read the thread and decide how to show up.

The engine underneath is called Aura. It reads Reddit the way someone in your role would read it, which means it understands when "this tool sucks" is a real competitor signal and when it's a Tuesday-afternoon vent. My technical co-founder built the parts I would have had to spend six months learning. We've been building against my own scanning for the last several weeks, which is the part that calibrates the signal.

The free trial gives you live surfaced signals on day one. You configure your competitors and your category, the engine starts reading, and within a few minutes you can see whether the signal is there for your shape of business.

clearbox.to is live. Full launch in roughly 24 hours from when this hits your inbox.


The principle.

The play is to use AI for the half it's actually good at. Reading volume. Holding context. Surfacing the threads that matter and showing you why.

The conversation is still yours. Reddit works because people can tell when you're a person, and the half a tool can't fake is the half that decides whether you build trust or burn it. Surface the signal, then show up like a human. That's the whole product thesis, and it's also the reason the engine is built around finding context for you rather than writing comments on your behalf.


Building this in the open.

Same week, the gtm-coding-agent repo got Chapter 15. Meta Ad Intelligence. Scrape the public Meta Ad Library, classify every creative on an 18-column taxonomy via Claude as a subprocess, then pair the declared strategy in competitor ads with the actual demand showing up on Reddit. The two halves of the same play.

If you want to see what extractable tribal knowledge looks like as a working repo, that chapter is the example.

git clone https://github.com/shawnla90/gtm-coding-agent.git ~/gtm-coding-agent
cd ~/gtm-coding-agent
claude
> help me set up

Fifteen chapters. Public. The onboarding asks six questions and routes you to a learning path that matches your role.

Direct link to the chapter: github.com/shawnla90/gtm-coding-agent/blob/main/chapters/15-meta-ad-intelligence.md


One ask.

Drop a comment with what you want me to go deeper on next. The Aura engine internals. How the Reddit-as-signal play actually shapes a sales motion. What it looks like to put a GTM workflow under version control and hand it to an operator. I'll write whichever one gets the most asks.


Shawn Tenam
the GTM alchemist
"See your market. Move first."
