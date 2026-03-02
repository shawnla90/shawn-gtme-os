#!/usr/bin/env python3
"""Sync PostHog ABM page view events to Attio CRM.

Pulls abm_page_viewed events from PostHog, aggregates by company,
and upserts view counts + last view dates to Attio company records.

Usage:
  python3 scripts/abm/posthog_to_attio.py [--days 7] [--dry-run]

Requires in scripts/abm/.env:
  POSTHOG_API_KEY     - PostHog Personal API Key (phx_...)
  POSTHOG_PROJECT_ID  - PostHog project ID (e.g. 325806)
  ATTIO_API_TOKEN     - Attio API token
"""

import argparse
import os
import sys
import time
from collections import defaultdict
from datetime import datetime, timedelta, timezone

import requests

# Load .env
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(SCRIPT_DIR, '.env')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip())

POSTHOG_BASE = 'https://us.posthog.com'
ATTIO_BASE = 'https://api.attio.com/v2'


def posthog_headers():
    key = os.environ.get('POSTHOG_API_KEY', '')
    if not key:
        raise ValueError("POSTHOG_API_KEY not set")
    return {'Authorization': f'Bearer {key}'}


def attio_headers():
    token = os.environ.get('ATTIO_API_TOKEN', '')
    if not token:
        raise ValueError("ATTIO_API_TOKEN not set")
    return {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }


def fetch_abm_events(days=7):
    """Fetch abm_page_viewed events from PostHog for the last N days."""
    project_id = os.environ.get('POSTHOG_PROJECT_ID', '325806')
    after = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

    all_events = []
    url = f'{POSTHOG_BASE}/api/projects/{project_id}/events'
    params = {
        'event': 'abm_page_viewed',
        'after': after,
        'limit': 100,
    }

    while url:
        resp = requests.get(url, params=params, headers=posthog_headers(), timeout=30)
        resp.raise_for_status()
        data = resp.json()
        results = data.get('results', [])
        all_events.extend(results)
        url = data.get('next')
        params = {}  # next URL includes params
        if url:
            time.sleep(0.3)

    return all_events


def aggregate_by_company(events):
    """Group events by company_slug, count views, track last view and contacts."""
    companies = defaultdict(lambda: {
        'views': 0,
        'last_view': None,
        'company_name': '',
        'contacts': set(),
    })

    for event in events:
        props = event.get('properties', {})
        slug = props.get('company_slug', '')
        if not slug:
            continue

        # Skip preview views (Shawn clicking from Attio dashboard)
        if props.get('is_preview') or props.get('preview'):
            continue

        companies[slug]['views'] += 1
        companies[slug]['company_name'] = props.get('company_name', slug)

        ts = event.get('timestamp', '')
        if ts:
            if companies[slug]['last_view'] is None or ts > companies[slug]['last_view']:
                companies[slug]['last_view'] = ts

        contact = props.get('contact_name', '')
        if contact:
            companies[slug]['contacts'].add(contact)

    # Convert sets to lists for JSON
    for slug in companies:
        companies[slug]['contacts'] = list(companies[slug]['contacts'])

    return dict(companies)


def upsert_attio_note(company_name, views, last_view, contacts, dry_run=False):
    """Update or add a note to an Attio company record with ABM view data."""
    if dry_run:
        print(f"  [DRY RUN] {company_name}: {views} views, last: {last_view}")
        return True

    # Find company in Attio by name
    search_resp = requests.post(
        f'{ATTIO_BASE}/objects/companies/records/query',
        json={
            'filter': {
                'name': {'$contains': company_name}
            },
            'limit': 1,
        },
        headers=attio_headers(),
        timeout=30,
    )

    if search_resp.status_code != 200:
        print(f"  [!] Failed to search Attio for {company_name}: {search_resp.status_code}")
        return False

    records = search_resp.json().get('data', [])
    if not records:
        print(f"  [!] Company not found in Attio: {company_name}")
        return False

    record_id = records[0]['id']['record_id']

    # Format the last_view date
    view_date = last_view[:10] if last_view else 'unknown'
    contact_list = ', '.join(contacts) if contacts else 'anonymous'

    # Create a note on the company record
    note_title = f"ABM Page Activity - {view_date}"
    note_body = (
        f"{views} page view{'s' if views != 1 else ''} in the last period.\n"
        f"Last viewed: {view_date}\n"
        f"Contacts who viewed: {contact_list}"
    )

    note_resp = requests.post(
        f'{ATTIO_BASE}/notes',
        json={
            'data': {
                'title': note_title,
                'format': 'plaintext',
                'content_plaintext': note_body,
                'parent_object': 'companies',
                'parent_record_id': record_id,
            }
        },
        headers=attio_headers(),
        timeout=30,
    )

    if note_resp.status_code in (200, 201):
        print(f"  + {company_name}: {views} views, note added")
        return True
    else:
        print(f"  [!] Failed to create note for {company_name}: {note_resp.status_code} {note_resp.text[:200]}")
        return False


def sink_to_supabase(events, dry_run=False):
    """Write PostHog view events to Supabase page_views table."""
    try:
        from db_supabase import get_supabase
        sb = get_supabase()
    except Exception as e:
        print(f"  [supabase] Could not connect: {e}")
        return 0

    rows = []
    for event in events:
        props = event.get('properties', {})
        slug = props.get('company_slug', '')
        if not slug:
            continue
        # Skip preview views
        if props.get('is_preview') or props.get('preview'):
            continue
        rows.append({
            'slug': slug,
            'company_name': props.get('company_name', slug),
            'contact_name': props.get('contact_name', ''),
            'viewed_at': event.get('timestamp', ''),
            'properties': props,
        })

    if not rows:
        return 0

    if dry_run:
        print(f"  [supabase] DRY RUN - would insert {len(rows)} page_views")
        return len(rows)

    inserted = 0
    for row in rows:
        try:
            sb.table('page_views').insert(row).execute()
            inserted += 1
        except Exception:
            pass  # Duplicates or other issues - skip silently

    print(f"  [supabase] Inserted {inserted}/{len(rows)} page_views")
    return inserted


def lookup_domain_for_slug(slug):
    """Look up the company domain from Supabase by landing page slug."""
    try:
        from db_supabase import get_supabase
        sb = get_supabase()
        result = sb.table('landing_pages').select('page_data').eq('slug', slug).single().execute()
        if result.data:
            page_data = result.data.get('page_data', {})
            return page_data.get('domain', '')
    except Exception:
        pass
    return ''


def run(days=7, dry_run=False):
    """Main sync: PostHog events -> Supabase page_views + Attio notes."""
    print(f"\n[PostHog -> Attio] {'DRY RUN - ' if dry_run else ''}Syncing last {days} days\n")

    # Fetch events
    print("  Fetching PostHog events...")
    events = fetch_abm_events(days=days)
    print(f"  Found {len(events)} abm_page_viewed events\n")

    if not events:
        print("  No events to sync. Done.")
        return

    # Sink raw events to Supabase page_views
    sink_to_supabase(events, dry_run=dry_run)

    # Aggregate
    companies = aggregate_by_company(events)
    print(f"  Aggregated into {len(companies)} companies:\n")

    # Sync to Attio
    synced = 0
    for slug, data in sorted(companies.items(), key=lambda x: x[1]['views'], reverse=True):
        # Try domain-based lookup for better Attio matching
        domain = lookup_domain_for_slug(slug)
        company_name = data['company_name']
        if domain:
            print(f"  {company_name} -> domain: {domain}")

        success = upsert_attio_note(
            company_name=company_name,
            views=data['views'],
            last_view=data['last_view'],
            contacts=data['contacts'],
            dry_run=dry_run,
        )
        if success:
            synced += 1
        time.sleep(0.5)

    print(f"\n  Done. {synced}/{len(companies)} companies synced to Attio.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Sync PostHog ABM views to Attio')
    parser.add_argument('--days', type=int, default=7, help='Look back N days (default: 7)')
    parser.add_argument('--dry-run', action='store_true', help='Preview without pushing')
    args = parser.parse_args()
    run(days=args.days, dry_run=args.dry_run)
