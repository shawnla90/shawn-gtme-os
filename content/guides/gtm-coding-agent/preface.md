---
title: "Why This Book Exists"
subtitle: "The gap between knowing AI exists and using it to build your pipeline"
part: 0
order: 0
date: "2026-03-27"
---

## The grind before the shift

In 2023 I was an SDR at a B2B SaaS company, doing what every SDR does: pulling lists in Apollo, writing sequences, manually enriching contacts on LinkedIn, logging activities in HubSpot, and hoping the numbers worked out by end of quarter. I was averaging 80 cold calls a day. My CRM hygiene was decent. I hit quota more often than I missed it. I was doing the job right, by the book, and I was exhausted.

Before sales I was a licensed plumber. Journeyman card in my wallet, PVC cement under my fingernails, crawling under houses in the summer heat. Plumbing isn't glamorous but it taught me something that turned out to be the most important lesson of my career: every repeatable process can be systematized, and the people who build the system always outperform the people who just run it.

A good plumber doesn't re-figure the rough-in for every bathroom. They have a system. The measurements, the fixture layout, the order of operations. They've internalized a process so deeply that execution becomes almost automatic, which frees their attention for the parts that actually require judgment. The creative parts. The problem-solving parts.

Sales felt like the opposite. Every day was a fresh grind. Pull a new list. Research each company from scratch. Guess at email addresses. Write another personalized opener. Log the activity. Move to the next one. There was process, sure, but it was the kind of process that creates busywork, not leverage. I was the system. If I stopped running, the system stopped.

I kept thinking: there has to be a way to build this differently. Not work harder at the same motions, but build something that does the motions while I focus on the parts that actually need a human. The conversations. The relationships. The judgment calls about who to pursue and what to say.

But I didn't know how to build software. I'd never written a line of code. My terminal was something I opened once to troubleshoot a Wi-Fi issue and closed immediately when I saw a blinking cursor with no instructions. Python was a snake. JavaScript was something that made websites annoying. The engineering team at my company might as well have been wizards in a tower I didn't have a key to.

Then I started using Claude.

Not the chatbot version where you ask "write me a cold email" and get something generic back. I mean the coding agent. The thing that can read your files, write code, execute commands, and build actual software alongside you. The first time I told it what I wanted, described the workflow in plain English, and watched it scaffold a working Python script that pulled ICP-matched leads, enriched them with real data, and formatted the output for my CRM import, something clicked in a way that felt permanent.

This wasn't a better chatbot. This was a collaborator that could code.

## The moment it changed

I remember the exact workflow because I've told this story a hundred times and the details never change.

I had a spreadsheet of 200 companies from a target account list my manager had built. I needed to find the right contact at each one (VP of Ops or above), verify their email, check if the company had raised funding recently, see if they were hiring for roles that signaled buying intent, and score each one against our ICP criteria. Manually, this was a full day of work. Maybe two if I was being thorough. And I was always being thorough because bad data wastes everyone's time.

I opened Claude Code in my terminal, described the workflow in plain English, and we built a Python script together. The "we" matters. It wasn't me giving an order and receiving a finished product. It was iterative. The agent would write a section of code, I'd explain what wasn't right, it would adjust. I'd realize I hadn't described a step clearly enough, so I'd clarify, and the agent would refactor. Forty minutes of this back-and-forth and I had a working script.

The script ran in under 3 minutes against all 200 companies. The output wasn't perfect. Some of the email patterns were wrong. A few companies had stale data. But 80% of the work was done, and done well. More importantly, the logic was right. The structure was sound. I could run it again tomorrow with a different list and get the same quality output.

That was the real unlock. Not the time saved on one task. The fact that I now owned a piece of infrastructure. A system. Something I built (with help), understood (mostly), and could modify without filing a ticket with engineering, waiting two sprints for prioritization, or paying $300/month for another SaaS tool that did half of what I needed.

I ran that script the next day. And the day after. I tweaked the ICP scoring weights. I added a step that checked LinkedIn for recent job changes. I connected the output to a HubSpot import flow. Each iteration took a few minutes with the agent, and each one made the system better.

Over the next year I kept going. I built an automated prospecting pipeline that ran on a schedule. A content generation system for personalized outreach at scale. A CRM sync engine that kept my data clean without me touching it. A competitive intelligence tracker. A meeting prep system that briefed me on every prospect before a call. An entire GTM operating system that runs on my laptop, on my terms, under my control.

I went from SDR to GTM Engineer, a title that barely existed when I started and now shows up in job postings from companies that understand where this is going.

I did all of it with coding agents. I still can't write Python from scratch without looking things up. I still Google basic syntax. That's not the point. The point is I can build. I can describe what I need, collaborate with an agent to create it, understand what we built well enough to maintain and extend it, and ship working systems that generate real pipeline.

The plumber in me would be proud. I finally built the system.

## The gap this book fills

There are thousands of prompt engineering guides. "Top 50 ChatGPT prompts for sales." "How to use AI for outbound." "10 prompts every SDR needs." You've seen them. You've probably bookmarked a few. They teach you to use AI like a magic eight ball: ask a question, get an answer, move on. They're useful for what they are, which is getting slightly better output from a text box. But they don't teach you to build anything.

That's not what this book is about.

There are also plenty of software engineering resources about coding agents. Tutorials on Cursor, Claude Code, GitHub Copilot. Documentation, blog posts, conference talks. They're written by and for developers. They assume you know what a virtual environment is, that you have opinions about package managers, that "set up your dev environment" is a sentence that means something concrete to you, and that you've shipped code before. They're good resources if you're already an engineer who wants to use AI to code faster.

That's also not what this book is about.

This book sits in the gap between those two worlds. It's for people in go-to-market roles who want to use coding agents to build real systems, real automation, real infrastructure, but don't come from engineering backgrounds. It's the practical, opinionated, start-from-zero guide to becoming a GTM engineer with AI as your co-builder.

Nobody wrote this book yet, and I think I know why. The people who could write it are busy building. The handful of GTM engineers who figured this out are heads-down shipping pipelines and automations. They don't have time to write tutorials. And the AI educators, the people who do write guides, are mostly focused on prompting because that's where the attention is. Prompting is easy to teach, easy to consume, easy to turn into a tweet thread.

Building is harder to teach. It requires showing someone how to set up their machine, how to think about systems, how to iterate with an agent through failure after failure until something works. It requires meeting people where they are, which might be "I don't know what a file path is." That's a lot more effort than "here are 10 prompts."

So the gap persists: thousands of operators know AI exists, sense it could transform their work, and want to use it for more than generating email drafts. But they don't have a clear path from "curious" to "building."

This is that path.

## Who this book is for

You should read this if any of these describe you:

**SDRs and BDRs** who are tired of doing the same manual workflows and want to automate the tedious parts. You don't need to become a software engineer. You need to become dangerous enough to build your own tools. The SDR who can build a prospecting script isn't just faster than their peers. They're playing a different game entirely, one where the manual work handles itself and the human focuses on the conversations that close deals.

**Revenue operations** people who spend their days connecting systems, cleaning data, and building reports. You already think in systems. You already understand data flows and process design. You're closer to being a GTM engineer than anyone else on this list, you just don't have the coding layer yet. Coding agents give you that layer. Instead of configuring someone else's Zapier integration, you'll build the exact integration you need.

**Founders and solo operators** running their own GTM motion. You can't hire an engineering team, and even if you could, you'd need to explain your pipeline logic to them, which means you already have to understand it at a deep level. Coding agents are your force multiplier. One person plus an agent can build infrastructure that used to require a team.

**GTM engineers** who already have the title but are still figuring out the toolkit and the workflow. Maybe you got the role because you were the ops person who started writing scripts, or the SDR who automated their prospecting. This book gives you a framework, a progression, and a stack to build on. You'll go from "person who figured some stuff out" to "person who has a system."

**Anyone in go-to-market who's curious** about what "AI agents" actually means beyond the marketing noise. Not chatbots. Not copilots that suggest the next line of code. Agents that can read your codebase, understand your goals, write and execute code, and build alongside you. If you've been hearing about this shift and want to understand it well enough to participate in it, this is your starting point.

One thing this book is not: a book for people who want to vibe-code their way through without understanding what they're building. There's a growing culture of "just let the AI do it" where people prompt an agent, accept whatever comes back, and move on without reading the code or understanding the logic. That works until it doesn't, and when it doesn't, you have a broken system you can't fix.

Every chapter here is about building understanding alongside building software. You'll learn what the code does, why it works, and how to modify it. Not because you need to become a programmer, but because you need to become the kind of builder who trusts their tools because they understand them. If you just want to copy-paste prompts and hope for the best, there are plenty of listicles for that. This is for builders.

## What you'll learn

The book is structured as a progression. Each chapter builds on the last. Skip ahead if you want, but the later chapters assume you have the context from the earlier ones. By the end you'll have both a mental model for how this all works and a working toolkit you can use immediately.

**Part 1: Foundations.** What coding agents actually are, how they differ from chatbots and copilots, and why that distinction matters for GTM work. You'll learn the mental model: agents operate in a loop of reading context, reasoning about it, taking action, and observing the result. You'll understand why "context engineering" is more important than "prompt engineering," and you'll start building the instinct for how to describe what you need to an agent in a way that gets good results. This is where the skill of working with agents gets built. It's a real skill, one that compounds with practice, not just "write better prompts."

**Part 2: Your Environment.** Setting up your machine, your terminal, your first coding agent session. This is the chapter where your hands hit the keyboard and the abstract becomes concrete. If you've never opened a terminal before, this is where that fear dies. We'll install the tools, configure the environment, and run your first agent-assisted build. By the end of Part 2, you'll have proven to yourself that you can do this.

**Part 3: Building Blocks.** Context engineering in depth. CLAUDE.md files that give agents the persistent knowledge they need to build correctly. Structured instructions that turn vague requests into precise output. Memory systems that let agents retain context across sessions. These are the techniques that separate people who use AI occasionally from people who build with AI daily. Part 3 is where you develop the practices that make everything in Parts 4 and 5 possible.

**Part 4: GTM Pipelines.** This is where it gets real. Building automated prospecting workflows that identify and qualify leads while you sleep. Enrichment pipelines that turn a company name into a complete intelligence brief. CRM integrations that keep your data clean and your pipeline accurate. Outbound systems that generate personalized messaging based on real research, not templates. Every chapter in Part 4 produces a working piece of infrastructure you can deploy the same day.

**Part 5: Your Own OS.** How to tie it all together into a personal GTM operating system. Cron jobs that run your pipelines on a schedule. SQLite databases that store and query your GTM data locally. Dashboards that show you what matters. Automation that connects every piece into a coherent whole. This is the capstone: a complete, local-first GTM infrastructure that you built, you understand, and you own.

Each chapter tells you what comfort level it targets, so you always know what you're getting into before you start.

## The comfort levels

Not everyone starts in the same place, and pretending otherwise wastes your time. Every chapter in this book is tagged with a comfort level so you can calibrate your expectations:

**Level 1: Terminal Zero.** You've never opened a terminal. You don't know what a command line is. You might not know what a file path means. That's perfectly fine. Several chapters start here and walk you through everything with the assumption that nothing is obvious. If someone has ever said "just open your terminal and run this command" and you felt lost, Level 1 chapters are built for you.

**Level 2: Copy-Paste Confident.** You can follow instructions. You can open a terminal, paste a command, and hit enter. You've maybe installed something via the command line before. You've probably done something technical that required following a tutorial step by step. You're not scared of your computer, just unfamiliar with the developer tools on it.

**Level 3: Tinkerer.** You've edited a config file. You've maybe written a spreadsheet formula that felt like programming. You understand variables and logic conceptually, even if you can't write code from scratch. When you see a Python script, you can sort of read it. You've been curious about code for a while but never committed to learning.

**Level 4: Writes Code.** You can write Python or JavaScript. Maybe not fluently, but you can read code and modify it. You have a code editor installed. You know what git is, even if you mostly use it for git pull and git push. You've written scripts before but haven't necessarily built full systems.

Most chapters target Levels 2 and 3 because that's where most GTM operators land. But the progression is designed so that a Level 1 reader who starts at Chapter 1 will be solidly Level 3 by the midpoint of the book. You'll level up by doing the work, not by reading about doing the work.

## This is open source

The book you're reading exists in two forms, and this is intentional.

**The web version** (this one) is designed to be read cover to cover. It's the linear, narrative experience. Start at the preface, end at the afterword, and you'll have the complete picture: mental models, practical skills, working infrastructure. The web version prioritizes explanation, context, and the "why" behind every technique.

**The GitHub version** is designed to be forked and built on. It lives in a public repository with all the code examples, templates, CLAUDE.md files, pipeline configurations, and scripts referenced throughout the book. When a chapter says "here's the script that enriches your lead list," the repo has the script. When a chapter walks through building a CLAUDE.md file for your GTM agent, the repo has the template. When a chapter shows a cron job configuration, the repo has the plist.

The two versions link to each other throughout. Reading a chapter on the web and want to grab the code? Click through to the repo. Browsing the repo and want the full explanation of what a file does and why? Click through to the web version. They're two views of the same material, optimized for different modes of engagement.

This dual format matters because GTM engineering is new. The patterns are still forming. The best tools change every few months. The playbook is, by nature, never finished. By making it open source, anyone can contribute a chapter, fix a bug in a code example, add an alternative implementation for a different CRM, or adapt the material for their own stack. The best version of this book isn't the one I wrote. It's the one the community builds together over time.

## A note on tools

This book uses specific tools because I use them and can speak to them honestly: Claude Code as the primary coding agent, Python for scripting, SQLite for local data storage, HubSpot as the CRM example. These are my tools. I know their strengths, their quirks, their failure modes. I can teach them because I've done real work with them.

But the patterns are transferable. If you use Cursor instead of Claude Code, Salesforce instead of HubSpot, Node.js instead of Python, or Postgres instead of SQLite, the thinking still applies. The chapters teach the principle first, then show the implementation. The principle is "build an enrichment pipeline that scores leads against your ICP." The implementation happens to use Python and SQLite. Swap the implementation if your stack is different; the architecture stays the same.

That said, I'm not going to be falsely neutral. When a tool is genuinely better for a specific job, I'll say so and explain why. When a pattern is superior to the alternatives, I'll make the case. You're here for opinions backed by experience, not a balanced product comparison where every option is presented as equally valid. Some options are better. I'll tell you which ones and let you disagree.

## A note on what this book won't do

This book won't make you a software engineer. That's a different career with a different skill set and a different depth of knowledge. What it will do is make you a builder. Someone who can use coding agents to create, maintain, and extend real software systems without needing a computer science degree.

The difference matters. A software engineer understands memory management, algorithm complexity, system design at scale, and a hundred other things that matter when you're building software for millions of users. You don't need any of that to build a prospecting pipeline that runs on your laptop for your territory.

What you need is the ability to describe a system clearly, collaborate with an agent to build it, understand the result well enough to trust and modify it, and keep it running. That's what this book teaches. It's a narrower skill than software engineering but a deeper skill than prompting, and it's exactly the skill that turns a GTM operator into a GTM engineer.

## This book is the guide I wish existed when I started

When I was an SDR staring at Apollo at 7am, trying to pull a list before the morning call block, wondering if there was a better way, I didn't need someone to tell me AI was powerful. I already knew that. Everyone knew that. It was on every podcast, in every LinkedIn post, at every sales kickoff.

What I needed was someone to show me, step by step, how to go from where I was to where I wanted to be. How to open a terminal without feeling like a fraud. How to install Python without breaking something. How to describe what I needed to an agent in a way that got something useful back instead of something generic. How to iterate through the frustration of broken scripts and cryptic error messages. How to build a pipeline that actually ran while I slept.

Nobody showed me. I figured it out through months of trial and error, dead-end approaches, tools that didn't work, scripts that broke at 2am, documentation that assumed I already knew things I didn't, and the occasional moment of magic when something I built actually worked exactly as I'd described it. Those moments kept me going. They were worth all the frustration that came before them.

You don't need to take the slow route. The months of trial and error are already done. The dead ends are mapped. The patterns that work have been extracted and organized and explained in the pages that follow.

This is the faster route. This is the guide I wish someone had handed me when I was sitting in that SDR pit, knowing things could be different, not knowing how to make them different.

Let's build.
