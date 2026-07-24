# Plan: Freckle CLI workflows content pack

> Written from a remote session with no access to the Mac Mini. Everything below is a
> build brief, not content. Run this on the machine that has the actual Freckle runs,
> the shell history, and the packs.
>
> **Rule for whoever executes this: do not write a single line of the pack until Phase 1
> is filled in from real local sources. If a fact can't be retrieved, ask Shawn. Don't
> infer it, don't approximate it, don't write around it.**

## What this pack is

End-of-week pack covering the workflows run through the Freckle CLI against Clearbox.
Four channels plus a carousel: Reddit, LinkedIn newsletter, X, blog.

Known from Shawn's brief, unverified against the system:

- Three workflows: **signups**, **de-masking**, **GEO**
- Clearbox is the testbed. Signups is one use, and engaging existing users is another
- Convex gets read for user opportunities, to bring value into a call before the call
- It connects to Notion, which renders the workflows well
- Freckle's **enrichment hours** and **Connect** are the features to highlight
- The workflows also exist as post skills in **GTM Coding Agents**
- Shout out **Andy at Freckle** for first dibs on the CLI

## Phase 0: load context

Standard session startup first:

1. `.claude/context-handoff.md`
2. `tasks/lessons.md`
3. `content/CLAUDE.md` (canonical content OS doc, not present in the remote clone)
4. `git status` / `git log -1 --oneline`

Then the voice system, in order:

- `skills/tier-1-voice-dna/core-voice.md`
- `skills/tier-1-voice-dna/anti-slop.md`
- `skills/tier-2-context-playbooks/{linkedin,x-twitter,substack}.md`
- `skills/tier-3-content-ops/improvement-protocol.md`

## Phase 1: retrieve the actual runs

This is the phase the remote session could not do. Nothing gets written until this table
is filled with real values.

### Where to look

| source | what to pull |
|---|---|
| shell history | `history \| grep -i freckle` — the real commands, subcommands, flags, in the order they were run |
| Freckle CLI config / run logs | where it stores state, what a run writes, whether there's a local log to quote |
| `~/content/dispatch` + niobot.db | any pack already started for this topic, plus how dispatch expects the pack shaped |
| Convex | the actual signup query, the table and field names, how opportunities are read |
| Notion | what Connect actually pushed, and which view renders the workflows well enough to screenshot |
| GTM Coding Agents repo | the real skill/starter names and paths for the three workflows |
| Clearbox app | the de-masking source, and what it returns |
| Freckle docs / dashboard | exact definition of enrichment hours, and what a run consumed |

### The fact table to fill

Every row needs a real value or an explicit "ask Shawn".

**Workflow 1: signups**
- exact command(s) run:
- input source and fields:
- what it wrote back, and where:
- what lands in Notion:
- receipts: rows in, match rate, hours consumed, wall-clock:
- what broke or surprised on the first run:

**Workflow 2: de-masking**
- exact command(s) run:
- what feeds it (source of the anonymous traffic/identity signal):
- what it returns, at company level vs person level:
- what gets filtered, scored, or routed after:
- receipts:
- what broke:

**Workflow 3: GEO**
- **what GEO means in this run** (this was the biggest unknown remotely, do not guess):
- exact command(s) run:
- inputs and outputs:
- how it connects to the Reddit/AEO thesis, if it does:
- receipts:
- what broke:

**Cross-cutting**
- enrichment hours: exact definition, rate, and what these runs consumed:
- Connect: what was authorized, what it pushed, how it's configured:
- GTM Coding Agents: real skill names and paths:
- the Clearbox user-engagement angle: what was found for users, what was brought to a call, what the response was:
- Andy at Freckle: confirm how he wants to be referenced:

### Screenshot / asset capture while you're in there

- terminal output of one clean run per workflow
- the Notion view showing the workflows
- anything that makes a receipt visual instead of claimed

## Phase 2: pick the spine

Once the table is real, pick the single argument the pack runs on before drafting. Options
worth weighing against the actual runs:

- enrichment moving from a UI destination into a step the agent calls
- the sequencing discipline the CLI forces (what gets gated before spend)
- the workflows-as-skills angle, since they're already packaged in GTM Coding Agents

Write it in one sentence. Every piece in the pack serves that sentence.

## Phase 3: the pack

Follow the content OS in `content/CLAUDE.md` for authoring and dispatch. Trigger is
`code` / `/code`, which invokes `~/.claude/skills/code-content/SKILL.md`. Approval verbs:
`status`, `approve`, `approve <channel>`, `edit <channel> "<instruction>"`, `final`,
`clip next`.

| piece | path convention | notes |
|---|---|---|
| Blog (anchor, write first) | `content/blog/YYYY-MM-DD_slug.md` | frontmatter: title, date, excerpt, category, featured. Category from the five buckets: gtm-engineering, ships, methodology, context-engineering, web-development. TL;DR up top, question-format H2s, FAQ at the end, per the GEO audit convention already applied to all 34 posts |
| LinkedIn newsletter | `content/linkedin/drafts/YYYY-MM-DD_slug.md` | plus a separate short feed teaser driving to it. Lowercase first line, 1-2 sentence paragraphs, emoji as step markers, sign-off `shawn ⚡` or the 🧙‍♂️ variant, resources in comments |
| Reddit | `content/reddit/drafts/YYYY-MM-DD_slug.md` | frontmatter with target + alt subreddits, title options with a pick, body, comment hooks, subreddit notes. No link in body. See `skills/tier-3-content-ops/pillars/reddit-growth-seo.md` |
| X | `content/x/drafts/YYYY-MM-DD_slug-thread.md` | condensed thread, each tweet standalone, plus singles. Ship 1-2 days after LinkedIn |

Substance gate per `skills/tier-3-content-ops/substance-requirements.md`: every substantive
claim carries at least 2 of specific example, technical implementation, reasoning shown,
consequences, gotchas. The Phase 1 table is what makes this passable.

## Phase 4: carousel

Brand dark theme. These hexes are verified from
`website/apps/shawnos/app/globals.css`, so they don't need re-deriving:

| token | hex | use |
|---|---|---|
| canvas | `#050505` | background |
| grid | `#16132a` | grid lines |
| aura | `#6d5ee9` | accent, arrows, rules (the Clearbox-family violet) |
| aura-strong | `#8b7dff` | eyebrows, emphasis |
| ink | `#fafafa` | headings |
| secondary | `#a3a3a3` | body |
| muted | `#525252` | footer, slide numbers |

Build notes:

- SVG-based, not Pillow. Pillow output has been rejected before (CLAUDE.md, Technical
  Preferences). Generator script emitting SVGs keeps the copy editable in one place and
  matches the `_gen_*.py` convention in `content/images/`
- 1080x1350 for LinkedIn portrait. LinkedIn document posts take a PDF, so combine in
  slide order as the last step
- Slides should carry the **real** workflow diagrams: the signup flow and whatever the
  team-facing diagram is. Diagram the steps that actually ran, from the Phase 1 table
- Also worth checking: `~/clearbox-assets/assets-index.json` for the logo/brand pulls,
  and `.claude/skills/content-images/SKILL.md` for the existing image workflow

## Phase 5: gates before dispatch

1. `skills/tier-1-voice-dna/anti-slop.md` — no em dashes, no narrator setups, no
   dramatic framing, no triple-parallel sentences, no quoted phrases for emphasis,
   capital I throughout
2. `skills/ai-pattern-detection/SKILL.md` — full 29-pattern scan. 3+ flags means rewrite,
   not patch
3. `skills/tier-3-content-ops/pre-publish-checklist.md`
4. `skills/tier-1-voice-dna/safety-filters.md` — pattern vs. person, ecosystem protection
5. Pre-push blocklist scan via the Husky hook. Never `--no-verify`

## Phase 6: dispatch sequence

1. Blog first, it's the link target for everything else
2. LinkedIn newsletter same day, carousel attached, links in comments
3. Reddit next day, link in comments only if the sub allows
4. X thread 1-2 days after LinkedIn, singles spaced out after
5. `final` on blog-newsletters is the only verb that pushes to main and redeploys
   Railway. Requires Shawn to say the word

## Verified external facts

Researched remotely, so these don't need re-checking:

- **Andy** is Head of Growth at Freckle, which positions itself as a CLI-first Clay
  competitor. He posted a RevGenius intro referencing git repos and skill files, which
  is why the early access landed here
- Freckle is a B2B data enrichment platform, founded by Nathan Merzvinskis, funded by
  Gradient and 1984 Ventures. Raised a $1.9M pre-seed in 2024 and a seed in 2025
- Their public positioning is enrichment for non-technical users via AI agents across
  50+ data providers. The CLI is the newer, builder-facing surface

Voice constraint that applies here: Clay is the thing Shawn positions against, not a tool
he uses. Freckle is a partner giving early access. Keep the comparison at category level
and don't turn the pack into a competitive takedown.

## Do not

- Do not invent commands, flags, metrics, match rates, or hours consumed
- Do not guess what GEO means in this context. It changes the entire third of the pack
- Do not write the pack from the brief alone. The brief describes the workflows, it
  doesn't contain them
- Do not publish person-level de-masking claims without checking what the tool actually
  returns and what's defensible

## Notes for Shawn

The remote session couldn't reach any of this. `freckle` and `convex` return zero hits
across both repos, so the runs, the CLI history, and the packs all live only on the Mac
Mini. A first pass written from the brief was pushed and then removed on this branch,
recoverable at commit `bc23690` if any framing is worth salvaging. Treat it as
speculative, because it was.

Fastest unblock if you'd rather not run Phase 1 as a session: paste the terminal history
for the three runs plus whatever the Notion view shows, and the pack can be built from
that directly.
