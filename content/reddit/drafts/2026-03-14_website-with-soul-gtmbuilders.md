---
platform: reddit
subreddit: r/GTMBuilders
type: post
angle: builder-operations
status: draft
date: 2026-03-14
source: content/website/final/website-with-soul-open-source.md
---

**Title: built 3 websites using a 90% free stack. open sourced the complete playbook.**

I've been running 3 sites (personal brand, GTM ops knowledge base, content ops) on the same stack for months. the total cost is about $10/year plus a Claude Code subscription I was already paying for.

finally extracted the whole system into something anyone can use. two parts:

**a working starter template** - clone it, `npm install`, `npm run dev`, you have a dark-themed site with a markdown blog, AI chat widget, PostHog analytics, and SEO fundamentals in about 15 minutes.

**a 32-chapter playbook** split into 4 phases:

1. **build** (11 chapters) - Next.js 15, Tailwind, App Router, chat widget with keyword RAG (no vector DB needed), PostHog proxy pattern, sitemap with AI crawler allowlist, OG images, RSS, security headers, Vercel deploy

2. **content** (8 chapters) - voice DNA files, anti-AI-slop pattern detection, content filing system, blog workflow, multi-platform distribution from a single source, SEO pipeline

3. **promote** (7 chapters) - distribution matrix, Reddit strategy (including the GEO thesis on AI-indexed content), LinkedIn builder voice, X thread format. no paid ads, your site is the hub

4. **scale** (6 chapters) - monorepo upgrade, autonomous blog pipeline with Claude CLI, cron automation, agent systems, Cloudflare Pages migration

the stack:
- Next.js 15 (free)
- Tailwind CSS v4 (free)
- Vercel hobby tier (free)
- PostHog (free)
- Cloudflare domain (~$10/yr)
- Claude Code (~$200/mo, optional but worth it)

this is the third repo in a trilogy. recursive-drift (the methodology for building with AI) and context-handoff-engine (multi-session continuity for Claude Code) are the first two. website-with-soul is where they converge into something practical.

the templates directory has fill-in-the-blank files for voice DNA, anti-slop detection, CLAUDE.md at three levels of complexity, blog post templates, SEO briefs, and content distribution checklists.

MIT licensed. repo: https://github.com/shawnla90/website-with-soul

happy to answer questions about any part of the system.
