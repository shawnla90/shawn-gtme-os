---
title: "I Open Sourced the Complete Playbook for Building a Website With Soul"
date: "2026-03-14"
excerpt: "32 chapters, a working starter template, and the full system for owning your content, your audience, and the algorithm. 90% free stack. The capstone of the trilogy."
category: "ships"
featured: true
---

**tl;dr:** I open sourced a 32-chapter playbook and working starter template for building a website that sounds like you, ranks in search, and feeds AI systems. 90% free stack. Clone it, run one command, deploy in 15 minutes. The full system that runs three production sites.

## the trilogy is complete

I pushed [website-with-soul](https://github.com/shawnla90/website-with-soul) to GitHub today. it's the third and final repo in a trilogy that started with methodology, moved to infrastructure, and ends with the product.

[recursive-drift](https://github.com/shawnla90/recursive-drift) was the operating system for thinking with AI. how to use Claude Code as a collaborator without losing your voice. six states, a self-reading feedback loop, zero API keys.

[context-handoff-engine](https://github.com/shawnla90/context-handoff-engine) was the plumbing. 6 layers of context infrastructure so Claude Code doesn't start every session from zero. parallel-safe handoffs, structured memory, self-improvement loops.

website-with-soul is where it all lands. everything in the first two repos exists to make this one work. build a real website that sounds like you, ranks in search, feeds AI systems, and compounds over time.

## what's in the website playbook?

two things.

**a working starter template.** clone it, run `npm install && npm run dev`, and you have a site in 15 minutes. dark terminal aesthetic, markdown blog, AI chat widget with keyword RAG, PostHog analytics with proxy pattern, sitemap with AI crawler allowlist, OG image generation, RSS feed, security headers. all on Next.js 15 with Tailwind v4.

**a 32-chapter playbook.** four phases covering the full arc from empty directory to content machine.

### phase 1: the build

11 chapters walking through every file in the starter template. setup, blog system, chat widget, analytics, sitemap, OG images, RSS, security headers, performance, deploy, Claude Code setup.

### phase 2: giving it soul

voice DNA, anti-slop patterns, content filing, blog workflow, multi-platform distribution, SEO pipeline. this is the part most people skip and it's the part that matters most.

### phase 3: growing organically

distribution matrix, Reddit strategy (with the GEO thesis on AI-indexed content), LinkedIn builder voice, X thread format. no paid ads. your website is the hub, social platforms are distribution channels.

### phase 4: scaling

monorepo upgrade, autonomous blog pipeline, cron automation, Claude Code agent systems, Cloudflare Pages migration.

## what does the stack cost?

| tool | cost |
|------|------|
| Next.js 15 | free |
| Tailwind CSS v4 | free |
| Vercel | free |
| Cloudflare | ~$10/year (domain only) |
| PostHog | free |
| Claude Code | ~$200/month |

$10/year for a domain. everything else is either free or optional. the Claude Code subscription is the only real cost and you're probably already paying for it.

## what do people get wrong about building websites?

everyone says "build in public." almost nobody talks about owning the infrastructure.

you can post on LinkedIn every day for a year and build a real audience. LinkedIn changes the algorithm. your reach drops 60% overnight. you built on rented land.

the website is the thing you own. every blog post compounds. every page gets indexed. every AI crawler (GPTBot, ClaudeBot, PerplexityBot) consumes your content and starts referencing you as a source. that's the GEO thesis from the playbook. you're not just optimizing for Google anymore. you're optimizing for the AI systems that are replacing Google.

the social platforms are distribution channels. they drive traffic back to the thing you own. the website.

## why build this in the open?

three sites run on this exact stack. [shawnos.ai](https://shawnos.ai), [thegtmos.ai](https://thegtmos.ai), [thecontentos.ai](https://thecontentos.ai). same codebase, same playbook, same voice system. the starter template is extracted directly from production code.

I could have kept this proprietary. made it a paid course or a SaaS product. but the whole thesis of recursive-drift is that the methodology improves by being shared. the more people who use it and push back on it, the better it gets.

so it's MIT licensed. use it however you want.

## how do you get started?

three paths depending on how deep you want to go.

**15 minutes.** clone the starter, customize the content, deploy to Vercel. you have a website.

**1 hour.** follow the Phase 1 playbook. you understand every file and have it live with a custom domain.

**1 day.** work through all 4 phases. by the end you have a content machine with a voice system, distribution pipeline, and SEO strategy.

the repo is at [github.com/shawnla90/website-with-soul](https://github.com/shawnla90/website-with-soul).

## the builder challenge

I'm trying something new. if you've been thinking about building your own site and you're somewhere on the Claude Code progression... I'll guide you through it.

the playbook has 32 chapters. the starter template gets you deployed in 15 minutes. but building alone is slower than building with someone who already shipped three sites on this stack.

so here's the offer. clone the repo, build your site with Claude Code, and reach out when you get stuck. I'll help you debug the weird parts, review architecture choices, and get it live. once it's deployed, I'll link to it from shawnos.ai and share it across my platforms.

then we do the same for the next builder. and the next.

a backlinking network of builder sites. not a link exchange. a community of people who built something real and promote each other's work because they've seen each other's code.

the first few sites in the network get the most direct support from me and the most visibility. early builders help shape what the network becomes.

[r/GTMBuilders](https://reddit.com/r/GTMBuilders) is where the building happens. 120 people doing collaborative, honest work. small enough that everyone actually ships. the energy is different because talking about building and actually building are not the same thing, and this group does the second one.

I don't know how this scales. that's the honest answer. but I know the first version of anything only gets built by the people willing to start before it's figured out.

if you want in, fork the repo. build the site. post in r/GTMBuilders when you're live. I'll find you.

## frequently asked questions

**what is a website with soul?**
a website that sounds like the person who built it. not a template with generic copy. a site with a voice system, anti-slop filters, and content that compounds over time. the soul comes from codified voice DNA and a methodology for writing that preserves your actual voice through AI assistance.

**how much does it cost to host a website on Vercel?**
free for most personal and small business sites. Vercel's hobby tier covers static sites and serverless functions with generous limits. the only required cost is a domain name at ~$10/year. everything else in the stack (Next.js, Tailwind, PostHog) is free tier.

**what's in the 32-chapter playbook?**
four phases. phase 1 covers the build (11 chapters on every file in the starter template). phase 2 covers voice and soul (voice DNA, anti-slop, content workflow). phase 3 covers organic growth (Reddit, LinkedIn, X distribution). phase 4 covers scaling (monorepo, cron automation, agent systems).

**do you need to know how to code?**
you need to be willing to learn. the playbook walks through every file, and Claude Code handles most of the implementation. but understanding what the code does matters more than writing it from scratch. the builder challenge exists specifically to help people who are learning.

## keep reading

- [the real cost of a slow website](https://shawnos.ai/blog/slow-website-cost)
- [the anti lead magnet: build your own OS](https://shawnos.ai/blog/build-your-own-os)
- [Reddit is king: the GEO thesis](https://shawnos.ai/blog/reddit-is-king)

no gatekeeping. the whole thing is in there.
