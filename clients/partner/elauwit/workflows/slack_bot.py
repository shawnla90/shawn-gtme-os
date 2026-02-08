#!/usr/bin/env python3
"""
Slack Bot Server for Content Capture

Simple Flask server that receives Slack events and handles content capture.
"""

import os
import json
import hmac
import hashlib
import time
from flask import Flask, request, jsonify
from content_capture import parse_message, save_to_category, list_categories

app = Flask(__name__)

# Configuration from environment
SLACK_SIGNING_SECRET = os.getenv('SLACK_SIGNING_SECRET', '')
SLACK_BOT_TOKEN = os.getenv('SLACK_BOT_TOKEN', '')


def verify_slack_signature(timestamp: str, body: str, signature: str) -> bool:
    """
    Verify Slack request signature for security.
    
    Args:
        timestamp: Request timestamp
        body: Raw request body
        signature: Slack signature header
    
    Returns:
        True if signature is valid
    """
    if not SLACK_SIGNING_SECRET:
        # Skip verification if secret not set (for development)
        return True
    
    # Check timestamp (prevent replay attacks)
    if abs(time.time() - int(timestamp)) > 60 * 5:
        return False
    
    # Create signature
    sig_basestring = f"v0:{timestamp}:{body}"
    computed_signature = 'v0=' + hmac.new(
        SLACK_SIGNING_SECRET.encode(),
        sig_basestring.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(computed_signature, signature)


@app.route('/slack/events', methods=['POST'])
def handle_slack_events():
    """Handle Slack event subscriptions."""
    # Verify signature
    timestamp = request.headers.get('X-Slack-Request-Timestamp', '')
    signature = request.headers.get('X-Slack-Signature', '')
    
    if not verify_slack_signature(timestamp, request.get_data(as_text=True), signature):
        return jsonify({'error': 'Invalid signature'}), 401
    
    data = request.json
    
    # Handle URL verification challenge
    if data.get('type') == 'url_verification':
        return jsonify({'challenge': data.get('challenge')})
    
    # Handle event callbacks
    if data.get('type') == 'event_callback':
        event = data.get('event', {})
        
        # Only process message events
        if event.get('type') == 'message':
            # Skip bot messages and message edits
            if event.get('subtype') in ['bot_message', 'message_changed']:
                return jsonify({'status': 'ok'}), 200
            
            # Process message
            text = event.get('text', '')
            channel = event.get('channel', '')
            
            # Parse and save content
            result = parse_message(text)
            
            if result:
                category, content = result
                success, message = save_to_category(category, content)
                
                # Send response back to Slack
                if SLACK_BOT_TOKEN:
                    send_slack_response(channel, success, message, category)
            
            return jsonify({'status': 'ok'}), 200
    
    return jsonify({'status': 'ok'}), 200


@app.route('/slack/commands', methods=['POST'])
def handle_slash_commands():
    """Handle Slack slash commands."""
    # Verify signature
    timestamp = request.headers.get('X-Slack-Request-Timestamp', '')
    signature = request.headers.get('X-Slack-Signature', '')
    
    # For slash commands, need to reconstruct the body from form data
    # Format: key1=value1&key2=value2 (sorted by key)
    if request.content_type == 'application/x-www-form-urlencoded':
        body_parts = []
        for key in sorted(request.form.keys()):
            body_parts.append(f"{key}={request.form[key]}")
        body = '&'.join(body_parts)
    else:
        body = request.get_data(as_text=True)
    
    if not verify_slack_signature(timestamp, body, signature):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Parse form data
    text = request.form.get('text', '')
    channel_id = request.form.get('channel_id', '')
    user_id = request.form.get('user_id', '')
    
    # Parse and save content
    result = parse_message(text)
    
    if result:
        category, content = result
        success, message = save_to_category(category, content)
        
        if success:
            response_text = f"✅ {message}"
        else:
            response_text = f"❌ {message}"
    else:
        # Show help if parsing fails
        categories = ', '.join(list_categories()[:5])
        response_text = f"Usage: `/capture <category> <content>`\n\nAvailable categories: {categories}, ..."
    
    return jsonify({
        'response_type': 'ephemeral',
        'text': response_text
    })


def send_slack_response(channel: str, success: bool, message: str, category: str):
    """Send a response message back to Slack."""
    if not SLACK_BOT_TOKEN:
        return
    
    import requests
    
    url = 'https://slack.com/api/chat.postMessage'
    headers = {
        'Authorization': f'Bearer {SLACK_BOT_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    emoji = '✅' if success else '❌'
    payload = {
        'channel': channel,
        'text': f"{emoji} {message}"
    }
    
    try:
        requests.post(url, json=payload, headers=headers, timeout=5)
    except Exception as e:
        print(f"ERROR: Failed to send Slack response: {e}")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'service': 'slack-bot'})


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
