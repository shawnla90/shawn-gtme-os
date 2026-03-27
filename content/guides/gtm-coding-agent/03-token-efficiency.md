---
title: "Token Efficiency"
subtitle: "How to manage your context window without burning money or losing coherence."
part: 1
order: 3
date: "2026-03-27"
---

Last month I watched someone burn through $47 in API credits in a single afternoon. They were building an account enrichment workflow. Solid idea: pull a list of target accounts from Apollo, enrich each one with recent news, score them, and push the top results into HubSpot.

The problem was not the workflow. The problem was that they were passing the entire Apollo API response (every field, every data point, every metadata property) into the context for each enrichment step. Each company record was 3,000 tokens. Fifty companies meant 150,000 tokens of raw API data crammed into the context window, most of it fields like `organization_id` and `apollo_internal_score` that had zero relevance to the enrichment task.

They restructured it that evening. Filtered the API response down to five fields (company name, industry, employee count, recent funding, description). Each record dropped to 200 tokens. Fifty companies became 10,000 tokens instead of 150,000. Same output quality. The enrichment agent actually performed better because it was not wading through noise.

Their daily API cost for that workflow dropped from ~$15 to ~$1.50.

This is token efficiency. It is not about being cheap. It is about being precise with a finite resource so your agent has room to think and your budget has room to breathe.

## What Are Tokens, Practically Speaking?

Tokens are how AI models measure text. One token is roughly 4 characters or about 3/4 of a word. The word "positioning" is 3 tokens. The sentence "Our ICP is VP of Engineering at mid-market SaaS companies" is about 14 tokens.

Here are some reference points to build intuition:

| Text | Approximate Tokens |
|------|-------------------|
| A tweet (280 characters) | ~70 |
| A cold email (100 words) | ~130 |
| A one-page ICP document | ~500-800 |
| A full competitor analysis | ~2,000-4,000 |
| A 2,000-word blog post | ~2,700 |
| An entire CLAUDE.md (well-structured) | ~500-2,000 |
| A raw Apollo API response for one company | ~2,000-3,000 |
| This chapter you are reading right now | ~4,000 |

Why should you care? Two reasons.

**Context windows have limits.** Claude can hold 200K tokens at once. That is big, but it is not infinite. And the agent needs a significant portion of that window for its own thinking, planning, and output generation. You are not working with the full 200K.

**API calls cost money per token.** If you are using the API for automation (cron jobs, enrichment pipelines, multi-step workflows), every token you send and receive has a price. Sloppy context means higher bills. On a subscription plan, tokens do not cost you per-call, but context window limits still apply. Stuffing 180K tokens of irrelevant context leaves only 20K tokens for the agent to think, read new files, and generate output. You are choking it.

## How the Context Window Actually Fills Up

Claude's 200K-token context window sounds enormous. Here is how it actually gets used during a typical GTM session:

| What | Approximate Tokens |
|------|-------------------|
| Your CLAUDE.md | 500-2,000 |
| System prompt + tool definitions | 3,000-5,000 |
| Conversation so far (20 exchanges) | 5,000-15,000 |
| 3 files the agent reads (ICP, positioning, competitors) | 3,000-6,000 |
| A Python script the agent writes and runs | 1,000-3,000 |
| Script output (API results, CSV data) | 2,000-50,000+ |
| Agent's reasoning and planning | 5,000-20,000 |

A single enrichment workflow that pulls 200 company records can eat 50K tokens just in API response data. Add your conversation history, CLAUDE.md, and the files it read to plan the work, and you are at 80K tokens before the agent starts its second task.

The lesson: bigger is not always better. A 200K window does not mean you should use 200K tokens. It means you have headroom for complex tasks, if you are disciplined about what goes in.

## What a Typical GTM Session Actually Costs

Let me break down real numbers so this is concrete.

**Subscription users (Claude Pro at $20/month, Claude Max at $100-200/month):** You do not pay per token. But you have rate limits. Claude Pro gives you roughly 45 Opus messages per day (more for Sonnet). Claude Max raises that significantly. Token efficiency matters here because each message that requires the agent to re-read bloated context is a message you could have spent on actual work.

**API users (building automation):** Here is where token math gets real.

Current approximate API pricing for Claude Sonnet (the model most people use for automation):

- Input tokens: ~$3 per million tokens
- Output tokens: ~$15 per million tokens

A well-structured enrichment workflow:
- Input per call: ~5K tokens (CLAUDE.md + ICP + filtered API data) = $0.015
- Output per call: ~1K tokens (enrichment summary) = $0.015
- Cost per company: ~$0.03
- 50 companies: ~$1.50
- Running daily: ~$45/month

The same workflow with bloated context:
- Input per call: ~50K tokens (everything dumped in raw) = $0.15
- Output per call: ~1K tokens = $0.015
- Cost per company: ~$0.165
- 50 companies: ~$8.25
- Running daily: ~$247/month

That is $45/month vs $247/month for the same output. The only difference is context hygiene.

For Opus (the most capable model, used for complex reasoning tasks), multiply those costs by roughly 5x. Token efficiency matters even more.

## The Shoemaker's Children Problem

GTM people are professional communicators. You craft emails that get responses in 50 words. You write subject lines that get opened in 5 words. You build decks that tell a story in 10 slides.

Then you open an AI tool and dump in an entire blog post when you need the key thesis. A full CRM export when you need 10 accounts. Three pages of instructions when a three-line CLAUDE.md section would do. Your entire competitive landscape when the agent only needs one competitor.

This is the shoemaker's children problem. The cobbler's kids have no shoes. The GTM operator who crafts tight messages for prospects sends unstructured walls of text to their AI tools.

Apply the same discipline to your AI context that you apply to your outbound. Be concise. Be structured. Lead with what matters.

## Token Budgets: A Practical Framework

Think of your context window as a budget. Here is how to allocate it for a 200K window:

```
Total budget: 200,000 tokens

Reserved for agent thinking:     40,000  (20%)
Reserved for output generation:  30,000  (15%)
CLAUDE.md + system context:       5,000  (2.5%)
Conversation history:            15,000  (7.5%)
Available for task context:     110,000  (55%)
```

That "available for task context" is what you actually control. It is the files the agent reads, the data it processes, and the results it works with.

For most GTM tasks, you need far less than 110K tokens of context. Here is what typical tasks actually require:

| GTM Task | Context Needed |
|----------|---------------|
| Write a cold email sequence | ~3K tokens (ICP + positioning + voice profile) |
| Analyze a competitor | ~5K tokens (their website content + your positioning) |
| Build an account list | ~2K tokens (ICP) + API response data |
| Create a content piece | ~6K tokens (voice DNA + topic research + examples) |
| Qualify a lead | ~4K tokens (ICP + signals + the lead's data) |

**The 80/20 rule: most GTM tasks need fewer than 10K tokens of well-structured context.** The rest of your budget is headroom for the agent to think, execute, and handle unexpected complexity.

## The 1M Context Window: What It Changes (and What It Does Not)

Claude now supports a 1 million token context window. That is 750,000 words. Five novels. An entire codebase. A year of email correspondence.

This changes some things. You can now feed the agent an entire quarter's worth of deal notes and ask it to identify patterns. You can give it your full competitor landscape, all ten competitors, raw website content and all, and still have room for analysis. Long research tasks that used to require breaking work into subagent chunks can now happen in a single session.

But here is what it does not change: the garbage in, garbage out principle.

A 1M token window does not make bloated context okay. It makes it less likely to cause a hard failure (running out of space), but it does not make the output better. An agent with 800K tokens of raw, unfiltered data and 200K tokens of headroom will produce worse output than an agent with 10K tokens of clean, structured context and 990K tokens of headroom. More noise does not become signal just because you have room for it.

The 1M window is best thought of as insurance. It means complex tasks do not break. It means you can be less paranoid about reading a few extra files. It means a multi-step workflow that accumulates context over 50 messages does not hit a wall.

It does not mean you should stop thinking about token efficiency. In fact, the operators who benefit most from the 1M window are the ones who were already disciplined about context. They use the extra space for genuinely complex tasks, not as an excuse to be sloppy.

Think of it like hard drive space. When drives went from 500GB to 2TB, organized people got room for bigger projects. Messy people just accumulated more junk.

## Before and After: Token-Efficient Workflows

Let me show you the difference between a wasteful and efficient approach to the same task.

**Task: Enrich 20 target accounts with recent news and generate personalized first lines.**

### The wasteful way

```
You: Here are my 20 target accounts [pastes a full CRM export
     with 50 fields per account, 1,000 tokens each = 20,000 tokens].
     Research each one and write personalized first lines.
     My ICP is VP of Engineering at SaaS companies with 50-500
     employees [re-explains ICP in chat instead of referencing file].
     Our product is [200 words about the product].
     Write in a casual tone, similar to [pastes 3 example emails].
```

Context consumed: ~25,000 tokens before the agent even starts working. The CRM export includes fields like `hubspot_owner_id`, `lifecycle_stage`, and `last_activity_date` that have nothing to do with personalization. The agent has to parse through all of it to find the company name, industry, and a useful data point.

### The efficient way

```
You: Read demand/icp.md and voice/profile.md.
     Then read output/accounts/target-20.csv (it has company name,
     industry, employee count, and one-line description).
     Enrich each with Exa for recent news. Write a personalized
     first line for each. Save to output/first-lines/[date].md.
```

Context consumed: ~3,000 tokens. The ICP file is 800 tokens. The voice profile is 500 tokens. The trimmed CSV is 1,500 tokens (20 accounts * 75 tokens each). The agent has everything it needs and nothing it does not.

The output quality is better in the second scenario, not just cheaper. When the agent is not wading through 50 irrelevant CRM fields per account, it focuses its attention on the data that actually matters for personalization.

## Subagents: Divide and Conquer

Here is a scenario: you want to research 5 competitors, then write positioning that differentiates you from all of them.

If you do this in one session, the agent reads each competitor's website (7-11K tokens each). By the time it has read all five, there are 45K tokens of raw website content in context. The agent is wading through navigation menus, footer links, and pricing tables to find the relevant positioning claims.

The subagent approach breaks this into clean stages:

```
Main agent task: "Write positioning that differentiates us"

  Subagent 1: "Research competitor 1. Return: positioning claim,
               target buyer, key differentiators. Max 200 words."
  Subagent 2: "Research competitor 2. Same format."
  Subagent 3-5: Same pattern.

Main agent receives: 5 structured summaries (~1K tokens total)
Main agent writes positioning with clean, distilled context
```

In Claude Code, you achieve this naturally by telling the agent to research and save results to files:

```
> Research these 5 competitors and save a summary of each one's
> positioning to gtm-os/demand/competitors.md. Then use those
> summaries to draft our positioning in gtm-os/demand/positioning.md.
```

The agent handles the research in contained steps, saves distilled results to files, then reads those files for the final task. The raw website content never pollutes the main context.

This is the same principle behind why your GTM workspace has separate files for ICP, positioning, and competitors instead of one giant document. Each file is a clean, bounded piece of context the agent can load when needed.

## Practical Strategies for Staying Lean

### 1. Use structured markdown

AI models parse markdown faster and more accurately than plain text. Headers, bullet points, and tables give the model clear structure to navigate.

```markdown
# Bad: wall of text
Our ideal customer is a VP of Engineering at a mid-market SaaS company
with 50 to 500 employees who is currently evaluating developer tools
and has budget authority and is based in the United States or Canada
and has been in role for at least 6 months...

# Good: structured markdown
## ICP
- **Title:** VP of Engineering
- **Company size:** 50-500 employees
- **Industry:** SaaS
- **Geo:** US, Canada
- **Trigger:** Evaluating developer tools
- **Qualifier:** Budget authority, 6+ months in role
```

Same information. Fewer tokens. Easier for the agent to parse, reference, and apply correctly.

### 2. Reference files instead of pasting content

```
# Bad: pasting into chat
"Here's my ICP: [500 words of ICP pasted into chat]"

# Good: letting the agent read the file
"Read gtm-os/demand/icp.md and use it to write outbound emails"
```

When you paste content into chat, it stays in the conversation history forever, eating tokens on every subsequent message. When the agent reads a file, it processes the information once. In a 30-message session, a 500-word paste costs you 500 tokens * 30 = 15,000 tokens of cumulative context. A file reference costs you once.

### 3. Use .claude/ skills for repeatable tasks

If you have a task you run repeatedly, create a skill file in `.claude/` that contains the instructions. The agent loads it on demand instead of you explaining the task every time.

```
.claude/
  commands/
    write-sequence.md     # Instructions for writing email sequences
    enrich-accounts.md    # Instructions for enrichment workflows
    analyze-competitor.md # Instructions for competitive analysis
```

Then you invoke the skill instead of re-explaining the workflow. The instructions load only when needed.

### 4. Start fresh sessions frequently

Long conversations accumulate context. If you are 30 messages deep and the agent is getting slow or confused, start a new session. Your CLAUDE.md and files persist. The conversation history does not need to. The agent picks up right where it left off because the workspace is the memory, not the chat.

I start a new session for every distinct task. Write outbound: new session. Build account list: new session. Analyze competitor: new session. Each one starts clean with only the context it needs.

### 5. Be specific about what you need

```
# Bad: vague request
"Help me with outbound"

# Good: specific request
"Read gtm-os/demand/icp.md and write 3 cold email variants
targeting the VP of Engineering persona. Use the pain points
from gtm-os/demand/objections.md for the hooks."
```

Specific requests let the agent load targeted context. Vague requests force it to read broadly, burning tokens on files that might not be relevant. The specific version also produces better output because the agent knows exactly what you want.

### 6. Filter API responses before they enter context

This is the single highest-impact strategy for automation workflows. Most APIs return 30-50 fields per record. You usually need 3-5.

Write your scripts to filter API responses before the agent sees them. If you are pulling from Apollo, extract company name, industry, employee count, and description. Drop everything else. Your enrichment agent does not need `apollo_account_id` to write a personalized first line.

## The Compound Effect

Token efficiency is not something you think about once. It is a habit that compounds.

A well-structured workspace means every session starts with less overhead. Clean file references mean less repetition. Filtered API responses mean less noise. Specific requests mean less wasted exploration.

Over a month, the difference between a disciplined and undisciplined operator is not 2x. It is 10x. Ten times more tasks completed per session. Ten times lower API costs. Ten times better output quality because the agent is always working from clean context.

This is the same principle behind clean code, clean pipelines, clean data. The GTM operators who treat their AI workspace with the same rigor they treat their CRM hygiene are the ones producing disproportionate results.

You do not need a bigger context window. You need a cleaner one.

---

*For the hands-on version with exercises, see [Chapter 03 on GitHub](https://github.com/shawnla90/gtm-coding-agent/blob/main/chapters/03-token-efficiency.md).*

**Next:** [Chapter 04 - OAuth, CLI, and APIs](/guides/gtm-coding-agent/04-oauth-cli-apis) -- Three ways to connect GTM tools to your coding agent, and when to use each.
