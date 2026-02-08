#!/usr/bin/env python3
"""
Automated Instantly Replies Fetcher for Elauwit

Fetches email replies from Instantly campaigns and saves them to resources/replies/
Designed to run as a scheduled task (cron/launchd) every 24 hours.

Usage:
    python3 fetch-replies-automation.py

Environment Variables:
    INSTANTLY_API_KEY - Instantly API key (required)
    PARTNER - Partner name (default: elauwit)
    SLACK_WEBHOOK_URL - Slack webhook URL for notifications (optional)
"""

import os
import sys
import json
import requests
from datetime import datetime
from pathlib import Path

# Import Slack notifier (optional - fails gracefully if not configured)
try:
    from slack_notifier import send_slack_notification, format_reply_notification, send_reply_summary
    SLACK_AVAILABLE = True
except ImportError:
    SLACK_AVAILABLE = False
    print("WARNING: slack_notifier module not found. Slack notifications disabled.")

# Configuration
PARTNER = os.getenv('PARTNER', 'elauwit')
INSTANTLY_API_KEY = os.getenv('INSTANTLY_API_KEY', '')
SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL', '')
BASE_DIR = Path(__file__).parent.parent.parent.parent.parent
REPLIES_DIR = BASE_DIR / 'clients' / 'partner' / PARTNER / 'resources' / 'replies'

# Campaign name mapping (update as campaigns change)
CAMPAIGN_MAP = {
    "78e63aef-aef8-48bb-b6e2-e68679d48627": "(Unknown Reviews) Co-Star List Wifi Review Campaign",
    "bb1973d7-6e56-48b4-aebb-7a06c93dab0e": "(Known Reviews) Co-Star List Wifi Review Campaign"
}

def fetch_replies():
    """Fetch replies from Instantly API"""
    if not INSTANTLY_API_KEY:
        print("ERROR: INSTANTLY_API_KEY environment variable not set")
        sys.exit(1)
    
    headers = {
        'Authorization': f'Bearer {INSTANTLY_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Fetch emails (received type = replies)
    # Instantly API v2 endpoint
    url = 'https://api.instantly.ai/api/v2/emails'
    params = {
        'email_type': 'received',  # Filter for received emails (replies)
        'limit': 100  # Adjust if you expect more replies
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        # API returns items directly or wrapped in a response object
        if isinstance(data, dict) and 'items' in data:
            return data.get('items', [])
        elif isinstance(data, list):
            return data
        else:
            print(f"WARNING: Unexpected API response format: {type(data)}")
            return []
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Failed to fetch replies from Instantly API: {e}")
        sys.exit(1)

def save_reply(email_data):
    """Save a single reply to markdown file"""
    # Extract data
    email_id = email_data.get('id', '')
    timestamp = email_data.get('timestamp_email') or email_data.get('timestamp_created', '')
    subject = email_data.get('subject', 'No Subject')
    from_email = email_data.get('from_address_email', '')
    from_json = email_data.get('from_address_json', [{}])
    from_name = from_json[0].get('name', '') if from_json else ''
    campaign_id = email_data.get('campaign_id', '')
    campaign_name = CAMPAIGN_MAP.get(campaign_id, 'Unknown Campaign')
    thread_id = email_data.get('thread_id', '')
    step = email_data.get('step', '')
    
    # Get email body
    body_data = email_data.get('body', {})
    body_text = body_data.get('text', '')
    body_html = body_data.get('html', '')
    body = body_text if body_text else (body_html if body_html else 'No body content')
    
    # Parse timestamp
    try:
        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        timestamp_str = dt.strftime('%Y-%m-%d_%H-%M-%S')
    except:
        timestamp_str = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    
    # Sanitize email for filename
    email_sanitized = from_email.replace('@', '-').replace('.', '-')
    campaign_short = campaign_id[:8] if campaign_id else 'unknown'
    
    # Create filename
    filename = f"{timestamp_str}_{email_sanitized}_{campaign_short}.md"
    filepath = REPLIES_DIR / filename
    
    # Skip if file already exists (deduplication)
    if filepath.exists():
        print(f"SKIP: {filename} already exists")
        return None
    
    # Create file content
    content = f"""# Reply from {from_name or from_email}

**Date**: {timestamp}
**Campaign**: {campaign_name}
**Campaign ID**: {campaign_id}
**Subject**: {subject}
**From**: {from_email} ({from_name})

## Email Body

{body}

## Thread Context

Thread ID: {thread_id}

## Metadata

- Email ID: {email_id}
- Thread ID: {thread_id}
- Campaign: {campaign_name}
- Sequence Step: {step}
"""
    
    # Save file
    REPLIES_DIR.mkdir(parents=True, exist_ok=True)
    filepath.write_text(content)
    print(f"SAVED: {filename}")
    
    # Send Slack notification if configured
    if SLACK_AVAILABLE and SLACK_WEBHOOK_URL:
        body_preview = body_text[:200] if body_text else (body_html[:200] if body_html else 'No content')
        blocks = format_reply_notification(from_name, from_email, subject, campaign_name, body_preview, filename)
        send_slack_notification(SLACK_WEBHOOK_URL, f"New reply from {from_email}", blocks)
    
    return {'filename': filename, 'email_data': email_data}

def main():
    """Main execution"""
    print(f"Fetching replies for {PARTNER}...")
    print(f"Target directory: {REPLIES_DIR}")
    
    # Fetch replies
    emails = fetch_replies()
    
    # Filter for received emails (ue_type: 2)
    received_emails = [e for e in emails if e.get('ue_type') == 2]
    
    if not received_emails:
        print(f"No new replies found for {PARTNER}")
        return
    
    print(f"Found {len(received_emails)} reply(ies)")
    
    # Save each reply
    saved_files = []
    for email in received_emails:
        result = save_reply(email)
        if result:
            # Handle both old format (string) and new format (dict)
            if isinstance(result, dict):
                saved_files.append(result['filename'])
            else:
                saved_files.append(result)
    
    # Send summary notification if configured
    if SLACK_AVAILABLE and SLACK_WEBHOOK_URL and saved_files:
        send_reply_summary(SLACK_WEBHOOK_URL, PARTNER, len(saved_files), saved_files)
    
    print(f"\nCompleted: Saved {len(saved_files)} new reply file(s)")

if __name__ == '__main__':
    main()
