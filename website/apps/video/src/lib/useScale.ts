import { useVideoConfig } from 'remotion';

/**
 * Responsive scaling hook.
 * Base design: 1080×1350 (LinkedIn 4:5).
 *
 * Returns:
 *  - s(px): scale horizontally relative to 1080w base
 *  - sv(px): scale vertically relative to 1350h base
 *
 * LinkedIn/Reels (1080w): s() = 1.0x
 * Landscape (1920w): s() = ~1.78x
 */
export const useScale = () => {
  const { width, height } = useVideoConfig();

  const scaleX = width / 1080;
  const scaleY = height / 1350;

  /** Scale a horizontal / general pixel value */
  const s = (px: number) => Math.round(px * scaleX);

  /** Scale a vertical pixel value */
  const sv = (px: number) => Math.round(px * scaleY);

  return { s, sv, scaleX, scaleY };
};
