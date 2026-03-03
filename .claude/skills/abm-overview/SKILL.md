---
name: abm-overview
description: Non-technical reference doc for the full ABM pipeline motion. What we built, what tools we use and why, how data flows, what's missing, and the campaign strategy. Use when onboarding someone, explaining the system, or auditing gaps.
---

# ABM Pipeline - The Full Motion

> Non-technical overview. For code-level runbook, see `scripts/abm/README.md`.
> For full GTM context (tools, demand, messaging, campaigns), see `gtm-os/CLAUDE.md`.
> Last updated: 2026-03-01

## What We Built

An automated pipeline that finds companies matching our ideal customer profile, researches them deeply, finds the right people to talk to, generates a personalized landing page for each one, syncs everything to a CRM, and sends cold email with the landing page as the centerpiece.

The landing page IS the pitch. A custom page at `thegtmos.ai/for/company-name` showing: here's what we know about your challenges, here's what we'd do, here's the timeline, here's how our stack works. The page itself is the demo.

---

## The Pieces (In Order)

### 1. Discovery - Exa

**What:** AI-powered search engine that finds B2B SaaS companies matching 20 ICP search queries (series A-D, sales teams, RevOps, AI sales tools, etc.).

**Why Exa:** Understands semantic queries, not just keywords. "Companies struggling with sales enablement" returns actual companies, not blog posts about sales enablement.

**How:** `research.py` runs queries, filters junk (LinkedIn, article headlines, domains >80 chars), does 4 follow-up deep dives per company (funding, tech stack, news, jobs). Stores raw JSONB in Supabase `accounts.exa_research`.

### 2. Contact Enrichment - Apollo

**What:** Finds the right people at each company - VP/Director/Manager level. Up to 3 contacts per company, one marked as primary. Gets name, title, email, LinkedIn.

**Why Apollo:** Best contact database for B2B. Direct email addresses.

**How:** `prospect.py` hits Apollo's `mixed_people/api_search` filtered by seniority and domain.

### 3. Page Generation - Exa + Grok

**What:** The heavy step. Deep research + AI-generated landing page content.

**Why Grok:** Fast, cheap, good at structured JSON. Voice rules baked into the prompt.

**How:** `generate.py` runs 4 more Exa queries (blog, press, jobs, about page), then Grok generates:
- 2-sentence professional "vibe" of the primary contact
- Full page data: 5 stats, 4 challenges, 4 deliverables, engagement timeline, FAQ, tech stack, brand color

Page goes live immediately on `thegtmos.ai/for/slug` via ISR.

### 4. CRM Sync - Attio

**What:** Every company and contact pushed to Attio with custom attributes (source, stage, outreach status, landing page URL). Added to Target Account List.

**Why Attio:** Clean, modern, API-first CRM. Custom objects without Salesforce complexity.

**How:** `sync_attio.py` upserts companies by domain, people by email, links them, sets attributes.

### 5. Depersonalization - TTL System

**What:** Pages have a 30-day lifespan after outreach is sent. After expiry, contact names stripped. Manual deprecation for full 404 on opt-out.

**Why:** Privacy hygiene. Don't leave personalized pages up indefinitely.

**How:** `depersonalize.py` runs daily at 06:00 via launchd. Checks `sent_at + expires_at` math.

### 6. Outreach - Maildoso (8 accounts)

**What:** 8 sending accounts across 2 domains, round-robin rotation, 3 emails/account/day = 24/day. Loads template from Supabase, renders with contact name, company, landing page URL.

**Why Maildoso:** Dedicated sending infrastructure. Multiple accounts/domains for deliverability and warmup. SPF/DMARC configured.

**How:** `outreach.py` reads `maildoso_accounts.json`, queries send counts per account, picks next available account, caches SMTP connections, logs `from_email` per send.

### 7. Reply Monitoring - IMAP

**What:** Scans each sending inbox for replies. Matches back to original send via email headers. Detects opt-out language. Updates CRM status.

**How:** `check_replies.py` only scans inboxes with active sends. 7-day lookback window.

---

## What Tracks It

| System | Role |
|--------|------|
| **Supabase** | System of record. Accounts, contacts, pages, sends, views. Everything writes here. |
| **Attio** | Human-facing CRM. Pipeline state, reply status, manual action. |
| **PostHog** | Page view analytics. `abm_page_viewed` event with company/contact/slug properties. |

---

## Data Architecture Vision

**Supabase = the warehouse.** Every account ever researched, every contact ever found, every page ever generated. Full universe of potential targets. Thousands of rows. Raw research. Analytics. Send logs.

**Attio = the workbench.** Only accounts actively being worked. Clean, curated, human-usable. Accounts graduate from Supabase to Attio when ready for outreach.

---

## What's Missing

| Gap | Impact | Priority |
|-----|--------|----------|
| No second touch / follow-up sequence | One email and done. No campaign concept. | HIGH |
| No email verification | Apollo emails unverified. Bounce rate unknown. Domain reputation risk. | HIGH |
| Reply checking not scheduled | Manual runs only. No launchd plist. | MEDIUM |
| PostHog-to-Attio bridge not scheduled | Page views don't flow to CRM automatically. | MEDIUM |
| `?c=` contact param unused in outreach | Per-contact personalization exists in renderer but outreach doesn't append it. | LOW |
| No template version control | Email template lives only in Supabase. No file backup. | LOW |
| Account sourcing is batch-only | 20 fixed Exa queries. No continuous discovery or feedback loop. | MEDIUM |
| Attio sync has no gate | Everything syncs, not just outreach-ready accounts. CRM gets noisy. | MEDIUM |

---

## Campaign Strategy (v2 - Planned)

### Touch 1: The Offer
The landing page IS the value. Email leads with the strongest insight from their research - one specific thing that makes this relevant right now. Links to their page.

"We built this for you. Here's what we found, here's what we'd do."

### Touch 2: Poke the Bear
Automated gap analysis of their actual site/SEO/content. Run audit tools via MCP to check:
- Missing meta tags, thin content, no blog
- Technical SEO gaps (speed, mobile, structured data)
- Keyword gaps vs. competitors
- Content opportunities they're not capturing

Second email delivers a mini audit: "We ran a quick analysis. Found 3 things: [specific gaps]. Here's what we'd prioritize. This is phase 1 of what's on your page. Want to talk?"

Not asking for time with nothing to show. Handing them a deliverable before they've paid. That's the poke - they feel compelled to respond because work was already done.

---

## Automation Schedule

| Time | Job | Script |
|------|-----|--------|
| 22:00 | Full pipeline (research + prospect + generate + sync + depersonalize) | `pipeline.py --step all --limit 10 --resume` |
| 06:00 | TTL depersonalization | `depersonalize.py` |
| Manual | Outreach sends | `outreach.py --limit N` |
| Manual | Reply checking | `check_replies.py` |
| Not scheduled | PostHog -> Attio view sync | `posthog_to_attio.py` |

---

## Capacity

- 8 Maildoso accounts x 3 emails/day = **24 emails/day**
- Nightly pipeline processes up to 10 new accounts/day
- Landing pages go live via ISR (< 1 hour cache)
- 30-day page TTL after outreach sent
