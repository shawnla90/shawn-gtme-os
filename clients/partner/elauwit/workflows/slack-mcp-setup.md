# Slack MCP Server Setup Guide

Complete guide for setting up Slack MCP server integration with Cursor.

## Overview

Slack MCP server enables programmatic access to Slack workspaces directly from Cursor, allowing you to:
- Read and search Slack channel history
- Send messages programmatically
- Look up users and profiles
- Monitor channels for updates
- Manage threads and reactions

This complements existing webhook notifications and bot integrations.

---

## Prerequisites

- Node.js and npx installed (for running MCP server)
- Slack workspace admin access
- Cursor IDE with MCP support
- Existing Slack app (can reuse bot app or create new one)

---

## Step 1: Create or Configure Slack App

### Option A: Create New Slack App (Recommended)

1. Go to https://api.slack.com/apps
2. Click **"Create New App"** → **"From scratch"**
3. Name it **"GTM OS MCP"** (or similar) and select your workspace
4. Click **"Create App"**

### Option B: Reuse Existing Bot App

If you already have a Slack bot app (from Part B of slack-integration.md), you can add MCP scopes to it:

1. Go to https://api.slack.com/apps
2. Select your existing app (e.g., "GTM OS Bot")
3. Skip to Step 2 below

---

## Step 2: Configure OAuth Scopes

1. In your Slack app, go to **"OAuth & Permissions"** (left sidebar)
2. Scroll to **"Bot Token Scopes"**
3. Add the following scopes:
   - `channels:history` - Read channel messages
   - `channels:read` - List public channels
   - `chat:write` - Send messages
   - `reactions:write` - Add emoji reactions
   - `users:read` - Read user information
   - `users.profile:read` - Read user profiles

**Note**: If reusing existing bot app, add any missing scopes.

---

## Step 3: Install App to Workspace

1. Still in **"OAuth & Permissions"**, scroll to top
2. Click **"Install to Workspace"**
3. Review permissions and click **"Allow"**
4. Copy the **Bot User OAuth Token** (starts with `xoxb-`)
   - Example: `xoxb-EXAMPLE-TOKEN-PLACEHOLDER`

**Important**: Save this token securely - you'll need it for MCP configuration.

---

## Step 4: Get Team ID

1. Go to **"Basic Information"** (left sidebar)
2. Scroll to **"App Credentials"**
3. Find **"Team ID"** (starts with `T`)
   - Example: `T01234567`
4. Copy the Team ID

**Note**: Team ID is required for proper workspace identification in MCP.

---

## Step 5: Configure MCP Server in Cursor

### Method 1: Via Cursor Settings UI (Recommended)

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Navigate to **"Features"** → **"Model Context Protocol"** (or search for "MCP")
3. Click **"Add Server"** or **"Edit Configuration"**
4. Add new server configuration:

**Server Name**: `slack`

**Configuration**:
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": {
    "SLACK_BOT_TOKEN": "xoxb-your-token-here",
    "SLACK_TEAM_ID": "T01234567"
  }
}
```

5. Replace placeholders:
   - `xoxb-your-token-here` → Your Bot User OAuth Token from Step 3
   - `T01234567` → Your Team ID from Step 4

6. Save configuration
7. Restart Cursor or reload MCP servers

### Method 2: Via Configuration File

If Cursor uses a configuration file (typically `~/.cursor/mcp.json`):

**Quick Reference**: See `slack-mcp-config.json` in this directory for ready-to-use configuration with both workspaces.

1. Open or create the MCP configuration file (`~/.cursor/mcp.json`)
2. Add Slack server configuration:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token-here",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}
```

3. Replace token and Team ID placeholders
4. Save file
5. Restart Cursor

### Method 3: Multiple Workspaces Configuration

To configure multiple Slack workspaces (e.g., Lead Alchemy and Revpartners), add separate server entries with distinct names:

**Via Cursor Settings UI:**

1. Add first workspace:
   - Server Name: `slack-lead-alchemy` (or your workspace name)
   - Configuration with Lead Alchemy credentials
2. Add second workspace:
   - Server Name: `slack-revpartners` (or your workspace name)
   - Configuration with Revpartners credentials
3. Save and restart Cursor

**Via Configuration File:**

```json
{
  "mcpServers": {
    "slack-lead-alchemy": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-LEAD-ALCHEMY-TOKEN-PLACEHOLDER",
        "SLACK_TEAM_ID": "T0AE2EHPKED"
      }
    },
    "slack-revpartners": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-REVPARTNERS-TOKEN-PLACEHOLDER",
        "SLACK_TEAM_ID": "T01FPGB7QCX"
      }
    }
  }
}
```

**Note**: When multiple Slack MCP servers are configured, tool names will be prefixed with the server name:
- Lead Alchemy: `mcp_slack-lead-alchemy_list_channels`, `mcp_slack-lead-alchemy_post_message`
- Revpartners: `mcp_slack-revpartners_list_channels`, `mcp_slack-revpartners_post_message`

To use a specific workspace, specify it in your query:
- "List channels in Lead Alchemy workspace using Slack MCP"
- "Get messages from #general in Revpartners Slack"

---

## Step 6: Verify Installation

After configuring, verify the MCP server is working:

1. **Check MCP Status**: In Cursor, check MCP server status (usually in settings or status bar)
2. **Test Basic Query**: Ask Cursor to list Slack channels:
   ```
   List all Slack channels using MCP
   ```
3. **Verify Tools Available**: The following MCP tools should be available:
   - `mcp_slack_list_channels` - List public channels
   - `mcp_slack_post_message` - Send messages
   - `mcp_slack_get_channel_history` - Read channel messages
   - `mcp_slack_get_users` - List workspace users
   - `mcp_slack_get_user_profile` - Get user details
   - `mcp_slack_reply_to_thread` - Reply to threads
   - `mcp_slack_get_thread_replies` - Get thread replies
   - `mcp_slack_add_reaction` - Add reactions

---

## Step 7: Test Integration

### Single Workspace Testing

**Test 1: List Channels**

Ask Cursor:
```
Use Slack MCP to list all public channels
```

Expected: List of channels with IDs and names

**Test 2: Read Channel History**

Ask Cursor:
```
Get the last 10 messages from #general channel using Slack MCP
```

Expected: Recent messages from the channel

**Test 3: Get Users**

Ask Cursor:
```
List all users in the Slack workspace using MCP
```

Expected: List of workspace users

### Multiple Workspaces Testing

If you've configured multiple workspaces, test each separately:

**Test Lead Alchemy Workspace:**
```
List all channels in Lead Alchemy Slack workspace
```

**Test Revpartners Workspace:**
```
List all channels in Revpartners Slack workspace
```

Both should return their respective channel lists. You can also test reading history from each:
```
Get the last 10 messages from #general in Lead Alchemy workspace
Get the last 10 messages from #general in Revpartners workspace
```

---

## Troubleshooting

### MCP Server Not Starting

**Symptoms**: MCP server shows as disconnected or error in Cursor

**Solutions**:
1. Check Node.js is installed: `node --version` and `npx --version`
2. Verify token format: Should start with `xoxb-`
3. Check Team ID format: Should start with `T`
4. Review Cursor logs for MCP errors
5. Try running manually:
   ```bash
   npx -y @modelcontextprotocol/server-slack
   ```

### Permission Errors

**Symptoms**: "missing_scope" or "not_authed" errors

**Solutions**:
1. Verify all required scopes are added in Slack app
2. Reinstall app to workspace after adding scopes
3. Check token hasn't been revoked
4. Verify app is installed in correct workspace

### Channel Not Found

**Symptoms**: "channel_not_found" errors

**Solutions**:
1. Verify channel exists and is public (MCP can't access private channels by default)
2. Check channel ID format (should start with `C`)
3. Verify bot has access to the channel

### Token Security

**Best Practices**:
- Never commit tokens to git
- Use environment variables or secure storage
- Rotate tokens if compromised
- Use separate apps for different environments (dev/prod)

---

## Security Considerations

1. **Bot Token**: Store securely, never in code or public repos
2. **Scopes**: Use minimum required scopes
3. **Channel Access**: MCP can only access public channels by default
4. **Team ID**: Required for workspace identification
5. **Token Rotation**: Rotate tokens periodically or if compromised

---

## Next Steps

After setup is complete:

1. Review `.cursor/skills/slack-mcp/SKILL.md` for available commands
2. See `slack-integration.md` Part D for usage examples
3. Integrate Slack MCP with existing workflows
4. Create custom commands for common Slack queries

---

## Alternative Implementations

If the official MCP server doesn't work, consider:

- **zencoderai/slack-mcp-server**: Community implementation
  - GitHub: https://github.com/zencoderai/slack-mcp-server
  - May have different configuration requirements

---

## References

- [Slack API Documentation](https://api.slack.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Slack MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)
