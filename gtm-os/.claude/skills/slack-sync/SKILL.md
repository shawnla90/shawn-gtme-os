---
name: slack-sync
description: Sync partner Slack channel history to structured markdown. Extracts Shawn references, decisions, deliverables. Use when the user types /slacksync or /slacksync <partner>.
---

# Slack Partner Channel Sync

## Commands

- `/slacksync` - sync primary partner
- `/slacksync <partner>` - sync specified partner

## Workflow

1. **Identify** partner + channel from mapping table, validate `clients/partner/{partner}/` exists
2. **Read existing** `clients/partner/{partner}/resources/slack-partner-thread.md`, parse last sync date
3. **Pull history** via `mcp_slack_get_channel_history` (limit 100), fetch thread replies for threaded messages
4. **Resolve users** via `mcp_slack_get_users`, build ID->name map, flag Shawn Tenam references
5. **Categorize**: Shawn references, key decisions (agreement language), deliverables/asks (action items), general timeline
6. **Update markdown** sections: header, Shawn references table, timeline, decisions, deliverables, next steps, sync log
7. **Display summary**: messages pulled, new references/decisions/action items, highlights
8. **Content prompt**: offer to turn sync into LinkedIn/X draft (Content-from-Skill workflow)

## Content-from-Skill Flow

Captures: trigger (problem) -> tool chain (MCP tools used) -> output (what was produced) -> insight (why it matters) -> reproducibility. Generates drafts following Plays Series structure from pillars.

## Output Location

`clients/partner/{partner}/resources/slack-partner-thread.md`

## Error Handling

- `not_in_channel`: bot needs channel invite
- No new messages: report last sync date
- Partner not found: list available partners
