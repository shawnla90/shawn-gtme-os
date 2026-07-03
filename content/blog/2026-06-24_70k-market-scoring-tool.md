---
title: "I Rebuilt a $70K Market-Scoring Tool with Claude Code in an Afternoon"
date: "2026-06-24"
excerpt: "A buddy got quoted $70K a year to score and enrich his market. Clay seat, enrichment credits, a partner to wire it together. I rebuilt it with Claude Code in an afternoon, same output, and the whole build is ungated."
category: "ships"
featured: false
---

# I Rebuilt a $70K Market-Scoring Tool with Claude Code in an Afternoon

**tl;dr:** a buddy got quoted $70K a year to score and enrich his market. Clay seat, enrichment credits, a partner to wire it together. I rebuilt it with Claude Code in an afternoon, same output, and I'm giving you the whole build. Ungated, links at the bottom.

The quote itself is what set me off. Not because the vendors are villains, but because the actual work underneath that $70K is a weekend-sized build once you know the shape of it. So I built it, documented every step, and posted the whole thing to r/GTMbuilders the same week.

*originally posted on [r/GTMbuilders](https://www.reddit.com/r/GTMbuilders/comments/1uem7na/rebuilt_a_70k_marketscoring_tool_with_claude_code/)*

## What it produces

It turns a raw market into a color-coded Google Sheet. Every account scored 1 to 5, ranked, dashboard on top. You own all of it. Next run is free. The sheet rebuilds in place so the link never changes.

## The workflow, start to finish

1. Point Claude Code at your list (CSV, Apollo pull, scrape) and load it into a local SQLite table.

2. Enrich on a waterfall: free web fingerprint first, then Apollo for the rows worth paying for, then verify the emails. Apollo for B2B SaaS, RapidAPI for local.

3. Score every row 1 to 5 on fit, persona, and reachability. One-line reason on each.

4. Render the color-coded sheet. Red to green, dashboard tab, rebuilds in place.

5. Hand the recurring run to Deepline so it runs on a schedule.

Five steps. Each one is boring alone. Together they replace the quote.

## The real skill you're learning

Here's what you're actually learning to do: connect the Google Workspace CLI so you can drive Google Sheets programmatically and wire any API into it. That's the real skill. Once you can do that, you are not waiting on anyone's UI ever again.

And forget "free." That's not the point. Subscribe to the APIs, pull real contacts, and you have enough to actually work with. Build the list, send proposals to your clients, run your own outreach, land the job. People get hired for exactly this skill. This is not a toy.

## The compliance thing, because someone always asks

Don't let it scare you. If you already pay for a seat at ZoomInfo, Lusha, Apollo, whatever, you are licensed to use that data. Pull it straight into your own system. And the big multi-provider "waterfall" these tools upsell you? It's a myth. One licensed source usually covers your ICP.

## Best part?

It's in your repo. It's versioned. You can read every line of how your market gets scored. A provider changes or your ICP shifts, you edit one file, not your whole stack.

I'm not telling you to rip out Clay. (But you sure can.) This isn't an open-source crusade.

It's just: don't buy blind. Build it once so you actually know what your market looks like and what you're paying for. Buying blind is how you wake up in tech debt you never understood, and nothing tanks a GTM career faster than that.

## It's all yours, no gate

- Notion SOP (full walkthrough): [The $70K Sheet](https://fierce-camelotia-1fa.notion.site/The-70K-Sheet-3881fb92bcd781d6b145fa4c50ebae53?pvs=74)
- Repo: [github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent)
- Apollo, the data layer I run for B2B SaaS (referral, full disclosure): [get.apollo.io/y3gtusoq4h9g](https://get.apollo.io/y3gtusoq4h9g)

And straight up: yes, I build Clearbox. It reads where your buyers talk on Reddit and tells you who's in-market. Not hiding it.

## The closing note

r/GTMbuilders crossed a thousand members the week this went up, and I'm going to keep dropping the actual build, not a teaser, whether or not you ever touch my tool.

Take it. Run it on your market. Break it, fork it, whatever. Get stuck or build something cool, comment on the Reddit thread or DM me. I'd rather see you ship it than gate it.

Shawn Tenam
the GTM alchemist
"Don't buy blind. Build it once."
