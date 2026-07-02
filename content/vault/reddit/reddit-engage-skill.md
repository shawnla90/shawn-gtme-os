---
title: Reddit Engage Skill
description: Draft and approve Reddit comments from scouted opportunities — queue-driven workflow with voice loading, inline approve/edit/reject, and human-in-the-loop rules.
source: ~/.claude/skills/reddit-engage/SKILL.md
updated: 2026-07-02
order: 1
---

# Reddit Engage

Draft voice-matched Reddit comments from scouted opportunities, get approval, and optionally post.

## When to Invoke

- User types `/reddit-engage`
- User says "Reddit comments", "engage on Reddit", "draft Reddit replies", or similar

## Steps

### Step 1: Load Queue

Read `<your-repo>/data/reddit/queue.json`. Count items by status:

```
Scouted: X | Drafted: X | Approved: X | Posted: X | Rejected: X
```

If zero scouted items, tell the user: "No scouted items. Run your scout script first (e.g. `python3 scripts/reddit_scout.py`, or `--test` to try one sub)." and stop.

### Step 2: Load Voice System

Read these files silently (do NOT print their contents):
- `voice-dna/core-voice.md`
- `anti-slop/anti-slop-core.md`
- `reddit/reddit-growth-seo.md`

These inform your tone for drafting. Key rules:
- Write like a builder sharing what they learned, not a marketer promoting
- Casual, direct, no corporate speak
- Self-deprecating humor is fine, "I'm an expert" framing is not
- No emojis unless the sub culture uses them heavily
- No hard CTAs, no links to your stuff in comments (profile does that work)
- Match the energy of the thread -- technical threads get technical replies

### Step 3: Present Opportunities

For each scouted item, show:

```
## [1/N] r/ClaudeAI -- "Post title here"
Score: 45 | Post karma: 127 | Comments: 23
Tags: Claude Code, MCP
Reason: Matches: Claude Code, MCP. Post score: 127, comments: 23
URL: https://reddit.com/r/ClaudeAI/comments/...
```

### Step 4: Draft Comments

For each opportunity, draft a voice-matched comment. Guidelines:
- Read the post title and context to understand what the OP is asking/discussing
- Write a reply that adds genuine value (a tip, a "here's what worked for me", a relevant experience)
- Keep it 2-5 sentences for comments. Longer only if the post warrants depth.
- Reference your actual experience (real system stats — e.g. 50+ skills, 17 MCP servers, nightly cron pipeline, 4 websites, building in public)
- Never drop product names unprompted. Share the experience, not the brand.
- If you can't draft something genuine for a post, skip it and note why

Show each draft:

```
### Draft for [1/N]:
> [draft comment text here]

**Action**: Approve (a) | Edit (e) | Reject (r) | Skip remaining (s)
```

### Step 5: Collect Approvals

Ask the user about each draft. Options:
- **Approve** -- mark as approved, use draft as-is
- **Edit** -- user provides edited text, mark as approved with edited version
- **Reject** -- mark as rejected, ask for brief reason

Update each item in `<your-repo>/data/reddit/queue.json`:
- Approved: `status: "approved"`, `approved_text: [text]`, `approved_at: [timestamp]`
- Rejected: `status: "rejected"`, `rejected_reason: [reason]`
- Drafted but not yet decided: `status: "drafted"`, `draft_text: [text]`, `drafted_at: [timestamp]`

Save the queue after each decision (not at the end) so progress is never lost.

### Step 6: Summary & Next Steps

Print summary:

```
## Session Summary
- Approved: X comments
- Rejected: X
- Skipped: X

Next: run your posting script in test mode to preview, then live to post.
```

## Rules

1. **Human-in-the-loop always** -- never post without explicit approval
2. **Save after each decision** -- write queue.json incrementally, not at the end
3. **Voice compliance** -- run every draft through the anti-slop filter mentally. No "game-changer", "revolutionize", "unlock", "level up", "deep dive"
4. **No self-promotion in comments** -- share experiences, not links. The profile bio handles discovery.
5. **Skip gracefully** -- if a post doesn't warrant a genuine comment, skip it. Better to post 3 good comments than 10 mid ones.
6. **Read the room** -- if a thread is contentious or off-topic from your expertise, skip it
