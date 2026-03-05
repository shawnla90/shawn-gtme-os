#!/usr/bin/env python3
"""
Rescore all daily log JSON files using current thresholds and weights.

Recomputes output_score, letter_grade, score_breakdown, and efficiency_rating
from accomplishments. Preserves manual accomplishments, TODOs, and token_usage.
Run after updating GRADE_THRESHOLDS or SCORE_WEIGHTS in daily_scan.py.

Usage:
    python3 scripts/rescore_logs.py              # rescore all logs
    python3 scripts/rescore_logs.py --dry-run   # show what would change
"""

import argparse
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
LOG_DIR = REPO_ROOT / "data" / "daily-log"
SCRIPTS_DIR = Path(__file__).resolve().parent

# Import scoring logic from daily_scan (must match scanner's constants)
import sys
sys.path.insert(0, str(SCRIPTS_DIR))
from daily_scan import compute_score, compute_efficiency, _get_score_for_type


def rescore_file(log_path: Path, dry_run: bool) -> bool:
    """Rescore a single JSON file. Returns True if changed."""
    try:
        data = json.loads(log_path.read_text())
    except (json.JSONDecodeError, IOError) as e:
        print(f"  skip {log_path.name}: {e}")
        return False

    accomplishments = data.get("accomplishments", [])
    token_usage = data.get("token_usage", [])
    stats = data.get("stats", {})
    git_summary = data.get("git_summary", {})

    score_result = compute_score(accomplishments)
    efficiency = compute_efficiency(score_result["output_score"], token_usage)

    old_score = stats.get("output_score", 0)
    old_grade = stats.get("letter_grade", "")
    new_score = score_result["output_score"]
    new_grade = score_result["letter_grade"]

    if old_score == new_score and old_grade == new_grade and (
        efficiency is None or stats.get("efficiency_rating") == efficiency
    ):
        return False

    if dry_run:
        print(f"  {log_path.name}: {old_score} pts ({old_grade}) -> {new_score} pts ({new_grade})")
        return True

    stats["output_score"] = new_score
    stats["letter_grade"] = new_grade
    stats["score_breakdown"] = score_result["score_breakdown"]
    if efficiency is not None:
        stats["efficiency_rating"] = efficiency

    # Update value_score on each accomplishment for consistency
    for acc in accomplishments:
        acc["value_score"] = _get_score_for_type(acc.get("type", ""))

    log_path.write_text(json.dumps(data, indent=2, default=str) + "\n")
    print(f"  updated {log_path.name}: {new_score} pts ({new_grade})")
    return True


def main():
    parser = argparse.ArgumentParser(description="Rescore daily log JSON files")
    parser.add_argument("--dry-run", action="store_true", help="Show changes without writing")
    args = parser.parse_args()

    if not LOG_DIR.exists():
        print(f"No log directory at {LOG_DIR}")
        return 1

    json_files = sorted(LOG_DIR.glob("*.json"), reverse=True)
    if not json_files:
        print("No JSON files found.")
        return 0

    print(f"Rescoring {len(json_files)} log(s)...")
    changed = 0
    for log_path in json_files:
        if rescore_file(log_path, args.dry_run):
            changed += 1

    if args.dry_run:
        print(f"\nWould update {changed} file(s). Run without --dry-run to apply.")
    else:
        print(f"\nUpdated {changed} file(s).")

    return 0


if __name__ == "__main__":
    exit(main())
