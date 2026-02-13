# Reddit Content Queue

Content drafts for Reddit posts. Each file is a Reddit-native self-post adapted from existing content or written specifically for target subreddits.

## File Naming

```
YYYY-MM-DD_slug.md
```

Example: `2026-02-11_content-os-reddit.md`

## Workflow

1. Draft goes in `drafts/`
2. Adapt for Reddit culture — value-first, conversational, no hard CTAs
3. Run through pre-publish checklist (`skills/tier-3-content-ops/pre-publish-checklist.md`)
4. Post to target subreddit(s) via Reddit MCP or manually
5. Move to `final/` after posting (or delete — git history has it)

## Format

Each draft file contains:
- **Frontmatter**: pillar, status, date, target subreddit(s)
- **Post title**: Reddit-formatted title (max 300 characters)
- **Post body**: Reddit-native self-post text
- **Comment hooks**: engagement comments to post after submission
- **Subreddit notes**: why each target sub was chosen

## Pillar Reference

See `skills/tier-3-content-ops/pillars/reddit-growth-seo.md` for Reddit-specific strategy, subreddit targeting, post formats, and voice rules.

## MCP Integration

Reddit MCP server (`reddit-mcp-server`) is configured in `~/.cursor/mcp.json`. Tools available:
- **Read**: `search_reddit`, `get_top_posts`, `get_subreddit_info`, `get_post_comments`
- **Write** (requires auth): `create_post`, `reply_to_post`, `edit_post`

## Voice Notes

- Reddit rewards authenticity more than any other platform
- Write like you're explaining to a smart friend in a niche community
- Self-deprecation and honesty outperform polish
- Never reference follower counts or "I'm an expert" framing
- Lead with value, not links
