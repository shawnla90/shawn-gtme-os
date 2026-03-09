---
name: faceless-script
description: Generate faceless TikTok voiceover scripts from repo content for The Terminal Alchemist character. Outputs character dialogue + expression cues + screen recording notes in 15-30 seconds. Use when the user types /faceless or asks to create a faceless TikTok script.
---

# Faceless Script — Terminal Alchemist Voiceover Generator

Generates a voiceover script for The Terminal Alchemist faceless TikTok account. Pulls from repo content (skills, plays, tips, builds) and outputs character dialogue with expression cues, ElevenLabs-ready text, and screen recording B-roll notes. 15-30 seconds per video.

The key difference from `/tiktokscript`: these scripts are written as **character voiceover dialogue** with expression cues for the animated alchemist, not on-screen text scripts for face-to-camera recording.

## Command Pattern

- `/faceless` — generate a script from current conversation context
- `/faceless <topic>` — generate a script for a specific topic
- `/faceless repurpose <path>` — compress a LinkedIn/X post into a faceless voiceover script
- `/faceless batch` — generate 3-5 scripts from queued topics
- Also triggers when the user says: "faceless script for...", "alchemist video about...", "terminal alchemist script"

## When to Use

- User wants a voiceover script for the faceless TikTok account
- User wants to repurpose LinkedIn/X content into animated character videos
- User wants to batch-generate scripts from the repo content mine
- User has a tool tip, build moment, or pattern to turn into a character monologue

## Workflow

### Step 1: Identify the Source

1. **Topic provided**: Use the user's topic directly
2. **Repurpose path provided**: Read the source file and extract the key moment
3. **Batch mode**: Pull from queued topics in `workflows/tiktok-index.md` and content mine mapping
4. **No source**: Ask: "What's the topic? Tool tip, build moment, or pattern — one sentence."

### Step 2: Load References

Read before scripting:
- `skills/tier-2-context-playbooks/tiktok.md` — TikTok playbook (structure, voice, series)
- `skills/tier-1-voice-dna/core-voice.md` — core voice principles
- `skills/tier-1-voice-dna/viral-hooks.md` — hook styles (compressed for 2-second video hooks)
- `content/tiktok/faceless/character-decision.md` — character spec (expressions, palette, identity)
- `content/tiktok/faceless/voice-profile.md` — ElevenLabs voice selection, settings, and pacing reference
- `workflows/tiktok-index.md` — check active series and episode numbers

**If repurposing**, also read the source file.

### Step 3: Determine Series Fit

Match the topic to a faceless series:

| Series | Best For |
|--------|----------|
| Terminal Alchemist Tips | General tool tips, shortcuts, workflow moments |
| Skills That Run My Business | Deep dive on one repo skill per video |
| 30-Second GTM Plays | Repurposed from LinkedIn plays series |
| Claude Code Secrets | Claude Code-specific tricks and commands |
| Cursor Tricks You Missed | Cursor IDE features and MCP integrations |
| How to Not Sound Like AI | Voice system, anti-slop, content quality |

If no series fits, script as standalone.

### Step 4: Generate the Script

**File path**: `content/tiktok/faceless/drafts/YYYY-MM-DD_{slug}.md`

**File structure**:

```markdown
# {Title}

> **Platform**: TikTok / Reels / Shorts (Faceless)
> **Series**: {Series name or "Standalone"}
> **Episode**: {# if part of a series}
> **Character**: The Terminal Alchemist
> **Source**: {Path to source file if repurposed, or "Original"}
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Est. Duration**: {X seconds}

---

## Hook (0-3 seconds)

**On-screen text**: "{bold text overlay — 8 words or fewer}"

**Voiceover**:
> {Character's opening line. Conversational, confident, hooks immediately.}

**Expression**: {neutral | explaining | reacting | confident | thinking}

**Visual**: {What's behind the character — dark bg, terminal text, or screen recording starting}

---

## Body (3-20 seconds)

**Voiceover**:
> {Main dialogue. 2-4 sentences max. Each sentence is a beat.}
> {The demo or insight — what the alchemist is teaching.}
> {The result or payoff.}

**Expression sequence**:
1. {expression} — "{corresponding line}"
2. {expression} — "{corresponding line}"
3. {expression} — "{corresponding line}"

**Screen recording / B-roll**:
- {What to show behind the character during each beat}
- {Zoom, crop, highlight notes}

**On-screen text overlays**:
- {Key phrases to display as text during the voiceover — 2-4 words each}

---

## Closer (20-30 seconds)

**Voiceover**:
> {Closing line. Soft CTA or loop setup.}

**Expression**: {confident | thinking}

**On-screen text**: "{CTA text — 'save this' / 'follow for more' / 'part 2?'}"

**Visual loop**: {Does end connect to start? Describe the loop if applicable.}

---

## ElevenLabs Text Block

```text
{Clean voiceover text — no stage directions, no formatting.
Just the words the character says, paragraph-separated by beat.
This block gets pasted directly into ElevenLabs.}
```

---

## Caption

{1-2 line caption, lowercase first word, capitalize I, soft CTA}

## Tags

{3-5 relevant hashtags}

---

## Production Notes

**Screen recording needed**: {Yes/No — what to record}
**B-roll alternative**: {Gameplay, terminal animation, or pre-recorded clip from library}
**Audio**: ElevenLabs TTS → Chris voice (see `content/tiktok/faceless/voice-profile.md` for settings)
**Lip sync**: SadTalker / D-ID (use neutral expression as base)
**Compositing**: Character lower-right, screen recording as main content
**Cross-post to**: Reels, Shorts{, LinkedIn video if GTM-relevant}

---

## Notes

{Source material reference, key data points, why this topic works for the character}
```

### Step 5: Write the Voiceover Dialogue

The Terminal Alchemist's voice follows the same core-voice.md principles but adapted for spoken word:

**Character voice rules**:
- First person. Builder who does the work.
- Casual competence. Not lecture-y. Not tutorial-channel.
- Short sentences. Each sentence is a beat.
- Pattern recognition energy. Name what others haven't seen.
- Conversational pacing. Imagine explaining to someone over your shoulder.
- No "hey guys." No "today we're going to." Just start.
- Contractions always (don't, can't, won't, I'm, I've).
- Technical terms are fine but explain by showing, not defining.

**Dialogue pacing for spoken word** (calibrated to Chris voice, see `content/tiktok/faceless/voice-profile.md`):
- 15-second video: ~35-42 words
- 20-second video: ~50-58 words
- 25-second video: ~62-72 words
- 30-second video: ~75-85 words
- Each sentence gets its own beat and expression cue

### Step 6: Generate Hook Options

Produce **3 hook options** for the on-screen text, using `viral-hooks.md` TikTok rules:

- 8 words or fewer
- Must work without sound
- Lowercase first word (unless I)
- Creates enough tension to stop the scroll in 1 second

### Step 7: Save and Confirm

1. **Save script**: `content/tiktok/faceless/drafts/YYYY-MM-DD_{slug}.md`
2. **Display confirmation**:
   ```
   Faceless script drafted:

   content/tiktok/faceless/drafts/YYYY-MM-DD_{slug}.md
      - Series: {series name or Standalone}
      - Duration: ~{X} seconds
      - Word count: {N} words (voiceover)
      - Expression cues: {list}

   Next steps:
   - Review voiceover text
   - Generate TTS via ElevenLabs
   - Run lip sync on character base image
   - Record screen capture for B-roll
   - Composite and post
   ```

## Content Mine — Repo Source Mapping

Your repo already has 150+ videos worth of material:

| Repo Source | Faceless Series | Est. Videos |
|-------------|----------------|-------------|
| 44 agent skills | Skills That Run My Business | 44+ |
| GTM Plays (LinkedIn) | 30-Second GTM Plays | 20+ |
| X micro-tips | Terminal Alchemist Tips | 30+ |
| Voice system / anti-slop | How to Not Sound Like AI | 10+ |
| Partner workflows (anonymized) | 30-Second GTM Plays | 15+ |
| Claude Code tricks | Claude Code Secrets | 25+ |
| Cursor skills | Cursor Tricks You Missed | 20+ |

## Repurpose Logic

When the source is a LinkedIn play or X thread:

1. **Read the source** — find the single most visual, most impactful moment
2. **Extract the character's take** — what would the alchemist say about this? Not a summary. A reaction + lesson.
3. **One insight per video** — strip everything else. One moment, one lesson.
4. **Hook with the result** — start with what happened, then show how
5. **Write it conversational** — this is spoken word, not written content

## Batch Mode

When `/faceless batch` is called:

1. Read `workflows/tiktok-index.md` for queued topics
2. Scan `content/linkedin/drafts/` and `content/x/drafts/` for high-potential repurpose targets
3. Generate 3-5 scripts covering different series
4. Save all to `content/tiktok/faceless/drafts/`
5. Present a summary table of all generated scripts

## Error Handling

- **No topic provided**: "What's the topic? Tool tip, build moment, or pattern. One sentence."
- **Topic too complex for 30 seconds**: "That's a full tutorial. What's the ONE moment that makes someone say 'wait, how?' Let's script around just that."
- **Source file not found**: "Couldn't find that file. Drop the path or describe the tip."
- **No matching series**: Script as standalone. Suggest which series it could start.

## Collaborates With

- **TikTok Script** (`tiktok-script/SKILL.md`): Face-to-camera version. Faceless scripts follow the same structure but add character dialogue and expression cues.
- **Viral Hooks** (`viral-hooks/SKILL.md`): Hook options compressed to 8 words for on-screen text
- **Play Draft** (`play-draft/SKILL.md`): LinkedIn/X drafts feed `/faceless repurpose`
- **Content Images** (`content-images/SKILL.md`): Can generate thumbnail graphics for the video
- **ElevenLabs**: TTS generation from the ElevenLabs Text Block section
