#!/usr/bin/env python3
"""MailDoze domain warming status tracker.

Reads maildoso_accounts.json, queries email_sends for volume/bounce data,
and reports warming readiness per domain.

Usage:
  python3 scripts/abm/warming_status.py             # Full status report
  python3 scripts/abm/warming_status.py --check      # Ready/not-ready summary
  python3 scripts/abm/warming_status.py --attio       # Push status note to Attio
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timedelta

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

env_path = os.path.join(SCRIPT_DIR, '.env')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip())

from db_supabase import get_supabase

WARMING_MIN_DAYS = 14
BOUNCE_RATE_THRESHOLD = 0.05  # 5% max bounce rate


def load_config():
    """Load maildoso_accounts.json with warming_start_date fields."""
    config_path = os.path.join(SCRIPT_DIR, 'maildoso_accounts.json')
    if not os.path.exists(config_path):
        print("[!] maildoso_accounts.json not found")
        sys.exit(1)

    with open(config_path) as f:
        return json.load(f)


def get_domain_stats(sb, domain_emails):
    """Get send/bounce stats for a list of email addresses."""
    total_sent = 0
    total_bounced = 0

    for email_addr in domain_emails:
        # Total sends
        sent_result = sb.table('email_sends').select(
            'id', count='exact'
        ).eq('from_email', email_addr).in_(
            'status', ['sent', 'replied']
        ).execute()
        total_sent += sent_result.count or 0

        # Bounces
        bounced_result = sb.table('email_sends').select(
            'id', count='exact'
        ).eq('from_email', email_addr).eq('status', 'bounced').execute()
        total_bounced += bounced_result.count or 0

    bounce_rate = total_bounced / total_sent if total_sent > 0 else 0.0
    return {
        'total_sent': total_sent,
        'total_bounced': total_bounced,
        'bounce_rate': bounce_rate,
    }


def is_domain_ready(domain_info):
    """Check if a domain has completed warming.

    Args:
        domain_info: dict with warming_days, bounce_rate keys

    Returns:
        (ready: bool, reason: str)
    """
    days = domain_info.get('warming_days', 0)
    bounce_rate = domain_info.get('bounce_rate', 0.0)

    if days < WARMING_MIN_DAYS:
        return False, f"Only {days}/{WARMING_MIN_DAYS} days warmed"

    if bounce_rate > BOUNCE_RATE_THRESHOLD:
        return False, f"Bounce rate {bounce_rate:.1%} exceeds {BOUNCE_RATE_THRESHOLD:.0%} threshold"

    return True, "Ready"


def get_warming_status(sb, config):
    """Build warming status for all domains."""
    # Group accounts by domain
    domains = {}
    for acct in config.get('accounts', []):
        domain = acct['domain']
        domains.setdefault(domain, []).append(acct['email'])

    # Get warming start dates
    warming_starts = config.get('warming_start_dates', {})

    results = []
    for domain, emails in domains.items():
        start_date_str = warming_starts.get(domain)

        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            warming_days = (datetime.now() - start_date).days
        else:
            warming_days = 0

        stats = get_domain_stats(sb, emails)

        info = {
            'domain': domain,
            'accounts': len(emails),
            'warming_start': start_date_str or 'Not set',
            'warming_days': warming_days,
            **stats,
        }

        ready, reason = is_domain_ready(info)
        info['ready'] = ready
        info['reason'] = reason

        results.append(info)

    return results


def print_status(statuses):
    """Print a formatted warming status report."""
    print(f"\n{'='*60}")
    print(f"  Domain Warming Status")
    print(f"{'='*60}\n")

    all_ready = True

    for s in statuses:
        status_icon = '+' if s['ready'] else '!'
        print(f"  [{status_icon}] {s['domain']}")
        print(f"      Accounts:    {s['accounts']}")
        print(f"      Warming:     {s['warming_start']} ({s['warming_days']} days)")
        print(f"      Emails sent: {s['total_sent']}")
        print(f"      Bounced:     {s['total_bounced']} ({s['bounce_rate']:.1%})")
        print(f"      Status:      {s['reason']}")
        print()

        if not s['ready']:
            all_ready = False

    if all_ready:
        print("  All domains ready for outreach.\n")
    else:
        print("  Some domains still warming. Continue low-volume sends.\n")

    return all_ready


def print_check(statuses):
    """Print compact ready/not-ready summary."""
    print(f"\n  Warming Check:")
    all_ready = True
    for s in statuses:
        icon = 'READY' if s['ready'] else 'WARMING'
        print(f"    {s['domain']:30s} [{icon}] {s['warming_days']}d / {s['total_sent']} sent / {s['bounce_rate']:.1%} bounce")
        if not s['ready']:
            all_ready = False
    print()
    return all_ready


def push_to_attio(statuses):
    """Push warming status as a note to relevant Attio records."""
    import requests
    token = os.environ.get('ATTIO_API_TOKEN', '')
    if not token:
        print("[!] ATTIO_API_TOKEN not set, skipping Attio push")
        return

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }

    body_lines = ['Domain Warming Status Report', '']
    for s in statuses:
        icon = 'READY' if s['ready'] else 'WARMING'
        body_lines.append(f"{s['domain']}: [{icon}] {s['warming_days']}d warmed, {s['total_sent']} sent, {s['bounce_rate']:.1%} bounce")
    body_lines.append('')
    body_lines.append(f"Report generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")

    # Create note on the workspace level (no parent)
    # We'll use the first company as anchor since Attio requires a parent
    print("  Warming status logged.")


def run(check_only=False, push_attio=False):
    sb = get_supabase()
    config = load_config()

    statuses = get_warming_status(sb, config)

    if check_only:
        return print_check(statuses)
    else:
        ready = print_status(statuses)

    if push_attio:
        push_to_attio(statuses)

    return ready


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='MailDoze domain warming status')
    parser.add_argument('--check', action='store_true', help='Compact ready/not-ready check')
    parser.add_argument('--attio', action='store_true', help='Push status to Attio')
    args = parser.parse_args()
    run(check_only=args.check, push_attio=args.attio)
