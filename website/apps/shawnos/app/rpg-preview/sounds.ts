/**
 * RPG reveal sound effects — pure Web Audio API synthesis.
 *
 * Each class has a unique 8-bit / retro sound signature.
 * Tier reveals use a base chime that scales in complexity with tier level.
 * Volume is capped low (0.06–0.10) to match existing UI sounds and
 * avoid disruption during rapid clicking.
 */

import type { RPGClass } from '@shawnos/shared/lib/rpg'

/* ── Helpers ─────────────────────────────────────── */

function createCtx(): AudioContext {
  return new AudioContext()
}

function scheduleClose(ctx: AudioContext, ms: number) {
  setTimeout(() => ctx.close(), ms)
}

/* ── Builder: Anvil strike + metallic ring-out ──── */

function playBuilderSound(ctx: AudioContext) {
  const t = ctx.currentTime

  // Thump: short square wave at 80 Hz
  const thump = ctx.createOscillator()
  const thumpGain = ctx.createGain()
  thump.type = 'square'
  thump.frequency.setValueAtTime(80, t)
  thumpGain.gain.setValueAtTime(0.08, t)
  thumpGain.gain.linearRampToValueAtTime(0, t + 0.06)
  thump.connect(thumpGain).connect(ctx.destination)
  thump.start(t)
  thump.stop(t + 0.07)

  // Metallic ring: sine overtone at 1200 Hz decaying over 400ms
  const ring = ctx.createOscillator()
  const ringGain = ctx.createGain()
  ring.type = 'sine'
  ring.frequency.setValueAtTime(1200, t + 0.03)
  ring.frequency.exponentialRampToValueAtTime(900, t + 0.45)
  ringGain.gain.setValueAtTime(0.06, t + 0.03)
  ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
  ring.connect(ringGain).connect(ctx.destination)
  ring.start(t + 0.03)
  ring.stop(t + 0.5)

  scheduleClose(ctx, 600)
}

/* ── Scribe: Quill scratch + page-flip sweep ────── */

function playScribeSound(ctx: AudioContext) {
  const t = ctx.currentTime

  // Filtered noise burst via rapid random-pitch oscillator
  const scratch = ctx.createOscillator()
  const scratchGain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  scratch.type = 'sawtooth'
  scratch.frequency.setValueAtTime(3000, t)
  scratch.frequency.linearRampToValueAtTime(6000, t + 0.05)
  scratch.frequency.linearRampToValueAtTime(2000, t + 0.1)
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(2000, t)
  filter.frequency.linearRampToValueAtTime(5000, t + 0.1)
  scratchGain.gain.setValueAtTime(0.04, t)
  scratchGain.gain.linearRampToValueAtTime(0, t + 0.12)
  scratch.connect(filter).connect(scratchGain).connect(ctx.destination)
  scratch.start(t)
  scratch.stop(t + 0.13)

  // Page flip: gentle high-pass sweep (sine)
  const flip = ctx.createOscillator()
  const flipGain = ctx.createGain()
  flip.type = 'sine'
  flip.frequency.setValueAtTime(800, t + 0.08)
  flip.frequency.exponentialRampToValueAtTime(2400, t + 0.3)
  flipGain.gain.setValueAtTime(0.05, t + 0.08)
  flipGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
  flip.connect(flipGain).connect(ctx.destination)
  flip.start(t + 0.08)
  flip.stop(t + 0.4)

  scheduleClose(ctx, 500)
}

/* ── Strategist: Lightning zap (downward sweep) ─── */

function playStrategistSound(ctx: AudioContext) {
  const t = ctx.currentTime

  const zap = ctx.createOscillator()
  const zapGain = ctx.createGain()
  zap.type = 'square'
  zap.frequency.setValueAtTime(2000, t)
  zap.frequency.exponentialRampToValueAtTime(200, t + 0.2)
  zapGain.gain.setValueAtTime(0.07, t)
  zapGain.gain.linearRampToValueAtTime(0.06, t + 0.08)
  zapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
  zap.connect(zapGain).connect(ctx.destination)
  zap.start(t)
  zap.stop(t + 0.28)

  // Tail crackle: short burst after the main zap
  const crackle = ctx.createOscillator()
  const crackleGain = ctx.createGain()
  crackle.type = 'sawtooth'
  crackle.frequency.setValueAtTime(600, t + 0.15)
  crackle.frequency.exponentialRampToValueAtTime(100, t + 0.35)
  crackleGain.gain.setValueAtTime(0.03, t + 0.15)
  crackleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
  crackle.connect(crackleGain).connect(ctx.destination)
  crackle.start(t + 0.15)
  crackle.stop(t + 0.38)

  scheduleClose(ctx, 500)
}

/* ── Alchemist: Bubbling flask pop ──────────────── */

function playAlchemistSound(ctx: AudioContext) {
  const t = ctx.currentTime

  // 4 rapid random-pitch sine blips (bubbles)
  const bubbleFreqs = [420, 680, 350, 780]
  bubbleFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const start = t + i * 0.045
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, start)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.3, start + 0.03)
    gain.gain.setValueAtTime(0.06, start)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.04)
    osc.connect(gain).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + 0.05)
  })

  // Cork pop: higher-pitched burst after the bubbles
  const pop = ctx.createOscillator()
  const popGain = ctx.createGain()
  const popStart = t + 0.2
  pop.type = 'triangle'
  pop.frequency.setValueAtTime(1400, popStart)
  pop.frequency.exponentialRampToValueAtTime(600, popStart + 0.08)
  popGain.gain.setValueAtTime(0.08, popStart)
  popGain.gain.exponentialRampToValueAtTime(0.001, popStart + 0.12)
  pop.connect(popGain).connect(ctx.destination)
  pop.start(popStart)
  pop.stop(popStart + 0.15)

  scheduleClose(ctx, 500)
}

/* ── Polymath: Ascending arpeggio (C-E-G-C) ────── */

function playPolymathSound(ctx: AudioContext) {
  const t = ctx.currentTime

  // C4-E4-G4-C5 across different oscillator types for richness
  const notes: Array<{ freq: number; type: OscillatorType }> = [
    { freq: 523.25, type: 'square' },    // C5
    { freq: 659.25, type: 'triangle' },  // E5
    { freq: 783.99, type: 'sine' },      // G5
    { freq: 1046.5, type: 'square' },    // C6
  ]

  notes.forEach(({ freq, type }, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const start = t + i * 0.065
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    gain.gain.setValueAtTime(0.06, start)
    gain.gain.setValueAtTime(0.06, start + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18)
    osc.connect(gain).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + 0.2)
  })

  scheduleClose(ctx, 600)
}

/* ── Class sound dispatcher ─────────────────────── */

const CLASS_SOUND_MAP: Record<RPGClass, (ctx: AudioContext) => void> = {
  Builder: playBuilderSound,
  Scribe: playScribeSound,
  Strategist: playStrategistSound,
  Alchemist: playAlchemistSound,
  Polymath: playPolymathSound,
}

export function playClassRevealSound(rpgClass: RPGClass): void {
  try {
    const ctx = createCtx()
    CLASS_SOUND_MAP[rpgClass](ctx)
  } catch {
    /* autoplay blocked — reveal works silently */
  }
}

/* ── Tier reveal chimes ─────────────────────────── */

/**
 * Tier-scaled reveal chime.
 *
 * - Tiers 1-2: Single note chime (simple sine, short)
 * - Tiers 3-4: Two-note chime (ascending interval, adds harmonics)
 * - Tiers 5-6: Three-note fanfare (full chord, longer sustain)
 *
 * Tier 6 (Grand Master) gets special fanfare treatment.
 */
export function playTierRevealSound(avatarTier: number): void {
  try {
    const ctx = createCtx()
    const t = ctx.currentTime

    if (avatarTier <= 2) {
      // Single note chime — clean sine
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, t)  // A5
      gain.gain.setValueAtTime(0.07, t)
      gain.gain.setValueAtTime(0.07, t + 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.35)
      scheduleClose(ctx, 500)
    } else if (avatarTier <= 4) {
      // Two-note ascending chime — sine + triangle harmonic
      const notes = [880, 1108.73]  // A5 → C#6 (major third)
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const start = t + i * 0.09
        osc.type = i === 0 ? 'sine' : 'triangle'
        osc.frequency.setValueAtTime(freq, start)
        gain.gain.setValueAtTime(0.07, start)
        gain.gain.setValueAtTime(0.07, start + 0.06)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35)
        osc.connect(gain).connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.4)
      })
      scheduleClose(ctx, 600)
    } else if (avatarTier === 5) {
      // Three-note fanfare — A5 → C#6 → E6 (A major triad)
      const notes: Array<{ freq: number; type: OscillatorType }> = [
        { freq: 880, type: 'sine' },       // A5
        { freq: 1108.73, type: 'triangle' }, // C#6
        { freq: 1318.51, type: 'sine' },    // E6
      ]
      notes.forEach(({ freq, type }, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const start = t + i * 0.1
        osc.type = type
        osc.frequency.setValueAtTime(freq, start)
        gain.gain.setValueAtTime(0.08, start)
        gain.gain.setValueAtTime(0.08, start + 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5)
        osc.connect(gain).connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.55)
      })
      scheduleClose(ctx, 800)
    } else {
      // Tier 6 Grand Master fanfare — rich chord with longer sustain
      const notes: Array<{ freq: number; type: OscillatorType; vol: number }> = [
        { freq: 880, type: 'sine', vol: 0.06 },       // A5
        { freq: 1108.73, type: 'triangle', vol: 0.06 }, // C#6
        { freq: 1318.51, type: 'sine', vol: 0.07 },    // E6
        { freq: 1760, type: 'square', vol: 0.04 },     // A6 octave cap
      ]
      notes.forEach(({ freq, type, vol }, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const start = t + i * 0.09
        osc.type = type
        osc.frequency.setValueAtTime(freq, start)
        gain.gain.setValueAtTime(vol, start)
        gain.gain.setValueAtTime(vol, start + 0.15)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7)
        osc.connect(gain).connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.75)
      })

      // Shimmer: quiet high-frequency sine wash
      const shimmer = ctx.createOscillator()
      const shimmerGain = ctx.createGain()
      shimmer.type = 'sine'
      shimmer.frequency.setValueAtTime(3520, t + 0.3)
      shimmer.frequency.exponentialRampToValueAtTime(2640, t + 0.8)
      shimmerGain.gain.setValueAtTime(0.02, t + 0.3)
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8)
      shimmer.connect(shimmerGain).connect(ctx.destination)
      shimmer.start(t + 0.3)
      shimmer.stop(t + 0.85)

      scheduleClose(ctx, 1000)
    }
  } catch {
    /* autoplay blocked — reveal works silently */
  }
}
