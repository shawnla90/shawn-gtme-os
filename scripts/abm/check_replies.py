#!/usr/bin/env python3
"""
IMAP reply monitor for cold outreach (multi-account).

Connects to each Maildoso IMAP inbox that has active sends,
matches replies to original sends via In-Reply-To / References headers,
updates email_sends and account statuses.

Usage:
  python3 scripts/abm/check_replies.py --dry-run
  python3 scripts/abm/check_replies.py
"""

import argparse
import email
import imaplib
import json
import os
import re
import sys
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from config import load_env
load_env()

from db_supabase import get_supabase

OPT_OUT_PATTERNS = re.compile(
    r'\b(unsubscribe|stop\s+emailing|remove\s+me|opt\s*out|no\s+thanks|not\s+interested|do\s+not\s+contact)\b',
    re.IGNORECASE
)


def load_maildoso_accounts():
    """Load multi-account config from maildoso_accounts.json.

    Falls back to legacy env vars if the JSON file doesn't exist.
    """
    config_path = os.path.join(SCRIPT_DIR, 'maildoso_accounts.json')

    if os.path.exists(config_path):
        with open(config_path) as f:
            return json.load(f)

    # Legacy fallback
    host = os.environ.get('IMAP_HOST', '')
    user = os.environ.get('IMAP_USER', '')
    password = os.environ.get('IMAP_PASS', '')

    if not all([host, user, password]):
        raise ValueError(
            "Either maildoso_accounts.json or IMAP_HOST/IMAP_USER/IMAP_PASS must be configured"
        )

    return {
        'imap_host': host,
        'password': password,
        'accounts': [{'email': user, 'domain': user.split('@')[1]}],
    }


def get_imap_for_account(config, account_email):
    """Connect to IMAP for a specific account and select inbox."""
    imap = imaplib.IMAP4_SSL(config['imap_host'])
    imap.login(account_email, config['password'])
    imap.select('INBOX')
    return imap


def get_body_text(msg):
    """Extract plain text body from email message."""
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            if content_type == 'text/plain':
                payload = part.get_payload(decode=True)
                if payload:
                    return payload.decode('utf-8', errors='replace')
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            return payload.decode('utf-8', errors='replace')
    return ''


def extract_references(msg):
    """Extract all Message-IDs from In-Reply-To and References headers."""
    refs = set()

    in_reply_to = msg.get('In-Reply-To', '')
    if in_reply_to:
        matches = re.findall(r'<([^>]+)>', in_reply_to)
        refs.update(f'<{m}>' for m in matches)
        if not matches and in_reply_to.strip():
            refs.add(in_reply_to.strip())

    references = msg.get('References', '')
    if references:
        matches = re.findall(r'<([^>]+)>', references)
        refs.update(f'<{m}>' for m in matches)

    return refs


def scan_inbox(config, account_email, msg_id_lookup, sb, dry_run):
    """Scan a single IMAP inbox for replies. Returns (new_replies, opt_outs)."""
    new_replies = 0
    opt_outs = 0

    try:
        imap = get_imap_for_account(config, account_email)
    except Exception as e:
        print(f"    [!] IMAP login failed for {account_email}: {e}")
        return 0, 0

    try:
        # Search for recent messages (last 7 days)
        date_str = time.strftime('%d-%b-%Y', time.gmtime(time.time() - 7 * 86400))
        status, message_nums = imap.search(None, f'(SINCE {date_str})')

        if status != 'OK' or not message_nums[0]:
            print(f"    No recent messages")
            return 0, 0

        msg_ids = message_nums[0].split()
        print(f"    {len(msg_ids)} messages in last 7 days")

        for num in msg_ids:
            status, data = imap.fetch(num, '(RFC822)')
            if status != 'OK':
                continue

            raw_email = data[0][1]
            msg = email.message_from_bytes(raw_email)

            # Check if this is a reply to one of our sends
            references = extract_references(msg)
            matched_send = None

            for ref in references:
                if ref in msg_id_lookup:
                    matched_send = msg_id_lookup[ref]
                    break

            if not matched_send:
                continue

            from_addr = email.utils.parseaddr(msg.get('From', ''))[1]
            body = get_body_text(msg)

            print(f"    Reply from: {from_addr} (re: send #{matched_send['id']})")

            is_opt_out = bool(OPT_OUT_PATTERNS.search(body))

            if is_opt_out:
                new_status = 'opted_out'
                acct_status = 'opted_out'
                print(f"      -> Opt-out detected")
                opt_outs += 1
            else:
                new_status = 'replied'
                acct_status = 'replied'
                new_replies += 1

            if dry_run:
                print(f"      [DRY RUN] Would update send #{matched_send['id']} -> {new_status}")
                continue

            sb.table('email_sends').update({
                'status': new_status,
                'replied_at': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
            }).eq('id', matched_send['id']).execute()

            sb.table('accounts').update({
                'outreach_status': acct_status,
            }).eq('id', matched_send['account_id']).execute()

            del msg_id_lookup[matched_send['message_id']]

    finally:
        try:
            imap.close()
            imap.logout()
        except Exception:
            pass

    return new_replies, opt_outs


def run(dry_run=False):
    """Check for replies across all sending accounts."""
    print(f"\n[Reply Check] {'DRY RUN - ' if dry_run else ''}Scanning inboxes\n")

    sb = get_supabase()
    config = load_maildoso_accounts()

    # Get all active sends with their from_email
    sends_result = sb.table('email_sends').select(
        'id, contact_id, account_id, message_id, to_email, from_email'
    ).eq('status', 'sent').not_.is_('message_id', 'null').execute()

    sent_messages = sends_result.data or []
    if not sent_messages:
        print("  No active outreach emails to check replies for.")
        return 0

    # Build lookup: message_id -> send record
    msg_id_lookup = {}
    active_from_emails = set()
    for send in sent_messages:
        if send.get('message_id'):
            msg_id_lookup[send['message_id']] = send
            if send.get('from_email'):
                active_from_emails.add(send['from_email'])

    print(f"  Tracking {len(msg_id_lookup)} outreach message IDs")

    # Determine which inboxes to scan
    all_account_emails = {a['email'] for a in config['accounts']}

    if active_from_emails:
        # Only scan inboxes that have active sends
        inboxes_to_scan = active_from_emails & all_account_emails
    else:
        # Legacy sends without from_email - scan all inboxes
        inboxes_to_scan = all_account_emails

    if not inboxes_to_scan:
        # Fallback: if from_emails don't match config (e.g. old env var sends),
        # scan all configured accounts
        inboxes_to_scan = all_account_emails

    print(f"  Scanning {len(inboxes_to_scan)} inbox(es)\n")

    total_replies = 0
    total_opt_outs = 0

    for account_email in sorted(inboxes_to_scan):
        print(f"  [{account_email}]")
        replies, opt_outs = scan_inbox(config, account_email, msg_id_lookup, sb, dry_run)
        total_replies += replies
        total_opt_outs += opt_outs

    print(f"\n  Done. {total_replies} new replies, {total_opt_outs} opt-outs detected.")
    return total_replies + total_opt_outs


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Check for replies to outreach emails')
    parser.add_argument('--dry-run', action='store_true', help='Preview without updating')
    args = parser.parse_args()
    run(dry_run=args.dry_run)
