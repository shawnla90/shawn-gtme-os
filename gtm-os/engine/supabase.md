# Supabase - System of Record

> The warehouse. Every account ever researched, every contact, every page, every send.

- **Project ID:** `uohlxmupujhxhbffspzs`
- **Role:** System of record. All pipeline steps write here. Supabase is the source of truth for data; Attio is the human-facing view.
- **RLS:** Configured. Service role key in `scripts/.env`.

## Tables (8)

### accounts
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| name | text | Company name |
| domain | text | Company domain |
| exa_research | jsonb | Raw Exa research data |
| icp_score | integer | ICP fit score (0-100) |
| source | text | How discovered (exa_research, etc.) |
| stage | text | Pipeline stage |
| outreach_status | text | Outreach state |
| industry | text | From Apollo/Exa |
| size | text | Company size bucket |
| geography | text | HQ location |
| apollo_id | text | Apollo org ID |
| employee_count | text | Headcount |
| tech_stack | text | Known tools |
| gap_analysis | text | Site audit results |
| funding | text | Funding stage/amount |
| segment | text | Segment tag (series-a-saas, yc-growth, etc.) |

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
| apollo_id | text | Apollo person ID |
| persona | text | Persona category |
| email_status | text | Prospeo verification (valid/invalid/catch-all/unknown) |
| lemlist_lead_id | text | Lemlist lead reference |

### landing_pages
| Column | Type | Notes |
|--------|------|-------|
| slug | text | PK, URL path |
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
| from_email | text | Sending account used |

### email_templates
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| name | text | Template identifier |
| subject | text | Email subject line |
| body | text | Email body with {{variables}} |
| campaign_id | text | Lemlist campaign link |
| touch_number | integer | Position in sequence (1, 2, 3) |

### page_views
PostHog event sink. Populated via `posthog_to_attio.py`.

### activities
Activity log. Currently unused.

### deals
Deal tracking. Currently unused.

## Stage Progressions

**Account stage:**
```
prospect -> researched -> page_live -> outreach -> replied -> meeting -> client
                                                          └-> opted_out
```

**Outreach status:**
```
new -> emailed -> replied -> meeting
              └-> opted_out
```

## Monitoring Queries

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
```
