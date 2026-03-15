---
title: "Structured Divergence: Four Repos, One Pattern, and Why Everyone Builds the Same Things"
date: "2026-03-14"
excerpt: "I shipped four open-source repos in six weeks with Claude Code. then I noticed every builder around me was converging on the same outputs. here's the pattern, the repos, and why divergent thinkers keep arriving at the same architecture."
category: "ships"
featured: true
---

## four repos in six weeks

six weeks ago I started building seriously with Claude Code. not tinkering. building. full systems, shipped and open source.

the output: four repos that connect into a single architecture for thinking with AI, shipping content, and building compounding systems. every one of them is MIT licensed and live on GitHub right now.

```
structured-divergence (the thesis - why these systems get built)
  --> recursive-drift (the methodology - how to think with AI)
      --> context-handoff-engine (the infrastructure - persistent context)
          --> website-with-soul (the product - what the system produces)
```

I'm going to walk through what each one does, the pattern I keep seeing in other builders, and why I think divergent thinkers have a structural advantage with this tooling.

but first. the repos.

## the stack

[recursive-drift](https://github.com/shawnla90/recursive-drift) defines the methodology. six non-linear states, a self-reading feedback loop, an evolution system. this is how you think with AI without losing your voice. not a framework you follow. a pattern you recognize in yourself and then make deliberate.

[context-handoff-engine](https://github.com/shawnla90/context-handoff-engine) is the infrastructure layer. 6 layers of context persistence so Claude Code doesn't start every session from zero. CLAUDE.md, handoffs, lessons, memory, skills. the plumbing that makes everything else possible.

[website-with-soul](https://github.com/shawnla90/website-with-soul) is the product. 32-chapter playbook and a working starter template for building a website that has depth, personality, and a 90% free stack. this is what the system actually produces when you wire it all together.

[structured-divergence](https://github.com/shawnla90/structured-divergence) is the thesis connecting them. the observation that divergent thinkers keep building the same external systems... and that Claude Code's file system is the best version of those systems that's ever existed.

go explore them. fork them. break them apart. that's the point.

## the convergence pattern

I spend time in r/ClaudeCode, r/GTMBuilders, and adjacent communities. I keep seeing the same progression. different people, different use cases, same stages.

**1. discovery.** find Claude Code, start using it for coding tasks. impressed by the capability. using it like a fancy autocomplete.

**2. trust unlock.** use Opus, see what it can actually do with complex multi-file problems. start delegating real architectural work. the relationship changes from tool to collaborator.

**3. cost wall.** API bills hit $200-400/month. or the Max subscription feels steep. people start optimizing, looking for cheaper models, trying local alternatives.

**4. CLI pivot.** discover `claude -p` for non-interactive generation. SSH into machines. run multiple terminals. the GUI becomes the bottleneck and the terminal becomes the primary interface.

**5. file system awakening.** this is the inflection point. people start building CLAUDE.md files. then handoff systems. then lessons files. then memory structures. the file system becomes the brain's external storage. everyone arrives here independently because the pain of losing context forces the same solution.

**6. system convergence.** everyone who reaches stage 5 starts building the same things. a personal website. a voice system. a content pipeline. distribution automation. the tools change but the outputs converge.

**7. builder identity.** the tool stops being a tool and becomes part of how you think. you don't use Claude Code to build things. you think with Claude Code and things get built.

I've watched this pattern play out across dozens of builders. the timeline varies. some hit stage 7 in weeks, some in months. but the stages are the same.

## why the outputs converge

why does everyone build the same things?

because the file system solves the same underlying problem for everyone. once you have persistent context, self-improving rules, and structured memory... you naturally build systems that produce compounding output.

a website is the first thing because it's the most obvious container for compounding content. blog posts accumulate. SEO compounds. the domain accrues authority over time. the digital equivalent of building equity instead of renting.

a voice system follows because once you're producing content at scale with AI, voice consistency becomes the bottleneck. anti-slop rules, tone calibration, platform-specific playbooks. everyone discovers they need this within 2-3 weeks of shipping content.

a content pipeline follows because manual cross-posting doesn't scale. write once, distribute everywhere. the blog post becomes a Reddit discussion becomes a LinkedIn post becomes an X thread. automation handles the formatting. you handle the ideas.

the pattern makes sense in retrospect. I didn't predict it. I just watched it happen to me first, then watched it happen to everyone else.

## the divergent thinker advantage

here's where the ADHD angle comes in, and it's not about medication.

working memory is the buffer that holds active context while you operate on it. you're debugging a function and you need to hold the function signature, the calling context, the expected output, the actual output, and the test case simultaneously. that's 5 items. most people can hold 4-7. divergent thinkers often hold 2-4 before the oldest one drops.

the problem is biological. but the solution has always been structural. external systems that hold the context your brain can't. notebooks. sticky notes. second monitors covered in reminders. todo apps with aggressive notifications.

Claude Code's file system is the most effective version of this that's ever existed.

CLAUDE.md loads automatically on every session start. not a note you might forget to check. injected into context before you type a single character. your orchestration rules, your workflow constraints, your project state. always present.

`~/.claude/handoffs/` holds session state across restarts. what you built, what broke, what's next. timestamped, parallel-safe. the context from Friday is waiting on Monday morning. you don't re-explain. you don't lose the thread.

`tasks/lessons.md` captures every correction as a permanent rule. the mistake you made in week 1 has a rule by week 2. you never make it again. not because you remembered. because the system remembers.

MEMORY.md is the persistent knowledge layer. an index file that stays under 200 lines with topic files that hold the details. loaded on demand, never truncated.

skills/ are the muscle memory files. voice rules, content playbooks, safety filters, operational procedures. the agent knows how to do things you taught it months ago.

this isn't a notes app. it's a cognitive prosthetic. and divergent thinkers who have spent their whole lives building compensation systems... recognize it immediately. that's why they build faster with it. they already know what external structure is for. Claude Code just gave them the best version of it.

## six weeks of output

I built the four repos above in six weeks. I also shipped a full website, a content pipeline that distributes across 6 platforms, a voice system with 29 anti-slop rules, cron jobs running nightly, and a GTM operations layer. all from a single Mac Mini running Claude Code.

this post is the thesis layer. next up is the practical one: how to actually build a website with Claude Code from zero to deployed. that's coming next week, and it's the website-with-soul playbook broken down into a walkthrough.

the whole ecosystem is open source. MIT licensed. if you're somewhere on the 7-stage progression, you probably already know which layer you need next.

[github.com/shawnla90/recursive-drift](https://github.com/shawnla90/recursive-drift)
[github.com/shawnla90/context-handoff-engine](https://github.com/shawnla90/context-handoff-engine)
[github.com/shawnla90/website-with-soul](https://github.com/shawnla90/website-with-soul)
[github.com/shawnla90/structured-divergence](https://github.com/shawnla90/structured-divergence)
