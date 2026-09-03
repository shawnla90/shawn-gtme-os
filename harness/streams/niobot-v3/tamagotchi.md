# Stream: tamagotchi  (initiative #5, priority 5, pillar evolution)

Initiative text from niobot.db: "Wire up tier 1-5 sprite sheets in Nio chat. Show current evolution tier based on XP. Play
evolution animation on tier-up. Display idle/chat/think animations contextually. Use transparent 256px assets from
data/progression/avatars/."

Reality check done before you started: `data/progression/avatars/` does NOT exist in the repo. The assets that do exist are
`website/apps/nio-chat/public/avatars/nio-tier-{1..5}-idle.gif` (plus architect/writer idle gifs and one static png).
Use the tier gifs; record the missing 256px set as a --blocker in your first handoff block and do not invent assets.

## What exists
- `lib/evolution.ts`: `TIERS` (Spark 0 / Blade 500 / Warden 2000 / Sentinel 6000 / Ascended 15000), `getLevelProgress(xp)`,
  `getTierName`, `getAvatarForTier(tier)` at L213-216 returning `/avatars/nio-tier-${tier}-idle.gif`.
- `app/components/ChatHeader.tsx` L77 and L123 inline the template string instead of calling `getAvatarForTier`. Fix that.
- `app/globals.css` L267-283 defines `@keyframes tier-up-burst` and `.tier-up-burst` with ZERO references anywhere. Wire it.
- `EvolutionProvider.tsx`: event buses `onXPGain/emitXPGain` (L105-114) and `onLevelUp/emitLevelUp` (L128-137) with
  `LevelUpEvent { newTier, newLevel, tierName, isTierUp }`. `addXP` (L282-342) emits levelUp twice for one transition:
  optimistic at L291-298 and server-confirmed at L330-337. Dedupe so a tier-up animates once.
- `LevelUpNotification.tsx`: toast only (auto-dismiss 3 s), uses `.level-up-glow`, plays a `levelUp` chime. No avatar burst.
- `useEvolutionXP.ts` reads chat state (`isStreaming`, `isWaiting`, `agentStates`) via `useChatContext()`; L72 detects failed
  replies with `content.startsWith('error:')`. Another stream is replacing that string contract with a `status` field on
  `Message`; keep the prefix check working AND tolerate a future `message.status === 'failed'` (check both, defensively typed).
- `NioXPRing.tsx` has `TIER_COLORS`; `EvolutionPanel.tsx` has `SKILL_COLORS`. Two tier-to-color maps; consolidate into
  `lib/evolution.ts` if it stays small.

## Build
1. Avatar component (new file under `app/components/`, e.g. `NioAvatar.tsx`) that takes `tier` and a `mood`
   (`idle | chat | think`) and renders the tier gif; `chat` and `think` are CSS-driven variants (subtle bob / pulse) on the
   same idle gif since no other sprites exist. Use it from `ChatHeader.tsx` and `EvolutionPanel.tsx`.
2. Contextual mood: `think` while `isWaiting`, `chat` while `isStreaming`, else `idle` (read from chat context; do not edit ChatProvider).
3. Tier-up: on `LevelUpEvent.isTierUp`, swap the gif and play `.tier-up-burst` once on the avatar; fix the double emit.
4. Respect `prefers-reduced-motion`.

## Owned files
`EvolutionProvider.tsx`, `EvolutionPanel.tsx`, `useEvolutionXP.ts`, `lib/evolution.ts`, `NioXPRing.tsx`, `LevelUpNotification.tsx`,
`XPFloat.tsx`, `SkillBar.tsx`, `app/api/dna/xp/route.ts`, `app/globals.css` (lines 233-283 region only, append new rules
at the end of the file), `ChatHeader.tsx` (only L75-84 and L121-129, the avatar spots), new `NioAvatar.tsx`.

## Do not touch
`ChatProvider.tsx` (read its exported context only), `lib/types.ts`, `MessageBubble.tsx`, `MessageList.tsx`, `InputBar.tsx`,
`TypingIndicator.tsx`, `app/api/chat/route.ts`, `ChatInterface.tsx`, anything under `lib/db/`.

## Working rules (identical for every stream in this run)

You are one of four autonomous agents working in parallel on `website/apps/nio-chat` in this monorepo. Your cwd is a
dedicated git worktree on your own branch. Other agents own other files. Stay inside your ownership list.

- Verification bar: `cd website/apps/nio-chat && npx tsc --noEmit` after every change set; `npx next build` (same dir)
  before your final milestone. Do NOT run `next lint` (no ESLint config exists; it prompts interactively and hangs).
- `node_modules` are symlinked from the main checkout. Do not run `npm install`, add, or bump any dependency.
- Commit per milestone with a `feat(nio-chat):` or `fix(nio-chat):` prefix. Commit only files you own plus HANDOFF.md.
- After every milestone AND before you stop for any reason, run from the worktree root:
  `harness/handoff-append.sh --task niobot-v3/tamagotchi --milestone "<name>" --verified "<claim> :: <command> -> <result>" --assumed "<claim>" --blocker "<text>" --resume "<command>" --commit`
  A claim goes under --verified only with the command that proved it. Anything else is --assumed.
- Hard limits: no `git push`, no deploy, no Vercel, no external API writes, no Notion/Slack/Discord, no killing processes,
  no edits outside `website/apps/nio-chat` except HANDOFF.md, do not read or write `~/.niobot/data/niobot.db`
  (`lib/db.ts` opens it; never run code paths that touch it, unit-test pure functions instead).
- If you are blocked on a file another stream owns, record it as --blocker with the exact change you need and stop touching it.
- Zero em dashes in any copy or comment you write.
- Finish with a final milestone named "complete" whose Verified section includes the tsc and next build commands and results.
