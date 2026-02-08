# Automated Replies Fetching Setup

Automate the `/instantlyreplies_elauwit` command to run every 24 hours automatically.

## Option 1: macOS launchd (Recommended)

macOS uses `launchd` instead of cron for better reliability and system integration.

### Step 1: Create Launch Agent

Create file: `~/Library/LaunchAgents/com.elauwit.instantly-replies.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.elauwit.instantly-replies</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/python3</string>
        <string>/Users/shawntenam/Desktop/shawn-gtme-os/clients/partner/elauwit/workflows/fetch-replies-automation.py</string>
    </array>
    
    <key>EnvironmentVariables</key>
    <dict>
        <key>INSTANTLY_API_KEY</key>
        <string>YOUR_INSTANTLY_API_KEY_HERE</string>
        <key>PARTNER</key>
        <string>elauwit</string>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin</string>
    </dict>
    
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>0</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    
    <key>RunAtLoad</key>
    <false/>
    
    <key>StandardOutPath</key>
    <string>/Users/shawntenam/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/replies/automation.log</string>
    
    <key>StandardErrorPath</key>
    <string>/Users/shawntenam/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/replies/automation.error.log</string>
</dict>
</plist>
```

**Important**: 
- Replace `YOUR_INSTANTLY_API_KEY_HERE` with your actual Instantly API key
- This runs daily at **12:00 AM (midnight)**
- Set `RunAtLoad` to `false` so it only runs at the scheduled time (not immediately when loaded)

### Step 2: Load the Launch Agent

```bash
# Load the agent (starts immediately and runs every 24h)
launchctl load ~/Library/LaunchAgents/com.elauwit.instantly-replies.plist

# Check status
launchctl list | grep instantly-replies

# View logs
tail -f ~/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/replies/automation.log
```

### Step 3: Unload (if needed)

```bash
launchctl unload ~/Library/LaunchAgents/com.elauwit.instantly-replies.plist
```

## Option 2: Cron (Alternative)

If you prefer cron, add to your crontab:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 9 AM)
0 9 * * * cd /Users/shawntenam/Desktop/shawn-gtme-os && /usr/local/bin/python3 clients/partner/elauwit/workflows/fetch-replies-automation.py >> clients/partner/elauwit/resources/replies/automation.log 2>&1
```

## Option 3: Cloud-Based (GitHub Actions)

For cloud-based automation that runs even when your Mac is off:

1. Create `.github/workflows/fetch-instantly-replies.yml`:

```yaml
name: Fetch Instantly Replies

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  fetch-replies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install requests
      
      - name: Fetch replies
        env:
          INSTANTLY_API_KEY: ${{ secrets.INSTANTLY_API_KEY }}
          PARTNER: elauwit
        run: |
          python3 clients/partner/elauwit/workflows/fetch-replies-automation.py
      
      - name: Commit and push
        run: |
          git config user.name "Automation Bot"
          git config user.email "bot@leadalchemy.co"
          git add clients/partner/elauwit/resources/replies/
          git diff --staged --quiet || (git commit -m "Auto-fetch Instantly replies $(date +%Y-%m-%d)" && git push)
```

2. Add `INSTANTLY_API_KEY` to GitHub Secrets (Settings → Secrets → Actions)

## Security Notes

- **Never commit API keys** - Use environment variables or secrets
- **Launch agent file** - Store API key in plist (file permissions protect it)
- **GitHub Actions** - Use repository secrets (encrypted)

## Prerequisites

1. **Python 3** with `requests` library:
   ```bash
   pip3 install requests
   ```

2. **Instantly API Key**: Get from https://app.instantly.ai/app/settings/integrations

## Testing

Test the script manually before scheduling:

```bash
cd /Users/shawntenam/Desktop/shawn-gtme-os
export INSTANTLY_API_KEY="your-api-key-here"
export PARTNER="elauwit"
python3 clients/partner/elauwit/workflows/fetch-replies-automation.py
```

Expected output:
```
Fetching replies for elauwit...
Target directory: /Users/shawntenam/Desktop/shawn-gtme-os/clients/partner/elauwit/resources/replies
Found 1 reply(ies)
SAVED: 2026-02-06_22-35-07_tmanzo-jrk-com_78e63aef.md

Completed: Saved 1 new reply file(s)
```

## Monitoring

- Check logs: `tail -f clients/partner/elauwit/resources/replies/automation.log`
- Verify files: `ls -la clients/partner/elauwit/resources/replies/`
- Check last run: `ls -lt clients/partner/elauwit/resources/replies/*.md | head -5`

## Multi-Partner Setup

To run for multiple partners, create separate launch agents or modify the script to loop through partners:

```bash
for partner in elauwit connext exol; do
    export PARTNER=$partner
    python3 clients/partner/$partner/workflows/fetch-replies-automation.py
done
```
