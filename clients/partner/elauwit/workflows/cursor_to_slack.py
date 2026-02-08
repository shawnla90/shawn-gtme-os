#!/usr/bin/env python3
"""
Send messages from Cursor IDE to Slack
"""

import os
import sys
from typing import Optional, Dict, List
from slack_notifier import send_slack_notification


def send_cursor_message(
    message: str,
    webhook_url: Optional[str] = None,
    blocks: Optional[List[Dict]] = None,
    color: str = "good"
) -> bool:
    if not webhook_url:
        webhook_url = os.getenv('SLACK_WEBHOOK_URL_LEAD_ALCHEMY') or os.getenv('SLACK_WEBHOOK_URL')
    
    if not webhook_url:
        print("ERROR: No webhook URL provided")
        return False
    
    cursor_message = f"💻 From Cursor IDE\n\n{message}"
    return send_slack_notification(webhook_url, cursor_message, blocks, color)


def send_reminder(reminder_text: str, webhook_url: Optional[str] = None) -> bool:
    blocks = [
        {"type": "header", "text": {"type": "plain_text", "text": "Reminder"}},
        {"type": "section", "text": {"type": "mrkdwn", "text": reminder_text}}
    ]
    return send_cursor_message(reminder_text, webhook_url, blocks, color="warning")


def send_status_update(status: str, details: str, webhook_url: Optional[str] = None) -> bool:
    color_map = {"complete": "good", "success": "good", "error": "danger", "warning": "warning", "in progress": "warning"}
    color = color_map.get(status.lower(), "good")
    blocks = [
        {"type": "header", "text": {"type": "plain_text", "text": f"📊 Status: {status}"}},
        {"type": "section", "text": {"type": "mrkdwn", "text": details}}
    ]
    return send_cursor_message(f"{status}: {details}", webhook_url, blocks, color)


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 cursor_to_slack.py <message>")
        print("   or: python3 cursor_to_slack.py reminder <reminder-text>")
        print("   or: python3 cursor_to_slack.py status <status> <details>")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == "reminder":
        if len(sys.argv) < 3:
            print("ERROR: Reminder text required")
            sys.exit(1)
        success = send_reminder(" ".join(sys.argv[2:]))
    elif command == "status":
        if len(sys.argv) < 4:
            print("ERROR: Status and details required")
            sys.exit(1)
        success = send_status_update(sys.argv[2], " ".join(sys.argv[3:]))
    else:
        success = send_cursor_message(" ".join(sys.argv[1:]))
    
    if success:
        print("✅ Message sent to Slack successfully")
        sys.exit(0)
    else:
        print("❌ Failed to send message to Slack")
        sys.exit(1)


if __name__ == "__main__":
    main()
