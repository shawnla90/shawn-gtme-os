---
name: linkedin-recon
description: Browser-based LinkedIn profile recon using Browserbase MCP. Extracts recent posts, activity, and personalization hooks for outreach. Use when the user types /linkedin-recon.
---

# LinkedIn Recon

## Commands

- `/linkedin-recon` or `/linkedin-recon accepted` - recon accepted connections from latest HeyReach export CSV
- `/linkedin-recon <url>` - recon single profile
- `/linkedin-recon <csv-path>` - recon from custom CSV

## Workflow

1. **Identify profiles**: parse CSV or URL, deduplicate
2. **Create Browserbase session**: `browserbase_session_create`
3. **Visit each profile** (5-10s between visits, max 15 per session):
   - Activity page: `{url}/recent-activity/all/` - extract posts, dates, engagement, hashtags
   - Profile page: `{url}` - extract headline, about, experience, skills
4. **Compile recon**: per contact - about, recent activity, personalization hooks (3), suggested message
5. **Save**: individual files to `resources/recon/{username}-recon-{date}.md` + summary CSV
6. **Close session**: `browserbase_session_close`

## Rate Limiting

- 5-10s between profiles, max 15 per session
- READ ONLY - never connect/like/message
- Stop immediately on CAPTCHA/block

## Output

Summary table: profiles scanned, active vs inactive, per-contact hooks. Individual recon markdown files.
