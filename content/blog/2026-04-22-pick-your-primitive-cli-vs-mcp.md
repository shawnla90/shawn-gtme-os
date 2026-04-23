---
title: "Pick Your Primitive: Why I Run CLI While Everyone's Hyping MCP"
date: "2026-04-22"
excerpt: "HubSpot's remote MCP went GA last week. Salesforce's is still beta. Salesforce put APIs, MCP, and CLI on equal footing at TDX with Headless 360. Here's why the primitive you pick decides what you can build — and why I'm all-in on CLI after running 5.94 billion cache-read tokens through it in 65 days."
category: "ships"
featured: true
---

# Pick Your Primitive: Why I Run CLI While Everyone's Hyping MCP

**tl;dr:** HubSpot's remote MCP went generally available on April 13, 2026. Salesforce's is still in beta. Salesforce put APIs, MCP, and CLI on equal footing at TDX on April 15 with Headless 360. The debate isn't really CLI vs MCP as technical primitives. It's about user skill level. MCP meets operators where they are before they've done the reps on coding-agent context engineering. CLI is where they're heading. Three surfaces, three skill levels. Here's how I got to that framing.

![Pick Your Primitive — at 100 deals, MCP's 600 HTTP requests redline the rate-limit wall with ~47 projected retries. CLI's 100 streaming calls have headroom. This is why the CLI learning curve pays off.](/blog/rate-limit-wall.gif)

## The post that kicked this off

Someone I respect posted a Thanos meme yesterday hyping the Salesforce MCP "coming out of beta." A VP RevOps, excited about agent-CRM integration, doing the distribution work.

The Salesforce MCP isn't actually out of beta yet. But that wasn't what stopped me. What stopped me was the quieter question underneath:

If I've been skipping MCP and going straight to the CLI, am I wrong?

I spent a couple hours stress-testing my own stance. The answer I came out with: not wrong, just not universal. The argument for MCP is real, it's just not for me. And probably not for anyone building anything that has to run reproducibly tomorrow.

Let me show the work.

## What's actually shipping

Three things happened in the last ten days that nobody is lining up in the same sentence:

**HubSpot remote MCP went GA on April 13, 2026.** You can connect any MCP-compatible AI tool to your HubSpot CRM over a HubSpot-hosted connection, OAuth 2.1 with PKCE, write access to CRM objects and engagements, read access to marketing, content, and organizational context. If you are on HubSpot and you want your reps chatting with a CRM agent in claude.ai, this is the moment.

**Salesforce's hosted MCP is still in beta.** GA was targeted for February, slipped, and as of today the docs still say beta with pricing subject to change. The DX MCP server (different product, for Apex/SOQL developer tooling) is also beta. So the meme hyping Salesforce MCP coming out of beta is running ahead of the actual ship.

**Salesforce announced Headless 360 at TDX on April 15, 2026.** This is the real moment. Every capability across Salesforce, Agentforce, and Slack is now positioned as accessible through three co-equal surfaces: APIs, MCP tools, and CLI commands. Sixty-plus new MCP tools. Thirty-plus preconfigured coding skills. Support called out explicitly for Claude Code, Cursor, Codex, and Windsurf — four CLI-first coding agents.

The framing is the news. MCP isn't winning. CLI isn't winning. Both are being handed the same keys.

## How I actually got here

I didn't read a blog and decide CLI was right. I bought a Cursor $200/mo plan, fired up every MCP server I could wire in, and was overloaded in the first few days. Not by the token bill — by the shape of the work. I couldn't train my team on any of it because the mental model for how context moved through a session wasn't transferable. Every new MCP-mediated task started from zero.

That's when I started defaulting to the CLI more out of survival. Only then did I realize how much more accurate it was.

The irony of that path: I thought MCP was a skill-level shortcut. It was actually a skill-level ceiling. Once I internalized how context actually moves through a Claude Code session — how prompts reuse, how cache accrues, how a script commits its reasoning to code — chatty tool calls started to feel like overhead. Before that internalization, they were the only thing standing between me and a blank terminal that didn't know what I wanted.

## Why I went CLI-first

Over the last sixty-five days my Claude Code usage looks like this: 5.94 billion cache-read tokens, 470 million cache-create tokens, 43 million output tokens, about 6,500 assistant messages. Peak day was April 11 at 7.8 million output tokens in a single day across 4,681 messages. That's across the builds that run my GTM stack: the Apollo → Claude → HubSpot enrichment engine, the nightly cron that refreshes ICP scores, the deploy pipeline for the three sites in my monorepo, the version-controlled CRM workflows I've been writing about.

The number to pay attention to is the 5.94 billion cache reads. That ratio only happens when the system is architected to sit in the same context and hit the same cache over and over. Chatty MCP sessions don't do that. Each tool call is an island. Each prompt pays full freight. The cache ratio I get isn't a Claude Code feature — it's a consequence of how CLI-direct scripts reuse context.

Every one of those workflows went CLI-first for the same four reasons:

Reproducibility. When I get a call to work, it becomes a script. The script gets committed. Tomorrow it runs without me. Next month a teammate reads it. Next year I audit the diff.

Token economics. A CLI-direct script makes one authenticated call per operation and lets the surrounding context be cached aggressively. An MCP session re-loads tool schemas every turn, re-parses response shapes every turn, and carries the overhead of tool discovery whether I use it or not. On 500 scored contacts overnight, the delta between "cache-read most of it" and "pay full prompt freight every turn" is not rounding error — it's the difference between a workflow that runs and one that stops being worth running.

Cache behavior. When my script calls the HubSpot Python SDK, the call itself is cached at the HTTP layer, the auth token is cached in the keychain, and the reasoning I did about the response is cached in the code. An MCP tool call is an island. Every island pays its own tax.

Ownership. If HubSpot renames a field in their MCP server tomorrow, every agent that talks to it gets the new name for free — which sounds great until the thing you wrote last week silently breaks. A CLI script I wrote breaks only when *I* change something. That is the version control you want when the system matters.

## The redundancy you can feel in MCP

This is the part most people discover by accident and then can't quite name.

When you use an MCP server from a chat interface — claude.ai, Cursor, ChatGPT desktop — every tool call is its own conversational turn. The agent asks for a schema, gets a response, reasons about what's in it, then asks for the next thing. There is no persistent script state between turns. There is no intermediate variable. There is no cached assumption.

So the same update-this-deal operation that takes one Python call takes five-to-seven MCP turns:

- turn: discover available tools
- turn: search deal by id
- turn: re-reason about the response shape, plan the next call
- turn: search the owner to get their internal id
- turn: issue the update
- turn: verify the write

Every turn is a round-trip. Every round-trip carries tokens, latency, and context drift. On a single deal update that feels fine. On a batch of two hundred, it's a structurally different shape of work.

That is what I mean when I say MCP is chatty. It's not about Anthropic's model or HubSpot's server. It's about the protocol having no persistent state between invocations. Each call really is an island.

The redundancy isn't theoretical. Here's the same task on a stopwatch:

![Speed delta: MCP takes 9.2 seconds over six HTTP round-trips. CLI takes 2.1 seconds in one streaming call. Same model.](/blog/speed-efficiency.gif)

## The frame I had wrong

First version of this post said "MCP is for agents that can't code. CLI is for agents that can." A RevOps leader pushed back in a comment thread and changed my mind. He was right.

The axis isn't agent capability. The axis is user skill level.

A Claude Code CLI session and a claude.ai MCP session are both running the same model. What's different is what the user brings to the interaction. MCP front-loads the decisions — the schema is pre-registered, the tools are named, the permissions are scoped. You don't have to know how context engineering works to make it useful. It's legible to an operator who has never opened a terminal.

CLI is the opposite. The session is wide open. You have to know what context to load, what file to reference, what prompt shape fits the task. When you have those reps, you move faster than any MCP session and at a fraction of the token cost. When you don't, you're staring at a blank screen trying to figure out what to type.

That's why the RevOps critique landed. MCP wasn't solving a protocol problem for him. It was solving a skill-distribution problem across his team. His reps aren't going to learn context engineering next quarter. MCP meets them where they are.

## Who MCP is actually for

**Operators who haven't done the reps on coding-agent context engineering yet.** That's the real audience. Most GTM people are here, and there's no shame in it — it's a learnable skill, not an innate one. MCP lowers the floor so they can get value from an agent without having to internalize how prompts reuse context, how caches accrue, or how a script becomes a unit of thinking.

**Enterprise admins rolling out agent access at scale.** HubSpot's remote MCP respects existing user permissions at the server layer, logs every write, authenticates via OAuth 2.1 with PKCE. That's an admin conversation that ends in "yes." An admin conversation about "my AE generated a personal access token and pasted it into a Python script" ends in "no."

**Teams that need schema stability.** When HubSpot updates the MCP, every user gets the new tools. For one builder that's a liability. For fifty reps, that's the only way change management can work.

If you're a RevOps leader rolling out agents to your AEs, MCP is the right primitive for where your team is right now. The people who should be hyping it are you.

## Who CLI is for

**Operators who have done the reps.** You know what context matters, what prompt shape fits, how to read the diff between a useful answer and a confident-sounding wrong one. You've internalized that a script is a better unit of thinking than a tool call.

At that skill level, three things become true at once. You own the full stack, so governance is a one-person conversation. You're going to write Python against the result anyway. You care more about reproducibility next quarter than conversational fluency today.

For that person, the MCP wrapper is overhead without benefit. You already know the API. You already have the token. Your agent can already read docs and make authenticated calls. The wrapper is solving a problem you don't have — and paying for it with round-trips.

The split isn't MCP versus CLI in the abstract. It's *the user's skill level versus the protocol's assumed user*. Match the tool to the reps you've actually done.

At single-deal scale, MCP is just expensive. At 100-deal scale, it's something structurally different — and once you do the token math, the learning curve justifies itself.

![Token economics: MCP rebuilds the same 4.5K schema every turn (27K wasted input tokens across 6 rebuilds) and pays full input rates. CLI caches the 15K prompt+tools context once and reads from it at $0.50/M. 3× cheaper, 4.4× faster, same deal.](/blog/token-economics.gif)

## The Headless 360 moment

Here is what makes Headless 360 the most important framing of this whole debate:

At TDX on April 15, Salesforce did not pick a side. The announcement put APIs, MCP tools, and CLI commands in the same sentence as three ways to address the same platform. It specifically called out the external coding agents: Claude Code, Cursor, Codex, Windsurf. Those are CLI-first tools.

That matters because the big-platform narrative for two years has been "MCP is the agent surface." Headless 360 just quietly named three surfaces and let the buyer pick.

What it means in practice: you can stop feeling like the CLI path is the unofficial one. It isn't. It's one of three first-class surfaces that the biggest CRM in the world is now officially exposing to agents. You didn't need their blessing to work this way — I've been doing it for a year — but the permission is nice.

## Pick your primitive

Three surfaces. Three skill levels.

MCP meets operators where they are. CLI is where they're heading. API is the thing underneath both — the raw layer for anyone who's in an environment neither primitive covers.

That's why the Headless 360 framing was the important move at TDX. Salesforce didn't pick a side. It opened all three and let user skill pick. Dharmesh reads the same way at HubSpot — the remote MCP GA on April 13 wasn't a bet against CLI. It was a bet that the median GTM operator deserves an on-ramp that doesn't require them to write Python on day one.

Cost and throttling are the immediate pain. Skill distribution is the deeper story.

The primitive you pick isn't a statement about what the technology can do. It's a statement about where you are on the learning curve — and whether you're climbing it.

I'm picking CLI. I got here by doing the reps. Most of my team isn't there yet, which is why MCP still has a role in how we operate.

Chapter 11 of the [GTM Coding Agents guide](https://shawnos.ai/guide/gtm-coding-agent/11-pick-your-primitive) goes deeper on the full decision framework — when MCP is the right call, how to build the reps that let you graduate to CLI, and the signals that tell you it's time.

The repo is public and ungated: **[github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent)** — 41 stars, 16 forks at the time of writing. No email wall, no course upsell. The 10 chapters, the onboarding wizard, the GTM-OS skeleton, all the Python scripts. Fork it, break it, open a PR. The stars and forks are there because the value ships whether you pay for it or not.

*Building with Claude Code daily at [shawnos.ai](https://shawnos.ai).*
