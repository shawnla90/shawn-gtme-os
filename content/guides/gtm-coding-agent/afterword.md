---
title: "Fork It, Build It, Ship It"
subtitle: "This is an open-source playbook. Take it and make it yours."
part: 0
order: 11
date: "2026-03-27"
---

## Where you started, where you are

Go back to the beginning. Chapter 1. You didn't know what a coding agent was. Or maybe you thought you did, because someone at a conference said "AI agent" and it sounded like a chatbot with extra steps. You learned the real distinction: a coding agent can read your files, reason about your goals, write code, execute it, observe the results, and iterate. It's not a text box you type questions into. It's a collaborator that builds alongside you.

That distinction seemed academic when you first read it. It doesn't anymore. You've felt the difference in your hands. You've sat in a terminal, described what you wanted in plain English, and watched an agent scaffold working code. You've iterated through broken scripts and come out the other side with something that works. You've experienced the specific satisfaction of running a pipeline you built and watching it produce real, usable output.

You learned context engineering. Not "prompt engineering," which is the art of crafting clever one-liners for a chat interface, but the deeper discipline of structuring knowledge so an agent can do serious, sustained work. You wrote CLAUDE.md files that gave your agent persistent understanding of your goals, your stack, your constraints. You built memory systems that carry context across sessions. You learned, probably the hard way, that the quality of what an agent builds is directly proportional to the quality of the context you give it. Garbage context in, garbage code out. Rich, structured context in, reliable, well-architected systems out.

You set up your environment. Terminal, editor, Python, git, a coding agent. For some of you, that was the hardest chapter in the whole book. It was the one where imposter syndrome screamed loudest. Where every error message felt like proof you didn't belong. Where installing Python somehow broke something and you had to troubleshoot a path variable before you'd even written a line of code. You pushed through it anyway. The terminal isn't scary anymore. It's just a tool, like a pipe wrench or a phone dialer. It does what you tell it.

You built pipelines. Real ones that produce real output. Prospecting workflows that pull leads matching your ICP from data sources, enrich them with firmographic and technographic data, score them against weighted criteria, and push qualified leads into your CRM ready for outreach. Outbound systems that generate personalized messaging at scale without sounding like they were written by a robot, because they're grounded in real research about each prospect. Enrichment scripts that turn a company name and domain into a full intelligence brief: funding history, tech stack, hiring signals, competitive landscape, org chart.

These aren't toy projects you built for practice. They're the infrastructure underneath your quota. They run. They produce. They save you hours every week that you now spend on the parts of the job that actually need a human.

You learned automation. Cron jobs that fire at midnight and have results waiting in your inbox when you wake up. Database queries that surface insights you didn't know to ask for. Sync engines that keep your CRM, your enrichment data, and your outreach sequences in lockstep without you lifting a finger. You went from "I run a script manually when I remember to" to "my system runs itself on a schedule and alerts me when something needs attention."

And then you put it all together. You tied the pipelines to the automations, the automations to the databases, the databases to the dashboards. You built something that looks a lot like an operating system. Your GTM OS. A personal, local-first infrastructure that you own, you understand, and you can modify without asking anyone's permission, filing a ticket, or upgrading a pricing tier.

That's the journey. Terminal Zero to GTM Engineer. Not in the abstract. In the real, tangible, I-built-this-and-it-works sense.

## The compound effect

Here's what's easy to miss when you're heads-down in the chapters, focused on the specific task each one teaches: every chapter was a multiplier, not just an addition.

Understanding what agents are and how they think let you do context engineering effectively. Without that foundation, your CLAUDE.md files would have been unfocused wish lists instead of precise instruction sets.

Context engineering made your pipelines reliable. Without structured context, your agent would have built something that sort of worked once and broke the next time you ran it on different data. With good context, it built systems that handle edge cases because the context told it to.

Reliable pipelines made automation worthwhile. There's no point scheduling a cron job for a script that fails half the time. The reliability you built in Part 3 is what made Part 5's automation layer actually trustworthy.

Automation freed your time to build more systems. Once your prospecting pipeline ran itself, you had the hours to build the enrichment pipeline. Once enrichment was automated, you had time for the competitive intel tracker. Each automated system gave you the capacity to build the next one.

More systems compounded into an operating system. Not because you planned an OS from the start, but because when you have enough well-built, well-automated, well-connected systems, the whole becomes more than the sum of its parts. Data flows between them. One system's output is another system's input. The intelligence compounds.

If you'd tried to jump straight to "build me a GTM OS," you'd have gotten a pile of fragile scripts you didn't understand. I know because I tried it that way first. The agent would build something complex, I'd run it, it would break in ways I couldn't diagnose because I hadn't built the understanding layer by layer. The progression in this book exists because I learned the hard way that shortcuts in understanding produce fragile systems.

This is also why copy-pasting someone else's automation setup rarely works long-term. You get the output without the understanding. The first time something breaks, and something always breaks because APIs change, data formats shift, rate limits hit, CRM schemas update, you're stuck. You can't debug what you don't understand. You end up filing a support ticket with yourself and losing.

The person who built it from foundations up just opens their terminal and fixes it. They know where the data flows. They know which function handles the enrichment step. They know how to add a retry when an API times out. That person is now you.

## The shift that already happened

While you were working through these chapters, something else happened that's worth naming: the way you think about tools changed.

Before this book, tools were things you purchased. You evaluated vendors. You compared feature lists. You sat through demos. You negotiated pricing. You implemented someone else's vision of how your workflow should operate, and you adapted your process to fit their product.

Now, tools are things you build. Or at least, they can be. Not everything needs to be custom. There are plenty of excellent products worth paying for. But you now have the ability to look at a problem and ask: should I buy a solution, or should I build one? And you can actually follow through on "build" if that's the better answer.

That's a different relationship with technology. It's the relationship that engineers have always had and that operators haven't, until now. Coding agents closed that gap. You didn't learn to code in the traditional sense. You learned something more useful for your role: how to collaborate with an agent that codes, how to design the system, how to describe what you need, and how to verify that what was built actually works.

The GTM operators who develop this skill set will outperform their peers in ways that compound over time. Not because they work harder, but because they build systems that work for them. Every manual process they automate frees time to automate the next one. Every system they build makes the next system easier, because the patterns transfer and the infrastructure already exists.

## Take the repo

This playbook lives on GitHub. The full source. Every code example, every CLAUDE.md template, every pipeline config, every script referenced in these chapters. It's there. It's public. It's licensed for you to use.

**Fork it.** That's not a metaphor. Literally click the fork button on GitHub. Now you have your own copy of every piece of infrastructure in this book. Modify the pipeline scripts for your specific ICP. Swap out the CRM integration for Salesforce or Attio or whatever you use. Change the enrichment data sources. Adjust the scoring logic to match your market. Rewrite the outreach templates in your voice, not mine. The whole point of open source is that you take it and make it yours.

**Break it.** I mean this seriously. The best way to learn any system is to push it until it fails and then figure out why. Change a parameter in the enrichment script and see what happens to the output. Remove a step from the pipeline and observe what breaks downstream. Set the cron to run every minute instead of every night and watch what happens to your API rate limits. This is how understanding gets built: not by reading about systems, but by poking at them until they reveal how they actually work.

**Extend it.** This is where it gets interesting. Built something the book doesn't cover? A Slack integration that notifies your team when a high-scoring lead comes in? A dashboard that visualizes pipeline velocity? A competitive intel scraper? A meeting prep automation that pulls everything your CRM knows about a prospect into a single brief? Add it to your fork. Write it up. Your extension might become the chapter someone else needs to read.

**Make it better than what I wrote.** The version of this playbook that's most useful to you is the version you've customized for your specific workflow, ICP, tools, and market. My version is the starting point. Your version is the one that actually runs your pipeline.

## How to contribute

The GTM engineering community is small and early. That's an advantage, not a limitation. Early communities are where the norms get set, where the culture gets defined, where the first builders shape everything that comes after. Right now, the people doing this work are scattered: an SDR in Austin who automated their prospecting, a rev ops person in London who built a custom enrichment pipeline, a founder in Berlin who replaced three SaaS tools with scripts and a cron job. They're all figuring it out independently. This book and its repo are one attempt to give them a shared foundation.

Here's how to put something back:

**Write a chapter.** See a gap in the playbook? A workflow it doesn't cover? A tool it doesn't address? A use case specific to your industry or market? Write it up. Follow the format of the existing chapters: state the comfort level at the top, explain the concept before showing the implementation, include working code that the reader can actually run, and add the "why" alongside the "how." Submit a pull request. If the writing isn't polished, that's fine. Get the substance right and the community will help refine the prose.

**Improve an existing chapter.** Found a more efficient way to do something? A clearer way to explain a concept? A bug in a code example that took you an hour to track down? Fix it and submit a PR. Every improvement makes the book more useful for the next person who reads it. The best technical books evolve continuously, and open source makes that possible.

**Share your stack.** Not everyone uses Claude Code, Python, SQLite, and HubSpot. If you built a version of these pipelines using Cursor, or Windsurf, or Salesforce, or Node.js, or Postgres, or anything else, that's valuable. Write it up as an alternative implementation and contribute it. The principles are stack-agnostic; the implementations don't have to be.

**Report issues.** Something doesn't work when you try to run it? A chapter is confusing in a specific section? An API changed and a code example is outdated? Open an issue on the repo. Even if you don't have the fix, identifying the problem is half the work. Someone else will fix it, probably within days, because that's how active open source communities operate.

**Translate it.** GTM engineering isn't an English-only discipline. If you can translate chapters into another language, that opens the playbook to an entirely new audience of builders.

The bar for contribution is low on purpose. You don't need to write perfect prose or flawless code. You need to share something useful. The community will help refine it. That's the deal with open source: you contribute your best effort, and the collective makes it better.

## The community

Building doesn't happen in isolation. Not sustainably. You need other builders around you. Not for motivation posters and hustle culture, but for the practical, daily reality of building software: "has anyone connected this API before?" and "here's how I solved that rate limiting problem" and "this approach is way cleaner than what the book describes" and "I broke everything, can someone help me debug this error?"

**r/GTMBuilders** is the subreddit. It's where GTM engineers, ops people, SDR-turned-builders, and founders share what they're building, ask technical questions, post their setups, and help each other debug. It's technical enough to be genuinely useful and accessible enough that you don't need a CS degree to participate or feel welcome. The culture is builder-first: show your work, help others, no gatekeeping.

**LinkedIn.** I'm Shawn Tenam. I write about GTM engineering, coding agents, building in public, and the systems I'm building in the open. Connect, follow, or DM me what you've built. I read everything that comes in. Some of the best ideas for this playbook came from DMs by people who were building things I hadn't thought of.

**The ShawnOS ecosystem.** The GTM OS, this playbook, the tools and templates and pipelines, they're all part of a larger project: building the open-source infrastructure layer for the next generation of GTM operators. The people who will define how go-to-market works in the age of AI agents aren't going to come from a single company or a single background. They'll come from everywhere, from SDR pits and rev ops desks and one-person startups, and they'll build the future of GTM with their own hands and their own agents. If that vision resonates with you, there's a place for you in this ecosystem.

## What's next

You finished the book. That's good. That's a real accomplishment, especially if you started at Level 1 and pushed through the hard parts. But finishing the book is not the finish line. It's the starting line.

**Pick one workflow.** Don't try to build your entire GTM OS in a weekend. I tried that. It ended with twelve half-finished scripts, a mess of API keys, and a deep sense of being overwhelmed. Instead, pick the one workflow that eats the most of your time or causes the most frustration. Maybe it's manual prospecting. Maybe it's CRM data hygiene. Maybe it's weekly reporting that takes you three hours every Monday morning. Build the automation for that one thing. Get it running. Get it reliable. Trust it. That's your first win. That first win is what gives you the momentum and confidence to tackle the second one.

**Then pick the next one.** And the next. Each new automation connects to the ones before it. Your prospecting pipeline feeds your enrichment system. Your enrichment system feeds your CRM. Your CRM feeds your reporting dashboard. Within a few weeks you'll look up and realize you've built something substantial. Not because you had a grand architectural plan from day one, but because you kept solving the next problem and the pieces started fitting together.

**Build in public.** Share what you're making. Post the wins and the failures. Write about what worked and what didn't. Record a five-minute video walking through your setup. The GTM engineering field is being defined right now, in 2026, by people who are doing the work and talking about it publicly. Your build log is someone else's tutorial. Your failure is someone else's shortcut. Your "I figured out how to connect X to Y" post is going to save someone else three days of frustration.

**Teach someone.** Find the SDR on your team who's been curious about AI but hasn't taken the first step. The one who asks you how you built that thing. Show them Chapter 1. Sit with them while they set up their environment. Watch them experience the same moment you experienced when their first agent-built script ran successfully and actually produced useful output. That moment, the one where something shifts from theoretical to real, is one of the best moments in this entire journey. Don't gatekeep it. Multiply it.

**Stay uncomfortable.** The week you stop building new things is the week your skills start depreciating. I don't say that to create anxiety. I say it because it's true and because it's actually good news. It means the ceiling keeps going up. There's always another workflow to automate, another system to build, another tool to learn. The agents get better every few months. New capabilities unlock new possibilities. The person who keeps building, who stays curious, who treats every new tool as something to learn rather than something to resist, that person stays ahead. Not just for a quarter, but permanently, because the compounding never stops.

**Come back to this book.** It'll still be here when you need a reference. And the GitHub version will keep evolving as the community contributes new chapters, better implementations, and patterns none of us have discovered yet. Check back in six months and you might find chapters on tools that don't exist today.

## The final thought

There's a version of your GTM stack where every tool is a black box. You pay a vendor, you get a login, you click buttons in their UI, and you hope it works. When it doesn't work, you open a support ticket and wait. When you outgrow it, you migrate to the next vendor's black box, taking three months to move your data and re-learn a new interface. You never quite understand what's happening underneath the buttons, and you're always at the mercy of someone else's product roadmap, someone else's pricing decisions, someone else's idea of what your workflow should look like.

There's another version where you built it. Where you know exactly how your prospecting pipeline works because you wrote the logic with an agent at 11pm on a Tuesday night when you couldn't sleep because you had an idea. Where you can change your ICP scoring weights in five minutes because you understand the code. Where your CRM sync runs on your schedule, on your terms, not on some vendor's pricing tier. Where your enrichment pulls from the exact sources that matter for your market, not the generic sources that matter for everyone. Where your whole GTM operation is a git repo you can fork, version, roll back, branch, experiment with, and extend infinitely.

I'm not saying vendor tools are bad. They're not. I use plenty of them. I'm saying the builder who understands what's happening underneath has options that the pure consumer never will. When the vendor raises prices, you can rebuild that piece. When the API changes, you can adapt in hours, not weeks. When your market shifts and you need a completely different workflow, you can build it from scratch because you've done it before and you know how.

The best pipeline is the one you understand because you built it. Not the one someone sold you in a demo where everything worked perfectly with sample data.

You have the tools. You have the playbook. You have the foundation. You've proven to yourself that you can build real things with coding agents, and that knowledge doesn't expire.

Now go build something nobody's built before. And when you do, tell the rest of us about it.

Fork it. Build it. Ship it.
