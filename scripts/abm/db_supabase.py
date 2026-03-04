#!/usr/bin/env python3
"""Shared Supabase client and database helpers for ABM pipeline scripts."""

import json
import os
import time

from supabase import create_client, Client

from config import load_env, ATTIO_BASE, get_attio_headers, api_request

load_env()


def get_supabase() -> Client:
    """Return an authenticated Supabase client using service role key."""
    url = os.environ.get('SUPABASE_URL', '')
    key = os.environ.get('SUPABASE_SERVICE_KEY', '')
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in scripts/abm/.env")
    return create_client(url, key)


# ---------------------------------------------------------------------------
# Domain helpers
# ---------------------------------------------------------------------------


def get_all_supabase_domains(sb):
    """Return set of all lowercase account domains from Supabase."""
    result = sb.table('accounts').select('domain').not_.is_('domain', 'null').execute()
    return {row['domain'].lower() for row in (result.data or []) if row.get('domain')}


def get_attio_domains():
    """Query Attio for all company domains. Returns set of lowercase domains.

    Paginates through all Attio companies the same way sync_attio.py does.
    """
    domains = set()
    offset = None

    while True:
        payload = {'limit': 50}
        if offset:
            payload['offset'] = offset

        resp = api_request(
            'POST',
            f'{ATTIO_BASE}/objects/companies/records/query',
            json=payload,
            headers=get_attio_headers(),
        )
        resp.raise_for_status()
        data = resp.json()
        batch = data.get('data', [])

        for company in batch:
            values = company.get('values', {})
            for d in values.get('domains', []):
                domain_val = d.get('domain', '')
                if domain_val:
                    domains.add(domain_val.lower())

        offset = data.get('next_cursor')
        if not offset or not batch:
            break
        time.sleep(0.3)

    return domains


# ---------------------------------------------------------------------------
# Cleanup helpers
# ---------------------------------------------------------------------------


def archive_accounts(sb, domains_to_archive, backup_path=None):
    """Archive accounts by domain. Optionally backs up to JSON first.

    Args:
        sb: Supabase client
        domains_to_archive: set of domains to archive
        backup_path: if provided, export accounts + contacts as JSON

    Returns:
        count of archived accounts
    """
    if not domains_to_archive:
        return 0

    # Fetch full account data for backup
    domain_list = list(domains_to_archive)
    accounts_result = sb.table('accounts').select('*').in_('domain', domain_list).execute()
    accounts = accounts_result.data or []

    if not accounts:
        return 0

    account_ids = [a['id'] for a in accounts]

    # Backup if requested
    if backup_path:
        contacts_result = sb.table('contacts').select('*').in_('account_id', account_ids).execute()
        contacts = contacts_result.data or []

        backup_data = {
            'archived_at': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'accounts': accounts,
            'contacts': contacts,
        }

        os.makedirs(os.path.dirname(backup_path), exist_ok=True)
        with open(backup_path, 'w') as f:
            json.dump(backup_data, f, indent=2, default=str)
        print(f"  Backup saved to {backup_path} ({len(accounts)} accounts, {len(contacts)} contacts)")

    # Archive accounts
    archived = 0
    for domain in domain_list:
        sb.table('accounts').update({'stage': 'archived'}).eq('domain', domain).execute()
        archived += 1

    return archived


def purge_orphan_contacts(sb, account_ids):
    """Delete contacts whose account_id is in the given list.

    Args:
        sb: Supabase client
        account_ids: list of account IDs whose contacts should be deleted

    Returns:
        count of deleted contacts
    """
    if not account_ids:
        return 0

    deleted = 0
    for aid in account_ids:
        result = sb.table('contacts').delete().eq('account_id', aid).execute()
        deleted += len(result.data or [])

    return deleted


def run_cleanup(dry_run=False, backup_path=None):
    """Compare Supabase vs Attio, archive orphans, purge their contacts.

    Orphan = account in Supabase whose domain is NOT in Attio.
    """
    print(f"\n{'=' * 60}")
    print(f"  Database Cleanup {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}\n")

    sb = get_supabase()

    # Get domains from both sources
    print("  Fetching Supabase domains...")
    supabase_domains = get_all_supabase_domains(sb)
    print(f"  Supabase: {len(supabase_domains)} accounts with domains")

    print("  Fetching Attio domains...")
    attio_domains = get_attio_domains()
    print(f"  Attio: {len(attio_domains)} companies with domains")

    # Find orphans
    orphan_domains = supabase_domains - attio_domains
    print(f"\n  Orphans (in Supabase, not in Attio): {len(orphan_domains)}")

    if not orphan_domains:
        print("  No orphan accounts found. Database is clean.")
        return 0

    # Show orphans
    for domain in sorted(orphan_domains)[:20]:
        print(f"    - {domain}")
    if len(orphan_domains) > 20:
        print(f"    ... and {len(orphan_domains) - 20} more")

    if dry_run:
        print(f"\n  [DRY RUN] Would archive {len(orphan_domains)} accounts and purge their contacts.")
        return len(orphan_domains)

    # Set backup path if not provided
    if not backup_path:
        backup_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            'backups',
            f'orphans_{time.strftime("%Y%m%d_%H%M%S")}.json',
        )

    # Archive
    archived = archive_accounts(sb, orphan_domains, backup_path=backup_path)
    print(f"\n  Archived {archived} orphan accounts")

    # Get IDs for contact purge
    accounts_result = sb.table('accounts').select('id').in_(
        'domain', list(orphan_domains)
    ).execute()
    orphan_ids = [a['id'] for a in (accounts_result.data or [])]

    # Purge contacts
    deleted = purge_orphan_contacts(sb, orphan_ids)
    print(f"  Purged {deleted} orphan contacts")

    print(f"\n{'=' * 60}")
    print(f"  Cleanup complete. {archived} accounts archived, {deleted} contacts purged.")
    print(f"{'=' * 60}\n")

    return archived
