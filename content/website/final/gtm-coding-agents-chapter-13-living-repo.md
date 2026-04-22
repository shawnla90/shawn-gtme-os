---
title: "GTM Coding Agents Chapter 13: Your GTM Stack Has No Git Log"
date: "2026-04-22"
excerpt: "Clay workflows, HubSpot automations, Google Sheets, Miro boards — none of them have version control. Chapter 13 is about the coding-agent layer that does. Wire HubSpot to Claude Code, build /stale-opportunities, and start running RevOps against a diffable snapshot instead of a black box."
category: "ships"
featured: true
---

# GTM Coding Agents Chapter 13: Your GTM Stack Has No Git Log

**tl;dr:** Chapter 13 of the GTM Coding Agents repo ships today. Wire HubSpot and Salesforce to Claude Code, build the `/stale-opportunities` slash command, and mine the nurture graveyard AEs left for dead. The frame behind the chapter: Clay workflows, HubSpot automations, Google Sheets, and Miro boards have no version control. The coding-agent layer does.

Open the HubSpot workflows tab at your company. Try to answer this question: what changed in the last thirty days? Which workflows ran? Which got edited? Which haven't fired in six months but are still live? By whom?

You can't. The UI tells you the last modified date and the person who touched it, and that is it. No diff. No commit log. No blame. No checkout of "the workflow state as of January 14." The automation running your MQL pipeline is a black box even to the RevOps person who owns it.

Clay is worse. Your workflow lives inside Clay's app. If a teammate renames a column, deletes a step, or changes an enrichment waterfall at 2am, there is no history to consult and no branch to compare. The Google Sheet that decides your ICP weights is older than the latest rep's LinkedIn. The Miro board where the handoff lives was closed in 2024 and nobody can find it.

This is not a Clay problem or a HubSpot problem. This is the shape of every tool in your GTM stack. They are durable but not diffable. You can query them but you can't audit them. They hold the state but they do not hold the change history.

A coding agent wired to your CRM gives you the version control those systems should have had all along.

## What version control actually does

The Python script is in git. The slash-command file is in git. The HubSpot custom-property schema gets defined in code and committed. When something changes, there's a commit. When something broke, you know which commit broke it. When someone asks "what did we look like ninety days ago," you check out a sha.

It is boring infrastructure. Boring infrastructure is the infrastructure you end up needing most.

A commenter on my last r/hubspot post (u/dsecareanu2020, who runs HubSpot portals for a living) listed his daily use cases for the Claude Code + HubSpot pattern. The clearest one: "build a full list of workflows, what they do, when they were last updated, if active or not, if they had enrollments in the last 7 days." That audit exists nowhere in the HubSpot UI. You run it as a script, save the output, diff against last week's output, and now you know exactly what changed in your own portal. That is the version control your CRM is missing.

## What Chapter 13 ships

Three parts.

**Connecting HubSpot and Salesforce to a coding agent.** Three patterns each — MCP for exploration, private-app tokens with `curl` for one-shots, the Python SDKs for anything that becomes a scheduled job. The chapter says which one to reach for when, with working code.

**Slash commands that move pipeline.** A Claude Code slash command is a markdown file in `.claude/commands/`. The filename becomes the command. The body is a prompt tied to a script. Type `/stale-opportunities` in a session, the agent reads the file, runs the Python, summarizes the result, asks whether to execute the write. The chapter ships one of these built end-to-end, plus two more sketched.

**A runnable starter.** `stale_opportunity_check.py` lives in `starters/crm-automation/`. It queries HubSpot for deals past 60 days in the stages you pick, re-checks each primary contact via Apollo to see if they left the company, scans the account for new ICP-match hires in the last 30 days, pulls recent news signals, and writes a narrative back to four custom properties on the deal.

No API keys? Run with `--mock`. Then `--dry-run`. Then real.

## The specific motion

Here's the kind of deal the script surfaces. A qualified-to-buy opportunity that went quiet past sixty days. The AE worked it, the champion went dark, the 60-day line came and went, and nobody has opened the record since.

The script runs. Apollo `/people/match` on the primary contact shows the champion moved to a bigger competitor weeks ago. Apollo search at the account surfaces a new Head of RevOps who joined last week plus a VP of Sales who joined the week before. Optional Exa news scan pulls a recent funding round and a GTM team expansion. All of that condenses into one narrative string written to `agent_signals_summary` on the deal. The AE opens HubSpot in the morning, reads three sentences, knows exactly what to do.

The script does not send the email. The human writes the email. The script turns a list of 500 stale deals into ten worth a human's attention.

## The quote from the thread

A HubSpot practitioner replying on my own post last week put this sharper than I have: *"Claude Code will sort the true RevOper's from the button pushers."*

He was not being polemic. He was naming a trend he is watching inside the HubSpot community. In the same thread: *"the people that spent their days just copying properties from Excel and clicking around HubSpot are in for a difficult time unless they adapt."*

That is a HubSpot person saying this, not a Claude evangelist. It tracks with what I saw when I left the agency world. Every client we served was using spreadsheets, tab-switching, Miro boards, and manual property updates to run GTM. None were Claude Code native. The gap between a RevOps person who writes Python and one who clicks through the UI is widening by the month.

That is the actual thing happening. Not AI replacing operators. Operators with code replacing operators without it. The coding agent is the tool. The version-controlled workflow is the real edge.

## The debate people are already having

My last post kicked off an argument in the comments. One camp, led by u/zovencedo: *"CLI + n8n + postgres then. You don't need HubSpot anymore."* The other camp: HubSpot is still the best source-of-truth for contacts, deals, and customer records, because it is where the rest of the company operates from.

I agree with both. I want HubSpot as the source of truth for records. I want code as the source of truth for workflows, automations, custom properties, and audit trails. The source of truth for data and the source of truth for logic are not the same artifact. Putting them in the same tool is how you end up with a GTM stack nobody can reason about.

Chapter 13 is the code half of that picture.

## What this is not

Not a product. Not a HubSpot replacement. Not a tool you buy.

It's educational. Hybrid. The scripts are skeletons you edit to fit your ICP, your stages, your disqualification logic, your voice. Nothing in it is perfect — that is why it's labeled the way it's labeled, and that is why it keeps changing. The scripts I run in production have calibrated weights and tuned prompts that are not in the public version. That calibration is where the real edge is, and no starter can pick it for you.

What the repo is: the working skeleton, documented, with opinions baked in where I have a strong one. You fork it, you tune it, you ship from it.

## How to use it

```bash
git clone https://github.com/shawnla90/gtm-coding-agent
cd gtm-coding-agent
claude
> help me set up
```

The onboarding asks six questions and routes you to a learning path. For CRM automation: Chapter 04 → 07 → 08 → 13 → 05.

The starter itself is at `starters/crm-automation/`. The README walks you through the four custom properties to add to your Deal object in HubSpot (or Opportunity in Salesforce) so the script has somewhere to write.

## What's next

Multi-agent RevOps — one agent running stale-opportunity checks, another running champion-change detection, a third running new-hire triggers, all writing to a shared set of custom properties with different signal types. The CRM becomes the shared canvas. The git log becomes the change history your RevOps team never had.

Chapter 13 runs. Starter works. Repo is at [github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent). Fork it, tune it, tell me what broke.

*Building with Claude Code daily at [shawnos.ai](https://shawnos.ai).*
