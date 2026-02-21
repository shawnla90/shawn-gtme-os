#!/usr/bin/env python3
"""
RPG Progression Engine v3 for the GTM OS.

Runs alongside v1 & v2 (does NOT replace them). Key changes from v2:
  - base_score: soft cap on raw score (diminishing returns above 400)
  - momentum_mult: replaces chain_mult with soft decay + streak bonus
  - quality_bonus: rewards diversity + high-value work
  - efficiency_bonus: continuous exponential curve (not stepped)
  - velocity_bonus: continuous (not stepped)
  - ship_bonus: continuous (not stepped)
  - Recalibrated grade thresholds on v3_xp
  - New milestones: momentum_5, streak_14, quality_day, efficient_streak

Usage:
    python3 scripts/progression_engine_v3.py              # normal run
    python3 scripts/progression_engine_v3.py --dry-run    # preview without writing
    python3 scripts/progression_engine_v3.py -v           # verbose debug output
"""

from __future__ import annotations

import argparse
import json
import math
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
PROFILE_V2_PATH = PROGRESSION_DIR / "profile-v2.json"
PROFILE_V3_PATH = PROGRESSION_DIR / "profile-v3.json"

# ══════════════════════════════════════════════════════════════════════
#  Title Table — shared across all engine versions
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
#  v3 Grade Thresholds — based on v3_xp, not raw score
# ══════════════════════════════════════════════════════════════════════

GRADE_THRESHOLDS_V3: List[Tuple[int, str]] = [
    (1200, "S+"),
    (850,  "S"),
    (600,  "A+"),
    (400,  "A"),
    (200,  "B"),
    (75,   "C"),
    (0,    "D"),
]


def grade_for_xp_v3(v3_xp: int) -> str:
    """Return the v3 letter grade for a given v3_xp value."""
    for threshold, grade in GRADE_THRESHOLDS_V3:
        if v3_xp >= threshold:
            return grade
    return "D"


# v2 thresholds for comparison output
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
    """Return the v2 letter grade for a given raw score (for comparison)."""
    for threshold, grade in GRADE_THRESHOLDS_V2:
        if score >= threshold:
            return grade
    return "D"


# ══════════════════════════════════════════════════════════════════════
#  RPG Class Definitions (same categories as v1/v2)
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
#  V3 Formula Components
# ══════════════════════════════════════════════════════════════════════

def compute_base_score(raw_score: int) -> float:
    """Soft cap on raw score — diminishing returns above 400."""
    if raw_score <= 400:
        return float(raw_score)
    return raw_score * (1 - 0.15 * max(0, (raw_score - 400) / 400))


def compute_momentum(
    raw_score: int,
    prev_score: Optional[int],
    ascending_chain: int,
    streak_days: int,
) -> Tuple[float, int, float, float]:
    """Compute momentum_mult with soft decay chain + streak.

    Returns (momentum_mult, new_ascending_chain, ascending_bonus, streak_bonus).
    """
    # Ascending chain with soft decay
    if prev_score is not None:
        if raw_score > prev_score:
            ascending_chain += 1
        elif raw_score > prev_score * 0.7:  # within 30% = "maintained"
            ascending_chain = max(ascending_chain - 1, 1)  # decay, not reset
        else:
            ascending_chain = 1  # hard reset only on 30%+ drops
    else:
        ascending_chain = 1

    ascending_bonus = min(ascending_chain * 0.08, 0.40)  # max at chain 5+
    streak_bonus = min(streak_days * 0.03, 0.21)  # max at 7+ day streak
    momentum_mult = 1.0 + ascending_bonus + streak_bonus  # range: 1.0–1.61

    return momentum_mult, ascending_chain, ascending_bonus, streak_bonus


def compute_quality_bonus(accomplishments: List[Dict[str, Any]], raw_score: int) -> Tuple[float, float, float]:
    """Quality bonus — rewards diversity + high-value work.

    Returns (quality_bonus, type_diversity, high_value_ratio).
    """
    unique_types = len(set(a.get("type", "") for a in accomplishments))
    type_diversity = min(unique_types / 8, 1.0)

    high_value_score = sum(
        a.get("value_score", 0)
        for a in accomplishments
        if isinstance(a.get("value_score"), (int, float)) and a.get("value_score", 0) >= 15
    )
    high_value_ratio = min(high_value_score / max(raw_score, 1), 0.5)

    quality_bonus = (type_diversity * 0.08) + (high_value_ratio * 0.07)  # range: 0–0.15
    return quality_bonus, type_diversity, high_value_ratio


def compute_efficiency_bonus(raw_score: int, agent_cost: float) -> float:
    """Continuous efficiency bonus using exponential curve."""
    if agent_cost <= 0.01:
        return 0.0
    pts_per_dollar = raw_score / max(agent_cost, 0.01)
    return min(0.15, 0.15 * (1 - math.exp(-pts_per_dollar / 80)))


def compute_velocity_bonus(commits: int) -> float:
    """Continuous velocity bonus."""
    return min(0.10, commits * 0.004)  # 25 commits = 0.10 cap


def compute_ship_bonus(ship_rate: float) -> float:
    """Continuous ship bonus."""
    return min(0.10, ship_rate * 0.10)  # 1.0 rate = 0.10 cap


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


def compute_streak(logs: List[Dict[str, Any]], current_idx: int) -> int:
    """Compute consecutive days logged up to and including current_idx."""
    if current_idx < 0:
        return 0

    streak = 1
    for i in range(current_idx, 0, -1):
        curr_date = logs[i].get("date", "")
        prev_date = logs[i - 1].get("date", "")
        if not curr_date or not prev_date:
            break
        try:
            curr_dt = datetime.strptime(curr_date, "%Y-%m-%d")
            prev_dt = datetime.strptime(prev_date, "%Y-%m-%d")
            delta = (curr_dt - prev_dt).days
            if delta == 1:
                streak += 1
            else:
                break
        except ValueError:
            break
    return streak


def compute_v3_scoring(logs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Compute the V3 scoring log for all days.

    Returns a list of per-day scoring records.
    """
    scoring_log: List[Dict[str, Any]] = []
    prev_score: Optional[int] = None
    ascending_chain = 0

    for idx, log in enumerate(logs):
        stats = log.get("stats", {})
        raw_score = int(stats.get("output_score", 0))
        date = log.get("date", "")
        accomplishments = log.get("accomplishments", [])

        # --- A. base_score ---
        base_score = compute_base_score(raw_score)

        # --- Streak ---
        streak_days = compute_streak(logs, idx)

        # --- B. momentum_mult ---
        momentum_mult, ascending_chain, ascending_bonus, streak_bonus = compute_momentum(
            raw_score, prev_score, ascending_chain, streak_days
        )

        # --- C. quality_bonus ---
        quality_bonus, type_diversity, high_value_ratio = compute_quality_bonus(
            accomplishments, raw_score
        )

        # --- D. efficiency_bonus ---
        agent_cost = stats.get("agent_cost", 0)
        if not isinstance(agent_cost, (int, float)):
            agent_cost = 0
        efficiency_bonus = compute_efficiency_bonus(raw_score, agent_cost)

        # --- E. velocity_bonus ---
        git = log.get("git_summary", {})
        commits = git.get("commits_today", 0)
        if not isinstance(commits, (int, float)):
            commits = 0
        velocity_bonus = compute_velocity_bonus(int(commits))

        # --- F. ship_bonus ---
        ship_rate = stats.get("ship_rate", 0)
        if not isinstance(ship_rate, (int, float)):
            ship_rate = 0
        ship_bonus = compute_ship_bonus(float(ship_rate))

        # --- V3 XP calculation ---
        bonus_sum = quality_bonus + efficiency_bonus + velocity_bonus + ship_bonus
        v3_xp = int(base_score * momentum_mult * (1 + bonus_sum))

        # V3 grade is based on v3_xp
        v3_grade = grade_for_xp_v3(v3_xp)

        # Also compute v2 grade for comparison (based on raw_score)
        v2_grade = grade_for_score_v2(raw_score)

        scoring_log.append({
            "date": date,
            "raw_score": raw_score,
            "base_score": round(base_score, 1),
            "v2_grade": v2_grade,
            "v3_grade": v3_grade,
            "ascending_chain": ascending_chain,
            "ascending_bonus": round(ascending_bonus, 3),
            "streak_days": streak_days,
            "streak_bonus": round(streak_bonus, 3),
            "momentum_mult": round(momentum_mult, 3),
            "quality_bonus": round(quality_bonus, 4),
            "type_diversity": round(type_diversity, 2),
            "high_value_ratio": round(high_value_ratio, 3),
            "efficiency_bonus": round(efficiency_bonus, 4),
            "velocity_bonus": round(velocity_bonus, 4),
            "ship_bonus": round(ship_bonus, 4),
            "total_bonus": round(bonus_sum, 4),
            "total_mult": round(momentum_mult * (1 + bonus_sum), 4),
            "v3_xp": v3_xp,
        })

        prev_score = raw_score

    return scoring_log


def compute_total_xp_v3(scoring_log: List[Dict[str, Any]]) -> int:
    """Sum v3_xp from the scoring log."""
    return sum(entry["v3_xp"] for entry in scoring_log)


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


def determine_class_v3(logs: List[Dict[str, Any]]) -> Tuple[str, Dict[str, float]]:
    """Determine RPG class from a 7-day rolling window."""
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

    if all(f >= 0.20 for f in fracs.values()):
        return RPG_CLASSES["polymath"], fracs

    above_30 = sum(1 for f in fracs.values() if f >= 0.30)
    if above_30 >= 2:
        return RPG_CLASSES["alchemist"], fracs

    dominant = max(fracs, key=lambda k: fracs[k])
    return RPG_CLASSES[dominant], fracs


# ══════════════════════════════════════════════════════════════════════
#  v3 Milestones
# ══════════════════════════════════════════════════════════════════════

def detect_milestones_v3(
    daily_logs: List[Dict[str, Any]],
    scoring_log: List[Dict[str, Any]],
    total_xp: int,
) -> List[Dict[str, str]]:
    """Detect v3 milestone achievements."""
    milestones: List[Dict[str, str]] = []
    now_iso = datetime.now(timezone.utc).isoformat()

    # --- Carry forward milestones ---
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
                "id": mid, "title": title,
                "description": desc, "unlocked_at": now_iso,
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

    # --- v3-ONLY milestones ---

    # Momentum chain milestones (with soft decay)
    max_chain = max((e["ascending_chain"] for e in scoring_log), default=0)
    if max_chain >= 3:
        milestones.append({
            "id": "momentum_3", "title": "Building Momentum",
            "description": "3-day ascending momentum chain", "unlocked_at": now_iso,
        })
    if max_chain >= 5:
        milestones.append({
            "id": "momentum_5", "title": "Unstoppable",
            "description": "5+ day momentum chain (with soft decay)", "unlocked_at": now_iso,
        })

    # Streak milestone (14-day)
    max_streak = max((e["streak_days"] for e in scoring_log), default=0)
    if max_streak >= 14:
        milestones.append({
            "id": "streak_14", "title": "Two-Week Grind",
            "description": "14 consecutive days logged", "unlocked_at": now_iso,
        })

    # Quality day: quality_bonus > 0.12
    for entry in scoring_log:
        if entry["quality_bonus"] > 0.12:
            milestones.append({
                "id": "quality_day", "title": "Craftsman",
                "description": "Quality bonus > 0.12 in a single day", "unlocked_at": now_iso,
            })
            break

    # Efficient streak: 3+ days with efficiency_bonus > 0.10
    efficient_streak = 0
    has_efficient_streak = False
    for entry in scoring_log:
        if entry["efficiency_bonus"] > 0.10:
            efficient_streak += 1
            if efficient_streak >= 3:
                has_efficient_streak = True
        else:
            efficient_streak = 0
    if has_efficient_streak:
        milestones.append({
            "id": "efficient_streak", "title": "Lean Machine",
            "description": "3+ days with efficiency bonus > 0.10", "unlocked_at": now_iso,
        })

    # Efficiency king (single day >100 pts/$)
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

    # Commit machine (25+ commits in a day)
    for log in daily_logs:
        git = log.get("git_summary", {})
        c = git.get("commits_today", 0)
        if isinstance(c, (int, float)) and c >= 25:
            milestones.append({
                "id": "commit_machine", "title": "Commit Machine",
                "description": "Day with 25+ commits", "unlocked_at": now_iso,
            })
            break

    # Renaissance Day (polymath day)
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

    # S+ day (v3 thresholds — 1200+)
    for entry in scoring_log:
        if entry["v3_grade"] == "S+":
            milestones.append({
                "id": "s_plus_day_v3", "title": "Legendary (v3)",
                "description": "First S+ grade day (v3 thresholds)", "unlocked_at": now_iso,
            })
            break

    # S-grade days (v3)
    v3_s_days = sum(1 for e in scoring_log if e["v3_grade"] in ("S", "S+"))
    if v3_s_days >= 1:
        milestones.append({
            "id": "first_s_grade_v3", "title": "S-Rank Day (v3)",
            "description": "Achieved S grade on a daily log (v3 thresholds)", "unlocked_at": now_iso,
        })

    return milestones


# ══════════════════════════════════════════════════════════════════════
#  Profile Builder
# ══════════════════════════════════════════════════════════════════════

def build_profile_v3(
    logs: List[Dict[str, Any]],
    verbose: bool = False,
) -> Dict[str, Any]:
    """Build the full RPGProfileV3 dict from daily log data."""
    scoring_log = compute_v3_scoring(logs)
    total_xp_v3 = compute_total_xp_v3(scoring_log)
    total_xp_v1 = compute_total_xp_v1(logs)

    title, level, avatar_tier = resolve_title_and_tier(total_xp_v3)
    xp_next = compute_xp_next_level(total_xp_v3)
    rpg_class, class_breakdown = determine_class_v3(logs)
    milestones = detect_milestones_v3(logs, scoring_log, total_xp_v3)

    # Current stats from last entry
    last = scoring_log[-1] if scoring_log else {}
    current_chain = last.get("ascending_chain", 0)
    current_streak = last.get("streak_days", 0)
    longest_chain = max((e["ascending_chain"] for e in scoring_log), default=0)
    longest_streak = max((e["streak_days"] for e in scoring_log), default=0)

    profile: Dict[str, Any] = {
        "name": "Operator",
        "title": title,
        "level": level,
        "xp_total": total_xp_v3,
        "xp_next_level": xp_next,
        "class": rpg_class,
        "avatar_tier": avatar_tier,
        "milestones": milestones,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "v3_meta": {
            "engine_version": "3.0",
            "v1_xp_total": total_xp_v1,
            "xp_delta_from_v1": total_xp_v3 - total_xp_v1,
            "current_ascending_chain": current_chain,
            "current_streak": current_streak,
            "longest_chain": longest_chain,
            "longest_streak": longest_streak,
            "momentum_mult": last.get("momentum_mult", 1.0),
            "class_window": "7d",
            "class_breakdown": class_breakdown,
            "grade_thresholds": {g: t for t, g in GRADE_THRESHOLDS_V3},
            "scoring_log": scoring_log,
        },
    }

    if verbose:
        print(f"\n  -- v3 Profile Summary ----------------------------------------")
        print(f"  XP Total (v3):  {total_xp_v3:,}")
        print(f"  XP Total (v1):  {total_xp_v1:,}")
        print(f"  XP Delta:       {total_xp_v3 - total_xp_v1:+,}")
        print(f"  Level:          {level}")
        print(f"  Title:          {title}")
        print(f"  Avatar Tier:    {avatar_tier}")
        print(f"  Class:          {rpg_class} (7d window)")
        print(f"  Class Split:    {class_breakdown}")
        print(f"  Next Title:     {xp_next:,} XP")
        print(f"  Milestones:     {len(milestones)}")
        print(f"  Days Logged:    {len(logs)}")
        print(f"  Current Chain:  {current_chain}")
        print(f"  Current Streak: {current_streak}")
        print(f"  Longest Chain:  {longest_chain}")
        print(f"  Longest Streak: {longest_streak}")
        print(f"  ---------------------------------------------------------------")
        print(f"\n  Per-Day Scoring Log (V3):")
        print(f"  {'Date':>12s}  {'Raw':>5s}  {'Base':>6s}  {'v2':>3s}  {'v3':>3s}  {'Chain':>5s}  {'Strk':>4s}  {'Mom':>5s}  {'Qual':>5s}  {'Eff':>5s}  {'Vel':>5s}  {'Ship':>5s}  {'Mult':>6s}  {'XP':>6s}")
        print(f"  {'-'*12}  {'-'*5}  {'-'*6}  {'-'*3}  {'-'*3}  {'-'*5}  {'-'*4}  {'-'*5}  {'-'*5}  {'-'*5}  {'-'*5}  {'-'*5}  {'-'*6}  {'-'*6}")
        for e in scoring_log:
            print(
                f"  {e['date']:>12s}  {e['raw_score']:>5d}  {e['base_score']:>6.1f}  {e['v2_grade']:>3s}  {e['v3_grade']:>3s}"
                f"  {e['ascending_chain']:>5d}  {e['streak_days']:>4d}  {e['momentum_mult']:>5.2f}"
                f"  {e['quality_bonus']:>5.3f}  {e['efficiency_bonus']:>5.3f}"
                f"  {e['velocity_bonus']:>5.3f}  {e['ship_bonus']:>5.3f}"
                f"  {e['total_mult']:>6.3f}  {e['v3_xp']:>6d}"
            )
        print()

    return profile


def write_profile_v3(profile: Dict[str, Any], dry_run: bool = False) -> Path:
    """Write profile-v3.json to the progression directory."""
    PROGRESSION_DIR.mkdir(parents=True, exist_ok=True)

    if dry_run:
        print(f"\n  [DRY RUN] Would write profile to {PROFILE_V3_PATH}")
        print(json.dumps(profile, indent=2))
        return PROFILE_V3_PATH

    with open(PROFILE_V3_PATH, "w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)
        f.write("\n")

    return PROFILE_V3_PATH


# ══════════════════════════════════════════════════════════════════════
#  CLI
# ══════════════════════════════════════════════════════════════════════

def main() -> None:
    parser = argparse.ArgumentParser(
        description="RPG Progression Engine v3 — momentum chains, "
                    "quality bonuses, continuous curves",
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
        print(f"\n  +== Progression Engine v3 ========================+")
        print(f"  |  Daily logs found: {len(logs):>25d}    |")

    profile = build_profile_v3(logs, verbose=verbose)

    if not quiet:
        v3m = profile["v3_meta"]
        print(f"  |  XP Total (v3):   {profile['xp_total']:>25,}    |")
        print(f"  |  XP Total (v1):   {v3m['v1_xp_total']:>25,}    |")
        print(f"  |  XP Delta:        {v3m['xp_delta_from_v1']:>+25,}    |")
        print(f"  |  Level:           {profile['level']:>25d}    |")
        print(f"  |  Title:  {profile['title']:>36s}    |")
        print(f"  |  Tier:            {profile['avatar_tier']:>25d}    |")
        print(f"  |  Class:           {profile['class']:>25s}    |")
        print(f"  |  Momentum Chain:  {v3m['current_ascending_chain']:>25d}    |")
        print(f"  |  Current Streak:  {v3m['current_streak']:>25d}    |")
        print(f"  |  Milestones:      {len(profile['milestones']):>25d}    |")
        print(f"  +================================================+")

    write_profile_v3(profile, dry_run=args.dry_run)
    if not quiet and not args.dry_run:
        print(f"\n  -> Profile written: {PROFILE_V3_PATH.relative_to(REPO_ROOT)}")

    elapsed = time.time() - t0
    if not quiet:
        print(f"\n  Done in {elapsed:.1f}s\n")


if __name__ == "__main__":
    main()
