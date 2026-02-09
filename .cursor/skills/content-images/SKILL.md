---
name: content-images
description: Generates images and visual assets for LinkedIn, X, and other social content posts using Python + Pillow. Use when the user asks to create an image, graphic, visualization, or visual asset for a post, or types /contentimage.
---

# Content Image Generation

Generate clean, professional images for social content using Python + Pillow. These are technical visualizations, not AI art -- they should look like something a developer built, not something an AI hallucinated.

## Command Pattern

- `/contentimage` -- create an image for the post currently being discussed
- `/contentimage <type>` -- create a specific image type (tree, diagram, checklist, stack)
- Also triggers when the user asks to "create an image", "make a graphic", or "generate a visual" for a post

## Design System

### Color Palette (flat dark -- NO gradients)

```python
BG      = (12, 13, 17)       # near-black canvas
PANEL   = (22, 24, 30)       # dark panel fill
BORDER  = (40, 44, 54)       # subtle panel outline
GREEN   = (78, 195, 115)     # primary accent (branches, highlights)
TXT     = (185, 195, 210)    # body text (light gray)
BRIGHT  = (230, 236, 245)    # titles, emphasis (near-white)
MUTED   = (100, 110, 128)    # annotations, footer, secondary info
```

### Anti-Patterns (things that scream AI-generated)

- **No purple/blue gradients** -- flat dark backgrounds only
- **No emojis in the image itself** -- emojis go in the post text, not the graphic
- **No glow effects or neon** -- the green accent is muted, not electric
- **No stock-photo vibes** -- these are technical visualizations, not marketing collateral
- **No real client/partner names** -- always use placeholder names (northbeam, ridgeline, vektora, apex-staffing, etc.)
- **No decorative elements** -- every pixel should convey information

### Typography

```python
# macOS -- Menlo is the primary font (monospace, clean, developer-native)
MENLO = "/System/Library/Fonts/Menlo.ttc"

fTitle = ImageFont.truetype(MENLO, 22, index=1)   # bold titles
fTree  = ImageFont.truetype(MENLO, 14, index=0)   # body / tree text
fAnnot = ImageFont.truetype(MENLO, 12, index=0)   # annotations (muted)
fFoot  = ImageFont.truetype(MENLO, 12, index=0)   # footer
```

### Layout Rules

- **Dimensions**: 1200 x 720px (landscape, LinkedIn-optimized)
- **Padding**: 24px outer, 22px inner panel padding
- **Panels**: Rounded rectangles (radius=10), dark fill with subtle border
- **Multi-panel gap**: 18px between panels
- **Line height**: 20px for tree/body text
- **Footer**: Centered at bottom, muted color. Text: `built with Cursor + Claude Code`
- **DPI**: Save at 144 for retina clarity

## Image Types

### 1. Tree Visualization (repo structure)

Two-panel layout showing directory trees. Green box-drawing characters for branches, light text for names, muted text for annotations in parentheses.

**Reference implementation**: `content/x/drafts/_gen_tree.py`

Key rendering logic -- split each line into green branch prefix and gray text:

```python
TREE_CHARS = set("│├└─ ")

def render_tree(lines, ox, oy):
    lh = 20
    for i, raw in enumerate(lines):
        cx = ox
        y  = oy + i * lh
        j = 0
        while j < len(raw) and raw[j] in TREE_CHARS:
            j += 1
        prefix = raw[:j]
        rest   = raw[j:]
        if prefix:
            draw.text((cx, y), prefix, font=fTree, fill=GREEN)
            cx += draw.textlength(prefix, font=fTree)
        if "(" in rest:
            k = rest.index("(")
            name  = rest[:k]
            annot = rest[k:]
            draw.text((cx, y), name, font=fTree, fill=TXT)
            cx += draw.textlength(name, font=fTree)
            draw.text((cx, y + 1), annot, font=fAnnot, fill=MUTED)
        else:
            draw.text((cx, y), rest, font=fTree, fill=TXT)
```

### 2. Stack / Tool List

Single-panel or two-panel layout listing tools, technologies, or components. Each item gets a green arrow prefix (→) with the tool name in bright text and a short description in muted.

### 3. Checklist / Workflow

Vertical single-panel showing steps or phases. Green checkmarks or step numbers on the left, descriptions on the right. Good for process breakdowns.

### 4. Stats / Metrics

Minimal layout with large numbers in green/bright, labels in muted. Good for impact posts.

## Workflow

### Step 1: Determine Image Type

Read the post content. Match to image type:
- Post about repo structure or systems → **tree visualization**
- Post about tool stack or integrations → **stack list**
- Post about process or methodology → **checklist/workflow**
- Post about results or outcomes → **stats/metrics**
- If the post notes say "No image required" → confirm with user before creating

### Step 2: Write the Generation Script

1. Create a Python script at `content/{platform}/drafts/_gen_{slug}.py`
2. Use the color palette, fonts, and layout rules above
3. Keep the script self-contained (only dependency: Pillow)
4. Output PNG to same directory as the draft

### Step 3: Generate and Verify

1. Run the script: `python3 content/{platform}/drafts/_gen_{slug}.py`
2. Read the output image back to verify rendering
3. Show the image to the user for review
4. Iterate on adjustments (colors, spacing, content) as needed

### Step 4: Link to Post

Update the draft markdown frontmatter to reference the image:

```markdown
> **Image**: content/{platform}/drafts/{image-filename}.png
```

## Confidentiality Rules

Never include in generated images:
- Real client names (use placeholder names)
- Real partner names (use placeholder names)
- API keys, tokens, or credentials
- Internal URLs or endpoints
- Revenue numbers or client-specific metrics

**Safe placeholder company names**: apex-staffing, northbeam, ridgeline, vektora, clearpoint, ironwood, stonebridge, havenport

## Dependencies

- Python 3
- Pillow (`pip install Pillow`)
- Menlo font (pre-installed on macOS)

If Pillow is not installed, install it first:
```bash
pip install Pillow
```

## Error Handling

- **Font not found**: Fall back to `ImageFont.load_default()` -- will look worse but won't crash
- **Pillow not installed**: Install via pip before running
- **Content too long for panel**: Reduce font size by 1-2px or increase image height
- **Unicode rendering issues**: Menlo supports box-drawing characters natively; if chars render as boxes, check the font path
