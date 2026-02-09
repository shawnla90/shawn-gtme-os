---
name: heyreach-conversations
description: Pull and display LinkedIn conversation history for accepted connections from HeyReach campaigns. Use when the user types /heyreach-conversations or asks to check LinkedIn messages, chat history, or conversation status for accepted connections.
---

# HeyReach Conversations Command

When the user types `/heyreach-conversations`, pull all LinkedIn conversations for accepted connections and display the full message history, reply status, and sequence stage.

## Command Pattern

`/heyreach-conversations` - no arguments needed. Only shows conversations for **accepted connections** (the ones that matter).

## Workflow

### Step 1: Get Campaigns

1. Call `heyreach_get_all_campaigns` with statuses `["IN_PROGRESS", "PAUSED", "FINISHED"]` and `accountIds: []`
2. Collect all campaign IDs and LinkedIn account IDs

### Step 2: Pull Conversations

1. Call `heyreach_get_conversations_v2` with:
   - `linkedInAccountIds`: all sender account IDs from campaigns
   - `campaignIds`: all campaign IDs
   - `limit: 100`
2. Paginate if more than 100 conversations (offset += 100)

### Step 3: Analyze Each Conversation

For each conversation, extract:

| Field | Source |
|-------|--------|
| Contact name | `correspondentProfile.firstName` + `correspondentProfile.lastName` |
| Company | `correspondentProfile.companyName` |
| Position | `correspondentProfile.position` |
| LinkedIn URL | `correspondentProfile.profileUrl` |
| Email | `correspondentProfile.emailAddress` or `customEmailAddress` |
| Total messages | `totalMessages` |
| Last message date | `lastMessageAt` |
| Last message sender | `lastMessageSender` ("ME" = outbound, anything else = reply) |
| Has replied | Check if ANY message in `messages[]` has `sender` != "ME" |
| Sequence stage | Determine from message count and content |

**Sequence stage detection:**
- 1 message sent = "Connection request"
- 2 messages sent = "Intro sent"
- 3 messages sent = "Follow-up sent"
- 4 messages sent = "Breakup sent (sequence complete)"
- Any reply received = "REPLIED" (flag as high priority)

### Step 4: Display Report

Show a summary table and detailed conversation view:

```
## HeyReach Conversations Report

**Total accepted connections with conversations**: {{count}}
**Replies received**: {{reply_count}} / {{total}}
**Sequence completion**: {{breakup_count}} fully sequenced

### Summary Table

| # | Contact | Company | Messages | Replies | Stage | Last Activity |
|---|---------|---------|:--------:|:-------:|-------|---------------|
| 1 | {{name}} | {{company}} | {{count}} | {{reply_count}} | {{stage}} | {{date}} |

### Conversations with Replies (if any)

#### {{contact_name}} - {{company}} (REPLIED)
**Last reply**: {{date}}

> **Sebastian** ({{date}}): {{message_preview}}
> **{{contact}}** ({{date}}): {{reply_preview}}
> **Sebastian** ({{date}}): {{follow_up_preview}}

### Silent Conversations

#### {{contact_name}} - {{company}} ({{stage}})
Messages sent: {{count}} | Last: {{date}}
- Msg 1 ({{date}}): {{preview_first_50_chars}}
- Msg 2 ({{date}}): {{preview_first_50_chars}}
- ...
```

### Step 5: Recommendations

Based on the data, provide actionable recommendations:

- **Replied contacts**: Suggest next steps based on reply content
- **Sequence complete, no reply**: Flag for LinkedIn recon (`/linkedin-recon`) or alternative outreach channel (email via Instantly)
- **Mid-sequence, no reply**: Note that automated follow-ups are still pending
- **Early sequence**: Note that it's still early, let the automation work

## Error Handling

- **No campaigns found**: "No active/paused/finished campaigns found in HeyReach."
- **No conversations found**: "No conversations found. This means no accepted connections have been messaged yet."
- **MCP connection error**: "Couldn't connect to HeyReach MCP. Check your connection URL in `~/.cursor/mcp.json`."

## Examples

```
User: /heyreach-conversations

→ Pulls all campaigns
→ Gets all conversations for accepted connections
→ Displays summary table with reply status
→ Shows full message threads
→ Recommends next steps per contact
```
