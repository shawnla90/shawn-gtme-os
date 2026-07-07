---
title: The copy-to-clipboard skill
description: Draft a post and get it onto your clipboard formatted for the target platform — LinkedIn, X, Reddit, email — as plain text, not markdown. Paste once, it's already right.
source: ~/.claude/skills/copy-to-clipboard/SKILL.md
updated: 2026-07-06
order: 5
---

# copy-to-clipboard — platform-formatted, ready to paste

## What this is
When you draft a post for somewhere specific — LinkedIn, X, Reddit, an email — don't leave it as markdown in a file for you to copy and clean up by hand. Format it for that platform and drop it straight onto your clipboard, so you paste once and it's already right.

## Why
Markdown doesn't survive most platforms. LinkedIn strips `#` and `**`. X has no formatting and a hard character limit. Pasting raw markdown means hand-fixing it every time. This does the conversion and the copy in one move.

## Per-platform formatting
- **LinkedIn** — plain text, short paragraphs, lots of whitespace, hook on line 1. No `#`/`**`/`>`. Put links on their own line (LinkedIn unfurls the first one). Bullets as line breaks or `•`.
- **X / Twitter** — plain text, one idea per post; split a thread on blank lines; keep each part under the limit.
- **Reddit** — Reddit does take markdown, so keep it, but drop the heading stacks and match the sub's voice.
- **Email** — plain text or simple HTML; no stray markdown.

## How (macOS)
Pipe the finished, platform-formatted text to `pbcopy`:
```bash
cat post.txt | pbcopy            # copy a file's contents
printf '%s' "$post" | pbcopy     # copy a variable
```
Other platforms: Linux `xclip -selection clipboard` or `wl-copy`, Windows `clip`.

## Rule
After copying, say what's on the clipboard and where it goes: "Copied — ready to paste into LinkedIn." Don't make anyone hunt for the text.
