# Voice Profile: The Terminal Alchemist

**Status**: Selected
**Date**: 2026-02-18
**Platform**: ElevenLabs TTS

---

## Primary Voice: Chris — Charming, Down-to-Earth

| Field | Value |
|-------|-------|
| **Voice ID** | `iP95p4xoKVk53GoZ742B` |
| **Name** | Chris |
| **Description** | Charming, Down-to-Earth |
| **Gender** | Male |
| **Age** | Middle-aged |
| **Accent** | American |
| **Use Case** | Conversational |

### Why Chris

Tested 5 voice candidates using the voice-rules-in-a-file script across multiple models and expressiveness settings (10 total samples). Chris was selected after listening to all candidates. The charming, down-to-earth delivery maps directly to the builder-first voice -- someone who shares from the trenches, not from a podium. The conversational tone lands the "casual competence" principle without sounding like generic voiceover or a cartoon character.

Chris delivers at ~2.7 words/second -- faster than Callum's character-heavy pacing but not as rushed as Eric. Good sweet spot for TikTok's 15-30 second window.

### Voice Settings — Standard (most videos)

```json
{
  "voice_id": "iP95p4xoKVk53GoZ742B",
  "model_id": "eleven_turbo_v2_5",
  "voice_settings": {
    "stability": 0.45,
    "similarity_boost": 0.80,
    "style": 0.35,
    "use_speaker_boost": true
  }
}
```

**Why these values**:
- **Stability 0.45**: Natural variation between beats while staying recognizable across videos
- **Similarity boost 0.80**: Keeps the charming quality consistent
- **Style 0.35**: Enough warmth and personality without going theatrical. Chris's natural charm carries without high style values.
- **Speaker boost on**: Compensates for mobile speakers where TikTok is consumed

### Voice Settings — Expressive (hooks, reactions, closers)

For short clips where the character needs to punch harder (reacting, confident expression moments):

```json
{
  "voice_id": "iP95p4xoKVk53GoZ742B",
  "model_id": "eleven_turbo_v2_5",
  "voice_settings": {
    "stability": 0.35,
    "similarity_boost": 0.80,
    "style": 0.60,
    "use_speaker_boost": true
  }
}
```

### Voice Settings — Calm (explaining, thinking moments)

For teaching segments where clarity matters more than character energy:

```json
{
  "voice_id": "iP95p4xoKVk53GoZ742B",
  "model_id": "eleven_turbo_v2_5",
  "voice_settings": {
    "stability": 0.55,
    "similarity_boost": 0.75,
    "style": 0.25,
    "use_speaker_boost": true
  }
}
```

---

## Backup Voice: Callum — Husky Trickster

| Field | Value |
|-------|-------|
| **Voice ID** | `N2lVS1w4EtoT3dr4eOWO` |
| **Name** | Callum |
| **Description** | Husky Trickster |
| **Gender** | Male |
| **Age** | Middle-aged |
| **Accent** | American |
| **Use Case** | Characters / Animation |

### When to Use Callum

- A/B testing: if Chris feels too understated for certain series (Claude Code Secrets, Terminal Alchemist Tips), Callum's heavier character energy may land better
- Special episodes or series intros where extra gravitas is needed
- If the account leans more into animated character identity over time

### Callum Settings

```json
{
  "voice_id": "N2lVS1w4EtoT3dr4eOWO",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.40,
    "similarity_boost": 0.80,
    "style": 0.50,
    "use_speaker_boost": true
  }
}
```

---

## Pacing Reference

Measured from test audio using the voice-rules-in-a-file script (~85 words):

| Voice + Setting | Duration | Words/sec | Notes |
|-----------------|----------|-----------|-------|
| **Chris standard** | **~31.3s** | **2.7 w/s** | **Selected default. Good TikTok pacing.** |
| Chris expressive | ~31.6s | 2.7 w/s | Slightly more animated, nearly same speed |
| Callum standard | ~35.1s | 2.4 w/s | Rich character delivery, slower |
| Callum expressive | ~37.9s | 2.2 w/s | Dramatic pauses, best for hooks and closers |
| Callum multilingual v2 | ~35.1s | 2.4 w/s | Richest Callum variant |
| Eric standard | ~28.2s | 3.0 w/s | Fastest, could work for sub-15s videos |

### Script Length Targets (Chris, standard settings)

| Video Duration | Word Count Target |
|----------------|-------------------|
| 15 seconds | 35-42 words |
| 20 seconds | 50-58 words |
| 25 seconds | 62-72 words |
| 30 seconds | 75-85 words |

---

## Models Available

| Model | ID | Best For |
|-------|----|----------|
| **Turbo v2.5** | `eleven_turbo_v2_5` | Default for Chris. Fast generation, clean delivery. |
| **Multilingual v2** | `eleven_multilingual_v2` | Richer expressiveness. Use for Callum or special episodes. |

---

## Test Audio Files

All test samples stored in `content/tiktok/faceless/voice-tests/`:

| File | Voice | Model | Settings |
|------|-------|-------|----------|
| `chris-charming-down-to-earth.mp3` | Chris | turbo v2.5 | stability 0.5, style 0.3 |
| `chris-expressive.mp3` | Chris | turbo v2.5 | stability 0.35, style 0.6 |
| `callum-husky-trickster.mp3` | Callum | turbo v2.5 | stability 0.5, style 0.3 |
| `callum-expressive.mp3` | Callum | turbo v2.5 | stability 0.35, style 0.6 |
| `callum-multilingual-v2.mp3` | Callum | multilingual v2 | stability 0.4, style 0.5 |
| `eric-smooth-trustworthy.mp3` | Eric | turbo v2.5 | stability 0.5, style 0.3 |
| `eric-expressive.mp3` | Eric | turbo v2.5 | stability 0.35, style 0.6 |
| `eric-multilingual-v2.mp3` | Eric | multilingual v2 | stability 0.4, style 0.5 |
| `brian-deep-resonant.mp3` | Brian | turbo v2.5 | stability 0.5, style 0.3 |
| `roger-laid-back-casual.mp3` | Roger | turbo v2.5 | stability 0.5, style 0.3 |

---

## Candidates Evaluated

| Voice | Fit Score | Pros | Cons | Verdict |
|-------|-----------|------|------|---------|
| **Chris** (Charming, Down-to-Earth) | 9/10 | Down-to-earth maps to builder voice. Charming without being cheesy. Natural TikTok pacing. | Less "character" energy than Callum. | **Selected as primary** |
| **Callum** (Husky Trickster) | 7/10 | Only character/animation voice. Husky = alchemist gravitas. | Slower pacing needs tighter scripts. Heavier character feel. | **Selected as backup** |
| **Eric** (Smooth, Trustworthy) | 6/10 | Fastest delivery. Clean and professional. | Less personality. Could blend in with generic voiceover. | Runner-up |
| **Brian** (Deep, Resonant) | 5/10 | Deep voice adds authority. Social media optimized. | Feels too "announcer." Not casual enough. | Cut |
| **Roger** (Laid-Back, Casual) | 5/10 | Most casual. Relaxed energy. | Too flat for animated character. Lacks spark. | Cut |

---

## Integration Notes

### With Faceless Script Skill

The `/faceless-script` skill references this voice profile in Step 2. The ElevenLabs Text Block in each script should be generated using the Chris standard settings above. Script word counts should use this profile's pacing reference.

### With ElevenLabs MCP

The ElevenLabs MCP server is configured in `~/.cursor/mcp.json` under key `elevenlabs`. To generate audio from a script's ElevenLabs Text Block:

```
Voice ID: iP95p4xoKVk53GoZ742B
Model: eleven_turbo_v2_5
Settings: stability 0.45, similarity_boost 0.80, style 0.35, speaker_boost true
```

### With Lip Sync Pipeline

Chris's clear conversational delivery produces consistent mouth movements well-suited for lip sync tools (SadTalker, D-ID). The moderate stability setting (0.45) creates natural variation without unpredictable articulation jumps.

### Cost Estimate

At ElevenLabs Creator plan ($22/month, 100,000 characters):
- Average script: ~350-400 characters
- Videos per month: ~250-285 before hitting the limit
- At 1 video/day (30/month): uses ~12,000 characters, 12% of quota

---

## Future: Voice Cloning Option

If the account reaches 1K+ followers and needs a truly unique voice, ElevenLabs offers Instant Voice Cloning at the Starter tier ($5/month). Requirements:
- 1-5 minute audio sample of the target voice
- Could clone a voice actor reading scripts in the desired style
- Would replace Chris with a proprietary voice that no other account can use

Phase 3 consideration. Chris is the right starting point.
