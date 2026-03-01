#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# mission_control_server.sh — Private Mission Control server
#
# Runs on the Mac Mini as a persistent launchd service. Builds the
# Next.js standalone server and starts it on port 3003 with full
# filesystem + SQLite access (code graph shows ALL nodes).
#
# The server auto-rebuilds when sync_main.sh pulls new code (detected
# via git hash comparison).
#
# Usage (manual):
#   ./scripts/mission_control_server.sh
# ──────────────────────────────────────────────────────────────────────
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MC_DIR="$REPO_ROOT/website/apps/mission-control"
LOGFILE="$REPO_ROOT/data/daily-log/mission-control.log"
HASHFILE="$REPO_ROOT/data/.mc-last-build-hash"
PORT=3003
NPM="/opt/homebrew/bin/npm"
NODE="/opt/homebrew/bin/node"

# ── Load .env (MC_PASSWORD, etc.) ────────────────────────────────────
[[ -f "$REPO_ROOT/.env" ]] && source "$REPO_ROOT/.env"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOGFILE"
}

mkdir -p "$(dirname "$LOGFILE")"
log "═══ Mission Control Server Start ═══"

# ── Verify MC_PASSWORD is set ────────────────────────────────────────
if [[ -z "${MC_PASSWORD:-}" ]]; then
  log "ERROR: MC_PASSWORD not set in .env — server cannot start"
  exit 1
fi

cd "$REPO_ROOT"

# ── Build function ───────────────────────────────────────────────────
build_server() {
  log "Installing dependencies..."
  $NPM install >> "$LOGFILE" 2>&1

  log "Building Mission Control standalone..."
  cd "$MC_DIR"
  $NPM run build >> "$LOGFILE" 2>&1
  local exit_code=$?
  cd "$REPO_ROOT"

  if [[ $exit_code -ne 0 ]]; then
    log "ERROR: Build failed (exit $exit_code)"
    return 1
  fi

  # Save current git hash
  /usr/bin/git rev-parse HEAD > "$HASHFILE"
  log "Build succeeded (hash: $(cat "$HASHFILE"))"
  return 0
}

# ── Check if rebuild is needed ───────────────────────────────────────
needs_rebuild() {
  # No standalone output = must build
  if [[ ! -d "$MC_DIR/.next/standalone" ]]; then
    log "No standalone build found — building"
    return 0
  fi

  # Compare git hash
  local current_hash
  current_hash=$(/usr/bin/git rev-parse HEAD)
  local last_hash=""
  [[ -f "$HASHFILE" ]] && last_hash=$(cat "$HASHFILE")

  if [[ "$current_hash" != "$last_hash" ]]; then
    log "Code changed ($last_hash → $current_hash) — rebuilding"
    return 0
  fi

  return 1
}

# ── Initial build if needed ──────────────────────────────────────────
if needs_rebuild; then
  if ! build_server; then
    log "Initial build failed — exiting"
    exit 1
  fi
fi

# ── Start the server ─────────────────────────────────────────────────
log "Starting Next.js standalone server on port $PORT"

# The standalone server needs static + public assets copied
if [[ -d "$MC_DIR/.next/static" ]]; then
  mkdir -p "$MC_DIR/.next/standalone/website/apps/mission-control/.next/static"
  cp -R "$MC_DIR/.next/static/." "$MC_DIR/.next/standalone/website/apps/mission-control/.next/static/"
fi

if [[ -d "$MC_DIR/public" ]]; then
  mkdir -p "$MC_DIR/.next/standalone/website/apps/mission-control/public"
  cp -R "$MC_DIR/public/." "$MC_DIR/.next/standalone/website/apps/mission-control/public/"
fi

export MC_PASSWORD
export PORT=$PORT
export NODE_ENV=production
export HOSTNAME=0.0.0.0

cd "$MC_DIR/.next/standalone/website/apps/mission-control"
exec $NODE server.js
