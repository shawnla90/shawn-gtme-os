# Update GitHub — Pre-Push Safety Scan

Run a full audit of tracked files and commit history before pushing to the public GitHub repo. Fix any findings, then commit and push.

## Step 1: Blocklist Scan

Grep all **tracked files** (`git ls-files`) for sensitive terms. The scan must be case-insensitive.

### Partner / Client Names
Search for these exact terms (case-insensitive):
- `elauwit` / `elwt`
- `connext`
- `exol` / `greenbox`
- `switzer` / `legacy recruiting`
- `hayward`

### Contact Info Patterns
Also scan for patterns that look like:
- Email addresses containing partner/client domains
- Phone numbers (10+ digit sequences or formatted numbers)
- Slack webhook URLs or API tokens

**If any match is found in a tracked file:**
- If the file is in `.gitignore`-covered paths (`clients/`, `data/`, `scripts/`), verify it is actually gitignored and not force-added
- If the file is a template/skill file (`.cursor/`, `.claude/`, root markdown), replace the sensitive term with a generic placeholder (`<partner>`, `acme`, `globex`, `initech`, etc.)
- Show the user what was found and what was fixed

## Step 2: `.gitignore` Audit

Verify these entries exist in `.gitignore`:
```
clients/
partners/
data/
scripts/
qualified_leads_to_process.json
*.env
.env.*
```

If any are missing, add them and inform the user.

## Step 3: Commit Message Audit

Check the last 20 commit messages (`git log --oneline -20`) for any of the blocklist terms from Step 1.

- If found, warn the user and suggest an interactive rebase or `git filter-repo` to clean history
- Do NOT automatically rewrite history — just report findings

## Step 4: Stage, Commit, Push

1. Stage all modified tracked files: `git add -u`
2. Stage any new files that should be tracked (e.g., new `.claude/commands/` files)
3. Create a commit with message: `Sanitize repo for public GitHub`
4. Push to `origin main`

If there are no changes to commit, skip straight to push (or confirm the remote is already up to date).

## Step 5: Post-Push Verification

Run a final check:
```bash
git ls-files | xargs grep -il 'elauwit\|connext\|exol\|greenbox\|switzer\|hayward' || echo "CLEAN: No sensitive terms found in tracked files"
```

Report the result to the user.
