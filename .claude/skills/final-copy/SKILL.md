---
name: final-copy
description: Convert approved markdown drafts into platform-ready plain text and optionally push to Typefully. Use when the user types /finalcopy or asks to finalize a post.
---

# Final Copy

Convert draft markdown to clean plain text for LinkedIn/X, or keep markdown for Substack.

## Commands

- `/finalcopy` - finalize draft from conversation context
- `/finalcopy <path>` - finalize specific file
- `/finalcopy --no-typefully` - skip Typefully push
- `/finalcopy --schedule "next-free-slot"` - push and schedule

## Workflow

1. **Identify draft** from path arg or conversation context
2. **Apply adjustments** if user included change notes
3. **Strip markdown** - remove frontmatter, headers, bold markers, section labels, `---`, blockquotes. Preserve emoji, arrows, line breaks, sign-off
4. **Text normalization** (critical):
   - No em-dashes/en-dashes - replace with `. ` (period+space). Keep compound-word hyphens
   - No quotation marks - strip all `"`, `'`, smart quotes
   - Always capitalize I (i'm -> I'm, i'll -> I'll, standalone i -> I)
5. **Split sections** - post body + `=== COMMENT N ===` for each comment
6. **Save** to `content/{platform}/final/{slug}.txt` (`.md` for Substack - keep markdown)
7. **Push to Typefully** (default for LinkedIn/X, skip for Substack):
   - Use `mcp_typefully_create_draft` with normalized text
   - Comments are NOT pushed (post manually after publish)

## Platform Detection

- `content/linkedin/` -> strip markdown, push Typefully
- `content/x/` -> strip markdown, push Typefully
- `content/substack/` -> keep markdown, skip Typefully

## Error Handling

- No draft found: ask for path
- No comments section: output post body only
- Typefully MCP not connected: save locally, inform user
