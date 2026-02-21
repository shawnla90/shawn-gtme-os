#!/usr/bin/env python3
"""
RPG Progression Engine v2 for the GTM OS.

Runs alongside v1 (does NOT replace it). Key differences:
  - Recalibrated grade thresholds (harder S/S+ grades)
  - Ascending chain multiplier (beat yesterday's score → growing mult)
  - Efficiency bonus (pts per dollar)
  - Commit velocity bonus
  - Ship rate bonus
  - 7-day rolling window for class determination
  - New milestones
  - Full scoring log in v2_meta

Usage:
    python3 scripts/progression_engine_v2.py              # normal run
    python3 scripts/progression_engine_v2.py --dry-run    # preview without writing
    python3 scripts/progression_engine_v2.py -v           # verbose debug output
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ══════════════════════════════════════════════════════════════════════
#  Paths — all relative to the repo root
# ══════════════════════════════════════════════════════════════════════

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
DAILY_LOG_DIR = DATA_DIR / "daily-log"
PROGRESSION_DIR = DATA_DIR / "progression"
PROFILE_V1_PATH = PROGRESSION_DIR / "profile.json"
PROFILE_V2_PATH = PROGRESSION_DIR / "profile-v2.json"

# ══════════════════════════════════════════════════════════════════════
#  Title Table — mirrors v1 exactly (shared with rpg.ts)
# ══════════════════════════════════════════════════════════════════════

TITLE_TABLE: List[Dict[str, Any]] = [
    {"level": 1,  "title": "Terminal Initiate",          "xp_required": 0,      "avatar_tier": 1},
    {"level": 5,  "title": "Prompt Apprentice",          "xp_required": 500,    "avatar_tier": 1},
    {"level": 10, "title": "Repo Architect",             "xp_required": 2000,   "avatar_tier": 2},
    {"level": 15, "title": "Pipeline Runner",            "xp_required": 5000,   "avatar_tier": 2},
    {"level": 20, "title": "Context Weaver",             "xp_required": 10000,  "avatar_tier": 3},
    {"level": 25, "title": "Skill Forger",               "xp_required": 18000,  "avatar_tier": 3},
    {"level": 30, "title": "Voice Alchemist",            "xp_required": 30000,  "avatar_tier": 4},
    {"level": 35, "title": "System Sovereign",           "xp_required": 50000,  "avatar_tier": 4},
    {"level": 40, "title": "OS Architect",               "xp_required": 80000,  "avatar_tier": 5},
    {"level": 45, "title": "Cursor Slayer",              "xp_required": 120000, "avatar_tier": 5},
    {"level": 50, "title": "Grand Master Cursor Slayer", "xp_required": 200000, "avatar_tier": 6},
]

# ══════════════════════════════════════════════════════════════════════
#  v2 Grade Thresholds (recalibrated — harder)
# ══════════════════════════════════════════════════════════════════════

GRADE_THRESHOLDS_V2: List[Tuple[int, str]] = [
    (850, "S+"),
    (600, "S"),
    (450, "A+"),
    (300, "A"),
    (150, "B"),
    (50,  "C"),
    (0,   "D"),
]


def grade_for_score_v2(score: int) -> str:
    """Return the v2 letter grade for a given raw score."""
    for threshold, grade in GRADE_THRESHOLDS_V2:
        if score >= threshold:
            return grade
    return "D"


# ══════════════════════════════════════════════════════════════════════
#  RPG Class Definitions (same categories as v1)
# ══════════════════════════════════════════════════════════════════════

CLASS_CATEGORIES: Dict[str, str] = {
    "website_page":      "builder",
    "website_component": "builder",
    "website_lib":       "builder",
    "website_route":     "builder",
    "website_style":     "builder",
    "website_config":    "builder",
    "script":            "builder",
    "skill_updated":     "builder",
    "workflow_updated":  "builder",
    "cursor_rule":       "builder",
    "linkedin_draft":    "scribe",
    "linkedin_final":    "scribe",
    "x_draft":           "scribe",
    "x_final":           "scribe",
    "substack_draft":    "scribe",
    "substack_final":    "scribe",
    "reddit_draft":      "scribe",
    "reddit_final":      "scribe",
    "lead_magnet":       "scribe",
    "partner_onboard":   "strategist",
    "partner_prompt":    "strategist",
    "partner_research":  "strategist",
    "partner_resource":  "strategist",
    "partner_workflow":  "strategist",
    "client_onboard":    "strategist",
    "client_prompt":     "strategist",
    "client_research":   "strategist",
    "client_resource":   "strategist",
    "client_workflow":   "strategist",
}

RPG_CLASSES = {
    "builder":    "Builder",
    "scribe":     "Scribe",
    "strategist": "Strategist",
    "alchemist":  "Alchemist",
    "polymath":   "Polymath",
}


# ══════════════════════════════════════════════════════════════════════
#  Core Logic
# ══════════════════════════════════════════════════════════════════════

def load_daily_logs() -> List[Dict[str, Any]]:
    """Load all daily-log JSON files, sorted by date ascending."""
    logs: List[Dict[str, Any]] = []
    if not DAILY_LOG_DIR.exists():
        return logs
    for json_path in sorted(DAILY_LOG_DIR.glob("*.json")):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, dict) and "date" in data:
                logs.append(data)
        except (json.JSONDecodeError, OSError) as e:
            print(f"  warning: Skipping {json_path.name}: {e}")
    return logs


def compute_ascending_chain(logs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Compute the ascending chain multiplier for each day.

    Returns a list of per-day scoring records with chain/multiplier info.
    """
    scoring_log: List[Dict[str, Any]] = []
    prev_score: Optional[int] = None
    chain_length = 0

    for log in logs:
        stats = log.get("stats", {})
        raw_score = int(stats.get("output_score", 0))
        date = log.get("date", "")
        v1_grade = stats.get("letter_grade", "?")
        v2_grade = grade_for_score_v2(raw_score)

        # Ascending chain logic
        if prev_score is not None and raw_score > prev_score:
            chain_length += 1
        else:
            chain_length = 1

        # Multiplier: 1.0 base + 0.1 per chain step above 1, capped at 1.5
        chain_mult = min(1.0 + (chain_length - 1) * 0.1, 1.5)

        # Efficiency bonus
        efficiency = stats.get("efficiency_rating", 0)
        if not isinstance(efficiency, (int, float)):
            efficiency = 0
        agent_cost = stats.get("agent_cost", 0)
        if not isinstance(agent_cost, (int, float)):
            agent_cost = 0

        if agent_cost > 0 and efficiency > 100:
            efficiency_bonus = 0.15
        elif agent_cost > 0 and efficiency > 50:
            efficiency_bonus = 0.10
        elif agent_cost > 0 and efficiency > 25:
            efficiency_bonus = 0.05
        else:
            efficiency_bonus = 0.0

        # Commit velocity bonus
        git = log.get("git_summary", {})
        commits = git.get("commits_today", 0)
        if not isinstance(commits, (int, float)):
            commits = 0
        if commits >= 20:
            velocity_bonus = 0.10
        elif commits >= 10:
            velocity_bonus = 0.05
        else:
            velocity_bonus = 0.0

        # Ship rate bonus
        ship_rate = stats.get("ship_rate", 0)
        if not isinstance(ship_rate, (int, float)):
            ship_rate = 0
        if ship_rate >= 1.0:
            ship_bonus = 0.10
        elif ship_rate >= 0.8:
            ship_bonus = 0.05
        else:
            ship_bonus = 0.0

        # Total multiplier (chain * (1 + sum of bonuses))
        bonus_sum = efficiency_bonus + velocity_bonus + ship_bonus
        total_mult = chain_mult + bonus_sum
        v2_xp = int(raw_score * total_mult)

        scoring_log.append({
            "date": date,
            "raw_score": raw_score,
            "v1_grade": v1_grade,
            "v2_grade": v2_grade,
            "chain_length": chain_length,
            "chain_mult": round(chain_mult, 2),
            "efficiency_bonus": round(efficiency_bonus, 2),
            "velocity_bonus": round(velocity_bonus, 2),
            "ship_bonus": round(ship_bonus, 2),
            "total_mult": round(total_mult, 2),
            "v2_xp": v2_xp,
        })

        prev_score = raw_score

    return scoring_log


def compute_total_xp_v2(scoring_log: List[Dict[str, Any]]) -> int:
    """Sum v2_xp from the scoring log."""
    return sum(entry["v2_xp"] for entry in scoring_log)


def compute_total_xp_v1(logs: List[Dict[str, Any]]) -> int:
    """Sum raw output_score (v1 style) for delta comparison."""
    total = 0
    for log in logs:
        stats = log.get("stats", {})
        score = stats.get("output_score", 0)
        if isinstance(score, (int, float)):
            total += int(score)
    return total


def resolve_title_and_tier(xp: int) -> Tuple[str, int, int]:
    """Given total XP, resolve (title, level, avatar_tier)."""
    current_entry = TITLE_TABLE[0]
    next_entry: Optional[Dict[str, Any]] = None

    for i, entry in enumerate(TITLE_TABLE):
        if xp >= entry["xp_required"]:
            current_entry = entry
            next_entry = TITLE_TABLE[i + 1] if i + 1 < len(TITLE_TABLE) else None
        else:
            next_entry = entry
            break

    title = current_entry["title"]
    avatar_tier = current_entry["avatar_tier"]
    base_level = current_entry["level"]

    if next_entry is not None:
        xp_range = next_entry["xp_required"] - current_entry["xp_required"]
        level_range = next_entry["level"] - current_entry["level"]
        xp_into_range = xp - current_entry["xp_required"]
        if xp_range > 0 and level_range > 0:
            fraction = xp_into_range / xp_range
            interpolated = base_level + int(fraction * level_range)
            level = max(base_level, min(interpolated, next_entry["level"] - 1))
        else:
            level = base_level
    else:
        level = base_level

    return title, level, avatar_tier


def compute_xp_next_level(xp: int) -> int:
    """Return XP threshold for the next title milestone."""
    for entry in TITLE_TABLE:
        if entry["xp_required"] > xp:
            return entry["xp_required"]
    return xp if xp > 0 else 1


def determine_class_v2(logs: List[Dict[str, Any]]) -> Tuple[str, Dict[str, float]]:
    """Determine RPG class from a 7-day rolling window.

    Returns (class_name, breakdown_dict).
    """
    # Use only the last 7 logs (days)
    window = logs[-7:] if len(logs) > 7 else logs

    category_scores: Dict[str, int] = {
        "builder": 0,
        "scribe": 0,
        "strategist": 0,
    }

    for log in window:
        accomplishments = log.get("accomplishments", [])
        for acc in accomplishments:
            acc_type = acc.get("type", "")
            score = acc.get("value_score", 0)
            if not isinstance(score, (int, float)):
                score = 0
            category = CLASS_CATEGORIES.get(acc_type)
            if category and category in category_scores:
                category_scores[category] += int(score)

    total = sum(category_scores.values())
    if total == 0:
        return RPG_CLASSES["builder"], {"builder": 1.0, "scribe": 0.0, "strategist": 0.0}

    fracs = {k: round(v / total, 2) for k, v in category_scores.items()}

    # Check for Polymath (all three >= 20%)
    if all(f >= 0.20 for f in fracs.values()):
        return RPG_CLASSES["polymath"], fracs

    # Check for Alchemist (two categories >= 30%)
    above_30 = sum(1 for f in fracs.values() if f >= 0.30)
    if above_30 >= 2:
        return RPG_CLASSES["alchemist"], fracs

    # Dominant category
    dominant = max(fracs, key=lambda k: fracs[k])
    return RPG_CLASSES[dominant], fracs


# ══════════════════════════════════════════════════════════════════════
#  v2 Milestones
# ══════════════════════════════════════════════════════════════════════

def detect_milestones_v2(
    daily_logs: List[Dict[str, Any]],
    scoring_log: List[Dict[str, Any]],
    total_xp: int,
) -> List[Dict[str, str]]:
    """Detect v2 milestone achievements."""
    milestones: List[Dict[str, str]] = []
    now_iso = datetime.now(timezone.utc).isoformat()

    # --- Carry forward v1-compatible milestones ---
    total_shipped = 0
    total_finals = 0
    total_words = 0
    total_commits = 0
    first_date = None

    for log in daily_logs:
        stats = log.get("stats", {})
        total_shipped += stats.get("shipped_count", 0)
        total_finals += stats.get("finals_count", 0)
        total_words += stats.get("words_today", 0)
        git = log.get("git_summary", {})
        total_commits += git.get("commits_today", 0)
        date = log.get("date", "")
        if date and (first_date is None or date < first_date):
            first_date = date

    if first_date:
        milestones.append({
            "id": "first_log",
            "title": "Boot Sequence",
            "description": "Recorded first daily log",
            "unlocked_at": f"{first_date}T00:00:00Z",
        })

    # XP milestones
    xp_thresholds = [
        (100,    "first_100xp",     "Spark Plug",       "Earned 100 XP"),
        (500,    "first_500xp",     "Warm Boot",        "Earned 500 XP"),
        (1000,   "first_1000xp",    "Kilobyte Club",    "Earned 1,000 XP"),
        (2000,   "first_2000xp",    "Repo Unlocked",    "Earned 2,000 XP"),
        (5000,   "first_5000xp",    "Pipeline Active",  "Earned 5,000 XP"),
        (10000,  "first_10000xp",   "Five Digits",      "Earned 10,000 XP"),
    ]
    for threshold, mid, title, desc in xp_thresholds:
        if total_xp >= threshold:
            milestones.append({
                "id": mid,
                "title": title,
                "description": desc,
                "unlocked_at": now_iso,
            })

    # Shipped milestones
    for thresh, mid, title, desc in [
        (10,  "shipped_10",  "Shipping Container", "Shipped 10+ items across all days"),
        (50,  "shipped_50",  "Cargo Fleet",        "Shipped 50+ items across all days"),
        (100, "shipped_100", "Assembly Line",       "Shipped 100+ items across all days"),
    ]:
        if total_shipped >= thresh:
            milestones.append({"id": mid, "title": title, "description": desc, "unlocked_at": now_iso})

    # Streak milestones
    total_days = len(daily_logs)
    if total_days >= 3:
        milestones.append({
            "id": "streak_3", "title": "Three-Day March",
            "description": "Logged activity for 3+ consecutive days", "unlocked_at": now_iso,
        })
    if total_days >= 7:
        milestones.append({
            "id": "streak_7", "title": "Week Warrior",
            "description": "Logged activity for 7+ days", "unlocked_at": now_iso,
        })

    # Word count milestones
    if total_words >= 50000:
        milestones.append({
            "id": "words_50k", "title": "Fifty Thousand Words",
            "description": "Wrote 50,000+ words across all days", "unlocked_at": now_iso,
        })
    if total_words >= 100000:
        milestones.append({
            "id": "words_100k", "title": "Novelist",
            "description": "Wrote 100,000+ words across all days", "unlocked_at": now_iso,
        })

    # --- v2-ONLY milestones ---

    # Ascending chain milestones
    max_chain = max((e["chain_length"] for e in scoring_log), default=0)
    if max_chain >= 3:
        milestones.append({
            "id": "ascending_3", "title": "Ascending Chain",
            "description": "3-day ascending score chain", "unlocked_at": now_iso,
        })
    if max_chain >= 5:
        milestones.append({
            "id": "ascending_5", "title": "Unstoppable",
            "description": "5-day ascending score chain", "unlocked_at": now_iso,
        })

    # Efficiency king
    for log in daily_logs:
        stats = log.get("stats", {})
        eff = stats.get("efficiency_rating", 0)
        cost = stats.get("agent_cost", 0)
        if isinstance(eff, (int, float)) and isinstance(cost, (int, float)):
            if cost > 0 and eff > 100:
                milestones.append({
                    "id": "efficiency_king", "title": "Efficiency King",
                    "description": "Day with >100 pts/$", "unlocked_at": now_iso,
                })
                break

    # Commit machine
    for log in daily_logs:
        git = log.get("git_summary", {})
        c = git.get("commits_today", 0)
        if isinstance(c, (int, float)) and c >= 25:
            milestones.append({
                "id": "commit_machine", "title": "Commit Machine",
                "description": "Day with 25+ commits", "unlocked_at": now_iso,
            })
            break

    # Renaissance Day (polymath day) — accomplishments in all 3 categories
    for log in daily_logs:
        day_cats: set = set()
        for acc in log.get("accomplishments", []):
            cat = CLASS_CATEGORIES.get(acc.get("type", ""))
            if cat:
                day_cats.add(cat)
        if len(day_cats) >= 3:
            milestones.append({
                "id": "polymath_day", "title": "Renaissance Day",
                "description": "Accomplishments in all 3 categories in one day",
                "unlocked_at": now_iso,
            })
            break

    # S+ day (with v2 thresholds — 850+)
    for entry in scoring_log:
        if entry["v2_grade"] == "S+":
            milestones.append({
                "id": "s_plus_day", "title": "Legendary",
                "description": "First S+ grade day (v2 thresholds)", "unlocked_at": now_iso,
            })
            break

    # S-grade days (v2 thresholds)
    v2_s_days = sum(1 for e in scoring_log if e["v2_grade"] in ("S", "S+"))
    if v2_s_days >= 1:
        milestones.append({
            "id": "first_s_grade_v2", "title": "S-Rank Day (v2)",
            "description": "Achieved S grade on a daily log (v2 thresholds)", "unlocked_at": now_iso,
        })

    return milestones


# ══════════════════════════════════════════════════════════════════════
#  Profile Builder
# ══════════════════════════════════════════════════════════════════════

def build_profile_v2(
    logs: List[Dict[str, Any]],
    verbose: bool = False,
) -> Dict[str, Any]:
    """Build the full RPGProfileV2 dict from daily log data."""
    scoring_log = compute_ascending_chain(logs)
    total_xp_v2 = compute_total_xp_v2(scoring_log)
    total_xp_v1 = compute_total_xp_v1(logs)

    title, level, avatar_tier = resolve_title_and_tier(total_xp_v2)
    xp_next = compute_xp_next_level(total_xp_v2)
    rpg_class, class_breakdown = determine_class_v2(logs)
    milestones = detect_milestones_v2(logs, scoring_log, total_xp_v2)

    # Current ascending chain (last entry)
    current_chain = scoring_log[-1]["chain_length"] if scoring_log else 0
    current_chain_mult = scoring_log[-1]["chain_mult"] if scoring_log else 1.0
    longest_chain = max((e["chain_length"] for e in scoring_log), default=0)

    profile: Dict[str, Any] = {
        "name": "Operator",
        "title": title,
        "level": level,
        "xp_total": total_xp_v2,
        "xp_next_level": xp_next,
        "class": rpg_class,
        "avatar_tier": avatar_tier,
        "milestones": milestones,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "v2_meta": {
            "engine_version": "2.0",
            "v1_xp_total": total_xp_v1,
            "xp_delta": total_xp_v2 - total_xp_v1,
            "current_ascending_chain": current_chain,
            "chain_multiplier": current_chain_mult,
            "longest_chain": longest_chain,
            "class_window": "7d",
            "class_breakdown": class_breakdown,
            "grade_thresholds": {g: t for t, g in GRADE_THRESHOLDS_V2},
            "scoring_log": scoring_log,
        },
    }

    if verbose:
        print(f"\n  -- v2 Profile Summary ----------------------------------------")
        print(f"  XP Total (v2):  {total_xp_v2:,}")
        print(f"  XP Total (v1):  {total_xp_v1:,}")
        print(f"  XP Delta:       {total_xp_v2 - total_xp_v1:+,}")
        print(f"  Level:          {level}")
        print(f"  Title:          {title}")
        print(f"  Avatar Tier:    {avatar_tier}")
        print(f"  Class:          {rpg_class} (7d window)")
        print(f"  Class Split:    {class_breakdown}")
        print(f"  Next Title:     {xp_next:,} XP")
        print(f"  Milestones:     {len(milestones)}")
        print(f"  Days Logged:    {len(logs)}")
        print(f"  Current Chain:  {current_chain} (mult {current_chain_mult}x)")
        print(f"  Longest Chain:  {longest_chain}")
        print(f"  ---------------------------------------------------------------")
        print(f"\n  Per-Day Scoring Log:")
        print(f"  {'Date':>12s}  {'Raw':>5s}  {'v1':>3s}  {'v2':>3s}  {'Chain':>5s}  {'Mult':>5s}  {'Eff':>5s}  {'Vel':>5s}  {'Ship':>5s}  {'Total':>5s}  {'XP':>6s}")
        print(f"  {'-'*12}  {'-'*5}  {'-'*3}  {'-'*3}  {'-'*5}  {'-'*5}  {'-'*5}  {'-'*5}  {'-'*5}  {'-'*5}  {'-'*6}")
        for e in scoring_log:
            print(
                f"  {e['date']:>12s}  {e['raw_score']:>5d}  {e['v1_grade']:>3s}  {e['v2_grade']:>3s}"
                f"  {e['chain_length']:>5d}  {e['chain_mult']:>5.2f}  {e['efficiency_bonus']:>5.2f}"
                f"  {e['velocity_bonus']:>5.2f}  {e['ship_bonus']:>5.2f}  {e['total_mult']:>5.2f}"
                f"  {e['v2_xp']:>6d}"
            )
        print()

    return profile


def write_profile_v2(profile: Dict[str, Any], dry_run: bool = False) -> Path:
    """Write profile-v2.json to the progression directory."""
    PROGRESSION_DIR.mkdir(parents=True, exist_ok=True)

    if dry_run:
        print(f"\n  [DRY RUN] Would write profile to {PROFILE_V2_PATH}")
        print(json.dumps(profile, indent=2))
        return PROFILE_V2_PATH

    with open(PROFILE_V2_PATH, "w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)
        f.write("\n")

    return PROFILE_V2_PATH


# ══════════════════════════════════════════════════════════════════════
#  CLI
# ══════════════════════════════════════════════════════════════════════

def main() -> None:
    parser = argparse.ArgumentParser(
        description="RPG Progression Engine v2 — ascending chains, "
                    "recalibrated grades, bonus multipliers",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Preview profile without writing files.",
    )
    parser.add_argument(
        "-v", "--verbose", action="store_true",
        help="Print detailed debug output.",
    )
    parser.add_argument(
        "-q", "--quiet", action="store_true",
        help="Suppress all output except errors.",
    )
    args = parser.parse_args()

    verbose = args.verbose and not args.quiet
    quiet = args.quiet

    t0 = time.time()

    logs = load_daily_logs()
    if not logs:
        if not quiet:
            print("  warning: No daily logs found — nothing to do.")
        sys.exit(0)

    if not quiet:
        print(f"\n  +== Progression Engine v2 ========================+")
        print(f"  |  Daily logs found: {len(logs):>25d}    |")

    profile = build_profile_v2(logs, verbose=verbose)

    if not quiet:
        v2m = profile["v2_meta"]
        print(f"  |  XP Total (v2):   {profile['xp_total']:>25,}    |")
        print(f"  |  XP Total (v1):   {v2m['v1_xp_total']:>25,}    |")
        print(f"  |  XP Delta:        {v2m['xp_delta']:>+25,}    |")
        print(f"  |  Level:           {profile['level']:>25d}    |")
        print(f"  |  Title:  {profile['title']:>36s}    |")
        print(f"  |  Tier:            {profile['avatar_tier']:>25d}    |")
        print(f"  |  Class:           {profile['class']:>25s}    |")
        print(f"  |  Ascending Chain: {v2m['current_ascending_chain']:>25d}    |")
        print(f"  |  Milestones:      {len(profile['milestones']):>25d}    |")
        print(f"  +================================================+")

    write_profile_v2(profile, dry_run=args.dry_run)
    if not quiet and not args.dry_run:
        print(f"\n  -> Profile written: {PROFILE_V2_PATH.relative_to(REPO_ROOT)}")

    elapsed = time.time() - t0
    if not quiet:
        print(f"\n  Done in {elapsed:.1f}s\n")


if __name__ == "__main__":
    main()
