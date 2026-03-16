# Four Repos, Six Weeks, One Pattern

> **Platform**: Substack
> **Series**: OS.AI Labs
> **Structure**: Personal POV Essay (extended)
> **Date**: 2026-03-15
> **Status**: draft
> **Source**: original
> **Visual**: repo dependency tree diagram or terminal screenshot showing all 4 repos

**Subject line options:**
- "four repos, six weeks, one pattern"
- "I shipped 4 open source repos in 6 weeks. then I noticed the pattern."
- "structured divergence is live"

**Preview text:** the 7-stage progression every Claude Code builder goes through, why the outputs always converge, and the builder challenge that starts today

---

six weeks ago I started building with Claude Code. not tinkering. building full systems, open sourcing them, and watching what happened.

the output was four repos. but the interesting part wasn't what I built. it was watching other builders arrive at the same architecture independently.

this is the story of those six weeks, the convergence pattern I keep seeing, and the thing I want to try next.

## the arc

I left my last role and went heads-down. no client work, no prospecting, no LinkedIn for two weeks. just building.

week 1 was recursive-drift. the methodology for thinking with AI without losing your voice. six non-linear states, a self-reading feedback loop where agents study their own output before generating new content, and a progression system where trust earns autonomy. I'd been running it for months without naming it. putting it in a repo forced me to articulate what I was actually doing.

week 2-3 was context-handoff-engine. the plumbing that makes everything else work. 6 layers of context persistence so Claude Code doesn't start every session from zero. CLAUDE.md for orchestration rules. handoff files for session state. lessons.md for self-improvement. MEMORY.md for persistent knowledge. skills/ for operational muscle memory. the boring infrastructure that nobody wants to build but everybody needs.

week 4-5 was website-with-soul. the product layer. a 32-chapter playbook and a working starter template for building a website that sounds like you, ranks in search, feeds AI crawlers, and costs $10/year to host. three sites run on this exact stack right now. shawnos.ai, thegtmos.ai, thecontentos.ai.

week 6 was structured-divergence. the thesis connecting all of it. why divergent thinkers keep building the same external systems... and why Claude Code's file system is the best version of those systems that's ever existed.

```
structured-divergence (the thesis)
  --> recursive-drift (the methodology)
      --> context-handoff-engine (the infrastructure)
          --> website-with-soul (the product)
```

each repo feeds the next. the thesis explains why the methodology works. the methodology produces the infrastructure. the infrastructure enables the product. and the product validates the thesis. it's a loop.

## the convergence pattern

while I was building, I was also watching. r/ClaudeCode, r/GTMBuilders (a community I started that's grown to 120 people doing real work), adjacent communities. the same progression kept showing up.

**stage 1: discovery.** someone finds Claude Code and uses it for coding tasks. impressed by the capability. treating it like a fancy autocomplete.

**stage 2: trust unlock.** they switch to Opus or use the Max subscription. see what it can actually do with complex multi-file problems. the relationship shifts from tool to collaborator. they start delegating real architectural decisions.

**stage 3: cost wall.** API bills hit $200-400/month. or the Max subscription feels steep. optimization phase. trying cheaper models, local alternatives, usage limits.

**stage 4: CLI pivot.** they discover `claude -p` for non-interactive generation. SSH into machines. run multiple terminals in parallel. the GUI becomes the bottleneck and the terminal becomes the primary interface.

**stage 5: file system awakening.** the inflection point. people start building CLAUDE.md files. then handoff systems. then lessons files. then memory structures. the file system becomes the brain's external storage. everyone arrives here independently because the pain of losing context forces the same solution.

**stage 6: system convergence.** everyone who reaches stage 5 starts building the same outputs. a personal website. a voice system. a content pipeline. distribution automation. the tools change. the names change. but the architecture converges.

**stage 7: builder identity.** the tool stops being a tool and becomes part of how you think. you don't use Claude Code to build things. you think with Claude Code and things get built.

I've watched this happen across dozens of builders. the timeline varies. some hit stage 7 in weeks, some take months. but the stages are consistent.

## why the outputs converge

the convergence at stage 6 is the part I couldn't stop thinking about.

why does everyone build the same things?

because the file system solves the same underlying problem for everyone. once you have persistent context, self-improving rules, and structured memory... you naturally build systems that produce compounding output.

a website is always first because it's the most obvious container for compounding content. blog posts accumulate. SEO compounds. the domain accrues authority. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) index your content and start surfacing you as a source. you're building equity instead of renting. every post on LinkedIn or X has a half-life measured in hours. every blog post has a half-life measured in months.

a voice system follows because once you're producing content at scale with AI, consistency becomes the bottleneck. anti-slop rules, tone calibration, platform-specific playbooks. everyone discovers they need this within 2-3 weeks of shipping content with AI assistance.

a content pipeline follows because manual cross-posting doesn't scale. write once, distribute everywhere. the blog post becomes a Reddit discussion becomes a LinkedIn post becomes a newsletter. automation handles the formatting. you handle the ideas.

I didn't predict this convergence. I just watched it happen to me first, then watched it happen to everyone else.

## the divergent thinker angle

working memory is the buffer that holds active context while you operate on it. debugging a function means simultaneously holding the function signature, the calling context, the expected output, the actual output, and the test case. that's 5 items. most people can hold 4-7 before the oldest one drops. divergent thinkers (ADHD brains, pattern-recognition-heavy thinkers) often hold 2-4.

the problem is biological. but the solution has always been structural. notebooks, sticky notes, second monitors covered in reminders, todo apps with aggressive notifications. external systems that hold what your working memory can't.

Claude Code's file system is the most effective version of this that's ever existed.

CLAUDE.md loads automatically on every session start. not a note you might forget to check. injected into context before you type a single character. handoffs hold session state across restarts. lessons.md captures every correction as a permanent rule. the mistake you make in week 1 has a rule by week 2. you never make it again. not because you remembered. because the system remembers.

I stopped taking Vyvanse six weeks ago. not intentionally. just forgot to refill, then forgot again, then realized I hadn't noticed a productivity drop. the cognitive prosthetic was doing the job.

divergent thinkers who have spent their whole lives building compensation systems recognize this immediately. that's why they build faster with it. they already know what external structure is for. Claude Code just gave them the best version.

## the repos

all four are MIT licensed and live on GitHub right now.

[structured-divergence](https://github.com/shawnla90/structured-divergence) ... the thesis. why divergent thinkers converge on the same systems, the 7-stage progression, the working memory connection. papers on cognitive gaps, system convergence, and builder-led growth.

[recursive-drift](https://github.com/shawnla90/recursive-drift) ... the methodology. six non-linear states, the self-reading feedback loop, the 5-tier evolution system. CLI-first, zero API keys. includes NioBot, a full build guide for creating an agent with memory, voice, and personality.

[context-handoff-engine](https://github.com/shawnla90/context-handoff-engine) ... the infrastructure. 6 layers of context persistence. CLAUDE.md orchestration, parallel-safe handoffs, lessons, memory, skills. the plumbing that makes everything else work.

[website-with-soul](https://github.com/shawnla90/website-with-soul) ... the product. 32-chapter playbook covering build, content, promotion, scale. working starter template. dark terminal aesthetic, markdown blog, AI chat widget, PostHog analytics, sitemap with AI crawler allowlist. $10/year stack.

fork them. break them apart. combine them differently. that's the point.

## the builder challenge

I want to try something.

if you're somewhere on that 7-stage progression and you've been thinking about building your own website... I'll guide you through it. personally.

the website-with-soul repo has everything you need. 32 chapters, a starter template, platform playbooks. but building alone is slower than building with someone who's already done it three times.

so here's the offer. build your website with Claude Code using the playbook. I'll answer questions, review architecture decisions, help debug the weird stuff. once it's live, I'll promote it. link to it from shawnos.ai. share it on my platforms. help you get your first traffic.

and then we do the same for the next person. and the next.

a backlinking network of builder sites, each one promoting the others. not a link exchange scheme. a genuine community of people who built something real and vouch for each other's work.

r/GTMBuilders already has 120 people doing this kind of collaborative building. the energy there is different from most communities because it's small enough that everyone actually builds, not just talks about building.

this is an experiment. I don't know how it scales. but the first few sites in the network will get the most direct support from me, and the most visibility.

if you want in, the repo is at [github.com/shawnla90/website-with-soul](https://github.com/shawnla90/website-with-soul). the blog post breaking down the playbook is at [shawnos.ai/blog/website-with-soul-open-source](https://shawnos.ai/blog/website-with-soul-open-source). and the community where the building happens is at [r/GTMBuilders](https://reddit.com/r/GTMBuilders).

## what's next

tomorrow I'm posting something different on LinkedIn. not about repos or systems. about the career move I'm making and what all of this has been building toward.

if you've been following the technical arc... tomorrow is the human story behind it.

shawn ⚡ the gtme alchemist 🧙‍♂️

---

if this landed, forward it to someone who's building with AI and can't explain why they keep building the same things everyone else is building. or reply and tell me which stage you're on. I read every reply.

no gatekeeping. all four repos are MIT licensed. the full playbook, methodology, templates, and thesis are in there.
