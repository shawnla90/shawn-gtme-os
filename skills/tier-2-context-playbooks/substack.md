# Substack Playbook

> Inherits from: `tier-1-voice-dna/core-voice.md`

## Platform DNA

Substack is the deep-dive layer. LinkedIn and X hook, compress, and spark. Substack expands, deepens, and builds the longer relationship. This is where a 3-line hook becomes a 600-word breakdown. Where a screenshot becomes a full build log. Where the 50 early subs become the core audience that follows the whole arc.

## Brand Evolution

**Legacy**: "Inside the Lab" volumes (Vol. 0–3 + Backstory Build) on Beehiiv. Custom anime artwork per issue. High production overhead.

**New era**: "AI Alchemy" (working name). Same Alchemist/Lab DNA, new format. Visuals come from actual builds — Cursor screenshots, repo tree views, Claude chat outputs, screen recordings. The content IS the visual. No separate art production step.

**What carries forward**: The Alchemist identity, the builder-first energy, the no-gatekeeping principle, the Lead Alchemy brand.

**What changes**: Volume numbering → post numbering (tracked in `workflows/substack-index.md`). Anime art → build artifacts. Signal-chaining deep dives → Content OS and Cursor skill deep dives (plus GTM when it fits).

## Tone

Long-form extension of builder voice. More reflective, more room to breathe. Sentences can run longer than LinkedIn. Paragraphs can have 2–3 sentences. But the same casual competence — never academic, never corporate.

Think: the version of you that sits down after shipping something and explains how the whole thing works to someone who's about to build their own.

## Content Structures

### The Personal POV Essay

Start with a story, zoom out to a lesson. Most narrative of the four.

- 400–800 words
- First-person, reflective
- The messy reality is the content
- Ends with an insight or shift in thinking, not a CTA

### The Tactical Breakdown

Step-by-step or "how I did it." The Substack version of a GTM Play or Skill Play.

- 500–800 words
- Screenshots and code snippets inline (not just in comments)
- Numbered steps or clear sections
- Enough to be useful, not so much they don't need to build it themselves

### The Contrarian Take

Opinion-based issue that takes a strong stance.

- 300–600 words
- Lead with the take, defend it with specifics
- Conviction-driven, not clickbait
- Works best when you're reacting to something real (a trend, a tool release, a pattern you keep seeing)

### The Curated Drop

Links + commentary on things you're watching, reading, building.

- 300–500 words
- 3–5 items with your take on each
- Good for weeks when you're building more than writing
- Lowest lift, still delivers value

### Notes (Feed Posts)

Short-form social posts in the Substack Notes feed. Not articles. 1-4 sentences. Ultra-casual builder energy. Use `/substacknote` to generate from the daily tracker.

- 1-4 sentences (2-3 is the sweet spot)
- No titles, no headers, no CTAs
- Lowercase everything except I
- Screenshots from the build welcome but not required
- Think "what's on your mind" not "here's my take"
- Frequency: 2-3x per week minimum, daily when shipping
- Saved to `content/substack/notes/` and tracked in the Notes Log in `workflows/substack-index.md`

## Word Count Range

300–800 words per post (articles). Can go longer for essays if the content earns it. Shorter is fine for curated drops. Notes are 1-4 sentences and don't follow word count targets. The constraint is substance, not length.

## Opening Line Style

Same rules as LinkedIn — lowercase first word, capitalize I, strong hook in first 1–2 lines. But Substack gives you a subject line AND a preview text, so the hook gets split:

- **Subject line**: The scroll-stop. Short, punchy, curiosity or contrarian.
- **Preview text**: The context line. What this issue covers. 1 sentence.
- **First line of body**: Can be softer than LinkedIn because the subject line already hooked them. Start with story, context, or the setup.

## Subject Line Style

- Lowercase unless proper noun or I
- No clickbait, no question marks for engagement
- Should work as a standalone statement
- 5–10 words ideal

**Good**: "I built a content operating system inside a code editor"
**Good**: "the skill tree that runs my entire workflow"
**Good**: "why I stopped making AI art for my newsletter"
**Bad**: "You Won't Believe What I Built This Weekend!"
**Bad**: "Newsletter Update #6"

## Sign-Off Style

Same identity anchors as LinkedIn/X:

- "shawn ⚡ the gtme alchemist 🧙‍♂️"
- "- shawn ⚡"

Substack feels more personal, so the sign-off can be warmer. Optional: add a 1-line "what's next" or "what I'm building" teaser before the sign-off.

## CTA Style

Substack CTAs serve a different purpose than LinkedIn. You're not driving to comments — you're building the subscriber relationship and cross-pollinating.

**Growth CTAs** (from newsletter-growth pillar):
- "if this hit, share it with someone building their own system"
- "the full skill file is on GitHub — link below"
- "reply to this email and tell me what you'd build first"

**Cross-platform CTAs**:
- "I broke this down in a LinkedIn post last week — deeper version here"
- "the condensed thread version of this is on X"

**Never**:
- "subscribe for more"
- "like and share"
- Generic engagement bait

## Visual Strategy

No more custom artwork. Visuals come from the build:

- **Cursor screenshots**: Skill files open, chat with slash commands, tree view
- **Repo tree views**: The generated tree visualization
- **Claude/AI chat outputs**: The actual conversation that produced something
- **Screen recordings**: Short clips of workflows running (embedded or linked)
- **Code snippets**: Inline, not as images

One visual per post minimum. It should be something you already have from building — zero extra production time.

## Cross-Posting Rules

| Content Type | Origin | Substack Treatment |
|---|---|---|
| GTM Plays | LinkedIn first | Expand into Tactical Breakdown 3–5 days later |
| Skill Plays | LinkedIn first | Expand into Tactical Breakdown or POV Essay |
| Build logs | X or LinkedIn first | Expand into full story (Personal POV Essay) |
| Hot takes | X native | Expand into Contrarian Take if it has legs |
| Original deep dives | Substack first | Condense for LinkedIn/X after publish |
| Curated drops | Substack native | Tease on X/LinkedIn with 1 highlight |

## Frequency

Start with 1x per week or biweekly. Consistency matters more than frequency, especially with 50 subs who haven't heard from you in 9 months. Build the rhythm, then increase.

## Formatting Rules

- **Capital I**: Always. Same as every platform.
- **No quotation marks**: Same rule. Write phrases directly.
- **No em-dashes**: Period + space for breaks. Same as LinkedIn/X.
- **Markdown native**: Substack supports markdown. Use headers, bold, code blocks, bullet lists natively. No need to strip like LinkedIn.
- **Headers for sections**: Use `##` for major sections in longer posts. Helps scanability.

## Substack Anti-Slop Patterns

These are the most common AI-generated voice drift patterns in Substack posts. Learned from real edits across published posts. Cut these during drafting and enforce during finalization.

1. **No throat-clearing transitions** -- cut phrases like "here's the thing", "here's what I keep coming back to", "here's where I have to be honest", "this hit me harder than I expected." These are filler that delay the point. Go direct.
2. **No metaphors/similes as paragraph closers** -- if the direct statement is strong enough, an analogy weakens it. "and it worked" beats "and it worked. people associated me with Clay the way they'd associate a chef with their signature dish." Cut the comparison. Let the literal land.
3. **No hidden knowledge framing** -- don't use "nobody tells you about", "the thing most people miss", "what they don't teach you." Say the observation directly. "heres the reality about being the tool guy" not "but here's the thing nobody tells you about being the tool guy."
4. **Two examples, not three** -- AI defaults to tripling (Clay, Instantly, Cursor). Two examples is a cleaner rhythm. Only use three when each one adds something genuinely distinct. Two that hit > three that pattern.
5. **No emotional telegraphing** -- don't preview how the reader should feel before the reveal. "I realized I was one rebrand away from having to rebuild" is stronger than "this hit me harder than I expected. I realized I was one rebrand away." Let the content create the emotion.
6. **Broad tool references when tools aren't the point** -- don't namecheck specific features (Sculptor prompts, Claygents, lifecycle stages) when the post is about identity, systems, or journey. Save feature-level specifics for tactical breakdowns where they earn their space.
7. **Paragraph breaks for punchlines** -- one-line statements that carry weight get their own paragraph beat. Don't bury them inside longer paragraphs. "your most valuable IP isn't your proficiency with a tool." lands harder alone.
8. **Lowercase days of the week** -- "friday", "monday", "tuesday" match the lowercase-first-word voice. Only capitalize if it starts a sentence AND is the first word (which is already lowercase per voice rules, so effectively always lowercase).

## Avoid

- Volume numbering (that era is done)
- Custom artwork production (the build is the visual)
- Generic newsletter language ("in this issue", "happy Tuesday")
- Over-polished tone (Substack readers want the real version)
- Gatekeeping (same rule everywhere — resources in the post, not behind a paywall)
- Posting without a visual (every post gets at least one screenshot or artifact)

## References

- `skills/tier-3-content-ops/pillars/newsletter-growth.md` — CTAs, lead magnets, conversion hooks
- `skills/tier-3-content-ops/pillars/newsletter-editorial.md` — content structures, topic mapping, rhythm
- `skills/tier-3-content-ops/pillars/newsletter-repurpose.md` — format templates for social → newsletter
- `workflows/substack-index.md` — post sequence and series tracking
