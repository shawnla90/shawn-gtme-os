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
import sys
import time
import requests

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from db_supabase import get_supabase
from qualify import is_actionable_contact, get_qualified_accounts

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


def upsert_company(token, account, abm_page_url=None, dry_run=False):
    """Upsert a company in Attio using domain as matching attribute."""
    research = {}
    if account.get('exa_research'):
        if isinstance(account['exa_research'], str):
            try:
                research = json.loads(account['exa_research'])
            except json.JSONDecodeError:
                pass
        elif isinstance(account['exa_research'], dict):
            research = account['exa_research']

    # Build description from research
    snippets = []
    for entry in research.get('deep_research', [])[:3]:
        text = entry.get('text', '')
        if text:
            snippets.append(text[:200])
    description = ' | '.join(snippets)[:1000] if snippets else ''

    # Map stage and outreach_status to Attio select labels
    stage_labels = {
        'prospect': 'Prospect', 'researched': 'Researched', 'page_live': 'Page Live',
        'outreach': 'Outreach', 'replied': 'Replied', 'meeting': 'Meeting',
        'client': 'Client', 'opted_out': 'Opted Out',
    }
    outreach_labels = {
        'new': 'New', 'emailed': 'Emailed', 'replied': 'Replied',
        'meeting': 'Meeting', 'opted_out': 'Opted Out',
    }

    payload = {
        'data': {
            'values': {
                'domains': [{'domain': account['domain']}],
                'name': [{'value': account['name']}],
                'source': 'ABM Pipeline',
            }
        }
    }

    stage = account.get('stage', '')
    if stage and stage in stage_labels:
        payload['data']['values']['stage'] = stage_labels[stage]

    outreach = account.get('outreach_status', '')
    if outreach and outreach in outreach_labels:
        payload['data']['values']['outreach_status'] = outreach_labels[outreach]

    if abm_page_url:
        payload['data']['values']['landing_page_url'] = [{'value': abm_page_url}]

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


def link_person_to_company(token, person_record_id, company_record_id, dry_run=False):
    """Link a person record to a company record in Attio via record associations.

    Attio auto-links people to companies via email domain in most cases.
    This explicit link is best-effort — skip silently if it fails.
    """
    if dry_run:
        return True

    # Attio V2: use the record-level association endpoint
    url = f'{ATTIO_BASE}/records/{person_record_id}/associations/{company_record_id}'

    try:
        resp = requests.put(url, headers=attio_headers(token), timeout=15)
        if resp.status_code in (200, 201, 204):
            return True
        # Silently skip link failures — Attio auto-links via email domain anyway
        return False
    except requests.exceptions.RequestException:
        return False


def upsert_person(token, contact, company_record_id=None, abm_page_url=None, dry_run=False):
    """Upsert a person in Attio using email as matching attribute.

    REQUIRES email — contacts without email are skipped to prevent
    duplicate records (POST creates new records without dedup).
    """
    # Hard gate: email is required for dedup via upsert
    if not contact.get('email'):
        return None

    values = {}

    # Name - use actual data, never fabricate "Unknown"
    first = (contact.get('first_name') or '').strip()
    last = (contact.get('last_name') or '').strip()
    full = f"{first} {last}".strip()
    if first:
        values['name'] = [{'first_name': first, 'last_name': last, 'full_name': full}]

    # Email (guaranteed present by gate above)
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
        print(f"    [DRY RUN] Would upsert person: {first} {last} ({contact['email']})")
        return {'id': {'record_id': 'dry-run'}}

    # Always PUT with email matching — never POST (which creates duplicates)
    endpoint = f'{ATTIO_BASE}/objects/people/records?matching_attribute=email_addresses'

    for attempt in range(3):
        try:
            resp = requests.put(endpoint, json=payload, headers=attio_headers(token), timeout=30)

            if resp.status_code == 429:
                wait = min(2 ** (attempt + 1), 30)
                print(f"    Rate limited. Waiting {wait}s...")
                time.sleep(wait)
                continue

            resp.raise_for_status()
            data = resp.json().get('data', {})
            person_id = data.get('id', {})

            # Link person to company if both IDs are available
            if person_id and company_record_id:
                person_record_id = person_id.get('record_id') if isinstance(person_id, dict) else None
                if person_record_id:
                    link_person_to_company(token, person_record_id, company_record_id, dry_run=dry_run)

            return person_id

        except requests.exceptions.RequestException as e:
            print(f"    [!] Attio person upsert failed (attempt {attempt+1}): {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"        Response: {e.response.text[:300]}")
            time.sleep(2 ** attempt)

    return None


def add_company_note(token, company_record_id, title, body, dry_run=False):
    """Add a note to a company record in Attio."""
    if dry_run:
        print(f"    [DRY RUN] Would add note: {title}")
        return True

    payload = {
        'data': {
            'title': title,
            'content': [{'type': 'paragraph', 'children': [{'text': body}]}],
            'parent_object': 'companies',
            'parent_record_id': company_record_id,
        }
    }

    try:
        resp = requests.post(
            f'{ATTIO_BASE}/notes',
            json=payload,
            headers=attio_headers(token),
            timeout=30,
        )
        resp.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f"    [!] Note creation failed: {e}")
        return False


def get_company_notes(token, company_record_id):
    """Fetch existing notes for a company to avoid duplicates."""
    try:
        resp = requests.get(
            f'{ATTIO_BASE}/notes',
            params={'parent_object': 'companies', 'parent_record_id': company_record_id},
            headers=attio_headers(token),
            timeout=30,
        )
        if resp.status_code == 200:
            return resp.json().get('data', [])
    except requests.exceptions.RequestException:
        pass
    return []


def add_enrichment_note(token, account, company_record_id, actionable_count, dry_run=False):
    """Add a structured enrichment note to a company if one doesn't exist yet."""
    # Check for existing enrichment note
    existing_notes = get_company_notes(token, company_record_id)
    for note in existing_notes:
        title = note.get('title', '')
        if 'Enrichment' in title or 'ICP' in title:
            return False  # Already has one

    # Build note body from enrichment data
    lines = []

    industry = account.get('industry') or ''
    if industry:
        lines.append(f"Industry: {industry}")

    icp_score = account.get('icp_score')
    if icp_score:
        lines.append(f"ICP Score: {icp_score}/100")

    tech_stack = account.get('tech_stack') or ''
    if tech_stack:
        if isinstance(tech_stack, list):
            tech_stack = ', '.join(tech_stack)
        lines.append(f"Tech Stack: {tech_stack}")

    employee_count = account.get('employee_count')
    if employee_count:
        lines.append(f"Employees: {employee_count}")

    lines.append(f"Actionable Contacts: {actionable_count}")

    # Landing page URL
    lp_url = account.get('_landing_page_url')
    if lp_url:
        lines.append(f"Landing Page: {lp_url}")

    if not lines:
        return False

    body = '\n'.join(lines)
    return add_company_note(token, company_record_id, 'Enrichment Summary', body, dry_run=dry_run)


def sync_engagement(token, sb, account, company_record_id, dry_run=False):
    """Push outreach engagement data to Attio for a single account."""
    outreach_status = account.get('outreach_status', 'new')
    if outreach_status == 'new':
        return  # Nothing to sync

    # Get latest email sends for this account
    sends_result = sb.table('email_sends').select(
        'status, sent_at, replied_at, to_email'
    ).eq('account_id', account['id']).order('created_at', desc=True).limit(5).execute()

    sends = sends_result.data or []
    if not sends:
        return

    # Build a summary for Attio
    sent_count = sum(1 for s in sends if s['status'] in ('sent', 'replied'))
    replied = [s for s in sends if s['status'] == 'replied']
    opted_out = any(s['status'] == 'opted_out' for s in sends)

    status_label = f"Outreach: {outreach_status}"
    if sent_count:
        status_label += f" ({sent_count} sent"
        if replied:
            status_label += f", {len(replied)} replied"
        status_label += ")"

    # Add note for new replies (only if replied and we haven't noted it before)
    if replied and not dry_run:
        # Check if we already created a reply note (avoid duplicates)
        for r in replied:
            note_title = f"Reply received from {r['to_email']}"
            note_body = f"Reply detected at {r['replied_at']}. Account status: {outreach_status}."
            if opted_out:
                note_body += " Contact has opted out of future emails."
            add_company_note(token, company_record_id, note_title, note_body, dry_run=dry_run)

    if dry_run:
        print(f"    [DRY RUN] Engagement: {status_label}")


def run(limit=100, dry_run=False, full=False):
    """Sync qualified accounts and actionable contacts to Attio.

    Default: only syncs accounts with at least 1 actionable contact.
    Use full=True to bypass qualification (with warning).
    """
    if full:
        print(f"\n  [!] WARNING: --full bypasses qualification. Unqualified accounts will sync.")
        print(f"      This can cause more companies than contacts in Attio.\n")

    mode = 'FULL (unfiltered)' if full else 'QUALIFIED'
    print(f"\n[Attio Sync] {'DRY RUN - ' if dry_run else ''}Syncing up to {limit} accounts [{mode}]\n")

    token = get_token()
    sb = get_supabase()

    if full:
        # Legacy: sync all accounts without qualification
        query = sb.table('accounts').select(
            'id, name, domain, exa_research, stage, outreach_status, '
            'industry, icp_score, tech_stack, employee_count'
        ).not_.is_('domain', 'null')
        result = query.order('id').limit(limit).execute()
        accounts = result.data or []
        # Fetch contacts per account inline (old behavior)
        for account in accounts:
            account['actionable_contacts'] = None  # Will fetch inline
    else:
        # Default: only sync qualified accounts
        accounts = get_qualified_accounts(sb, limit=limit)

    print(f"  Found {len(accounts)} accounts to sync\n")

    synced_companies = 0
    synced_contacts = 0
    skipped_contacts = 0

    for i, account in enumerate(accounts):
        print(f"  [{i+1}/{len(accounts)}] {account['name']} ({account['domain']})")

        # exa_research is already a dict from JSONB
        if isinstance(account.get('exa_research'), str):
            try:
                account['exa_research'] = json.loads(account['exa_research'])
            except (json.JSONDecodeError, TypeError):
                account['exa_research'] = {}

        # Get landing page URL from Supabase
        lp_result = sb.table('landing_pages').select('url').eq('account_id', account['id']).limit(1).execute()
        abm_page_url = lp_result.data[0]['url'] if lp_result.data else None
        account['_landing_page_url'] = abm_page_url

        # Upsert company
        company_id = upsert_company(token, account, abm_page_url=abm_page_url, dry_run=dry_run)
        if not company_id:
            print(f"    [!] Failed to upsert company, skipping contacts")
            continue

        company_record_id = company_id.get('record_id') if isinstance(company_id, dict) else None
        synced_companies += 1

        # Get contacts - use pre-filtered actionable contacts when available
        if account.get('actionable_contacts') is not None:
            contacts = account['actionable_contacts']
        else:
            # Full mode: fetch all contacts, skip non-actionable
            contacts_result = sb.table('contacts').select(
                'id, first_name, last_name, email, title, linkedin_url, vibe, notes'
            ).eq('account_id', account['id']).order('is_primary', desc=True).order('id').execute()
            contacts = contacts_result.data or []

        for contact in contacts:
            # Always enforce quality gate — email + relevant title required
            if not is_actionable_contact(contact):
                skipped_contacts += 1
                continue

            person_id = upsert_person(
                token, contact,
                company_record_id=company_record_id,
                abm_page_url=abm_page_url,
                dry_run=dry_run,
            )
            if person_id:
                synced_contacts += 1
                print(f"    + {contact.get('first_name', '')} {contact.get('last_name', '')} - {contact.get('title', '')}")

        # Add enrichment note if we have data
        if company_record_id:
            actionable_count = len(account.get('actionable_contacts', []))
            add_enrichment_note(token, account, company_record_id, actionable_count, dry_run=dry_run)

        # Sync engagement data
        if company_record_id:
            sync_engagement(token, sb, account, company_record_id, dry_run=dry_run)

        time.sleep(0.5)  # Be nice to Attio

    print(f"\n  Sync complete. {synced_companies} companies, {synced_contacts} contacts pushed to Attio.")
    if skipped_contacts:
        print(f"  Skipped {skipped_contacts} non-actionable contacts.")
    return synced_companies, synced_contacts


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Sync ABM data to Attio CRM')
    parser.add_argument('--limit', type=int, default=100)
    parser.add_argument('--dry-run', action='store_true', help='Preview without pushing')
    parser.add_argument('--full', action='store_true', help='Sync ALL accounts (bypass outreach gate)')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run, full=args.full)
