---
platform: reddit
subreddit: r/ClaudeCode
type: post + 2 comments
angle: 7-stage progression, file system as cognitive prosthetic
status: draft
date: 2026-03-15
source: content/website/final/structured-divergence.md
---

**Title: the 7-stage progression every Claude Code builder seems to go through (and why the outputs always converge)**

I've been building with Claude Code full-time for about 6 weeks. shipped 4 open source repos. but the more interesting thing is the pattern I keep seeing in other builders.

watching this community, r/GTMBuilders (a small builder community I run), and adjacent spaces... the same 7 stages keep showing up:

1. **discovery** - find Claude Code, use it for coding tasks. impressed. treating it like fancy autocomplete.
2. **trust unlock** - switch to Opus or Max. start delegating real architectural decisions. the relationship changes from tool to collaborator.
3. **cost wall** - API bills hit $200-400/month. optimization mode kicks in. trying cheaper models, local alternatives, usage limits.
4. **CLI pivot** - discover `claude -p`. SSH into machines. run multiple terminals. the GUI becomes the bottleneck.
5. **file system awakening** - start building CLAUDE.md files. then handoff systems. then lessons files. then memory structures. everyone arrives here independently because losing context hurts enough to force the same solution.
6. **system convergence** - everyone who hits stage 5 starts building the same things. personal website. voice system. content pipeline. distribution automation. different people, same outputs.
7. **builder identity** - you stop using the tool and start thinking with it. things get built as a side effect.

stage 5 is the inflection point. the file system becomes external working memory. CLAUDE.md loads automatically on every session. handoffs persist context across restarts. lessons.md captures every correction as a permanent rule.

stage 6 surprised me most. the outputs converge because the constraints converge. persistent context + self-improving rules naturally produce compounding systems. a website compounds SEO. a voice system compounds consistency. a content pipeline compounds distribution.

I ended up building repos that map to this progression:

- [recursive-drift](https://github.com/shawnla90/recursive-drift) - methodology for thinking with AI (CLI-first, zero API keys)
- [context-handoff-engine](https://github.com/shawnla90/context-handoff-engine) - 6 layers of context persistence
- [website-with-soul](https://github.com/shawnla90/website-with-soul) - 32-chapter playbook + starter template ($10/year stack)
- [structured-divergence](https://github.com/shawnla90/structured-divergence) - the thesis connecting them all

all MIT licensed.

curious where others are on this progression. and whether you're seeing the same convergence in what you end up building.

---

**Comment 1 (working memory depth layer):**

the working memory angle goes deeper than I put in the post. working memory is the buffer that holds active context while you operate on it. debugging means holding the function signature, calling context, expected output, actual output, and test case simultaneously. that's 5 items. most people hold 4-7 before the oldest drops. ADHD and pattern-recognition-heavy brains often hold 2-4.

the solution has always been structural. notebooks, sticky notes, second monitors. Claude Code's file system is the most effective version of this. CLAUDE.md is injected into context before you type anything. it's not a note you might forget to check. it's always present.

I stopped taking ADHD medication six weeks ago (forgot to refill, then forgot again). the productivity didn't drop because the file system was doing the job. not claiming this works for everyone. just reporting what happened.

if you're interested in the full thesis on this, I wrote it up at [shawnos.ai/blog/structured-divergence](https://shawnos.ai/blog/structured-divergence)

**Comment 2 (builder challenge):**

related to the convergence thing... if anyone here is at stage 5 or 6 and thinking about building a personal site, I'm running a builder challenge.

the website-with-soul repo has a 32-chapter playbook and a working starter template. clone it, build with Claude Code, get it live. I'll help debug the weird stuff and once it's deployed, I'll link to it from my site and promote it.

the idea is a backlinking network. builders promoting each other's shipped work. r/GTMBuilders is where the building happens (120 people, small enough that everyone actually ships).

repo: [github.com/shawnla90/website-with-soul](https://github.com/shawnla90/website-with-soul)
