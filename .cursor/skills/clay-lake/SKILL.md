---
name: Clay Data Lake
description: Query the local Clay data lake for contacts, companies, and enrichment data. Supports searching, writing copy for qualified contacts, and monitoring webhook health.
trigger: /claylake
---

# Clay Data Lake Skill

Query the local GTM data lake that stores enriched contact and company data from Clay.com webhooks.

## Trigger

The user types `/claylake` optionally followed by a command:

- `/claylake` — Show lake status and recent activity
- `/claylake contacts` — List contacts needing copy (<partner> Vector default)
- `/claylake search <query>` — Search contacts by name, company, or title
- `/claylake company <query>` — Search companies
- `/claylake sql <query>` — Run a raw SQL query against the lake
- `/claylake status` — Show sync health and webhook activity

## Workflow

### Step 1: Parse the command

Extract the subcommand and any arguments from the user's message after `/claylake`.

If no subcommand is provided, default to showing lake status.

### Step 2: Execute the appropriate MCP tool

Use the `clay-data-lake` MCP server tools:

#### Default / Status
```
Call: mcp_clay-data-lake_get_lake_info
```
Display the server status, table row counts, and last sync time.

#### Contacts needing copy (`/claylake contacts`)
```
Call: mcp_clay-data-lake_get_contacts_needing_copy
Parameters:
  source_table: "partner-vector" (default, or user-specified)
  limit: 10
```
Display contacts in a scannable format:
- Name | Title @ Company
- Email | LinkedIn
- Qualification status + reason
- Personalization notes (if any)

#### Search contacts (`/claylake search <query>`)
```
Call: mcp_clay-data-lake_search_contacts
Parameters:
  query: <user's search term>
  limit: 25
```

#### Search companies (`/claylake company <query>`)
```
Call: mcp_clay-data-lake_search_companies
Parameters:
  query: <user's search term>
  limit: 25
```

#### SQL query (`/claylake sql <query>`)
```
Call: mcp_clay-data-lake_query_lake
Parameters:
  sql: <user's SQL query>
```

#### Sync status (`/claylake status`)
```
Call: mcp_clay-data-lake_get_sync_status
```
Display recent webhook events with source, record count, and timestamp.

### Step 3: Format the output

Present results in a clean, scannable format. For contacts:

```
## Contacts Needing Copy (<partner> Vector)

### 1. John Smith
- **Title:** VP of Sales @ Acme Corp
- **Email:** john@acme.com
- **LinkedIn:** linkedin.com/in/johnsmith
- **Qualified:** Yes — "High intent visitor, visited pricing 3x"
- **Notes:** Recently promoted, ex-Salesforce

### 2. Jane Doe
...
```

### Step 4: Mark copy written (optional)

After the user writes copy for a contact, mark it as done:
```
Call: mcp_clay-data-lake_mark_copy_written
Parameters:
  contact_id: <the contact's ID>
```

## Error Handling

| Error | Solution |
|-------|----------|
| MCP server not responding | The clay-data-lake MCP server may not be registered. Check `~/.cursor/mcp.json` for the `clay-data-lake` entry. |
| No contacts found | The webhook server may not be running or Clay hasn't sent data yet. Tell the user to run `./start.sh` in `~/clay-data-lake/`. |
| Database locked | Another process may be writing. Retry after a moment. |

## Notes

- The webhook server (`~/clay-data-lake/start.sh`) must be running separately for Clay to push data
- The MCP server starts automatically with Cursor (stdio mode)
- Default source table is `partner-vector` for the <partner> Vector de-anonymization workflow
- All data is stored locally in `~/clay-data-lake/data/gtm-lake.db`
