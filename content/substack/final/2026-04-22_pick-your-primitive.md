# Pick Your Primitive: Why I Run CLI While Everyone's Hyping MCP

> **Platform**: Substack
> **Series**: GTM Coding Agents
> **Structure**: Argument essay with news peg
> **Date**: 2026-04-22
> **Status**: final
> **Source**: original (from private chat thread on CLI vs MCP)
> **Visual**: `pick-your-primitive.gif` (Remotion, 28s) + `claude-code-usage-stats.png` (stats card)

**Subject line options:**
- "Pick your primitive"
- "MCP is a convenience layer for agents that can't code"
- "5.94 billion cache reads. That's the whole argument."

**Preview text:** HubSpot's MCP just went GA. Salesforce's is still beta. Salesforce put the three surfaces on equal footing at TDX with Headless 360. Here's which one I actually reach for, and what 65 days of CLI-direct looks like in real numbers.

---

![Pick Your Primitive — at 100 deals, MCP's 600 HTTP requests redline the rate-limit wall with ~47 projected retries. CLI's 100 streaming calls have headroom. The CLI learning curve pays off at scale.](./assets/rate-limit-wall.gif)

HubSpot's remote MCP went generally available on April 13, 2026. Salesforce's hosted MCP is still in beta — GA originally targeted February, slipped. At TDX on April 15, Salesforce announced Headless 360 and put APIs, MCP tools, and CLI commands side by side as three co-equal ways to talk to Salesforce.

The primitive you pick decides what you can build. I pick CLI. Here's why, and who should pick differently.

## The post that kicked this off

Someone I respect posted a Thanos meme yesterday hyping the Salesforce MCP "coming out of beta." A VP RevOps, excited about agent-CRM integration, doing the distribution work.

The Salesforce MCP isn't actually out of beta yet. But that wasn't what stopped me. What stopped me was the quieter question underneath:

If I've been skipping MCP and going straight to the CLI, am I wrong?

I spent a couple hours stress-testing my own stance. The answer I came out with: not wrong, just not universal. The argument for MCP is real, it's just not for me. And probably not for anyone building anything that has to run reproducibly tomorrow.

Let me show the work.

## What's actually shipping

Three things happened in the last ten days that nobody is lining up in the same sentence.

HubSpot remote MCP went GA on April 13. Any MCP-compatible AI tool can now connect over a HubSpot-hosted connection, OAuth 2.1 with PKCE, write access to CRM objects and engagements, read access to marketing, content, and organizational context. If you are on HubSpot and you want your reps chatting with a CRM agent inside claude.ai, this is the moment.

Salesforce's hosted MCP is still in beta. GA was targeted for February, slipped, and the docs still say beta with pricing subject to change. The DX MCP server (different product, for Apex/SOQL developer tooling) is also beta.

Salesforce announced Headless 360 at TDX on April 15. This is the real moment. Every capability across Salesforce, Agentforce, and Slack is now accessible through three co-equal surfaces: APIs, MCP tools, and CLI commands. Sixty-plus new MCP tools. Thirty-plus preconfigured coding skills. Support called out explicitly for Claude Code, Cursor, Codex, and Windsurf — four CLI-first coding agents.

The framing is the news. MCP isn't winning. CLI isn't winning. Both are being handed the same keys.

## Why I went CLI-first

I'm not neutral on this. Here's what 65 days of Claude Code CLI usage looks like for me:

![65 days of CLI-direct Claude Code usage](./assets/claude-code-usage-stats.png)

5.94 billion cache-read tokens. 42.87 million output tokens. About 6,500 assistant messages. Peak day was April 11 at 7.8 million output tokens in a single day across 4,681 messages.

The number to pay attention to is the 5.94 billion cache reads. That ratio only happens when the system is architected to sit in the same context and hit the same cache over and over. Chatty MCP sessions don't do that. Each tool call is an island. Each prompt pays full freight.

Four reasons every workflow in my stack went CLI-first.

Reproducibility. When I get a call to work, it becomes a script. The script gets committed. Tomorrow it runs without me. Next month a teammate reads it. Next year I audit the diff.

Token economics. A CLI-direct script makes one authenticated call per operation and lets the surrounding context be cached aggressively. An MCP session re-loads tool schemas every turn, re-parses response shapes every turn, and carries the overhead of tool discovery whether I use it or not. On 500 scored contacts overnight, the delta between "cache-read most of it" and "pay full prompt freight every turn" is not rounding error. It's the difference between a workflow that runs and one that stops being worth running.

Cache behavior. When my script calls the HubSpot Python SDK, the call itself is cached at the HTTP layer, the auth token is cached in the keychain, and the reasoning I did about the response is cached in the code. An MCP tool call is an island. Every island pays its own tax.

Ownership. If HubSpot renames a field in their MCP server tomorrow, every agent that talks to it gets the new name for free — which sounds great until the thing you wrote last week silently breaks. A CLI script I wrote breaks only when *I* change something. That is the version control you want when the system matters.

## The redundancy you can feel in MCP

This is the part most people discover by accident and then can't quite name.

When you use an MCP server from a chat interface like claude.ai, Cursor, or ChatGPT desktop, every tool call is its own conversational turn. The agent asks for a schema, gets a response, reasons about what's in it, then asks for the next thing. No persistent script state between turns. No intermediate variable. No cached assumption.

So the same "update this deal's owner" operation that takes one Python call takes five-to-seven MCP turns:

- turn: discover available tools
- turn: search deal by id
- turn: re-reason about the response shape, plan the next call
- turn: search the owner to get their internal id
- turn: issue the update
- turn: verify the write

Every turn is a round-trip. Every round-trip carries tokens, latency, and context drift. On a single deal update that feels fine. On a batch of two hundred, it's a structurally different shape of work.

That is what I mean when I say MCP is chatty. It's not about Anthropic's model or HubSpot's server. It's about the protocol having no persistent state between invocations. Each call really is an island.

The redundancy isn't theoretical. Here's the same task on a stopwatch:

![Speed delta: MCP takes 9.2 seconds across six HTTP round-trips. CLI takes 2.1 seconds in one streaming call. Same model, different primitive.](./assets/speed-efficiency.gif)

## Who MCP is actually for

MCP is not useless. It's a protocol wrapper that solves a real problem. The problem is agents that can't code.

If your user is a salesperson in claude.ai asking "summarize the last three calls with Acme and create a follow-up task," they aren't writing Python. They aren't storing tokens. They aren't reading docs. MCP is what lets them have that conversation.

Three real reasons MCP wins.

Discoverability for non-technical users. A rep doesn't need to know the HubSpot API shape. The MCP server pre-registers the tools. The agent handles the plumbing.

Governance that makes admins sleep. HubSpot's remote MCP respects existing user permissions at the server layer, logs every write, authenticates via OAuth 2.1 with PKCE. That's an admin conversation that ends in "yes." An admin conversation about "my AE generated a personal access token and pasted it into a Python script" ends in "no."

Schema stability across a team. When HubSpot updates the MCP, every user gets the new tools. For one builder that's a liability. For fifty reps, it's the only way it can work.

If you are a RevOps leader rolling an agent experience out to your sales team, MCP is the right primitive. The people who should be hyping it are you.

## Who CLI is for

You, if you meet all three tests.

You are the user, the admin, and the maintainer. You are going to write Python against the result anyway. You care more about reproducibility next quarter than conversational fluency today.

That's the builder profile. One person who owns the whole stack, writes in a terminal, commits scripts to git, and treats every workflow as infrastructure rather than a chat.

For that person, the MCP wrapper is overhead without benefit. You already know the API. You already have the token. Your agent can already read docs and make authenticated calls. The wrapper is solving a problem you don't have.

The split isn't MCP versus CLI in the abstract. It's your role versus the protocol's assumed user. Match the tool to who you actually are.

At single-deal scale, MCP is just expensive. At 100-deal scale, it's something structurally different — and once you do the token math, the learning curve justifies itself.

![Token economics: MCP rebuilds the same 4.5K schema every turn (27K wasted input tokens across 6 rebuilds) and pays full input rates. CLI caches the 15K context once and reads from it at $0.50/M. 3× cheaper, 4.4× faster, same deal.](./assets/token-economics.gif)

## The Headless 360 moment

Here is what makes Headless 360 the most important framing of this whole debate.

At TDX on April 15, Salesforce did not pick a side. The Headless 360 announcement put APIs, MCP tools, and CLI commands in the same sentence as three ways to address the same platform. It specifically called out the external coding agents: Claude Code, Cursor, Codex, Windsurf. Those are CLI-first tools.

That matters because the big-platform narrative for two years has been "MCP is the agent surface." Headless 360 just quietly named three surfaces and let the buyer pick.

What it means in practice: you can stop feeling like the CLI path is the unofficial one. It isn't. It's one of three first-class surfaces that the biggest CRM in the world is now officially exposing to agents. You didn't need their blessing to work this way. I've been doing it for a year. But the permission is nice.

## Pick your primitive

MCP is a genuinely useful layer for the user profile it was designed for. If you are reading a GTM engineering newsletter in the first place, you are probably not that user.

The primitive you pick decides what you can build. MCP lets you have a conversation with your CRM. CLI lets you turn that conversation into a script that runs at 3 a.m. while you sleep, commits its output to a diffable history, and still works next quarter when HubSpot quietly changes a field.

Both are valid. Both are now officially blessed by the platforms. Pick the one that matches what you are actually trying to do.

I'm picking CLI. My 5.94 billion cache reads are picking CLI with me.

Chapter 11 of the [GTM Coding Agents guide](https://shawnos.ai/guide/gtm-coding-agent/11-pick-your-primitive) goes deeper on the full decision framework — including when MCP is the right call, the audience matrix across builder / rep / admin / partner, and how to recognize the moment you've outgrown your CLI script.

The full repo is public and ungated: **[github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent)** — 41 stars, 16 forks as of today. No email wall. No course upsell. All 10 chapters, the onboarding wizard, the GTM-OS skeleton, every Python script. The stars and forks are the proof — value ships whether you pay for it or not.

shawn ⚡ the gtme alchemist 🧙‍♂️
