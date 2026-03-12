/**
 * ShawnOS — Apollo Wiki Data
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

import type { WikiSection } from './clay-wiki'

/* ── types ─────────────────────────────────────────── */

export type ApolloWikiCategory =
  | 'core-concepts'
  | 'workflows'
  | 'integrations'
  | 'reference'

export interface ApolloWikiEntry {
  id: string // URL slug
  title: string
  subtitle: string // one-liner for cards
  category: ApolloWikiCategory
  description: string // SEO meta description
  keywords: string[]
  sections: WikiSection[]
  related: string[] // other wiki entry IDs
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

/* ── category metadata ────────────────────────────── */

export const APOLLO_WIKI_CATEGORIES: {
  id: ApolloWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'core-concepts',
    label: 'Core Concepts',
    description: 'Why people-search-first, API architecture, and title filtering patterns',
    prompt: '$ cd ~/apollo-wiki/core-concepts/',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    description: 'Hacker track, SDR enablement track, and conference prospecting flows',
    prompt: '$ cd ~/apollo-wiki/workflows/',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'Supabase warehouse, CRM sync, and Claude Code/Co-work patterns',
    prompt: '$ cd ~/apollo-wiki/integrations/',
  },
  {
    id: 'reference',
    label: 'Reference',
    description: 'API endpoints, rate limits, and quick reference guides',
    prompt: '$ cd ~/apollo-wiki/reference/',
  },
]

/* ── helpers ──────────────────────────────────────── */

export function getApolloWikiEntry(slug: string): ApolloWikiEntry | undefined {
  return APOLLO_WIKI_ENTRIES.find((e) => e.id === slug)
}

/* ── wiki entries ─────────────────────────────────── */

export const APOLLO_WIKI_ENTRIES: ApolloWikiEntry[] = [
  /* ================================================================== */
  /*  CORE CONCEPTS                                                       */
  /* ================================================================== */

  {
    id: 'people-search-first',
    title: 'People Search First: Why Apollo Before Clay',
    subtitle: 'The thesis - Apollo should be your first sourcing run, not Clay',
    category: 'core-concepts',
    description:
      'Why Apollo should be your first sourcing run in any GTM pipeline. People search is the biggest bottleneck in GTM engineering - Apollo gives you the richest B2B data with a free API.',
    keywords: [
      'apollo people search',
      'apollo vs clay',
      'apollo sourcing',
      'b2b people data',
      'gtm people search',
      'apollo free api',
      'sales sourcing automation',
    ],
    difficulty: 'beginner',
    related: [
      'api-architecture',
      'hacker-track',
      'sdr-enablement-track',
    ],
    sections: [
      {
        heading: 'The Bottleneck Nobody Automates',
        type: 'prose',
        content:
          "People search is step one of every GTM motion. Finding the right people at the right companies with the right titles. And for most teams, it is still manual. Open LinkedIn Sales Navigator, scroll through results, export a CSV, import it somewhere else, start enriching. The sourcing step - the very first step - is where teams burn the most time. Everything downstream (enrichment, scoring, outreach) can be automated. But sourcing? Most teams still do it by hand.",
      },
      {
        heading: 'Why Apollo First',
        type: 'pattern',
        content:
          "Apollo has the richest people database in B2B SaaS. 275M+ contacts, 73M+ companies, verified emails, direct dials, job titles, seniority levels, company technographics. And the API is free for the first 10,000 credits per month. That changes the economics completely. You don't need to start with Clay (which charges credits for every enrichment call). You start with Apollo to get the raw people data - names, titles, emails, company info - and then you orchestrate everything else downstream. Apollo is your sourcing layer. Clay is your enrichment and routing layer. They solve different problems.",
      },
      {
        heading: 'The Architecture Shift',
        type: 'pattern',
        content:
          "Old way: open Apollo browser UI, search, export CSV, import to Clay, run enrichment waterfall, push to CRM. That is four manual steps before you even start outreach. New way: Apollo API call returns structured JSON with people + company data. Script writes to Supabase. Enrichment runs on the delta. CRM sync happens automatically. The sourcing step went from 30 minutes of clicking to a single API call. And it runs on a cron, not on your calendar.",
      },
      {
        heading: 'When Clay Still Wins',
        type: 'pro-tip',
        content:
          "Clay is still the best orchestration layer for enrichment waterfall, multi-provider lookups, and AI-driven research (Claygent). The point is not to replace Clay. The point is to stop using Clay for sourcing. Apollo handles the people search. Clay handles the enrichment and routing. Supabase handles the storage. Each tool does what it does best. That is the architecture.",
      },
    ],
  },

  {
    id: 'api-architecture',
    title: 'Apollo API Architecture',
    subtitle: 'Endpoints, auth, response shapes, and free tier limits',
    category: 'core-concepts',
    description:
      'Apollo API architecture for GTM engineers. Key endpoints (mixed_people/api_search, organizations/enrich), authentication, response shapes, and free tier credit limits.',
    keywords: [
      'apollo api',
      'apollo api endpoints',
      'apollo mixed people search',
      'apollo organizations enrich',
      'apollo api authentication',
      'apollo api rate limits',
      'apollo free tier',
    ],
    difficulty: 'intermediate',
    related: [
      'people-search-first',
      'api-quick-reference',
      'hacker-track',
    ],
    sections: [
      {
        heading: 'Two Endpoints That Matter',
        type: 'prose',
        content:
          "Apollo has a large API surface, but for GTM sourcing you only need two endpoints. <code>POST /v1/mixed_people/search</code> is your people search - filter by title, seniority, company size, industry, location, and dozens of other fields. It returns contacts with emails, phone numbers, and company data attached. <code>POST /v1/organizations/enrich</code> takes a domain and returns full company firmographics - employee count, revenue, funding, tech stack, industry classification. Those two endpoints cover 90% of what you need for sourcing and qualification.",
      },
      {
        heading: 'Authentication',
        type: 'pattern',
        content:
          "Apollo uses API key authentication. You pass your key as an <code>api_key</code> parameter in the request body (POST) or as a query parameter (GET). No OAuth, no token refresh, no complex auth flow. Get your key from Settings > API Keys in the Apollo dashboard. Store it in your environment variables as <code>APOLLO_API_KEY</code>. That is the entire auth setup.",
      },
      {
        heading: 'Response Shape',
        type: 'code',
        content:
          "The people search endpoint returns a <code>people</code> array with each contact containing: <code>id</code>, <code>first_name</code>, <code>last_name</code>, <code>title</code>, <code>seniority</code>, <code>email</code>, <code>organization</code> (nested company object with domain, employee count, industry). The <code>pagination</code> object gives you <code>page</code>, <code>per_page</code>, and <code>total_entries</code> for batching through large result sets. Each page returns up to 100 results. Response is standard JSON - no weird nested structures or inconsistent field names.",
      },
      {
        heading: 'Free Tier Economics',
        type: 'pro-tip',
        content:
          "Apollo's free plan gives you 10,000 credits per month. A people search costs 1 credit per contact returned. An organization enrichment costs 1 credit. That means you can search and qualify 10,000 contacts per month for free. For comparison, Clay charges credits for every enrichment provider call, and their free tier is much smaller. If you are building a GTM pipeline on a budget, Apollo sourcing + Supabase storage + Claude Code scripting gives you a production-grade pipeline at near-zero cost.",
      },
    ],
  },

  {
    id: 'seniority-title-filtering',
    title: 'Seniority and Title Filtering',
    subtitle: 'Solving the title leakage problem with allowlist/blocklist patterns',
    category: 'core-concepts',
    description:
      'How to filter Apollo people search results by seniority and title to prevent HR, engineering, and irrelevant persona leakage. Allowlist and blocklist patterns from production pipelines.',
    keywords: [
      'apollo title filter',
      'apollo seniority filter',
      'title leakage',
      'apollo persona filtering',
      'b2b title qualification',
      'apollo search filters',
      'sales title targeting',
    ],
    difficulty: 'intermediate',
    related: [
      'api-architecture',
      'people-search-first',
      'conference-prospecting',
    ],
    sections: [
      {
        heading: 'The Title Leakage Problem',
        type: 'prose',
        content:
          "You search Apollo for \"VP of Marketing\" at SaaS companies. You get back 200 results. You start scrolling and find: VP of Marketing Operations, VP of HR who used to be in marketing, a \"Marketing\" job title that is actually an engineering role at a marketing tech company, an intern with \"Marketing\" in their LinkedIn headline. Title leakage is the single biggest quality problem in people search. Apollo's seniority filters help, but they are not enough on their own. You need an allowlist/blocklist pattern.",
      },
      {
        heading: 'The Allowlist Pattern',
        type: 'pattern',
        content:
          "Start with Apollo's built-in seniority filter. Set <code>person_seniorities: [\"vp\", \"director\", \"c_suite\", \"founder\"]</code> to exclude individual contributors. Then add a title allowlist - specific strings the title MUST contain: \"marketing\", \"growth\", \"demand gen\", \"revenue\". This narrows the aperture. Finally, add a title blocklist - strings that disqualify: \"intern\", \"assistant\", \"coordinator\", \"HR\", \"human resources\", \"engineering\", \"developer\", \"recruiter\". The blocklist catches the leakage that seniority filters miss. Run allowlist first, then blocklist. Order matters.",
      },
      {
        heading: 'Implementation in Python',
        type: 'code',
        content:
          "The pattern lives in a simple function. Take the raw Apollo results, iterate through contacts, check <code>title.lower()</code> against your allowlist (any match = keep), then check against your blocklist (any match = drop). Log the drops so you can tune the lists over time. In production, this function sits between the Apollo API call and the Supabase insert. It is the quality gate. Without it, you are importing garbage into your pipeline and burning enrichment credits on unqualified contacts.",
      },
      {
        heading: 'Tuning the Lists',
        type: 'pro-tip',
        content:
          "Your allowlist and blocklist are living documents. After every sourcing run, review the drops. If you are dropping too many valid contacts, your blocklist is too aggressive. If garbage is getting through, your allowlist is too broad. The goal is not perfection on the first run - it is a feedback loop that improves over time. Keep the lists in a config file, not hardcoded. A YAML or JSON file that you can edit without touching the sourcing script. That way non-technical team members can tune the lists too.",
      },
    ],
  },

  /* ================================================================== */
  /*  WORKFLOWS                                                           */
  /* ================================================================== */

  {
    id: 'hacker-track',
    title: 'The Hacker Track: API + Supabase + Claude Code',
    subtitle: 'Full automation pipeline for technical GTM operators',
    category: 'workflows',
    description:
      'The hacker track for Apollo-driven GTM: Supabase as data warehouse, Apollo API for sourcing, Claude Code for scripting, and cron jobs on a Mac Mini for always-on pipeline automation.',
    keywords: [
      'apollo automation',
      'apollo supabase pipeline',
      'apollo claude code',
      'gtm automation pipeline',
      'apollo cron job',
      'people search automation',
      'technical gtm pipeline',
    ],
    difficulty: 'advanced',
    related: [
      'people-search-first',
      'api-architecture',
      'supabase-warehouse',
      'sdr-enablement-track',
    ],
    sections: [
      {
        heading: 'The Stack',
        type: 'prose',
        content:
          "Apollo API for sourcing. Supabase (Postgres) as your data warehouse. Claude Code for writing and iterating on scripts. A Mac Mini (or any always-on machine) running cron jobs. That is the entire stack. No SaaS platform fees, no per-seat pricing, no vendor lock-in. You own the data, the logic, and the infrastructure. Total monthly cost: Apollo free tier ($0) + Supabase free tier ($0) + Mac Mini electricity (~$5). The code lives in your repo. The data lives in your database. The pipeline runs while you sleep.",
      },
      {
        heading: 'The Batching Pattern',
        type: 'pattern',
        content:
          "Never search Apollo for everything at once. Batch by persona. Run 1: search for VP/Director of Marketing at SaaS companies, 50-500 employees, US-based. Write results to Supabase. Run 2: same filters but VP/Director of Sales. Run 3: same but RevOps and Growth titles. Each batch gets its own sourcing run, its own title filter pass, and its own dedup check against existing contacts in Supabase. This prevents credit waste (no duplicate searches) and keeps your data organized by persona from the start.",
      },
      {
        heading: 'Rate-Limit-Safe Enrichment',
        type: 'pattern',
        content:
          "Apollo rate limits are generous but real. 100 requests per minute on the free tier. Your enrichment script needs to respect this. Pattern: pull a batch of un-enriched contacts from Supabase (SELECT WHERE enriched_at IS NULL LIMIT 50). Run the enrichment calls with a 1-second delay between requests. Update Supabase with results. Log failures for retry. Run this on a 15-minute cron. You process 50 contacts every 15 minutes, 200 per hour, 4,800 per day. That is production throughput for most SMB and mid-market pipelines.",
      },
      {
        heading: 'Claude Code as Your GTM Engineer',
        type: 'pro-tip',
        content:
          "You do not need to be a Python expert to build this pipeline. Claude Code writes the scripts. Describe what you want: \"write a Python script that searches Apollo for VP of Marketing at SaaS companies with 50-500 employees, filters by title allowlist, deduplicates against existing Supabase contacts, and inserts new contacts.\" Claude Code generates the script, handles the API calls, writes the SQL, and even sets up the cron job. You review, test, and ship. The barrier to building this pipeline is not technical skill. It is knowing the architecture.",
      },
    ],
  },

  {
    id: 'sdr-enablement-track',
    title: 'The SDR Enablement Track: Claude Co-work + Folder Systems',
    subtitle: 'Research, icebreakers, and CRM-ready output for sales teams',
    category: 'workflows',
    description:
      'SDR enablement workflow using Apollo data with Claude Co-work, folder-based organization, and Python scripts for research, icebreakers, tech stack analysis, and CRM-ready output.',
    keywords: [
      'apollo sdr workflow',
      'claude co-work sales',
      'apollo research workflow',
      'sdr enablement automation',
      'apollo icebreakers',
      'sales research automation',
      'apollo crm workflow',
    ],
    difficulty: 'intermediate',
    related: [
      'hacker-track',
      'people-search-first',
      'conference-prospecting',
    ],
    sections: [
      {
        heading: 'Not Every Team Needs the Hacker Track',
        type: 'prose',
        content:
          "The hacker track is for technical operators who want full control. But most sales teams do not have a GTM engineer on staff. They need something simpler - a workflow that uses Apollo data but does not require writing Python scripts or managing databases. The SDR enablement track uses Claude Co-work (Claude's project/folder system) to organize Apollo exports, run research, and produce CRM-ready output. No code required. Just structured folders and good prompts.",
      },
      {
        heading: 'The Folder System',
        type: 'pattern',
        content:
          "Create a Claude project with three folders: <strong>1. Raw Data</strong> - Apollo CSV exports, company lists, conference attendee lists. <strong>2. Research</strong> - company briefs, tech stack analyses, competitive intel. <strong>3. Output</strong> - icebreaker drafts, personalized email sequences, CRM import files. Claude Co-work reads across all folders. When you drop an Apollo export into Raw Data, Claude can cross-reference it against your research folder to produce personalized icebreakers. The folder system IS your workflow. No pipeline code needed.",
      },
      {
        heading: 'Research to Icebreaker Pipeline',
        type: 'pattern',
        content:
          "Step 1: Export target accounts from Apollo (CSV). Drop into Raw Data folder. Step 2: Ask Claude to research each company - recent news, job postings, tech stack, funding rounds. Claude writes briefs to Research folder. Step 3: Ask Claude to generate icebreakers for each contact based on their title + company research. Output goes to Output folder as a CSV ready for CRM import or email tool upload. The whole flow takes 10 minutes for 50 contacts. An SDR doing this manually would spend 2-3 hours.",
      },
      {
        heading: 'CRM Connectors',
        type: 'pro-tip',
        content:
          "The output folder produces CSV files formatted for your CRM's import tool. For HubSpot: include email, first_name, last_name, company, title, and any custom properties in the header row. For Attio: map to record attributes. For Salesforce: match to lead object fields. The key is standardizing your output format once and reusing it. Claude Co-work can learn your CRM's field mapping and produce import-ready files every time. No Zapier, no middleware, no integration tax.",
      },
    ],
  },

  {
    id: 'conference-prospecting',
    title: 'Conference Prospecting with Apollo',
    subtitle: 'Scanning, qualifying, and tiering 100-1000 attendees',
    category: 'workflows',
    description:
      'How to use Apollo for conference prospecting - scanning attendee lists, qualifying by ICP fit, tiering contacts, and routing to outreach. Real numbers from production conference flows.',
    keywords: [
      'apollo conference prospecting',
      'conference attendee qualification',
      'event prospecting automation',
      'apollo attendee scan',
      'conference lead gen',
      'event prospecting pipeline',
      'trade show prospecting',
    ],
    difficulty: 'intermediate',
    related: [
      'seniority-title-filtering',
      'sdr-enablement-track',
      'hacker-track',
    ],
    sections: [
      {
        heading: 'The Conference Problem',
        type: 'prose',
        content:
          "A mid-size SaaS conference has 500-2,000 attendees. A large industry event has 5,000-20,000. The attendee list drops 2-4 weeks before the event. Most sales teams scan it manually, maybe qualifying 20-30 people before giving up. The rest go unqualified. You walk into the conference with a short list and hope you bump into the right people. That is the old way. The new way: run the entire attendee list through Apollo, qualify by ICP fit, tier the results, and walk in with a prioritized hit list.",
      },
      {
        heading: 'The Flow',
        type: 'pattern',
        content:
          "1. Get the attendee list (CSV from event organizer, web scrape, or LinkedIn event page). 2. Clean and deduplicate - extract names, companies, titles. 3. Enrich through Apollo - match by name + company to get emails, seniority, company data. 4. Run ICP scoring - company size, industry, tech stack, seniority level. 5. Tier the results: Tier 1 (must meet, schedule pre-event), Tier 2 (find at the event, no pre-outreach), Tier 3 (badge scan and nurture). 6. Route Tier 1 to pre-event email sequence. Route Tier 2 to mobile app for on-site lookup.",
      },
      {
        heading: 'Real Numbers',
        type: 'pattern',
        content:
          "From a 800-attendee SaaS conference: 800 names in. Apollo matched 620 (77% match rate). Title filter passed 340 (55% of matches). ICP scoring produced 85 Tier 1, 120 Tier 2, 135 Tier 3. Pre-event outreach to 85 Tier 1 contacts booked 12 meetings before the event started. On-site, the Tier 2 list helped the team identify and approach 40+ qualified contacts they would have walked past otherwise. Total pipeline generated: 3x what the team produced at their previous conference with manual qualification.",
      },
      {
        heading: 'Web Reveal into Claude Code',
        type: 'pro-tip',
        content:
          "If your conference has a website with speaker/attendee profiles, use web reveal (Clay or direct scraping) to grab the profile pages, then pipe the data into Claude Code for qualification. Claude Code can parse unstructured profile text, extract titles and companies, match against Apollo, and produce a qualified list. This is especially useful for events that do not provide a clean CSV attendee list. The profile pages become your input, Apollo becomes your enrichment layer, and Claude Code ties it together.",
      },
    ],
  },

  /* ================================================================== */
  /*  INTEGRATIONS                                                        */
  /* ================================================================== */

  {
    id: 'supabase-warehouse',
    title: 'Apollo to Supabase Data Warehouse',
    subtitle: 'Schema design, upsert logic, and account-contact split for Apollo data',
    category: 'integrations',
    description:
      'How to build a Supabase data warehouse for Apollo sourcing data. Schema design with account-contact split, upsert logic to prevent duplicates, and query patterns for pipeline analytics.',
    keywords: [
      'apollo supabase',
      'apollo data warehouse',
      'apollo postgres',
      'apollo database schema',
      'apollo upsert',
      'apollo account contact split',
      'gtm data warehouse',
    ],
    difficulty: 'advanced',
    related: [
      'hacker-track',
      'api-architecture',
      'api-quick-reference',
    ],
    sections: [
      {
        heading: 'Why Supabase',
        type: 'prose',
        content:
          "Apollo data needs to live somewhere durable. CSV exports get lost. Spreadsheets do not scale. CRMs have import limits and field constraints. Supabase gives you a free Postgres database with a REST API, real-time subscriptions, and row-level security. Your Apollo sourcing scripts write directly to Supabase. Your enrichment scripts read from and write back to Supabase. Your CRM sync reads from Supabase. It is the central data warehouse that connects everything. And the free tier handles 500MB of data and 2GB of bandwidth - more than enough for most GTM pipelines.",
      },
      {
        heading: 'The Account-Contact Split',
        type: 'pattern',
        content:
          "Two tables. <code>accounts</code>: domain (primary key), company_name, employee_count, industry, annual_revenue, tech_stack, icp_score, enriched_at. <code>contacts</code>: apollo_id (primary key), email, first_name, last_name, title, seniority, domain (foreign key to accounts), persona_tag, sourced_at, enriched_at. The account-contact split prevents duplicate company enrichment. 50 contacts at Microsoft = 1 account row enriched once, not 50 redundant company lookups. This is the same foundational pattern from Clay, applied to your own database.",
      },
      {
        heading: 'Upsert Logic',
        type: 'code',
        content:
          "Every Apollo sourcing run should upsert, not insert. On the accounts table, upsert on domain - if the domain exists, update the fields that changed. On the contacts table, upsert on apollo_id (or email if apollo_id is missing). This prevents duplicates across multiple sourcing runs. In Supabase, use <code>supabase.from('contacts').upsert(data, { onConflict: 'apollo_id' })</code>. In raw SQL: <code>INSERT INTO contacts (...) VALUES (...) ON CONFLICT (apollo_id) DO UPDATE SET title = EXCLUDED.title, enriched_at = EXCLUDED.enriched_at</code>. Fields like sourced_at should NOT be overwritten on upsert - you want to preserve when the contact was first sourced.",
      },
      {
        heading: 'Query Patterns',
        type: 'pro-tip',
        content:
          "Once your data is in Supabase, you can run pipeline analytics that CRMs make difficult. Examples: \"How many VP-level contacts have we sourced at companies with 50-200 employees in the last 30 days?\" <code>SELECT COUNT(*) FROM contacts c JOIN accounts a ON c.domain = a.domain WHERE c.seniority = 'vp' AND a.employee_count BETWEEN 50 AND 200 AND c.sourced_at > NOW() - INTERVAL '30 days'</code>. Or: \"What is our match rate by persona?\" Group by persona_tag, count total vs enriched. These queries take seconds. In a CRM, you would be building custom reports and waiting.",
      },
    ],
  },

  /* ================================================================== */
  /*  REFERENCE                                                           */
  /* ================================================================== */

  {
    id: 'api-quick-reference',
    title: 'Apollo API Quick Reference',
    subtitle: 'Endpoints, env setup, common errors, and rate limits card',
    category: 'reference',
    description:
      'Quick reference for the Apollo API. All key endpoints, environment variable setup, common error codes, rate limits, and copy-pasteable Python snippets for people search and organization enrichment.',
    keywords: [
      'apollo api reference',
      'apollo api cheat sheet',
      'apollo python api',
      'apollo api errors',
      'apollo rate limits',
      'apollo api setup',
      'apollo api snippets',
    ],
    difficulty: 'beginner',
    related: [
      'api-architecture',
      'hacker-track',
      'supabase-warehouse',
    ],
    sections: [
      {
        heading: 'Environment Setup',
        type: 'code',
        content:
          "Add to your <code>.env</code> file: <code>APOLLO_API_KEY=your_key_here</code>. Get your key from Apollo Dashboard > Settings > API Keys. In Python: <code>import os; api_key = os.environ['APOLLO_API_KEY']</code>. Base URL for all endpoints: <code>https://api.apollo.io</code>. All requests are POST with JSON body. Include <code>api_key</code> in the request body, not as a header.",
      },
      {
        heading: 'Key Endpoints',
        type: 'code',
        content:
          "<strong>People Search:</strong> <code>POST /v1/mixed_people/search</code> - Search contacts by title, seniority, company, location, industry. Returns up to 100 results per page.<br/><br/><strong>Organization Enrichment:</strong> <code>POST /v1/organizations/enrich</code> - Enrich a company by domain. Returns firmographics, tech stack, funding, employee count.<br/><br/><strong>People Enrichment:</strong> <code>POST /v1/people/match</code> - Match a single person by name + company or email. Returns full contact record.<br/><br/><strong>Bulk People Match:</strong> <code>POST /v1/people/bulk_match</code> - Match up to 10 people per request. More efficient than individual calls.",
      },
      {
        heading: 'Rate Limits',
        type: 'pattern',
        content:
          "<strong>Free tier:</strong> 10,000 credits/month. 100 requests/minute. 1 credit per contact returned in search, 1 credit per enrichment call.<br/><br/><strong>Basic ($49/mo):</strong> 60,000 credits/month. Higher rate limits.<br/><br/><strong>Professional ($99/mo):</strong> 120,000 credits/month. Intent data, buying signals.<br/><br/>If you hit a rate limit, Apollo returns HTTP 429. Back off for 60 seconds and retry. In production, use a simple sleep-and-retry pattern with exponential backoff. Log every 429 so you can tune your batch sizes.",
      },
      {
        heading: 'Common Errors',
        type: 'anti-pattern',
        content:
          "<strong>401 Unauthorized:</strong> Bad API key. Check your .env file and make sure the key is not expired.<br/><br/><strong>422 Unprocessable Entity:</strong> Invalid request body. Usually a missing required field or wrong data type. Check that arrays are arrays, not strings.<br/><br/><strong>429 Too Many Requests:</strong> Rate limited. Wait 60 seconds and retry. If persistent, reduce batch size or add delays between requests.<br/><br/><strong>Empty results:</strong> Not an error - your filters are too narrow. Broaden seniority levels, add more title keywords, or expand the company size range. Apollo returns what matches, not what you expect.",
      },
    ],
  },
]
