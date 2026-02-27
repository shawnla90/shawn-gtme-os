# Self-Learning Repo Layer — Decision Lock

**Date:** 2026-02-25
**Scope:** Build a self-learning layer for the repo where external tool evaluations, deferred ideas, and growth signals get captured in SQLite and resurface as proactive suggestions. Includes: `/evaluate` skill, `initiatives` table in niobot.db, "query SQLite first" rule in CLAUDE.md + TEAM-CONSTRAINTS, and `/morning` upgrade to scan initiatives and suggest unblocked work. Does NOT include: full AI suggestion engine, Nio chat UI changes, evolution/XP changes, or Mission Control data migration.
**Domains:** Organizational, API/Data

---

## Decisions

1. **Database location:** Initiatives table lives in `~/.niobot/data/niobot.db` (persistent, never rebuilt). Same DB where memories, DNA state, and conversations already live. NOT in `index.db` (which gets wiped by build_index.py).

2. **`/evaluate` trigger:** Auto-invokes when a GitHub URL is shared with exploratory context (e.g., "check this out", "what do you think of this"). Skips when URLs are clearly just code references. The skill reads the README, explains the tool in plain English, evaluates fit for the GTMe OS, and files the result as an initiative in SQLite with status `idea`, `planned`, or `not_needed`.

3. **Query-first rule:** Added to both CLAUDE.md and TEAM-CONSTRAINTS.md. Covers everything queryable: content status, initiatives, session history, DNA/evolution state, daily costs. If it's in a database, check the database before answering from memory.

4. **`/morning` suggestions:** When `/morning` runs, it queries the initiatives table for unblocked items, then highlights the top 3 recommendations based on priority + recency of related work. Format: "You shipped X last week, initiative Y is now unblocked." Shows all unblocked initiatives, then the opinionated top 3.

5. **Initiatives table schema:** Stored in `niobot.db` with columns: id, title, description, status (idea/planned/in_progress/blocked/completed/not_needed), source (evaluate/discuss/phase-report/manual), source_url (GitHub URL or reference), pillar (content/infrastructure/growth/product), priority (1-5), depends_on (comma-separated initiative IDs), blocked_by (text description of blocker), created_at, updated_at, notes.

6. **Initiative lifecycle:** Ideas flow in from `/evaluate` (external tools), `/discuss` deferred items, `/phase-report` future work sections, and manual entry. Status transitions: idea → planned → in_progress → completed (or blocked at any point). `/morning` surfaces items where blockers are resolved.

7. **Files to create/modify (6 total):**
   - CREATE: `.claude/skills/evaluate/SKILL.md` — new skill
   - CREATE: `website/apps/nio-chat/lib/db/migrations/004_initiatives.sql` — schema migration
   - MODIFY: `website/apps/nio-chat/lib/db/queries/dna.ts` — add initiative CRUD functions
   - MODIFY: `.claude/skills/morning/SKILL.md` — add initiatives scan + top 3 suggestions
   - MODIFY: `CLAUDE.md` — add query-first rule
   - MODIFY: `.claude/teams/TEAM-CONSTRAINTS.md` — add query-first to Rule 8

## Deferred Ideas

- [ ] Wire initiatives into Mission Control's `tasks.json` for dashboard display — needs MC data pipeline work
- [ ] `/ideas` quick-capture skill for ad-hoc initiative entry without full evaluation
- [ ] Auto-parse deferred items from CONTEXT.md files into initiatives table on phase-report completion
- [ ] Initiative dependencies graph visualization in Mission Control
- [ ] Move Nio to Cloudflare Workers via OpenNext — filed as first initiative once table exists

## Claude's Discretion

- Exact SQL column types and constraints for the initiatives table (will follow existing niobot.db patterns)
- Migration file numbering (will check existing migrations for the next available number)
- `/evaluate` output format (will match existing skill output patterns — concise, scannable)
- How `/morning` formats the top 3 recommendations (will fit within existing morning brief structure)
