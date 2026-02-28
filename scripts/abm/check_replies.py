#!/usr/bin/env python3
"""
IMAP reply monitor for cold outreach.

Connects to IMAP inbox, matches replies to original sends via
In-Reply-To / References headers, updates email_sends and account statuses.

Usage:
  python3 scripts/abm/check_replies.py --dry-run
  python3 scripts/abm/check_replies.py
"""

import argparse
import email
import imaplib
import os
import re
import sys
import time

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

OPT_OUT_PATTERNS = re.compile(
    r'\b(unsubscribe|stop\s+emailing|remove\s+me|opt\s*out|no\s+thanks|not\s+interested|do\s+not\s+contact)\b',
    re.IGNORECASE
)


def get_imap():
    """Connect to IMAP and select inbox."""
    host = os.environ.get('IMAP_HOST', '')
    user = os.environ.get('IMAP_USER', '')
    password = os.environ.get('IMAP_PASS', '')

    if not all([host, user, password]):
        raise ValueError("IMAP_HOST, IMAP_USER, and IMAP_PASS must be set in scripts/abm/.env")

    imap = imaplib.IMAP4_SSL(host)
    imap.login(user, password)
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
        # Extract Message-ID from angle brackets
        matches = re.findall(r'<([^>]+)>', in_reply_to)
        refs.update(f'<{m}>' for m in matches)
        if not matches and in_reply_to.strip():
            refs.add(in_reply_to.strip())

    references = msg.get('References', '')
    if references:
        matches = re.findall(r'<([^>]+)>', references)
        refs.update(f'<{m}>' for m in matches)

    return refs


def run(dry_run=False):
    """Check for replies to outreach emails."""
    print(f"\n[Reply Check] {'DRY RUN - ' if dry_run else ''}Scanning inbox\n")

    sb = get_supabase()

    # Get all message_ids we've sent (only 'sent' status - active outreach)
    sends_result = sb.table('email_sends').select(
        'id, contact_id, account_id, message_id, to_email'
    ).eq('status', 'sent').not_.is_('message_id', 'null').execute()

    sent_messages = sends_result.data or []
    if not sent_messages:
        print("  No active outreach emails to check replies for.")
        return 0

    # Build lookup: message_id -> send record
    msg_id_lookup = {}
    for send in sent_messages:
        if send.get('message_id'):
            msg_id_lookup[send['message_id']] = send

    print(f"  Tracking {len(msg_id_lookup)} outreach message IDs")

    # Connect to IMAP
    imap = get_imap()

    # Search for recent messages (last 7 days)
    date_str = time.strftime('%d-%b-%Y', time.gmtime(time.time() - 7 * 86400))
    status, message_nums = imap.search(None, f'(SINCE {date_str})')

    if status != 'OK' or not message_nums[0]:
        print("  No recent messages found in inbox.")
        imap.close()
        imap.logout()
        return 0

    msg_ids = message_nums[0].split()
    print(f"  Found {len(msg_ids)} messages in last 7 days")

    new_replies = 0
    opt_outs = 0

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

        print(f"  Reply from: {from_addr} (re: send #{matched_send['id']})")

        # Check for opt-out language
        is_opt_out = bool(OPT_OUT_PATTERNS.search(body))

        if is_opt_out:
            new_status = 'opted_out'
            acct_status = 'opted_out'
            print(f"    -> Opt-out detected")
            opt_outs += 1
        else:
            new_status = 'replied'
            acct_status = 'replied'
            new_replies += 1

        if dry_run:
            print(f"    [DRY RUN] Would update send #{matched_send['id']} -> {new_status}")
            continue

        # Update email_sends
        update_data = {
            'status': new_status,
            'replied_at': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
        }
        sb.table('email_sends').update(update_data).eq('id', matched_send['id']).execute()

        # Update account outreach_status
        sb.table('accounts').update({
            'outreach_status': acct_status,
        }).eq('id', matched_send['account_id']).execute()

        # Remove from lookup so we don't re-process
        del msg_id_lookup[matched_send['message_id']]

    imap.close()
    imap.logout()

    print(f"\n  Done. {new_replies} new replies, {opt_outs} opt-outs detected.")
    return new_replies + opt_outs


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Check for replies to outreach emails')
    parser.add_argument('--dry-run', action='store_true', help='Preview without updating')
    args = parser.parse_args()
    run(dry_run=args.dry_run)
