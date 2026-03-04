# Prospeo - Email Verification

> **Status: Active** - pre-outreach email validation.

Paid email verification service. More accurate than DIY MX + SMTP handshake checks. Validates emails before pushing to Lemlist to protect domain reputation.

## API

- **Base URL:** `https://api.prospeo.io`
- **Auth:** `X-KEY` header with API key
- **Endpoint:** `POST /email-verifier`
- **Request:** `{"email": "test@example.com"}`
- **Response:** `{"response": {"email": "...", "status": "valid|invalid|catch-all|unknown", ...}}`

## Pipeline Integration

- **Script:** `scripts/abm/verify_emails.py`
- **Pipeline step:** `python3 pipeline.py --step verify --limit 50`
- **Runs after:** prospect (contact discovery)
- **Runs before:** generate (landing pages) and lemlist push
- **Writes to:** `contacts.email_status` column (valid/invalid/catch-all/unknown)

## Qualification Gate

- `qualify.py` rejects contacts with `email_status = 'invalid'`
- `push_to_lemlist.py` skips contacts with `email_status = 'invalid'`
- Contacts without verification (email_status is NULL) are allowed through

## Cost

- ~$0.003 per verification
- Budget: verify all contacts before any outreach campaign

## Alternatives Considered

- Free: DNS MX lookup + SMTP RCPT TO check (less accurate, implemented in `validate_emails.py`)
- Apollo's built-in verification (limited on current plan)
