#!/usr/bin/env python3
"""Backfill contacts array into existing ABM page JSONs from crm.db.

Reads all contacts per account from crm.db and adds a `contacts` array
to each page JSON. The contact `id` is a URL-safe lowercase slug of
the first name (used as ?c= param value).

Usage:
  python3 scripts/abm/backfill_contacts.py [--dry-run]
"""

import json
import os
import re
import sqlite3
import sys

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm.db')
PAGES_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'abm', 'pages')


def slugify(name):
    """Turn a name into a URL-safe ID."""
    return re.sub(r'[^a-z0-9]', '', name.lower().strip())


def run(dry_run=False):
    conn = sqlite3.connect(os.path.abspath(DB_PATH))
    conn.row_factory = sqlite3.Row

    pages = [f for f in os.listdir(PAGES_DIR) if f.endswith('.json')]
    print(f"Found {len(pages)} page JSONs\n")

    updated = 0
    for filename in sorted(pages):
        filepath = os.path.join(PAGES_DIR, filename)
        with open(filepath) as f:
            page = json.load(f)

        domain = page.get('domain', '')
        if not domain:
            print(f"  SKIP {filename} - no domain")
            continue

        # Find account in CRM
        account = conn.execute(
            "SELECT id, name FROM accounts WHERE domain = ?", (domain,)
        ).fetchone()

        if not account:
            print(f"  SKIP {filename} - domain {domain} not in CRM")
            continue

        # Get all contacts for this account
        contacts = conn.execute(
            """SELECT first_name, last_name, title, email, vibe
               FROM contacts WHERE account_id = ?
               ORDER BY is_primary DESC, id""",
            (account['id'],)
        ).fetchall()

        if not contacts:
            print(f"  SKIP {filename} - no contacts in CRM")
            continue

        # Build contacts array
        contacts_array = []
        seen_ids = set()
        for c in contacts:
            first = (c['first_name'] or '').strip()
            last = (c['last_name'] or '').strip()
            full_name = f"{first} {last}".strip() if last else first
            cid = slugify(first)

            # Dedupe IDs
            if cid in seen_ids:
                cid = slugify(f"{first}{last}")
            if cid in seen_ids or not cid:
                continue
            seen_ids.add(cid)

            contact_obj = {
                'id': cid,
                'name': full_name,
                'role': c['title'] or '',
            }
            contacts_array.append(contact_obj)

        if not contacts_array:
            continue

        # Also fix the primary contactName to include full name
        primary = contacts_array[0]
        page['contactName'] = primary['name']
        page['contactRole'] = primary['role']
        page['contacts'] = contacts_array

        if dry_run:
            print(f"  {filename}: {len(contacts_array)} contacts - {[c['id'] for c in contacts_array]}")
        else:
            with open(filepath, 'w') as f:
                json.dump(page, f, indent=2, ensure_ascii=False)
            print(f"  {filename}: {len(contacts_array)} contacts added")
            updated += 1

    conn.close()
    print(f"\nDone. {updated} pages updated.")


if __name__ == '__main__':
    dry_run = '--dry-run' in sys.argv
    run(dry_run=dry_run)
