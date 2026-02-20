---
name: domain-calc
description: Calculate domains and mailboxes needed for cold email campaigns and generate a client-facing infrastructure breakdown. Outputs two recommended options (50/50 and 70/30), cost breakdown, and explanation of why the infrastructure is needed. Use when the user types /domaincalc or asks how many domains/mailboxes they need for a campaign.
---

# Domain & Mailbox Calculator

Generate a client-facing email infrastructure breakdown for any campaign list size.

## Trigger

`/domaincalc` or any question about "how many domains", "how many mailboxes", "infrastructure for X list"

## Required Inputs

Collect from the user. Use defaults where not specified:

| Input | Description | Default |
|-------|-------------|---------|
| **partner_name** | Client/partner name | *required* |
| **list_size** | Total unique contacts | *required* |
| **steps** | Messages per contact in the sequence | 3 |
| **days** | Calendar days to complete the campaign | 30 |
| **domain_to_mailbox** | Ratio of domains to mailboxes | 1:2 |
| **google_limit** | Max sends per Google mailbox per day | 25 |
| **ms_limit** | Conservative Microsoft sends per mailbox per day | 10 |
| **buffer** | Safety buffer for warmup, bounces, replies | 20% |

## InboxKit Pricing (current as of Feb 2026)

| Item | Cost | Billing |
|------|------|---------|
| Domain | $9.80 | Per domain, per year |
| Mailbox | $3.90 | Per mailbox, per month |

Source: InboxKit (inboxkit.com) — the infrastructure provider for campaign domains and mailboxes. Prices are subject to change by InboxKit at any time.

## Calculation Formula

```
total_emails    = list_size × steps
daily_raw       = total_emails / days
daily_buffered  = daily_raw × (1 + buffer)

# Per provider in a split:
provider_daily  = daily_buffered × split_percentage
mailboxes       = ceil(provider_daily / provider_limit)
domains         = ceil(mailboxes / mailboxes_per_domain)
```

## Output: Client-Facing Document

When triggered, generate the FULL document below, filled in with the calculated numbers. This is the deliverable — copy-paste ready for the client.

---

### BEGIN CLIENT DOCUMENT

# Email Campaign Infrastructure Breakdown

**Prepared for:** [partner_name]
**List size:** [list_size] contacts
**Campaign:** [steps]-step sequence over [days] days

---

## Why Dedicated Infrastructure?

Every email provider (Gmail, Outlook, etc.) monitors sending behavior. When too many emails come from a single mailbox or domain in a short window, the provider flags it as spam and throttles delivery — meaning your emails stop reaching inboxes.

To avoid this, each campaign uses **dedicated domains and mailboxes** that send at safe daily volumes. This keeps your emails landing in the primary inbox instead of spam.

**Why Google and Microsoft?**
Google (Gmail/Google Workspace) and Microsoft (Outlook/Microsoft 365) are the only two major email backends that exist. Every corporate and personal inbox routes through one of them. By sending from both Google and Microsoft mailboxes, your campaign:

- Matches the natural mix of how real business email works
- Avoids over-relying on one provider's sending limits
- Maximizes inbox placement across all recipient types

**How the infrastructure works:**
- Each **domain** is a unique sending identity (e.g., `yourcompany-outreach.com`)
- Each domain has **2 mailboxes** (e.g., `katie@` and `michael@`) — this is the 1:2 ratio
- Each mailbox sends a safe number of emails per day: **25/day on Google, 10-15/day on Microsoft**
- More contacts = more mailboxes needed to stay under these limits

---

## The Numbers

**Total emails to deliver:** [list_size] contacts × [steps] messages = **[total_emails] emails**
**Daily volume needed:** [total_emails] / [days] days = **[daily_raw] emails/day**
**With 20% safety buffer:** **[daily_buffered] emails/day**

*(The buffer accounts for warmup ramp time, bounces, and reply handling.)*

---

## Option A: 50/50 Split (Balanced)

Half your volume goes through Google mailboxes, half through Microsoft. Maximum provider diversity.

| | Google | Microsoft | Total |
|---|--------|-----------|-------|
| Daily volume | [google_daily_50] emails/day | [ms_daily_50] emails/day | [daily_buffered] emails/day |
| Mailboxes | [google_boxes_50] | [ms_boxes_50] | **[total_boxes_50]** |
| Domains | [google_domains_50] | [ms_domains_50] | **[total_domains_50]** |

### Cost — Option A

| Item | Calculation | Cost |
|------|-------------|------|
| Domains (annual) | [total_domains_50] domains × $9.80/yr | **$[domain_cost_50_annual]/year** |
| Mailboxes (monthly) | [total_boxes_50] mailboxes × $3.90/mo | **$[mailbox_cost_50_monthly]/month** |

**Upfront (year 1 domains):** $[domain_cost_50_annual]
**Monthly operating cost:** $[mailbox_cost_50_monthly]/month

---

## Option B: 70/30 Google-Heavy (Cost-Efficient)

More volume through Google (higher per-mailbox limit), less through Microsoft. Fewer total mailboxes needed.

| | Google (70%) | Microsoft (30%) | Total |
|---|--------|-----------|-------|
| Daily volume | [google_daily_70] emails/day | [ms_daily_70] emails/day | [daily_buffered] emails/day |
| Mailboxes | [google_boxes_70] | [ms_boxes_70] | **[total_boxes_70]** |
| Domains | [google_domains_70] | [ms_domains_70] | **[total_domains_70]** |

### Cost — Option B

| Item | Calculation | Cost |
|------|-------------|------|
| Domains (annual) | [total_domains_70] domains × $9.80/yr | **$[domain_cost_70_annual]/year** |
| Mailboxes (monthly) | [total_boxes_70] mailboxes × $3.90/mo | **$[mailbox_cost_70_monthly]/month** |

**Upfront (year 1 domains):** $[domain_cost_70_annual]
**Monthly operating cost:** $[mailbox_cost_70_monthly]/month

---

## Side-by-Side Comparison

| | Option A (50/50) | Option B (70/30) |
|---|-----------------|-----------------|
| Total domains | [total_domains_50] | [total_domains_70] |
| Total mailboxes | [total_boxes_50] | [total_boxes_70] |
| Domain cost (annual) | $[domain_cost_50_annual] | $[domain_cost_70_annual] |
| Monthly mailbox cost | $[mailbox_cost_50_monthly] | $[mailbox_cost_70_monthly] |
| Provider diversity | Higher | Moderate |
| Cost efficiency | — | Lower monthly cost |

---

## Important Notes

- **Warmup period:** New mailboxes require 14-21 days of warmup before reaching full daily sending volume. Factor this into your campaign launch timeline.
- **Pricing:** Domain and mailbox costs are provided by InboxKit (inboxkit.com) and are subject to change at any time. The figures above reflect current pricing as of the date of this document.
- **Domains are billed annually.** Once purchased, domains are active for the full year and can be reused across future campaigns.
- **Mailboxes are billed monthly.** Mailbox count can be adjusted up or down as campaign needs change.

---

### END CLIENT DOCUMENT

## Internal Notes (not included in client doc)

### Rounding Rules
- Always round UP (ceil) — can't have half a mailbox
- Always use conservative Microsoft limit (10/day) for all calculations
- Google limit: 25/day

### Calculation Walkthrough for Mixed Splits

```
# 50/50 split
google_daily  = daily_buffered × 0.50
ms_daily      = daily_buffered × 0.50
google_boxes  = ceil(google_daily / 25)
ms_boxes      = ceil(ms_daily / 10)
google_domains = ceil(google_boxes / 2)
ms_domains     = ceil(ms_boxes / 2)

# 70/30 split
google_daily  = daily_buffered × 0.70
ms_daily      = daily_buffered × 0.30
google_boxes  = ceil(google_daily / 25)
ms_boxes      = ceil(ms_daily / 10)
google_domains = ceil(google_boxes / 2)
ms_domains     = ceil(ms_boxes / 2)
```

### Cost Formulas
```
domain_cost_annual   = total_domains × 9.80
mailbox_cost_monthly = total_mailboxes × 3.90
```

### Pricing Update Process
If InboxKit changes pricing, update the two values in the "InboxKit Pricing" table at the top of this skill. All calculations downstream use those values.
