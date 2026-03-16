#!/usr/bin/env bash
# Crypto OS — Signal Deploy
# Runs the signal analyzer, commits the website JSON, and pushes to GitHub.
# Vercel auto-deploys on push, so the page updates automatically.
#
# Usage: ./scripts/crypto/deploy_signals.sh
# Called by launchd at 7AM and 5:30PM

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PYTHON="/opt/homebrew/bin/python3"
SCRIPT_DIR="$REPO_ROOT/scripts/crypto"
SIGNALS_FILE="website/apps/shawnos/public/data/crypto-signals.json"

cd "$REPO_ROOT"

echo "[crypto-deploy] $(date) — starting signal run"

# Pull latest to avoid conflicts
git pull --rebase --quiet 2>/dev/null || true

# Run the signal analyzer (writes to both log dir and website JSON)
cd "$SCRIPT_DIR"
"$PYTHON" signal_analyzer.py
cd "$REPO_ROOT"

# Check if the signals file was updated
if git diff --quiet "$SIGNALS_FILE" 2>/dev/null; then
    echo "[crypto-deploy] No changes to signals file, skipping deploy"
    exit 0
fi

# Commit and push
git add "$SIGNALS_FILE"
PERIOD="morning"
if [ "$(date +%H)" -ge 14 ]; then
    PERIOD="evening"
fi
DATE="$(date +%Y-%m-%d)"

git commit -m "chore(crypto): ${PERIOD} signal update ${DATE}" --quiet
git push --quiet

echo "[crypto-deploy] $(date) — deployed ${PERIOD} signals, Vercel will auto-build"
