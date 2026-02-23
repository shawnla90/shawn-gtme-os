// NioBot V3 — Audio engine: singleton AudioContext, mobile unlock, MP3 cache

export type ChimeEvent =
  | 'messageSent'
  | 'messageReceived'
  | 'streamDone'
  | 'agentSwitch'
  | 'error'
  | 'newChat'
  | 'levelUp'

export interface SynthSound {
  type: 'synth'
  play: (ctx: AudioContext, volume: number) => void
}

export interface MP3Sound {
  type: 'mp3'
  src: string
}

export type ChimeSound = SynthSound | MP3Sound

// Singleton AudioContext
let audioCtx: AudioContext | null = null
let unlocked = false

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

// iOS Safari requires a user gesture to unlock audio
export function unlockAudio(): void {
  if (unlocked) return
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  // Play silent buffer to fully unlock iOS Safari
  const buffer = ctx.createBuffer(1, 1, 22050)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(ctx.destination)
  source.start(0)
  unlocked = true
}

// MP3 audio element cache
const mp3Cache = new Map<string, HTMLAudioElement>()

function getMP3(src: string): HTMLAudioElement {
  let audio = mp3Cache.get(src)
  if (!audio) {
    audio = new Audio(src)
    audio.preload = 'auto'
    mp3Cache.set(src, audio)
  }
  return audio
}

export function preloadMP3(src: string): void {
  getMP3(src)
}

// Play a sound at a given volume (0-1)
export function playChime(sound: ChimeSound, volume: number): void {
  try {
    if (sound.type === 'synth') {
      const ctx = getAudioContext()
      if (ctx.state === 'suspended') ctx.resume()
      sound.play(ctx, volume)
    } else {
      const audio = getMP3(sound.src)
      audio.volume = Math.min(1, Math.max(0, volume))
      audio.currentTime = 0
      audio.play().catch(() => {
        // autoplay blocked, silent fail
      })
    }
  } catch {
    // audio not available, silent fail
  }
}
