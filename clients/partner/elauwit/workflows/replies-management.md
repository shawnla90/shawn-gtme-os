# Replies Management — Elauwit

## Command: `/instantlyreplies_elauwit`

Fetch all email replies from Elauwit's Instantly campaigns and save them to `resources/replies/` for future reference and analysis.

## Usage

```
/instantlyreplies_elauwit
```

This command:
1. Fetches all replies from the last 24 hours
2. Saves each reply as a markdown file in `resources/replies/`
3. Displays a summary table in chat

## File Structure

Replies are saved to:
```
clients/partner/elauwit/resources/replies/
├── 2026-02-07_14-30-22_john-example-com_bb1973d7.md
├── 2026-02-07_15-45-10_jane-company-com_bb1973d7.md
└── 2026-02-07_16-20-33_bob-business-com_78e63aef.md
```

## File Naming Convention

Format: `YYYY-MM-DD_HH-MM-SS_{sender-email-sanitized}_{campaign-id-short}.md`

- Date/time: When the reply was received
- Email sanitized: `john@example.com` → `john-example-com`
- Campaign ID: First 8 characters of campaign UUID

## File Content Format

Each reply file contains:

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

## Use Cases

1. **Daily Reply Review**: Run command each morning to capture overnight replies
2. **Reply Analysis**: Review saved replies to identify patterns, sentiment, common questions
3. **Sales Routing**: Use saved replies to route positive responses to sales team
4. **Campaign Optimization**: Analyze which campaigns/sequences generate best replies
5. **Historical Reference**: Build a searchable archive of all replies

## Integration with Campaign Monitoring

This command complements the monitoring workflow:
- **Daily checks**: Use `/instantlyreplies_elauwit` to capture replies
- **Weekly analysis**: Review saved replies to identify trends
- **Reply routing**: Positive replies saved here can be routed to sales (4-hour SLA)

## Automation

The command can be automated to run every 24 hours automatically. See [`automation-setup.md`](automation-setup.md) for setup instructions.

**Quick setup options**:
- **macOS launchd** (recommended) - Runs locally, reliable
- **Cron** - Traditional scheduling
- **GitHub Actions** - Cloud-based, runs even when Mac is off

The automation script (`fetch-replies-automation.py`) uses the Instantly API directly (doesn't require Cursor/MCP to be running).

## Future Enhancements

- Filter options: `--last-7-days`, `--campaign <id>`, `--unread-only`
- Reply sentiment detection (positive/negative keywords)
- Deduplication logic (don't re-save same email) ✅ Already implemented in automation script
- Auto-routing to CRM for positive replies
- Summary reports analyzing saved replies
