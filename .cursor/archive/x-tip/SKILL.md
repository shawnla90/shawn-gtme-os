---
name: x-tip
description: Generate short 2-part X micro-tip posts (post + reply). Use when the user types /xtip with a topic or one-sentence description of the tip.
---

# X Tip — Micro-Tip Generator

Takes a topic or one-sentence description and generates 3 options for a 2-part X micro-tip post (main post + reply). Follows the X Micro-Tips pillar format.

This is the "quick tip post for X" command.

## Command Pattern

- `/xtip <topic>` — generate 3 tip options for the given topic
- `/xtip` — if a topic is in the current conversation context, use that
- Also triggers when the user says "write an X tip about...", "cursor tip for...", "quick X tip"

## Workflow

### Step 1: Identify the Topic

1. **If topic provided**: Use it directly
2. **If topic in conversation context**: Use the topic being discussed
3. **If nothing found**: Ask: "What's the tip? Give me a topic or one sentence."

### Step 2: Determine the Series Prefix

Based on the topic, pick the series prefix:

- **Cursor workflows, agent mode, plan mode, context, skills** --> "cursor tip 101:"
- **MCP servers, setup, configuration** --> "mcp tip:" (future)
- **Outbound, email, deliverability** --> "outbound tip:" (future)
- **General GTM tooling** --> "gtm tip:" (future)

Default to "cursor tip 101:" unless the topic clearly fits another prefix.

### Step 3: Load Voice and Pillar References

Read these files before drafting:

- `skills/tier-1-voice-dna/core-voice.md` — core voice principles
- `skills/tier-1-voice-dna/anti-slop.md` — anti-AI pattern detection
- `skills/tier-2-context-playbooks/x-twitter.md` — X platform playbook
- `skills/tier-3-content-ops/pillars/x-micro-tips.md` — micro-tips pillar definition

### Step 4: Generate 3 Options

Create **three different 2-part options** for the same tip topic. Each option takes a different angle:

**Angle types** (pick 3 that fit the topic):

1. **Direct/Rule-Based**: State the rule. No preamble. "here's the rule. follow it."
2. **Problem-First**: Lead with the pain point, then deliver the tip as the fix.
3. **Punchy One-Liner + Expand**: Shortest possible post. The reply does the heavy lifting.
4. **Contrast/Before-After**: Old way vs. new way. Wrong approach vs. right approach.
5. **Pattern Recognition**: "noticed a pattern..." into the tip.
6. **Builder Confession**: "I used to do X. now I do Y." Honest and self-aware.

**Each option must have**:

- **Post** (main tweet): Under 280 characters. Starts with the series prefix. Lowercase first word (except I). Opinionated, clear, one idea. No sign-off.
- **Reply** (single reply): Under 280 characters. Expands the tip with the how or why. Ends with ⚡ only. No sign-off beyond that.

### Step 5: Voice Rules (Enforce Strictly)

Apply these to every option:

1. **Lowercase first word** of every sentence (except I, I'm, I'll, I've, I'd)
2. **No em-dashes** (---, —, –). Use periods or restructure.
3. **No quotation marks**. Write plain text.
4. **One sentence per line**. No multi-sentence paragraphs.
5. **No narrator setups** ("here's the thing about...", "here's where it gets interesting...")
6. **No authority signaling** ("the uncomfortable truth", "what most people miss")
7. **No dramatic rhetorical framing** ("want to know the crazy part?")
8. **Every word earns its spot**. If a sentence works without a word, cut it.

### Step 6: Present Options

Display all 3 options clearly labeled with their angle name. Let the user pick.

Format:

```
## Option 1: {Angle Name}

**Post:**
{post text}

**Reply:**
{reply text}

---

## Option 2: {Angle Name}

...

---

## Option 3: {Angle Name}

...
```

### Step 7: Save the Chosen Draft

Once the user picks an option (or asks to combine/adjust):

1. **Save to**: `content/x/drafts/YYYY-MM-DD_{tip-slug}.md`
2. **Use this frontmatter**:

```markdown
# {Tip Title}

> **Platform**: X (micro-tip)
> **Pillar**: X Micro-Tips
> **Series**: {series prefix without the colon}
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Format**: 2-part (post + reply)

---

## Post

{post text}

---

## Reply

{reply text}
```

3. **Confirm**: "Saved to {path}. /finalcopy when ready to publish."

## Example

```
User: /xtip always name your agent chats before you start working

Response:

## Option 1: Direct/Rule-Based

**Post:**
cursor tip 101: name your agent chat before you type a single instruction.

future you will thank present you when you're hunting for that one conversation.

**Reply:**
unnamed chats pile up fast. by day three you're scrolling through "New Chat" x47 trying to find where you built that one skill.

takes two seconds. saves ten minutes. every time. ⚡

---

## Option 2: Problem-First

**Post:**
the worst part of Cursor isn't the tool. it's scrolling through 50 unnamed chats trying to find where you built something last Tuesday.

name them. before you start.

**Reply:**
two seconds of naming saves ten minutes of searching.

"slack-sync-build", "email-campaign-fix", "new-pillar-setup".

the name is the retrieval system. treat it like one. ⚡

---

## Option 3: Builder Confession

**Post:**
cursor tip 101: I mass-renamed 40 agent chats last week because I didn't name them upfront.

don't be me. name them before you start.

**Reply:**
a good chat name is a search index.

"plan-mode-tip-draft" beats "New Chat" every single time. your future self is the user. make it findable. ⚡
```

## Error Handling

- **No topic provided and none in context**: "What's the tip? Give me a topic or one sentence and I'll draft 3 options."
- **Topic too broad**: "That's a big topic. Can you narrow it to one specific habit, rule, or pattern?"
- **Topic already drafted**: Check `content/x/drafts/` for existing tip files on the same topic. If found: "Looks like there's already a tip draft on this: {path}. Want to create a new angle or edit that one?"

## Integration

- **After picking**: User reviews, then `/finalcopy content/x/drafts/{file}.md` to convert to plain text
- **Batching**: User can run `/xtip` multiple times in one session to queue up a week of tips
- **Cross-reference**: Tips can seed longer threads or LinkedIn posts if a topic resonates
