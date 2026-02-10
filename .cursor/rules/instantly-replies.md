# Instantly Replies Command Handler

## Command Pattern

When the user types `/instantlyreplies_<partner>` (e.g., `/instantlyreplies_acme`), execute the following workflow:

## Workflow Steps

1. **Extract Partner Name**
   - Parse command: `/instantlyreplies_<partner>` → extract partner name
   - Validate partner directory exists: `clients/partner/{partner}/`
   - If partner doesn't exist, show error listing available partners: `acme`, `globex`, `initech`

2. **Fetch Replies from Instantly MCP**
   - Call `mcp_instantly_list_emails` with:
     - `email_type: "received"` (incoming replies only)
     - Default: Last 24 hours of replies
   - For each reply email ID returned, call `mcp_instantly_get_email` to get full details

3. **Save Replies to Partner Resources**
   - Target directory: `clients/partner/{partner}/resources/replies/`
   - Create directory if it doesn't exist
   - For each reply, create a markdown file with naming convention:
     - Format: `YYYY-MM-DD_HH-MM-SS_{sender-email-sanitized}_{campaign-id-short}.md`
     - Example: `2026-02-07_14-30-22_john-example-com_bb1973d7.md`
   - Sanitize email addresses for filenames (replace `@` with `-`, `.` with `-`)

4. **File Content Format**

Each saved reply file should contain:

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

After saving all replies, display a formatted table in chat:

```
## Replies Fetched for {{partner}}

| # | Sender | Email | Campaign | Subject | Time | File |
|---|--------|-------|----------|---------|------|------|
| 1 | {{name}} | {{email}} | {{campaign}} | {{subject_preview}} | {{time}} | `{{filename}}` |
```

6. **Error Handling**

- If no replies found: "No replies found in the last 24 hours for {{partner}}"
- If partner doesn't exist: "Partner '{{partner}}' not found. Available partners: acme, globex, initech"
- If Instantly MCP fails: Show error message and suggest checking MCP connection

## Example Usage

User: `/instantlyreplies_acme`

Response:
1. Fetch replies from Instantly
2. Save each to `clients/partner/<partner>/resources/replies/`
3. Display summary table
