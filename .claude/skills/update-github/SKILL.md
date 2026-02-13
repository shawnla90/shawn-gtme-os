---
name: update-github
description: Pre-push safety scan for the public GitHub repo. Scans tracked files for sensitive partner/client names using a local blocklist, audits .gitignore, checks commit messages, then commits and pushes. Use when the user types /update-github or asks to push to GitHub safely.
---

# Update GitHub — Pre-Push Safety Scan

Run a full audit of tracked files and commit history before pushing to the public GitHub repo. Fix any findings, then commit and push.

---

## Step 0: Local Data Integrity Snapshot (MANDATORY — RUN FIRST)

Before ANY git operations, take a snapshot of all gitignored local data directories. This is a non-negotiable safety gate.

1. Run `find clients/ -type f 2>/dev/null | wc -l` and record the count
2. Run `find data/ -type f 2>/dev/null | wc -l` and record the count
3. Run `find scripts/ -type f 2>/dev/null | wc -l` and record the count
4. Run `find content/internal/ -type f 2>/dev/null | wc -l` and record the count
5. Run `ls -d clients/partner/*/ clients/client/*/ 2>/dev/null` and record the directory list

Store these values. They will be verified again in Step 7.

**If `clients/` has 0 files, STOP and warn the user** — local data may already be missing and needs to be restored from git history before proceeding.

---

## Step 1: Load Blocklist

Read the blocklist from `.claude/blocklist.txt` (one term per line, case-insensitive). This file is gitignored and contains partner names, client names, contact names, and other sensitive terms that must not appear in tracked files.

If `.claude/blocklist.txt` does not exist, stop and tell the user:
> "Missing `.claude/blocklist.txt`. Create it with one sensitive term per line (partner names, client names, contact info)."

## Step 2: Blocklist Scan

Grep all **tracked files** (`git ls-files`) for each term in the blocklist. The scan must be case-insensitive.

Also scan for patterns that look like:
- Email addresses containing partner/client domains
- Phone numbers (10+ digit sequences or formatted numbers)
- Slack webhook URLs or API tokens

**If any match is found in a tracked file:**
- If the file is in `.gitignore`-covered paths (`clients/`, `data/`, `scripts/`), verify it is actually gitignored and not force-added
- If the file is a template/skill file (`.cursor/`, `.claude/`, root markdown), replace the sensitive term with a generic placeholder (`<partner>`, `acme`, `globex`, `initech`, etc.)
- Show the user what was found and what was fixed

**Important**: Exclude `.claude/blocklist.txt` itself from the scan results.

## Step 3: `.gitignore` Audit

Verify these entries exist in `.gitignore`:
```
clients/
partners/
data/
scripts/
content/internal/
qualified_leads_to_process.json
*.env
.env.*
.claude/blocklist.txt
```

If any are missing, add them and inform the user.

## Step 4: Commit Message Audit

Check the last 20 commit messages (`git log --oneline -20`) for any of the blocklist terms.

- If found, warn the user and suggest an interactive rebase or `git filter-repo` to clean history
- Do NOT automatically rewrite history — just report findings

## Step 5: Stage, Commit, Push

**CRITICAL RULES — read all before executing:**

- **NEVER run `git checkout`** to switch branches. Always push from the current branch.
- **NEVER run `git clean`**, `git reset --hard`, `git checkout .`, or `git restore .`** — these destroy untracked/local data.
- **NEVER run any command that could delete or overwrite files in gitignored directories** (`clients/`, `data/`, `scripts/`, `content/internal/`).
- Only use `git add -u` (tracked files only) or `git add <specific-file>`. **NEVER use `git add -A` or `git add .`** — these could accidentally track gitignored files.

**Procedure:**

1. Stage all modified tracked files: `git add -u`
2. Stage any new files that should be tracked (e.g., new `.claude/skills/` or `content/` files) — add by specific path only
3. Create a commit with message: `Sanitize repo for public GitHub`
4. Push the **current branch** to origin: `git push origin HEAD`

If there are no changes to commit, skip straight to push (or confirm the remote is already up to date).

**If the user asks to merge to main**, do it safely:
1. `git push origin HEAD` (push current branch first)
2. `git merge` or `git push origin <branch>:main` — **prefer pushing directly over switching branches**
3. If you MUST checkout main: verify local data integrity immediately after switching back

## Step 6: Post-Push Verification

Build a grep pattern from the blocklist and run:
```bash
git ls-files | xargs grep -il '<pattern>' || echo "CLEAN: No sensitive terms found in tracked files"
```

Report the result to the user.

## Step 7: Local Data Integrity Check (MANDATORY — RUN LAST)

Re-run the same checks from Step 0:

1. `find clients/ -type f 2>/dev/null | wc -l`
2. `find data/ -type f 2>/dev/null | wc -l`
3. `find scripts/ -type f 2>/dev/null | wc -l`
4. `find content/internal/ -type f 2>/dev/null | wc -l`
5. `ls -d clients/partner/*/ clients/client/*/ 2>/dev/null`

Compare against the Step 0 snapshot.

**If ANY file count decreased or ANY directory disappeared:**
- **STOP immediately**
- Alert the user: "LOCAL DATA LOSS DETECTED — [directory] had [X] files, now has [Y]"
- Attempt recovery from git history: `git show <commit>:<path> > <path>`
- Do NOT continue until the user confirms data is restored

**If all counts match or increased:** Report "Local data integrity verified — no files lost."
