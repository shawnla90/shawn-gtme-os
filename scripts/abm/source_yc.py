#!/usr/bin/env python3
"""YC company sourcing - discover, enrich, and qualify Y Combinator alumni.

Finds YC companies matching our ICP (Series A-B, 30-200 employees, B2B),
enriches via Exa + Apollo, verifies emails via Prospeo, and inserts
qualified accounts into Supabase with segment='yc-growth'.

Void rule: if a company can't produce at least 1 contact with valid email,
first_name, last_name, title, and linkedin_url, it's skipped entirely.

Usage:
  python3 scripts/abm/source_yc.py --limit 200 --dry-run
  python3 scripts/abm/source_yc.py --limit 50
"""

import argparse
import json
import os
import sys
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import (
    APOLLO_BASE, PROSPEO_BASE,
    get_exa_client, get_apollo_headers, get_prospeo_headers,
    api_request,
)
from db_supabase import get_supabase
from name_validation import is_junk_domain, is_valid_company_name
from title_filter import is_relevant_title

SEGMENT = 'yc-growth'

# YC-specific search queries for Exa
YC_SEARCH_QUERIES = [
    "Y Combinator company Series A B2B SaaS",
    "YC batch company raised Series A sales team",
    "Y Combinator alumni startup Series A growth",
    "YC startup B2B software series A funding",
    "Y Combinator graduate enterprise software company",
    "YC company B2B SaaS scaling sales operations",
    "Y Combinator alumni series B growth stage",
    "YC startup revenue operations sales development",
]

# Exa deep research queries per company
DEEP_QUERIES = [
    "{company} company overview about team",
    "{company} {domain} funding valuation investors",
    "{company} hiring jobs sales marketing growth",
    "{company} {domain} technology product features",
]

TARGET_SENIORITY = ["vp", "director", "manager", "founder", "c_suite"]
CONTACTS_PER_COMPANY = 3


def get_existing_domains(sb):
    """Return set of domains already in Supabase."""
    result = sb.table('accounts').select('domain').not_.is_('domain', 'null').execute()
    return {row['domain'].lower() for row in (result.data or []) if row.get('domain')}


def discover_yc_companies(exa, existing_domains, limit=500):
    """Search Exa for YC companies matching ICP."""
    companies = []
    seen_domains = set()
    filtered = 0
    per_query = max(limit // len(YC_SEARCH_QUERIES), 15)

    for query in YC_SEARCH_QUERIES:
        if len(companies) >= limit:
            break

        print(f"  Searching: {query[:60]}...")
        try:
            results = exa.search(
                query,
                num_results=per_query,
                category="company",
                contents=False,
            )

            for r in results.results:
                url = getattr(r, 'url', '') or ''
                domain = url.replace('https://', '').replace('http://', '').split('/')[0]
                title = getattr(r, 'title', '') or domain

                # Skip junk
                if is_junk_domain(domain):
                    filtered += 1
                    continue
                if not is_valid_company_name(title):
                    filtered += 1
                    continue

                domain_lower = domain.lower()
                # Skip already in Supabase or seen this run
                if domain_lower in existing_domains or domain_lower in seen_domains:
                    continue

                seen_domains.add(domain_lower)
                companies.append({
                    'title': title,
                    'domain': domain,
                    'url': url,
                    'snippet': (getattr(r, 'text', '') or '')[:500],
                })

            time.sleep(1)
        except Exception as e:
            print(f"  [!] Search failed: {e}")
            time.sleep(2)

    if filtered:
        print(f"  Filtered {filtered} junk results")
    return companies[:limit]


def research_company(exa, company):
    """Deep research a single company via Exa."""
    research = {
        'domain': company['domain'],
        'name': company['title'],
        'initial_snippet': company.get('snippet', ''),
        'deep_research': [],
    }

    for query_template in DEEP_QUERIES:
        query = query_template.format(
            company=company['title'],
            domain=company['domain'],
        )
        try:
            results = exa.search(query, num_results=3)
            for r in results.results:
                research['deep_research'].append({
                    'query': query,
                    'title': getattr(r, 'title', ''),
                    'url': getattr(r, 'url', ''),
                    'text': (getattr(r, 'text', '') or '')[:1000],
                })
            time.sleep(0.5)
        except Exception as e:
            print(f"    [!] Deep research failed: {e}")
            time.sleep(1)

    return research


def find_contacts(domain):
    """Find GTM contacts at a company via Apollo."""
    payload = {
        'q_organization_domains': domain,
        'person_seniorities': TARGET_SENIORITY,
        'page': 1,
        'per_page': 10,
    }

    try:
        resp = api_request(
            'POST',
            f'{APOLLO_BASE}/mixed_people/api_search',
            json=payload,
            headers=get_apollo_headers(),
        )
        resp.raise_for_status()
        data = resp.json()
        people = data.get('people', [])

        # Filter by title relevance and required fields
        valid = []
        for person in people:
            title = person.get('title', '')
            if not is_relevant_title(title):
                continue
            if not person.get('first_name') or not person.get('last_name'):
                continue
            valid.append(person)
            if len(valid) >= CONTACTS_PER_COMPANY:
                break

        return valid

    except Exception as e:
        print(f"    [!] Apollo search failed: {e}")
        return []


def verify_email_prospeo(email):
    """Verify a single email via Prospeo. Returns status string."""
    try:
        resp = api_request(
            'POST',
            f'{PROSPEO_BASE}/email-verifier',
            json={'email': email},
            headers=get_prospeo_headers(),
        )
        if resp.status_code == 200:
            data = resp.json()
            response = data.get('response', {})
            status = response.get('status', 'unknown').lower().strip()
            if status in ('valid', 'invalid', 'catch-all', 'unknown'):
                return status
        return 'unknown'
    except Exception:
        return 'unknown'


def extract_org_data(person):
    """Extract organization data from Apollo person response."""
    org = person.get('organization', {})
    if not org:
        return {}
    return {
        'industry': org.get('industry', ''),
        'employee_count': org.get('estimated_num_employees'),
        'funding': org.get('total_funding_printed', ''),
        'funding_stage': org.get('latest_funding_stage', ''),
        'tech_stack': ', '.join((org.get('technology_names') or [])[:20]),
        'description': org.get('short_description', ''),
        'founded_year': org.get('founded_year'),
        'geography': ', '.join(filter(None, [
            org.get('city', ''),
            org.get('state', ''),
            org.get('country', ''),
        ])),
        'apollo_id': org.get('id', ''),
    }


def save_account_and_contacts(sb, company, research, contacts, org_data):
    """Insert account + contacts into Supabase with segment tag."""
    emp = org_data.get('employee_count')
    size = ''
    if emp:
        if emp <= 10: size = '1-10'
        elif emp <= 50: size = '11-50'
        elif emp <= 200: size = '51-200'
        elif emp <= 500: size = '201-500'
        elif emp <= 1000: size = '501-1000'
        else: size = '1000+'

    account_data = {
        'name': company['title'],
        'domain': company['domain'],
        'source': 'yc_sourcing',
        'stage': 'prospect',
        'segment': SEGMENT,
        'exa_research': research,
        'industry': org_data.get('industry', ''),
        'employee_count': str(emp) if emp else '',
        'tech_stack': org_data.get('tech_stack', ''),
        'funding': org_data.get('funding', ''),
        'funding_stage': org_data.get('funding_stage', ''),
        'description': org_data.get('description', ''),
        'founded_year': org_data.get('founded_year'),
        'geography': org_data.get('geography', ''),
        'apollo_id': org_data.get('apollo_id', ''),
        'size': size,
    }

    # Upsert account
    result = sb.table('accounts').upsert(
        account_data, on_conflict='domain'
    ).execute()
    account_id = result.data[0]['id'] if result.data else None

    if not account_id:
        return None

    # Insert contacts
    for i, person in enumerate(contacts):
        contact_data = {
            'account_id': account_id,
            'first_name': person.get('first_name', ''),
            'last_name': person.get('last_name', ''),
            'email': person.get('email', ''),
            'title': person.get('title', ''),
            'linkedin_url': person.get('linkedin_url', ''),
            'apollo_id': person.get('id', ''),
            'source': 'yc_sourcing',
            'is_primary': (i == 0),
            'email_status': person.get('_email_status', ''),
        }

        try:
            sb.table('contacts').upsert(
                contact_data, on_conflict='apollo_id'
            ).execute()
        except Exception as e:
            # Fallback: insert without conflict resolution
            try:
                sb.table('contacts').insert(contact_data).execute()
            except Exception:
                print(f"    [!] Failed to save contact: {person.get('first_name')} {person.get('last_name')}")

    return account_id


def run(limit=200, dry_run=False):
    """Main entry point for YC company sourcing."""
    print(f"\n{'=' * 60}")
    print(f"  YC Company Sourcing {'(DRY RUN)' if dry_run else ''}")
    print(f"  Target: {limit} qualified accounts")
    print(f"  Segment: {SEGMENT}")
    print(f"{'=' * 60}\n")

    exa = get_exa_client()
    sb = get_supabase()

    # Get existing domains to avoid duplicates
    existing_domains = get_existing_domains(sb)
    print(f"  {len(existing_domains)} existing accounts in Supabase\n")

    # Phase 1: Discover YC companies
    print("  --- Discovery Phase ---\n")
    raw_companies = discover_yc_companies(exa, existing_domains, limit=limit * 3)
    print(f"\n  Found {len(raw_companies)} candidate companies\n")

    if not raw_companies:
        print("  No new companies found. Exiting.")
        return 0

    # Phase 2: Enrich, contact discovery, verify, insert
    print("  --- Enrichment Phase ---\n")
    qualified = 0
    voided = 0
    api_calls = {'exa': 0, 'apollo': 0, 'prospeo': 0}

    for i, company in enumerate(raw_companies):
        if qualified >= limit:
            break

        print(f"  [{i+1}/{len(raw_companies)}] {company['title']} ({company['domain']})")

        # Step 1: Deep research via Exa
        research = research_company(exa, company)
        api_calls['exa'] += len(DEEP_QUERIES)

        # Step 2: Find contacts via Apollo
        contacts = find_contacts(company['domain'])
        api_calls['apollo'] += 1

        if not contacts:
            print(f"    [void] No relevant contacts found")
            voided += 1
            time.sleep(0.5)
            continue

        # Step 3: Verify emails via Prospeo
        valid_contacts = []
        for person in contacts:
            email = person.get('email', '')
            if not email:
                continue

            status = verify_email_prospeo(email)
            api_calls['prospeo'] += 1
            person['_email_status'] = status

            if status == 'invalid':
                print(f"    [skip] {person['first_name']} {person['last_name']} - email invalid")
                continue

            # Must have all required fields
            if (person.get('first_name') and person.get('last_name') and
                    person.get('email') and person.get('title')):
                valid_contacts.append(person)

            time.sleep(0.3)  # Prospeo rate limit

        if not valid_contacts:
            print(f"    [void] No contacts with valid email")
            voided += 1
            time.sleep(0.5)
            continue

        # Extract org data from first contact's Apollo response
        org_data = extract_org_data(valid_contacts[0])

        if dry_run:
            print(f"    [DRY RUN] Would insert with {len(valid_contacts)} contacts")
            for c in valid_contacts:
                print(f"      + {c['first_name']} {c['last_name']} - {c['title']} ({c['_email_status']})")
            qualified += 1
            continue

        # Step 4: Save to Supabase
        account_id = save_account_and_contacts(
            sb, company, research, valid_contacts, org_data
        )

        if account_id:
            qualified += 1
            print(f"    [ok] Saved with {len(valid_contacts)} contacts (account_id={account_id})")
            for c in valid_contacts:
                print(f"      + {c['first_name']} {c['last_name']} - {c['title']} ({c['_email_status']})")
        else:
            print(f"    [!] Failed to save account")
            voided += 1

        time.sleep(0.5)

    # Summary
    print(f"\n{'=' * 60}")
    print(f"  SUMMARY {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"  Raw candidates:     {len(raw_companies)}")
    print(f"  Qualified:          {qualified}")
    print(f"  Voided:             {voided}")
    print(f"  API calls:")
    print(f"    Exa:              {api_calls['exa']}")
    print(f"    Apollo:           {api_calls['apollo']}")
    print(f"    Prospeo:          {api_calls['prospeo']}")
    print(f"{'=' * 60}\n")

    return qualified


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Source YC companies for ABM pipeline')
    parser.add_argument('--limit', type=int, default=200, help='Target qualified accounts')
    parser.add_argument('--dry-run', action='store_true', help='Preview without inserting')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run)
