/** TikTok Slideshow timing constants — ~16s at 30fps */

export const FPS_TT = 30;

export const TRANSITION_TT = 8; // ~0.27s swipe transition

/** Frames per slide — 3s each */
export const FRAMES_PER_SLIDE = 3 * FPS_TT; // 90

/** Max slides in a slideshow */
export const MAX_SLIDES = 5;

/** Total frames: 5 slides × 90 frames - 4 transitions × 8 frames = 418 */
export const TT_TOTAL_FRAMES = MAX_SLIDES * FRAMES_PER_SLIDE - (MAX_SLIDES - 1) * TRANSITION_TT;
