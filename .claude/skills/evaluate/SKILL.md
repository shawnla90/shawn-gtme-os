---
name: evaluate
description: Evaluate a GitHub repo or tool for potential use. Fetches repo metadata, assesses fit against current pillars and stack, and logs the evaluation as an initiative in niobot.db. Use when the user shares a GitHub URL with exploratory intent, or types /evaluate.
---

# Tool Evaluation

Evaluate a GitHub repo or tool, assess its fit for the Nio ecosystem, and log the result as a tracked initiative.

## When to Invoke

- User types `/evaluate` followed by a GitHub URL
- User shares a GitHub URL with exploratory intent: "check this out", "is this useful", "should we use this", "what do you think of this repo"
- User asks to evaluate a tool, library, or framework

## Steps

### Step 1: Guard — Check DB Table Exists

```bash
sqlite3 ~/.niobot/data/niobot.db "SELECT 1 FROM initiatives LIMIT 1" 2>/dev/null
```

If this fails, print:

```
Initiatives table not found. Run the nio-chat dev server once to apply migration 004:
  cd website && npm run dev --filter=nio-chat
```

Then STOP. Do not proceed without the table.

### Step 2: Fetch Repo Metadata

Use `gh` CLI to gather info:

```bash
gh repo view <owner/repo> --json name,description,stargazersCount,forkCount,updatedAt,licenseInfo,primaryLanguage,repositoryTopics
```

Also check recent activity:

```bash
gh api repos/<owner/repo>/commits?per_page=5 --jq '.[].commit.author.date'
```

### Step 3: Assess Fit

Score the tool on these dimensions (each 1-5):

| Dimension | Question |
|-----------|----------|
| **Relevance** | Does it solve a problem in the current roadmap (messaging, chimes, evolution, ops, content, infra)? |
| **Maturity** | Stars, recent commits, release cadence, documentation quality? |
| **Integration effort** | How much work to add to the monorepo? Does it fit the stack (TS, Next.js, SQLite, Cloudflare)? |
| **Overlap** | Does it duplicate something we already have or are building? |

### Step 4: Determine Verdict

Based on scores:

| Total Score | Verdict | Status |
|-------------|---------|--------|
| 16-20 | **Strong fit** — plan integration | `planned` |
| 11-15 | **Worth exploring** — file for later | `idea` |
| 6-10 | **Weak fit** — note and move on | `dropped` |
| 1-5 | **No fit** — skip | `dropped` |

### Step 5: Log to Database

Insert the initiative using `sqlite3` CLI:

```bash
sqlite3 ~/.niobot/data/niobot.db "INSERT INTO initiatives (title, description, status, source, source_url, pillar, priority, notes) VALUES ('<title>', '<description>', '<status>', 'evaluate', '<github_url>', '<pillar_or_NULL>', <priority>, '<notes>');"
```

**Escaping:** Double any single quotes in values: `it''s` not `it's`.

If pillar is not applicable, use `NULL` (unquoted).

After insert, capture the ID:

```bash
sqlite3 ~/.niobot/data/niobot.db "SELECT id FROM initiatives ORDER BY id DESC LIMIT 1;"
```

### Step 6: Print Summary

Format output as:

```
## Evaluation: <repo name>

**Verdict:** <Strong fit | Worth exploring | Weak fit | No fit>
**Status:** <status> | **Priority:** <1-5> | **Pillar:** <pillar or "none">
**Initiative ID:** #<id>

| Dimension | Score | Notes |
|-----------|-------|-------|
| Relevance | X/5 | ... |
| Maturity | X/5 | ... |
| Integration | X/5 | ... |
| Overlap | X/5 | ... |
| **Total** | **XX/20** | |

**What it does:** <1-2 sentences>
**How it fits:** <1-2 sentences on integration path, or why it doesn't fit>
**Next step:** <concrete action or "none — dropped">
```

## Rules

1. **Always log to DB** — even dropped evaluations get tracked. We want a record of what was considered.
2. **Be opinionated** — don't hedge. Give a clear verdict and priority.
3. **Check for duplicates** — before inserting, query: `sqlite3 ~/.niobot/data/niobot.db "SELECT id, title, status FROM initiatives WHERE source_url = '<url>';"`. If found, update instead of insert.
4. **Pillar alignment** — if the tool doesn't map to a current pillar, set pillar to NULL. Don't force-fit.
5. **Guard clause first** — always check the table exists before any query. If missing, instruct and stop.
