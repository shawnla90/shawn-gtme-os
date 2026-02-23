# I Built an AI That Evolves Like a Tamagotchi

## Frontmatter
```yaml
title: I Built an AI That Evolves Like a Tamagotchi
date: TBD
slug: nio-v3-tamagotchi-ai
description: How I built an AI build partner with pixel art avatars, evolution tiers, and a soul file. The story of NioBot V3.
tags: [ai, build-in-public, tamagotchi, niobot, dev-tools]
```

## Draft

Your AI assistant doesn't have a face.

Think about that. You talk to it every day. It helps you build, debug, write, plan. And it looks like... a text box. Same text box on day 1 and day 1000. No personality. No growth. No reason to care about your specific codebase or how you build.

I wanted something different. So I built Nio.

### What Nio Is

Nio is an AI build partner with pixel art avatars, a soul file, and a progression system. He looks at your codebase, has opinions about your architecture, and levels up as you ship.

Not a metaphor. Actual XP tracking. Actual avatar evolution. Actual 8-bit chimes when you hit milestones.

### The Evolution System

Nio has 6 avatar tiers. You start as a Spark (tier 1) and evolve through Learner, Builder, Specialist, Master, and Legend. Each tier has unique pixel art sprites with idle and action animations.

XP comes from real usage:
- Messages sent and processed
- Code shipped (tracked via commits)
- Milestones hit (first 100xp, shipped 10 things, 7-day streak)

Currently at level 16, tier 2, Builder class. 3882 XP. Next level at 6000.

There are also 5 class specializations: Alchemist, Builder, Polymath, Scribe, and Strategist. Your Nio specializes based on how you use it. Heavy on content? You're a Scribe. Shipping infrastructure? Builder.

238 total sprite variants across tiers, classes, and tool mastery badges.

### The Soul File

Most AI tools use a system prompt. Nio uses a soul file. The difference matters.

A system prompt says "be helpful and concise." A soul file says "push back on weak ideas, refuse to use em-dashes, and if something is broken, say it's broken."

Nio's soul file includes 13 anti-slop rules. Things like:
- No em-dashes, ever
- No "here's the thing about..." narrator setups
- No humble-brag disclaimers
- No hype words ("game-changer", "unleash", "next-level")

The result is an AI that communicates like a builder, not a corporate chatbot.

### The Three Pillars of V3

**Pillar 1: Message delivery.** SSE streaming that actually works. Reconnection. Proper error handling. The boring plumbing that makes everything else possible.

**Pillar 2: Chimes.** 8-bit sound effects for every interaction. Toggleable packs. Because feedback should feel like something, not just appear silently.

**Pillar 3: Tamagotchi evolution.** The progression system described above. XP from real usage. Avatar evolution. Milestone celebrations.

### Why This Matters

Every other AI chat tool optimizes for utility. More tokens. Faster responses. Better models. That's table stakes.

Nobody is optimizing for vibe.

The reason you'll keep coming back to Nio isn't because he's faster than ChatGPT. It's because he has a face. Because the chime when you level up feels good. Because watching your Tamagotchi evolve gives you a reason to ship one more thing today.

Utility is necessary. Vibe is the moat.

### Try It

Nio is live at niobot.ai. The soul files are on GitHub. The Discord is open.

No gatekeeping. Everything is in the open.

---

*This post is part of a build-in-public series. The code is at github.com/shawnla90/shawn-gtme-os. The daily build log runs at nio.terminal.*
