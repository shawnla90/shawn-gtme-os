# Nio Reliability + Self-Learning Layer — Technical Report

**Date:** 2026-02-25
**Session scope:** Fix P0 message delivery, PWA cache busting, context window visibility, cross-session memory, and plan self-learning repo layer
**Status:** Phase 1 complete (reliability fixes shipped). Phase 2 pending (self-learning layer build).

---

## What Was Done

### Source/Trigger

Nio was silently dropping long messages due to stdout buffer splitting across Node.js chunks. PWA service worker was caching stale JS bundles indefinitely. No visibility into context window usage. No cross-session memory. And a strategic gap: good ideas from conversations were getting lost with no system to capture and resurface them.

### Files Modified

| File | Change | Commit |
|------|--------|--------|
| `website/apps/nio-chat/lib/claude.ts` | Buffer parsing fix, 3min inactivity timeout, session memory injection into soul prompt | `48813d3` |
| `website/apps/nio-chat/app/api/chat/route.ts` | 15s SSE heartbeat interval | `48813d3` |
| `website/apps/nio-chat/app/components/ChatProvider.tsx` | Client SSE line buffer, auto-retry on stream drop, sessionTokens accumulator, auto-summarize on new chat | `48813d3`, `5c904c9` |
| `website/apps/nio-chat/lib/types.ts` | Added `'heartbeat'` to `ChatSSEEventType` union | `48813d3` |
| `website/apps/nio-chat/NIO-STATE.md` | P0 marked resolved, current state updated | `48813d3` |
| `website/apps/nio-chat/public/sw.js` | Bumped CACHE_VERSION to v5, network-first for JS/CSS/HTML, cache-first only for static assets | `e43c822` |
| `website/apps/nio-chat/app/components/PWARegistration.tsx` | 5min update check, visibilitychange listener, auto-activate waiting SW | `e43c822` |
| `website/apps/nio-chat/app/components/EvolutionPanel.tsx` | Context window progress bar (green/yellow/red) with token counter | `5c904c9` |
| `website/apps/nio-chat/souls/nio-soul.md` | Removed dead OpenClaw paths, updated to current system paths | `5c904c9` |

### Files Created (Planning Only)

| File | Purpose |
|------|---------|
| `reports/2026-02-25_nio-message-delivery-fix/CONTEXT.md` | Decision lock for P0 fix (7 decisions) |
| `reports/2026-02-25_self-learning-repo-layer/CONTEXT.md` | Decision lock for self-learning layer (7 decisions) |

### Architecture Decisions

**P0 Message Delivery (from CONTEXT.md):**

1. **Root cause:** stdout buffer splitting, not SSE transport. Fix is line accumulation on server side, not protocol change.
2. **Server buffer:** Accumulate partial lines in `claude.ts` `child.stdout` handler. Only parse when `\n` delimiter found.
3. **Client buffer:** Same pattern in `ChatProvider.tsx` SSE reader. Accumulate until `\n`, then parse `data: ` lines.
4. **Heartbeat:** 15s interval from API route. Client ignores `type: 'heartbeat'` events but connection stays alive.
5. **Inactivity timeout:** 3 minutes no stdout from claude child process triggers SIGTERM + 5s SIGKILL fallback.
6. **Auto-retry:** Client retries once after 2s delay on stream failure. No retry loop.
7. **No architecture change:** Stay on `claude -p` subprocess model. Agent SDK requires API keys (per-token billing), OAuth is locked to Claude Code only.

**Self-Learning Layer (from CONTEXT.md):**

1. **Database location:** Initiatives table in `~/.niobot/data/niobot.db` (persistent, never rebuilt). NOT in `index.db`.
2. **`/evaluate` trigger:** Auto-invokes when GitHub URL shared with exploratory context. Reads README, evaluates fit, files as initiative.
3. **Query-first rule:** Added to CLAUDE.md and TEAM-CONSTRAINTS.md. All queryable data: check DB before answering from memory.
4. **`/morning` suggestions:** Query initiatives for unblocked items, highlight top 3 based on priority + recency.
5. **Schema:** id, title, description, status (idea/planned/in_progress/blocked/completed/not_needed), source, source_url, pillar, priority (1-5), depends_on, blocked_by, created_at, updated_at, notes.
6. **Lifecycle:** Ideas flow from `/evaluate`, `/discuss` deferrals, `/phase-report` future work, manual entry. `/morning` surfaces unblocked items.
7. **6 files to create/modify** (see Phase 2 below).

### How Components Connect

```
User message → ChatProvider.tsx (SSE line buffer)
  → POST /api/chat/route.ts (15s heartbeat)
    → claude.ts spawnClaude() (stdout line buffer, 3min timeout)
      → composeSoulPrompt() (injects last 5 session memories from SQLite)
      → claude -p subprocess
    ← JSON stream events
  ← SSE events (text, usage, heartbeat, done, error)
← UI update + sessionTokens accumulator

New Chat button → auto-summarize last 10 msgs → POST /api/memory → SQLite
                → reset sessionTokens to 0
```

## What Still Needs To Be Done (Phase 2)

### High Priority — Self-Learning Layer Build

- [ ] CREATE `.claude/skills/evaluate/SKILL.md` — new `/evaluate` skill for GitHub repo assessment
- [ ] CREATE `website/apps/nio-chat/lib/db/migrations/004_initiatives.sql` — initiatives table schema
- [ ] MODIFY `website/apps/nio-chat/lib/db/queries/dna.ts` — add initiative CRUD functions (create, update, query by status/pillar/priority)
- [ ] MODIFY `.claude/skills/morning/SKILL.md` — add initiatives scan + top 3 suggestions to morning brief
- [ ] MODIFY `CLAUDE.md` — add query-first rule
- [ ] MODIFY `.claude/teams/TEAM-CONSTRAINTS.md` — add query-first to Rule 8

### Medium Priority

- [ ] Wire initiatives into Mission Control `tasks.json` for dashboard display
- [ ] `/ideas` quick-capture skill for ad-hoc initiative entry without full evaluation
- [ ] Auto-parse deferred items from CONTEXT.md into initiatives table on phase-report completion

### Long-Term

- [ ] Initiative dependencies graph visualization in Mission Control
- [ ] Move Nio to Cloudflare Workers via OpenNext (filed as first initiative once table exists)

## Key Decisions Made

1. Stay on `claude -p` subprocess model. Agent SDK requires API keys, OAuth locked to Claude Code only.
2. Network-first PWA caching for all non-static assets. Cache-first only for fonts, icons, avatars, chimes.
3. Auto-activate service workers immediately (no user-click toast).
4. Context window assumed 200k tokens. Green < 60%, yellow 60-85%, red > 85%.
5. Auto-summarize saves last 10 messages, memory injection loads last 5 summaries.
6. Self-learning layer uses existing `niobot.db`, not `index.db`.
7. Initiatives have 6 statuses: idea, planned, in_progress, blocked, completed, not_needed.

## Deferred Ideas

- [ ] Wire initiatives into Mission Control dashboard — needs MC data pipeline work
- [ ] `/ideas` quick-capture skill for ad-hoc initiative entry
- [ ] Auto-parse deferred items from CONTEXT.md into initiatives on phase-report completion
- [ ] Initiative dependencies graph visualization in Mission Control
- [ ] Move Nio to Cloudflare Workers via OpenNext
- [ ] Chime system (Pillar 2 of NioBot V3 plan — not touched this session)

## Key File Locations

```
website/apps/nio-chat/
  lib/claude.ts                          # Claude subprocess spawner (buffer fix, timeout, memory)
  lib/types.ts                           # SSE event types
  app/api/chat/route.ts                  # SSE streaming API route (heartbeat)
  app/components/ChatProvider.tsx         # Client state (line buffer, retry, summarize, tokens)
  app/components/EvolutionPanel.tsx       # Evolution drawer (context window bar)
  app/components/PWARegistration.tsx      # Service worker registration (auto-activate)
  public/sw.js                           # Service worker (network-first caching)
  souls/nio-soul.md                      # Nio personality + system prompt
  NIO-STATE.md                           # Current Nio state doc
  lib/db/queries/dna.ts                  # SQLite query functions (memory CRUD)

reports/
  2026-02-25_nio-message-delivery-fix/CONTEXT.md   # P0 decision lock
  2026-02-25_self-learning-repo-layer/CONTEXT.md   # Self-learning layer decision lock
  2026-02-25_nio-reliability-and-self-learning/     # This report

Commits: 48813d3, e43c822, 5c904c9
```
