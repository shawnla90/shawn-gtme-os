#!/usr/bin/env bash
# spawn-parallel.sh — create one git worktree per work stream off $BASE_BRANCH, optionally launch an agent in each.
#
#   spawn-parallel.sh <run> [--from <list>] [--launch] [--link-node-modules|--install] [--no-fetch] [--allow-behind] [stream...]
#
#   <list> lines: "<stream> [<prompt.md>]"   (# comments ok). Without a list, streams come from argv and the
#   prompt defaults to harness/streams/<run>/<stream>.md when that file exists.
#   --launch   runs `claude -p --dangerously-skip-permissions` in each worktree via detach.sh, prompt on stdin.
#   Never pushes. Never deploys. Deploys happen only from the integration branch (see merge-coordinator.sh).
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
usage() { sed -n '2,10p' "${BASH_SOURCE[0]}"; exit 1; }

run="${1:-}"; [ -n "$run" ] || usage; shift
[[ "$run" =~ ^[a-zA-Z0-9._-]+$ ]] || die "run name must be [a-zA-Z0-9._-]: $run"
list=""; launch=0; nm_mode="link"; fetch=1; allow_behind=0; streams=()
while [ $# -gt 0 ]; do
  case "$1" in
    --from) list="$2"; shift 2;;
    --launch) launch=1; shift;;
    --link-node-modules) nm_mode="link"; shift;;
    --install) nm_mode="install"; shift;;
    --no-fetch) fetch=0; shift;;
    --allow-behind) allow_behind=1; shift;;
    -*) usage;;
    *) streams+=("$1"); shift;;
  esac
done

declare -a names prompts
if [ -n "$list" ]; then
  [ -f "$list" ] || die "list not found: $list"
  while read -r name prompt _; do
    [ -z "$name" ] && continue; [[ "$name" == \#* ]] && continue
    names+=("$name"); prompts+=("${prompt:-}")
  done < "$list"
else
  for s in ${streams[@]+"${streams[@]}"}; do names+=("$s"); prompts+=(""); done
fi
[ ${#names[@]} -gt 0 ] || die "no streams given"

# ---- preflight -------------------------------------------------------------------
info "repo=$REPO base=$BASE_BRANCH worktrees=$WT_ROOT/$run"
free_gb="$(df -k "$HOME" | awk 'NR==2{printf "%d",$4/1048576}')"
[ "$free_gb" -ge 20 ] || die "only ${free_gb}GB free (need 20GB)"
if [ "$fetch" = 1 ]; then
  git -C "$REPO" fetch -q origin || warn "git fetch failed; continuing with local $BASE_BRANCH"
  if git -C "$REPO" rev-parse -q --verify "origin/$BASE_BRANCH" >/dev/null; then
    behind="$(git -C "$REPO" rev-list --count "$BASE_BRANCH..origin/$BASE_BRANCH")"
    if [ "$behind" -gt 0 ] && [ "$allow_behind" = 0 ]; then
      die "$BASE_BRANCH is $behind commit(s) behind origin. Fast-forward it first, or pass --allow-behind."
    fi
  fi
fi
if [ "$launch" = 1 ]; then require_cmd claude; info "claude $(claude --version 2>/dev/null | head -1)"; fi
for i in "${!names[@]}"; do
  s="${names[$i]}"; [[ "$s" =~ ^[a-zA-Z0-9._-]+$ ]] || die "bad stream name: $s"
  wt="$(wt_path "$run" "$s")"; br="$(branch_name "$run" "$s")"
  [ -e "$wt" ] && die "worktree exists: $wt  (resume: cat $wt/HANDOFF.md)"
  git -C "$REPO" rev-parse -q --verify "refs/heads/$br" >/dev/null && die "branch exists: $br  (delete it or pick a new run name)"
  p="${prompts[$i]}"
  [ -z "$p" ] && [ -f "$HARNESS_DIR/streams/$run/$s.md" ] && p="$HARNESS_DIR/streams/$run/$s.md"
  if [ -n "$p" ]; then
    case "$p" in /*) ;; *) p="$(cd "$(dirname "$p")" && pwd)/$(basename "$p")";; esac
    [ -f "$p" ] || die "prompt not found for $s: $p"
  elif [ "$launch" = 1 ]; then
    die "--launch needs a prompt for $s (harness/streams/$run/$s.md or a list entry)"
  fi
  prompts[$i]="$p"
done
ok "preflight passed (${free_gb}GB free, ${#names[@]} stream(s))"

# ---- create -----------------------------------------------------------------------
mkdir -p "$RUNS_DIR/$run"; sf="$(streams_file "$run")"
[ -f "$sf" ] || printf '# stream\tworktree\tbranch\tprompt\n' > "$sf"
base_sha="$(git -C "$REPO" rev-parse --short "$BASE_BRANCH")"
for i in "${!names[@]}"; do
  s="${names[$i]}"; p="${prompts[$i]}"; wt="$(wt_path "$run" "$s")"; br="$(branch_name "$run" "$s")"
  mkdir -p "$(dirname "$wt")"
  git -C "$REPO" worktree add -q -b "$br" "$wt" "$BASE_BRANCH"
  case "$nm_mode" in
    link) link_node_modules "$wt";;
    install) [ -f "$wt/website/package.json" ] && (cd "$wt/website" && npm install --no-audit --no-fund >/dev/null) && info "npm install done for $s";;
  esac
  hrel="$(handoff_rel "$run" "$s")"; mkdir -p "$wt/$(dirname "$hrel")"
  cat > "$wt/$hrel" <<HD
# HANDOFF — $run / $s

| field | value |
|---|---|
| task id | $run/$s |
| branch | \`$br\` (off \`$BASE_BRANCH\` @ $base_sha) |
| worktree | \`$wt\` |
| prompt | \`${p:-none}\` |
| created | $(now_iso) |
| run log | \`$(run_dir "$run" "$s")/run.log\` |
| canonical file | \`$hrel\` (HANDOFF.md at the worktree root is a symlink to it) |

Fresh session: read the newest **Milestone** block below, run its **Resume** commands, trust only **Verified** lines.
Append a block after every milestone and before stopping:
\`$HARNESS_DIR/handoff-append.sh --task $run/$s --milestone "<name>" --verified "<claim> :: <command that proved it>" ...\`

HD
  ensure_handoff_link "$wt" "$run" "$s"
  git -C "$wt" add "$hrel" && git -C "$wt" commit -q -m "handoff($s): open $run/$s"
  printf '%s\t%s\t%s\t%s\n' "$s" "$wt" "$br" "${p:-}" >> "$sf"
  ok "worktree $s -> $wt ($br)"
done

# ---- launch -----------------------------------------------------------------------
if [ "$launch" = 1 ]; then
  for i in "${!names[@]}"; do
    s="${names[$i]}"; p="${prompts[$i]}"; wt="$(wt_path "$run" "$s")"
    "$HARNESS_DIR/detach.sh" --run "$run" --stream "$s" --cwd "$wt" --stdin "$p" \
      --env CLAUDE_HOOK=/usr/bin/true --env HARNESS_RUN="$run" --env HARNESS_STREAM="$s" \
      -- claude -p --dangerously-skip-permissions --output-format stream-json --verbose
  done
  echo; "$HARNESS_DIR/check-runs.sh" "$run"
fi
echo
info "deploys happen ONLY from integrate/$run via merge-coordinator.sh — never from a stream worktree."
info "board: $HARNESS_DIR/check-runs.sh $run --watch 30"
