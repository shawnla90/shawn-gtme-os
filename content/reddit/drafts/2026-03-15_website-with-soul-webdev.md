---
platform: reddit
subreddit: r/webdev or r/SideProject
type: post + 2 comments
angle: $10/year website stack, 32-chapter playbook, rented land thesis
status: draft
date: 2026-03-15
source: content/website/final/website-with-soul-open-source.md
---

**Title: I built 3 personal sites on a stack that costs $10/year. open sourced the full playbook (32 chapters).**

six weeks ago I started building personal sites with Claude Code. shipped 3 of them on the same stack. the total hosting cost across all three is about $30/year... just domains.

the stack:

| tool | cost |
|------|------|
| Next.js 15 | free |
| Tailwind CSS v4 | free |
| Vercel hosting | free tier |
| Cloudflare | ~$10/year (domain only) |
| PostHog analytics | free tier |

I extracted everything I learned into a repo with a 32-chapter playbook and a working starter template. clone it, run `npm install && npm run dev`, and you have a site in 15 minutes. dark terminal aesthetic, markdown blog, AI chat widget with keyword RAG, PostHog with proxy pattern, sitemap with AI crawler allowlist, OG image generation, RSS feed, security headers.

the playbook covers 4 phases:

**phase 1 (build):** 11 chapters walking through every file. setup, blog system, chat widget, analytics, sitemap, OG images, RSS, security headers, performance, deploy, Claude Code config.

**phase 2 (soul):** voice DNA, anti-slop patterns (29 AI-detection rules for keeping content from sounding like ChatGPT), content workflow, multi-platform distribution, SEO pipeline. this is the part most people skip and the part that matters most for differentiation.

**phase 3 (grow):** distribution matrix, Reddit strategy, LinkedIn, X. no paid ads. the website is the hub, social platforms are distribution channels that drive traffic back.

**phase 4 (scale):** monorepo upgrade, autonomous blog pipeline, cron automation, agent systems.

the biggest lesson from running 3 sites: every post on LinkedIn or X has a half-life measured in hours. every blog post has a half-life measured in months. and now AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are indexing personal sites and surfacing that content as sources. you're not just optimizing for Google anymore.

the playbook calls this the "rented land thesis." LinkedIn changes the algorithm and your reach drops 60% overnight. you built on rented land. the website is the thing you own.

repo: [github.com/shawnla90/website-with-soul](https://github.com/shawnla90/website-with-soul)

MIT licensed. no email gate, no course upsell, no waitlist. the whole thing is in the repo.

---

**Comment 1 (technical depth):**

some of the technical choices and why:

**Next.js 15** over Astro or Hugo: the app router + server components model means the AI chat widget runs server-side without shipping a React runtime to the client for static pages. markdown blog posts are just .md files in a folder. no CMS, no database.

**Tailwind v4** over v3: the CSS-first config means no tailwind.config.js file. everything lives in globals.css. cleaner project root.

**PostHog proxy pattern**: analytics requests go through your own domain via a Next.js rewrite rule. ad blockers don't catch it because the request never hits a third-party domain. you get real traffic numbers, not the 30-40% undercounted version.

**AI crawler allowlist**: the sitemap and robots.txt explicitly allow GPTBot, ClaudeBot, PerplexityBot, and other AI crawlers. most sites block them by default. allowing them means your content gets indexed by AI systems and surfaced when people ask questions in ChatGPT, Claude, Perplexity. that's the GEO (Generative Engine Optimization) play.

**security headers**: strict CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy. all configured in next.config.js. takes 5 minutes and most personal sites skip it entirely.

**Comment 2 (builder challenge + backlinking):**

if anyone builds a site with this, I'm running a builder challenge. build it, get it live, post about it. I'll link to your site from mine and promote it. the idea is a backlinking network of builder sites, each one vouching for the others.

r/GTMBuilders is the community where this is happening. 120 people, mostly developers and solo builders. small enough that everyone actually ships.

the first few sites in the network get the most visibility and direct support. if you've been meaning to build a personal site and kept putting it off... this is the push.
