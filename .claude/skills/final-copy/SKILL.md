---
name: final-copy
status: deprecated
deprecated_on: 2026-04-22
superseded_by: code-content
description: "[DEPRECATED 2026-04-22 — superseded by `clip` verb in the content OS] Legacy skill for pushing clean plain text to clipboard / Typefully. Do not invoke for new packs — use `/code` to dispatch, then say `clip next` to pull winning variants to clipboard."
---

> **⚠ DEPRECATED 2026-04-22.** This skill is superseded by the `clip` / `clip next` verb in the new content operating system. Canonical doc: `~/shawn-gtme-os/content/CLAUDE.md`.
>
> The description below is preserved for historical reference only. For new work, `/code` the pack → `approve` → `clip next`.

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
