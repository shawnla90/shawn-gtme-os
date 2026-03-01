#!/usr/bin/env python3
"""Email validation via DNS MX lookup and provider classification.

Checks every contact email domain for MX records and classifies the
email provider (Google Workspace, Microsoft 365, Other). Optionally
does SMTP RCPT TO validation to check if the mailbox exists.

Results stored in Supabase contacts table (notes field until dedicated
columns are added via migration).

Usage:
  python3 scripts/abm/validate_emails.py --dry-run
  python3 scripts/abm/validate_emails.py --limit 50
  python3 scripts/abm/validate_emails.py --limit 50 --smtp-check
"""

import argparse
import dns.resolver
import os
import smtplib
import socket
import sys
import time

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

# MX provider classification patterns
GOOGLE_MX = ['google', 'gmail', 'googlemail', 'aspmx']
MICROSOFT_MX = ['outlook', 'microsoft', 'office365', 'protection.outlook']
ZOHO_MX = ['zoho']
PROTONMAIL_MX = ['protonmail', 'proton']

# Cache MX lookups per domain (avoids redundant DNS queries)
_mx_cache = {}


def get_mx_records(domain):
    """Get MX records for a domain. Returns list of (priority, exchange) tuples."""
    if domain in _mx_cache:
        return _mx_cache[domain]

    try:
        answers = dns.resolver.resolve(domain, 'MX')
        records = sorted(
            [(r.preference, str(r.exchange).rstrip('.').lower()) for r in answers],
            key=lambda x: x[0]
        )
        _mx_cache[domain] = records
        return records
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN,
            dns.resolver.NoNameservers, dns.exception.Timeout) as e:
        _mx_cache[domain] = []
        return []


def classify_provider(mx_records):
    """Classify email provider from MX records."""
    if not mx_records:
        return 'no_mx'

    # Check the primary MX exchange
    exchanges = [ex for _, ex in mx_records]
    all_mx = ' '.join(exchanges)

    for pattern in GOOGLE_MX:
        if pattern in all_mx:
            return 'google'

    for pattern in MICROSOFT_MX:
        if pattern in all_mx:
            return 'microsoft'

    for pattern in ZOHO_MX:
        if pattern in all_mx:
            return 'zoho'

    for pattern in PROTONMAIL_MX:
        if pattern in all_mx:
            return 'protonmail'

    return 'other'


def smtp_verify(email, mx_host, timeout=10):
    """SMTP RCPT TO check to verify if mailbox exists.

    Returns: 'valid', 'invalid', 'catch_all', or 'unknown'

    Note: Many servers reject RCPT TO checks or return 250 for
    everything (catch-all). This is a best-effort check.
    """
    try:
        server = smtplib.SMTP(timeout=timeout)
        server.connect(mx_host, 25)
        server.helo('thegtmos.ai')
        server.mail('verify@thegtmos.ai')
        code, _ = server.rcpt(email)
        server.quit()

        if code == 250:
            return 'valid'
        elif code == 550:
            return 'invalid'
        else:
            return 'unknown'

    except (smtplib.SMTPException, socket.error, OSError):
        return 'unknown'


def run(limit=50, dry_run=False, smtp_check=False):
    """Main validation: MX lookup + optional SMTP check for all contacts with email."""
    print(f"\n{'=' * 60}")
    print(f"  Email Validation {'(DRY RUN)' if dry_run else ''}")
    if smtp_check:
        print(f"  SMTP verification: ENABLED")
    print(f"{'=' * 60}\n")

    sb = get_supabase()

    # Get contacts with non-empty emails
    result = sb.table('contacts').select(
        'id, first_name, last_name, email, account_id, notes'
    ).neq('email', '').not_.is_('email', 'null').order('id').limit(limit).execute()
    contacts = result.data or []

    if not contacts:
        print("  No contacts with email addresses found.")
        return

    print(f"  Found {len(contacts)} contacts with emails\n")

    # Stats
    providers = {'google': 0, 'microsoft': 0, 'zoho': 0, 'protonmail': 0, 'other': 0, 'no_mx': 0}
    smtp_results = {'valid': 0, 'invalid': 0, 'catch_all': 0, 'unknown': 0}
    domains_checked = set()

    for i, contact in enumerate(contacts):
        email = contact['email']
        name = f"{contact.get('first_name', '')} {contact.get('last_name', '')}".strip()
        domain = email.split('@')[1] if '@' in email else ''

        if not domain:
            print(f"  [{i + 1}] {name} | {email} - invalid format")
            continue

        # MX lookup (cached per domain)
        mx_records = get_mx_records(domain)
        provider = classify_provider(mx_records)
        providers[provider] += 1

        mx_display = mx_records[0][1] if mx_records else 'none'
        print(f"  [{i + 1}/{len(contacts)}] {name:25s} | {email:35s} | {provider:10s} | {mx_display}")

        # SMTP verification (optional)
        email_status = 'unchecked'
        if smtp_check and mx_records and provider != 'no_mx':
            primary_mx = mx_records[0][1]
            email_status = smtp_verify(email, primary_mx)
            smtp_results[email_status] += 1
            if email_status == 'invalid':
                print(f"    [!] SMTP says INVALID")
            elif email_status == 'valid':
                print(f"    [ok] SMTP verified")

        # Update contact with validation results
        if not dry_run:
            updates = {'mx_provider': provider}
            if smtp_check:
                updates['email_status'] = email_status
            sb.table('contacts').update(updates).eq('id', contact['id']).execute()

        domains_checked.add(domain)

    # Summary
    print(f"\n{'=' * 60}")
    print(f"  SUMMARY {'(DRY RUN)' if dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"  Contacts checked:  {len(contacts)}")
    print(f"  Unique domains:    {len(domains_checked)}")
    print(f"\n  Provider Distribution:")
    for provider, count in sorted(providers.items(), key=lambda x: -x[1]):
        if count > 0:
            pct = count / len(contacts) * 100
            print(f"    {provider:15s} {count:4d} ({pct:.0f}%)")

    if smtp_check:
        print(f"\n  SMTP Verification:")
        for status, count in sorted(smtp_results.items(), key=lambda x: -x[1]):
            if count > 0:
                print(f"    {status:15s} {count:4d}")

    print(f"{'=' * 60}\n")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Validate contact emails via MX lookup')
    parser.add_argument('--limit', type=int, default=50, help='Max contacts to check')
    parser.add_argument('--dry-run', action='store_true', help='Preview without updating')
    parser.add_argument('--smtp-check', action='store_true', help='Also do SMTP RCPT TO verification')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run, smtp_check=args.smtp_check)
