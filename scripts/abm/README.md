# ABM Pipeline - Operational Runbook

> Internal ops doc. This directory is gitignored - safe for credentials and internal details.
> Last updated: 2026-02-28

## Quick Start

```bash
# Full pipeline (research + prospect + generate + sync + depersonalize)
python3 scripts/abm/pipeline.py --step all --limit 10

# Individual steps
python3 scripts/abm/pipeline.py --step research --limit 5
python3 scripts/abm/pipeline.py --step prospect --limit 5
python3 scripts/abm/pipeline.py --step generate --limit 5
python3 scripts/abm/pipeline.py --step sync --limit 50
python3 scripts/abm/pipeline.py --step depersonalize

# Outreach (NEVER in 'all' - explicit only)
python3 scripts/abm/pipeline.py --step outreach --limit 5 --dry-run
python3 scripts/abm/pipeline.py --step outreach --limit 5

# Page management
python3 scripts/abm/depersonalize.py --deprecate acme-corp    # 404 a page
python3 scripts/abm/depersonalize.py --undeprecate acme-corp  # Restore it
python3 scripts/abm/depersonalize.py --dry-run                # Preview TTL enforcement
```

## Required API Keys

All keys live in `scripts/abm/.env` (gitignored). Required per step:

| Step | Keys |
|------|------|
| research | `EXA_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY` |
| prospect | `APOLLO_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY` |
| generate | `EXA_API_KEY`, `XAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY` |
| sync | `ATTIO_API_TOKEN`, `SUPABASE_URL`, `SUPABASE_KEY` |
| depersonalize | `SUPABASE_URL`, `SUPABASE_KEY` |
| outreach | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`, `SENDER_NAME`, `SUPABASE_URL`, `SUPABASE_KEY` |

## Pipeline Stages

### 1. Research (`research.py`)
- Queries Exa with ICP-matched search terms per account
- Stores results in `accounts.exa_research` (JSONB)
- Skips accounts that already have research (resume mode)

### 2. Prospect (`prospect.py`)
- Queries Apollo for contacts matching target titles/seniority
- Stores in `contacts` table linked to `account_id`
- 3 contacts per company, VP+ seniority preferred
- First contact is marked `is_primary = true`

### 3. Generate (`generate.py`)
- Exa deep dive (4 queries per company: blog, press, jobs, about)
- Grok generates contact "vibe" (2-sentence professional personality)
- Grok generates full PageData JSON (stats, challenges, deliverables, timeline, FAQ, stack, theme)
- Upserts to `landing_pages` table with `status='live'`, `expires_at` = now + 30 days
- Slugs >40 chars are rejected (Exa sometimes returns blog URLs instead of company names)
- Pages go live immediately via ISR

### 4. Sync (`sync_attio.py`)
- Pushes companies + contacts to Attio CRM
- Sets custom attributes: source, stage, outreach_status, landing_page_url
- Adds to Target Account List

### 5. Depersonalize (`depersonalize.py`)
- TTL enforcement: finds pages where `sent_at IS NOT NULL` AND `expires_at < now`
- Flips `depersonalized = true` - contact names hidden at render time
- Manual deprecation: `--deprecate slug` for full opt-out (404)
- Manual restore: `--undeprecate slug`

### 6. Outreach (`outreach.py`)
- Queries accounts with `stage='prospect'` and `outreach_status='new'`
- Renders email template with personalized landing page URL
- Sends via SMTP, logs to `email_sends` table
- Sets `sent_at` on landing page (triggers TTL clock)
- Max 20/day, 3-second delay between sends
- **Must be called explicitly** - never included in `--step all`

## Launchd Schedule

Two jobs run daily on Mac Mini:

| Time | Plist | Command |
|------|-------|---------|
| 22:00 | `com.shawnos.abm-pipeline.plist` | `pipeline.py --step all --limit 10 --resume` |
| 06:00 | `com.shawnos.abm-depersonalize.plist` | `depersonalize.py` |

Logs: `~/Library/Logs/abm-pipeline.log` and `~/Library/Logs/abm-depersonalize.log`

## Supabase Tables

### accounts
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| name | text | Company name |
| domain | text | Company domain |
| exa_research | jsonb | Raw Exa research data |
| icp_score | integer | ICP fit score |

### contacts
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| account_id | integer | FK to accounts |
| first_name | text | |
| last_name | text | |
| email | text | |
| title | text | Job title |
| linkedin_url | text | |
| vibe | text | Grok-generated personality summary |
| is_primary | boolean | Primary contact for this account |

### landing_pages
| Column | Type | Notes |
|--------|------|-------|
| slug | text | PK (unique), URL path |
| url | text | Full URL |
| page_data | jsonb | Complete PageData for rendering |
| template | text | `abm-v1` |
| status | text | `live` (informational) |
| depersonalized | boolean | PII stripped at render time |
| deprecated | boolean | 404 when true |
| account_id | integer | FK to accounts |
| sent_at | timestamp | Set when outreach email sent |
| expires_at | timestamp | TTL for depersonalization |

### email_sends
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| contact_id | integer | FK to contacts |
| landing_page_slug | text | FK to landing_pages |
| sent_at | timestamp | When email was sent |
| template | text | Template name used |
| status | text | sent/bounced/replied |

## Attio CRM Integration

### Key IDs
| Resource | UUID |
|----------|------|
| Target Account List (companies) | `9c6e26b5-b3b6-494d-8e43-b6726a38a6af` |
| Target Account List (people) | `ba966502-f512-4c3a-bf8d-1be3cf54cd16` |

### Custom Attributes (companies)
- `source`: select (ABM Pipeline, Inbound, Referral)
- `stage`: select (Prospect, Researched, Qualified, Engaged, Opportunity, Opted Out)
- `outreach_status`: select (New, Queued, Sent, Replied, Opted Out)
- `landing_page_url`: text

### Stage Flow
```
Prospect → Researched → Qualified → Engaged → Opportunity
                                                    ↓
                                              Opted Out
```

## Monitoring

### Current state
```bash
# Count pages by status
python3 -c "
import sys; sys.path.insert(0, 'scripts/abm')
from db_supabase import get_supabase
sb = get_supabase()
total = sb.table('landing_pages').select('slug', count='exact').execute()
live = sb.table('landing_pages').select('slug', count='exact').eq('status', 'live').execute()
dep = sb.table('landing_pages').select('slug', count='exact').eq('deprecated', True).execute()
print(f'Total: {total.count}, Live: {live.count}, Deprecated: {dep.count}')
"

# Accounts with/without pages
python3 -c "
import sys; sys.path.insert(0, 'scripts/abm')
from db_supabase import get_supabase
sb = get_supabase()
accounts = sb.table('accounts').select('id', count='exact').execute()
pages = sb.table('landing_pages').select('slug', count='exact').eq('deprecated', False).execute()
print(f'Accounts: {accounts.count}, Live pages: {pages.count}')
"
```

### PostHog
- Dashboard: https://us.posthog.com/project/325806/dashboard/1319078
- Event: `abm_page_viewed`
- Properties: `company_slug`, `company_name`, `contact_name`, `contact_id`, `depersonalized`

## Troubleshooting

### Exa research fails
- Check `EXA_API_KEY` is valid
- Rate limit: 1-second delay between queries (built-in)
- Pipeline continues on per-query failures - partial research is stored

### Grok generation fails
- Retries 3 times with 2-second delay
- JSON parse failures logged but pipeline continues to next account
- Check `XAI_API_KEY` and xAI API status

### Junk slugs / bad data
- `slugify()` rejects slugs >40 chars (Exa blog URL pollution)
- Manually deprecate junk: `python3 depersonalize.py --deprecate <slug>`

### Apollo rate limit
- Check Apollo dashboard for usage
- Reduce `--limit` if hitting caps

### Page not rendering
- Check Supabase: `landing_pages` row exists with valid `page_data`
- Check `deprecated` is not `true`
- ISR cache: wait up to 1hr or trigger revalidation
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in website .env

### Attio sync fails
- Check `ATTIO_API_TOKEN` is valid
- Known MCP bugs: list filtering (Modes 3/4) broken, entry removal requires UI

## Known Limitations (as of 2026-02-28)

1. **sent_at not auto-populated**: TTL depersonalization requires `sent_at` to be set. This happens when outreach sends. Until outreach is live, pages persist indefinitely.
2. **Attio MCP list filtering broken**: Can't programmatically remove entries from lists. Use soft-remove (stage + outreach_status update + audit note).
3. **No email verification**: Apollo emails are used as-is. Consider adding verification before outreach goes live.
4. **No bounce handling**: outreach.py sends but `check_replies.py` only monitors for replies, not bounces.
