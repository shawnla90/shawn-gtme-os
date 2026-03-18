---
title: "karpathy's repos and what GTM engineers should take from each one"
date: "2026-03-17"
excerpt: "Andrej Karpathy's GitHub isn't just ML research. Each repo demonstrates an architecture pattern that applies directly to GTM systems. Here's the breakdown."
category: "methodology"
featured: false
---

## why a GTM engineer is reading ML repos

I don't train neural networks. I build enrichment pipelines, content systems, and automated outbound campaigns. But the architecture patterns in Karpathy's repos transfer directly.

Every one of his projects follows the same design philosophy: minimal surface area, clear metric, compounding loop. That's the same philosophy behind every production GTM system I've built.

This is not an ML tutorial. It's a GTM engineer reading each repo for the structural lessons.

For the broader context on why Karpathy matters to builders, see [who is Andrej Karpathy](https://shawnos.ai/blog/who-is-andrej-karpathy).

## micrograd: the smallest version that teaches the mechanism

[github.com/karpathy/micrograd](https://github.com/karpathy/micrograd)

A neural network engine in roughly 100 lines. Backpropagation over a dynamically built computation graph. The entire thing fits in one file.

**GTM takeaway: the smallest version that works is the version you should ship first.**

I've watched teams spend months building elaborate Clay table architectures before they've enriched a single account. Micrograd says: build the minimal version. One table. One enrichment. One output. Prove the mechanism works. Then add complexity.

The 100-line version teaches you more than the 10,000-line version because you can see every moving part. Same principle in GTM. A 5-row Clay table teaches you more about your enrichment architecture than a 5,000-row table because you can verify every output.

## nanoGPT: reproducing the big thing on your own machine

[github.com/karpathy/nanoGPT](https://github.com/karpathy/nanoGPT)

GPT-2 training compressed to something one person can run. What took a research team, one developer can now reproduce, understand, and modify.

**GTM takeaway: you don't need the enterprise stack to produce enterprise results.**

The parallel is direct. Enterprise companies run Salesforce, Marketo, 6-tool enrichment waterfalls, dedicated RevOps teams. A solo GTM engineer with Apollo's API, Supabase, and a Mac Mini running crons can reproduce 80% of that pipeline. Not approximate it. Actually reproduce the output.

NanoGPT proved that the gap between "research lab result" and "individual contributor result" is mostly infrastructure, not capability. Same is true in GTM. The gap between an enterprise outbound operation and a solo operator is shrinking every quarter.

## llm.c: removing the abstraction layers

[github.com/karpathy/llm.c](https://github.com/karpathy/llm.c)

GPT training rewritten in C and CUDA. No Python. No frameworks. No package managers. Just the math running on hardware.

**GTM takeaway: know what the framework is doing for you. Decide if you need it.**

Every GTM tool adds abstraction. Clay abstracts API calls into visual columns. Instantly abstracts email sending into campaign UIs. These abstractions are valuable. They make complex operations accessible.

But they also hide the cost. Clay's HTTP column metering your API calls. Instantly's warmup consuming your sending reputation. When you understand what happens at the C level (the API call, the SMTP transaction, the DNS lookup), you can decide which abstraction is worth paying for and which one you can handle yourself.

This is why I moved my [Apollo sourcing to direct API calls](https://shawnos.ai/blog/apollo-should-be-your-first-run). Not because Clay's enrichment doesn't work. Because understanding the raw operation revealed that one API call returns everything a 6-step waterfall was trying to assemble.

## minbpe: the preprocessing that everyone ignores

[github.com/karpathy/minbpe](https://github.com/karpathy/minbpe)

Byte Pair Encoding. The tokenization step that happens before any LLM training. Most people skip it. Karpathy made it the entire repo.

**GTM takeaway: the preprocessing is where the leverage lives.**

In GTM, preprocessing is data normalization. Title standardization. MX record classification. Company name deduplication. Domain parsing. These aren't sexy. Nobody posts LinkedIn carousels about them.

But a pipeline with clean preprocessing converts at 2-3x the rate of one running on raw data. An MX-classified lead list routes correctly to LinkedIn or email. A title-standardized contact list scores accurately instead of miscategorizing "VP, Revenue" and "Vice President of Revenue" as different seniority levels.

The tokenizer determines what the model can learn. The preprocessing determines what your pipeline can qualify. Both are invisible. Both are essential.

## autoresearch: the loop that compounds

[github.com/karpathy/autoresearch](https://github.com/karpathy/autoresearch)

Three files. One agent. Indefinite autonomous iteration. Modify code, run experiment, evaluate, keep or discard, repeat. 12 experiments per hour. 100 overnight.

**GTM takeaway: autonomous agent loops are the future of every operational system.**

This is the one I wrote about [in detail](https://shawnos.ai/blog/karpathy-autoresearch-autonomous-agents). The [autonomous agent loops wiki entry](https://thegtmos.ai/how-to/autonomous-agent-loops) maps the pattern to GTM specifically.

The short version: any workflow with a clear metric and a constrained action space can run this loop. Content pipelines. Email variants. Enrichment sequences. The metric changes (voice consistency, reply rate, data completeness) but the loop is identical.

The constraint design is the key lesson. Autoresearch works because the agent can only modify one file. Give it unlimited scope and it wanders. Give it one file and one number, it optimizes.

## microgpt: everything in one file

[github.com/karpathy/microgpt](https://github.com/karpathy/microgpt)

200 lines. Zero dependencies. Dataset, tokenizer, autograd, model, optimizer, training, inference. All of it.

**GTM takeaway: if you can't explain your pipeline in one page, you don't understand it.**

I keep a one-page architecture diagram of my entire GTM pipeline. Exa discovers. Apollo enriches. Grok generates. Supabase stores. Attio qualifies. Lemlist sequences. PostHog tracks. If any step requires more than a sentence to explain, the architecture needs simplification.

Microgpt is the proof that the most complex systems can be compressed to their essence. Not as a toy, but as a working system. The compression forces clarity. Clarity enables optimization.

## the meta-lesson

Karpathy doesn't build complex systems. He builds simple systems that produce complex results through iteration.

That's the GTM engineering thesis. The pipeline is simple. The compounding is complex. One enrichment, one score, one route, one message. Repeated a thousand times with feedback loops. The loop, not the individual step, is what produces results.

Every repo in this list demonstrates it. Start minimal. Define the metric. Let the loop run.

---

*[who is Andrej Karpathy](https://shawnos.ai/blog/who-is-andrej-karpathy) · [autoresearch blog](https://shawnos.ai/blog/karpathy-autoresearch-autonomous-agents) · [autonomous agent loops wiki](https://thegtmos.ai/how-to/autonomous-agent-loops) · [Karpathy repos explained wiki](https://thegtmos.ai/how-to/karpathy-repos-explained)*

shawn ⚡ GTM Engineer
