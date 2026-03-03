# /prospect - Run the prospect workflow

Run the full prospecting pipeline for new accounts.

## Steps

1. Check current pipeline state: `python3 scripts/pipeline.py --status`
2. Run research step: `python3 scripts/pipeline.py --step research --limit $ARGUMENTS`
3. Run prospect step: `python3 scripts/pipeline.py --step prospect --limit $ARGUMENTS`
4. Run generate step: `python3 scripts/pipeline.py --step generate --limit $ARGUMENTS`
5. Run sync step: `python3 scripts/pipeline.py --step sync --limit 50`
6. Report results: count new accounts, contacts, and pages created

Default limit is 5 if no argument provided.

NEVER run outreach as part of this workflow.
