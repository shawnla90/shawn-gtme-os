---
name: aios-image
description: Generate terminal-style AI/os command branded images from any post, draft, or topic using Python + Pillow. Black background, green accent, monospace font, boot-sequence aesthetic. Use when the user types /aiosimage, /osimage, or asks to create an AI/os image, terminal image, or branded article image for a post.
---

# AI/os Command Image Generator

Generate branded terminal-aesthetic images for Substack articles, LinkedIn posts, or any content. These look like an AI operating system booting up and displaying the post's core narrative as a command-line process.

## Command Pattern

- `/aiosimage` -- generate from the post currently being discussed
- `/aiosimage <path>` -- generate from a specific draft file
- `/osimage <topic>` -- generate from a topic description (no file needed)
- Also triggers on "create an AI/os image", "make a terminal image", "branded image for this post"

## Workflow

### Step 1: Read the Source Content

If a file path is given, read it. If a topic is given, work from description. Extract:

1. **Title/series info** (e.g., "OS.AI LABS // POST 2")
2. **Core thesis** -- the single sentence that captures the post (becomes the hero quote)
3. **Narrative phases** -- break the content into 2-4 phases showing progression/transformation
4. **Key commands** -- terminal-style commands that represent each phase (`$ whoami`, `$ git init brain/`, `$ risk-audit --identity`)
5. **Status indicators** -- what changes between start and end (risk levels, dependency levels, identity labels)
6. **Closing line** -- the post's sign-off or CTA, rendered as a boot-complete message

### Step 2: Choose Layout

| Content Type | Layout | Example |
|---|---|---|
| **Transformation/journey** | 2x2 phase grid | identity-awakening.png |
| **Comparison (old vs new)** | Split panel (left/right) | before/after states |
| **Process/workflow** | Vertical boot sequence | step-by-step phases |
| **Single concept deep-dive** | Full-width terminal output | one big narrative panel |
| **List/stack reveal** | Scrolling terminal log | items appearing line by line |

### Step 3: Write the Generation Script

Create at: `content/images/_gen_{slug}.py`

Use the design system below. Script must be self-contained (only dep: Pillow).

### Step 4: Generate, Verify, Iterate

1. Run: `python3 content/images/_gen_{slug}.py`
2. Read the output PNG back to verify rendering
3. Show user for review
4. Iterate on spacing, content, layout

## Design System

### Color Palette

```python
BG         = (12, 13, 17)       # near-black canvas
PANEL      = (22, 24, 30)       # dark panel fill
BORDER     = (40, 44, 54)       # subtle panel outline
GREEN      = (78, 195, 115)     # primary accent
TXT        = (185, 195, 210)    # body text
BRIGHT     = (230, 236, 245)    # titles, emphasis
MUTED      = (100, 110, 128)    # annotations, secondary
AMBER      = (210, 165, 60)     # warnings, mid-phase
CYAN       = (80, 190, 210)     # info, connections, shift phase
DIM_GREEN  = (50, 130, 75)      # background green (progress bars, faint elements)
DARK_GREEN = (30, 85, 45)       # very subtle green accents
RED_MUTED  = (180, 80, 80)      # problems, old state, risk
DIM_RED    = (100, 50, 50)      # background red for bars
```

Phase color mapping:
- **Phase 1 / Old state / Problem** → `RED_MUTED`
- **Phase 2 / Fear / Risk** → `AMBER`
- **Phase 3 / Shift / Action** → `CYAN`
- **Phase 4 / Resolution / New state** → `GREEN` (with green border on panel)

### Typography

```python
MENLO = "/System/Library/Fonts/Menlo.ttc"

fBrand   = ImageFont.truetype(MENLO, 28, index=1)   # AI/os branding
fTitle   = ImageFont.truetype(MENLO, 18, index=1)    # "command" subtitle
fCmd     = ImageFont.truetype(MENLO, 15, index=0)    # boot commands
fBody    = ImageFont.truetype(MENLO, 13, index=0)    # terminal output
fBold    = ImageFont.truetype(MENLO, 13, index=1)    # bold body (folders)
fSmall   = ImageFont.truetype(MENLO, 11, index=0)    # labels, metadata
fSmBold  = ImageFont.truetype(MENLO, 11, index=1)    # bold labels
fTiny    = ImageFont.truetype(MENLO, 10, index=0)    # annotations
fFoot    = ImageFont.truetype(MENLO, 10, index=0)    # footer
fPhase   = ImageFont.truetype(MENLO, 14, index=1)    # phase headers
fQuote   = ImageFont.truetype(MENLO, 14, index=1)    # thesis quote
```

### Dimensions

| Platform | Size | Aspect Ratio | Notes |
|---|---|---|---|
| **Substack article** | 1456 x 1048 | ~14:10 | Optimized for post cover + social preview cards. Substack recommends at least 1456 x 1048 for preview images. The taller format ensures content isn't cropped in email, web, or social card views. |
| **LinkedIn landscape** | 1200 x 720 | 5:3 | Standard feed image |
| **LinkedIn portrait** | 1080 x 1350 | 4:5 | Tall format, max feed real estate |
| **X post** | 1200 x 675 | 16:9 | Standard timeline card |

Always save at `dpi=(144, 144)` for retina.

#### Substack Image Best Practices

When generating for Substack specifically:
- **Use 1456 x 1048** (not 1456 x 816). The taller canvas gives panels room to breathe and renders cleanly in email clients, the web reader, and social preview cards.
- **Keep on-image text large enough to read on mobile.** Substack emails are 60%+ mobile opens. Minimum body font ~13px at this resolution.
- **Center key content vertically.** Social preview cards crop to roughly the center band of the image. The thesis quote or hero panel should live in the vertical center, not the bottom edge.
- **Export as PNG** (not JPEG) for terminal-aesthetic images -- the dark backgrounds and thin text compress poorly with JPEG artifacts.
- **Test against both light and dark backgrounds.** Substack readers may have either. The dark panel BG contrasts well with both, but check that corner accents and footer text don't disappear.

### Required Layout Elements

Every AI/os image MUST include these structural elements:

#### 1. Top Bar (terminal chrome)

```python
# Terminal window dots
dot_y = 18
for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
    draw.ellipse([PAD + i * 22, dot_y, PAD + 12 + i * 22, dot_y + 12], fill=c)

# Shawn AI/os branding — ALWAYS this format
brand_x = PAD + 80
draw.text((brand_x, 12), "Shawn", font=fBrand, fill=MUTED)
shawn_w = text_w("Shawn", fBrand)
draw.text((brand_x + shawn_w + 10, 12), "AI", font=fBrand, fill=GREEN)
ai_w = text_w("AI", fBrand)
draw.text((brand_x + shawn_w + 10 + ai_w, 12), "/os", font=fBrand, fill=BRIGHT)
cmd_x = brand_x + shawn_w + 10 + ai_w + text_w("/os", fBrand) + 8
draw.text((cmd_x, 20), "command", font=fTitle, fill=DIM_GREEN)

# Session info top-right
# Format: "OS.AI LABS // POST N" or "OS.AI LABS // <series>"
# Second line: date // shawn@gtme-os
```

#### 2. Boot Command (below top bar)

```python
# Opening command that names the mode
"> AI/os boot --mode=awakening"
"> loading identity.config..."
```

Adapt the `--mode=` flag and the `loading` message to match content:
- `--mode=awakening` for identity/journey posts
- `--mode=discovery` for tool/process reveals
- `--mode=build` for tactical/how-to posts
- `--mode=audit` for analysis/comparison posts

#### 3. Content Panels

Rounded rectangles with `radius=10`, `fill=PANEL`, `outline=BORDER`. The final/resolution panel gets `outline=GREEN, width=2` to stand out.

#### 4. Phase Headers

```python
draw.text((ix, iy), "[PHASE N]", font=fPhase, fill=PHASE_COLOR)
draw.text((after_phase, iy), "PHASE TITLE", font=fPhase, fill=BRIGHT)
```

#### 5. Status Indicators

- **Glow dots**: colored circles next to phase status text
- **Progress bars**: filled rectangles showing levels (risk, dependency, etc.)
- **Terminal commands**: `$ command` in GREEN, output indented with `>` prefix

#### 6. Flow Arrows Between Panels

Dotted lines (small ellipses) with arrow-head polygons connecting phases. Central "AWAKENING" or transition label.

#### 7. Boot Complete Footer

```python
"> AI/os {mode} complete."
"> {closing_line}"  # e.g., "the lab is open."
```

#### 8. Corner Accents

Subtle bracket lines in top-right and bottom-left corners for terminal window feel.

#### 9. Footer

```python
"built with Cursor + Claude Code  //  shawn ⚡ the gtme alchemist"
```

### Scanlines (subtle CRT texture)

```python
for sy in range(0, H, 3):
    if sy % 6 == 0:
        draw.line([(0, sy), (W, sy)], fill=(18, 20, 24), width=1)
```

### Helper Functions

Always include these utilities:

```python
def text_w(text, font):
    return draw.textlength(text, font=font)

def draw_progress_bar(x, y, w, fill_pct, color, bg_color=BORDER):
    bar_h = 10
    draw.rectangle([x, y, x + w, y + bar_h], fill=bg_color)
    fill_w = int(w * fill_pct)
    if fill_w > 0:
        draw.rectangle([x, y, x + fill_w, y + bar_h], fill=color)

def draw_glow_dot(x, y, r, color):
    glow = tuple(max(0, c - 40) for c in color)
    draw.ellipse([x - r - 2, y - r - 2, x + r + 2, y + r + 2], fill=glow)
    draw.ellipse([x - r, y - r, x + r, y + r], fill=color)

def center_text(text, font, color, cx, cy):
    tw = draw.textlength(text, font=font)
    draw.text((cx - tw / 2, cy), text, font=font, fill=color)
```

## Content Extraction Patterns

When analyzing a post to build phases, look for:

| Post Signal | Maps To |
|---|---|
| "I used to..." / "people called me..." | Phase 1: old identity/state (RED) |
| "I realized..." / "the risk was..." | Phase 2: fear/awareness (AMBER) |
| "what changed was..." / "I started..." | Phase 3: the shift/action (CYAN) |
| "now I..." / "the system is..." | Phase 4: resolution/new state (GREEN) |
| A strong quote or thesis sentence | Hero quote in Phase 4 panel |
| File trees, skill lists, tool lists | Tree rendering with `├──` / `└──` chars |
| Before/after comparisons | Split panel layout |
| Step-by-step process | Vertical boot sequence |

## Terminal Command Vocabulary

Make commands feel real but creative:

```
$ whoami                     # identity posts
$ git init brain/            # extraction/system posts
$ risk-audit --identity      # fear/risk sections
$ ls skills/                 # capability reveals
$ cat voice/core-voice.md    # voice/brand posts
$ diff old.md new.md         # comparison posts
$ chmod +x system.sh         # empowerment posts
$ ./build --scaffold         # how-to posts
$ top -o impact              # metrics/results posts
```

## Anti-Patterns

- **No AI-generated art vibes** -- this is a developer terminal, not Midjourney
- **No gradients** -- flat dark panels only
- **No emojis in the image** -- emojis go in post text, not the graphic
- **No real client/partner names** -- use placeholders if needed
- **No decorative elements** -- every element conveys information
- **No neon glow** -- GREEN is accent, not electric
- **Don't skip the AI/os branding** -- it's the signature element

## Reference Implementations

- **2x2 phase grid**: `content/images/_gen_identity_awakening.py` → `identity-awakening.png`
- **Radial hub diagram**: `content/images/_gen_content_os_masterplan.py`
- **Branching tree**: `content/images/_gen_substack_crosspromo_branch.py`
- **Split comparison**: `content/images/_gen_substack_crosspromo_split.py`

## Output

- Save PNG to `content/images/{slug}.png`
- Save generator script alongside as `content/images/_gen_{slug}.py`
- Print dimensions and path on completion
- Read image back to verify before showing user

## Dependencies

- Python 3 + Pillow (`pip install Pillow`)
- Menlo font (pre-installed macOS)
- Fallback: `ImageFont.load_default()` if font missing
