# Apollo scripts

Standalone, standard-library-only Python scripts against the Apollo.io API. Shared ungated as content receipts.

| Script | What it does |
|---|---|
| `title_search_workflow.py` | Search people by title + seniority + geo + company size (optionally inside a domain list), dedupe, post-filter titles so HR/eng/product roles don't leak, cap per domain, write CSV or SQLite. `--enrich` runs `people/bulk_match` on the survivors only (credits). `--dry-run` prints the payload. |

Setup: `export APOLLO_API_KEY=...` (master API key, or a key with `api_search` access).

Production rules baked in: search before enrich, dedupe before anything, title filter before the cap, cap before credits, look at the rows before the CRM push.
