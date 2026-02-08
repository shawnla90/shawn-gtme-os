#!/usr/bin/env python3
"""
Slack Notification Helper for Instantly Replies

Sends formatted notifications to Slack when new email replies are received.
Uses Slack Incoming Webhooks for simple, reliable notifications.
"""

import os
import json
import requests
from typing import Optional, Dict, List


def send_slack_notification(
    webhook_url: str,
    message: str,
    blocks: Optional[List[Dict]] = None,
    color: str = "good"
) -> bool:
    """
    Send a notification to Slack via webhook.
    
    Args:
        webhook_url: Slack webhook URL
        message: Plain text message (fallback)
        blocks: Slack Block Kit blocks for rich formatting
        color: Color for attachment (good=green, warning=yellow, danger=red)
    
    Returns:
        True if successful, False otherwise
    """
    if not webhook_url:
        print("WARNING: SLACK_WEBHOOK_URL not set, skipping Slack notification")
        return False
    
    payload = {
        "text": message,  # Fallback text
    }
    
    if blocks:
        payload["blocks"] = blocks
    else:
        # Simple attachment format
        payload["attachments"] = [{
            "color": color,
            "text": message
        }]
    
    try:
        response = requests.post(webhook_url, json=payload, timeout=10)
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Failed to send Slack notification: {e}")
        return False


def format_reply_notification(
    from_name: str,
    from_email: str,
    subject: str,
    campaign_name: str,
    body_preview: str,
    filename: str
) -> List[Dict]:
    """
    Create formatted Slack blocks for a new reply notification.
    
    Returns:
        List of Slack Block Kit blocks
    """
    # Truncate body preview
    body_preview = body_preview[:200] + "..." if len(body_preview) > 200 else body_preview
    
    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "📧 New Email Reply Received"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": f"*From:*\n{from_name or from_email}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Campaign:*\n{campaign_name}"
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Subject:* {subject}"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Preview:*\n```{body_preview}```"
            }
        },
        {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": f"Saved as: `{filename}`"
                }
            ]
        }
    ]
    
    return blocks


def send_reply_summary(
    webhook_url: str,
    partner: str,
    count: int,
    filenames: List[str]
) -> bool:
    """
    Send a summary notification when multiple replies are processed.
    
    Args:
        webhook_url: Slack webhook URL
        partner: Partner name
        count: Number of replies processed
        filenames: List of saved filenames
    
    Returns:
        True if successful, False otherwise
    """
    if not webhook_url:
        return False
    
    if count == 0:
        return False  # Don't send notification if no replies
    
    message = f"✅ Processed {count} new reply(ies) for {partner}"
    
    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": f"📬 Daily Reply Summary - {partner.title()}"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*{count}* new reply(ies) saved"
            }
        }
    ]
    
    # Add file list if not too many
    if len(filenames) <= 10:
        file_list = "\n".join([f"• `{f}`" for f in filenames])
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Files saved:*\n{file_list}"
            }
        })
    else:
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*{len(filenames)} files saved* (too many to list)"
            }
        })
    
    return send_slack_notification(webhook_url, message, blocks, color="good")
