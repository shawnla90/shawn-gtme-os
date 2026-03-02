# Lessons Learned

> Self-improvement loop for the shawn-gtme-os project.
> After every correction from the user, add a lesson here with date, context, and the rule.
> Review this file at session start. Every lesson is a rule — follow them all.

---

## 2026-02-28: Attio MCP parameter names vary by tool

**Context:** `update_record` uses `record_data` (not `attributes`). `create_note` uses `resource_type` + `record_id` (not `parent_object` + `parent_record_id`). Each MCP tool has its own param names — always check `ToolSearch` before calling.

**Rule:** Before calling any Attio MCP tool for the first time in a session, load it via `ToolSearch` to see the exact parameter schema. Don't assume param names from one tool apply to another.

## 2026-02-28: Attio MCP list entry filtering is broken

**Context:** `filter-list-entries` Modes 3 and 4 (parentRecordId, parentAttributeSlug) return unfiltered results. `get-record-list-memberships` returns `entryId: "unknown"`.

**Rule:** For list entry removal, use soft-remove workflow (stage + outreach_status update + audit note). Don't waste time trying to resolve entry_ids through MCP tools — they're broken. List membership cleanup requires Attio UI or direct API.

## 2026-03-02: MCP create_note double-escapes newlines

**Context:** `mcp__attio__create_note` sends literal `\n` characters instead of actual newlines. Notes render as garbage in Attio UI with visible `\n` everywhere.

**Rule:** Never use MCP create_note for multi-line content. Use the Attio REST API directly (`POST /v2/notes`) with Python urllib or curl — these preserve actual newline characters in JSON payloads. MCP is fine for single-line notes only.

## 2026-03-02: MCP update_record mangles select attribute values on deals

**Context:** Setting `source: "Inbound"` via MCP `update_record` on deals returned an error about invalid stage "MQL" — the tool misinterpreted the select value and tried to apply it to the wrong field.

**Rule:** For deals with custom select attributes, use the REST API directly (`PATCH /v2/objects/deals/records/{id}`). The MCP update_record works for text/date fields but is unreliable for select fields on deals.

## 2026-03-02: Don't guess email domains — check Google Calendar sync

**Context:** We guessed `jesse@clearcoveadvisors.com` based on company name, but Google Calendar sync showed the real email was `jesse@sagemontadvisors.com`. The person had a prior affiliation.

**Rule:** Before creating contact records, check if Google Calendar or Gmail sync has already captured the email. Attio auto-syncs from connected accounts. Don't assume `firstname@companydomain.com` — always verify against synced data first.

## 2026-03-02: Attio REST API requires all fields for attribute creation

**Context:** `POST /v2/objects/{slug}/attributes` requires `description`, `is_required`, `is_unique`, `is_multiselect`, and `config` — not just title/type/slug. Also, select options must be created separately via `POST /attributes/{slug}/options`.

**Rule:** When creating Attio attributes via REST API, always include all required fields. For select types, create the attribute first, then create options in a separate step.
