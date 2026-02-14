---
name: deploy
description: Commit, push, and deploy the website to Vercel. Handles git staging, commit message generation, push to origin, Vercel deployment trigger, and post-deploy verification. Use when the user types /deploy or asks to deploy, ship, push live, go live, or make changes active on the websites.
---

# Deploy — Commit, Push, Ship Live

Full deployment workflow: stage changes, commit, push, deploy all three sites (shawnos.ai, thegtmos.ai, thecontentos.ai), and verify. This is the **last mile** — the step that makes local code changes live.

## Command Pattern

- `/deploy` — auto-detect changes, commit, push, deploy all sites
- `/deploy <message>` — use provided text as the commit message
- `/deploy --dry-run` — show what would be committed and deployed without executing
- `/deploy --site shawnos` — deploy only a specific site (shawnos | gtmos | contentos)

## Pre-Flight Check (always runs first)

Before any git operations:

1. **Run `git status`** — capture modified, staged, and untracked files
2. **Run `git diff --stat`** — summarize what changed
3. **Categorize changes** into:
   - `website/` — triggers Vercel deploy
   - `content/` — content pipeline changes (may need deploy if website references them)
   - `skills/` — skill file updates (no deploy needed unless website reads them)
   - `data/` — check if gitignored (should be). If tracked data files changed, they affect the site
   - `scripts/` — check if gitignored. No deploy needed
   - `clients/` / `partners/` — **MUST be gitignored**. If these show in git status, STOP and warn

4. **Display the summary to the user**:
   ```
   Deploy Pre-Flight
   ─────────────────
   Modified:  12 files
   Untracked: 3 files (2 should be tracked)
   
   Website changes: yes → deploy needed
   Content changes: yes
   Skill changes:   yes
   
   Sites affected: shawnos, gtmos, contentos
   ```

5. **If `clients/` or `partners/` files appear in `git status`**: HARD STOP. Run the safety check from `/update-github` first. Tell the user: "Sensitive directories detected in git status. Run `/update-github` first to sanitize, then `/deploy`."

## Step 1: Stage Changes

**Rules:**
- Use `git add -u` for all modified tracked files
- For untracked files, assess each one:
  - Files in `website/`, `content/linkedin/`, `content/x/`, `content/substack/`, `skills/`, `.cursor/skills/` → safe to track, add by specific path
  - Files in `clients/`, `partners/`, `data/`, `scripts/`, `content/internal/` → do NOT add, verify they are gitignored
- **NEVER use `git add -A` or `git add .`**
- Show the user which files are being staged

## Step 2: Generate Commit Message

If the user provided a message, use it. Otherwise, auto-generate:

1. Scan the staged changes
2. Group by type: features, content, fixes, config
3. Write a concise commit message following the repo's style:
   - Short subject line (imperative mood, <72 chars)
   - Optional body with bullet points for multi-area changes
   - Examples from this repo's history for style reference

**Format:**
```
<type>: <subject>

- bullet 1
- bullet 2
```

Types: `feat`, `content`, `fix`, `refactor`, `chore`, `deploy`, `skill`

## Step 3: Commit

```bash
git commit -m "<generated or provided message>"
```

If commit fails (pre-commit hook, etc.): fix the issue and create a NEW commit. Do not amend.

## Step 4: Push

```bash
git push origin HEAD
```

- Push the current branch. **NEVER checkout or switch branches.**
- If push fails due to upstream changes: `git pull --rebase origin HEAD` then push again
- If push fails for other reasons: show the error and stop

## Step 5: Deploy to Vercel

The three sites deploy automatically via Vercel's git integration when pushed to main. After pushing:

1. **Wait 5 seconds** for Vercel to pick up the push
2. **Check deployment status** using the Vercel MCP tools:
   - Use `list_deployments` for each project to find the latest deployment
   - Report status: queued → building → ready (or error)
3. **If deployments are not triggering** (e.g., pushed to a non-main branch):
   - Inform the user: "Pushed to `<branch>`. Vercel deploys from `main`. Merge or push to main to trigger deploys."
   - Offer to trigger manual deploy via Vercel MCP `deploy_to_vercel` if available

## Step 6: Post-Deploy Verification

Once deployments show as "ready":

1. **Report deployment URLs**:
   ```
   Deploy Complete
   ───────────────
   ✓ shawnos.ai    — live (build: 45s)
   ✓ thegtmos.ai   — live (build: 42s)
   ✓ thecontentos.ai — live (build: 44s)
   
   Committed: feat: add LogHero and LogDetailIntro to all log pages
   Pushed to: main
   ```

2. **If any deployment failed**: show the build log summary and offer to investigate
3. **If the user wants to verify visually**: offer to open the site in the browser tool

## Dry Run Mode (`--dry-run`)

When `--dry-run` is passed:

1. Run the pre-flight check
2. Show what would be staged and committed
3. Show which sites would be affected
4. Do NOT execute any git commands or deployments
5. End with: "Dry run complete. Run `/deploy` to execute."

## Error Handling

- **Nothing to commit**: "Working tree clean — nothing to deploy. All changes are already live."
- **Sensitive files detected**: Hard stop, redirect to `/update-github`
- **Push rejected**: Show error, suggest pull --rebase
- **Vercel build failed**: Fetch build logs, show summary, offer to debug
- **Vercel MCP not connected**: "Pushed to origin. Vercel should auto-deploy from git. Check https://vercel.com/dashboard for status."

## Architecture Reference

```
Monorepo: website/
├── apps/shawnos/     → shawnos.ai (Vercel)
├── apps/gtmos/       → thegtmos.ai (Vercel)
├── apps/contentos/   → thecontentos.ai (Vercel)
├── packages/shared/  → shared components + lib
└── turbo.json        → Turborepo build config

Git: main branch → Vercel auto-deploys all three sites
```

## Important: When to Suggest Deploy

Proactively suggest `/deploy` when:
- A feature implementation is complete (all files edited, no TODOs remaining)
- Content has been finalized (`/finalcopy` completed)
- The user says "looks good", "ship it", "that's done", or similar completion signals
- Changes have been sitting uncommitted for a while

Say something like: "Changes are ready locally. Run `/deploy` to push them live."
