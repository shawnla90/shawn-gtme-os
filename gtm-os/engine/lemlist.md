# Lemlist - Campaign Sequencing

> Multi-touch email sequences with warmup and tracking. Replaces manual outreach.py for production.

## IDs

| Resource | Value |
|----------|-------|
| Tracking ID | `tea_Z2cdZTSqWMD4qevy4` |

## MCP Available

Lemlist MCP is active. Use for campaign management, lead operations, sequence building.

## Push Flow

1. Validate email (MX lookup + verification)
2. Generate landing page (if not exists)
3. Run gap analysis (for Touch 2 data)
4. Push to Lemlist with custom variables:
   - `pageUrl` - personalized landing page URL
   - `gapScore` - gap analysis score
   - `topIssues` - top issues found
   - `firstName` - contact first name
   - `companyName` - company name
5. Track `lemlist_lead_id` in contacts table

## Planned 3-Touch Sequence

| Touch | Day | Content |
|-------|-----|---------|
| 1 - The Offer | Day 0 | Landing page link with strongest insight |
| 2 - Gap Analysis | Day 3-5 | Mini audit results: specific gaps found |
| 3 - Breakup | Day 7-10 | Page TTL reminder, no pressure |

## Script

`push_to_lemlist.py` - pushes qualified contacts with custom variables.

## Setup Required

- Connect Maildoso email accounts to Lemlist
- Configure warmup schedule
- Build 3-touch sequence in Lemlist UI
