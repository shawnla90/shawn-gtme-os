---
name: play-draft
description: Turn a screenshot of something you built, shipped, or accomplished into LinkedIn and X content drafts. Use when the user types /playdraft with a screenshot and context about the scenario and pillar.
---

# Play Draft — Screenshot to Content Draft

Takes a screenshot of something you built, shipped, or accomplished (a successful automation, a system output, a workflow result, a tool setup) and generates LinkedIn and X drafts following the standard content creation process.

This is the "I just built something cool, let's turn it into a post" command.

## Command Pattern

- `/playdraft` — use the screenshot in the current conversation + user's context
- `/playdraft <image-path>` — use a specific screenshot file
- Also triggers when the user says "turn this into a post", "let's draft this", "make a post from this screenshot" alongside a screenshot

## What Makes This Different from /imagecontent

`/imagecontent` is for any image (game screenshots, memes, diagrams) where the image IS the content hook.

`/playdraft` is for screenshots of **your own work output** — the screenshot is proof/evidence, and the story is about what you built, why, and what it means. The screenshot shows the receipts.

## Workflow

### Step 1: Identify the Screenshot

1. **If image path provided**: Use that file
2. **If screenshot is in conversation context**: Use the image the user is referencing
3. **If no screenshot**: Check recently viewed image files
4. **If nothing found**: Ask: "Drop a screenshot of what you built and I'll draft it up."

### Step 2: Extract Screenshot Context

Read the screenshot and extract:
- **What tool/system is shown** (Cursor output, terminal, Slack, dashboard, etc.)
- **Visible text and data points** (stats, summaries, results, file paths)
- **What was accomplished** (sync completed, automation ran, system built, etc.)
- **Quantifiable results** (messages pulled, decisions captured, items tracked, etc.)

### Step 3: Gather User Context

The user will provide (in their message or via follow-up):

**Required**:
- **The scenario**: What did you build/ship? What problem does it solve?
- **The pillar**: Which content pillar does this map to?

**Available pillars** (from `skills/tier-3-content-ops/pillars/`):
1. **Plays Series** — documenting a specific GTM play/workflow running in production. Format: "gtm plays i use every day, part [n] ⚡". Best when showing a specific repeatable workflow.
2. **Building & Sharing** — narrative, reflective, personal journey about building something. Best for "I just built this thing" stories.
3. **Skill/System Shares** — sharing frameworks, skill files, systems you built. Best when the thing you built is something others can learn from or use.
4. **GTM Memes** — short text + visual. Rarely used for /playdraft.
5. **Release Reactions** — first-hand builder take on new tool features. Best when reacting to a new tool/feature you tested.

**Optional** (ask if not provided):
- **Which play number** (if Plays Series pillar — reference `workflows/plays-index.md`)
- **Key angle or theme** the user wants to emphasize
- **Target audience** (GTM engineers, SDRs, builders, ops people, etc.)

**If the user doesn't specify a pillar**, infer it from context:
- Screenshot of a workflow/automation result → likely **Plays Series** or **Skill/System Shares**
- Screenshot of something personal they built → likely **Building & Sharing**
- Screenshot of a new tool feature → likely **Release Reactions**
- When in doubt, ask: "Which pillar fits this best? Plays Series, Building & Sharing, or Skill/System Shares?"

### Step 4: Load Pillar and Voice References

Read the relevant files before drafting:
- `skills/tier-3-content-ops/pillars/{pillar-file}.md` — pillar-specific structure and voice
- `skills/tier-1-voice-dna/core-voice.md` — core voice principles
- `skills/tier-1-voice-dna/viral-hooks.md` — hook styles (creative benchmark layer; use at opener level)
- `skills/tier-2-context-playbooks/linkedin.md` — LinkedIn formatting
- `skills/tier-2-context-playbooks/x-twitter.md` — X formatting

**For Plays Series specifically**, also read:
- `workflows/plays-index.md` — to reference the correct play number and avoid duplicates

### Step 5: Generate LinkedIn Drafts (3 Versions)

Create one markdown file with **three different versions** of the LinkedIn post.

**File path**: `content/linkedin/drafts/YYYY-MM-DD_{slug}.md`

**File structure**:
```markdown
# {Title}

> **Platform**: LinkedIn
> **Pillar**: {Pillar name}
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Screenshot**: {screenshot-filename}

---

## Hook Options (2–5 alternatives for first line)

Generate 2–5 scroll-stopping opener options using styles from `viral-hooks.md` (curiosity, contrarian, data bomb, story opener, problem-first, direct challenge). User can swap these in.

1. [hook option]
2. [hook option]
3. [hook option]
…

---

## Version 1: {Angle Name}

{Post body — use one of the hook options or a variant as the opener}

---

## Version 2: {Different Angle Name}

{Post body}

---

## Version 3: {Third Angle Name}

{Post body}

---

## Comment Thread Content

**Comment 1:**
{First comment — deeper technical detail, the "how"}

**Comment 2:**
{Second comment — resources, links, or "no gatekeeping" delivery}

**Comment 3:**
{Third comment — invitation or follow-up context}

---

## Notes

{Screenshot reference, key data points extracted, pillar rationale}
```

**Version angles by pillar**:

For **Plays Series**:
- **The Workflow Walkthrough**: Step-by-step of what the play does
- **The Pain Point Hook**: Lead with the problem this solves
- **The Results Angle**: Lead with the quantifiable output

For **Building & Sharing**:
- **The Builder Story**: Personal narrative of building this thing
- **The Process Angle**: Focus on the messy/real process
- **The Pattern Recognition**: What you realized while building

For **Skill/System Shares**:
- **The System Reveal**: Here's what I built and how it works
- **The Meta Take**: Why building this kind of system matters
- **The Invitation**: Here's the framework, make it yours

For **Release Reactions**:
- **The First Take**: Raw reaction to the new feature/tool
- **The Builder Test**: How you tested it in production
- **The Implications**: What this means for GTM/builders

**Each version must**:
- Start with lowercase first word (unless proper noun or first-person I — always capitalize I, I'm, I'll)
- Follow the specific pillar structure (see pillar file)
- Match the pillar's voice (Plays = technical + step-by-step, Building = reflective + narrative, Skill/System = meta + framework-sharing)
- Include emoji markers (⚡ 🧙‍♂️) for identity
- End with sign-off: "shawn ⚡ the gtme alchemist 🧙‍♂️"
- Be 1000+ characters for LinkedIn performance
- Reference the screenshot naturally ("here's what the output looked like", "the screenshot shows...")
- Include real data points from the screenshot (numbers, stats, results)

**For Plays Series posts specifically**:
- Use the series format: "gtm plays i use every day, part [n] ⚡"
- Include step-by-step workflow with emoji markers (✅ 🔧 🔗 🧠 ➡️)
- End with "no gatekeeping" + resource delivery to comments
- Reference the play number from the plays index

### Step 6: Generate X Drafts (4-5 Post Thread)

Create one markdown file with **4-5 tweets** that form a tight comment thread.

Threads longer than 5 tweets have diminishing returns on X. Each tweet should be a standalone banger that also builds the narrative forward. The goal is density, not length.

**File path**: `content/x/drafts/YYYY-MM-DD_{slug}.md`

**File structure**:
```markdown
# {Title}

> **Platform**: X (thread)
> **Pillar**: {Pillar name}
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Screenshot**: {screenshot-filename} (attach to tweet 1)

---

## Hook Options for Tweet 1 (2–5 alternatives)

Generate 2–5 scroll-stopping first-tweet options using styles from `viral-hooks.md`. X hooks are faster and punchier than LinkedIn.

1. [hook option]
2. [hook option]
…

---

## Tweet 1 (Hook)

{First tweet — standalone hook, screenshot attached. Must stop the scroll on its own.}

---

## Tweet 2 (The Build / Context)

{What you built, why, and the core mechanic. Compress the problem + solution into one tweet.}

---

## Tweet 3 (The Substance)

{The specific details — tools, steps, results, real data from the screenshot. This is the meat.}

---

## Tweet 4 (The Insight / Pattern)

{What you learned, what clicked, or the broader pattern this reveals. The takeaway.}

---

## Tweet 5 (CTA / Resource Delivery) [optional — use when there's a resource to share]

{Sign-off, follow CTA, or resource link. Only include if it adds value — 4 tweets is fine if the thread is tight.}

---

## Notes

{Screenshot reference, key themes, pillar rationale}
```

**Thread structure by pillar**:

For **Plays Series**: Hook (pain + play) → Setup (tool + signal) → Steps (1-2 per tweet) → Resource delivery
For **Building & Sharing**: Hook (what you built) → The messy process → The insight → What's next
For **Skill/System Shares**: Hook (the system) → How it works → Why it matters → Where to get it
For **Release Reactions**: Hook (what changed) → How you tested it → What it means → Forward-looking take

**Each tweet must**:
- Start with lowercase first word (except I — always capitalize; don't overuse I; no quotation marks)
- Be under 280 characters
- Stand alone (readable without context)
- Build on previous tweets
- Follow X voice guide (punchy, builder, casual)
- Use emoji sparingly and structurally

### Step 7: Save and Confirm

1. **Save LinkedIn drafts**: `content/linkedin/drafts/YYYY-MM-DD_{slug}.md`
2. **Save X drafts**: `content/x/drafts/YYYY-MM-DD_{slug}.md`
3. **Display confirmation**:
   ```
   Drafted from screenshot:

   LinkedIn: content/linkedin/drafts/YYYY-MM-DD_{slug}.md
      - Pillar: {pillar name}
      - 3 versions ready for review

   X: content/x/drafts/YYYY-MM-DD_{slug}.md
      - Pillar: {pillar name}
      - 4-5 post thread ready for review

   Next step: Review drafts, pick a version, then /finalcopy when ready.
   ```

## Example Scenarios

### Example 1: Slack Sync Completion (Skill/System Shares)
```
User: [screenshot of Slack sync completion output]
User: /playdraft — just finished building the slack sync skill. it pulls 191 messages,
      categorizes them, extracts decisions and action items. Skill/System Shares pillar.

Response:
1. Reads screenshot (extracts: 191 messages, 61 Shawn references, 14 decisions, 28 deliverables)
2. Loads Skill/System Shares pillar guide
3. Generates 3 LinkedIn versions (System Reveal, Meta Take, Invitation)
4. Generates 4-5 X thread (hook → CTA arc)
5. Saves both files with slug "slack-sync-skill"
6. Confirms with file paths
```

### Example 2: Instantly Campaign Results (Plays Series)
```
User: [screenshot of Instantly campaign analytics]
User: /playdraft — this is play 16, email warm-up automation. Plays Series.

Response:
1. Reads screenshot (extracts campaign stats)
2. Loads Plays Series pillar + plays-index.md
3. Uses "gtm plays i use every day, part 16 ⚡" format
4. Generates 3 LinkedIn versions (Workflow Walkthrough, Pain Point Hook, Results Angle)
5. Generates 4-5 X thread
6. Saves both files
```

### Example 3: New Cursor Feature Test (Release Reactions)
```
User: [screenshot of new Cursor feature]
User: /playdraft — just tested the new background agents feature. Release Reactions.

Response:
1. Reads screenshot (extracts feature details)
2. Loads Release Reactions pillar
3. Generates 3 LinkedIn versions (First Take, Builder Test, Implications)
4. Generates 4-5 X thread
5. Saves both files
```

### Example 4: Weekend Build (Building & Sharing)
```
User: [screenshot of repo structure or terminal output]
User: /playdraft — spent 12 hours this weekend building this. Building & Sharing.

Response:
1. Reads screenshot (extracts visible structure/output)
2. Loads Building & Sharing pillar
3. Generates 3 LinkedIn versions (Builder Story, Process Angle, Pattern Recognition)
4. Generates 4-5 X thread
5. Saves both files
```

## Error Handling

- **No screenshot found**: "Drop a screenshot of what you built and I'll draft it up."
- **Screenshot unreadable**: "Couldn't read that screenshot. Is it a supported format (PNG, JPG)?"
- **No scenario context**: "I see the screenshot, but what's the story? What did you build and which pillar does it fit?"
- **No pillar specified**: Infer from context, or ask: "Which pillar? Plays Series, Building & Sharing, Skill/System Shares, or Release Reactions?"
- **Missing voice/pillar files**: Fall back to general voice principles and pillar descriptions in this skill file

## Integration with Other Skills

- **After drafting**: User reviews, picks a version, then uses `/finalcopy` to convert to plain text
- **Image generation**: User can use `/contentimage` to create a custom graphic instead of using the raw screenshot
- **Typefully push**: User can use `/finalcopy --typefully` to push approved draft to Typefully
- **From /slacksync**: After syncing a partner channel, user can screenshot the result and `/playdraft` it

## Notes

- Always generate both LinkedIn and X drafts
- The screenshot is evidence/proof — reference the real data points from it
- Each pillar has its own structure and voice — follow the pillar guide closely
- The 3 LinkedIn versions give options for different angles on the same build
- The 4-5 X tweets form a tight, high-density thread
- All drafts follow the standard format for consistency with existing workflow
- This command is about turning YOUR work output into content — the screenshot shows the receipts
