---
title: "Why I Stopped Paying for API Calls and Built My Own AI Chat"
date: "2026-02-22"
excerpt: "I was spending hundreds per month on API calls to chat with my AI agent. Then I realized I was already paying for unlimited access. Here's the CLI-to-chat bridge pattern that changed everything."
---

## the two-system problem

two weeks ago I started building ShawnOS. the repo. a monorepo with three Next.js sites, agent skills, content pipelines, RPG progression. the operating system for running a one-person GTM engine.

a week ago I stood up Nio on OpenClaw. OpenClaw is GPT-based. the idea was a separate chat system for my AI agent. Nio would run cron jobs, write blog posts, manage content pipelines, update dashboards. real infrastructure, not a toy.

and it worked. but the API costs added up fast. Sonnet for daily ops. Opus for anything that needed real thinking. $50 to $200 per month depending on how much I was building. and I was always building.

I routed high-frequency crons to a local Ollama model (Qwen 2.5 14B). free, fast, good enough for commit tracking and status updates. but for anything that required actual intelligence... you need Claude.

then the real insight hit.

## the repo is the magic

I was running two separate systems. OpenClaw for chat. the repo for everything else. but the models I actually depend on — Opus and Sonnet — they already speak with my repo. they amplify my voice and DNA in a way GPT can't. they read my soul files, my commit history, my content pipeline. they don't just respond. they compound.

in another world, OpenClaw would have been built on Anthropic instead of GPT. but it wasn't. and that gap made the answer obvious: you don't need two separate systems. the repo IS the system.

Claude Code Max. $200/month flat. unlimited CLI access via `claude -p`. I was already paying for it. using it every day to build the repo. never occurred to me that the same CLI that powers my coding workflow could power a chat interface.

`claude -p` lets you send a prompt, get a response, stream JSON output, and resume sessions. all from the terminal. all included in the subscription. no API key. no per-token billing. no usage caps.

the recursive nature of it is what makes it work. Claude builds the system that Claude powers. the model that writes the code is the model that runs inside it. that's not a cost optimization. that's a flywheel.

## the build

Next.js app. one API route. spawn `claude -p` as a child process. pipe the JSON stream back to the browser as server-sent events.

that's it. that's the entire backend.

the client is an iMessage-style PWA. dark theme, monospace font, typing indicators. send a message, get a streaming response. session IDs persist across conversations so Nio remembers context.

Cloudflare Tunnel pointed at my Mac Mini. now I text my AI from my phone. anywhere. zero API costs. zero infrastructure costs beyond the tunnel (free tier).

total time from idea to working PWA... one afternoon.

## the soul file pattern

here's where it gets interesting from an architecture perspective. Claude CLI has a flag called `--append-system-prompt-file`. point it at a markdown file and that file becomes part of the system prompt.

I wrote `nio-soul.md`. defines Nio's personality, capabilities, anti-slop rules, decision-making framework. everything that makes Nio... Nio. not a chatbot. infrastructure with opinions.

which means adding a new agent is just writing a new markdown file.

## multi-agent expansion

one CLI. different soul files. different personalities. separate sessions.

that's what ShawnOS Chat became. a multi-agent platform where each agent has its own personality file, accent color, bubble colors, and isolated session state. switch between agents in the UI. each one picks up where they left off.

Nio handles ops and infrastructure. an Architect agent handles system design. a Writer agent handles content in my voice. same Claude CLI underneath. same zero marginal cost.

the per-agent state lives in localStorage on the client and file-based memory on the server. each agent gets their own MEMORY.md, their own heartbeat file, their own daily snapshots. lightweight, portable, no database needed.

## the IP isn't the code

anyone can spawn a CLI process. the pattern is what matters.

CLI-as-backend for personal AI infrastructure. session isolation per agent. soul files for personality injection. file-based memory systems. zero-marginal-cost architecture that scales with your subscription, not your usage.

this is the kind of thing that used to require a custom API integration, a database, authentication middleware, and a monthly cloud bill. now it requires a markdown file and a Next.js route.

## what this means for builders

if you're paying per-token for personal AI tooling and you have a Claude Code Max subscription... you're leaving money on the table.

the CLI is the API. your subscription is the infrastructure budget. everything else is just plumbing.

but more than that — if you're running your AI on a platform that doesn't speak with your codebase, you're building two systems when you only need one. the model that builds your infrastructure should be the model that powers it. that's not a shortcut. that's the architecture.

this is part of ShawnOS. the operating system I'm building in public for running a one-person GTM engine. started building the repo two weeks ago. already compounding.

build yours.
