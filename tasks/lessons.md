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
