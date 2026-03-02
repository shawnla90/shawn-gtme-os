#!/usr/bin/env python3
"""Title filtering for ABM contact quality.

Shared module used by prospect.py and backfill_contacts.py to ensure
only GTM-relevant contacts enter the pipeline.

Usage:
  from title_filter import is_relevant_title, flag_irrelevant_contacts

  # Check a single title
  is_relevant_title("VP of Sales")  # True
  is_relevant_title("HR Manager")   # False

  # Bulk flag existing contacts
  python3 scripts/abm/title_filter.py --dry-run
  python3 scripts/abm/title_filter.py --flag
"""

import argparse
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import load_env
load_env()


# --- Title classification rules ---

# Keywords that indicate a GTM-relevant role (case-insensitive substring match)
ALLOWLIST = [
    'sales', 'revenue', 'growth', 'marketing', 'demand gen', 'demand generation',
    'business development', 'bdm', 'bdr', 'sdr',
    'account exec', 'account manager', ' ae ',
    'customer success', 'client success',
    'enablement', 'partnerships', 'partner', 'channel',
    'alliances', 'go-to-market', 'gtm', 'commercial',
    'cro', 'cmo', 'cso', 'chief revenue', 'chief marketing',
    'chief sales', 'chief commercial', 'chief growth',
    'field marketing', 'revops', 'rev ops',
    'revenue operations', 'sales operations', 'marketing operations',
    'general manager', 'managing director',
    'client', 'customer',
]

# Keywords that indicate a non-GTM role (checked BEFORE allowlist)
BLOCKLIST = [
    'recruit', 'talent acq', 'talent dir', 'talent lead',
    'talent sourc', 'talent &', 'talent manager',
    'hr ', 'hr,', 'human resource', 'people ops',
    'people operations', 'people &', 'hrbp',
    'software engineer', 'engineering manager', 'engineering lead',
    'developer', 'devops', 'sre ', 'platform engineer',
    'creative director', 'art director', 'ux ', 'ui ',
    'community lead', 'community manager', 'community dir',
    'social media', 'content creator',
    'product manager', 'product lead', 'product dir',
    'legal', 'counsel', 'compliance',
    'finance director', 'controller', 'accounting', 'cfo',
    'investment', 'investor', 'portfolio',
    'data scientist', 'data engineer', 'ml engineer',
    'machine learning', 'research engineer', 'research scientist',
    'editor', 'editorial', 'journalist', 'writer',
    'professor', 'academic', 'teacher',
    'founder', 'co-founder',
]

# Exact-match titles to block (checked as whole words, not substrings)
BLOCKLIST_EXACT = ['ceo', 'cto', 'coo', 'cfo']

# Seniority prefixes that are generally relevant even without function keywords
SENIOR_PREFIXES = [
    'vp ', 'vp,', 'vp of', 'vice president',
    'svp', 'evp', 'avp',
    'director', 'sr director', 'senior director',
    'head of',
]


def is_relevant_title(title):
    """Check if a job title is relevant for GTM outreach.

    Returns True if the title suggests a sales, marketing, revenue,
    growth, or customer success function. Returns False for HR,
    engineering, product, legal, finance, and other non-GTM roles.
    """
    if not title:
        return False
    title_lower = title.lower().strip()

    # Check exact-match blocklist (whole title matches like "ceo", "cto")
    title_words = set(title_lower.replace(',', ' ').replace('-', ' ').split())
    for exact in BLOCKLIST_EXACT:
        if exact in title_words:
            return False

    # Check substring blocklist (higher priority than allowlist)
    for blocked in BLOCKLIST:
        if blocked in title_lower:
            return False

    # Check allowlist
    for allowed in ALLOWLIST:
        if allowed in title_lower:
            return True

    # Senior titles without specific function - borderline relevant
    for prefix in SENIOR_PREFIXES:
        if title_lower.startswith(prefix):
            return True

    return False


def flag_irrelevant_contacts(dry_run=False):
    """Flag existing contacts with irrelevant titles in Supabase."""
    from db_supabase import get_supabase

    sb = get_supabase()

    result = sb.table('contacts').select('id, first_name, last_name, title, account_id, notes').execute()
    contacts = result.data or []

    print(f"\n  Checking {len(contacts)} contacts for title relevance\n")

    relevant = 0
    irrelevant = 0
    no_title = 0

    for contact in contacts:
        title = contact.get('title', '')
        name = f"{contact.get('first_name', '')} {contact.get('last_name', '')}".strip()

        if not title:
            no_title += 1
            continue

        if is_relevant_title(title):
            relevant += 1
        else:
            irrelevant += 1
            if dry_run:
                print(f"  [irrelevant] {name:30s} | {title}")
            else:
                notes = contact.get('notes', '') or ''
                if '[auto-flagged]' not in notes:
                    sb.table('contacts').update({
                        'notes': f'[auto-flagged] Irrelevant title: {title}',
                    }).eq('id', contact['id']).execute()
                    print(f"  [flagged] {name:30s} | {title}")

    print(f"\n  Results:")
    print(f"    Relevant:   {relevant}")
    print(f"    Irrelevant: {irrelevant}")
    print(f"    No title:   {no_title}")
    print(f"    Total:      {len(contacts)}\n")

    return irrelevant


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Flag contacts with irrelevant titles')
    parser.add_argument('--dry-run', action='store_true', help='Preview without flagging')
    parser.add_argument('--flag', action='store_true', help='Actually flag irrelevant contacts')
    args = parser.parse_args()

    if args.flag or args.dry_run:
        flag_irrelevant_contacts(dry_run=args.dry_run)
    else:
        parser.print_help()
