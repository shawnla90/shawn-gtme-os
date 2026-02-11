# Content OS Control Room — Video Generation Prompt

> For n8n → Runway / Pika / Sora / other video-gen APIs.  
> The vibe: gamified repo dashboard meets "agents working in the background." Stylized, not real.  
> Your actual content OS, visualized as a control room.

---

## Primary Prompt (Copy-Paste for Single Node)

```
Cinematic control room aesthetic. Soft blue-green glow, dark UI, single monitor or dashboard filling frame. Abstract visualization of a content operating system: labeled panels for SKILLS (play-draft, skill-play, final-copy, image-to-content), WORKFLOWS (Clay, HubSpot, Cursor), and CONTENT PILLARS (GTM plays, building & sharing). Green status lights pulse softly as if tasks complete. Progress bars or streak counters tick upward. Subtle particle or data-stream effect. No human visible. Camera slowly pushes in or slight parallax. Moody, builder-in-public energy. 16:9, 5–8 seconds.
```

---

## Modular Blocks (for n8n Multi-Step / Enrichment)

Use these as optional additions, style overrides, or alternate angles.

### Block A: Core Scene
```
Control room or mission-control style dashboard. Dark background, soft cyan and amber status lights. Single large screen or triptych of monitors. Abstract UI panels, not literal apps. Feels like watching a system run.
```

### Block B: Your Specific Elements
```
Labels visible on panels: play-draft, skill-play, final-copy, GTM plays, Lead Alchemy. Subtle alchemy or lightning bolt icon. Content pipeline flowing left to right: idea → draft → final → publish.
```

### Block C: Gamification Layer
```
Progress bars filling, streak counters incrementing, completion checkmarks appearing. Soft pulse when a "task" completes. Celebration micro-animation. Achievement-unlocked energy without being cartoony.
```

### Block D: Motion & Mood
```
Slow camera push-in or gentle orbit. Status lights pulse in sequence. Data streams or particles drift across frame. Moody, cinematic, builder aesthetic. No text-heavy overlays. Feels like watching your content OS run while you sleep.
```

---

## Alternate Angles (Pick One as Primary)

**1. Mission Control**  
```
Mission control room, dark. Single glowing dashboard. Abstract panels labeled play-draft, skill-play, final-copy. Green lights pulse. Camera slowly pushes in. Moody, cinematic.
```

**2. Gamified Dashboard**  
```
Gamified software dashboard. Dark theme. Streak counter, progress bars, completion badges. Panels for skills and workflows. Soft glow, subtle animation. Builder aesthetic.
```

**3. Agents-in-Background**  
```
Stylized view of autonomous agents working. Dark room, floating holographic panels. Content pipeline visualization. Skills lighting up in sequence. No human. Cinematic, 5–8 sec.
```

**4. Meta / Dogfooding**  
```
Screen recording aesthetic but stylized. IDE-like window. Skill names appearing, outputs flowing. The system documenting itself. Control room lighting. Moody, builder energy.
```

---

## Negative Prompt Additions (if your video API supports it)

```
No real human faces. No cluttered UI. No generic corporate stock. No bright neon. No text-heavy screens. No literal app logos. Avoid cheesy, avoid cartoony.
```

---

## n8n Usage Notes

- **Single node**: Use Primary Prompt as the main `prompt` field.
- **Two-step**: Primary Prompt → video gen → (optional) second node with Block C for "gamification pass" if your API supports img2vid.
- **Variable injection**: Replace `play-draft, skill-play, final-copy` with `{{ $json.skills }}` if you want to rotate skill names per run.
- **Aspect ratio**: 16:9 for LinkedIn/X. Some APIs use `aspect_ratio: widescreen` or similar.

---

## Brand Anchors (For Consistency)

- **Vibe**: Builder-first, no gatekeeping, build in public. The system documents itself.
- **Colors**: Dark base, soft cyan/teal, warm amber accents. Avoid harsh neon.
- **Motion**: Deliberate, not frantic. Control room, not arcade.
- **Meta angle**: "Content OS creating content about the content OS."

---

*Generated from repo context: gtme-os, skills, workflows, content pillars. Use as-is or remix for your video automation.*
