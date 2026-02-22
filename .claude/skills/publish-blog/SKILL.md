---
name: publish-blog
description: Convert a finalized Substack post into a blog post for shawnos.ai. Strips newsletter scaffolding, redrafts for blog audience, applies voice normalization, generates YAML frontmatter, saves to content/website/final/, rebuilds the SQLite index, and deploys via /update-github. Use when the user types /publish-blog or asks to publish a Substack post to the blog.
---

# Publish Blog — Substack to shawnos.ai Blog Converter

Convert a finalized Substack post into a standalone blog post for shawnos.ai. Strips newsletter scaffolding, redrafts for a blog audience, applies voice normalization, saves the final markdown, rebuilds the SQLite index, and deploys.

---

## Command Patterns

- `/publish-blog` — convert the Substack post from conversation context
- `/publish-blog <path>` — convert a specific Substack final file
- `/publish-blog --slug custom-slug` — override the URL slug
- `/publish-blog --date 2026-02-24` — override the canonical publish date
- `/publish-blog --no-push` — save locally only, skip commit and deploy
- `/publish-blog --no-milestone` — skip FEATURE_MILESTONES entry (default: skip)

---

## Workflow

### Step 1: Identify Source

1. If a path argument is provided, use that file
2. If no path, look for a Substack final file discussed in the current conversation
3. Verify the file exists and is in `content/substack/final/` or has `**Status**: final` in its metadata
4. If no source found: "No finalized Substack post found. Try `/publish-blog content/substack/final/your-file.md`"

### Step 2: Extract Content

Parse the Substack markdown and extract the publishable body. Strip all newsletter scaffolding:

**Remove entirely:**
- Blockquote metadata block (`> **Platform**: ...`, `> **Series**: ...`, etc.)
- `## Subject Line Options` section and all options
- `## Preview Text` section
- `## CTA Block` section (newsletter-specific call to action)
- `## Visual Notes` section
- `## Cross-Platform Notes` section
- `## Notes` section
- `## Lead Magnet Assets` section (or similar subscriber-only sections)
- Sign-off line (`shawn ⚡ the gtme alchemist 🧙‍♂️`)
- Any `---` horizontal rules used as section dividers between scaffolding sections

**Keep:**
- `## Post Body` content (everything between `## Post Body` and the next scaffolding section)
- All section headers within the body (`## the toolkit`, `## what changed`, etc.)
- All body paragraphs, lists, bold text, code blocks
- YouTube/video link placeholders (convert to actual embeds or links if URL is known)

### Step 3: Redraft for Blog Audience

This is the key transformation. A Substack post is written for subscribers who follow the series. A blog post is for anyone who lands on the page from search, social, or direct link.

**Replace newsletter language:**
- "reply to this email" → remove or replace with "drop a comment" or similar
- "forward it to someone" → remove entirely
- "if you're reading this, you already have access" → remove (blog is public)
- "this newsletter" → "this blog" or "shawnos.ai"
- "OS.AI Labs" as a series name → keep as brand reference but don't frame as "this newsletter series"
- "subscribers" / "subscribe" → remove or replace with "readers" / "follow"
- Series references like "Post 1 was X. Post 2 was Y." → keep if they add context, but add links to previous blog posts if they exist. If the referenced posts aren't on the blog yet, generalize: "in earlier posts I covered X"

**Add context a blog reader needs:**
- If the post references prior posts in a series, add brief context so the post stands alone
- If the post assumes the reader knows what the system is, add a one-line anchor early on (e.g., "I built a modular GTM operating system inside Cursor and Claude Code.")

**Tighten the opening:**
- Blog readers decide in 3 seconds whether to stay. The opening should hook immediately.
- If the Substack version opens with series callbacks ("Post 1 was the reveal. Post 2 was the identity shift."), condense or move below the hook

**Do NOT change:**
- The voice, tone, or personality
- Technical content or tactical specifics
- The core argument or structure
- Section headers (unless they reference newsletter framing)

### Step 4: Voice Normalization

Apply the same 13 rules used by `/finalsubstack`:

1. **No em-dashes, en-dashes, or double-hyphens-as-dashes** — Replace `--` (em-dash), `-` (en-dash), and `--` (double hyphen as dash) with period + space (`. `). Do NOT replace hyphens in compound words (e.g. well-known, re-con, non-GTM).
2. **No quotation marks** — Strip `"`, `'`, curly quotes, guillemets. Keep apostrophes in contractions.
3. **Always capitalize I** — `i` as first-person pronoun becomes `I`. Include: `i'm` -> `I'm`, `i'll` -> `I'll`, `i've` -> `I've`, `i'd` -> `I'd`.
4. **Preserve markdown** — Keep all headers, bold, code blocks, bullet lists, links.
5. **Double-check before saving** — Verify: no em-dashes, no quotation marks wrapping phrases, no lowercase first-person i.
6. **No throat-clearing transitions** — Remove "here's the thing", "here's what I keep coming back to", etc. Rewrite to go direct.
7. **No metaphors/similes as paragraph closers** — If a paragraph ends with a direct statement followed by an analogy, cut the analogy.
8. **No tripling** — If three parallel examples are listed, condense to two unless each genuinely adds something distinct.
9. **No emotional telegraphing** — Remove lines that preview how the reader should feel before the content creates the feeling.
10. **No hidden knowledge framing** — Remove "nobody tells you about", "the thing most people miss", etc. Say it directly.
11. **Broad tool references when tools aren't the point** — If the post is about identity or journey (not tactical), keep tool names broad.
12. **Paragraph breaks for punchlines** — One-line statements that carry weight should be their own paragraph.
13. **Lowercase days of the week** — "friday", "monday", "tuesday" not "Friday", "Monday", "Tuesday".

### Step 5: Generate YAML Frontmatter

Create frontmatter matching the existing `hello-world.md` pattern:

```yaml
---
title: "Post Title Here"
date: "YYYY-MM-DD"
excerpt: "One to two sentences summarizing the post for the blog feed and SEO."
---
```

**Title**: Use the post's `# H1` heading or derive from the most compelling subject line option. Clean it for a blog context (remove newsletter-specific framing).

**Date**: Use the canonical publish date. Priority order:
1. `--date` flag if provided
2. `> **Date**:` from the Substack metadata
3. Date prefix from the filename (YYYY-MM-DD)
4. Today's date as fallback

**Excerpt**: Write 1-2 sentences that work as a blog feed preview and meta description. Pull from the post's strongest hook or thesis statement. Keep under 160 characters for SEO.

### Step 6: Save to `content/website/final/`

Save the final blog post to `content/website/final/{slug}.md`

**Slug rules:**
1. If `--slug` flag is provided, use that
2. Otherwise extract from the Substack filename: `2026-02-24_build-your-own-os.md` -> `build-your-own-os`
3. Slug-only filename (no date prefix). This matches the existing `hello-world.md` pattern and gives clean URLs like `/blog/build-your-own-os`

**File structure:**
```
---
title: "..."
date: "..."
excerpt: "..."
---

{redrafted, voice-normalized blog content}
```

### Step 7: Rebuild SQLite Index

Run the index builder to pick up the new blog post:

```bash
python3 scripts/build_index.py
```

Verify the new entry exists:

```bash
sqlite3 data/index.db "SELECT id, title, slug, date, platform, stage, status_text FROM content WHERE slug='{slug}' AND platform='website'"
```

### Step 8: Feature Milestone Entry (Optional)

**Default: skip.** Only add a FEATURE_MILESTONES entry for major launches (new site features, new tools, significant system changes). Most blog posts are content, not features.

If the user passes a flag WITHOUT `--no-milestone`, or explicitly asks to add a milestone:

1. Read `website/apps/shawnos/lib/milestones.ts` (or wherever FEATURE_MILESTONES lives)
2. Add an entry with the blog post date, a short description, and appropriate category
3. This makes the post appear on the updates/changelog page with a milestone badge

### Step 9: Commit and Deploy

If `--no-push` was NOT passed:

1. Stage the new blog post file: `git add content/website/final/{slug}.md`
2. Stage any other changed files (updated SQLite will be gitignored)
3. Invoke the `/update-github` skill to run the pre-push safety scan, commit, and push
4. Vercel auto-deploys from main on push

If `--no-push` was passed:
- Skip commit and deploy
- Display: "Saved locally. Run `/update-github` when ready to deploy."

### Step 10: Post-Deploy Summary

Display the results:

```
Blog post published.

  Title:    {title}
  Date:     {date}
  Slug:     {slug}
  Words:    ~{word_count}
  Saved to: content/website/final/{slug}.md
  Live URL: https://shawnos.ai/blog/{slug}

  SQLite:   content table updated (platform=website, stage=final)
  Deploy:   pushed to main, Vercel auto-deploying
```

If `--no-push`: replace deploy line with "Local only. Not pushed."

---

## Error Handling

- **Source file not found**: "No finalized Substack post found. Try `/publish-blog content/substack/final/your-file.md`"
- **Source is still a draft**: "This post is still in draft status. Finalize it first with `/finalsubstack`, then run `/publish-blog`."
- **Blog post already exists**: If `content/website/final/{slug}.md` already exists, warn: "A blog post with slug `{slug}` already exists. Overwrite? Or use `--slug new-slug` to save with a different slug."
- **SQLite rebuild fails**: "Index rebuild failed: {error}. Blog post saved successfully. Run `python3 scripts/build_index.py` manually to fix."
- **Git push fails**: "Blog post saved locally but push failed: {error}. Run `/update-github` manually."

---

## How the Updates Page Works

The shawnos.ai updates page auto-aggregates blog posts:

```typescript
const posts = getAllPosts(CONTENT_DIR)  // reads content/website/final/
```

New blog posts automatically appear in the feed after deploy. No code changes needed for standard posts. The page reads YAML frontmatter for title, date, and excerpt.

---

## Integration with Other Skills

- **Pipeline**: `/substackpost` (draft) -> `/finalsubstack` (normalize + push to Substack) -> `/publish-blog` (convert to blog + deploy to shawnos.ai)
- **After `/finalsubstack`**: Once a Substack post is finalized, `/publish-blog` converts it for the blog
- **Uses `/update-github`**: For the commit and deploy step, delegates to the existing pre-push safety scan
- **SQLite index**: `build_index.py` picks up the new file in `content/website/final/` automatically. The `platform` will be `website`, `stage` will be `final`

---

## Examples

### Example 1: Convert from conversation context
```
User: /publish-blog

-> Finds content/substack/final/2026-02-24_build-your-own-os.md from context
-> Strips newsletter scaffolding
-> Redrafts opening for blog audience
-> Applies voice normalization
-> Generates frontmatter: title, date=2026-02-24, excerpt
-> Saves to content/website/final/build-your-own-os.md
-> Rebuilds SQLite index
-> Commits and pushes via /update-github
-> "Blog post published. Live at https://shawnos.ai/blog/build-your-own-os"
```

### Example 2: Specific file with custom date
```
User: /publish-blog content/substack/final/2026-02-24_build-your-own-os.md --date 2026-02-25

-> Uses the specified file
-> Overrides date to 2026-02-25 in frontmatter
-> Full conversion pipeline
-> "Blog post published with date 2026-02-25"
```

### Example 3: Local only
```
User: /publish-blog --no-push

-> Full conversion pipeline
-> Saves locally, skips commit/deploy
-> "Saved to content/website/final/build-your-own-os.md. Run /update-github when ready."
```

### Example 4: Custom slug
```
User: /publish-blog --slug build-your-os

-> Uses "build-your-os" as slug instead of extracting from filename
-> Saves to content/website/final/build-your-os.md
-> Live URL: https://shawnos.ai/blog/build-your-os
```
