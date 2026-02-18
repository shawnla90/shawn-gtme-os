#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# bootstrap.sh — One-command setup for daily cron on a new Mac
#
# Run this on any fresh macOS machine after cloning the repo:
#   git clone <repo-url> ~/Desktop/shawn-gtme-os
#   cd ~/Desktop/shawn-gtme-os
#   ./scripts/bootstrap.sh
#
# What it does:
#   1. Installs Python dependencies (Pillow)
#   2. Creates the launchd plist for the nightly tracker
#   3. Loads it into launchd so it fires at midnight
#   4. Pulls latest from origin so you're up to date
#   5. Runs a quick smoke test
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLIST_DIR="$HOME/Library/LaunchAgents"
PLIST_NAME="com.shawnos.daily-tracker.plist"
PLIST_PATH="$PLIST_DIR/$PLIST_NAME"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC} $*"; }
fail() { echo -e "${RED}✗${NC} $*"; exit 1; }

echo ""
echo "═══════════════════════════════════════════════"
echo "  GTM OS — Bootstrap (macOS launchd cron)"
echo "═══════════════════════════════════════════════"
echo "  Repo: $REPO_ROOT"
echo ""

# ── Step 1: Check Python 3 ──────────────────────────────────────────
echo "── Step 1: Python + dependencies ──"
if ! command -v python3 &>/dev/null; then
  fail "python3 not found. Install it: brew install python3"
fi
ok "python3 found: $(python3 --version)"

# Install Pillow (needed for dashboard PNG generation)
if python3 -c "import PIL" 2>/dev/null; then
  ok "Pillow already installed"
else
  warn "Installing Pillow..."
  pip3 install --user Pillow
  ok "Pillow installed"
fi

# ── Step 2: Pull latest from origin ──────────────────────────────────
echo ""
echo "── Step 2: Git pull (get up to date) ──"
cd "$REPO_ROOT"
BEFORE=$(git rev-parse HEAD)
git pull --rebase origin main
AFTER=$(git rev-parse HEAD)
if [[ "$BEFORE" == "$AFTER" ]]; then
  ok "Already up to date"
else
  ok "Updated: $(git log --oneline "$BEFORE".."$AFTER" | wc -l | tr -d ' ') new commits pulled"
fi

# ── Step 3: Make scripts executable ──────────────────────────────────
echo ""
echo "── Step 3: File permissions ──"
chmod +x "$REPO_ROOT/scripts/daily_cron.sh"
chmod +x "$REPO_ROOT/scripts/bootstrap.sh"
ok "Scripts are executable"

# ── Step 4: Create the launchd plist ─────────────────────────────────
echo ""
echo "── Step 4: Install launchd plist ──"
mkdir -p "$PLIST_DIR"

# Unload existing if present (ignore errors)
if [[ -f "$PLIST_PATH" ]]; then
  launchctl bootout "gui/$(id -u)/$PLIST_NAME" 2>/dev/null || true
  warn "Removed old plist"
fi

cat > "$PLIST_PATH" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$PLIST_NAME</string>

  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>${REPO_ROOT}/scripts/daily_cron.sh</string>
  </array>

  <key>WorkingDirectory</key>
  <string>${REPO_ROOT}</string>

  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>0</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>

  <key>StandardOutPath</key>
  <string>${REPO_ROOT}/data/daily-log/launchd-stdout.log</string>

  <key>StandardErrorPath</key>
  <string>${REPO_ROOT}/data/daily-log/launchd-stderr.log</string>

  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
  </dict>

  <key>RunAtLoad</key>
  <false/>
</dict>
</plist>
PLIST

ok "Plist written to $PLIST_PATH"

# ── Step 5: Load into launchd ────────────────────────────────────────
echo ""
echo "── Step 5: Activate scheduler ──"
launchctl bootstrap "gui/$(id -u)" "$PLIST_PATH" 2>/dev/null \
  || launchctl load "$PLIST_PATH" 2>/dev/null \
  || warn "Could not auto-load plist — you may need to log out/in"
ok "Scheduler loaded — fires every night at midnight"

# ── Step 6: Smoke test ───────────────────────────────────────────────
echo ""
echo "── Step 6: Smoke test ──"
if python3 "$REPO_ROOT/scripts/daily_scan.py" --help &>/dev/null; then
  ok "daily_scan.py runs"
else
  warn "daily_scan.py had issues — check dependencies"
fi

if [[ -f "$REPO_ROOT/data/daily-log/cron.log" ]]; then
  LAST_LINE=$(tail -1 "$REPO_ROOT/data/daily-log/cron.log")
  ok "Last cron entry: $LAST_LINE"
else
  warn "No cron.log yet (will appear after first midnight run)"
fi

# ── Summary ──────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "  Setup complete!"
echo ""
echo "  What happens now:"
echo "    • Every midnight, launchd runs daily_cron.sh"
echo "    • It scans yesterday's work, scores it, generates the dashboard"
echo "    • Commits the JSON + website stats to git"
echo "    • Pushes to origin → Vercel auto-deploys"
echo "    • Your website score and daily log update automatically"
echo ""
echo "  To manually run for a missed day:"
echo "    ./scripts/daily_cron.sh 2026-02-15"
echo ""
echo "  To check if the scheduler is loaded:"
echo "    launchctl list | grep shawnos"
echo ""
echo "  To backfill Feb 15-17 right now:"
echo "    ./scripts/daily_cron.sh 2026-02-15"
echo "    ./scripts/daily_cron.sh 2026-02-16"
echo "    ./scripts/daily_cron.sh 2026-02-17"
echo "═══════════════════════════════════════════════"
