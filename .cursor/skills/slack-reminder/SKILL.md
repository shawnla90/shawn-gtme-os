---
name: slack-reminder
description: Post reminders to Slack channels using slash commands. Use when the user types /reminder or /slackreminder followed by reminder text and optional time/channel.
---

# Slack Reminder Command

Post reminders to Slack channels using slash commands. Automatically formats and sends reminder messages to the designated reminder channel.

## Command Pattern

The command follows these patterns:
- `/reminder <reminder text>` - Post to default reminder channel
- `/reminder <reminder text> at <time>` - Include time in reminder
- `/reminder <reminder text> in <channel>` - Post to specific channel
- `/slackreminder <reminder text>` - Alternative command format

## Default Channel

Default reminder channel: `reminder-channel` (ID: `C0ADP5Z9GUW`)

## Workflow

1. **Parse Command**
   - Extract reminder text from command
   - Detect optional time mention (e.g., "at 6:30", "at 3pm")
   - Detect optional channel mention (e.g., "in #general")
   - If no channel specified, use default reminder channel

2. **Format Message**
   - Format: `Reminder: <reminder text>`
   - If time included: `Reminder: <reminder text> at <time>`
   - Keep message concise and clear

3. **Get Channel ID**
   - If channel name specified, use `mcp_slack-lead-alchemy_slack_list_channels` to find channel ID
   - If no channel specified, use default: `C0ADP5Z9GUW`

4. **Post Message**
   - Use `mcp_slack-lead-alchemy_slack_post_message` with:
     - `channel_id`: Channel ID from step 3
     - `text`: Formatted reminder message

5. **Confirm Success**
   - Display confirmation with channel name and message preview

## Examples

**Example 1: Simple reminder**
```
User: /reminder Walk Broly at 6:30
Response: Posted reminder to #reminder-channel: "Reminder: Walk Broly at 6:30"
```

**Example 2: Reminder without time**
```
User: /reminder Check email
Response: Posted reminder to #reminder-channel: "Reminder: Check email"
```

**Example 3: Reminder to specific channel**
```
User: /reminder Team standup at 9am in #all-lead-alchemy
Response: Posted reminder to #all-lead-alchemy: "Reminder: Team standup at 9am"
```

**Example 4: Alternative command**
```
User: /slackreminder Review PR #123
Response: Posted reminder to #reminder-channel: "Reminder: Review PR #123"
```

## Error Handling

- **Channel not found**: "Channel '#channel-name' not found. Available channels: [list]"
- **Not in channel**: "Bot is not a member of #channel-name. Please add the bot to the channel first."
- **MCP error**: Show error message and suggest checking MCP connection

## Channel Detection

When parsing channel mentions:
- Look for "in #channel-name" pattern
- Remove "#" prefix when searching for channel
- Match channel name case-insensitively
- If channel not found, list available channels

## Time Parsing

When parsing time mentions:
- Look for "at <time>" pattern
- Common formats: "6:30", "3pm", "9am", "14:00"
- Include time verbatim in reminder message
- No validation needed - just pass through to Slack
