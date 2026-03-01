#!/bin/bash
# claude-remote.sh — Keeps a Claude Code session alive in tmux for phone access
# Remote control auto-enabled via enableRemoteControlForAllSessions in settings
# Managed by launchd: ai.shawnos.claude-remote

set -euo pipefail

TMUX="/opt/homebrew/bin/tmux"
CLAUDE="/opt/homebrew/bin/claude"
SESSION_NAME="claude-rc"
WORK_DIR="/Users/shawnos.ai/shawn-gtme-os"
LOG_DIR="$WORK_DIR/data/remote-control"
LOG_FILE="$LOG_DIR/session.log"

mkdir -p "$LOG_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"
}

# Clear CLAUDECODE env var to avoid nested-session detection
unset CLAUDECODE 2>/dev/null || true

# Kill stale session if it exists but has no Claude process
if $TMUX has-session -t "$SESSION_NAME" 2>/dev/null; then
  log "Session '$SESSION_NAME' already exists, checking health..."
  # Check if claude (runs as node) is actually running inside the session
  if $TMUX list-panes -t "$SESSION_NAME" -F '#{pane_current_command}' 2>/dev/null | grep -qE 'node|claude'; then
    log "Claude is running in existing session. Nothing to do."
    exit 0
  else
    log "Session exists but Claude is not running. Killing stale session."
    $TMUX kill-session -t "$SESSION_NAME" 2>/dev/null || true
  fi
fi

log "Starting new tmux session '$SESSION_NAME'..."

# Start Claude in tmux - no pipe so it gets a proper TTY
# Remote control is auto-enabled via settings.json
$TMUX new-session -d -s "$SESSION_NAME" -c "$WORK_DIR" "$CLAUDE"

log "Session started successfully."
