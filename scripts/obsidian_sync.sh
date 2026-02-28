#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# obsidian_sync.sh — Watch content/ for .md changes, rebuild index.db
#
# Uses fswatch to detect changes with 30-second debounce.
# Designed to run as a launchd agent on MacBook Pro.
#
# Usage:
#   ./scripts/obsidian_sync.sh          # start watching
#   ./scripts/obsidian_sync.sh --once   # single rebuild (no watch)
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PYTHON="/usr/bin/python3"
DEBOUNCE_SECONDS=30
LOGFILE="$REPO_ROOT/data/daily-log/obsidian-sync.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOGFILE"
}

rebuild() {
  log "Change detected — rebuilding index.db"
  if $PYTHON "$REPO_ROOT/scripts/build_index.py" >> "$LOGFILE" 2>&1; then
    log "Index rebuilt successfully"
  else
    log "WARN: Index rebuild failed"
  fi

  # Also regenerate content.json for Mission Control
  if $PYTHON "$REPO_ROOT/scripts/generate_content_json.py" >> "$LOGFILE" 2>&1; then
    log "Content JSON regenerated"
  else
    log "WARN: Content JSON generation failed"
  fi
}

# Single rebuild mode
if [[ "${1:-}" == "--once" ]]; then
  rebuild
  exit 0
fi

# Check for fswatch
if ! command -v fswatch &>/dev/null; then
  echo "fswatch not found. Install with: brew install fswatch"
  exit 1
fi

mkdir -p "$(dirname "$LOGFILE")"
log "Starting Obsidian sync watcher (debounce: ${DEBOUNCE_SECONDS}s)"
log "Watching: $REPO_ROOT/content/"

# Watch for .md file changes in content/ with debounce
fswatch -0 \
  --latency "$DEBOUNCE_SECONDS" \
  --exclude '.*\.DS_Store' \
  --include '.*\.md$' \
  --exclude '.*' \
  "$REPO_ROOT/content/" \
  "$REPO_ROOT/_projects/" \
| while read -d '' _event; do
    rebuild
  done
