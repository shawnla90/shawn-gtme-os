---
name: skill-play
description: Turn a Cursor skill you use into LinkedIn and X content drafts for the "Skills I use everyday" series. Use when the user types /skillplay or /skill play with a skill name (e.g., voice-modularity, play-draft, final-copy).
---

# Skill Play — Skill File to Content Draft

Takes a Cursor skill (by name or path) and generates LinkedIn and X drafts for the **Skills I use everyday** series. The skill file provides the context — no screenshot required. Optional screenshot of the skill in action can enhance the draft.

This is the "I just used/acquired this skill, let's turn it into a post" command.

## Command Pattern

- `/skillplay` — use the skill in current context (e.g., file open, or user names a skill)
- `/skillplay <skill-name>` — use a specific skill (e.g., `voice-modularity`, `play-draft`, `final-copy`)
- `/skill play <skill-name>` — same as above
- Also triggers when the user says "skill play", "draft from this skill", "turn this skill into a post"

## What Makes This Different from /playdraft

`/playdraft` is screenshot-first: you show what you built, the screenshot is proof.

`/skillplay` is skill-first: the skill file IS the source. You're documenting a skill you use. The skill's purpose, triggers, and workflow become the post content. Screenshot optional (e.g., cursor with skill open, skill output).

## Workflow

### Step 1: Resolve the Skill

1. **If skill name provided**: Map to path. Common mappings:
   - `voice-modularity` / `voice` → `skills/tier-1-voice-dna/core-voice.md` + `skills/tier-2-context-playbooks/linkedin.md`, `x-twitter.md`
   - `play-draft` → `.cursor/skills/play-draft/SKILL.md`
   - `final-copy` → `.cursor/skills/final-copy/SKILL.md`
   - `image-to-content` → `.cursor/skills/image-to-content/SKILL.md`
   - `value-pin-comments` → `.cursor/skills/value-pin-comments/SKILL.md`
   - `slack-sync` → `.cursor/skills/slack-sync/SKILL.md`
   - `update-github` → `.claude/skills/update-github/SKILL.md`
   - Any skill in `.cursor/skills/{name}/SKILL.md`
2. **If skill in context** (e.g., user has a skill file open): Use that file
3. **If nothing found**: List available skills from `.cursor/skills/` and `workflows/skills-series-index.md`, ask user to pick

### Step 2: Get Series Part Number

Read `workflows/skills-series-index.md`:
- If the skill is already canonized, use that part number
- If it's new, assign the next available part number and update the index (add to Active Skills table)
- Part 1 (Voice Modularity) includes the series kickoff P.S.

### Step 3: Extract Skill Context

Read the skill file(s) and extract:
- **Name and trigger**: What the skill is called, when it fires
- **What it does**: Core workflow, inputs, outputs
- **Why it matters**: Problem it solves, fit in the content OS
- **Real example**: Any scenario or "I use this when..." moment
- **Differentiating detail**: What makes this skill distinct from similar ones

### Step 4: Load Voice and Pillar References

- `skills/tier-1-voice-dna/core-voice.md`
- `skills/tier-1-voice-dna/viral-hooks.md` — hook styles (creative benchmark layer; use at opener level)
- `skills/tier-2-context-playbooks/linkedin.md`
- `skills/tier-2-context-playbooks/x-twitter.md`
- `skills/tier-3-content-ops/pillars/skill-system-shares.md` — this pillar applies to all skill plays

### Step 5: Generate LinkedIn Drafts (3 Versions)

**File path**: `content/linkedin/drafts/YYYY-MM-DD_{skill-slug}.md`

**File structure**:
```markdown
# {Skill Display Name} — {One-Liner}

> **Platform**: LinkedIn
> **Pillar**: Skill/System Shares
> **Series**: Skills I use everyday, Part {n}
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Skill**: {skill-path}
> **Screenshot**: {optional}

---

## Hook Options (2–5 alternatives for first line)

Generate 2–5 scroll-stopping opener options using styles from `viral-hooks.md`. User can swap these in.

1. [hook option]
2. [hook option]
…

---

## Version 1: {Angle Name}

{Post body — use one of the hook options or a variant as the opener}

shawn ⚡ the gtme alchemist 🧙‍♂️

{P.S. only for Part 1 — series kickoff}

---

## Version 2: ...

---

## Version 3: ...

---

## Comment Thread Content
...

---

## Notes

{Skill context, part number rationale}
```

**Version angles for Skill/System Shares**:
- **The System Reveal**: Here's what I built and how it works
- **The Meta Take**: Why building this kind of system matters
- **The Invitation**: Here's the framework, make it yours

**Each version must**:
- Use series format: "skills I use everyday, part [n] ⚡" (in body or as natural reference)
- For Part 1 only: Include P.S. "new series in the making. from GTM plays. and now /skills I use everyday. this is part One, [Skill Name] skill in action. don't sleep on the series if you're trying to learn tools like Cursor. lets build!"
- For Part 2+: No P.S. needed unless user wants to reference the series
- Follow voice rules (lowercase first word, capitalize I, no quotes, don't overuse I)
- Reference the skill by name and what it does
- Include real use-case (when you use it, what problem it solves)
- 1000+ characters for LinkedIn

### Step 6: Generate X Drafts (10-Post Story Arc)

**File path**: `content/x/drafts/YYYY-MM-DD_{skill-slug}.md`

Same structure as play-draft: 10 tweets forming hook → context → problem → build → results → insight → pattern → system → invitation → CTA.

### Step 7: Update Skills Series Index

If the skill is new to the series:
- Add a row to the Active Skills table in `workflows/skills-series-index.md`
- Use the assigned part number

### Step 8: Save and Confirm

1. Save LinkedIn drafts
2. Save X drafts
3. Display: "Drafted from skill: {skill-name}. Skills I use everyday, Part {n}. LinkedIn + X ready. /finalcopy when approved."

## Example

```
User: /skillplay voice-modularity

Response:
1. Maps to core-voice.md + context playbooks (voice modularity = the loop of editing voice rules during writing)
2. Part 1 already canonized in skills-series-index
3. Extracts: write-with vs write-for, editing skill file in real-time, system documents itself
4. Generates 3 LinkedIn versions + 10 X tweets
5. Includes series kickoff P.S. (Part 1)
6. Saves drafts, confirms
```

## Error Handling

- **Skill not found**: "Which skill? I see: {list from .cursor/skills and skills-series-index}. Or give me the path."
- **Ambiguous name**: "Did you mean {skill-a} or {skill-b}?"
- **Skill file unreadable**: "Couldn't read that skill file. Is the path correct?"

## Integration

- **After drafting**: User reviews, picks a version, then `/finalcopy` to convert to plain text
- **Screenshot optional**: User can add a screenshot (e.g., Cursor with skill open) and reference it — enhances the draft
- **Plays index**: Skills series is parallel to GTM plays; both are tracked in workflows/
