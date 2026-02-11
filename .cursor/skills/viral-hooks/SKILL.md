---
name: viral-hooks
description: Generate 2–5 scroll-stopping hook options for LinkedIn or X posts. Complements voice and brand — does not override. Use when the user asks for hook options, opener ideas, first-line variations, or /viralhooks with a post topic or draft.
---

# Viral Hooks — Hook Options Generator

Generates 2–5 scroll-stopping opening lines for social content. This skill is a **creative benchmark layer** — it enhances hooks without altering voice or brand. Activates at the hook level only.

## Command Pattern

- `/viralhooks` — generate hook options for the post topic or draft in context
- `/viralhooks <topic or angle>` — generate hooks for a specific topic
- Also triggers when the user says: "give me hook options", "opener ideas", "first-line variations", "help me with the hook"

## When to Use

- User has a post idea but needs stronger opening lines
- User wants to test multiple hooks before committing
- User is stuck on the first 1–2 lines of a draft
- User asks for scroll-stopping openers for LinkedIn or X

## Workflow

### Step 1: Gather Context

From the user's message or conversation:
- **Topic/angle**: What is the post about?
- **Platform**: LinkedIn or X (default both if unclear)
- **Pillar** (if known): Plays, Building & Sharing, Skill/System, etc.
- **Existing draft** (if provided): First line or full post — use as reference for tone

### Step 2: Load References

Read before generating:
- `skills/tier-1-voice-dna/core-voice.md` — voice principles (hook must match tone)
- `skills/tier-1-voice-dna/viral-hooks.md` — hook styles and benchmarks
- `skills/tier-2-context-playbooks/linkedin.md` — if LinkedIn (Opening Line Style)
- `skills/tier-2-context-playbooks/x-twitter.md` — if X (Opening Line Style)

### Step 3: Generate 2–5 Hook Options

Output **2–5 options** per platform (or 2–5 total if single platform). Mix hook styles from viral-hooks:
- Curiosity Pings
- Contrarian POVs
- Data Bombs
- Story Openers
- Problem-First
- Direct Challenge

**Rules**:
- Lowercase first word (unless proper noun or first-person I — always capitalize I)
- No quotation marks
- Same tone as core voice: builder-first, casual competence
- Platform-aware: LinkedIn = more thought-provoking; X = faster, punchier

### Step 4: Output Format

```markdown
## Hook Options for [Topic/Angle]

**Platform**: [LinkedIn | X | Both]

1. [hook option 1]
2. [hook option 2]
3. [hook option 3]
4. [hook option 4] (optional)
5. [hook option 5] (optional)

**Styles used**: [e.g., Curiosity, Contrarian, Problem-First]
```

Keep output concise. No full post bodies — hooks only.

## Collaborates With

- **Voice** (`core-voice.md`): Hooks must match tone and persona
- **Playbooks** (`linkedin.md`, `x-twitter.md`, `tiktok.md`): Platform-specific opener rules
- **play-draft**, **image-to-content**, **skill-play**, **tiktok-script**: These skills load viral-hooks when generating drafts; use this skill when user wants hook options only
