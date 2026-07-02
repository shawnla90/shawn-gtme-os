---
title: X Engage Skill
description: Draft and approve X/Twitter replies from scouted opportunities — queue-driven workflow with voice loading, 280-char discipline, inline approve/edit/reject, and human-in-the-loop rules.
source: ~/.claude/skills/x-engage/SKILL.md
updated: 2026-07-02
order: 1
---

# X Engage

Draft voice-matched X/Twitter replies from scouted opportunities, get approval, and optionally post.

## When to Invoke

- User types `/x-engage`
- User says "X replies", "engage on X", "draft X replies", "tweet replies", or similar

## Steps

### Step 1: Load Queue

Read `<your-repo>/data/x/queue.json`. Count items by status:

```
Scouted: X | Drafted: X | Approved: X | Posted: X | Rejected: X
```

If zero scouted items, tell the user: "No scouted items. Run your scout script first (e.g. `python3 scripts/x_scout.py`, or `--test` to try one topic)." and stop.

### Step 2: Load Voice System

Read these files silently (do NOT print their contents):
- `voice-dna/core-voice.md`
- `anti-slop/anti-slop-core.md`
- your X micro-tips pillar (platform-native tip formats)

These inform your tone for drafting. Key rules:
- Write like a builder sharing what they learned, not a marketer promoting
- Casual, direct, no corporate speak
- Match X energy - shorter, punchier than Reddit
- No emojis unless the thread uses them
- No hard CTAs, no links to your stuff in replies
- One sentence per line where possible
- Under 280 chars per reply (hard limit)
- Self-deprecating humor is fine, "I'm an expert" framing is not

### Step 3: Present Opportunities

For each scouted item, show:

```
## [1/N] @author_handle (topic-area)
Relevance: 85 | Likes: 45 | Replies: 12 | RTs: 8
Tags: Claude Code, MCP
Tweet: "first 200 chars of the original tweet..."
Reason: Why you should reply and what angle to take
URL: https://x.com/...
```

### Step 4: Draft Replies

For each opportunity, draft a voice-matched reply. Guidelines:
- Read the tweet text and context to understand what the OP is saying/asking
- Write a reply that adds genuine value (a tip, a "here's what worked for me", a relevant experience)
- Keep it 1-3 sentences. X replies should be tight.
- Under 280 chars ALWAYS. Count before presenting.
- Reference your actual experience (real system stats — e.g. 50+ skills, 17 MCP servers, nightly cron pipeline, 4 websites, building in public)
- Never drop product names unprompted. Share the experience, not the brand.
- If you can't draft something genuine for a tweet, skip it and note why

Show each draft:

```
### Draft for [1/N] (X chars):
> [draft reply text here]

**Action**: Approve (a) | Edit (e) | Reject (r) | Skip remaining (s)
```

### Step 5: Collect Approvals

Ask the user about each draft. Options:
- **Approve** -- mark as approved, use draft as-is
- **Edit** -- user provides edited text, mark as approved with edited version
- **Reject** -- mark as rejected, ask for brief reason

Update each item in `<your-repo>/data/x/queue.json`:
- Approved: `status: "approved"`, `approved_text: [text]`, `approved_at: [timestamp]`
- Rejected: `status: "rejected"`, `rejected_reason: [reason]`
- Drafted but not yet decided: `status: "drafted"`, `draft_text: [text]`, `drafted_at: [timestamp]`

Save the queue after each decision (not at the end) so progress is never lost.

### Step 6: Summary & Next Steps

Print summary:

```
## Session Summary
- Approved: X replies
- Rejected: X
- Skipped: X

Next: run your reply script in test mode to preview, then live to post.
```

## Rules

1. **Human-in-the-loop always** -- never post without explicit approval
2. **Save after each decision** -- write queue.json incrementally, not at the end
3. **Voice compliance** -- run every draft through the anti-slop filter mentally. No "game-changer", "revolutionize", "unlock", "level up", "deep dive"
4. **No self-promotion in replies** -- share experiences, not links. The profile bio handles discovery.
5. **280 char hard limit** -- count every draft. If it's over, shorten it before presenting.
6. **Skip gracefully** -- if a tweet doesn't warrant a genuine reply, skip it. Better to post 3 good replies than 10 mid ones.
7. **Read the room** -- if a thread is contentious, dunking, or off-topic from your expertise, skip it
