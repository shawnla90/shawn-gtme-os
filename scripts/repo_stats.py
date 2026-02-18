#!/usr/bin/env python3
"""
Refresh repo-stats.json: file counts, line counts, and by-area breakdown.
Run from repo root. Respects .gitignore by using git ls-files for tracked files.
Output: data/repo-stats.json (see data/repo-stats-schema.md).
"""

import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = REPO_ROOT / "data" / "repo-stats.json"
TRACKED_EXTENSIONS = {".md", ".py", ".json", ".txt", ".sh", ".csv"}
LINE_COUNT_EXTENSIONS = {".md", ".py", ".json"}


def get_tracked_files():
    """Return set of relative paths (str) that are tracked by git."""
    try:
        out = subprocess.run(
            ["git", "ls-files"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        return set(out.stdout.strip().splitlines()) if out.stdout.strip() else set()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return set()


def count_lines(repo_root: Path, rel_path: str) -> int:
    try:
        path = repo_root / rel_path
        if not path.is_file():
            return 0
        with open(path, "rb") as f:
            return sum(1 for _ in f)
    except OSError:
        return 0


def main():
    tracked = get_tracked_files()

    counts = {
        "files_total": 0,
        "files_md": 0,
        "files_py": 0,
        "files_json": 0,
        "lines_md_py_json": 0,
    }

    by_area = {
        "cursor_skills": {"files": 0, "skills_invokable": 0},
        "voice_playbooks": {"files": 0},
        "content": {"files": 0, "linkedin_drafts": 0, "x_drafts": 0, "finalized": 0},
        "scripts": {"files": 0},
        "clients": {"files": 0, "partners": 0},
        "data": {"files": 0},
        "workflows": {"files": 0},
    }

    cursor_skill_dirs_with_skill_md = set()

    for rel in tracked:
        if not rel or rel.startswith(".git"):
            continue
        path = Path(rel)
        suffix = path.suffix.lower()

        if suffix not in TRACKED_EXTENSIONS:
            continue

        counts["files_total"] += 1
        if suffix == ".md":
            counts["files_md"] += 1
        elif suffix == ".py":
            counts["files_py"] += 1
        elif suffix == ".json":
            counts["files_json"] += 1

        if suffix in LINE_COUNT_EXTENSIONS:
            counts["lines_md_py_json"] += count_lines(REPO_ROOT, rel)

        # by_area
        parts = path.parts
        if len(parts) >= 2 and parts[0] == ".cursor" and parts[1] == "skills":
            by_area["cursor_skills"]["files"] += 1
            if len(parts) >= 3 and path.name == "SKILL.md":
                cursor_skill_dirs_with_skill_md.add((parts[0], parts[1], parts[2]))
        elif len(parts) >= 1 and parts[0] == "skills":
            by_area["voice_playbooks"]["files"] += 1
        elif len(parts) >= 1 and parts[0] == "content":
            by_area["content"]["files"] += 1
            if len(parts) >= 4:
                if parts[1] == "linkedin" and parts[2] == "drafts" and suffix == ".md" and path.name != "README.md":
                    by_area["content"]["linkedin_drafts"] += 1
                elif parts[1] == "x" and parts[2] == "drafts" and suffix == ".md" and path.name != "README.md":
                    by_area["content"]["x_drafts"] += 1
            if len(parts) >= 4 and parts[2] == "final" and suffix == ".txt":
                by_area["content"]["finalized"] += 1
        elif len(parts) >= 1 and parts[0] == "scripts":
            by_area["scripts"]["files"] += 1
        elif len(parts) >= 1 and parts[0] == "clients":
            by_area["clients"]["files"] += 1
            if len(parts) >= 3 and parts[1] == "partner":
                by_area["clients"]["partners"] = max(by_area["clients"]["partners"], 1)
        elif len(parts) >= 1 and parts[0] == "data":
            by_area["data"]["files"] += 1
        elif len(parts) >= 1 and parts[0] == "workflows":
            by_area["workflows"]["files"] += 1

    by_area["cursor_skills"]["skills_invokable"] = len(cursor_skill_dirs_with_skill_md)

    # Partners: count subdirs of clients/partner/
    partner_dir = REPO_ROOT / "clients" / "partner"
    if partner_dir.is_dir():
        by_area["clients"]["partners"] = sum(1 for p in partner_dir.iterdir() if p.is_dir())

    # Git
    def git_count(*args):
        try:
            out = subprocess.run(
                ["git", "rev-list", "--count", *args],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                check=True,
            )
            return int(out.stdout.strip() or 0)
        except (subprocess.CalledProcessError, FileNotFoundError, ValueError):
            return 0

    git_stats = {
        "commits_total": git_count("HEAD"),
        "commits_since_2025": git_count("HEAD", "--since=2025-01-01"),
    }

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "version": 1,
        "counts": counts,
        "by_area": by_area,
        "git": git_stats,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(payload, f, indent=2)

    print(f"Wrote {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
