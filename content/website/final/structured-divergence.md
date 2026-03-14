---
title: "Structured Divergence: Why ADHD Brains Were Built for Claude Code"
date: "2026-03-14"
excerpt: "The file system is the medication. CLAUDE.md, handoffs, lessons.md - they hold the context your working memory can't. And everyone who finds this builds the same things."
category: "ships"
featured: true
---

## the observation I wasn't expecting

six weeks without Vyvanse. I stopped refilling the prescription around the time I started building heavily with Claude Code. not on purpose. just forgot to call the pharmacy, then forgot again, then realized I hadn't noticed.

that's the weird part. I noticed.

I've been on stimulant medication for ADHD since 2019. Vyvanse specifically. the function is straightforward - it extends working memory. you can hold more context in your head simultaneously. the meeting you had at 10am still has texture at 3pm. the architectural decision from Tuesday doesn't evaporate by Thursday.

without it, my working memory runs about 3-4 items deep before things start falling off the stack. tasks blur. context from yesterday feels like context from last month. I compensate with lists, notes, alarms, structured environments.

and that compensation pattern... is exactly what Claude Code's file system does.

## what working memory actually does

working memory isn't intelligence. it's the buffer. it holds active context while you operate on it.

you're debugging a function. you need to hold the function signature, the calling context, the expected output, the actual output, and the test case in mind simultaneously. that's 5 items. most people can hold 4-7 without strain. ADHD working memory holds 2-4 before the oldest one drops.

stimulant medication expands the buffer. more items stay active longer. that's it. it doesn't make you smarter. it doesn't improve pattern recognition. it just keeps more plates spinning at once.

the problem is biological. the solution has always been structural. external systems that hold the context your brain can't. notebooks. sticky notes. second monitors covered in reminders. todo apps with aggressive notifications.

Claude Code's file system is the most effective version of this I've ever used.

## why this file system specifically

CLAUDE.md loads automatically on every session start. it's not a note you might forget to check. it's injected into context before you type a single character. your orchestration rules, your workflow constraints, your project state. always present.

`~/.claude/handoffs/` holds session state across restarts. what you built, what broke, what's next. timestamped, parallel-safe. the context from Friday is waiting on Monday morning. you don't re-explain. you don't lose the thread.

`tasks/lessons.md` captures every correction as a permanent rule. the mistake you made in week 1 has a rule by week 2. you never make it again. not because you remembered - because the system remembers.

MEMORY.md is the persistent knowledge layer. an index file that stays under 200 lines with topic files that hold the details. infrastructure decisions, completed work, identity context. loaded on demand, never truncated.

skills/ are the muscle memory files. voice rules, content playbooks, safety filters, operational procedures. loaded when relevant. the agent knows how to do things you taught it months ago.

this isn't a notes app. it's a cognitive prosthetic. it actively compensates for the exact function that ADHD impairs.

## the convergence pattern

I spend time in r/ClaudeCode, r/GTMBuilders, and adjacent communities. I keep seeing the same progression. different people, different use cases, same stages.

**1. discovery.** find Claude Code, start using it for coding tasks. impressed by the capability. using it like a fancy autocomplete.

**2. trust unlock.** use Opus, see what it can actually do with complex multi-file problems. start delegating real architectural work. the relationship changes from tool to collaborator.

**3. cost wall.** API bills hit $200-400/month. or the Max subscription feels steep. people start optimizing, looking for cheaper models, trying local alternatives.

**4. CLI pivot.** discover `claude -p` for non-interactive generation. SSH into machines. run multiple terminals. the GUI becomes the bottleneck and the terminal becomes the primary interface.

**5. file system awakening.** this is the inflection point. people start building CLAUDE.md files. then handoff systems. then lessons files. then memory structures. the file system becomes the brain's external storage. everyone arrives here independently because the pain of losing context forces the same solution.

**6. system convergence.** this is the part that surprised me. everyone who reaches stage 5 starts building the same things. a personal website. a voice system. a content pipeline. distribution automation. the tools change but the outputs converge.

**7. builder identity.** the tool stops being a tool and becomes part of how you think. you don't use Claude Code to build things. you think with Claude Code and things get built.

I've watched this pattern play out across dozens of builders. the timeline varies. some hit stage 7 in weeks, some in months. but the stages are the same.

## why the outputs converge

this is the part worth examining. why does everyone build the same things?

because the file system solves the same underlying problem for everyone. once you have persistent context, self-improving rules, and structured memory... you naturally build systems that produce compounding output.

a website is the first thing because it's the most obvious container for compounding content. blog posts accumulate. SEO compounds. the domain accrues authority over time. it's the digital equivalent of building equity instead of renting.

a voice system follows because once you're producing content at scale with AI, voice consistency becomes the bottleneck. anti-slop rules, tone calibration, platform-specific playbooks. everyone discovers they need this within 2-3 weeks of shipping content.

a content pipeline follows because manual cross-posting doesn't scale. write once, distribute everywhere. the blog post becomes a Reddit discussion becomes a LinkedIn post becomes an X thread. automation handles the formatting. you handle the ideas.

the pattern makes sense in retrospect. but I didn't predict it. I just watched it happen to me first, then watched it happen to everyone else.

## the trilogy connection

I built three repos this year. they map to this progression.

```
structured-divergence (why these brains build these systems)
  --> recursive-drift (how to think with AI)
      --> context-handoff-engine (the plumbing)
          --> website-with-soul (the product)
```

[recursive-drift](https://github.com/shawnla90/recursive-drift) defines the methodology. six non-linear states, the self-reading feedback loop, the evolution system. this is how you think with AI without losing your voice.

[context-handoff-engine](https://github.com/shawnla90/context-handoff-engine) is the infrastructure. 6 layers of context persistence so Claude Code doesn't start every session from zero. this is the cognitive prosthetic layer.

[website-with-soul](https://github.com/shawnla90/website-with-soul) is the product. 32-chapter playbook and a working starter template. this is what the system produces.

structured-divergence is the thesis that connects them. divergent thinkers building structured external systems to hold the context their working memory can't. and converging on the same outputs because the constraints are the same.

## the file system is the medication

I'm not making a medical claim. stimulant medication works. it does something biological that no software can replace. if you need it, take it.

but I am making an observation. the function that medication extends - holding active context across time - is exactly the function that CLAUDE.md, handoffs, lessons.md, and MEMORY.md perform. they hold context your working memory can't. they surface it automatically. they persist it across sessions.

six weeks without Vyvanse. the creative output didn't drop. the shipping cadence didn't slow. the systems held the context.

the whole repo ecosystem is open source. MIT licensed. if you're somewhere on the 7-stage progression, you probably already know which layer you need next.

[github.com/shawnla90/recursive-drift](https://github.com/shawnla90/recursive-drift)
[github.com/shawnla90/context-handoff-engine](https://github.com/shawnla90/context-handoff-engine)
[github.com/shawnla90/website-with-soul](https://github.com/shawnla90/website-with-soul)
