---
name: slack-mcp
description: Access and interact with Slack workspaces using MCP tools. Use when the user asks to read Slack messages, search channels, send messages, look up users, or interact with Slack programmatically.
---

# Slack MCP Integration

Access Slack workspaces programmatically using Model Context Protocol tools. Read channel history, send messages, search users, and monitor channels directly from Cursor.

## Available MCP Tools

The Slack MCP server provides the following tools:

### Channel Operations

- **`mcp_slack_list_channels`** - List all public channels in the workspace
  - Returns: Channel list with IDs, names, and metadata
  - Use case: Find channels, get channel IDs for other operations

- **`mcp_slack_get_channel_history`** - Get recent messages from a channel
  - Parameters: `channel_id` (required), `limit` (optional, default 100)
  - Returns: List of messages with timestamps, authors, and content
  - Use case: Read channel history, search for specific messages

- **`mcp_slack_post_message`** - Send a message to a channel
  - Parameters: `channel_id` (required), `text` (required)
  - Returns: Message timestamp and confirmation
  - Use case: Send notifications, updates, or automated messages

### Thread Operations

- **`mcp_slack_get_thread_replies`** - Get all replies in a thread
  - Parameters: `channel_id` (required), `thread_ts` (required)
  - Returns: All messages in the thread
  - Use case: Read full conversation threads

- **`mcp_slack_reply_to_thread`** - Reply to a message thread
  - Parameters: `channel_id` (required), `thread_ts` (required), `text` (required)
  - Returns: Reply confirmation
  - Use case: Add context or responses to existing threads

### User Operations

- **`mcp_slack_get_users`** - List all users in the workspace
  - Returns: User list with IDs, names, and email addresses
  - Use case: Find users, look up contact information

- **`mcp_slack_get_user_profile`** - Get detailed user profile
  - Parameters: `user_id` (required)
  - Returns: Full user profile with display name, email, status, etc.
  - Use case: Get user details for context or contact

### Reactions

- **`mcp_slack_add_reaction`** - Add emoji reaction to a message
  - Parameters: `channel_id` (required), `timestamp` (required), `name` (emoji name, required)
  - Returns: Confirmation
  - Use case: Acknowledge messages, add visual feedback

## Common Use Cases

### 1. Search Channel History

**Example**: "Find messages about deployment in #engineering channel"

**Workflow**:
1. Use `mcp_slack_list_channels` to find channel ID for #engineering
2. Use `mcp_slack_get_channel_history` to get recent messages
3. Filter/search messages for "deployment" keyword
4. Return relevant messages with context

### 2. Send Status Updates

**Example**: "Send a message to #alerts channel that deployment completed"

**Workflow**:
1. Use `mcp_slack_list_channels` to find #alerts channel ID
2. Use `mcp_slack_post_message` to send status update
3. Confirm message was sent

### 3. Look Up User Information

**Example**: "Find email address for user John Doe"

**Workflow**:
1. Use `mcp_slack_get_users` to list all users
2. Search for "John Doe" in user list
3. Use `mcp_slack_get_user_profile` to get full details including email
4. Return contact information

### 4. Monitor Channel for Updates

**Example**: "What are the latest messages in #support channel?"

**Workflow**:
1. Use `mcp_slack_list_channels` to get #support channel ID
2. Use `mcp_slack_get_channel_history` with limit=10
3. Format and display recent messages

### 5. Read Thread Context

**Example**: "Show me all replies in this thread"

**Workflow**:
1. Get channel_id and thread_ts from user or message
2. Use `mcp_slack_get_thread_replies` to get all thread messages
3. Display full conversation context

## Integration with Existing Workflows

### With Instantly MCP

Combine Slack MCP with Instantly MCP for comprehensive monitoring:

1. Fetch email replies using Instantly MCP (`/instantlyreplies_elauwit`)
2. Post summary to Slack channel using Slack MCP
3. Create alerts for high-priority replies

### With Slack Webhooks

Slack MCP complements webhook notifications:

- **Webhooks**: One-way notifications (automation → Slack)
- **MCP**: Two-way interaction (Cursor ↔ Slack)
- Use webhooks for automated alerts, MCP for on-demand queries

### With Slack Bot

Slack bot handles event-driven content capture, MCP handles programmatic access:

- **Bot**: Listens for messages, saves content to files
- **MCP**: Reads history, searches, sends messages on demand

## Example Queries

**Channel History**:
- "Get last 20 messages from #general"
- "Show me messages from #engineering about bugs"
- "What did @username say in #support today?"

**User Lookup**:
- "Find email for user with display name 'John Smith'"
- "List all users in the workspace"
- "Get profile for user ID U01234567"

**Message Sending**:
- "Post 'Deployment complete' to #alerts channel"
- "Reply to thread in #support with 'Issue resolved'"
- "Add 👍 reaction to message in #general"

**Channel Discovery**:
- "List all public channels"
- "Find channel ID for #engineering"
- "What channels exist in this workspace?"

## Error Handling

Common errors and solutions:

- **`channel_not_found`**: Channel doesn't exist or is private
  - Solution: Verify channel name, check if public channel

- **`missing_scope`**: Bot doesn't have required permission
  - Solution: Add missing scope in Slack app OAuth settings

- **`not_authed`**: Invalid or expired token
  - Solution: Verify token is correct, reinstall app if needed

- **`user_not_found`**: User ID doesn't exist
  - Solution: Verify user ID format, check user still in workspace

## Best Practices

1. **Channel IDs**: Always use channel IDs (not names) for API calls
2. **Rate Limits**: Be mindful of Slack API rate limits
3. **Error Handling**: Always check for errors and provide helpful messages
4. **Security**: Never expose tokens or sensitive data
5. **Context**: Provide channel/user context in responses

## Related Documentation

- Setup guide: `clients/partner/elauwit/workflows/slack-mcp-setup.md`
- Integration guide: `clients/partner/elauwit/workflows/slack-integration.md` (Part D)
- Slack API docs: https://api.slack.com/
