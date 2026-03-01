#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# sync_main.sh — Pre-cron git sync
#
# Runs at 23:58 via macOS launchd — 2 minutes before daily_cron.sh.
# Stashes local changes, pulls from origin/main with rebase (remote
# wins all conflicts), restores stash (remote wins conflicts), then
# pushes so the nightly tracker always starts on a clean, synced repo.
#
# Usage (manual):
#   ./scripts/sync_main.sh
# ──────────────────────────────────────────────────────────────────────
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOGFILE="$REPO_ROOT/data/daily-log/sync-main.log"
GIT="/usr/bin/git"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOGFILE"
}

mkdir -p "$(dirname "$LOGFILE")"
log "═══ Sync Main Start ═══"

cd "$REPO_ROOT"

# ── Step 1: Stash local changes ───────────────────────────────────────
STASH_OUTPUT=$($GIT stash 2>&1)
log "Stash: $STASH_OUTPUT"

if echo "$STASH_OUTPUT" | grep -q "No local changes"; then
  STASHED=false
else
  STASHED=true
fi

# ── Step 2: Pull with rebase — remote wins conflicts ──────────────────
log "Pulling with rebase..."
if $GIT pull --rebase origin main >> "$LOGFILE" 2>&1; then
  log "Pull rebase succeeded cleanly"
else
  log "Rebase conflicts detected — resolving with remote (theirs)"
  # Accept remote version for every conflicted file
  CONFLICTS=$($GIT diff --name-only --diff-filter=U 2>/dev/null)
  for file in $CONFLICTS; do
    log "  Conflict resolved (theirs): $file"
    $GIT checkout --theirs "$file"
    $GIT add "$file"
  done
  GIT_EDITOR=true $GIT rebase --continue >> "$LOGFILE" 2>&1 || {
    log "ERROR: rebase --continue failed, aborting"
    $GIT rebase --abort >> "$LOGFILE" 2>&1 || true
    if $STASHED; then $GIT stash pop >> "$LOGFILE" 2>&1 || true; fi
    log "═══ Sync Main End (rebase aborted) ═══"
    exit 1
  }
  log "Rebase completed after resolving conflicts"
fi

# ── Step 3: Restore stash — remote wins conflicts ─────────────────────
if $STASHED; then
  log "Restoring stash..."
  if $GIT stash pop >> "$LOGFILE" 2>&1; then
    log "Stash restored cleanly"
  else
    log "Stash pop conflicts — resolving with remote (HEAD)"
    CONFLICTS=$($GIT diff --name-only --diff-filter=U 2>/dev/null)
    for file in $CONFLICTS; do
      log "  Stash conflict resolved (HEAD): $file"
      $GIT checkout HEAD -- "$file"
      $GIT add "$file"
    done
    $GIT stash drop >> "$LOGFILE" 2>&1 || true
    log "Stash dropped after conflict resolution"
  fi
fi

# ── Step 4: Push ──────────────────────────────────────────────────────
log "Pushing to origin..."
if $GIT push origin HEAD >> "$LOGFILE" 2>&1; then
  log "Push successful"
else
  log "WARN: Nothing to push or push failed (non-fatal)"
fi

# ── Step 5: Trigger Mission Control rebuild if website code changed ──
HASHFILE="$REPO_ROOT/data/.mc-last-build-hash"
if [[ -f "$HASHFILE" ]]; then
  LAST_BUILD_HASH=$(cat "$HASHFILE")
  CURRENT_HASH=$($GIT rev-parse HEAD)
  if [[ "$LAST_BUILD_HASH" != "$CURRENT_HASH" ]]; then
    # Check if any website files changed since last build
    WEBSITE_CHANGES=$($GIT diff --name-only "$LAST_BUILD_HASH" "$CURRENT_HASH" -- website/ packages/ 2>/dev/null | wc -l | tr -d ' ')
    if [[ "$WEBSITE_CHANGES" -gt 0 ]]; then
      log "Website code changed ($WEBSITE_CHANGES files) — restarting Mission Control server"
      # Kill the running server process — launchd KeepAlive will restart it,
      # and the startup script will detect the hash mismatch and rebuild
      pkill -f "node.*mission-control.*server.js" 2>/dev/null || true
    fi
  fi
fi

log "═══ Sync Main End (success) ═══"
