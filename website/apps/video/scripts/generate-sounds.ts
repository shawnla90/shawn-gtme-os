/**
 * Sound generator for Lead Magnet V2.
 * Uses wav-encoder to synthesize all SFX + BGM as WAV files.
 * Run: npx tsx scripts/generate-sounds.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const SAMPLE_RATE = 44100;
const OUTPUT_DIR = path.resolve(__dirname, '../public/audio');

/** Write a WAV file from Float32Array samples (mono) */
function writeWav(filePath: string, samples: Float32Array, sampleRate = SAMPLE_RATE) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const fileSize = 36 + dataSize;

  const buffer = Buffer.alloc(44 + dataSize);
  let offset = 0;

  // RIFF header
  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(fileSize, offset); offset += 4;
  buffer.write('WAVE', offset); offset += 4;

  // fmt chunk
  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4;        // chunk size
  buffer.writeUInt16LE(1, offset); offset += 2;         // PCM
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(byteRate, offset); offset += 4;
  buffer.writeUInt16LE(blockAlign, offset); offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;

  // data chunk
  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF;
    buffer.writeInt16LE(Math.round(int16), offset);
    offset += 2;
  }

  fs.writeFileSync(filePath, buffer);
  console.log(`  wrote ${filePath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

/** Generate a sine wave */
function sine(freq: number, duration: number, amplitude = 0.5): Float32Array {
  const len = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = Math.sin(2 * Math.PI * freq * i / SAMPLE_RATE) * amplitude;
  }
  return out;
}

/** Generate white noise */
function noise(duration: number, amplitude = 0.3): Float32Array {
  const len = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(len);
  // Deterministic seed for reproducibility
  let seed = 42;
  for (let i = 0; i < len; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
    out[i] = ((seed / 0x7FFFFFFF) * 2 - 1) * amplitude;
  }
  return out;
}

/** Apply exponential decay envelope */
function applyDecay(samples: Float32Array, decayTime: number): Float32Array {
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    out[i] = samples[i] * Math.exp(-t / decayTime);
  }
  return out;
}

/** Apply fade in/out */
function applyFade(samples: Float32Array, fadeIn: number, fadeOut: number): Float32Array {
  const out = new Float32Array(samples);
  const fadeInSamples = Math.floor(fadeIn * SAMPLE_RATE);
  const fadeOutSamples = Math.floor(fadeOut * SAMPLE_RATE);
  for (let i = 0; i < fadeInSamples && i < out.length; i++) {
    out[i] *= i / fadeInSamples;
  }
  for (let i = 0; i < fadeOutSamples && i < out.length; i++) {
    const idx = out.length - 1 - i;
    out[idx] *= i / fadeOutSamples;
  }
  return out;
}

/** Mix multiple sample arrays together */
function mix(...arrays: Float32Array[]): Float32Array {
  const maxLen = Math.max(...arrays.map(a => a.length));
  const out = new Float32Array(maxLen);
  for (const arr of arrays) {
    for (let i = 0; i < arr.length; i++) {
      out[i] += arr[i];
    }
  }
  // Normalize to prevent clipping
  let peak = 0;
  for (let i = 0; i < out.length; i++) {
    peak = Math.max(peak, Math.abs(out[i]));
  }
  if (peak > 0.95) {
    const scale = 0.9 / peak;
    for (let i = 0; i < out.length; i++) {
      out[i] *= scale;
    }
  }
  return out;
}

/** Simple low-pass filter (single-pole) */
function lowPass(samples: Float32Array, cutoff: number): Float32Array {
  const out = new Float32Array(samples.length);
  const rc = 1 / (2 * Math.PI * cutoff);
  const dt = 1 / SAMPLE_RATE;
  const alpha = dt / (rc + dt);
  out[0] = samples[0];
  for (let i = 1; i < samples.length; i++) {
    out[i] = out[i - 1] + alpha * (samples[i] - out[i - 1]);
  }
  return out;
}

// ─── Sound Generators ────────────────────────────────────

function generateBgmLoop(): Float32Array {
  const duration = 10; // 10s loop
  // Low sine pad (80Hz) + higher harmonic (160Hz) + subtle noise texture
  const pad1 = sine(80, duration, 0.15);
  const pad2 = sine(160, duration, 0.06);
  const pad3 = sine(120, duration, 0.04);
  const noiseTexture = lowPass(noise(duration, 0.03), 200);
  const mixed = mix(pad1, pad2, pad3, noiseTexture);
  return applyFade(mixed, 0.5, 0.5);
}

function generateBootBeep(): Float32Array {
  const beep = sine(800, 0.08, 0.4);
  return applyDecay(beep, 0.03);
}

function generateKeyClick(): Float32Array {
  const click = noise(0.02, 0.3);
  return applyDecay(click, 0.008);
}

function generateWhoosh(): Float32Array {
  const duration = 0.2;
  const raw = noise(duration, 0.35);
  // Sweep filter effect: start wide, narrow down
  const len = raw.length;
  const out = new Float32Array(len);
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / len;
    const cutoff = 8000 * (1 - t) + 200 * t;
    const rc = 1 / (2 * Math.PI * cutoff);
    const dt = 1 / SAMPLE_RATE;
    const alpha = dt / (rc + dt);
    prev = prev + alpha * (raw[i] - prev);
    out[i] = prev;
  }
  // Apply bell-shaped envelope
  for (let i = 0; i < len; i++) {
    const t = i / len;
    const env = Math.sin(Math.PI * t);
    out[i] *= env;
  }
  return out;
}

function generateCardFlip(): Float32Array {
  const click = applyDecay(noise(0.1, 0.25), 0.025);
  const tone = applyDecay(sine(2000, 0.1, 0.15), 0.03);
  return mix(click, tone);
}

function generateLevelUp(): Float32Array {
  // 8-bit ascending arpeggio: C5-E5-G5-C6
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const noteLen = 0.1; // 100ms per note
  const totalLen = Math.floor(SAMPLE_RATE * noteLen * notes.length);
  const out = new Float32Array(totalLen);

  for (let n = 0; n < notes.length; n++) {
    const start = Math.floor(n * noteLen * SAMPLE_RATE);
    const end = Math.floor((n + 1) * noteLen * SAMPLE_RATE);
    for (let i = start; i < end && i < totalLen; i++) {
      const t = (i - start) / SAMPLE_RATE;
      // Square wave for 8-bit feel
      const phase = (2 * Math.PI * notes[n] * t) % (2 * Math.PI);
      const square = phase < Math.PI ? 0.3 : -0.3;
      // Decay per note
      const decay = Math.exp(-t / 0.08);
      out[i] = square * decay;
    }
  }
  return out;
}

function generateResolve(): Float32Array {
  const duration = 0.3;
  const len = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    // Descending tone: 200Hz → 150Hz
    const freq = 200 - (50 * t / duration);
    out[i] = Math.sin(2 * Math.PI * freq * t) * 0.35 * Math.exp(-t / 0.2);
  }
  return out;
}

// ─── Main ────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Generating V2 sound effects...\n');

  writeWav(path.join(OUTPUT_DIR, 'bgm-loop.wav'), generateBgmLoop());
  writeWav(path.join(OUTPUT_DIR, 'boot-beep.wav'), generateBootBeep());
  writeWav(path.join(OUTPUT_DIR, 'key-click.wav'), generateKeyClick());
  writeWav(path.join(OUTPUT_DIR, 'whoosh.wav'), generateWhoosh());
  writeWav(path.join(OUTPUT_DIR, 'card-flip.wav'), generateCardFlip());
  writeWav(path.join(OUTPUT_DIR, 'level-up.wav'), generateLevelUp());
  writeWav(path.join(OUTPUT_DIR, 'resolve.wav'), generateResolve());

  console.log('\nDone! 7 audio files generated.');
}

main();
