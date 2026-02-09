# Markdown to Notion Conversion Guide

This guide documents how to convert repository markdown files to Notion's enhanced markdown format for proper rendering.

## Overview

Notion uses an enhanced markdown format that supports additional features beyond standard markdown. When syncing content to Notion, we need to convert standard markdown to Notion's format while preserving structure and formatting.

## Notion Enhanced Markdown Specification

**Important**: Always fetch the latest Notion enhanced markdown spec before syncing:
- Use `mcp_notion_notion-fetch` with `id: "notion://docs/enhanced-markdown-spec"`
- The spec may change, so always reference the latest version

## Basic Conversions

### Headers

**Standard Markdown**:
```markdown
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
```

**Notion Format**:
```markdown
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
```

**Note**: Notion supports H1-H3 natively. H4+ may render as H3.

### Text Formatting

**Bold**:
- Standard: `**bold text**` or `__bold text__`
- Notion: `**bold text**` (preserved)

**Italic**:
- Standard: `*italic text*` or `_italic text_`
- Notion: `*italic text*` (preserved)

**Code**:
- Inline: `` `code` `` → Preserved as-is
- Block: ` ```language` → Preserved with language tag

**Strikethrough**:
- Standard: `~~strikethrough~~`
- Notion: `~~strikethrough~~` (preserved)

### Lists

**Unordered Lists**:
```markdown
- Item 1
- Item 2
  - Nested item
```

**Ordered Lists**:
```markdown
1. First item
2. Second item
   1. Nested item
```

**Notion**: Both formats are preserved as-is.

### Links

**Standard Markdown**:
```markdown
[Link text](https://example.com)
```

**Notion**: Preserved as-is. Also supports:
- `https://example.com` (auto-linked)
- `[Link text](https://example.com)` (explicit link)

### Images

**Standard Markdown**:
```markdown
![Alt text](image-url.png)
```

**Notion**: Preserved as-is. Images are embedded when URL is accessible.

### Tables

**Standard Markdown**:
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

**Notion**: Tables are preserved. Notion supports:
- Standard markdown tables
- Table blocks (created via API)

### Code Blocks

**Standard Markdown**:
````markdown
```python
def hello():
    print("Hello")
```
````

**Notion**: Preserved with language tag. Supported languages include:
- `python`, `javascript`, `typescript`, `bash`, `json`, `yaml`, `markdown`, etc.

### Blockquotes

**Standard Markdown**:
```markdown
> This is a quote
> Multiple lines
```

**Notion**: Preserved as-is.

### Horizontal Rules

**Standard Markdown**:
```markdown
---
```

**Notion**: Preserved as `---` or converted to divider block.

## Frontmatter Handling

**Standard Markdown with Frontmatter**:
```markdown
---
title: Page Title
description: Page description
version: 1.0
---

# Content starts here
```

**Notion Conversion**:
1. **Extract frontmatter**: Parse YAML between `---` delimiters
2. **Store in page properties**: 
   - `title` → Page title property
   - `description` → Description property
   - `version` → Version property (if database)
3. **Remove from content**: Exclude frontmatter from page content
4. **Start content**: Begin page content after frontmatter

## Special Characters

**Emoji**: Preserved as-is
- `⚡`, `🧙‍♂️`, `✌` → Rendered correctly in Notion

**Arrows**: Preserved as-is
- `→`, `←`, `↑`, `↓` → Rendered correctly

**Special symbols**: Most Unicode characters are preserved

## Notion-Specific Features

### Callouts

Notion supports callout blocks (info, warning, error, etc.):

```markdown
> **Note**
> This is a callout block
```

**Conversion**: Standard blockquotes can be converted to callouts if they start with bold text.

### Toggles

Notion supports toggle blocks:

```markdown
▶ Toggle Title
  Hidden content
```

**Conversion**: Not directly supported in standard markdown. Can be added manually in Notion.

### Columns

Notion supports multi-column layouts, but this requires API-level block creation, not markdown.

## Conversion Process

### Step 1: Extract Frontmatter

```python
# Pseudocode
if content.startswith('---'):
    frontmatter_end = content.find('---', 3)
    if frontmatter_end > 0:
        frontmatter = content[3:frontmatter_end]
        content = content[frontmatter_end + 3:]
        # Parse YAML frontmatter
        metadata = parse_yaml(frontmatter)
```

### Step 2: Clean Content

- Remove any trailing/leading whitespace
- Normalize line endings (CRLF → LF)
- Preserve intentional blank lines

### Step 3: Convert Special Cases

- Convert markdown tables to Notion table format (if needed)
- Handle nested lists properly
- Ensure code blocks have proper language tags

### Step 4: Validate Notion Format

- Check that headers are properly formatted
- Ensure links are valid URLs
- Verify code blocks have closing tags

## Common Issues and Solutions

### Issue: Tables Not Rendering

**Problem**: Markdown tables may not render correctly in Notion.

**Solution**: 
- Ensure proper table formatting (pipes, alignment)
- Consider using Notion's table block API instead of markdown

### Issue: Code Blocks Losing Language

**Problem**: Language tags may be stripped.

**Solution**: Always include language tag: ` ```language` not just ` ``` `

### Issue: Nested Lists Not Working

**Problem**: Nested lists may flatten.

**Solution**: Ensure proper indentation (2 or 4 spaces, consistent)

### Issue: Frontmatter Appearing in Content

**Problem**: Frontmatter shows up as content in Notion.

**Solution**: Always extract and remove frontmatter before syncing content

### Issue: Special Characters Breaking

**Problem**: Emoji or special characters not rendering.

**Solution**: Ensure UTF-8 encoding is preserved

## Best Practices

1. **Always fetch the spec**: Use `mcp_notion_notion-fetch` to get latest enhanced markdown spec
2. **Test conversions**: Test markdown conversion on a sample page first
3. **Preserve structure**: Maintain heading hierarchy and list nesting
4. **Extract metadata**: Store frontmatter in page properties, not content
5. **Handle errors gracefully**: If conversion fails, sync raw markdown as fallback

## Examples

### Example 1: Simple Document

**Source Markdown**:
```markdown
# My Workflow

This is a simple workflow document.

## Steps

1. First step
2. Second step
3. Third step

## Notes

- Important note 1
- Important note 2
```

**Notion**: Renders exactly as shown (no conversion needed for simple cases)

### Example 2: Document with Frontmatter

**Source Markdown**:
```markdown
---
name: client-comms
description: Client communications playbook
---

# Client Communications Playbook

> Inherits from: `tier-1-voice-dna/core-voice.md`

## Context

Emails, decks, recaps, status updates.
```

**Notion Conversion**:
- Extract: `name: "client-comms"`, `description: "Client communications playbook"`
- Store in page properties
- Content starts with: `# Client Communications Playbook`

### Example 3: Code Example

**Source Markdown**:
````markdown
## Example Code

Here's a Python example:

```python
def sync_to_notion(file_path):
    """Sync a file to Notion"""
    content = read_file(file_path)
    notion_page = create_page(content)
    return notion_page
```
````

**Notion**: Code block renders with syntax highlighting (if language supported)

## Testing Conversion

Before syncing all files, test conversion:

1. Pick a sample markdown file
2. Convert using the rules above
3. Create a test page in Notion
4. Verify rendering matches expectations
5. Adjust conversion rules if needed

## References

- Notion Enhanced Markdown Spec: Fetch via `mcp_notion_notion-fetch` with `notion://docs/enhanced-markdown-spec`
- Notion API Docs: https://developers.notion.com/reference
- Notion MCP Guide: https://developers.notion.com/guides/mcp
