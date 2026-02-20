#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# validate_feeds.sh — RSS feed health checker
#
# Curls every feed endpoint across all three sites, validates HTTP
# status, XML well-formedness, and required RSS elements.
#
# Usage:
#   ./scripts/validate_feeds.sh              # check production feeds
#   ./scripts/validate_feeds.sh --local      # check localhost:3000/3001/3002
#   ./scripts/validate_feeds.sh --quiet      # suppress per-feed details
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

QUIET=false
LOCAL=false

for arg in "$@"; do
  case "$arg" in
    --quiet) QUIET=true ;;
    --local) LOCAL=true ;;
  esac
done

if $LOCAL; then
  SHAWNOS="http://localhost:3000"
  GTMOS="http://localhost:3001"
  CONTENTOS="http://localhost:3002"
else
  SHAWNOS="https://shawnos.ai"
  GTMOS="https://thegtmos.ai"
  CONTENTOS="https://thecontentos.ai"
fi

FEEDS=(
  "$SHAWNOS/feed.xml|shawnos|blog"
  "$SHAWNOS/feed/all.xml|shawnos|all"
  "$SHAWNOS/feed/knowledge.xml|shawnos|knowledge"
  "$SHAWNOS/feed/how-to.xml|shawnos|how-to"
  "$SHAWNOS/feed/nio-terminal.xml|shawnos|nio-terminal"
  "$SHAWNOS/feed/daily-logs.xml|shawnos|daily-logs"
  "$GTMOS/feed.xml|gtmos|main"
  "$GTMOS/feed/clay-wiki.xml|gtmos|clay-wiki"
  "$GTMOS/feed/knowledge.xml|gtmos|knowledge"
  "$CONTENTOS/feed.xml|contentos|main"
  "$CONTENTOS/feed/content-wiki.xml|contentos|content-wiki"
)

PASS=0
FAIL=0
WARN=0
RESULTS=()

validate_feed() {
  local url="$1" site="$2" label="$3"
  local status body item_count has_channel has_rss content_type

  local http_response
  http_response=$(curl -sSL -w "\n%{http_code}\n%{content_type}" \
    --max-time 15 "$url" 2>/dev/null) || {
    RESULTS+=("FAIL  $site/$label — connection error ($url)")
    FAIL=$((FAIL + 1))
    return
  }

  content_type=$(echo "$http_response" | tail -1)
  status=$(echo "$http_response" | tail -2 | head -1)
  body=$(echo "$http_response" | sed '$d' | sed '$d')

  if [[ "$status" != "200" ]]; then
    RESULTS+=("FAIL  $site/$label — HTTP $status ($url)")
    FAIL=$((FAIL + 1))
    return
  fi

  if ! echo "$body" | xmllint --noout - 2>/dev/null; then
    RESULTS+=("FAIL  $site/$label — invalid XML ($url)")
    FAIL=$((FAIL + 1))
    return
  fi

  has_rss=$(echo "$body" | grep -c '<rss' || true)
  has_channel=$(echo "$body" | grep -c '<channel>' || true)
  item_count=$(echo "$body" | grep -c '<item>' || true)

  if [[ "$has_rss" -eq 0 || "$has_channel" -eq 0 ]]; then
    RESULTS+=("FAIL  $site/$label — missing <rss> or <channel> element ($url)")
    FAIL=$((FAIL + 1))
    return
  fi

  if [[ "$item_count" -eq 0 ]]; then
    RESULTS+=("WARN  $site/$label — valid RSS but 0 items ($url)")
    WARN=$((WARN + 1))
    return
  fi

  if [[ "$content_type" != *"rss+xml"* && "$content_type" != *"xml"* ]]; then
    RESULTS+=("WARN  $site/$label — unexpected Content-Type: $content_type ($url)")
    WARN=$((WARN + 1))
    return
  fi

  RESULTS+=("PASS  $site/$label — $item_count items")
  PASS=$((PASS + 1))
}

echo "═══ RSS Feed Validation ═══"
echo "Mode: $( $LOCAL && echo 'local' || echo 'production' )"
echo "Feeds: ${#FEEDS[@]}"
echo ""

for entry in "${FEEDS[@]}"; do
  IFS='|' read -r url site label <<< "$entry"
  validate_feed "$url" "$site" "$label"
done

for result in "${RESULTS[@]}"; do
  $QUIET && [[ "$result" == PASS* ]] && continue
  echo "$result"
done

echo ""
echo "── Summary ──────────────────────────────────────────────"
echo "  Pass: $PASS / ${#FEEDS[@]}"
echo "  Warn: $WARN"
echo "  Fail: $FAIL"

if [[ "$FAIL" -gt 0 ]]; then
  echo "  Status: UNHEALTHY"
  exit 1
else
  echo "  Status: HEALTHY"
  exit 0
fi
