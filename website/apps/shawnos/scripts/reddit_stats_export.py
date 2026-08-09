#!/usr/bin/env python3
"""Compatibility entry point for the canonical Reddit website export.

The full report schema is owned by the sibling ``clearbox-reddit`` project.
Keep this path for existing commands, but never maintain a second exporter
here: a previous summary-only implementation silently removed fields consumed
by ``ReportRails.tsx`` and blocked every ShawnOS production deployment.

All canonical options are forwarded, including ``--dry-run`` and ``--out``.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


CANONICAL_REPO = Path(__file__).resolve().parents[5] / "clearbox-reddit"
CANONICAL_EXPORTER = (
    CANONICAL_REPO / "clearbox_reddit" / "export_website_stats.py"
)


def main() -> int:
    if not CANONICAL_EXPORTER.is_file():
        raise SystemExit(
            "canonical Reddit exporter not found at "
            f"{CANONICAL_EXPORTER}. Clone clearbox-reddit beside shawn-gtme-os."
        )

    command = [
        sys.executable,
        "-m",
        "clearbox_reddit.export_website_stats",
        *sys.argv[1:],
    ]
    return subprocess.run(command, cwd=CANONICAL_REPO, check=False).returncode


if __name__ == "__main__":
    raise SystemExit(main())
