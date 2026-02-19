---
name: sync-main
description: Normalize daily sync with origin/main. Handles divergent branches caused by automated machines committing to main. Stashes local changes, pulls with rebase preferring remote on conflicts, restores stash preferring remote on conflicts, then pushes. Use when the user types /sync-main or asks to sync or pull from main.
allowed-tools: Bash
---

# Sync Main — Normalized Daily Pull

This repo has automated machines committing to `main` daily. This skill handles the standard divergence pattern without prompting for every decision: stash → pull with rebase (remote wins conflicts) → restore stash (remote wins conflicts) → push.

---

## Step 1: Snapshot current state

Run `git status` and `git diff --stat` to understand what's modified and untracked. Record the list of modified and untracked files so you can report what happened at the end.

---

## Step 2: Stash local changes

Run `git stash` to stash any staged or unstaged modifications.

- If there's nothing to stash, skip to Step 3.
- Untracked files are NOT stashed — that's fine, they won't conflict.

---

## Step 3: Pull with rebase — remote wins

Run `git pull --rebase`.

**If it succeeds with no conflicts:** proceed to Step 4.

**If there are rebase conflicts:**

For EACH conflicted file, run:
```bash
git checkout --theirs <file>
git add <file>
```

Then run `git rebase --continue`. Repeat until the rebase completes.

If `git rebase --continue` opens an editor for a commit message, accept the default (`git rebase --continue` with `GIT_EDITOR=true` to auto-accept):
```bash
GIT_EDITOR=true git rebase --continue
```

---

## Step 4: Restore stash

If nothing was stashed in Step 2, skip this step.

Run `git stash pop`.

**If it succeeds with no conflicts:** proceed to Step 5.

**If there are stash pop conflicts:**

For EACH conflicted file, accept the remote/HEAD version (discard stashed changes for that file):
```bash
git checkout HEAD -- <file>
git add <file>
```

Then drop the stash entry:
```bash
git stash drop
```

---

## Step 5: Push

Run `git push`.

- If already up to date, say so.
- If push is rejected (shouldn't happen after a rebase), report the error and stop.

---

## Step 6: Report

Summarize what happened:
- Files that had rebase conflicts (resolved to remote)
- Files that had stash-pop conflicts (resolved to remote, stash discarded)
- Files from the stash that restored cleanly
- Current `git status` output
- Whether the push succeeded
