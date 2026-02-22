# Context Handoff
> Generated: 2026-02-22 | Machine: MacBook | Session: Scoring V4 Engine Build

## What Was Done This Session

### Scoring Engine V4 — BUILT & TESTED
Rewrote `scripts/daily_scan.py` from file-based scoring (V3) to **commit-based scoring (V4)**.

Changes to `daily_scan.py`:
- Added `classify_commit(hash)` — reads commit message, numstat, files to classify each commit into a type (system_engine, video_build, feature_build, etc.)
- Added `score_commits(commits)` — sums commit scores, applies V4 grade thresholds
- Added `compute_dev_equivalent(git_summary)` — dev-days + cost estimate + human-readable explainer
- Added `compute_token_efficiency(...)` — tokens/point, tokens/commit, tokens/LOC, context utilization
- Added `"max"` to TOKEN_PRICING (all zeros — Max subscription = $0 actual)
- New JSON sections: `commits[]`, `dev_equivalent{}`, `cost{}`, `token_efficiency{}`
- `accomplishments[]` kept for backward compat (still file-level)
- Version bumped to 4

### V4 Grade Thresholds (raised bar)
```
S+  500+    Historic day
S   300-499  Monster day
A+  150-299  Strong day
A    75-149  Solid day
B    30-74   Light day
C    10-29   Maintenance
D     0-9    Rest day
```

### Test Results
- Feb 21: V3 scored 486 → V4 scores **641 (S+)** — 3 system_engine commits (SQLite phases) drove the score
- Feb 22: 31 pts (B) with 2 commits so far today

## Current State
- **Git**: main, uncommitted changes in `scripts/daily_scan.py` + `data/daily-log/` (rescored)
- **daily_scan.py**: V4 engine complete, tested, ready to commit
- **Daily logs**: Feb 21 and Feb 22 rescored with V4. All other dates still V3.
- **Website components**: NOT updated yet — still render V3 schema (accomplishments panel, old pipeline view)
- **Progression engine**: NOT changed — still reads `stats.output_score` from daily logs (will get V4 scores after backfill)

## WHAT'S NEXT — Approved Scope for Next Session

### Phase 1: Visual Redesign (DailyLogView.tsx)
The daily log detail page needs to reflect V4 data. Current issues:

1. **Left panel ("Accomplishments")** → Should become **"Commits"** showing the classified commits with type tags, scores, and file counts. The file-level accomplishment list is noise.

2. **Middle panel ("Next Up" / Pipeline)** → Shows **62 drafts going back to Feb 9**. This is useless. Options:
   - Only show drafts from the last 3 days or drafts with today's target_date
   - Or replace entirely with something more useful (recent commits across the week? upcoming due dates?)
   - User wants this refined — ask for preference before building

3. **Right panel ("Analytics")** → Add V4 fields:
   - Dev equivalent explainer (from `dev_equivalent.explanation`)
   - Cost: show "$0.00 actual (Max sub)" vs "$X API equivalent"
   - Token efficiency metrics (tokens/point, tokens/commit, context utilization)
   - Remove old V2 fields (roi_multiplier, cost_savings) that are no longer computed

4. **Summary line** at bottom → Update to show actual vs API equivalent cost

5. **Score breakdown** → Currently shows file-level. Should show commit-level (type + message + points)

### Phase 2: TypeScript Types Update (logs.ts)
Add new interfaces to `website/packages/shared/lib/logs.ts`:
```typescript
interface Commit {
  hash: string
  message: string
  type: string
  score: number
  files_changed: number
  lines_added: number
  lines_removed: number
  lines_net: number
  directories: string[]
  timestamp: string
}

interface DevEquivalent {
  net_lines: number
  dev_days: number
  cost_estimate: number
  explanation: string
  assumptions: { lines_per_day: number; cost_per_day: number; basis: string }
}

interface CostSection {
  api_equivalent: number
  actual_cost: number
  pricing_mode: string
}

interface TokenEfficiency {
  total_tokens: number
  total_sessions: number
  tokens_per_point: number | null
  tokens_per_commit: number | null
  tokens_per_loc: number | null
  avg_context_utilization: number
  pricing_mode: string
  api_equivalent_cost: number
  actual_cost: number
}
```

Update `DailyLog` interface to include `commits`, `dev_equivalent`, `cost`, `token_efficiency`.
Update `scrubLog()` to pass through new fields (commits need path sanitization via message field).

### Phase 3: Backfill All Daily Logs
Run `python3 scripts/daily_scan.py --date YYYY-MM-DD` for every existing daily log date. This will:
- Add commits array to each log
- Rescore with V4 commit-based weights
- Add dev_equivalent, cost, token_efficiency sections
- Output scores will change → progression engine XP totals will shift

### Phase 4: Progression Engine Adjustment
After backfill, total XP across all days will be different. The progression engine reads `stats.output_score` from each daily log. If V4 scores are generally higher (as Feb 21 shows: 486 → 641), total XP goes up, which may push past title thresholds faster. May need to:
- Adjust XP thresholds in TITLE_TABLE
- Or accept the recalibration (the higher scores are more honest)
- User wants to evaluate this AFTER seeing the visual + backfill, not preemptively

## Key Files
1. `scripts/daily_scan.py` — V4 engine (the work from this session)
2. `website/packages/shared/lib/logs.ts` — TypeScript types (needs V4 update)
3. `website/packages/shared/components/DailyLogView.tsx` — Main visual (needs redesign)
4. `website/packages/shared/components/LogCard.tsx` — Index card (may need commit count)
5. `scripts/progression_engine.py` — RPG system (Phase 4, don't touch until approved)

## Key Context
- User is NOT a coder — explain things in plain English
- User is on Claude Code Max subscription — $0 actual cost
- Dev equivalent explainer is STRATEGIC for demos and content
- Path sanitization via `.claude/blocklist.txt` must apply to all output including commit messages
- The scoring weights are starting points — user wants to iterate
- Don't change progression engine until Phases 1-3 are complete and approved
