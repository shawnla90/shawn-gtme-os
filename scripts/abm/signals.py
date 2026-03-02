#!/usr/bin/env python3
"""Signal collection and priority scoring for ABM accounts.

Collects hiring signals from public ATS APIs (Greenhouse, Lever),
combines with LinkedIn relationship data and firmographics,
and computes a composite priority score (0-100) for each account.

Usage:
  python3 scripts/abm/signals.py --dry-run
  python3 scripts/abm/signals.py --limit 76
  python3 scripts/abm/signals.py --hiring-only --limit 10
  python3 scripts/abm/signals.py --score-only
"""

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timedelta

import requests

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

# GTM job title keywords for hiring signal detection
GTM_KEYWORDS = [
    'sales', 'sdr', 'bdr', 'account executive', 'ae ',
    'revenue', 'growth', 'marketing', 'demand gen',
    'demand generation', 'customer success', 'enablement',
    'partnerships', 'gtm', 'go-to-market', 'commercial',
    'field marketing', 'revops', 'revenue operations',
    'business development',
]


def slugify(name):
    """Convert company name or domain to potential ATS slug."""
    # Try domain without TLD first
    if '.' in name:
        name = name.split('.')[0]
    # Lowercase, strip non-alphanumeric, collapse spaces to hyphens
    slug = re.sub(r'[^\w\s-]', '', name.lower().strip())
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug


def is_gtm_title(title):
    """Check if a job title contains GTM-relevant keywords."""
    title_lower = title.lower()
    return any(kw in title_lower for kw in GTM_KEYWORDS)


def check_greenhouse(slug):
    """Check Greenhouse public API for job listings.

    GET https://boards-api.greenhouse.io/v1/boards/{slug}/jobs
    No auth required. Returns {jobs: [...], meta: {total: N}}.
    """
    url = f'https://boards-api.greenhouse.io/v1/boards/{slug}/jobs'
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 404:
            return None
        if resp.status_code != 200:
            return None
        data = resp.json()
        jobs = data.get('jobs', [])
        gtm_jobs = [j for j in jobs if is_gtm_title(j.get('title', ''))]
        return {
            'platform': 'greenhouse',
            'total_jobs': len(jobs),
            'gtm_jobs': len(gtm_jobs),
            'gtm_titles': [j['title'] for j in gtm_jobs[:10]],
        }
    except (requests.RequestException, ValueError):
        return None


def check_lever(slug):
    """Check Lever public API for job listings.

    GET https://api.lever.co/v0/postings/{slug}
    No auth required. Returns array of posting objects.
    """
    url = f'https://api.lever.co/v0/postings/{slug}'
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 404:
            return None
        if resp.status_code != 200:
            return None
        postings = resp.json()
        if not isinstance(postings, list):
            return None
        gtm_postings = [p for p in postings if is_gtm_title(p.get('text', ''))]
        return {
            'platform': 'lever',
            'total_jobs': len(postings),
            'gtm_jobs': len(gtm_postings),
            'gtm_titles': [p['text'] for p in gtm_postings[:10]],
        }
    except (requests.RequestException, ValueError):
        return None


def check_hiring_signals(domain, company_name):
    """Check Greenhouse + Lever public APIs for GTM job listings.

    Tries multiple slug variations. Returns best result or None.
    """
    # Generate slug candidates
    slugs = set()
    if domain:
        slugs.add(slugify(domain))
        # Try without common prefixes
        base = domain.replace('www.', '').split('.')[0]
        slugs.add(base)
    if company_name:
        slugs.add(slugify(company_name))
        # Try without spaces
        slugs.add(re.sub(r'\s+', '', company_name.lower()))

    slugs.discard('')

    best = None

    for slug in slugs:
        # Try Greenhouse
        result = check_greenhouse(slug)
        if result and (not best or result['total_jobs'] > best.get('total_jobs', 0)):
            best = result

        # Rate limit: 1 req/sec
        time.sleep(0.5)

        # Try Lever
        result = check_lever(slug)
        if result and (not best or result['total_jobs'] > best.get('total_jobs', 0)):
            best = result

        time.sleep(0.5)

        # Stop if we found a good match
        if best and best['total_jobs'] > 0:
            break

    if best:
        best['checked_at'] = datetime.now().strftime('%Y-%m-%d')

    return best


def is_within_months(date_str, months):
    """Check if a date string is within N months of today."""
    if not date_str:
        return False
    try:
        # Handle various date formats
        for fmt in ('%Y-%m-%d', '%Y-%m', '%B %Y', '%b %Y'):
            try:
                dt = datetime.strptime(date_str[:10], fmt)
                cutoff = datetime.now() - timedelta(days=months * 30)
                return dt >= cutoff
            except ValueError:
                continue
        return False
    except Exception:
        return False


def compute_priority_score(account, signals):
    """Compute 0-100 composite priority score for outreach prioritization.

    Weights:
      ICP fit:              0-25 pts
      LinkedIn relationship: 0-30 pts (highest weight - warm > cold)
      Hiring GTM roles:     0-20 pts
      Funding recency:      0-15 pts
      Gap analysis quality: 0-10 pts
    """
    score = 0

    # ICP fit (0-25 pts)
    icp = account.get('icp_score') or 50
    score += min(25, int(icp * 0.25))

    # LinkedIn relationship (0-30 pts)
    li = signals.get('linkedin', {})
    if li.get('has_dm_history'):
        score += 30
    elif li.get('connection_count', 0) >= 2:
        score += 25
    elif li.get('connection_count', 0) >= 1:
        score += 20

    # Hiring GTM roles (0-20 pts)
    hiring = signals.get('hiring', {})
    gtm_jobs = hiring.get('gtm_jobs', 0)
    if gtm_jobs >= 3:
        score += 20
    elif gtm_jobs >= 1:
        score += 10

    # Funding recency (0-15 pts)
    funding_date = account.get('latest_funding_date', '')
    if is_within_months(funding_date, 12):
        score += 15
    elif is_within_months(funding_date, 24):
        score += 8

    # Gap analysis quality (0-10 pts)
    gap = account.get('gap_analysis')
    if gap and isinstance(gap, dict):
        gap_score = gap.get('score', 0)
        if gap_score >= 60:
            score += 10
        elif gap_score > 0:
            score += 5

    return min(100, score)


def priority_tier(score):
    """Return tier label for a priority score."""
    if score >= 75:
        return 'hot'
    elif score >= 50:
        return 'warm'
    elif score >= 25:
        return 'cool'
    else:
        return 'cold'


def run(limit=100, dry_run=False, hiring_only=False, score_only=False):
    """Collect all signals and compute priority scores."""
    print(f"\n{'=' * 60}")
    print(f"  Signal Collection & Priority Scoring {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}\n")

    sb = get_supabase()

    # Load accounts
    result = sb.table('accounts').select(
        'id, name, domain, icp_score, signals, gap_analysis, '
        'latest_funding_date, funding_stage, founded_year'
    ).order('id').limit(limit).execute()
    accounts = result.data or []

    if not accounts:
        print("  No accounts found.")
        return 0

    print(f"  Processing {len(accounts)} accounts\n")

    hiring_found = 0
    scored = 0
    tier_counts = {'hot': 0, 'warm': 0, 'cool': 0, 'cold': 0}

    for i, account in enumerate(accounts):
        name = account['name']
        domain = account.get('domain', '')
        signals = account.get('signals') or {}

        print(f"  [{i+1}/{len(accounts)}] {name} ({domain})")

        # Phase 3: Hiring signals (skip if score_only)
        if not score_only:
            # Skip if already checked recently
            existing_hiring = signals.get('hiring', {})
            checked_at = existing_hiring.get('checked_at', '')
            if checked_at and is_within_months(checked_at, 1):
                print(f"    [skip] Hiring checked recently ({checked_at})")
            else:
                print(f"    Checking hiring signals...")
                hiring = check_hiring_signals(domain, name)
                if hiring:
                    signals['hiring'] = hiring
                    hiring_found += 1
                    print(f"    + {hiring['platform']}: {hiring['total_jobs']} total, "
                          f"{hiring['gtm_jobs']} GTM jobs")
                    if hiring['gtm_titles']:
                        for title in hiring['gtm_titles'][:3]:
                            print(f"      - {title}")
                else:
                    signals['hiring'] = {
                        'platform': None,
                        'total_jobs': 0,
                        'gtm_jobs': 0,
                        'gtm_titles': [],
                        'checked_at': datetime.now().strftime('%Y-%m-%d'),
                    }
                    print(f"    [none] No public ATS found")

        if hiring_only:
            if not dry_run:
                sb.table('accounts').update({
                    'signals': json.dumps(signals),
                }).eq('id', account['id']).execute()
            continue

        # Phase 4: Compute priority score
        score = compute_priority_score(account, signals)
        tier = priority_tier(score)
        tier_counts[tier] += 1
        scored += 1

        print(f"    Priority: {score}/100 ({tier.upper()})")

        if not dry_run:
            sb.table('accounts').update({
                'signals': json.dumps(signals),
                'priority_score': score,
            }).eq('id', account['id']).execute()

    # Summary
    print(f"\n{'=' * 60}")
    print(f"  SUMMARY {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"  Accounts processed:  {len(accounts)}")
    if not hiring_only:
        print(f"  Accounts scored:     {scored}")
    print(f"  Hiring signals found: {hiring_found}")
    if not hiring_only:
        print(f"\n  Priority Tiers:")
        print(f"    Hot  (75-100): {tier_counts['hot']:3d} - Personal outreach first")
        print(f"    Warm (50-74):  {tier_counts['warm']:3d} - Standard Lemlist sequence")
        print(f"    Cool (25-49):  {tier_counts['cool']:3d} - Queue for later batches")
        print(f"    Cold (0-24):   {tier_counts['cold']:3d} - Hold / re-qualify")
    print(f"{'=' * 60}\n")

    return scored


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Collect signals and compute priority scores')
    parser.add_argument('--limit', type=int, default=100, help='Max accounts to process')
    parser.add_argument('--dry-run', action='store_true', help='Preview without changes')
    parser.add_argument('--hiring-only', action='store_true', help='Only check hiring signals, skip scoring')
    parser.add_argument('--score-only', action='store_true', help='Only compute scores from existing signals')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run, hiring_only=args.hiring_only, score_only=args.score_only)
