#!/bin/bash
# run_nio_blog.sh — Wrapper for nio_blog_generator.py
# Runs via Claude Code Max subscription (no API key needed).

set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

REPO_ROOT="$HOME/shawn-gtme-os"
cd "$REPO_ROOT"

# Pull latest before generating (avoids conflicts)
git pull --rebase --quiet 2>/dev/null || true

# Run the generator
python3 scripts/nio_blog_generator.py "$@"
