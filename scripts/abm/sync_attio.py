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
import time
import requests

from db_supabase import get_supabase

ATTIO_BASE = 'https://api.attio.com/v2'


def get_token():
    token = os.environ.get('ATTIO_API_TOKEN', '')
    if not token:
        raise ValueError("ATTIO_API_TOKEN not set. Export it or add to scripts/abm/.env")
    return token


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
    """Sync accounts and contacts to Attio (reads from Supabase)."""
    print(f"\n[Attio Sync] {'DRY RUN - ' if dry_run else ''}Syncing up to {limit} accounts\n")

    token = get_token()
    sb = get_supabase()

    # Get accounts from Supabase
    result = sb.table('accounts').select('id, name, domain, exa_research').not_.is_('domain', 'null').order('id').limit(limit).execute()
    accounts = result.data or []

    print(f"  Found {len(accounts)} accounts to sync\n")

    synced_companies = 0
    synced_contacts = 0

    for i, account in enumerate(accounts):
        print(f"  [{i+1}/{len(accounts)}] {account['name']} ({account['domain']})")

        # exa_research is already a dict from JSONB
        if isinstance(account.get('exa_research'), str):
            try:
                account['exa_research'] = json.loads(account['exa_research'])
            except (json.JSONDecodeError, TypeError):
                account['exa_research'] = {}

        # Upsert company
        company_id = upsert_company(token, account, dry_run=dry_run)
        if not company_id:
            print(f"    [!] Failed to upsert company, skipping contacts")
            continue

        company_record_id = company_id.get('record_id') if isinstance(company_id, dict) else None
        synced_companies += 1

        # Get landing page URL from Supabase
        lp_result = sb.table('landing_pages').select('url').eq('account_id', account['id']).limit(1).execute()
        abm_page_url = lp_result.data[0]['url'] if lp_result.data else None

        # Get contacts from Supabase
        contacts_result = sb.table('contacts').select(
            'id, first_name, last_name, email, title, linkedin_url, vibe'
        ).eq('account_id', account['id']).order('is_primary', desc=True).order('id').execute()

        for contact in (contacts_result.data or []):
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

    print(f"\n  Sync complete. {synced_companies} companies, {synced_contacts} contacts pushed to Attio.")
    return synced_companies, synced_contacts


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Sync ABM data to Attio CRM')
    parser.add_argument('--limit', type=int, default=100)
    parser.add_argument('--dry-run', action='store_true', help='Preview without pushing')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run)
