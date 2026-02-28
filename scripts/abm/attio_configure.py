#!/usr/bin/env python3
"""Configure Attio CRM: backfill custom attributes and populate Target Account List.

Tags ABM pipeline companies with source, stage, landing_page_url, outreach_status.
Tags non-ABM companies as Lead Alchemy.
Populates the Target Account List with ABM companies.
Sets source + vibe on people records.

Usage:
  python3 scripts/abm/attio_configure.py [--dry-run] [--limit 200]
"""

import argparse
import json
import os
import sys
import time

import requests

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

env_path = os.path.join(SCRIPT_DIR, '.env')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip())

from db_supabase import get_supabase

ATTIO_BASE = 'https://api.attio.com/v2'
TARGET_LIST_SLUG = 'target_account_list'


def attio_headers():
    token = os.environ.get('ATTIO_API_TOKEN', '')
    if not token:
        raise ValueError("ATTIO_API_TOKEN not set")
    return {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }


def attio_get(path):
    resp = requests.get(f'{ATTIO_BASE}{path}', headers=attio_headers(), timeout=30)
    resp.raise_for_status()
    return resp.json()


def attio_post(path, data):
    resp = requests.post(f'{ATTIO_BASE}{path}', json=data, headers=attio_headers(), timeout=30)
    if resp.status_code == 429:
        time.sleep(5)
        resp = requests.post(f'{ATTIO_BASE}{path}', json=data, headers=attio_headers(), timeout=30)
    return resp


def attio_put(path, data):
    resp = requests.put(f'{ATTIO_BASE}{path}', json=data, headers=attio_headers(), timeout=30)
    if resp.status_code == 429:
        time.sleep(5)
        resp = requests.put(f'{ATTIO_BASE}{path}', json=data, headers=attio_headers(), timeout=30)
    return resp


def attio_patch(path, data):
    resp = requests.patch(f'{ATTIO_BASE}{path}', json=data, headers=attio_headers(), timeout=30)
    if resp.status_code == 429:
        time.sleep(5)
        resp = requests.patch(f'{ATTIO_BASE}{path}', json=data, headers=attio_headers(), timeout=30)
    return resp


def get_all_attio_companies():
    """Fetch all companies from Attio using numeric offset pagination."""
    all_records = []
    offset = 0
    page_size = 100
    while True:
        payload = {'limit': page_size, 'offset': offset}
        resp = attio_post('/objects/companies/records/query', payload)
        resp.raise_for_status()
        data = resp.json()
        records = data.get('data', [])
        all_records.extend(records)
        if len(records) < page_size:
            break
        offset += page_size
        time.sleep(0.3)
    return all_records


def get_attio_domain(record):
    vals = record.get('values', {})
    domains = vals.get('domains', [])
    if domains:
        return domains[0].get('domain', '')
    return ''


def get_attio_name(record):
    vals = record.get('values', {})
    names = vals.get('name', [])
    if names:
        return names[0].get('value', '')
    return ''


def stage_map(supabase_stage):
    """Map Supabase stage to Attio stage label."""
    mapping = {
        'prospect': 'Prospect',
        'researched': 'Researched',
        'page_live': 'Page Live',
        'outreach': 'Outreach',
        'replied': 'Replied',
        'meeting': 'Meeting',
        'client': 'Client',
        'opted_out': 'Opted Out',
    }
    return mapping.get(supabase_stage, 'Prospect')


def outreach_map(status):
    mapping = {
        'new': 'New',
        'emailed': 'Emailed',
        'replied': 'Replied',
        'meeting': 'Meeting',
        'opted_out': 'Opted Out',
    }
    return mapping.get(status, 'New')


def update_company_attributes(record_id, source, stage=None, landing_page_url=None, outreach_status=None, dry_run=False):
    """Set custom attributes on a company record. Select values are plain strings."""
    values = {
        'source': source,
    }
    if stage:
        values['stage'] = stage
    if landing_page_url:
        values['landing_page_url'] = [{'value': landing_page_url}]
    if outreach_status:
        values['outreach_status'] = outreach_status

    if dry_run:
        print(f"    [DRY RUN] Would set: source={source}, stage={stage}, lp={landing_page_url}, outreach={outreach_status}")
        return True

    payload = {'data': {'values': values}}
    resp = attio_patch(f'/objects/companies/records/{record_id}', payload)
    if resp.status_code in (200, 201):
        return True
    else:
        print(f"    [!] Update failed ({resp.status_code}): {resp.text[:200]}")
        return False


def add_to_target_list(record_id, dry_run=False):
    """Add a company to the Target Account List."""
    if dry_run:
        print(f"    [DRY RUN] Would add to Target Account List")
        return True

    payload = {
        'data': {
            'parent_record_id': record_id,
            'parent_object': 'companies',
            'entry_values': {},
        }
    }
    resp = attio_post(f'/lists/{TARGET_LIST_SLUG}/entries', payload)
    if resp.status_code in (200, 201):
        return True
    elif resp.status_code == 409:
        return True
    else:
        print(f"    [!] List add failed ({resp.status_code}): {resp.text[:200]}")
        return False


def update_person_attributes(record_id, source, vibe=None, dry_run=False):
    """Set custom attributes on a person record."""
    values = {
        'source': source,
    }
    if vibe:
        values['contact_vibe'] = [{'value': vibe}]

    if dry_run:
        print(f"    [DRY RUN] Would set person: source={source}, vibe={vibe}")
        return True

    payload = {'data': {'values': values}}
    resp = attio_patch(f'/objects/people/records/{record_id}', payload)
    if resp.status_code in (200, 201):
        return True
    else:
        print(f"    [!] Person update failed ({resp.status_code}): {resp.text[:200]}")
        return False


def find_person_by_email(email):
    """Find a person record by email in Attio."""
    payload = {
        'filter': {
            'email_addresses': {'$eq': email}
        },
        'limit': 1,
    }
    resp = attio_post('/objects/people/records/query', payload)
    if resp.status_code == 200:
        records = resp.json().get('data', [])
        if records:
            return records[0]['id']['record_id']
    return None


def run(limit=500, dry_run=False):
    print(f"\n{'='*60}")
    print(f"  Attio CRM Configuration {'(DRY RUN)' if dry_run else ''}")
    print(f"{'='*60}\n")

    sb = get_supabase()

    # Step 1: Get all ABM accounts from Supabase
    print("[1/5] Loading Supabase accounts and landing pages...")
    accounts_result = sb.table('accounts').select(
        'id, name, domain, stage, outreach_status'
    ).not_.is_('domain', 'null').order('id').limit(limit).execute()
    accounts = accounts_result.data or []

    lps_result = sb.table('landing_pages').select('account_id, slug, url').execute()
    lp_map = {}
    for lp in (lps_result.data or []):
        lp_map[lp['account_id']] = lp

    abm_domains = {a['domain'].lower().strip() for a in accounts if a.get('domain')}
    print(f"  {len(accounts)} ABM accounts, {len(lps_result.data)} landing pages, {len(abm_domains)} unique domains\n")

    # Step 2: Get all Attio companies
    print("[2/5] Loading all Attio companies...")
    attio_companies = get_all_attio_companies()
    attio_by_domain = {}
    for r in attio_companies:
        domain = get_attio_domain(r).lower().strip()
        if domain:
            attio_by_domain[domain] = r

    print(f"  {len(attio_companies)} companies in Attio, {len(attio_by_domain)} with domains\n")

    # Step 3: Tag ABM companies
    print("[3/5] Tagging ABM companies with source + stage + landing page...")
    abm_tagged = 0
    abm_listed = 0
    for account in accounts:
        domain = account['domain'].lower().strip()
        name = account['name']
        lp = lp_map.get(account['id'], {})
        lp_url = lp.get('url', '')
        stage_label = stage_map(account.get('stage', 'prospect'))
        outreach_label = outreach_map(account.get('outreach_status', 'new'))

        attio_record = attio_by_domain.get(domain)
        if not attio_record:
            continue

        record_id = attio_record['id']['record_id']
        print(f"  [{abm_tagged+1}] {name:40s} | {domain}")

        # Set custom attributes
        success = update_company_attributes(
            record_id,
            source='ABM Pipeline',
            stage=stage_label,
            landing_page_url=lp_url or None,
            outreach_status=outreach_label,
            dry_run=dry_run,
        )
        if success:
            abm_tagged += 1

        # Add to Target Account List
        if add_to_target_list(record_id, dry_run=dry_run):
            abm_listed += 1

        time.sleep(0.3)

    print(f"\n  Tagged {abm_tagged} ABM companies, added {abm_listed} to Target Account List\n")

    # Step 4: Tag non-ABM companies as Lead Alchemy
    print("[4/5] Tagging non-ABM companies as Lead Alchemy...")
    la_tagged = 0
    for domain, record in attio_by_domain.items():
        if domain in abm_domains:
            continue  # Already tagged as ABM
        record_id = record['id']['record_id']
        name = get_attio_name(record)
        if not dry_run:
            update_company_attributes(record_id, source='Lead Alchemy', dry_run=dry_run)
        else:
            print(f"    [DRY RUN] {name} ({domain}) -> Lead Alchemy")
        la_tagged += 1
        time.sleep(0.2)

    print(f"  Tagged {la_tagged} companies as Lead Alchemy\n")

    # Step 5: Tag people with source + vibe
    print("[5/5] Tagging people with source + vibe...")
    contacts_result = sb.table('contacts').select(
        'id, account_id, email, vibe'
    ).not_.is_('email', 'null').order('id').execute()
    contacts = contacts_result.data or []

    people_tagged = 0
    for contact in contacts:
        email = contact.get('email', '')
        if not email:
            continue

        person_id = find_person_by_email(email)
        if not person_id:
            continue

        vibe = contact.get('vibe', '')
        success = update_person_attributes(
            person_id,
            source='ABM Pipeline',
            vibe=vibe or None,
            dry_run=dry_run,
        )
        if success:
            people_tagged += 1
        time.sleep(0.2)

    print(f"  Tagged {people_tagged} people\n")

    # Summary
    print(f"{'='*60}")
    print(f"  SUMMARY {'(DRY RUN)' if dry_run else ''}")
    print(f"{'='*60}")
    print(f"  Companies in Attio:        {len(attio_companies)}")
    print(f"  ABM companies tagged:      {abm_tagged}")
    print(f"  ABM companies in list:     {abm_listed}")
    print(f"  Lead Alchemy tagged:       {la_tagged}")
    print(f"  People tagged:             {people_tagged}")
    print(f"{'='*60}\n")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Configure Attio CRM with ABM data')
    parser.add_argument('--dry-run', action='store_true', help='Preview without changes')
    parser.add_argument('--limit', type=int, default=500, help='Max accounts to process')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run)
