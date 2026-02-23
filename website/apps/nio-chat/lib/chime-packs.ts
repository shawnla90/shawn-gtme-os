// NioBot V3 — Chime pack registry: 8-bit synth + 2 MP3 packs

import type { ChimeEvent, ChimeSound, SynthSound, MP3Sound } from './chime-engine'

export interface ChimePack {
  id: string
  name: string
  description: string
  sounds: Partial<Record<ChimeEvent, ChimeSound>>
}

// --- 8-Bit Synth Sounds (adapted from rpg-preview/sounds.ts) ---

const synthMessageSent: SynthSound = {
  type: 'synth',
  play(ctx, volume) {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(880, t)
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.06)
    gain.gain.setValueAtTime(volume * 0.08, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.1)
  },
}

const synthMessageReceived: SynthSound = {
  type: 'synth',
  play(ctx, volume) {
    const t = ctx.currentTime
    // Two-note ascending chime
    const notes = [659.25, 880] // E5 → A5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = t + i * 0.08
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(volume * 0.07, start)
      gain.gain.setValueAtTime(volume * 0.07, start + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.3)
    })
  },
}

const synthStreamDone: SynthSound = {
  type: 'synth',
  play(ctx, volume) {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(523.25, t) // C5
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.2) // slight descent
    gain.gain.setValueAtTime(volume * 0.05, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.3)
  },
}

const synthAgentSwitch: SynthSound = {
  type: 'synth',
  play(ctx, volume) {
    const t = ctx.currentTime
    // Sweep down then up
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, t)
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.08)
    osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.2)
    gain.gain.setValueAtTime(volume * 0.06, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.3)
  },
}

const synthError: SynthSound = {
  type: 'synth',
  play(ctx, volume) {
    const t = ctx.currentTime
    // Discordant low buzz
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, t)
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.15)
    gain.gain.setValueAtTime(volume * 0.06, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.25)
  },
}

const synthNewChat: SynthSound = {
  type: 'synth',
  play(ctx, volume) {
    const t = ctx.currentTime
    // Clean ascending arpeggio: C5 → E5 → G5
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = t + i * 0.06
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(volume * 0.06, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.2)
    })
  },
}

const synthLevelUp: SynthSound = {
  type: 'synth',
  play(ctx, volume) {
    const t = ctx.currentTime
    // Full fanfare: A5 → C#6 → E6 → A6
    const notes: Array<{ freq: number; type: OscillatorType }> = [
      { freq: 880, type: 'sine' },
      { freq: 1108.73, type: 'triangle' },
      { freq: 1318.51, type: 'sine' },
      { freq: 1760, type: 'square' },
    ]
    notes.forEach(({ freq, type }, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = t + i * 0.1
      osc.type = type
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(volume * 0.07, start)
      gain.gain.setValueAtTime(volume * 0.07, start + 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.55)
    })
    // Shimmer tail
    const shimmer = ctx.createOscillator()
    const shimmerGain = ctx.createGain()
    shimmer.type = 'sine'
    shimmer.frequency.setValueAtTime(3520, t + 0.35)
    shimmer.frequency.exponentialRampToValueAtTime(2640, t + 0.8)
    shimmerGain.gain.setValueAtTime(volume * 0.02, t + 0.35)
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8)
    shimmer.connect(shimmerGain).connect(ctx.destination)
    shimmer.start(t + 0.35)
    shimmer.stop(t + 0.85)
  },
}

// --- Pack Definitions ---

const eightBitPack: ChimePack = {
  id: '8bit',
  name: '8-Bit',
  description: 'Synthesized retro chiptune sounds',
  sounds: {
    messageSent: synthMessageSent,
    messageReceived: synthMessageReceived,
    streamDone: synthStreamDone,
    agentSwitch: synthAgentSwitch,
    error: synthError,
    newChat: synthNewChat,
    levelUp: synthLevelUp,
  },
}

function mp3Sound(src: string): MP3Sound {
  return { type: 'mp3', src }
}

const haloPack: ChimePack = {
  id: 'halo',
  name: 'Halo',
  description: 'Shield recharge',
  sounds: {
    messageReceived: mp3Sound('/chimes/halo-shield-recharge.mp3'),
  },
}

const fmaPack: ChimePack = {
  id: 'fma',
  name: 'FMA',
  description: 'Transmutation clap',
  sounds: {
    messageReceived: mp3Sound('/chimes/fma-transmutation.mp3'),
  },
}

// --- Registry ---

export const chimePacks: ChimePack[] = [
  eightBitPack,
  haloPack,
  fmaPack,
]

export function getChimePack(id: string): ChimePack | undefined {
  return chimePacks.find(p => p.id === id)
}

// Resolve a sound for an event: use pack's sound, fallback to 8-bit
export function resolveSound(packId: string, event: ChimeEvent): ChimeSound | undefined {
  const pack = getChimePack(packId)
  if (!pack) return eightBitPack.sounds[event]
  return pack.sounds[event] || eightBitPack.sounds[event]
}
