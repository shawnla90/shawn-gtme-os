#!/usr/bin/env bash
# verify-analytics.sh
# Post-deploy health check for shawnos.ai analytics stack.
# Exits 0 on full pass, 1 on any failure.

set -uo pipefail

SITE="${SITE:-https://shawnos.ai}"
POSTHOG_KEY="${POSTHOG_READ_KEY:-}"
POSTHOG_PROJECT="${POSTHOG_PROJECT:-325806}"

if [[ -z "$POSTHOG_KEY" ]]; then
  printf "\033[1;31mSet POSTHOG_READ_KEY env var before running (project %s read key, prefixed phx_).\033[0m\n" "$POSTHOG_PROJECT"
  exit 2
fi

MIDBOUND_KEY="Yvy2M9X0v59ygzOV0tP2tNSRyJnzOGyk"

red()   { printf "\033[1;31m%s\033[0m\n" "$*"; }
green() { printf "\033[1;32m%s\033[0m\n" "$*"; }
dim()   { printf "\033[2m%s\033[0m\n" "$*"; }

FAIL=0

echo
echo "╔════════════════════════════════════════════╗"
echo "║  shawnos.ai analytics verification         ║"
echo "╚════════════════════════════════════════════╝"
echo

# 1. Site reachable
status=$(curl -sS -o /dev/null -w "%{http_code}" "$SITE")
if [[ "$status" == "200" ]]; then
  green "✓ 1/4  ${SITE} returned 200"
else
  red   "✗ 1/4  ${SITE} returned ${status}"
  FAIL=1
fi

# 2. PostHog + Midbound scripts present in HTML
html=$(curl -sS "$SITE")
if grep -q "posthog" <<<"$html"; then
  green "✓ 2a/4 PostHog bootstrap present in HTML"
else
  red   "✗ 2a/4 PostHog NOT in HTML (client script missing)"
  FAIL=1
fi
if grep -q "$MIDBOUND_KEY" <<<"$html"; then
  green "✓ 2b/4 Midbound key ${MIDBOUND_KEY:0:12}… present"
else
  red   "✗ 2b/4 Midbound key NOT found in HTML"
  FAIL=1
fi

# 3. PostHog is referenced in at least one shipped JS chunk
chunks=$(curl -sS "$SITE" | grep -oE '_next/static/chunks/[^"]+\.js' | head -20)
found=0
for c in $chunks; do
  cnt=$(curl -sS "$SITE/$c" | grep -oc posthog || true)
  if [[ "${cnt:-0}" != "0" ]]; then
    found=1
    break
  fi
done
if [[ "$found" -eq 1 ]]; then
  green "✓ 3/4  PostHog client SDK bundled into Next.js chunks"
else
  red   "✗ 3/4  PostHog not found in any shipped JS chunk"
  FAIL=1
fi

# 4. Actual pageview events landed in PostHog in the last 15 minutes
query='{"query":{"kind":"HogQLQuery","query":"SELECT count() FROM events WHERE event = '\''$pageview'\'' AND timestamp >= now() - INTERVAL 15 MINUTE"}}'
count=$(curl -sS -X POST "https://us.posthog.com/api/projects/${POSTHOG_PROJECT}/query/" \
  -H "Authorization: Bearer ${POSTHOG_KEY}" \
  -H "Content-Type: application/json" \
  -d "$query" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("results",[[0]])[0][0])' 2>/dev/null || echo "0")

if [[ "${count:-0}" -gt 0 ]]; then
  green "✓ 4/4  PostHog ingested ${count} pageviews in the last 15 minutes"
else
  red   "✗ 4/4  0 pageviews in last 15 minutes (client tracking dead)"
  dim   "        hit the site in a clean browser and re-run this script to verify"
  FAIL=1
fi

echo
if [[ "$FAIL" -eq 0 ]]; then
  green "All 4 checks passed."
  exit 0
else
  red   "Verification FAILED. Fix before claiming the deploy is done."
  exit 1
fi
