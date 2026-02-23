# Sprite Asset Audit

## Source: /data/progression/avatars/
## Total files: 238
## Audit date: 2026-02-22

---

## Nio-Specific Sprites

| File | Size | Status | Notes |
|------|------|--------|-------|
| nio-tier-1-idle.gif | default | HAVE | Starter sprite |
| nio-tier-1-static.png | default | HAVE | Static fallback |
| nio-tier-2-idle.gif | default | HAVE | Current default, in production |
| nio-tier-2-static.png | default | HAVE | Static fallback |

**Gap**: No Nio-branded sprites for tiers 3-6. Generic tier sprites exist but no `nio-tier-X` variants.

---

## Generic Tier Sprites

### Tier 1
- tier-1-*-idle-{64,128,256,512}.gif
- tier-1-*-action-{64,128,256,512}.gif
- tier-1-*-idle-advanced-{64,128,256,512}.gif
- tier-1-*-static-{64,128,256,512}.png

### Tier 2
- (Same pattern as tier 1)

### Tier 3-6
- (Same pattern, need to verify all sizes exist)

**Action needed**: Verify all 6 tiers x 3 variants x 4 sizes = 72 GIFs + 72 PNGs = 144 files minimum

---

## Class Sprites

| Class | Idle GIF | Static PNG | Sizes |
|-------|----------|------------|-------|
| Alchemist | HAVE | HAVE | 64, 128, 256, 512 |
| Builder | HAVE | HAVE | 64, 128, 256, 512 |
| Polymath | HAVE | HAVE | 64, 128, 256, 512 |
| Scribe | HAVE | HAVE | 64, 128, 256, 512 |
| Strategist | HAVE | HAVE | 64, 128, 256, 512 |

**Status**: Complete set. All 5 classes in all 4 sizes.

---

## Tool Sprites

| Tool | Idle GIF | Static PNG | Added |
|------|----------|------------|-------|
| Clay | HAVE | HAVE | Earlier |
| HeyReach | HAVE | HAVE | Earlier |
| Instantly | HAVE | HAVE | Earlier |
| Ouroboros | HAVE | HAVE | Feb 17, 2026 |

**Status**: Complete. 4 tool mastery sprites.

---

## Agent Sprites (CRITICAL GAPS)

| Agent | Expected Path | Status |
|-------|---------------|--------|
| Nio | /avatars/nio-tier-2-idle.gif | EXISTS in nio-chat |
| Architect | /avatars/architect-idle.gif | MISSING |
| Writer | /avatars/writer-idle.gif | MISSING |

**Action needed**:
1. Create architect sprite (blue-tinted, `#6B8AFF` accent)
2. Create writer sprite (orange-tinted, `#FF8A6B` accent)
3. Or: repurpose existing class sprites (Strategist → Architect, Scribe → Writer)

---

## Marketing Assets Needed

### Immediate
- [ ] Evolution comparison strip (6 tiers, horizontal, labeled)
- [ ] Class showcase image (5 classes, horizontal, labeled)
- [ ] OG image template (Nio + text, 1200x630)
- [ ] X/Twitter header (1500x500)
- [ ] Discord server icon (512x512)
- [ ] Discord banner (960x540)

### Launch Phase
- [ ] Evolution timelapse GIF (tier 1 morphing to tier 6)
- [ ] Shareable level-up card template
- [ ] Tool mastery showcase image
- [ ] V1 vs V2 vs V3 comparison graphic

### Post-Launch
- [ ] Sticker pack (Nio expressions)
- [ ] Seasonal variants (holiday sprites)
- [ ] Community-created sprite template

---

## File Organization Recommendation

Current: all sprites flat in /data/progression/avatars/

Proposed:
```
/data/progression/avatars/
├── nio/              ← Nio-branded tier sprites
├── tiers/            ← Generic tier sprites by tier
│   ├── tier-1/
│   ├── tier-2/
│   └── ...
├── classes/          ← Class sprites
├── tools/            ← Tool mastery sprites
├── agents/           ← Agent-specific sprites (architect, writer)
├── marketing/        ← Pre-made marketing assets
└── sheets/           ← Sprite sheets
```

Not urgent. Current flat structure works. Organize when it becomes painful.

---

## Serving Locations

Sprites need to exist in these public folders:

| App | Path | Current Status |
|-----|------|----------------|
| nio-chat | /public/avatars/ | Only nio-tier-2-idle.gif |
| mission-control | /public/ | Via metrics.json references |
| niobot.ai | /public/avatars/ | Not yet created |

**Action**: Build a sprite copy script that syncs from /data/progression/avatars/ to all app public folders.
