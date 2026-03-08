---
title: "Karpathy's Autoresearch and the Agent Loop That Changes Everything"
date: "2026-03-08"
excerpt: "Andrej Karpathy open sourced a repo that lets AI agents run ML research autonomously overnight. The code isn't the point. The pattern is."
category: "methodology"
featured: true
---

## the repo

Andrej Karpathy dropped [autoresearch](https://github.com/karpathy/autoresearch) this week. ([announcement on X](https://x.com/karpathy/status/2030371219518931079))

three files. one GPU. an agent that modifies training code, runs a 5-minute experiment, checks if the result improved, keeps or discards the change, and loops. ~12 experiments per hour. ~100 overnight. zero human intervention.

the agent doesn't sleep. doesn't get distracted. doesn't forget what it tried three experiments ago. it just runs the loop.

## the three files

the architecture is aggressively minimal.

`prepare.py` is locked. utilities for data loading and evaluation. the agent cannot touch it. `train.py` is the only file the agent modifies. contains the model, optimizer, training loop. `program.md` is where humans write instructions for the agent.

that last one is the interesting part. you don't program Python anymore. you program a markdown file that tells the agent what to explore. the agent writes the Python.

Karpathy's quote: "one day, frontier AI research used to be done by meat computers... that era is long gone."

## why the pattern matters more than the repo

autoresearch itself is a demo. single GPU, toy model, no distributed training. Karpathy says he doesn't know how much he'll support it going forward.

but the pattern it demonstrates is real.

**autonomous agent loops with a clear metric.** the agent has one number to optimize (validation bits per byte). it has one file it can modify. it has a fixed time budget per experiment. and it runs indefinitely.

that pattern works for more than ML research. any domain where you can define a clear success metric and give an agent a constrained action space becomes automatable in exactly this way.

## the connection to what we build

I've been running a version of this pattern for months without calling it autoresearch.

the [self-reading feedback loop](https://shawnos.ai/blog/recursive-drift) in Recursive Drift works the same way. the agent reads its previous 3 posts from SQLite. studies the voice. checks topic overlap via full-text search. generates new content. validates against 60+ regex patterns. scores the output. retries if below threshold. the output becomes input for the next cycle.

Karpathy's loop: modify code --> train --> evaluate --> keep/discard --> repeat.
our loop: read previous output --> generate --> validate --> score --> repeat.

same architecture. different domain. both compound over time because the output feeds back as input.

the difference is Karpathy optimizes for a numerical metric (bits per byte). we optimize for voice consistency and substance density. his loop runs on an H100. ours runs on a Mac Mini with a Claude Code subscription.

## what builders should take from this

three things.

**1. the markdown-as-programming pattern is real.** `program.md` isn't a README. it's the actual control layer. the shift from writing code to writing instructions for agents that write code is happening at every level - from Karpathy's ML research to content pipelines to GTM automation.

**2. constraint is the feature.** three files. one metric. five-minute experiments. the agent works because the problem space is narrow enough to iterate on. if you give an agent unlimited scope, it wanders. if you give it one file and one number, it optimizes.

**3. the loop is the product.** not the model. not the training code. not the agent framework. the loop - hypothesize, test, evaluate, iterate - is what produces compounding results. the specific tools inside the loop are replaceable. the loop itself is the architecture.

Karpathy built a demo. the pattern behind it is infrastructure.

if you're building agent systems, study the constraint design more than the code. the repo is MIT licensed. the pattern is free.

[github.com/karpathy/autoresearch](https://github.com/karpathy/autoresearch)
