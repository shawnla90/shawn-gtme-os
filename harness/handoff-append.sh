#!/usr/bin/env bash
# handoff-append.sh — append a structured milestone block to the worktree's HANDOFF.md.
#
#   handoff-append.sh --task <run/stream> --milestone "<name>" \
#       [--verified "<claim> :: <command that proved it> [-> <result>]"]... \
#       [--assumed "<claim>"]... [--blocker "<text>"]... [--resume "<command>"]... \
#       [--wt <abs worktree>] [--commit]
#
# Files touched and commits are read from git, never typed by hand. Run from inside the worktree or pass --wt.
# Rule: a line goes under Verified ONLY with the command that proved it. Everything else is Assumed.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
usage() { sed -n '2,11p' "${BASH_SOURCE[0]}"; exit 1; }

task=""; ms=""; wt=""; do_commit=0; verified=(); assumed=(); blockers=(); resumes=()
while [ $# -gt 0 ]; do
  case "$1" in
    --task) task="$2"; shift 2;; --milestone) ms="$2"; shift 2;; --wt) wt="$2"; shift 2;;
    --verified) verified+=("$2"); shift 2;; --assumed) assumed+=("$2"); shift 2;;
    --blocker) blockers+=("$2"); shift 2;; --resume) resumes+=("$2"); shift 2;;
    --commit) do_commit=1; shift;; *) usage;;
  esac
done
[ -n "$task" ] && [ -n "$ms" ] || usage
[ -z "$wt" ] && wt="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[ -n "$wt" ] || die "not inside a git worktree; pass --wt"
require_abs "$wt"
[ -f "$wt/HANDOFF.md" ] || die "no HANDOFF.md in $wt (created by spawn-parallel.sh)"

stream="${task##*/}"
committed="$(git -C "$wt" diff --name-only "$BASE_BRANCH...HEAD" 2>/dev/null | grep -v '^HANDOFF.md$' || true)"
uncommitted="$(git -C "$wt" status --porcelain 2>/dev/null | awk '{print $2}' | grep -v '^HANDOFF.md$' || true)"
commits="$(git -C "$wt" log --oneline "$BASE_BRANCH..HEAD" 2>/dev/null || true)"
head_sha="$(git -C "$wt" rev-parse --short HEAD)"

{
  printf '\n## Milestone: %s   <!-- task:%s stream:%s ts:%s head:%s -->\n' "$ms" "$task" "$stream" "$(now_iso)" "$head_sha"
  echo '### Files touched'
  if [ -z "$committed$uncommitted" ]; then echo '- none'; fi
  for f in $committed; do echo "- $f (committed)"; done
  for f in $uncommitted; do case " $committed " in *" $f "*) echo "- $f (committed, further uncommitted edits)";; *) echo "- $f (uncommitted)";; esac; done
  printf '### Commits (%s..HEAD)\n' "$BASE_BRANCH"
  if [ -z "$commits" ]; then echo '- none'; else printf '%s\n' "$commits" | sed 's/^/- /'; fi
  echo '### Resume'
  echo '```bash'
  echo "cd $wt"
  for r in ${resumes[@]+"${resumes[@]}"}; do echo "$r"; done
  echo '```'
  echo '### Verified (command + result pasted, not remembered)'
  if [ ${#verified[@]} -eq 0 ]; then echo '- none'; else for v in "${verified[@]}"; do echo "- $v"; done; fi
  echo '### Assumed (not yet checked)'
  if [ ${#assumed[@]} -eq 0 ]; then echo '- none'; else for a in "${assumed[@]}"; do echo "- $a"; done; fi
  echo '### Blockers'
  if [ ${#blockers[@]} -eq 0 ]; then echo '- none'; else for b in "${blockers[@]}"; do echo "- $b"; done; fi
} >> "$wt/HANDOFF.md"
ok "appended milestone '$ms' to $wt/HANDOFF.md"

if [ "$do_commit" = 1 ]; then
  git -C "$wt" add HANDOFF.md && git -C "$wt" commit -q -m "handoff($stream): $ms" && ok "committed HANDOFF.md"
fi
