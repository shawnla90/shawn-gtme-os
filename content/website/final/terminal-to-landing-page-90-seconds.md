---
title: "I haven't opened a CMS editor in months"
date: "2026-03-13"
excerpt: "How I generate personalized landing pages from the terminal in 90 seconds. Exa MCP for research, Python for orchestration, Grok for copy, Claude Code for deployment. No drag-and-drop. No GUI."
category: "ships"
featured: true
---

**tl;dr:** I replaced 45 minutes of CMS drag-and-drop with one terminal command that generates personalized landing pages in 90 seconds. Exa for research, Python for orchestration, Grok for copy, Claude Code for deployment. Every page is grounded in real company data, not generic templates.

## how do you go from terminal to landing page in 90 seconds?

open HubSpot. click into the CMS editor. wait for it to load. drag blocks around. write a headline. tab over to LinkedIn to research the company. tab back. write body copy. guess at pain points. preview. adjust. publish.

45 minutes if you're fast. and the output is generic because the research step is manual and rushed.

I did this for every ABM target. every outbound sequence needed a matching landing page. the math didn't work. 20 accounts means 15 hours of CMS work before a single email sends.

## what's the stack?

four tools wired together so the output of one feeds the input of the next.

**Exa MCP** pulls real-time company intelligence. firmographics, tech stack, recent news, hiring signals. this isn't scraped garbage or stale database records. it's structured data I can actually feed into a prompt. one MCP call returns more context than 20 minutes of manual LinkedIn stalking.

**Python SDK** orchestrates the flow. takes the Exa research output, formats the context payload, sends it to the model, handles the HTML templating. this is the glue layer. no manual steps between research and generation.

**Grok** generates the landing page copy. headline, subhead, pain points, value props, CTA. all personalized to the account based on what Exa found. every page references real things about the company because the research layer already ran.

**Claude Code + HubSpot CLI** pushes the finished page directly to HubSpot. no browser. no drag-and-drop editor. no waiting for the CMS to load. one command and it's live.

## what does the actual workflow look like?

```bash
python generate_landing.py --company "Acme Corp"
```

that's it. one command. pass in a company name.

behind the scenes:

1. Exa MCP fires. pulls company data, recent news, tech stack, hiring signals
2. Python formats the research into a structured context payload
3. context gets sent to Grok with a landing page template prompt
4. Grok returns personalized HTML with real company references
5. Claude Code pushes it to HubSpot via CLI
6. page is live. ready to link in an outbound sequence

90 seconds start to finish. and the quality is better than what I was building manually because every page is grounded in real research, not vibes.

## why does this matter for outbound?

personalized landing pages convert better than generic ones. everyone knows this. the reason most teams don't do it is because the production cost doesn't scale. if it takes 45 minutes per page, you're only personalizing for your top 10 accounts.

at 90 seconds per page, you can personalize for 100.

link the page in your Instantly sequence. the prospect clicks through and sees their company name, their tech stack, their actual pain points. not "we help companies like yours grow." the specific version.

the difference in reply rates isn't marginal. it's the difference between getting ignored and getting a meeting.

## what pattern makes this possible?

the tools will change. Exa might get replaced. Grok might not be the best model next quarter. HubSpot might not be your CMS.

the pattern stays: research layer --> orchestration layer --> generation layer --> deployment layer. no GUI in the loop. every step automated. every output feeding the next input.

this is what GTM engineering looks like in 2026. not dragging blocks around in a CMS editor. writing scripts that wire intelligence to execution.

if you're still building landing pages one at a time in a browser, you're spending hours on something that should be a command.

## frequently asked questions

**can you build a landing page from the terminal?**
yes. with the right stack wired together, you can generate a fully personalized, research-grounded landing page from a single terminal command. no CMS editor, no drag-and-drop, no browser involved.

**how long does it take to generate a landing page?**
90 seconds from command to live page. that includes real-time company research via Exa, copy generation via Grok, and deployment via Claude Code and HubSpot CLI. the old CMS workflow took 45 minutes.

**what stack do you need?**
Exa MCP for company research, a Python SDK for orchestration, an LLM for copy generation (I use Grok), and a CLI deployment tool for your CMS. the specific tools matter less than the pattern: research, orchestrate, generate, deploy. no GUI in the loop.

## keep reading

- [Google just shipped a CLI for every Workspace API](https://shawnos.ai/blog/google-workspace-cli)
- [the real cost of a slow website](https://shawnos.ai/blog/slow-website-cost)
- [what 1M context window means for Claude Code](https://shawnos.ai/blog/claude-code-1m-context-window)
