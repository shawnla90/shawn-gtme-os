# PostHog - Page View Analytics

> Tracks who views personalized landing pages and when.

## IDs

| Resource | Value |
|----------|-------|
| Project | 325806 |
| Dashboard | 1319078 |
| Dashboard URL | https://us.posthog.com/project/325806/dashboard/1319078 |

## Event Schema

**Event:** `abm_page_viewed`

| Property | Description |
|----------|-------------|
| company_slug | Landing page slug |
| company_name | Company name |
| contact_name | Contact who was sent the link |
| contact_id | Contact record ID |
| depersonalized | Whether page is in depersonalized state |

## MCP Available

PostHog MCP is active. Use for querying events, dashboards, and insights.

## Planned: PostHog -> Attio Sync

`posthog_to_attio.py` exists but is not yet scheduled. Would flow page view events into Attio as activity notes so the CRM shows when prospects view their page.
