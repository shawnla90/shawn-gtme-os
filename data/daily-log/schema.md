# Daily Log Schema

Single source of truth for daily activity tracking — accomplishments, pipeline state, TODOs, and git activity. One JSON file per day. Used by the scanner script and (later) a visual dashboard.

## File location

- **Output directory**: `data/daily-log/`
- **Naming**: `YYYY-MM-DD.json` (one file per day)
- **Dashboard images**: `YYYY-MM-DD.png` (generated on demand)
- **Schema version**: 1

## JSON shape

```json
{
  "date": "YYYY-MM-DD",
  "generated_at": "ISO 8601 datetime with timezone",
  "version": 1,
  "accomplishments": [
    {
      "type": "string — see type codes below",
      "title": "string — human-readable label",
      "path": "string (optional) — repo-relative file path",
      "source": "auto | manual"
    }
  ],
  "pipeline": {
    "drafts_active": [
      {
        "platform": "string — linkedin | x | substack | tiktok | reddit",
        "title": "string — slug or human label",
        "path": "string — repo-relative path to draft file",
        "target_date": "string (optional) — YYYY-MM-DD from filename"
      }
    ],
    "finalized_today": [
      {
        "platform": "string",
        "path": "string"
      }
    ]
  },
  "todos": [
    {
      "id": "string — t1, t2, etc.",
      "task": "string — what needs doing",
      "status": "pending | done",
      "priority": "high | normal | low (default: normal)"
    }
  ],
  "git_summary": {
    "commits_today": "number",
    "files_added": ["string — repo-relative paths"],
    "files_modified": ["string — repo-relative paths"]
  }
}
```

## Accomplishment type codes

| Type | Meaning |
|------|---------|
| `substack_draft` | New or updated Substack draft |
| `substack_final` | Substack post finalized |
| `linkedin_draft` | New or updated LinkedIn draft |
| `linkedin_final` | LinkedIn post finalized |
| `x_draft` | New or updated X draft |
| `x_final` | X post finalized |
| `tiktok_draft` | New or updated TikTok script |
| `tiktok_final` | TikTok script finalized |
| `reddit_draft` | New or updated Reddit draft |
| `reddit_final` | Reddit post finalized |
| `lead_magnet` | Lead magnet content created/updated |
| `skill_created` | New Cursor skill created |
| `skill_updated` | Existing skill updated |
| `workflow_updated` | Workflow index updated |
| `script` | New or updated Python/JS script |
| `manual` | Manually logged accomplishment (non-repo) |

## Field meanings

| Field | Meaning |
|-------|---------|
| `date` | The calendar day this log covers. |
| `generated_at` | When the scanner last ran for this day. |
| `version` | Schema version for future compatibility. |
| `accomplishments` | List of things done. Auto-detected from git + manually added. |
| `accomplishments[].source` | `auto` = detected by scanner from git. `manual` = added via `/tracker add`. |
| `pipeline.drafts_active` | All files currently in `content/*/drafts/` across platforms. Snapshot at scan time. |
| `pipeline.drafts_active[].target_date` | Extracted from filename prefix `YYYY-MM-DD_`. Helps prioritize what's due soon. |
| `pipeline.finalized_today` | Files that appeared in `content/*/final/` in today's git commits. |
| `todos` | Task list. Persists across scanner runs — scanner never deletes manual TODOs. |
| `todos[].id` | Short ID for referencing in `/tracker done <id>`. Auto-incremented as `t1`, `t2`, etc. |
| `git_summary` | Raw git activity for the day. Files are repo-relative paths. |

## Merge behavior

The scanner preserves all `source: "manual"` accomplishments and all `todos` entries when re-running. Auto-detected accomplishments are refreshed each run. This means:

- Safe to run the scanner multiple times per day
- Manual entries survive re-scans
- TODO status changes (done/pending) are preserved
- Auto entries reflect the latest git state

## Notes

- Paths are always repo-relative (e.g., `content/substack/drafts/2026-02-14_cursor-discovery.md`).
- The scanner script is `scripts/daily_scan.py`. The dashboard script is `scripts/daily_dashboard.py`.
- Dashboard images are generated on demand, not on every scan.
