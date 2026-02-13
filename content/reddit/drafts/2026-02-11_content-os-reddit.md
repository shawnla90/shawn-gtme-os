# Reddit: Content OS Reveal

> **Platform**: Reddit
> **Pillar**: building & sharing / reddit growth & SEO
> **Date**: 2026-02-11
> **Status**: draft
> **Source**: adapted from content/substack/final/2026-02-10_content-os-reveal.md
> **Format**: Personal Experience Post

---

## Target Subreddits

### Primary: r/ClaudeAI
**Why**: Active MCP community. Multiple "I built an MCP server" posts hit front page regularly. Claude users are actively experimenting with tool-use patterns and agent workflows. The MCP + skills angle will land natively here.

### Secondary: r/SideProject
**Why**: Genuine side project / personal infrastructure story. The "I built two systems in one repo" framing fits the sub's culture of sharing what you're working on. Less technical audience — lean into the journey.

### Tertiary: r/ChatGPTCoding or r/LocalLLaMA
**Why**: Broader AI coding communities where MCP and IDE-integrated workflows are hot topics. The Cursor + MCP angle crosses tool boundaries.

### Note on r/CursorAI
The Cursor community primarily lives on forum.cursor.com and cursor.directory (71k+ members), not Reddit. If an r/cursor or r/CursorAI sub exists it's small. Prioritize r/ClaudeAI for the AI-tool angle and r/SideProject for the build story.

---

## Post Title

I built two operating systems inside one Git repo — one runs GTM pipeline, one runs content. Here's what happened when I wired them together with MCP servers.

---

## Post Body

**backstory**

I spent years as an SDR. manually built buying committees in Salesforce. sent 200+ cold emails a day from primary domains with no warmup. learned go-to-market from the absolute grind up.

then I learned to code. not CS-degree code — more like "I need to automate this or I'm going to lose my mind" code. started with scripts. then repos. then I discovered Cursor and MCP servers and everything changed.

**what I actually built**

I have one Git repo with two operating systems inside it.

the first one is a GTM OS. it runs pipeline infrastructure — Clay tables for enrichment, HeyReach for LinkedIn outreach, Instantly for email sequences, partner handoffs, CRM syncs. the stuff that generates revenue.

the second one is a content OS. it runs the entire content machine — voice DNA files that keep my tone consistent, platform-specific playbooks, 23 Cursor skills (custom slash-command-style automations), 10 content pillars, and publishing pipelines that go from idea to draft to final to publish across 6 platforms.

the interesting part is they feed each other. the GTM side generates the stories (campaigns I ran, tools I wired up, results I got). the content side documents them and ships them as posts. then those posts describe the plays, and the GTM side runs the pipeline around them.

**the numbers right now**

- 23 active Cursor skills
- 10 content pillars
- 6 platforms (LinkedIn, X, TikTok, Substack, YouTube, Reddit)
- 16 GTM plays documented
- full pipeline: IDEA → DRAFT → FINAL → PUBLISH → REPURPOSE

two weeks ago the content side was basically a few chatbots strung together with maybe a brand voice file attached. it grew fast once the structure was right.

**the MCP piece**

this is where it gets wild for anyone using Cursor. MCP servers mean your IDE talks to everything natively. I have servers wired to Slack, HeyReach, Instantly, Google Sheets, Typefully, Substack, GitHub, Notion, and now Reddit.

so when I say "check my partner's Slack channel and sync the latest updates" — that happens inside Cursor. when I say "finalize this post and push it to Typefully as a draft" — that happens inside Cursor. the repo is the hub. the MCP servers are the spokes.

one Python script reads the entire file tree and renders a full schematic of the system. the repo literally drew its own picture.

**what I learned**

when you understand Git, you stop tracking changes and start thinking in systems. you version your outbound. you branch your experiments. you commit your wins and revert your failures. that's not workflow management — that's engineering.

the biggest unlock was realizing the repo doesn't just store content. it IS the system. the skills, the voice files, the playbooks, the pipelines — they're all versioned, all composable, all running from the same place.

**what I'm curious about**

I know I'm not the only one building like this. if you're using Cursor skills, MCP servers, or building any kind of personal infrastructure in a repo — what does your setup look like? what tools are you connecting? what broke along the way?

genuinely want to compare notes. no gatekeeping on my end — happy to share how any piece of this works if anyone's curious.

---

## Comment Hooks

**Comment 1 (post immediately after submission):**
for anyone curious about the Cursor skills setup — each skill is a markdown file with instructions that the agent reads and follows. so you write the playbook once and the agent executes it every time. happy to share examples if anyone wants to see the structure.

**Comment 2 (engage after initial replies):**
the MCP wiring was the real game-changer. before that I had tools that didn't talk to each other. now the IDE is the central hub and everything routes through it. still early but the compounding is already noticeable.

**Comment 3 (if someone asks about GTM specifically):**
the GTM side is honestly where the boring but important stuff lives. Clay for enrichment, HeyReach for LinkedIn sequences, Instantly for email. the repo just gives it structure and version control. nothing fancy — just organized.

---

## Subreddit-Specific Adjustments

### For r/ClaudeAI (primary)
- Emphasize the AI-agent workflow angle — skills as agent instructions
- MCP "I built" posts are proven format in this sub (multiple front-page examples)
- Could retitle: "I built a content operating system powered by Claude inside Cursor — 23 skills, 16 MCP servers, and a repo that describes itself"
- Focus less on GTM specifics, more on the AI-as-builder pattern and MCP wiring

### For r/SideProject
- Frame as a personal project journey — SDR to builder
- Could retitle: "Built two operating systems in one Git repo — one for sales pipeline, one for content. Here's the stack."
- Less technical, more story-driven

### For r/ChatGPTCoding or r/LocalLLaMA
- Focus on the practical toolchain — what's wired to what, what the daily workflow looks like
- Could retitle: "My daily AI coding setup: 16 MCP servers, 23 custom skills, and a Git repo that runs everything"
- These subs like concrete tool stacks and real usage patterns

---

## Notes

- Do NOT link to newsletter, Substack, or any external URL in the post body. Let the content stand on its own.
- Profile link does the work if anyone wants to go deeper.
- Engage in comments for at least 24 hours after posting — Reddit rewards participation.
- Check each sub's rules via MCP before posting (get_subreddit_info).
- Consider posting to r/ClaudeAI first, gauge response, then adapt for the other subs.

## Cross-Analysis Findings (2026-02-11)

- **r/ClaudeAI** is the strongest target. "I built an MCP server" posts regularly hit the front page. The community actively discusses tool-use, agent workflows, and MCP integrations. The post format (personal experience + technical detail + "what's your setup?") is proven.
- **r/SideProject** is good for the story angle but less technical. Lean into the SDR-to-builder journey.
- **r/CursorAI** may not be a significant Reddit community — the Cursor community primarily lives on forum.cursor.com (official) and cursor.directory (71k+ members). If a subreddit exists, it's small. Don't rely on it as a primary target.
- **r/ChatGPTCoding** and **r/LocalLLaMA** are broader AI coding subs where MCP and tool-stack posts get traction.
- Multiple Reddit MCP servers already exist (GridfireAI, jordanburke, hereisSwapnil, Arindam200) — the concept is familiar to the audience. Your post adds the "what I built WITH MCPs" angle rather than "I built an MCP server."
- Key tip from community: MCP tool definitions can consume ~41% of context window. Your 16-server stack is notable and worth mentioning as both a flex and a practical consideration.
