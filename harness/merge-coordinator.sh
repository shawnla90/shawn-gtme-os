#!/usr/bin/env bash
# merge-coordinator.sh — review each stream's diff, merge sequentially into integrate/<run>, test, report conflicts.
#
#   merge-coordinator.sh <run> [--order a,b,c] [--test-cmd "<cmd>"] [--full] [--dry-run] [--include-dirty]
#
# Works in its own worktree ($WT_ROOT/<run>/_integrate) so the main checkout is never touched.
# Default test per changed app under website/apps/*: `npx tsc --noEmit` (no lint is configured in this repo);
# --full adds `npx next build`. --test-cmd replaces both and runs once from the integrate worktree root.
# On CONFLICT: aborts that merge, records the conflicting files, continues. On TEST-FAIL: resets to the pre-merge sha.
# Never pushes. Never deploys. Prints the exact ff-merge commands for a human at the end.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
usage() { sed -n '2,11p' "${BASH_SOURCE[0]}"; exit 1; }

run="${1:-}"; [ -n "$run" ] || usage; shift
order=""; test_cmd=""; full=0; dry=0; include_dirty=0
while [ $# -gt 0 ]; do
  case "$1" in
    --order) order="$2"; shift 2;; --test-cmd) test_cmd="$2"; shift 2;; --full) full=1; shift;;
    --dry-run) dry=1; shift;; --include-dirty) include_dirty=1; shift;; *) usage;;
  esac
done

declare -a names wts brs
while IFS=$'\t' read -r s wt br _; do names+=("$s"); wts+=("$wt"); brs+=("$br"); done < <(streams_of "$run")
if [ -n "$order" ]; then
  IFS=',' read -ra ordered <<< "$order"
  for o in "${ordered[@]}"; do found=0; for s in "${names[@]}"; do [ "$s" = "$o" ] && found=1; done; [ $found = 1 ] || die "unknown stream in --order: $o"; done
else
  ordered=("${names[@]}")
fi
idx_of() { for i in "${!names[@]}"; do [ "${names[$i]}" = "$1" ] && { echo "$i"; return; }; done; }

ibr="integrate/$run"; iwt="$WT_ROOT/$run/_integrate"
report="$RUNS_DIR/$run/merge-report.md"; mkdir -p "$RUNS_DIR/$run"

if [ ! -d "$iwt" ]; then
  if git -C "$REPO" rev-parse -q --verify "refs/heads/$ibr" >/dev/null; then
    git -C "$REPO" worktree add -q "$iwt" "$ibr"
  else
    git -C "$REPO" worktree add -q -b "$ibr" "$iwt" "$BASE_BRANCH"
  fi
  link_node_modules "$iwt"
fi
info "integration branch $ibr in $iwt (starts at $(git -C "$iwt" rev-parse --short HEAD))"

# bash 3.2 (macOS) has no associative arrays: results are indexed by position in $ordered
declare -a r_result r_files r_conflicts r_testtail
merged_files=""

run_tests() { # $1 = space-separated changed files ; returns 0/1, tail in $TEST_TAIL
  local out rc apps a; out="$RUNS_DIR/$run/_integrate-test.log"; : > "$out"
  if [ -n "$test_cmd" ]; then
    (cd "$iwt" && bash -c "$test_cmd") >>"$out" 2>&1; rc=$?
  else
    rc=0
    apps="$(printf '%s\n' $1 | grep -oE '^website/apps/[^/]+' | sort -u || true)"
    if [ -z "$apps" ]; then echo "no website/apps/* changes; nothing to test" >>"$out"; else
      for a in $apps; do
        [ -f "$iwt/$a/tsconfig.json" ] || { echo "skip $a (no tsconfig)" >>"$out"; continue; }
        echo "== tsc $a" >>"$out"; (cd "$iwt/$a" && npx tsc --noEmit --pretty false) >>"$out" 2>&1 || rc=1
        if [ "$full" = 1 ] && [ $rc = 0 ]; then echo "== next build $a" >>"$out"; (cd "$iwt/$a" && npx next build) >>"$out" 2>&1 || rc=1; fi
      done
    fi
  fi
  TEST_TAIL="$(tail -n 12 "$out")"; return $rc
}

j=0
for s in "${ordered[@]}"; do
  i="$(idx_of "$s")"; wt="${wts[$i]}"; br="${brs[$i]}"
  r_result[$j]="?"; r_files[$j]=""; r_conflicts[$j]=""; r_testtail[$j]=""
  echo; printf '%s──── %s  (%s) ────%s\n' "$C_DIM" "$s" "$br" "$C_OFF"
  if [ -d "$wt" ] && [ -n "$(git -C "$wt" status --porcelain | grep -v '^?? HANDOFF.md$')" ]; then
    warn "$s has uncommitted changes in $wt; only committed work is merged$( [ $include_dirty = 1 ] || echo ' (pass --include-dirty to proceed anyway)')"
    [ $include_dirty = 1 ] || { r_result[$j]="SKIPPED-DIRTY"; j=$((j+1)); continue; }
  fi
  ahead="$(git -C "$iwt" rev-list --count "HEAD..$br")"
  if [ "$ahead" = 0 ]; then info "nothing to merge"; r_result[$j]="SKIPPED-EMPTY"; j=$((j+1)); continue; fi
  changed="$(git -C "$iwt" diff --name-only "HEAD...$br" | grep -v '^HANDOFF.md$' || true)"
  git -C "$iwt" diff --stat "HEAD...$br" | tail -n 25
  overlap=""; for f in $changed; do case " $merged_files " in *" $f "*) overlap="$overlap $f";; esac; done
  [ -n "$overlap" ] && warn "touches files already merged by an earlier stream:$overlap"
  r_files[$j]="$(printf '%s' "$changed" | tr '\n' ' ')"
  if [ "$dry" = 1 ]; then r_result[$j]="DRY-RUN"; merged_files="$merged_files ${r_files[$j]}"; j=$((j+1)); continue; fi
  pre="$(git -C "$iwt" rev-parse HEAD)"
  if git -C "$iwt" merge --no-ff --no-edit -m "integrate($run): merge $br" "$br" >/dev/null 2>&1; then
    if run_tests "$changed"; then
      r_result[$j]="MERGED"; merged_files="$merged_files ${r_files[$j]}"; ok "$s merged and tests passed"
    else
      r_result[$j]="TEST-FAIL"; r_testtail[$j]="$TEST_TAIL"
      git -C "$iwt" reset -q --hard "$pre"; warn "$s tests failed; reset to $(git -C "$iwt" rev-parse --short "$pre")"
    fi
  else
    cf="$(git -C "$iwt" diff --name-only --diff-filter=U | tr '\n' ' ')"
    git -C "$iwt" merge --abort 2>/dev/null || git -C "$iwt" reset -q --hard "$pre"
    r_result[$j]="CONFLICT"; r_conflicts[$j]="$cf"; warn "$s conflicts in: $cf"
  fi
  j=$((j+1))
done

{
  echo "# Merge report — $run  ($(now_iso))"; echo
  echo "integration branch: \`$ibr\` @ $(git -C "$iwt" rev-parse --short HEAD) in \`$iwt\`"; echo
  echo '| stream | result | files | conflicting files |'; echo '|---|---|---|---|'
  j=0; for s in "${ordered[@]}"; do printf '| %s | %s | %s | %s |\n' "$s" "${r_result[$j]}" "$(printf '%s' "${r_files[$j]}" | wc -w | tr -d ' ')" "${r_conflicts[$j]}"; j=$((j+1)); done
  j=0; for s in "${ordered[@]}"; do [ -n "${r_testtail[$j]}" ] && { echo; echo "## $s test output (tail)"; echo '```'; echo "${r_testtail[$j]}"; echo '```'; }; j=$((j+1)); done
  echo; echo '## Finish by hand (never automated)'; echo '```bash'
  echo "cd $REPO && git checkout $BASE_BRANCH && git merge --ff-only $ibr && git push origin $BASE_BRANCH"
  echo '```'
  echo; echo "Conflicted streams: rebase them onto \`$ibr\` in their own worktree, resolve, commit, re-run this script."
} > "$report"
echo; cat "$report"
