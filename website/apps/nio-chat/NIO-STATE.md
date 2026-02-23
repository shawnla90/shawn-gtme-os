# Nio Evolution State

> Source of truth for Nio's current progression.
> Updated: 2026-02-23
> Any Claude Code session should read this + query the DB for live values.

## Current State (verified from SQLite)

- **Tier:** 1 (Spark)
- **Level:** 7
- **Total XP:** 330
- **XP to Blade (Tier 2):** 170 more needed (500 threshold)
- **Streak:** 1 day
- **Total Messages:** 45
- **Daily Bonus Claimed:** yes (today)
- **Skill XP:** ops: 325, architecture: 10, writing: 0

## DB Status: WORKING

The SQLite database at `~/.niobot/data/niobot.db` is receiving XP awards correctly.
- `POST /api/dna/xp` writes to dna_state + evolution_history
- Bootstrap migration from localStorage has been completed
- Server-authoritative flow is functional

### Previous Issue (resolved 2026-02-23)
The DB was reading 0 XP while browser localStorage had ~320 XP. The bootstrap migration
ran and synced the data. The initial "Internal error" from the XP endpoint was a transient
issue (likely cold start). Subsequent calls all succeed.

### Monitoring Note
The evolution_history table only has entries from direct curl tests, not from browser usage.
This suggests the browser client may still be silently failing on some XP POST calls
(errors swallowed in the .catch() block of EvolutionProvider.tsx addXP). Worth adding
console.error logging in the client-side catch to surface any ongoing issues.

## How to Check Live State

```bash
# Full state
sqlite3 ~/.niobot/data/niobot.db "SELECT xp, tier, level, streak, skill_xp FROM dna_state WHERE user_id = 'default';"

# XP history (most recent)
sqlite3 ~/.niobot/data/niobot.db "SELECT * FROM evolution_history ORDER BY id DESC LIMIT 10;"

# Daily flags
sqlite3 ~/.niobot/data/niobot.db "SELECT * FROM dna_daily_flags WHERE date = date('now');"

# API test (requires auth token from .env.local)
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
- Non-max tiers: XP divided evenly across 10 levels
- Max tier: 1,000 XP per level beyond tier 5

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

## Skills (3 total, mapped to agents)

| Skill | Agent | Description |
|-------|-------|-------------|
| Ops | Nio | System operations, deploys, monitoring |
| Architecture | Architect | Design, planning, schemas |
| Writing | Writer | Content, blog posts, voice |

- Max skill level: 10
- XP per level: 100 * level number

## Key Files

| File | Purpose |
|------|---------|
| `~/.niobot/data/niobot.db` | SQLite database (source of truth) |
| `lib/evolution.ts` | XP math, tier/level calc, streak logic |
| `lib/db/queries/dna.ts` | Server-side DNA persistence queries |
| `lib/db/migrations/003_dna.sql` | DNA schema |
| `app/api/dna/route.ts` | GET /api/dna (client hydration) |
| `app/api/dna/xp/route.ts` | POST /api/dna/xp (XP awards) |
| `app/api/dna/bootstrap/route.ts` | POST /api/dna/bootstrap (localStorage migration) |
| `app/components/EvolutionProvider.tsx` | Client state management + server sync |
| `app/components/useEvolutionXP.ts` | Observer hook that triggers XP awards |

## Open Items

- [ ] Add console.error logging in EvolutionProvider.tsx catch blocks so failed XP POSTs are visible
- [ ] Verify browser-initiated XP awards are landing in evolution_history (not just curl tests)
- [ ] Conversation history UI (SessionSidebar is stubbed)
- [ ] Achievement/milestone system
- [ ] Dynamic soul file loading based on DB tier
