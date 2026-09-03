# Stream: sse-transport  (initiative #3, priority 5, pillar messaging)

Initiative text from niobot.db: "NioBot V3, fix message delivery. Pillar 1: SSE parsing, reconnection, logging fixes."

Split with the `error-retry-ui` stream: YOU own the server route and the network half of `ChatProvider.tsx` (L357-501:
`streamResponse`, `fireChatRequest`, `sendMessage`). The UI stream owns the reducer (L87-205), the `Message` shape, and all
visible error surfaces. It is adding actions `MESSAGE_STATUS`, `CONNECTION_STATE`, `RETRY_MESSAGE` and a
`lib/delivery-log.ts` helper. Until those land on your branch, dispatch through a tiny local shim (`lib/sse-events.ts`, yours)
that no-ops unknown actions, so your branch type-checks alone and the merge wires it up.

## Defects found by inspection (fix each, cite the line in your handoff)
Server `app/api/chat/route.ts`:
- Frames are data-only: `send()` at L132-139 writes `data: <json>\n\n` with no `id:` and no `retry:`; the client cannot resume.
- `onUsage` (L172-187) double-encodes: `data` is a stringified JSON inside the JSON frame.
- Heartbeat every 15 s (L126, L153-155) is the only liveness signal; there is no `done` acknowledgement the client acts on.
Client `ChatProvider.tsx`:
- `streamResponse` (L358-416): the trailing-buffer flush at L406-413 only handles `text`, so a final `done`, `error`, or
  `usage` frame is dropped when the stream ends without a trailing blank line.
- `done` is never handled; the `conversationId` it carries is discarded.
- Parse failures are swallowed by empty `catch {}` at L401 and L412. No logging anywhere in the stream path.
- `sendMessage` (L459-501): a single hardcoded 2 s retry (L486-490), then `STREAM_ERROR 'connection lost. please try again.'`.
  No exponential backoff, no jitter, no resume, no distinction between pre-stream failure (safe to retry) and mid-stream
  failure (needs resume or a truncated-reply marker).
- `fireChatRequest` (L419-457) handles 429/401/other; no timeout on the fetch itself.

## Build
1. Server: add monotonically increasing `id:` per frame and a `retry:` hint; accept `Last-Event-ID` (header or body field)
   and, when the child process is still alive for that session, resume from the buffered frames (keep a bounded per-session
   ring buffer, e.g. last 200 frames, in module scope); fix the usage double-encoding (send the object); emit `done` with
   `conversationId` and `lastEventId`. Keep the response headers; add `retry:`.
2. Client `lib/sse-parser.ts` (new, pure, unit-testable with `npx tsx`): parse an SSE byte stream into typed events, handle
   `id:`/`retry:`/multi-line `data:`, flush the trailing buffer for ALL event types, and surface parse errors as an
   `{type:'parse_error'}` event instead of swallowing. Add `scripts/sse-parser.test.ts` (plain assertions, run with
   `npx tsx scripts/sse-parser.test.ts`; no test framework is installed and you may not add one).
3. Client `ChatProvider.tsx` L357-501: use the parser; on failure retry with exponential backoff and jitter (base 500 ms,
   cap 8 s, max 5 attempts), resuming with `Last-Event-ID` when a stream had started; dispatch `CONNECTION_STATE` and
   `MESSAGE_STATUS` via the shim; log every attempt through the shim's `logDelivery`; handle `done`; add an AbortController
   timeout on the initial fetch (e.g. 20 s to first byte).
4. `lib/types.ts` L23-28 only: extend `ChatSSEEventType` with `'done' | 'parse_error'` and add `id?: string` to `ChatSSEEvent`.

## Owned files
`app/api/chat/route.ts`, `ChatProvider.tsx` L357-501 only, new `lib/sse-parser.ts`, new `lib/sse-events.ts`, new
`scripts/sse-parser.test.ts`, `lib/types.ts` L23-28.

## Do not touch
`ChatProvider.tsx` L87-205 (reducer) or any line outside L357-501, `lib/types.ts` L3-9, `MessageBubble.tsx`, `MessageList.tsx`,
`InputBar.tsx`, `TypingIndicator.tsx`, anything evolution-related, `ChatHeader.tsx`, `ChatInterface.tsx`, `lib/db/`.

## Working rules (identical for every stream in this run)

You are one of four autonomous agents working in parallel on `website/apps/nio-chat` in this monorepo. Your cwd is a
dedicated git worktree on your own branch. Other agents own other files. Stay inside your ownership list.

- Verification bar: `cd website/apps/nio-chat && npx tsc --noEmit` after every change set; `npx next build` (same dir)
  before your final milestone. Do NOT run `next lint` (no ESLint config exists; it prompts interactively and hangs).
- `node_modules` are symlinked from the main checkout. Do not run `npm install`, add, or bump any dependency.
- Commit per milestone with a `feat(nio-chat):` or `fix(nio-chat):` prefix. Commit only files you own plus HANDOFF.md.
- After every milestone AND before you stop for any reason, run from the worktree root:
  `harness/handoff-append.sh --task niobot-v3/sse-transport --milestone "<name>" --verified "<claim> :: <command> -> <result>" --assumed "<claim>" --blocker "<text>" --resume "<command>" --commit`
  A claim goes under --verified only with the command that proved it. Anything else is --assumed.
- Hard limits: no `git push`, no deploy, no Vercel, no external API writes, no Notion/Slack/Discord, no killing processes,
  no edits outside `website/apps/nio-chat` except HANDOFF.md, do not read or write `~/.niobot/data/niobot.db`
  (`lib/db.ts` opens it; never run code paths that touch it, unit-test pure functions instead).
- If you are blocked on a file another stream owns, record it as --blocker with the exact change you need and stop touching it.
- Zero em dashes in any copy or comment you write.
- Finish with a final milestone named "complete" whose Verified section includes the tsc and next build commands and results.
