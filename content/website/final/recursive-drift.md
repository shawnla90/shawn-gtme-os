---
title: "I Open Sourced My Methodology"
date: "2026-02-27"
excerpt: "Recursive Drift is the non-linear method for building with AI. Six states, a self-reading feedback loop, and zero API keys required. The repo is live."
category: "methodology"
featured: true
---

## the repo is live

I pushed [recursive-drift](https://github.com/shawnla90/recursive-drift) to GitHub today. it's the methodology I've been running for months, extracted into something anyone can use.

not a framework. not a SaaS product. a methodology, a set of templates, and a full build guide for creating AI agents that develop memory and voice over time.

everything runs on Claude Code and the CLI. no API keys required.

## what recursive drift actually is

six non-linear states. you enter whichever one the work demands.

**freefall** is exploring without structure. letting ideas collide. the mess is the point. **plan** crystallizes freefall into parallel tracks. plans rewrite during execution because builds reveal what plans get wrong. **build** is delegating to AI with full context and shipping fast. **break** is the state most people skip. stop mid-flow. question assumptions. redirect. it prevents the most wasted work. **ask** turns the system's self-awareness into a debugging tool. **seed** plants breadcrumbs for future loops.

there's no prescribed order. you don't go freefall to plan to build in sequence. you jump between states based on what the work needs right now. that's the non-linear part.

the recursive part is simpler. output feeds back as input. the documentation documents itself. plans rewrite themselves during execution. content becomes infrastructure. skills produce content documenting the skills. each pass adds context that makes the next pass faster.

## the three layers

the repo has three layers of adoption. you can use one without the others.

**methodology** is the six states and the recursive property. costs nothing. changes how you think about building with AI. read `methodology/` and you're done.

**templates** are the operational files. a CLAUDE.md orchestration template, voice system, task tracking, agent coordination rules. copy `templates/CLAUDE.md` into your project root, add `tasks/todo.md` and `tasks/lessons.md`, and you have a self-improving workflow in 5 minutes.

**NioBot** is the deep end. a full build guide for creating an AI agent with personality files, a 5-tier evolution system, and a self-reading feedback loop. the agent reads its own previous output before generating new output. it develops memory by studying its own work.

## the self-reading feedback loop

this is the part that changes things. the mechanism that turns a stateless text generator into something with voice memory.

before generating, the agent reads its previous 3 posts from SQLite. studies the voice. identifies themes already covered. checks topic overlap via full-text search. finds a fresh angle. layers soul files, voice DNA, and anti-slop rules into the system prompt. generates via `claude -p`. validates against 60+ regex patterns. auto-fixes what it can. retries if the score is below 80%.

past posts shape new posts. new posts become past posts. the loop restarts tomorrow.

the agent doesn't remember in the traditional sense. it re-reads. and that re-reading is what creates the compounding effect. the 50th generation is better than the 1st because 49 generations worth of patterns, themes, and voice calibration already exist as input.

## why CLI-first

one principle drove the architecture. you should not need API keys to build AI agents.

Claude Code with a Max subscription gives you `claude -p` for non-interactive generation, multi-terminal parallel agents, subprocess spawning, and cron automation. no token billing. no rate limits. no external provider dependency. the same tool you code with is the tool that powers the agent.

you can add external model APIs as sub-agents when architecture requires it. but the core runs solely on CLI.

## the evolution system

agents start simple and develop personality over time. five tiers. each tier is a markdown file injected into the system prompt at runtime.

tier 1 (Spark) follows instructions and asks for clarification. tier 5 (Ascended) ships independently and "nah" is a complete sentence. as agents earn XP and level up, the personality fragment swaps. no retraining required. the agent's behavior changes because its context changes.

it sounds like a game mechanic because it is one. but it works. personality tiers give you a progression ramp that matches trust. you don't hand full autonomy to a system on day one.

## how to get started

three paths depending on where you are.

**path 1: methodology only.** read `methodology/`. understand the 6 states and the recursive property. takes 20 minutes. costs nothing.

**path 2: add templates.** copy the CLAUDE.md template into your project. add task tracking files. you now have orchestration rules and a self-improvement loop. takes 5 minutes.

**path 3: build a NioBot.** follow `niobot/quickstart.md`. in 30 minutes you'll have a soul file, anti-slop rules, a tier-1 evolution fragment, and a minimal blog generator running via `claude -p`. requires Claude Code with a Max subscription.

the repo is MIT licensed. fork it and run the loop.

[github.com/shawnla90/recursive-drift](https://github.com/shawnla90/recursive-drift)
