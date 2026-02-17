/**
 * ShawnOS — Clay Wiki Data
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

/* ── types ─────────────────────────────────────────── */

export interface WikiSection {
  heading: string
  content: string // HTML-safe string with terminal styling
  type: 'prose' | 'pattern' | 'code' | 'anti-pattern' | 'pro-tip' | 'formula'
}

export type ClayWikiCategory =
  | 'core-concepts'
  | 'plays'
  | 'reference'
  | 'integrations'

export interface ClayWikiEntry {
  id: string // URL slug
  title: string
  subtitle: string // one-liner for cards
  category: ClayWikiCategory
  description: string // SEO meta description
  keywords: string[]
  sections: WikiSection[]
  related: string[] // other wiki entry IDs
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

/* ── category metadata ────────────────────────────── */

export const CLAY_WIKI_CATEGORIES: {
  id: ClayWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'core-concepts',
    label: 'Core Concepts',
    description: 'Mental models and architecture patterns for Clay',
    prompt: '$ cd ~/clay-wiki/core-concepts/',
  },
  {
    id: 'plays',
    label: 'Plays',
    description: 'Full workflow patterns and enrichment plays',
    prompt: '$ cd ~/clay-wiki/plays/',
  },
  {
    id: 'reference',
    label: 'Reference',
    description: 'Formulas, certification, troubleshooting, and quick-reference guides',
    prompt: '$ cd ~/clay-wiki/reference/',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'CRM, HTTP, and platform routing patterns',
    prompt: '$ cd ~/clay-wiki/integrations/',
  },
]

/* ── helpers ──────────────────────────────────────── */

export function getClayWikiEntry(slug: string): ClayWikiEntry | undefined {
  return CLAY_WIKI_ENTRIES.find((e) => e.id === slug)
}

/* ── wiki entries ─────────────────────────────────── */

export const CLAY_WIKI_ENTRIES: ClayWikiEntry[] = [
  /* ================================================================== */
  /*  CORE CONCEPTS                                                       */
  /* ================================================================== */

  {
    id: 'account-first-enrichment',
    title: 'Account-First Enrichment and Credit Efficiency',
    subtitle: 'Always split to an account table — this is THE pattern',
    category: 'core-concepts',
    description:
      'The account-first enrichment pattern in Clay — split contacts to an account table, dedupe by domain, enrich once, and write back via lookup. The foundational architecture for every Clay workflow.',
    keywords: [
      'clay account first',
      'clay enrichment pattern',
      'clay account table',
      'clay dedupe domain',
      'clay credit efficiency',
    ],
    difficulty: 'intermediate',
    related: [
      'data-storage-batching',
      'credit-system',
      'company-cards',
      'enterprise-guardrails',
    ],
    sections: [
      {
        heading: 'The Foundational Pattern',
        type: 'prose',
        content:
          "Account-first enrichment is the single most important architectural pattern in Clay. The concept is simple: never enrich company-level data on a contact table. Always split to an account table, deduplicate by domain, enrich at the account level, then write back to contacts via lookup columns. One row per company. Enrich once. Every contact at that company pulls the data through a lookup. This is THE pattern. Everything else builds on it.",
      },
      {
        heading: 'Why Account-First Saves Credits',
        type: 'pattern',
        content:
          "Without account-first: you import 500 contacts. 50 of them work at Microsoft. Your firmographic enrichment runs 50 times on Microsoft — same company, same data, 50x the credits. With account-first: you split to an account table, dedupe by domain, and now Microsoft is one row. Enrich once. The 50 contacts pull Microsoft's data through a lookup column. You just saved 49 enrichment calls on one company alone. Across a table of thousands, the savings compound. This is not an optimization — it's the baseline. If you're not doing this, you're burning money.",
      },
      {
        heading: 'The Split Pattern Step by Step',
        type: 'pattern',
        content:
          "1. Source contacts from whatever input — web reveal, CSV import, Apollo, LinkedIn Sales Navigator.\n2. Write contacts to a new table — the account table. Map the domain column.\n3. Deduplicate the account table by domain. One row per company.\n4. Enrich at the account level — firmographics, tech stack, ICP scoring, industry classification.\n5. Back on the contact table, add a lookup column that matches on domain.\n6. The lookup pulls company-level data (ICP score, industry, employee count, service fit) from the account table into the contact row.\n7. Run contact-level enrichment (single-provider email lookup, persona qualification) on the contact table only.\n\nThe account table is your research table. The contact table is your outreach table. They're connected by domain. That's the architecture.",
      },
      {
        heading: 'Domain Is the Universal Join Key',
        type: 'pro-tip',
        content:
          "Company names are messy. \"Acme Inc\", \"Acme, Inc.\", \"ACME\" — three strings for the same company. Domains are unique. acme.com is acme.com regardless of how the company name was entered. Always deduplicate on domain, not company name. Always join on domain, not company name. Domain is the universal key that connects accounts to contacts, Clay to your CRM, and your CRM to your outreach tools. Extract it early. Use it everywhere.",
      },
      {
        heading: 'When to Skip the Split',
        type: 'anti-pattern',
        content:
          "Almost never. The only time you can skip the account-contact split is when you have fewer than 50 contacts, all from different companies, and you need results in 10 minutes. That's a prototype, not a production workflow. For anything that will run repeatedly, anything over 100 contacts, or anything that will sync to a CRM — split. The upfront cost of creating two tables is 5 minutes. The cost of not splitting is wasted credits, duplicate CRM records, and an unscalable mess that you'll have to rebuild anyway.",
      },
    ],
  },

  {
    id: 'data-storage-batching',
    title: 'Data Storage, Batching, and Rate-Limit-Safe Enrichment',
    subtitle: 'Clay is orchestration, not storage — use Supabase for scale',
    category: 'core-concepts',
    description:
      'How to handle large datasets in Clay using batching, Supabase/Postgres for storage, and rate-limit-safe enrichment patterns. Clay is the orchestration layer, not the warehouse.',
    keywords: [
      'clay data storage',
      'clay batching',
      'clay supabase',
      'clay postgres',
      'clay rate limits',
      'clay large tables',
    ],
    difficulty: 'advanced',
    related: [
      'account-first-enrichment',
      'tam-list-building',
      'http-column',
      'enterprise-guardrails',
    ],
    sections: [
      {
        heading: 'Clay Is Orchestration, Not Storage',
        type: 'prose',
        content:
          "Clay is brilliant at enrichment, qualification, and routing. It is not a database. If your TAM is 50K+ accounts, don't try to keep everything in Clay tables. Clay slows down at scale. Row limits exist. The UI gets laggy. You lose the ability to query your data with SQL. The answer: connect Supabase or Postgres as your storage layer. Clay enriches and scores. Supabase stores. You get the best of both — Clay's enrichment engine with a real database's querying power.",
      },
      {
        heading: 'The Batch-and-Store Pattern',
        type: 'pattern',
        content:
          "For large TAMs (5,000+ accounts): (1) Load a batch of 1,000-5,000 accounts into Clay. (2) Run your full enrichment flow — firmographics, ICP scoring, tech stack, MX records. (3) Push enriched records to Supabase via HTTP column or webhook. (4) Clear the Clay table. (5) Load the next batch. (6) Repeat until done. (7) Query the full enriched TAM in Supabase.\n\nThis keeps your Clay table fast, avoids row limits, and gives you SQL-level querying over your entire dataset. The Clay table is a processing queue, not a warehouse.",
      },
      {
        heading: 'Rate-Limit-Safe Enrichment',
        type: 'pattern',
        content:
          "Every enrichment provider has rate limits. If you blast 5,000 rows through Apollo simultaneously, you'll get throttled. The safe approach: (1) Set Clay's run speed to match the provider's rate limit (check their docs). (2) Batch your runs — don't run enrichment on 5,000 rows at once. Run 500, wait, run 500 more. (3) Use Clay's built-in delay between rows when available. (4) For HTTP columns hitting external APIs, add explicit backoff logic. (5) Monitor the first 50 rows — if errors start appearing, you're being rate-limited. Slow down before you burn credits on failed requests.\n\nThe goal: steady throughput without triggering provider-side throttling. Patience beats speed when credits are on the line.",
      },
      {
        heading: 'Supabase Integration',
        type: 'pro-tip',
        content:
          "The simplest Supabase integration uses Clay's HTTP column to POST enriched rows to your Supabase REST API. Set up a Supabase table that mirrors your Clay columns. Add an HTTP column in Clay that fires on enrichment completion — when all data columns are populated, POST the row to Supabase. Include an upsert key (domain for accounts, email for contacts) so re-runs don't create duplicates.\n\nFor more advanced setups, use Supabase Edge Functions as middleware between Clay and your database. The edge function can validate data, handle conflicts, and trigger downstream workflows (Slack alerts, CRM syncs) that Clay can't.",
      },
      {
        heading: 'Batch Size Rules of Thumb',
        type: 'pattern',
        content:
          "Batch sizes depend on your enrichment complexity: Simple enrichment (1-2 providers, no AI): 5,000 rows per batch. Standard enrichment (waterfall + scoring): 1,000-2,000 rows per batch. Heavy enrichment (Claygent + HTTP columns + waterfall): 500 rows per batch. Enterprise accounts (deep enrichment + multiple personas): 200-500 rows per batch.\n\nSmaller batches = more control, easier debugging, less credit waste on errors. Larger batches = faster throughput but higher risk if something breaks. Start small, increase once you trust the flow.",
      },
      {
        heading: 'Anti-Pattern: Everything in One Table',
        type: 'anti-pattern',
        content:
          "Don't try to build your entire TAM in a single Clay table. I've seen people with 20,000-row tables that take 30 seconds to load, where enrichment columns time out because they're fighting for resources with 40 other columns. Split by phase: sourcing table → enrichment table → scoring table → output table. Or split by batch: batch 1 table, batch 2 table. Each table should be focused and fast. If your table has more than 5,000 rows or more than 30 columns, it's time to split.",
      },
    ],
  },

  {
    id: 'contact-sourcing',
    title: 'Contact Sourcing Best Practices',
    subtitle: 'Where contacts come from and how to source them without burning credits',
    category: 'core-concepts',
    description:
      'Contact sourcing best practices for Clay — Apollo vs Clay vs APIs, cross-referencing sources, sourcing for different company sizes, and the fundamental rule of sourcing accounts before contacts.',
    keywords: [
      'clay contact sourcing',
      'clay apollo',
      'clay linkedin sales navigator',
      'clay sourcing',
      'clay contact sources',
      'clay lead generation',
    ],
    difficulty: 'beginner',
    related: [
      'account-first-enrichment',
      'tam-list-building',
      'contact-cards',
      'credit-system',
    ],
    sections: [
      {
        heading: 'The Sourcing Hierarchy',
        type: 'prose',
        content:
          "Contact sourcing is where your pipeline starts. Bad sourcing = bad pipeline, no matter how good your enrichment is. The hierarchy: your own CRM data first (always), then LinkedIn Sales Navigator for targeted account-level search, then Apollo or ZoomInfo for bulk firmographic-filtered exports, then industry databases for niche verticals, then Apify for scraping when standard sources don't cover your market. Every source has strengths and blind spots. Cross-reference at least two for any list over 1,000 accounts.",
      },
      {
        heading: 'Apollo vs Clay Native vs APIs',
        type: 'pattern',
        content:
          "Apollo: best for bulk export with firmographic filters. Strong US tech coverage. Weaker on European and SMB markets. Good for building initial contact lists that you'll enrich further in Clay.\n\nClay native sourcing: use Clay's built-in people search when you need to source contacts at specific companies already in your account table. It's context-aware — you give it a domain, it finds people.\n\nDirect APIs (via HTTP column): use when you need data that no built-in integration provides. LeadMagic for European email coverage, Prospeo for validation, custom endpoints for niche databases.\n\nThe rule: start with the cheapest option that gives you acceptable coverage. Apollo's bulk export is often free or low-cost. Clay native sourcing uses credits. APIs have their own pricing. Layer them based on what the cheaper option misses.",
      },
      {
        heading: 'Source Accounts First, Then Contacts',
        type: 'pattern',
        content:
          "Never start by sourcing contacts. Start by identifying accounts. Build your account table first — qualified companies that fit ICP. Then source contacts at those companies. This prevents you from importing 5,000 contacts at companies you'll never sell to.\n\nThe flow: Define ICP → Source companies → Qualify companies → Source contacts at qualified companies → Qualify contacts by persona → Route to outreach.\n\nEvery step narrows the funnel. You might start with 10,000 potential companies, qualify 2,000, and source 4-6 contacts per company. That's 8,000-12,000 contacts, all at companies you've already confirmed fit ICP. That's a clean pipeline.",
      },
      {
        heading: 'Apify for Non-Standard Markets',
        type: 'pro-tip',
        content:
          "When Apollo and LinkedIn don't cover your market, Apify is the answer. Job scraping from Indeed tells you which companies are hiring for specific roles — if they're hiring SDRs, they have an outbound motion. Instagram scraping surfaces SMBs that don't appear in enterprise databases. Yelp scraping maps local businesses by category, review count, and location.\n\nApify isn't a default tool. It's the tool you reach for when standard sources return thin results. For franchise TAMs, restaurant groups, local service businesses — Apify is often the only way to build a complete universe.",
      },
      {
        heading: 'Cross-Referencing Sources',
        type: 'pattern',
        content:
          "Every provider has blind spots. Apollo misses certain industries. LinkedIn has company-size minimums. ZoomInfo skews enterprise. The fix: cross-reference at least two sources for any TAM over 1,000 accounts. Import from source A. Import from source B. Deduplicate by domain. Compare coverage — which companies appear in both? Which only appear in one? The ones that appear in both are high-confidence. The ones in only one source need validation.\n\nCross-referencing also catches data quality issues. If Apollo says a company has 500 employees and ZoomInfo says 50, something is wrong. Investigate before you enrich.",
      },
      {
        heading: 'Common Mistakes',
        type: 'anti-pattern',
        content:
          "Sourcing contacts before qualifying accounts. You end up with thousands of contacts at companies that don't fit ICP, wasting enrichment credits and campaign slots on people who will never buy.\n\nAnother mistake: trusting a single source. Every database has stale records, missing companies, and wrong data. If your entire TAM comes from one Apollo export, you're building on a shaky foundation. Cross-reference.\n\nRelying on Clay's sourcing for everything. Clay is excellent at enrichment, but it's not a sourcing database. Use Apollo, LinkedIn, and industry databases to source. Use Clay to enrich. Different tools for different jobs.",
      },
    ],
  },

  {
    id: 'claygent-prompts',
    title: 'AI and Claygent Prompt Engineering',
    subtitle: 'Get Claygent to stop hallucinating and start producing usable data',
    category: 'core-concepts',
    description:
      'Claygent prompt engineering guide — model selection, validation patterns, structured output, and how to prevent hallucinations in Clay AI columns.',
    keywords: [
      'claygent prompts',
      'clay ai',
      'claygent hallucination',
      'clay prompt engineering',
      'clay ai column',
      'claygent tips',
    ],
    difficulty: 'intermediate',
    related: [
      'formulas',
      'sculptor-guide',
      'credit-system',
      'troubleshooting',
    ],
    sections: [
      {
        heading: 'What Claygent Actually Is',
        type: 'prose',
        content:
          "Claygent is Clay's AI browsing agent. You give it a prompt and input fields, and it browses the web, reads pages, and returns structured data. It's not a static knowledge lookup — it actively visits URLs, reads content, and extracts information. This makes it powerful for research tasks (\"go to this company's website and find their pricing model\") but also means it can hallucinate, time out, and fail in ways that static enrichment doesn't.",
      },
      {
        heading: 'The Validation System',
        type: 'pattern',
        content:
          "Never trust Claygent output without validation. The pattern: (1) Run Claygent on a 5-row sample first. (2) Manually verify every field against the source — did it actually find this on the website, or did it make it up? (3) If it hallucinates on 1 out of 5, it'll hallucinate on 100 out of 500. Fix the prompt before scaling. (4) Add a confidence field to your output schema — force Claygent to self-report confidence (high/medium/low). (5) Filter downstream enrichment to only run on high-confidence results.\n\nThe 5-row test is non-negotiable. I've seen people run Claygent on 2,000 rows, find out later that 30% of the data was fabricated, and have to redo everything. Five rows. Verify manually. Then scale.",
      },
      {
        heading: 'Prompt Structure That Works',
        type: 'pattern',
        content:
          "Every Claygent prompt should follow this structure:\n\n1. Role context — \"You are a B2B research analyst tasked with...\"\n2. Specific task — exactly what to find, from where (be specific: \"/about page\", \"/pricing page\", not just \"the website\")\n3. Input fields — listed at the bottom of the prompt, wrapped in curly braces\n4. Output schema — exact JSON structure you expect back\n5. Constraints — \"Return ONLY valid JSON. No explanations. If you cannot find the information, return null for that field.\"\n6. Edge case handling — what to return when data is missing, ambiguous, or contradictory\n\nThe more specific your prompt, the less Claygent improvises. Improvisation is where hallucinations happen.",
      },
      {
        heading: 'Model Selection Framework',
        type: 'pro-tip',
        content:
          "Clay offers different AI models. The choice matters: GPT-4 — most capable, highest accuracy, highest credit cost. Use for complex research prompts that require reasoning (ICP qualification, competitor analysis). GPT-3.5 — faster, cheaper, less accurate. Good for simple extraction tasks (\"pull the company's employee count from their LinkedIn page\"). Claude — strong at structured output and following formatting instructions. Good when you need reliable JSON schema compliance.\n\nMatch the model to the task. Don't use GPT-4 credits on a task that GPT-3.5 handles fine. Don't use GPT-3.5 on a task that requires nuanced reasoning. The credit difference is 3-5x.",
      },
      {
        heading: 'Preventing Hallucinations',
        type: 'anti-pattern',
        content:
          "Claygent hallucinates most when: (1) The prompt is vague — \"tell me about this company\" invites fabrication. Be specific about what fields to extract and from which pages. (2) The target page doesn't exist — if you tell it to check /pricing and there is no pricing page, it'll guess. Add fallback logic: \"If the page returns a 404 or the information is not found, return null.\" (3) The page is too large — token limits cause truncation, and Claygent fills in the gaps with imagination. Target specific pages, not entire sites. Use FireCrawl to get clean markdown first if needed. (4) No output schema — without a defined JSON schema, Claygent returns prose that's hard to parse and easy to embellish. Always define the exact output structure.",
      },
      {
        heading: 'When to Use Claygent vs Formulas vs HTTP',
        type: 'pattern',
        content:
          "Claygent: use when you need to browse a web page and extract unstructured information. Research, positioning analysis, product categorization from website content.\n\nFormulas: use when you can transform data you already have. Name merging, title normalization, MX classification, scoring bins. Zero credits. Instant. No hallucination risk.\n\nHTTP columns: use when you need structured API data. MX records, DNS lookups, time APIs, SemRush data, custom endpoints. Reliable, structured, no AI interpretation.\n\nThe priority order: formula first (free, reliable) → HTTP column (structured, low-cost) → Claygent (powerful but expensive and fragile). Only reach for Claygent when the first two can't do the job.",
      },
    ],
  },

  {
    id: 'credit-system',
    title: 'Understanding the Credit System',
    subtitle: 'If time spent avoiding credits exceeds the credit cost, use the credits',
    category: 'core-concepts',
    description:
      'How Clay credits work — provider costs, single-provider vs waterfall economics, the API vs native tradeoff, and the practitioner philosophy on when to spend credits vs optimize with direct APIs.',
    keywords: [
      'clay credits',
      'clay credit system',
      'clay credit cost',
      'clay pricing',
      'clay single provider credits',
      'clay api vs native',
    ],
    difficulty: 'beginner',
    related: [
      'account-first-enrichment',
      'formulas',
      'http-column',
      'troubleshooting',
    ],
    sections: [
      {
        heading: 'How Credits Work',
        type: 'prose',
        content:
          "Clay credits are consumed when you use enrichment providers, AI columns (Claygent), and certain native integrations. Each provider costs a different number of credits per row. Simple enrichments (Apollo person search) cost 1-2 credits. Heavy enrichments (Claygent web research) cost 3-10 credits depending on the model and complexity. Formulas cost zero credits. HTTP columns cost 1 credit for the column execution plus whatever the external API charges.\n\nCredits are the unit of cost in Clay. Every architectural decision — waterfall depth, table structure, enrichment order — either saves or wastes credits. Understanding the credit system is understanding the economics of your pipeline.",
      },
      {
        heading: 'The Practitioner Philosophy',
        type: 'pro-tip',
        content:
          "If the time spent avoiding credits exceeds the credit cost, use the credits. This is my core principle. I've watched people spend 3 hours trying to avoid a $5 enrichment run. That's not efficiency — that's false economy. Use credits to prove and test your workflow. Get the flow working. Validate the output. Confirm the pipeline produces qualified leads. Then optimize.\n\nOptimization means: replace native integrations with direct API calls where the API is cheaper. Replace AI columns with formulas where the transformation is deterministic. Replace waterfall providers with single-provider calls where coverage is adequate. But you can't optimize what you haven't built yet. Build first. Optimize second.",
      },
      {
        heading: 'Single-Provider vs Waterfall Economics',
        type: 'pattern',
        content:
          "I used to run a 6-provider email waterfall (Apollo → Hunter → Clearbit → RocketReach → Prospeo → Dropcontact). Best case: 1-2 credits. Worst case: all 6 providers run — 8-12 credits per contact. Then I added MX-based routing and realized the waterfall logic made no sense. I was burning credits chasing marginal coverage gains on emails that bounced anyway once routing kicked in.\n\nMy philosophy now: skip the waterfall entirely. Go single-provider — Prospeo or LeadMagic. Check MX records instead of stacking validation providers. Qualify persona before running the email lookup — if the title doesn't match a buyer tier, don't look for their email at all. Single-provider + MX routing gets the same deliverability at a fraction of the cost. The waterfall is a concept worth understanding, but I don't recommend using one.",
      },
      {
        heading: 'API vs Native Credit Costs',
        type: 'pattern',
        content:
          "Many enrichment providers offer both a Clay native integration (costs Clay credits) and a direct API (costs API credits billed separately by the provider). The math often favors the API at scale:\n\nNative Apollo in Clay: ~2 credits per enrichment. Apollo API via HTTP column: 1 Clay credit for the HTTP call + Apollo API pricing (often cheaper per call at volume).\n\nThe break-even depends on your volume and your Clay plan. At low volume (<1,000 enrichments/month), native is simpler and the cost difference is negligible. At high volume (10,000+), the API route saves significantly. But the API route requires setup — HTTP column configuration, JSON parsing, error handling. That's the tradeoff: simplicity (native) vs. cost efficiency (API).",
      },
      {
        heading: 'Where Credits Get Wasted',
        type: 'anti-pattern',
        content:
          "The biggest credit drains I see: (1) Enriching company data on a contact table instead of an account table — 50x credit waste on large accounts. (2) Running email lookups on contacts who don't match any persona tier — you're paying to find emails for people you'll never contact. (3) Running Claygent on tasks a formula could handle — name merging, title normalization, domain extraction. (4) Re-enriching contacts that already have data — always add a condition: only enrich if the target column is empty. (5) Not deduplicating before enrichment — you're enriching the same company or contact multiple times.\n\nFix the architecture and you fix the credit waste. Most credit problems are architecture problems.",
      },
      {
        heading: 'The Free Tier Toolkit',
        type: 'pro-tip',
        content:
          "These Clay features cost zero credits and should be your first line of defense: Formulas — natural language transformations, merging, classifying, scoring bins. Lookup columns — pulling data from other tables without re-enriching. Filter conditions — preventing enrichment columns from running on rows that already have data or don't qualify. Sculptor — quick table queries and deduplication (low or zero credit). Manual column edits — sometimes a human scan is faster than an AI column for 50 rows.\n\nMaximize free features before spending credits. Every formula that replaces an AI column saves 2-10 credits per row across your entire table.",
      },
    ],
  },

  {
    id: 'scoring-logic',
    title: 'Building Scoring Systems in Clay',
    subtitle: '5 points per data point. Close-won data is the model. Score must read at a glance.',
    category: 'core-concepts',
    description:
      'How to build scoring systems in Clay — 5 points per data point, using close-won data as the model, the scoring integration vs formulas, and making scores self-explanatory at a glance.',
    keywords: [
      'clay scoring',
      'clay icp score',
      'clay lead scoring',
      'clay scoring system',
      'clay qualification score',
      'clay scoring integration',
    ],
    difficulty: 'intermediate',
    related: [
      'closed-won-enrichment',
      'company-cards',
      'formulas',
      'credit-system',
    ],
    sections: [
      {
        heading: 'The Scoring Philosophy',
        type: 'prose',
        content:
          "A scoring system converts raw data into a decision. Should you contact this company? Is this person worth spending credits on? Should this lead go to the sales team or the nurture queue? The score answers all of these questions with a single number. But only if it's built correctly. A bad scoring system is worse than no scoring system — it gives false confidence. A good scoring system makes the right decision obvious at a glance.",
      },
      {
        heading: '5 Points Per Data Point',
        type: 'pattern',
        content:
          "The default weighting: 5 points per signal. If 80% of your closed-won accounts have 500+ employees, that's a strong signal — 5 points. If 90% are in SaaS or FinTech, that's 5 points. If 60% use Salesforce, that's a weaker signal — 3 points. If 40% are in New York, that's a weak signal — 2 points.\n\nThe weighting comes from your data, not from theory. Don't sit in a room and decide that industry is worth more than employee count. Look at your closed-won accounts and let the patterns dictate the weights. The close-won data IS the scoring model.",
      },
      {
        heading: 'Close-Won Data as the Model',
        type: 'pattern',
        content:
          "Most teams build scoring models from assumptions. \"We think mid-market SaaS companies are our best fit.\" Maybe. But do you know? Pull your closed-won accounts. Enrich them. Look at the data. What industries actually closed? What employee counts? What tech stacks? What geographies?\n\nThe patterns in your closed-won data are more accurate than any theory because they're based on reality — these companies actually bought. Build your scoring model from those patterns. Update it quarterly as new deals close. The model evolves with your business.",
      },
      {
        heading: 'Use the Scoring Integration, Not Formulas',
        type: 'pro-tip',
        content:
          "Clay has a scoring integration that produces clean, auditable output. Use it instead of building scoring formulas. Here's why: (1) The scoring integration shows the breakdown — which signals contributed how many points. Sales reps can see exactly why a lead scored 8 instead of 5. (2) Formulas are opaque — a formula that returns \"8\" doesn't explain itself. The rep has to reverse-engineer the logic. (3) The scoring integration handles edge cases (missing data, partial matches) more gracefully than a formula chain.\n\nThe score must be self-explanatory at a glance. If someone looks at a score of 8 and can't immediately understand why, the scoring system is broken. The integration solves this by showing the work.",
      },
      {
        heading: 'Scoring Thresholds',
        type: 'pattern',
        content:
          "After calculating the total score, bin it into actionable tiers:\n\n• 8-10: Tier 1 — High Priority. Route to outreach immediately. These accounts match your closed-won profile closely.\n• 6-7: Tier 2 — Qualified. Route to outreach with standard priority. Good fit with some missing signals.\n• 4-5: Tier 3 — Nurture. Don't contact now. Add to nurture sequences or park for re-evaluation next quarter.\n• Below 4: Tier 4 — Disqualify. Don't contact. Don't enrich further. Save your credits.\n\nThe thresholds should map to actions. If Tier 2 and Tier 3 get the same treatment, you don't have four tiers — you have three. Every tier should trigger a different downstream behavior.",
      },
      {
        heading: 'Primary Gate',
        type: 'pattern',
        content:
          "Every scoring system needs a primary gate — one signal that must be present for qualification regardless of total score. For an Atlassian partner, the primary gate is Atlassian footprint. A company could score 9/10 on every other signal, but if they don't use Atlassian products, they're not a fit.\n\nThe primary gate prevents false positives. Without it, a company with perfect firmographics but zero product relevance could score highly. The gate catches that. Implement it as a separate check: if primary gate fails, the score is automatically 0 regardless of other signals.",
      },
      {
        heading: 'Common Mistakes',
        type: 'anti-pattern',
        content:
          "Building a scoring model without closed-won data. You're guessing. Look at your actual customers before deciding what signals matter.\n\nUsing formulas instead of the scoring integration. The formula returns a number with no explanation. The integration returns a number with a full breakdown. Always choose transparency.\n\nMaking the score too complex. If you have 15 signals each weighted differently with conditional logic, no one will understand the output. Keep it to 5-8 signals maximum. Simplicity scales. Complexity breaks.\n\nNever recalibrating. Your ICP shifts. Your product evolves. Your market changes. Re-run closed-won enrichment quarterly and update the scoring model. A stale scoring model actively misdirects your pipeline.",
      },
    ],
  },

  /* ================================================================== */
  /*  PLAYS                                                               */
  /* ================================================================== */

  {
    id: 'on-demand-enrichment',
    title: 'On-Demand Contact Enrichment',
    subtitle: 'The practitioner core play — enrich contacts as they arrive',
    category: 'plays',
    description:
      'The on-demand enrichment play for Clay — trigger enrichment when contacts arrive, single-provider email lookup, MX validation, and route. A practitioner core workflow.',
    keywords: [
      'clay on demand',
      'clay enrichment play',
      'clay contact enrichment',
      'clay single provider',
      'clay practitioner',
    ],
    difficulty: 'intermediate',
    related: [
      'contact-sourcing',
      'credit-system',
      'clay-to-platforms',
      'crm-lookup-first',
    ],
    sections: [
      {
        heading: 'What This Play Does',
        type: 'prose',
        content:
          "On-demand enrichment is the reactive counterpart to TAM list building. Instead of building a universe upfront, you enrich contacts as they arrive — from web reveals, form fills, CRM imports, or manual adds. A contact lands in the table. Clay enriches it. By the time a human looks at it, the record is complete: email validated, persona qualified, company scored, routing decided. This is the workflow that runs 24/7 in every production Clay setup I manage.",
      },
      {
        heading: 'When to Use It',
        type: 'prose',
        content:
          "Use on-demand enrichment when contacts arrive in real-time or near-real-time. Web reveal fires and a company is identified — enrich the contacts at that company immediately. A sales rep manually adds a prospect to HubSpot — Clay picks it up and fills in the gaps. A form submission comes in — enrichment runs before the lead hits the queue. The trigger varies. The enrichment flow is the same.",
      },
      {
        heading: 'Single-Provider Email Enrichment',
        type: 'pattern',
        content:
          "I used to run a 6-provider email waterfall — Apollo, Hunter, Clearbit, RocketReach, Prospeo, Dropcontact. I stopped. Once I layered in MX-based routing (Google → Instantly, non-Google → HeyReach), the waterfall logic made no sense. I was burning 8-12 credits per contact for marginal coverage gains on emails that bounced anyway.\n\nNow every on-demand table runs a single email provider — Prospeo or LeadMagic. One provider finds the email. MX record check validates the domain. Routing formula decides: Google → Instantly, non-Google → HeyReach, no email → HeyReach for LinkedIn. Simpler. Cheaper. Same deliverability. Don't stack providers — pick one good one and validate with MX records instead.",
      },
      {
        heading: 'Table Architecture',
        type: 'pattern',
        content:
          "The on-demand table is a contact table, not an account table. But it should always have a lookup column that connects back to your account table (if you have one). When a new contact arrives:\n\n1. CRM lookup runs (does this person already exist in HubSpot/Salesforce?)\n2. If CRM match → skip enrichment, flag as existing\n3. Persona qualification prompt runs (match title to tier)\n4. If persona NOT_MATCHED → skip email lookup, save credits\n5. Single-provider email lookup runs (Prospeo or LeadMagic)\n6. Company lookup runs (pull account-level data — ICP score, industry, employee count)\n7. MX record check runs (Google vs non-Google)\n8. Routing formula runs (Instantly vs HeyReach vs skip)\n\nAll steps trigger automatically when a new row is added. No manual work. The contact arrives incomplete and leaves the table fully enriched and routed.",
      },
      {
        heading: 'Credit Efficiency',
        type: 'pro-tip',
        content:
          "On-demand enrichment uses more credits per contact than batch enrichment because every contact gets enriched immediately. That is fine. If the contact came from a web reveal or form fill, they have active intent. Spending 2-4 credits to fully enrich an intent signal is always worth it. If time spent avoiding credits exceeds the credit cost, use the credits. Where you save credits: the persona qualification prompt should run before the email lookup. If the persona does not match (wrong title, wrong department), skip the lookup entirely. Do not waste credits finding an email for someone you will never contact. Single-provider is cheaper than a waterfall and gets the same result once MX routing is in play.",
      },
      {
        heading: 'Common Mistakes',
        type: 'anti-pattern',
        content:
          "Running on-demand enrichment without a CRM lookup first. Before any enrichment runs, check if this contact already exists in HubSpot or Salesforce. If they do, pull their existing data instead of re-enriching. Sending leads already in pipeline is the fastest way to lose trust with a partner or sales team. The CRM lookup column should be the first thing that fires — before the email lookup, before persona qual, before anything.\n\nAnother mistake: enriching every contact equally. If the persona doesn't match your buyer tiers, don't run the email lookup. Qualify the person before you spend credits finding their email.",
      },
    ],
  },

  {
    id: 'company-cards',
    title: 'Prospecting Company Cards',
    subtitle: 'Build company-level research cards for ICP qualification',
    category: 'plays',
    description:
      'The company cards play — build enriched company profiles for ICP qualification using firmographic data, tech stack signals, and AI research prompts in Clay.',
    keywords: [
      'clay company cards',
      'clay prospecting',
      'clay icp',
      'clay company enrichment',
      'clay firmographics',
    ],
    difficulty: 'beginner',
    related: [
      'contact-cards',
      'scoring-logic',
      'account-first-enrichment',
      'closed-won-enrichment',
    ],
    sections: [
      {
        heading: 'What This Play Does',
        type: 'prose',
        content:
          "Company cards are enriched company-level profiles built in Clay for ICP qualification. You start with a list of domains or company names. Clay enriches each one with firmographic data — employee count, revenue, industry, tech stack, location, funding. Then a qualification prompt scores each company against your ICP criteria. The output is a table of company cards: scored, qualified, and ready for contact sourcing. This is the first step in any account-first workflow.",
      },
      {
        heading: 'The Account Table Pattern',
        type: 'pattern',
        content:
          "Company cards live on an account table — never on a contact table. This is fundamental. The account table is deduplicated by domain. One row per company. Every enrichment that touches company-level data happens here: firmographics, tech stack, ICP scoring, industry classification, competitor analysis.\n\nOnce the account table is built and scored, you source contacts from qualified accounts into a separate contact table. The contact table looks up the account table for company-level data. This split is THE pattern. Never enrich accounts on a contact table. You'll burn credits enriching Microsoft's firmographics 50 times — once for every contact — instead of once on the account table with a lookup.",
      },
      {
        heading: 'What Goes on a Company Card',
        type: 'pattern',
        content:
          "Every company card should have these columns:\n\n• Domain (primary key — dedupe on this)\n• Company name\n• Employee count\n• Revenue (if available)\n• Industry / vertical\n• Tech stack (from BuiltWith, Wappalyzer, or Clay enrichment)\n• HQ location / geography\n• ICP score (0-10 from qualification prompt)\n• ICP reasoning (1-2 sentence explanation)\n• Service fit (which product/service line maps to this company)\n• Confidence (High / Medium / Low)\n• Next step (enrich contacts / validate / skip / flag for review)\n\nThe ICP score and reasoning are the most important columns. They turn raw firmographic data into an actionable qualification decision.",
      },
      {
        heading: 'ICP Qualification Prompt',
        type: 'pattern',
        content:
          "The company qualification prompt is the brain of the card. It takes all the firmographic inputs and outputs a score, reasoning, and next step. Structure:\n\n1. Role context — \"You are a B2B sales qualification analyst for [Partner Name]\"\n2. Qualification criteria — numbered list from the partner's ICP definition\n3. Scoring table — points per signal, with a PRIMARY GATE identified\n4. Thresholds — QUALIFIED (8+), NEEDS_RESEARCH (5-7), NOT_QUALIFIED (<5)\n5. Output — JSON array with company_qualified, score, service_fit, confidence, reasoning, next_step\n6. Input fields — at the bottom, always\n\nThe primary gate is the one signal that must be present for qualification. For an Atlassian partner, it's Atlassian footprint. For a property management company, it's portfolio size. No primary gate, no qualification — regardless of other scores.",
      },
      {
        heading: 'Scoring Rules',
        type: 'pro-tip',
        content:
          "5 points per data point is the default. Use close-won data as your scoring model — look at your best customers and reverse-engineer what made them a fit. The score must be self-explanatory at a glance. If someone looks at a score of 8 and can't immediately understand why, the scoring system is broken. Use Clay's scoring integration, not formulas, for handoff readability. The scoring integration produces clean, auditable output that sales teams can actually read.",
      },
      {
        heading: 'Competitor Intelligence Layer',
        type: 'pro-tip',
        content:
          "For advanced company cards, add a competitor analysis layer. Use the SemRush integration to pull competitor domains — who's outranking this company in search? Then use FireCrawl API for deep site analysis — what's their positioning, what are they selling, where are the gaps? This turns a company card from \"does this company fit ICP?\" into \"does this company fit ICP and here's the specific angle to pitch them.\" Competitor intelligence is the difference between generic outreach and outreach that makes the prospect think \"how did you know?\"",
      },
    ],
  },

  {
    id: 'contact-cards',
    title: 'Prospecting Contact Cards',
    subtitle: 'Build contact-level profiles with persona qualification',
    category: 'plays',
    description:
      'The contact cards play — enrich contact records with titles, personas, LinkedIn data, and qualification scores. Maps to company cards for full prospecting coverage.',
    keywords: [
      'clay contact cards',
      'clay persona',
      'clay contact enrichment',
      'clay linkedin',
      'clay prospecting',
    ],
    difficulty: 'beginner',
    related: [
      'company-cards',
      'on-demand-enrichment',
      'claygent-prompts',
      'clay-to-platforms',
    ],
    sections: [
      {
        heading: 'What This Play Does',
        type: 'prose',
        content:
          "Contact cards are enriched contact-level profiles built in Clay for persona qualification and outreach routing. Where company cards answer \"is this company a fit?\", contact cards answer \"is this person the right one to talk to?\" You source contacts from qualified accounts, enrich each one with title, department, LinkedIn data, and persona tier, then route them to the right platform for outreach.",
      },
      {
        heading: 'Relationship to Company Cards',
        type: 'pattern',
        content:
          "Contact cards always sit on a separate table from company cards. The contact table sources people from qualified accounts on the company table. Every contact row has a lookup column pointing back to the account table — pulling in ICP score, service fit, industry, and any company-level research. This is the account-contact split pattern. Never enrich both levels on the same table.\n\nThe flow: Company cards → qualify accounts → source contacts from qualified accounts → contact cards → qualify personas → route to outreach.",
      },
      {
        heading: 'What Goes on a Contact Card',
        type: 'pattern',
        content:
          "Every contact card should have these columns:\n\n• Email (from single-provider lookup — Prospeo or LeadMagic)\n• First name / Last name\n• Job title\n• Department\n• Seniority level\n• LinkedIn profile URL\n• Persona tier (1-5 from qualification prompt)\n• Outreach priority (primary / secondary / champion / not_target)\n• Company domain (lookup key to account table)\n• ICP score (pulled from account table via lookup)\n• MX provider (Google / Microsoft / Other — from HTTP column)\n• Route (Instantly / HeyReach / skip)\n• Personalization variables (icebreaker, pain point — from research prompt)",
      },
      {
        heading: 'Persona Qualification Prompt',
        type: 'pattern',
        content:
          "The persona qualification prompt maps job titles to buyer tiers. Every partner has 3-7 persona tiers defined:\n\n• Tier 1 — Economic Buyer (C-Suite, SVP). Primary outreach priority.\n• Tier 2 — Technical Decision Maker (VP, Director). Primary outreach priority.\n• Tier 3 — Influencer / Champion (Manager, Senior IC). Secondary priority.\n• Tier 4 — Operational (Specialist, Analyst). Low priority or skip.\n• Tier 5 — Edge cases (varies by partner).\n\nThe prompt takes a job title and outputs: persona_qualified (MATCHED / NOT_MATCHED), tier, tier_name, outreach_priority, and reasoning. A clean persona qualification prompt eliminates 40-60% of contacts before you spend credits on email lookup and personalization research.",
      },
      {
        heading: 'Single-Provider Email Lookup on Contact Cards',
        type: 'pro-tip',
        content:
          "After persona qualification, run the email lookup only on MATCHED personas. Use one provider — Prospeo or LeadMagic. Don't stack a 6-provider waterfall. I used to run Apollo → Hunter → Clearbit → RocketReach → Prospeo → Dropcontact. I stopped because the routing logic made the waterfall pointless.\n\nHere's why: once you check MX records and route Google → Instantly, non-Google → HeyReach, the marginal coverage from extra providers doesn't matter. You're burning credits chasing emails that bounce anyway when the MX doesn't match your sending infrastructure. One provider + MX check = same deliverability at a fraction of the cost. MX records tell you more about deliverability than any validation tool.",
      },
      {
        heading: 'Common Mistakes',
        type: 'anti-pattern',
        content:
          "Running persona qualification after the email lookup. Flip the order. Qualify the persona first. If the title doesn't match any tier, don't waste credits finding their email. You'll never contact them anyway.\n\nAnother mistake: sourcing contacts without checking the CRM first. Before any contact enrichment, run a CRM lookup. If this person is already in HubSpot with an active deal, don't re-enrich and don't add them to a cold outreach sequence. Sending leads already in pipeline is the fastest way to lose trust.",
      },
    ],
  },

  {
    id: 'tam-list-building',
    title: 'TAM List Building',
    subtitle: 'Build your total addressable market list — the practitioner core play',
    category: 'plays',
    description:
      'Build TAM (total addressable market) lists in Clay using account-first methodology, Supabase for scale, Apify for scraping, and the write-to-table pattern.',
    keywords: [
      'clay tam',
      'clay list building',
      'clay total addressable market',
      'clay apify',
      'clay scraping',
    ],
    difficulty: 'advanced',
    related: [
      'data-storage-batching',
      'account-first-enrichment',
      'enterprise-guardrails',
      'company-cards',
    ],
    sections: [
      {
        heading: 'What This Play Does',
        type: 'prose',
        content:
          "TAM list building is the process of mapping your entire total addressable market in Clay. Not a \"target account list\" of 200 companies. The full universe. Every company that could theoretically be a customer. Then you filter, score, and tier that universe down to a prioritized list. This is a practitioner core play — it's the foundation that every other workflow builds on. If your TAM is wrong, everything downstream is wrong.",
      },
      {
        heading: 'The Write-to-Table Pattern',
        type: 'pattern',
        content:
          "TAM building follows the write-to-table pattern. This is fundamental Clay architecture:\n\n1. Source contacts from LinkedIn Sales Navigator, Apollo, ZoomInfo, or industry databases\n2. Write them to a new table for accounts — the account table\n3. Deduplicate by domain (one row per company)\n4. Use the account table as your research table\n5. Enrich and score at the account level\n6. Source contacts from qualified accounts into a separate contact table\n\nThe key insight: you source contacts, but you build accounts. Contacts are the input. Accounts are the unit of analysis. The write-to-table pattern converts a messy list of people into a clean list of companies.",
      },
      {
        heading: 'Data Sources for TAM',
        type: 'pattern',
        content:
          "Different TAMs require different sources:\n\n• LinkedIn Sales Navigator — best for company search by revenue, industry, geography, employee count. The standard starting point.\n• Apollo / ZoomInfo — firmographic filters at scale. Good for export and import into Clay.\n• Industry databases — NRF member lists, franchise directories, SEC filings for public companies. High signal for niche TAMs.\n• Apify — job scraping (Indeed, LinkedIn), Instagram scraping, Yelp scraping for SMB TAMs. When you need data that no enrichment provider has, scrape it.\n• Clay enrichment — batch processing to fill gaps. Use after initial sourcing to add tech stack, revenue, employee count.\n\nThe biggest mistake: relying on one source. Every provider has blind spots. Cross-reference at least two sources for any TAM over 1,000 accounts.",
      },
      {
        heading: 'Supabase for Big TAMs',
        type: 'pro-tip',
        content:
          "Clay is orchestration, not storage. If your TAM is 50K+ accounts, don't try to keep everything in Clay tables. Connect Supabase or Postgres as your storage layer. Clay enriches and scores. Supabase stores. The workflow:\n\n1. Source raw accounts into Clay (in batches of 1,000-5,000)\n2. Enrich and score in Clay\n3. Write enriched records to Supabase via HTTP column or native integration\n4. Clear the Clay table, load next batch\n5. Query Supabase for the full enriched TAM\n\nThis approach keeps your Clay table fast, avoids row limits, and gives you SQL-level querying over your entire TAM.",
      },
      {
        heading: 'TAM Phasing',
        type: 'pattern',
        content:
          "Building a TAM is not one step. It's four phases:\n\nPhase 1: Universe Build — source every possible company from every available database. Cast the widest net. Don't filter yet.\n\nPhase 2: Validation — run your primary gate against the full universe. For an IT services company, it might be \"100+ physical locations.\" For an Atlassian partner, it might be \"confirmed Atlassian footprint.\" The primary gate eliminates 60-80% of the universe.\n\nPhase 3: Enrichment and Scoring — for validated accounts, add firmographic depth, check intent signals, map competitive landscape. Score by signal density, not just firmographics.\n\nPhase 4: TAL Build — segment the validated TAM into Target Account List tiers. Tier A = high-intent signals + primary gate. Tier B = primary gate, no active signals. Tier C = qualified but lower priority.",
      },
      {
        heading: 'Apify for Niche Sourcing',
        type: 'pro-tip',
        content:
          "When standard enrichment providers don't cover your vertical, use Apify. Job scraping from Indeed and LinkedIn tells you which companies are hiring for specific roles (SDRs, engineers, franchise operators). Instagram scraping surfaces SMBs that don't appear in enterprise databases. Yelp scraping maps local businesses by category and review count.\n\nApify isn't a default tool. It's the tool you reach for when Apollo and ZoomInfo return thin results. For SMB TAMs especially, Apify is often the only way to build a complete universe.",
      },
      {
        heading: 'Anti-Pattern: TAM Without Deduplication',
        type: 'anti-pattern',
        content:
          "If you source from multiple databases (Apollo + ZoomInfo + LinkedIn), you will have duplicates. Guaranteed. The same company appears as \"Acme Inc\" in one source and \"Acme, Inc.\" in another and \"ACME\" in a third. Before any enrichment runs, deduplicate your account table by domain. Domain is the universal join key. Not company name. Company names are messy. Domains are unique. Dedupe by domain, keep the richest record, merge any extra data points from duplicates into the primary row. Then enrich. Enriching before deduplication wastes credits on records you're going to merge or delete.",
      },
    ],
  },

  {
    id: 'alumni-effect',
    title: 'Alumni Effect',
    subtitle: 'Target contacts who moved from closed-won accounts to new companies',
    category: 'plays',
    description:
      'The Alumni Effect play — find contacts who left closed-won accounts and now work at new companies. Warm leads with built-in trust and product familiarity.',
    keywords: [
      'clay alumni effect',
      'clay closed won',
      'clay warm leads',
      'clay alumni',
      'clay job change',
    ],
    difficulty: 'intermediate',
    related: [
      'closed-won-enrichment',
      'contact-sourcing',
      'scoring-logic',
      'web-reveal-flow',
    ],
    sections: [
      {
        heading: 'What This Play Does',
        type: 'prose',
        content:
          "The Alumni Effect finds contacts who used to work at your closed-won accounts and have since moved to new companies. These people already know your product. They've used it. They may have championed the original deal. Now they're at a new company — a company that doesn't use your product yet. This is the warmest cold outreach you can do. The contact has built-in trust and product familiarity. You're not selling to a stranger. You're reconnecting with someone who already knows the value.",
      },
      {
        heading: 'Why This Works',
        type: 'prose',
        content:
          "Most outbound is fully cold. The prospect has never heard of you, never used your product, and has no reason to reply. The Alumni Effect flips that. The prospect has used your product. They may have been a power user, a champion, or even the person who signed the original deal. When they get an email that says \"saw you moved from [old company] to [new company] — we worked together when you were at [old company],\" the response rate is 3-5x higher than standard cold outbound.\n\nThe signal is simple: job change from a closed-won account. But the impact is outsized because trust transfers with the person, not the company.",
      },
      {
        heading: 'The Build (Clay + CRM)',
        type: 'pattern',
        content:
          "Step 1: Pull closed-won contacts from your CRM. In Salesforce, use SOQL to query contacts associated with closed-won opportunities. In HubSpot, filter contacts by deal stage = closed-won.\n\nStep 2: Import those contacts into a Clay table. These are your \"alumni seeds.\"\n\nStep 3: Run LinkedIn enrichment on every contact. Clay checks their current employer against their employer at time of close. If the company changed, flag them.\n\nStep 4: For flagged contacts (job changers), enrich the new company. Does the new company fit ICP? Score it.\n\nStep 5: For qualified new companies, build a mini company card — ICP score, employee count, industry, service fit.\n\nStep 6: Route. If the alumni contact is now at a qualified company, route to outreach. If the new company doesn't fit ICP, flag but don't contact.\n\nThis runs weekly. Job changes happen constantly. The table refreshes and catches new alumni every cycle.",
      },
      {
        heading: 'Signal Stacking with Alumni',
        type: 'pro-tip',
        content:
          "The Alumni Effect gets even stronger when you stack signals. Alumni alone is good. Alumni + web reveal intent is great. If someone from a closed-won account moved to a new company AND that new company is visiting your website, that's a top-priority lead.\n\nStack these signals on alumni contacts:\n\n• Web reveal — is the new company showing intent on your site?\n• Hiring signals — is the new company hiring for roles that suggest they need your product?\n• Tech stack changes — did the new company recently adopt or drop a competing tool?\n• Funding — did the new company recently raise a round?\n\nEach signal added to the alumni base increases confidence and reply rates.",
      },
      {
        heading: 'The Champion Tracking Layer',
        type: 'pattern',
        content:
          "Not all alumni are equal. A junior user who left is less valuable than the VP who championed the deal. Add a champion tag to your CRM contacts based on their role in the original deal:\n\n• Champion — actively sold internally, drove the deal forward\n• Power user — heavy product user, internal advocate\n• Stakeholder — involved in the deal but not the driver\n• End user — used the product but had no buying influence\n\nWhen the Alumni Effect surfaces a job change, check the champion tag. Champions at new companies get high-priority routing. End users at new companies get standard sequencing or skip.",
      },
      {
        heading: 'Common Mistakes',
        type: 'anti-pattern',
        content:
          "Treating all alumni the same. A champion who left is not the same as a junior analyst who left. Qualify the person, not just the company.\n\nRunning the Alumni Effect without checking if the new company is already in your pipeline. Before reaching out to an alumni contact, check: does the new company already have an active deal? Is another rep already working that account? CRM lookup first. Always.\n\nAnother mistake: running this as a one-time play. The Alumni Effect is a recurring workflow. Set it to run weekly. Job changes are continuous. A one-time pull misses 90% of the value.",
      },
    ],
  },

  {
    id: 'closed-won-enrichment',
    title: 'Closed-Won Enrichment',
    subtitle: 'Use your best customers as the model for finding new ones',
    category: 'plays',
    description:
      'The closed-won enrichment play — enrich your best customers, extract scoring patterns, and use that data to build lookalike audiences and qualification models in Clay.',
    keywords: [
      'clay closed won',
      'clay scoring model',
      'clay lookalike',
      'clay enrichment',
      'clay customer data',
    ],
    difficulty: 'intermediate',
    related: [
      'scoring-logic',
      'alumni-effect',
      'tam-list-building',
      'company-cards',
    ],
    sections: [
      {
        heading: 'What This Play Does',
        type: 'prose',
        content:
          "Closed-won enrichment takes your best existing customers and reverse-engineers what made them a fit. Instead of guessing at ICP criteria, you look at the companies that already bought and extract the patterns. What industries are they in? What employee count range? What tech stack? What signals were present before they closed? You enrich your closed-won accounts in Clay, build a scoring model from the patterns, and then apply that model to score new prospects. Your best customers become the template for finding the next ones.",
      },
      {
        heading: 'The Scoring-First Approach',
        type: 'pattern',
        content:
          "Most teams build scoring models from theory. \"We think companies with 500+ employees in SaaS are a fit.\" That's a guess. The closed-won approach builds scoring from evidence.\n\n1. Pull all closed-won accounts from HubSpot or Salesforce\n2. Import into a Clay account table\n3. Enrich every account with full firmographic data\n4. Look at the data — what do the winners have in common?\n5. Build a scoring model based on actual patterns\n\n5 points per data point is the default. If 80% of your closed-won accounts have 500+ employees, that gets 5 points. If 90% are in SaaS or FinTech, that gets 5 points. If 60% use Salesforce, that gets 3 points (weaker signal). The score must be self-explanatory at a glance. Use Clay's scoring integration, not formulas, for handoff readability.",
      },
      {
        heading: 'What to Enrich on Closed-Won Accounts',
        type: 'pattern',
        content:
          "Go deeper than standard firmographics:\n\n• Employee count and revenue — the basics\n• Industry and sub-industry — look for clusters\n• Tech stack — which tools appear most often? (BuiltWith, Wappalyzer)\n• Funding stage and last raise — are your customers mostly Series B-C?\n• Geography — regional patterns?\n• Growth signals — hiring velocity, office expansion\n• Engagement history — what content did they engage with before closing?\n• Sales cycle length — how long from first touch to close?\n• Champion profile — what title/role drove the deal internally?\n\nThe more data points you enrich, the more patterns emerge. Most teams stop at industry and employee count. That's the minimum. The closed-won play rewards depth.",
      },
      {
        heading: 'Building the Lookalike Model',
        type: 'pattern',
        content:
          "Once you've enriched your closed-won accounts and identified patterns, the lookalike model writes itself:\n\n1. Export the common attributes (industry clusters, employee range, tech stack patterns, geography)\n2. Build a company qualification prompt that scores new prospects against those attributes\n3. Weight the signals by frequency in your closed-won data (80% frequency = 5 points, 60% = 3 points, 40% = 2 points)\n4. Set thresholds: 8-10 = high-fit lookalike, 6-7 = medium-fit, below 6 = not a match\n5. Apply the model to your TAM list or inbound leads\n\nThe lookalike model isn't static. Re-run closed-won enrichment quarterly. As you win new customers, the patterns evolve. The model should evolve with them.",
      },
      {
        heading: 'Feeding the Alumni Effect',
        type: 'pro-tip',
        content:
          "Closed-won enrichment is the prerequisite for the Alumni Effect. You can't track alumni if you don't know who your closed-won contacts are. The closed-won table feeds two downstream workflows:\n\n1. Lookalike scoring — applied to new prospects\n2. Alumni tracking — monitoring job changes from closed-won contacts\n\nBoth workflows start with the same data. Enrich once, use twice.",
      },
      {
        heading: 'Common Mistakes',
        type: 'anti-pattern',
        content:
          "Using total customer count instead of closed-won. Not every customer is a good customer. Filter for your best deals — highest contract value, fastest close, lowest churn. Build the scoring model from your wins, not your entire customer list.\n\nAnother mistake: building the scoring model once and never updating it. Your ICP evolves. Your product evolves. Re-enrich and recalibrate every quarter. The market shifts. Your scoring model should shift with it.",
      },
    ],
  },

  {
    id: 'web-reveal-flow',
    title: 'Web Reveal Qualification Flow',
    subtitle: 'Company/contact split pattern for web visitor qualification',
    category: 'plays',
    description:
      'The web reveal qualification flow in Clay — split company and contact qualification, route by persona tier, and use MX records for platform routing (Instantly vs HeyReach).',
    keywords: [
      'clay web reveal',
      'clay qualification',
      'clay routing',
      'clay mx records',
      'clay web visitor',
    ],
    difficulty: 'advanced',
    related: [
      'clay-to-platforms',
      'scoring-logic',
      'http-column',
      'crm-lookup-first',
    ],
    sections: [
      {
        heading: 'What This Play Does',
        type: 'prose',
        content:
          "When someone visits your website and a web reveal tool (Vector, Midbound, or similar) identifies their company, the web reveal qualification flow takes over. It qualifies the company against ICP, finds the right contacts at that company, qualifies their personas, checks MX records, and routes them to the right outreach platform. The entire flow runs in Clay — from \"anonymous website visitor\" to \"qualified lead in an outreach sequence\" — without a human touching it.",
      },
      {
        heading: 'The Company/Contact Split',
        type: 'pattern',
        content:
          "This is the most important architectural decision in the web reveal flow. You split qualification into two separate prompts:\n\nPrompt 1: Company Qualification — does this company fit ICP? Check firmographics, tech stack, industry, revenue, employee count. Output: QUALIFIED / NEEDS_RESEARCH / NOT_QUALIFIED with score and reasoning.\n\nPrompt 2: Persona Qualification — does this contact match a valid buyer persona? Check job title against tier definitions. Output: MATCHED / NOT_MATCHED with tier, priority, and reasoning.\n\nPrompt 3: Routing Decision — combine both results. QUALIFIED company + MATCHED persona = route to outreach. QUALIFIED company + NOT_MATCHED persona = skip contact, flag company for different contact sourcing. NEEDS_RESEARCH + MATCHED persona = manual review. NOT_QUALIFIED = skip entirely.\n\nThe split matters because a company can be perfect but the contact wrong (wrong department, wrong seniority). And a contact can be perfect but the company wrong (too small, wrong industry). Both dimensions have to pass.",
      },
      {
        heading: 'MX-Based Platform Routing',
        type: 'pattern',
        content:
          "After qualification, you need to decide: Instantly or HeyReach? The answer isn't a preference — it's determined by MX records.\n\nUse Clay's HTTP column to check MX records on every qualified contact's email domain:\n\n• Google Workspace (google.com in MX) → Route to Instantly. I purchased Google-only sending infrastructure. Google-to-Google delivery is reliable.\n• Microsoft 365 / Exchange (outlook in MX, protection.outlook) → Route to HeyReach for LinkedIn. Can't reliably deliver to non-Google inboxes from Instantly.\n• No email found → Route to HeyReach for LinkedIn. Fallback to connection request.\n\nMicrosoft MX means enterprise. Adjust your approach accordingly — these contacts are harder to reach by email, but LinkedIn outreach with a strong persona match converts well.",
      },
      {
        heading: 'The Full Flow in Sequence',
        type: 'pattern',
        content:
          "1. Web reveal fires — company identified from website visit\n2. CRM lookup — is this company already in pipeline? If yes, alert the account owner instead of cold outreach\n3. Company qualification prompt — score against ICP criteria, identify primary gate\n4. If NOT_QUALIFIED → stop\n5. If QUALIFIED or NEEDS_RESEARCH → source contacts at the company\n6. Persona qualification prompt — match title to tier\n7. If NOT_MATCHED → skip contact, try next\n8. Single-provider email lookup (Prospeo or LeadMagic) — only on MATCHED personas\n9. MX record check on email domain\n10. Routing decision prompt — combine company score + persona tier + MX provider\n11. Route to Instantly (Google) or HeyReach (non-Google)\n12. Personalization research prompt — generate icebreaker referencing the website visit\n\nSteps 2-12 run automatically. The only human touchpoint is manual review for NEEDS_RESEARCH companies with MATCHED personas. Note: persona qualification runs before the email lookup — don't waste credits finding emails for people you'll never contact.",
      },
      {
        heading: 'Personalization for Web Reveal Leads',
        type: 'pro-tip',
        content:
          "Web reveal leads have a unique personalization advantage: you know they visited your site. The icebreaker can reference the visit without being creepy — \"noticed [company] has been looking at [product/service] solutions\" is enough to signal relevance without revealing surveillance.\n\nThe research prompt for web reveal should generate:\n\n• {icebreaker} — references the company's likely pain point (not the website visit directly)\n• {pain_point} — specific to the company's industry and current challenges\n• {service_fit} — maps the partner's offering to the company's likely need\n\nDon't say \"I saw you visited our website.\" That's creepy. Say \"companies in [industry] are increasingly looking at [solution] — here's why it matters for [company].\" Reference the intent without exposing the tracking.",
      },
      {
        heading: 'Common Mistakes',
        type: 'anti-pattern',
        content:
          "Running the full flow without CRM lookup first. If the company already has an active deal, your cold outreach undercuts the AE working the account. CRM lookup is step 2 for a reason.\n\nAnother mistake: running a single qualification prompt instead of splitting company and contact. A single prompt conflates two independent evaluations. The company might be perfect but the contact is an intern. The split catches that. Always split.\n\nSkipping the MX check is also common. If you send every qualified contact to email, you'll tank deliverability when half your list runs Microsoft. MX classification is the routing layer that keeps your domain healthy.",
      },
      {
        heading: 'Related: Email Infrastructure Guide',
        type: 'pro-tip',
        content:
          "MX-based routing only works if your sending infrastructure is set up correctly. Secondary domains, DNS records (SPF/DKIM/DMARC), inbox provider splits, warmup timelines, and per-inbox sending limits — all of that determines whether the emails you route actually land. See the Email Infrastructure Guide at /knowledge/email for the full breakdown of the infrastructure layer that sits underneath this play.",
      },
    ],
  },

  {
    id: 'hubspot-create-update',
    title: 'HubSpot Create, Update, and Lookup Patterns',
    subtitle: 'The full CRM integration pattern — lookup first, create or update, never duplicate',
    category: 'plays',
    description:
      'Master the HubSpot integration pattern in Clay — CRM lookup first, create or update logic, deduplication, and the trust-building principle of never sending leads already in pipeline.',
    keywords: [
      'clay hubspot',
      'clay crm',
      'clay hubspot integration',
      'clay lookup',
      'clay crm sync',
    ],
    difficulty: 'intermediate',
    related: [
      'crm-lookup-first',
      'on-demand-enrichment',
      'account-first-enrichment',
      'enterprise-guardrails',
    ],
    sections: [
      {
        heading: 'What This Play Does',
        type: 'prose',
        content:
          "The HubSpot Create-Lookup-Update pattern is how you sync enriched data from Clay into your CRM without creating duplicates, overwriting good data, or stepping on active deals. It's three operations in sequence: lookup (does this record already exist?), create (if not, make one), update (if so, add new data without destroying old data). This pattern applies to both contact and company objects. Get it wrong and your CRM fills with duplicates. Get it right and Clay becomes the enrichment engine that keeps your CRM current.",
      },
      {
        heading: 'Lookup First — The Non-Negotiable',
        type: 'pattern',
        content:
          "Before Clay creates anything in HubSpot, it must check if the record already exists. For contacts, lookup by email. For companies, lookup by domain.\n\nWhy this is non-negotiable: if you skip the lookup, Clay creates a new contact record even when that person is already in HubSpot with an active deal, 6 months of activity history, and a rep assigned. The sales rep gets confused. The pipeline gets messy. Reporting breaks. And your credibility with the sales team is gone.\n\nThe CRM lookup is the first column that should fire in any Clay table that syncs downstream. Before enrichment, before qualification, before routing — lookup first. Always.",
      },
      {
        heading: 'The Create-or-Update Decision',
        type: 'pattern',
        content:
          "After lookup, Clay has two paths:\n\nPath A — Record NOT found: Create a new contact or company in HubSpot. Map all enriched Clay columns to HubSpot properties. Set lifecycle stage (usually \"Lead\" for outbound). Associate the contact with the company object.\n\nPath B — Record FOUND: Update the existing record. But not blindly. Update rules:\n\n• Empty fields in HubSpot → fill from Clay (enrichment value add)\n• Populated fields in HubSpot → do NOT overwrite unless the Clay data is newer AND more reliable\n• Protected fields (owner, deal stage, lifecycle stage if advanced) → never overwrite from Clay\n• Enrichment timestamp → always update so the team knows when data was last refreshed\n\nThe update logic prevents Clay from stomping on data that humans or other systems have curated. Clay adds. It doesn't replace.",
      },
      {
        heading: 'Property Mapping',
        type: 'pattern',
        content:
          "Every Clay column that syncs to HubSpot needs a corresponding custom property. Standard mappings:\n\n• Clay ICP score → HubSpot custom property: icp_score (number, 0-10)\n• Clay persona tier → HubSpot custom property: persona_tier (number, 1-5)\n• Clay MX provider → HubSpot custom property: mx_provider (text: Google/Microsoft/Other)\n• Clay enrichment date → HubSpot custom property: last_clay_sync (date)\n• Clay service fit → HubSpot custom property: service_fit (text)\n• Clay web reveal date → HubSpot custom property: web_reveal_date (date)\n• Clay confidence → HubSpot custom property: qualification_confidence (text: High/Medium/Low)\n\nCreate these properties in HubSpot before you set up the Clay sync. If the property doesn't exist, the sync fails silently and data gets lost.",
      },
      {
        heading: 'Deduplication Strategy',
        type: 'pattern',
        content:
          "Deduplication happens at two levels:\n\nLevel 1 — Clay table level: Before syncing, deduplicate your Clay table by email (contacts) or domain (companies). Use Sculptor for fuzzy matching if needed. One record per person, one record per company.\n\nLevel 2 — CRM level: The lookup handles most deduplication. But edge cases exist: a contact with two email addresses, a company with multiple domains, a name that appears slightly different. For these, add a secondary lookup — check by name + company if the email lookup returns no match.\n\nThe goal: zero duplicate creation. Every record Clay touches in HubSpot should either be a clean create (genuinely new) or a clean update (existing record, enriched with fresh data).",
      },
      {
        heading: 'Trust and Pipeline Safety',
        type: 'pro-tip',
        content:
          "The HubSpot integration pattern isn't just a technical workflow. It's a trust protocol. Every time Clay sends data to HubSpot, a sales team relies on that data to make decisions. If Clay creates duplicates, the rep wastes time. If Clay overwrites deal notes, the rep loses context. If Clay adds contacts to a sequence that are already in active conversations, the rep looks incompetent.\n\nBefore building any Clay-to-HubSpot sync, ask: what's the worst thing that could happen if this sync runs incorrectly? Then build guardrails to prevent it. Lookup first. Never overwrite protected fields. Never route to outreach without checking pipeline status.",
      },
      {
        heading: 'Common Mistakes',
        type: 'anti-pattern',
        content:
          "Mapping Clay fields to default HubSpot properties that other systems also write to. If your marketing automation also updates lifecycle stage, and Clay also updates lifecycle stage, they'll fight. Create custom properties for Clay-specific data. Let marketing automation own its properties. Let Clay own its properties. No conflicts.\n\nAnother mistake: syncing every Clay row to HubSpot. Only sync qualified, enriched records. If an account scored 3/10 on ICP fit, it doesn't belong in the CRM. The CRM should only contain records worth a salesperson's attention.",
      },
    ],
  },

  {
    id: 'enterprise-guardrails',
    title: 'Enterprise Account Guardrails',
    subtitle: 'Batch enterprise separately. Isolate big accounts. Cap by domain.',
    category: 'plays',
    description:
      'Enterprise account guardrails in Clay — why you must batch enterprise contacts separately, isolate big accounts, cap enrichment by domain, and never enrich accounts on a contact table.',
    keywords: [
      'clay enterprise',
      'clay batching',
      'clay guardrails',
      'clay domain cap',
      'clay large accounts',
    ],
    difficulty: 'advanced',
    related: [
      'data-storage-batching',
      'account-first-enrichment',
      'tam-list-building',
      'contact-cards',
    ],
    sections: [
      {
        heading: 'What This Play Does',
        type: 'prose',
        content:
          "Enterprise accounts break normal Clay workflows. A company with 50,000 employees can have 200 valid contacts across 15 personas. If you run standard enrichment on a table that mixes enterprise accounts with mid-market accounts, the enterprise rows consume disproportionate credits, overwhelm your enrichment pipeline, and create duplicate problems that are painful to clean up. Enterprise guardrails are a set of rules that isolate large accounts, cap enrichment per domain, and batch enterprise separately from everything else.",
      },
      {
        heading: 'Why Enterprise Needs Isolation',
        type: 'prose',
        content:
          "When I say \"always source enterprise contacts separately,\" I mean it. Here's what happens when you don't:\n\n1. You import 500 contacts from various companies. 50 of them work at Microsoft.\n2. Your email lookup runs on all 500. Microsoft contacts consume disproportionate credits because the same @microsoft.com domain gets processed 50 times.\n3. Your persona qualification prompt returns 30 MATCHED personas at Microsoft alone. You now have 30 contacts routed to outreach at one company.\n4. Your sales rep receives 30 \"new leads\" from the same account and immediately distrusts the system.\n\nBigger batches need isolation. Enterprise accounts have more contacts, more personas, more data to process. If they run alongside mid-market accounts, they dominate the table and distort your metrics.",
      },
      {
        heading: 'The Domain Cap Rule',
        type: 'pattern',
        content:
          "Set a hard cap on contacts per domain. For most workflows, 5-10 contacts per company is the maximum you should enrich and route. The cap prevents:\n\n• Credit waste — you don't need 30 enriched contacts at one company\n• Rep overwhelm — sales can't meaningfully work 30 contacts at one account\n• Deliverability risk — sending 30 cold emails to the same domain flags you as spam\n\nImplement the cap in Clay using a formula column that counts contacts per domain. If count > cap, mark the excess rows as \"skip — domain cap reached.\" Enrich and route only the top contacts by persona tier.",
      },
      {
        heading: 'Batching Strategy',
        type: 'pattern',
        content:
          "Enterprise batching follows this structure:\n\n1. Separate enterprise accounts (1,000+ employees) from mid-market (100-1,000) and SMB (<100)\n2. Run mid-market and SMB through your standard enrichment flow\n3. Run enterprise through a dedicated flow with:\n   • Lower contact cap per domain (5-7 vs 10-15 for mid-market)\n   • Priority persona filtering (Tier 1-2 only, skip Tier 3+)\n   • CRM lookup before any enrichment (enterprise accounts are most likely to already exist in pipeline)\n   • Manual review step for accounts scoring 6-7 (enterprise NEEDS_RESEARCH accounts are worth the human time)\n\nThe enterprise batch runs separately, often on a different schedule. Don't mix it with your daily on-demand enrichment.",
      },
      {
        heading: 'Never Enrich Accounts on a Contact Table',
        type: 'anti-pattern',
        content:
          "This is the most common mistake with enterprise accounts. You import a list of contacts, and some columns are company-level data (revenue, employee count, tech stack). You enrich those company columns on the contact table. Now you have 50 contacts from Microsoft, each with its own enrichment of Microsoft's data — 50 separate API calls returning the same information.\n\nThe fix: always split to an account table first. Dedupe by domain. Enrich company-level data once per domain on the account table. Then source contacts from qualified accounts. The contact table pulls company data via lookup, not enrichment. This saves credits, prevents inconsistency, and keeps your architecture clean.\n\nThis is THE pattern. Account table for accounts. Contact table for contacts. Lookup to connect them. Never the other way.",
      },
      {
        heading: 'MX Classification for Enterprise',
        type: 'pro-tip',
        content:
          "Microsoft MX means enterprise. When you see \"protection.outlook\" or \"outlook.com\" in MX records, the account is running Microsoft 365 — which overwhelmingly means enterprise or upper mid-market. Use this signal in your guardrails:\n\n• Microsoft MX + 500+ employees → enterprise batch, LinkedIn outreach via HeyReach (can't deliver reliably to Microsoft from Google-only Instantly setup)\n• Google MX + any size → standard batch, email outreach via Instantly\n• Custom/self-hosted MX → enterprise batch, manual review (often government or highly regulated industries)\n\nMX classification isn't just about deliverability. It's a firmographic signal that tells you about the company before you even check their employee count.",
      },
      {
        heading: 'Common Mistakes',
        type: 'anti-pattern',
        content:
          "Running enterprise accounts through the same automation as mid-market. Every guardrail I described exists because someone (often me) learned the hard way. Enterprise accounts need their own table, their own caps, their own review process, and their own outreach cadence.\n\nAnother mistake: setting the domain cap too high. If you cap at 25 contacts per domain, you haven't really set a cap. For enterprise outreach, 5-7 is the sweet spot — enough to hit the buying committee, not so many that you look like you're spamming the org chart.",
      },
    ],
  },

  /* ================================================================== */
  /*  REFERENCE                                                          */
  /* ================================================================== */

  {
    id: 'formulas',
    title: 'Clay Formulas Reference',
    subtitle: 'Natural-language formulas for every common enrichment pattern',
    category: 'reference',
    description:
      'Complete reference for Clay formulas: merge names, dedupe titles, extract domains, classify MX records, map personas, and build scoring bins. Practitioner-tested patterns.',
    keywords: [
      'clay formulas',
      'clay formula examples',
      'clay natural language formula',
      'clay enrichment formulas',
      'clay domain extraction',
      'clay mx record formula',
    ],
    difficulty: 'intermediate',
    related: [
      'scoring-logic',
      'claygent-prompts',
      'credit-system',
      'sculptor-guide',
    ],
    sections: [
      {
        heading: 'Why Formulas Still Matter',
        type: 'prose',
        content:
          "Clay's AI columns and Claygent get the attention, but formulas are where 80% of the actual work happens. Formulas cost zero credits. They run instantly. They don't hallucinate. Any time you can solve something with a formula instead of an AI column, you should. I see people burning 2 credits per row on things a formula handles for free. That's not clever — that's lazy in the expensive direction.",
      },
      {
        heading: 'Name Merging and Formatting',
        type: 'formula',
        content:
          'Merge first_name and last_name into a single full_name column: <code>Merge {first_name} and {last_name} into a full name</code>. Clay\'s natural language engine handles the spacing. For title-casing names that come in ALL CAPS from imports: <code>Convert {full_name} to proper title case</code>. For extracting just first names from a full name column (useful for email personalization): <code>Extract the first word from {full_name}</code>. These cost zero credits and run instantly across your entire table.',
      },
      {
        heading: 'Domain Extraction',
        type: 'formula',
        content:
          'Pulling a clean domain from a messy URL or email is one of the most common Clay operations. From email: <code>Extract the domain from {email} (everything after the @)</code>. From a full URL: <code>Extract the root domain from {website_url} without www or paths</code>. From LinkedIn company URLs: <code>Extract the company name from {linkedin_url} — the part after /company/</code>. Always extract domains to a dedicated column. You\'ll use it for deduplication, CRM lookups, MX checks, and account-level grouping. Domain is the universal join key in Clay.',
      },
      {
        heading: 'Title Deduplication and Normalization',
        type: 'formula',
        content:
          'Job titles are messy. "VP of Sales," "Vice President, Sales," and "VP Sales &amp; Marketing" are all the same person tier. Normalize first: <code>Simplify {job_title} to its core role — remove "of," "and," commas, and abbreviate Vice President to VP</code>. For deduplication: <code>If {job_title} contains VP, SVP, EVP, or Vice President, return "VP-level". If it contains Director, return "Director-level". If it contains Manager, return "Manager-level". Otherwise return "Other".</code> This creates clean persona tiers you can filter and score on. Don\'t try to handle every edge case — handle 90% and manually review the rest.',
      },
      {
        heading: 'MX Record Classification',
        type: 'formula',
        content:
          'After pulling MX records via the HTTP column, classify them for routing: <code>If {mx_record} contains "google" or "googlemail", return "Google". If it contains "outlook" or "microsoft", return "Microsoft". If it contains "proofpoint" or "mimecast" or "barracuda", return "Enterprise-Security". Otherwise return "Other".</code> This is the formula that powers my entire email routing logic. Google → Instantly. Microsoft → HeyReach LinkedIn. Enterprise-Security → proceed with caution, possibly Woodpecker. Microsoft MX means enterprise — adjust your approach accordingly.',
      },
      {
        heading: 'Persona Mapping',
        type: 'formula',
        content:
          'Map job titles to persona tiers for campaign routing: <code>If {job_title} contains CTO, CIO, CISO, CEO, or Chief, return "C-Suite". If it contains VP or Vice President, return "VP". If it contains Director, return "Director". If it contains Manager or Lead or Head, return "Manager". Otherwise return "IC".</code> I pair this with a scoring column — C-Suite gets 25 points, VP gets 20, Director gets 15, Manager gets 10, IC gets 5. The formula runs for free. The scoring happens downstream. Never pay credits for what a formula gives you.',
      },
      {
        heading: 'Scoring Bins',
        type: 'formula',
        content:
          'After your scoring column calculates a total, bin the scores for easy filtering: <code>If {total_score} >= 80, return "Tier 1 — High Priority". If >= 60, return "Tier 2 — Qualified". If >= 40, return "Tier 3 — Nurture". Otherwise return "Tier 4 — Disqualify".</code> The bins should be self-explanatory at a glance. Anyone looking at the table should understand what Tier 1 means without reading documentation. That\'s the rule: if someone has to ask what the score means, your scoring system is broken. 5 points per data point is the default. Close-won data is the model. Score must read at a glance.',
      },
      {
        heading: 'Anti-Pattern: Over-Engineering Formulas',
        type: 'anti-pattern',
        content:
          "Don't try to build your entire qualification logic in a single formula. I've seen tables with 300-word natural language formulas that combine persona mapping, scoring, routing, and enrichment status into one column. It breaks. It's unreadable. It's impossible to debug. Keep formulas single-purpose. One formula per transformation. Chain them across columns. Column A extracts the domain. Column B classifies MX. Column C maps persona. Column D scores. Column E bins. Each one is testable, readable, and free.",
      },
    ],
  },

  {
    id: 'certification-guide',
    title: 'Getting Clay Certified (98/100 Guide)',
    subtitle: 'How I scored 98/100 on the Clay certification exam',
    category: 'reference',
    description:
      'Practical guide to passing the Clay certification exam with a 98/100 score. Study strategy, key concepts, common traps, and the mindset that matters more than memorization.',
    keywords: [
      'clay certification',
      'clay certified',
      'clay exam',
      'clay certification guide',
      'clay certification tips',
      'how to pass clay certification',
    ],
    difficulty: 'beginner',
    related: [
      'credit-system',
      'claygent-prompts',
      'formulas',
      'sculptor-guide',
    ],
    sections: [
      {
        heading: 'Why Get Certified',
        type: 'prose',
        content:
          "Clay certification isn't a vanity badge. It's a credibility signal. When I'm talking to a prospect about running their enrichment pipeline, \"Clay certified\" ends the \"do you actually know this tool?\" conversation before it starts. It's also a forcing function — studying for the exam fills in gaps you didn't know you had. I'd been using Clay for months before I took it, and the exam still taught me things. The badge goes on your LinkedIn, your website, your proposals. It's free leverage.",
      },
      {
        heading: 'The Exam Format',
        type: 'prose',
        content:
          "The certification is a timed online exam. Multiple choice and scenario-based questions. You need 80% to pass. I scored 98/100. The questions test practical knowledge — they're not trivia. They ask you to identify the right enrichment approach for a scenario, troubleshoot a broken table, choose between providers, and understand credit costs. If you've actually built tables in Clay, most of it feels intuitive. If you've only watched tutorials, you'll struggle.",
      },
      {
        heading: 'Study Strategy That Worked',
        type: 'pattern',
        content:
          "Don't study the documentation linearly. That's how you waste time. Here's what I did: (1) Build 3-5 real tables first — don't study until you've used Clay. The exam tests practical knowledge, not theory. (2) Know the credit system cold. How many credits each provider costs. When to use API vs. native. Waterfall vs. single-provider tradeoffs. (3) Understand Claygent limitations — when it hallucinates, how to validate, what it can't do. (4) Know the difference between enrichment providers — what Apollo gives you vs. what Prospeo gives you vs. what LeadMagic gives you. (5) Understand table architecture — when to split tables, when to use write-to-table, when to use lookup columns.",
      },
      {
        heading: 'Key Concepts to Know Cold',
        type: 'pattern',
        content:
          "Credit costs by provider — know which providers cost 1 credit vs. 2 vs. 5. Waterfall logic — how the enrichment waterfall works, when the first valid result stops the chain. Table relationships — write-to-table, lookup columns, how to dedupe across tables. Claygent — what it can browse, token limits, when it fails. HTTP column — how to make API calls, parse JSON, handle rate limits. Formulas — natural language formulas for common operations. Scoring — how to build scoring systems, the integration vs. formula approach. Sculptor — what it actually is (AI query interface, not just dedupe). Integrations — HubSpot, Salesforce, Instantly, HeyReach push patterns.",
      },
      {
        heading: 'Common Traps',
        type: 'anti-pattern',
        content:
          "The exam has questions designed to trip up surface-level users. Watch for: (1) Questions about credit efficiency — the \"correct\" answer often involves using fewer credits, not more providers. (2) Sculptor questions — many people think Sculptor is only for deduplication. It's an AI interface to query your table. The exam tests this distinction. (3) Table architecture questions — if the scenario describes a large dataset, the answer usually involves splitting into account and contact tables. Never enrich accounts on a contact table. (4) API vs. native — sometimes the right answer is to use the HTTP column with a direct API call instead of a native integration. The exam tests when to choose which.",
      },
      {
        heading: 'The 2 Points I Missed',
        type: 'pro-tip',
        content:
          "I lost 2 points on edge-case questions about specific provider capabilities — things like exact field coverage for a niche enrichment provider. Don't stress about memorizing every provider's complete field list. Know the major ones (Apollo, Prospeo, LeadMagic, Clearbit) and their strengths. The 2% I missed doesn't matter. The 98% I got comes from actually using Clay every day. There's no shortcut for that.",
      },
      {
        heading: 'After Certification',
        type: 'prose',
        content:
          "Put the badge on LinkedIn immediately. Add it to your website. Mention it in proposals. But don't let it make you complacent. The certification tests foundational knowledge. The real skill is in the plays — the multi-step workflows that combine enrichment, qualification, scoring, and routing into campaign-ready pipelines. Certification proves you can use Clay. The plays prove you can think with it.",
      },
    ],
  },

  {
    id: 'sculptor-guide',
    title: 'Sculptor: The AI Query Interface',
    subtitle: 'It\'s not just dedupe — it\'s an AI interface to query your table',
    category: 'reference',
    description:
      'Sculptor is Clay\'s AI query interface that lets you ask questions about your table data in natural language. Commonly misunderstood as just a dedupe tool. Full guide with use cases and limitations.',
    keywords: [
      'clay sculptor',
      'sculptor clay',
      'clay ai query',
      'clay deduplication',
      'clay table query',
      'sculptor guide',
    ],
    difficulty: 'beginner',
    related: [
      'formulas',
      'claygent-prompts',
      'certification-guide',
      'data-storage-batching',
    ],
    sections: [
      {
        heading: 'The Sculptor Misconception',
        type: 'prose',
        content:
          "Most people think Sculptor is Clay's deduplication tool. It can dedupe, but that's like saying a smartphone is a calculator. Sculptor is an AI interface to query your table. You can ask it questions about your data in natural language and it returns answers. \"Show me all contacts with VP titles at companies with more than 500 employees.\" \"Which rows have emails from Google Workspace domains?\" \"Group these companies by industry and count them.\" It's the closest thing Clay has to a conversational data layer.",
      },
      {
        heading: 'When Sculptor Shines',
        type: 'pattern',
        content:
          'Sculptor is best for: (1) Quick data exploration — when you import a list and want to understand what you\'re working with before building enrichment columns. (2) Fuzzy deduplication — grouping "Microsoft," "Microsoft Corp," and "MSFT" without writing complex formulas. (3) Data quality checks — "How many rows have empty email fields?" or "Show me rows where the domain doesn\'t match the company name." (4) Ad-hoc analysis — when a partner asks "how many enterprise accounts are in this list?" and you need a fast answer without building a whole scoring system. It\'s low-effort. It\'s conversational. It didn\'t exist when I started using Clay, so I built everything with formulas and columns. But for beginners, Sculptor is a great way to start thinking about your data before you commit to column architecture.',
      },
      {
        heading: 'Sculptor for Deduplication',
        type: 'pattern',
        content:
          "Yes, Sculptor does dedupe well. Here's the pattern: (1) Import your list. (2) Open Sculptor and ask it to find duplicates by company name or domain. (3) It groups fuzzy matches — catches abbreviations, typos, parent/subsidiary relationships. (4) Review the groups and merge or delete. This is better than formula-based dedupe for messy datasets. Formulas need exact rules. Sculptor uses AI to catch what rules miss. For clean datasets with consistent formatting, formulas are faster and free. For messy imports from third-party sources, Sculptor saves hours.",
      },
      {
        heading: 'Limitations',
        type: 'anti-pattern',
        content:
          "Sculptor isn't a replacement for proper column architecture. It's great for exploration and one-off queries, but it doesn't create persistent, reusable logic. If you need a classification that runs on every new row, build a formula column. If you need enrichment, use enrichment providers. If you need scoring, use the scoring integration. Sculptor is for answering questions about data you already have — not for transforming or enriching it. It also doesn't scale well to very large tables (50K+ rows). For big TAMs, use Supabase for storage and Clay for orchestration. Don't try to query a 100K-row table through Sculptor.",
      },
      {
        heading: 'Sculptor vs. Claygent',
        type: 'prose',
        content:
          "People confuse these. Sculptor queries data already in your table. Claygent browses the web and brings new data in. Sculptor: \"Which of my existing contacts are at companies with Microsoft MX records?\" Claygent: \"Go to this company's website and summarize their positioning.\" Sculptor is free or low-credit. Claygent costs credits per row. Use Sculptor to understand what you have. Use Claygent to fill in what you don't.",
      },
      {
        heading: 'My Honest Take',
        type: 'pro-tip',
        content:
          "Sculptor is a good tool, not a great one. It's useful for beginners who don't yet think in columns and formulas. It's useful for quick questions when you don't want to build a whole enrichment flow. But I don't use it daily. My tables are architected with dedicated columns for every classification, score, and filter. By the time I'd open Sculptor, I already have the answer in a column. If you're just starting with Clay, use Sculptor to explore. Then graduate to formulas and column architecture. That's where the real power lives.",
      },
    ],
  },

  {
    id: 'troubleshooting',
    title: 'Troubleshooting and Escalation',
    subtitle: 'Debug broken tables, failed enrichments, and weird edge cases',
    category: 'reference',
    description:
      'Troubleshooting guide for Clay: diagnose broken enrichments, failed columns, rate limits, credit waste, and Claygent hallucinations. Escalation paths and fixes from real practitioner experience.',
    keywords: [
      'clay troubleshooting',
      'clay enrichment failed',
      'clay not working',
      'clay rate limit',
      'clay debug',
      'claygent hallucination',
    ],
    difficulty: 'intermediate',
    related: [
      'credit-system',
      'claygent-prompts',
      'data-storage-batching',
      'formulas',
    ],
    sections: [
      {
        heading: 'The 80/20 of Clay Problems',
        type: 'prose',
        content:
          "Eighty percent of Clay issues fall into four buckets: (1) enrichment providers returning empty results, (2) Claygent hallucinating or timing out, (3) credit burn from misconfigured waterfalls, and (4) rate limits on HTTP columns. If your table is broken, check these four things first. Most of the time, it's one of them. The other 20% is usually a table architecture problem — you built the flow wrong, and the fix isn't a band-aid, it's a redesign.",
      },
      {
        heading: 'Empty Enrichment Results',
        type: 'pattern',
        content:
          "When an enrichment column returns blanks, work through this checklist: (1) Check the input column — is the email/domain/name actually populated for those rows? Empty input → empty output. (2) Check the provider — some providers have better coverage for certain regions or company sizes. Apollo is strong for US tech. Prospeo has good European coverage. (3) Check your waterfall — if you're using a waterfall and the first provider fails, does it actually fall through to the next? Test with 5 rows manually. (4) Check rate limits — some providers throttle after X requests. If the first 50 rows work and then everything goes blank, you're being rate-limited. Space out your runs. (5) Check credits — if you're out of credits, enrichments silently fail. Check your credit balance before investigating anything else.",
      },
      {
        heading: 'Claygent Failures',
        type: 'pattern',
        content:
          "Claygent is powerful but fragile. Common failure modes: (1) Hallucination — it makes up data that looks real. Fix: run a 5-row sample first and manually verify every field against the source. If it hallucinates on 1/5, it'll hallucinate on 100/500. (2) Timeout — it tries to browse a page that's too large or takes too long to load. Fix: give it more specific instructions. Instead of \"summarize this website,\" say \"read the /about page and extract the company's founding year and employee count.\" (3) JSON schema violations — you asked for structured output but it returned prose. Fix: include the exact JSON schema in your prompt and add \"Return ONLY valid JSON, no explanations.\" (4) Token limit — the page content exceeds the context window. Fix: target specific pages, not entire sites. Use FireCrawl to get clean markdown first if needed.",
      },
      {
        heading: 'Credit Burn Diagnosis',
        type: 'anti-pattern',
        content:
          "If your credits are disappearing faster than expected: (1) Check for enrichment columns running on every row, including rows that already have data. Add a condition: only enrich if the target column is empty. (2) Check for duplicate enrichments — same contact getting enriched in multiple tables. Dedupe by domain at the account level first. (3) Check your waterfall — if the waterfall tries all 5 providers on every row (even when the first one succeeds), you're burning 5x credits. The waterfall should stop at the first valid result. (4) Check Claygent — it costs more credits than simple enrichments. If you're running Claygent on 1,000 rows for something a formula could do, you're wasting money. My rule: if time spent avoiding credits exceeds the credit cost, use the credits. But if credits are burning because of misconfiguration, fix the plumbing.",
      },
      {
        heading: 'Rate Limit and HTTP Column Issues',
        type: 'pattern',
        content:
          "HTTP columns hit APIs directly, which means you're subject to rate limits. Symptoms: first N rows return data, then everything after returns errors or blanks. Fixes: (1) Add a delay between rows — Clay lets you configure run speed. Slow it down. (2) Batch your runs — don't run 5,000 rows at once. Run 500, wait, run 500 more. (3) Check API documentation for rate limits — some APIs allow 100 requests/minute, others allow 10. Match your Clay run speed to the API's limit. (4) Use Clay's built-in rate limiting if available for the provider. (5) For critical APIs, consider routing through a proxy that handles backoff automatically. This is especially important for MX record lookups and custom API endpoints.",
      },
      {
        heading: 'Table Architecture Problems',
        type: 'anti-pattern',
        content:
          "Sometimes the table isn't broken — it's badly designed. Signs of architecture problems: (1) You have 40+ columns and can't find anything. Split into account table and contact table. (2) You're enriching company data on every contact row. Stop. Create an account table, dedupe by domain, enrich once, write back with lookup columns. (3) Your scoring column depends on data from 15 other columns and sometimes they're not all populated. Build scoring as the last step, after all enrichment is complete. (4) You're using one table for sourcing, enrichment, scoring, AND routing. That's too much. Source → enrich → score → route should flow across 2-3 tables.",
      },
      {
        heading: 'When to Escalate to Clay Support',
        type: 'pro-tip',
        content:
          "Most issues are user error or architectural. But sometimes Clay itself has bugs. Escalate when: (1) An enrichment provider that was working yesterday returns errors on every row today — provider-side outage. (2) Credit charges don't match your usage — billing discrepancy. (3) A column runs but the output is corrupted or truncated — platform bug. (4) The UI freezes or tables won't load — infrastructure issue. Before you escalate, document: what you tried, what you expected, what happened instead, and screenshot the error. Clay support is responsive but they need specifics. \"It's broken\" gets a slow response. \"Apollo enrichment on Table X returns 'provider_error' for all rows since 2pm, previously working\" gets a fast one.",
      },
    ],
  },

  /* ================================================================== */
  /*  INTEGRATIONS                                                       */
  /* ================================================================== */

  {
    id: 'http-column',
    title: 'The HTTP Column (MX Records, Time APIs, Custom Endpoints)',
    subtitle: 'Direct API calls from Clay — the most underrated column type',
    category: 'integrations',
    description:
      'Master the Clay HTTP column: MX record lookups for email routing, time APIs, custom endpoint calls, and JSON parsing. The most powerful and underrated integration in Clay.',
    keywords: [
      'clay http column',
      'clay api call',
      'clay mx record',
      'clay custom api',
      'clay http integration',
      'clay json parsing',
    ],
    difficulty: 'advanced',
    related: [
      'clay-to-platforms',
      'crm-lookup-first',
      'formulas',
      'credit-system',
    ],
    sections: [
      {
        heading: 'Why the HTTP Column Changes Everything',
        type: 'prose',
        content:
          "The HTTP column is Clay's escape hatch. Every native integration has limitations — fixed fields, fixed pricing, fixed logic. The HTTP column lets you call any API endpoint, parse the JSON response, and use the result in your table. No credit cost beyond Clay's base charge. No dependency on Clay updating their integrations. If the API exists, you can use it. This is the column that separates Clay users from Clay engineers. Most people never touch it. The ones who do build things that aren't possible any other way.",
      },
      {
        heading: 'MX Record Lookups',
        type: 'pattern',
        content:
          "This is the single most important HTTP column pattern in my entire workflow. MX records tell you what email provider a company uses. Google Workspace, Microsoft 365, Proofpoint, Mimecast — each one changes your outreach strategy. The pattern: (1) Set up an HTTP column with a GET request to a DNS lookup API (I use a lightweight MX lookup endpoint). (2) Pass the domain from your domain column. (3) Parse the MX record from the JSON response. (4) Use a formula column to classify: Google → Instantly, Microsoft → HeyReach LinkedIn, Enterprise-Security → caution. This is how I route every single contact in every campaign. It's not optional. Microsoft MX means enterprise — that's a signal. Google Workspace is standard outbound territory. The MX record dictates the channel.",
      },
      {
        heading: 'Time and Timezone APIs',
        type: 'pattern',
        content:
          "Knowing a prospect's local timezone matters for send-time optimization. The pattern: (1) Use the company's HQ city or state from enrichment. (2) Call a timezone API via HTTP column to get their UTC offset. (3) Use this to schedule emails in their morning window (8-10am local). This is a minor optimization but it compounds. Emails sent at 9am local time get higher open rates than emails sent at 2am. The HTTP column makes this a zero-effort addition to any campaign table.",
      },
      {
        heading: 'Custom API Endpoints',
        type: 'pattern',
        content:
          "Any REST API can be a Clay column. Examples I've built: (1) SemRush API for pulling competitor domains — identify who a prospect competes with, use that in personalization. (2) FireCrawl API for deep site analysis — crawl a prospect's website and get clean markdown for Claygent to analyze. (3) Custom webhook endpoints that trigger Supabase inserts — when a row meets certain criteria, push it directly to my database. (4) Slack webhook for real-time alerts — when a high-priority lead enters the table, ping a Slack channel. The HTTP column supports GET, POST, PUT, and DELETE. You can pass headers, authentication tokens, and request bodies. It's a full API client inside a spreadsheet column.",
      },
      {
        heading: 'JSON Parsing',
        type: 'pattern',
        content:
          "API responses come back as JSON. You need to extract the right fields. Clay's HTTP column lets you specify a JSON path for the field you want. For nested responses: use dot notation to drill into the object. For arrays: specify the index. For complex extractions: pair the HTTP column with a formula column that cleans up the raw response. Pro tip: always test with one row first. API responses can vary — some companies return different structures for different inputs. Get the JSON path right on a sample before running on 500 rows and wasting credits on parse errors.",
      },
      {
        heading: 'Rate Limiting and Best Practices',
        type: 'anti-pattern',
        content:
          "The HTTP column has no built-in rate limiting. If you run 5,000 rows against an API that allows 100 requests per minute, you'll get blocked. Best practices: (1) Check the API's rate limits before you run. (2) Use Clay's run speed settings — slow it down for sensitive APIs. (3) Batch your runs in groups of 100-500. (4) Add error handling — if the API returns a non-200 status, have a formula column that flags it for retry. (5) Cache results when possible — if you've already looked up the MX record for google.com, don't look it up again on the next row. Dedupe domains first, run HTTP once per unique domain, then write back with a lookup column.",
      },
      {
        heading: 'When HTTP > Native Integration',
        type: 'pro-tip',
        content:
          "Use the HTTP column instead of a native integration when: (1) The native integration doesn't expose the field you need. (2) The native integration costs more credits than a direct API call. (3) You need custom logic in the request (conditional headers, dynamic parameters). (4) The native integration hasn't been updated and the API has new features. (5) You're calling an API that Clay doesn't have a native integration for at all. The HTTP column is the most versatile tool in Clay. Learn it once, use it everywhere.",
      },
      {
        heading: 'Related: Email Infrastructure Guide',
        type: 'pro-tip',
        content:
          "MX record lookups are one of the highest-ROI uses of the HTTP column — but the value only materializes when you have the infrastructure to act on the routing decision. Understanding MX records, provider splits (Google Workspace vs Microsoft 365), sending limits, and domain warming is essential context. See the Email Infrastructure Guide at /knowledge/email for the complete infrastructure layer.",
      },
    ],
  },

  {
    id: 'crm-lookup-first',
    title: 'CRM Lookup First (Never Skip This)',
    subtitle: 'The trust-killing mistake most GTM engineers make on day one',
    category: 'integrations',
    description:
      'Why you must always lookup your CRM before building any Clay enrichment pipeline. Sending leads already in the pipeline is the fastest way to lose partner trust.',
    keywords: [
      'clay crm lookup',
      'clay hubspot lookup',
      'clay salesforce lookup',
      'crm deduplication',
      'clay crm integration',
      'crm check before enrichment',
    ],
    difficulty: 'beginner',
    related: [
      'clay-to-platforms',
      'http-column',
      'scoring-logic',
      'hubspot-create-update',
    ],
    sections: [
      {
        heading: 'The Cardinal Rule',
        type: 'prose',
        content:
          "Before you build anything — before enrichment, before scoring, before personalization, before campaign routing — look up your CRM. Check if the contact already exists. Check if the company already has an open opportunity. Check if someone on the sales team is already working that account. This is not optional. This is the first step. Every time. No exceptions. Sending leads that are already in the pipeline is the single fastest way to lose trust with a partner or sales team. I've seen it destroy relationships. Someone's working a deal with Microsoft for 6 months, and you send an automated cold email to their champion. Game over.",
      },
      {
        heading: 'The Lookup Pattern',
        type: 'pattern',
        content:
          "The pattern is simple but non-negotiable: (1) In your Clay table, add a HubSpot (or Salesforce) lookup column. (2) Look up by email first. If no match, look up by domain. (3) Check the response: does a contact record exist? Does a company record exist? Is there an open deal or opportunity? (4) Add a formula column: if CRM_match = true, flag as \"Already in CRM — DO NOT ENRICH.\" (5) Filter your enrichment columns to only run on rows where CRM_match = false. This means your enrichment credits only get spent on net-new contacts. Your campaign only targets people who aren't already being worked. Your partner's sales team never gets an angry email from a prospect saying \"I just got a cold email from your company when we're literally in contract negotiations.\"",
      },
      {
        heading: 'What to Check in the CRM',
        type: 'pattern',
        content:
          "A basic \"does this email exist?\" check isn't enough. Check these fields: (1) Contact exists — someone has this person in the CRM. (2) Company exists — the domain is already a known account. (3) Deal/Opportunity status — is there an open deal? A closed-won deal? A closed-lost from this quarter? (4) Owner — who owns this account? If it's the partner's top rep, absolutely do not touch it. (5) Last activity date — if someone contacted this person in the last 90 days, back off. Each of these changes your routing logic. Contact exists + no open deal = maybe re-engage through a different channel. Open deal = hard exclude. Closed-won = upsell campaign, not cold outreach. Closed-lost recently = wait 6 months.",
      },
      {
        heading: 'The Domain-Level Check',
        type: 'pattern',
        content:
          "Email-level lookup catches individual contacts. Domain-level lookup catches entire accounts. You need both. Here's why: your list might have sarah@acme.com, but the CRM has john@acme.com with an open $500K deal. Email lookup misses it because Sarah isn't in the CRM. Domain lookup catches it because acme.com has an active opportunity. Always run both: (1) Lookup by email for exact contact match. (2) Lookup by domain for account-level match. (3) If either returns a match, investigate before routing. The domain-level check is especially critical for enterprise accounts. One wrong email to a Fortune 500 account that's in active negotiations can blow up a deal worth more than your entire campaign.",
      },
      {
        heading: 'Anti-Pattern: CRM Lookup After Enrichment',
        type: 'anti-pattern',
        content:
          "I've seen people build the entire enrichment pipeline — email waterfall, persona qualification, scoring, personalization — and THEN add a CRM lookup as the final filter. This is backwards. You've already spent credits enriching contacts you're going to exclude. You've already burned Claygent tokens on personalization for people you can't email. CRM lookup is step one. Not step ten. Run it first. Exclude matches. Then enrich only the net-new contacts. This saves credits, saves time, and most importantly saves relationships.",
      },
      {
        heading: 'When the CRM Data Is Bad',
        type: 'pro-tip',
        content:
          "Sometimes the CRM itself is a mess. Duplicate records, outdated contacts, no deal attribution, missing domains. This is still not an excuse to skip the lookup. If the CRM data is bad, your first job is to flag it — \"Hey, your CRM has 3 duplicate records for Acme with conflicting deal statuses.\" That's a service. That's value. Your partner will thank you for surfacing it. What they won't thank you for is ignoring their CRM and sending cold emails to their pipeline. Clean CRM data is a prerequisite for clean campaigns. If the CRM isn't ready, the campaign isn't ready. Full stop.",
      },
    ],
  },

  {
    id: 'clay-to-platforms',
    title: 'Clay to Instantly, HeyReach, and Beyond',
    subtitle: 'Routing enriched contacts to the right outreach platform',
    category: 'integrations',
    description:
      'How to route enriched contacts from Clay to Instantly, HeyReach, Woodpecker, and other platforms. MX-based routing, platform selection criteria, and integration patterns.',
    keywords: [
      'clay to instantly',
      'clay to heyreach',
      'clay integration',
      'clay outreach routing',
      'clay email platform',
      'clay linkedin automation',
    ],
    difficulty: 'intermediate',
    related: [
      'http-column',
      'crm-lookup-first',
      'web-reveal-flow',
      'enterprise-guardrails',
    ],
    sections: [
      {
        heading: 'The Routing Decision',
        type: 'prose',
        content:
          "Clay is the enrichment and orchestration layer. It doesn't send emails. It doesn't send LinkedIn messages. It qualifies, scores, and routes contacts to the right platform for execution. The routing decision isn't random and it's not one-size-fits-all. The right platform depends on the contact's email provider, their seniority, their industry, and the campaign's risk tolerance. Getting this wrong means poor deliverability, wasted spend, or worse — getting your domains burned.",
      },
      {
        heading: 'MX-Based Routing',
        type: 'pattern',
        content:
          "This is the core routing logic for every campaign I build. It starts with the MX record (see the HTTP column entry for how to pull these). The rules: Google Workspace domains → Instantly. I have Google-only sending infrastructure in Instantly. Google-to-Google deliverability is the highest-reliability path for cold email. Microsoft 365 domains → HeyReach for LinkedIn outreach. I can't reliably deliver cold email to Microsoft domains from my Instantly setup. LinkedIn is the better channel for these contacts anyway — Microsoft-heavy companies tend to be enterprise, and enterprise responds better to LinkedIn. Enterprise-security domains (Proofpoint, Mimecast, Barracuda) → proceed with extreme caution. These companies have aggressive spam filtering. Consider Woodpecker or Smartlead for security-conscious sending. Or route to LinkedIn. Other/Unknown → evaluate case by case. Small providers, custom mail servers, or regional providers might work with email or might not. Test small batches first.",
      },
      {
        heading: 'Clay to Instantly',
        type: 'pattern',
        content:
          "Instantly integration: (1) In Clay, add an Instantly push column. (2) Map fields: email, first_name, last_name, company, custom variables (icebreaker, pain_point, competitor_mention — whatever your email template uses). (3) Set conditions: only push rows where MX_classification = \"Google\" AND score >= qualifying threshold AND crm_match = false. (4) Assign to the correct Instantly campaign based on persona tier or campaign segment. Key detail: push to Instantly after ALL enrichment and scoring is complete. Don't push partial records. If the icebreaker column hasn't finished running, wait. Instantly needs complete data to personalize the emails.",
      },
      {
        heading: 'Clay to HeyReach',
        type: 'pattern',
        content:
          "HeyReach integration for LinkedIn: (1) Export qualified contacts from Clay as CSV or push via API. (2) Include: LinkedIn URL (required), first_name, company, persona_tier, and any personalization fields. (3) Route to HeyReach when: MX = Microsoft, or the contact is C-suite/VP level (regardless of MX), or the campaign strategy is multi-channel and LinkedIn is the primary touch. (4) Set up HeyReach campaign with connection request + follow-up message sequence. LinkedIn works best for enterprise, senior contacts, and relationship-first outreach. If someone's a VP at a Fortune 1000 company, a LinkedIn connection request from a real person feels more appropriate than a cold email. That's the channel logic.",
      },
      {
        heading: 'When to Use Other Platforms',
        type: 'prose',
        content:
          "Instantly and HeyReach cover 90% of scenarios. But edge cases exist: Woodpecker — when the prospect's domain has enterprise security (Proofpoint, Mimecast). Woodpecker handles email sending with more deliverability controls and warming options that work better against aggressive filters. Smartlead — similar use case to Woodpecker, sometimes preferred for specific regional deliverability. Also useful when you need multiple mailbox rotation at scale. The platform choice is never agnostic — it depends on the scenario. Don't pick a platform because you like it. Pick it because the data says it's the right channel for this contact.",
      },
      {
        heading: 'Multi-Channel Routing',
        type: 'pattern',
        content:
          "The most effective campaigns don't pick one channel — they coordinate across channels. The pattern: (1) Route Google MX contacts to Instantly for email Day 1. (2) Route the same contacts to HeyReach for a LinkedIn connection on Day 3. (3) Email follow-up on Day 5. (4) LinkedIn follow-up on Day 8. Clay enables this by pushing the same contact to multiple platforms with different timing. The key is coordination — don't send email and LinkedIn messages on the same day. Stagger them. It should feel like organic multi-touch, not a synchronized attack. Tag each contact in Clay with which platforms they've been pushed to, so you have a single source of truth for campaign orchestration.",
      },
      {
        heading: 'Anti-Pattern: Routing Before Qualifying',
        type: 'anti-pattern',
        content:
          "Never push contacts to outreach platforms before they're fully qualified and scored. I've seen people connect Clay to Instantly and push every enriched contact immediately. No scoring. No persona verification. No CRM check. The result: emails go to people who don't match ICP, people already in the pipeline, and people at companies that are too small or too large for the offer. That's not GTM engineering — that's spam with extra steps. The flow is always: source → CRM lookup → enrich → score → qualify → THEN route. Routing is the last step, not the first.",
      },
      {
        heading: 'Related: Email Infrastructure Guide',
        type: 'pro-tip',
        content:
          "Routing contacts to Instantly or HeyReach is the last step in Clay — but the infrastructure those platforms sit on determines whether your emails land. Domain provisioning, DNS records, inbox provider splits, warmup schedules, sending limits, and mailbox rotation all matter. See the Email Infrastructure Guide at /knowledge/email for the complete sending infrastructure breakdown.",
      },
    ],
  },
]
