#!/usr/bin/env python3
"""Parse LinkedIn messages export to identify DM history with contacts.

Parses messages.csv from LinkedIn data export to find accounts where Shawn
has had direct message conversations. Updates contacts.has_dm_history and
accounts.signals.linkedin.has_dm_history.

Usage:
  python3 scripts/abm/linkedin_messages.py --dry-run
  python3 scripts/abm/linkedin_messages.py
  python3 scripts/abm/linkedin_messages.py --csv data/linkedin/export/messages.csv
"""

import argparse
import csv
import json
import os
import sys
from collections import defaultdict
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

# Load .env
env_path = os.path.join(SCRIPT_DIR, '.env')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip())

from db_supabase import get_supabase

# Default CSV path
DEFAULT_CSV = os.path.join(
    os.path.dirname(SCRIPT_DIR), '..', 'data', 'linkedin', 'export', 'messages.csv'
)


def parse_message_threads(csv_path):
    """Parse LinkedIn messages.csv for unique conversation participants.

    LinkedIn messages.csv columns vary by export version. Common columns:
    CONVERSATION ID, CONVERSATION TITLE, FROM, SENDER PROFILE URL, TO, DATE, SUBJECT, CONTENT

    We only care about: who was in a conversation (FROM/TO names + profile URLs).
    """
    threads = defaultdict(lambda: {
        'participants': set(),
        'profile_urls': set(),
        'message_count': 0,
        'earliest': None,
        'latest': None,
    })

    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)

        for row in reader:
            conv_id = row.get('CONVERSATION ID', row.get('Conversation ID', '')).strip()
            if not conv_id:
                continue

            thread = threads[conv_id]

            # Collect participant names
            sender = row.get('FROM', row.get('From', '')).strip()
            if sender:
                thread['participants'].add(sender)

            # Collect profile URLs
            profile_url = row.get('SENDER PROFILE URL', row.get('Sender Profile URL', '')).strip()
            if profile_url:
                thread['profile_urls'].add(profile_url)

            thread['message_count'] += 1

            # Track date range
            date_str = row.get('DATE', row.get('Date', '')).strip()
            if date_str:
                if not thread['earliest'] or date_str < thread['earliest']:
                    thread['earliest'] = date_str
                if not thread['latest'] or date_str > thread['latest']:
                    thread['latest'] = date_str

    # Convert sets to lists for JSON serialization
    result = []
    for conv_id, data in threads.items():
        result.append({
            'conversation_id': conv_id,
            'participants': list(data['participants']),
            'profile_urls': list(data['profile_urls']),
            'message_count': data['message_count'],
            'earliest': data['earliest'],
            'latest': data['latest'],
        })

    return result


def tag_message_contacts(sb, threads, dry_run=False):
    """Mark contacts with has_dm_history=true if they appear in message threads.

    Matches by: LinkedIn profile URL or first_name + last_name combination.
    """
    # Build lookup: all participant names and profile URLs from threads
    dm_names = set()  # (first_lower, last_lower)
    dm_urls = set()
    for thread in threads:
        for name in thread['participants']:
            parts = name.strip().split()
            if len(parts) >= 2:
                dm_names.add((parts[0].lower(), parts[-1].lower()))
        for url in thread['profile_urls']:
            dm_urls.add(url.lower().rstrip('/'))

    # Load all contacts
    contacts_result = sb.table('contacts').select(
        'id, account_id, first_name, last_name, linkedin_url'
    ).execute()
    contacts = contacts_result.data or []

    tagged = 0
    account_ids_with_dm = set()

    for contact in contacts:
        first = (contact.get('first_name') or '').lower()
        last = (contact.get('last_name') or '').lower()
        li_url = (contact.get('linkedin_url') or '').lower().rstrip('/')

        matched = False

        # Match by LinkedIn URL
        if li_url and li_url in dm_urls:
            matched = True

        # Match by name
        if not matched and first and last and (first, last) in dm_names:
            matched = True

        if matched:
            tagged += 1
            account_ids_with_dm.add(contact['account_id'])
            if not dry_run:
                sb.table('contacts').update({
                    'has_dm_history': True
                }).eq('id', contact['id']).execute()
            print(f"    [DM] {contact.get('first_name', '')} {contact.get('last_name', '')}")

    # Update account signals
    accounts_updated = 0
    for account_id in account_ids_with_dm:
        if not dry_run:
            acct_result = sb.table('accounts').select('signals').eq('id', account_id).single().execute()
            signals = acct_result.data.get('signals') or {} if acct_result.data else {}
            if 'linkedin' not in signals:
                signals['linkedin'] = {}
            signals['linkedin']['has_dm_history'] = True
            signals['linkedin']['dm_checked_at'] = datetime.now().strftime('%Y-%m-%d')
            sb.table('accounts').update({'signals': json.dumps(signals)}).eq('id', account_id).execute()
        accounts_updated += 1

    return tagged, accounts_updated


def run(csv_path=None, dry_run=False):
    """Main: parse LinkedIn messages, tag contacts with DM history."""
    csv_path = csv_path or DEFAULT_CSV
    csv_path = os.path.abspath(csv_path)

    print(f"\n{'=' * 60}")
    print(f"  LinkedIn Message History Import {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}\n")

    if not os.path.exists(csv_path):
        print(f"  [!] CSV not found: {csv_path}")
        print(f"  Export your LinkedIn data at:")
        print(f"  Settings > Data Privacy > Get a copy of your data")
        print(f"  Then drop messages.csv into data/linkedin/export/")
        return None

    print(f"  Parsing: {csv_path}")
    threads = parse_message_threads(csv_path)
    print(f"  Found {len(threads)} conversation threads\n")

    if not threads:
        print("  No message threads found.")
        return None

    # Stats
    total_participants = set()
    total_messages = 0
    for t in threads:
        total_participants.update(t['participants'])
        total_messages += t['message_count']

    print(f"  Unique participants: {len(total_participants)}")
    print(f"  Total messages: {total_messages}\n")

    sb = get_supabase()

    print("  Matching against contacts...")
    tagged, accounts_updated = tag_message_contacts(sb, threads, dry_run=dry_run)

    print(f"\n{'=' * 60}")
    print(f"  Results {'(DRY RUN)' if dry_run else ''}:")
    print(f"    Contacts with DM history: {tagged}")
    print(f"    Accounts with DM signal:  {accounts_updated}")
    print(f"{'=' * 60}\n")

    return {'tagged': tagged, 'accounts_updated': accounts_updated}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Import LinkedIn message history for DM signals')
    parser.add_argument('--csv', default=None, help='Path to messages.csv')
    parser.add_argument('--dry-run', action='store_true', help='Preview without changes')
    args = parser.parse_args()
    run(csv_path=args.csv, dry_run=args.dry_run)
