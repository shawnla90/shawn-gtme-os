---
name: content-images
description: Generate images and visual assets for social posts using Python + Pillow. Technical visualizations, not AI art. Use when the user asks to create an image/graphic for a post, or types /contentimage.
---

# Content Image Generation

Clean, professional technical visualizations using Python + Pillow.

## Commands

- `/contentimage` - create image for current post
- `/contentimage <type>` - create specific type (tree, stack, checklist, stats)

## Design System

```python
BG      = (12, 13, 17)       # near-black canvas
PANEL   = (22, 24, 30)       # dark panel fill
BORDER  = (40, 44, 54)       # subtle outline
GREEN   = (78, 195, 115)     # primary accent
TXT     = (185, 195, 210)    # body text
BRIGHT  = (230, 236, 245)    # titles
MUTED   = (100, 110, 128)    # annotations, footer

MENLO = "/System/Library/Fonts/Menlo.ttc"
# Dimensions: 1200x720px, 24px outer padding, DPI 144
# Footer: "built with Cursor + Claude Code"
```

## Image Types

1. **Tree** - two-panel directory trees. Green box-drawing chars, gray text, muted annotations
2. **Stack** - tool/tech list. Green arrow prefix, bright name, muted description
3. **Checklist** - vertical steps/phases. Green checkmarks, descriptions on right
4. **Stats** - large numbers in green/bright, labels in muted

## Workflow

1. Match post content to image type
2. Write script at `content/images/_gen_{slug}.py` (self-contained, Pillow only)
3. Run, verify output, show to user
4. Update draft frontmatter with image reference

## Anti-Patterns

No purple/blue gradients, no emojis in image, no glow/neon, no real client/partner names (use: apex-staffing, northbeam, ridgeline, vektora, clearpoint), no decorative elements

## Dependencies

Python 3, Pillow, Menlo font (macOS)
