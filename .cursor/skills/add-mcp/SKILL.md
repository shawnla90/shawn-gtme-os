---
name: add-mcp
description: Research, configure, and install MCP servers into the Cursor IDE. Use when the user types /addmcp <server-name> (e.g., /addmcp figma, /addmcp context7, /addmcp supabase) or asks to add/install an MCP server.
---

# Add MCP Server Command

When the user types `/addmcp <server-name>`, research the MCP server, present configuration options, and add it to the Cursor MCP config.

## Command Pattern

`/addmcp <server-name>` where `<server-name>` is the name or keyword for the MCP server (e.g., `figma`, `context7`, `supabase`, `stripe`, `notion`, etc.)

## MCP Config File

The global Cursor MCP config lives at:

| OS | Path |
|----|------|
| macOS | `~/.cursor/mcp.json` |
| Linux | `~/.config/Cursor/User/mcp.json` |
| Windows | `%APPDATA%\Cursor\User\mcp.json` |

## Workflow

### Step 1: Read Current Config

1. Read `~/.cursor/mcp.json` to see existing MCP servers
2. Check if the requested server is already configured
3. If already present, inform user: "MCP server '{{name}}' is already configured. Want to update it?"

### Step 2: Research the MCP Server

1. **Web search** for the MCP server to find:
   - Official GitHub repo or documentation
   - Configuration format (command-based vs HTTP/URL-based)
   - Authentication method (API key, OAuth, none)
   - Available setup approaches (remote vs local, npx vs docker, etc.)

2. **Check GitHub** for the official repo:
   - Search `github.com` for `<server-name> MCP server`
   - Look for repos from official orgs first (e.g., `modelcontextprotocol/`, `anthropics/`, the company's own org)
   - Read the README for configuration instructions

3. **Identify config type**:
   - **HTTP/URL-based** (remote, no install): Uses `"url"` and `"type": "http"` — simplest
   - **Command-based (npx)**: Uses `"command": "npx"` with args — most common
   - **Command-based (local)**: Uses local binary path — for custom/self-hosted servers
   - **Command-based (python)**: Uses python/venv path — for Python MCP servers

### Step 3: Present Options to User

Present findings in a clear format:

```
## MCP Server: {{name}}

**Source**: {{github_url_or_docs_url}}
**Auth**: {{OAuth | API Key | None}}

### Option 1: {{recommended approach}}
{{description of approach}}
{{what user needs to provide, if anything (API key, etc.)}}

### Option 2: {{alternative approach}} (if applicable)
{{description}}
```

If the server requires an API key or credentials:
- Tell the user where to get the key (link to settings page)
- Ask them to provide it before proceeding
- **NEVER make up or guess API keys**

If the server uses OAuth (no key needed):
- Note that auth happens in-browser on first use
- Proceed directly to installation

### Step 4: Add to Config

1. Read `~/.cursor/mcp.json` again (in case it changed)
2. Add the new server entry inside `"mcpServers"` object
3. Use a clean, descriptive key name (lowercase, hyphenated)
4. Write the updated config

**For HTTP/URL-based servers:**
```json
"{{server-name}}": {
  "url": "{{server-url}}",
  "type": "http"
}
```

**For npx-based servers:**
```json
"{{server-name}}": {
  "command": "npx",
  "args": ["-y", "{{package-name}}", "--stdio"],
  "env": {
    "{{ENV_VAR}}": "{{value}}"
  }
}
```

**For Python-based servers:**
```json
"{{server-name}}": {
  "command": "{{python-path}}",
  "args": ["-m", "{{module-name}}"],
  "env": {
    "{{ENV_VAR}}": "{{value}}"
  }
}
```

### Step 5: Verify & Report

After adding, display a summary:

```
## MCP Server Added: {{name}}

**Config key**: `{{key-name}}`
**Type**: {{HTTP | npx | local}}
**Auth**: {{OAuth (connect on first use) | API Key (configured) | None}}

### Current MCP Stack ({{count}} servers):
1. {{server-1}} - {{one-line description}}
2. {{server-2}} - {{one-line description}}
...
{{new-server}} - {{one-line description}} ← NEW

### Next Steps:
- {{Any steps needed like "restart Cursor" or "authenticate on first use"}}
```

## Error Handling

- **Server not found**: "Couldn't find an MCP server for '{{name}}'. Did you mean one of these? {{suggestions from web search}}"
- **Already installed**: "MCP server '{{name}}' is already in your config. Want to update or reconfigure it?"
- **API key required but not provided**: "{{name}} requires an API key. Get one at: {{url}}. Share it when ready and I'll add it."
- **Config file missing**: Create `~/.cursor/mcp.json` with proper structure: `{ "mcpServers": {} }`
- **Invalid JSON**: Alert user and offer to fix the config file

## Well-Known MCP Servers (Quick Reference)

These are common servers with known-good configs for fast setup:

| Server | Key | Type | Auth | Package/URL |
|--------|-----|------|------|-------------|
| Figma | `figma` | HTTP | OAuth | `https://mcp.figma.com/mcp` |
| Context7 | `context7` | npx | None | `@upstash/context7-mcp@latest` |
| GitHub | `github` | npx | API Key | `@modelcontextprotocol/server-github` |
| Slack | `slack` | npx | API Key | `@modelcontextprotocol/server-slack` |
| Notion | `notion` | npx | API Key | `@modelcontextprotocol/server-notion` |
| Supabase | `supabase` | npx | API Key | `@supabase/mcp-server-supabase@latest` |
| Stripe | `stripe` | npx | API Key | `@stripe/mcp-server-stripe` |
| Sentry | `sentry` | npx | API Key | `@sentry/mcp-server-sentry` |
| Browserbase | `browserbase` | npx | API Key | `@browserbasehq/mcp-server-browserbase` |
| PostgreSQL | `postgres` | npx | Conn String | `@modelcontextprotocol/server-postgres` |
| Filesystem | `filesystem` | npx | None | `@modelcontextprotocol/server-filesystem` |
| Memory | `memory` | npx | None | `@modelcontextprotocol/server-memory` |
| Brave Search | `brave-search` | npx | API Key | `@modelcontextprotocol/server-brave-search` |

**Important**: This table is a starting reference. ALWAYS verify current package names and config format via web search before installing, as packages and APIs change frequently.

## Examples

### Example 1: OAuth-based (no key)
```
User: /addmcp figma

→ Research finds Figma remote MCP
→ No API key needed (OAuth)
→ Add to config
→ Done - auth on first use
```

### Example 2: API key required
```
User: /addmcp supabase

→ Research finds Supabase MCP server
→ Requires SUPABASE_ACCESS_TOKEN
→ Tell user: "Get your token at https://supabase.com/dashboard/account/tokens"
→ User provides key
→ Add to config
→ Done
```

### Example 3: Unknown server
```
User: /addmcp coolnewservice

→ Web search for "coolnewservice MCP server"
→ Find GitHub repo or npm package
→ Read docs for config format
→ Present options
→ Add to config
```
