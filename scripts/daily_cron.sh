#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# daily_cron.sh — Nightly tracker automation
#
# Runs at midnight via macOS launchd. Scans the day that just ended,
# computes scores, generates the dashboard image, commits the JSON
# to git, and pushes to origin so Vercel picks up the new data.
#
# Usage (manual):
#   ./scripts/daily_cron.sh              # scan yesterday (default)
#   ./scripts/daily_cron.sh 2026-02-14   # scan a specific date
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOGFILE="$REPO_ROOT/data/daily-log/cron.log"
PYTHON="/usr/bin/python3"
GIT="/usr/bin/git"

# ── Resolve target date ──────────────────────────────────────────────
# When called by the midnight cron, we scan *yesterday* (the day that
# just ended). A manual override can be passed as $1.
if [[ -n "${1:-}" ]]; then
  TARGET_DATE="$1"
else
  TARGET_DATE="$(date -v-1d +%Y-%m-%d)"
fi

# ── Logging helper ────────────────────────────────────────────────────
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOGFILE"
}

mkdir -p "$(dirname "$LOGFILE")"
log "═══ Daily Cron Start ═══  target=$TARGET_DATE"

cd "$REPO_ROOT"

# ── Step 1: Run the scanner ──────────────────────────────────────────
log "Running daily_scan.py --date $TARGET_DATE"
if $PYTHON scripts/daily_scan.py --date "$TARGET_DATE" >> "$LOGFILE" 2>&1; then
  log "Scanner completed successfully"
else
  log "ERROR: Scanner failed (exit $?)"
  exit 1
fi

# ── Step 2: Generate dashboard image ─────────────────────────────────
log "Running daily_dashboard.py --date $TARGET_DATE"
if $PYTHON scripts/daily_dashboard.py --date "$TARGET_DATE" >> "$LOGFILE" 2>&1; then
  log "Dashboard generated"
else
  log "WARN: Dashboard generation failed (non-fatal, continuing)"
fi

# ── Step 2.5: Run progression engine ─────────────────────────────────
log "Running progression_engine.py"
if $PYTHON scripts/progression_engine.py --skip-avatar -q >> "$LOGFILE" 2>&1; then
  log "Progression updated"
else
  log "WARN: Progression engine failed (non-fatal, continuing)"
fi

# ── Step 2.75: Run website scanner (Nio vitals) ──────────────────────
log "Running website_scanner.py"
if $PYTHON scripts/website_scanner.py >> "$LOGFILE" 2>&1; then
  log "Website stats updated"
else
  log "WARN: Website scanner failed (non-fatal, continuing)"
fi

# ── Step 3: Check if there's anything new to commit ──────────────────
JSON_FILE="data/daily-log/${TARGET_DATE}.json"

if [[ ! -f "$JSON_FILE" ]]; then
  log "No JSON produced for $TARGET_DATE — nothing to push"
  log "═══ Daily Cron End (no data) ═══"
  exit 0
fi

# Stage only the daily-log JSON files (PNGs are gitignored)
$GIT add data/daily-log/*.json data/progression/profile.json data/website-stats.json

# Check if there are staged changes
if $GIT diff --cached --quiet; then
  log "No changes to commit — JSON unchanged from last push"
  log "═══ Daily Cron End (no changes) ═══"
  exit 0
fi

# ── Step 4: Commit ───────────────────────────────────────────────────
COMMIT_MSG="chore: daily tracker + progression + vitals $TARGET_DATE"
log "Committing: $COMMIT_MSG"
$GIT commit -m "$COMMIT_MSG" >> "$LOGFILE" 2>&1

# ── Step 5: Push to origin ───────────────────────────────────────────
log "Pushing to origin/main"
if $GIT push origin HEAD >> "$LOGFILE" 2>&1; then
  log "Push successful — Vercel will auto-deploy"
else
  log "ERROR: Push failed — will retry once after pull --rebase"
  $GIT pull --rebase origin main >> "$LOGFILE" 2>&1
  $GIT push origin HEAD >> "$LOGFILE" 2>&1
  log "Retry push completed"
fi

log "═══ Daily Cron End (success) ═══"
