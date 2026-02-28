#!/usr/bin/env python3
"""
migrate_frontmatter.py — Convert blockquote metadata to YAML frontmatter.

Reads every .md in content/, converts blockquote metadata (> **Key**: Value)
to YAML frontmatter (--- delimited), preserving all fields.

Files that already have YAML frontmatter are left untouched.

Usage:
    python3 scripts/migrate_frontmatter.py              # dry run
    python3 scripts/migrate_frontmatter.py --write       # actually write changes
    python3 scripts/migrate_frontmatter.py --write --verbose
"""

import argparse
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = REPO_ROOT / "content"

# Fields that should stay lowercase in YAML keys
FIELD_MAP = {
    "platform": "platform",
    "pillar": "pillar",
    "date": "date",
    "status": "status",
    "image": "image",
    "series": "series",
    "arc": "arc",
    "structure": "structure",
    "source": "source",
    "energy": "energy",
    "cta": "cta",
    "visual": "visual",
    "hook": "hook",
    "format": "format",
    "length": "length",
    "audience": "audience",
    "tone": "tone",
    "notes": "notes",
    "title": "title",
}


def has_yaml_frontmatter(text):
    """Check if text already starts with YAML frontmatter."""
    return text.strip().startswith("---")


def extract_blockquote_metadata(text):
    """Extract blockquote metadata and return (fields_dict, remaining_text)."""
    fields = {}
    lines = text.split("\n")
    meta_end = 0

    for i, line in enumerate(lines):
        match = re.match(r"^>\s*\*\*(.+?)\*\*:\s*(.+)$", line)
        if match:
            key = match.group(1).strip().lower()
            value = match.group(2).strip()
            fields[key] = value
            meta_end = i + 1
        elif line.strip() == "" and meta_end > 0:
            # Allow blank lines within the metadata block
            meta_end = i + 1
        elif meta_end > 0:
            # Non-metadata line after metadata block — stop
            break

    if not fields:
        return None, text

    # Find where the body starts (skip trailing blank lines after metadata)
    body_start = meta_end
    while body_start < len(lines) and lines[body_start].strip() in ("", "---"):
        body_start += 1

    remaining = "\n".join(lines[body_start:])
    return fields, remaining


def build_yaml_frontmatter(fields):
    """Build YAML frontmatter string from fields dict."""
    yaml_lines = ["---"]
    for key, value in fields.items():
        # Quote values that contain special YAML characters
        if any(c in str(value) for c in (":", "#", "[", "]", "{", "}", ",", "&", "*", "?", "|", "-", "<", ">", "=", "!", "%", "@", "`")):
            # Escape quotes within the value
            safe_value = str(value).replace('"', '\\"')
            yaml_lines.append(f'{key}: "{safe_value}"')
        elif str(value).lower() in ("true", "false", "yes", "no", "null"):
            yaml_lines.append(f'{key}: "{value}"')
        else:
            yaml_lines.append(f"{key}: {value}")
    yaml_lines.append("---")
    return "\n".join(yaml_lines)


def migrate_file(filepath, write=False, verbose=False):
    """Migrate a single file from blockquote to YAML frontmatter.

    Returns: 'migrated', 'skipped' (already YAML), or 'no-meta' (no blockquote meta).
    """
    try:
        text = filepath.read_text(errors="replace")
    except OSError:
        return "error"

    if has_yaml_frontmatter(text):
        return "skipped"

    fields, remaining = extract_blockquote_metadata(text)
    if fields is None:
        return "no-meta"

    # Extract title from first heading if not in metadata
    if "title" not in fields:
        title_match = re.search(r"^#\s+(.+)$", remaining, re.MULTILINE)
        if title_match:
            fields["title"] = title_match.group(1).strip()

    yaml_header = build_yaml_frontmatter(fields)
    new_content = yaml_header + "\n\n" + remaining.lstrip("\n")

    if verbose:
        print(f"  {filepath.relative_to(REPO_ROOT)}")
        for k, v in fields.items():
            print(f"    {k}: {v}")

    if write:
        filepath.write_text(new_content)

    return "migrated"


def main():
    parser = argparse.ArgumentParser(description="Migrate blockquote metadata to YAML frontmatter")
    parser.add_argument("--write", action="store_true", help="Actually write changes (default: dry run)")
    parser.add_argument("--verbose", action="store_true", help="Show per-file details")
    args = parser.parse_args()

    if not args.write:
        print("[DRY RUN] No files will be modified. Use --write to apply changes.\n")

    stats = {"migrated": 0, "skipped": 0, "no-meta": 0, "error": 0}

    for md_file in sorted(CONTENT_DIR.rglob("*.md")):
        # Skip READMEs, internal, templates
        if md_file.name.startswith(("_", ".", "README")):
            continue
        if "internal" in md_file.parts:
            continue

        result = migrate_file(md_file, write=args.write, verbose=args.verbose)
        stats[result] += 1

    print(f"\nResults:")
    print(f"  Migrated:  {stats['migrated']}")
    print(f"  Skipped:   {stats['skipped']} (already YAML)")
    print(f"  No meta:   {stats['no-meta']} (no blockquote metadata)")
    print(f"  Errors:    {stats['error']}")

    if not args.write and stats["migrated"] > 0:
        print(f"\nRun with --write to apply {stats['migrated']} migrations.")


if __name__ == "__main__":
    main()
