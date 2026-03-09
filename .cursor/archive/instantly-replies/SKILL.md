---
name: instantly-replies
description: Fetches email replies from Instantly campaigns using MCP and saves them to partner-specific resources folders. Use when the user types /instantlyreplies_<partner> (e.g., /instantlyreplies_acme) or asks to fetch Instantly email replies for a partner.
---

# Instantly Replies Command

When the user types `/instantlyreplies_<partner>` (e.g., `/instantlyreplies_acme`), fetch all email replies from that partner's Instantly campaigns and save them to the partner's resources folder.

## Command Pattern

The command follows the pattern: `/instantlyreplies_<partner>` where `<partner>` is one of: `acme`, `globex`, `initech`

## Workflow

1. **Extract Partner Name**
   - Parse command to extract partner name (e.g., `acme` from `/instantlyreplies_acme`)
   - Validate partner directory exists: `clients/partner/{partner}/`
   - If partner doesn't exist, show error: "Partner '{partner}' not found. Available partners: acme, globex, initech"

2. **Fetch Replies**
   - Call `mcp_instantly_list_emails` with:
     - `email_type: "received"` (incoming replies only)
   - For each email ID returned, call `mcp_instantly_get_email` to get full details

3. **Save Replies**
   - Target directory: `clients/partner/{partner}/resources/replies/`
   - Create directory if it doesn't exist
   - For each reply, create markdown file:
     - Filename: `YYYY-MM-DD_HH-MM-SS_{sender-email-sanitized}_{campaign-id-short}.md`
     - Sanitize email: replace `@` with `-`, `.` with `-`
     - Example: `2026-02-07_14-30-22_john-example-com_bb1973d7.md`

4. **File Format**

Each saved file should contain:

```markdown
# Reply from {{sender_name}}

**Date**: {{timestamp}}
**Campaign**: {{campaign_name}}
**Campaign ID**: {{campaign_id}}
**Subject**: {{subject}}
**From**: {{sender_email}} ({{sender_name}})

## Email Body

{{full_email_body}}

## Thread Context

{{thread_history_if_available}}

## Metadata

- Email ID: {{email_id}}
- Thread ID: {{thread_id}}
- Campaign: {{campaign_name}}
- Sequence Step: {{step_number}} (if available)
```

5. **Display Summary**

After saving, show a formatted table:

```
## Replies Fetched for {{partner}}

| # | Sender | Email | Campaign | Subject | Time | File |
|---|--------|-------|----------|---------|------|------|
| 1 | {{name}} | {{email}} | {{campaign}} | {{subject_preview}} | {{time}} | `{{filename}}` |
```

## Error Handling

- No replies found: "No replies found in the last 24 hours for {{partner}}"
- Partner not found: "Partner '{{partner}}' not found. Available partners: acme, globex, initech"
- MCP error: Show error message and suggest checking MCP connection

## Example

User: `/instantlyreplies_acme`

Response:
1. Fetch replies from Instantly MCP
2. Save each to `clients/partner/acme/resources/replies/`
3. Display summary table with all saved files
