import { useVideoConfig } from 'remotion';

/**
 * Responsive scaling hook for reel clips.
 * Base design: 1080×960 (bottom half of 9:16 TikTok).
 *
 * Uses the same pattern as useScale but with 960h base
 * instead of 1350h, avoiding 29% vertical compression.
 */
export const useReelScale = () => {
  const { width, height } = useVideoConfig();

  const scaleX = width / 1080;
  const scaleY = height / 960;

  const s = (px: number) => Math.round(px * scaleX);
  const sv = (px: number) => Math.round(px * scaleY);

  return { s, sv, scaleX, scaleY };
};
