#!/usr/bin/env python3
"""Apollo contact prospecting module - finds 3 contacts per company."""

import json
import os
import sqlite3
import time
import requests

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm.db')
APOLLO_BASE_URL = 'https://api.apollo.io/api/v1'

# Target titles for prospecting
TARGET_TITLES = [
    "VP Sales",
    "VP Business Development",
    "VP Marketing",
    "Director Marketing Ops",
    "Head of Growth",
    "Director Sales Development",
    "VP Revenue Operations",
    "Director Sales Operations",
]

TARGET_SENIORITY = ["vp", "director", "manager"]
CONTACTS_PER_COMPANY = 3


def get_db():
    return sqlite3.connect(os.path.abspath(DB_PATH))


def apollo_search(domain, page=1):
    """Search Apollo for contacts at a given domain."""
    APOLLO_API_KEY = os.environ.get('APOLLO_API_KEY', '')
    if not APOLLO_API_KEY:
        raise ValueError("APOLLO_API_KEY not set. Export it or add to .env")

    headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': APOLLO_API_KEY,
    }

    payload = {
        'q_organization_domains': domain,
        'person_seniorities': TARGET_SENIORITY,
        'page': page,
        'per_page': 10,
    }

    for attempt in range(3):
        try:
            resp = requests.post(
                f'{APOLLO_BASE_URL}/mixed_people/api_search',
                json=payload,
                headers=headers,
                timeout=30,
            )

            if resp.status_code == 429:
                wait = min(2 ** (attempt + 1), 30)
                print(f"    Rate limited. Waiting {wait}s...")
                time.sleep(wait)
                continue

            resp.raise_for_status()
            return resp.json()

        except requests.exceptions.RequestException as e:
            print(f"    [!] Apollo request failed (attempt {attempt+1}): {e}")
            time.sleep(2 ** attempt)

    return None


def contacts_for_account(conn, account_id):
    """Count existing contacts for an account."""
    cur = conn.execute(
        "SELECT COUNT(*) FROM contacts WHERE account_id = ?", (account_id,)
    )
    return cur.fetchone()[0]


def save_contact(conn, account_id, person, domain=None):
    """Save a contact from Apollo response."""
    apollo_id = person.get('id', '')
    first_name = person.get('first_name', '')
    last_name = person.get('last_name', '')
    email = person.get('email', '')
    title = person.get('title', '')
    linkedin_url = person.get('linkedin_url', '')

    # Check if already exists
    existing = conn.execute(
        "SELECT id FROM contacts WHERE account_id = ? AND (apollo_id = ? OR (first_name = ? AND last_name = ?))",
        (account_id, apollo_id, first_name, last_name),
    ).fetchone()

    if existing:
        return False

    conn.execute(
        """INSERT INTO contacts
           (account_id, first_name, last_name, email, title, linkedin_url, apollo_id, source, is_primary, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'apollo', 0, datetime('now'), datetime('now'))""",
        (account_id, first_name, last_name, email, title, linkedin_url, apollo_id),
    )

    conn.commit()

    # Dual-write to Supabase
    if domain:
        try:
            from db_supabase import get_supabase
            sb = get_supabase()
            # Look up Supabase account by domain
            acct = sb.table('accounts').select('id').eq('domain', domain).single().execute()
            if acct.data:
                sb.table('contacts').insert({
                    'account_id': acct.data['id'],
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'title': title,
                    'linkedin_url': linkedin_url,
                    'apollo_id': apollo_id,
                    'source': 'apollo',
                    'is_primary': False,
                }).execute()
        except Exception as e:
            print(f"    [supabase] Warning: {e}")

    return True


def run(limit=100, resume=True):
    """Main entry point for prospect step."""
    print(f"\n[Step 2] Contact Prospecting via Apollo (limit={limit})")

    conn = get_db()

    # Get accounts that need contacts
    accounts = conn.execute(
        """SELECT id, name, domain FROM accounts
           WHERE domain IS NOT NULL AND domain != ''
           ORDER BY id LIMIT ?""",
        (limit,),
    ).fetchall()

    if not accounts:
        print("  No accounts found. Run research step first.")
        return 0

    print(f"  Found {len(accounts)} accounts to prospect\n")

    total_contacts = 0
    for i, (account_id, name, domain) in enumerate(accounts):
        existing = contacts_for_account(conn, account_id)
        if resume and existing >= CONTACTS_PER_COMPANY:
            print(f"  [{i+1}/{len(accounts)}] {name} - already has {existing} contacts, skipping")
            continue

        needed = CONTACTS_PER_COMPANY - existing
        print(f"  [{i+1}/{len(accounts)}] {name} ({domain}) - need {needed} contacts")

        result = apollo_search(domain)
        if not result or 'people' not in result:
            print(f"    [!] No results from Apollo")
            time.sleep(1)
            continue

        added = 0
        for person in result.get('people', []):
            if added >= needed:
                break
            if save_contact(conn, account_id, person, domain=domain):
                added += 1
                print(f"    + {person.get('first_name', '')} {person.get('last_name', '')} - {person.get('title', '')}")

        # Mark first contact as primary
        if added > 0 and existing == 0:
            first_contact = conn.execute(
                "SELECT id FROM contacts WHERE account_id = ? ORDER BY id LIMIT 1",
                (account_id,),
            ).fetchone()
            if first_contact:
                conn.execute("UPDATE contacts SET is_primary = 1 WHERE id = ?", (first_contact[0],))
                conn.commit()

        total_contacts += added
        time.sleep(1)  # Rate limit between companies

    conn.close()
    print(f"\n  Prospecting complete. {total_contacts} contacts added.")
    return total_contacts


if __name__ == "__main__":
    run()
