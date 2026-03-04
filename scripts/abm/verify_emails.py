#!/usr/bin/env python3
"""Email verification via Prospeo Email Verifier API.

Checks contacts in Supabase that don't have email_status set yet,
calls Prospeo to verify each email, and updates the contact record.

Results: valid, invalid, catch-all, unknown

Usage:
  python3 scripts/abm/verify_emails.py --dry-run
  python3 scripts/abm/verify_emails.py --limit 50
"""

import argparse
import os
import sys
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import load_env, PROSPEO_BASE, get_prospeo_headers, api_request
load_env()

from db_supabase import get_supabase


def verify_email(email, headers):
    """Verify a single email via Prospeo Email Verifier API.

    Returns: 'valid', 'invalid', 'catch-all', or 'unknown'
    """
    try:
        resp = api_request(
            'POST',
            f'{PROSPEO_BASE}/email-verifier',
            headers=headers,
            json={'email': email},
        )

        if resp.status_code != 200:
            return 'unknown'

        data = resp.json()
        response = data.get('response', {})
        status = response.get('status', 'unknown')

        # Normalize Prospeo statuses
        status = status.lower().strip()
        if status in ('valid', 'invalid', 'catch-all', 'unknown'):
            return status

        return 'unknown'

    except Exception as e:
        print(f"    [!] Prospeo verification failed: {e}")
        return 'unknown'


def run(limit=50, dry_run=False):
    """Verify emails for contacts without email_status set."""
    print(f"\n{'=' * 60}")
    print(f"  Prospeo Email Verification {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}\n")

    sb = get_supabase()
    headers = get_prospeo_headers()

    # Get contacts with email but no email_status yet
    result = sb.table('contacts').select(
        'id, first_name, last_name, email, email_status'
    ).neq('email', '').not_.is_('email', 'null').is_(
        'email_status', 'null'
    ).order('id').limit(limit).execute()
    contacts = result.data or []

    if not contacts:
        print("  No contacts pending email verification.")
        return 0

    print(f"  Found {len(contacts)} contacts to verify\n")

    # Stats
    results = {'valid': 0, 'invalid': 0, 'catch-all': 0, 'unknown': 0}
    verified = 0

    for i, contact in enumerate(contacts):
        email = contact['email']
        name = f"{contact.get('first_name', '')} {contact.get('last_name', '')}".strip()

        if dry_run:
            print(f"  [{i + 1}/{len(contacts)}] {name:25s} | {email:35s} | [DRY RUN]")
            verified += 1
            continue

        status = verify_email(email, headers)
        results[status] += 1

        flag = {
            'valid':     '[ok]',
            'invalid':   '[!!]',
            'catch-all': '[~~]',
            'unknown':   '[??]',
        }.get(status, '[??]')

        print(f"  [{i + 1}/{len(contacts)}] {name:25s} | {email:35s} | {flag} {status}")

        sb.table('contacts').update({
            'email_status': status
        }).eq('id', contact['id']).execute()

        verified += 1
        time.sleep(1.0)  # Rate limit

    # Summary
    print(f"\n{'=' * 60}")
    print(f"  SUMMARY {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"  Contacts verified: {verified}")
    if not dry_run:
        for status, count in sorted(results.items(), key=lambda x: -x[1]):
            if count > 0:
                pct = count / verified * 100 if verified else 0
                print(f"    {status:15s} {count:4d} ({pct:.0f}%)")
    print(f"{'=' * 60}\n")

    return verified


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Verify contact emails via Prospeo')
    parser.add_argument('--limit', type=int, default=50, help='Max contacts to verify')
    parser.add_argument('--dry-run', action='store_true', help='Preview without updating')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run)
