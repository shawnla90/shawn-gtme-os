# Content Operating System

This doc is the canonical source of truth for how content flows through Shawn's systems. Any skill, cron, or script that produces or distributes content MUST read this file first.

## Principle

**Content is authored once, dispatched to Discord for review, approved in a state machine, then published.** Discord is the staging surface. SQLite (`~/.niobot/data/niobot.db`) is the source of truth for queue state. The Vercel-hosted Next.js site (shawnos.ai, Vercel project `shawnos-site`) consumes approved blog content on push to `main`.

## Canonical paths

| Purpose | Path |
|---|---|
| Pack staging (per-pack scratchpad) | `~/content/drafts/<date>_<slug>/` |
| Pack manifest | `~/content/drafts/<date>_<slug>/manifest.json` |
| Blog source (authored) | `~/shawn-gtme-os/content/blog/` |
| Blog source (website-consumed on deploy) | `~/shawn-gtme-os/content/website/final/` |
| Substack drafts | `~/shawn-gtme-os/content/substack/final/` |
| LinkedIn drafts | `~/shawn-gtme-os/content/linkedin/final/` |
| X drafts | `~/shawn-gtme-os/content/x/final/` |
| Reddit drafts | `~/shawn-gtme-os/content/reddit/final/` |
| Guides | `~/shawn-gtme-os/content/guides/` |
| Dispatcher code | `~/content/dispatch/` |
| Secrets store | niobot.db `secrets` table |
| Dispatch queue | niobot.db `content_dispatch_queue` table |

## Triggers

| Trigger | Source | Invokes |
|---|---|---|
| `/code` or "code this" (manual) | Claude Code chat | `~/content/dispatch/cli.py <pack-dir>` |
| Fireflies transcript arrives | `com.shawn.fireflies-pull.plist` launchd cron → voice-invocation | voice-invocation runs dispatcher at end |
| `/voice-invocation <id>` (manual) | Claude Code chat | same as fireflies path |

## Channels

| Channel | Purpose | Accepts attachments | Public |
|---|---|---|---|
| `blog-newsletters` | Blog + Substack + LinkedIn-newsletter triad | yes | yes |
| `reddit-posts` | 3 subreddit variants | yes | yes |
| `linkedin-content` | Standalone LinkedIn posts | yes | yes |
| `x-posts` | X threads + single posts | yes | yes |
| `client-next-steps-todos` | Per-client next actions | yes | no |
| `internal-notes` | Raw meeting notes, decisions | yes | no |
| `productivity-to-dos` | Personal todos | yes | no |
| `unfinished-project-reports` | Build state / phase reports | yes | no |
| `fullscope` | Briefs, recaps, dispatcher status | yes | no |
| `voice-drift` | Voice-DNA drift proposals | yes | no |
| `paper-trading` | X-predict-bot output (new server, pending) | yes | no |

Channel webhooks live in `secrets` table keyed as `DISCORD_WEBHOOK_<CHANNEL_UPPER>`. Embed colors + registry in `~/content/dispatch/channels.py`.

## State machine

Each content item is a row in `content_dispatch_queue`:

```
pending → dispatched → approved → final → clipped
                     ↘ edit_requested (→ dispatched with version+1)
                     ↘ rejected
                     ↘ failed
```

Terminal verbs in Claude Code chat (implemented by `~/content/dispatch/approval.py`):

- `status` — list items + states for the most-recent pack
- `approve` / `approve <channel>` / `approve <id>` — flip to approved
- `approve <channel> hook <N>` — lock hook variant
- `edit <channel> "<instruction>"` — regenerate, post V2, strike V1
- `final` — **only verb that pushes to prod.** Deploys blog-newsletters via git commit+push to shawn-gtme-os → Vercel (`shawnos-site`) rebuilds. Other channels just mark `final`, ready for clip.
- `clip` / `clip next` — copy next winning variant to macOS clipboard

## Format rules (MUST)

1. **ASCII-normalize everything** — curly quotes → straight, em-dashes → hyphens, ellipsis char → `...`, non-breaking space → regular space. Runs in `formatters/common.py::normalize_ascii` before any dispatch. Prevents WhatsApp/Typefully mojibake.
2. **Strip markdown for LinkedIn, X, Reddit** — `**bold**` and `## headers` render as noise. Use `formatters/common.py::strip_markdown`.
3. **No markdown code fences as the body wrapper** — Discord fences strip leading whitespace on mobile copy. Send bodies as `.md`/`.txt` **attachments** instead; the embed carries the hook variants + summary.
4. **3 hook variants per public post** — primary / contrarian / curiosity. Sourced from the pack manifest `hook_variants[]`. User picks with `approve <channel> hook <N>`.
5. **Anti-slop scan runs on every public-channel item** — `formatters/common.py::anti_slop_flags` flags em-dashes left behind, authority-signal phrases, narrator setups, hype words, etc. Flags appear in the embed footer; 3+ flags = rewrite the content before dispatch.
6. **Safety scan for public channels** — any blocklist term from `~/shawn-gtme-os/.claude/blocklist.txt` refuses the dispatch and posts the offender to `fullscope` for investigation.

## Secrets

All API keys, webhooks, and OAuth tokens live in niobot.db `secrets` table. Read via:

```python
import sys
sys.path.insert(0, '/Users/shawnos.ai/content/dispatch')
from secret import secret
webhook = secret("DISCORD_WEBHOOK_BLOG_NEWSLETTERS")
```

The helper falls back to `os.environ` and lazy-migrates on first hit, so code written against env vars still works. Migration script: `~/shawn-gtme-os/scripts/migrate_secrets_v1.py`.

Legacy `.env.*` files on disk are being phased out. Do NOT add new tokens to files — write them directly into `secrets` with `set_secret(key, value, category=...)`.

## Deployment (`final` on blog-newsletters)

1. User says `final` (or `final blog-newsletters`).
2. Dispatcher copies `content/blog/<slug>.md` → `content/website/final/<slug>.md` in `~/shawn-gtme-os`.
3. Runs `git add + commit -m "content: ship <slug>"` in `~/shawn-gtme-os`.
4. `git push origin main`. Vercel auto-deploys `shawnos-site` from main (`website/apps/shawnos/vercel.json`; the Dockerfile there is legacy from the Railway era).
5. Dispatcher polls `https://shawnos.ai/blog/<slug>` until 2xx or 4-minute timeout.
6. Posts success/failure to `fullscope`.

## Archived flows

The following skills are superseded by the content OS and should NOT be invoked for new packs:

- `content-drop` → superseded by `/code`
- `final-copy` → superseded by `clip <channel>`

They remain readable as historical references. Their SKILL.md files are frontmatter-marked `status: deprecated`.

## Engagement flows (NOT archived)

These are distinct from post authoring and remain active:

- `reddit-engage` — scouted Reddit comment drafts
- `x-engage` — scouted X/Twitter reply drafts
- `linkedin-comments` — LinkedIn commenter replies
- `grok-critique` — slop check on drafts before commit

## Voice DNA

Content dispatcher reads voice principles + examples from `~/voice/` and anti-slop + viral-hooks + safety-filters from `~/shawn-gtme-os/skills/tier-1-voice-dna/`. Both locations are canonical; neither is being moved.

When voice-invocation detects drift, proposed principle updates go to `voice-drift` channel (Discord) + `~/voice/drafts/` (filesystem), never auto-applied.

## Fireflies integration

Fireflies cron (`~/Library/LaunchAgents/com.shawn.fireflies-pull.plist`, 21:07 daily + realtime every 5 min 07:00-22:00) downloads transcripts → runs voice-invocation → which calls this dispatcher at the end of its pipeline.

**Known gap**: Fireflies notetaker may not auto-join all meetings. Fix is in the Fireflies dashboard, not code:

1. `app.fireflies.ai → Settings → Meeting Rules → Auto-join: ALL meetings`
2. `Settings → Integrations → Google Calendar` → re-authorize full calendar scope
3. `Settings → Notetaker → Default notetaker email` → add as an attendee on meetings not on your primary calendar

A 7-day backfill cron is planned to surface silent gaps into `voice-drift`.

## Don'ts

- Don't post to Discord without setting an explicit `User-Agent` header (default Python UA returns 403).
- Don't bake webhook URLs into scripts — always `secret("DISCORD_WEBHOOK_<NAME>")`.
- Don't auto-post to Reddit (TOS).
- Don't wrap copy-destined content in triple-backtick fences (mobile copy strips whitespace).
- Don't use `final` without the user saying the word — it pushes to production.
- Don't add `.env.*` files for new tokens — write to `secrets` table.
