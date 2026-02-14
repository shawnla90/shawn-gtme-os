# Breadcrumb Protocol

Forward-referencing strategy for planting subtle hints about future projects in current content. Creates a retroactive "the clues were there all along" effect when future projects launch.

This is a strategy document, not a skill. Content creation skills (`/substackpost`, `/playdraft`, `/websitepost`) reference this file when generating drafts and suggest one natural breadcrumb placement if an active breadcrumb is relevant to the topic.

---

## What a Breadcrumb Is

A breadcrumb is a forward reference planted in current content that hints at a future project without naming it directly. It's not an announcement. It's not a teaser campaign. It's a subtle thread that only becomes visible in retrospect.

When the future project launches, someone scrolling back through your posts should be able to find the clues. That retroactive discovery is the payoff.

## Rules

1. **Never force it.** Only drop a breadcrumb where it fits naturally in the content. If you have to stretch to include it, skip it.
2. **Subtlety over announcement.** If it reads like a teaser or a coming-soon plug, you did it wrong. It should feel like a natural observation or aside.
3. **One per post, maximum.** Never stack breadcrumbs. One subtle reference is enough. Most posts won't have any.
4. **Breadcrumbs are optional.** Not every piece of content needs one. The protocol exists so the system knows what's available, not so it forces insertion.
5. **Don't name it until it's ready.** The project name, domain, or specific details stay internal until launch. Breadcrumbs reference the pattern or direction, not the destination.
6. **Let the content earn it.** The breadcrumb should feel like a natural extension of whatever the post is already about. If the post is about building systems, a mention of "this pattern applies everywhere" fits. If the post is about a Clay workflow, it probably doesn't.

## Keyword Awareness

The three-site network has a deliberate SEO topology (see `website/taxonomy.yaml` for the full keyword map). When placing breadcrumbs, be aware of which site a post will live on and what keyword territory it serves:

- **shawnos.ai** posts naturally hint at the GTM and content arms ("this system doesn't just build content -- it runs entire pipelines")
- **thegtmos.ai** posts naturally hint at the builder behind it ("I built this in one repo with AI agents -- more on that at shawnos.ai")
- **thecontentos.ai** posts naturally hint at the methodology being AI-native ("this isn't just a content strategy -- it's an operating system")

The parent keyword "building with AI" connects all three. Any post on any site can reference the umbrella concept without naming the other sites directly. That's the most natural breadcrumb of all.

## Active Breadcrumbs

Ideas from the idea bank (`skills/tier-3-content-ops/captures/idea-bank.md`) that have breadcrumb notes and are worth hinting at in current content.

### 1. OS Thinking Beyond GTM → Zen OS (parked)

**Idea bank ID**: `zen-os`

**What to hint at**: The operating system pattern applies beyond GTM. Health, lifestyle, fitness, daily habits. once you see the recursive loop, you start seeing it everywhere.

**Natural language patterns** (use variations, not verbatim):
- "this is just the first three"
- "the OS pattern applies to everything, not just GTM"
- "once you see the recursive loop, you start seeing it everywhere"
- "the network is growing" (in context of the three-site build)
- "I keep finding new places where this pattern fits"
- reference to AI touching "every part of how you operate, not just work"

**Where it fits naturally**:
- Posts about the three-site network (shawnos/gtmos/contentos) — the "first three" framing implies more
- Posts about the recursive loop or meta-documentation pattern — "this applies to more than content"
- Posts about AI in daily life or personal productivity — the lifestyle angle without naming the project
- Posts about the OS concept in general — "the OS isn't just for GTM"

**Where it does NOT fit**:
- Technical walkthroughs of specific Clay/CRM workflows
- Partner campaign updates
- Play-by-play series posts focused on a specific tactic
- Any post where it would feel shoehorned

### 2. The Build Unlocks a New Layer → Twitch Gaming + Discord (parked)

**Idea bank ID**: `twitch-gaming-discord`

**What to hint at**: The computer build unlocks a new content layer. Live, unfiltered, community-driven. The OS goes real-time. Coding and gaming converge.

**Natural language patterns** (use variations, not verbatim):
- "building the machine that runs the stream"
- "the build isn't just hardware -- it's a new channel"
- "once this rig is done, you'll see why"
- "the OS goes live"
- "there's a reason I'm documenting the build"
- "the system doesn't stop at written content"
- "real-time is the next layer"

**Where it fits naturally**:
- Posts about the computer build -- the "building the machine" framing implies something beyond the hardware
- Posts about expanding the content network or adding new platforms
- Posts about community building or audience beyond LinkedIn/X
- Posts about the recursive loop -- "the build becomes the content becomes the build"
- Posts about what's next or future plans -- "the OS keeps expanding"

**Where it does NOT fit**:
- GTM partner campaign posts
- Technical Clay/CRM workflow breakdowns
- Newsletter growth or content methodology posts
- Play-by-play series posts focused on a specific tactic
- Any post where mentioning hardware or live content would feel shoehorned

---

## Retired Breadcrumbs

Breadcrumbs for ideas that have been shipped or cancelled. Kept for reference.

(none yet)

---

## How Content Skills Use This File

When a content creation skill generates a draft:

1. Read this file
2. Check if any active breadcrumb is relevant to the post topic
3. If yes: suggest ONE natural placement in the draft, clearly marked as optional
4. If no: skip it. Don't force it.

The breadcrumb suggestion should be presented as:

```
[Optional breadcrumb]: "{suggested line or phrase}"
Context: hints at {idea bank ID} — {brief explanation}
```

The user decides whether to keep or cut it. The system suggests, never inserts automatically.
