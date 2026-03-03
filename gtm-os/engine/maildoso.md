# Maildoso - Sending Infrastructure

> 8 sending accounts across 2 domains. Dedicated sending infrastructure with SPF/DMARC/DKIM.

## Capacity

- **8 accounts x 3 emails/day = 24 emails/day**
- Config: `scripts/maildoso_accounts.json` (gitignored)

## How Rotation Works

- Round-robin across accounts, skipping any that hit their daily limit
- Send counts queried from `email_sends.from_email` per day
- SMTP connections cached per-account within a batch
- Reply checking only scans inboxes with active sends

## DNS Requirements (per domain)

- SPF: configured
- DMARC: configured
- DKIM: check Maildoso dashboard for selector

## Config Format

```json
{
  "smtp_host": "smtp.maildoso.com",
  "smtp_port": 587,
  "imap_host": "imap.maildoso.com",
  "password": "shared_password",
  "sender_name": "Shawn",
  "per_account_daily_limit": 3,
  "accounts": [
    { "email": "shawn@domain1.com", "domain": "domain1.com" }
  ]
}
```

## Legacy Fallback

If `maildoso_accounts.json` doesn't exist, both `outreach.py` and `check_replies.py` fall back to single-account env vars (`SMTP_HOST`/`IMAP_HOST` etc).

## Scripts

- `outreach.py` - sends via SMTP with multi-account rotation
- `check_replies.py` - scans IMAP inboxes for replies, matches via headers, detects opt-outs
