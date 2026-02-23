# Context Handoff
> Generated: 2026-02-22 | Machine: MacBook | Session: V4 scoring simplification — remove multiplier, new grade thresholds

## What Was Done This Session

- **V4 Progression Migration** (commit `2048fc9`): Removed all V3/V2 grade overrides and scoring panels across ShawnOS + Mission Control. Deleted `profile-v2.json` and `profile-v3.json`. Synced TITLE_TABLE between Python and TypeScript. Cleaned V2/V3 barrel exports from `shared/lib/index.ts`.
- **Streak Multiplier** (commit `fefa4d6`): Added streak multiplier to progression engine (+0.1x/day, capped 2.0x). Added `ScoringLogEntry`, `current_streak`, `streak_multiplier`, `scoring_log` to `RPGProfile`. Updated all UI components. **THIS FEATURE NEEDS TO BE ROLLED BACK** — see Next Steps.
- **User approved new scoring design** (NOT yet implemented):
  - **Remove multiplier entirely** — XP = raw `output_score`, no streak mechanics
  - **New grade thresholds**: S+ >= 700, S >= 600, A+ >= 500, A >= 400, B >= 300, C >= 200, D < 200

## Current State
- **Git**: branch `main`, last commit `fefa4d6` (streak multiplier — needs reversal)
- **Uncommitted changes**: only sitemap XMLs (build artifacts)
- **Blocked on**: nothing — user approved the new scoring, just needs implementation

## Next Steps

1. **Update Python engine** (`scripts/progression_engine.py`):
   - Replace `compute_xp_with_streak()` with simple XP sum (XP = sum of output_score, no multiplier)
   - Update grade thresholds: `S+: 700, S: 600, A+: 500, A: 400, B: 300, C: 200, D: 0`
   - Remove `current_streak`, `streak_multiplier` from profile output
   - Keep `scoring_log` in profile (date, output_score, letter_grade, commits, xp) but drop streak/multiplier columns
   - Re-run engine to regenerate `profile.json`

2. **Update TypeScript types** (`website/packages/shared/lib/rpg.ts`):
   - Remove `current_streak`, `streak_multiplier` from `RPGProfile`
   - Remove `streak`, `multiplier` from `ScoringLogEntry`
   - Update grade thresholds if displayed anywhere

3. **Update UI — remove streak from all components** (parallelizable):
   - `website/apps/shawnos/app/log/progression/ProgressionClient.tsx` — remove StreakViz section, remove streak/mult columns from grade table (back to 4 cols: Date, Score, Grade, Commits), remove streak/mult from ProfileHero
   - `website/apps/mission-control/app/components/ProgressionChainViz.tsx` — remove or delete (was StreakViz)
   - `website/apps/mission-control/app/components/ProgressionGradeTable.tsx` — remove streak/mult columns
   - `website/apps/mission-control/app/components/ProgressionXPGraph.tsx` — use `entry.output_score` as XP (they're the same now)
   - `website/apps/mission-control/app/progression/page.tsx` — remove StreakViz import/usage
   - `website/packages/shared/lib/rpg.server.ts` — remove `current_streak`, `streak_multiplier` from loader
   - `website/packages/shared/lib/rpg-v2.server.ts` + `rpg-v3.server.ts` — same
   - `website/apps/shawnos/app/rpg-preview/ClassShowcaseGrid.tsx` — remove from mock
   - `website/apps/shawnos/app/rpg-preview/TierProgressionGrid.tsx` — remove from mock

4. **Update daily log grading** — the daily log scanner also writes `letter_grade` into each log JSON. Ensure it uses the new thresholds (S+ >= 700, S >= 600, etc.). Check `scripts/daily_scan.py` scoring logic.

5. **Rescan all logs** — after updating thresholds in `daily_scan.py`, run rescan to update all 12 log files with correct grades.

6. **Build all 3 sites**, verify, commit, push.

## Key Decisions Made
- **No multiplier/streak** — user decided it creates confusing XP inflation. XP = raw daily score, clean and simple.
- **Grade thresholds are 100-point intervals**: D < 200, C >= 200, B >= 300, A >= 400, A+ >= 500, S >= 600, S+ >= 700.
- **Profile still includes `scoring_log`** array — just without streak/multiplier per entry.
- **V2/V3 `.ts` files kept** but removed from barrel exports — `vitals/v2-lab` still imports V2 directly.

## Files to Read First
1. `scripts/progression_engine.py` — `compute_xp_with_streak()` (line ~274) needs to become a simple sum
2. `scripts/daily_scan.py` — grade thresholds for daily log scanning
3. `website/packages/shared/lib/rpg.ts` — `RPGProfile` and `ScoringLogEntry` types to simplify
4. `website/apps/shawnos/app/log/progression/ProgressionClient.tsx` — main progression UI to strip streak
5. `website/apps/mission-control/app/progression/page.tsx` — mission control progression page
