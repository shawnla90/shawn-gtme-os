#!/usr/bin/env python3
"""
Crew Orchestrator — launches crew workflows via OpenClaw.

Reads ~/.openclaw/crews.json and orchestrates agent crews based on
their workflow type (sequential, parallel, independent).

Usage:
    python3 scripts/crew_orchestrator.py --crew content    # run content crew
    python3 scripts/crew_orchestrator.py --crew build      # run build crew
    python3 scripts/crew_orchestrator.py --crew ops        # run ops crew
    python3 scripts/crew_orchestrator.py --status          # show all crew status
    python3 scripts/crew_orchestrator.py --dry-run --crew content  # preview
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

CREWS_PATH = Path.home() / ".openclaw" / "crews.json"


def load_crews() -> Dict[str, Any]:
    """Load crews config from ~/.openclaw/crews.json"""
    if not CREWS_PATH.exists():
        print(f"  error: crews.json not found at {CREWS_PATH}")
        sys.exit(1)

    with open(CREWS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_crews(config: Dict[str, Any]) -> None:
    """Save updated crews config."""
    config["updated_at"] = datetime.now(timezone.utc).isoformat()
    with open(CREWS_PATH, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
        f.write("\n")


def ensure_handoff_dir(crew: Dict[str, Any]) -> Path:
    """Ensure the crew's handoff directory exists."""
    handoff_dir = Path(crew["handoff_dir"])
    handoff_dir.mkdir(parents=True, exist_ok=True)
    return handoff_dir


def write_crew_status(crew: Dict[str, Any], phase: str, output: str = "", errors: Optional[List[str]] = None) -> None:
    """Write crew-status.json to the handoff directory."""
    handoff_dir = ensure_handoff_dir(crew)
    status = {
        "crew_id": crew["id"],
        "phase": phase,
        "agents_active": sum(1 for a in crew["agents"] if a["status"] == "active"),
        "last_output": output,
        "errors": errors or [],
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    with open(handoff_dir / "crew-status.json", "w", encoding="utf-8") as f:
        json.dump(status, f, indent=2, ensure_ascii=False)
        f.write("\n")


def run_sequential_crew(crew: Dict[str, Any], dry_run: bool = False) -> None:
    """Run agents in sequence — each reads the previous agent's output."""
    print(f"\n  Running sequential crew: {crew['name']}")
    handoff_dir = ensure_handoff_dir(crew)

    for i, agent in enumerate(crew["agents"]):
        print(f"  [{i+1}/{len(crew['agents'])}] Agent: {agent['name']} ({agent['model']})")

        if dry_run:
            print(f"    [DRY RUN] Would invoke {agent['name']} via OpenClaw")
            continue

        # Mark agent as active
        agent["status"] = "active"
        write_crew_status(crew, f"running_{agent['id']}", f"Agent {agent['name']} processing")

        # Write agent task file for handoff
        task_file = handoff_dir / f"task-{agent['id']}.json"
        task = {
            "agent_id": agent["id"],
            "agent_name": agent["name"],
            "model": agent["model"],
            "step": i + 1,
            "total_steps": len(crew["agents"]),
            "previous_output": str(handoff_dir / f"output-{crew['agents'][i-1]['id']}.json") if i > 0 else None,
            "started_at": datetime.now(timezone.utc).isoformat(),
        }
        with open(task_file, "w", encoding="utf-8") as f:
            json.dump(task, f, indent=2)

        # NOTE: Actual OpenClaw subagent invocation would happen here
        # For now, we write the task file and log the intent
        print(f"    Task written: {task_file.name}")

        agent["status"] = "idle"

    write_crew_status(crew, "completed", "All agents finished")


def run_parallel_crew(crew: Dict[str, Any], dry_run: bool = False) -> None:
    """Run all agents in parallel."""
    print(f"\n  Running parallel crew: {crew['name']}")
    handoff_dir = ensure_handoff_dir(crew)

    for agent in crew["agents"]:
        print(f"  [parallel] Agent: {agent['name']} ({agent['model']})")

        if dry_run:
            print(f"    [DRY RUN] Would invoke {agent['name']} via OpenClaw")
            continue

        agent["status"] = "active"
        task_file = handoff_dir / f"task-{agent['id']}.json"
        task = {
            "agent_id": agent["id"],
            "agent_name": agent["name"],
            "model": agent["model"],
            "workflow": "parallel",
            "started_at": datetime.now(timezone.utc).isoformat(),
        }
        with open(task_file, "w", encoding="utf-8") as f:
            json.dump(task, f, indent=2)

        print(f"    Task written: {task_file.name}")
        agent["status"] = "idle"

    write_crew_status(crew, "completed", "All agents launched in parallel")


def run_independent_crew(crew: Dict[str, Any], dry_run: bool = False) -> None:
    """Run each agent independently — no coordination needed."""
    print(f"\n  Running independent crew: {crew['name']}")
    handoff_dir = ensure_handoff_dir(crew)

    for agent in crew["agents"]:
        print(f"  [independent] Agent: {agent['name']} ({agent['model']})")

        if dry_run:
            print(f"    [DRY RUN] Would invoke {agent['name']} via OpenClaw")
            continue

        agent["status"] = "active"
        task_file = handoff_dir / f"task-{agent['id']}.json"
        task = {
            "agent_id": agent["id"],
            "agent_name": agent["name"],
            "model": agent["model"],
            "workflow": "independent",
            "started_at": datetime.now(timezone.utc).isoformat(),
        }
        with open(task_file, "w", encoding="utf-8") as f:
            json.dump(task, f, indent=2)

        print(f"    Task written: {task_file.name}")
        agent["status"] = "idle"

    write_crew_status(crew, "completed", "All independent agents dispatched")


def run_crew(crew: Dict[str, Any], dry_run: bool = False) -> None:
    """Dispatch to the correct workflow runner."""
    workflow = crew.get("workflow", "sequential")

    if workflow == "sequential":
        run_sequential_crew(crew, dry_run)
    elif workflow == "parallel":
        run_parallel_crew(crew, dry_run)
    elif workflow == "independent":
        run_independent_crew(crew, dry_run)
    else:
        print(f"  error: Unknown workflow type: {workflow}")
        return

    if not dry_run:
        crew["last_run"] = datetime.now(timezone.utc).isoformat()
        crew["total_runs"] = crew.get("total_runs", 0) + 1
        crew["total_cost"] = crew.get("total_cost", 0) + sum(
            a.get("cost_per_run", 0) for a in crew["agents"]
        )


def show_status(config: Dict[str, Any]) -> None:
    """Show status of all crews."""
    print(f"\n  +== Crew Status ==================================+")
    for crew in config.get("crews", []):
        agents_active = sum(1 for a in crew["agents"] if a["status"] == "active")
        agents_total = len(crew["agents"])
        print(f"  |")
        print(f"  |  {crew['name']:<20s} [{crew['workflow']}]")
        print(f"  |    Agents: {agents_total} ({agents_active} active)")
        print(f"  |    Runs:   {crew.get('total_runs', 0)}")
        print(f"  |    Cost:   ${crew.get('total_cost', 0):.2f}")
        print(f"  |    Last:   {crew.get('last_run', 'never')}")
        print(f"  |    Jobs:   {', '.join(crew.get('cron_jobs', []))}")
    print(f"  |")
    print(f"  +================================================+\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Crew Orchestrator — launches crew workflows")
    parser.add_argument("--crew", type=str, help="Crew ID to run (content, build, ops)")
    parser.add_argument("--status", action="store_true", help="Show all crew status")
    parser.add_argument("--dry-run", action="store_true", help="Preview without executing")
    args = parser.parse_args()

    config = load_crews()

    if args.status:
        show_status(config)
        return

    if not args.crew:
        print("  error: Specify --crew <id> or --status")
        parser.print_help()
        sys.exit(1)

    crew = None
    for c in config.get("crews", []):
        if c["id"] == args.crew:
            crew = c
            break

    if not crew:
        available = [c["id"] for c in config.get("crews", [])]
        print(f"  error: Crew '{args.crew}' not found. Available: {available}")
        sys.exit(1)

    run_crew(crew, dry_run=args.dry_run)

    if not args.dry_run:
        save_crews(config)
        print(f"\n  -> Crews config updated at {CREWS_PATH}\n")
    else:
        print(f"\n  [DRY RUN] No changes written.\n")


if __name__ == "__main__":
    main()
