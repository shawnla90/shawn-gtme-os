/** Anti-Slop Reel timing — ~15.5s at 30fps */

export const FPS_SLOP = 30;

export const SCENES_SLOP = {
  textPaste:   135,  // 4.5s — hook text + typewriter paste
  slopScan:    135,  // 4.5s — violations highlight sequentially
  scoreReveal: 105,  // 3.5s — score counter 0→100 + badge
  cleanFlip:   120,  // 4s  — clean text + CTA
} as const;

export const TRANSITION_SLOP = 10; // ~0.33s overlap between scenes

const vals = Object.values(SCENES_SLOP);
export const SLOP_TOTAL_FRAMES =
  vals.reduce((a, b) => a + b, 0) - (vals.length - 1) * TRANSITION_SLOP;
// 135 + 135 + 105 + 120 - 30 = 465 frames ≈ 15.5s

/* ── 60-second version (7 scenes) ── */

export const SCENES_SLOP_60 = {
  npcHook:             120,  // 4s  — "your AI makes you sound like an NPC"
  textPaste:           200,  // 6.7s — sloppy LinkedIn post typewriters in
  slopScan:            340,  // 11.3s — violations highlight sequentially
  scoreReveal:         170,  // 5.7s — score 0→100, "MAXIMUM SLOP", "NPC DETECTED"
  violationBreakdown:  300,  // 10s — 4 violation types with before/after examples
  cleanFlip:           200,  // 6.7s — clean text scores 0
  cta:                 170,  // 5.7s — "don't sound like an NPC" + check Content OS
} as const;

export const TRANSITION_SLOP_60 = 10;

const vals60 = Object.values(SCENES_SLOP_60);
export const SLOP_60_TOTAL_FRAMES =
  vals60.reduce((a, b) => a + b, 0) - (vals60.length - 1) * TRANSITION_SLOP_60;
// 120+200+340+170+300+200+170 - 60 = 1440 frames = 48s
