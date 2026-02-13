---
name: partner-comms
description: Generate formatted partner update messages for Slack or email from conversation context and user input. Use when the user types /partnercomm slack <partner>, /partnercomm email <partner>, or asks to write a partner update, client update, or status message for Slack or email.
---

# Partner Comms Update

Generate a **copy-paste-ready partner update** from the current conversation context. Two formats:

- **Slack** — BLUF, compact, fits one viewport
- **Email** — Structured, slightly longer, professional with soft CTA

## Command Pattern

| Command | Behavior |
|---------|----------|
| `/partnercomm slack <partner>` | Slack-format update for the named partner |
| `/partnercomm email <partner>` | Email-format update for the named partner |
| `/partnercomm slack` | Slack-format; infer partner from conversation context |
| `/partnercomm email` | Email-format; infer partner from conversation context |

Any text after the partner name is treated as **additional context** the agent folds into the message.

Example: `/partnercomm slack praecipio ran the full 4L web reveal workflow — qualified prospects, built persona prompts, set up email waterfall with conditional logic`

---

## Workflow

### 1. Parse Command

- Extract **format**: `slack` or `email` (required — if missing, ask the user)
- Extract **partner name**: lowercase folder name under `clients/partner/`
- Extract **trailing free-text**: everything after the partner name becomes additional context
- If no partner name is given, infer from the current conversation (most recently discussed partner)

### 2. Load Partner Context

Read the partner's SKILL.md for company overview, active work, and team contacts:

```
clients/partner/<partner>/SKILL.md
```

If `clients/partner/<partner>/resources/contacts.md` exists, read it too for recipient names.

### 3. Gather Conversation Context

Use the **current conversation thread** as the primary source material. Identify:

- What was asked / requested / scoped
- What was built, configured, shipped, or delivered
- What comes next or is still pending
- Any blockers or open questions

### 4. Merge User Input

Fold the user's trailing free-text notes into the context gathered from the conversation. User input takes priority over inferred context when they conflict.

### 5. Generate Message

Apply the format matching the command (`slack` or `email`) using the templates and rules below.

### 6. Output

Display the formatted message **inline in the chat** so the user can copy and paste it. Do NOT auto-send to Slack or email. Do NOT save to a file.

---

## Slack Format — BLUF

> Inherits tone from `skills/tier-2-context-playbooks/internal-team.md`: operational, clear, low ego.

### Template

```
*<Partner> Update — <Mon DD>*

*BLUF:* <One sentence — what happened and why it matters>

*What was asked:*
- <bullet>
- <bullet>

*What was done:*
- <bullet>
- <bullet>
- <bullet>

*What's next:*
- <bullet>
- <bullet>
```

If and only if a blocker exists, append:

```
*Blocker:*
- <bullet> — need <specific ask>
```

### Slack Rules

| Rule | Detail |
|------|--------|
| Sections | BLUF, What was asked, What was done, What's next (+ optional Blocker) |
| Bullets per section | 2-3 max |
| Bullet length | ~15 words max per bullet |
| Formatting | Slack bold (`*bold*`) for section headers |
| Greetings / sign-offs | None — no "Hi team", no "— Shawn", no "Let me know" |
| Filler | Zero — no "just wanted to update", no "hope this helps" |
| Length | Entire message fits in one Slack viewport without scrolling |
| Tone | Direct, operational, confident — say what was done, not what was attempted |

---

## Email Format

> Inherits tone from `skills/tier-2-context-playbooks/client-comms.md`: clear, confident, collaborative. Structure follows Diagnosis → Impact → Next Step.

### Template

```
Subject: <Partner> — <Brief Topic> Update (<Mon DD>)

Hi <recipient(s)>,

Quick update on <topic>:

**What was done:**
- <bullet with slightly more detail>
- <bullet>

**What's live / delivered:**
- <bullet>

**What's next:**
- <bullet>
- <bullet>

**Blocker (if any):**
- <bullet> — need <specific ask>

Let me know if you have questions or want to adjust direction.

— Shawn
```

### Email Rules

| Rule | Detail |
|------|--------|
| Subject line | Under 60 characters; format: `Partner — Topic Update (Date)` |
| Sections | What was done, What's live, What's next, Blocker (optional) |
| Bullets per section | 4 max |
| Bullet length | ~25 words max per bullet |
| Opening | One-line context sentence ("Quick update on...") |
| Closing | Soft CTA + sign-off ("Let me know..." / "— Shawn") |
| Recipient | Pull from partner contacts if available; otherwise use generic "team" |
| Tone | Professional but not stiff — no corporate jargon, no over-selling |
| Avoid | Sounding frantic, shifting blame, vague recommendations, walls of text |

---

## Voice Inheritance

- **Core voice**: `skills/tier-1-voice-dna/core-voice.md`
- **Slack tone**: `skills/tier-2-context-playbooks/internal-team.md` — operational, clear, low ego
- **Email tone**: `skills/tier-2-context-playbooks/client-comms.md` — clear, confident, collaborative

---

## Error Handling

| Condition | Response |
|-----------|----------|
| No format specified | Ask: "Slack or email format?" |
| Partner not found | "Partner '{name}' not found. Available: {list from `clients/partner/`}" |
| No conversation context | "I don't have enough context to generate an update. Add details after the command or run this after a workflow." |
| Partner SKILL.md missing | Proceed with user-provided context only; note the partner directory is incomplete |

---

## Related Files

- Partner skill trees: `clients/partner/<partner>/SKILL.md`
- Internal team playbook: `skills/tier-2-context-playbooks/internal-team.md`
- Client comms playbook: `skills/tier-2-context-playbooks/client-comms.md`
- Core voice: `skills/tier-1-voice-dna/core-voice.md`
- Slack MCP skill: `.cursor/skills/slack-mcp/SKILL.md`
