# Build Your Own OS -- Reddit Post

> **Platform**: Reddit
> **Type**: Value-first post (no hard CTA, profile link does the funnel work)
> **Date**: 2026-02-17
> **Status**: draft
> **Target Subs**: r/ClaudeAI, r/CursorAI, r/Productivity

---

## Post Title Options

1. I built a modular OS inside Cursor to replace my 17-tab GTM workflow. Here's the directory structure.
2. How I use Claude Code to scaffold a GTM/content operating system from one prompt
3. Sharing the repo structure I use to run 6 content platforms + GTM ops from one place
4. I recorded myself building a GTM operating system from one Claude Code prompt. Here's the full structure.

---

## Post Body (r/ClaudeAI and r/CursorAI version)

I got tired of switching between 17 tabs to run my GTM and content workflows. Instantly, HubSpot, Clay, Slack, Google Sheets, LinkedIn, Notion... my laptop was literally freezing from the context switching.

So I built a modular operating system inside a git repo using Cursor and Claude Code. The repo is the hub. MCP servers connect the tools. Everything is version controlled.

I also recorded a full video of me running the scaffold prompt from an empty folder. If you want to see the whole thing get built in real time before trying it yourself, the link is in my profile.

Here's the directory structure I landed on after a few months of iteration:

```
my-gtm-os/
├── skills/
│   ├── tier-1-voice-dna/        # core voice + anti-AI-slop filters
│   ├── tier-2-context-playbooks/ # platform-specific voice adaptations
│   └── tier-3-content-ops/       # pillars, checklists, capture files
├── content/
│   ├── linkedin/drafts/ + final/
│   ├── x/drafts/ + final/
│   ├── substack/drafts/ + final/
│   ├── reddit/drafts/ + final/
│   ├── tiktok/
│   └── youtube/
├── workflows/                    # content indexes, series tracking
├── .cursor/
│   ├── skills/                   # Cursor agent skills (AI automations)
│   └── rules/                    # project-specific AI rules
└── .gitignore                    # security: client data, env, scripts
```

**The 3-tier skill system:**

- **Tier 1 (Voice DNA)**: Your core voice principles. How you sound. What you don't say. Your formatting rules. This rarely changes. It's the foundation everything inherits from.
- **Tier 2 (Context Playbooks)**: Platform-specific adaptations. Your LinkedIn voice is different from your Reddit voice, but both inherit from Tier 1. One playbook per platform.
- **Tier 3 (Content Ops)**: The operational layer. Content pillars, substance requirements, pre-publish checklists, pitfalls to avoid. Plus a captures folder for quick idea dumps.

**How it works day-to-day:**

1. Get an idea or finish a build
2. Run a Cursor skill (like `/playdraft`) that generates drafts based on your voice files + platform playbooks
3. Edit the draft in `content/[platform]/drafts/`
4. Finalize and move to `final/`
5. Publish (Typefully MCP for LinkedIn/X, Substack MCP for newsletter)
6. Repurpose across platforms using the cross-posting rules in each playbook

**MCP connections by stack type:**

If you're GTM/outbound: Instantly, HeyReach, Firecrawl, Google Sheets, Slack
If you're content/creator: Typefully, Substack, Reddit, Notion, ElevenLabs
If you're both: GitHub, Browserbase, ClickUp, Fathom

**The .gitignore matters more than you think:**

Gitignore `clients/`, `partners/`, `data/`, `scripts/`, `*.env`, and your MCP config (it has your API keys). Your frameworks and content are safe to share. Your client data and credentials are not.

**What I'd do differently if starting over:**

- Set up the 3-tier skill architecture from day one instead of dumping everything in one folder
- Write the voice DNA file first, before any platform playbooks
- Start with 2-3 MCP connections, not 15
- Build skills incrementally instead of trying to automate everything at once

**Honest note:** this architecture took months of iteration. The directory structure looks clean now because I reorganized it three times. The Cursor skills work because I debugged them dozens of times. Don't expect this to be a weekend project. It's a system you build over time.

Happy to answer questions about the setup, the MCP connections, or the skill architecture.

---

## Post Body (r/Productivity version)

I replaced my 17-tab workflow with a single git repo. Here's the system.

I work in GTM (go-to-market) and content creation. My daily workflow used to involve: Instantly for email campaigns, HubSpot for CRM, Clay for data enrichment, Slack for comms, Google Sheets for tracking, LinkedIn for content, plus Notion, Substack, and a few others. My laptop was literally freezing from having everything open.

The fix wasn't closing tabs. It was building a central operating system.

I use Cursor (an AI-powered code editor) with Claude Code as the AI backbone. The repo is organized into three layers:

**Layer 1 - Your voice and principles.** How you communicate. Your tone. Your formatting rules. This is the foundation that everything else inherits from.

**Layer 2 - Platform playbooks.** Each platform (LinkedIn, X, Reddit, newsletter, video) gets its own playbook. Tone adaptations, content formats, what to avoid, cross-posting rules.

**Layer 3 - Operations.** Content pipelines, checklists, quality filters. The systems that keep everything consistent and shipping.

**The game-changer: MCP servers.** Model Context Protocol lets your AI tools connect to your other tools natively. My code editor talks to my email tool, my CRM, my social scheduler, my newsletter platform. Instead of copy-pasting between 17 tabs, the tools talk to each other through the repo.

**Daily workflow now:**
1. Build something or have an idea
2. Run a command that generates content drafts
3. Edit in the repo
4. Publish directly through connected tools
5. Repurpose across platforms

Everything is version controlled. I can see what I changed, when, and why. I can branch experiments. I can revert mistakes.

I recorded a video of me building one of these repos from scratch using a single prompt in Claude Code. If you want to see the process, the link is on my profile.

It's not perfect and it took months to get here. But I haven't frozen my laptop since.

Happy to share more about the setup or answer questions.

---

## Notes

- No links in the post body. Profile bio should link to Substack and YouTube video.
- The r/ClaudeAI and r/CursorAI version is more technical (directory structure, MCP specifics, skill architecture).
- The r/Productivity version is more accessible (layers, daily workflow, the tab problem).
- Both versions now mention the video walkthrough with a soft "link on my profile" reference.
- Engage with every comment. Reddit rewards conversation.
- Don't cross-post the exact same text to multiple subs. Adapt for each community.
- The "honest note" and "what I'd do differently" sections are critical for Reddit credibility. People respect transparency about the learning curve.
- Post on Monday (2026-02-17) to coincide with Post 3 dropping on Substack.
- Title option 4 is new and leads with the video angle for subreddits where video walkthroughs perform well.
