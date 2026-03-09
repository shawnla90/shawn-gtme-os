---
name: linkedin-comments
description: Generate authentic, non-NPC replies to LinkedIn post commenters using voice DNA. Use when the user has a LinkedIn post open and wants to reply to commenters, or types /linkedin-comments.
---

# LinkedIn Comment Reply Generator

Generate 3 reply variations per commenter. Short, playful, builder-to-builder tone.

## Workflow

1. **Capture** - browser snapshot of LinkedIn post, identify commenters
2. **Load voice** - `skills/tier-1-voice-dna/core-voice.md`, `anti-slop.md`, `skills/tier-2-context-playbooks/linkedin.md`
3. **Generate 3 options** per commenter:
   - Option 1: Shortest/playful (1 sentence, high energy)
   - Option 2: Balanced (1-2 sentences, playful + value)
   - Option 3: Substantive (2 sentences, technical detail)
4. **Present** grouped by commenter, ready to copy-paste
5. **Optionally post** via browser if user wants

## Reply Style by Comment Type

- **Enthusiastic/generic**: Short + playful, use exclamation marks naturally, acknowledge with name + pivot to specific value
- **Substantive**: One-line value add, don't reiterate their point
- **Questions**: Direct answer with practical detail, no gatekeeping
- **Brand accounts**: Brief acknowledgment with specific tool/product connection

## Non-NPC Rules

Do: Acknowledge without reiterating, add specific detail/connection, use natural expressions ("it's too true", "that's the move"), show you read their comment

Don't: Reiterate then preach, use "hits different"/"this is the way"/"facts"/"100%", corporate acknowledgment, generic "Thanks!"

## Voice

- Lowercase style, always capitalize I
- Builder-first, casual competence, nothing to prove
- No em-dashes, no authority signaling phrases
- Identity markers used naturally, not forced
