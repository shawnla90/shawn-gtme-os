# Elauwit Email Replies Archive

This directory contains all email replies fetched from Elauwit's Instantly campaigns.

## How Replies Are Saved

Replies are automatically saved when you run the `/instantlyreplies_elauwit` command in Cursor.

## File Naming

Files are named with the format:
```
YYYY-MM-DD_HH-MM-SS_{sender-email-sanitized}_{campaign-id-short}.md
```

Example: `2026-02-07_14-30-22_john-example-com_bb1973d7.md`

## File Contents

Each file contains:
- Sender information
- Full email body
- Campaign details
- Thread context (if available)
- Metadata for tracking

## Usage

- **Daily Review**: Run `/instantlyreplies_elauwit` each morning to capture overnight replies
- **Reply Analysis**: Review files to identify patterns and sentiment
- **Sales Routing**: Use positive replies to route to sales team
- **Campaign Optimization**: Analyze which campaigns generate best responses

## Related Documentation

- [`../../workflows/replies-management.md`](../../workflows/replies-management.md) - Full command documentation
- [`../../workflows/campaign-monitoring.md`](../../workflows/campaign-monitoring.md) - Campaign monitoring workflow
