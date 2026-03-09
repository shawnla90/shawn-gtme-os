---
name: substack-post
description: Draft Substack newsletter posts with context-aware post numbering, structure selection, and repurpose from LinkedIn/X. Use when the user types /substackpost or asks to write a newsletter post.
---

# Substack Post Command

Draft a Substack newsletter post. Context-aware: reads the post index to determine the next post number, suggests structure based on the source material, and handles both new posts and repurposed social content.

## Command Pattern

- `/substackpost` — context-aware: reads substack-index, determines next post #, proposes topic and structure
- `/substackpost <topic>` — draft a new post on a specific topic
- `/substackpost repurpose <path>` — expand a LinkedIn/X draft into newsletter format
- `/substackpost --post <n>` — explicitly set the post number

## Workflow

### Step 1: Read the Index

1. Read `workflows/substack-index.md`
2. Determine:
   - **Next post number**: From the "Next Post" section
   - **Is this the kickoff?**: Post 1 has special handling (series name options, rejuvenation context)
   - **Last published theme**: Avoid repeating the same structure back-to-back
   - **Series name**: Use the working name from the index (or present options if Post 1)

### Step 2: Determine the Source

**If `/substackpost` (no args)**:
- Check if user has a LinkedIn/X draft open or recently discussed
- If yes: suggest repurpose with the appropriate format template
- If no: propose a topic based on recent builds, skills, or plays. Reference the "Next Post" section in substack-index for any pre-planned topics.
- Always ask: "Want me to draft this as [suggested structure]? Or pick a different one: Tactical Breakdown, Personal POV Essay, Contrarian Take, Curated Drop."

**If `/substackpost <topic>`**:
- Use the topic as the core subject
- Suggest the best-fit structure based on the topic:
  - Skill or play → Tactical Breakdown
  - Opinion or reaction → Contrarian Take
  - Build story or milestone → Personal POV Essay
  - Multiple items or links → Curated Drop

**If `/substackpost repurpose <path>`**:
- Read the specified LinkedIn/X draft file
- Apply the Newsletter Repurpose format templates:
  - High-engagement post → Post to Essay
  - Strong one-liner → Social Idea to Deep Dive
  - Multiple related posts → Thread Recap to Digest
  - Compressed story → Story in Layers
- Expand to 300–800 words while preserving voice and adding depth

### Step 3: Load Voice and Pillar References

Read these files for voice and structural guidance:

1. `skills/tier-1-voice-dna/core-voice.md` — foundation voice
2. `skills/tier-1-voice-dna/viral-hooks.md` — hook styles for subject lines
3. `skills/tier-2-context-playbooks/substack.md` — Substack-specific voice, formatting, structures
4. `skills/tier-3-content-ops/pillars/newsletter-editorial.md` — structure templates
5. `skills/tier-3-content-ops/pillars/newsletter-growth.md` — CTA guidance
6. `skills/tier-3-content-ops/pillars/newsletter-repurpose.md` — repurpose format templates (if repurposing)

### Step 4: Generate the Draft

**File path**: `content/substack/drafts/YYYY-MM-DD_{slug}.md`

**File structure**:

```markdown
# {Title}

> **Platform**: Substack
> **Series**: AI Alchemy, Post {n}
> **Structure**: {Personal POV Essay | Tactical Breakdown | Contrarian Take | Curated Drop}
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Source**: {new | repurposed from content/linkedin/drafts/... | repurposed from content/x/drafts/...}
> **Visual**: {description of screenshot/artifact to include}

---

## Series Name Options (Post 1 only)

1. AI Alchemy
2. AI Alchemy Lab
3. AI Alchemy Notes
4. {other variations}

Pick the series name before finalizing. This sets the brand for all future posts.

---

## Subject Line Options

1. {option — lowercase, 5–10 words, scroll-stop}
2. {option}
3. {option}

## Preview Text

{1 sentence — what this issue covers}

---

## Post Body

{300–800 words in the chosen structure}

{Body follows Substack playbook rules: lowercase first word, capitalize I, no quotes, no em-dashes, markdown native with ## headers for sections}

shawn ⚡ the gtme alchemist 🧙‍♂️

---

## CTA Block

{Value-led CTA from newsletter-growth pillar. Not "subscribe" energy.}

---

## Visual Notes

{What screenshot/artifact to attach. Should be something you already have from building.}

---

## Cross-Platform Notes

{Optional: How this could compress back into LinkedIn/X. Or reference the source post if repurposed.}

---

## Notes

{Internal: why this structure, what the next post could be, any follow-up ideas}
```

### Step 5: Post 1 Special Handling

If this is Post 1 (the kickoff/rejuvenation post):

1. **Include series name options** as a section in the draft (user picks before finalizing)
2. **Acknowledge the gap**: 9 months since last post, Beehiiv → Substack migration, 50 early subs. Don't over-explain, but acknowledge the evolution.
3. **Show the new system**: The Content OS, the skill tree, the repo. This is the "here's what I've been building" reveal.
4. **Set expectations**: What the newsletter covers now, roughly how often, what's coming next.
5. **No apology energy**: You weren't gone — you were building. The newsletter catches up to where you already are.
6. **Tone**: Excited builder energy, not "sorry I've been away." Lead with what's new, not what was missing.

### Step 6: Update the Index

After generating the draft:

1. Add a row to the "New Era Posts" table in `workflows/substack-index.md`:
   - Post #, working title, date, structure, source, visual description, status: `draft`
2. Update "Next Post" to point to the next number
3. If Post 1 and user has picked a series name, update the working name throughout the index

### Step 7: Save and Confirm

1. Save the draft to `content/substack/drafts/YYYY-MM-DD_{slug}.md`
2. Display:
   ```
   Drafted: AI Alchemy, Post {n} — "{working title}"
   Structure: {structure name}
   Word count: ~{count}
   Source: {new / repurposed from ...}
   Saved to: content/substack/drafts/{filename}
   
   Review and edit, then copy-paste into Substack editor.
   ```
3. If Post 1: "Series name options included in the draft — pick one before publishing."

## Output Quality Rules

### Voice (from core-voice + substack playbook)

- **Capital I**: Always. I'm, I'll, I've, I built.
- **No quotation marks**: Write phrases directly, not in quotes.
- **No em-dashes**: Period + space for breaks. "we're evolving. and fast" not "we're evolving — and fast"
- **Lowercase first word**: Unless proper noun or I.
- **Builder-first**: Sound like you're sharing from the build, not consulting from theory.
- **No gatekeeping**: Resources, files, links shared openly.

### Anti-Slop (from substack playbook — `skills/tier-2-context-playbooks/substack.md`)

These are the most common AI drift patterns in Substack drafts. Catch them during generation:

- **No throat-clearing** -- cut "here's the thing", "here's what I keep coming back to", "here's where I have to be honest." Go direct.
- **No tripling** -- two examples is cleaner than three. AI defaults to three parallel items. Use two unless each one genuinely adds something.
- **No metaphor closers** -- if the direct statement lands, the analogy weakens it. Cut similes tacked onto the end of paragraphs.
- **No emotional telegraphing** -- don't preview how the reader should feel. Let the content create the emotion.
- **No hidden knowledge framing** -- don't use "nobody tells you", "what most people miss." Say it directly.
- **Lowercase days** -- "friday", "monday" not "Friday", "Monday."
- **Punchlines get their own paragraph** -- don't bury one-line statements inside longer blocks.

### Structure (from substack playbook)

- 300–800 words. Can go longer for essays if the content earns it.
- Headers (`##`) for major sections in longer posts.
- One visual minimum per post.
- Subject line does the hook work. Body can start softer.
- CTA is value-led, not list-led.

### Markdown (Substack native)

- Use `##` headers, `**bold**`, `- bullets`, `` `code` `` natively. Substack renders markdown.
- Code blocks for prompts, formulas, or configs.
- No need to strip markdown like LinkedIn. Substack is the long-form home.

## Error Handling

- **Index not found**: Create `workflows/substack-index.md` with the template from this skill, set Post 1 as next.
- **No topic or source**: Propose 2–3 topics based on recent LinkedIn/X drafts in `content/linkedin/drafts/` and `content/x/drafts/`. Ask user to pick.
- **Repurpose path not found**: "Couldn't find that draft. Try `/substackpost repurpose content/linkedin/drafts/your-file.md`"
- **Already drafted this post #**: Warn: "Post {n} already has a draft. Want to create a second version or increment to Post {n+1}?"

## Integration

- **After drafting**: User reviews, picks subject line and (for Post 1) series name. Then copy-paste into Substack editor.
- **Future: Substack MCP**: When `marcomoauro/substack-mcp` or similar is added via `/addmcp substack`, add a `--push` flag to create drafts directly in Substack (similar to Typefully in `/finalcopy`).
- **Cross-platform**: After Substack publish, condense back to LinkedIn/X using `/playdraft` or manual compression. Note the Substack link as the "deeper version" CTA.

## Examples

### Example 1: Kickoff post (Post 1)
```
User: /substackpost

→ Reads substack-index: Next is Post 1 (Content OS reveal)
→ Suggests Tactical Breakdown structure
→ Loads voice + all pillar refs
→ Generates draft with series name options, subject lines, 500-word body
→ Saves to content/substack/drafts/2026-02-11_content-os-reveal.md
→ "Drafted: AI Alchemy, Post 1 — Content OS reveal. Series name options in draft."
```

### Example 2: Repurpose a LinkedIn post
```
User: /substackpost repurpose content/linkedin/drafts/2026-02-10_skill-play.md

→ Reads the LinkedIn draft about /skillplay command
→ Applies "Post to Essay" format (expanding a social post into narrative)
→ Generates 600-word Tactical Breakdown with screenshots and deeper how-to
→ Saves to content/substack/drafts/2026-02-11_skill-play-deep-dive.md
→ "Drafted: AI Alchemy, Post 2 — skill-play deep dive. Repurposed from LinkedIn."
```

### Example 3: Topic-driven post
```
User: /substackpost why I stopped making AI art for my newsletter

→ Detects opinion/contrarian angle
→ Suggests Contrarian Take structure
→ Generates 400-word post about the shift from anime art to build artifacts
→ Saves draft, updates index
```

### Example 4: Curated drop
```
User: /substackpost curated drop — this week's tools and builds

→ Suggests Curated Drop structure
→ Generates 300-word issue with 3–5 items and commentary
→ Lowest lift format for busy weeks
```
