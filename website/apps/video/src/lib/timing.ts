/** Scene timing constants — 60 seconds at 30fps = 1800 frames */

export const FPS = 30;
export const TOTAL_DURATION_SEC = 60;
export const TOTAL_FRAMES = FPS * TOTAL_DURATION_SEC;

export const SCENES = {
  hook:          { startFrame: 0,          durationFrames: 3 * FPS  }, // 0-3s
  boot:          { startFrame: 3 * FPS,    durationFrames: 5 * FPS  }, // 3-8s
  wikiMontage:   { startFrame: 8 * FPS,    durationFrames: 17 * FPS }, // 8-25s
  progression:   { startFrame: 25 * FPS,   durationFrames: 15 * FPS }, // 25-40s
  networkReveal: { startFrame: 40 * FPS,   durationFrames: 12 * FPS }, // 40-52s
  cta:           { startFrame: 52 * FPS,   durationFrames: 8 * FPS  }, // 52-60s
} as const;

export type SceneName = keyof typeof SCENES;

/** Render presets for multi-format output */
export const PRESETS = {
  linkedin:  { width: 1080, height: 1350, fps: FPS }, // 4:5 — max LinkedIn feed real estate
  reels:     { width: 1080, height: 1920, fps: FPS }, // 9:16 — IG Reels / TikTok / Shorts
  landscape: { width: 1920, height: 1080, fps: FPS }, // 16:9 — YouTube / website embed
} as const;
