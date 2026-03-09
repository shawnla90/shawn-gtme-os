---
name: tiktok-script
description: Generate a TikTok script or storyboard from a play, skill, topic, or screenshot. Outputs hook + demo + result + loop closer in under 16 seconds. Use when the user types /tiktokscript or asks to create a TikTok, Reel, or Short.
---

# TikTok Script — Short-Form Video Script Generator

Generates a TikTok-ready script (also works for Reels and Shorts) following the "fast, useful, loopable" formula. One video = one win. 16 seconds or less. Screen recording + text overlay + soft CTA.

## Command Pattern

- `/tiktokscript` — generate a script from the current conversation context
- `/tiktokscript <topic or tool tip>` — generate a script for a specific tip/trick
- `/tiktokscript repurpose <path>` — compress a LinkedIn play or X thread into a TikTok script
- Also triggers when the user says: "turn this into a TikTok", "make a short from this", "TikTok version of this", "Reel script"

## When to Use

- User has a tool tip, shortcut, or workflow moment to showcase
- User wants to repurpose a LinkedIn play or X thread into short-form
- User is planning TikTok content and needs scripts/outlines
- User has a screenshot or screen recording idea and needs the script structure

## Workflow

### Step 1: Identify the Source

1. **Topic provided**: Use the user's topic/tip directly
2. **Repurpose path provided**: Read the source file and extract the key moment
3. **Screenshot in context**: Extract the visual moment to script around
4. **No source**: Ask: "What's the one win or tip? Tool name + what it does in one sentence."

### Step 2: Load References

Read before scripting:
- `skills/tier-2-context-playbooks/tiktok.md` — TikTok playbook (structure, voice, series)
- `skills/tier-1-voice-dna/core-voice.md` — core voice principles
- `skills/tier-1-voice-dna/viral-hooks.md` — hook styles (compressed for 2-second video hooks)
- `workflows/tiktok-index.md` — check active series and episode numbers

**If repurposing from LinkedIn/X**, also read:
- The source draft file
- `workflows/plays-index.md` (if it's a GTM Play)

### Step 3: Determine Series Fit

Match the topic to an active TikTok series:

| Series | Best For |
|--------|----------|
| Easy Wins with Claude Code | Claude Code tips, slash commands |
| Cursor in 15 Seconds | Cursor IDE features, shortcuts |
| Slash Commands You Didn't Know You Needed | Custom slash commands from the content OS |
| One Shortcut a Day | Any tool, any shortcut, daily cadence |
| Do This, Not That (AI Tool Edition) | Comparisons, better approaches |
| GTM Plays (30-Second Version) | Repurposed from LinkedIn plays series |

If no series fits, script as a standalone.

### Step 4: Generate the Script

**File path**: `content/tiktok/drafts/YYYY-MM-DD_{slug}.md`

**File structure**:

```markdown
# {Title}

> **Platform**: TikTok / Reels / Shorts
> **Series**: {Series name or "Standalone"}
> **Episode**: {# if part of a series}
> **Source**: {Path to source file if repurposed, or "Original"}
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Est. Duration**: {X seconds}

---

## Hook Options (0-2 seconds)

On-screen text options (pick one):

1. {hook option — bold, scroll-stopping}
2. {hook option — different angle}
3. {hook option — curiosity or pain point}

**Voiceover** (optional):
"{What to say if doing voice — should match or complement the on-screen text}"

---

## Demo (3-10 seconds)

**What to show**:
{Step-by-step description of what to screen record}

**On-screen text**:
"{Text overlay during the demo — 2-4 words max per overlay}"

**Visual notes**:
- {Zoom in on X}
- {Crop to show Y}
- {Split-screen / green screen if needed}

---

## Result (10-14 seconds)

**What to show**:
{The output, the saved time, the working result}

**On-screen text**:
"{Result text overlay}"

**Visual notes**:
- {Before/after if applicable}
- {Highlight the key output}

---

## Loop Closer (14-16 seconds)

**On-screen text**:
"{CTA or loop text — 'save this' / 'part 2?' / 'try it'}"

**Visual loop note**:
{Does the end frame match the start frame? Describe the visual loop if applicable.}

---

## Caption

{1-2 line caption, lowercase first word, capitalize I, soft CTA}

## Tags

{3-5 relevant hashtags}

---

## Recording Notes

**Screen recording needed**: {Yes/No — what to record}
**Audio**: {Trending sound / voiceover / no audio}
**Editing tool**: {CapCut / Descript / TikTok editor}
**Cross-post to**: Reels, Shorts{, LinkedIn video if GTM-relevant}

---

## Notes

{Source material reference, key data points, why this tip matters}
```

### Step 5: Generate Hook Options

Produce **3 hook options** for the on-screen text using styles from `viral-hooks.md`, adapted for video:

- **Curiosity**: "you didn't know Claude could do this."
- **Pain point**: "stop doing X manually. one command."
- **Contrarian**: "everyone uses [tool] wrong. here's the fix."
- **Challenge**: "I bet you've never tried this in Cursor."
- **Result-first**: "30 minutes of work. 3 seconds."

**Rules for video hooks**:
- Lowercase first word (unless I)
- 8 words or fewer on screen
- Must work WITHOUT sound (text-first)
- Must create enough tension to stop the scroll in 1 second

### Step 6: Save and Confirm

1. **Save script**: `content/tiktok/drafts/YYYY-MM-DD_{slug}.md`
2. **Display confirmation**:
   ```
   TikTok script drafted:

   content/tiktok/drafts/YYYY-MM-DD_{slug}.md
      - Series: {series name or Standalone}
      - Duration: ~{X} seconds
      - Hook options: 3 ready to pick from

   Next steps:
   - Record screen capture
   - Edit in CapCut/Descript
   - Post to TikTok → Reels → Shorts
   ```
3. **Update tiktok-index**: If part of a series, note the episode in `workflows/tiktok-index.md`

## Repurpose Logic

When the source is a LinkedIn play or X thread:

1. **Read the source** — identify the single most visual, most impactful moment
2. **Strip everything else** — one tip, one demo, one result. No context setup. No multi-step walkthrough.
3. **Find the "aha" frame** — the exact step or output that would make someone say "wait, how?"
4. **Script the demo around that frame** — zoom in, show it happening, show the result
5. **Hook with the result** — start with what happened, then show how (replay value)

**Example**: Play 16 (HeyReach Partner Handoff) has 5 steps. The TikTok version shows ONE moment: the Cursor agent pulling LinkedIn data and generating a CSV in 3 seconds. That's it.

## Example Scripts

### Example 1: Claude Code Slash Command

```
Topic: /finalcopy command that converts markdown to plain text

Hook (on-screen): "one slash command. draft to published in 3 seconds."
Demo: Screen recording of typing /finalcopy, watching markdown strip to plain text
Result: Side-by-side of markdown draft vs clean output
Closer: "save this. more slash commands coming."
Caption: "built a slash command that turns any draft into copy-paste ready text ⚡"
Tags: #claudeai #cursoride #codingshortcuts #devtips #contentcreation
Series: Easy Wins with Claude Code
Duration: ~14 seconds
```

### Example 2: Cursor MCP Trick

```
Topic: MCP server that reads Slack messages from Cursor

Hook (on-screen): "I read Slack messages from my code editor."
Demo: Screen recording of Cursor chat querying Slack via MCP
Result: Slack messages appear in Cursor terminal
Closer: "Cursor + MCP servers. follow for more."
Caption: "Cursor IDE can read your Slack channels. no browser needed."
Tags: #cursorai #mcp #slackintegration #devtools #aitools
Series: Cursor in 15 Seconds
Duration: ~12 seconds
```

## Error Handling

- **No topic provided**: "What's the tip? Give me the tool name + what it does in one sentence."
- **Topic too complex for 16 seconds**: "That's a full tutorial. Let's find the ONE moment that makes someone say 'wait, how?' and script around just that."
- **Source file not found**: "Couldn't find that file. Drop the path or just describe the tip."
- **No matching series**: Script as standalone. Suggest series it could start.

## Collaborates With

- **Viral Hooks** (`viral-hooks/SKILL.md`): For hook options, compressed to 8 words for on-screen text
- **Play Draft** (`play-draft/SKILL.md`): LinkedIn/X drafts can feed `/tiktokscript repurpose`
- **Final Copy** (`final-copy/SKILL.md`): Not used directly (TikTok scripts don't go through /finalcopy)
- **Content Images** (`content-images/SKILL.md`): Can generate thumbnail or overlay graphics if needed
