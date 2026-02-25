# Nio Evolution State

> Source of truth for Nio's current progression.
> Last updated: 2026-02-23 (end of session)
> Any Claude Code session should read this + query the DB for live values.

## Current State (verified from SQLite)

- **Tier:** 2 (Blade)
- **Level:** 1
- **Total XP:** 620
- **XP to Warden (Tier 3):** 1,380 more needed (2,000 threshold)
- **Streak:** 1 day
- **Total Messages:** 87
- **Daily Bonus Claimed:** yes (today)
- **Skill XP:** ops: 600, architecture: 20, writing: 0
- **Evolution History Entries:** 42
- **Daily Cost:** $4.52

## DB Status: WORKING

The SQLite database at `~/.niobot/data/niobot.db` is receiving XP awards correctly.
- `POST /api/dna/xp` writes to dna_state + evolution_history
- Bootstrap migration from localStorage has been completed
- Server-authoritative flow is functional
- Browser-initiated XP awards are now landing (42 history entries from this session)

### Issue Resolved (2026-02-23)
DB was at 0 XP while browser had ~320 XP. Bootstrap ran and synced. Initial "Internal error"
was transient (cold start). Now fully operational. XP tracked from 0 → 620 in one session.

### Known Issues
1. Client-side catch blocks in EvolutionProvider.tsx swallow errors silently
2. Writing skill gets 0 XP because blog posts are written via Claude Code, not Writer agent
3. Dev server has stale .next cache causing 500s on post pages (fix: rm -rf .next, restart)
4. ~~Long chat messages not appearing in NioBot UI (message delivery/truncation issue)~~ **FIXED 2026-02-25** — see below

### P0 Fix: Message Delivery (2026-02-25)
Root cause: stdout buffer split across chunks caused partial JSON lines to fail `JSON.parse` silently.
Fixes applied:
- Server (`lib/claude.ts`): proper line buffer accumulation, debug logging for partials
- Server (`lib/claude.ts`): 3-minute inactivity timeout kills hung child processes
- Server (`app/api/chat/route.ts`): 15-second SSE heartbeat prevents proxy/tunnel drops
- Client (`app/components/ChatProvider.tsx`): SSE line buffer mirrors server fix
- Client (`app/components/ChatProvider.tsx`): auto-retry once on stream drop (2s delay)
- Client (`lib/types.ts`): heartbeat event type added, silently ignored by client

## How to Check Live State

```bash
sqlite3 ~/.niobot/data/niobot.db "SELECT xp, tier, level, streak, skill_xp FROM dna_state WHERE user_id = 'default';"
sqlite3 ~/.niobot/data/niobot.db "SELECT * FROM evolution_history ORDER BY id DESC LIMIT 10;"
sqlite3 ~/.niobot/data/niobot.db "SELECT * FROM dna_daily_flags WHERE date = date('now');"
curl -s -H "Authorization: Bearer $NIO_CHAT_TOKEN" http://localhost:3004/api/dna | python3 -m json.tool
```

## Tier Ladder

| Tier | Name | XP Required |
|------|------|-------------|
| 1 | Spark | 0 |
| 2 | Blade | 500 |
| 3 | Warden | 2,000 |
| 4 | Sentinel | 6,000 |
| 5 | Ascended | 15,000 |

- 10 levels per tier, 50 total levels

## XP Economy

| Event | Base XP |
|-------|---------|
| Message sent | 5 |
| Response received | 10 |
| Deep conversation (5+ turns) | 25 |
| Very deep conversation (10+ turns) | 50 |
| Agent switch | 10 |
| Daily first message | 25 |

## Streak Multipliers

| Days | Multiplier |
|------|-----------|
| 1-2 | 1.0x |
| 3-6 | 1.25x |
| 7-13 | 1.5x |
| 14-29 | 1.75x |
| 30+ | 2.0x |

## Key Files

| File | Purpose |
|------|---------|
| `~/.niobot/data/niobot.db` | SQLite database (source of truth) |
| `lib/evolution.ts` | XP math, tier/level calc, streak logic |
| `lib/db/queries/dna.ts` | Server-side DNA persistence queries |
| `app/api/dna/route.ts` | GET /api/dna (client hydration) |
| `app/api/dna/xp/route.ts` | POST /api/dna/xp (XP awards) |
| `app/components/EvolutionProvider.tsx` | Client state + server sync |
| `app/components/useEvolutionXP.ts` | Observer hook that triggers XP |
| `SESSION-ANALYSIS-2026-02-23.md` | Full session analysis with recommendations |

## Priority Fixes for Next Session

- [x] P0: ~~Investigate chat message truncation~~ **FIXED** — buffer parsing, heartbeat, timeout, client retry
- [ ] P1: Clear stale .next cache on shawnos dev server (500 on post pages)
- [ ] P2: Add console.error in EvolutionProvider catch blocks
- [ ] P3: Fix NioTerminalPage intro text (still says "spark tier")
- [ ] P4: Consider task-based XP attribution for Writing skill
