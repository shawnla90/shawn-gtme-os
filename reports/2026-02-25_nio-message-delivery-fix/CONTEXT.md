# Nio P0 Message Delivery Fix — Decision Lock

**Date:** 2026-02-25
**Scope:** Fix Nio's message delivery pipeline — server-side stdout buffer parser, SSE streaming, and client-side SSE reader. Includes: truncation fix, timeout handling, heartbeat/keepalive, and client reconnection. Does NOT include: switching to Agent SDK, soul file changes, XP/evolution changes, or new agents.
**Domains:** API/Data, Visual/UI

---

## Decisions

1. **Server buffer fix:** Rewrite `lib/claude.ts:201-213` stdout handler to properly accumulate partial JSON lines across chunks before parsing. Log discarded partial lines at debug level for future diagnostics.

2. **Inactivity timeout:** Add a 3-minute no-stdout-activity timeout to the claude child process. If no output for 180s, kill the process and send an error event to the client. Reset the timer on every stdout chunk.

3. **SSE heartbeat:** Send `data: {"type":"heartbeat"}\n\n` every 15 seconds from `app/api/chat/route.ts` while the claude process is running. Prevents Cloudflare Tunnel and browser proxies from closing idle connections. Clear the interval on stream close.

4. **Client-side line buffer:** Add a line accumulator in `ChatProvider.tsx` SSE reader (lines 393-425) to handle `data:` lines split across `reader.read()` chunks. Mirrors the server-side fix.

5. **Client auto-retry:** On stream drop (non-abort error), automatically retry the message once with a 2-second delay before showing the error. If the retry also fails, show the error message.

6. **Client heartbeat handling:** Client SSE parser should silently ignore `{"type":"heartbeat"}` events — no state changes, no UI updates.

7. **Files to modify (3 total):**
   - `website/apps/nio-chat/lib/claude.ts` — Decisions 1, 2
   - `website/apps/nio-chat/app/api/chat/route.ts` — Decision 3
   - `website/apps/nio-chat/app/components/ChatProvider.tsx` — Decisions 4, 5, 6

## Deferred Ideas

- [ ] Switch from `claude -p` child process to Claude Agent SDK — blocked by API-key-only auth (can't use Max subscription). Revisit if Anthropic opens OAuth for SDK.
- [ ] Add structured error categories (timeout vs crash vs rate-limit) with different UI treatments
- [ ] Add stream progress indicator (bytes received / estimated) for long responses
- [ ] Investigate writing skill XP attribution for blog posts written via Claude Code

## Claude's Discretion

- Exact debug log format for partial lines (will use existing `[claude:${agent.id}]` prefix pattern)
- Heartbeat interval cleanup timing (will clear on both `close` and `error` events)
- Retry delay exact value (2s stated, but Claude may adjust ±500ms if it improves UX flow)
