#!/usr/bin/env bash
# Railway start command for the shawnos.ai Next.js app.
# Handles Next.js standalone output inside the npm workspaces monorepo where
# server.js ends up at an unpredictable depth under .next/standalone/.
set -euo pipefail

APP_DIR="website/apps/shawnos"
cd "$APP_DIR"

# find the standalone server.js (path varies in monorepos)
SERVER_JS="$(find .next/standalone -maxdepth 5 -name server.js -type f 2>/dev/null | head -1)"
if [[ -z "$SERVER_JS" ]]; then
  echo "fatal: server.js not found under ${APP_DIR}/.next/standalone/" >&2
  ls -la .next/standalone/ 2>/dev/null >&2 || true
  exit 1
fi

# Next.js standalone does NOT auto-copy static + public. copy once, idempotently.
SERVER_DIR="$(dirname "$SERVER_JS")"
mkdir -p "$SERVER_DIR/.next"
if [[ -d .next/static ]] && [[ ! -d "$SERVER_DIR/.next/static" ]]; then
  cp -R .next/static "$SERVER_DIR/.next/static"
fi
if [[ -d public ]] && [[ ! -d "$SERVER_DIR/public" ]]; then
  cp -R public "$SERVER_DIR/public"
fi

echo "starting next.js standalone server from ${SERVER_JS}" >&2
exec node "$SERVER_JS"
