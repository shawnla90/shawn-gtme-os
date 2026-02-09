---
name: image-to-content
description: Generate LinkedIn and X draft posts from an image. Creates 3 LinkedIn draft versions and 10 X draft posts (story arc) in markdown format. Use when the user has loaded an image into the editor and wants to create content drafts based on it, or types /imagecontent.
---

# Image to Content Generation

Generate LinkedIn and X draft posts from an image. Takes an image loaded into the editor and creates multiple content drafts based on the visual and user's narrative context.

## Command Pattern

- `/imagecontent` -- generate content drafts from the image currently loaded in the editor
- `/imagecontent <image-path>` -- generate content drafts from a specific image file
- Also triggers when the user asks to "create posts from this image", "turn this image into content", or "generate drafts from this image"

## Output Structure

This skill generates **two markdown files**:

1. **LinkedIn drafts**: `content/linkedin/drafts/YYYY-MM-DD_{slug}.md` containing 3 different versions of the same post
2. **X drafts**: `content/x/drafts/YYYY-MM-DD_{slug}.md` containing a 10-post story arc

Both files follow the standard draft format with frontmatter, post bodies, and notes.

## Workflow

### Step 1: Identify the Image

1. **If image path provided**: Use that file
2. **If no path**: Check for images currently open in the editor or recently viewed
3. **If image is in conversation context**: Use the image the user is referencing
4. **If no image found**: Ask user to load the image into the editor or provide the path

### Step 2: Extract Image Context

Read the image file and extract:
- Visual elements (what's shown in the image)
- Text content (if any text is visible)
- Style/aesthetic (screenshot, diagram, meme, etc.)
- Context clues (game UI, tool interface, diagram, etc.)

**Note**: For images with text (like screenshots), extract the visible text. For visual-only images, describe what's shown.

### Step 3: Gather User Narrative

The user will provide context about:
- What the image represents to them
- The story or angle they want to tell
- Key themes or messages
- Target audience
- Any specific points to include

**Extract from user's message**:
- Main narrative/story
- Key themes or messages
- Personal connection or angle
- Target audience (GTM engineers, gamers, builders, etc.)
- Specific points or examples to include
- Tone preferences (if mentioned)

### Step 4: Generate LinkedIn Drafts (3 Versions)

Create one markdown file with **three different versions** of the LinkedIn post:

**File structure**:
```markdown
# {Title}

> **Platform**: LinkedIn
> **Pillar**: {Building & Sharing or appropriate pillar}
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Image**: {image-filename}

---

## Version 1: {Angle Name}

{Post body}

---

## Version 2: {Different Angle Name}

{Post body}

---

## Version 3: {Third Angle Name}

{Post body}

---

## Comment Thread Content

**Comment 1:**
{First comment}

**Comment 2:**
{Second comment}

---

## Notes

{Image reference and key themes}
```

**Version angles** (choose 3 that fit the narrative):
- **The Gamer Hook**: Lead with gaming/RPG connection
- **The Builder Angle**: Focus on building and technical aspects
- **The Pattern Recognition Take**: Highlight patterns and insights
- **The Personal Story**: Personal journey and origin
- **The Challenge**: Direct call to action or challenge
- **The Comparison**: Compare/contrast angle
- **The Meta Take**: Self-aware, meta commentary

**Each version should**:
- Start with lowercase first word (unless proper noun)
- Follow LinkedIn voice guide (casual, builder, competent)
- Include emoji markers (⚡ 🧙‍♂️) for identity
- End with sign-off: "shawn ⚡ the gtme alchemist 🧙‍♂️"
- Be 1000+ characters for LinkedIn performance
- Stand alone as a complete post

### Step 5: Generate X Drafts (10-Post Story Arc)

Create one markdown file with **10 tweets** that form a story arc:

**File structure**:
```markdown
# {Title}

> **Platform**: X (thread)
> **Pillar**: {Building & Sharing + Skill/System Shares}
> **Date**: YYYY-MM-DD
> **Status**: draft
> **Image**: {image-filename} (attach to tweet 1)

---

## Tweet 1 (Hook)

{First tweet - standalone hook}

---

## Tweet 2 (The Connection)

{Second tweet - builds connection}

---

[... continue through Tweet 10 ...]

---

## Notes

{Image reference and key themes}
```

**Story arc structure**:
1. **Tweet 1**: Hook (standalone, compelling, image attached)
2. **Tweet 2**: The Connection (link image to narrative)
3. **Tweet 3**: The Pattern (identify the pattern/insight)
4. **Tweet 4**: The Gamification (if applicable)
5. **Tweet 5**: The Ownership (key insight about ownership/repetition)
6. **Tweet 6**: The Challenge (call to action or challenge)
7. **Tweet 7**: The RPG Connection (if applicable)
8. **Tweet 8**: The Non-Gamer Reality (alternative angle)
9. **Tweet 9**: The Difference (key distinction)
10. **Tweet 10**: CTA (follow, sign-off)

**Each tweet should**:
- Start with lowercase first word
- Be under 280 characters (but don't pad unnecessarily)
- Stand alone (readable without context)
- Build on previous tweets
- Follow X voice guide (punchy, builder, casual)
- Use emoji sparingly and structurally

### Step 6: Apply Voice and Style

**Reference these files**:
- `skills/tier-1-voice-dna/core-voice.md` - Core voice principles
- `skills/tier-2-context-playbooks/linkedin.md` - LinkedIn formatting
- `skills/tier-2-context-playbooks/x-twitter.md` - X formatting

**Key voice rules**:
- Lowercase first word (unless proper noun)
- Casual, builder, competent tone
- Pattern articulation (name patterns others haven't seen)
- Technical but accessible
- Self-aware and authentic
- No gatekeeping (resources in comments)
- Identity markers: ⚡ 🧙‍♂️

### Step 7: Save and Confirm

1. **Save LinkedIn drafts**: `content/linkedin/drafts/YYYY-MM-DD_{slug}.md`
2. **Save X drafts**: `content/x/drafts/YYYY-MM-DD_{slug}.md`
3. **Display confirmation**:
   ```
   Generated content drafts from image:
   
   📄 LinkedIn: content/linkedin/drafts/YYYY-MM-DD_{slug}.md
      - 3 versions ready for review
   
   📄 X: content/x/drafts/YYYY-MM-DD_{slug}.md
      - 10-post story arc ready for review
   
   Next step: Review drafts, then use /finalcopy when ready to publish.
   ```

## Image Types and Approaches

### Screenshots (Games, Tools, UIs)
- Extract visible text
- Identify the tool/game/interface
- Connect to GTM/building narrative
- Use visual elements as metaphors

### Diagrams / Visualizations
- Describe structure and elements
- Connect to system architecture
- Use as metaphor for GTM systems
- Highlight patterns and connections

### Memes / Visual Metaphors
- Extract the core joke/metaphor
- Connect to GTM pain points
- Build narrative around the comparison
- Keep humor authentic, not forced

### Photos / Real Images
- Describe what's shown
- Extract context clues
- Connect to personal story or narrative
- Use as visual anchor for story

## Examples

### Example 1: Game Screenshot (Final Fantasy Skill Tree)
```
User: [loads Final Fantasy 10 skill tree image]
User: "use this as a post about the relationship between building a repo and building a skill tree..."

Response:
1. Reads image (extracts skill tree structure)
2. Generates 3 LinkedIn versions (gamer hook, builder angle, pattern recognition)
3. Generates 10 X tweets (story arc from hook to CTA)
4. Saves both files
5. Confirms with file paths
```

### Example 2: Tool Screenshot
```
User: /imagecontent Screenshot.png
User: "this is my Cursor workspace showing all my skill files. create posts about building your own operating system..."

Response:
1. Reads image (extracts file structure, skill files visible)
2. Generates LinkedIn drafts (3 angles on building OS)
3. Generates X drafts (10-post arc on skill files and systems)
4. Saves and confirms
```

## Error Handling

- **No image found**: "Couldn't find an image. Please load the image into the editor or provide the path: `/imagecontent path/to/image.png`"
- **Image unreadable**: "Couldn't read the image file. Is it a supported format (PNG, JPG, etc.)?"
- **No narrative context**: "I see the image, but I need more context. What story or angle do you want to tell? What's the main message?"
- **Missing voice files**: Fall back to general voice principles if specific voice files aren't found

## Integration with Other Skills

- **After generation**: User can review drafts and use `/finalcopy` to finalize
- **Image generation**: Can combine with `/contentimage` if user wants to create a new image for the post
- **Typefully push**: User can use `/finalcopy --typefully` to push approved drafts

## Notes

- Always generate both LinkedIn and X drafts (even if user only mentions one platform)
- The 3 LinkedIn versions give options for A/B testing or different angles
- The 10 X tweets form a complete story arc that can be posted as a thread
- Image reference is included in frontmatter for easy attachment
- All drafts follow standard format for consistency with existing workflow
