---
title: "from SDR to solo GTM engineer"
date: "2026-03-08"
excerpt: "I shipped 4 full stack websites in 4 weeks on one Mac Mini. the method wasn't planned. it emerged from the work. six states, no fixed order, and a feedback loop where the documentation documents itself."
category: "methodology"
featured: true
---

**tl;dr:** I shipped 4 websites in 4 weeks from one Mac Mini. the method wasn't planned. it emerged from doing the work every day. six states, no fixed order, and a recursive loop where the documentation documents itself.

four weeks ago I started using Claude Code for real.

not the way most people use AI. not asking it to write an email, fix a function, explain some code. I mean running 4 to 6 concurrent terminal sessions on a single Mac Mini, every day, building full stack systems from a monorepo that didn't exist a month prior.

in that time I shipped four websites, built an arsenal of reusable skill files, created a voice system that generates content in my actual tone, wired up a progression engine that tracks XP across an evolving AI agent, and open sourced the whole methodology.

all one monorepo. one machine. one Claude Code Max subscription with no API limits.

I used to be an SDR. 200+ cold emails a day from primary domains with no warmup on SalesLoft. manually building buying committees in Salesforce. learning GTM from the grind up. the tools were different but the instinct was the same. find the system, work it until the output compounds.

that instinct is what made the last four weeks work.

## how did the method emerge?

around week two something shifted. I wasn't just using AI to build faster. I was developing patterns for how the human and the agent collaborate. when to let Claude run with full context. when to stop and question what it just built. when to plan in parallel versus build in sequence.

I started writing these patterns down. not because I was trying to create a methodology. because I kept losing track of what worked and I needed the notes for the next session.

then I noticed the notes were becoming the system. the documentation was documenting itself. the content about how I build was feeding back into how I build. a post about my content workflow became a skill file that automates my content workflow. a writeup about context handoffs became the context handoff protocol that every session uses.

that's when I realized this was a method. I'm calling it recursive drift.

## what are the six states of recursive drift?

recursive drift has six modes you move between. the work decides the sequence, not a playbook.

**freefall.** explore without structure. let ideas from different domains collide. GTM campaigns sitting next to avatar sprites sitting next to newsletter drafts. the mess produces raw material that every other state refines. most of my best skill files started as random notes during freefall.

**plan.** crystallize the mess into parallel tracks. not one plan. multiple plans running concurrently with identified dependencies. the critical part. plans rewrite themselves during execution. I planned a three-site launch as separate repos. midway through the build I realized it needed to be a Turborepo monorepo. same destination, restructured architecture. the plan's failure was the plan's input for the next version.

**build.** delegate with full context and get out of the way. context is the differentiator. before a single line gets written, skill files, voice playbooks, prior session outputs, and partner research all get loaded. I have 42 invokable skills. /playdraft takes a screenshot and produces LinkedIn and X drafts. /substackpost takes a topic and produces a newsletter. the build runs because the context was set up first.

**break.** stop mid-flow. question assumptions. redirect. break is the state most people skip and it prevents the most wasted work. when something feels off three hours into a build that should have taken one, that's break telling you the plan is stale. I've scrapped entire approaches during break and come back with something cleaner in half the time.

**ask.** interrogate the system. ask the AI about itself. ask the plan about the plan. when I built the /arc page on my site, I literally asked Claude to describe the methodology by examining its own skill files and session patterns. the page explains recursive drift by interrogating it.

**seed.** plant breadcrumbs for future loops. one-sentence asides dropped into current content that reference future work. they create pull. when the full piece ships later, the seeds make it feel inevitable instead of sudden.

## how do you manage concurrent Claude Code sessions?

someone asked how I manage memory and guardrails across 4 to 6 concurrent Claude Code sessions without them stepping on each other.

the answer evolved over the four weeks.

initially I had one context handoff file. each session would write its state and the next session would pick up. that broke immediately when I started running parallel sessions. session 3 would overwrite session 2's handoff.

so I built a parallel-safe handoff system. each session writes to a timestamped file in a handoff directory. `2026-03-08_143022_voice-system-refactor.md`. no shared file. no overwrites. when a new session starts, it reads all unconsumed handoffs, absorbs the context, and marks them done.

it sounds simple because it is. the best patterns usually are. but I wouldn't have found it without breaking the naive approach first.

the guardrails came from the same iterative process. lessons.md captures every mistake. CLAUDE.md sets the orchestration rules. skill files encode domain-specific context. by week four, new sessions start smarter than my week-one sessions ended because the accumulated context is already loaded.

## what actually compounds over time?

the 42nd skill file is easier to build than the 1st. not because I got better at writing skill files. because 41 skills worth of patterns, voice rules, and workflow templates already exist as context. the system gets denser without getting heavier.

same with content. the voice system started as a single file of preferences. now it's three tiers. core voice DNA, platform-specific playbooks, and operational rules. when I generate a LinkedIn post, it loads my voice, checks against 29 anti-slop patterns, validates substance requirements, and runs platform-specific formatting. the output sounds like me because the system studied what I sound like.

same with the sites. four websites sharing components through a monorepo. a change to the shared UI library updates all four. a new blog post builds to all sites that carry that content type. the infrastructure is mine, running on my machine, compounding with every commit.

## why open source the methodology?

the repo isn't polished. the method docs are direct from my working notes. the templates have rough edges.

I pushed it anyway because the people who'll get value from this are builders who are already deep in AI tooling and want patterns, not polish. solo operators or small teams trying to punch above their weight. former SDRs who learned the grind and now want to build the systems that replace it.

the methodology layer costs nothing. read six pages about the states and the recursive property. takes 20 minutes. might change how you think about building with AI.

the templates layer takes 5 minutes. copy CLAUDE.md into your project root, add tasks/todo.md and tasks/lessons.md, and you have orchestration rules and a self-improvement loop.

the deep end is building your own agent with personality, evolution tiers, and a self-reading feedback loop. that takes an afternoon and a Claude Code Max subscription.

everything runs on the CLI. no API keys required for the core. the same tool you code with is the tool that powers the agent.

## the principle

if a system can't describe itself, it isn't general enough.

this post was written using the method it describes. the voice system loaded my patterns. the skill file structured the workflow. the anti-slop rules caught the AI-generated garbage. the content about the system became part of the system.

the loop continues tomorrow.

## frequently asked questions

**what is recursive drift?**
recursive drift is a methodology for building with AI agents. it has six states: freefall, plan, build, break, ask, and seed. you move between them based on what the work needs, not a fixed sequence. the recursive property means the documentation about the method feeds back into the method itself. the system describes itself and improves from that description.

**how many concurrent Claude Code sessions can you run?**
I regularly run 4 to 6 on a single Mac Mini. the bottleneck isn't compute. it's context management. each session needs to know what the others are doing without overwriting shared state. the parallel-safe handoff system with timestamped files solves this.

**do you need a Mac Mini to build like this?**
no. any always-on machine works. the Mac Mini is convenient because it's $599, runs macOS natively, and draws minimal power. a Linux box, a cloud VM, or even a dedicated laptop would work. the point is having a machine that runs cron jobs and stays online.

**how long does it take to go from SDR to GTM engineer?**
there's no fixed timeline. I spent years as an SDR before the transition accelerated. the inflection point was learning to automate my own workflows. once you start building systems instead of executing tasks manually, the shift happens fast. with tools like Claude Code available now, the ramp is shorter than it was for me.

---

[Recursive Drift on GitHub](https://github.com/shawnla90/recursive-drift)

*related reading: [Claude Code 1M context window](https://shawnos.ai/blog/claude-code-1m-context-window) · [6 weeks of building with Claude Code](https://shawnos.ai/blog/6-weeks-of-building-with-claude-code)*
