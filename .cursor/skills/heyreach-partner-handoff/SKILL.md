---
name: heyreach-partner-handoff
description: Orchestrates HeyReach campaign export → Slack → Contax handoff for partner campaigns. Uses HeyReach MCP to pull accepted and unaccepted CSVs, runs deep research on accepted, routes to caller, uploads to Slack, and drafts Contax message. Use when the user says "heyreach handoff", "<partner> heyreach", "HeyReach export for <contact>", or asks to run the full HeyReach → partner handoff workflow.
---

# HeyReach Partner Handoff

Orchestrates the full HeyReach campaign → partner handoff: pull accepted + unaccepted CSVs via MCP, run deep research on accepted (LinkedIn recon), route to caller for calls, upload to Slack, and draft the Contax message.

This is a **multi-workflow** — it chains skills (heyreach-export, linkedin-recon) and scripts (upload_heyreach_to_slack.py) into one play.

## Command Pattern

- `heyreach handoff` — run full handoff for default partner
- `heyreach handoff <partner>` — run for specific partner (e.g., acme)
- Also: "<partner> heyreach", "HeyReach export for <contact>", "run the HeyReach → partner handoff"

## Workflow Overview

```
HeyReach MCP → accepted + unaccepted CSV
     ↓
Accepted → deep research (/linkedin-recon) → RECON-REPORT → route to caller for calls
Unaccepted → CSV only (at least you have context)
     ↓
Upload to Slack (optional) → draft Contax message for partner contact
```

## Step 1: Export Accepted + Unaccepted

1. Run `/heyreach-export accepted` for the partner's campaign(s)
2. Run `/heyreach-export unaccepted` for the partner's campaign(s)
3. CSVs save to `clients/partner/<partner>/resources/exports/`
   - `heyreach-accepted-YYYY-MM-DD.csv`
   - `heyreach-unaccepted-YYYY-MM-DD.csv`

**Master accepted list**: If a new export adds people not in the initial list, merge into a master: `heyreach-accepted-master-YYYY-MM-DD.csv`. Unaccepted: latest export only (older ones superseded).

## Step 2: Deep Research on Accepted (Optional but Recommended)

For accepted leads — route to caller with full context:

1. Run `/linkedin-recon accepted` (uses most recent heyreach-accepted-*.csv in partner resources)
2. Recon outputs: `clients/partner/<partner>/resources/recon/RECON-REPORT-YYYY-MM-DD.md`
3. Caller gets: accepted list + recon report (recent posts, activity, personalization hooks)

**Token note**: Don't recon every accepted lead in one agent session if the list is large. Batch or run linkedin-recon separately, then hand off.

## Step 3: Upload to Slack (Optional)

1. Ensure CSVs exist in `clients/partner/<partner>/resources/exports/`
2. Run: `python clients/partner/<partner>/workflows/upload_heyreach_to_slack.py`
3. Requires: `SLACK_BOT_TOKEN` env var, `files:write` scope on Slack app
4. Sends: summary message + accepted CSV + unaccepted CSV to partner channel (e.g., #rp-<partner>)

See `clients/partner/<partner>/workflows/heyreach-slack-export.md` for full setup.

## Step 4: Draft Contax Message

Create `clients/partner/<partner>/resources/contax-<contact>-YYYY-MM-DD.md`:

- State which CSVs to use (unaccepted: latest only; accepted: master if merged)
- List files to attach
- Keep message concise; partner can ask follow-ups

**Example structure** (from acme):
```
Hi [Contact],

Attached is the new unaccepted CSV from today's export. [Clarify: disregard older unaccepted.]

For accepted: [Master list vs initial list clarification]. Use the attached master accepted list as single source of truth.

Files attached:
1. heyreach-unaccepted-YYYY-MM-DD.csv
2. heyreach-accepted-master-YYYY-MM-DD.csv (or heyreach-accepted-*.csv)
```

## Partner-Specific Defaults

| Partner | Contact | Slack Channel | Workflow Path |
|---------|---------|---------------|---------------|
| acme | <contact> (Contax) | #rp-acme | clients/partner/acme/workflows/heyreach-slack-export.md |

## Integration with Other Skills

- **heyreach-export**: Pulls CSVs via HeyReach MCP
- **linkedin-recon**: Deep research on accepted (browser-based, extracts posts/activity)
- **slack-mcp**: Alternative to upload script — can post directly via MCP
- **play-draft** / **skill-play**: Document this play as content ("gtm plays i use every day, part 16 ⚡")

## Error Handling

- **No campaigns found**: Run HeyReach MCP `get_all_campaigns`; if empty, inform user
- **No accepted/unaccepted leads**: Export returns 0 — still hand off empty CSVs with note
- **Upload script fails**: Check SLACK_BOT_TOKEN, files:write scope; fall back to manual share

## Notes

- This is a **v2 play** — MCP + Cursor orchestration, evolving from Clay-heavy workflows. Not losing Clay; adding MCP/Cursor.
- Accepted = deep research → caller. Unaccepted = at least more context than nothing.
- The skill chains multiple tools; each step can run standalone if needed.
