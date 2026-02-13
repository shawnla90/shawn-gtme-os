---
name: final-substack
description: Finalize a Substack draft and push it to Substack as a draft post via the Substack MCP. Runs voice normalization, extracts publishable content, saves locally, creates the draft on Substack, and generates LinkedIn + X cross-promo snippet drafts. Use when the user types /finalsubstack or asks to finalize and push a Substack post.
---

# Final Substack Command

When the user types `/finalsubstack`, take a finalized or near-final Substack draft, run it through voice normalization, save the final version locally, and push it to Substack as a draft post via the Substack MCP.

## Command Pattern

- `/finalsubstack` -- finalize the Substack draft currently being discussed in conversation and push to Substack
- `/finalsubstack <path>` -- finalize a specific Substack draft file
- `/finalsubstack` with adjustment notes -- apply adjustments, then finalize and push
- `/finalsubstack --no-push` -- finalize and save locally only (skip Substack push)
- `/finalsubstack --title "custom title"` -- override the subject line from the draft
- `/finalsubstack --subtitle "custom subtitle"` -- override the preview text from the draft
- `/finalsubstack --no-crosspromo` -- skip generating LinkedIn and X cross-promo drafts

**Default behavior**: Runs voice normalization, saves final locally, pushes to Substack as a draft, and generates LinkedIn + X cross-promo snippet drafts. User reviews in Substack editor, adds images, and publishes from there. Cross-promo drafts are ready to finalize via `/finalcopy`.

## Workflow

### Step 1: Identify the Draft

1. If a path argument is provided, use that file
2. If no path, use the Substack draft most recently discussed in conversation or currently open in the editor
3. Read the full markdown file
4. Confirm it's a Substack draft (check frontmatter for `Platform: Substack` or file path under `content/substack/drafts/`)
5. If the file doesn't exist or can't be found: "Couldn't find a Substack draft to finalize. Try `/finalsubstack content/substack/drafts/your-file.md`"

### Step 2: Final Review Pass (Optional)

Check the user's message for adjustment notes:

- **If the user included specific changes** (e.g., "change the opener to..." or "swap section X"):
  - Apply the adjustments to the draft markdown file first
  - Save the updated markdown draft
  - Then proceed to finalization
- **If the user said "it's good", "let's go", "approved", "ship it", "ready to go"** or similar:
  - Skip adjustments, proceed directly to finalization
- **If adjustments reveal a voice pattern worth capturing**:
  - Flag it at the end: "Noticed a pattern worth adding to [specific skill file]. Want me to update it?"
  - Do NOT auto-update skill files. Always ask first.

### Step 3: Extract Publishable Content

From the draft markdown, extract three components:

1. **Title** (subject line): Look for the user's chosen subject line, or the `## Subject Line Options` section. If the user specified one via `--title` or in conversation, use that. Otherwise use the first option or ask.
2. **Subtitle** (preview text): From the `## Preview Text` section. Override with `--subtitle` if provided.
3. **Body**: Everything between `## Post Body` and the next `---` separator (which marks the end of body content). Include the CTA Block content appended after a `---` separator.

**What to include in the body**:
- All section headers (`## the return`, `## what I built`, etc.) -- Substack renders markdown
- All body paragraphs, lists, bold text
- The sign-off line (`shawn ⚡ the gtme alchemist 🧙‍♂️`)
- A `---` separator
- The CTA Block content (from `## CTA Block`)

**What to exclude from the body**:
- YAML frontmatter (the `>` blockquote metadata at top)
- `## Series Name Options` section
- `## Subject Line Options` section
- `## Preview Text` section
- `## Visual Notes` section
- `## Cross-Platform Notes` section
- `## Notes` section
- Image placeholder lines like `**[content OS schematic image here]**` (user adds images in Substack editor)

### Step 4: Voice Normalization

Apply these rules to the extracted body. Substack keeps markdown formatting, so preserve headers, bold, lists, and code blocks. But enforce:

1. **No em-dashes, en-dashes, or double-hyphens-as-dashes** -- Replace `—` (em-dash), `–` (en-dash), and `--` (double hyphen used as dash) with period + space (`. `). Do NOT replace hyphens in compound words (e.g. well-known, re-con, non-GTM). Example: "we're evolving — and fast" becomes "we're evolving. and fast"
2. **No quotation marks** -- Strip `"`, `'`, `"`, `'`, `«`, `»`. Keep the text; remove the quote characters. Apostrophes in contractions are fine (don't, I'm, here's).
3. **Always capitalize I** -- `i` when used as first-person pronoun becomes `I`. Include: `i'm` -> `I'm`, `i'll` -> `I'll`, `i've` -> `I've`, `i'd` -> `I'd`, standalone `i` -> `I`.
4. **Preserve markdown** -- Unlike LinkedIn/X finalization, Substack keeps all markdown. Headers, bold, code blocks, bullet lists stay in.
5. **Double-check before saving and pushing** -- Verify: no em-dashes, no quotation marks wrapping phrases, no lowercase first-person i. Period + space for breaks only.
6. **No throat-clearing transitions** -- Remove phrases like "here's the thing", "here's what I keep coming back to", "here's where I have to be honest", "this hit me harder than I expected." These delay the point. Rewrite to go direct. Example: "but here's the thing nobody tells you about being the tool guy" becomes "heres the reality about being the tool guy."
7. **No metaphors/similes as paragraph closers** -- If a paragraph ends with a direct statement followed by an analogy or simile, cut the analogy. The literal version is stronger. Example: cut "people associated me with Clay the way they'd associate a chef with their signature dish" when "and it worked" already closed the thought.
8. **No tripling** -- If a draft lists three parallel examples (e.g. "Clay problem. or an Instantly problem. or a Cursor problem."), condense to two. AI defaults to tripling. Two examples is a cleaner rhythm. Only keep three when each genuinely adds something distinct.
9. **No emotional telegraphing** -- Remove lines that preview how the reader should feel before the content creates the feeling. "this hit me harder than I expected" before a reveal is telegraphing. Cut it. Let the reveal do the work.
10. **No hidden knowledge framing** -- Remove "nobody tells you about", "the thing most people miss", "what they don't teach you." Say the observation directly instead.
11. **Broad tool references when tools aren't the point** -- If the post is about identity, systems, or journey (not a tactical breakdown), remove feature-level tool specifics (Sculptor prompts, Claygents, lifecycle stages). Keep tool names broad.
12. **Paragraph breaks for punchlines** -- One-line statements that carry weight should be their own paragraph. Don't bury them inside longer blocks.
13. **Lowercase days of the week** -- "friday", "monday", "tuesday" not "Friday", "Monday", "Tuesday." Matches the lowercase-first-word voice.

### Step 5: Save Final Version Locally

1. **Save to**: `content/substack/final/{original-filename}` (keep as `.md` since Substack renders markdown natively)
   - Example: `content/substack/drafts/2026-02-10_content-os-reveal.md` -> `content/substack/final/2026-02-10_content-os-reveal.md`
   - Create the `final/` directory if it doesn't exist
2. **Update draft status**: Change `**Status**: draft` to `**Status**: final` in the original draft file's frontmatter
3. **Update substack index**: If `workflows/substack-index.md` exists, update the post's status from `draft` to `final`

### Step 6: Push to Substack via MCP

Push the post to Substack as a draft using the `create_draft_post` MCP tool:

1. **Parameters**:
   - `title`: The chosen subject line (from Step 3)
   - `subtitle`: The preview text (from Step 3)
   - `body`: The normalized body content (from Step 4). Send as HTML for best Substack rendering:
     - Convert `## headers` to `<h2>` tags
     - Convert paragraphs to `<p>` tags
     - Convert `- list items` to `<ul><li>` tags
     - Convert `**bold**` to `<strong>` tags
     - Convert `---` to `<hr>` tags
     - Preserve emoji, arrow markers, and special characters

2. **HTML conversion rules**:
   - Each paragraph (text separated by blank lines) wraps in `<p></p>`
   - `## header text` becomes `<h2>header text</h2>`
   - `- list item` becomes `<li>list item</li>` wrapped in `<ul></ul>`
   - `**bold text**` becomes `<strong>bold text</strong>`
   - `---` becomes `<hr>`
   - Line breaks within paragraphs become `<br>` only if intentional (single newline within a block)
   - Keep all emoji and special characters as-is

3. **Display confirmation**:
   ```
   Pushed to Substack as draft.
   - Title: {title}
   - Subtitle: {subtitle}
   - Body: ~{word_count} words
   - Saved locally: content/substack/final/{filename}
   
   Open Substack to add images, review formatting, and publish:
   https://shawntenam.substack.com/publish
   ```

4. **If Substack MCP returns 403**:
   - The session token has likely expired. Display:
     ```
     Substack MCP returned 403 (authentication expired).
     
     To refresh:
     1. Log into Substack in your browser
     2. Open DevTools -> Application -> Cookies
     3. Copy the "substack.sid" cookie value
     4. Update SUBSTACK_SESSION_TOKEN in ~/.cursor/mcp.json
     5. Restart Cursor or reload the MCP server
     
     Draft saved locally to: content/substack/final/{filename}
     Copy-paste into Substack editor manually, or retry after refreshing the token.
     ```

5. **If Substack MCP is not connected**: Save locally and show: "Substack MCP not connected. Saved locally to {path}. Add the Substack MCP server to push drafts directly."

6. **If push succeeds**: Show the confirmation and remind user to add images in the Substack editor.

### Step 7: Display Final Content

After saving (and pushing if applicable), display the full finalized body inline in the chat so the user can:
- Review the final version
- Copy-paste manually if the MCP push failed
- Verify voice normalization was applied correctly

Format the display as:

```
---
Title: {title}
Subtitle: {subtitle}
---

{full body content}

---
Word count: ~{count}
Saved to: content/substack/final/{filename}
Substack push: {success / failed (reason) / skipped}
```

### Step 8: Generate Cross-Platform Promo Snippets

After the Substack post is finalized, automatically generate short cross-promotion drafts for LinkedIn and X. These are **pointers, not rewrites**. The Substack post has the depth. Social just signals it exists.

Skip this step ONLY if the user passes `--no-crosspromo`.

#### 8a: LinkedIn Cross-Promo Post

Generate a short LinkedIn post (under 200 words) that:

1. **Opens with the spread** — one line that signals the content system is expanding to a new platform
2. **Positions LinkedIn vs Substack** — LinkedIn = quick plays, education. Substack = deeper layer, thinking, full story
3. **Teases 3–4 things the post covers** — use `→` arrow markers, pulled from the Substack post's section headers or key points
4. **Ends with a CTA to comments** — "link in the comments" or similar
5. **Sign-off**: `shawn ⚡ the gtme alchemist 🧙‍♂️`

Include a **Comment 1** with the Substack link placeholder and a one-liner (e.g., "no gatekeeping. the full story is here.")

**Save to**: `content/linkedin/drafts/YYYY-MM-DD_substack-{slug}-crosspromo.md`

Use this frontmatter:
```markdown
> **Platform**: LinkedIn
> **Pillar**: building & sharing
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Source**: cross-promo for content/substack/final/{filename}
```

#### 8b: X Cross-Promo Tweet (X1)

Generate a single tweet (under 280 characters) that:

1. **Hooks with one line** about what the Substack post covers
2. **Mentions it's live** — "live on Substack" or "Post {n} is up"
3. **No hashtags, no thread** — just one clean tweet
4. **Link placeholder** at the end

**Save to**: `content/x/drafts/YYYY-MM-DD_substack-{slug}-crosspromo.md`

Use this frontmatter:
```markdown
> **Platform**: X
> **Pillar**: building & sharing
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Source**: cross-promo for content/substack/final/{filename}
```

#### 8c: Display the snippets

After generating, display both inline:

```
--- LinkedIn Cross-Promo ---
{linkedin post body}

--- X1 Cross-Promo ---
{tweet text}

Saved to:
  - content/linkedin/drafts/{linkedin-filename}
  - content/x/drafts/{x-filename}

These are drafts. Run /finalcopy on either to push to Typefully.
```

#### Cross-promo voice rules

- **Short**. Under 200 words for LinkedIn, under 280 chars for X.
- **Pointer, not a rewrite**. Don't summarize the whole Substack post. Tease it.
- **Same voice rules as all other content**: no em-dashes, no quotation marks, capitalize I, lowercase first word.
- **No "subscribe" energy**. Frame it as "the deeper version lives here" not "go subscribe to my newsletter."
- **Pull from the post's actual content** — use real section headers, real themes, real language from the Substack draft.

## Error Handling

- **No draft found**: "No Substack draft found in the current conversation or at the specified path. Try `/finalsubstack content/substack/drafts/your-file.md`"
- **File isn't a Substack draft**: "This file doesn't look like a Substack draft (no `Platform: Substack` in frontmatter and not in `content/substack/drafts/`). Are you sure this is the right file?"
- **Already finalized**: If the draft status is already `final`, warn: "This draft was already finalized. Want to re-export and re-push anyway?"
- **Substack MCP 403**: Session token expired. Show refresh instructions (see Step 6.4).
- **Substack MCP not available**: Save locally, display content, show connection instructions.
- **Substack push fails (non-403)**: Save locally (always works) and show the error: "Saved locally but Substack push failed: {error}. You can copy-paste from the local file."
- **No subject line chosen**: If the draft has multiple subject line options and none is selected, ask: "Which subject line do you want to use?" and list the options.
- **No preview text**: Use the first sentence of the body as fallback subtitle.

## Voice Rules Reference (from core-voice + substack playbook)

- **Capital I**: Always. I'm, I'll, I've, I built.
- **No quotation marks**: Write phrases directly, not in quotes.
- **No em-dashes**: Period + space for breaks. "we're evolving. and fast" not "we're evolving — and fast"
- **Lowercase first word**: Unless proper noun or I.
- **Builder-first**: Sound like you're sharing from the build, not consulting from theory.
- **No gatekeeping**: Resources, files, links shared openly.
- **Preserve markdown**: Substack renders markdown natively. Keep headers, bold, code blocks, lists.

## Substack MCP Tool Reference

- `create_draft_post` -- creates a new draft on Substack. Parameters:
  - `title` (required): The post title / subject line
  - `subtitle` (required): The preview text / subtitle
  - `body` (required): The post body content (HTML format for best rendering)

## Integration with Other Skills

- **After `/substackpost`**: The drafting skill creates the raw draft. This skill (`/finalsubstack`) takes it through voice normalization and pushes to Substack.
- **Pipeline**: `/substackpost` (draft) -> user reviews/edits -> `/finalsubstack` (normalize + push + cross-promo drafts)
- **Cross-promo flow**: `/finalsubstack` generates LinkedIn + X cross-promo drafts automatically. Run `/finalcopy` on those drafts to push to Typefully when ready.
- **No double work**: The cross-promo snippets are generated during finalization so you never have to circle back for "oh I should mention this on LinkedIn" as a separate task.
- **Typefully is NOT used for Substack**: Substack posts go through the Substack MCP, not Typefully. But the cross-promo LinkedIn/X snippets DO go through Typefully via `/finalcopy`.

## Examples

### Example 1: Finalize the current Substack draft
```
User: /finalsubstack

-> Reads the draft from conversation context (content/substack/drafts/2026-02-10_content-os-reveal.md)
-> Extracts title: "the GTM engineer who learned Git got superpowers"
-> Extracts subtitle: "the first issue of OS.AI Labs..."
-> Extracts body, applies voice normalization
-> Saves to content/substack/final/2026-02-10_content-os-reveal.md
-> Pushes to Substack via create_draft_post
-> "Pushed to Substack as draft. Open Substack to add images and publish."
```

### Example 2: Finalize with adjustments
```
User: /finalsubstack -- change "GTM pro" to "GTM professional" in the second section

-> Applies the edit to the draft markdown
-> Saves updated draft
-> Extracts and normalizes
-> Saves final + pushes to Substack
-> "Applied 1 adjustment. Pushed to Substack as draft."
```

### Example 3: Finalize with explicit title
```
User: /finalsubstack --title "welcome to OS.AI Labs"

-> Uses the provided title instead of extracting from draft
-> Extracts subtitle and body normally
-> Normalizes, saves, pushes
-> "Pushed to Substack as draft with title: welcome to OS.AI Labs"
```

### Example 4: Finalize locally only (skip push)
```
User: /finalsubstack --no-push

-> Extracts and normalizes content
-> Saves locally to content/substack/final/
-> Does NOT push to Substack
-> "Finalized and saved locally. Skipped Substack push."
```

### Example 5: Auth token expired
```
User: /finalsubstack

-> Extracts and normalizes content
-> Saves locally (always succeeds)
-> Attempts Substack push -> 403 error
-> Shows token refresh instructions
-> "Saved locally. Substack session expired — follow the refresh steps above."
```

### Example 6: Full flow with cross-promo
```
User: /finalsubstack

-> Extracts and normalizes content
-> Saves to content/substack/final/2026-02-10_content-os-reveal.md
-> Pushes to Substack as draft
-> Generates LinkedIn cross-promo (~150 words, teases key themes, CTA to comments)
-> Generates X1 cross-promo (single tweet, link placeholder)
-> Saves cross-promo drafts to content/linkedin/drafts/ and content/x/drafts/
-> "Pushed to Substack. Cross-promo drafts saved. Run /finalcopy on either to push to Typefully."
```

### Example 7: Skip cross-promo
```
User: /finalsubstack --no-crosspromo

-> Extracts, normalizes, saves, pushes to Substack
-> Does NOT generate LinkedIn/X cross-promo drafts
-> "Pushed to Substack as draft. Cross-promo skipped."
```
