#!/usr/bin/env python3
"""
Push eligible contacts to Lemlist campaign with custom variables.

Reads accounts from Supabase, pushes contacts as leads to a Lemlist
campaign with ABM page URL and gap analysis data as custom variables.

Usage:
  python3 scripts/abm/push_to_lemlist.py --campaign-id cam_xxx --limit 10 --dry-run
  python3 scripts/abm/push_to_lemlist.py --campaign-id cam_xxx --limit 5
"""

import argparse
import json
import os
import sys
import time
from urllib.parse import urlencode

import requests

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import load_env
load_env()

from db_supabase import get_supabase
from qualify import is_actionable_contact

LEMLIST_BASE = 'https://api.lemlist.com/api'


def get_api_key():
    key = os.environ.get('LEMLIST_API_KEY', '')
    if not key:
        raise ValueError("LEMLIST_API_KEY not set. Export it or add to scripts/abm/.env")
    return key


def lemlist_auth(api_key):
    """Lemlist uses Basic auth with empty username and API key as password."""
    return ('', api_key)


def format_top_issues(gap_analysis, max_issues=3):
    """Format gap analysis issues into a readable string for email variable."""
    if not gap_analysis or not gap_analysis.get('issues'):
        return ''

    lines = []
    for issue in gap_analysis['issues'][:max_issues]:
        severity = issue.get('severity', '').upper()
        title = issue.get('title', '')
        detail = issue.get('detail', '')
        lines.append(f"- [{severity}] {title}: {detail}")

    return '\n'.join(lines)


def create_lead(api_key, campaign_id, lead_data, dry_run=False):
    """Create a lead in a Lemlist campaign.

    Returns (lead_id, error) tuple.
    """
    if dry_run:
        return 'dry-run', None

    url = f'{LEMLIST_BASE}/campaigns/{campaign_id}/leads/'

    resp = requests.post(
        url,
        auth=lemlist_auth(api_key),
        json=lead_data,
        params={'deduplicate': 'true'},
        timeout=30,
    )

    if resp.status_code == 200:
        data = resp.json()
        return data.get('_id'), None
    else:
        return None, f"HTTP {resp.status_code}: {resp.text[:200]}"


def add_custom_variables(api_key, lead_id, variables, dry_run=False):
    """Add custom variables to an existing lead."""
    if dry_run or not variables:
        return True, None

    url = f'{LEMLIST_BASE}/leads/{lead_id}/variables'

    resp = requests.post(
        url,
        auth=lemlist_auth(api_key),
        params=variables,
        timeout=30,
    )

    if resp.status_code == 200:
        return True, None
    else:
        return False, f"HTTP {resp.status_code}: {resp.text[:200]}"


def run(campaign_id, limit=10, dry_run=False):
    """Push eligible contacts to Lemlist campaign."""
    print(f"\n[Lemlist Push] {'DRY RUN - ' if dry_run else ''}Campaign: {campaign_id}, Limit: {limit}\n")

    api_key = get_api_key()
    sb = get_supabase()

    # Eligible: accounts with a live page, contact has email, not already pushed to Lemlist
    # Get accounts with live landing pages
    accounts_result = sb.table('accounts').select(
        'id, name, domain, gap_analysis, stage'
    ).in_(
        'stage', ['page_live', 'outreach', 'replied']
    ).order('id').limit(limit * 2).execute()  # Over-fetch for filtering

    accounts = accounts_result.data or []

    if not accounts:
        print("  No eligible accounts (need stage >= page_live).")
        return 0

    print(f"  Found {len(accounts)} candidate accounts\n")

    pushed = 0
    skipped = 0

    for i, account in enumerate(accounts):
        if pushed >= limit:
            break

        # Get primary contact with email, not already in Lemlist
        contact_result = sb.table('contacts').select(
            'id, first_name, last_name, email, title, linkedin_url, lemlist_lead_id, notes, email_status'
        ).eq('account_id', account['id']).not_.is_('email', 'null').order(
            'is_primary', desc=True
        ).limit(3).execute()

        if not contact_result.data:
            continue

        # Find first actionable contact (has email + relevant title)
        contact = None
        for c in contact_result.data:
            if c.get('lemlist_lead_id'):
                skipped += 1
                continue
            if not is_actionable_contact(c):
                continue
            if c.get('email_status') == 'invalid':
                skipped += 1
                continue
            contact = c
            break

        if not contact:
            continue

        # Get landing page URL
        lp_result = sb.table('landing_pages').select('url').eq(
            'account_id', account['id']
        ).eq('status', 'live').limit(1).execute()
        page_url = lp_result.data[0]['url'] if lp_result.data else ''

        print(f"  [{pushed+1}/{limit}] {account['name']} - {contact['email']}")

        # Build lead data (standard fields)
        lead_data = {
            'email': contact['email'],
            'firstName': contact.get('first_name', ''),
            'lastName': contact.get('last_name', ''),
            'companyName': account['name'],
            'companyDomain': account['domain'],
        }

        if contact.get('title'):
            lead_data['jobTitle'] = contact['title']
        if contact.get('linkedin_url'):
            lead_data['linkedinUrl'] = contact['linkedin_url']

        # Create lead in Lemlist
        lead_id, error = create_lead(api_key, campaign_id, lead_data, dry_run=dry_run)

        if error:
            print(f"    [!] Failed: {error}")
            continue

        # Build custom variables
        custom_vars = {}
        if page_url:
            custom_vars['pageUrl'] = page_url

        # Gap analysis variables
        gap = account.get('gap_analysis')
        if gap:
            custom_vars['gapScore'] = str(gap.get('score', ''))
            custom_vars['issuesCount'] = str(gap.get('issues_count', ''))
            custom_vars['topIssues'] = format_top_issues(gap)
            custom_vars['domain'] = account['domain']

        # Add custom variables
        if custom_vars:
            ok, var_error = add_custom_variables(api_key, lead_id, custom_vars, dry_run=dry_run)
            if var_error:
                print(f"    [!] Custom vars failed: {var_error}")
            elif not dry_run:
                print(f"    + {len(custom_vars)} custom variables set")

        # Update contact with Lemlist lead ID
        if not dry_run and lead_id:
            sb.table('contacts').update({
                'lemlist_lead_id': lead_id
            }).eq('id', contact['id']).execute()

            # Advance stage to outreach if not already
            if account.get('stage') == 'page_live':
                sb.table('accounts').update({
                    'stage': 'outreach',
                    'outreach_status': 'emailed',
                }).eq('id', account['id']).execute()

        if dry_run:
            print(f"    [DRY RUN] Would push to Lemlist")
            if page_url:
                print(f"    Page URL: {page_url}")
            if gap:
                print(f"    Gap score: {gap.get('score')}/100, {gap.get('issues_count')} issues")

        pushed += 1

        # Rate limit: 20 req / 2s, we made 2 requests (create + vars)
        time.sleep(0.3)

    if skipped:
        print(f"\n  Skipped {skipped} contacts already in Lemlist")
    print(f"\n  Done. {pushed} leads {'would be ' if dry_run else ''}pushed to Lemlist.")
    return pushed


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Push ABM contacts to Lemlist campaign')
    parser.add_argument('--campaign-id', required=True, help='Lemlist campaign ID')
    parser.add_argument('--limit', type=int, default=10, help='Max leads to push')
    parser.add_argument('--dry-run', action='store_true', help='Preview without pushing')
    args = parser.parse_args()
    run(campaign_id=args.campaign_id, limit=args.limit, dry_run=args.dry_run)
