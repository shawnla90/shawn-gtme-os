---
title: "Pick Your Surface: Why Headless Code Does What Cowork Can't"
date: "2026-04-30"
excerpt: "Claude Cowork chats. Claude Code runs headless jobs you commit to a repo and hand off. Same model, different jobs. Here's the role lens, the hardware reality, the connector ceiling, and why Python suddenly works for go-to-market."
category: "methodology"
featured: false
---

# Pick Your Surface: Why Headless Code Does What Cowork Can't

Scraping Y Combinator and Andreessen Horowitz founder pages used to need a developer on staff or an Apify subscription with a credit-burning monthly bill. Today you describe the headless scrape in plain English, Code writes the Python, you commit it, you run it next month against a different list. No browser opens. No subscription bills. The same pattern moves from YC to A16Z to GitHub to Crunchbase to wherever the next list lives.

That's the gap between Claude Cowork and Claude Code in one example. Cowork chats. Code runs headless jobs you commit to a repo and hand off.

So which surface, when?

*originally an issue of Level Up GTM, my LinkedIn newsletter*

## Two surfaces, one brain

Claude Cowork is the desktop app. Chat shape. Filesystem connector, MCP, HubSpot Connector. You open it, ask, get a result. Quick lookups, deal-note drafts, the gut check before a 1:1.

Claude Code is the terminal. You type claude inside a project folder and it reads the whole repo. Multi-file edits. Python scripts. Slash commands you can hand off to an operator and have them run on a Tuesday morning. Headless background jobs that never have to open a browser.

Same model. Different jobs. Operators who stick with this end up on both. The question is which one matches the work in front of you.

## The role lens

If you're a RevOps leader, eighty percent of your daily work is fast answers, fast drafts, fast lookups. Cowork plus a connector covers it. You don't need to write Python to know which deals went quiet last week.

The moment work starts repeating, same query, same shape, every Monday morning, against forty-seven deals, that work has to live in a repo as a slash command. Now Code earns its keep. The value isn't writing the slash command once. It's running it every Monday for a year. And it's handing it to an operator on the weeks you're out.

The handoff direction is the tell. Leader asks, operator runs. Cowork is where the asking happens. Code is where the running gets engineered.

## The hardware reality

Code on your laptop is contingent on compute. M-series Mac with real memory is the unblock. On lower hardware the agent thrashes, sessions drop, the experience tanks. People blame the tool when the real constraint is hardware.

Cowork sidesteps that. Anthropic carries the compute, you get the chat surface. This is one of the actual reasons operators end up on Cowork even when their job would otherwise want Code. Not preference. Constraint.

## The connector ceiling

MCP and the HubSpot Connector are read-mostly, schema-bound, single-flow. "What's stale in my pipeline." Perfect. The connector knows the schema, the agent knows the question, the answer lands in the chat.

Take that same chat surface and ask it to compose chains across tools with state in the middle. Pull stale HubSpot deals, look up each contact's current employer in Apollo, scan for new ICP hires, summarize back to the deal as a property, post the triage to Slack. That's the ceiling. The YC scrape from the opener is the same shape with different inputs. Pagination across two founder directories, parsing, deduplication, CSV output. The connector knows one schema. None of that is one schema.

You hit the ceiling within a week of trying to do anything real with the connector alone. Above it, you write code. Code is what crosses it.

## Why Python suddenly works for go-to-market

Code can write Python. Six months ago, scripting your CRM workflow, your enrichment pipeline, your founder-list scrape required a developer on staff. Today you describe what you want in plain English, Code writes the script, you read it, you commit it, you run it.

Headless is the word that matters. The script runs in the background, parses the HTML, does the work, drops the data in a CSV or writes back to your CRM. No tab opening, no manual click-through, no rate-limited dashboard. That used to be developer territory. Now it belongs to any operator who can describe the job.

The mechanism is context engineering. The agent has enough of the right material loaded, your repo, your CLAUDE.md, your secrets, your prior sessions, your docs and tools cached as subprocesses, to produce code that runs the first time. The model isn't smarter than it was last quarter. The context is.

Andrej Karpathy has been making this point for months. Jack Dorsey said roughly the same thing on a podcast a few weeks back. Anyone running this in production names the same window. December 2025. The models got good enough that the question stopped being "can it" and started being "which surface, when." If you're in go-to-market and you want to understand what these tools are actually doing, follow Karpathy. Few go-to-market people do yet. They will.

## Where the time actually goes

These tools don't save you time on their own. The CLI is still agent-shaped. You build it. You iterate. You fix what breaks. That's your time, up front. The dividend lands the third or fourth time the slash command runs on a Tuesday morning, not the first.

AI is for making the work better, and for shortening the tax on something not being done well. A twenty-hour build can take you two hours, but only because your brain decides what the code should look like and you let the agent screw up five times to get there.

Anyone selling "AI saves you ten hours a week" is selling something. AI amplifies operators who put in systems work. It doesn't substitute for that work. Invest now, save later, and only if you actually finished the system you started.

## Version control is now a go-to-market concept

Treat your prompts and slash commands like code. Commit them. Diff them. Hand them off. Engineering has done this for decades. Go-to-market hasn't. Code is where the gap closes, and it closes for every operator who decides to close it.

## A note on dictation

Whisperflow, Superwhisper, macOS dictation. They take typing out of the loop in either surface. Speed of iteration matters and voice helps. Try it for a week and decide.

## Where to plug in

Quick lookups and drafting, Cowork. Repeated workflows, headless scripts, multi-file ops, Code. If you can only set up one this week, pick the one that matches your daily job. Add the other when the work demands it.

[github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent). Fourteen chapters, public, ungated. The onboarding asks six questions and routes you to a learning path.

```
git clone https://github.com/shawnla90/gtm-coding-agent.git ~/gtm-coding-agent
cd ~/gtm-coding-agent
claude
> help me set up
```

Chapter 7 walks through Python for go-to-market. The headless scrape from the opener starts there. Chapter 13 is CRM automation with slash commands. Chapter 14 is voice invocation, the pipeline that drafted this newsletter against a meeting transcript and dispatched it to my Discord for review.

Shawn Tenam
the GTM alchemist
"AI amplifies, it doesn't substitute"
