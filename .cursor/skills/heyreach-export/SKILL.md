---
name: heyreach-export
description: Export HeyReach campaign leads to CSV filtered by connection status. Use when the user types /heyreach-export <filter> (e.g., /heyreach-export unaccepted, /heyreach-export accepted, /heyreach-export all) or asks to export HeyReach leads/contacts to a CSV.
---

# HeyReach Export Command

When the user types `/heyreach-export <filter>`, pull leads from HeyReach campaigns via MCP, filter by connection/message status, and export to CSV.

## Command Pattern

`/heyreach-export <filter>` where `<filter>` is one of:

| Filter | What it returns | HeyReach Status |
|--------|----------------|-----------------|
| `unaccepted` | Connection sent but NOT accepted | `leadConnectionStatus == "ConnectionSent"` |
| `accepted` | Connection accepted | `leadConnectionStatus == "ConnectionAccepted"` |
| `replied` | Leads who replied to messages | `leadMessageStatus == "MessageReply"` |
| `messaged` | Leads who were sent a message | `leadMessageStatus == "MessageSent"` |
| `failed` | Leads that errored out | `leadCampaignStatus == "Failed"` |
| `pending` | Leads not yet contacted | `leadConnectionStatus == "None"` |
| `all` | Every lead, no filter | All statuses |

If no filter is provided, default to `unaccepted`.

## Workflow

### Step 1: Get Campaigns

1. Call `heyreach_get_all_campaigns` with statuses `["IN_PROGRESS", "PAUSED", "FINISHED"]` and `accountIds: []`
2. Display the campaigns found:

```
Found {{count}} campaigns:
1. {{campaign_name}} ({{status}}) - {{totalUsers}} leads
2. {{campaign_name}} ({{status}}) - {{totalUsers}} leads

Exporting from: {{all / specific campaign}}
Filter: {{filter}}
```

3. If only 1 campaign, use it automatically
4. If multiple campaigns, export from ALL campaigns combined (unless user specified a campaign name)

### Step 2: Paginate Through All Leads

For each campaign:

1. Call `heyreach_get_leads_from_campaign` with `campaignId`, `limit: 100`, `offset: 0`
2. Continue paginating (offset += 100) until all leads are fetched
3. Collect all leads into a single list

**Important**: The API returns max 100 leads per call. Always paginate until you've collected all leads matching `progressStats.totalUsers`.

### Step 3: Filter Leads

Apply the requested filter:

```python
# Filter mapping
filters = {
    "unaccepted": lambda l: l.get("leadConnectionStatus") == "ConnectionSent",
    "accepted": lambda l: l.get("leadConnectionStatus") == "ConnectionAccepted",
    "replied": lambda l: l.get("leadMessageStatus") == "MessageReply",
    "messaged": lambda l: l.get("leadMessageStatus") in ["MessageSent", "MessageReply"],
    "failed": lambda l: l.get("leadCampaignStatus") == "Failed",
    "pending": lambda l: l.get("leadConnectionStatus") == "None",
    "all": lambda l: True,
}
```

### Step 4: Write CSV

1. **Target directory**: `clients/partner/elauwit/resources/`
   - If the user specifies a different partner/client path, use that instead
2. **Filename format**: `heyreach-{{filter}}-{{YYYY-MM-DD}}.csv`
   - Example: `heyreach-unaccepted-2026-02-08.csv`
3. **CSV columns**:

| Column | Source Field |
|--------|-------------|
| First Name | `linkedInUserProfile.firstName` |
| Last Name | `linkedInUserProfile.lastName` |
| Email | `linkedInUserProfile.emailAddress` OR `linkedInUserProfile.customEmailAddress` |
| Company | `linkedInUserProfile.companyName` |
| Position | `linkedInUserProfile.position` |
| LinkedIn URL | `linkedInUserProfile.profileUrl` |
| Location | `linkedInUserProfile.location` |
| Connection Status | `leadConnectionStatus` |
| Campaign Status | `leadCampaignStatus` |
| Campaign Name | from campaign lookup |
| Message Status | `leadMessageStatus` |
| Error | `leadCampaignStatusMessage` |
| Created | `creationTime` |
| Failed Time | `failedTime` |

4. Write using Python script via shell:

```python
import json, csv, os
from datetime import datetime

# ... load leads from MCP tool output files ...

# Filter
filtered = [l for l in all_leads if filter_fn(l)]

# Write CSV
date_str = datetime.now().strftime("%Y-%m-%d")
csv_path = f"clients/partner/elauwit/resources/heyreach-{filter_name}-{date_str}.csv"

with open(csv_path, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([...columns...])
    for lead in filtered:
        profile = lead.get('linkedInUserProfile', {})
        writer.writerow([...values...])
```

### Step 5: Display Summary

After export, show:

```
## HeyReach Export Complete

**Filter**: {{filter}}
**Campaigns**: {{campaign_names}}
**Total leads scanned**: {{total}}
**Leads exported**: {{filtered_count}}
**CSV saved**: `{{csv_path}}`

### Status Breakdown:
| Status | Count |
|--------|-------|
| Connection sent (not accepted) | {{count}} |
| Connection accepted | {{count}} |
| Message sent | {{count}} |
| Message replied | {{count}} |
| Failed | {{count}} |
| Pending | {{count}} |

### Preview (first 5):
| Name | Company | Position | Email |
|------|---------|----------|-------|
| {{name}} | {{company}} | {{position}} | {{email}} |
```

## Error Handling

- **No campaigns found**: "No active/paused/finished campaigns found in HeyReach."
- **No leads match filter**: "0 leads match filter '{{filter}}'. Full breakdown: {{status_counts}}. Try `/heyreach-export all` to export everything."
- **MCP connection error**: "Couldn't connect to HeyReach MCP. Check your connection URL in `~/.cursor/mcp.json`."
- **Invalid filter**: "Unknown filter '{{filter}}'. Available filters: unaccepted, accepted, replied, messaged, failed, pending, all"

## Examples

### Export unaccepted connections (default)
```
User: /heyreach-export unaccepted
User: /heyreach-export

→ Pulls all campaigns
→ Paginates through all leads
→ Filters for ConnectionSent (not accepted)
→ Saves to heyreach-unaccepted-2026-02-08.csv
→ Shows summary with counts
```

### Export everyone who accepted
```
User: /heyreach-export accepted

→ Filters for ConnectionAccepted
→ Saves to heyreach-accepted-2026-02-08.csv
```

### Full dump
```
User: /heyreach-export all

→ No filter applied
→ Saves to heyreach-all-2026-02-08.csv
→ Every lead from every campaign
```
