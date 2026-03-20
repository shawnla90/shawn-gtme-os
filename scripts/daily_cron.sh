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
WARN_COUNT=0

# ── Load .env (Slack webhook, etc.) ────────────────────────────────
[[ -f "$REPO_ROOT/.env" ]] && source "$REPO_ROOT/.env"

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

# ── Slack notification helper ─────────────────────────────────────────
send_slack() {
  local status="$1"
  local message="$2"
  if [[ -z "${SLACK_CRON_WEBHOOK:-}" ]]; then
    return 0
  fi
  local hostname
  hostname="$(hostname -s)"
  local payload
  payload=$(printf '{"text":"[%s] %s — %s (%s)"}' "$status" "$TARGET_DATE" "$message" "$hostname")
  curl -s -X POST -H 'Content-type: application/json' \
    --data "$payload" "$SLACK_CRON_WEBHOOK" >/dev/null 2>&1 || true
}

# ── Failure trap ──────────────────────────────────────────────────────
cleanup() {
  local exit_code=$?
  if [[ $exit_code -ne 0 ]]; then
    send_slack "FAILED" "Daily cron failed (exit $exit_code). Check cron.log."
  fi
}
trap cleanup EXIT

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

# ── Step 1b: Run the cost tracker ────────────────────────────────────
log "Running session_cost_tracker.py --date $TARGET_DATE"
if $PYTHON scripts/session_cost_tracker.py --date "$TARGET_DATE" >> "$LOGFILE" 2>&1; then
  log "Cost tracker completed successfully"
else
  log "WARN: Cost tracker failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1c: Run the progression engine ──────────────────────────────
log "Running progression_engine_v3.py"
if $PYTHON scripts/progression_engine_v3.py >> "$LOGFILE" 2>&1; then
  log "Progression engine completed successfully"
else
  log "WARN: Progression engine failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1d: Run the website scanner (Nio vitals) ────────────────────
log "Running website_scanner.py"
if $PYTHON scripts/website_scanner.py >> "$LOGFILE" 2>&1; then
  log "Website scanner completed successfully"
else
  log "WARN: Website scanner failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1e: Run repo stats ─────────────────────────────────────────
log "Running repo_stats.py"
if $PYTHON scripts/repo_stats.py >> "$LOGFILE" 2>&1; then
  log "Repo stats completed successfully"
else
  log "WARN: Repo stats failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1f: Generate skill inventory ────────────────────────────────
log "Running skill_inventory.py"
if $PYTHON scripts/skill_inventory.py >> "$LOGFILE" 2>&1; then
  log "Skill inventory generated"
else
  log "WARN: Skill inventory failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1g: Build content/data index ─────────────────────────────────
log "Running build_index.py"
if $PYTHON scripts/build_index.py >> "$LOGFILE" 2>&1; then
  log "Content index built"
else
  log "WARN: Content index build failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1h: Generate content JSON for Mission Control ────────────────
log "Running generate_content_json.py"
if $PYTHON scripts/generate_content_json.py >> "$LOGFILE" 2>&1; then
  log "Content JSON generated"
else
  log "WARN: Content JSON generation failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1i: Reddit scout ──────────────────────────────────────────────
log "Running reddit_scout.py"
if $PYTHON scripts/reddit_scout.py >> "$LOGFILE" 2>&1; then
  REDDIT_COUNT=$($PYTHON -c "import json; q=json.load(open('data/reddit/queue.json')); print(sum(1 for i in q if i['status']=='scouted'))" 2>/dev/null || echo "?")
  log "Reddit scout completed ($REDDIT_COUNT scouted opportunities)"
  send_slack "REDDIT" "Reddit scout: $REDDIT_COUNT new opportunities found"
else
  log "WARN: Reddit scout failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1j: X/Twitter scout ──────────────────────────────────────────
log "Running x_scout.py"
if $PYTHON scripts/x_scout.py >> "$LOGFILE" 2>&1; then
  X_COUNT=$($PYTHON -c "import json; q=json.load(open('data/x/queue.json')); print(sum(1 for i in q if i['status']=='scouted'))" 2>/dev/null || echo "?")
  log "X scout completed ($X_COUNT scouted opportunities)"
  send_slack "X" "X scout: $X_COUNT new opportunities found"
else
  log "WARN: X scout failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1k: Content performance analytics ─────────────────────────────
log "Running content_performance.py"
if $PYTHON scripts/content_performance.py --days 7 >> "$LOGFILE" 2>&1; then
  log "Content performance report generated"
else
  log "WARN: Content performance report failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1l: Content intel scanner (r/ClaudeCode daily digest) ────────
log "Running daily_content_intel.py --date $TARGET_DATE"
if $PYTHON scripts/daily_content_intel.py --date "$TARGET_DATE" >> "$LOGFILE" 2>&1; then
  log "Content intel scanner completed"
else
  log "WARN: Content intel scanner failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1m: PostHog to Attio sync ────────────────────────────────────
log "Running posthog_to_attio.py"
if $PYTHON scripts/abm/posthog_to_attio.py --days 1 >> "$LOGFILE" 2>&1; then
  log "PostHog to Attio sync completed"
else
  log "WARN: PostHog to Attio sync failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 1m: Mission Control data pipeline ────────────────────────────
# nio_commit_tracker.py → /tmp/nio_mission_control_data.json (commit stats)
# mission_control_updater.py → /tmp/mission_control_enhanced.json (calendar, todos, drafts)
# generate-dashboard-data.js → public/data/*.json (tasks, calendar, memories, team, status)
# generate-metrics.js → public/metrics.json (reads /tmp + public/data/)
NODE="/usr/local/bin/node"
[[ ! -x "$NODE" ]] && NODE="$(which node 2>/dev/null || echo /opt/homebrew/bin/node)"
MC_SCRIPTS="$REPO_ROOT/website/apps/mission-control/scripts"

log "Running nio_commit_tracker.py"
if $PYTHON scripts/nio_commit_tracker.py >> "$LOGFILE" 2>&1; then
  log "Commit tracker completed"
else
  log "WARN: Commit tracker failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

log "Running mission_control_updater.py"
if $PYTHON scripts/mission_control_updater.py >> "$LOGFILE" 2>&1; then
  log "Mission Control updater completed"
else
  log "WARN: Mission Control updater failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

log "Running generate-dashboard-data.js"
if $NODE "$MC_SCRIPTS/generate-dashboard-data.js" >> "$LOGFILE" 2>&1; then
  log "Dashboard data generated"
else
  log "WARN: Dashboard data generation failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

log "Running generate-metrics.js"
if $NODE "$MC_SCRIPTS/generate-metrics.js" >> "$LOGFILE" 2>&1; then
  log "Metrics JSON generated"
else
  log "WARN: Metrics generation failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 2: Generate dashboard image ─────────────────────────────────
log "Running daily_dashboard.py --date $TARGET_DATE"
if $PYTHON scripts/daily_dashboard.py --date "$TARGET_DATE" >> "$LOGFILE" 2>&1; then
  log "Dashboard generated"
else
  log "WARN: Dashboard generation failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 3: Check if there's anything new to commit ──────────────────
JSON_FILE="data/daily-log/${TARGET_DATE}.json"

if [[ ! -f "$JSON_FILE" ]]; then
  log "No JSON produced for $TARGET_DATE — nothing to push"
  log "═══ Daily Cron End (no data) ═══"
  exit 0
fi

# Stage only the daily-log JSON files (PNGs are gitignored)
$GIT add data/daily-log/*.json
$GIT add data/daily-log/cost-tracker/*.json 2>/dev/null || true
$GIT add data/progression/profile.json 2>/dev/null || true
$GIT add data/website-stats.json 2>/dev/null || true
$GIT add data/repo-stats.json 2>/dev/null || true
$GIT add docs/_generated/skill-manifest.md 2>/dev/null || true
$GIT add data/content-analytics/latest.json 2>/dev/null || true
$GIT add data/content-analytics/weekly-report.json 2>/dev/null || true
$GIT add website/apps/mission-control/public/data/content.json 2>/dev/null || true
$GIT add website/apps/mission-control/public/data/content-full.json 2>/dev/null || true
$GIT add website/apps/mission-control/public/metrics.json 2>/dev/null || true
$GIT add website/apps/mission-control/public/data/tasks.json 2>/dev/null || true
$GIT add website/apps/mission-control/public/data/calendar.json 2>/dev/null || true
$GIT add website/apps/mission-control/public/data/memories.json 2>/dev/null || true
$GIT add website/apps/mission-control/public/data/team.json 2>/dev/null || true
$GIT add website/apps/mission-control/public/data/status.json 2>/dev/null || true

# Check if there are staged changes
if $GIT diff --cached --quiet; then
  log "No changes to commit — JSON unchanged from last push"
  log "═══ Daily Cron End (no changes) ═══"
  exit 0
fi

# ── Step 4: Commit ───────────────────────────────────────────────────
COMMIT_MSG="chore: daily tracker scan $TARGET_DATE"
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

# ── Step 5b: Post daily discussion to GitHub ──────────────────────
log "Posting daily discussion for $TARGET_DATE"
if $PYTHON scripts/post_daily_discussion.py --date "$TARGET_DATE" >> "$LOGFILE" 2>&1; then
  log "Daily discussion posted"
else
  log "WARN: Daily discussion post failed (non-fatal, continuing)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

# ── Step 6: Validate RSS feeds (post-deploy smoke test) ───────────
log "Running RSS feed validation (production)"
if bash "$REPO_ROOT/scripts/validate_feeds.sh" --quiet >> "$LOGFILE" 2>&1; then
  log "RSS feeds: HEALTHY"
else
  log "WARN: RSS feed validation found issues (non-fatal, check cron.log)"
  WARN_COUNT=$((WARN_COUNT + 1))
fi

send_slack "SUCCESS" "Daily cron completed. ${WARN_COUNT} warning(s)."
log "═══ Daily Cron End (success) ═══"
