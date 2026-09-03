#!/usr/bin/env bash
# detach.sh — run a long job in its own session (setsid via python) under nohup with ABSOLUTE log paths.
#
#   detach.sh --run <run> --stream <stream> [--cwd <abs>] [--stdin <abs file>] [--env K=V]... -- <cmd> [args...]
#   detach.sh --kill   <run> <stream>      TERM the whole process group
#   detach.sh --status <run> <stream>      one-line state
#
# Files: $RUNS_DIR/<run>/<stream>/{run.log,run.pid,supervisor.pid,run.meta,status}
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

usage() { sed -n '2,9p' "${BASH_SOURCE[0]}"; exit 1; }

if [ "${1:-}" = "--kill" ] || [ "${1:-}" = "--status" ]; then
  mode="$1"; run="${2:-}"; stream="${3:-}"; [ -n "$run" ] && [ -n "$stream" ] || usage
  d="$(run_dir "$run" "$stream")"; pid="$(cat "$d/run.pid" 2>/dev/null || true)"
  if [ "$mode" = "--status" ]; then
    if pid_alive "$pid"; then echo "alive pid=$pid"; else echo "dead status=$(cat "$d/status" 2>/dev/null || echo unknown)"; fi
    exit 0
  fi
  pid_alive "$pid" || die "not running (status=$(cat "$d/status" 2>/dev/null || echo unknown))"
  kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid"
  ok "sent TERM to process group of $pid"; exit 0
fi

run=""; stream=""; cwd=""; stdin_file=""; envs=()
while [ $# -gt 0 ]; do
  case "$1" in
    --run) run="$2"; shift 2;;
    --stream) stream="$2"; shift 2;;
    --cwd) cwd="$2"; shift 2;;
    --stdin) stdin_file="$2"; shift 2;;
    --env) envs+=(--env "$2"); shift 2;;
    --) shift; break;;
    *) usage;;
  esac
done
[ -n "$run" ] && [ -n "$stream" ] && [ $# -gt 0 ] || usage
[ -n "$cwd" ] && require_abs "$cwd"
[ -n "$stdin_file" ] && { require_abs "$stdin_file"; [ -f "$stdin_file" ] || die "stdin file missing: $stdin_file"; }
require_cmd python3

d="$(run_dir "$run" "$stream")"; mkdir -p "$d"
old="$(cat "$d/run.pid" 2>/dev/null || true)"
pid_alive "$old" && die "already running: pid $old (use --kill first)"

{
  echo "run=$run"; echo "stream=$stream"; echo "started=$(now_iso)"; echo "cwd=${cwd:-$PWD}"
  echo "stdin=${stdin_file:-/dev/null}"; printf 'cmd='; printf '%q ' "$@"; echo
} > "$d/run.meta"
printf '[detach] %s starting: %s\n' "$(now_iso)" "$*" >> "$d/run.log"

args=(--log "$d/run.log" --pidfile "$d/run.pid" --statusfile "$d/status")
[ -n "$cwd" ] && args+=(--cwd "$cwd")
[ -n "$stdin_file" ] && args+=(--stdin "$stdin_file")
nohup python3 "$HARNESS_DIR/_detach.py" "${args[@]}" ${envs[@]+"${envs[@]}"} -- "$@" >/dev/null 2>&1 < /dev/null &
sup=$!; disown "$sup" 2>/dev/null || true
echo "$sup" > "$d/supervisor.pid"
for _ in 1 2 3 4 5 6 7 8 9 10; do [ -s "$d/run.pid" ] && break; sleep 0.2; done
pid="$(cat "$d/run.pid" 2>/dev/null || true)"
[ -n "$pid" ] || die "job did not start; see $d/run.log"
ok "detached $stream: pid=$pid supervisor=$sup log=$d/run.log"
