# Slack Integration Setup

Complete guide for setting up Slack notifications and content capture for GTM OS.

## Overview

This integration provides two features:

1. **Notifications** (Phase 1A) - Get notified when new email replies arrive
2. **Content Capture** (Phase 1B) - Capture thoughts/content from Slack and save to markdown files

---

## Part A: Simple Notifications

### Step 1: Create Slack Webhook

1. Go to https://api.slack.com/apps
2. Click **"Create New App"** → **"From scratch"**
3. Name it **"GTM OS Notifications"** and select your workspace
4. Go to **"Incoming Webhooks"** → Enable it
5. Click **"Add New Webhook to Workspace"**
6. Choose a channel (e.g., `#email-replies` or create a private channel)
7. Copy the webhook URL (looks like: `https://hooks.slack.com/services/...`)

### Step 2: Add Webhook to Environment

**For launchd (macOS):**

Update your `~/Library/LaunchAgents/com.elauwit.instantly-replies.plist`:

```xml
<key>EnvironmentVariables</key>
<dict>
    <key>INSTANTLY_API_KEY</key>
    <string>YOUR_INSTANTLY_API_KEY</string>
    <key>PARTNER</key>
    <string>elauwit</string>
    <key>SLACK_WEBHOOK_URL</key>
    <string>YOUR_WEBHOOK_URL_HERE</string>
    <key>PATH</key>
    <string>/usr/local/bin:/usr/bin:/bin</string>
</dict>
```

**For testing:**

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
export INSTANTLY_API_KEY="your-api-key"
export PARTNER="elauwit"
python3 fetch-replies-automation.py
```

### Step 3: Test

Run the script manually to test:

```bash
cd /Users/shawntenam/Desktop/shawn-gtme-os/clients/partner/elauwit/workflows
export SLACK_WEBHOOK_URL="your-webhook-url"
export INSTANTLY_API_KEY="your-key"
python3 fetch-replies-automation.py
```

You should receive a Slack notification!

---

## Part B: Content Capture Bot

### Step 1: Create Slack App

1. Go to https://api.slack.com/apps
2. Click **"Create New App"** → **"From scratch"**
3. Name it **"GTM OS Bot"** and select your workspace
4. Go to **"Bot Token Scopes"** and add:
   - `chat:write` - Send messages
   - `app_mentions:read` - Read mentions
   - `channels:history` - Read channel messages (if using channels)
   - `im:history` - Read DMs (if using DMs)
5. Go to **"OAuth & Permissions"** → **"Install to Workspace"**
6. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### Step 2: Configure Event Subscriptions

1. Go to **"Event Subscriptions"** → Enable it
2. Set **Request URL** to your bot server URL (see deployment below)
   - Example: `https://your-domain.com/slack/events`
   - For local testing: Use ngrok (see below)
3. Subscribe to bot events:
   - `message.channels` - Messages in channels
   - `message.im` - Direct messages
   - `message.groups` - Private channels
4. Click **"Save Changes"**

### Step 3: Create Slash Command (Optional)

1. Go to **"Slash Commands"** → **"Create New Command"**
2. Command: `/capture`
3. Request URL: `https://your-domain.com/slack/commands`
4. Short description: `Capture content to markdown files`
5. Usage hint: `content-idea Your idea here`
6. Click **"Save"**

### Step 4: Get Signing Secret

1. Go to **"Basic Information"**
2. Copy the **Signing Secret** (under "App Credentials")

### Step 5: Set Environment Variables

Create a `.env` file or set environment variables:

```bash
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_SIGNING_SECRET="your-signing-secret"
export PORT=5000
```

### Step 6: Install Dependencies

```bash
pip3 install flask requests
```

### Step 7: Deploy Bot Server

**Option 1: Local with ngrok (for testing)**

1. Install ngrok: `brew install ngrok` or download from https://ngrok.com
2. Start bot server:
   ```bash
   cd /Users/shawntenam/Desktop/shawn-gtme-os/clients/partner/elauwit/workflows
   export SLACK_BOT_TOKEN="your-token"
   export SLACK_SIGNING_SECRET="your-secret"
   python3 slack_bot.py
   ```
3. In another terminal, start ngrok:
   ```bash
   ngrok http 5000
   ```
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update Slack app Request URL to: `https://abc123.ngrok.io/slack/events`
6. Update Slash Command URL to: `https://abc123.ngrok.io/slack/commands`

**Option 2: Cloud Deployment (Railway/Render)**

**Railway:**
1. Create account at https://railway.app
2. New Project → Deploy from GitHub
3. Connect your repo
4. Add environment variables:
   - `SLACK_BOT_TOKEN`
   - `SLACK_SIGNING_SECRET`
   - `PORT=5000`
5. Deploy
6. Copy the Railway URL and update Slack app settings

**Render:**
1. Create account at https://render.com
2. New Web Service → Connect GitHub
3. Build command: `pip install -r requirements.txt` (create requirements.txt)
4. Start command: `python3 slack_bot.py`
5. Add environment variables
6. Deploy

### Step 8: Test Content Capture

**Via Direct Message:**
1. Open Slack
2. Find your bot (search for "GTM OS Bot")
3. Send a DM: `content-idea: New LinkedIn post about automation`
4. Bot should respond: `✅ Saved to content-ideas.md`

**Via Slash Command:**
1. In any channel: `/capture content-idea New post idea`
2. Bot responds with confirmation

**Via Mention (in channel):**
1. In a channel: `@GTM OS Bot content-idea: New idea`
2. Bot responds with confirmation

---

## Usage

### Content Categories

Available categories:

- `content-idea` / `content-ideas` / `content` → `content-ideas.md`
- `workflow` / `workflow-note` / `workflow-notes` → `workflow-notes.md`
- `thought` / `thoughts` → `thoughts.md`
- `improvement` / `improvements` / `improve` → `improvements.md`

### Message Formats

All of these work:

```
content-idea: Your idea here
@gtm-bot content-idea: Your idea here
/capture content-idea Your idea here
workflow: Process improvement note
thought: Random observation
```

### File Location

All captures are saved to:
```
skills/tier-3-content-ops/captures/
├── content-ideas.md
├── workflow-notes.md
├── thoughts.md
└── improvements.md
```

### File Format

Each capture is appended with timestamp:

```markdown
## 2026-02-07 14:30

Your captured content here

---
```

---

## Troubleshooting

### Notifications Not Working

1. Check `SLACK_WEBHOOK_URL` is set correctly
2. Test webhook manually:
   ```bash
   curl -X POST -H 'Content-type: application/json' \
     --data '{"text":"Test"}' \
     YOUR_WEBHOOK_URL
   ```
3. Check automation logs: `tail -f clients/partner/elauwit/resources/replies/automation.log`

### Bot Not Responding

1. Check bot server is running: `curl http://localhost:5000/health`
2. Check Slack app Event Subscriptions shows "Verified" checkmark
3. Check bot has correct scopes (chat:write, etc.)
4. Check environment variables are set
5. Check bot server logs for errors

### Content Not Saving

1. Check file permissions on `captures/` directory
2. Check bot server logs for errors
3. Verify category name is correct (use one of the supported categories)
4. Check message format matches expected patterns

---

## Security Notes

- **Never commit API keys or tokens** - Use environment variables
- **Signing Secret** - Required for production, verifies requests are from Slack
- **Webhook URLs** - Keep private, anyone with URL can send messages
- **Bot Tokens** - Keep secure, they have access to your workspace

---

## Next Steps

- **Phase 2**: Add slash commands for status checks (`/gtm status`, `/gtm fetch`)
- **Phase 3**: Add proactive alerts and monitoring dashboards

---

## Files Created

- `slack_notifier.py` - Notification helper module
- `slack_bot.py` - Flask server for Slack events
- `content_capture.py` - Content parsing and saving logic
- `captures/` directory - Where content is saved
- `slack-integration.md` - This documentation

## Requirements

- Python 3.7+
- `requests` library (for HTTP)
- `flask` library (for bot server)
- Slack workspace with admin access
