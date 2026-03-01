#!/usr/bin/env python3
"""Apollo contact prospecting module - finds 3 contacts per company.

Uses seniority + title filtering to ensure only GTM-relevant contacts
enter the pipeline. Title relevance is checked via title_filter module.
"""

import os
import time
import requests

from db_supabase import get_supabase
from title_filter import is_relevant_title

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


def contacts_for_account(sb, account_id):
    """Count existing contacts for an account."""
    result = sb.table('contacts').select('id', count='exact').eq('account_id', account_id).execute()
    return result.count or 0


def save_contact(sb, account_id, person):
    """Save a contact from Apollo response."""
    apollo_id = person.get('id', '')
    first_name = person.get('first_name', '')
    last_name = person.get('last_name', '')
    email = person.get('email', '')
    title = person.get('title', '')
    linkedin_url = person.get('linkedin_url', '')

    # Check if already exists by apollo_id or name
    existing = sb.table('contacts').select('id').eq('account_id', account_id).or_(
        f"apollo_id.eq.{apollo_id},and(first_name.eq.{first_name},last_name.eq.{last_name})"
    ).execute()

    if existing.data:
        return False

    sb.table('contacts').insert({
        'account_id': account_id,
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'title': title,
        'linkedin_url': linkedin_url,
        'apollo_id': apollo_id,
        'source': 'apollo',
        'is_primary': False,
    }).execute()

    return True


def run(limit=100, resume=True):
    """Main entry point for prospect step."""
    print(f"\n[Step 2] Contact Prospecting via Apollo (limit={limit})")

    sb = get_supabase()

    # Get accounts that need contacts
    result = sb.table('accounts').select('id, name, domain').not_.is_('domain', 'null').order('id').limit(limit).execute()
    accounts = result.data or []

    if not accounts:
        print("  No accounts found. Run research step first.")
        return 0

    print(f"  Found {len(accounts)} accounts to prospect\n")

    total_contacts = 0
    for i, account in enumerate(accounts):
        account_id = account['id']
        name = account['name']
        domain = account['domain']

        existing = contacts_for_account(sb, account_id)
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
        skipped_title = 0
        for person in result.get('people', []):
            if added >= needed:
                break

            # Filter by title relevance
            person_title = person.get('title', '')
            if not is_relevant_title(person_title):
                skipped_title += 1
                if skipped_title <= 3:  # Only show first few skips
                    print(f"    [skip] {person.get('first_name', '')} {person.get('last_name', '')} - {person_title} (irrelevant)")
                continue

            if save_contact(sb, account_id, person):
                added += 1
                print(f"    + {person.get('first_name', '')} {person.get('last_name', '')} - {person_title}")
        if skipped_title > 3:
            print(f"    ... and {skipped_title - 3} more irrelevant titles skipped")

        # Mark first contact as primary if it's the first batch
        if added > 0 and existing == 0:
            first_contact = sb.table('contacts').select('id').eq(
                'account_id', account_id
            ).order('id').limit(1).execute()
            if first_contact.data:
                sb.table('contacts').update({'is_primary': True}).eq(
                    'id', first_contact.data[0]['id']
                ).execute()

        total_contacts += added
        time.sleep(1)  # Rate limit between companies

    print(f"\n  Prospecting complete. {total_contacts} contacts added.")
    return total_contacts


if __name__ == "__main__":
    run()
