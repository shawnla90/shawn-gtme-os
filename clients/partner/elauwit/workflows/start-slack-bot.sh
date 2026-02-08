#!/bin/bash
# Quick start script for Slack bot server

cd "$(dirname "$0")"

# Check if environment variables are set
if [ -z "$SLACK_BOT_TOKEN" ]; then
    echo "ERROR: SLACK_BOT_TOKEN environment variable not set"
    echo "Set it with: export SLACK_BOT_TOKEN='xoxb-your-token'"
    exit 1
fi

if [ -z "$SLACK_SIGNING_SECRET" ]; then
    echo "WARNING: SLACK_SIGNING_SECRET not set. Signature verification disabled."
fi

# Check if Flask is installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "Installing dependencies..."
    pip3 install -r requirements.txt
fi

# Start the bot server
echo "Starting Slack bot server on port ${PORT:-5000}..."
echo "Make sure to update your Slack app Request URL to point to this server"
echo ""
python3 slack_bot.py
