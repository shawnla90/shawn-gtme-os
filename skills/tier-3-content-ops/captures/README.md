# Content Captures

This directory contains content captured from Slack and organized by category.

## Categories

- **content-ideas.md** - LinkedIn post ideas, content concepts, article ideas
- **workflow-notes.md** - Workflow improvements, process optimizations, operational insights
- **thoughts.md** - Random thoughts, observations, ideas captured on the go
- **improvements.md** - System improvements, feature requests, technical enhancements

## How to Add Content

### Via Slack

Send a message to the GTM OS Bot:

```
@gtm-bot content-idea: Your idea here
```

Or use the slash command:

```
/capture content-idea Your idea here
```

### Supported Categories

- `content-idea` / `content-ideas` / `content` → content-ideas.md
- `workflow` / `workflow-note` / `workflow-notes` → workflow-notes.md
- `thought` / `thoughts` → thoughts.md
- `improvement` / `improvements` / `improve` → improvements.md

## File Format

Each capture is automatically timestamped:

```markdown
## 2026-02-07 14:30

Your captured content here

---
```

## Usage Tips

- Be specific with categories - helps with organization
- You can capture multi-line content in Slack
- Content is appended chronologically
- Review regularly and move to appropriate locations as needed
