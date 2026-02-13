# MCP Connection Guide

> Pick the servers that match your stack. You don't need all of them. Start with 2-3 that connect the tools you already use, then add more as your workflows demand it.

## What Are MCPs?

Model Context Protocol servers let your AI tools talk to your other tools natively. Your code editor talks to your CRM. Your content system talks to your outreach stack. Your repo becomes the hub that connects everything.

The setup is usually: install the MCP server, add an API key to your config, and your AI assistant can now read from and write to that tool.

---

## GTM / Outbound Stack

If you run pipeline, outbound, or revenue operations, start here.

### Instantly
**What it does**: Email campaign management, deliverability, domain warming.
**Why connect it**: Send sequences, check campaign analytics, manage leads -- all from your IDE. No more switching to the Instantly dashboard for every check.
**Setup**: API key from Instantly settings. Add to your `.cursor/mcp.json` or Claude config.

### HeyReach
**What it does**: LinkedIn automation. Connection requests, messaging sequences, campaign management.
**Why connect it**: Pull accepted connections, export campaign leads, check message status without opening the browser.
**Setup**: API key from HeyReach dashboard. HTTP-based MCP server.

### Firecrawl
**What it does**: Web scraping. Pulls entire sites as clean markdown.
**Why connect it**: Enrichment workflows. Pull competitor sites, prospect company pages, job boards -- all as structured data your AI can process.
**Setup**: API key from Firecrawl. Straightforward npm install.

### Google Sheets
**What it does**: Spreadsheet read/write.
**Why connect it**: Sync enrichment data, push lead lists, pull campaign tracking sheets. Bridges your repo with team spreadsheets.
**Setup**: Google service account credentials. Slightly more setup than most, but worth it.

### Slack
**What it does**: Read channels, send messages, search history.
**Why connect it**: Partner comms, team updates, automated notifications when campaigns hit thresholds. Your repo can post to Slack when something ships.
**Setup**: Slack bot token with appropriate channel permissions.

---

## Content / Creator Stack

If you publish content across platforms, start here.

### Typefully
**What it does**: Social media scheduling and publishing (LinkedIn, X).
**Why connect it**: Push finalized drafts directly from your repo to your publishing queue. Draft in markdown, publish with a command.
**Setup**: API key from Typefully settings. HTTP-based MCP server.

### Substack
**What it does**: Newsletter publishing.
**Why connect it**: Create draft posts on Substack directly from your repo. Write in markdown, push to Substack, then review and publish from their editor.
**Setup**: Substack MCP server with your publication credentials.

### Reddit
**What it does**: Post, comment, search Reddit. Pull subreddit data and user activity.
**Why connect it**: Distribute content to niche subreddits, monitor discussions, engage with communities -- all from your IDE.
**Setup**: Reddit API credentials (client ID, secret, username, password).

### Notion
**What it does**: Read/write Notion databases and pages.
**Why connect it**: Sync your repo content to a Notion knowledge base. Keep a public-facing layer of your system in Notion while the source of truth stays in Git.
**Setup**: Notion integration token. HTTP-based MCP server.

### ElevenLabs
**What it does**: Text-to-speech, voice cloning, audio generation.
**Why connect it**: Turn written content into audio versions. Generate voiceovers for TikTok or YouTube content from your scripts.
**Setup**: API key from ElevenLabs dashboard.

---

## Full Stack (Both GTM and Content)

These connect regardless of whether you lean GTM or content.

### GitHub
**What it does**: Version control, repo management, PR workflows.
**Why connect it**: The backbone. Your AI can create branches, commit changes, open PRs, manage issues. Essential if you want your repo to be a living system.
**Setup**: GitHub personal access token. Most Claude/Cursor configs include this by default.

### Browserbase
**What it does**: Browser automation. Navigate pages, click, type, take screenshots.
**Why connect it**: Profile recon, automated testing, scraping pages that require interaction. Your AI can browse the web for you.
**Setup**: Browserbase API key and project ID.

### Figma
**What it does**: Design file access, component inspection.
**Why connect it**: Pull design specs, reference brand assets, inspect layouts -- useful if you create visual content or work with designers.
**Setup**: Figma access token. HTTP-based MCP server.

### ClickUp
**What it does**: Task management, project tracking.
**Why connect it**: Create tasks from your IDE, check project status, sync deliverables. Keeps your task board connected to your build workflow.
**Setup**: ClickUp API key. HTTP-based MCP server.

### Fathom
**What it does**: Analytics and meeting intelligence.
**Why connect it**: Pull call notes, meeting summaries, and analytics data into your repo for reference and content creation.
**Setup**: API credentials from Fathom settings.

---

## How to Add an MCP Server

Most MCP servers follow the same pattern:

1. Get your API key from the tool's settings/dashboard
2. Add the server config to your MCP config file:
   - **Cursor**: `.cursor/mcp.json` in your project root or `~/.cursor/mcp.json` globally
   - **Claude Code**: `~/.claude/mcp.json` or project-level config
3. Restart your editor to load the new server
4. Test the connection by asking your AI to use the tool

Example config entry (format varies by server):
```json
{
  "mcpServers": {
    "tool-name": {
      "command": "npx",
      "args": ["-y", "@tool/mcp-server"],
      "env": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

**Important**: Never commit your MCP config with API keys. Add it to `.gitignore` or use environment variables.

---

## Start Small

Don't try to connect everything on day one. Pick the 2-3 tools you use most, connect those MCPs, and build workflows around them. Add more as your system demands it. The repo grows with your usage, not the other way around.
