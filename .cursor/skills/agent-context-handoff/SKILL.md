---
name: agent-context-handoff
description: Produces a scope/handoff document optimized for loading into a new agent's context window. Use when the user asks for "full scope of this chat", "context for new agent", "handoff to new thread", "thread into new context", "what the next agent needs to know", or when starting a new workflow/content pillar and need context for it.
---

# Agent Context Handoff

When the user asks for a handoff document (full scope, context for new agent, thread into new context), produce a **context handoff document** that a new agent can paste into a fresh chat and continue without prior conversation.

## Document Principles

1. **Standalone** — No prior context required; new agent understands immediately
2. **Token-efficient** — Concise; every section earns its place
3. **Actionable** — Ends with "What the next agent should do" so the new agent knows immediate next steps
4. **File-anchored** — Include paths so the new agent can `read_file` without guessing

## Sections to Produce

| Section | Contents |
|---------|----------|
| Partner/context | Who, what project, contact names |
| What we accomplished | Completed tasks, deliverables, decisions |
| Key files | Paths to outputs, inputs, references |
| Open questions / blocked | Anything unresolved or pending |
| Next steps | Specific actions for the new agent |
| Workflow hooks (optional) | Related skills, commands, scripts to invoke |

## Format Rules

- Markdown with clear headers
- No redundant preamble ("This document summarizes...") — start with content
- Use bullet lists and tables for scanability
- Keep under ~200 lines unless the conversation was genuinely large
- Use absolute or repo-relative paths for files

## Output

Return the document as markdown in the chat. The user can copy it and paste into a new thread. Optionally offer to save it to a file (e.g. `clients/partner/<partner>/resources/handoff-YYYY-MM-DD.md` or a handoffs folder in the project).
