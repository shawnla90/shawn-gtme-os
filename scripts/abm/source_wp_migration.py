#!/usr/bin/env python3
"""WordPress migration sourcing - discover SMBs on WordPress via Apollo + async detection.

Three phases:
  1. Discover - Apollo org search by city + employee range, optional WP tech filter
  2. Detect   - Async WordPress detection via detect_wordpress.scan_batch()
  3. Store    - Upsert confirmed WP accounts into Supabase with segment tagging

Usage:
  python3 scripts/abm/source_wp_migration.py --city "Miami, FL" --limit 50 --dry-run
  python3 scripts/abm/source_wp_migration.py --city "New York, NY" --limit 50
"""

import argparse
import asyncio
import json
import os
import sys
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import (
    APOLLO_BASE,
    get_apollo_headers,
    api_request,
)
from db_supabase import get_supabase, get_all_supabase_domains
from name_validation import is_junk_domain, is_valid_company_name
from detect_wordpress import scan_batch

# City -> segment slug mapping
CITY_SEGMENTS = {
    'Miami, FL': 'wp-migration-miami',
    'New York, NY': 'wp-migration-nyc',
}

EMPLOYEE_RANGES = ['11_50', '51_100']
SOURCE_TAG = 'apollo_wp_migration'


def _segment_for_city(city):
    """Return segment slug for a city, or generate one."""
    if city in CITY_SEGMENTS:
        return CITY_SEGMENTS[city]
    slug = city.lower().split(',')[0].strip().replace(' ', '-')
    return f'wp-migration-{slug}'


def _city_name(city):
    """Extract plain city name from 'City, ST' format."""
    return city.split(',')[0].strip()


def discover_apollo(city, limit, existing_domains):
    """Search Apollo for companies in target city by employee range.

    First pass: with wordpress_org technographic filter.
    Second pass: broader search without tech filter to fill remaining slots.
    """
    companies = []
    seen_domains = set()
    headers = get_apollo_headers()

    def _search(employee_range, tech_filter=False, page_limit=5):
        """Run a single Apollo org search, return list of company dicts."""
        found = []
        page = 1

        while page <= page_limit and (len(companies) + len(found)) < limit:
            payload = {
                'organization_locations': [city],
                'organization_num_employees_ranges': [employee_range],
                'page': page,
                'per_page': 25,
            }

            if tech_filter:
                payload['currently_using_any_of_technology_uids'] = ['wordpress_org']

            try:
                resp = api_request(
                    'POST',
                    f'{APOLLO_BASE}/mixed_companies/search',
                    json=payload,
                    headers=headers,
                )
                resp.raise_for_status()
                data = resp.json()
                orgs = data.get('organizations', [])

                if not orgs:
                    break

                for org in orgs:
                    domain = (org.get('primary_domain') or '').strip().lower()
                    name = org.get('name', '')

                    if not domain:
                        continue
                    if domain in seen_domains or domain in existing_domains:
                        continue
                    if is_junk_domain(domain):
                        continue
                    if not is_valid_company_name(name):
                        continue

                    seen_domains.add(domain)
                    found.append({
                        'name': name,
                        'domain': domain,
                        'employee_count': org.get('estimated_num_employees'),
                        'industry': org.get('industry', ''),
                        'description': (org.get('short_description') or '')[:500],
                        'city': org.get('city', ''),
                        'state': org.get('state', ''),
                        'country': org.get('country', ''),
                        'apollo_id': org.get('id', ''),
                        'tech_stack': ', '.join((org.get('technology_names') or [])[:20]),
                        'had_wp_technographic': tech_filter,
                    })

                page += 1
                time.sleep(0.5)

            except Exception as e:
                print(f"    [!] Apollo search failed (page {page}): {e}")
                break

        return found

    # Pass 1: With WordPress technographic filter
    print("  Pass 1: Apollo search with WordPress tech filter...")
    for emp_range in EMPLOYEE_RANGES:
        if len(companies) >= limit:
            break
        batch = _search(emp_range, tech_filter=True, page_limit=5)
        companies.extend(batch)
        print(f"    {emp_range}: {len(batch)} found")

    remaining = limit - len(companies)

    # Pass 2: Broader search without tech filter
    if remaining > 0:
        print(f"\n  Pass 2: Broader search (need {remaining} more)...")
        for emp_range in EMPLOYEE_RANGES:
            if len(companies) >= limit:
                break
            batch = _search(emp_range, tech_filter=False, page_limit=10)
            companies.extend(batch)
            print(f"    {emp_range}: {len(batch)} found")

    return companies[:limit * 3]  # Over-discover since detection will filter


def detect_phase(companies):
    """Run async WordPress detection on all company domains.

    Returns (wp_confirmed, wp_results_map)
    """
    domains = [c['domain'] for c in companies]
    print(f"\n  Scanning {len(domains)} domains for WordPress...")

    results = asyncio.run(scan_batch(domains))

    # Build lookup map
    results_map = {r['domain']: r for r in results}

    wp_confirmed = []
    for company in companies:
        detection = results_map.get(company['domain'], {})
        if detection.get('is_wordpress'):
            company['_wp_detection'] = detection
            wp_confirmed.append(company)

    return wp_confirmed, results_map


def store_phase(sb, companies, segment, city, dry_run=False):
    """Upsert confirmed WordPress accounts into Supabase."""
    saved = 0

    for company in companies:
        wp_det = company.get('_wp_detection', {})

        # Build exa_research JSONB with wp_detection nested
        exa_research = {
            'wp_detection': {
                'confidence': wp_det.get('confidence', 0),
                'signals': wp_det.get('signals', {}),
                'scanned_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            }
        }

        emp = company.get('employee_count')
        size = ''
        if emp:
            if emp <= 10: size = '1-10'
            elif emp <= 50: size = '11-50'
            elif emp <= 100: size = '51-100'
            elif emp <= 200: size = '51-200'
            else: size = '200+'

        geography = ', '.join(filter(None, [
            company.get('city', ''),
            company.get('state', ''),
            company.get('country', ''),
        ]))

        account_data = {
            'name': company['name'],
            'domain': company['domain'],
            'source': SOURCE_TAG,
            'stage': 'prospect',
            'tags': [segment],
            'exa_research': exa_research,
            'industry': company.get('industry', ''),
            'employee_count': emp if emp else None,
            'tech_stack': 'WordPress',
            'description': company.get('description', ''),
            'geography': geography,
            'apollo_id': company.get('apollo_id', ''),
            'size': size,
        }

        if dry_run:
            signals = [k for k, v in wp_det.get('signals', {}).items() if v]
            print(f"    [DRY RUN] {company['name']:<35} {company['domain']:<30} "
                  f"conf={wp_det.get('confidence', 0):>3}  {', '.join(signals)}")
            saved += 1
            continue

        try:
            result = sb.table('accounts').upsert(
                account_data, on_conflict='domain'
            ).execute()
            if result.data:
                saved += 1
                print(f"    [ok] {company['name']:<35} {company['domain']}")
            else:
                print(f"    [!] Failed to upsert {company['domain']}")
        except Exception as e:
            print(f"    [!] Supabase error for {company['domain']}: {e}")

    return saved


def run(city='Miami, FL', limit=50, dry_run=False):
    """Main entry point for WordPress migration sourcing."""
    segment = _segment_for_city(city)
    city_name = _city_name(city)

    print(f"\n{'=' * 60}")
    print(f"  WordPress Migration Sourcing {'(DRY RUN)' if dry_run else ''}")
    print(f"  City: {city} | Segment: {segment}")
    print(f"  Target: {limit} confirmed WordPress accounts")
    print(f"{'=' * 60}\n")

    sb = get_supabase()

    # Get existing domains to skip
    existing_domains = get_all_supabase_domains(sb)

    # Check which domains already have our segment tag
    all_accounts = sb.table('accounts').select('domain, tags, source').not_.is_('domain', 'null').execute()
    existing_in_segment = set()
    other_source_domains = set()
    for row in (all_accounts.data or []):
        d = (row.get('domain') or '').lower()
        if not d:
            continue
        tags = row.get('tags') or []
        if segment in tags:
            existing_in_segment.add(d)
        elif row.get('source') and row['source'] != SOURCE_TAG:
            other_source_domains.add(d)

    print(f"  {len(existing_domains)} total accounts in Supabase")
    print(f"  {len(existing_in_segment)} already tagged '{segment}'")
    print(f"  {len(other_source_domains)} from other sources (will skip)\n")

    # Combine skip sets: already tagged + already from other sources
    skip_domains = existing_in_segment | other_source_domains

    # Phase 1: Discover
    print("  --- Phase 1: Discovery (Apollo) ---\n")
    raw_companies = discover_apollo(city, limit, skip_domains)
    print(f"\n  Discovered {len(raw_companies)} candidate companies\n")

    if not raw_companies:
        print("  No new companies found. Exiting.")
        return 0

    # Phase 2: Detect WordPress
    print("  --- Phase 2: WordPress Detection ---\n")
    wp_confirmed, results_map = detect_phase(raw_companies)
    not_wp = len(raw_companies) - len(wp_confirmed)
    unreachable = sum(1 for r in results_map.values() if r.get('error'))

    print(f"\n  Results:")
    print(f"    Confirmed WordPress: {len(wp_confirmed)}")
    print(f"    Not WordPress:       {not_wp - unreachable}")
    print(f"    Unreachable:         {unreachable}")

    if not wp_confirmed:
        print("\n  No WordPress sites confirmed. Exiting.")
        return 0

    # Cap to limit
    wp_confirmed = wp_confirmed[:limit]

    # Phase 3: Store
    print(f"\n  --- Phase 3: Store ({len(wp_confirmed)} accounts) ---\n")
    saved = store_phase(sb, wp_confirmed, segment, city_name, dry_run=dry_run)

    # Summary
    print(f"\n{'=' * 60}")
    print(f"  SUMMARY {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"  City:               {city}")
    print(f"  Segment:            {segment}")
    print(f"  Discovered:         {len(raw_companies)}")
    print(f"  WordPress confirmed:{len(wp_confirmed)}")
    print(f"  Saved/would save:   {saved}")
    print(f"{'=' * 60}\n")

    return saved


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Source WordPress sites for migration campaign')
    parser.add_argument('--city', default='Miami, FL', help='Target city (e.g. "Miami, FL")')
    parser.add_argument('--limit', type=int, default=50, help='Target number of accounts')
    parser.add_argument('--dry-run', action='store_true', help='Preview without inserting')
    args = parser.parse_args()
    run(city=args.city, limit=args.limit, dry_run=args.dry_run)
