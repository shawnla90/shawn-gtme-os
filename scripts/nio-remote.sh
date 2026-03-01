#!/bin/bash
# nio-remote.sh — Keeps a Nio chat session alive in tmux for phone access
# Nio = Claude Code + soul file loaded as system prompt
# Managed by launchd: ai.shawnos.nio-remote

set -euo pipefail

TMUX="/opt/homebrew/bin/tmux"
CLAUDE="/opt/homebrew/bin/claude"
SESSION_NAME="nio"
WORK_DIR="/Users/shawnos.ai/shawn-gtme-os"
SOUL_FILE="$WORK_DIR/website/apps/nio-chat/souls/nio-soul.md"
LOG_DIR="$WORK_DIR/data/remote-control"
LOG_FILE="$LOG_DIR/nio-session.log"
# Inner script that tmux will execute - avoids shell quoting issues
LAUNCHER="$LOG_DIR/nio-launcher.sh"

mkdir -p "$LOG_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"
}

# Clear CLAUDECODE env var to avoid nested-session detection
unset CLAUDECODE 2>/dev/null || true

# Check for existing healthy session
if $TMUX has-session -t "$SESSION_NAME" 2>/dev/null; then
  log "Session '$SESSION_NAME' already exists, checking health..."
  if $TMUX list-panes -t "$SESSION_NAME" -F '#{pane_current_command}' 2>/dev/null | grep -qE 'node|claude'; then
    log "Nio is running in existing session. Nothing to do."
    exit 0
  else
    log "Session exists but Nio is not running. Killing stale session."
    $TMUX kill-session -t "$SESSION_NAME" 2>/dev/null || true
  fi
fi

# Verify soul file exists
if [ ! -f "$SOUL_FILE" ]; then
  log "ERROR: Soul file not found at $SOUL_FILE"
  exit 1
fi

# Write a launcher script that tmux will run (avoids quoting hell)
cat > "$LAUNCHER" << 'SCRIPT'
#!/bin/bash
cd /Users/shawnos.ai/shawn-gtme-os
SOUL=$(cat /Users/shawnos.ai/shawn-gtme-os/website/apps/nio-chat/souls/nio-soul.md)
exec /opt/homebrew/bin/claude --append-system-prompt "$SOUL"
SCRIPT
chmod +x "$LAUNCHER"

log "Starting new Nio tmux session '$SESSION_NAME'..."

$TMUX new-session -d -s "$SESSION_NAME" -c "$WORK_DIR" "$LAUNCHER"

log "Nio session started successfully."
