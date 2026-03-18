---
title: "boris cherny built claude code. here's why his architectural decisions matter"
date: "2026-03-17"
excerpt: "The creator of Claude Code ships 20-30 PRs a day running 5 parallel instances. His workflow reveals the same paradigm Karpathy's repos demonstrate: context is the programming surface."
category: "context-engineering"
featured: true
---

**tl;dr:** The creator of Claude Code ships 20-30 PRs/day running 5 parallel instances. His CLAUDE.md pattern is the same paradigm as Karpathy's program.md. You don't program the code. You program the context file that tells the agent how to write the code. The context compounds. The code is replaceable.

## who is Boris Cherny?

Boris Cherny is the creator and Head of Claude Code at Anthropic. Before Anthropic, he spent five years at Meta as a Principal Engineer. He wrote "Programming TypeScript." He joined Anthropic in September 2024.

I'm writing about him because his architectural decisions directly shape how I work every day. When you use Claude Code, you're using a tool designed by someone who runs 5 parallel instances across 5 terminal tabs, shipping 20-30 PRs per day. The tool reflects the builder.

## how claude code started

it started as a command-line music tracking tool. Not an IDE. Not a coding assistant. A terminal-based utility that happened to get filesystem access. It spread virally at Anthropic after people realized what filesystem access plus Claude's intelligence could do.

That origin matters. Claude Code wasn't designed by committee or built from a product spec. It was built by a developer for a developer, and it grew because developers used it.

The Claude Code team is roughly 12 engineers. They ship 60-100 internal releases per day. Every engineer change triggers an internal npm package release with rapid feedback loops. The velocity is the feature. The tool evolves faster than its documentation.

## how does Boris Cherny use Claude Code?

Boris ships 20-30 PRs per day. The workflow:

Start Claude in plan mode. Iterate on the plan until the approach is right. Then execute the implementation in one shot. Five parallel Claude instances across five terminal tabs, each a separate checkout.

This is the same pattern I use. Plan first, then delegate execution. Parallel sessions, each with full context. The human thinks. The agent builds. The loop compounds.

But the detail that matters most: after every Claude mistake on their codebase, the team adds a rule to CLAUDE.md so it cannot repeat that mistake.

Read that again. Every mistake becomes a constraint. The constraint file grows. The system gets smarter. Not because the model improved. Because the context improved.

**Context engineering** is the practice of designing the instruction layer (CLAUDE.md files, skill files, system prompts, voice rules) that an AI agent reads before executing any task. It's distinct from prompt engineering because it's persistent, cumulative, and structural. A prompt is a one-shot instruction. Context engineering builds a growing body of constraints, rules, and domain knowledge that makes the agent smarter over time without changing the model.

That's context engineering.

## how does CLAUDE.md connect to Karpathy's program.md?

Karpathy's [autoresearch](https://shawnos.ai/blog/karpathy-autoresearch-autonomous-agents) has `program.md`. The human writes markdown instructions. The agent writes code. The markdown file is the programming surface.

Claude Code has `CLAUDE.md`. The human writes constraints, rules, workflow instructions. The agent follows them. The CLAUDE.md file is the programming surface.

Same paradigm. Different domain.

In autoresearch, the agent modifies `train.py` based on instructions in `program.md`. In Claude Code, the agent modifies your codebase based on instructions in `CLAUDE.md`. Both systems get better not through model updates but through better context.

[Karpathy's repos](https://shawnos.ai/blog/who-is-andrej-karpathy) demonstrate the pattern in ML. Boris Cherny's tool makes the pattern accessible to every developer and builder. For the GTM-specific breakdown of each Karpathy repo, see [Karpathy repos for GTM engineers](https://thegtmos.ai/blog/karpathy-repos-for-gtm-engineers).

See [context engineering vs prompt engineering](https://shawnos.ai/how-to/context-engineering-vs-prompt-engineering) for why this distinction changes everything.

## what do Boris Cherny's architectural decisions enable?

three architectural choices that Boris made early define what Claude Code can do today.

**Terminal-native, not IDE-bound.** Claude Code runs in your terminal. Not as a VS Code extension. Not as a browser tab. In the same environment where you run Git, deploy code, manage crons. This means Claude Code can do anything your terminal can do. Which is everything.

I wrote about this in [6 weeks of building with Claude Code](https://shawnos.ai/blog/6-weeks-of-building-with-claude-code). The terminal-native decision is why I can run 4-6 concurrent sessions, pipe outputs between them, and automate generation via `claude -p` on a cron.

**Context window as the feature.** The [1M context window](https://shawnos.ai/blog/claude-code-1m-context-window) wasn't just a number increase. It's the architectural statement that context is the primary programming mechanism. Load your entire repo. Load your skill files, your voice system, your CLAUDE.md, your lessons.md. The agent gets smarter because it sees more, not because it changed.

**CLAUDE.md as the control layer.** Making project-level instructions a first-class concept means every project teaches the agent how to work on that specific project. The file grows. The mistakes accumulate as rules. The rules prevent future mistakes. This is the self-improving loop that Boris's team practices daily.

## how does the Claude Code team ship 60-100 releases per day?

let that number sit for a moment.

Most software teams ship weekly. Aggressive teams ship daily. The Claude Code team ships 60-100 internal releases per day. That's not a process problem. It's an architecture decision. The release pipeline is so fast that the cost of a release is nearly zero. Which means the cost of a mistake is nearly zero. Which means you ship fast and fix fast instead of planning slow and shipping slow.

This philosophy is embedded in Claude Code itself. Plan, execute, verify. If the execution is wrong, the context (CLAUDE.md rules) captures the lesson. Next execution avoids the mistake. The loop tightens.

For builders running Claude Code, the lesson is: treat your CLAUDE.md like the team treats their internal release pipeline. Every correction is a rule. Every rule makes the next session faster. The compounding is real.

## what to take from this

Boris Cherny's contribution isn't just Claude Code as a product. It's the validation of a paradigm.

The paradigm: the instructions you give the agent (CLAUDE.md, skill files, context files) are more valuable than the code the agent writes. The code is ephemeral. The context compounds.

Karpathy proved it in ML research with program.md. Boris proved it in software development with CLAUDE.md. Both demonstrated that the most productive workflow isn't writing more code. It's writing better instructions.

For GTM engineers, this means the same thing it means for developers. Your CLAUDE.md, your skill files, your voice system, your lessons.md. That's the infrastructure. The output is replaceable. The context is the asset.

## frequently asked questions

**who created Claude Code?**
Boris Cherny, Head of Claude Code at Anthropic. He joined Anthropic in September 2024 after five years as a Principal Engineer at Meta. He's also the author of "Programming TypeScript" (O'Reilly).

**how many people work on Claude Code?**
The Claude Code team is roughly 12 engineers. Despite the small team size, they ship 60-100 internal releases per day through an architecture that makes the cost of each release nearly zero.

**what is CLAUDE.md?**
CLAUDE.md is a project-level instruction file that Claude Code reads at the start of every session. It contains rules, constraints, workflow instructions, and accumulated lessons specific to your project. It's the primary mechanism for making the agent smarter over time without changing the model itself.

**how does Boris Cherny ship 20-30 PRs a day?**
He runs 5 parallel Claude Code instances across 5 terminal tabs, each on a separate checkout. He starts in plan mode, iterates until the approach is right, then executes the implementation. The parallel sessions multiply throughput. The CLAUDE.md file ensures consistency across all sessions.

---

*[6 weeks of building with Claude Code](https://shawnos.ai/blog/6-weeks-of-building-with-claude-code) · [Claude Code 1M context window](https://shawnos.ai/blog/claude-code-1m-context-window) · [who is Andrej Karpathy](https://shawnos.ai/blog/who-is-andrej-karpathy) · [Karpathy repos for GTM engineers](https://thegtmos.ai/blog/karpathy-repos-for-gtm-engineers) · [context engineering vs prompt engineering](https://shawnos.ai/how-to/context-engineering-vs-prompt-engineering)*

shawn ⚡ GTM Engineer
