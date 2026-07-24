# Freckle CLI workflows carousel

8 slides, 1080x1350 (LinkedIn portrait), SVG, brand dark theme.

Regenerate:

```bash
python3 _gen_freckle_carousel.py
```

All copy lives in the generator. Edit there, rerun, done. Don't hand-edit the SVGs.

## Palette

Pulled from `website/apps/shawnos/app/globals.css`, so the carousel matches the site.

| token | hex | use |
|---|---|---|
| canvas | `#050505` | background |
| grid | `#16132a` | grid lines |
| aura | `#6d5ee9` | accent, arrows, rules |
| aura-strong | `#8b7dff` | eyebrows, emphasis lines |
| ink | `#fafafa` | headings |
| secondary | `#a3a3a3` | body |
| muted | `#525252` | footer, slide numbers |

## Slides

| # | slide | content |
|---|---|---|
| 01 | cover | three workflows, the three names, the hook |
| 02 | what changed | old shape vs new shape |
| 03 | workflow 01 | signups out of Convex (5-step diagram) |
| 04 | the gate | why domain-gating makes the run cheap |
| 05 | workflow 02 | de-masking site traffic (5-step diagram) |
| 06 | workflow 03 | AI answer citations / GEO (5-step diagram) |
| 07 | where it lands | Connect to Notion, enrichment hours |
| 08 | close | skill files, repo, thanks to Andy at Freckle |

## Export to PNG

Any of these:

```bash
rsvg-convert -w 1080 -h 1350 slide-01.svg -o slide-01.png
inkscape slide-01.svg --export-filename=slide-01.png -w 1080 -h 1350
python3 -c "import cairosvg; cairosvg.svg2png(url='slide-01.svg', write_to='slide-01.png', output_width=1080, output_height=1350)"
```

Batch:

```bash
for f in slide-*.svg; do rsvg-convert -w 1080 -h 1350 "$f" -o "${f%.svg}.png"; done
```

LinkedIn document posts take a PDF, so combining the PNGs (or the SVGs) into a single
PDF in slide order is the last step before upload.

## Reuse

Slide 3 works standalone as the signups workflow diagram for the X thread.
Slide 6 works standalone for the GEO single.
