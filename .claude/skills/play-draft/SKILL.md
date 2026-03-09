---
name: play-draft
description: Turn a screenshot of shipped work into LinkedIn and X content drafts. Use when the user types /playdraft with a screenshot and context about the scenario and pillar.
---

# Play Draft - Screenshot to Content

Takes a screenshot of something you built/shipped and generates LinkedIn (3 versions) + X thread (4-5 tweets).

## Commands

- `/playdraft` - use screenshot in conversation
- `/playdraft <image-path>` - use specific screenshot

## Workflow

1. **Read screenshot** - extract tool/system shown, visible data, quantifiable results
2. **Get user context** - scenario (what was built) + pillar selection
3. **Load references** before drafting:
   - `skills/tier-3-content-ops/pillars/{pillar}.md`
   - `skills/tier-1-voice-dna/core-voice.md` + `viral-hooks.md`
   - `skills/tier-2-context-playbooks/linkedin.md` + `x-twitter.md`
4. **Generate LinkedIn** - 3 versions with different angles, 2-5 hook options
5. **Generate X thread** - 4-5 tweets, each <280 chars, standalone + narrative
6. **Save** LinkedIn to `content/linkedin/drafts/YYYY-MM-DD_{slug}.md`, X to `content/x/drafts/YYYY-MM-DD_{slug}.md`

## Pillars & Angles

| Pillar | Angles |
|--------|--------|
| Plays Series | Workflow Walkthrough, Pain Point Hook, Results Angle |
| Building & Sharing | Builder Story, Process Angle, Pattern Recognition |
| Skill/System Shares | System Reveal, Meta Take, Invitation |
| Release Reactions | First Take, Builder Test, Implications |

## Voice Rules

- Lowercase first word (except I, proper nouns)
- Sign-off: "shawn [lightning] the gtme alchemist [wizard]"
- LinkedIn: 1000+ chars, reference screenshot data naturally
- X: <280 chars per tweet, punchy builder tone
- Plays Series: use format "gtm plays i use every day, part [n] [lightning]"
- After drafting: user reviews, picks version, then `/finalcopy`
