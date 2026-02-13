# YouTube Recording Outline -- Building a Repo from the Scaffold Prompt

> **Format**: Bullet-point outline to follow while recording
> **Duration target**: 10-15 minutes
> **Recording date**: Friday (before Monday's Post 3 drop)
> **Where this ships**: Embedded/linked in OS.AI Labs Post 3 + YouTube channel

---

## Pre-Recording Setup

- Open a clean workspace (empty folder, no existing files)
- Have Claude Code or Cursor open and ready
- Have the scaffold prompt copied and ready to paste
- Decide on sample answers for the 3 questions:
  - Name/brand: use a sample name or your own
  - Platforms: pick 3-4 (LinkedIn, X, Substack, Reddit)
  - Tool stack: pick a realistic stack (Clay, HubSpot, Instantly, Slack, Typefully)
- Screen recording running (OBS, Loom, or native)
- Mic on, casual tone

---

## Recording Flow

### Intro (30 seconds)
- "I'm going to build a modular GTM and content operating system from one prompt."
- "No pre-built repo. Starting from a completely empty folder."
- "By the end of this video you'll see exactly what the scaffold prompt creates and how the output is structured."

### The Why (1-2 min)
- Quick version: the tab problem, context switching, tools that don't talk to each other
- "I wrote the full story in Friday's newsletter (Post 2 of OS.AI Labs) but the short version is: I got sick of 17 tabs and a frozen laptop."
- "The fix was building a repo that acts as the operating system. MCPs wire the tools together. Everything lives in one place."
- "Today I'm going to show you how to scaffold your own."

### Paste the Prompt (30 seconds)
- Show the empty workspace
- Open the terminal / chat
- Paste the scaffold prompt
- "This is one prompt. It's going to ask me 3 questions, then build the entire repo structure."

### Answer the 3 Questions (2-3 min)
- Question 1 (name/brand): answer it, briefly explain why the prompt needs this
- Question 2 (platforms): pick your platforms, explain "it only creates folders for what you actually use"
- Question 3 (tool stack): list the tools, explain "this populates your voice file and README with your actual stack"
- Let viewers see the interactive back-and-forth

### Watch It Build (2-3 min)
- Let the prompt run and generate everything
- Don't fast-forward -- let people see the output streaming
- If it pauses, narrate what it's doing: "now it's creating the content pipeline folders" or "this is the .gitignore being generated"
- React naturally: "okay cool, let's see what we got"

### Walk Through the Output (3-4 min)
- Open the file explorer / tree view
- **Show the top-level structure**: skills/, content/, workflows/, .cursor/, .gitignore, README
- **Click into skills/tier-1-voice-dna/core-voice.md**: "this is where your voice DNA lives. it's a template right now. the sections are there for you to fill in. your origin story, your voice traits, your tool stack, your audience."
- **Click into a platform playbook** (tier-2): "each platform gets its own file. tone, content formats, cross-posting rules. all inheriting from your tier 1 voice."
- **Show the content folders**: "drafts and final for each platform. the pipeline is simple. write in drafts, finalize, publish."
- **Show the .gitignore**: "this is the security layer. clients, partners, data, env files, scripts -- all gitignored. this is set up before your first commit so nothing sensitive ever gets tracked."
- **Show the README**: "this explains the whole system. your stack, your platforms, the architecture."
- **Show .cursor/skills/sample-skill/**: "this is where your Cursor skills live. the sample shows you the format. trigger, inputs, steps, output."

### MCP Guide Mention (1 min)
- "The scaffold prompt builds the repo, but the real power comes from connecting your tools."
- "There's an MCP guide included in Monday's newsletter that breaks down which servers to connect based on your stack."
- Briefly: "if you're GTM -- Instantly, HeyReach, Firecrawl. if you're content -- Typefully, Substack, Reddit. if you're both -- GitHub, Browserbase, Slack."
- "Start with 2-3. Don't try to connect everything day one."

### The Honest Moment (1 min)
- "I want to be real with you. this gives you the architecture. it doesn't give you the skill."
- "I'm still learning this every day. I've burned entire afternoons on things that should have taken 20 minutes. I've written skills that broke other skills. I've accidentally staged client data."
- "The scaffold gives you somewhere to put things. the mastery comes from actually building inside it. writing your voice file and realizing it's wrong. building your first skill and watching it fail."
- "This is a long game. The prompt is the starting point, not the finish line."

### Close (30 seconds)
- "The full scaffold prompt, MCP guide, security guide, AI slop checklist, and all 5 platform templates are in Monday's OS.AI Labs newsletter."
- "Subscribe and you get the whole package. Link in the description."
- "Reply to the newsletter and tell me what you build. I genuinely want to see it."
- Sign off naturally

---

## Post-Recording Notes

- Edit down dead air and any long generation pauses (keep enough to show it's real, trim where it drags)
- Add captions (most YouTube viewers have sound off at least initially)
- Thumbnail: split screen showing empty folder on left, generated file tree on right. Text: "1 prompt. Full OS."
- Description: link to OS.AI Labs Substack, link to the specific Post 3 when published
- Title options:
  - "I built a modular OS from one Claude Code prompt (full walkthrough)"
  - "Building a GTM/content operating system from scratch in 12 minutes"
  - "The scaffold prompt that builds your entire repo (live demo)"
