# Stream: wire-contract  (second wave; base = integrate/niobot-v3)

Two first-wave streams shipped different action contracts for the same reducer. Your job is to make the transport actually
drive the UI. Nothing else.

## The mismatch (verified by reading both branches)
Reducer (`app/components/ChatProvider.tsx`, from error-retry-ui):
```ts
| { type: 'MESSAGE_STATUS'; id: string; status: MessageStatus; error?: string; attempts?: number }   // MessageStatus = 'sending'|'streaming'|'delivered'|'failed'
| { type: 'CONNECTION_STATE'; state: ConnectionState; detail?: string; attempt?: number }             // ConnectionState = 'idle'|'connecting'|'streaming'|'reconnecting'|'offline'
| { type: 'RETRY_MESSAGE'; id: string }
```
Transport shim (`lib/sse-events.ts`, from sse-transport) dispatches through `dispatchDelivery(dispatch: (action: never) => void, ...)`:
```ts
| { type: 'CONNECTION_STATE'; state: ConnectionState; msgId: string; attempt: number; lastEventId?: string }  // 'idle'|'connecting'|'streaming'|'reconnecting'|'done'|'failed'
| { type: 'MESSAGE_STATUS'; msgId: string; status: MessageStatus; error?: string }                          // 'pending'|'streaming'|'delivered'|'truncated'|'failed'
| { type: 'RETRY_MESSAGE'; msgId: string }
```
`msgId` vs `id`, different status and connection vocabularies, and the `never`-typed dispatch means tsc cannot catch it, so the
reducer silently ignores every transport action at runtime. `lib/delivery-log.ts` (UI stream) and the `logDelivery` in
`lib/sse-events.ts` (transport stream) are also two implementations of one idea.

## Build
1. Single source of truth for the action union and vocabularies in `lib/types.ts`: keep the reducer's names (`id`, `sending`,
   `offline`) and ADD what the transport needs (`truncated` message status; `lastEventId?` on CONNECTION_STATE). Map transport
   `pending` -> `sending`, `done` -> `idle`, `failed` -> `offline` at the shim boundary, or better, delete the shim's private
   types and import the shared ones.
2. Make `dispatchDelivery` typed against the real `ChatAction` union (export it from ChatProvider or move it to `lib/types.ts`)
   so a future mismatch fails `tsc`. Remove the `never` cast.
3. `retryMessage` (UI stream) calls `fireChatRequest(...)` and `streamResponse(...)` by name; confirm the transport's new
   signatures match and fix the calls if not.
4. Collapse the two delivery logs into `lib/delivery-log.ts`; `lib/sse-events.ts` re-exports it. Keep the ring buffer at 200.
5. `MessageBubble.tsx` renders `truncated` (partial reply kept, small marker, Retry available).
6. `useEvolutionXP.ts` L72 and `useChatChimes.ts`: read `message.status === 'failed'` first, fall back to the `error:` prefix.
7. Verify: `npx tsc --noEmit`, `npx tsx scripts/sse-parser.test.ts`, `npx next build`. Add assertions to the parser test file
   or a new `scripts/reducer-contract.test.ts` that feeds the transport's actions through the reducer and checks state.

## Owned files
`ChatProvider.tsx` (whole file this time; you are the only stream), `lib/types.ts`, `lib/sse-events.ts`, `lib/delivery-log.ts`,
`MessageBubble.tsx`, `ConnectionBanner.tsx`, `useEvolutionXP.ts`, `useChatChimes.ts`, `scripts/*.test.ts`.

## Do not touch
`app/api/chat/route.ts`, anything evolution-visual (`NioAvatar.tsx`, `EvolutionPanel.tsx`, `EvolutionProvider.tsx`, `globals.css`),
`app/api/dna/**`, `lib/db/**`.

## Working rules (same as wave one)

You are the only agent in this wave, in a dedicated git worktree on your own branch, based on `integrate/niobot-v3`.

- Verification bar: `cd website/apps/nio-chat && npx tsc --noEmit` after every change set; `npx next build` before your final
  milestone. Do NOT run `next lint` (no ESLint config; it prompts interactively and hangs).
- `node_modules` are symlinked from the main checkout. No `npm install`, no dependency changes.
- Commit per milestone with a `fix(nio-chat):` prefix. Commit only files you own plus the handoff file.
- After every milestone AND before you stop for any reason, run from the worktree root:
  `harness/handoff-append.sh --task niobot-v3-wire/wire-contract --milestone "<name>" --verified "<claim> :: <command> -> <result>" --assumed "<claim>" --blocker "<text>" --resume "<command>" --commit`
  A claim goes under --verified only with the command that proved it. Anything else is --assumed.
- Hard limits: no `git push`, no deploy, no external API writes, no killing processes, no edits outside `website/apps/nio-chat`
  except the handoff file, do not read or write `~/.niobot/data/niobot.db` (unit-test pure functions instead).
- Zero em dashes in any copy or comment you write.
- Finish with a final milestone named "complete" whose Verified section includes the tsc, test, and next build commands and results.
