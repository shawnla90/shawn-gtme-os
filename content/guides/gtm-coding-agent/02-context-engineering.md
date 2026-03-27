---
title: "Context Engineering"
subtitle: "The quality of your output is determined by the quality of your context, not your prompt."
part: 1
order: 2
date: "2026-03-27"
---

A friend of mine runs outbound for a Series B startup. Smart operator. Knows his buyer, knows his product, writes solid copy. Last year he started using AI for email generation and was immediately disappointed. "The output is generic," he told me. "It writes like a college intern who read our website once."

I asked him to show me his process. He opened ChatGPT, typed "Write a cold email to a VP of Engineering at a mid-market SaaS company about our developer productivity platform," and hit enter. The AI produced something grammatically correct and utterly forgettable.

Then I asked him to show me his Notion workspace. He had *incredible* context documented there. A detailed ICP with psychographic notes. A competitor matrix he updated monthly. A positioning doc refined over 40 customer conversations. A swipe file of emails that actually got replies. All of it sitting in Notion, completely invisible to the AI.

"The AI is not the problem," I told him. "Your context delivery is the problem. You have everything it needs. You are just not giving it any of it."

That conversation is basically the thesis of this chapter. The gap between mediocre AI output and great AI output is almost never the model. It is the context.

## What Is a Context Window?

Before we get into engineering, you need to understand the raw material.

A context window is how much an AI can "see" at once. Think of it as the agent's working memory. Everything the AI considers when generating a response, your instructions, the files it has read, the conversation so far, its own system prompt, all of it has to fit inside this window.

Claude's context window is 200,000 tokens. A token is roughly 4 characters or 3/4 of a word. So 200K tokens is about 150,000 words, roughly two full novels.

That sounds like a lot. It is. But it fills up faster than you think when an agent is reading multiple files, running commands, and tracking a multi-step conversation.

The point: context is a finite resource. What you put in it matters. What you leave out matters just as much. Context engineering is the skill of making every token count.

## Structured Context vs Chat History

Most people's experience with AI context looks like this:

```
User: Help me write a cold email
AI:   Sure, who's the target?
User: VP of Engineering at mid-market SaaS
AI:   What's your product?
User: [3 paragraphs about the product]
AI:   Here's a draft...
User: No, that's too formal. I write more casually.
AI:   Here's a revised draft...
User: Also I forgot to mention we compete with Outreach
AI:   Here's another revision...
```

Six messages in, the AI finally has the context it needs, scattered across a conversation, mixed with corrections and false starts. This is **unstructured context**. It works, barely, for one-off tasks. It falls apart completely for anything you need to do more than once.

Here is why it falls apart. Tomorrow you need another email for a different persona. You either start over (re-explaining your product, your voice, your competitors) or you continue in the same bloated conversation (where the AI has to wade through yesterday's false starts to find the context it needs). Neither option is good. You are rebuilding the same context from scratch every single time or hoping the AI can extract signal from noise.

**Structured context** looks like this:

```
gtm-os/
  demand/
    icp.md              # Who you sell to
    positioning.md      # Why they should care
    competitors.md      # Who you're up against
    objections.md       # What pushback you'll hear
  messaging/
    attack-angles.md    # Your best entry points
  CLAUDE.md               # How to use all of the above
```

When a coding agent opens this workspace, it does not need you to explain your product, your buyer, your competitors, or your voice in the chat. It reads the files. Every time. Consistently. Without you repeating yourself.

My friend with the Notion workspace had all of this knowledge. It was just trapped in a tool the AI could not access. The fix was not a better prompt. The fix was moving his context into files the agent could read.

This is the fundamental shift: **instead of writing better prompts, build better workspaces.**

## The Layer Order That Matters

Not all context is equal. When you are building structured context for an agent, there is a hierarchy that determines how well the agent performs. Get the order wrong and even great domain knowledge produces mediocre results.

### Layer 1: Identity

Who is this agent? What is its role?

```markdown
# Identity
You are a GTM operating assistant for Acme Corp.
Your job is to help the team build and execute outbound campaigns
targeting VP of Engineering at mid-market SaaS companies.
```

This goes first because it frames everything else. An agent that knows it is a "GTM operating assistant for Acme Corp" interprets every subsequent instruction through that lens. It does not try to be a general-purpose helper. It does not over-explain basic GTM concepts to you. It operates within its role.

Think of it this way. If you hired a new SDR and their first day of onboarding was just a pile of product docs with no explanation of their role, they would be lost. Identity is the first sentence of the job description: "You are an SDR. Your job is to book qualified meetings."

### Layer 2: Rules

Hard constraints. Non-negotiable behaviors.

```markdown
# Rules
- Always ask one question at a time during assessment.
- Be direct. No corporate speak.
- Never fabricate tool capabilities.
- Treat business context as confidential.
- When writing outbound, never mention competitors by name.
- If you don't know the answer, say so. Don't guess.
```

Rules override everything else. If your domain knowledge says "use enthusiasm to match our brand voice" but your rules say "no corporate speak," the rules win. This is where you encode the guardrails that prevent the agent from doing things that would embarrass you.

In practice, most people skip this layer and then wonder why the agent goes off the rails. It is the same reason a new hire with no guidelines will make bad judgment calls. Not because they are incompetent, but because they do not know where the boundaries are.

A few rules I have found essential for GTM agents specifically: never fabricate data (the agent will confidently make up statistics if you do not tell it not to), never claim capabilities the tools do not have, and always reference actual files instead of hallucinating content.

### Layer 3: Workflow

What does the agent do, step by step?

```markdown
# Workflows
## Write Outbound Email
1. Read gtm-os/demand/icp.md for targeting context
2. Read gtm-os/demand/positioning.md for value props
3. Read gtm-os/messaging/attack-angles.md for entry points
4. Check if voice/profile.md exists; if so, match the tone
5. Draft 3 variants with different hooks
6. Save to gtm-os/output/emails/[date]-outbound.md
```

Workflows give the agent a playbook. Without them, the agent improvises. Sometimes improvisation is fine, like when you are exploring a new idea. But for repeatable GTM processes, you want the playbook.

The key detail: notice how the workflow references specific file paths. It does not say "use the ICP." It says "Read gtm-os/demand/icp.md." This precision matters. An agent given a vague workflow will make assumptions about where files are. An agent given specific paths will find the right context every time.

You can have as many workflows as you need. Write outbound email. Enrich a lead list. Analyze a competitor. Generate content. Each one is a step-by-step playbook the agent follows when you invoke that task.

### Layer 4: Domain Knowledge

The ICP, positioning, competitor intel, voice profile, tool documentation. Everything the agent needs to know about your specific business.

This layer is the largest but the least important *structurally*. That sounds counterintuitive. Here is why: a well-identified agent with clear rules and a solid workflow will produce good output even with thin domain knowledge. It will ask good questions to fill in the gaps. A poorly identified agent with no rules will produce garbage even if you dump your entire Notion workspace into it, because it does not know how to use that knowledge.

**The order matters: Identity > Rules > Workflow > Domain Knowledge.** Build from the top down.

## Walking Through a Real CLAUDE.md

Let me show you what this looks like in practice. This is a simplified version of a CLAUDE.md for an outbound-focused GTM workspace:

```markdown
# Acme Corp GTM Agent

## Identity
You are the GTM execution agent for Acme Corp, a developer
productivity platform. You help the team build target account
lists, write personalized outbound, and track campaign performance.

## Rules
- Direct tone. Write like a human, not a brochure.
- Never mention competitor names in outbound copy.
- All data enrichment must use real API calls. Never fabricate data.
- Keep emails under 150 words. Subject lines under 8 words.
- When unsure about a prospect's pain point, ask rather than guess.

## Workflows
### Build Target Account List
1. Read demand/icp.md
2. Use Apollo API to pull matching companies
3. Enrich with Exa for recent news/signals
4. Score based on criteria in demand/scoring.md
5. Save top accounts to output/accounts/[date].csv

### Write Outbound Sequence
1. Read demand/icp.md + demand/positioning.md
2. Read messaging/attack-angles.md
3. If voice/profile.md exists, match the tone
4. Generate 5-email sequence with escalating value
5. Save to output/sequences/[date]-[persona].md

### Analyze Competitor
1. Read demand/competitors.md for existing intel
2. Scrape competitor's website for current messaging
3. Compare positioning against demand/positioning.md
4. Identify gaps and opportunities
5. Update demand/competitors.md with findings

## Reference Paths
- ICP: demand/icp.md
- Positioning: demand/positioning.md
- Competitors: demand/competitors.md
- Voice: voice/profile.md
- Scoring: demand/scoring.md
```

Notice a few things. The CLAUDE.md itself is under 1,500 words. It does not contain the ICP or the positioning or the competitor analysis. It *points* to those files. The agent reads them on demand, only when a workflow calls for them. This is the routing principle: CLAUDE.md is the table of contents, not the encyclopedia.

Also notice how each workflow is a numbered sequence with specific file paths. There is no ambiguity. The agent does not have to guess what "use the ICP" means. It knows to read `demand/icp.md`.

## Context Debt: What Happens When Your Workspace Gets Messy

Here is something nobody tells you about structured context: it degrades over time, just like code.

You start with a clean workspace. Your ICP is accurate. Your positioning reflects your latest messaging. Your competitor analysis is current. The agent produces great output because it is working from great context.

Three months later, you have closed 20 more deals and learned that your ICP is actually shifting. Your positioning evolved after a rebrand. Two new competitors entered your market. But your files still reflect the old reality.

This is context debt. It is the gap between what your files say and what is actually true about your business. And it compounds, because every output the agent produces based on stale context reinforces the old thinking.

Context debt shows up in subtle ways. The agent writes outbound copy that sounds slightly off. The target account lists miss companies you know should be there. The competitor analysis does not mention the startup that just raised $50M and is eating your lunch.

The fix is the same as the fix for technical debt: regular maintenance. I recommend a monthly review where you ask yourself four questions:

1. Is my ICP file still accurate? Did last month's wins and losses teach me anything new?
2. Is my positioning file current? Have I changed how I talk about the product?
3. Is my competitor file complete? Has anyone new entered the market?
4. Is my CLAUDE.md routing to the right files? Have I added new files it should know about?

This takes 30 minutes. That 30 minutes protects every output the agent produces for the next month. It is the highest-ROI maintenance you can do.

## CLAUDE.md Is Not a Prompt

This is the most common misconception. People hear "put instructions in CLAUDE.md" and think it is like writing a system prompt for ChatGPT. It is not.

A prompt is a one-time input. You write it, the AI reads it, you get a response. Done.

CLAUDE.md is an **operating manual**. It persists across sessions. Every time you open Claude Code (or Cursor) in a project folder, the agent reads CLAUDE.md first. It shapes every interaction, every file read, every command the agent runs.

Here is the difference in practice:

**Prompt approach:**
> "You are a GTM assistant. When I ask you to write emails, use a casual tone, reference my ICP which is VP of Engineering at companies with 50-500 employees, and avoid mentioning competitors by name."

You have to paste this every session. Or save it somewhere and copy it in. And it only covers email writing. What about when you want to build a target list? Or analyze a competitor? Or generate content? You need a different prompt for each task.

**CLAUDE.md approach:**
The agent reads the operating manual once, at the start of every session, and knows how to handle any task you throw at it. Your ICP context is in a file. Your positioning is in a file. Your workflows are defined. You just say "write outbound for the CTO persona" and the agent knows exactly which files to read, what rules to follow, and what format to use.

The compounding effect here is real. Every hour you invest in your CLAUDE.md and workspace structure pays dividends across every future session. A good prompt saves you time once. A good CLAUDE.md saves you time forever.

## The Common Mistake: One Giant Document

The worst thing you can do is dump everything into a single document. Your ICP, your positioning, your competitor analysis, your voice profile, your workflow instructions, your rules, all in one 5,000-word CLAUDE.md.

Why this fails:

**It wastes tokens.** The agent reads the whole thing every session, even when it only needs your ICP for the current task. If your CLAUDE.md is 5,000 words and the agent only needs your competitor info, that is 4,500 words of irrelevant context eating into your context window.

**It is hard to maintain.** When your positioning changes, you are editing a massive document instead of updating one file. You will eventually get lazy about updates, and then context debt creeps in.

**It confuses priority.** The agent cannot tell what is a rule versus what is background context when everything is mixed together. Rules should be inviolable. Domain knowledge is reference material. Mixing them dilutes the rules.

The fix: **CLAUDE.md is the routing layer. Separate files hold the knowledge.**

```markdown
# Good: CLAUDE.md points to files
## Reference Paths
- ICP: gtm-os/demand/icp.md
- Positioning: gtm-os/demand/positioning.md

# Bad: CLAUDE.md contains everything
## ICP
Our ideal customer is VP of Engineering at mid-market SaaS companies
with 50-500 employees headquartered in the US who are currently using
[8 more paragraphs]...
```

I have seen CLAUDE.md files that are 8,000 words. They work, technically. But they work like a desk piled three feet high with papers works. You can find things if you dig. It is just not a system anyone would choose to build.

## The Mindset

Stop thinking about prompt engineering. Start thinking about **workspace engineering**.

The question is not "how do I write a better prompt?" The question is:

- What files should exist in this project?
- What structure makes them easy for an agent to find and read?
- What instructions does the agent need to use those files effectively?
- What rules prevent the agent from going off the rails?

This is a fundamentally different skill than prompting. Prompting is about crafting one perfect message. Context engineering is about building an environment where even a mediocre message produces great output because the workspace is doing the heavy lifting.

If you come from a GTM background, you already have a version of this skill. Think about how you set up a new SDR. You do not just say "go book meetings." You give them an ICP doc, a battlecard, a talk track, a list of accounts, and access to the tools they need. Then you say "go book meetings" and they actually can, because the workspace is set up.

Context engineering is onboarding for agents. Do it well and the agent performs. Skip it and the agent flounders, just like a new hire with no enablement.

Build the workspace. The prompts take care of themselves.

---

*For the hands-on version with exercises, see [Chapter 02 on GitHub](https://github.com/shawnla90/gtm-coding-agent/blob/main/chapters/02-context-engineering.md).*

**Next:** [Chapter 03 - Token Efficiency](/guides/gtm-coding-agent/03-token-efficiency) -- How to manage your context window without burning money or losing coherence.
