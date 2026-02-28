#!/usr/bin/env python3
"""
contentos_optimizer.py - Daily site analysis + hybrid improvements.

Scans ContentOS state, generates 3 improvement tasks via Claude CLI,
auto-applies safe changes and queues risky ones for review.

Usage:
    python3 scripts/contentos_optimizer.py          # full run
    python3 scripts/contentos_optimizer.py --test   # analyze only, print tasks
    python3 scripts/contentos_optimizer.py --dry-run # generate but don't apply
"""

import argparse
import glob
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CONTENTOS_APP = REPO_ROOT / "website" / "apps" / "contentos" / "app"
OPT_LOG_DIR = REPO_ROOT / "data" / "contentos" / "optimizer-log"
OPT_QUEUE_DIR = REPO_ROOT / "data" / "contentos" / "optimizer-queue"
SEO_BRIEF_PATH = REPO_ROOT / "data" / "seo" / "daily-brief.json"
SCOUT_DIR = REPO_ROOT / "data" / "agent-logs" / "scout"
CLAUDE_CLI = "/opt/homebrew/bin/claude"


# -- State scanning -----------------------------------------------------------

def scan_contentos_state() -> dict:
    """Scan current ContentOS app state."""
    pages = []
    components = []
    total_lines = 0

    # Find all page.tsx files
    for page_file in glob.glob(str(CONTENTOS_APP / "**" / "page.tsx"), recursive=True):
        rel = os.path.relpath(page_file, str(CONTENTOS_APP))
        route = "/" + os.path.dirname(rel) if os.path.dirname(rel) != "." else "/"
        try:
            line_count = sum(1 for _ in open(page_file))
            total_lines += line_count
            pages.append({"route": route, "file": rel, "lines": line_count})
        except OSError:
            pages.append({"route": route, "file": rel, "lines": 0})

    # Find all .tsx components (not page.tsx)
    for tsx_file in glob.glob(str(CONTENTOS_APP / "**" / "*.tsx"), recursive=True):
        if "page.tsx" in tsx_file:
            continue
        rel = os.path.relpath(tsx_file, str(CONTENTOS_APP))
        try:
            line_count = sum(1 for _ in open(tsx_file))
            total_lines += line_count
            components.append({"file": rel, "lines": line_count})
        except OSError:
            components.append({"file": rel, "lines": 0})

    return {
        "pages": pages,
        "components": components,
        "page_count": len(pages),
        "component_count": len(components),
        "total_lines": total_lines,
    }


def get_recent_commits() -> list[str]:
    """Get recent commits touching contentos files."""
    try:
        result = subprocess.run(
            ["git", "-C", str(REPO_ROOT), "log", "--oneline", "-10",
             "--since=7 days ago", "--", "website/apps/contentos/"],
            capture_output=True, text=True,
        )
        if result.stdout.strip():
            return result.stdout.strip().split("\n")
    except OSError:
        pass
    return []


def get_seo_context() -> dict:
    """Read SEO daily brief if available."""
    if SEO_BRIEF_PATH.exists():
        try:
            return json.loads(SEO_BRIEF_PATH.read_text())
        except (json.JSONDecodeError, OSError):
            pass
    return {}


def get_scout_context(today: str) -> dict:
    """Read today's scout briefing if available."""
    scout_path = SCOUT_DIR / f"{today}.json"
    if scout_path.exists():
        try:
            data = json.loads(scout_path.read_text())
            # Trim to summary
            return {
                "topics": [t.get("topic", "") for t in data.get("topics", [])[:5]],
                "trends": data.get("trends", [])[:3],
            }
        except (json.JSONDecodeError, OSError):
            pass
    return {}


# -- Task generation via Claude CLI -------------------------------------------

def generate_tasks(state: dict, commits: list, seo: dict, scout: dict) -> list[dict]:
    """Generate 3 improvement tasks via Claude CLI."""
    pages_summary = "\n".join(
        f"  {p['route']} ({p['lines']} lines)" for p in state["pages"]
    )
    components_summary = "\n".join(
        f"  {c['file']} ({c['lines']} lines)" for c in state["components"]
    )
    commits_summary = "\n".join(f"  {c}" for c in commits[:5]) if commits else "  (no recent commits)"
    seo_kw = seo.get("target_keyword", "none")
    seo_pillar = seo.get("content_pillar", "none")

    prompt = f"""You are a website optimizer for ContentOS (thecontentos.ai) - a content operating system site built with Next.js.

Current state:
- {state['page_count']} pages, {state['component_count']} components, {state['total_lines']} total lines
- Pages:
{pages_summary}
- Components:
{components_summary}
- Recent commits:
{commits_summary}
- SEO target: {seo_kw} (pillar: {seo_pillar})

Generate exactly 3 improvement tasks. Each task should be specific and actionable.

Classify each as:
- "safe" = copy tweaks, meta description updates, SEO keyword additions, content refreshes, data file updates
- "review" = layout changes, new components, CSS modifications, navigation changes, new routes

Return ONLY a JSON array:
[
  {{
    "type": "safe" or "review",
    "category": "seo" | "copy" | "content" | "layout" | "performance" | "accessibility",
    "description": "specific description of what to change",
    "files": ["relative/path/to/file.tsx"],
    "rationale": "why this improvement matters"
  }}
]

Focus on high-impact, low-risk improvements. Prefer safe changes. Be specific about what to change and where."""

    try:
        result = subprocess.run(
            [CLAUDE_CLI, "-p", "--model", "sonnet", "--output-format", "text"],
            input=prompt,
            capture_output=True,
            text=True,
            timeout=180,
            cwd=str(REPO_ROOT),
        )
        if result.returncode != 0:
            print(f"ERROR: Claude CLI failed", file=sys.stderr)
            return []

        raw = result.stdout.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
            if raw.endswith("```"):
                raw = raw[:-3]
            raw = raw.strip()
        if raw.startswith("json"):
            raw = raw[4:].strip()

        tasks = json.loads(raw)
        if not isinstance(tasks, list):
            return []
        return tasks

    except (subprocess.TimeoutExpired, json.JSONDecodeError) as e:
        print(f"ERROR: task generation failed: {e}", file=sys.stderr)
        return []


# -- Task execution -----------------------------------------------------------

def execute_safe_task(task: dict) -> dict:
    """Execute a safe task via Claude CLI file edits."""
    files = task.get("files", [])
    description = task.get("description", "")

    # Build a prompt for Claude to generate the actual edit
    file_contents = []
    for f in files:
        fpath = REPO_ROOT / f
        if fpath.exists():
            try:
                content = fpath.read_text()[:3000]
                file_contents.append(f"--- {f} ---\n{content}")
            except OSError:
                file_contents.append(f"--- {f} --- (could not read)")

    if not file_contents:
        return {"status": "skipped", "reason": "no files found"}

    files_text = "\n\n".join(file_contents)

    prompt = f"""Apply this improvement to the file(s):

Task: {description}
Category: {task.get('category', 'unknown')}

Current file contents:
{files_text}

Return ONLY the complete updated file content. If multiple files, format as:
===FILE: path/to/file.tsx===
(full file content)
===END===

Only make the specific change described. Do not refactor or change anything else."""

    try:
        result = subprocess.run(
            [CLAUDE_CLI, "-p", "--model", "sonnet", "--output-format", "text"],
            input=prompt,
            capture_output=True,
            text=True,
            timeout=120,
            cwd=str(REPO_ROOT),
        )
        if result.returncode != 0:
            return {"status": "failed", "reason": "Claude CLI error"}

        output = result.stdout.strip()

        # Parse multi-file output
        if "===FILE:" in output:
            parts = re.split(r"===FILE:\s*(.+?)===", output)
            for i in range(1, len(parts), 2):
                filepath = parts[i].strip()
                content = parts[i + 1].strip()
                if content.startswith("\n"):
                    content = content[1:]
                if "===END===" in content:
                    content = content.split("===END===")[0].strip()

                fpath = REPO_ROOT / filepath
                if fpath.exists():
                    fpath.write_text(content + "\n")
        elif len(files) == 1:
            # Single file output
            fpath = REPO_ROOT / files[0]
            if fpath.exists():
                # Strip markdown code fences if present
                if output.startswith("```"):
                    output = output.split("\n", 1)[1] if "\n" in output else output[3:]
                    if output.endswith("```"):
                        output = output[:-3]
                    output = output.strip()
                fpath.write_text(output + "\n")

        return {"status": "applied"}

    except subprocess.TimeoutExpired:
        return {"status": "failed", "reason": "timeout"}


def queue_review_task(task: dict, today: str):
    """Queue a task for human review."""
    OPT_QUEUE_DIR.mkdir(parents=True, exist_ok=True)
    queue_path = OPT_QUEUE_DIR / f"{today}.json"

    existing = []
    if queue_path.exists():
        try:
            existing = json.loads(queue_path.read_text())
        except json.JSONDecodeError:
            existing = []

    existing.append({
        **task,
        "status": "queued",
        "queued_at": datetime.now(timezone.utc).isoformat(),
    })

    queue_path.write_text(json.dumps(existing, indent=2))


# -- Git operations -----------------------------------------------------------

def git_commit_changes(today: str, tasks_applied: int):
    """Commit applied changes."""
    try:
        subprocess.run(
            ["git", "-C", str(REPO_ROOT), "add", "website/apps/contentos/"],
            check=True, capture_output=True,
        )
        subprocess.run(
            ["git", "-C", str(REPO_ROOT), "commit", "-m",
             f"chore: contentos optimizer - {tasks_applied} improvements ({today})"],
            check=True, capture_output=True,
        )
        subprocess.run(
            ["git", "-C", str(REPO_ROOT), "push"],
            check=True, capture_output=True,
        )
        print(f"  committed and pushed {tasks_applied} changes")
    except subprocess.CalledProcessError as e:
        print(f"  warning: git operation failed: {e}")


# -- Main ---------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Daily ContentOS optimizer")
    parser.add_argument("--test", action="store_true", help="Analyze only, print tasks")
    parser.add_argument("--dry-run", action="store_true", help="Generate tasks but don't apply")
    args = parser.parse_args()

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Verify Claude CLI
    if not Path(CLAUDE_CLI).exists():
        print(f"ERROR: claude CLI not found at {CLAUDE_CLI}", file=sys.stderr)
        sys.exit(1)

    print(f"[contentos_optimizer] {today} | {'TEST' if args.test else 'DRY-RUN' if args.dry_run else 'LIVE'}")

    # 1. Scan current state
    print("  scanning state...", end=" ", flush=True)
    state = scan_contentos_state()
    print(f"{state['page_count']} pages, {state['component_count']} components, {state['total_lines']} lines")

    # 2. Gather context
    commits = get_recent_commits()
    seo = get_seo_context()
    scout = get_scout_context(today)

    # 3. Generate tasks
    print("  generating tasks...", end=" ", flush=True)
    start = time.time()
    tasks = generate_tasks(state, commits, seo, scout)
    elapsed = time.time() - start
    print(f"{len(tasks)} tasks in {elapsed:.1f}s")

    if not tasks:
        print("  no tasks generated. exiting.")
        return

    if args.test:
        print("\n=== GENERATED TASKS ===")
        for i, t in enumerate(tasks):
            print(f"\n  Task {i+1} [{t.get('type', '?')}] ({t.get('category', '?')})")
            print(f"    {t.get('description', '')}")
            print(f"    Files: {', '.join(t.get('files', []))}")
            print(f"    Rationale: {t.get('rationale', '')}")
        return

    # 4. Execute tasks
    results = []
    safe_applied = 0

    for i, task in enumerate(tasks):
        task_type = task.get("type", "review")
        print(f"  task {i+1}/{len(tasks)} [{task_type}]: {task.get('description', '')[:60]}...", end=" ")

        task_result = {
            "id": i + 1,
            "type": task_type,
            "category": task.get("category", "unknown"),
            "description": task.get("description", ""),
            "files": task.get("files", []),
            "rationale": task.get("rationale", ""),
        }

        if task_type == "safe" and not args.dry_run:
            result = execute_safe_task(task)
            task_result["status"] = result["status"]
            if result["status"] == "applied":
                safe_applied += 1
                print("applied")
            else:
                print(f"{result['status']}: {result.get('reason', '')}")
        elif task_type == "review":
            queue_review_task(task, today)
            task_result["status"] = "queued"
            print("queued for review")
        else:
            task_result["status"] = "dry-run"
            print("(dry-run)")

        results.append(task_result)

    # 5. Write log
    OPT_LOG_DIR.mkdir(parents=True, exist_ok=True)
    log = {
        "date": today,
        "tasks": results,
        "summary": f"{safe_applied} safe changes applied, {len(tasks) - safe_applied} queued for review",
        "state_snapshot": {
            "pages": state["page_count"],
            "components": state["component_count"],
            "total_lines": state["total_lines"],
        },
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

    log_path = OPT_LOG_DIR / f"{today}.json"
    log_path.write_text(json.dumps(log, indent=2))
    print(f"\n  log: {log_path}")
    print(f"  {log['summary']}")

    # 6. Git commit if changes were applied
    if safe_applied > 0 and not args.dry_run:
        git_commit_changes(today, safe_applied)


if __name__ == "__main__":
    main()
