/** V3 Scene timing constants — ~10s at 30fps = 310 frames */

export const FPS_V2 = 30;
export const TOTAL_DURATION_SEC_V2 = 10;
export const TOTAL_FRAMES_V2 = 310;

/**
 * TransitionSeries scene durations.
 * Total = sum(durations) - sum(transitions) = 340 - 30 = 310 frames (~10.3s).
 */
export const TRANSITION_DURATION = 10; // ~0.33s overlap between scenes

export const SCENES_V2 = {
  hook:          { durationFrames: 36  },  // 1.2s
  bootWikiBlitz: { durationFrames: 110 },  // ~3.7s (22f boot + 5×15f wikis + buffer)
  progression:   { durationFrames: 100 },  // ~3.3s
  ctaNetwork:    { durationFrames: 94  },  // ~3.1s
} as const;
// Total: 36 + 110 + 100 + 94 - 3×10 = 310 frames

export type SceneNameV2 = keyof typeof SCENES_V2;
