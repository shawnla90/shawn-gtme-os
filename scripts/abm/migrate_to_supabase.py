#!/usr/bin/env python3
"""One-time migration: crm.db + JSON files -> Supabase.

Migrates accounts, contacts, and landing_pages. Maps old SQLite IDs
to new Supabase IDs via the old_id column.

Usage:
  python3 scripts/abm/migrate_to_supabase.py [--dry-run]
"""

import argparse
import json
import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm.db')
PAGES_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'abm', 'pages')

from db_supabase import get_supabase


def get_sqlite():
    conn = sqlite3.connect(os.path.abspath(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def parse_exa_research(raw):
    """Parse exa_research from TEXT to dict. Returns None if empty/invalid."""
    if not raw:
        return None
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return None


def load_json_page(slug):
    """Load page_data from JSON file on disk."""
    filepath = os.path.join(PAGES_DIR, f'{slug}.json')
    if os.path.exists(filepath):
        with open(filepath) as f:
            return json.load(f)
    return None


def migrate_accounts(sqlite_conn, sb, dry_run=False):
    """Migrate all accounts. Returns old_id -> new_id mapping."""
    rows = sqlite_conn.execute("SELECT * FROM accounts ORDER BY id").fetchall()
    print(f"\n  Migrating {len(rows)} accounts...")

    id_map = {}
    for row in rows:
        row = dict(row)
        old_id = row['id']
        exa = parse_exa_research(row.get('exa_research'))

        record = {
            'old_id': old_id,
            'name': row['name'],
            'domain': row.get('domain'),
            'industry': row.get('industry'),
            'size': row.get('size'),
            'geography': row.get('geography'),
            'source': row.get('source'),
            'stage': row.get('stage', 'prospect'),
            'notes': row.get('notes'),
            'exa_research': exa,
            'apollo_id': row.get('apollo_id'),
            'employee_count': row.get('employee_count'),
            'funding': row.get('funding'),
            'tech_stack': row.get('tech_stack'),
        }

        # Remove None values to let DB defaults apply
        record = {k: v for k, v in record.items() if v is not None}

        if dry_run:
            print(f"    [DRY RUN] Would insert account: {row['name']} ({row.get('domain', 'no domain')})")
            id_map[old_id] = old_id
            continue

        result = sb.table('accounts').insert(record).execute()
        new_id = result.data[0]['id']
        id_map[old_id] = new_id

    print(f"  Accounts: {len(id_map)} migrated")
    return id_map


def migrate_contacts(sqlite_conn, sb, account_id_map, dry_run=False):
    """Migrate all contacts. Returns old_id -> new_id mapping."""
    rows = sqlite_conn.execute("SELECT * FROM contacts ORDER BY id").fetchall()
    print(f"\n  Migrating {len(rows)} contacts...")

    id_map = {}
    skipped = 0
    for row in rows:
        row = dict(row)
        old_id = row['id']
        old_account_id = row.get('account_id')

        if old_account_id and old_account_id not in account_id_map:
            skipped += 1
            continue

        new_account_id = account_id_map.get(old_account_id) if old_account_id else None

        record = {
            'old_id': old_id,
            'account_id': new_account_id,
            'first_name': row['first_name'],
            'last_name': row.get('last_name'),
            'email': row.get('email'),
            'phone': row.get('phone'),
            'role': row.get('role'),
            'title': row.get('title'),
            'persona': row.get('persona'),
            'is_primary': bool(row.get('is_primary', 0)),
            'linkedin_url': row.get('linkedin_url'),
            'apollo_id': row.get('apollo_id'),
            'source': row.get('source'),
            'vibe': row.get('vibe'),
            'notes': row.get('notes'),
        }

        record = {k: v for k, v in record.items() if v is not None}

        if dry_run:
            print(f"    [DRY RUN] Would insert contact: {row['first_name']} {row.get('last_name', '')}")
            id_map[old_id] = old_id
            continue

        result = sb.table('contacts').insert(record).execute()
        new_id = result.data[0]['id']
        id_map[old_id] = new_id

    if skipped:
        print(f"  Skipped {skipped} contacts (orphaned account_id)")
    print(f"  Contacts: {len(id_map)} migrated")
    return id_map


def migrate_landing_pages(sqlite_conn, sb, account_id_map, contact_id_map, dry_run=False):
    """Migrate landing pages. Prefers JSON file as page_data source."""
    rows = sqlite_conn.execute("SELECT * FROM landing_pages ORDER BY id").fetchall()
    print(f"\n  Migrating {len(rows)} landing pages...")

    migrated = 0
    for row in rows:
        row = dict(row)
        old_id = row['id']
        slug = row.get('slug', '')
        if not slug:
            print(f"    [!] Skipping landing page {old_id} - no slug")
            continue

        old_account_id = row.get('account_id')
        old_contact_id = row.get('contact_id')
        new_account_id = account_id_map.get(old_account_id) if old_account_id else None
        new_contact_id = contact_id_map.get(old_contact_id) if old_contact_id else None

        # Prefer JSON file, fall back to SQLite column
        page_data = load_json_page(slug)
        if not page_data and row.get('page_data'):
            try:
                page_data = json.loads(row['page_data'])
            except (json.JSONDecodeError, TypeError):
                page_data = {}

        if not page_data:
            print(f"    [!] Skipping {slug} - no page_data found")
            continue

        record = {
            'old_id': old_id,
            'account_id': new_account_id,
            'contact_id': new_contact_id,
            'slug': slug,
            'url': row.get('url'),
            'page_data': page_data,
            'template': row.get('template'),
            'status': row.get('status', 'draft'),
            'views': row.get('views', 0),
        }

        record = {k: v for k, v in record.items() if v is not None}

        if dry_run:
            src = 'JSON file' if load_json_page(slug) else 'SQLite'
            print(f"    [DRY RUN] Would insert page: {slug} (source: {src})")
            migrated += 1
            continue

        result = sb.table('landing_pages').insert(record).execute()
        migrated += 1

    print(f"  Landing pages: {migrated} migrated")
    return migrated


def run(dry_run=False):
    print(f"\n{'='*50}")
    print(f"  ABM Data Migration: SQLite -> Supabase")
    print(f"  {'DRY RUN' if dry_run else 'LIVE'}")
    print(f"{'='*50}")

    sqlite_conn = get_sqlite()

    if not dry_run:
        sb = get_supabase()
    else:
        sb = None

    account_map = migrate_accounts(sqlite_conn, sb, dry_run=dry_run)
    contact_map = migrate_contacts(sqlite_conn, sb, account_map, dry_run=dry_run)
    migrate_landing_pages(sqlite_conn, sb, account_map, contact_map, dry_run=dry_run)

    sqlite_conn.close()
    print(f"\n{'='*50}")
    print(f"  Migration complete!")
    print(f"{'='*50}\n")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Migrate crm.db to Supabase')
    parser.add_argument('--dry-run', action='store_true', help='Preview without writing')
    args = parser.parse_args()
    run(dry_run=args.dry_run)
