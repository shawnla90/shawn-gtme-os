# Stream: initiatives-api  (initiative #1, priority 2, pillar ops)

Initiative text from niobot.db: "Add /api/dna/initiatives REST endpoint for Mission Control to read/write initiatives."

## What exists
- Query layer `website/apps/nio-chat/lib/db/queries/initiatives.ts` (171 lines): types `InitiativeStatus`, `InitiativeSource`,
  `InitiativePillar`, `InitiativeRow`, `InitiativeParsed`; functions `createInitiative`, `getInitiative`, `updateInitiative`,
  `listInitiatives` (filters status/pillar/source, default limit 50), `getUnblockedInitiatives`, `getActiveInitiatives`.
  No `deleteInitiative`. `depends_on` is stored as a JSON string and parsed by `parseRow`.
- Schema `lib/db/migrations/004_initiatives.sql`: CHECK constraints on status/source/pillar, priority 1-5, views
  `v_initiatives_unblocked` and `v_initiatives_active`.
- The query layer has ZERO callers today. No API route exposes it.
- Route pattern to copy exactly: `app/api/dna/memory/route.ts` and `app/api/dna/route.ts`. Every handler opens with
  `if (!validateToken(request)) return new Response('Unauthorized', { status: 401 })` (from `lib/auth.ts`), parses JSON in
  try/catch to a 400 `{error:'Invalid JSON'}`, validates enums against a local array with the valid list in the 400 body,
  returns `{ ok: true, id }` on create and `{ <plural>, count }` on list, and wraps work in try/catch that logs
  `console.error('[dna/<name>] <VERB> error:', err)` and returns `{error:'Internal error'}` 500.

## Build
1. `app/api/dna/initiatives/route.ts` with GET (list; query params status, pillar, source, limit; `?view=unblocked|active`
   maps to the two view helpers), POST (create; required title; validate status/source/pillar/priority against the schema
   constraints; `depends_on` accepted as an array), PATCH (update by `id` in body or `?id=`), DELETE (`?id=`).
2. Add `deleteInitiative(id)` to the query file, matching the existing style.
3. Read-only reference to `lib/auth.ts`; do not modify it.
4. A pure-function test is impossible without the DB, so verify the route by type-checking and by reading the compiled
   route back; note in Assumed that no live request was made because the DB is off limits in this worktree.

## Owned files
`app/api/dna/initiatives/route.ts` (new), `lib/db/queries/initiatives.ts`. Nothing else.

## Do not touch
`lib/auth.ts`, `lib/db.ts`, any component, `lib/types.ts`, `app/api/chat/route.ts`, anything under `app/components/`.

## Working rules (identical for every stream in this run)

You are one of four autonomous agents working in parallel on `website/apps/nio-chat` in this monorepo. Your cwd is a
dedicated git worktree on your own branch. Other agents own other files. Stay inside your ownership list.

- Verification bar: `cd website/apps/nio-chat && npx tsc --noEmit` after every change set; `npx next build` (same dir)
  before your final milestone. Do NOT run `next lint` (no ESLint config exists; it prompts interactively and hangs).
- `node_modules` are symlinked from the main checkout. Do not run `npm install`, add, or bump any dependency.
- Commit per milestone with a `feat(nio-chat):` or `fix(nio-chat):` prefix. Commit only files you own plus HANDOFF.md.
- After every milestone AND before you stop for any reason, run from the worktree root:
  `harness/handoff-append.sh --task niobot-v3/initiatives-api --milestone "<name>" --verified "<claim> :: <command> -> <result>" --assumed "<claim>" --blocker "<text>" --resume "<command>" --commit`
  A claim goes under --verified only with the command that proved it. Anything else is --assumed.
- Hard limits: no `git push`, no deploy, no Vercel, no external API writes, no Notion/Slack/Discord, no killing processes,
  no edits outside `website/apps/nio-chat` except HANDOFF.md, do not read or write `~/.niobot/data/niobot.db`
  (`lib/db.ts` opens it; never run code paths that touch it, unit-test pure functions instead).
- If you are blocked on a file another stream owns, record it as --blocker with the exact change you need and stop touching it.
- Zero em dashes in any copy or comment you write.
- Finish with a final milestone named "complete" whose Verified section includes the tsc and next build commands and results.
