# Context Handoff
> Generated: 2026-02-23 00:00 | Machine: MacBook | Session: DNA persistence layer + service worker debugging

## What Was Done This Session
- **Created `website/apps/nio-chat/lib/db/migrations/003_dna.sql`** — `dna_state` table (single-row identity snapshot), `dna_daily_flags` (server-side daily bonus), ALTERed `memory` with tags/importance/FTS5, ALTERed `evolution_history` with context columns, `v_dna_snapshot` and `v_xp_daily_summary` views
- **Created `website/apps/nio-chat/lib/db/queries/dna.ts`** — Full query layer: `getDNASnapshot()`, `getDNAState()`, `awardXP()` (server-authoritative), `updateStreak()`, `claimDailyBonus()`, daily flag helpers, memory CRUD + FTS5 search, `recordChatTurn()`, `getXPHistory()`, `bootstrapFromLocalStorage()`, `enrichSnapshot()`
- **Created 4 API routes**: `app/api/dna/route.ts` (GET snapshot), `app/api/dna/xp/route.ts` (POST XP), `app/api/dna/memory/route.ts` (GET/POST), `app/api/dna/bootstrap/route.ts` (localStorage migration)
- **Modified `app/api/chat/route.ts`** — Persists user/assistant messages, reads evolution from DNA (not client), tracks costs via `recordChatTurn()`
- **Modified `app/components/EvolutionProvider.tsx`** — Server-first init (GET /api/dna), optimistic XP + server reconciliation, auto-bootstrap
- **Modified `app/components/useEvolutionXP.ts`** — Daily bonus validated server-side
- **Modified `app/components/ChatProvider.tsx`** — Removed client evolution sending
- **Modified `app/api/memory/route.ts`** — Dual-write flat file + SQLite, FTS5 search
- **Modified `lib/types.ts`** — Removed `evolutionTier`/`skillLevels` from `ChatRequest`, added `DNASnapshot`
- **Debugged PWA service worker caching** — SW was serving stale JS bundles. Unregistered SW + cleared caches to fix. Verified working through Cloudflare tunnel at `nio.shawnos.ai`

## Current State
- **Git**: branch `main`, clean, last commit `572857b docs: update IP registry + README for NioBot V3 — DNA, chimes, evolution, PWA`
- **Uncommitted changes**: only `.playwright-mcp/` debug logs (untracked, don't commit)
- **Dev server**: running on port 3004, Cloudflare tunnel active at `nio.shawnos.ai`
- **DB**: migration 003 applied, `dna_state` seeded (xp=0, tier=1, level=1)

## Next Steps
1. **Gateway/deployment system needed** — Shawn flagged the need for a better workflow when adding features/routes to NioBot. Currently: Cloudflare tunnel at `~/.cloudflared/config.yml` blindly proxies `localhost:3004`. No validation that new API routes (like `/api/dna/*`) work post-deploy. Consider: route health check script, deploy manifest listing expected endpoints, or a `/api/health` route that checks all subsystems.
2. **PWA cache-busting strategy** — The service worker aggressively caches old bundles. On iOS, users must do Settings → Safari → Clear History and Website Data. Need a versioned cache strategy or SW update mechanism that forces refresh on new deploys.
3. **Test DNA end-to-end** — Send a chat and verify: `sqlite3 ~/.niobot/data/niobot.db "SELECT xp, tier, level, streak FROM dna_state"` shows non-zero XP.
4. **NioBot V3 remaining** — Per MEMORY.md: messages fixed (DNA persists), chimes built, evolution built. Next: full evolution UI polish, soul file evolution tiers.

## Key Decisions Made
- **Server-authoritative XP**: Client dispatches optimistic ADD_XP, POSTs to `/api/dna/xp`. Server applies real streak multiplier and reconciles. No spoofable evolution.
- **Dual-write memory**: `/api/memory` writes flat files + SQLite during transition.
- **Daily flags server-side, session flags client-side**: `dailyBonusClaimed` in `dna_daily_flags` table. `deepConvoClaimed`/`veryDeepConvoClaimed` stay client-side per-session.
- **Timestamp format mismatch handled**: 002 uses `datetime('now')` strings, 003 views handle both with `CASE WHEN typeof()`.

## Files to Read First
1. `website/apps/nio-chat/lib/db/queries/dna.ts` — Core DNA query layer
2. `website/apps/nio-chat/lib/db/migrations/003_dna.sql` — Schema
3. `website/apps/nio-chat/app/api/chat/route.ts` — Chat persistence wiring
4. `website/apps/nio-chat/app/components/EvolutionProvider.tsx` — Client server-sync flow
5. `~/.cloudflared/config.yml` — Tunnel config for gateway discussion
