---
title: "I Open Sourced the Complete Playbook for Building a Website With Soul"
date: "2026-03-14"
excerpt: "32 chapters, a working starter template, and the full system for owning your content, your audience, and the algorithm. 90% free stack. The capstone of the trilogy."
category: "ships"
featured: true
---

## the trilogy is complete

I pushed [website-with-soul](https://github.com/shawnla90/website-with-soul) to GitHub today. it's the third and final repo in a trilogy that started with methodology, moved to infrastructure, and ends with the product.

[recursive-drift](https://github.com/shawnla90/recursive-drift) was the operating system for thinking with AI. how to use Claude Code as a collaborator without losing your voice. six states, a self-reading feedback loop, zero API keys.

[context-handoff-engine](https://github.com/shawnla90/context-handoff-engine) was the plumbing. 6 layers of context infrastructure so Claude Code doesn't start every session from zero. parallel-safe handoffs, structured memory, self-improvement loops.

website-with-soul is where it all lands. everything in the first two repos exists to make this one work. build a real website that sounds like you, ranks in search, feeds AI systems, and compounds over time.

## what's in it

two things.

**a working starter template.** clone it, run `npm install && npm run dev`, and you have a site in 15 minutes. dark terminal aesthetic, markdown blog, AI chat widget with keyword RAG, PostHog analytics with proxy pattern, sitemap with AI crawler allowlist, OG image generation, RSS feed, security headers. all on Next.js 15 with Tailwind v4.

**a 32-chapter playbook.** four phases covering the full arc from empty directory to content machine.

phase 1 is the build. 11 chapters walking through every file in the starter template. setup, blog system, chat widget, analytics, sitemap, OG images, RSS, security headers, performance, deploy, Claude Code setup.

phase 2 is giving it soul. voice DNA, anti-slop patterns, content filing, blog workflow, multi-platform distribution, SEO pipeline. this is the part most people skip and it's the part that matters most.

phase 3 is growing organically. distribution matrix, Reddit strategy (with the GEO thesis on AI-indexed content), LinkedIn builder voice, X thread format. no paid ads. your website is the hub, social platforms are distribution channels.

phase 4 is scaling. monorepo upgrade, autonomous blog pipeline, cron automation, Claude Code agent systems, Cloudflare Pages migration.

## the stack costs almost nothing

| tool | cost |
|------|------|
| Next.js 15 | free |
| Tailwind CSS v4 | free |
| Vercel | free |
| Cloudflare | ~$10/year (domain only) |
| PostHog | free |
| Claude Code | ~$200/month |

$10/year for a domain. everything else is either free or optional. the Claude Code subscription is the only real cost and you're probably already paying for it.

## the part people get wrong

everyone says "build in public." almost nobody talks about owning the infrastructure.

you can post on LinkedIn every day for a year and build a real audience. LinkedIn changes the algorithm. your reach drops 60% overnight. you built on rented land.

the website is the thing you own. every blog post compounds. every page gets indexed. every AI crawler (GPTBot, ClaudeBot, PerplexityBot) consumes your content and starts referencing you as a source. that's the GEO thesis from the playbook. you're not just optimizing for Google anymore. you're optimizing for the AI systems that are replacing Google.

the social platforms are distribution channels. they drive traffic back to the thing you own. the website.

## why I built this in the open

three sites run on this exact stack. [shawnos.ai](https://shawnos.ai), [thegtmos.ai](https://thegtmos.ai), [thecontentos.ai](https://thecontentos.ai). same codebase, same playbook, same voice system. the starter template is extracted directly from production code.

I could have kept this proprietary. made it a paid course or a SaaS product. but the whole thesis of recursive-drift is that the methodology improves by being shared. the more people who use it and push back on it, the better it gets.

so it's MIT licensed. use it however you want.

## getting started

three paths depending on how deep you want to go.

**15 minutes.** clone the starter, customize the content, deploy to Vercel. you have a website.

**1 hour.** follow the Phase 1 playbook. you understand every file and have it live with a custom domain.

**1 day.** work through all 4 phases. by the end you have a content machine with a voice system, distribution pipeline, and SEO strategy.

the repo is at [github.com/shawnla90/website-with-soul](https://github.com/shawnla90/website-with-soul).

no gatekeeping. the whole thing is in there.
