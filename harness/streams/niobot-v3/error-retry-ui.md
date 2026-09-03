# Stream: error-retry-ui  (initiative #4, priority 4, pillar messaging)

Initiative text from niobot.db: "Add visible error states in Nio chat UI when messages fail. Implement retry logic with
exponential backoff. Surface SSE connection status to user. Log delivery failures for debugging."

Split with the `sse-transport` stream: YOU own the reducer, the `Message` shape, and every visible error/retry surface.
`sse-transport` owns the network code in `ChatProvider.tsx` L357-501 (`streamResponse`, `fireChatRequest`, `sendMessage`)
and implements the actual backoff there. You define the state and actions it dispatches into.

## What exists
- `lib/types.ts` L3-9: `Message = { id, role, content, timestamp, agentId? }`. No status/error field.
- `ChatProvider.tsx` reducer L87-205. `STREAM_ERROR` (L173-183) overwrites the assistant message content with the literal
  string `error: <msg>`. That string is the only failure signal in the app; `useEvolutionXP.ts` L72 checks
  `content.startsWith('error:')` (owned by the tamagotchi stream, which has been told to also accept a `status` field).
- `MessageBubble.tsx` (32 lines) is presentational only; `MessageList.tsx` maps bubbles and shows `TypingIndicator` when
  `state.isWaiting`; `InputBar.tsx` disables on `state.isStreaming` and fires `sendMessage` without awaiting it.
- `ChatSSEEventType` in `lib/types.ts` L23 already lists `'model' | 'memory_flush' | 'confirm'` that nobody implements.

## Build
1. `lib/types.ts` L3-9 only: add `status?: 'sending' | 'streaming' | 'delivered' | 'failed'`, `error?: string`,
   `attempts?: number` to `Message`, and a `ConnectionState = 'idle' | 'connecting' | 'streaming' | 'reconnecting' | 'offline'`
   type. Do not edit L23-28 (`ChatSSEEvent*`, owned by sse-transport).
2. Reducer (L87-205): new actions `MESSAGE_STATUS` ({id, status, error?, attempts?}), `CONNECTION_STATE` ({state, detail?}),
   `RETRY_MESSAGE` ({id}) that resets the assistant placeholder. Rework `STREAM_ERROR` to set `status:'failed'` and `error`
   WITHOUT clobbering content, but keep writing the `error: ...` content when the message has no content yet, so the
   evolution hook's prefix check keeps working until it migrates. Expose `connection` in state and `retryMessage(id)` in context.
   Export a small `DeliveryLog` helper (`lib/delivery-log.ts`, new) with `logDelivery({id, event, attempt, detail})` that
   keeps a ring buffer in memory and `console.debug`s in dev; the transport stream will call it.
3. UI: `MessageBubble.tsx` shows a failed state (muted bubble, the error text, a Retry button calling `retryMessage`);
   `MessageList.tsx` renders a thin connection banner from `state.connection` when not idle/streaming ("reconnecting..." with
   attempt count, "offline"); `InputBar.tsx` awaits `sendMessage` and re-enables on failure; `TypingIndicator.tsx` unchanged
   unless you need a `reconnecting` variant.
4. Do not implement network retries or backoff timing; dispatch the actions and leave the calls for sse-transport. Put the
   exact action names and payload shapes in your HANDOFF Verified section so the other stream can wire them.

## Owned files
`MessageBubble.tsx`, `MessageList.tsx`, `InputBar.tsx`, `TypingIndicator.tsx`, `ChatProvider.tsx` L87-205 (reducer, state
shape, context value; nothing below L357), `lib/types.ts` L3-9, new `lib/delivery-log.ts`, new components you add.

## Do not touch
`ChatProvider.tsx` L357-501, `lib/types.ts` L23-28, `app/api/chat/route.ts`, `useEvolutionXP.ts`, anything evolution-related,
`ChatHeader.tsx`, `ChatInterface.tsx`, anything under `lib/db/`.

## Working rules (identical for every stream in this run)

You are one of four autonomous agents working in parallel on `website/apps/nio-chat` in this monorepo. Your cwd is a
dedicated git worktree on your own branch. Other agents own other files. Stay inside your ownership list.

- Verification bar: `cd website/apps/nio-chat && npx tsc --noEmit` after every change set; `npx next build` (same dir)
  before your final milestone. Do NOT run `next lint` (no ESLint config exists; it prompts interactively and hangs).
- `node_modules` are symlinked from the main checkout. Do not run `npm install`, add, or bump any dependency.
- Commit per milestone with a `feat(nio-chat):` or `fix(nio-chat):` prefix. Commit only files you own plus HANDOFF.md.
- After every milestone AND before you stop for any reason, run from the worktree root:
  `harness/handoff-append.sh --task niobot-v3/error-retry-ui --milestone "<name>" --verified "<claim> :: <command> -> <result>" --assumed "<claim>" --blocker "<text>" --resume "<command>" --commit`
  A claim goes under --verified only with the command that proved it. Anything else is --assumed.
- Hard limits: no `git push`, no deploy, no Vercel, no external API writes, no Notion/Slack/Discord, no killing processes,
  no edits outside `website/apps/nio-chat` except HANDOFF.md, do not read or write `~/.niobot/data/niobot.db`
  (`lib/db.ts` opens it; never run code paths that touch it, unit-test pure functions instead).
- If you are blocked on a file another stream owns, record it as --blocker with the exact change you need and stop touching it.
- Zero em dashes in any copy or comment you write.
- Finish with a final milestone named "complete" whose Verified section includes the tsc and next build commands and results.
