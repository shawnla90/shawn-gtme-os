/** ROI Comparison Video timing — ~34s at 30fps */

export const FPS_ROI = 30;
export const TRANSITION_ROI = 8; // ~0.27s fade overlap

export const SCENES_ROI = {
  hook: 90,        // 3s  — question + stat pills
  comparison: 300, // 10s — head-to-head table
  funnel: 300,     // 10s — dual funnel waterfall
  delta: 180,      // 6s  — big revenue delta
  cta: 150,        // 5s  — personalized CTA
} as const;

/** Calculate total frames accounting for transitions */
const clipTotal = (scenes: Record<string, number>) => {
  const values = Object.values(scenes);
  return values.reduce((a, b) => a + b, 0) - (values.length - 1) * TRANSITION_ROI;
};

export const ROI_TOTAL_FRAMES = clipTotal(SCENES_ROI);
