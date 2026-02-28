#!/usr/bin/env python3
"""
Cold email outreach sender.

Queries Supabase for accounts with stage='prospect' and outreach_status='new',
renders an email template with their landing page URL, sends via SMTP,
and logs to email_sends table.

Usage:
  python3 scripts/abm/outreach.py --limit 10 --dry-run
  python3 scripts/abm/outreach.py --limit 5
  python3 scripts/abm/outreach.py --limit 1 --template cold_outreach_v1
"""

import argparse
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

SENDER_NAME = os.environ.get('SENDER_NAME', 'Shawn')
MAX_PER_DAY = 20
SEND_DELAY_SECONDS = 3


def get_smtp():
    """Create an authenticated SMTP connection."""
    host = os.environ.get('SMTP_HOST', '')
    port = int(os.environ.get('SMTP_PORT', '587'))
    user = os.environ.get('SMTP_USER', '')
    password = os.environ.get('SMTP_PASS', '')

    if not all([host, user, password]):
        raise ValueError("SMTP_HOST, SMTP_USER, and SMTP_PASS must be set in scripts/abm/.env")

    server = smtplib.SMTP(host, port, timeout=30)
    server.starttls()
    server.login(user, password)
    return server


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


def build_message(from_email, to_email, subject, body_html, body_text):
    """Build a MIME multipart email message."""
    msg = MIMEMultipart('alternative')
    msg['From'] = formataddr((SENDER_NAME, from_email))
    msg['To'] = to_email
    msg['Subject'] = subject
    msg['Message-ID'] = make_msgid(domain=from_email.split('@')[1])

    msg.attach(MIMEText(body_text, 'plain'))
    msg.attach(MIMEText(body_html, 'html'))

    return msg


def check_already_sent_today(sb):
    """Return count of emails sent today to enforce daily limit."""
    result = sb.table('email_sends').select('id', count='exact').gte(
        'created_at', time.strftime('%Y-%m-%dT00:00:00Z')
    ).execute()
    return result.count or 0


def run(limit=10, dry_run=False, template_name='cold_outreach_v1'):
    """Send cold outreach emails."""
    print(f"\n[Outreach] {'DRY RUN - ' if dry_run else ''}Sending up to {limit} emails\n")

    sb = get_supabase()
    from_email = os.environ.get('SMTP_USER', '')

    # Check daily send count
    if not dry_run:
        sent_today = check_already_sent_today(sb)
        remaining = MAX_PER_DAY - sent_today
        if remaining <= 0:
            print(f"  Daily limit reached ({MAX_PER_DAY} sent today). Try again tomorrow.")
            return 0
        limit = min(limit, remaining)
        print(f"  {sent_today} sent today, {remaining} remaining (cap: {MAX_PER_DAY})")

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

    # Open SMTP connection (reuse for batch)
    smtp = None
    if not dry_run:
        smtp = get_smtp()

    sent_count = 0

    try:
        for i, account in enumerate(accounts):
            print(f"  [{i+1}/{len(accounts)}] {account['name']} ({account['domain']})")

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
                'sender_name': SENDER_NAME,
            }

            subject, body_html, body_text = render_template(
                template['subject'], template['body_html'], template['body_text'], variables
            )

            if dry_run:
                print(f"    [DRY RUN] Would send to: {contact['email']}")
                print(f"    Subject: {subject}")
                print(f"    Page URL: {page_url}")
                sent_count += 1
                continue

            # Build and send email
            msg = build_message(from_email, contact['email'], subject, body_html, body_text)
            message_id = msg['Message-ID']

            try:
                smtp.sendmail(from_email, contact['email'], msg.as_string())

                # Log to email_sends
                sb.table('email_sends').insert({
                    'contact_id': contact['id'],
                    'account_id': account['id'],
                    'template_id': template['id'],
                    'to_email': contact['email'],
                    'subject': subject,
                    'status': 'sent',
                    'sent_at': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    'message_id': message_id,
                }).execute()

                # Update account outreach status
                sb.table('accounts').update({
                    'outreach_status': 'emailed'
                }).eq('id', account['id']).execute()

                print(f"    -> Sent to {contact['email']}")
                sent_count += 1

            except Exception as e:
                # Log failed send
                sb.table('email_sends').insert({
                    'contact_id': contact['id'],
                    'account_id': account['id'],
                    'template_id': template['id'],
                    'to_email': contact['email'],
                    'subject': subject,
                    'status': 'error',
                    'error': str(e)[:500],
                    'message_id': message_id,
                }).execute()
                print(f"    [!] Send failed: {e}")

            # Rate limit between sends
            time.sleep(SEND_DELAY_SECONDS)

    finally:
        if smtp:
            smtp.quit()

    print(f"\n  Done. {sent_count} emails {'would be ' if dry_run else ''}sent.")
    return sent_count


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Send cold outreach emails')
    parser.add_argument('--limit', type=int, default=10, help='Max emails to send')
    parser.add_argument('--dry-run', action='store_true', help='Preview without sending')
    parser.add_argument('--template', default='cold_outreach_v1', help='Template name to use')
    args = parser.parse_args()
    run(limit=args.limit, dry_run=args.dry_run, template_name=args.template)
