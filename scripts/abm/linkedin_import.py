#!/usr/bin/env python3
"""Import LinkedIn connections export and cross-reference against ABM accounts.

Parses Connections.csv from LinkedIn data export, matches connections against
existing accounts by company name/domain, and stores relationship signals
in accounts.signals JSONB.

Usage:
  python3 scripts/abm/linkedin_import.py --dry-run
  python3 scripts/abm/linkedin_import.py
  python3 scripts/abm/linkedin_import.py --csv data/linkedin/export/Connections.csv
"""

import argparse
import csv
import json
import os
import re
import sys
from collections import defaultdict
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import load_env
load_env()

from db_supabase import get_supabase
from title_filter import is_relevant_title

# Default CSV path
DEFAULT_CSV = os.path.join(
    os.path.dirname(SCRIPT_DIR), '..', 'data', 'linkedin', 'export', 'Connections.csv'
)


def normalize_company(name):
    """Normalize company name for fuzzy matching."""
    if not name:
        return ''
    name = name.lower().strip()
    # Strip common suffixes
    for suffix in [', inc.', ', inc', ' inc.', ' inc', ', llc', ' llc',
                   ', ltd', ' ltd', ', co.', ' co.', ' corporation',
                   ' corp', ' corp.', ' gmbh', ' ag', ' sa', ' plc']:
        if name.endswith(suffix):
            name = name[:-len(suffix)]
    # Remove punctuation
    name = re.sub(r'[^\w\s]', '', name)
    return name.strip()


def domain_from_company(company_name):
    """Attempt to derive a domain from a company name (best-effort)."""
    if not company_name:
        return ''
    clean = re.sub(r'[^\w]', '', company_name.lower())
    return f"{clean}.com"


def parse_connections(csv_path):
    """Parse LinkedIn Connections.csv into structured records.

    LinkedIn export CSV has columns:
    First Name, Last Name, Email Address, Company, Position, Connected On, URL
    (Some exports also have: URL as 'Profile URL')
    """
    connections = []

    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        # LinkedIn exports sometimes have junk lines at the top
        reader = csv.DictReader(f)

        for row in reader:
            # Handle varying column names across export versions
            first = row.get('First Name', '').strip()
            last = row.get('Last Name', '').strip()
            email = row.get('Email Address', '').strip()
            company = row.get('Company', '').strip()
            position = row.get('Position', '').strip()
            connected_on = row.get('Connected On', '').strip()
            url = row.get('URL', row.get('Profile URL', '')).strip()

            if not first and not last:
                continue

            connections.append({
                'first_name': first,
                'last_name': last,
                'email': email,
                'company': company,
                'position': position,
                'connected_on': connected_on,
                'linkedin_url': url,
                'company_normalized': normalize_company(company),
            })

    return connections


def match_connections_to_accounts(connections, sb):
    """Cross-reference LinkedIn connections against existing accounts.

    Returns dict with:
      matched: connections at known target accounts
      new_qualified: connections at unknown companies with GTM-relevant titles
      stats: summary counts
    """
    # Load all accounts
    result = sb.table('accounts').select(
        'id, name, domain, signals'
    ).execute()
    accounts = result.data or []

    # Build lookup indexes
    name_map = {}  # normalized_name -> account
    domain_map = {}  # domain -> account
    for acct in accounts:
        norm = normalize_company(acct['name'])
        if norm:
            name_map[norm] = acct
        if acct.get('domain'):
            # Store both full domain and without www
            d = acct['domain'].lower().strip()
            domain_map[d] = acct
            domain_map[d.replace('www.', '')] = acct

    matched = []  # connections at known accounts
    new_qualified = []  # connections at unknown companies with GTM titles
    unmatched = 0

    for conn in connections:
        company_norm = conn['company_normalized']
        if not company_norm:
            unmatched += 1
            continue

        # Try name match
        account = name_map.get(company_norm)

        # Try domain match as fallback
        if not account:
            guess_domain = domain_from_company(conn['company'])
            account = domain_map.get(guess_domain)

        if account:
            matched.append({**conn, 'account_id': account['id'], 'account_name': account['name']})
        elif is_relevant_title(conn['position']):
            new_qualified.append(conn)
        else:
            unmatched += 1

    return {
        'matched': matched,
        'new_qualified': new_qualified,
        'stats': {
            'total_connections': len(connections),
            'matched': len(matched),
            'new_qualified': len(new_qualified),
            'unmatched': unmatched,
        }
    }


def tag_linkedin_connections(sb, matched, dry_run=False):
    """Update contacts table with linkedin_connected=true for matched connections.

    Also aggregates per-account signals into accounts.signals JSONB.
    """
    # Group matches by account
    by_account = defaultdict(list)
    for m in matched:
        by_account[m['account_id']].append(m)

    contacts_tagged = 0
    accounts_updated = 0

    for account_id, conns in by_account.items():
        # Try to match connections to existing contacts by name
        contacts_result = sb.table('contacts').select(
            'id, first_name, last_name, linkedin_url'
        ).eq('account_id', account_id).execute()
        existing_contacts = contacts_result.data or []

        for conn in conns:
            # Match by name (first + last)
            for contact in existing_contacts:
                if (contact.get('first_name', '').lower() == conn['first_name'].lower()
                        and contact.get('last_name', '').lower() == conn['last_name'].lower()):
                    if not dry_run:
                        updates = {'linkedin_connected': True}
                        if conn.get('connected_on'):
                            updates['connected_on'] = conn['connected_on']
                        if conn.get('linkedin_url') and not contact.get('linkedin_url'):
                            updates['linkedin_url'] = conn['linkedin_url']
                        sb.table('contacts').update(updates).eq('id', contact['id']).execute()
                    contacts_tagged += 1
                    break

        # Build LinkedIn signal data for this account
        connected_contacts = [
            f"{c['first_name']} {c['last_name']} ({c['position']})"
            for c in conns if c.get('position')
        ]
        dates = [c['connected_on'] for c in conns if c.get('connected_on')]
        earliest = min(dates) if dates else None

        linkedin_signal = {
            'connected_contacts': connected_contacts,
            'connection_count': len(conns),
            'earliest_connected': earliest,
            'has_dm_history': False,  # Updated by linkedin_messages.py
            'checked_at': datetime.now().strftime('%Y-%m-%d'),
        }

        if not dry_run:
            # Merge into existing signals JSONB
            acct_result = sb.table('accounts').select('signals').eq('id', account_id).single().execute()
            signals = acct_result.data.get('signals') or {} if acct_result.data else {}
            signals['linkedin'] = linkedin_signal
            sb.table('accounts').update({'signals': json.dumps(signals)}).eq('id', account_id).execute()

        accounts_updated += 1
        print(f"    {conns[0].get('account_name', '?')}: {len(conns)} connection(s)")

    return contacts_tagged, accounts_updated


def discover_new_accounts(sb, new_qualified, dry_run=False):
    """Flag potential new accounts discovered via LinkedIn connections.

    Only logs them - doesn't insert into accounts table without manual review.
    Returns list of potential accounts for review.
    """
    # Group by company
    by_company = defaultdict(list)
    for conn in new_qualified:
        by_company[conn['company']].append(conn)

    discoveries = []
    for company, conns in sorted(by_company.items(), key=lambda x: -len(x[1])):
        titles = [c['position'] for c in conns if c['position']]
        discoveries.append({
            'company': company,
            'connection_count': len(conns),
            'titles': titles,
            'contacts': [
                {'first_name': c['first_name'], 'last_name': c['last_name'],
                 'position': c['position'], 'email': c.get('email', '')}
                for c in conns
            ]
        })
        print(f"    [NEW] {company}: {len(conns)} connection(s) - {', '.join(titles[:3])}")

    return discoveries


def run(csv_path=None, dry_run=False):
    """Main: parse LinkedIn export, cross-reference accounts, store signals."""
    csv_path = csv_path or DEFAULT_CSV
    csv_path = os.path.abspath(csv_path)

    print(f"\n{'=' * 60}")
    print(f"  LinkedIn Connection Import {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}\n")

    if not os.path.exists(csv_path):
        print(f"  [!] CSV not found: {csv_path}")
        print(f"  Export your LinkedIn data at:")
        print(f"  Settings > Data Privacy > Get a copy of your data")
        print(f"  Then drop Connections.csv into data/linkedin/export/")
        return None

    print(f"  Parsing: {csv_path}")
    connections = parse_connections(csv_path)
    print(f"  Found {len(connections)} connections\n")

    if not connections:
        return None

    sb = get_supabase()

    # Cross-reference
    print("  Cross-referencing against accounts...")
    result = match_connections_to_accounts(connections, sb)
    stats = result['stats']

    print(f"\n  Match results:")
    print(f"    Total connections:    {stats['total_connections']}")
    print(f"    Matched to accounts:  {stats['matched']}")
    print(f"    New qualified leads:  {stats['new_qualified']}")
    print(f"    Unmatched:            {stats['unmatched']}\n")

    # Tag matched connections
    if result['matched']:
        print("  Tagging matched connections...")
        tagged, updated = tag_linkedin_connections(sb, result['matched'], dry_run=dry_run)
        print(f"\n  Tagged {tagged} contacts, updated {updated} accounts\n")

    # Report new qualified
    if result['new_qualified']:
        print("  Potential new accounts (GTM-relevant connections):")
        discoveries = discover_new_accounts(sb, result['new_qualified'], dry_run=dry_run)
        print(f"\n  {len(discoveries)} new companies to review\n")

    print(f"{'=' * 60}")
    print(f"  LinkedIn import complete {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}\n")

    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Import LinkedIn connections and match to ABM accounts')
    parser.add_argument('--csv', default=None, help='Path to Connections.csv')
    parser.add_argument('--dry-run', action='store_true', help='Preview without changes')
    args = parser.parse_args()
    run(csv_path=args.csv, dry_run=args.dry_run)
