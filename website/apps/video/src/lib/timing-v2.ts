/** V2 Scene timing constants — 30 seconds at 30fps = 900 frames */

export const FPS_V2 = 30;
export const TOTAL_DURATION_SEC_V2 = 30;
export const TOTAL_FRAMES_V2 = FPS_V2 * TOTAL_DURATION_SEC_V2; // 900

/**
 * TransitionSeries scene durations.
 * Total = sum(durations) - sum(transitions) = 945 - 45 = 900 frames.
 */
export const TRANSITION_DURATION = 15; // 0.5s overlap between scenes

export const SCENES_V2 = {
  hook:          { durationFrames: 90  }, // ~3s (includes 15f transition out)
  bootWikiBlitz: { durationFrames: 350 }, // ~11.7s (includes transitions)
  progression:   { durationFrames: 250 }, // ~8.3s (includes transitions)
  ctaNetwork:    { durationFrames: 255 }, // ~8.5s (includes 15f transition in)
} as const;

export type SceneNameV2 = keyof typeof SCENES_V2;
