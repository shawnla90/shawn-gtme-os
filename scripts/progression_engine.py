#!/usr/bin/env python3
"""
RPG Progression Engine for the GTM OS.

Scans all daily-log JSON files, computes total XP from ``output_score``
values, resolves level / title / tier / class, writes
``data/progression/profile.json``, triggers avatar generation for the
resolved tier, and copies the tier assets to ``current-*`` convenience
files.

Usage:
    python3 scripts/progression_engine.py              # normal run
    python3 scripts/progression_engine.py --dry-run    # preview without writing
    python3 scripts/progression_engine.py --skip-avatar # skip GIF generation
    python3 scripts/progression_engine.py -v           # verbose debug output
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
PROFILE_PATH = PROGRESSION_DIR / "profile.json"
AVATAR_DIR = PROGRESSION_DIR / "avatars"

# ══════════════════════════════════════════════════════════════════════
#  Title Table — mirrors TITLE_TABLE in website/packages/shared/lib/rpg.ts
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
#  RPG Class Definitions
# ══════════════════════════════════════════════════════════════════════

# Accomplishment type → class category mapping
CLASS_CATEGORIES: Dict[str, str] = {
    # Builder — code, infrastructure, tools
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
    # Scribe — content creation
    "linkedin_draft":    "scribe",
    "linkedin_final":    "scribe",
    "x_draft":           "scribe",
    "x_final":           "scribe",
    "substack_draft":    "scribe",
    "substack_final":    "scribe",
    "reddit_draft":      "scribe",
    "reddit_final":      "scribe",
    "lead_magnet":       "scribe",
    # Strategist — partner/client ops
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

# class name → RPGClass enum value (matches rpg.ts types)
RPG_CLASSES = {
    "builder":    "Builder",
    "scribe":     "Scribe",
    "strategist": "Strategist",
    "alchemist":  "Alchemist",
    "polymath":   "Polymath",
}


# ══════════════════════════════════════════════════════════════════════
#  Milestone Definitions — auto-detected achievements
# ══════════════════════════════════════════════════════════════════════

def detect_milestones(
    daily_logs: List[Dict[str, Any]],
    total_xp: int,
    total_days: int,
) -> List[Dict[str, str]]:
    """Detect milestone achievements from aggregated daily log data."""
    milestones: List[Dict[str, str]] = []

    # Count totals across all days
    total_shipped = 0
    total_finals = 0
    total_words = 0
    total_commits = 0
    first_date = None
    s_grade_days = 0

    for log in daily_logs:
        stats = log.get("stats", {})
        total_shipped += stats.get("shipped_count", 0)
        total_finals += stats.get("finals_count", 0)
        total_words += stats.get("words_today", 0)
        git = log.get("git_summary", {})
        total_commits += git.get("commits_today", 0)
        if stats.get("letter_grade") == "S":
            s_grade_days += 1
        date = log.get("date", "")
        if date and (first_date is None or date < first_date):
            first_date = date

    # First log recorded
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
    now_iso = datetime.now(timezone.utc).isoformat()
    for threshold, mid, title, desc in xp_thresholds:
        if total_xp >= threshold:
            milestones.append({
                "id": mid,
                "title": title,
                "description": desc,
                "unlocked_at": now_iso,
            })

    # Shipped milestones
    if total_shipped >= 10:
        milestones.append({
            "id": "shipped_10",
            "title": "Shipping Container",
            "description": "Shipped 10+ items across all days",
            "unlocked_at": now_iso,
        })
    if total_shipped >= 50:
        milestones.append({
            "id": "shipped_50",
            "title": "Cargo Fleet",
            "description": "Shipped 50+ items across all days",
            "unlocked_at": now_iso,
        })
    if total_shipped >= 100:
        milestones.append({
            "id": "shipped_100",
            "title": "Assembly Line",
            "description": "Shipped 100+ items across all days",
            "unlocked_at": now_iso,
        })

    # S-grade days
    if s_grade_days >= 1:
        milestones.append({
            "id": "first_s_grade",
            "title": "S-Rank Day",
            "description": "Achieved S letter grade on a daily log",
            "unlocked_at": now_iso,
        })
    if s_grade_days >= 3:
        milestones.append({
            "id": "s_grade_streak",
            "title": "S-Rank Streak",
            "description": "Achieved S letter grade on 3+ daily logs",
            "unlocked_at": now_iso,
        })

    # Multi-day streak
    if total_days >= 3:
        milestones.append({
            "id": "streak_3",
            "title": "Three-Day March",
            "description": "Logged activity for 3+ consecutive days",
            "unlocked_at": now_iso,
        })
    if total_days >= 7:
        milestones.append({
            "id": "streak_7",
            "title": "Week Warrior",
            "description": "Logged activity for 7+ days",
            "unlocked_at": now_iso,
        })

    # Word count milestones
    if total_words >= 50000:
        milestones.append({
            "id": "words_50k",
            "title": "Fifty Thousand Words",
            "description": "Wrote 50,000+ words across all days",
            "unlocked_at": now_iso,
        })
    if total_words >= 100000:
        milestones.append({
            "id": "words_100k",
            "title": "Novelist",
            "description": "Wrote 100,000+ words across all days",
            "unlocked_at": now_iso,
        })

    return milestones


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
            print(f"  ⚠ Skipping {json_path.name}: {e}")
    return logs


def compute_total_xp(logs: List[Dict[str, Any]]) -> int:
    """Sum output_score from all daily logs as total XP."""
    total = 0
    for log in logs:
        stats = log.get("stats", {})
        score = stats.get("output_score", 0)
        if isinstance(score, (int, float)):
            total += int(score)
    return total


def resolve_title_and_tier(xp: int) -> Tuple[str, int, int]:
    """Given total XP, resolve the current title, level, and avatar tier.

    Returns (title, level, avatar_tier).

    Levels are interpolated linearly between title thresholds.
    """
    # Find the highest title entry whose xp_required <= xp
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

    # Interpolate level between current and next title thresholds
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
        # At or past max level
        level = base_level

    return title, level, avatar_tier


def compute_xp_next_level(xp: int) -> int:
    """Return the XP threshold for the next title milestone.

    Used by the AvatarBadge to show progress toward the next title.
    """
    for entry in TITLE_TABLE:
        if entry["xp_required"] > xp:
            return entry["xp_required"]
    # Already at max — return current XP (bar shows 100%)
    return xp if xp > 0 else 1


def determine_class(logs: List[Dict[str, Any]]) -> str:
    """Determine RPG class from accomplishment type distribution.

    Categories:
        builder    — code, infrastructure, tools
        scribe     — content creation
        strategist — partner/client ops

    Class resolution:
        - If one category has >=50% of scored output: that class
        - If two categories each have >=30%: Alchemist (balanced)
        - If three categories each have >=20%: Polymath (well-rounded)
        - Default: Builder
    """
    category_scores: Dict[str, int] = {
        "builder": 0,
        "scribe": 0,
        "strategist": 0,
    }

    for log in logs:
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
        return RPG_CLASSES["builder"]

    # Compute fractions
    fracs = {k: v / total for k, v in category_scores.items()}

    # Check for Polymath (all three >= 20%)
    if all(f >= 0.20 for f in fracs.values()):
        return RPG_CLASSES["polymath"]

    # Check for Alchemist (two categories >= 30%)
    above_30 = sum(1 for f in fracs.values() if f >= 0.30)
    if above_30 >= 2:
        return RPG_CLASSES["alchemist"]

    # Otherwise, dominant category
    dominant = max(fracs, key=fracs.get)  # type: ignore[arg-type]
    return RPG_CLASSES[dominant]


def build_profile(
    logs: List[Dict[str, Any]],
    verbose: bool = False,
) -> Dict[str, Any]:
    """Build the full RPGProfile dict from daily log data."""
    total_xp = compute_total_xp(logs)
    title, level, avatar_tier = resolve_title_and_tier(total_xp)
    xp_next = compute_xp_next_level(total_xp)
    rpg_class = determine_class(logs)
    milestones = detect_milestones(logs, total_xp, len(logs))

    profile = {
        "name": "Operator",
        "title": title,
        "level": level,
        "xp_total": total_xp,
        "xp_next_level": xp_next,
        "class": rpg_class,
        "avatar_tier": avatar_tier,
        "milestones": milestones,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    if verbose:
        print(f"\n  ── Profile Summary ─────────────────────────")
        print(f"  XP Total:    {total_xp:,}")
        print(f"  Level:       {level}")
        print(f"  Title:       {title}")
        print(f"  Avatar Tier: {avatar_tier}")
        print(f"  Class:       {rpg_class}")
        print(f"  Next Title:  {xp_next:,} XP")
        print(f"  Milestones:  {len(milestones)}")
        print(f"  Days Logged: {len(logs)}")
        print(f"  ─────────────────────────────────────────────\n")

    return profile


def write_profile(profile: Dict[str, Any], dry_run: bool = False) -> Path:
    """Write profile.json to the progression directory."""
    PROGRESSION_DIR.mkdir(parents=True, exist_ok=True)

    if dry_run:
        print(f"\n  [DRY RUN] Would write profile to {PROFILE_PATH}")
        print(json.dumps(profile, indent=2))
        return PROFILE_PATH

    with open(PROFILE_PATH, "w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)
        f.write("\n")

    return PROFILE_PATH


def trigger_avatar_generation(
    tier: int,
    verbose: bool = True,
    skip_if_exists: bool = False,
) -> None:
    """Generate avatar assets for the given tier and set as current.

    Imports from ``avatar_generator.py`` (sibling script) and calls
    ``generate_tier()`` + ``set_current_tier()`` programmatically.
    """
    # Check if tier assets already exist
    tier_idle = AVATAR_DIR / f"tier-{tier}-idle.gif"
    if skip_if_exists and tier_idle.exists():
        if verbose:
            print(f"  ✓ Tier {tier} assets already exist — skipping generation")
        # Still update current-* pointers
        sys.path.insert(0, str(Path(__file__).resolve().parent))
        from avatar_generator import set_current_tier
        set_current_tier(tier, output_dir=AVATAR_DIR, verbose=verbose)
        return

    if verbose:
        print(f"  Generating avatar assets for tier {tier}...")

    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from avatar_generator import generate_tier, set_current_tier

    generate_tier(tier, output_dir=AVATAR_DIR, verbose=verbose)
    set_current_tier(tier, output_dir=AVATAR_DIR, verbose=verbose)

    if verbose:
        print(f"  ✓ Avatar tier {tier} generated and set as current")


# ══════════════════════════════════════════════════════════════════════
#  CLI
# ══════════════════════════════════════════════════════════════════════

def main() -> None:
    parser = argparse.ArgumentParser(
        description="RPG Progression Engine — scan daily logs, resolve "
                    "level/title/tier/class, write profile.json, generate avatars",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Preview profile without writing files or generating avatars.",
    )
    parser.add_argument(
        "--skip-avatar", action="store_true",
        help="Skip avatar GIF generation (only write profile.json).",
    )
    parser.add_argument(
        "--force-avatar", action="store_true",
        help="Regenerate avatar even if tier assets already exist.",
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

    # ── 1. Load daily logs ─────────────────────────────────────────
    logs = load_daily_logs()
    if not logs:
        if not quiet:
            print("  ⚠ No daily logs found in data/daily-log/ — nothing to do.")
        sys.exit(0)

    if not quiet:
        print(f"\n  ╔══ Progression Engine ════════════════════════╗")
        print(f"  ║  Daily logs found: {len(logs):>25d}    ║")

    # ── 2. Build profile ───────────────────────────────────────────
    profile = build_profile(logs, verbose=verbose)

    if not quiet:
        print(f"  ║  XP Total:        {profile['xp_total']:>25,}    ║")
        print(f"  ║  Level:           {profile['level']:>25d}    ║")
        print(f"  ║  Title:  {profile['title']:>36s}    ║")
        print(f"  ║  Tier:            {profile['avatar_tier']:>25d}    ║")
        print(f"  ║  Class:           {profile['class']:>25s}    ║")
        print(f"  ║  Milestones:      {len(profile['milestones']):>25d}    ║")
        print(f"  ╚═════════════════════════════════════════════════╝")

    # ── 3. Write profile.json ──────────────────────────────────────
    write_profile(profile, dry_run=args.dry_run)
    if not quiet and not args.dry_run:
        print(f"\n  ✓ Profile written → {PROFILE_PATH.relative_to(REPO_ROOT)}")

    # ── 4. Trigger avatar generation ───────────────────────────────
    if not args.dry_run and not args.skip_avatar:
        try:
            trigger_avatar_generation(
                tier=profile["avatar_tier"],
                verbose=not quiet,
                skip_if_exists=not args.force_avatar,
            )
        except ImportError as e:
            if not quiet:
                print(f"  ⚠ Avatar generation skipped (import error): {e}")
                print(f"    Install Pillow: pip install Pillow")
        except Exception as e:
            if not quiet:
                print(f"  ⚠ Avatar generation failed: {e}")
    elif args.skip_avatar and not quiet and not args.dry_run:
        print("  → Avatar generation skipped (--skip-avatar)")

    elapsed = time.time() - t0
    if not quiet:
        print(f"\n  Done in {elapsed:.1f}s\n")


if __name__ == "__main__":
    main()
