---
name: slack-sync
description: Syncs Slack partner channel history to a structured markdown file in the partner's resources folder. Extracts Shawn Tenam references, action items, decisions, and deliverables. Use when the user types /slacksync or /slacksync <partner> or asks to sync/check a partner Slack channel.
---

# Slack Partner Channel Sync

When the user types `/slacksync` or `/slacksync <partner>`, pull the latest conversation history from the partner's Slack channel and update the structured markdown in their resources folder.

## Command Pattern

- `/slacksync` — defaults to primary partner
- `/slacksync <partner>` — syncs the specified partner (e.g., `acme`, `globex`, `initech`)

## Partner → Channel Mapping

| Partner | Channel Name | Channel ID | Workspace |
|---------|-------------|------------|-----------|
| acme | `#rp-<partner>` | `<channel-id>` | YourWorkspace (`user-slack-workspace-*`) |

> Add new partners to this table as channels are identified.

## Workflow

### 1. Identify Partner & Channel

- Parse command to extract partner name (default: `acme`)
- Look up channel ID from the mapping table above
- Validate partner directory exists: `clients/partner/{partner}/`

### 2. Read Existing Markdown

- Load `clients/partner/{partner}/resources/slack-partner-thread.md`
- Parse the "Sync Log" section to determine last sync date
- If file doesn't exist, create from the template (see Template section below)

### 3. Pull Channel History

- Call `mcp_slack_revpartners_get_channel_history` with:
  - `channel_id`: from mapping table
  - `limit`: 100 (max per call)
- For messages with threads (reply_count > 0), also call `mcp_slack_get_thread_replies` to get full thread context
- If more than 100 messages since last sync, note in sync log that history was truncated

### 4. Resolve User Names

- Call `mcp_slack_revpartners_get_users` to build a user ID → display name map
- Replace user IDs in messages with readable names
- Flag any message from or mentioning Shawn Tenam (look for user ID, display name, or @mention)

### 5. Parse & Categorize Messages

For each message, determine if it contains:

**Shawn Tenam References** — Any message that:
- Is from Shawn Tenam
- Mentions @Shawn Tenam
- Contains assignments or asks directed at Shawn
- References work Shawn is responsible for

**Key Decisions** — Messages that contain:
- Agreement language ("let's go with", "approved", "confirmed", "decision")
- Strategy changes or pivots
- Budget/resource allocations

**Deliverables & Asks** — Messages that contain:
- Action items ("can you", "please", "need", "by [date]")
- File shares or document references
- Deadlines or timelines

**General Timeline** — All other substantive messages (skip reactions-only, emoji-only, "sounds good" type messages)

### 6. Update Markdown

Update each section of `slack-partner-thread.md`:

1. **Header**: Update "Last Synced" date
2. **Shawn Tenam References**: Add new rows to the table
3. **Channel Timeline**: Add new weekly sections with message summaries
4. **Key Decisions**: Add new decision rows
5. **Deliverables & Asks**: Add new tracked items
6. **Next Steps**: Regenerate based on open items from Deliverables table
7. **Sync Log**: Add new row with date, message count, reference count

### 7. Display Summary

After updating, show:

```
## Slack Sync Complete — {partner}

**Channel**: #{channel_name}
**Messages Pulled**: {count}
**New Shawn References**: {count}
**New Decisions**: {count}
**New Action Items**: {count}

### Highlights
- {bullet summary of key new items}

### Next Steps
- {open action items}
```

### 8. Content Opportunity Prompt

After the sync summary, ask:

> **Would you like to turn this into post material?**
> This sync used Slack MCP to pull partner channel data, parse it, and structure it into actionable intelligence — a clean workflow that could work as a Plays Series or Skill/System Shares post.
>
> Options:
> 1. Yes — generate a LinkedIn draft from this workflow
> 2. Yes — generate an X thread from this workflow  
> 3. Skip for now

If the user selects an option, follow the **Content-from-Skill** workflow below.

---

## Content-from-Skill Workflow

When the user opts to create content from a skill execution, generate a draft that captures the story of the workflow.

### What to Capture

1. **The trigger** — What problem or need kicked this off (e.g., "needed to know what's happening in our partner Slack without scrolling 200 messages")
2. **The tool chain** — What MCP tools, commands, or automations were used (e.g., "Slack MCP → channel history → thread replies → user resolution → markdown structuring")
3. **The output** — What was produced (e.g., "structured markdown with action items, decisions, and Shawn-specific references")
4. **The insight** — Why this matters or what it enables (e.g., "partner intelligence on demand, updated in 30 seconds instead of 30 minutes of scrolling")
5. **The reproducibility** — How someone else can do this (e.g., "one slash command, runs any time")

### Draft Generation

**For LinkedIn** (save to `content/linkedin/drafts/YYYY-MM-DD_skill-{skill-name}.md`):

Follow the Plays Series structure from `skills/tier-3-content-ops/pillars/plays-series.md`:
1. Pain point or contrarian hook (lowercase, 1-2 lines)
2. What the workflow does
3. Step-by-step with emoji markers
4. "Why this matters" context
5. "No gatekeeping" + resource delivery
6. Identity sign-off

Generate 3 draft versions with different hooks.

**For X** (save to `content/x/drafts/YYYY-MM-DD_skill-{skill-name}.md`):

Generate a 10-post story arc thread:
1. Hook tweet (the pain point)
2-8. The workflow steps and insights
9. The result / proof
10. CTA / follow for more

### Voice Guardrails

- Apply voice from `skills/tier-1-voice-dna/core-voice.md`
- Run through `skills/tier-1-voice-dna/anti-slop.md` filters
- Check against `skills/tier-3-content-ops/pre-publish-checklist.md`

---

## Template: slack-partner-thread.md

If the markdown file doesn't exist, create it with this structure:

```markdown
# {Partner Name} — Slack Partner Channel Thread

> **Channel**: `#{channel_name}` (Slack Connect)
> **Channel ID**: `{channel_id}`
> **Workspace**: RevPartners
> **Members**: {num_members}
> **Created**: {created_date}
> **Last Synced**: _awaiting first sync_

---

## Shawn Tenam References & Action Items

_This section captures all mentions, tags, assignments, and relevant context for @Shawn Tenam._

| Date | Context | Action/Note | Status |
|------|---------|-------------|--------|
| — | _awaiting first sync_ | — | — |

---

## Channel Timeline

_Chronological record of key messages, decisions, updates, and deliverables from the partner channel._

### Week of YYYY-MM-DD

_awaiting first sync_

---

## Key Decisions & Agreements

_Running log of decisions made in the channel that affect strategy, campaigns, or deliverables._

| Date | Decision | Who | Impact |
|------|----------|-----|--------|
| — | _awaiting first sync_ | — | — |

---

## Deliverables & Asks

_Tracked requests, deliverables, and follow-ups surfaced in the channel._

| Date | Ask/Deliverable | Owner | Due | Status |
|------|----------------|-------|-----|--------|
| — | _awaiting first sync_ | — | — | — |

---

## Next Steps

_Current open items and planned actions based on latest channel activity._

- [ ] _awaiting first sync_

---

## Sync Log

_Record of each time this document was updated via `/slacksync`._

| Date | Messages Pulled | New Shawn Refs | Notes |
|------|----------------|----------------|-------|
| — | — | — | _awaiting first sync_ |
```

## Error Handling

- **`not_in_channel`**: Bot needs to be invited to the channel. Tell user: "The Slack bot isn't in #{channel_name}. Type `/invite @[bot-name]` in the channel to add it."
- **No new messages**: "No new messages since last sync on {date}."
- **Partner not found**: "Partner '{partner}' not found. Available partners: acme, globex, initech"
- **Channel not mapped**: "No Slack channel mapped for '{partner}'. Add the channel ID to the skill mapping table."

## Related Files

- Partner skill tree: `clients/partner/{partner}/SKILL.md`
- Slack MCP skill: `.cursor/skills/slack-mcp/SKILL.md`
- Content pillars: `skills/tier-3-content-ops/pillars/`
- Voice guide: `skills/tier-1-voice-dna/core-voice.md`
