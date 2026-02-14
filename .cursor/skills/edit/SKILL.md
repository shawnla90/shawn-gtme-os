---
name: edit
description: Edit existing content posts, blog drafts, images, and website components. Supports quick text swaps, image regeneration, and improvement suggestions. Use when the user types /edit, /improve, or asks to change, tweak, fix, adjust, or improve existing content, posts, images, or pages.
---

# Edit — Quick Content & Asset Editing

Fast, focused editing of existing content. Three modes: **edit** (change specific things), **improve** (suggest what to make better), and **image** (regenerate or tweak a PNG).

## Command Patterns

- `/edit` — edit the content currently being discussed or open in the editor
- `/edit <path>` — edit a specific file
- `/edit <path> -- <instructions>` — edit with inline instructions ("swap line 3 for...", "remove the last paragraph")
- `/improve` — analyze current content and suggest improvements
- `/improve <path>` — suggest improvements for a specific file
- `/edit image <path>` — regenerate or tweak an existing content image

## Mode Detection

Automatically detect the mode from context:

| Signal | Mode |
|--------|------|
| User says "change", "swap", "remove", "replace", "fix", "update" | **Edit** |
| User says "make better", "improve", "stronger", "tighten", "suggestions" | **Improve** |
| Target file is a `.png` or user says "image", "graphic", "visual" | **Image** |
| User says "I don't like this" + points at text | **Edit** |
| User pastes/references specific lines to change | **Edit** |

---

## Edit Mode

### Step 1: Identify Target

1. If a path is provided, use it
2. If no path, check what's open in the editor or recently discussed
3. Read the full file
4. If not found: "Couldn't find a file to edit. Try `/edit content/linkedin/drafts/your-file.md`"

### Step 2: Apply Changes

**If user gave specific instructions** (e.g., "change the opener to...", "remove line 5"):
1. Apply the exact changes requested using StrReplace
2. Show a before/after of the changed lines
3. Confirm: "Applied 1 edit. Here's what changed:"

**If user flagged something but didn't specify the replacement** (e.g., "I don't like the second paragraph"):
1. Read the flagged section
2. Generate 2-3 alternative versions
3. Present them numbered for the user to pick
4. Apply the chosen version

**If user wants multiple small edits** (e.g., "tighten the whole thing"):
1. Walk through the content section by section
2. Propose changes inline (show original → proposed)
3. Apply all accepted changes

### Step 3: Voice Normalization (content files only)

After editing, run the standard voice rules on the changed content:
- No m-dashes, em-dashes, en-dashes (replace with period + space)
- No quotation marks (strip `"`, `'`, smart quotes)
- Always capitalize I (I'm, I'll, I've, I'd)
- Preserve emoji, arrows, line break rhythm

### Step 4: Save & Next Steps

1. Save the edited file
2. If the file is a draft that has a corresponding final: "Draft updated. The final copy at `content/{platform}/final/...` is now stale. Run `/finalcopy` to regenerate."
3. If the file is a website component/page: "Component updated. Run `/deploy` to push changes live."
4. If the edit was to a skill file: "Skill updated. Changes take effect in your next agent session."

---

## Improve Mode

Analyze content and suggest concrete improvements without making changes until approved.

### Step 1: Read and Analyze

Read the target file and evaluate across these dimensions:

**For posts/drafts:**
- **Hook strength** — Does the opener stop the scroll? Is there a stronger first line?
- **Structure** — Is the flow logical? Any sections that drag or repeat?
- **Voice alignment** — Does it sound like the established voice? Any NPC-ish lines?
- **Specificity** — Are claims backed by concrete details? Any vague "value-add" language?
- **CTA / closer** — Does it end strong? Is there a clear next action?
- **Length** — Too long for the platform? Any fat to trim?

**For website components:**
- **UX** — Is the layout clear? Any confusing elements?
- **Copy** — Is the text sharp? Any filler?
- **Mobile** — Will it look good on small screens?
- **Accessibility** — Color contrast, semantic HTML, alt text?

**For images:**
- **Clarity** — Is the information readable? Any clutter?
- **Alignment** — Does it match the post's message?
- **Brand** — Does it follow the design system (dark bg, green accent, monospace)?

### Step 2: Present Suggestions

Format as a prioritized list:

```
Improve Report: 2026-02-13_screen-teaser.md
────────────────────────────────────────────

HIGH IMPACT
1. Hook — "I built something this weekend" is generic. Try:
   → "72 hours. 3 operating systems. zero screenshots."
   → "everyone asks what I shipped. here's the raw proof."

2. Specificity — paragraph 3 says "multiple tools" — name them

MEDIUM
3. Structure — the tool list runs 8 lines. consider grouping into 2 categories
4. Closer — sign-off feels rushed. add one line of forward reference

LOW / OPTIONAL
5. Length — 847 words is fine for LinkedIn but could trim 10% for punchiness
```

### Step 3: Apply Approved Changes

Wait for user to pick which suggestions to apply. Then execute like Edit Mode.

---

## Image Mode

Edit or regenerate existing content images (Python + Pillow PNGs).

### Step 1: Find the Generation Script

Content images are generated by Python scripts in `content/images/`:
- Image: `content/images/{slug}.png`
- Script: `content/images/_gen_{slug}.py`

If the script exists, read it. If not, note: "No generation script found. I'll create one to reproduce and modify this image."

### Step 2: Determine Changes

**If user gave specific instructions** (e.g., "make the title bigger", "change the green to blue", "add a third panel"):
1. Modify the generation script with the requested changes
2. Re-run the script to generate the updated PNG
3. Show the new image for review

**If user said "make it better" or "improve"**:
1. Analyze the current image (read the script, view the PNG)
2. Suggest 2-3 concrete improvements (spacing, hierarchy, readability)
3. Apply approved changes and regenerate

### Step 3: Regenerate

```bash
python3 content/images/_gen_{slug}.py
```

Show the regenerated image. Iterate as needed.

### Step 4: Link Check

Verify the draft still references the correct image path. Update if the filename changed.

---

## File Type Detection

| Extension / Path | Type | Handling |
|-----------------|------|----------|
| `content/linkedin/drafts/*.md` | LinkedIn draft | Edit + voice rules |
| `content/x/drafts/*.md` | X draft | Edit + voice rules |
| `content/substack/drafts/*.md` | Substack draft | Edit (preserve markdown) |
| `content/images/*.png` | Content image | Image mode |
| `content/images/_gen_*.py` | Image script | Edit the script, regenerate |
| `website/**/*.tsx` | Website component | Edit + suggest /deploy |
| `skills/**/*.md` | Skill file | Edit (no voice rules) |
| `.cursor/skills/**/*.md` | Agent skill | Edit (no voice rules) |

## Error Handling

- **File not found**: "Couldn't find that file. Try `/edit <path>` with the full path."
- **Binary file**: "That's a binary file. If it's a PNG, try `/edit image <path>` to regenerate from the script."
- **No changes needed**: "Reviewed the content — it looks solid. Nothing to flag. Run `/finalcopy` when ready to ship."
- **Conflicting edits**: If the user's requested change contradicts voice rules, flag it: "That edit would introduce an m-dash. Want me to use a period + space instead?"

## Examples

### Quick text swap
```
User: /edit content/linkedin/drafts/2026-02-13_screen-teaser.md -- change "four active clients" to "multiple clients"
→ Opens file, finds the phrase, replaces it, saves, shows diff
```

### Improve a draft
```
User: /improve
→ Reads the current draft, analyzes hook/structure/voice/specificity
→ Presents 5 prioritized suggestions
→ Waits for user to pick which to apply
```

### Tweak an image
```
User: /edit image content/images/skill-tree.png -- make the title text bigger and add more spacing between panels
→ Reads _gen_skill-tree.py, adjusts font size and gap, regenerates PNG
```

### Vague edit request
```
User: I don't like the second paragraph
→ Reads the paragraph, generates 3 alternatives, presents for selection
```
