#!/usr/bin/env python3
"""
Cost Aggregator — populates data/daily-log/cost-tracker/*.json

Reads each daily log's token_usage entries and produces per-day cost breakdowns:
  - total_cost
  - by_model (opus-4, sonnet-4, etc.)
  - by_source (claude-code, cursor, etc.)
  - cumulative_total (running sum across all days)
  - cost_per_xp_v3 (using V3 profile if available)

Usage:
    python3 scripts/cost_aggregator.py           # normal run
    python3 scripts/cost_aggregator.py -v         # verbose
    python3 scripts/cost_aggregator.py --dry-run  # preview
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
DAILY_LOG_DIR = DATA_DIR / "daily-log"
COST_TRACKER_DIR = DAILY_LOG_DIR / "cost-tracker"
PROFILE_V3_PATH = DATA_DIR / "progression" / "profile-v3.json"
PROFILE_V2_PATH = DATA_DIR / "progression" / "profile-v2.json"


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
        except (json.JSONDecodeError, OSError):
            continue
    return logs


def load_xp_map() -> Dict[str, int]:
    """Load per-day XP from V3 profile (falling back to V2)."""
    xp_map: Dict[str, int] = {}

    for profile_path, xp_key, meta_key in [
        (PROFILE_V3_PATH, "v3_xp", "v3_meta"),
        (PROFILE_V2_PATH, "v2_xp", "v2_meta"),
    ]:
        if profile_path.exists():
            try:
                with open(profile_path, "r", encoding="utf-8") as f:
                    profile = json.load(f)
                meta = profile.get(meta_key, {})
                scoring_log = meta.get("scoring_log", [])
                for entry in scoring_log:
                    date = entry.get("date", "")
                    xp = entry.get(xp_key, 0)
                    if date and xp:
                        xp_map[date] = xp
                if xp_map:
                    return xp_map
            except (json.JSONDecodeError, OSError):
                continue

    return xp_map


def normalize_model(model: str) -> str:
    """Normalize model names for grouping."""
    m = model.lower().strip()
    if "opus" in m:
        return "opus-4"
    if "sonnet" in m:
        return "sonnet-4"
    if "haiku" in m:
        return "haiku-3.5"
    if "qwen" in m:
        return "qwen-2.5"
    if "llama" in m:
        return "llama-3.2"
    return m or "unknown"


def normalize_source(source: str) -> str:
    """Normalize source names for grouping."""
    s = source.lower().strip()
    if "claude-code" in s or "claude_code" in s:
        return "claude-code"
    if "cursor" in s:
        return "cursor"
    if "openclaw" in s:
        return "openclaw"
    return s or "unknown"


def aggregate_costs(logs: List[Dict[str, Any]], xp_map: Dict[str, int], verbose: bool = False) -> List[Dict[str, Any]]:
    """Process all daily logs and generate cost breakdowns."""
    results: List[Dict[str, Any]] = []
    cumulative_total = 0.0

    for log in logs:
        date = log.get("date", "")
        token_usage = log.get("token_usage", [])

        by_model: Dict[str, float] = {}
        by_source: Dict[str, float] = {}
        total_cost = 0.0

        for entry in token_usage:
            cost = entry.get("cost", 0)
            if not isinstance(cost, (int, float)):
                cost = 0

            model = normalize_model(entry.get("model", ""))
            source = normalize_source(entry.get("source", ""))

            total_cost += cost
            by_model[model] = by_model.get(model, 0) + cost
            by_source[source] = by_source.get(source, 0) + cost

        cumulative_total += total_cost

        # Round values
        by_model = {k: round(v, 4) for k, v in by_model.items() if v > 0}
        by_source = {k: round(v, 4) for k, v in by_source.items() if v > 0}

        xp = xp_map.get(date, 0)
        cost_per_xp = round(total_cost / xp, 4) if xp > 0 else 0

        record = {
            "date": date,
            "total_cost": round(total_cost, 4),
            "by_model": by_model,
            "by_source": by_source,
            "cumulative_total": round(cumulative_total, 4),
            "cost_per_xp_v3": cost_per_xp,
        }
        results.append(record)

        if verbose:
            print(f"  {date}: ${total_cost:.2f} (cum: ${cumulative_total:.2f}, "
                  f"$/xp: {cost_per_xp:.4f}, models: {list(by_model.keys())}, "
                  f"sources: {list(by_source.keys())})")

    return results


def write_cost_files(results: List[Dict[str, Any]], dry_run: bool = False) -> None:
    """Write per-day cost tracker JSON files."""
    COST_TRACKER_DIR.mkdir(parents=True, exist_ok=True)

    for record in results:
        filepath = COST_TRACKER_DIR / f"{record['date']}.json"
        if dry_run:
            print(f"  [DRY RUN] Would write {filepath.name}")
            continue

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(record, f, indent=2, ensure_ascii=False)
            f.write("\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Cost aggregator — populates cost-tracker JSONs")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    logs = load_daily_logs()
    if not logs:
        print("  No daily logs found.")
        sys.exit(0)

    print(f"\n  +== Cost Aggregator =============================+")
    print(f"  |  Daily logs found: {len(logs):>25d}    |")

    xp_map = load_xp_map()
    results = aggregate_costs(logs, xp_map, verbose=args.verbose)

    total = results[-1]["cumulative_total"] if results else 0
    print(f"  |  Total spend:      ${total:>23.2f}    |")
    print(f"  |  Cost files:       {len(results):>25d}    |")
    print(f"  +================================================+")

    write_cost_files(results, dry_run=args.dry_run)
    if not args.dry_run:
        print(f"\n  -> Cost tracker files written to {COST_TRACKER_DIR.relative_to(REPO_ROOT)}/\n")


if __name__ == "__main__":
    main()
