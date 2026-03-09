---
name: heyreach-export
description: Export HeyReach campaign leads to CSV filtered by connection/message status. Use when the user types /heyreach-export <filter>.
---

# HeyReach Export

## Commands

`/heyreach-export <filter>` (default: unaccepted)

| Filter | Matches |
|--------|---------|
| unaccepted | ConnectionSent, not accepted |
| accepted | ConnectionAccepted |
| replied | MessageReply |
| messaged | MessageSent or MessageReply |
| failed | Campaign Failed |
| pending | Connection None |
| all | Everything |

## Workflow

1. **Get campaigns**: `heyreach_get_all_campaigns` (IN_PROGRESS, PAUSED, FINISHED)
2. **Paginate leads**: `heyreach_get_leads_from_campaign` limit 100, offset by 100 until all fetched
3. **Filter** by status field matching
4. **Write CSV** to `clients/partner/<partner>/resources/heyreach-{filter}-{date}.csv`
   - Columns: First Name, Last Name, Email, Company, Position, LinkedIn URL, Location, Connection Status, Campaign Status, Campaign Name, Message Status, Error, Created, Failed Time
5. **Display**: filter used, campaigns, total scanned, exported count, status breakdown, preview of first 5

## Error Handling

- No campaigns: inform user
- No matches: show full breakdown, suggest `/heyreach-export all`
- Invalid filter: list available options
