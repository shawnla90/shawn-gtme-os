#!/usr/bin/env python3
"""Replace irrelevant contacts with GTM-relevant prospects via Apollo.

Finds contacts flagged with [auto-flagged] in notes, deletes them,
then re-prospects those accounts via Apollo to find GTM-relevant
replacements (VP Sales, VP Marketing, RevOps, etc.).

Usage:
  python3 scripts/abm/replace_contacts.py --dry-run
  python3 scripts/abm/replace_contacts.py --limit 30
  python3 scripts/abm/replace_contacts.py --limit 50 --delete-only
"""

import argparse
import os
import sys
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import load_env
load_env()

from db_supabase import get_supabase
from prospect import apollo_search, save_contact, CONTACTS_PER_COMPANY
from title_filter import is_relevant_title


def get_flagged_contacts(sb, limit=100):
    """Get contacts flagged as irrelevant."""
    result = sb.table('contacts').select(
        'id, account_id, first_name, last_name, title, notes'
    ).like('notes', '%[auto-flagged]%').order('account_id').limit(limit).execute()
    return result.data or []


def count_good_contacts(sb, account_id):
    """Count non-flagged contacts for an account."""
    result = sb.table('contacts').select(
        'id', count='exact'
    ).eq('account_id', account_id).or_(
        'notes.is.null,notes.not.like.*[auto-flagged]*'
    ).execute()
    return result.count or 0


def delete_contact(sb, contact_id):
    """Delete a contact by ID."""
    sb.table('contacts').delete().eq('id', contact_id).execute()


def run(limit=50, dry_run=False, delete_only=False):
    """Replace irrelevant contacts with GTM-relevant ones."""
    print(f"\n{'=' * 60}")
    print(f"  Contact Replacement {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}\n")

    sb = get_supabase()

    # Get flagged contacts
    flagged = get_flagged_contacts(sb, limit=limit)
    if not flagged:
        print("  No flagged contacts to replace.")
        return 0

    print(f"  Found {len(flagged)} flagged contacts\n")

    # Group by account
    accounts = {}
    for contact in flagged:
        aid = contact['account_id']
        if aid not in accounts:
            accounts[aid] = []
        accounts[aid].append(contact)

    print(f"  Across {len(accounts)} accounts\n")

    deleted = 0
    replaced = 0
    skipped_title = 0

    for account_id, contacts in accounts.items():
        # Get account info
        acct = sb.table('accounts').select('name, domain').eq(
            'id', account_id
        ).single().execute()
        name = acct.data.get('name', '?') if acct.data else '?'
        domain = acct.data.get('domain', '') if acct.data else ''

        good_count = count_good_contacts(sb, account_id)
        flag_count = len(contacts)

        print(f"  {name} ({domain})")
        print(f"    Good: {good_count} | Flagged: {flag_count}")

        # Delete flagged contacts
        for contact in contacts:
            cname = f"{contact.get('first_name', '')} {contact.get('last_name', '')}".strip()
            title = contact.get('title', '')
            if dry_run:
                print(f"    [DRY RUN] Would delete: {cname} - {title}")
            else:
                delete_contact(sb, contact['id'])
                print(f"    - Deleted: {cname} - {title}")
            deleted += 1

        if delete_only:
            continue

        # Re-prospect if we need more contacts
        needed = CONTACTS_PER_COMPANY - good_count
        if needed <= 0:
            print(f"    Already have {good_count} good contacts, skipping re-prospect")
            continue

        if not domain:
            print(f"    [!] No domain, can't re-prospect")
            continue

        if dry_run:
            print(f"    [DRY RUN] Would prospect for {needed} replacements")
            continue

        # Search Apollo for replacements
        result = apollo_search(domain)
        if not result or 'people' not in result:
            print(f"    [!] No results from Apollo")
            time.sleep(1)
            continue

        added = 0
        title_skips = 0
        for person in result.get('people', []):
            if added >= needed:
                break

            person_title = person.get('title', '')
            if not is_relevant_title(person_title):
                title_skips += 1
                continue

            if save_contact(sb, account_id, person):
                added += 1
                pname = f"{person.get('first_name', '')} {person.get('last_name', '')}".strip()
                print(f"    + {pname} - {person_title}")

        replaced += added
        if title_skips:
            print(f"    ({title_skips} irrelevant titles skipped)")

        time.sleep(1)  # Rate limit

    # Summary
    print(f"\n{'=' * 60}")
    print(f"  SUMMARY {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"  Flagged contacts deleted:  {deleted}")
    print(f"  Replacement contacts added: {replaced}")
    print(f"  Accounts processed:        {len(accounts)}")
    print(f"{'=' * 60}\n")

    return replaced


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Replace irrelevant contacts with GTM-relevant ones')
    parser.add_argument('--limit', type=int, default=50, help='Max flagged contacts to process')
    parser.add_argument('--dry-run', action='store_true', help='Preview without changes')
    parser.add_argument('--delete-only', action='store_true', help='Only delete flagged, do not re-prospect')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run, delete_only=args.delete_only)
