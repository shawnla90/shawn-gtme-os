# TikTok Content Index

Short-form video series tracking for TikTok, Reels, and Shorts. Each series follows the "fast, useful, loopable" formula — one win per video, 16 seconds or less.

## Active Series

### Easy Wins with Claude Code

Single Claude Code feature or slash command per video. Lowest lift, highest volume.

| # | Topic | Source | Duration | Status |
|---|-------|--------|----------|--------|
| — | (queue below) | | | planned |

**Queued topics**:
- `/finalcopy` — markdown to plain text in 3 seconds
- `/viralhooks` — generate scroll-stopping hooks from a topic
- `/tiktokscript` — script a TikTok from a play (meta: TikTok about making TikToks)
- `/playdraft` — screenshot to content draft
- `/slacksync` — pull and categorize 191 Slack messages from Cursor

### Cursor in 15 Seconds

Cursor IDE features, shortcuts, and MCP integrations.

| # | Topic | Source | Duration | Status |
|---|-------|--------|----------|--------|
| — | (queue below) | | | planned |

**Queued topics**:
- MCP server reading Slack from Cursor
- Background agents (when available)
- Multi-file editing with agent mode
- Skill files and how they auto-load context
- Browser MCP for LinkedIn comment replies

### Slash Commands You Didn't Know You Needed

Showcasing the skills and slash commands from the content OS.

| # | Topic | Source | Duration | Status |
|---|-------|--------|----------|--------|
| — | (queue below) | | | planned |

**Queued topics**:
- `/heyreach-export` — LinkedIn campaign leads to CSV
- `/linkedin-recon` — browser-based profile research
- `/slacksync` — partner channel to structured markdown
- `/repostats` — repo value dashboard
- `/notionsync` — repo to Notion sync

### One Shortcut a Day

Daily cadence series. Any tool, any shortcut. Problem + shortcut + result + save CTA.

| # | Topic | Source | Duration | Status |
|---|-------|--------|----------|--------|
| — | (queue below) | | | planned |

**Queued topics**:
- Clay: One-click table duplicate for testing
- HeyReach: Bulk tag leads from campaign
- n8n: Webhook trigger for instant automation
- Claude: /compact to compress context window
- Cursor: Cmd+K inline edit

### Do This, Not That (AI Tool Edition)

Comparison format. Side-by-side or sequential. Built-in hook from the "wrong way."

| # | Topic | Source | Duration | Status |
|---|-------|--------|----------|--------|
| — | (queue below) | | | planned |

**Queued topics**:
- Don't paste code into ChatGPT. Use Claude Code with repo context.
- Don't manually track outbound. Version it in git.
- Don't write cold email from scratch. Use spin text with natural variation.
- Don't read Slack in browser. Pull it into Cursor.

### GTM Plays — The 30-Second Version

Repurposed from the LinkedIn GTM Plays series. The "aha moment" from each play.

| # | Play | Source | Key Moment | Duration | Status |
|---|------|--------|------------|----------|--------|
| — | (queue below — reference `workflows/plays-index.md`) | | | | planned |

**Queued plays for TikTok compression**:
- Play 1: Employee Verification — the Clay + HubSpot job change alert moment
- Play 5: Web Reveal — the anonymous visitor becoming a known account
- Play 10: LinkedIn Content Intel — Apify scraping company posts in real time
- Play 14: MX Record Classification — one HTTP call reveals email security tier
- Play 16: HeyReach Partner Handoff — Cursor agent pulling LinkedIn data to CSV

## Repurpose Tracker

Tracks which LinkedIn/X posts have been compressed into TikTok scripts.

| Source Post | TikTok Script | Series | Status |
|-------------|---------------|--------|--------|
| (none yet) | | | |

## Content Calendar

Target: 3x per week. Ramp to daily when workflow is dialed.

| Day | Series Rotation |
|-----|----------------|
| Monday | Easy Wins or Cursor in 15 Seconds |
| Wednesday | Do This, Not That or One Shortcut a Day |
| Friday | GTM Plays (30-Second Version) or Slash Commands |

Adjust based on what's performing. Consistency > perfection.

## Cross-Platform Distribution

Every TikTok also goes to:
- **Instagram Reels**: Same video, same caption. Within 24 hours.
- **YouTube Shorts**: Same video, slight caption adjustment.
- **LinkedIn video**: Only if the tip is business/GTM relevant.

## Naming Convention

Draft files: `content/tiktok/drafts/YYYY-MM-DD_{slug}.md`
Final files: `content/tiktok/final/YYYY-MM-DD_{slug}.md`

## References

- `skills/tier-2-context-playbooks/tiktok.md` — full TikTok playbook
- `.cursor/skills/tiktok-script/SKILL.md` — agent skill for script generation
- `workflows/plays-index.md` — source material for GTM Plays compression
- `workflows/skills-series-index.md` — source material for Slash Commands series
