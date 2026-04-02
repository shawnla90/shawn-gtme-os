## Environment

This project runs on multiple machines. Always confirm which machine you're running on before performing git operations, deployments, or repo cloning. Known machines: Mac Mini (main), MacBook Neo (thin client). Neo does NOT have node installed.

## Session Startup

1. Read `.claude/context-handoff.md` for previous session state.
2. Read `tasks/lessons.md` for self-improvement rules — follow every one.
3. Run `git status` and `git log -1 --oneline` to know where you are.
4. If working on a partner/client: read their `clients/partner/<name>/SKILL.md` or `clients/client/<name>/SKILL.md` first.

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions) before writing a single line of code.
- If something goes sideways mid-execution, STOP and re-plan immediately — don't keep pushing.
- Use plan mode for verification steps, not just building.
- Write detailed specs upfront to reduce ambiguity.
- Plans should be fast and actionable — plan to build, not plan instead of building.
- The human can override this default. Recursive Drift state transitions are human-driven — if told to skip planning and just build, do it.

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, throw more compute at it via subagents.
- One task per subagent for focused execution.
- Before spawning a team or 2+ subagents, consult `.claude/skills/agent-routing/SKILL.md`.

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the date, context, and lesson.
- Write rules for yourself that prevent the same mistake from recurring.
- Ruthlessly iterate on these lessons until mistake rate drops.
- Review `tasks/lessons.md` at session start (Step 2 above).

### 4. Verification Before Done
- Never mark a task complete without proving it works.
- Diff behavior between main and your changes when relevant.
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness.
- For deploys: follow Build Gate (Rule 5 in `.claude/teams/TEAM-CONSTRAINTS.md`) — clean build + pre-push scan + sign-off.

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution."
- Skip this for simple, obvious fixes — don't over-engineer.
- Challenge your own work before presenting it.

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests — then resolve them.
- Zero context switching required from the user.
- Go fix failing CI tests without being told how.

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items before starting.
2. **Verify Plan**: Check in before starting implementation.
3. **Track Progress**: Mark items complete as you go.
4. **Explain Changes**: High-level summary at each step.
5. **Document Results**: Add review section to `tasks/todo.md`.
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections.

## Core Principles

- **GET SHIT DONE**: Plan fast, build fast, ship working code every session. Don't over-explore. Don't spend sessions just reading code. If something takes more than 2-3 minutes to plan, show an outline and ask before deep-diving.
- **Simplicity First**: Make every change as simple as possible. Minimal code impact.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Voice & Content Rules

All content creation MUST load the voice system first:
1. `skills/tier-1-voice-dna/core-voice.md` — Foundation voice
2. `skills/tier-1-voice-dna/anti-slop.md` — 29 anti-patterns (3+ flags = rewrite, not patch)
3. Platform-specific playbook from `skills/tier-2-context-playbooks/` when applicable
4. `skills/tier-3-content-ops/improvement-protocol.md` — Sequential gates: Slop → Specificity → Depth → Performance → Safety → Voice

Substance requirement: every substantive claim needs at least 2 of 5 — specific example, technical implementation, reasoning shown, consequences/results, or gotchas/lessons learned.

## Content & Tone

When generating LinkedIn comments or social media copy, keep it short, authentic, and conversational. Avoid verbose, generic, or 'NPC-style' language. Default to 1-3 sentences max unless asked otherwise.

## Workflow Conventions

When copying content to clipboard, confirm with the user which specific file/piece they want. Don't assume.

## Technical Preferences

For visual/design work (carousels, SVGs, images), prefer SVG-based or MCP-based approaches over Pillow/PIL. Pillow output quality has been rejected previously.

## Safety

- Pre-push blocklist scan enforced via Husky hook (`.husky/pre-push`). Never bypass with `--no-verify`.
- Never commit `.env`, `clients/`, `data/*.csv`, or partner-identifiable data.
- Pattern vs. person test: critique architectures and approaches, never specific clients or named individuals.
- Respect ecosystem protection rules in `skills/tier-1-voice-dna/safety-filters.md`.

## GTM Operations

The full GTM/ABM operation lives in `gtm-os/`. Self-contained folder with its own CLAUDE.md, tool docs, demand intelligence, campaign tracking, and symlinks to production scripts.

- **Entry point:** `gtm-os/CLAUDE.md` - tool inventory, data flow, workflow rules
- **Engine docs:** `gtm-os/engine/` - one file per tool (Attio, Apollo, Exa, Supabase, etc.)
- **Scripts:** `gtm-os/scripts/` symlinks to `scripts/abm/` (production pipeline stays put)
- **Partners:** `gtm-os/partners/` symlinks to `clients/partner/`
- **Demo skeleton:** `gtm-os/.claude/reference/gtm-os-skeleton/` - stripped version for clients

## Key References (Don't Duplicate — Read These)

| Doc | Purpose |
|---|---|
| `.claude/teams/TEAM-CONSTRAINTS.md` | 9 rules for agent team coordination |
| `.claude/skills/agent-routing/SKILL.md` | When to use teams vs. subagents vs. solo |
| `.claude/skills/context-handoff/SKILL.md` | Session handoff protocol |
| `skills/tier-1-voice-dna/method.md` | Recursive Drift methodology |
| `docs/ARCHITECTURE.md` | System architecture, machine topology, cron pipeline |
| `docs/MACHINE-SETUP.md` | Machine setup (single Mac Mini) |
| `gtm-os/CLAUDE.md` | GTM operations - tool inventory, data flow, rules |

## Machine Context

- **Mac Mini** (`shawnos.ai`): Single machine - dev + always-on server. Runs nightly cron (daily_cron.sh at midnight), sync_main.sh at 23:58, ABM pipeline at 22:00, agent crons.
- Repo path: `/Users/shawnos.ai/shawn-gtme-os`
- When writing launchd plists or scripts, use dynamic path resolution (see `docs/MACHINE-SETUP.md`).
