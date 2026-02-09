---
name: linkedin-comments
description: Generate authentic, non-NPC-like replies to LinkedIn post commenters using the content operating system voice guide. Use when the user has a LinkedIn post open in browser and wants to reply to commenters.
---

# LinkedIn Comment Reply Generator

Generate authentic, personalized replies to LinkedIn post commenters that match your voice DNA. This skill uses your content operating system to create replies that are short, playful, and add value—not generic NPC responses.

## When to Use

- User has a LinkedIn post open in browser
- User wants to reply to commenters on their post
- User types `/linkedin-comments` or asks to generate comment replies

## Workflow

1. **Capture Post Context**
   - Take browser snapshot of the LinkedIn post
   - Identify all commenters and their comments
   - Note the post content and topic

2. **Load Voice DNA**
   - Read `skills/tier-1-voice-dna/core-voice.md` for voice principles
   - Read `skills/tier-1-voice-dna/anti-slop.md` for anti-patterns
   - Read `skills/tier-2-context-playbooks/linkedin.md` for LinkedIn-specific style

3. **Analyze Each Comment**
   - Identify commenter's name and role/title
   - Understand their comment's intent (enthusiastic, question, insight, generic)
   - Determine appropriate reply tone (playful, technical, brief acknowledgment)

4. **Generate Replies**
   - Generate **three optional reply variations** for each commenter
   - Vary tone, length, and approach across the three options:
     - **Option 1**: Shortest, most playful (1 sentence, high energy)
     - **Option 2**: Balanced (1-2 sentences, playful + value add)
     - **Option 3**: More substantive (2 sentences, technical detail or deeper insight)
   - **Short and playful** for enthusiastic/generic comments (1-2 sentences, often just 1)
   - **One-line value adds** for substantive comments (per LinkedIn playbook)
   - **Technical but accessible** for builder-to-builder crowd
   - **Lowercase style** (unless proper noun or brand name like "HeyReach.io")
   - **Use exclamation marks** naturally for energy ("thanks!!", "teodora!!")
   - **Identity markers** (⚡ 🧙‍♂️ 🚀) used naturally, not forced
   - **No generic "thanks!"** responses — always add specific value or connection
   - **Playful language** when appropriate ("chef's kiss", "it's too true", "it's too real", casual references)
  - **Builder-to-builder tone**: Cool, encouraging, casual — nothing to prove

5. **Present Replies**
   - Show **three reply options** for each commenter
   - Group by commenter with their name/role
   - Format ready to copy-paste
   - User selects which option to use (or edits/combines)
   - Offer to post directly via browser if user wants

## Reply Style Guidelines

### For Enthusiastic/Generic Comments
- **Short and playful** (1-2 sentences max, often just 1)
- Use exclamation marks naturally for energy
- Acknowledge briefly with name, pivot to specific value
- Use casual builder tone with personality
  - Examples:
  - "thanks!! your MCP server is integral part of the system. automated campaign exports straight into the repo. The conversation skill is chef's kiss. 🚀"
  - "teodora!! ⚡ it's too real. git history = the map that actually updates itself."
  - "appreciate it ⚡ the real win is when clients can clone the repo and run their own plays without me."

### For Substantive Comments
- **One-line value adds** (per LinkedIn playbook)
- Add technical detail or insight
- Show pattern recognition
- **Don't reiterate their point** — acknowledge and add, don't repeat and preach
- Example: "git history shows you what changed and why, not just what exists now."

### For Questions
- **Direct answer** with practical detail
- Technical but accessible
- No gatekeeping — share the insight
- Example: "MCP servers are basically the API layer between Claude Code and everything else — Slack, Instantly, LinkedIn."

### For Brand Accounts
- **Brief acknowledgment** with specific connection
- Reference their tool/product if relevant
- Keep it short and authentic

## Voice Principles Applied

- **Builder-first**: Sound like sharing from trenches
- **Casual competence**: Confident without corporate formality
- **Builder-to-builder**: Cool, encouraging, casual — nothing to prove. The proof is in the pudding.
- **Pattern articulation**: Name patterns others haven't seen
- **Technical but accessible**: Specific details (tool names, workflows) + why they matter
- **Self-aware**: Acknowledge messy reality when relevant
- **No gatekeeping**: Share insights freely
- **No reiteration**: Don't repeat their point and then preach — acknowledge and add value

## Non-NPC Comment Guidelines

**The Vibe**: Builder-to-builder. Cool, encouraging, casual. We got nothing to prove. The proof is in the pudding.

**What Makes Comments Non-NPC**:
- ✅ Acknowledge their point without reiterating it
- ✅ Add a specific detail or connection (tool, workflow, pattern)
- ✅ Keep it casual and encouraging
- ✅ Use natural expressions: "it's too true", "it's too real", "that's the move"
- ✅ Show you're actually reading their comment (specific reference)

**What Makes Comments NPC**:
- ❌ Reiterating what they said and then saying "that's X" or "that's when it becomes Y"
- ❌ Generic phrases: "hits different", "this is the way", "facts", "100%"
- ❌ Preachy tone: "That's exactly right! And here's why..." (sounds like teaching)
- ❌ Corporate acknowledgment: "Thank you for sharing this insight"
- ❌ Generic "Thanks!" without connection

**Builder-to-Builder Examples**:
- Good: "teodora!! ⚡ it's too real. git history = the map that actually updates itself."
- Bad: "teodora!! ⚡ that treasure hunt line hits different. git history = the map that actually updates itself." (NPC phrase + reiteration)

- Good: "david! ⚡ version control is what makes it stick."
- Bad: "david! ⚡ exactly. the version control piece is what makes it stick — git history shows you what changed and why, not just what exists now. that's the difference between a wiki and an operating system." (reiterates their point, then preaches)

## Anti-Patterns to Avoid

- ❌ Generic "Thanks!" or "Appreciate it!" without value add
- ❌ Corporate speak ("Thank you for your insightful comment")
- ❌ Authority signaling phrases ("Let me be clear", "Here's the thing")
- ❌ Em-dashes (use periods, commas, or restructure)
- ❌ Overly formal language
- ❌ NPC responses that could apply to anyone
- ❌ Too long or verbose (keep it short and punchy)
- ❌ Missing the playful energy (add personality, exclamation marks when natural)
- ❌ **Reiterating their comment** and then saying "that's X" or "that's when it becomes Y" (preachy)
- ❌ **NPC phrases**: "hits different", "this is the way", "facts", "100%", "exactly right!"

## Examples

**Comment:** "This is powerful. Turning tribal knowledge into versioned systems is the real scale unlock."
**Reply:** "git history shows you what changed and why, not just what exists now."

**Comment:** "wooooow - fire as always Shawn 🔥"
**Reply:** "appreciate it ⚡ the real win is when clients can clone the repo and run their own plays without me."

**Comment:** "Interesting to see MCP servers used this way"
**Reply:** "MCP servers are basically the API layer between Claude Code and everything else — Slack, Instantly, LinkedIn, HeyReach. lets the AI orchestrate workflows without me copy-pasting between tools."

**Comment:** "Killin' it, Shawn 🔥" (from brand account)

**Option 1:** "HeyReach.io thanks!! your MCP server is integral part of the system. automated campaign exports straight into the repo. The conversation skill is chef's kiss. 🚀"

**Option 2:** "thanks!! ⚡ your MCP integration is actually part of the system — automated campaign exports straight into the repo."

**Option 3:** "HeyReach.io appreciate it! your MCP server is integral part of the system. automated campaign exports straight into the repo. The conversation skill is chef's kiss. that's the workflow in action. 🚀"

---

**Comment:** Generic enthusiastic comment

**Option 1:** "teodora!! ⚡ it's too real."

**Option 2:** "teodora!! ⚡ it's too real. git history = the map that actually updates itself."

**Option 3:** "teodora!! ⚡ it's too real. git history = the map that actually updates itself. no more 'where did we put that workflow' moments."

---

**Comment:** Question or technical interest

**Option 1:** "david! ⚡ version control is what makes it stick."

**Option 2:** "david! ⚡ git history shows you what changed and why, not just what exists now."

**Option 3:** "david! ⚡ git history shows you what changed and why. that's the move."

## Browser Integration Workflow

When user has LinkedIn post open in browser:

1. **Capture Post Context**
   - Use `browser_tabs` to list open tabs and identify LinkedIn post
   - Use `browser_snapshot` to capture post content and all visible comments
   - Scroll down if needed to load all comments (`browser_scroll` + `browser_wait_for`)
   - Take full-page screenshot if needed to see all commenters

2. **Parse Comments**
   - Extract commenter names, roles/titles, and comment text
   - Identify which commenters need replies (user will specify or all visible)
   - Note post topic and context for generating relevant replies

3. **Generate Replies**
   - Load voice DNA files (core-voice.md, anti-slop.md, linkedin.md)
   - Generate **three reply variations** for each commenter:
     - Vary length, tone, and technical depth
     - Option 1: Shortest/most playful
     - Option 2: Balanced playful + value
     - Option 3: More substantive/technical
   - Match tone to comment type (enthusiastic = playful, substantive = value-add)

4. **Present Replies**
   - Show all generated replies in copy-paste format
   - Group by commenter with their name/role
   - Ready to review and edit if needed

5. **Post Replies (Optional)**
   - If user wants to post directly:
     - Use `browser_click` on reply button for each comment
     - Use `browser_type` or `browser_fill` to enter reply text
     - Wait for each reply to post before moving to next
   - Or user can copy-paste manually

## Output Format

Present **three reply options** for each commenter in this format:

```
**For [Commenter Name] ([Role/Title]):**

**Option 1** (Shortest/Playful):
[Generated reply text - 1 sentence, high energy]

**Option 2** (Balanced):
[Generated reply text - 1-2 sentences, playful + value add]

**Option 3** (Substantive):
[Generated reply text - 2 sentences, technical detail or deeper insight]

---

**For [Commenter Name] ([Role/Title]):**

**Option 1** (Shortest/Playful):
[Generated reply text]

**Option 2** (Balanced):
[Generated reply text]

**Option 3** (Substantive):
[Generated reply text]
```

User selects which option to use (or edits/combines elements from multiple options). Ready to copy-paste or post directly via browser.
