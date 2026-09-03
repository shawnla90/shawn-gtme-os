#!/usr/bin/env bash
# check-runs.sh — live status board for a run.
#
#   check-runs.sh                      list runs
#   check-runs.sh <run> [--watch N] [--json]
# Columns: stream | branch ahead of base | dirty files | pid state | log age | last milestone | last log line
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

run="${1:-}"; watch=0; json=0
shift || true
while [ $# -gt 0 ]; do case "$1" in --watch) watch="$2"; shift 2;; --json) json=1; shift;; *) shift;; esac; done

if [ -z "$run" ]; then
  echo "runs under $RUNS_DIR:"; ls -1 "$RUNS_DIR" 2>/dev/null || echo "(none)"; exit 0
fi

age_str() { local s=$1; if [ "$s" -lt 60 ]; then echo "${s}s"; elif [ "$s" -lt 3600 ]; then echo "$((s/60))m"; else echo "$((s/3600))h$(( (s%3600)/60 ))m"; fi; }

render() {
  local now; now="$(epoch)"
  local rows=()
  [ "$json" = 1 ] || {
    printf '%s== %s  (%s)  base=%s ==%s\n' "$C_DIM" "$run" "$(now_iso)" "$BASE_BRANCH" "$C_OFF"
    printf '%-18s %-6s %-5s %-14s %-7s %-34s %s\n' STREAM AHEAD DIRTY PID LOG-AGE LAST-MILESTONE LAST-LOG-LINE
  }
  while IFS=$'\t' read -r s wt br prompt; do
    local d ahead dirty pid pstate age ms last blockers
    d="$(run_dir "$run" "$s")"
    if [ -d "$wt" ]; then
      ahead="$(git -C "$wt" rev-list --count "$BASE_BRANCH..HEAD" 2>/dev/null || echo '?')"
      dirty="$(git -C "$wt" status --porcelain 2>/dev/null | grep -vc '^?? HANDOFF.md$' || true)"
      ms="$(grep -E '^## Milestone:' "$wt/HANDOFF.md" 2>/dev/null | tail -1 | sed -E 's/^## Milestone: *//; s/ *<!--.*$//' | cut -c1-34)"
      blockers="$(awk '/^## Milestone:/{b=""; inb=0} /^### Blockers/{inb=1; next} /^### /{inb=0} inb && /^- /{b=b $0 "\n"} END{printf "%s", b}' "$wt/HANDOFF.md" 2>/dev/null | grep -v -- '- none' || true)"
    else
      ahead="gone"; dirty="-"; ms="(worktree missing)"; blockers=""
    fi
    pid="$(cat "$d/run.pid" 2>/dev/null || true)"
    if pid_alive "$pid"; then pstate="alive:$pid"; else pstate="$(cat "$d/status" 2>/dev/null || echo 'not-launched')"; fi
    if [ -f "$d/run.log" ]; then age="$(age_str $(( now - $(mtime "$d/run.log") )))"; last="$(last_log_line "$d/run.log" 90)"; else age="-"; last="(no log)"; fi
    if [ "$json" = 1 ]; then
      rows+=("$(jq -nc --arg s "$s" --arg br "$br" --arg wt "$wt" --arg ahead "$ahead" --arg dirty "$dirty" --arg pid "$pstate" --arg age "$age" --arg ms "$ms" --arg last "$last" --arg bl "$blockers" \
        '{stream:$s,branch:$br,worktree:$wt,ahead:$ahead,dirty:$dirty,pid:$pid,log_age:$age,last_milestone:$ms,last_log:$last,blockers:$bl}')")
    else
      printf '%-18s %-6s %-5s %-14s %-7s %-34s %s\n' "$s" "$ahead" "$dirty" "$pstate" "$age" "${ms:-(none yet)}" "$last"
      [ -n "$blockers" ] && printf '   %sblockers:%s\n%s' "$C_YLW" "$C_OFF" "$(printf '%s' "$blockers" | sed 's/^/     /')" && echo
    fi
  done < <(streams_of "$run")
  if [ "$json" = 1 ]; then printf '%s\n' ${rows[@]+"${rows[@]}"} | jq -s .; else
    printf '%slogs: %s/<stream>/run.log   kill: %s/detach.sh --kill %s <stream>%s\n' "$C_DIM" "$RUNS_DIR/$run" "$HARNESS_DIR" "$run" "$C_OFF"
  fi
}

if [ "$watch" -gt 0 ] 2>/dev/null; then
  while true; do clear; render; sleep "$watch"; done
else
  render
fi
