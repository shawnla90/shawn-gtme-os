---
title: "what Karpathy's markdown files taught me about context engineering"
date: "2026-03-18"
excerpt: "Andrej Karpathy programs in markdown now. Turns out GTM engineers have been doing the same thing without knowing it had a name."
category: "context-engineering"
featured: true
---

**tl;dr:** Karpathy's latest project uses a markdown file as the control layer. not Python. not YAML. a .md file tells the agent what to do, and the agent writes the code. I've been doing the same thing every day with CLAUDE.md files, system prompts, and skill files. the pattern has a name: context engineering. and it's becoming the most valuable technical skill in GTM.

## a markdown file that runs experiments

Andrej Karpathy's [autoresearch](https://shawnos.ai/blog/karpathy-autoresearch-autonomous-agents) project has three files. one of them is `program.md`.

that file isn't documentation. it's the control layer. the human writes instructions in plain language. the agent reads those instructions, writes Python, runs experiments, evaluates results, and loops. 100+ experiments overnight. zero human intervention.

Karpathy calls it programming the program.md.

when I first saw that, I didn't think about ML research. I thought about the CLAUDE.md file sitting in every project I build. the system prompts I write for content pipelines. the skill files that tell agents how to generate, validate, and score output.

same pattern. different domain.

## context engineering is what connects Karpathy's work to GTM

context engineering is the practice of designing the instruction layer that agents execute. not writing code. writing constraints, rules, and context that shape what the agent produces.

[Boris Cherny built this into Claude Code](https://shawnos.ai/blog/boris-cherny-claude-code-context-engineering) with CLAUDE.md. the file tells the agent what the project is, how to behave, what to avoid. the agent reads it before every action. the human doesn't write the code. the human writes the context that produces the code.

Karpathy's `program.md` does the same thing for ML research. the human writes strategy. the agent handles tactics.

the shift is the same everywhere. and once you see it, you can't unsee it.

for a deeper breakdown of how context engineering differs from prompt engineering: [context engineering vs prompt engineering](https://shawnos.ai/how-to/context-engineering-vs-prompt-engineering).

## what this looks like in practice for GTM

I run a content pipeline on a Mac Mini. every night, the system reads its own previous output from a SQLite index, checks for topic overlap, generates new content, validates against 60+ patterns, scores the result, and retries if it's below threshold.

the control layer isn't Python. it's a set of markdown files.

`core-voice.md` defines how the content should sound. `anti-slop.md` lists 29 patterns to catch and remove. platform playbooks define formatting rules for LinkedIn vs. blog vs. Reddit. an improvement protocol defines the gates every piece runs through before publishing.

the agent reads all of those files before generating anything. the output quality comes from the context, not the code.

same thing with enrichment pipelines. the agent that researches companies doesn't need custom code for every vertical. it needs a markdown file that says: here's what matters in this industry, here's how to score it, here's what disqualifies a lead. change the markdown, change the output. the code stays the same.

that's context engineering. and Karpathy validated the pattern from the ML research side without knowing GTM engineers were already doing it.

## why markdown and not code?

three reasons.

**markdown is human-readable.** anyone on a team can read a .md file and understand what the system is doing. try that with a 500-line Python script. the instruction layer being readable means more people can contribute to it, review it, and improve it.

**markdown is modular.** swap a file, change the behavior. I can change my content pipeline from LinkedIn mode to blog mode by pointing it at a different playbook. the orchestration code doesn't change. the context does.

**markdown survives model upgrades.** when the underlying model improves, the context files still work. often they work better. code tied to specific API versions breaks. constraints written in plain language adapt because the agent interpreting them got smarter.

this is why Karpathy chose a .md file as the control layer for autoresearch. not because he couldn't write Python. because markdown is the right abstraction for instructing agents.

## the shift that matters

the most valuable technical skill used to be writing code. then it was prompt engineering. now it's context engineering.

prompt engineering is one-shot. you write a prompt, you get a response. context engineering is systems-level. you design the instruction layer that shapes every action an agent takes across an entire workflow.

Karpathy's `program.md` is a context engineering artifact. my CLAUDE.md files are context engineering artifacts. the skill files that define voice, validation, and routing are context engineering artifacts.

the people who get good at this will build systems that compound. the people who keep writing one-off prompts will keep getting one-off results.

[who is Andrej Karpathy](https://shawnos.ai/blog/who-is-andrej-karpathy) covers his full background and repo history. [Karpathy's repos for GTM engineers](https://shawnos.ai/blog/karpathy-repos-for-gtm-engineers) breaks down the architectural lessons from each one. this post is about the connecting thread: the markdown file is becoming the most important file in your stack.

## frequently asked questions

**what is context engineering?**
Context engineering is the practice of designing the instruction layer that AI agents execute. Instead of writing code directly, you write constraints, rules, examples, and context in plain language files (like CLAUDE.md or program.md) that shape the agent's behavior across an entire workflow. It's systems-level thinking applied to agent instructions.

**how is context engineering different from prompt engineering?**
Prompt engineering is writing a single prompt to get a single response. Context engineering is designing the full instruction environment that an agent reads before taking any action. A prompt is a question. Context is the operating system. See [context engineering vs prompt engineering](https://shawnos.ai/how-to/context-engineering-vs-prompt-engineering) for the full breakdown.

**do I need to know Karpathy's work to do context engineering?**
No. Karpathy validated the pattern from the AI research side, but GTM engineers have been practicing context engineering with system prompts, CLAUDE.md files, and agent configuration for a while. His work gives the pattern a clearer name and proves it works at the frontier of AI research, not just in business automation.

**what tools support context engineering?**
Claude Code uses CLAUDE.md files as the primary context layer. Cursor uses .cursorrules. Any agent framework that reads instruction files before executing supports the pattern. The tool matters less than the practice of writing clear, modular, constraint-based instructions.

**where should I start with context engineering?**
Start with one workflow you run repeatedly. Write a markdown file that describes: what the agent should do, what it should avoid, what good output looks like, and how to evaluate results. Point your agent at that file before every run. Iterate on the file based on output quality. That's context engineering.

---

*[who is Andrej Karpathy](https://shawnos.ai/blog/who-is-andrej-karpathy) · [autoresearch blog](https://shawnos.ai/blog/karpathy-autoresearch-autonomous-agents) · [Karpathy repos for GTM engineers](https://shawnos.ai/blog/karpathy-repos-for-gtm-engineers) · [context engineering vs prompt engineering](https://shawnos.ai/how-to/context-engineering-vs-prompt-engineering) · [Boris Cherny and Claude Code](https://shawnos.ai/blog/boris-cherny-claude-code-context-engineering)*

shawn ⚡ GTM Engineer
