# MCP Server Registry — GTM OS

Current inventory of all MCP servers configured across machines. Reference for setup, troubleshooting, and machine mirroring.

**Config location**: `~/.cursor/mcp.json` (global, per-machine)

## Server Inventory

### 1. Slack — Lead Alchemy Workspace

| Field | Value |
|-------|-------|
| **Key** | `slack-lead-alchemy` |
| **Type** | npx (command-based) |
| **Package** | `@modelcontextprotocol/server-slack` |
| **Auth** | Bot Token (`SLACK_BOT_TOKEN`) + Team ID (`SLACK_TEAM_ID`) |
| **Used by** | `/slack-mcp`, `/slack-sync`, `/slack-reminder`, `/partner-comms` |
| **Token source** | Slack App → OAuth & Permissions → Bot User OAuth Token |

### 2. Slack — RevPartners Workspace

| Field | Value |
|-------|-------|
| **Key** | `slack-revpartners` |
| **Type** | npx (command-based) |
| **Package** | `@modelcontextprotocol/server-slack` |
| **Auth** | Bot Token (`SLACK_BOT_TOKEN`) + Team ID (`SLACK_TEAM_ID`) |
| **Used by** | `/slack-mcp`, `/slack-sync`, `/partner-comms` |
| **Token source** | Separate Slack App install for RevPartners workspace |

### 3. GitHub

| Field | Value |
|-------|-------|
| **Key** | `github` |
| **Type** | npx (command-based) |
| **Package** | `@modelcontextprotocol/server-github` |
| **Auth** | Personal Access Token (`GITHUB_PERSONAL_ACCESS_TOKEN`) |
| **Used by** | `/update-github`, PR/issue operations |
| **Token source** | GitHub → Settings → Developer Settings → Personal Access Tokens |

### 4. Instantly

| Field | Value |
|-------|-------|
| **Key** | `instantly` |
| **Type** | Python venv (command-based) |
| **Package** | Local install at `~/instantly-mcp/` |
| **Auth** | API Key (`INSTANTLY_API_KEY`) |
| **Used by** | `/instantly-replies`, email campaign management |
| **Token source** | Instantly dashboard → Settings → API |
| **Setup note** | Requires local clone + Python venv. Path: `~/instantly-mcp/.venv/bin/python` |

### 5. HeyReach

| Field | Value |
|-------|-------|
| **Key** | `heyreach` |
| **Type** | HTTP (remote) |
| **URL** | `https://mcp.heyreach.io/mcp?xMcpKey=<key>` |
| **Auth** | MCP Key embedded in URL |
| **Used by** | `/heyreach-export`, `/heyreach-conversations`, `/heyreach-partner-handoff` |
| **Token source** | HeyReach dashboard → MCP integration |

### 6. Browserbase

| Field | Value |
|-------|-------|
| **Key** | `browserbase` |
| **Type** | npx (command-based) |
| **Package** | `@browserbasehq/mcp-server-browserbase` |
| **Auth** | API Key (`BROWSERBASE_API_KEY`) + Project ID (`BROWSERBASE_PROJECT_ID`) + Gemini Key (`GEMINI_API_KEY`) |
| **Used by** | `/linkedin-recon`, browser automation tasks |
| **Token source** | Browserbase dashboard → API Keys |

### 7. Figma

| Field | Value |
|-------|-------|
| **Key** | `figma` |
| **Type** | HTTP (remote) |
| **URL** | `https://mcp.figma.com/mcp` |
| **Auth** | OAuth (browser-based, no stored key) |
| **Used by** | Design reference, component inspection |
| **Setup note** | Authenticates via browser on first use. No secrets to manage. |

### 8. Notion

| Field | Value |
|-------|-------|
| **Key** | `notion` |
| **Type** | HTTP (remote) |
| **URL** | `https://mcp.notion.com/mcp` |
| **Auth** | OAuth (browser-based, no stored key) |
| **Used by** | `/notion-sync` |
| **Setup note** | Authenticates via browser on first use. No secrets to manage. |

### 9. ClickUp

| Field | Value |
|-------|-------|
| **Key** | `clickup` |
| **Type** | HTTP (remote) |
| **URL** | `https://mcp.clickup.com/mcp` |
| **Auth** | OAuth (browser-based, no stored key) |
| **Used by** | `/partner-onboard`, project management |
| **Setup note** | Authenticates via browser on first use. No secrets to manage. |

### 10. Typefully

| Field | Value |
|-------|-------|
| **Key** | `typefully` |
| **Type** | HTTP (remote) |
| **URL** | `https://mcp.typefully.com/mcp?TYPEFULLY_API_KEY=<key>` |
| **Auth** | API Key embedded in URL |
| **Used by** | `/final-copy`, social media publishing |
| **Token source** | Typefully → Settings → API |

### 11. Substack

| Field | Value |
|-------|-------|
| **Key** | `substack` |
| **Type** | npx (command-based) |
| **Package** | `substack-mcp@latest` |
| **Auth** | Session Token (`SUBSTACK_SESSION_TOKEN`) + User ID (`SUBSTACK_USER_ID`) + Publication URL |
| **Used by** | `/final-substack`, `/substack-post`, `/substack-note` |
| **Token source** | Browser cookies from substack.com (session token) |
| **Setup note** | Session token expires periodically. Re-extract from browser cookies when auth fails. |

### 12. Vercel

| Field | Value |
|-------|-------|
| **Key** | `vercel` |
| **Type** | HTTP (remote) |
| **URL** | `https://mcp.vercel.com` |
| **Auth** | OAuth (browser-based, no stored key) |
| **Used by** | `/deploy`, deployment monitoring |
| **Setup note** | Authenticates via browser on first use. No secrets to manage. |

### 13. Fathom Analytics

| Field | Value |
|-------|-------|
| **Key** | `fathom` |
| **Type** | Node (command-based, local) |
| **Package** | Local install at `~/fathom-mcp/` |
| **Auth** | API Key (`FATHOM_API_KEY`) |
| **Used by** | Website analytics queries |
| **Token source** | Fathom dashboard → API settings |
| **Setup note** | Requires local clone + build. Path: `~/fathom-mcp/dist/index.js` |

### 14. ElevenLabs

| Field | Value |
|-------|-------|
| **Key** | `elevenlabs` |
| **Type** | uvx (Python, command-based) |
| **Package** | `elevenlabs-mcp` |
| **Auth** | API Key (`ELEVENLABS_API_KEY`) |
| **Used by** | Voice/audio generation |
| **Token source** | ElevenLabs dashboard → API Keys |

### 15. Google Sheets

| Field | Value |
|-------|-------|
| **Key** | `google-sheets` |
| **Type** | uvx (Python, command-based) |
| **Package** | `mcp-google-sheets@latest` |
| **Auth** | Service Account JSON (`SERVICE_ACCOUNT_PATH`) |
| **Used by** | Spreadsheet operations |
| **Token source** | GCP Console → Service Accounts → download JSON key |
| **Setup note** | Requires `~/.config/gcp/sheets-service-account.json` on each machine |

### 16. Firecrawl

| Field | Value |
|-------|-------|
| **Key** | `firecrawl` |
| **Type** | npx (command-based) |
| **Package** | `firecrawl-mcp` |
| **Auth** | API Key (`FIRECRAWL_API_KEY`) |
| **Used by** | Web scraping, `/partner-onboard` website research |
| **Token source** | Firecrawl dashboard → API Keys |

### 17. Reddit

| Field | Value |
|-------|-------|
| **Key** | `reddit` |
| **Type** | npx (command-based) |
| **Package** | `reddit-mcp-server` |
| **Auth** | Anonymous (no key needed) |
| **Used by** | Reddit research |
| **Setup note** | No credentials required. |

## Auth Types Summary

| Auth Type | Servers | Action on New Machine |
|-----------|---------|----------------------|
| **OAuth (browser)** | Figma, Notion, ClickUp, Vercel | Just add config — auth happens on first use |
| **API Key in env** | GitHub, Browserbase, ElevenLabs, Firecrawl, Fathom, Instantly | Copy key to `.env` or embed in config |
| **API Key in URL** | HeyReach, Typefully | Key is part of the URL string |
| **Session Token** | Substack | Extract from browser cookies (expires) |
| **Service Account** | Google Sheets | Copy JSON file to `~/.config/gcp/` |
| **None** | Reddit | No auth needed |
| **Local install** | Fathom, Instantly | Must clone repo + build on each machine |

## New Machine Setup Checklist

1. **Copy `~/.cursor/mcp.json`** from existing machine (or use the template below)
2. **OAuth servers** (Figma, Notion, ClickUp, Vercel) — just restart Cursor, auth on first use
3. **API key servers** — ensure keys are current; copy from existing machine's config
4. **Local installs**:
   - Fathom: `cd ~ && git clone <fathom-mcp-repo> && cd fathom-mcp && npm install && npm run build`
   - Instantly: `cd ~ && git clone <instantly-mcp-repo> && cd instantly-mcp && python -m venv .venv && .venv/bin/pip install -e .`
5. **Google Sheets**: Copy `~/.config/gcp/sheets-service-account.json`
6. **Substack session token**: Will expire — re-extract from browser when needed
7. **Restart Cursor** after config changes

## Current Machine Status

### Mac Mini (as of 2025-02-17)

| Server | Status | Notes |
|--------|--------|-------|
| slack-lead-alchemy | Working | Config present |
| slack-revpartners | Working | Config present |
| github | Working | Config present |
| instantly | **Needs setup** | `~/instantly-mcp/` not cloned yet |
| heyreach | Working | HTTP, no local install |
| browserbase | Working | Config present |
| figma | Working | OAuth on first use |
| notion | Working | OAuth on first use |
| clickup | Working | OAuth on first use |
| typefully | Working | HTTP, key in URL |
| substack | Working | Config present |
| vercel | Working | OAuth on first use |
| fathom | **Needs setup** | `~/fathom-mcp/` not cloned yet |
| elevenlabs | Working | uvx handles install |
| google-sheets | **Needs setup** | Service account JSON missing at `~/.config/gcp/` |
| firecrawl | Working | Config present |
| reddit | Working | No auth needed |

**Action items for Mini**:
1. Clone and build `fathom-mcp` into `~/fathom-mcp/`
2. Clone and install `instantly-mcp` into `~/instantly-mcp/` with Python venv
3. Copy `~/.config/gcp/sheets-service-account.json` from MacBook

## Maintaining Parity

When adding a new MCP server on one machine:
1. Use `/addmcp` to add it
2. Update this doc with the new server entry
3. Copy the config entry to the other machine's `~/.cursor/mcp.json`
4. If it requires local install (venv, git clone), replicate that setup too
