#!/usr/bin/env bash
# security_audit.sh — Standalone security audit for cron execution
# Runs static analysis checks without requiring Claude.
# Output: data/security-audit.json
# Usage: bash scripts/security_audit.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

REPORT_FILE="$REPO_ROOT/data/security-audit.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Counters
critical=0
high=0
medium=0
low=0
info=0
findings="[]"

add_finding() {
  local severity="$1" category="$2" title="$3" file="${4:-}" line="${5:-0}" details="${6:-}"

  case "$severity" in
    critical) critical=$((critical + 1)) ;;
    high)     high=$((high + 1)) ;;
    medium)   medium=$((medium + 1)) ;;
    low)      low=$((low + 1)) ;;
    info)     info=$((info + 1)) ;;
  esac

  local id
  id=$(printf "SEC-%03d" $((critical + high + medium + low + info)))

  # Escape strings for JSON
  title=$(echo "$title" | sed 's/"/\\"/g')
  details=$(echo "$details" | sed 's/"/\\"/g')
  file=$(echo "$file" | sed 's/"/\\"/g')

  findings=$(echo "$findings" | python3 -c "
import sys, json
f = json.load(sys.stdin)
f.append({
  'id': '$id',
  'severity': '$severity',
  'category': '$category',
  'title': '$title',
  'file': '$file',
  'line': $line,
  'details': '$details'
})
print(json.dumps(f))
")
}

echo "=== Security Audit: $TIMESTAMP ==="

# --- Check 1: Shell injection vectors (execSync with string interpolation) ---
echo "[1/8] Scanning for shell injection vectors..."
while IFS=: read -r file line_content; do
  if echo "$line_content" | grep -q 'execSync\s*(.*`\|execSync\s*(\s*".*\$\|execSync\s*(\s*'"'"'.*\$'; then
    add_finding "critical" "injection" "execSync with string interpolation" "$file" "0" "Shell command built with string interpolation — use execFileSync instead"
  fi
done < <(git ls-files '*.ts' '*.js' | xargs grep -n 'execSync' 2>/dev/null || true)

# Check for eval()
eval_hits=$(git ls-files '*.ts' '*.js' '*.tsx' | xargs grep -ln 'eval(' 2>/dev/null | grep -v 'node_modules\|\.config\.' || true)
if [ -n "$eval_hits" ]; then
  while IFS= read -r f; do
    add_finding "critical" "injection" "eval() usage detected" "$f" "0" "eval() can execute arbitrary code"
  done <<< "$eval_hits"
fi

# --- Check 2: XSS vectors ---
echo "[2/8] Scanning for XSS vectors..."
xss_hits=$(git ls-files '*.tsx' '*.ts' '*.jsx' '*.js' | xargs grep -ln 'allowDangerousHtml' 2>/dev/null | grep -v 'node_modules' || true)
if [ -n "$xss_hits" ]; then
  while IFS= read -r f; do
    add_finding "high" "injection" "allowDangerousHtml flag set" "$f" "0" "Dangerous HTML allowed — verify rehype-sanitize is in pipeline"
  done <<< "$xss_hits"
fi

innerHTML_hits=$(git ls-files '*.tsx' '*.jsx' | xargs grep -ln 'dangerouslySetInnerHTML' 2>/dev/null | grep -v 'node_modules' || true)
if [ -n "$innerHTML_hits" ]; then
  while IFS= read -r f; do
    add_finding "medium" "injection" "dangerouslySetInnerHTML usage" "$f" "0" "Verify HTML source is sanitized before rendering"
  done <<< "$innerHTML_hits"
fi

# --- Check 3: Secret scan ---
echo "[3/8] Scanning for leaked secrets..."
tracked_env=$(git ls-files | grep -E '\.env$|\.env\.local$|\.env\.production$' || true)
if [ -n "$tracked_env" ]; then
  while IFS= read -r f; do
    add_finding "critical" "secrets" "Tracked .env file" "$f" "0" "Environment file is tracked in git — remove with git rm --cached"
  done <<< "$tracked_env"
fi

secret_hits=$(git ls-files '*.ts' '*.js' '*.tsx' '*.jsx' '*.py' | xargs grep -in 'api.key\|api_key\|apikey\|secret_key\|access_token' 2>/dev/null | grep -v 'node_modules\|\.md\|SKILL\.md\|\.example\|process\.env\|os\.environ\|getenv' || true)
if [ -n "$secret_hits" ]; then
  count=$(echo "$secret_hits" | wc -l | tr -d ' ')
  add_finding "high" "secrets" "Possible hardcoded secrets ($count occurrences)" "" "0" "Review matches for actual secret values vs. variable names"
fi

# --- Check 4: Security headers ---
echo "[4/8] Checking security headers..."
VERCEL_JSON="website/apps/mission-control/vercel.json"
if [ -f "$VERCEL_JSON" ]; then
  for header in "X-Frame-Options" "X-Content-Type-Options" "Strict-Transport-Security" "Referrer-Policy" "Permissions-Policy" "Content-Security-Policy"; do
    if ! grep -q "$header" "$VERCEL_JSON" 2>/dev/null; then
      add_finding "high" "headers" "Missing security header: $header" "$VERCEL_JSON" "0" "Add $header to vercel.json headers configuration"
    fi
  done
else
  add_finding "high" "headers" "vercel.json not found" "$VERCEL_JSON" "0" "Security headers cannot be verified"
fi

# --- Check 5: Dependency audit ---
echo "[5/8] Running npm audit..."
if [ -d "website" ]; then
  audit_output=$(cd website && npm audit --json 2>/dev/null || true)
  if [ -n "$audit_output" ]; then
    audit_critical=$(echo "$audit_output" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('metadata',{}).get('vulnerabilities',{}).get('critical',0))" 2>/dev/null || echo "0")
    audit_high=$(echo "$audit_output" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('metadata',{}).get('vulnerabilities',{}).get('high',0))" 2>/dev/null || echo "0")

    if [ "$audit_critical" -gt 0 ] 2>/dev/null; then
      add_finding "critical" "dependencies" "npm audit: $audit_critical critical vulnerabilities" "package.json" "0" "Run npm audit fix or update affected packages"
    fi
    if [ "$audit_high" -gt 0 ] 2>/dev/null; then
      add_finding "high" "dependencies" "npm audit: $audit_high high vulnerabilities" "package.json" "0" "Run npm audit fix or update affected packages"
    fi
  fi
fi

# --- Check 6: Error message leaks ---
echo "[6/8] Checking for error message leaks..."
error_leaks=$(git ls-files 'website/apps/mission-control/app/api/**/*.ts' | xargs grep -n '(e as Error).message' 2>/dev/null | grep -v 'console\.\(error\|warn\|log\)' || true)
if [ -n "$error_leaks" ]; then
  count=$(echo "$error_leaks" | wc -l | tr -d ' ')
  add_finding "medium" "error-leak" "Error details exposed to client ($count occurrences)" "" "0" "Use console.error for details, return generic message to client"
fi

# --- Check 7: Path traversal ---
echo "[7/8] Scanning for path traversal risks..."
path_hits=$(git ls-files '*.ts' '*.js' | xargs grep -n 'path\.\(join\|resolve\).*\(req\|params\|searchParams\)' 2>/dev/null | grep -v 'node_modules' || true)
if [ -n "$path_hits" ]; then
  count=$(echo "$path_hits" | wc -l | tr -d ' ')
  add_finding "medium" "path-traversal" "User input in path operations ($count occurrences)" "" "0" "Verify path cannot escape intended directory"
fi

# --- Check 8: Blocklist scan ---
echo "[8/8] Running blocklist scan..."
BLOCKLIST=".claude/blocklist.txt"
if [ -f "$BLOCKLIST" ]; then
  blocklist_violations=0
  while IFS= read -r term; do
    [ -z "$term" ] && continue
    [[ "$term" == \#* ]] && continue
    hits=$(git ls-files | xargs grep -il "$term" 2>/dev/null | grep -v 'node_modules\|blocklist\.txt' || true)
    if [ -n "$hits" ]; then
      blocklist_violations=$((blocklist_violations + 1))
      first_file=$(echo "$hits" | head -1)
      add_finding "high" "blocklist" "Blocklist term found in tracked files" "$first_file" "0" "Term from blocklist detected — review and remove"
    fi
  done < "$BLOCKLIST"
else
  add_finding "info" "blocklist" "No blocklist file found" "$BLOCKLIST" "0" "Create .claude/blocklist.txt with sensitive terms"
fi

# --- Write report ---
echo ""
echo "=== Results ==="
echo "Critical: $critical | High: $high | Medium: $medium | Low: $low | Info: $info"

mkdir -p "$(dirname "$REPORT_FILE")"

python3 -c "
import json, sys

report = {
  'timestamp': '$TIMESTAMP',
  'summary': {
    'critical': $critical,
    'high': $high,
    'medium': $medium,
    'low': $low,
    'info': $info
  },
  'findings': json.loads('''$findings''')
}
with open('$REPORT_FILE', 'w') as f:
  json.dump(report, f, indent=2)
print(f'Report written to $REPORT_FILE')
"

# --- Slack notification on critical findings ---
if [ "$critical" -gt 0 ] && [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
  curl -s -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d "{\"text\": \"Security Audit: $critical CRITICAL, $high HIGH findings. Review data/security-audit.json\"}" \
    > /dev/null 2>&1 || true
  echo "Slack notification sent."
fi

echo "=== Audit complete ==="
