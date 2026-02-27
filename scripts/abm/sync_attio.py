#!/usr/bin/env python3
"""Sync ABM pipeline data to Attio CRM.

Pushes companies + contacts from local crm.db to Attio,
links contacts to companies, and sets the ABM landing page URL.

Usage:
  python3 scripts/abm/sync_attio.py [--limit 100] [--dry-run]
"""

import argparse
import json
import os
import sqlite3
import time
import requests

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'crm.db')
ATTIO_BASE = 'https://api.attio.com/v2'


def get_token():
    token = os.environ.get('ATTIO_API_TOKEN', '')
    if not token:
        raise ValueError("ATTIO_API_TOKEN not set. Export it or add to scripts/abm/.env")
    return token


def get_db():
    return sqlite3.connect(os.path.abspath(DB_PATH))


def attio_headers(token):
    return {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }


def upsert_company(token, account, dry_run=False):
    """Upsert a company in Attio using domain as matching attribute."""
    research = {}
    if account['exa_research']:
        try:
            research = json.loads(account['exa_research'])
        except json.JSONDecodeError:
            pass

    # Build description from research
    snippets = []
    for entry in research.get('deep_research', [])[:3]:
        text = entry.get('text', '')
        if text:
            snippets.append(text[:200])
    description = ' | '.join(snippets)[:1000] if snippets else ''

    payload = {
        'data': {
            'values': {
                'domains': [{'domain': account['domain']}],
                'name': [{'value': account['name']}],
            }
        }
    }

    if description:
        payload['data']['values']['description'] = [{'value': description}]

    if dry_run:
        print(f"    [DRY RUN] Would upsert company: {account['name']} ({account['domain']})")
        return {'id': {'record_id': 'dry-run'}}

    for attempt in range(3):
        try:
            resp = requests.put(
                f'{ATTIO_BASE}/objects/companies/records?matching_attribute=domains',
                json=payload,
                headers=attio_headers(token),
                timeout=30,
            )

            if resp.status_code == 429:
                wait = min(2 ** (attempt + 1), 30)
                print(f"    Rate limited. Waiting {wait}s...")
                time.sleep(wait)
                continue

            resp.raise_for_status()
            data = resp.json().get('data', {})
            return data.get('id', {})

        except requests.exceptions.RequestException as e:
            print(f"    [!] Attio company upsert failed (attempt {attempt+1}): {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"        Response: {e.response.text[:300]}")
            time.sleep(2 ** attempt)

    return None


def upsert_person(token, contact, company_record_id=None, abm_page_url=None, dry_run=False):
    """Upsert a person in Attio using email as matching attribute."""
    values = {}

    # Name - Attio requires first_name, last_name, AND full_name
    first = (contact.get('first_name') or '').strip()
    last = (contact.get('last_name') or '').strip() or 'Unknown'
    full = f"{first} {last}".strip()
    if first:
        values['name'] = [{'first_name': first, 'last_name': last, 'full_name': full}]

    # Email
    if contact.get('email'):
        values['email_addresses'] = [{'email_address': contact['email']}]

    # Job title
    if contact.get('title'):
        values['job_title'] = [{'value': contact['title']}]

    # LinkedIn
    if contact.get('linkedin_url'):
        values['linkedin'] = [{'value': contact['linkedin_url']}]

    # Description with vibe + ABM page URL
    desc_parts = []
    if contact.get('vibe'):
        desc_parts.append(f"Vibe: {contact['vibe']}")
    if abm_page_url:
        desc_parts.append(f"ABM Page: {abm_page_url}")
    if desc_parts:
        values['description'] = [{'value': ' | '.join(desc_parts)}]

    payload = {
        'data': {
            'values': values
        }
    }

    if dry_run:
        print(f"    [DRY RUN] Would upsert person: {contact.get('first_name', '')} {contact.get('last_name', '')} ({contact.get('email', 'no email')})")
        return {'id': {'record_id': 'dry-run'}}

    # Use email as matching attribute if we have one, otherwise create
    endpoint = f'{ATTIO_BASE}/objects/people/records'
    method = 'post'
    if contact.get('email'):
        endpoint += '?matching_attribute=email_addresses'
        method = 'put'

    for attempt in range(3):
        try:
            if method == 'put':
                resp = requests.put(endpoint, json=payload, headers=attio_headers(token), timeout=30)
            else:
                resp = requests.post(endpoint, json=payload, headers=attio_headers(token), timeout=30)

            if resp.status_code == 429:
                wait = min(2 ** (attempt + 1), 30)
                print(f"    Rate limited. Waiting {wait}s...")
                time.sleep(wait)
                continue

            resp.raise_for_status()
            data = resp.json().get('data', {})
            return data.get('id', {})

        except requests.exceptions.RequestException as e:
            print(f"    [!] Attio person upsert failed (attempt {attempt+1}): {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"        Response: {e.response.text[:300]}")
            time.sleep(2 ** attempt)

    return None


def run(limit=100, dry_run=False):
    """Sync accounts and contacts to Attio."""
    print(f"\n[Attio Sync] {'DRY RUN - ' if dry_run else ''}Syncing up to {limit} accounts\n")

    token = get_token()
    conn = get_db()
    conn.row_factory = sqlite3.Row

    # Get accounts with landing pages
    accounts = conn.execute(
        """SELECT a.id, a.name, a.domain, a.exa_research
           FROM accounts a
           WHERE a.domain IS NOT NULL AND a.domain != ''
           ORDER BY a.id LIMIT ?""",
        (limit,),
    ).fetchall()

    print(f"  Found {len(accounts)} accounts to sync\n")

    synced_companies = 0
    synced_contacts = 0

    for i, account in enumerate(accounts):
        account = dict(account)
        print(f"  [{i+1}/{len(accounts)}] {account['name']} ({account['domain']})")

        # Upsert company
        company_id = upsert_company(token, account, dry_run=dry_run)
        if not company_id:
            print(f"    [!] Failed to upsert company, skipping contacts")
            continue

        company_record_id = company_id.get('record_id') if isinstance(company_id, dict) else None
        synced_companies += 1

        # Get landing page URL if exists
        lp = conn.execute(
            "SELECT url FROM landing_pages WHERE account_id = ?", (account['id'],)
        ).fetchone()
        abm_page_url = lp['url'] if lp else None

        # Get contacts for this account
        contacts = conn.execute(
            """SELECT id, first_name, last_name, email, title, linkedin_url, vibe
               FROM contacts WHERE account_id = ? ORDER BY is_primary DESC, id""",
            (account['id'],),
        ).fetchall()

        for contact in contacts:
            contact = dict(contact)
            person_id = upsert_person(
                token, contact,
                company_record_id=company_record_id,
                abm_page_url=abm_page_url,
                dry_run=dry_run,
            )
            if person_id:
                synced_contacts += 1
                print(f"    + {contact.get('first_name', '')} {contact.get('last_name', '')} - {contact.get('title', '')}")

        time.sleep(0.5)  # Be nice to Attio

    conn.close()
    print(f"\n  Sync complete. {synced_companies} companies, {synced_contacts} contacts pushed to Attio.")
    return synced_companies, synced_contacts


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Sync ABM data to Attio CRM')
    parser.add_argument('--limit', type=int, default=100)
    parser.add_argument('--dry-run', action='store_true', help='Preview without pushing')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run)
