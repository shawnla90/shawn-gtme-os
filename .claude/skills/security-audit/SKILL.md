---
name: security-audit
description: Comprehensive security audit of the mission-control app and broader codebase. Scans for auth weaknesses, injection vectors, XSS, secret leaks, missing headers, dependency CVEs, path traversal, and blocklist violations. Outputs findings to data/security-audit.json. Use when the user types /security-audit or asks for a security scan.
---

# Security Audit Skill

Run a full security audit of the codebase. Produce a JSON report with severity counts and details.

---

## Step 1: Auth Audit

Check authentication and session security:

1. **Cookie security** — Verify `mc-auth` cookie uses: `httpOnly: true`, `secure: true` (production), `sameSite: 'strict'`
2. **Password handling** — Confirm the cookie value is NOT the raw password (should be HMAC-signed token format `uuid.hex-signature`)
3. **Rate limiting** — Confirm `/api/auth` has rate limiting (max 5 attempts per 15 min)
4. **CSRF protection** — Confirm POST to `/api/auth` validates Origin matches Host

Files to check:
- `website/apps/mission-control/app/api/auth/route.ts`
- `website/apps/mission-control/middleware.ts`

---

## Step 2: Injection Scan

Search tracked files for dangerous patterns:

```bash
# Shell injection vectors
git ls-files | xargs grep -n 'execSync\b' 2>/dev/null
git ls-files | xargs grep -n 'exec(' 2>/dev/null
git ls-files | xargs grep -n 'eval(' 2>/dev/null

# XSS vectors
git ls-files | xargs grep -n 'dangerouslySetInnerHTML' 2>/dev/null
git ls-files | xargs grep -n 'allowDangerousHtml' 2>/dev/null

# SQL injection — look for string interpolation in SQL (not parameterized)
git ls-files '*.ts' '*.js' | xargs grep -n 'SELECT.*\${' 2>/dev/null
git ls-files '*.ts' '*.js' | xargs grep -n 'INSERT.*\${' 2>/dev/null
git ls-files '*.ts' '*.js' | xargs grep -n 'UPDATE.*\${' 2>/dev/null
git ls-files '*.ts' '*.js' | xargs grep -n 'DELETE.*\${' 2>/dev/null
```

**Severity:** Any `execSync` with string interpolation = CRITICAL. Any `dangerouslySetInnerHTML` without sanitization = CRITICAL.

For `dangerouslySetInnerHTML`: verify the HTML source goes through `rehype-sanitize` before rendering. If it does, downgrade to INFO.

---

## Step 3: Secret Scan

Check tracked files for leaked secrets:

```bash
# API keys and tokens
git ls-files | xargs grep -in 'api.key\|api_key\|apikey\|secret_key\|access_token\|bearer ' 2>/dev/null | grep -v 'node_modules\|\.md\|SKILL\.md\|\.example'

# Passwords in code
git ls-files | xargs grep -in 'password\s*=' 2>/dev/null | grep -v 'node_modules\|\.md\|SKILL\.md\|\.env\.example\|process\.env'

# .env files tracked
git ls-files | grep '\.env$\|\.env\.local$\|\.env\.production$'
```

**Severity:** Any tracked .env file = CRITICAL. API keys in source = HIGH.

---

## Step 4: Header Audit

Verify security headers are configured:

Check `website/apps/mission-control/vercel.json` for:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` (HSTS)
- `Referrer-Policy`
- `Permissions-Policy`
- `Content-Security-Policy`

**Severity:** Missing header = HIGH.

---

## Step 5: Dependency Audit

```bash
cd website && npm audit --json 2>/dev/null
```

Parse output for critical and high severity CVEs.

**Severity:** Map directly from npm audit severity levels.

---

## Step 6: Input Validation Audit

Scan API routes for unvalidated user input:

```bash
# Find all API routes
find website/apps/mission-control/app/api -name 'route.ts' -o -name 'route.js'
```

For each route, check:
- URL params used without validation
- Request body parsed without schema validation
- Query params interpolated into SQL or shell commands

**Severity:** Unvalidated input in SQL/shell = CRITICAL. Unvalidated params = MEDIUM.

---

## Step 7: Path Traversal Scan

```bash
git ls-files '*.ts' '*.js' | xargs grep -n 'path\.join.*req\|path\.join.*params\|path\.resolve.*req\|path\.resolve.*params' 2>/dev/null
```

Check if any user-controlled path segments could escape intended directories.

**Severity:** User-controlled path without validation = HIGH.

---

## Step 8: Blocklist Scan

Reuse the blocklist from `.claude/blocklist.txt`:

```bash
if [ -f .claude/blocklist.txt ]; then
  while IFS= read -r term; do
    [ -z "$term" ] && continue
    git ls-files | xargs grep -il "$term" 2>/dev/null
  done < .claude/blocklist.txt
fi
```

**Severity:** Blocklist term in tracked file = HIGH.

---

## Step 9: Error Message Audit

Check API routes for error messages that leak internal details:

```bash
git ls-files 'website/apps/mission-control/app/api/**/*.ts' | xargs grep -n '(e as Error).message' 2>/dev/null
```

Any error message that includes `(e as Error).message` in a client-facing response (not just `console.error`) = MEDIUM.

---

## Output

Write findings to `data/security-audit.json`:

```json
{
  "timestamp": "2026-02-28T12:00:00Z",
  "summary": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0,
    "info": 0
  },
  "findings": [
    {
      "id": "SEC-001",
      "severity": "critical|high|medium|low|info",
      "category": "auth|injection|secrets|headers|dependencies|input-validation|path-traversal|blocklist|error-leak",
      "title": "Short description",
      "file": "path/to/file.ts",
      "line": 42,
      "details": "Detailed explanation and remediation"
    }
  ]
}
```

If any CRITICAL findings exist, notify via Slack webhook (if `SLACK_WEBHOOK_URL` env var is set):

```bash
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d "{\"text\": \"Security Audit: ${critical_count} CRITICAL findings. Review data/security-audit.json\"}"
```

---

## Standalone Script

For automated cron execution, use `scripts/security_audit.sh` which performs the same checks via grep/static analysis without requiring Claude.
