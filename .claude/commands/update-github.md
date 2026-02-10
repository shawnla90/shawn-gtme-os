# Update GitHub — Pre-Push Safety Scan

Run a full audit of tracked files and commit history before pushing to the public GitHub repo. Fix any findings, then commit and push.

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

1. Stage all modified tracked files: `git add -u`
2. Stage any new files that should be tracked (e.g., new `.claude/commands/` files)
3. Create a commit with message: `Sanitize repo for public GitHub`
4. Push to `origin main`

If there are no changes to commit, skip straight to push (or confirm the remote is already up to date).

## Step 6: Post-Push Verification

Build a grep pattern from the blocklist and run:
```bash
git ls-files | xargs grep -il '<pattern>' || echo "CLEAN: No sensitive terms found in tracked files"
```

Report the result to the user.
