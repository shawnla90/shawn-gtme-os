---
name: linkedin-recon
description: Browser-based LinkedIn profile recon using Browserbase MCP. Visits LinkedIn profiles to extract recent posts, activity, and personalization hooks for outreach. Use when the user types /linkedin-recon or asks to check LinkedIn activity, posts, or content for contacts.
---

# LinkedIn Recon Command

When the user types `/linkedin-recon`, use Browserbase to visit LinkedIn profiles and extract recent posts, activity, and engagement data for personalized outreach.

## Command Pattern

`/linkedin-recon <source>` where `<source>` is one of:

| Source | What it does |
|--------|-------------|
| `accepted` | Recon all accepted connections from the latest HeyReach accepted export CSV |
| `<linkedin-url>` | Recon a single LinkedIn profile URL |
| `<csv-path>` | Recon all profiles from a CSV file with a "LinkedIn URL" column |

If no source is provided, default to `accepted` (uses the most recent `heyreach-accepted-*.csv` in `clients/partner/elauwit/resources/`).

## Workflow

### Step 1: Identify Profiles to Recon

**If `accepted` (default):**
1. Find the most recent `heyreach-accepted-*.csv` in `clients/partner/elauwit/resources/`
2. Extract unique LinkedIn URLs from the "LinkedIn URL" column
3. Deduplicate by URL

**If single URL:**
1. Use the provided URL directly

**If CSV path:**
1. Read the CSV and extract the "LinkedIn URL" column

### Step 2: Create Browserbase Session

1. Call `browserbase_session_create` to start a browser session
2. This session should ideally be logged into LinkedIn for full profile access
   - If not logged in, public profile data may be limited
   - Inform user if login is needed: "For full profile access, log into LinkedIn in the Browserbase session first."

### Step 3: Visit Each Profile

For each LinkedIn profile URL, pace visits to avoid rate limiting:

1. **Navigate to activity page**: `{{linkedin_url}}/recent-activity/all/`
   - This shows their posts, shares, and comments
   - Call `browserbase_stagehand_navigate` with the activity URL

2. **Extract activity data**: Call `browserbase_stagehand_extract` with instruction:
   ```
   Extract all visible LinkedIn posts and activity. For each post, get:
   - Post content/text (full text)
   - Post date/time
   - Post type (original post, shared post, comment, article)
   - Engagement metrics (likes, comments, shares) if visible
   - Any hashtags used
   - Any companies or people mentioned
   ```

3. **Navigate to profile page**: `{{linkedin_url}}`
   - Call `browserbase_stagehand_navigate` with the profile URL

4. **Extract profile data**: Call `browserbase_stagehand_extract` with instruction:
   ```
   Extract the LinkedIn profile information:
   - Full name and headline
   - Current position and company
   - About/summary section
   - Recent experience entries
   - Education
   - Any featured posts or content
   - Skills and endorsements (top ones)
   - Activity summary (number of followers, connections)
   ```

5. **Wait between profiles**: Pause 5-10 seconds between profiles to avoid LinkedIn rate limiting
   - Call `browserbase_stagehand_navigate` to a neutral page or just wait

### Step 4: Compile Recon Report

For each contact, generate a recon profile:

```markdown
## LinkedIn Recon: {{name}} - {{company}}

**Profile**: {{linkedin_url}}
**Headline**: {{headline}}
**Location**: {{location}}

### About
{{about_section_or_"No about section"}}

### Recent Activity (last 30 days)
{{For each post/activity:}}
- **{{date}}** [{{type}}]: {{post_preview_first_100_chars}}
  - Engagement: {{likes}} likes, {{comments}} comments
  - Topics: {{hashtags_or_themes}}

### Personalization Hooks
Based on their activity, here are conversation starters:
1. {{hook_based_on_recent_post_or_activity}}
2. {{hook_based_on_company_news_or_role}}
3. {{hook_based_on_shared_interests_or_events}}

### Suggested Next Message
{{A personalized message draft that references their actual activity/content,
different from the templated sequence they've been ignoring}}
```

### Step 5: Save Report

1. **Determine Output Directory**:
   - If input was a CSV file: Use `{{directory_of_csv}}/recon/`
   - If input was `accepted` or a URL: Use default `clients/partner/elauwit/resources/recon/`

2. Save individual recon files to the output directory:
   - Filename: `{{linkedin-username}}-recon-{{YYYY-MM-DD}}.md`
   - Example: `zachschofel-recon-2026-02-08.md`

3. Save summary CSV with personalization hooks to the parent of output directory:
   - Path: `{{output_directory_parent}}/linkedin-recon-{{YYYY-MM-DD}}.csv`
   - Columns: First Name, Last Name, Company, Position, LinkedIn URL, Recent Post Topic, Personalization Hook, Suggested Message

4. Display summary:

```
## LinkedIn Recon Complete

**Profiles scanned**: {{count}}
**With recent activity**: {{active_count}}
**Without activity**: {{inactive_count}}

### Recon Summary
| # | Contact | Company | Posts Found | Top Topic | Hook |
|---|---------|---------|:-----------:|-----------|------|
| 1 | {{name}} | {{company}} | {{count}} | {{topic}} | {{hook_preview}} |

### Individual Reports
- `recon/zachschofel-recon-2026-02-08.md`
- `recon/crystalmoya-recon-2026-02-08.md`
- ...

### Next Steps
- Review hooks and customize messages
- Use `/heyreach-conversations` to see current thread state
- Send personalized follow-ups via HeyReach MCP `send_message`
```

### Step 6: Close Browser Session

1. Call `browserbase_session_close` to end the session

## Rate Limiting & Safety

- **Wait 5-10 seconds between profile visits** to avoid LinkedIn flagging
- **Max 15 profiles per session** to stay under the radar
- If more than 15 profiles, split into multiple sessions with a longer break
- If LinkedIn shows a CAPTCHA or block page, **stop immediately** and inform the user
- **Never** perform actions on LinkedIn (connect, like, message) - this is READ ONLY recon

## Error Handling

- **No CSV found**: "No accepted connections CSV found. Run `/heyreach-export accepted` first."
- **LinkedIn login required**: "Full profile access requires LinkedIn login. Log in via the Browserbase session, then re-run."
- **Rate limited/blocked**: "LinkedIn is limiting access. Stopping recon. Completed {{count}}/{{total}} profiles. Try again later for the rest."
- **Profile not found**: "Profile {{url}} returned 404. Skipping."
- **No activity found**: "No recent posts found for {{name}}. Their profile may be inactive on LinkedIn."

## Examples

### Recon accepted connections
```
User: /linkedin-recon
User: /linkedin-recon accepted

→ Finds latest heyreach-accepted CSV
→ Extracts 11 unique LinkedIn URLs
→ Visits each profile's activity page
→ Extracts posts, topics, engagement
→ Generates personalization hooks
→ Saves individual recon files + summary CSV
```

### Recon single profile
```
User: /linkedin-recon https://www.linkedin.com/in/zachschofel

→ Visits Zach's profile and activity page
→ Extracts posts and profile data
→ Generates personalization hooks
→ Saves recon file
```

### Recon from custom CSV
```
User: /linkedin-recon clients/partner/elauwit/resources/vip-contacts.csv

→ Reads CSV for LinkedIn URLs
→ Visits each profile
→ Generates recon report
```
