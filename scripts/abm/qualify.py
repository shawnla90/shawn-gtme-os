#!/usr/bin/env python3
"""Shared qualification module for ABM pipeline.

Single source of truth for "what belongs in the CRM."
Used by sync_attio.py, clean_attio.py, attio_configure.py, push_to_lemlist.py.

Usage:
  from qualify import is_actionable_contact, get_qualified_accounts

  # Check a single contact dict
  is_actionable_contact(contact)  # True/False

  # Get accounts with at least 1 actionable contact
  accounts = get_qualified_accounts(sb, limit=500)
"""

import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from title_filter import is_relevant_title


def is_actionable_contact(contact):
    """Has email + relevant title + not already flagged.

    Args:
        contact: dict with keys: email, title, notes, lemlist_lead_id (all optional)

    Returns:
        True if contact is actionable for outreach.
    """
    # Must have email
    email = (contact.get('email') or '').strip()
    if not email:
        return False

    # Must have a relevant title
    title = contact.get('title') or ''
    if not is_relevant_title(title):
        return False

    # Skip flagged contacts
    notes = contact.get('notes') or ''
    if '[auto-flagged]' in notes:
        return False

    return True


def get_qualified_accounts(sb, limit=500):
    """Returns accounts that have at least 1 actionable contact.

    Batch-fetches all contacts, groups by account_id, filters accounts
    that have >= 1 actionable contact. Returns list of account dicts
    with an extra 'actionable_contacts' key containing the filtered contacts.

    Args:
        sb: Supabase client
        limit: max accounts to return

    Returns:
        list of account dicts, each with 'actionable_contacts' key
    """
    # Fetch all accounts with domains
    accounts_result = sb.table('accounts').select(
        'id, name, domain, stage, outreach_status, exa_research, '
        'industry, icp_score, tech_stack, employee_count, gap_analysis'
    ).not_.is_('domain', 'null').order('id').limit(limit).execute()
    accounts = accounts_result.data or []

    if not accounts:
        return []

    # Batch-fetch all contacts (more efficient than per-account queries)
    contacts_result = sb.table('contacts').select(
        'id, account_id, first_name, last_name, email, title, '
        'linkedin_url, vibe, notes, is_primary, lemlist_lead_id'
    ).not_.is_('email', 'null').order('is_primary', desc=True).execute()
    all_contacts = contacts_result.data or []

    # Group contacts by account_id
    contacts_by_account = {}
    for c in all_contacts:
        aid = c.get('account_id')
        if aid:
            contacts_by_account.setdefault(aid, []).append(c)

    # Filter accounts: must have at least 1 actionable contact
    qualified = []
    for account in accounts:
        account_contacts = contacts_by_account.get(account['id'], [])
        actionable = [c for c in account_contacts if is_actionable_contact(c)]

        if actionable:
            account['actionable_contacts'] = actionable
            qualified.append(account)

    return qualified


def get_qualification_stats(sb):
    """Get stats about qualification across the pipeline.

    Returns dict with counts for reporting.
    """
    accounts_result = sb.table('accounts').select(
        'id', count='exact'
    ).not_.is_('domain', 'null').execute()
    total_accounts = accounts_result.count or 0

    contacts_result = sb.table('contacts').select(
        'id, account_id, email, title, notes'
    ).not_.is_('email', 'null').execute()
    all_contacts = contacts_result.data or []

    actionable = [c for c in all_contacts if is_actionable_contact(c)]
    actionable_account_ids = set(c['account_id'] for c in actionable)

    return {
        'total_accounts': total_accounts,
        'total_contacts_with_email': len(all_contacts),
        'actionable_contacts': len(actionable),
        'qualified_accounts': len(actionable_account_ids),
        'unqualified_accounts': total_accounts - len(actionable_account_ids),
    }


if __name__ == '__main__':
    from db_supabase import get_supabase

    sb = get_supabase()
    stats = get_qualification_stats(sb)

    print(f"\n  Qualification Stats")
    print(f"  {'='*40}")
    print(f"  Total accounts:          {stats['total_accounts']}")
    print(f"  Contacts with email:     {stats['total_contacts_with_email']}")
    print(f"  Actionable contacts:     {stats['actionable_contacts']}")
    print(f"  Qualified accounts:      {stats['qualified_accounts']}")
    print(f"  Unqualified accounts:    {stats['unqualified_accounts']}")
    print(f"  {'='*40}\n")
