# The Scaffold Prompt

> Copy this entire prompt into Claude Code (or Cursor with Claude). It will ask you 3 questions, then build your repo.

---

```
I want to build a modular operating system repo for my GTM and content workflows. This repo will be the central hub where my AI tools, content pipelines, and go-to-market systems all live together -- version controlled, structured, and connected via MCP servers.

Before you build anything, ask me these 3 questions one at a time and wait for my answers:

1. What's your name or brand handle? (This gets used in your voice file and README.)
2. Which platforms do you actively post on? (Pick from: LinkedIn, X/Twitter, Substack, Reddit, TikTok, YouTube, or tell me others.)
3. What tools are in your daily stack? (Examples: Clay, HubSpot, Instantly, HeyReach, Notion, Typefully, Firecrawl, ClickUp, Google Sheets, Slack -- or list your own.)

After I answer all 3, build the following:

---

## Directory Structure

Create this full directory tree. For platforms I said I use, create the content folders. Skip platforms I don't use.

```
my-gtm-os/
├── skills/
│   ├── tier-1-voice-dna/
│   │   └── core-voice.md
│   ├── tier-2-context-playbooks/
│   │   └── (one .md per platform I listed)
│   └── tier-3-content-ops/
│       ├── pillars/
│       ├── captures/
│       │   ├── content-ideas.md
│       │   ├── thoughts.md
│       │   └── workflow-notes.md
│       ├── substance-requirements.md
│       ├── pre-publish-checklist.md
│       └── pitfalls.md
├── content/
│   └── (for each platform I listed)
│       ├── drafts/
│       ├── final/
│       └── README.md
├── workflows/
│   └── content-index.md
├── .cursor/
│   ├── skills/
│   │   └── sample-skill/
│   │       └── SKILL.md
│   └── rules/
├── .gitignore
└── README.md
```

---

## File Contents

### README.md (root)

Write a README that explains:
- What this repo is (a modular GTM and content operating system)
- The 3-tier skill architecture (Tier 1: voice DNA, Tier 2: platform playbooks, Tier 3: content operations)
- How the content pipeline works (idea → draft → final → publish)
- Which platforms are active
- Which tools are connected (from my answer to question 3)
- A "Getting Started" section with next steps

Use my name/brand from question 1 in the header.

### .gitignore

```
# OS files
.DS_Store

# Environment and secrets
*.env
.env.*

# Client and partner data (NEVER commit these)
clients/
partners/

# Data files (local only)
data/

# Scripts with API keys or credentials
scripts/

# Sync state files
.notion-sync-state.json

# IDE local settings
.claude/settings.local.json

# Blocklists and sensitive filters
.claude/blocklist.txt

# Screenshots (large binary files)
screenshots/

# Node modules if any
node_modules/
```

### skills/tier-1-voice-dna/core-voice.md

Create a voice DNA template with these sections for me to fill in:

```markdown
# Core Voice Principles

## Your Origin Story
<!-- What's your professional backstory? What gives you authority? Write 2-3 sentences about where you came from and what you do now. -->

## Voice Characteristics
<!-- How do you naturally sound? Pick 3-5 traits. Examples: builder-first, casual competence, technical but accessible, self-aware, conviction-driven -->

- Trait 1:
- Trait 2:
- Trait 3:

## Priority Hierarchy
1. **Substance** (specific, detailed, usable)
2. **Authenticity** (real, organic, your actual voice)
3. **Interesting** (pattern recognition, unique angle)
4. **Polish** (last priority, not first)

## Your Tool Stack
<!-- List the tools you use daily. Be specific. These get referenced in your content. -->

From my answer: [insert tools from question 3]

## Your Audience
<!-- Who reads your content? Be specific about their role, level, and what they care about. -->

## What You Share vs. What You Don't
**You can:**
- Share your workflows and processes
- Share mistakes and lessons learned
- Critique approaches and strategies (not people)
- Give away resources and templates

**You don't:**
- Call out specific companies or people
- Make claims about guaranteed results
- Gatekeep knowledge or resources
- Position yourself as an industry guru

## Formatting Rules
- Capitalize I (always: I'm, I built, I'll)
- No em-dashes (use periods or restructure)
- Substance over polish
- Ship over perfect
```

### skills/tier-2-context-playbooks/ (one per platform)

For each platform I listed, create a playbook file with this structure:

```markdown
# [Platform] Playbook

> Inherits from: tier-1-voice-dna/core-voice.md

## Platform DNA
<!-- What is this platform for in your system? How does it differ from others? -->

## Tone
<!-- How does your voice adapt for this platform? -->

## Content Formats
<!-- What types of posts work here? List 2-4 formats. -->

## Formatting Rules
<!-- Platform-specific formatting. Character limits, structure conventions, etc. -->

## What to Avoid
<!-- Platform-specific pitfalls. -->

## Cross-Platform Notes
<!-- How does content flow to/from this platform? -->
```

### skills/tier-3-content-ops/substance-requirements.md

```markdown
# Substance Requirements

## What Qualifies as Substance

**Insufficient (sugar rush):**
A generic claim without specifics. "Most teams don't use their data well."

**Sufficient (substance):**
A specific example with details, tools, numbers, and results. Show what you did, how you did it, and what happened.

## Substance Checklist

Every substantive claim needs at least 2 of:
- [ ] Specific example with concrete details (numbers, tools, timeframes)
- [ ] Technical implementation details
- [ ] Reasoning shown (not just conclusions)
- [ ] Consequences or results (what happened?)
- [ ] Gotchas or lessons learned
```

### skills/tier-3-content-ops/pre-publish-checklist.md

```markdown
# Pre-Publish Checklist

Before posting, verify:

**Structure and Style**:
- [ ] Strong opening line
- [ ] Short paragraphs (1-2 sentences max for social)
- [ ] No AI slop patterns (check ai-slop-basics)
- [ ] Natural reading rhythm

**Substance**:
- [ ] At least one specific example with details
- [ ] Technical specifics where relevant
- [ ] Practical value or clear lesson

**Safety**:
- [ ] No named companies or people criticized
- [ ] No client details exposed
- [ ] Nothing you wouldn't say to their face

**Voice**:
- [ ] Sounds like you, not a content machine
- [ ] Builder tone, not thought leader tone
- [ ] Would you actually say this out loud?
```

### skills/tier-3-content-ops/pitfalls.md

```markdown
# Common Pitfalls

## The "Thought Leader" Trap
Performing wisdom instead of sharing lessons. Abstract principles without concrete examples.

## The "Generic Advice" Trap
"Use data to make better decisions." Worthless without specifics. Always add: how, why, what exactly?

## The "Over-Polish" Trap
Spending 4 hours on a post that should take 30 minutes. Ship over perfect.

## The "Too Technical" Trap
Using jargon without context. Balance: specific enough to be useful, accessible enough to be interesting.

## The "AI Slop" Trap
Letting AI writing patterns leak into your content. Sound like yourself, not a language model.
```

### skills/tier-3-content-ops/captures/ files

Create content-ideas.md, thoughts.md, and workflow-notes.md each with:

```markdown
# [Title]

<!-- Quick capture file. Drop ideas/thoughts/notes here as they come. Date them. -->

## Captures

```

### .cursor/skills/sample-skill/SKILL.md

```markdown
# Sample Skill: [Skill Name]

## Purpose
<!-- What does this skill do when triggered? -->

## Trigger
<!-- What command or phrase activates this skill? Example: /skillname -->

## Inputs
<!-- What does the skill need to run? Files, context, user input? -->

## Steps
1. Step one
2. Step two
3. Step three

## Output
<!-- What does this skill produce? Where does it save? -->

## Voice Rules
- Inherits from: skills/tier-1-voice-dna/core-voice.md
- Platform-specific rules from: skills/tier-2-context-playbooks/

## Example
<!-- Show an example of the skill in action -->
```

### workflows/content-index.md

```markdown
# Content Index

Track published content across platforms.

## Posts

| # | Platform | Title | Date | Status |
|---|----------|-------|------|--------|
| 1 | | | | draft |
```

### content/[platform]/README.md (for each platform)

```markdown
# [Platform] Content

## Workflow
1. Draft in `drafts/` with filename: `YYYY-MM-DD_slug.md`
2. Review and edit
3. Move to `final/` when ready to publish
4. Publish to platform

## Naming Convention
- Drafts: `drafts/YYYY-MM-DD_slug.md`
- Final: `final/YYYY-MM-DD_slug.md`
```

---

## After Building

Once all files are created:

1. Initialize git: `git init && git add . && git commit -m "initial scaffold: modular GTM/content OS"`
2. Print a summary of what was created (directory tree)
3. Print these next steps:

**Next steps:**
- Fill in `skills/tier-1-voice-dna/core-voice.md` with your real voice. This is the foundation everything builds on.
- Customize each platform playbook in `skills/tier-2-context-playbooks/`
- Connect your MCP servers (see the MCP guide for recommendations by stack type)
- Write your first draft in `content/[platform]/drafts/`
- Build your first real Cursor skill in `.cursor/skills/` based on a workflow you repeat
- The system grows as you use it. Don't try to fill everything in day one. Build, ship, iterate.
```

---

## How to Use This Prompt

1. Open Claude Code or Cursor
2. Start a new conversation
3. Paste the entire prompt above
4. Answer the 3 questions when asked
5. Let it build your repo
6. Start filling in your voice DNA and platform playbooks

The scaffold gives you the architecture. You bring the voice, the tools, and the daily work that turns structure into a living system.
