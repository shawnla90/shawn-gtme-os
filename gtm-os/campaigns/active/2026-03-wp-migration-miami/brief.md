# WordPress Migration - Miami SMBs

## Campaign ID
`2026-03-wp-migration-miami`

## Segment
`wp-migration-miami`

## Thesis
Miami SMBs (10-100 employees) running WordPress are leaving performance and SEO on the table. We migrate them to Next.js - faster pages, better Core Web Vitals, modern stack. The pitch writes itself when their own site's PageSpeed score is the proof point.

## ICP
- **Geography:** Miami, FL metro
- **Size:** 10-100 employees
- **Tech:** Currently running WordPress
- **Industries:** Professional services, real estate, hospitality, health/wellness, legal, agencies
- **Pain signals:** Slow load times, poor mobile experience, plugin bloat, security vulnerabilities

## Sourcing
- **Tool:** Apollo Organization Search (city + employee range filters)
- **Detection:** Custom async WordPress scanner (`detect_wordpress.py`)
- **Signals checked:** wp-content in HTML, wp-json API, meta generator tag, wp-login.php
- **Confidence threshold:** >= 40 (at least one strong signal)
- **Target:** 50 confirmed WordPress accounts

## Angles
1. **WordPress Performance** - "Your site loads in Xs. Next.js sites load in <1s."
2. **Next.js Migration** - "Same content, 10x faster. We handle the migration."

## Phases
1. **Sourcing** (this phase) - Apollo discover + WP detection + Supabase store
2. **NYC expansion** - Same script, `--city "New York, NY"`, 50 more
3. **Enhanced gap analysis** - PageSpeed, mobile, SEO scoring per WP site
4. **Landing pages** - Custom `/for/{slug}` pages showing "what your site could look like"
5. **Outreach** - Maildoso/Lemlist with site-specific issues as hooks

## Scripts
- `scripts/abm/detect_wordpress.py` - Async WP detection module
- `scripts/abm/source_wp_migration.py` - Full sourcing pipeline
- `scripts/abm/pipeline.py` - Orchestrator (`--step source_wp`)

## Verification
```sql
-- Count accounts tagged wp-migration-miami
SELECT count(*) FROM accounts WHERE tags @> '["wp-migration-miami"]';

-- Spot check domains
SELECT domain, tech_stack, exa_research->'wp_detection'->'confidence'
FROM accounts WHERE tags @> '["wp-migration-miami"]' LIMIT 10;

-- All WP migration accounts
SELECT domain, tech_stack, source, tags
FROM accounts WHERE source = 'apollo_wp_migration' ORDER BY created_at DESC;
```
