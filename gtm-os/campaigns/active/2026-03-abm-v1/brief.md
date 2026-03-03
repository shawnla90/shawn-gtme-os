# Campaign Brief: 2026-03 ABM V1

## Overview

| Field | Value |
|-------|-------|
| Campaign ID | 2026-03-abm-v1 |
| Segment | Series A SaaS |
| Status | Building |
| Created | 2026-03-03 |
| Launch | TBD - pending data quality fix |

## Angles

1. **Page is the pitch** - personalized landing page as the opening move
2. **Own your pipeline** - infrastructure over services, data stays with them

## Target

- 100 accounts, 2-3 contacts each (250-300 contacts)
- All with validated emails, last names, LinkedIn URLs
- Relevant titles only (sales/revenue/growth/marketing)

## Sequence

| Touch | Day | Content | Template |
|-------|-----|---------|----------|
| 1 - The Offer | 0 | Landing page link + top challenge | `messaging/email-templates/touch-1-offer.md` |
| 2 - Gap Analysis | 3-5 | Mini audit results | `messaging/email-templates/touch-2-audit.md` |
| 3 - Breakup | 7-10 | TTL reminder | `messaging/email-templates/touch-3-breakup.md` |

## Tools

Full pipeline: Exa -> Apollo -> Grok -> Supabase -> Attio -> Lemlist -> Maildoso -> PostHog

## Current State

Data quality fix in progress:
- 182 accounts but enrichment fields empty (name + domain only)
- 146 contacts but email/last_name/linkedin_url are empty strings
- 28% of contact titles are irrelevant (HR/talent/engineering)
- 5+ junk accounts (articles/aggregators, not companies)

## Blockers

1. Contact re-enrichment needed (backfill via apollo_id)
2. Email validation not yet implemented
3. Title filtering not baked into prospect.py
4. Lemlist account setup pending (Maildoso -> Lemlist connection)
5. Gap analysis for Touch 2 not yet built

## Phases

1. **Fix foundation** - clean junk accounts, re-enrich contacts, add title filtering
2. **Email validation** - MX lookup + verification before outreach
3. **Page quality** - audit colors, content quality, re-generate weak pages
4. **Lemlist activation** - connect accounts, build sequence, push contacts
