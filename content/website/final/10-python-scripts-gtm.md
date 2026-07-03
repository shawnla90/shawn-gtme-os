---
title: "10 Python Scripts I Run for GTM, and the Exact Prompt to Build Each One"
date: "2026-06-19"
excerpt: "Ten GTM scripts I run, each written as a plain-language prompt you can paste straight into Claude Code and get a working first version. Describe the job, the agent writes the Python."
category: "gtm-engineering"
featured: false
---

# 10 Python Scripts I Run for GTM, and the Exact Prompt to Build Each One

You don't have to code. You have to know what to point a coding agent at. So I wrote each of these as a prompt you can paste straight into Claude Code or Codex and get a working first version.

The repo lists got the traffic, but the comments kept circling one question: fine, I cloned the repo, now what do I actually build? Ten scripts I run in my own GTM operation, each one handed to you as the plain-language prompt that builds it.

Everything in [brackets] is a swap. If you use Slack instead of Discord, Attio instead of HubSpot, or Otter instead of Fireflies, just change the bracket and the prompt still works.

These are written in plain language on purpose. You describe the job, the agent writes the Python. If you would rather read the finished code than write the prompt, all of these live in the repo at the bottom.

The shape under every one of them is the same. Something happens, the data gets cleaned, a decision gets made, the output gets routed somewhere.

*originally posted on [r/GTMbuilders](https://www.reddit.com/r/GTMbuilders/comments/1uacdp7/10_python_scripts_i_run_for_gtm_and_the_exact/)*

## 1. Newsletter follower scraper

Turns new subscribers into scored leads while you sleep. Paste this into Claude:

> "Build a Python script that pulls my new [Substack] subscribers each morning, enriches each one with [Apollo], scores them against my ICP which is [describe your ideal customer], and writes the good ones to [a Google Sheet] and [HubSpot]. Store everyone it has already processed in a local SQLite file so it never repeats, and set it to run daily with cron or launchd."

## 2. Enrichment and scorer

Turns a messy export into a ranked, CRM-ready list. Paste this into Claude:

> "Build a Python script that takes a CSV of names and companies, enriches each row with [Apollo], scores each one 1 to 5 against this ICP [describe it], and writes a new CSV sorted best to worst with a one-line reason per row. Cache every lookup in SQLite so re-running it is free."

## 3. Social signal scout

Finds the threads where someone is describing your problem out loud. Paste this into Claude:

> "Build a Python script that checks [Reddit, X, and LinkedIn] every morning for posts matching [my keywords or topics], uses an LLM to score each one for buying intent, and drops the best ones into [Slack] with the link and a one-line reason it matters. Keep a SQLite list of IDs it has already sent so nothing shows up twice."

## 4. Meeting to content engine

Turns every call into drafts, tasks, and searchable memory. Paste this into Claude:

> "Build a script that watches [Fireflies] for new call transcripts, and for each new one uses an LLM to write a blog draft, 3 social posts, a list of action items, and CRM notes in my voice. Save the drafts to [a folder] and post a summary to [Discord]. Match the tone in 2 of my own posts that I will paste below."

## 5. CRM sync

Keeps your CRM clean by writing back only the fields you choose. Paste this into Claude:

> "Build a Python script that reads a [Google Sheet] of accounts and writes them into [HubSpot], updating only these fields [list the fields]. Match existing records by [domain] so it updates instead of creating duplicates, and log every change to a file I can check."

## 6. LinkedIn campaign pusher

Moves LinkedIn outreach out of a dashboard and onto a schedule. Paste this into Claude:

> "Build a Python script that takes approved leads from [a Google Sheet] and pushes them into a [HeyReach] LinkedIn campaign using their CLI, then writes the acceptance and reply numbers back to the sheet each day. Add a daily cap so it never queues more than [20] per account."

(HeyReach just shipped their own CLI, which is what makes this one clean now. Credit to them.)

## 7. Reply classifier

Sorts every reply so you stop reading them just to triage. Paste this into Claude:

> "Build a Python script that reads new replies from [my Gmail], classifies each one as interested, objection, not now, or unsubscribe with an LLM, and routes each one. Interested pings me in [Slack], unsubscribe gets pulled from [my list], everything else gets tagged in [the CRM]. Never process the same message twice."

## 8. Domain health monitor

Warns you before a deliverability problem tanks your inbox. Paste this into Claude:

> "Build a Python script that checks my sending domains [list them] once a day for SPF, DKIM, and DMARC records, checks each one against common blocklists, and alerts me in [Slack] only when something is actually broken. Stay quiet when everything is fine."

## 9. Content and news scout

Hands you daily angles instead of a blank page. Paste this into Claude:

> "Build a Python script that pulls the latest from [these subreddits and RSS feeds], uses an LLM to turn them into 5 content angles for [my audience], and drops them into [a Google Doc] every morning. Skip anything it already gave me in the last 14 days."

## 10. Daily GTM digest

One morning post that tells you what happened overnight. Paste this into Claude:

> "Build a Python script that reads the output of my other scripts [point it at the logs or a SQLite db], summarizes the last 24 hours into one short update covering new leads, replies, signals, and anything broken, and sends it to [Slack] every morning at [8am]. Keep it to the numbers that matter."

## One more, with a scar attached

I had a daily newsletter called Code Daily that did the same thing for content. It scanned 5 subreddits, scored the best threads with Claude, wrote a 2 to 3 thousand word digest with Opus, ran it through a slop filter, and auto published. 44 days straight, then Reddit started 403ing the scraper and it died.

Nothing's perfect. About half my scripts are humming, a couple are broken right now, some need their auth refreshed. It still beats doing the work by hand.

If you want that one too, paste this into Claude:

> "Build a Python script that scans [5 subreddits] daily, scores the best threads with an LLM, writes a [2000 word] digest in [a late-night-show] voice, runs it through a filter that strips em-dashes and other AI tells, and publishes it to [my site]. Track what it covered so it never repeats a story."

## The closing note

The repo I keep updating has the GTM coding agents playbook and the scripts I have cleaned up and published so far, over at [github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent). Fork it if you would rather read code than write a prompt, and I add more as I go.

If one of these is the first you'd build, tell me which. I'm about to start dropping video too, so if you would rather watch me build one of these on camera than read about it, say the word and I'll record it.

Shawn Tenam
the GTM alchemist
"The prompt is the spec."
