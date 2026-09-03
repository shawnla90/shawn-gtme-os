# Parallel-execution harness

Run several agents on one repo without deploy or file collisions, survive crashes and usage limits,
and merge the results one stream at a time with conflicts reported instead of silently resolved.

```
harness/
  spawn-parallel.sh    N worktrees off main (one branch per stream), optional `claude -p` launch in each
  detach.sh            run any long job in its own session (python os.setsid, macOS has no setsid) + nohup + absolute logs
  check-runs.sh        live status board: pid state, log age, commits ahead, dirty files, last milestone, last log line, blockers
  handoff-append.sh    append a structured milestone block to the worktree's HANDOFF.md (files + commits read from git)
  merge-coordinator.sh review each stream's diff, merge sequentially into integrate/<run>, test, report CONFLICT/TEST-FAIL
  lib.sh, _detach.py   shared helpers
  streams/<run>.list   "<stream> <prompt.md>" per line;  streams/<run>/<stream>.md holds the agent prompt
```

## Layout (all absolute)

| what | where |
|---|---|
| worktree | `~/.worktrees/<repo>/<run>/<stream>` on branch `par/<run>/<stream>` |
| run files | `~/.worktrees/<repo>/_runs/<run>/<stream>/{run.log,run.pid,supervisor.pid,run.meta,status}` |
| stream index | `~/.worktrees/<repo>/_runs/<run>/streams.list` |
| integration | `~/.worktrees/<repo>/<run>/_integrate` on branch `integrate/<run>` |
| handoff | `harness/handoffs/<run>/<stream>.md` (tracked, unique path so merges never collide); `<worktree>/HANDOFF.md` is an untracked symlink to it |

Override the root with `HARNESS_WT_ROOT`, the base branch with `HARNESS_BASE_BRANCH` (default `main`).
A second wave that builds on the first wave's result runs with `HARNESS_BASE_BRANCH=integrate/<run>` and a new run name.

## Typical run

```bash
harness/spawn-parallel.sh niobot-v3 --from harness/streams/niobot-v3.list --launch
harness/check-runs.sh niobot-v3 --watch 30          # the board
harness/detach.sh --kill niobot-v3 sse-transport    # stop one stream
harness/merge-coordinator.sh niobot-v3 --order initiatives-api,tamagotchi,error-retry-ui,sse-transport
# then, by hand, after reading the report:
git checkout main && git merge --ff-only integrate/niobot-v3 && git push
```

`spawn-parallel.sh` symlinks every `node_modules` from the main checkout into each worktree (`--install` runs
`npm install` instead). Streams must not change dependencies unless launched with `--install`.

## Hard rules

1. **Deploys happen only from `integrate/<run>`**, after the coordinator's report, by a human. Never from a stream worktree.
2. **No relative paths** in anything long-running. `detach.sh` refuses relative `--cwd`/`--stdin`; logs are always absolute.
3. **Long jobs go through `detach.sh`.** It puts the job in its own session so the launching shell or agent being reaped does not kill it.
4. **Streams own disjoint files.** Every prompt lists owned files and a do-not-touch list. Shared files get a line range.
5. **The coordinator never resolves conflicts.** It reports them; the stream owner rebases onto `integrate/<run>` and re-runs.
6. **Nothing in a HANDOFF `Verified` section without the command that proved it.** Otherwise it goes under `Assumed`.

## HANDOFF.md protocol

`spawn-parallel.sh` writes the header (task id, branch, worktree, prompt, run log) to `harness/handoffs/<run>/<stream>.md`, commits it, and links `HANDOFF.md` at the worktree root to it. After every milestone and
before stopping for any reason, the agent runs:

```bash
harness/handoff-append.sh --task <run>/<stream> --milestone "<name>" \
  --verified "<claim> :: <command> -> <result>" \
  --assumed "<claim>" --blocker "<text>" --resume "<command>" --commit
```

which appends:

```markdown
## Milestone: <name>   <!-- task:<run>/<stream> stream:<stream> ts:<iso> head:<sha> -->
### Files touched            <- from git diff main...HEAD + git status, never typed
### Commits (main..HEAD)     <- from git log
### Resume                   <- cd <worktree> + the commands passed with --resume
### Verified (command + result pasted, not remembered)
### Assumed (not yet checked)
### Blockers
```

A fresh session resumes with: `cat HANDOFF.md`, read the newest block, run its Resume commands, trust only Verified lines,
re-check Assumed lines before building on them. `check-runs.sh` surfaces the newest block's Blockers on the board.

## Agent prompt contract

Every stream prompt ends with the same block: owned files, do-not-touch list, verification bar (`npx tsc --noEmit`, then
`npx next build` before the final milestone; no `next lint`, it is unconfigured here and prompts interactively), commit per
milestone, `handoff-append.sh` per milestone and before stopping, and: no push, no deploy, no external writes, no process
kills, no dependency changes, do not touch `~/.niobot/data/niobot.db`.
