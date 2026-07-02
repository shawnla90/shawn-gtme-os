---
title: "two coding agents, one GTM engine: how I run Claude Code + Codex as a founder"
date: "2026-07-02"
excerpt: "Episode 1 of Founder's Journey is live. The workflow: Claude Code in the terminal, Codex in the app, SQLite as project memory, and sub-agents enriching my whole LinkedIn network for outreach."
category: "gtm-engineering"
featured: true
keywords: ["claude code gtm workflow", "codex vs claude code", "gtm engineer stack", "founder outbound", "context engineering", "sqlite claude code"]
---

**tl;dr:** I run two coding agents at once. Claude Code in the terminal, Codex in the app, one plan on each side, so I never stall on usage limits. Everything they build lands in SQLite so context lives in columns instead of blowing up the context window. In episode 1 I use that stack to scrape my own LinkedIn network, score 2.5 years of DMs, and build the segmented outreach list for Clearbox. The full episode is below.

{{youtube:F2oCqpo729A}}

## the thirty-second backstory

I was a plumber for 13 years, running a business with my father. Moved to Israel, broke into tech as an SDR at Dealhub, generated over $2M in pipeline on cold calls. Founding BDR at Forward, where I learned what actually makes an email land. Clay bootcamp taught me APIs, JSON, and the term go-to-market engineer. January 2025 I went out on my own with Lead Alchemy, worked a six-figure GTME agency job across seven or eight Clay workspaces, and hit the ceiling of what a UI lets you do.

That ceiling is why I built this stack. A year ago a Clay operator was a top-end GTM engineer. Today a Clay operator is a $20 to $30 an hour role. The work moved below the UI, into code, and the coding agents are how a non-engineer gets there.

## the two-agent setup

The core of the workflow is boring on purpose: two coding agents, two subscriptions, zero downtime.

Claude Code runs in the terminal. Codex runs in the app. I keep the 5x Max plan on the Claude side and the equivalent plan on the OpenAI side, and between the two I never wait on a limit. If one side is lagging or capped, I drop the same files into the other and keep moving.

That only works because of context engineering. Both agents read the same repositories: one for content, one for agency work, one for Clearbox go-to-market. When you know your file paths and keep your directories clean, switching agents costs you nothing. The project is the context, not the chat history.

You build something, it sucks, and you hit your usage limit before you can fix it. That gap between broken and shipped is where projects die. Two agents and clean file paths close it.

## SQLite is the memory

Every project gets a SQLite database at the root. That is the version-control database for all the data the agents produce: scraped lists, enrichments, scores, campaign segments.

The reason is context. Claude Code reading a folder of CSVs burns your window. Claude Code reading columns from a table doesn't. Store everything in SQLite and the agent queries what it needs instead of ingesting everything you have. I compact once a day instead of once an hour.

## what I actually built in episode 1

The founder problem: Clearbox is out of stealth, and the first market you should ever touch is your own network. Mine is 8,433 LinkedIn followers and about 7,600 connections.

So the agents went to work:

Codex ran a headless scrape of my full following through Sales Navigator. I could have used PhantomBuster (my API was acting up), and honestly the scrape you own is better anyway.

Then it scraped 2.5 years of my LinkedIn DMs and built a scoring table. Who reached out to me, who I owe a reply, where a real relationship already exists. That relationship label decides the channel: first-degree with history gets a DM, first-degree without gets a connection-context message, everyone else gets verified email after a connection request.

Apollo pulled the ~1,900 go-to-market engineers I wanted to append. Their new people search is genuinely good; I typed what I wanted in plain language and the list came back accurate.

Claude Code then orchestrates sub-agents that read profiles through Apollo, enrich the bios, and segment everyone into five buckets: school, Clearbox, both, agency partnership, content collaboration. ZeroBounce validates emails before anything sends.

I threw the whole messy plan at Codex in one voice-dump, told it to execute exactly one step (merge the two spreadsheets), and had it write the rest up as a plan file. That plan file goes to Claude Code in the terminal, where I run /effort max and let it work full throttle. Plan in one agent, execute in the other, never load the whole orchestration into a single session.

## the Reddit part

Clearbox is a Reddit opportunity inbox. The engine behind it is called Aura, and it runs on our own local inference model, not ChatGPT or Claude reading Reddit for you. It reads full semantics: when someone asks for email tools but the real need is distribution, it surfaces that as a lead, a competitor mention, or an engagement opportunity.

I answered a thread asking "how do I get paying clients for my SaaS," was genuinely useful, dropped zero links, and just said I built a tool called Clearbox that does this. The poster reached out to me. Google indexed the answer. Be real, be helpful, name the thing, skip the link. The indexing takes care of itself.

We don't encourage AI-written comments. We do encourage AI-briefed ones: Clearbox ships a prompt you can drop into Claude Code or ChatGPT that reads your inbox and prioritizes who deserves a real reply from an actual human.

## FAQ

### Why run both Claude Code and Codex instead of picking one?

Redundancy and fit. Two plans means a usage limit never stops a build mid-fix. And they have different strengths: I like Codex in the app for remote control and quick file drops, and Claude Code in the terminal for planning and orchestrating sub-agents with /effort max. The model matters less than people think; the context you feed it matters more.

### What does "context engineering" mean in practice?

Knowing your file paths, keeping one repo per concern, and storing data in SQLite so agents read columns instead of folders. The goal is that any agent, in any session, can pick up the work from the files alone. No re-explaining, no compacted windows mid-task.

### How do you use your own network for founder outreach without burning it?

Scrape it, score it, segment it. The DM history tells you where relationships actually exist, and the relationship decides the channel and the message. People I've helped before get a real note about the school. Founders and RevOps folks who fit get Clearbox. Nobody gets a blast.

### Is scraping your own LinkedIn following allowed?

It's my network, my Sales Navigator seat, and a browser I'm logged into. I'm reading data LinkedIn already shows me, at human scale, to write better messages to people who chose to follow me. That bar matters to me: enrich to be relevant, never to spam.

### Where do I get the actual files you work with?

The GTM Coding Agent guide chapters are on this site, the repo is public at github.com/shawnla90/gtm-coding-agent, and the skill files themselves (voice DNA, anti-slop, playbooks, handoffs) are in [the Vault](/vault). Take them, point Claude Code at them, and build.

More episodes coming. The next one is me actually working the Clearbox inbox those agents filled.

Shawn Tenam
the GTM alchemist
"you learn more from building and trying things, even if you fail"
