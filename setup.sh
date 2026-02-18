#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# shawn-gtme-os — One-time machine setup
# ──────────────────────────────────────────────────────────────────────
# Run this on a new machine after cloning the repo:
#   chmod +x setup.sh && ./setup.sh
#
# What it does:
#   1. Checks prerequisites (Node, Python, npm)
#   2. Creates Python venv + installs dependencies (Pillow for images)
#   3. Runs npm install for the website monorepo
#   4. Verifies image generation stack works
#   5. Prints a checklist of manual steps still needed
# ──────────────────────────────────────────────────────────────────────

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { printf "${GREEN}✓${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}⚠${NC} %s\n" "$1"; }
fail() { printf "${RED}✗${NC} %s\n" "$1"; }

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

echo ""
echo "═══════════════════════════════════════════════════"
echo "  shawn-gtme-os  —  machine setup"
echo "═══════════════════════════════════════════════════"
echo ""

# ── 1. Prerequisites ─────────────────────────────────────────────────

echo "▸ Checking prerequisites..."

if command -v node &>/dev/null; then
  ok "Node.js $(node --version)"
else
  fail "Node.js not found — install via: brew install node"
  exit 1
fi

if command -v npm &>/dev/null; then
  ok "npm $(npm --version 2>/dev/null)"
else
  fail "npm not found"
  exit 1
fi

if command -v python3 &>/dev/null; then
  ok "Python $(python3 --version 2>&1 | awk '{print $2}')"
else
  fail "Python 3 not found — install via: brew install python"
  exit 1
fi

echo ""

# ── 2. Python venv + dependencies ────────────────────────────────────

echo "▸ Setting up Python virtual environment..."

if [ ! -d ".venv" ]; then
  python3 -m venv .venv
  ok "Created .venv"
else
  ok ".venv already exists"
fi

source .venv/bin/activate

if [ -f "requirements.txt" ]; then
  pip install --quiet --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
  ok "Python dependencies installed"
else
  warn "No requirements.txt found — skipping pip install"
fi

echo ""

# ── 3. Website npm install ───────────────────────────────────────────

echo "▸ Installing website dependencies..."

if [ -d "website" ]; then
  cd website
  if [ -d "node_modules" ] && [ -f "node_modules/.package-lock.json" ]; then
    ok "website/node_modules already exists — run 'npm install' manually if stale"
  else
    npm install
    ok "npm install complete"
  fi
  cd "$REPO_ROOT"
else
  warn "website/ directory not found — skipping npm install"
fi

echo ""

# ── 4. Verify image generation stack ─────────────────────────────────

echo "▸ Verifying image generation stack..."

VERIFY_RESULT=$(python3 -c "
from PIL import Image, ImageDraw, ImageFont
try:
    f = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 14, index=0)
    print('pillow-ok menlo-ok')
except Exception as e:
    print(f'pillow-ok menlo-fail:{e}')
" 2>&1)

if echo "$VERIFY_RESULT" | grep -q "pillow-ok"; then
  ok "Pillow $(python3 -c 'from PIL import Image; print(Image.__version__)')"
else
  fail "Pillow import failed"
fi

if echo "$VERIFY_RESULT" | grep -q "menlo-ok"; then
  ok "Menlo font accessible"
else
  warn "Menlo font not found — image scripts may need a font path update"
fi

deactivate 2>/dev/null || true

echo ""

# ── 5. Checklist of manual steps ─────────────────────────────────────

echo "═══════════════════════════════════════════════════"
echo "  Setup complete — manual steps remaining:"
echo "═══════════════════════════════════════════════════"
echo ""

CHECKS=()

if [ ! -f "$HOME/.cursor/mcp.json" ]; then
  CHECKS+=("  [ ] Copy ~/.cursor/mcp.json from primary machine (MCP server configs)")
else
  ok "~/.cursor/mcp.json exists"
fi

if [ ! -d "clients" ]; then
  CHECKS+=("  [ ] Sync clients/ from primary machine (rsync or manual copy)")
else
  ok "clients/ directory exists"
fi

if [ ! -d "partners" ]; then
  CHECKS+=("  [ ] Sync partners/ from primary machine (rsync or manual copy)")
fi

if [ ! -d "scripts" ]; then
  CHECKS+=("  [ ] Sync scripts/ from primary machine (rsync or manual copy)")
else
  ok "scripts/ directory exists"
fi

if [ ! -f "$HOME/.config/gcp/sheets-service-account.json" ]; then
  CHECKS+=("  [ ] Copy Google Sheets service account to ~/.config/gcp/sheets-service-account.json")
fi

CHECKS+=("  [ ] Verify MCP servers connect in Cursor (restart Cursor after config copy)")
CHECKS+=("  [ ] Review .env.example for any missing API keys")

if [ ${#CHECKS[@]} -gt 0 ]; then
  for check in "${CHECKS[@]}"; do
    echo "$check"
  done
fi

echo ""
echo "Run image gen scripts with:  source .venv/bin/activate && python3 content/images/_gen_<name>.py"
echo "Run website dev server with: cd website && npm run dev"
echo ""
