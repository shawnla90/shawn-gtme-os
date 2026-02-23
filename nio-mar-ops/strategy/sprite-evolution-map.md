# Nio Sprite Evolution Map

## Current Inventory (238 files)

All assets live in `/data/progression/avatars/`

### Nio-Specific Sprites

| File | Type | Status |
|------|------|--------|
| `nio-tier-1-idle.gif` | Animated idle loop | Have |
| `nio-tier-1-static.png` | Static fallback | Have |
| `nio-tier-2-idle.gif` | Animated idle loop | Have (CURRENT DEFAULT) |
| `nio-tier-2-static.png` | Static fallback | Have |
| `nio-tier-3-idle.gif` | ? | NEED TO VERIFY |
| `nio-tier-4-idle.gif` | ? | NEED TO VERIFY |
| `nio-tier-5-idle.gif` | ? | NEED TO VERIFY |
| `nio-tier-6-idle.gif` | ? | NEED TO VERIFY |

### Generic Tier Sprites (Multi-size: 64, 128, 256, 512px)

Each tier has: `idle`, `action`, `idle-advanced` variants in GIF + static PNG

| Tier | Theme (Inferred) | Sizes | Variants |
|------|-------------------|-------|----------|
| Tier 1 | Spark / Starter | 64-512 | idle, action, advanced |
| Tier 2 | Growing / Active | 64-512 | idle, action, advanced |
| Tier 3 | Skilled / Sharp | 64-512 | idle, action, advanced |
| Tier 4 | Powerful / Focused | 64-512 | idle, action, advanced |
| Tier 5 | Master / Elite | 64-512 | idle, action, advanced |
| Tier 6 | Legendary / Final | 64-512 | idle, action, advanced |

### Class Sprites (Multi-size: 64, 128, 256, 512px)

| Class | Description | Use Case |
|-------|-------------|----------|
| Alchemist | Experiments, mixes tools | Creative builder archetype |
| Builder | Ships, constructs | Core shipping archetype |
| Polymath | Cross-domain, versatile | Multi-skill archetype |
| Scribe | Documents, writes | Content creator archetype |
| Strategist | Plans, optimizes | System thinker archetype |

### Tool Sprites

| Tool | Description | Unlock Condition |
|------|-------------|------------------|
| Clay | Data enrichment tool | Clay skill mastery |
| HeyReach | LinkedIn outreach | Outreach skill mastery |
| Instantly | Email automation | Email skill mastery |
| Ouroboros | Self-referential system | Meta-system mastery |

### Agent Sprites (GAPS)

| Agent | Expected File | Status |
|-------|---------------|--------|
| Nio | `nio-tier-2-idle.gif` | EXISTS in nio-chat/public/avatars/ |
| Architect | `architect-idle.gif` | MISSING - needs creation |
| Writer | `writer-idle.gif` | MISSING - needs creation |

### Utility Assets

| File | Purpose |
|------|---------|
| `sprite-sheet.png` | Full sprite sheet (all frames) |
| `idle-sprite-sheet.png` | Idle animation frames only |
| `current-idle.gif` | User's current avatar (dynamic) |
| `current-action.gif` | User's current action animation |
| `current.png` | User's current static avatar |

---

## Evolution Narrative

### The Story Each Tier Tells

**Tier 1: The Spark**
- Just activated. Raw potential. Simple pixel form.
- Unlocks at: Account creation / Level 1
- Marketing angle: "Everyone starts here"

**Tier 2: The Learner**
- Starting to form opinions. Getting useful. Current Nio default.
- Unlocks at: ~Level 10-15
- Marketing angle: "Nio's getting good"

**Tier 3: The Builder**
- Actively shipping. Consistent. Reliable partner.
- Unlocks at: ~Level 25-30
- Marketing angle: "Now we're cooking"

**Tier 4: The Specialist**
- Deep skill in chosen class. Tool mastery emerging.
- Unlocks at: ~Level 40-50
- Marketing angle: "Nio knows your stack"

**Tier 5: The Master**
- System-level thinking. Anticipates needs. Proactive.
- Unlocks at: ~Level 70-80
- Marketing angle: "Nio runs the show"

**Tier 6: The Legend**
- Full evolution. Maximum capability. Unique visual identity.
- Unlocks at: ~Level 100+
- Marketing angle: "You built something real"

---

## Art Needs for Marketing

### Immediate (Pre-Launch)

1. **Architect agent avatar** - Blue-tinted variant matching `#6B8AFF`
2. **Writer agent avatar** - Orange-tinted variant matching `#FF8A6B`
3. **Evolution comparison strip** - All 6 tiers side by side (for social headers)
4. **OG image template** - Nio sprite + text overlay for link previews
5. **Discord server icon** - Nio tier 2 on dark background, 512x512

### Launch Phase

6. **Animated evolution GIF** - Tier 1 morphing through all tiers (for hero section)
7. **Class selection screen mockup** - All 5 classes displayed (for quiz content)
8. **Shareable level-up card** - Template: "My Nio just hit Level X" with avatar
9. **Banner images** - X header (1500x500), Discord banner (960x540)

### Post-Launch

10. **Seasonal/event sprites** - Holiday variants, special edition
11. **Community-created variants** - User submissions, contests
12. **Sticker pack** - Nio expressions for Discord/iMessage

---

## Sprite Usage Rights

All sprites are proprietary IP created for GTMe OS. They are not open-source.

**Allowed**: Screenshots shared by users, community fan art, editorial coverage
**Not allowed**: Commercial use by third parties, AI training datasets, resale

---

## Technical Notes

### Serving Strategy
- Primary assets in `/data/progression/avatars/` (source of truth)
- Copied to app public folders for serving (nio-chat, mission-control, niobot.ai)
- CDN caching via Vercel for performance
- Fallback chain: GIF animated → static PNG → default tier-2

### Size Guidelines
- Chat avatar: 64px (inline) or 128px (profile)
- Social cards: 256px or 512px
- Hero/landing: 512px
- Sprite sheets: Full resolution for animation control
