---
name: notion-sync
description: Sync repository content (branding, clients, partners, workflows, skills) to Notion using MCP. Use when the user types /notionsync or /sync-to-notion or asks to sync content to Notion.
---

# Notion Sync Command

Sync repository content to Notion, enabling you to view and manage your branding, clients, partners, workflows, and skills in Notion with proper markdown rendering.

## Command Pattern

- `/notionsync` - Sync all content sections
- `/notionsync --all` - Sync everything (branding, clients, partners, workflows, skills)
- `/notionsync --branding` - Sync only branding data
- `/notionsync --clients` - Sync only clients database
- `/notionsync --partners` - Sync only partners database
- `/notionsync --workflows` - Sync only workflow pages
- `/notionsync --skills` - Sync only skill pages
- `/notionsync --workflows --skills` - Sync multiple specific sections
- `/notionsync --all --force` - Force re-sync everything (ignore sync state)
- `/notionsync --all --dry-run` - Preview changes without syncing

**Default behavior**: When no flags are provided, sync all sections.

## Architecture

### Sync Direction
- **Repo → Notion**: One-way sync (read from repo, write to Notion)
- **Structured data** → Notion Databases (branding, clients, partners)
- **Markdown content** → Notion Pages (workflows, skills)

### Notion Structure

```
Notion Workspace
├── Databases
│   ├── Personal Branding
│   ├── Clients
│   └── Partners
└── Pages
    ├── Workflows/
    └── Skills/
```

## Workflow

### Step 1: Check Sync State

1. Read `.notion-sync-state.json` if it exists
2. If `--force` flag is set, skip state checking
3. If `--dry-run` flag is set, show what would be synced without making changes
4. Compare file modification times with sync timestamps
5. Only sync files that have changed (unless `--force`)

### Step 2: Find or Create Notion Structure

1. **Search for existing databases** using `mcp_notion_notion-search`:
   - Search for "Personal Branding" database
   - Search for "Clients" database
   - Search for "Partners" database
   - Search for "Workflows" parent page
   - Search for "Skills" parent page

2. **Create missing databases** using `mcp_notion_notion-create-database`:
   - Create "Personal Branding" database if not found
   - Create "Clients" database if not found
   - Create "Partners" database if not found

3. **Create missing parent pages** using `mcp_notion_notion-create-pages`:
   - Create "Workflows" page if not found
   - Create "Skills" page if not found

### Step 3: Sync Branding Data (if `--branding` or `--all`)

**Source files**: `SKILL.md`, `skills/tier-1-voice-dna/core-voice.md`

1. **Read branding source files**:
   - Read `SKILL.md` for overall branding structure
   - Read `skills/tier-1-voice-dna/core-voice.md` for core voice principles

2. **Extract structured branding information**:
   - Core Voice Principles → Database entry
   - Tool Stack → Database entry
   - Audience → Database entry
   - Identity Anchors → Database entry
   - Voice Characteristics → Database entry
   - Voice Modes → Database entry

3. **Create/update database entries** using `mcp_notion_notion-create-pages`:
   - Parent: "Personal Branding" database (data_source_id)
   - Properties:
     - Name (Title): Branding element name
     - Category (Select): Voice DNA, Tool Stack, Audience, Identity, etc.
     - Content (Rich Text): Extracted content from markdown
     - Source File (Text): Path to source file
     - Last Updated (Date): Current timestamp

4. **Handle existing entries**:
   - Query database for existing entries by "Source File" property
   - If entry exists, update it; if not, create new entry

### Step 4: Sync Clients Database (if `--clients` or `--all`)

**Source**: `clients/` directory (if exists)

1. **Check if clients directory exists**
2. **Read client directories**:
   - List all subdirectories in `clients/`
   - For each client directory, look for README.md or config files
   - Extract client metadata

3. **Create/update database entries**:
   - Parent: "Clients" database (data_source_id)
   - Properties:
     - Name (Title): Client name
     - ICP (Text): Ideal customer profile
     - Personas (Text): Key personas
     - Status (Select): Active, Inactive, Prospect
     - Notes (Text): Additional notes
     - Source Path (Text): Path to client directory
     - Last Updated (Date): Current timestamp

4. **Handle existing entries**: Query by "Source Path" and update if exists

### Step 5: Sync Partners Database (if `--partners` or `--all`)

**Source**: `partners/` directory (if exists)

1. **Check if partners directory exists**
2. **Read partner directories**:
   - List all subdirectories in `partners/`
   - For each partner directory, look for README.md or config files
   - Extract partner metadata

3. **Create/update database entries**:
   - Parent: "Partners" database (data_source_id)
   - Properties:
     - Name (Title): Partner name
     - Type (Select): Integration, Service, etc.
     - Status (Select): Active, Inactive
     - Source Path (Text): Path to partner directory
     - Last Updated (Date): Current timestamp

4. **Handle existing entries**: Query by "Source Path" and update if exists

### Step 6: Sync Workflows (if `--workflows` or `--all`)

**Source**: `workflows/` directory

1. **Read workflow files**:
   - List all `.md` files in `workflows/`
   - For each file, read content

2. **For each workflow file**:
   - Extract frontmatter (if any)
   - Convert markdown to Notion-compatible format (see Markdown Conversion section)
   - Determine page title from filename or frontmatter title
   - Check if page already exists (search by title in "Workflows" parent)

3. **Create/update Notion page** using `mcp_notion_notion-create-pages` or `mcp_notion_notion-update-page`:
   - Parent: "Workflows" page (page_id)
   - Title: Extracted from filename or frontmatter
   - Content: Converted markdown (Notion-flavored markdown)
   - Properties:
     - Source File (Text): Path to source file
     - Last Updated (Date): Current timestamp

4. **Handle existing pages**:
   - Search for page by title in "Workflows" parent
   - If exists, use `mcp_notion_notion-update-page` to update content
   - If not exists, use `mcp_notion_notion-create-pages` to create

### Step 7: Sync Skills (if `--skills` or `--all`)

**Source**: `skills/` directory

1. **Read skills directory structure**:
   - Recursively list all `.md` files in `skills/`
   - Preserve directory hierarchy

2. **For each skill file**:
   - Extract frontmatter (name, description, version if present)
   - Convert markdown to Notion format
   - Determine parent page based on directory structure:
     - `skills/tier-1-voice-dna/` → "Skills/Tier 1: Voice DNA"
     - `skills/tier-2-context-playbooks/` → "Skills/Tier 2: Context Playbooks"
     - `skills/tier-3-content-ops/` → "Skills/Tier 3: Content Operations"
     - Other directories → "Skills/[Directory Name]"

3. **Create parent pages if needed**:
   - Check if "Skills/Tier 1: Voice DNA" exists
   - Check if "Skills/Tier 2: Context Playbooks" exists
   - Check if "Skills/Tier 3: Content Operations" exists
   - Create missing parent pages

4. **Create/update skill pages**:
   - Parent: Appropriate parent page based on directory
   - Title: From frontmatter `name` or filename
   - Content: Converted markdown
   - Properties:
     - Source File (Text): Path to source file
     - Description (Text): From frontmatter
     - Version (Text): From frontmatter (if present)
     - Last Updated (Date): Current timestamp

5. **Handle existing pages**: Search by "Source File" property and update if exists

### Step 8: Markdown to Notion Conversion

**Critical**: Notion uses enhanced markdown format. See `markdown-converter.md` for detailed conversion rules.

**Key conversions**:
- Headers: `# H1`, `## H2`, `### H3` → Notion heading blocks
- Bold: `**text**` → Bold formatting
- Italic: `*text*` → Italic formatting
- Code: `` `code` `` → Inline code
- Code blocks: ` ```language` → Code block with language
- Lists: `- item` or `1. item` → Bulleted/Numbered lists
- Tables: Markdown tables → Notion table blocks
- Links: `[text](url)` → Notion links
- Frontmatter: Extract and exclude from content (store in page properties)

**Important**: 
- Notion supports enhanced markdown with special syntax
- Use `mcp_notion_notion-fetch` to get the enhanced markdown spec: `notion://docs/enhanced-markdown-spec`
- Always fetch the spec before creating/updating pages to ensure proper formatting

### Step 9: Update Sync State

1. **After successful sync**:
   - Read `.notion-sync-state.json` (create if doesn't exist)
   - Update sync timestamps for each synced file
   - Store file modification times
   - Save state file

2. **Sync state format**:
```json
{
  "lastSync": "2026-02-09T12:00:00Z",
  "files": {
    "workflows/plays-index.md": {
      "lastSynced": "2026-02-09T12:00:00Z",
      "notionPageId": "page-id-here",
      "fileModified": "2026-02-09T10:00:00Z"
    }
  },
  "databases": {
    "branding": {
      "databaseId": "database-id-here",
      "lastSynced": "2026-02-09T12:00:00Z"
    }
  }
}
```

### Step 10: Display Summary

After sync completes, display:

```
## Notion Sync Complete

**Synced sections**: {{list of synced sections}}
**Files processed**: {{count}}
**Pages created**: {{count}}
**Pages updated**: {{count}}
**Database entries**: {{count}}

### Notion Structure:
- Databases: Personal Branding, Clients, Partners
- Pages: Workflows/ ({{count}} pages), Skills/ ({{count}} pages)

**Next sync**: Files will only sync if modified since last sync (use --force to re-sync all)
```

## Notion MCP Tools Reference

### Database Operations

- **`mcp_notion_notion-create-database`** - Create a new database
  - Parameters: `properties` (schema), `title` (optional), `parent` (optional)
  - Returns: Database with data source IDs

- **`mcp_notion_notion-search`** - Search for pages/databases
  - Parameters: `query` (search term), `query_type: "internal"`
  - Returns: List of matching pages/databases

- **`mcp_notion_notion-fetch`** - Get database/page details
  - Parameters: `id` (page/database ID or URL)
  - Returns: Full page/database content with schema

### Page Operations

- **`mcp_notion_notion-create-pages`** - Create one or more pages
  - Parameters: `pages` (array), `parent` (page_id, database_id, or data_source_id)
  - Returns: Created page IDs/URLs

- **`mcp_notion_notion-update-page`** - Update page content/properties
  - Parameters: `page_id`, `command` (update_properties, replace_content, etc.), `data`
  - Returns: Updated page

- **`mcp_notion_notion-move-pages`** - Move pages to new parent
  - Parameters: `page_or_database_ids`, `new_parent`
  - Returns: Confirmation

### Data Source Operations

- **`mcp_notion_notion-create-data-source`** - Create data source connection
  - Note: Databases automatically have data sources. Use `notion-fetch` to get data_source_id from database.

- **`mcp_notion_notion-query-data-sources`** - Query database entries
  - Parameters: `data_source_id`, filters, sorts
  - Returns: Matching database entries

## Database Schemas

### Personal Branding Database

**Properties**:
- Name (Title) - Required: Branding element name
- Category (Select) - Options: Voice DNA, Tool Stack, Audience, Identity Anchors, Voice Characteristics, Voice Modes
- Content (Rich Text) - Extracted content from markdown
- Source File (Text) - Path to source file
- Last Updated (Date) - Sync timestamp

### Clients Database

**Properties**:
- Name (Title) - Required: Client name
- ICP (Text) - Ideal customer profile
- Personas (Text) - Key personas
- Status (Select) - Options: Active, Inactive, Prospect
- Notes (Text) - Additional notes
- Source Path (Text) - Path to client directory
- Last Updated (Date) - Sync timestamp

### Partners Database

**Properties**:
- Name (Title) - Required: Partner name
- Type (Select) - Options: Integration, Service, Platform, Other
- Status (Select) - Options: Active, Inactive
- Source Path (Text) - Path to partner directory
- Last Updated (Date) - Sync timestamp

## Error Handling

- **Notion MCP not connected**: "Notion MCP server not connected. Check your MCP configuration at `~/.cursor/mcp.json`"
- **Database not found**: Create the database automatically
- **Page creation fails**: Show error message and continue with other files
- **Markdown conversion error**: Log warning and sync raw markdown
- **File not found**: Skip file and continue
- **Permission error**: "Notion API permission error. Check your Notion integration permissions."

## Examples

### Example 1: Sync everything
```
User: /notionsync --all
Response:
  1. Checks sync state
  2. Finds/creates Notion structure
  3. Syncs branding, clients, partners, workflows, skills
  4. Updates sync state
  5. Displays summary
```

### Example 2: Sync only workflows
```
User: /notionsync --workflows
Response:
  1. Checks sync state for workflow files
  2. Finds/creates "Workflows" parent page
  3. Syncs only workflow markdown files
  4. Updates sync state
  5. Displays summary
```

### Example 3: Force re-sync
```
User: /notionsync --all --force
Response:
  1. Ignores sync state
  2. Re-syncs everything
  3. Updates sync state with new timestamps
  4. Displays summary
```

### Example 4: Dry run
```
User: /notionsync --all --dry-run
Response:
  1. Checks what would be synced
  2. Shows preview of changes
  3. Does not make any Notion changes
  4. "Dry run complete. Would sync {{count}} files. Run without --dry-run to execute."
```

## Best Practices

1. **First sync**: Run `/notionsync --all` to set up initial Notion structure
2. **Incremental syncs**: Subsequent syncs only update changed files
3. **Force sync**: Use `--force` when you want to refresh everything
4. **Dry run**: Always test with `--dry-run` first if unsure
5. **Markdown**: Ensure source markdown files are well-formatted for best Notion rendering
6. **Frontmatter**: Extract frontmatter metadata and store in page properties, not in content

## Related Documentation

- Markdown conversion guide: `.cursor/skills/notion-sync/markdown-converter.md`
- Notion enhanced markdown spec: Fetch via `mcp_notion_notion-fetch` with `notion://docs/enhanced-markdown-spec`
- Notion MCP docs: https://developers.notion.com/guides/mcp
