/** Reel clip timing — 45s at 30fps = 1350 frames per clip */

export const FPS_REEL = 30;
export const REEL_DURATION_SEC = 45;
export const REEL_TOTAL_FRAMES = FPS_REEL * REEL_DURATION_SEC; // 1350
export const TRANSITION_REEL = 8; // ~0.27s overlap between internal scenes

/** Clip 1: API Costs — "draining your wallet" */
export const SCENES_REEL_1 = {
  intro: 180,     // 6s  — Nio idle + cost meter appears
  drain: 540,     // 18s — meter drains, Nio reacts at milestones
  maxReveal: 330, // 11s — white flash, MAX badge, celebration
  cta: 330,       // 11s — CTA + fade out
} as const;

/** Clip 2: Claude Code Wrong — "you're using it wrong" */
export const SCENES_REEL_2 = {
  terminal: 450,   // 15s — 5 commands typewriter
  evolution: 450,  // 15s — Spark→Blade evolution
  showcase: 450,   // 15s — Nio tier 2 + floating panels
} as const;

/** Clip 3: API Wrappers — "skip the middleman" */
export const SCENES_REEL_3 = {
  split: 600,   // 20s — wrapper vs direct comparison
  flex: 420,    // 14s — savings counter
  cta: 360,     // 12s — CTA + fade out
} as const;

/** Clip 4: MCP Servers — "9 servers, one CLI" */
export const SCENES_REEL_4 = {
  orbit: 660,    // 22s — 9 tool icons spring in
  conduct: 390,  // 13s — icons light up sequentially
  cta: 330,      // 11s — CTA + fade out
} as const;

/** Clip 5: Remotion Meta — "rendered from React code" */
export const SCENES_REEL_5 = {
  codeAppear: 480,  // 16s — JSX typewriters
  transform: 450,   // 15s — code → video transform
  micDrop: 450,     // 15s — celebration + self-referential
} as const;

/** Calculate total frames for a clip, accounting for transitions */
const clipTotal = (scenes: Record<string, number>) => {
  const values = Object.values(scenes);
  return values.reduce((a, b) => a + b, 0) - (values.length - 1) * TRANSITION_REEL;
};

export const REEL_1_TOTAL = clipTotal(SCENES_REEL_1);
export const REEL_2_TOTAL = clipTotal(SCENES_REEL_2);
export const REEL_3_TOTAL = clipTotal(SCENES_REEL_3);
export const REEL_4_TOTAL = clipTotal(SCENES_REEL_4);
export const REEL_5_TOTAL = clipTotal(SCENES_REEL_5);
