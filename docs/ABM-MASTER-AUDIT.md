# ABM Pipeline - Master Audit & Execution Plan

> Generated: 2026-03-01 | Source: Full codebase deep dive + live Supabase queries
> Purpose: Complete picture of what we built, what's broken, what's missing, and the fix plan.

---

## 1. THE SYSTEM WE BUILT

An automated Account-Based Marketing pipeline that:
1. **Discovers** B2B SaaS companies via Exa semantic search (20 ICP queries)
2. **Enriches contacts** via Apollo (VP/Director/Manager level, 3 per company)
3. **Generates personalized landing pages** via Exa research + Grok AI copy
4. **Syncs to CRM** (Attio) with custom attributes and Target Account List
5. **Sends cold email** via Maildoso (8 accounts, round-robin, 24/day capacity)
6. **Monitors replies** via IMAP with opt-out detection
7. **Manages page lifecycle** with 30-day TTL and auto-depersonalization

The landing page IS the pitch. Custom page at `thegtmos.ai/for/company-name` showing research, challenges, deliverables, timeline, tech stack - specific to each company. The page itself is the demo of what we build.

### Tools & Why

| Tool | Role | Why This One |
|------|------|--------------|
| **Exa** | Discovery + deep research | Semantic search understands ICP queries, not just keywords |
| **Apollo** | Contact enrichment | Best B2B contact database. Direct emails + LinkedIn |
| **Grok (xAI)** | AI copy generation | Fast, cheap, good at structured JSON. Voice rules in prompt |
| **Supabase** | System of record (warehouse) | PostgreSQL, JSONB support, SDK, free tier |
| **Attio** | Human-facing CRM (workbench) | Clean API, custom objects without Salesforce complexity |
| **Lemlist** | Campaign sequencing | Multi-touch sequences, warmup, tracking. Replaces manual outreach.py |
| **Maildoso** | Sending infrastructure | Dedicated domains, SPF/DMARC, 8 accounts across 2 domains |
| **PostHog** | Page view analytics | `abm_page_viewed` event tracking |
| **Firecrawl** | Website scraping (enrichment) | Deep page analysis for find_similar scoring |

---

## 2. DATA ARCHITECTURE

### Supabase Tables (8 total)

```
accounts (182 rows)     - Target companies. Stage progression: prospect -> page_live -> outreach -> replied -> meeting -> client
contacts (146 rows)     - People at target companies. Linked to accounts via account_id
landing_pages (62 rows) - Generated page content (JSONB). Live at thegtmos.ai/for/{slug}
email_sends (0 rows)    - Outreach log. Tracks from_email, message_id, status
email_templates (1 row) - Reusable templates with {{variable}} placeholders
page_views (0 rows)     - PostHog event sink
activities (0 rows)     - Activity log (unused)
deals (0 rows)          - Deal tracking (unused)
```

### Data Flow

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

### Account Stage Progression

```
prospect ──> researched ──> page_live ──> outreach ──> replied ──> meeting ──> client
                                                   └──> opted_out
```

### Account Outreach Status

```
new ──> emailed ──> replied ──> meeting
                └──> opted_out
```

---

## 3. CURRENT DATA QUALITY AUDIT

### accounts (182 rows)

| Field | Populated | Notes |
|-------|-----------|-------|
| name | 182/182 | All populated |
| domain | 182/182 | All populated |
| source | 182/182 | All "exa_research" |
| stage | 182/182 | ALL "prospect" - none progressed |
| outreach_status | 182/182 | All "new" |
| industry | 0/182 | EMPTY |
| size | 0/182 | EMPTY |
| geography | 0/182 | EMPTY |
| exa_research | 0/182 | EMPTY - research data not stored |
| apollo_id | 0/182 | EMPTY |
| employee_count | 0/182 | EMPTY |
| tech_stack | 0/182 | EMPTY |
| gap_analysis | 0/182 | EMPTY |
| icp_score | 0/182 | EMPTY |
| funding | 0/182 | EMPTY |

**Verdict:** Accounts are name+domain only. Zero enrichment.

### contacts (146 rows)

| Field | Populated | Notes |
|-------|-----------|-------|
| first_name | 146/146 | All populated |
| last_name | 0/146 | ALL EMPTY STRINGS |
| email | 0/146 | ALL EMPTY STRINGS |
| linkedin_url | 0/146 | ALL EMPTY STRINGS |
| title | 146/146 | All populated |
| apollo_id | 146/146 | All populated (Apollo matched but fields not written) |
| is_primary | unknown | Likely set |
| vibe | 0/146 | Not generated yet |
| persona | 0/146 | Not set |
| lemlist_lead_id | 0/146 | Not pushed yet |

**Verdict:** Contacts have first_name + title + apollo_id but NOTHING ELSE. Critical fields (email, last_name, linkedin_url) are empty strings. Likely a migration bug from old SQLite - Apollo returned data but it wasn't mapped.

### contacts - Title Quality

| Category | Count | % | Examples |
|----------|-------|---|---------|
| Relevant (sales/rev/growth/marketing/CS) | ~105 | 72% | VP Sales, Director Revenue Ops, BDM |
| Irrelevant (HR/talent/engineering/creative) | ~41 | 28% | HR Manager, Lead Technical Recruiter, Senior Software Engineering Manager |

### Junk Account Entries

5+ accounts are not companies - they're articles or aggregator pages:
- "B2B SaaS Ltd" (domain: linkedin.com)
- "Sales Operations and Company Growth: An Extensive Guide" (domain: about.crunchbase.com)
- "Series Funding A, B, C and D - SaaSBoomi" (domain: saasboomi.org)
- "12 Fastest Growing Revenue Intelligence Platforms..." (domain: landbase.com)
- "How to Build a Scalable B2B SaaS Sales Team..." (domain: demandzen.com)

### Coverage Gap

- 62 accounts have contacts (34%)
- 120 accounts have NO contacts (66%)
- 62 landing pages exist
- 0 emails sent, 0 page views tracked

---

## 4. ROOT CAUSE ANALYSIS

### Why contacts are empty
The contacts were likely migrated from the old SQLite `crm.db` via `migrate_to_supabase.py`. The migration script maps `first_name`, `last_name`, `email`, etc. but if the old SQLite didn't have these fields populated (or used different column names), they'd be written as empty strings. Apollo IDs exist because Apollo was queried, but the enriched data wasn't persisted back.

### Why accounts have no enrichment
`research.py` stores Exa research in `accounts.exa_research` JSONB, but the 182 current accounts were likely loaded from a different source (CSV import? manual entry?) that only had name + domain. The research step may never have been re-run against these accounts.

### Why 28% of titles are irrelevant
`prospect.py` filters by seniority (`vp`, `director`, `manager`) but NOT by department/function. Apollo returns whoever matches seniority at that domain - which includes HR directors, engineering managers, talent VPs, etc.

---

## 5. WHAT NEEDS TO HAPPEN (EXECUTION PLAN)

### Phase 1: Fix the Foundation (Supabase Data Quality)

**Goal:** 100 clean accounts with 2-3 quality contacts each, all with email + last_name + linkedin_url.

#### 1A. Clean up junk accounts
- Delete or flag accounts that are articles/aggregators (linkedin.com, about.crunchbase.com, saasboomi.org domains)
- Flag accounts with domains that aren't real companies

#### 1B. Re-enrich contacts via Apollo
- Use apollo_id to re-fetch full contact data (last_name, email, linkedin_url)
- Write a backfill script that iterates contacts with empty email, queries Apollo by apollo_id, populates missing fields
- Alternative: re-run prospect.py with a fix to ensure fields are captured

#### 1C. Add title filtering
- Create an allowlist of target titles/departments:
  - **YES:** VP Sales, VP Revenue, VP Growth, VP Marketing, Director RevOps, Director Sales Ops, Head of Growth, CRO, CMO, Director Demand Gen, Director Sales Dev, Director Customer Success, Sales Manager, BDM, Account Exec Lead, Sales Enablement
  - **NO:** HR, Talent, Recruiting, Engineering, Software, Creative, Community, Social Media, Product Manager, Editor, Data (unless Data Ops)
- Apply filter to existing contacts (soft-delete or flag irrelevant ones)
- Bake filter into prospect.py for future runs

#### 1D. Enrich accounts
- Re-run research.py to populate `exa_research` JSONB
- Use Apollo org enrichment to populate: industry, employee_count, funding
- Populate geography from Apollo or Exa data

#### 1E. Prospect missing accounts
- 120 accounts have 0 contacts - run prospect.py with title filters on these
- Target: 2-3 contacts per account minimum

### Phase 2: Email Validation & MX Lookup

**Goal:** Know which emails are deliverable and which provider they use (Google/Microsoft).

#### 2A. MX Lookup
- For every email domain, do DNS MX lookup
- Classify: Google Workspace, Microsoft 365, Other
- Store `mx_provider` on accounts or contacts table (new column)
- This informs Lemlist strategy - Google recipients get different warmup than Microsoft

#### 2B. Email Validation
- Options (in order of preference):
  1. **Free: DNS MX + SMTP handshake** - Verify mailbox exists without sending (RCPT TO check). Works for most providers.
  2. **Prospeo** - Paid validation service. More accurate.
  3. **Apollo's built-in verification** - If available on current plan.
- Store validation result: `email_status` (valid/invalid/catch-all/unknown)
- Only push valid emails to Lemlist

### Phase 3: Landing Page Quality

**Goal:** Every page matches the company's brand and has substantive content.

#### 3A. Color scheme fix
- Audit existing 62 landing pages for brand color accuracy
- For pages where Grok picked wrong colors: manual fix or re-generate
- Improve prompt to Grok: "Extract exact hex color from the company's website header/logo"
- Consider using Firecrawl to scrape actual CSS/meta theme-color

#### 3B. Content quality pass
- Review generated pages for substance (not just filler)
- Flag pages with generic content
- Re-generate bottom-quality pages with improved prompts

### Phase 4: Supabase as Source of Truth

**Goal:** Everything needed for campaigns lives in Supabase.

#### 4A. New columns needed

| Table | Column | Type | Purpose |
|-------|--------|------|---------|
| contacts | email_status | text | valid/invalid/catch-all/unknown |
| contacts | mx_provider | text | google/microsoft/other |
| accounts | industry | text | Populated from Apollo/Exa |
| accounts | employee_count_range | text | 1-10, 11-50, 51-200, etc. |
| accounts | annual_revenue | text | If available |
| accounts | technographics | jsonb | Tools they use (from BuiltWith/Exa) |
| accounts | firmographics | jsonb | Company details blob |
| email_templates | campaign_id | text | Link to Lemlist campaign |
| email_templates | touch_number | int | 1, 2, 3 for sequence position |

#### 4B. Email copy in Supabase
- Create templates for Touch 1 (the offer), Touch 2 (gap analysis poke), Touch 3 (breakup)
- Store in `email_templates` table with `touch_number`
- Lemlist pulls from Supabase via custom variables, or we pre-generate and push

#### 4C. Campaign tracking
- When Lemlist sends, log to email_sends (or let Lemlist be the system of record for sends)
- Decision: Supabase tracks campaign membership, Lemlist tracks send/open/click events

### Phase 5: Lemlist Campaign Activation

**Goal:** Multi-touch sequence running, all contacts with validated emails.

#### 5A. Lemlist account setup (Shawn)
- Connect Maildoso email accounts to Lemlist
- Configure warmup schedule
- Build 3-touch sequence:
  - **Touch 1:** The landing page offer (Day 0)
  - **Touch 2:** Gap analysis results (Day 3-5)
  - **Touch 3:** Breakup / last chance (Day 7-10)

#### 5B. Push flow
1. Validate email (Phase 2)
2. Generate landing page (if not exists)
3. Run gap analysis (for Touch 2 data)
4. Push to Lemlist with custom variables: pageUrl, gapScore, topIssues, firstName, companyName
5. Track lemlist_lead_id in contacts table

### Phase 6: Feedback Loop & Scaling

**Goal:** System that learns and improves.

#### 6A. ICP scoring
- Score every account on fit (0-100)
- Positive signals: B2B SaaS, Series A-D, 50-500 employees, sales team, revenue ops team
- Negative signals: Enterprise (10K+), nonprofit, consulting, agency, pre-revenue

#### 6B. Smart sourcing
- Use find_similar.py seeded from best performers (replied, page viewed)
- Feed winning account profiles back into Exa queries

#### 6C. Technographics
- Pull tech stack data from Exa research or BuiltWith/Wappalyzer
- Store in accounts.technographics JSONB
- Use for personalization in email copy

---

## 6. PIPELINE SCRIPTS REFERENCE

| Script | Step | In `--step all`? | Purpose |
|--------|------|-------------------|---------|
| `research.py` | research | YES | Exa discovery + deep research |
| `prospect.py` | prospect | YES | Apollo contact enrichment |
| `generate.py` | generate | YES | Landing page generation |
| `sync_attio.py` | sync | YES | CRM sync (gated by default) |
| `depersonalize.py` | depersonalize | YES | TTL enforcement |
| `outreach.py` | outreach | NO (explicit) | Cold email sending |
| `check_replies.py` | replies | NO (explicit) | IMAP reply detection |
| `gap_analysis.py` | gap_analysis | NO (explicit) | Website SEO/perf audit |
| `find_similar.py` | find_similar | NO (explicit) | Lookalike discovery |
| `push_to_lemlist.py` | lemlist | NO (explicit) | Lemlist campaign push |
| `posthog_to_attio.py` | - | NO | Page view sync |
| `attio_configure.py` | - | NO | CRM bulk tagging |

### Automation Schedule (Mac Mini)

| Time | Job | Script |
|------|-----|--------|
| 22:00 | Full pipeline | `pipeline.py --step all --limit 10 --resume` |
| 06:00 | TTL enforcement | `depersonalize.py` |
| Manual | Outreach / replies / gap analysis / Lemlist | Individual scripts |

---

## 7. KEY FILES

| What | Where |
|------|-------|
| Pipeline orchestrator | `scripts/abm/pipeline.py` |
| Supabase client | `scripts/abm/db_supabase.py` |
| Environment config | `scripts/abm/.env` |
| Maildoso accounts | `scripts/abm/maildoso_accounts.json` |
| Landing page template | `website/apps/gtmos/app/for/[slug]/LandingPageTemplate.tsx` |
| ABM data library | `website/apps/gtmos/app/lib/abm.ts` |
| PostHog tracker | `website/apps/gtmos/app/for/ABMTracker.tsx` |
| ABM overview skill | `.claude/skills/abm-overview/SKILL.md` |
| ABM runbook | `scripts/abm/README.md` |

---

## 8. EXTERNAL SERVICE IDS

| Service | Key Reference |
|---------|---------------|
| Attio Target List (companies) | `9c6e26b5-b3b6-494d-8e43-b6726a38a6af` |
| Attio Target List (people) | `ba966502-f512-4c3a-bf8d-1be3cf54cd16` |
| PostHog Project | 325806 |
| PostHog Dashboard | 1319078 |
| Lemlist Tracking ID | `tea_Z2cdZTSqWMD4qevy4` |
| Supabase Project | `uohlxmupujhxhbffspzs` |

---

## 9. KNOWN LIMITATIONS

1. **Attio MCP bugs** - List filtering (Modes 3/4) returns unfiltered results. Can't programmatically remove list entries. Use soft-remove (status update + note).
2. **No bounce handling** - check_replies.py only finds replies, not bounces.
3. **No automatic retry** - Pipeline moves on after per-query failures; partial data possible.
4. **Exa junk leaks through** - Articles/blog posts still get into accounts table despite slug length filter.
5. **Single template** - Only cold_outreach_v1 exists. No follow-up templates.
6. **No A/B testing** - No framework for testing email variants.

---

## 10. THE TARGET STATE

100 companies. 2-3 quality contacts each (250-300 contacts). All with:
- Validated email addresses (MX provider identified: Google/Microsoft/Other)
- Last names
- LinkedIn URLs
- Relevant titles (sales/revenue/growth/marketing only)
- Company enrichment (industry, size, funding, tech stack)
- Personalized landing page (brand-accurate colors, substantive content)
- ICP score
- Gap analysis (for Touch 2)
- Everything in Supabase, ready to extract to Lemlist

Then: Multi-touch Lemlist campaign. Touch 1 (landing page offer) -> Touch 2 (gap analysis poke) -> Touch 3 (breakup). Email copy stored in Supabase. Lemlist handles sequencing and tracking. PostHog tracks page views. Attio shows pipeline state.

Then: Scale. find_similar.py feeds new accounts from best performers. ICP scoring auto-prioritizes. Technographics enable hyper-personalization. The system compounds.
