# Security Layer Guide

> What to protect, what to share, and how to keep your repo safe from day one.

---

## The Rule

Your repo will contain two kinds of content: **shareable** (your frameworks, templates, published content) and **sensitive** (API keys, client data, partner names, internal scripts). The security layer keeps the sensitive stuff out of version control so you can push your repo to GitHub without leaking anything.

---

## .gitignore (Your First Line of Defense)

This file tells Git which files and folders to never track. Set this up before your first commit.

```
# OS files
.DS_Store

# Environment and secrets
*.env
.env.*

# Client and partner data
clients/
partners/

# Data files (CSVs, JSONs with real data)
data/

# Scripts with credentials or internal logic
scripts/

# Sync state files
.notion-sync-state.json

# IDE local settings
.claude/settings.local.json

# Blocklists and sensitive filters
.claude/blocklist.txt

# Screenshots (large binaries, may contain sensitive UI)
screenshots/

# Node modules
node_modules/

# MCP config with API keys (if stored locally)
.cursor/mcp.json
```

**Why each one matters:**
- `clients/` and `partners/`: Real names, deals, conversations. Never version-controlled.
- `*.env`: API keys, tokens, passwords. One leaked key can cost thousands.
- `data/`: CSVs and JSONs often contain real email addresses, company names, lead lists.
- `scripts/`: Automation scripts often embed API keys or reference internal systems.
- `screenshots/`: May capture sensitive dashboards, client names in browser tabs, internal tools.
- `.cursor/mcp.json`: Contains your API keys for every connected tool.

---

## Environment Variables

Never hardcode API keys in files. Use environment variables instead.

**How it works:**
1. Create a `.env` file in your project root
2. Add your keys: `INSTANTLY_API_KEY=your-key-here`
3. Reference them in your config using `${INSTANTLY_API_KEY}` or `process.env.INSTANTLY_API_KEY`
4. `.env` is gitignored, so it stays local

**Tip**: Create a `.env.example` file (without real values) that you DO commit. This documents which environment variables your system needs without exposing the actual keys.

```
# .env.example (safe to commit)
INSTANTLY_API_KEY=
HEYREACH_API_KEY=
FIRECRAWL_API_KEY=
GITHUB_TOKEN=
SLACK_BOT_TOKEN=
```

---

## Folder-Level Protection

Structure your repo so sensitive data has a clear home that's always gitignored:

```
your-repo/
├── clients/          # GITIGNORED - client-specific data
├── partners/         # GITIGNORED - partner handoffs
├── data/             # GITIGNORED - CSVs, lead lists, exports
├── scripts/          # GITIGNORED - automation with credentials
├── screenshots/      # GITIGNORED - may contain sensitive UI
├── skills/           # SAFE - your frameworks and playbooks
├── content/          # SAFE - your drafts and published content
├── workflows/        # SAFE - your content indexes
└── .cursor/skills/   # SAFE - your Cursor skill files
```

The pattern: anything with real names, real data, or real credentials goes in a gitignored folder. Frameworks, templates, and your own content are safe to share.

---

## Pre-Push Checklist

Before pushing to a remote (GitHub, GitLab), verify:

- [ ] No `.env` files staged (`git status` should not show any `.env`)
- [ ] No files in `clients/` or `partners/` staged
- [ ] No CSV or JSON files with real email addresses or names
- [ ] No API keys hardcoded in any file
- [ ] No screenshots with visible client dashboards or names
- [ ] `.gitignore` is committed and working (test with `git status`)
- [ ] Commit messages don't contain client or partner names

**Quick test**: Run `git diff --cached` before committing to review exactly what's being staged.

---

## If You Already Committed Something Sensitive

1. Don't push. If you haven't pushed yet, you can amend the commit.
2. Remove the file from tracking: `git rm --cached path/to/sensitive-file`
3. Add it to `.gitignore`
4. Commit the fix
5. If you already pushed, the file is in your Git history. You'll need to use `git filter-branch` or BFG Repo Cleaner to scrub it. Rotate any exposed API keys immediately.

---

## Public vs. Private Repos

- **Private repo**: Your working system. Contains everything. Gitignore still matters for hygiene.
- **Public repo**: A cleaned version you share with the world. Only frameworks, templates, and published content. No client data, no API keys, no internal scripts.

If you want to share your system publicly, maintain two repos or use a pre-push script that scans for sensitive content before allowing a push.

---

## The Bottom Line

Security is a habit, not a feature. Set up your `.gitignore` before your first commit. Use environment variables for every API key. Keep real data in gitignored folders. Check `git status` before every push. The 5 minutes you spend on this saves you from the nightmare of leaked credentials or exposed client data.
