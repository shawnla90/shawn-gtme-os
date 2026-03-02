#!/usr/bin/env python3
"""Standardized print formatting for ABM pipeline scripts."""


class _Log:
    """Singleton logger with consistent prefix formatting."""

    def info(self, msg):
        print(f"[+] {msg}")

    def warn(self, msg):
        print(f"[!] {msg}")

    def error(self, msg):
        print(f"[x] {msg}")

    def dry_run(self, msg):
        print(f"[DRY RUN] {msg}")

    def progress(self, i, total, msg):
        print(f"[{i}/{total}] {msg}")


log = _Log()
