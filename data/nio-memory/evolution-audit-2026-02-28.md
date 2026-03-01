# Nio Evolution System Audit
> 2026-02-28 | Deep audit of XP, tiers, soul files, and what's wired vs spec

## Current State

- **XP:** 1,410
- **Tier:** 2 (Blade)
- **Level:** 7
- **Streak:** 2 days
- **Skills:** ops 1,048 | writing 296 | architecture 66

## Tier Map

| Tier | Name | XP Required | Status |
|------|------|-------------|--------|
| 1 | Spark | 0 | Completed |
| 2 | Blade | 500 | Current (1,410 / 2,000) |
| 3 | Warden | 2,000 | 590 XP away |
| 4 | Sentinel | 6,000 | Locked |
| 5 | Ascended | 15,000 | Locked |

## Two Parallel Systems (Problem)

**System A: Nio-Chat (Real-time, Server-authoritative)**
- SQLite DB at `website/apps/nio-chat/niobot.db`
- 5 tiers, 10 levels per tier, 50 total levels
- XP from chat interactions (messages, responses, agent switches, daily bonuses)
- Streak multipliers (1.0x to 2.0x at 30+ days)
- Skill XP per agent (ops, architecture, writing)
- Full UI: XP ring, floats, level-up notifications, evolution panel

**System B: Mission Control (Legacy, File-based)**
- JSON at `data/progression/profile.json`
- 50 title levels, 6 avatar tiers
- RPG classes (Builder, Scribe, Strategist, Alchemist, Polymath)
- Daily grades A through S+
- Separate XP thresholds, separate avatar system

These two systems are NOT synced. They run independently.

## XP Mechanics (Nio-Chat)

| Action | Base XP |
|--------|---------|
| Message sent | 5 |
| Response received | 10 |
| Daily first message | 25 |
| Deep conversation (5+ turns) | 25 |
| Very deep conversation (10+ turns) | 50 |
| Agent switch | 10 |

Streak multipliers stack on top:
- 3+ days: 1.25x
- 7+ days: 1.5x
- 14+ days: 1.75x
- 30+ days: 2.0x

## What's Wired (Actually Works)

- XP award on messages/responses/agent switches
- Streak tracking with multipliers
- Skill XP per agent (ops, architecture, writing)
- Daily bonus (server-validated, once per day)
- Deep conversation detection
- UI: real-time XP floats, level-up notifications, evolution panel
- Avatar images for all 5 tiers
- Mission Control progression page (separate system)

## What's Spec Only (NOT Wired)

- **Personality behavior changes per tier.** Tier files exist (tier-1 through tier-5 with detailed behavior rules) but NO code reads these or changes Nio's behavior based on current tier. This is the biggest gap. Tier 2 Blade says "kid gloves off, direct, dry humor, shorter responses" but nothing enforces it.
- **Soul trait system.** personality_flags stored in DB but never read or applied.
- **Skill-based ability unlocks.** Skill XP is tracked but no unlock mechanics exist.
- **Avatar evolution ceremony.** No visual celebration when tier unlocks in nio-chat.

## Key Files

| File | What |
|------|------|
| `website/apps/nio-chat/lib/evolution.ts` | XP math, tier/level calc, constants |
| `website/apps/nio-chat/lib/db/queries/dna.ts` | Server-side XP award logic |
| `website/apps/nio-chat/app/components/EvolutionProvider.tsx` | Client state + server sync |
| `website/apps/nio-chat/app/components/useEvolutionXP.ts` | Chat observer, triggers XP |
| `website/apps/nio-chat/souls/evolution/tier-{1-5}-*.md` | Personality per tier |
| `website/apps/nio-chat/public/avatars/` | Avatar GIFs per tier |
| `data/progression/profile.json` | Legacy Mission Control profile |

## Recommendations

1. **Wire tier personality into Nio's system prompt.** The tier files already define behavior. Just need code that reads current tier and injects the right soul fragment into the prompt.
2. **Unify or deprecate one progression system.** Two parallel XP systems creates confusion. Nio-chat's is better designed. Mission Control could read from the same DB.
3. **Mobile status check.** Build a CLI command that queries dna_state and prints a formatted card. See `scripts/nio-status.sh`.
