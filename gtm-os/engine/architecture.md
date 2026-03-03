# Pipeline Architecture

> Full data flow for the ABM pipeline. For code-level runbook, see `scripts/` (symlinked to `scripts/abm/`).

## What It Does

Automated Account-Based Marketing pipeline:
1. **Discovers** B2B SaaS companies via Exa semantic search (20 ICP queries)
2. **Enriches contacts** via Apollo (VP/Director/Manager, 3 per company)
3. **Generates personalized landing pages** via Exa deep dive + Grok AI
4. **Syncs to CRM** (Attio) with custom attributes + Target Account List
5. **Sends outbound** via Lemlist/Maildoso (8 accounts, 24/day capacity)
6. **Monitors replies** via IMAP with opt-out detection
7. **Manages page lifecycle** with 30-day TTL and auto-depersonalization
8. **Tracks analytics** via PostHog page view events

## Data Flow

```
Exa Research ──> accounts.exa_research (JSONB)
     │
     v
Apollo Contacts ──> contacts (first_name, last_name, email, title, linkedin_url)
     │
     v
Exa Deep Dive + Grok ──> landing_pages.page_data (JSONB) ──> thegtmos.ai/for/{slug}
     │
     v
Attio CRM Sync ──> Companies + People records with custom attributes
     │
     v
Lemlist Push (or legacy outreach.py) ──> email_sends log
     │
     v
IMAP Reply Check ──> status updates: replied / opted_out
     │
     v
PostHog ──> page_views ──> Attio notes (view activity)
```

## Architecture Split

- **Supabase = the warehouse.** Every account ever researched, every contact, every page, every send. Full universe. Thousands of rows. Raw research. Analytics. Send logs.
- **Attio = the workbench.** Only accounts actively being worked. Clean, curated, human-usable. Accounts graduate from Supabase to Attio when ready for outreach.

## Pipeline Scripts

| Script | Step | In `--step all`? | Purpose |
|--------|------|-------------------|---------|
| `research.py` | research | YES | Exa discovery + deep research |
| `prospect.py` | prospect | YES | Apollo contact enrichment |
| `generate.py` | generate | YES | Landing page generation |
| `sync_attio.py` | sync | YES | CRM sync |
| `depersonalize.py` | depersonalize | YES | TTL enforcement |
| `outreach.py` | outreach | NO (explicit) | Cold email sending |
| `check_replies.py` | replies | NO (explicit) | IMAP reply detection |
| `gap_analysis.py` | gap_analysis | NO (explicit) | Website SEO/perf audit |
| `find_similar.py` | find_similar | NO (explicit) | Lookalike discovery |
| `push_to_lemlist.py` | lemlist | NO (explicit) | Lemlist campaign push |
| `posthog_to_attio.py` | - | NO | Page view sync |
| `attio_configure.py` | - | NO | CRM bulk tagging |

## Account Stage Progression

```
prospect ──> researched ──> page_live ──> outreach ──> replied ──> meeting ──> client
                                                   └──> opted_out
```

## Automation Schedule (Mac Mini)

| Time | Job | Script |
|------|-----|--------|
| 22:00 | Full pipeline | `pipeline.py --step all --limit 10 --resume` |
| 06:00 | TTL enforcement | `depersonalize.py` |
| Manual | Outreach / replies / gap analysis / Lemlist | Individual scripts |
