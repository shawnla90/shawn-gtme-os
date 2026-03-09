---
name: substack-note
description: Generate short Substack Notes (feed posts) from the daily tracker log. Auto-scans accomplishments, pipeline, and stats to produce 3-5 copy-paste-ready note options. Use when the user types /substacknote or asks to post a quick update to Substack Notes.
---

# Substack Note Command

Generate short, casual Substack Notes from what you actually built today. Reads the daily tracker log, maps accomplishments to note categories, and produces 3-5 copy-paste-ready options for the Substack Notes feed.

Notes are not articles. They're the "what's on your mind" layer of Substack. 1-4 sentences, ultra-casual, builder energy. They keep you visible between full posts and build subscriber engagement through presence.

## Command Pattern

| Command | What it does |
|---------|-------------|
| `/substacknote` | Auto-scan today's tracker log, generate 3-5 note options across categories |
| `/substacknote <topic>` | Generate a note on a specific topic (still voice-matched, still reads tracker for context) |
| `/substacknote screenshot` | Generate a note designed to pair with a screenshot attachment |
| `/substacknote yesterday` | Scan yesterday's log if today's doesn't exist yet |

Also triggers on: "substack note", "quick substack post", "post to substack notes", "what's on my mind post".

## Workflow

### Step 1: Load the Daily Log

1. Determine the target date:
   - Default: today (`YYYY-MM-DD`)
   - If `/substacknote yesterday`: yesterday's date
   - If today's log doesn't exist: fall back to yesterday automatically
2. Check if `data/daily-log/{date}.json` exists
   - **If yes**: read it
   - **If no**: run the daily scanner first:
     ```bash
     python3 scripts/daily_scan.py
     ```
     Then read the generated log
3. Parse the JSON and extract:
   - `accomplishments[]` — what was shipped/created today
   - `pipeline.drafts_active[]` — what's in the pipeline
   - `pipeline.finalized_today[]` — what was finalized
   - `stats.output_score` and `stats.letter_grade` — daily score
   - `stats.total_words` — total words written
   - `stats.platform_counts` — per-platform breakdown
   - `git_summary` — commits, files added/modified

### Step 2: Load Voice References

Read these files for tone calibration:

1. `skills/tier-1-voice-dna/core-voice.md` — foundation voice
2. `skills/tier-2-context-playbooks/substack.md` — Substack tone (see the "Notes (Feed Posts)" section)

### Step 3: Categorize and Map to Note Types

Map tracker data to the 5 note categories. Only generate notes for categories where there's enough signal.

| Category | Tracker Signal | What to Write |
|----------|---------------|---------------|
| **Build Update** | `substack_final`, `skill_updated`, new scripts, finalized content | What you shipped. Lead with the thing, not the feeling about the thing. |
| **What's On My Mind** | Themes from today's draft titles, topics across platforms | A connecting thought between what you're building. Reflective, not conclusive. |
| **Behind The Scenes** | Git commits, file counts, pipeline size, platform counts | Raw numbers or a snapshot of the system. Let the scale speak for itself. |
| **Milestone** | High score/grade, word count totals, finalized count, streak | A stat that hits. Don't celebrate. just state it and let people react. |
| **Quick Take** | Based on what you built/shipped, patterns you noticed | A one-line observation from the build. Not a hot take on the industry. From your build, not from Twitter. |

### Step 4: Generate 3-5 Note Options

For each category where there's signal, generate one note. Rules:

**Length**: 1-4 sentences. Sweet spot is 2-3.

**Tone**: Ultra-casual builder energy. Even more casual than Substack articles. Think texting a friend who builds, not writing for an audience.

**Structure**: Raw text only. No titles, no headers, no formatting, no bullet points. Just sentences.

**Voice rules (strict)**:
- Lowercase everything (except I, I'm, I'll, I've, I built)
- No hashtags
- No CTAs ("subscribe", "follow", "check out my...")
- No exclamation marks
- No em-dashes (use periods for breaks)
- No quotation marks
- No throat-clearing ("here's the thing", "I keep thinking about")
- No emotional telegraphing ("this hit me", "I realized something big")
- Period or no punctuation at end
- Can use ellipsis (...) for trailing thoughts
- Can reference tools by name when relevant (Clay, Cursor, Instantly)
- Can reference the Content OS, the repo, the skill tree naturally

**Anti-patterns (catch these)**:
- Don't announce. Share. "shipped X" not "excited to announce X"
- Don't explain the system. Show what it produced.
- Don't use "just" as a minimizer. "shipped the post" not "just shipped the post"
- Don't ask questions for engagement. Notes aren't LinkedIn.
- Don't stack multiple accomplishments into one note. One thing per note hits harder.
- Don't use "we" unless there's actually a team involved.

**Good examples** (calibration):

> shipped the identity post today. second substack in 2 days. the OS is starting to hum.

> 34 drafts in the pipeline across 4 platforms. one repo. one system. no spreadsheets.

> been thinking about how every skill I build teaches me something about the next one. compounding.

> the gap between "I should write about that" and actually having a draft is now about 90 seconds.

> 11,000+ words today across linkedin, x, substack, and reddit. all from one content OS.

> built a new skill today that turns screenshots into content drafts. took 20 minutes. runs forever.

> day 3 of publishing on substack. already have 4 posts queued. the backlog is the system working.

> something clicks different when you build the tool that builds the content that builds the audience.

### Step 5: Display Options

Present the notes numbered with category labels:

```
## Substack Notes — {date}

Generated from today's tracker log ({N} accomplishments, {score} pts).

Pick one to post (or ask for variations):

**1. [Build Update]**
shipped the identity post today. second substack in 2 days. the OS is starting to hum.

**2. [What's On My Mind]**
been thinking about how every skill I build teaches me something about the next one. compounding.

**3. [Behind The Scenes]**
34 drafts in the pipeline across 4 platforms. one repo. one system. no spreadsheets.

**4. [Milestone]**
11,000+ words today across linkedin, x, substack, and reddit. all from one content OS.

**5. [Quick Take]**
the gap between "I should write about that" and actually having a draft is now about 90 seconds.
```

Wait for the user to pick one, request a variation, or edit inline.

### Step 6: Save the Selected Note

After the user picks (e.g., "2" or "go with the milestone one"):

1. Generate a slug from the note category and a keyword (e.g., `build-update-identity-post`, `milestone-11k-words`)
2. Save to `content/substack/notes/YYYY-MM-DD_{slug}.md`:

```markdown
> **Platform**: Substack Notes
> **Date**: YYYY-MM-DD
> **Category**: {category-slug}
> **Status**: ready

---

{note text exactly as selected}
```

3. Update the Notes Log in `workflows/substack-index.md`:
   - Add a row: `| YYYY-MM-DD | {first 60 chars of note}... | {category} |`

### Step 7: Display Final

Show the clean note text one more time, ready to paste:

```
Saved to: content/substack/notes/{filename}

Copy-paste for Substack Notes:

---
{note text}
---

Paste this into Substack Notes (substack.com/notes). Add a screenshot if you have one from the build.
```

## Handling `/substacknote <topic>`

When the user provides a topic:

1. Still read the daily log for context (stats, accomplishments give it grounding)
2. Generate 3 note variations on the topic, each in a different category tone:
   - One as a build update angle
   - One as a reflective/what's-on-my-mind angle
   - One as a quick take angle
3. Follow the same display/pick/save flow

## Handling `/substacknote screenshot`

When the user wants a screenshot-paired note:

1. Read the daily log
2. Generate 3 notes optimized to accompany a visual:
   - Shorter text (1-2 sentences). The screenshot does the heavy lifting.
   - Reference what's visible without over-explaining ("the skill tree after today's build" not "this is a screenshot of my Cursor IDE showing the skill tree directory structure")
   - Notes should make the reader want to look at the image
3. Ask the user what screenshot they're attaching (or if one is already in conversation context, reference it)
4. Follow the same display/pick/save flow

## Output Quality Rules

### Voice (inherited from core-voice + substack playbook)

- **Capital I**: Always. I'm, I'll, I've, I built.
- **No quotation marks**: Write phrases directly, not in quotes.
- **No em-dashes**: Period + space for breaks.
- **Lowercase first word**: Unless proper noun or I.
- **Builder-first**: Sharing from the build, not announcing to an audience.

### Anti-Slop (from substack playbook)

- No throat-clearing
- No tripling (two examples max)
- No metaphor closers
- No emotional telegraphing
- No hidden knowledge framing
- Punchlines get their own paragraph (or in Notes, their own sentence)

### Notes-Specific (additional rules)

- No structure. No headers. No bullets. Just sentences.
- No CTAs. Ever. Notes build presence, not funnels.
- No "I just..." minimizing. State what you did.
- One idea per note. Don't stack accomplishments.
- Let numbers speak. "11,000 words" hits harder than "a lot of writing."
- Screenshots > descriptions. If you have a visual, the text can be shorter.

## Error Handling

- **No daily log exists and scanner fails**: "No tracker data for today yet. Run `/tracker` first, or tell me what you worked on and I'll draft a note from that."
- **Empty accomplishments**: Generate notes from pipeline data and git summary instead. If those are also empty: "Quiet day on the tracker. Want to write a note about something specific?"
- **User doesn't pick a note**: "No worries. Notes are saved as options in the conversation. Come back to it later or run `/substacknote` again."
- **Notes directory doesn't exist**: Create `content/substack/notes/` automatically.

## Integration

- **Daily tracker** (`/tracker`): Reads the same `data/daily-log/YYYY-MM-DD.json`. Workflow: `/tracker` to see what you did, then `/substacknote` to post about it. Or just `/substacknote` which auto-runs the scanner if needed.
- **Substack articles** (`/substackpost`): Notes and articles are different content types. Notes are the casual feed layer. Articles are deep dives. A note can tease an upcoming article, but don't use notes as article previews.
- **Cross-platform**: Notes are Substack-native. Don't repost them to LinkedIn or X. They're for the Substack audience specifically.
- **Substack index** (`workflows/substack-index.md`): Selected notes get logged in the Notes Log section for tracking.

## Examples

### Example 1: `/substacknote` on a heavy shipping day

**Tracker data**: 2 finalized posts, 6 new drafts, 11,000 words, score A (44 pts)

**Generated options**:

1. [Build Update] shipped the identity post and started the cursor discovery draft. two substacks in the pipeline now.
2. [What's On My Mind] the more I build the OS the more I realize the content isn't the product. the system that makes the content is the product.
3. [Behind The Scenes] 6 new drafts today. linkedin, x, substack, reddit. all from one cursor workspace.
4. [Milestone] 11,000 words across 4 platforms today. A grade on the tracker. the OS is working.
5. [Quick Take] content used to be the bottleneck. now it's the easiest part of the whole operation.

### Example 2: `/substacknote screenshot` after building a new skill

**User context**: Just built the `/substacknote` skill itself

**Generated options**:

1. [Build Update] new skill. `/substacknote` reads my daily tracker and drafts notes for the substack feed. meta.
2. [Behind The Scenes] the skill tree keeps growing. this one turns daily accomplishments into substack notes automatically.
3. [Quick Take] building a system that posts about itself. we're deep in the recursion now.

### Example 3: `/substacknote` on a light day

**Tracker data**: 1 draft, 2 commits, score C (8 pts)

**Generated options**:

1. [Build Update] working on the cursor discovery post for friday. this one needs more time to cook.
2. [What's On My Mind] some days are shipping days. some days are thinking days. both move the system forward.
3. [Behind The Scenes] quiet day on the tracker but the pipeline has 34 drafts ready. inventory is the strategy.
