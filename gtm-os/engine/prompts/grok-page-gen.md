# Grok Page Generation Prompt

Generates full PageData JSON for personalized landing pages.

## Output Structure

- 5 company-specific stats
- 4 challenges mapped to their business
- 4 deliverables (what we'd build)
- Engagement timeline
- FAQ
- Tech stack assessment
- Brand color (hex from website)

## Constraints

- Voice rules baked into prompt (see `messaging/voice.md`)
- Slugs >40 chars rejected (Exa sometimes returns blog URLs instead of company names)
- Must produce valid JSON that maps to PageData TypeScript interface
- Brand color should be extracted from actual website, not guessed

## Script

`generate.py` calls Grok after Exa deep dive provides context.
