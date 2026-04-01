# the AI is the teacher

> **Platform**: Substack
> **Series**: OS.AI Labs
> **Structure**: Hybrid - Personal POV Essay + Tactical Breakdown
> **Date**: 2026-04-01
> **Status**: draft v7 (conviction lead + receipts structure)

**Subject line:** the AI is the teacher
**Preview text:** I will never sell a course. here's what I'm doing instead.

---

I'm starting to feel like it's my duty to share this.

because the alternative is people paying for courses. and people selling you AI courses in 2026 are mostly selling you their ability to package what's already free. the tools have documentation. Claude Code will teach you while you build. the AI is the teacher. the thing you're trying to learn... can teach you itself. in real time. while you build real things.

and honestly? the person selling you the course probably used Claude to write the course materials. you're paying a middleman to resell you the output of the tool they're teaching you to use.

I will never sell a course. I'm building my own product. if someone has to get good enough at something just to package it into a course to profit from it, that's usually a bad sign. the business model is your hope. the product is a PDF and some screen recordings of stuff you could find on YouTube.

there are people in my DMs. kids. actual students. trying to learn go-to-market. and the first thing they hit is a paywall from someone who built one project six months ago and decided to teach.

you end up with something real when you build. not a certificate. a system. a workflow that runs in the background while you sleep.

so here are the receipts.

**the repos**

I've open sourced eight repos. all products of real builds. the newest one is the gtm-coding-agent repo on GitHub. 10 chapters covering everything from what a coding agent is, to context engineering, to turning your Mac into a GTM server with launchd and SQLite. interactive onboarding where you open it in Claude Code and type "help me set up" and it builds your workspace. templates, prompts, Python scripts. MIT licensed. free. I dropped it last week and I'm pushing new commits to it today.

the others are iterations. recursive drift, context handoffs, the website playbook. each one a different structure, a different focus. every one of them exists so that if you fork it, you can learn from it. it might not be perfect. I'm using Claude Code to write it. but I dictate everything. I read everything. there's no scheme. there's no upsell. there's nothing hidden in the markdown. the idea is for you to learn from the system, not to buy it.

that's the difference between what I'm doing and a course. a course gives you a recording. a repo gives you a system you can run.

**how I got here**

I didn't just wake up one morning and decide to run my entire go-to-market from terminals. there was a learning curve, and I think sharing that matters more than showing you the finished system.

a few months ago I counted the browser tabs I had open while working. fourteen. not because I was researching or deep in something interesting. fourteen tabs of go-to-market tools. CRM in one. enrichment in another. spreadsheets. email sequencing. scraping. and then whatever tabs I actually needed for the thing I was trying to build or write, buried somewhere behind all of them.

I remember sitting there one afternoon, waiting for an enrichment job to finish, watching a progress bar fill up pixel by pixel, and thinking... I'm not actually doing anything right now. I'm just watching software work. and I'm paying over $2,000 a month for the privilege of watching it.

I started on Cursor. burned through the plan in a week because I was only using Claude Opus and not touching Composer or any of the other features. just raw Opus calls for everything. tried going direct to the API. spent about $600 running Opus through OpenClaw. getting things done, sure, but bleeding money doing it.

then I realized: everything I was doing could be done on Claude Code. same model. but inside a terminal that understands my project, reads my files, and runs commands. the moment I stopped treating it like a chat window and started treating it like an operating system for my work, everything changed.

but even then, it wasn't instant. I had to learn context engineering. how tokens work. how much of my context window I was burning on things that didn't need to be there. I went through the phase everyone goes through right now with MCPs. loading every MCP server I could find because it felt like the right thing to do. more connections, more power, right?

not really. every MCP tool loaded into a session eats context. every tool call burns tokens. I was watching my sessions slow down and my limits disappear because I had fifteen integrations loaded when I only needed three for the actual task. the real unlock was learning when to use an MCP and when a CLI does the same thing without the overhead. most of the time, a CLI does the same thing.

five months in now. every month I understand it deeper. every month the sessions get tighter. that's the real transition. not tabs to terminals as a decision. tabs to terminals as the result of learning how the system actually works.

**what it looks like now**

right now I have four terminal sessions open. one is scraping 10,000 followers from a competitor's X account through Apify CLI. one is enriching a list through Apollo. one is pushing rows into Supabase. the fourth is drafting this post through Claude Code. none of them are blocking each other. everything is happening in the background on a single Mac Mini.

most of the tools I was paying to click through have a CLI. install it, authenticate once, and the terminal handles the rest. and when a CLI isn't available, that's where you make the trade-off. maybe you use an MCP for that one tool. maybe you write a quick Python wrapper. but because you already have the system structured the right way, because your repos are organized, your SQLite databases are queryable, your CLAUDE.md files tell the agent exactly what it's working with... the overhead of adding one integration is minimal. the system absorbs it.

every scrape is a signal. you scrape a competitor's followers. you scrape somebody in your industry who sells tech that connects to yours. then you cross-reference. the same company shows up following three of your competitors? intent. someone follows both your competitor and a complementary tool? integration buyer. we scraped 11,000 followers from a competitor displacement list last month. cross-referenced against an industry tool's audience. dozens of overlapping companies. each overlap is a signal you'd never get from a single list.

**the messy parts**

I'm not going to pretend this is clean.

we tried scraping LinkedIn followers with Python. built our own script. if you have more than 3,000 followers to pull, save your progress first. it will black out. even with the CLI approach, LinkedIn will cut the connection. we ran it three times and learned the hard way. the workaround? letter-by-letter search to avoid Chrome crashes. save in batches. accept that it's going to fight you.

but when you need the data and you're not trying to pay a vendor hundreds a month for something a script can do, sometimes you just want to get it done. I'm the type of person where if something takes 24 hours to process, I'd rather see if Claude Code can get it for me faster. even if it fails half the time. because the CLI runs in the background. it's not burning tokens. it's just actions happening in another terminal tab while I build.

same thing with Instagram. I'm running a scraper right now to identify bot followers on accounts I'm growing. same thing with Apollo enrichment. raw list from scraping, run through the free tier in batches so you don't throttle the limits. you can have 10 things running and still be writing or building or on a call.

**the skill trap**

there's something happening right now in the coding agent space that I want to flag.

everyone is loading skills. dozens of them. MCP servers for everything. custom slash commands for every workflow. and then they wonder why their sessions burn through limits, why the agent gets confused, why nothing feels productive.

the skill is using the tool itself. knowing how to direct it. knowing which repo to point it at. knowing when to use a subagent versus doing it inline. knowing that a well-structured CLAUDE.md file and a clean folder hierarchy does more for your output than 40 custom skills ever will.

the ones that matter are the ones that emerged from actually building, not the ones I created because I thought I might need them someday. the system teaches you what's necessary if you let it.

you're going to see new updates, new commands, new capabilities from Claude Code constantly. that's the nature of it. but the foundation doesn't change: structured context, clean repos, knowing how to direct a session. get that right and everything else is incremental.

**the paradoxes**

two things I keep thinking about.

the first: I open sourced that 10-chapter playbook. LinkedIn engagement: polite silence. the algorithm gently dusted it under the rug. two weeks later I posted about a tool's pricing change. 50,000 impressions. apparently the algorithm prefers outrage over open source. I'll keep shipping both. but it's funny how the thing with the most value gets the least distribution, and the hot take I spent 10 minutes on reaches more people than months of building.

the second: I genuinely try to use less AI in my writing every day. and every time I do, the posts perform worse. AI has trained us all to expect a certain rhythm and structure in content. we're seeking it out now without even realizing it. the posts that feel the most polished, the most organized, the most satisfying to read... those are the ones with the AI fingerprint. I use AI for literally everything else in my workflow. scraping, enrichment, database management, orchestration, deployment. but the one place I try to keep it minimal is writing. and that's apparently the one place where it matters most to the reader.

I don't have clean takeaways from either of those. they're just things I think about at 2am while Claude Code runs enrichment scripts in the background.

what I do know: you don't need permission to learn this. you don't need a course. you don't need someone else's framework. open a terminal, install a CLI, and build something. the first one will be ugly. the tenth one will surprise you.

not everybody is going to be able to do this. I know that. but my goal is to share my system, my patterns, and my beliefs so you can fork them, lift from them, and build your own. that's why everything is open source. that's why it's all free.

the people who figure this out in 2026 will have infrastructure that took companies entire teams to build two years ago. and they'll have built it themselves, from a single machine.

shawn ⚡ the gtme alchemist 🧙‍♂️

---

if you're building your own GTM stack from terminals and want to compare notes, reply to this email. I read every one. the gtm-coding-agent repo is linked in the comments and on shawnos.ai.
