---
name: value-pin-comments
description: Generate value pin comments for LinkedIn posts. Analyzes the post and produces 10 diverse comment options across different buckets (technical depth, encouragement, pattern recognition, observational, stack reveal, etc.). Use when the user types /pincomments or asks for value pin comments, pinned comments, or comment options for a LinkedIn post.
---

# Value Pin Comments — LinkedIn Post Comment Generator

Generates 10 value pin comment options for a LinkedIn post. The user picks 2-3 to pin to their post as "value delivery" comments that add depth, encourage engagement, or reveal additional insight.

## Command Pattern

- `/pincomments` — analyze the most recent LinkedIn post draft/final and generate options
- `/pincomments <path>` — analyze a specific post file
- Also triggers when the user asks for "value pin comments", "pin comments", "comment options", or "pinned comments" for a LinkedIn post

## Workflow

### Step 1: Identify the Post

1. **If path provided**: Use that file
2. **If post text is in conversation**: Use it directly
3. **If neither**: Check most recent files in `content/linkedin/drafts/` and `content/linkedin/final/`
4. **If multiple versions exist in a draft file**: Use the version marked as final, or the last version in the file
5. **If nothing found**: Ask: "Which post do you want pin comments for? Drop the text or point me to the file."

### Step 2: Analyze the Post

Extract from the post:
- **Core topic/thesis** — what the post is actually about
- **Key data points** — any numbers, stats, or quantifiable results mentioned
- **Tools/stack referenced** — specific tools, systems, or workflows named
- **Audience** — who this post is speaking to (builders, SDRs, GTM engineers, etc.)
- **Pillar** — which content pillar (Plays Series, Building & Sharing, Skill/System Shares, Release Reactions, GTM Memes)
- **Emotional arc** — the post's energy (reflective, technical, hype, pattern recognition)
- **Image/screenshot context** — what's shown in the attached visual, if any

### Step 3: Load Voice References

Read before generating:
- `skills/tier-1-voice-dna/core-voice.md` — voice principles
- `skills/tier-2-context-playbooks/linkedin.md` — LinkedIn comment strategy

Key principles for pin comments:
- Comments are a **content delivery channel**, not afterthoughts
- "The post is the hook, the comments are the delivery"
- No gatekeeping — share insights, prompts, formulas, reasoning freely
- Builder-first tone, casual competence
- Lowercase first word (unless proper noun)
- Short paragraphs (1-2 sentences max)

### Step 4: Generate 10 Comments Across Buckets

Generate exactly **10 comment options** spread across these buckets. Each comment should be 2-5 short paragraphs (matching the existing comment style). Not every bucket needs to be used — pick the ones that fit the post best, but always cover at least 6 different buckets.

#### Comment Buckets

1. **Technical Deep Dive** — explains HOW it actually works under the hood. Tools, architecture, the "machinery" behind the post. Answers the builder's question before they ask it.

2. **Stack/Tools Reveal** — lists the specific tools and tech that make it work. Uses arrow markers (→). Answers "what tools are you using?" proactively. Good for posts that reference systems without naming every piece.

3. **Personal Realization / Click Moment** — the "aha" that happened while building. What clicked. What you didn't see until you did. Reflective, honest, slightly surprised energy.

4. **Encouragement / Invitation to Act** — encourages the reader to try it themselves. Low barrier entry point. "Start with one thing." Casual, no-pressure, builder-to-builder.

5. **Bigger Picture / System Context** — zooms out. How this specific thing fits into the larger operating system, repo, or GTM infrastructure. Connects the dot to the broader build.

6. **No Gatekeeping / Resource Delivery** — open invitation to share resources, prompts, or files. Signals that more is coming. Uses the "no gatekeeping" identity anchor.

7. **Pattern Recognition / Observational** — names a pattern most people haven't articulated. The "here's what I noticed" comment. Insight-driven. This is your superpower — use it.

8. **Before/After Contrast** — what life was like before this thing existed vs after. Short, punchy contrast. Makes the value tangible and relatable.

9. **Anticipated Question / FAQ** — answers the question readers will have. "People are going to ask X, so here's the answer." Proactive, generous, removes friction.

10. **What's Next / Momentum Builder** — teases what's coming. What you're building next. What this unlocks. Creates follow-up energy without being salesy.

### Step 5: Format and Present

Present all 10 options in this format:

```
## Value Pin Comment Options

**Post**: {post title or first line}

---

**Option 1** — {Bucket Name}
{comment text}

---

**Option 2** — {Bucket Name}
{comment text}

---

(... through Option 10)

---

Pick 2-3 to pin. I'd recommend Options {X}, {Y}, and {Z} for the best coverage.
```

Each comment should:
- Start with lowercase first word (unless proper noun)
- Be 2-5 short paragraphs (match existing comment length/style)
- Use builder-first voice — casual, competent, no corporate speak
- Include specific details from the post (data points, tool names, workflow steps)
- Stand alone as valuable — someone should get value from the comment even without the post
- Use emoji structurally when appropriate (→ for lists, ⚡ for energy, ✅ for items)
- NOT repeat the post's content — extend, deepen, or complement it
- NOT use em-dashes (use periods, commas, or restructure)
- NOT use authority signaling phrases ("Let me be clear", "Here's the thing")
- NOT be generic — every comment should be specific to THIS post

### Step 6: Recommend Top 3

After presenting all 10, recommend which 3 create the best coverage:
- Aim for **variety** across buckets (don't pick 3 from the same category)
- Prioritize: one technical/depth comment + one encouragement/invitation + one pattern/observational
- Consider comment ordering: first pin = most impactful, last pin = CTA or resource delivery

## Examples from Existing Posts

### Weekend Build Post (3 comments):

**Comment 1 (Bigger Picture + Image Context)**:
that tree in the image? that's the actual repo structure. left side is the GTM OS (client management, plays, automations). right side is the Content OS (voice DNA, playbooks, content ops).

both live in the same repo. both version-controlled with git. everything's in one place.

**Comment 2 (Stack/Tools Reveal)**:
people keep asking what tools I'm using, so here's the stack that makes it work:

→ Cursor (IDE -- where everything lives)
→ Claude Code (AI that reads the skill files)
→ MCP servers (Model Context Protocol -- connects AI to Slack, Instantly, LinkedIn, HeyReach, Typefully)
→ Git (version control for the whole system)
→ Clay + HubSpot + Instantly (the GTM stack the OS orchestrates)

happy to go deeper on any of these.

**Comment 3 (Encouragement + No Gatekeeping)**:
if you want to build something like this, start with one skill file. just one. write down how you want AI to write for you. your voice rules, your anti-patterns, what you never want to see.

that single file changes everything.

more on the full system coming soon. no gatekeeping

### Skill Tree Post (2 comments):

**Comment 1 (Personal Realization)**:
the wild part is that i didn't even realize i was building a skill tree until i saw this image.

it clicked. all those hours grinding through Cursor. all those skill files. all those MCP servers.

it's the same loop. unlock. acquire. repeat.

**Comment 2 (Encouragement / Invitation)**:
if you're building GTM systems and you've never played an RPG, go play one. seriously.

you'll understand the progression loop. you'll understand why unlocks feel so good. you'll understand why building your own tree is addictive.

### Slack Sync Post (2 comments):

**Comment 1 (Technical Deep Dive)**:
the skill is a markdown file that tells Cursor exactly how to use the Slack MCP. it reads every message in the channel, categorizes them, extracts decisions and deliverables, and writes a structured summary. same output every time. no prompt engineering needed — just /slacksync.

**Comment 2 (Bigger Picture / System Context)**:
this is part of the operating system I've been building inside my code editor. every partner has a resource folder. slack history, email replies, campaign data — all structured, all versioned, all in one place. planning ahead becomes the default because the context is always there.

## Style Rules Summary

- Lowercase opening word
- Short paragraphs (1-2 sentences)
- Builder-first, casual competence
- Specific to the post (reference actual data points, tools, workflows)
- Extends the post, doesn't repeat it
- Value-first — every comment should teach, reveal, or invite
- Arrow markers (→) for tool/step lists
- Identity markers (⚡ 🧙‍♂️) used naturally, not forced
- "no gatekeeping" when delivering resources
- No em-dashes, no corporate speak, no authority signaling
