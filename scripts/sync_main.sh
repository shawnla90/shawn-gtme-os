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

log "═══ Sync Main End (success) ═══"
