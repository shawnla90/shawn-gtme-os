/** Sound file paths and volume constants for V2 audio */

import { staticFile } from 'remotion';

export const AUDIO = {
  bgmLoop:   staticFile('audio/bgm-loop.wav'),
  bootBeep:  staticFile('audio/boot-beep.wav'),
  keyClick:  staticFile('audio/key-click.wav'),
  whoosh:    staticFile('audio/whoosh.wav'),
  cardFlip:  staticFile('audio/card-flip.wav'),
  levelUp:   staticFile('audio/level-up.wav'),
  resolve:   staticFile('audio/resolve.wav'),
} as const;

export const VOLUMES = {
  bgm: 0.25,
  bootBeep: 0.5,
  keyClick: 0.3,
  whoosh: 0.4,
  cardFlip: 0.35,
  levelUp: 0.6,
  resolve: 0.5,
} as const;
