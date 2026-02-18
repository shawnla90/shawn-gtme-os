# Progression Engine v2 — Spec

> v2 runs parallel to v1. Separate script, separate profile, separate website page.
> Do NOT modify any v1 files (progression_engine.py, profile.json, daily_scan.py).

## Overview

An upgraded RPG progression engine for AI-agent-enabled workflows. Designed to be
packageable for other builders running AI agents alongside their own work.

The killer differentiator: **agent attribution**. Track who shipped what — human,
Cursor, Claude Code, Nio (OpenClaw), sub-agents — and score accordingly.

## File Structure

```
scripts/
  v2/
    SPEC.md                      ← this file
    progression_engine_v2.py     ← the engine
    progression_config.yaml      ← externalized config (weights, thresholds, titles, classes)
    README.md                    ← usage docs

data/
  progression/
    profile_v2.json              ← v2 output (parallel to profile.json)

website/
  apps/gtmos/app/progression-v2/
    page.tsx                     ← comparison page (v1 vs v2 side by side)
```

## Config File: `progression_config.yaml`

All scoring rules externalized. Users customize without touching Python.

```yaml
# ── Score Weights ──────────────────────────────────────────
score_weights:
  monorepo_build: 50
  system_engine: 50
  feature_system: 30
  feature_script: 30
  complex_script: 25
  landing_page: 25
  code_infra: 15
  final: 10
  partner_onboard: 8
  partner_prompt: 5
  partner_research: 5
  partner_workflow: 5
  partner_resource: 2
  client_onboard: 8
  client_prompt: 5
  client_research: 5
  client_workflow: 5
  client_resource: 2
  website_page: 5
  website_component: 5
  website_lib: 3
  website_route: 3
  website_style: 2
  website_config: 1
  cursor_rule: 3
  skill_updated: 5
  workflow_updated: 5
  lead_magnet: 5
  draft: 2
  script: 2

# ── LOC Multipliers ───────────────────────────────────────
# Applied to code-producing accomplishments based on lines added.
# Multiplier = base_score * loc_multiplier
loc_multipliers:
  - min_lines: 0
    max_lines: 50
    multiplier: 1.0
  - min_lines: 51
    max_lines: 150
    multiplier: 1.5
  - min_lines: 151
    max_lines: 400
    multiplier: 2.0
  - min_lines: 401
    max_lines: 999999
    multiplier: 3.0

# Types that get LOC multipliers applied
loc_eligible_types:
  - website_page
  - website_component
  - website_lib
  - website_route
  - feature_system
  - landing_page
  - code_infra
  - script
  - feature_script
  - complex_script
  - system_engine

# ── Grade Thresholds ──────────────────────────────────────
grades:
  - min_score: 500
    grade: "S+"
  - min_score: 350
    grade: "S"
  - min_score: 150
    grade: "A+"
  - min_score: 50
    grade: "A"
  - min_score: 15
    grade: "B"
  - min_score: 5
    grade: "C"
  - min_score: 0
    grade: "D"

# ── Streak System ─────────────────────────────────────────
streaks:
  # Minimum grade to count as an "active" day
  min_grade_for_streak: "B"
  # Multiplier per consecutive active day (stacks)
  multipliers:
    - days: 1
      multiplier: 1.0
    - days: 3
      multiplier: 1.1
    - days: 5
      multiplier: 1.2
    - days: 7
      multiplier: 1.3
    - days: 14
      multiplier: 1.5
    - days: 30
      multiplier: 2.0
  # Max multiplier cap
  max_multiplier: 2.0

# ── Decay / Rust ──────────────────────────────────────────
decay:
  enabled: true
  # Days of inactivity before rust kicks in
  grace_days: 2
  # Status effect name (displayed on profile)
  status_effect: "⚠️ rust"
  # Streak resets after this many inactive days
  streak_reset_days: 3

# ── Title Table ───────────────────────────────────────────
titles:
  - level: 1
    title: "Terminal Initiate"
    xp_required: 0
    avatar_tier: 1
  - level: 5
    title: "Prompt Apprentice"
    xp_required: 500
    avatar_tier: 1
  - level: 10
    title: "Repo Architect"
    xp_required: 2000
    avatar_tier: 2
  - level: 15
    title: "Pipeline Runner"
    xp_required: 5000
    avatar_tier: 2
  - level: 20
    title: "Context Weaver"
    xp_required: 10000
    avatar_tier: 3
  - level: 25
    title: "Skill Forger"
    xp_required: 18000
    avatar_tier: 3
  - level: 30
    title: "Voice Alchemist"
    xp_required: 30000
    avatar_tier: 4
  - level: 35
    title: "System Sovereign"
    xp_required: 50000
    avatar_tier: 4
  - level: 40
    title: "OS Architect"
    xp_required: 80000
    avatar_tier: 5
  - level: 45
    title: "Cursor Slayer"
    xp_required: 120000
    avatar_tier: 5
  - level: 50
    title: "Grand Master Cursor Slayer"
    xp_required: 200000
    avatar_tier: 6

# ── Class System ──────────────────────────────────────────
classes:
  # Rolling window for "current spec" (days)
  rolling_window_days: 14

  # Category mappings (type -> category)
  categories:
    builder:
      - website_page
      - website_component
      - website_lib
      - website_route
      - website_style
      - website_config
      - script
      - skill_updated
      - workflow_updated
      - cursor_rule
      - code_infra
      - feature_system
      - feature_script
      - complex_script
      - system_engine
      - monorepo_build
      - landing_page
    scribe:
      - linkedin_draft
      - linkedin_final
      - x_draft
      - x_final
      - substack_draft
      - substack_final
      - reddit_draft
      - reddit_final
      - lead_magnet
    strategist:
      - partner_onboard
      - partner_prompt
      - partner_research
      - partner_resource
      - partner_workflow
      - client_onboard
      - client_prompt
      - client_research
      - client_resource
      - client_workflow

  # Resolution rules
  resolution:
    dominant_threshold: 0.50    # single category >= 50% = that class
    alchemist_threshold: 0.30   # two categories >= 30% each = Alchemist
    polymath_threshold: 0.20    # all three >= 20% = Polymath

  # Class names
  names:
    builder: "Builder"
    scribe: "Scribe"
    strategist: "Strategist"
    alchemist: "Alchemist"
    polymath: "Polymath"

# ── Agent Attribution ─────────────────────────────────────
agents:
  # How to detect agent source from git commits and file metadata
  detection_rules:
    - agent: "nio"
      match_type: "commit_author"
      pattern: "nio|openclaw|Nio"
    - agent: "cursor"
      match_type: "commit_message"
      pattern: "^(feat|fix|refactor|chore)\\("
    - agent: "claude-code"
      match_type: "session_source"
      pattern: "claude-code"
    - agent: "manual"
      match_type: "default"

  # Per-agent score modifiers (1.0 = no change)
  # Optional: weight human work higher to incentivize hands-on building
  score_modifiers:
    manual: 1.0
    cursor: 1.0
    claude-code: 1.0
    nio: 1.0

# ── Quests ────────────────────────────────────────────────
quests:
  enabled: true
  # Daily quests (auto-rotate, pick 2-3 per day)
  daily:
    - id: "multi_platform"
      title: "Cross-Platform Ship"
      description: "Ship content on 2+ platforms today"
      condition: "platforms_shipped >= 2"
      bonus_xp: 20
    - id: "code_and_content"
      title: "Full Stack Day"
      description: "Ship both code and content today"
      condition: "has_code and has_content"
      bonus_xp: 25
    - id: "partner_touch"
      title: "Client Touch"
      description: "Ship a partner/client deliverable"
      condition: "has_partner_or_client"
      bonus_xp: 15
    - id: "big_ship"
      title: "Heavy Lift"
      description: "Score 100+ points in a single day"
      condition: "output_score >= 100"
      bonus_xp: 30
    - id: "efficiency_master"
      title: "Efficiency Master"
      description: "Achieve ROI multiplier > 100x"
      condition: "roi_multiplier > 100"
      bonus_xp: 20

  # Weekly quests (reset every Monday)
  weekly:
    - id: "streak_5"
      title: "Five Day March"
      description: "Log activity 5 days this week"
      condition: "active_days_this_week >= 5"
      bonus_xp: 50
    - id: "all_classes"
      title: "Renaissance Week"
      description: "Ship builder + scribe + strategist work this week"
      condition: "all_categories_active"
      bonus_xp: 75
    - id: "word_warrior"
      title: "Word Warrior"
      description: "Write 10,000+ words this week"
      condition: "weekly_words >= 10000"
      bonus_xp: 40
```

## Feature Details

### 1. Agent Attribution

Every accomplishment gets an `agent` field:

```json
{
  "type": "website_page",
  "title": "contentos home page",
  "agent": "nio",
  "agent_confidence": 0.9,
  "path": "website/apps/contentos/app/page.tsx"
}
```

Detection priority:
1. **Commit author** — if commit is from "nio" or "openclaw", tag as nio
2. **Commit message pattern** — conventional commits from Cursor have specific patterns
3. **Session source** — claude-code sessions detected from `~/.claude/projects/` JSONL
4. **OpenClaw session** — check if file was modified during an active OpenClaw session (timestamp overlap with session JSONL)
5. **Default** — manual (human)

Profile output includes per-agent stats:

```json
{
  "agent_stats": {
    "nio": { "items": 5, "xp_contributed": 120, "cost": 3.50 },
    "cursor": { "items": 12, "xp_contributed": 280, "cost": 0.00 },
    "claude-code": { "items": 3, "xp_contributed": 45, "cost": 8.20 },
    "manual": { "items": 2, "xp_contributed": 10, "cost": 0.00 }
  }
}
```

### 2. LOC-Weighted Scoring

For code-producing types, multiply base score by LOC bracket:

```
base_score = SCORE_WEIGHTS[type]
loc = lines_added for this file (from git numstat)
multiplier = lookup from loc_multipliers config
final_score = base_score * multiplier
```

This means a `website_page` (base 5 pts):
- 30 lines = 5 pts (1.0x)
- 100 lines = 7.5 pts (1.5x)  
- 250 lines = 10 pts (2.0x)
- 500 lines = 15 pts (3.0x)

### 3. Streak System

Track consecutive active days (grade >= B):

```python
streak_days = count_consecutive_active_days(logs)
multiplier = lookup_streak_multiplier(streak_days, config)
adjusted_score = raw_score * multiplier
```

Streak multiplier applies to the DAILY total, not per-item.
Display on profile: "🔥 7-day streak (1.3x)"

### 4. Decay / Rust

After `grace_days` of inactivity:
- Add status effect to profile: `"status_effects": ["⚠️ rust: 3 days idle"]`
- Streak resets after `streak_reset_days`
- No XP loss (that feels punishing)
- Rust clears immediately when you ship again

### 5. Rolling Window Class

Two class fields in profile:

```json
{
  "class": "Polymath",           // all-time
  "current_spec": "Builder",     // last 14 days
  "class_distribution": {
    "all_time": { "builder": 0.35, "scribe": 0.33, "strategist": 0.32 },
    "rolling": { "builder": 0.65, "scribe": 0.20, "strategist": 0.15 }
  }
}
```

### 6. Quest System

On each scan, evaluate active quests against the day's data:

```python
active_quests = pick_daily_quests(config, date)  # 2-3 per day, deterministic from date hash
completed = evaluate_quests(active_quests, daily_data)
bonus_xp = sum(q.bonus_xp for q in completed)
```

Quests appear in profile:

```json
{
  "quests": {
    "daily": [
      { "id": "code_and_content", "title": "Full Stack Day", "status": "completed", "bonus_xp": 25 },
      { "id": "big_ship", "title": "Heavy Lift", "status": "active", "bonus_xp": 30 }
    ],
    "weekly": [
      { "id": "streak_5", "title": "Five Day March", "progress": "3/5", "status": "active" }
    ]
  }
}
```

### 7. Profile v2 Output

Full `profile_v2.json` schema:

```json
{
  "version": 2,
  "name": "Operator",
  "title": "Repo Architect",
  "level": 12,
  "xp_total": 3500,
  "xp_today": 120,
  "xp_next_level": 5000,
  "class": "Polymath",
  "current_spec": "Builder",
  "class_distribution": {
    "all_time": {},
    "rolling_14d": {}
  },
  "avatar_tier": 2,
  "streak": {
    "current": 7,
    "best": 7,
    "multiplier": 1.3,
    "last_active_date": "2026-02-17"
  },
  "status_effects": [],
  "agent_stats": {},
  "quests": {
    "daily": [],
    "weekly": []
  },
  "milestones": [],
  "updated_at": "2026-02-18T00:00:00Z"
}
```

## Implementation Notes

- Read daily logs from `data/daily-log/*.json` (same source as v1)
- Read config from `scripts/v2/progression_config.yaml`
- Write output to `data/progression/profile_v2.json`
- Import `PyYAML` for config parsing (`pip install pyyaml`)
- Can run alongside v1 in the cron: add as step 1d
- LOC per file: use `git log --numstat` (already available in daily_scan.py output under `git_summary`)
- Agent detection needs access to git log (commit authors/messages) and OpenClaw session JSONL

## Website Comparison Page

Build `website/apps/gtmos/app/progression-v2/page.tsx`:
- Side-by-side: v1 profile vs v2 profile
- Highlight differences: streak bonus, LOC multipliers, agent attribution
- Show quest progress
- Toggle to switch which version feeds the main dashboard
- Use same terminal/monospace aesthetic as existing pages

## Testing

```bash
# Run v2 alongside v1
python3 scripts/v2/progression_engine_v2.py --dry-run

# Compare outputs
diff <(python3 -c "import json; print(json.dumps(json.load(open('data/progression/profile.json')), indent=2))") \
     <(python3 -c "import json; print(json.dumps(json.load(open('data/progression/profile_v2.json')), indent=2))")
```

## Migration Path

Once v2 is validated:
1. Swap cron to run v2 instead of v1
2. Update website components to read `profile_v2.json`
3. Keep v1 script as fallback
4. Eventually deprecate v1
