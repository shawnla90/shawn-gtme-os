# Character Decision: The Terminal Alchemist

**Status**: Decided
**Date**: 2026-02-18

---

## Decision

Commission a custom illustrated character -- **The Terminal Alchemist** -- purpose-built for the faceless TikTok account. The character inherits the brand's existing visual DNA (color palette, terminal aesthetic, alchemist persona) but is rendered at illustration-grade fidelity suitable for AI lip sync tools.

The existing 32x32 RPG pixel art system stays as the website's gamification layer. The TikTok character is a separate, higher-fidelity expression of the same identity.

---

## Why Not the Other Options

### Existing RPG Pixel Art (ruled out for primary use)

The pixel art sprites are 32x32 grids upscaled with nearest-neighbor. They're crispy and perfect for the website's RPG progression system, but they fail TikTok's character requirements:

- **Lip sync tools need facial detail.** SadTalker, D-ID, and HeyGen all require visible mouth geometry to map phonemes. A 3-pixel-wide face has no mouth to animate.
- **TikTok thumbnails shrink to ~100x177px on mobile.** A pixel art character at that size becomes an unreadable blob. Illustrated characters with clean silhouettes survive the compression.
- **Completion rate depends on character expressiveness.** The idle/action GIF animations (breathing pulse, sword slash) are looping effects, not reactive expressions. A talking-head format needs brow raises, smirks, eye movement.

The pixel art DNA lives on in the character's design language (blocky silhouette nods, terminal color palette), but the actual TikTok asset needs to be illustrated.

### Rick Sanchez / IP Character (ruled out)

- Warner Bros IP -- cease-and-desist risk scales with success
- Directly competing with picklerickursion (67.5K followers) on their exact gimmick
- No brand equity -- viewers associate the character with Adult Swim, not with you
- Can't merchandise, license, or evolve the character

### Anime-Style Sensei (ruled out)

- Crowded TikTok space -- dozens of anime tutorial accounts
- Doesn't connect to the terminal/hacker/RPG aesthetic already established
- Would require building a new visual identity from scratch instead of extending the existing one

### Fully Automated SaaS Character (ruled out)

- Cookie-cutter output, zero differentiation
- Same character models used by thousands of other accounts
- No creative control over expressions, poses, or animation style
- Defeats the "builder who does the work" positioning

---

## The Terminal Alchemist -- Character Spec

### Identity

The character is a hooded alchemist figure who works from a dark terminal environment. Think wizard-meets-hacker: someone who transmutes raw data and tools into automated systems. This matches the existing brand persona ("shawn, the gtme alchemist") and the RPG class system's Alchemist class.

### Color Palette (pulled directly from existing brand tokens)

| Element | Hex | RGB | Source |
|---------|-----|-----|--------|
| Robe / primary | `#6E3C96` | (110, 60, 150) | `CLASS_PALETTES["alchemist"]["primary"]` in rpg_sprites.py |
| Robe highlights | `#965FBE` | (150, 95, 190) | `CLASS_PALETTES["alchemist"]["highlight"]` |
| Flask liquid / energy accents | `#50C878` | (80, 200, 120) | `CLASS_PALETTES["alchemist"]["accent"]` -- green liquid glow |
| Secondary green accent | `#4EC373` | (78, 195, 115) | `--shawnos-green` design token -- the brand's connective color |
| Background / environment | `#0D1117` | (13, 17, 23) | `--canvas` design token |
| Eye glow / terminal text | `#4EC373` | (78, 195, 115) | Matches terminal green across all content images |
| Metal / belt / hardware | `#5A6170` | (90, 97, 112) | `METAL_DARK` from rpg_sprites.py |
| Skin tone | `#C8AF96` | (200, 175, 150) | `SKIN` base from rpg_sprites.py |

### Visual Design Brief

**Composition**: Front-facing portrait, head and shoulders visible, slight 3/4 angle. This is the framing SadTalker and D-ID need for lip sync mapping.

**Hood**: Deep purple hood pulled partially forward, casting shadow across upper face. Green energy/runes faintly glow along the hood's edge. The hood is the character's most recognizable silhouette element -- it should read clearly even at 100px thumbnail size.

**Face**: Visible from mid-forehead down. Calm, slightly amused default expression. Eyes have a faint green glow (like terminal phosphor). Stubble or light facial hair to add texture and humanity. The mouth region needs clear definition -- lips, jaw line, chin -- because this is where lip sync animation will be applied.

**Clothing**: Purple alchemist robe with subtle circuitry/terminal-text patterns woven into the fabric (not literal circuit boards -- more like faint monospace glyphs that fade in and out). A leather belt or bandolier holds small vials of green liquid.

**Props**: A bubbling flask held at chest level in one hand, green liquid inside with faint particle effects. The flask is the character's signature prop -- equivalent to Rick's portal gun or a wizard's staff. In alternate poses, can hold a glowing terminal/tablet.

**Background**: Transparent or dark (`#0D1117`). The character will be composited over screen recordings, so the background needs to be removable or already dark.

**Style**: Semi-realistic illustration, NOT pixel art, NOT anime, NOT hyper-realistic. Think Arcane (Netflix) level of stylization -- painterly but with clear features. Clean enough for lip sync tools to map facial landmarks, stylized enough to feel like a character and not a deepfake.

### Expression Sheet (5 required poses)

| Expression | Use Case | Key Features |
|------------|----------|--------------|
| **Neutral / talking** | Default lip sync base | Slight smile, relaxed brow, mouth closed at rest |
| **Explaining** | Teaching moments, demos | One hand raised palm-up, eyebrows slightly lifted |
| **Reacting** | "Wait, look at this" moments | Eyes wider, slight lean forward, flask lowered |
| **Confident** | Closing statements, CTAs | Smirk, one eyebrow raised, direct eye contact |
| **Thinking** | Pauses, transitions | Eyes up-left, hand on chin, flask tucked under arm |

Each expression delivered as a separate high-resolution PNG (minimum 1024x1024, ideally 2048x2048) on transparent background.

### Deliverables from Artist

1. **Character sheet** -- all 5 expressions, front-facing, consistent proportions
2. **Turnaround reference** -- front, 3/4, side views for consistency
3. **Color reference card** -- hex values locked to the palette above
4. **Layered source file** (PSD or Procreate) -- for future expression additions
5. **Transparent PNG exports** -- each expression at 2048x2048

---

## Where to Commission

### Option A: Fiverr / Freelance (recommended for speed)

- Search: "custom character design illustration expressions" or "VTuber model sheet"
- Budget: $200-400 for a 5-expression character sheet from a mid-tier artist
- Turnaround: 5-10 business days
- Look for artists with experience in: character design sheets, VTuber assets, game character art

### Option B: Artist Community (higher quality ceiling)

- ArtStation, DeviantArt, Twitter artist community
- Budget: $400-800 for a polished character sheet
- Turnaround: 2-4 weeks
- Better for finding an artist whose existing style matches the vision

### Option C: AI-Generated Base + Artist Refinement (fastest)

- Generate initial character concepts with Midjourney/DALL-E using the spec above
- Hire artist to refine, create expression sheet, and deliver layered files
- Budget: $150-300
- Turnaround: 3-7 days
- Risk: AI-generated characters can be harder for lip sync tools to animate consistently across expressions

### Recommendation

**Option A** for Phase 1. Get a solid 5-expression sheet from a Fiverr artist in the $250-350 range. The character doesn't need to be perfect on day one -- it needs to be recognizable, lip-sync-compatible, and on-brand. Iterate after the first 20 videos based on audience response.

---

## How This Connects to Existing Systems

### RPG Avatar System (coexists)

The pixel art avatars continue powering the website's progression gamification. The Terminal Alchemist character is the "public face" for video content. Think of it as: the pixel art is the game sprite, the illustrated character is the cinematic render of the same person.

### Content Image System (extends)

The Python + Pillow content image generation (`/contentimage`, `/aiosimage`) already uses the exact same color palette. The Terminal Alchemist character PNG can be composited into these images as a brand mascot element if desired.

### Voice System (maps directly)

The character's personality IS the voice system. The voice guide's "casual competence," "builder-first," and "pattern articulation" principles become the character's speaking style. No new voice needs to be invented -- the Terminal Alchemist talks exactly like the LinkedIn/X content reads.

### TikTok Script Skill (feeds into)

The existing `/tiktokscript` skill generates 16-second scripts. Those scripts become the Terminal Alchemist's dialogue. The pipeline is: `/tiktokscript` -> ElevenLabs TTS -> SadTalker lip sync on character PNG -> composite over screen recording.

---

## Next Steps

1. **Generate 3-5 concept images** using the spec above (Midjourney, DALL-E, or manual illustration brief) to visualize the character before commissioning
2. **Select and brief an artist** with the color palette, expression sheet requirements, and style reference (Arcane-level stylization)
3. **Test SadTalker** with a rough character image to validate lip sync quality before investing in the full commission
4. **Build the `/faceless-script` skill** that connects repo content -> character voice script -> ElevenLabs -> video pipeline
