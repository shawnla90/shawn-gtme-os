---
title: "I Rebuilt My Open-Source Website Playbook Three Months Later"
date: "2026-06-26"
excerpt: "website-with-soul shipped in March. Then I spent three months building a product, and it changed what the website is for. The core thesis is unchanged; the proof behind it is new. The 2026 refresh: Next 16, controlled content cohorts, organic engagement over backlinks, and a local repo plus database as the context engine."
category: "ships"
featured: true
---

**tl;dr:** I open sourced [website-with-soul](https://github.com/shawnla90/website-with-soul) in March. Then I spent three months building Clearbox, a GTM product, and barely touched the repo. That gap taught me the real lesson: a website with soul is the owned surface your GTM system runs on, and the blog is one tile on it. The v1.1.0 refresh updates the starter to Next.js 16, swaps the `middleware.ts` convention for `proxy.ts`, and rewrites the playbook's posture: fewer better pages over volume, organic engagement over backlinks, and a local repo plus database as the context engine. The core thesis is unchanged. The proof behind it is new.

## the repo sat still while the work moved

I shipped website-with-soul on March 14. 32 chapters, a working starter, the capstone of a three-repo trilogy. Then I went heads-down on Clearbox and the repo froze on its launch commit for three months.

A repo with soul that sits frozen is a trust problem. If the whole pitch is that your site compounds and stays alive, the playbook that teaches it cannot read like a museum plaque. So this is the refresh. The thesis underneath it did not move: own the site, own the content, own the voice, own the distribution loop, keep all of it in version control.

What moved is what I now know the website is actually for.

## a website with soul is a GTM operating surface

In March I described this as building a blog that sounds like you. That was too small.

Building Clearbox, the site stopped being a place to publish and became the place where a real GTM system lives. Visits, signups, click paths, campaign context, and product learning all land on the same owned surface. A blog is one tile on it. So is the pricing page, the demo, the analytics, the campaign attribution, the docs the AI crawlers read. When all of that sits in one repo you control, you can ask it questions and ship against the answers. When it is scattered across rented tools, you can only rent the answers back.

## fewer, better pages beat volume

The old SEO posture was publish more. Brief a keyword, generate a post, repeat. It produces a pile of near-duplicate pages nobody reads and an AI can't tell apart.

The refresh runs content cohorts instead. A cohort is a small set of pages that answer one buyer's question, link to each other, and get measured together. Six sharp pages you actually watch beat sixty you forget. Each piece has to carry all six of these or it does not ship:

- one reader problem
- one real workflow
- one proof artifact or screenshot
- one internal link
- one distribution path
- one measurement target

If a page can't name its measurement target, it is decoration. Cut it.

## organic engagement, not backlinks

I used to think about backlinks. Now I think about conversations.

Use AI to find where your buyers are already talking, then show up like a human with taste. A real reply in a Reddit thread does more than a link swap, because the reply is the proof and the link is just the address. Comments and replies are a distribution layer, not an afterthought you bolt on after publishing. The playbook's promote phase now leads with that.

This is the GEO thesis from the original playbook, grown up. You are not optimizing for ten blue links. You are optimizing for the systems that read the whole conversation and decide who to cite.

## local repo plus database is the context engine

This changed how I build day to day. The context engine is a local repo and a database the agent queries. Clearbox state, content state, campaign state, all of it lives in SQLite I can read from the terminal. When I want an agent to do something, it queries the source of truth instead of re-reading a 200K-token context window that goes stale the moment I close the tab.

Cheap iteration beats renting every loop from a hosted tool. Run it locally, commit the result, move on. The terminal plus a database plus version control is a better operating system for an AI builder than any chat box, because the state survives the session.

## directing the design beats asking for it

Asking Claude to make it beautiful gets you slop. The agent has no taste to draw on cold. So I stopped asking it to design and started directing it. Spend the time inside real references first, shadcn/ui, Recharts, component galleries, repo demos you actually like, then point the agent at the specific patterns. Give it the thing to match. Directing the agent at a concrete pattern produces work you would ship. Asking it to invent taste produces work you delete.

The design direction itself got calmer in the process. Fewer cursor effects, fewer ornamental animations, more direct proof and quiet scanning. Soul is not the same as decoration.

## what the refresh actually changes

For anyone already running the starter, v1.1.0 changes this:

- starter upgraded to **Next.js 16** (React 19.2, Tailwind v4.3, Anthropic SDK 0.106, posthog-js 1.395)
- `middleware.ts` migrated to `proxy.ts` per the Next 16 file-convention rename, security headers unchanged
- README and playbook reframed around cohorts, organic engagement, local context engineering, and version control as the moat
- a content-cohort model and a directing-the-design note added to the playbook

The starter still clones and runs in 15 minutes. The build is still clean. The stack is still 90% free.

## version control is the moat

The reason any of this is safe to try: it is all in git.

Ship a redesign, measure it, and if it misses, revert and keep your voice intact. Own the surface and you get to experiment without betting the brand on every change. That is the quiet superpower the trilogy was always pointing at, and it is the one that held up over three months of building something else.

## frequently asked questions

**what is a GTM operating surface?**
the owned website where your go-to-market system actually runs, beyond just publishing. visits, signups, click paths, campaign attribution, product analytics, and the content AI crawlers read all live in one repo you control, so you can query it and ship against it instead of renting the answers from scattered tools.

**why upgrade the starter to Next.js 16?**
to keep the open-source playbook current and trustworthy. v1.1.0 moves the starter to Next 16, which renames the `middleware.ts` file convention to `proxy.ts`. the security headers and behavior are unchanged, the build stays clean, and the playbook chapters now teach the current convention.

**what is a content cohort?**
a small set of pages that answer one buyer's question, link to each other, and get measured together. instead of publishing high volume, you ship six sharp pages you watch closely. each page names one reader problem, one workflow, one proof artifact, one internal link, one distribution path, and one measurement target.

**do backlinks still matter?**
they are secondary now. organic engagement, real Reddit and community participation, and AI-indexed conversations move more than link swaps. use AI to find the conversations, then show up like a human. the reply is the proof.

**how do I keep my own repo from going stale?**
treat it as a living surface, not a launch. keep the state in a local repo plus database the agent can query, commit your iterations, and let version control make experiments safe. if a redesign misses, revert.

## keep reading

- [I open sourced the complete playbook for building a website with soul](https://shawnos.ai/blog/website-with-soul-open-source)
- [Reddit is king: the GEO thesis](https://shawnos.ai/blog/reddit-is-king)
- [the anti lead magnet: build your own OS](https://shawnos.ai/blog/build-your-own-os)

the refresh is live in the repo. no gatekeeping, the whole thing is in there.

shawn ⚡ GTM Engineer
