# Substack Content Queue

Content drafts for the AI Alchemy newsletter on Substack. Expanded deep dives from LinkedIn/X posts, original build logs, and tactical breakdowns.

## File Naming

```
YYYY-MM-DD_slug.md
```

Example: `2026-02-11_content-os-reveal.md`

## Workflow

1. Draft goes in `drafts/`
2. Review against Substack playbook (`skills/tier-2-context-playbooks/substack.md`)
3. Finalize: copy-paste into Substack editor (or push via MCP when available)
4. Move to `final/` after publishing (or delete — git history has it)

## Format

Each draft file contains:
- **Frontmatter**: platform, structure, series post #, status, source (if repurposed)
- **Subject line options**: 2–3 options for the email subject
- **Preview text**: 1-line preview for inbox
- **Post body**: 300–800 words, markdown native
- **CTA block**: Value-led subscriber engagement
- **Visual notes**: References to attached screenshots/artifacts

## Voice Reference

See `skills/tier-2-context-playbooks/substack.md` for Substack-specific voice and formatting rules.

## Series Tracking

See `workflows/substack-index.md` for post sequence, legacy archive, and next post indicator.

## Commands

- `/substackpost` — context-aware draft (reads substack-index for next post #)
- `/substackpost <topic>` — draft on a specific topic
- `/substackpost repurpose <path>` — expand a LinkedIn/X draft into newsletter format
