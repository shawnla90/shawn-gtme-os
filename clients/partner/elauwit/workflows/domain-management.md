# Domain Management — Elauwit

## Current Infrastructure (Q1 2026)

### Active
- **Domains**: 18
- **Mailboxes**: 36 (2 per domain)
- **Sender personas**: SDR-only (transitioning)

### Sunsetting
- **CEO/CTO mailboxes**: 18 mailboxes being retired
- **Reason**: Moving all sends to SDR personas only

### Incoming
- **AE accounts**: 2 new AE sender personas
- **Minimum**: 18 new domains / 36 mailboxes
- **Recommended**: 36 new domains / 72 mailboxes
- **Status**: Need to purchase and begin warmup

## Domain Warmup Process

### Step 1: Purchase
- Buy domains (variations on brand-adjacent names)
- Avoid exact match to primary domain
- Mix TLDs if needed

### Step 2: Setup
- 2 mailboxes per domain (standard)
- Configure SPF, DKIM, DMARC
- Connect to Instantly

### Step 3: Warmup
- Begin automated warmup in Instantly
- Monitor daily:
  - Send volume ramp
  - Bounce rate
  - Spam complaints
  - Inbox placement rate

### Step 4: Graduation
- Warmup threshold met → move to live campaign pool
- Start with low volume, scale up over 2 weeks

### Step 5: Monitoring
- Ongoing deliverability monitoring via Instantly
- Rotate underperforming domains
- Replace burned domains immediately

## Mailbox Math

| Persona | Domains | Mailboxes | Status |
|---------|---------|-----------|--------|
| SDR (current) | 18 | 36 | Active |
| CEO/CTO (sunset) | 18 | 18 | Retiring |
| AE (minimum) | 18 | 36 | Planned |
| AE (recommended) | 36 | 72 | Recommended |

## Rotation Rules

<!-- Document specific rotation cadences, daily send limits per mailbox, and rest periods here -->
