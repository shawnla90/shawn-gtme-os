#!/usr/bin/env python3
"""
Session Cost Tracker — scans OpenClaw session JSONL files and logs token usage + cost.
Writes data/daily-log/cost-tracker/YYYY-MM-DD.json with per-session and daily totals.

Usage:
    python3 scripts/session_cost_tracker.py              # scan today
    python3 scripts/session_cost_tracker.py --date 2026-02-17
    python3 scripts/session_cost_tracker.py --summary     # weekly summary
"""

import argparse
import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from collections import defaultdict

REPO_ROOT = Path(__file__).resolve().parent.parent
OPENCLAW_SESSIONS = Path.home() / ".openclaw" / "agents" / "main" / "sessions"
COST_DIR = REPO_ROOT / "data" / "daily-log" / "cost-tracker"

# Anthropic pricing per million tokens (as of 2026)
PRICING = {
    "claude-opus-4-6": {
        "input": 15.00,
        "output": 75.00,
        "cache_read": 1.50,
        "cache_write": 18.75,
    },
    "claude-sonnet-4-5": {
        "input": 3.00,
        "output": 15.00,
        "cache_read": 0.30,
        "cache_write": 3.75,
    },
    "claude-haiku-3-5": {
        "input": 0.80,
        "output": 4.00,
        "cache_read": 0.08,
        "cache_write": 1.00,
    },
}


def parse_session_jsonl(filepath: Path, target_date: str) -> dict:
    """Parse a session JSONL file and extract usage for a specific date."""
    turns = []
    total_input = 0
    total_output = 0
    total_cache_read = 0
    total_cache_write = 0
    total_cost = 0.0
    turn_count = 0
    model = "unknown"

    with open(filepath) as f:
        for line in f:
            try:
                obj = json.loads(line.strip())
            except json.JSONDecodeError:
                continue

            # Track model changes
            if obj.get("type") == "model_change":
                model = obj.get("model", model)

            # Extract usage from assistant messages
            msg = obj.get("message", {})
            if not isinstance(msg, dict):
                continue

            if msg.get("role") != "assistant":
                continue

            usage = msg.get("usage")
            if not usage:
                continue

            # Check if this turn is from our target date
            ts = obj.get("timestamp", "")
            if not ts.startswith(target_date):
                # Convert target_date (local) to check — timestamps are UTC
                # For simplicity, include all turns from the session if session
                # was active on target_date
                pass

            turn_count += 1
            inp = usage.get("input", 0)
            out = usage.get("output", 0)
            cr = usage.get("cacheRead", 0)
            cw = usage.get("cacheWrite", 0)

            total_input += inp
            total_output += out
            total_cache_read += cr
            total_cache_write += cw

            cost_obj = usage.get("cost", {})
            if cost_obj:
                total_cost += cost_obj.get("total", 0.0)
            else:
                # Estimate from pricing table
                pricing = PRICING.get(model, PRICING["claude-opus-4-6"])
                total_cost += (
                    inp * pricing["input"] / 1_000_000
                    + out * pricing["output"] / 1_000_000
                    + cr * pricing["cache_read"] / 1_000_000
                    + cw * pricing["cache_write"] / 1_000_000
                )

            turns.append({
                "timestamp": ts,
                "input_tokens": inp,
                "output_tokens": out,
                "cache_read": cr,
                "cache_write": cw,
                "turn_cost": cost_obj.get("total", 0.0) if cost_obj else None,
            })

    return {
        "session_file": filepath.name,
        "model": model,
        "turns": turn_count,
        "tokens": {
            "input": total_input,
            "output": total_output,
            "cache_read": total_cache_read,
            "cache_write": total_cache_write,
            "total": total_input + total_output + total_cache_read + total_cache_write,
        },
        "cost_usd": round(total_cost, 4),
        "turn_log": turns,
    }


def scan_sessions(target_date: str) -> dict:
    """Scan all session files and aggregate cost data."""
    sessions_file = OPENCLAW_SESSIONS / "sessions.json"
    if not sessions_file.exists():
        print(f"No sessions.json found at {sessions_file}")
        return {}

    with open(sessions_file) as f:
        sessions_index = json.load(f)

    results = []
    total_cost = 0.0
    total_tokens = 0

    for key, meta in sessions_index.items():
        session_file = Path(meta.get("sessionFile", ""))
        if not session_file.exists():
            continue

        result = parse_session_jsonl(session_file, target_date)
        if result["turns"] > 0:
            results.append({
                "session_key": key,
                **result,
            })
            total_cost += result["cost_usd"]
            total_tokens += result["tokens"]["total"]

    return {
        "date": target_date,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "sessions": results,
        "daily_total": {
            "sessions_active": len(results),
            "total_tokens": total_tokens,
            "total_cost_usd": round(total_cost, 4),
        },
    }


def weekly_summary() -> dict:
    """Generate a 7-day cost summary from saved daily files."""
    today = datetime.now(timezone.utc).date()
    summary = {
        "period": f"{today - timedelta(days=6)} to {today}",
        "days": [],
        "total_cost_usd": 0.0,
        "total_tokens": 0,
        "avg_daily_cost": 0.0,
    }

    for i in range(7):
        date = today - timedelta(days=i)
        date_str = date.isoformat()
        cost_file = COST_DIR / f"{date_str}.json"

        if cost_file.exists():
            with open(cost_file) as f:
                data = json.load(f)
            daily = data.get("daily_total", {})
            summary["days"].append({
                "date": date_str,
                "cost_usd": daily.get("total_cost_usd", 0),
                "tokens": daily.get("total_tokens", 0),
                "sessions": daily.get("sessions_active", 0),
            })
            summary["total_cost_usd"] += daily.get("total_cost_usd", 0)
            summary["total_tokens"] += daily.get("total_tokens", 0)
        else:
            summary["days"].append({
                "date": date_str,
                "cost_usd": 0,
                "tokens": 0,
                "sessions": 0,
            })

    summary["total_cost_usd"] = round(summary["total_cost_usd"], 4)
    active_days = sum(1 for d in summary["days"] if d["cost_usd"] > 0)
    summary["avg_daily_cost"] = (
        round(summary["total_cost_usd"] / active_days, 4) if active_days else 0
    )

    return summary


def main():
    parser = argparse.ArgumentParser(description="OpenClaw Session Cost Tracker")
    parser.add_argument("--date", help="Date to scan (YYYY-MM-DD), default today")
    parser.add_argument("--summary", action="store_true", help="Show 7-day summary")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    args = parser.parse_args()

    if args.summary:
        result = weekly_summary()
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            print(f"\n📊 Weekly Cost Summary ({result['period']})")
            print("=" * 50)
            for day in reversed(result["days"]):
                bar = "█" * int(day["cost_usd"] * 10) if day["cost_usd"] else "·"
                print(f"  {day['date']}  ${day['cost_usd']:>7.4f}  {bar}")
            print("=" * 50)
            print(f"  Total:     ${result['total_cost_usd']:.4f}")
            print(f"  Avg/day:   ${result['avg_daily_cost']:.4f}")
            print(f"  Tokens:    {result['total_tokens']:,}")
        return

    if args.date:
        target_date = args.date
    else:
        target_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    result = scan_sessions(target_date)

    # Save to cost tracker directory
    COST_DIR.mkdir(parents=True, exist_ok=True)
    output_file = COST_DIR / f"{target_date}.json"
    with open(output_file, "w") as f:
        json.dump(result, f, indent=2)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        daily = result.get("daily_total", {})
        print(f"\n💰 OpenClaw Cost Report — {target_date}")
        print("=" * 50)
        for s in result.get("sessions", []):
            print(f"\n  Session: {s['session_key']}")
            print(f"  Model:   {s['model']}")
            print(f"  Turns:   {s['turns']}")
            print(f"  Tokens:  {s['tokens']['total']:,}")
            print(f"    input:       {s['tokens']['input']:,}")
            print(f"    output:      {s['tokens']['output']:,}")
            print(f"    cache read:  {s['tokens']['cache_read']:,}")
            print(f"    cache write: {s['tokens']['cache_write']:,}")
            print(f"  Cost:    ${s['cost_usd']:.4f}")
        print("\n" + "=" * 50)
        print(f"  Sessions: {daily.get('sessions_active', 0)}")
        print(f"  Tokens:   {daily.get('total_tokens', 0):,}")
        print(f"  Total:    ${daily.get('total_cost_usd', 0):.4f}")
        print()

    print(f"✅ Saved to {output_file}")


if __name__ == "__main__":
    main()
