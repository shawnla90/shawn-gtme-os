# TikTok Content Queue

Short-form video scripts for TikTok, Reels, and Shorts. Fast, useful, loopable — one win per video, 16 seconds or less.

## File Naming

```
YYYY-MM-DD_slug.md
```

Example: `2026-02-11_cursor-mcp-slack.md`

## Workflow

1. Draft script goes in `drafts/` (via `/tiktokscript` or manually)
2. Review against TikTok playbook (`skills/tier-2-context-playbooks/tiktok.md`)
3. Record screen capture (QuickTime, OBS, or built-in recorder)
4. Edit in CapCut, Descript, or TikTok editor (text overlays, zoom, cuts, sound)
5. Post to TikTok. Cross-post to Reels + Shorts same day.
6. Move to `final/` after posting (or delete — git history has it)

## Format

Each script file contains:
- **Frontmatter**: platform, series, episode #, source, status, estimated duration
- **Hook options**: 3 on-screen text alternatives (0-2 seconds)
- **Demo section**: What to screen record (3-10 seconds)
- **Result section**: What to show as output (10-14 seconds)
- **Loop closer**: CTA or visual loop (14-16 seconds)
- **Caption + tags**: Ready to paste into TikTok
- **Recording notes**: Audio strategy, editing tool, cross-post targets

## Voice Reference

See `skills/tier-2-context-playbooks/tiktok.md` for TikTok-specific voice, structure, and formatting rules.

## Series Tracking

See `workflows/tiktok-index.md` for active series, episode numbers, and content calendar.

## Commands

- `/tiktokscript` — generate a script from current context
- `/tiktokscript <topic>` — script for a specific tip/trick
- `/tiktokscript repurpose <path>` — compress a LinkedIn/X draft into a TikTok script
