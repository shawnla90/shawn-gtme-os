# Attio - CRM Workbench

> Human-facing CRM. Only accounts actively being worked live here. Clean, curated, human-usable.

## Key IDs

| Resource | UUID |
|----------|------|
| Target Account List (companies) | `9c6e26b5-b3b6-494d-8e43-b6726a38a6af` |
| Target Account List (people) | `ba966502-f512-4c3a-bf8d-1be3cf54cd16` |

## Custom Attributes (companies)

| Attribute | Type | Values |
|-----------|------|--------|
| source | select | ABM Pipeline, Inbound, Referral |
| stage | select | Prospect, Researched, Qualified, Engaged, Opportunity, Opted Out |
| outreach_status | select | New, Queued, Sent, Replied, Opted Out |
| landing_page_url | text | thegtmos.ai/for/{slug} |

## Stage Flow

```
Prospect -> Researched -> Qualified -> Engaged -> Opportunity
                                                       ↓
                                                  Opted Out
```

## Sync Script

`sync_attio.py` upserts companies by domain, people by email, links them, sets custom attributes, adds to Target Account List.

## MCP Available

Attio MCP is active. Use for:
- Searching records
- Reading/updating attributes
- Adding records to lists
- Filtering list entries

## Known MCP Bugs

1. **List filtering (Modes 3/4)** returns unfiltered results - broken
2. **Can't programmatically remove list entries** - use soft-remove: update stage + outreach_status + add audit note
3. **Workaround:** For list management, use the Attio UI directly or update status fields to effectively "remove" from active views

## Architecture Role

Supabase is the warehouse (every account ever). Attio is the workbench (only active accounts). Accounts graduate from Supabase to Attio via `sync_attio.py` when ready for outreach.
