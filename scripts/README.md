# Scripts

## Environment Variables

### Required for nightly cron (daily_cron.sh)
| Variable | Used By | Notes |
|----------|---------|-------|
| `ANTHROPIC_API_KEY` | daily_scan.py, progression_engine_v3.py | Claude API for scoring |
| `SLACK_CRON_WEBHOOK` | daily_cron.sh | Slack notifications on cron success/failure |

### Required for ABM pipeline
| Variable | Used By | Notes |
|----------|---------|-------|
| `SUPABASE_URL` | All ABM scripts via db_supabase.py | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | All ABM scripts via db_supabase.py | Supabase service role key |
| `APOLLO_API_KEY` | prospect.py | Apollo contact search |
| `EXA_API_KEY` | research.py, generate.py | Exa company discovery |
| `XAI_API_KEY` | generate.py | Grok page copy generation |
| `ATTIO_API_TOKEN` | sync_attio.py | Attio CRM sync |
| `POSTHOG_API_KEY` | posthog_to_attio.py | PostHog event tracking |

### Optional (empty = graceful skip)
| Variable | Used By | Notes |
|----------|---------|-------|
| `X_BEARER_TOKEN` | x_auto_poster.py, x_reply.py | X/Twitter API - currently empty |
| `X_API_KEY` | x_auto_poster.py, x_reply.py | X/Twitter API - currently empty |
| `REDDIT_CLIENT_ID` | reddit_scout.py, reddit_post.py | Reddit API - currently empty |
| `REDDIT_CLIENT_SECRET` | reddit_scout.py | Reddit API - currently empty |

### Slack channels
| Variable | Used By | Notes |
|----------|---------|-------|
| `SLACK_BOT_TOKEN` | Various Slack integrations | Lead Alchemy workspace |
| `SLACK_REDDIT_CHANNEL_ID` | reddit_scout.py | Slack channel for Reddit digest |
| `SLACK_X_CHANNEL_ID` | x_auto_poster.py | Slack channel for X digest |

## Deprecated Scripts

Archived to `scripts/_deprecated/`:
- `progression_engine_v1.py` - Replaced by v3
- `progression_engine_v2.py` - Experimental, never deployed
- `rescore_logs.py` - One-time maintenance utility
- `find_missing_touch2.py` - ABM one-time utility

## Stale Data

- `data/crm.db` - Legacy SQLite DB from before Supabase migration. Only referenced by migration scripts. Safe to delete when ready.
