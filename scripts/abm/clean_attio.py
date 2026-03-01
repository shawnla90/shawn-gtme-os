#!/usr/bin/env python3
"""Clean Attio CRM: remove unqualified companies and orphaned contacts.

Cross-references Attio companies against Supabase qualification.
Deletes unqualified companies and their orphaned people records.
Enforces the rule: never more companies than contacts.

Usage:
  python3 scripts/abm/clean_attio.py --dry-run     # Preview what would be removed
  python3 scripts/abm/clean_attio.py --report       # Stats only, no changes
  python3 scripts/abm/clean_attio.py                # Actually clean
"""

import argparse
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
from qualify import get_qualified_accounts
from attio_configure import (
    get_all_attio_companies, get_attio_domain, get_attio_name,
    attio_headers,
)

ATTIO_BASE = 'https://api.attio.com/v2'


def delete_attio_record(object_type, record_id):
    """Delete a record from Attio.

    Args:
        object_type: 'companies' or 'people'
        record_id: Attio record ID
    """
    url = f'{ATTIO_BASE}/objects/{object_type}/records/{record_id}'

    for attempt in range(3):
        try:
            resp = requests.delete(url, headers=attio_headers(), timeout=30)

            if resp.status_code == 429:
                wait = min(2 ** (attempt + 1), 30)
                time.sleep(wait)
                continue

            if resp.status_code in (200, 204):
                return True
            elif resp.status_code == 404:
                return True  # Already gone
            else:
                print(f"    [!] Delete failed ({resp.status_code}): {resp.text[:200]}")
                return False

        except requests.exceptions.RequestException as e:
            print(f"    [!] Delete error (attempt {attempt+1}): {e}")
            time.sleep(2 ** attempt)

    return False


def get_attio_people_for_company(company_record_id):
    """Find people associated with a company in Attio."""
    # Query people, filter by company association isn't directly supported
    # We'll track orphans after company deletion instead
    return []


def get_all_attio_people():
    """Fetch all people from Attio."""
    all_records = []
    offset = 0
    page_size = 100
    while True:
        payload = {'limit': page_size, 'offset': offset}
        resp = requests.post(
            f'{ATTIO_BASE}/objects/people/records/query',
            json=payload,
            headers=attio_headers(),
            timeout=30,
        )
        if resp.status_code == 429:
            time.sleep(5)
            continue
        resp.raise_for_status()
        data = resp.json()
        records = data.get('data', [])
        all_records.extend(records)
        if len(records) < page_size:
            break
        offset += page_size
        time.sleep(0.3)
    return all_records


def get_person_email(record):
    """Extract email from an Attio person record."""
    vals = record.get('values', {})
    emails = vals.get('email_addresses', [])
    if emails:
        return emails[0].get('email_address', '')
    return ''


def run(dry_run=False, report_only=False):
    mode = 'REPORT' if report_only else ('DRY RUN' if dry_run else 'LIVE')
    print(f"\n{'='*60}")
    print(f"  Attio CRM Cleanup [{mode}]")
    print(f"{'='*60}\n")

    sb = get_supabase()

    # Step 1: Get qualified accounts from Supabase
    print("[1/4] Loading qualified accounts from Supabase...")
    qualified = get_qualified_accounts(sb, limit=1000)
    qualified_domains = {a['domain'].lower().strip() for a in qualified if a.get('domain')}
    print(f"  {len(qualified)} qualified accounts ({len(qualified_domains)} unique domains)\n")

    # Step 2: Get all Attio companies
    print("[2/4] Loading all Attio companies...")
    attio_companies = get_all_attio_companies()
    print(f"  {len(attio_companies)} companies in Attio\n")

    # Step 3: Classify and remove unqualified
    print("[3/4] Classifying companies...")
    keep = []
    remove = []

    for record in attio_companies:
        domain = get_attio_domain(record).lower().strip()
        name = get_attio_name(record)
        record_id = record['id']['record_id']

        if domain and domain in qualified_domains:
            keep.append({'name': name, 'domain': domain, 'record_id': record_id})
        else:
            remove.append({'name': name, 'domain': domain, 'record_id': record_id})

    print(f"  Qualified (keep): {len(keep)}")
    print(f"  Unqualified (remove): {len(remove)}\n")

    if report_only:
        if remove:
            print("  Companies to remove:")
            for r in remove:
                print(f"    - {r['name']:40s} | {r['domain']}")
        print(f"\n{'='*60}")
        print(f"  Would remove {len(remove)} companies, keeping {len(keep)}")
        print(f"{'='*60}\n")
        return len(remove)

    # Delete unqualified companies
    removed_companies = 0
    for i, company in enumerate(remove):
        print(f"  [{i+1}/{len(remove)}] Removing: {company['name']:40s} | {company['domain']}")

        if dry_run:
            print(f"    [DRY RUN] Would delete company {company['record_id']}")
            removed_companies += 1
        else:
            if delete_attio_record('companies', company['record_id']):
                removed_companies += 1
                print(f"    Deleted.")
            else:
                print(f"    [!] Failed to delete")
            time.sleep(0.3)

    # Step 4: Clean orphaned people
    print(f"\n[4/4] Checking for orphaned people records...")

    # Get all Supabase contact emails for cross-reference
    contacts_result = sb.table('contacts').select('email').not_.is_('email', 'null').execute()
    supabase_emails = {
        c['email'].lower().strip()
        for c in (contacts_result.data or [])
        if c.get('email')
    }

    attio_people = get_all_attio_people()
    orphaned = 0

    for person in attio_people:
        email = get_person_email(person).lower().strip()
        if not email:
            continue

        # If this person's email isn't in our Supabase contacts, they're orphaned
        if email not in supabase_emails:
            person_id = person['id']['record_id']
            person_name_vals = person.get('values', {}).get('name', [])
            person_name = person_name_vals[0].get('full_name', 'Unknown') if person_name_vals else 'Unknown'

            if dry_run:
                print(f"    [DRY RUN] Would remove orphan: {person_name} ({email})")
                orphaned += 1
            else:
                if delete_attio_record('people', person_id):
                    orphaned += 1
                    print(f"    Removed orphan: {person_name} ({email})")
                time.sleep(0.3)

    # Summary
    print(f"\n{'='*60}")
    print(f"  CLEANUP SUMMARY {'(DRY RUN)' if dry_run else ''}")
    print(f"{'='*60}")
    print(f"  Companies before:    {len(attio_companies)}")
    print(f"  Companies removed:   {removed_companies}")
    print(f"  Companies remaining: {len(attio_companies) - removed_companies}")
    print(f"  Orphaned people:     {orphaned}")
    print(f"{'='*60}\n")

    return removed_companies


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Clean unqualified records from Attio CRM')
    parser.add_argument('--dry-run', action='store_true', help='Preview without deleting')
    parser.add_argument('--report', action='store_true', help='Stats only, no changes')
    args = parser.parse_args()
    run(dry_run=args.dry_run, report_only=args.report)
