# Mission Control - File Map

> This file is the canonical reference for mission control paths.
> Nio and any agent that updates mission control MUST read this first.

## Architecture

Mission Control is a **Next.js app** inside the monorepo, NOT a standalone markdown file.

### Paths That Matter

| What | Path |
|------|------|
| **App source** | `website/apps/mission-control/` |
| **Main page** | `website/apps/mission-control/app/page.tsx` |
| **API routes** | `website/apps/mission-control/app/api/` |
| **Static metrics** | `website/apps/mission-control/public/metrics.json` |
| **Metrics generator** | `website/apps/mission-control/scripts/generate-metrics.js` |
| **Python updater** | `scripts/mission_control_updater.py` |
| **Status snapshots** | `data/mission-control/` |

### How Updates Actually Work

1. `scripts/mission_control_updater.py` generates enhanced data to `/tmp/mission_control_enhanced.json`
2. `website/apps/mission-control/scripts/generate-metrics.js` pulls git stats and writes `public/metrics.json`
3. The Next.js app reads `public/metrics.json` at build time and via API routes
4. Vercel deploys the app when changes are pushed

### To Update Mission Control

**DO NOT** try to read or write `~/shawn-gtme-os/mission-control.md` as a data source.

Instead:
1. Run `python3 scripts/mission_control_updater.py` to refresh `/tmp/mission_control_enhanced.json`
2. Run `node website/apps/mission-control/scripts/generate-metrics.js` to update `public/metrics.json`
3. Commit and push to trigger Vercel deploy
4. Write status snapshots to `data/mission-control/` for persistence

### Status Snapshot Format

Save periodic status updates to `data/mission-control/` as markdown:
- `nio-status-update.md` - latest status
- Use ISO date prefix for historical: `2026-02-19-status.md`

### Common Mistakes

- Reading `mission-control.md` from repo root (this file is a map, not data)
- Writing metrics to the wrong `/tmp/` path
- Forgetting to run `generate-metrics.js` before deploy
- Not committing `public/metrics.json` changes
