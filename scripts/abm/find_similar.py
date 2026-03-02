#!/usr/bin/env python3
"""
Exa find_similar() account discovery - finds lookalike companies
seeded from best-performing accounts.

Usage:
  python3 scripts/abm/find_similar.py --limit 20 --dry-run
  python3 scripts/abm/find_similar.py --limit 10 --seed replied
  python3 scripts/abm/find_similar.py --limit 10 --seed viewed
  python3 scripts/abm/find_similar.py --limit 10 --seed best  (default)
"""

import argparse
import json
import os
import sys
import time

import requests

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import get_exa_client
from db_supabase import get_supabase
from name_validation import is_junk_domain, is_valid_company_name

# ICP scoring signals
POSITIVE_SIGNALS = {
    'saas': 15, 'b2b': 15, 'software': 10, 'platform': 10,
    'series a': 10, 'series b': 10, 'series c': 10, 'funding': 10,
    'sales': 10, 'revenue': 10, 'growth': 10, 'scaling': 10,
    'outbound': 8, 'pipeline': 8, 'demand gen': 8,
    'marketing automation': 8, 'crm': 8,
}
NEGATIVE_SIGNALS = {
    'enterprise': -10, 'government': -10, 'nonprofit': -10,
    'consulting firm': -8, 'agency': -5,
}


def get_exa():
    return get_exa_client()


def get_seed_urls(sb, seed_type='best'):
    """Get seed URLs from best-performing accounts."""
    urls = []

    if seed_type in ('replied', 'best'):
        result = sb.table('accounts').select('domain').eq(
            'outreach_status', 'replied'
        ).not_.is_('domain', 'null').execute()
        urls.extend([f'https://{r["domain"]}' for r in (result.data or [])])

    if seed_type in ('viewed', 'best'):
        # Accounts with page views (landing_pages with views > 0)
        result = sb.table('landing_pages').select(
            'accounts!inner(domain)'
        ).gt('views', 0).execute()
        for row in (result.data or []):
            domain = row.get('accounts', {}).get('domain')
            if domain:
                urls.append(f'https://{domain}')

    # Deduplicate
    return list(dict.fromkeys(urls))


def score_company(text):
    """Score a company snippet against ICP signals."""
    text_lower = (text or '').lower()
    score = 50  # Base score

    for signal, points in POSITIVE_SIGNALS.items():
        if signal in text_lower:
            score += points

    for signal, points in NEGATIVE_SIGNALS.items():
        if signal in text_lower:
            score += points  # points are already negative

    return max(0, min(100, score))


def firecrawl_enrich(domain):
    """Deep-scrape a domain with Firecrawl for extra signals."""
    api_key = os.environ.get('FIRECRAWL_API_KEY', '')
    if not api_key:
        return None

    try:
        resp = requests.post(
            'https://api.firecrawl.dev/v1/scrape',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
            },
            json={'url': f'https://{domain}', 'formats': ['markdown']},
            timeout=30,
        )
        if resp.status_code == 200:
            data = resp.json().get('data', {})
            return {
                'markdown': (data.get('markdown') or '')[:2000],
                'metadata': data.get('metadata', {}),
            }
    except Exception:
        pass
    return None


def run(limit=20, seed='best', dry_run=False):
    """Find similar companies using Exa find_similar()."""
    print(f"\n[Find Similar] {'DRY RUN - ' if dry_run else ''}Seed: {seed}, Limit: {limit}\n")

    exa = get_exa()
    sb = get_supabase()

    # Get seed URLs
    seed_urls = get_seed_urls(sb, seed)
    if not seed_urls:
        print("  No seed accounts found. Need replied or viewed accounts first.")
        print("  Falling back to all qualified accounts as seeds...")
        result = sb.table('accounts').select('domain').not_.is_(
            'domain', 'null'
        ).order('icp_score', desc=True).limit(20).execute()
        seed_urls = [f'https://{r["domain"]}' for r in (result.data or [])]

    if not seed_urls:
        print("  No seed URLs available at all. Run the pipeline first.")
        return 0

    print(f"  Using {len(seed_urls)} seed URLs")
    for url in seed_urls[:5]:
        print(f"    {url}")
    if len(seed_urls) > 5:
        print(f"    ... and {len(seed_urls) - 5} more")

    # Get existing domains to deduplicate
    existing = sb.table('accounts').select('domain').execute()
    existing_domains = {r['domain'] for r in (existing.data or []) if r.get('domain')}
    print(f"  {len(existing_domains)} existing accounts to deduplicate against\n")

    # Call find_similar
    discovered = []
    try:
        results = exa.find_similar(
            url=seed_urls[0] if len(seed_urls) == 1 else seed_urls[0],
            num_results=limit * 3,  # Over-fetch to account for dedup
            exclude_domains=list(existing_domains)[:100],  # API may have limit
        )

        for r in results.results:
            url = getattr(r, 'url', '') or ''
            domain = url.replace('https://', '').replace('http://', '').split('/')[0]
            title = getattr(r, 'title', '') or domain
            text = getattr(r, 'text', '') or ''

            if not domain or domain in existing_domains:
                continue

            # Skip junk domains and invalid company names
            if is_junk_domain(domain):
                continue
            if not is_valid_company_name(title):
                # Fallback: use cleaned domain as name
                title = domain.split('.')[0].title()
                if not is_valid_company_name(title):
                    continue

            icp_score = score_company(f'{title} {text}')
            existing_domains.add(domain)  # Prevent dups within this run

            discovered.append({
                'domain': domain,
                'name': title,
                'text': text[:500],
                'icp_score': icp_score,
            })

    except Exception as e:
        print(f"  [!] Exa find_similar failed: {e}")
        return 0

    # Sort by ICP score
    discovered.sort(key=lambda x: x['icp_score'], reverse=True)
    discovered = discovered[:limit]

    print(f"  Discovered {len(discovered)} new companies\n")

    inserted = 0
    for i, company in enumerate(discovered):
        print(f"  [{i+1}/{len(discovered)}] {company['name']} ({company['domain']}) - ICP: {company['icp_score']}")

        if dry_run:
            continue

        # Firecrawl enrichment (if key available)
        firecrawl_data = None
        if os.environ.get('FIRECRAWL_API_KEY'):
            firecrawl_data = firecrawl_enrich(company['domain'])
            if firecrawl_data:
                print(f"    + Firecrawl enrichment OK")
            time.sleep(1)

        # Build exa_research with discovery data + firecrawl
        exa_research = {
            'discovery': {
                'source': 'exa_similar',
                'snippet': company['text'],
            },
        }
        if firecrawl_data:
            exa_research['firecrawl'] = firecrawl_data

        sb.table('accounts').upsert({
            'name': company['name'],
            'domain': company['domain'],
            'source': 'exa_similar',
            'stage': 'prospect',
            'icp_score': company['icp_score'],
            'exa_research': exa_research,
        }, on_conflict='domain').execute()

        inserted += 1
        time.sleep(0.5)

    print(f"\n  Done. {inserted} new accounts {'would be ' if dry_run else ''}inserted.")
    return inserted


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Discover lookalike companies via Exa find_similar()')
    parser.add_argument('--limit', type=int, default=20, help='Max companies to discover')
    parser.add_argument('--seed', choices=['replied', 'viewed', 'best'], default='best',
                        help='Seed type: replied, viewed, or best (union)')
    parser.add_argument('--dry-run', action='store_true', help='Preview without inserting')
    args = parser.parse_args()
    run(limit=args.limit, seed=args.seed, dry_run=args.dry_run)
