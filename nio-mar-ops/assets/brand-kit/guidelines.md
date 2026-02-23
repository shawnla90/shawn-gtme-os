# Nio Brand Kit

## Logo / Wordmark

**Primary**: "NioBot" or "Nio"
**Style**: Monospace, lowercase-first
**Usage**: Always "Nio" in running text, "NioBot" for the product name
**Never**: "NIOBOT", "nioBot", "NIO BOT"

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Use |
|------|-----|-----|-----|
| Nio Green | `#4EC373` | 78, 195, 115 | Primary accent, CTAs, Nio agent |
| Dark Base | `#0D1117` | 13, 17, 23 | Backgrounds |
| Surface | `#161B22` | 22, 27, 34 | Cards, containers |
| Border | `#30363D` | 48, 54, 61 | Dividers, outlines |

### Text Colors

| Name | Hex | Use |
|------|-----|-----|
| Primary Text | `#E6EDF3` | Headings, body |
| Secondary Text | `#8B949E` | Captions, metadata |
| Muted Text | `#484F58` | Disabled, hints |

### Agent Colors

| Agent | Hex | Use |
|-------|-----|-----|
| Nio | `#4EC373` | Green, ops |
| Architect | `#6B8AFF` | Blue, planning |
| Writer | `#FF8A6B` | Orange, content |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Success | `#4EC373` | Deployed, completed |
| Warning | `#E3B341` | Attention needed |
| Error | `#F85149` | Failed, broken |
| Info | `#58A6FF` | Informational |

---

## Typography

### Headings
- Font: JetBrains Mono (or system monospace fallback)
- Weight: 600-700
- Style: Lowercase-first when in brand voice

### Body
- Font: Inter (or system sans-serif stack)
- Weight: 400
- Size: 16px base
- Line height: 1.6

### Code / Terminal
- Font: JetBrains Mono
- Weight: 400
- Background: `#161B22`
- Border: 1px solid `#30363D`

---

## Sprite Display Rules

### Rendering
- Always use `image-rendering: pixelated` (CSS)
- Never apply anti-aliasing or smoothing to pixel art
- Scale at integer multiples only (1x, 2x, 3x, 4x)
- Dark background behind sprites (never white)

### Sizing

| Context | Size | Source |
|---------|------|--------|
| Inline avatar (chat) | 32-48px | 64px file |
| Profile display | 64-96px | 128px file |
| Card / feature | 128-192px | 256px file |
| Hero / showcase | 256-384px | 512px file |
| Marketing banner | 384-512px | 512px file |

### Backgrounds
- Sprites on `#0D1117` (dark base) - preferred
- Sprites on `#161B22` (surface) - acceptable
- Sprites on transparent - for overlays only
- Never on white or light backgrounds

---

## Voice Rules (Marketing Copy)

### Do
- Short sentences, text-message pacing
- Specific numbers over vague claims
- Show receipts (screenshots, GIFs, links)
- Use builder language: ship, deploy, build, stack
- Ellipses for trailing thoughts...
- Arrows for workflow: → ➡️

### Don't
- Em-dashes (ever)
- Hype words: "game-changer", "revolutionary", "unleash"
- Corporate SaaS language: "streamline", "leverage", "unlock potential"
- Sycophantic openers: "Great question!", "Absolutely!"
- Narrator setups: "Here's the thing about..."
- Humble-brag disclaimers: "I don't have all the answers, but..."

### Sign-off
- Personal posts: "shawn ⚡ the gtme alchemist 🧙‍♂️"
- Product posts: "niobot.ai"
- Casual: no sign-off needed

---

## Social Media Assets

### X/Twitter Profile (@niobotai)
- Avatar: Nio tier 2 idle GIF, 400x400
- Header: Evolution strip on dark background, 1500x500
- Bio: "AI build partner. Ships code. Has opinions. Levels up. Built by @shawnla90"
- Link: niobot.ai

### Discord
- Server icon: Nio tier 2, 512x512, dark background
- Banner: Evolution strip + "NioBot HQ", 960x540
- Invite splash: Dark theme, Nio sprite, tagline

### OG Images (Link Previews)
- Size: 1200x630
- Layout: Nio sprite left, text right
- Background: `#0D1117`
- Text: Product name + tagline in `#E6EDF3`
- Accent: `#4EC373` border or glow

---

## Downloads

All source assets in: `/data/progression/avatars/`
Marketing assets (when created): `/nio-mar-ops/assets/brand-kit/files/`
