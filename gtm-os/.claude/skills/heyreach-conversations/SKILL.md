---
name: heyreach-conversations
description: Pull and display LinkedIn conversation history for accepted connections from HeyReach campaigns. Use when the user types /heyreach-conversations or asks to check LinkedIn message status.
---

# HeyReach Conversations

## Command

`/heyreach-conversations` - no arguments needed

## Workflow

1. **Get campaigns**: `heyreach_get_all_campaigns` with statuses `["IN_PROGRESS", "PAUSED", "FINISHED"]`
2. **Pull conversations**: `heyreach_get_conversations_v2` with all campaign/account IDs, paginate at 100
3. **Analyze each**: extract contact info, message count, last message sender ("ME" = outbound), reply detection
4. **Sequence stage**: 1 msg = connection request, 2 = intro sent, 3 = follow-up, 4 = breakup (complete), any reply = REPLIED
5. **Display**: summary table (contact, company, messages, replies, stage, last activity) + full message threads for replies + silent conversation previews
6. **Recommendations**: replied contacts -> next steps, sequence complete no reply -> suggest `/linkedin-recon` or email via Instantly, mid-sequence -> let automation work

## Key Fields

- Contact: `correspondentProfile.firstName/lastName/companyName/position/profileUrl`
- Messages: `totalMessages`, `lastMessageAt`, `lastMessageSender`
- Reply detection: any message in `messages[]` with `sender != "ME"`
