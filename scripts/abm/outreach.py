#!/usr/bin/env python3
"""
Cold email outreach sender with multi-account rotation.

Queries Supabase for accounts with stage='prospect' and outreach_status='new',
renders an email template with their landing page URL, sends via SMTP
using round-robin rotation across Maildoso sending accounts,
and logs to email_sends table.

Usage:
  python3 scripts/abm/outreach.py --limit 10 --dry-run
  python3 scripts/abm/outreach.py --limit 5
  python3 scripts/abm/outreach.py --limit 1 --template cold_outreach_v1
"""

import argparse
import json
import os
import smtplib
import sys
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr, make_msgid

# Add scripts dir to path
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

SEND_DELAY_SECONDS = 3


def load_maildoso_accounts():
    """Load multi-account config from maildoso_accounts.json.

    Falls back to legacy env vars (SMTP_HOST/SMTP_USER/SMTP_PASS) if
    the JSON file doesn't exist, returning a single-account config.
    """
    config_path = os.path.join(SCRIPT_DIR, 'maildoso_accounts.json')

    if os.path.exists(config_path):
        with open(config_path) as f:
            config = json.load(f)
        print(f"  Loaded {len(config['accounts'])} Maildoso accounts from config")
        return config

    # Legacy fallback: single account from env vars
    host = os.environ.get('SMTP_HOST', '')
    user = os.environ.get('SMTP_USER', '')
    password = os.environ.get('SMTP_PASS', '')
    port = int(os.environ.get('SMTP_PORT', '587'))

    if not all([host, user, password]):
        raise ValueError(
            "Either maildoso_accounts.json or SMTP_HOST/SMTP_USER/SMTP_PASS must be configured"
        )

    print("  Using legacy single-account SMTP config")
    return {
        'smtp_host': host,
        'smtp_port': port,
        'imap_host': os.environ.get('IMAP_HOST', ''),
        'password': password,
        'sender_name': os.environ.get('SENDER_NAME', 'Shawn'),
        'per_account_daily_limit': 20,
        'accounts': [{'email': user, 'domain': user.split('@')[1]}],
    }


def get_smtp_for_account(config, account_email):
    """Create an authenticated SMTP connection for a specific account."""
    server = smtplib.SMTP(config['smtp_host'], config['smtp_port'], timeout=30)
    server.starttls()
    server.login(account_email, config['password'])
    return server


def get_account_send_counts(sb, account_emails):
    """Query today's send count per account from email_sends."""
    today = time.strftime('%Y-%m-%dT00:00:00Z')
    counts = {}

    for email_addr in account_emails:
        result = sb.table('email_sends').select('id', count='exact').eq(
            'from_email', email_addr
        ).gte('created_at', today).execute()
        counts[email_addr] = result.count or 0

    return counts


def pick_next_account(config, send_counts, last_index):
    """Round-robin account selection, skipping accounts at their daily limit.

    Returns (account_dict, new_index) or (None, last_index) if all maxed out.
    """
    num_accounts = len(config['accounts'])
    limit = config.get('per_account_daily_limit', 3)

    for offset in range(num_accounts):
        idx = (last_index + 1 + offset) % num_accounts
        acct = config['accounts'][idx]
        if send_counts.get(acct['email'], 0) < limit:
            return acct, idx

    return None, last_index


def render_template(subject, body_html, body_text, variables):
    """Replace {{var}} placeholders in template strings."""
    rendered_subject = subject
    rendered_html = body_html
    rendered_text = body_text

    for key, val in variables.items():
        placeholder = '{{' + key + '}}'
        rendered_subject = rendered_subject.replace(placeholder, val or '')
        rendered_html = rendered_html.replace(placeholder, val or '')
        rendered_text = rendered_text.replace(placeholder, val or '')

    return rendered_subject, rendered_html, rendered_text


def build_message(sender_name, from_email, to_email, subject, body_html, body_text):
    """Build a MIME multipart email message."""
    msg = MIMEMultipart('alternative')
    msg['From'] = formataddr((sender_name, from_email))
    msg['To'] = to_email
    msg['Subject'] = subject
    msg['Message-ID'] = make_msgid(domain=from_email.split('@')[1])

    msg.attach(MIMEText(body_text, 'plain'))
    msg.attach(MIMEText(body_html, 'html'))

    return msg


def run(limit=10, dry_run=False, template_name='cold_outreach_v1'):
    """Send cold outreach emails with multi-account rotation."""
    print(f"\n[Outreach] {'DRY RUN - ' if dry_run else ''}Sending up to {limit} emails\n")

    sb = get_supabase()
    config = load_maildoso_accounts()

    sender_name = config.get('sender_name', 'Shawn')
    per_account_limit = config.get('per_account_daily_limit', 3)
    account_emails = [a['email'] for a in config['accounts']]
    max_per_day = len(config['accounts']) * per_account_limit

    # Check daily send counts per account
    send_counts = get_account_send_counts(sb, account_emails)
    total_sent_today = sum(send_counts.values())
    total_remaining = max_per_day - total_sent_today

    if not dry_run:
        if total_remaining <= 0:
            print(f"  Daily limit reached ({total_sent_today}/{max_per_day} sent today). Try again tomorrow.")
            return 0
        limit = min(limit, total_remaining)
        print(f"  {total_sent_today} sent today, {total_remaining} remaining (cap: {max_per_day})")
        for email_addr, count in send_counts.items():
            print(f"    {email_addr}: {count}/{per_account_limit}")

    # Load template
    tpl_result = sb.table('email_templates').select('*').eq('name', template_name).limit(1).execute()
    if not tpl_result.data:
        print(f"  [!] Template '{template_name}' not found in email_templates table.")
        return 0
    template = tpl_result.data[0]
    print(f"  Using template: {template['name']}")

    # Get eligible accounts: prospect stage, outreach_status = 'new'
    acct_result = sb.table('accounts').select('id, name, domain').eq(
        'stage', 'prospect'
    ).eq('outreach_status', 'new').order('id').limit(limit).execute()
    accounts = acct_result.data or []

    if not accounts:
        print("  No eligible accounts found (stage=prospect, outreach_status=new).")
        return 0

    print(f"  Found {len(accounts)} eligible accounts\n")

    # SMTP connection cache: email -> smtp connection
    smtp_connections = {}
    last_account_index = -1
    sent_count = 0

    try:
        for i, account in enumerate(accounts):
            print(f"  [{i+1}/{len(accounts)}] {account['name']} ({account['domain']})")

            # Pick next sending account (round-robin)
            sending_account, last_account_index = pick_next_account(
                config, send_counts, last_account_index
            )
            if sending_account is None:
                print(f"    [stop] All sending accounts at daily limit")
                break

            from_email = sending_account['email']

            # Get primary contact with email
            contact_result = sb.table('contacts').select(
                'id, first_name, last_name, email'
            ).eq('account_id', account['id']).not_.is_('email', 'null').order(
                'is_primary', desc=True
            ).limit(1).execute()

            if not contact_result.data:
                print(f"    [skip] No contact with email found")
                continue

            contact = contact_result.data[0]
            if not contact.get('email'):
                print(f"    [skip] Contact has no email")
                continue

            # Check if we already sent to this contact
            existing = sb.table('email_sends').select('id').eq(
                'contact_id', contact['id']
            ).not_.in_('status', ['bounced']).limit(1).execute()
            if existing.data:
                print(f"    [skip] Already sent to {contact['email']}")
                continue

            # Get landing page URL
            lp_result = sb.table('landing_pages').select('url').eq(
                'account_id', account['id']
            ).eq('status', 'live').limit(1).execute()
            page_url = lp_result.data[0]['url'] if lp_result.data else ''

            if not page_url:
                print(f"    [skip] No live landing page")
                continue

            # Render template
            variables = {
                'first_name': contact.get('first_name', ''),
                'company': account['name'],
                'page_url': page_url,
                'sender_name': sender_name,
            }

            subject, body_html, body_text = render_template(
                template['subject'], template['body_html'], template['body_text'], variables
            )

            if dry_run:
                print(f"    [DRY RUN] Would send to: {contact['email']} via {from_email}")
                print(f"    Subject: {subject}")
                print(f"    Page URL: {page_url}")
                send_counts[from_email] = send_counts.get(from_email, 0) + 1
                sent_count += 1
                continue

            # Get or create SMTP connection for this sending account
            if from_email not in smtp_connections:
                smtp_connections[from_email] = get_smtp_for_account(config, from_email)

            smtp = smtp_connections[from_email]

            # Build and send email
            msg = build_message(sender_name, from_email, contact['email'], subject, body_html, body_text)
            message_id = msg['Message-ID']

            try:
                smtp.sendmail(from_email, contact['email'], msg.as_string())

                # Log to email_sends (with from_email tracking)
                sb.table('email_sends').insert({
                    'contact_id': contact['id'],
                    'account_id': account['id'],
                    'template_id': template['id'],
                    'to_email': contact['email'],
                    'from_email': from_email,
                    'subject': subject,
                    'status': 'sent',
                    'sent_at': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    'message_id': message_id,
                }).execute()

                # Update account outreach status
                sb.table('accounts').update({
                    'outreach_status': 'emailed'
                }).eq('id', account['id']).execute()

                print(f"    -> Sent to {contact['email']} via {from_email}")
                send_counts[from_email] = send_counts.get(from_email, 0) + 1
                sent_count += 1

            except Exception as e:
                # Log failed send
                sb.table('email_sends').insert({
                    'contact_id': contact['id'],
                    'account_id': account['id'],
                    'template_id': template['id'],
                    'to_email': contact['email'],
                    'from_email': from_email,
                    'subject': subject,
                    'status': 'error',
                    'error': str(e)[:500],
                    'message_id': message_id,
                }).execute()
                print(f"    [!] Send failed: {e}")

            # Rate limit between sends
            time.sleep(SEND_DELAY_SECONDS)

    finally:
        for conn in smtp_connections.values():
            try:
                conn.quit()
            except Exception:
                pass

    print(f"\n  Done. {sent_count} emails {'would be ' if dry_run else ''}sent.")
    return sent_count


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Send cold outreach emails')
    parser.add_argument('--limit', type=int, default=10, help='Max emails to send')
    parser.add_argument('--dry-run', action='store_true', help='Preview without sending')
    parser.add_argument('--template', default='cold_outreach_v1', help='Template name to use')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run, template_name=args.template)
