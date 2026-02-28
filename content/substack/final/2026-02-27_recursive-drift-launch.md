# I Open Sourced My Methodology

> **Platform**: Substack
> **Series**: OS.AI Labs
> **Structure**: Personal POV Essay
> **Date**: 2026-02-27
> **Status**: final
> **Source**: original
> **Visual**: repo tree screenshot or README header

**Subject line options:**
- "I open sourced my methodology"
- "recursive drift is live on GitHub"
- "the system that builds itself is now yours"

**Preview text:** the non-linear method for building with AI, extracted into a repo anyone can fork

---

I've been running a methodology for months that I never named publicly until now.

it's called Recursive Drift. six non-linear states for building with AI, a self-reading feedback loop where agents develop memory by studying their own output, and a progression system where agents earn personality over time. zero API keys required to run any of it.

today I pushed it to GitHub. [github.com/shawnla90/recursive-drift](https://github.com/shawnla90/recursive-drift)

## what it actually is

the shortest version. output feeds back as input. the system gets denser over time without getting heavier.

the longer version. I built an AI agent that writes blog posts every morning. before generating, it reads its own previous posts from a SQLite database. studies the voice. checks which themes it already covered. finds a fresh angle. layers personality files and anti-slop rules into the prompt. generates via `claude -p` on the CLI. validates against 60+ patterns. auto-fixes what it can. retries if the quality score drops below 80%.

past posts shape new posts. new posts become past posts. the loop restarts tomorrow.

the agent doesn't remember in the traditional sense. it re-reads. and that re-reading creates compounding. the 50th generation is more calibrated than the 1st because 49 generations of voice data already exist as context.

## why I'm releasing it

I kept getting the same question. how do you set up the voice system. how does the agent improve over time. how does the self-reading loop work.

answering in DMs doesn't scale. a repo does.

the repo has three layers. methodology (the thinking model). templates (the operational files you drop into any project). NioBot (the full build guide for creating an agent with personality and memory).

you can adopt one layer without the others. read the methodology and change how you think. copy the templates and get orchestration rules in 5 minutes. follow the NioBot quickstart and have a working agent in 30 minutes.

## CLI-first, no API keys

everything runs on Claude Code and the CLI. `claude -p` with a Max subscription. no API keys. no per-token billing. no external dependencies.

the same tool you write code with powers the agent. the model that builds the system is the model that runs inside it. that recursion is the whole point.

## what this means for you

if you've been building with AI and feeling like prompt engineering isn't enough. if you want a progression system that matches trust to autonomy.

fork the repo. run the loop. the system gets denser when more people use it.

[github.com/shawnla90/recursive-drift](https://github.com/shawnla90/recursive-drift)

shawn ⚡ the gtme alchemist 🧙‍♂️

---

if this resonated, forward it to someone building with AI who's tired of starting from scratch every session. or reply and tell me what you'd build first. I read every reply.

no gatekeeping. the full methodology, templates, and build guide are in the repo. MIT licensed.
