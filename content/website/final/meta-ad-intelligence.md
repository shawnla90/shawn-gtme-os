---
title: "Ads Are the Bet a Company Will Make in Public"
date: "2026-05-11"
excerpt: "Your competitor's ad budget is a research report. The Meta Ad Library hosts every public bet they're making, for free. Chapter 15 of the gtm-coding-agent repo turns it into a structured table you can read in ten minutes."
category: "gtm-engineering"
featured: false
---

# Ads Are the Bet a Company Will Make in Public

Your competitor's ad budget is a research report. You just have to know how to read it.

Operators sit in a room and try to write what they think their company stands for. Meanwhile, three competitors down the street are spending six figures a month telling the actual market what they stand for, in language a media buyer optimized against real performance. That is the positioning document competitors are testing against real spend, and Meta hosts it for free.

The Meta Ad Library lets you pull every active creative from any company running ads on Facebook or Instagram. You can read the headlines, the offers, the audiences, the formats, the calls to action. Every bet your competitor is willing to make in public, sitting in a public archive. The vast majority of GTM operators I talk to either do not know it exists or have clicked through it once and bounced, because reading 400 ads by hand sounds like punishment.

Last week I pushed Chapter 15 to the gtm-coding-agent repo. Meta Ad Intelligence. It closes the gap.

*originally an issue of Level Up GTM, my LinkedIn newsletter*

## What the chapter actually does

Point the script at a competitor's Meta page. It pulls every active creative they are running. Then Claude Code runs as a subprocess and reads each one through an 18-column taxonomy. Offer type. Hook style. Claim type. Audience signal. Format. CTA. Pain framing. Persona signal. Pricing reference. Whatever you decide matters for your category.

What you get back is a structured table you can read in ten minutes. Every public bet a competitor is making, classified, sortable, comparable. The first time I ran it on a competitor I had been watching for six months, I learned more in twelve minutes than I had in those six months of scrolling their LinkedIn page.

## Six months ago this required a hire

Six months ago, doing this would have meant either hiring a junior dev to build a scraper plus a classifier, or paying an agency twelve thousand a quarter to send you a quarterly slide deck of what they saw. Today you describe the workflow in plain English to a coding agent. It writes the script. You read it. You commit it. You iterate on it like code. The judgment call about what to do with the table is still yours. The classification work, the part that scales linearly with how many competitors you want to watch, is no longer your job. Anything an experienced operator can describe out loud is now extractable into a repository. Version-controlled. Runnable by someone else when you are on vacation. The only requirement is a clear thinker with a terminal and a CLAUDE.md file that tells the agent what good looks like.

## Gotchas, because I made these mistakes first

Run one scrape at a time per competitor per pass. I tried to multiplex three companies across one taxonomy classification call and the output degraded. The classifier got confused about which company a creative belonged to and started attributing the wrong claims. One pass, one competitor, every time.

Be narrow about scope. If you point this at a category like "all CRM vendors" you are going to get a soup of taxonomy hits that does not tell you anything actionable. Pick one competitor. Pick one campaign theme if you can. The narrower the scope, the higher the signal.

Evaluate the output before you scale. The first time I ran the full 18-column taxonomy I realized only six of those columns were actually shaping any decision I was making. The other twelve were taxonomy padding that felt thorough but produced noise. Cut what you do not use. The chapter is a starting point, not gospel. Ask Claude how to adapt the taxonomy for your category.

I am still iterating on this. The version in the repo is what I had working last week. I am putting it out there mid-build because shipping mid-build is the actual practice. Chapters that wait until everything is perfect never ship.

## The agency frame, since somebody is going to ask

If you have spent any time comparing ad agencies, the good ones do this. The intelligence work is the part agencies will not show you, because it is the part that justifies the retainer. They scrape competitor ad libraries, classify the creative, build a positioning map, and quietly use that to inform the strategy slide they put in front of you in month three.

I am giving the workflow away because I am not running an agency. I am building a tool. The same intelligence approach is what powers the tool I am shipping in a few days. More on that this week.

If you are an operator inside a company, you can run this yourself today. If you are at an agency that already does this, the chapter is a way to scale across more clients without growing headcount. Either way, the surface is more public than people realize.

## How to grab it

```
git clone https://github.com/shawnla90/gtm-coding-agent.git ~/gtm-coding-agent
cd ~/gtm-coding-agent
claude
> help me set up
```

Fifteen chapters. Public. The onboarding asks six questions and routes you to a learning path that matches your role.

Direct link to the chapter: [github.com/shawnla90/gtm-coding-agent/blob/main/chapters/15-meta-ad-intelligence.md](https://github.com/shawnla90/gtm-coding-agent/blob/main/chapters/15-meta-ad-intelligence.md)

## The build is the show

The reason this newsletter exists, and the reason every chapter ends up in a public repo, is that sharing the build live surfaces the actual work. You cannot fake a thirty-minute debugging session where the answer turns out to be a wrong env path. The work is the thing, and the work is unflattering enough often enough that nobody mistakes it for a personal brand exercise.

The hump is being seen stuck in real time. I held off on streaming the actual development for months because I thought watching me lose forty minutes to a typo would make me look unserious. What happened is the opposite. The people who watch the stuck moments are the people who actually care about the craft. Once you get over the hump, the content writes itself, because it is just the work.

It is closer to a coding stream plus a notebook you publish at the end of the week. The chapters in the repo are the notebook. The newsletter is the weekly synthesis. The streams are the working surface. The whole work is the show, not just the polished cuts.

Shawn Tenam
the GTM alchemist
"See your market. Move first."
