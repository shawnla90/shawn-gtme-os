# Lessons Learned

> Self-improvement loop for the shawn-gtme-os project.
> After every correction from the user, add a lesson here with date, context, and the rule.
> Review this file at session start. Every lesson is a rule — follow them all.

---

## 2026-03-03: Shared package dependency management
- **Never add heavy SDK packages (`ai`, `@ai-sdk/react`) as direct dependencies in the shared package.** They corrupt the lockfile and break Tailwind v4 CSS generation across all apps. Use peerDependencies instead.
- **Always check CSS renders visually after dependency changes**, not just that the build passes. A clean build does not mean the site looks right.
- **Tailwind v4 auto-content detection doesn't scan monorepo shared packages.** Use inline styles for shared components that need to work across all apps.
- **After `npm install` changes, verify the site visually before moving on.** Don't trust build-pass alone.

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

**Context:** We guessed an email based on company name, but Google Calendar sync showed the real email was from a different domain. The person had a prior affiliation.

**Rule:** Before creating contact records, check if Google Calendar or Gmail sync has already captured the email. Attio auto-syncs from connected accounts. Don't assume `firstname@companydomain.com` — always verify against synced data first.

## 2026-03-03: Anti-slop generation failures in blog content

**Context:** Blog post "input, output, ownership" passed generation with 4+ anti-slop violations that should have been caught. Narrator setups ("here's what most people get wrong"), triple parallel sentences ("the infrastructure is mine. the brand is mine. the compounding is mine."), artificial drama setups ("something weird happened after"), and false dichotomy framing ("it's not about X, it's about Y").

**Rule:** Before finalizing ANY content, run explicit validation pass:
1. Scan for "here's what" / "here's where" / "here's the thing" / "here's why" openers. Cut all.
2. Scan for 3+ consecutive sentences with the same structure. Collapse to 1-2.
3. Scan for "something [adjective] happened" setups. Replace with the actual event.
4. Scan for "it's not X, it's Y" / "it's not about X, it's about Y". Delete the "not X" portion, just state Y.
5. Scan for "this is the part where" / "this is where" / "and that's when" framing. Delete entirely.
If catching 3+ patterns, the generation approach needs tightening, not just the validation.

## 2026-03-03: Always verify Vercel project linkage before deploying

**Context:** Chat widget deployed but API returned "API key missing" in production. Root cause: local CLI was linked to `shawnos` (wrong project) instead of `shawnos-site` (the one serving shawnos.ai). Env vars were added to the wrong project.

**Rule:** Before any Vercel deploy/env-var operation:
1. Run `cat .vercel/project.json` to check which project is linked
2. Run `vercel project ls` to see all projects and match domains
3. If wrong project: `vercel link --yes --project <correct-name>`
4. After adding env vars mid-deploy, always `vercel redeploy` to pick them up

## 2026-03-16: Never commit outreach drafts or files containing personal names to GitHub

**Context:** Pushed a LinkedIn DM draft with a prospect's full name in the filename and content to GitHub. This violates the safety principle of not pushing person-identifiable data.

**Rule:** Outreach drafts with real names should never be committed to the repo. Keep them local-only or use anonymized filenames. The pre-push blocklist covers partner/client names but not ad-hoc outreach targets. When in doubt, don't commit content with someone's real name.

---

## 2026-03-02: Attio REST API requires all fields for attribute creation

**Context:** `POST /v2/objects/{slug}/attributes` requires `description`, `is_required`, `is_unique`, `is_multiselect`, and `config` — not just title/type/slug. Also, select options must be created separately via `POST /attributes/{slug}/options`.

**Rule:** When creating Attio attributes via REST API, always include all required fields. For select types, create the attribute first, then create options in a separate step.
