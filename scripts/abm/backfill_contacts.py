#!/usr/bin/env python3
"""Backfill contacts and accounts via Apollo People Match API.

Re-enriches existing contacts that have apollo_id but missing email/last_name/linkedin.
Also enriches the parent account with org data (industry, employee_count, funding, tech_stack).

Each API call returns both person AND organization data, so we get contact + account
enrichment in a single credit.

Usage:
  python3 scripts/abm/backfill_contacts.py --limit 10 --dry-run
  python3 scripts/abm/backfill_contacts.py --limit 50
  python3 scripts/abm/backfill_contacts.py --all
"""

import argparse
import os
import sys
import time

import requests

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import APOLLO_BASE as APOLLO_BASE_URL, get_apollo_headers, api_request
from db_supabase import get_supabase
from title_filter import is_relevant_title


def apollo_people_match(apollo_id, first_name=None, domain=None):
    """Enrich a single person via Apollo People Match endpoint."""
    payload = {'id': apollo_id}
    if first_name:
        payload['first_name'] = first_name
    if domain:
        payload['domain'] = domain

    try:
        resp = api_request(
            'POST',
            f'{APOLLO_BASE_URL}/people/match',
            json=payload,
            headers=get_apollo_headers(),
        )

        if resp.status_code == 404:
            return None

        resp.raise_for_status()
        return resp.json()

    except Exception as e:
        print(f"    [!] Apollo match failed: {e}")
        return None


def update_contact(sb, contact_id, person_data):
    """Update a contact with enriched Apollo data."""
    updates = {}

    last_name = person_data.get('last_name', '')
    if last_name:
        updates['last_name'] = last_name

    email = person_data.get('email', '')
    if email:
        updates['email'] = email

    linkedin = person_data.get('linkedin_url', '')
    if linkedin:
        updates['linkedin_url'] = linkedin

    # Update title if Apollo has a newer one
    title = person_data.get('title', '')
    if title:
        updates['title'] = title

    if not updates:
        return False

    sb.table('contacts').update(updates).eq('id', contact_id).execute()
    return True


def update_account(sb, account_id, org_data):
    """Update an account with enriched Apollo org data."""
    if not org_data:
        return False

    updates = {}

    industry = org_data.get('industry', '')
    if industry:
        updates['industry'] = industry

    employees = org_data.get('estimated_num_employees')
    if employees:
        updates['employee_count'] = employees

    funding = org_data.get('total_funding_printed', '')
    if funding:
        updates['funding'] = funding

    # Build tech stack string from technology names
    tech_names = org_data.get('technology_names', [])
    if tech_names:
        updates['tech_stack'] = ', '.join(tech_names[:20])

    # Store Apollo org ID
    apollo_org_id = org_data.get('id', '')
    if apollo_org_id:
        updates['apollo_id'] = apollo_org_id

    # Additional Apollo fields (Phase 2 - signal layer)
    funding_stage = org_data.get('latest_funding_stage', '')
    if funding_stage:
        updates['funding_stage'] = funding_stage

    annual_revenue = org_data.get('annual_revenue_printed', '')
    if annual_revenue:
        updates['annual_revenue'] = annual_revenue

    latest_funding_date = org_data.get('latest_funding_round_date', '')
    if latest_funding_date:
        updates['latest_funding_date'] = latest_funding_date

    founded_year = org_data.get('founded_year')
    if founded_year:
        updates['founded_year'] = int(founded_year)

    short_desc = org_data.get('short_description', '')
    if short_desc:
        updates['description'] = short_desc

    # Geography from org address
    city = org_data.get('city', '')
    state = org_data.get('state', '')
    country = org_data.get('country', '')
    geo_parts = [p for p in [city, state, country] if p]
    if geo_parts:
        updates['geography'] = ', '.join(geo_parts)

    # Size bucket
    if employees:
        if employees <= 10:
            updates['size'] = '1-10'
        elif employees <= 50:
            updates['size'] = '11-50'
        elif employees <= 200:
            updates['size'] = '51-200'
        elif employees <= 500:
            updates['size'] = '201-500'
        elif employees <= 1000:
            updates['size'] = '501-1000'
        else:
            updates['size'] = '1000+'

    if not updates:
        return False

    sb.table('accounts').update(updates).eq('id', account_id).execute()
    return True


def run(limit=10, dry_run=False, enrich_all=False, skip_title_check=False):
    """Main backfill: re-enrich contacts via Apollo, update accounts too."""
    print(f"\n{'=' * 60}")
    print(f"  Contact & Account Backfill via Apollo {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}\n")

    sb = get_supabase()

    # Get contacts that need enrichment (have apollo_id, missing email or last_name)
    query = sb.table('contacts').select(
        'id, account_id, first_name, last_name, email, title, apollo_id, linkedin_url'
    ).not_.is_('apollo_id', 'null')

    if not enrich_all:
        # Only contacts with missing critical fields
        query = query.or_('email.eq.,last_name.eq.,linkedin_url.eq.')

    result = query.order('id').limit(limit).execute()
    contacts = result.data or []

    if not contacts:
        print("  No contacts need enrichment.")
        return 0

    print(f"  Found {len(contacts)} contacts to enrich\n")

    enriched = 0
    skipped_title = 0
    accounts_enriched = set()
    credits_used = 0

    for i, contact in enumerate(contacts):
        contact_id = contact['id']
        account_id = contact['account_id']
        first_name = contact.get('first_name', '')
        apollo_id = contact.get('apollo_id', '')
        current_title = contact.get('title', '')

        # Get account domain for better matching
        acct = sb.table('accounts').select('domain, name, industry').eq(
            'id', account_id
        ).single().execute()
        domain = acct.data.get('domain', '') if acct.data else ''
        company = acct.data.get('name', '') if acct.data else ''
        already_enriched = bool(acct.data.get('industry', '')) if acct.data else False

        print(f"  [{i + 1}/{len(contacts)}] {first_name} @ {company} ({domain})")

        if dry_run:
            print(f"    [DRY RUN] Would call Apollo people/match with id={apollo_id}")
            enriched += 1
            credits_used += 1
            continue

        # Call Apollo
        result = apollo_people_match(apollo_id, first_name=first_name, domain=domain)
        credits_used += 1

        if not result or 'person' not in result:
            print(f"    [!] No match from Apollo")
            time.sleep(0.5)
            continue

        person = result['person']
        org = person.get('organization', {})

        # Check title relevance
        new_title = person.get('title', current_title)
        if not skip_title_check and not is_relevant_title(new_title):
            print(f"    [flagged] Irrelevant title: {new_title}")
            skipped_title += 1
            sb.table('contacts').update({
                'notes': f'[auto-flagged] Irrelevant title: {new_title}',
            }).eq('id', contact_id).execute()

        # Update contact
        email = person.get('email', '')
        last_name = person.get('last_name', '')
        linkedin = person.get('linkedin_url', '')
        email_status = person.get('email_status', '')

        updated = update_contact(sb, contact_id, person)
        if updated:
            status_note = f" ({email_status})" if email_status else ""
            print(f"    + {first_name} {last_name} | {email}{status_note} | {linkedin}")
            enriched += 1
        else:
            print(f"    [skip] No new data from Apollo")

        # Update account (only once per account)
        if account_id not in accounts_enriched and not already_enriched and org:
            acct_updated = update_account(sb, account_id, org)
            if acct_updated:
                emp = org.get('estimated_num_employees', '?')
                ind = org.get('industry', '?')
                funding = org.get('total_funding_printed', '?')
                print(f"    + Account: {ind} | {emp} employees | {funding} funding")
                accounts_enriched.add(account_id)

        time.sleep(0.5)

    # Summary
    print(f"\n{'=' * 60}")
    print(f"  SUMMARY {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"  Contacts enriched:     {enriched}/{len(contacts)}")
    print(f"  Accounts enriched:     {len(accounts_enriched)}")
    print(f"  Irrelevant titles:     {skipped_title}")
    print(f"  Apollo credits used:   {credits_used}")
    print(f"{'=' * 60}\n")

    return enriched


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Backfill contacts via Apollo People Match')
    parser.add_argument('--limit', type=int, default=10, help='Max contacts to process')
    parser.add_argument('--dry-run', action='store_true', help='Preview without changes')
    parser.add_argument('--all', action='store_true', help='Re-enrich all contacts, not just missing')
    parser.add_argument('--skip-title-check', action='store_true', help='Skip title relevance filtering')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run, enrich_all=args.all, skip_title_check=args.skip_title_check)
