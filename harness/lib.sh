#!/usr/bin/env bash
# harness/lib.sh — shared helpers for the parallel-execution harness. Source it; do not run it.
#
# Layout (all absolute, derived here so no script ever uses a relative path):
#   REPO      main checkout (resolved via git-common-dir, so this works from inside a worktree too)
#   WT_ROOT   ~/.worktrees/<repo>            one worktree per stream at $WT_ROOT/<run>/<stream>
#   RUNS_DIR  $WT_ROOT/_runs/<run>/<stream>  run.log, run.pid, supervisor.pid, run.meta, status
#   streams.list at $RUNS_DIR/<run>/streams.list : "<stream>\t<worktree>\t<branch>\t<prompt>"

set -euo pipefail

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_common="$(git -C "$HARNESS_DIR" rev-parse --git-common-dir)"
case "$_common" in /*) ;; *) _common="$HARNESS_DIR/$_common";; esac
REPO="$(cd "$(dirname "$_common")" && pwd)"
REPO_NAME="$(basename "$REPO")"
WT_ROOT="${HARNESS_WT_ROOT:-$HOME/.worktrees/$REPO_NAME}"
RUNS_DIR="$WT_ROOT/_runs"
BASE_BRANCH="${HARNESS_BASE_BRANCH:-main}"

if [ -t 1 ]; then
  C_RED=$'\033[1;31m'; C_GRN=$'\033[1;32m'; C_YLW=$'\033[1;33m'; C_DIM=$'\033[2m'; C_OFF=$'\033[0m'
else
  C_RED=""; C_GRN=""; C_YLW=""; C_DIM=""; C_OFF=""
fi
info() { printf '%s[harness]%s %s\n' "$C_DIM" "$C_OFF" "$*"; }
ok()   { printf '%s[ok]%s %s\n' "$C_GRN" "$C_OFF" "$*"; }
warn() { printf '%s[warn]%s %s\n' "$C_YLW" "$C_OFF" "$*" >&2; }
die()  { printf '%s[fail]%s %s\n' "$C_RED" "$C_OFF" "$*" >&2; exit 1; }

now_iso() { date +%Y-%m-%dT%H:%M:%S%z; }
epoch()   { date +%s; }
mtime()   { stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null || echo 0; }

require_abs() { case "$1" in /*) ;; *) die "path must be absolute: $1";; esac; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || die "missing binary: $1"; }

wt_path()     { echo "$WT_ROOT/$1/$2"; }            # run stream
branch_name() { echo "par/$1/$2"; }                 # run stream
run_dir()     { echo "$RUNS_DIR/$1/$2"; }           # run stream
streams_file(){ echo "$RUNS_DIR/$1/streams.list"; } # run
handoff_rel(){ echo "harness/handoffs/$1/$2.md"; }       # run stream : tracked, unique per stream so merges never collide
# ensure_handoff_link <wt> <run> <stream> : untracked HANDOFF.md symlink at the worktree root -> canonical file
ensure_handoff_link() {
  local wt="$1" rel; rel="$(handoff_rel "$2" "$3")"
  [ -L "$wt/HANDOFF.md" ] || { rm -f "$wt/HANDOFF.md"; ln -s "$rel" "$wt/HANDOFF.md"; }
  local excl="$REPO/.git/info/exclude"; grep -qx 'HANDOFF.md' "$excl" 2>/dev/null || echo 'HANDOFF.md' >> "$excl"
}

# streams_of <run> -> prints "stream<TAB>wt<TAB>branch<TAB>prompt" lines
streams_of() {
  local f; f="$(streams_file "$1")"
  [ -f "$f" ] || die "no such run: $1 (expected $f)"
  grep -v '^\s*#' "$f" | grep -v '^\s*$'
}

pid_alive() { [ -n "${1:-}" ] && kill -0 "$1" 2>/dev/null; }

# link_node_modules <worktree> : symlink every node_modules dir the main checkout has into the worktree
link_node_modules() {
  local wt="$1" n=0 src rel dst excl
  excl="$REPO/.git/info/exclude"
  grep -qx 'node_modules' "$excl" 2>/dev/null || echo 'node_modules' >> "$excl"   # .gitignore has node_modules/ which skips symlinks
  while IFS= read -r src; do
    rel="${src#"$REPO"/}"; dst="$wt/$rel"
    [ -e "$dst" ] && continue
    [ -d "$(dirname "$dst")" ] || continue        # parent not in this branch: skip, never create untracked dirs
    ln -s "$src" "$dst" && n=$((n+1))
  done < <(find "$REPO" -maxdepth 4 -type d -name node_modules -not -path '*/node_modules/*' 2>/dev/null)
  info "linked $n node_modules dir(s) into $wt"
}

# last_log_line <logfile> : human-readable last line; unwraps claude stream-json when present
last_log_line() {
  local line; line="$(tail -n 1 "$1" 2>/dev/null || true)"
  [ -z "$line" ] && { echo "(empty)"; return; }
  if [[ "$line" == \{* ]] && command -v jq >/dev/null 2>&1; then
    local out
    out="$(printf '%s' "$line" | jq -r '
      if .type=="assistant" then
        ([.message.content[]? | if .type=="tool_use" then "tool:"+.name elif .type=="text" then .text else empty end] | join(" | "))
      elif .type=="result" then "RESULT: "+(.subtype // "") + " " + ((.result // "")|tostring)
      elif .type=="user" then "tool_result"
      elif .type=="system" then "system:"+(.subtype // "")
      else .type end' 2>/dev/null | tr '\n' ' ' || true)"
    [ -n "$out" ] && line="$out"
  fi
  printf '%s' "$line" | cut -c1-"${2:-100}" || true
}
