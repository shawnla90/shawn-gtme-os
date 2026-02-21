import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';

interface ScanlineOverlayProps {
  opacity?: number;
  lineSpacing?: number;
  speed?: number;
}

/**
 * CRT-style scanline overlay that scrolls slowly downward.
 * Renders a repeating transparent/semi-opaque stripe pattern.
 */
export const ScanlineOverlay: React.FC<ScanlineOverlayProps> = ({
  opacity = 0.06,
  lineSpacing = 4,
  speed = 0.5,
}) => {
  const frame = useCurrentFrame();

  const offset = (frame * speed) % (lineSpacing * 2);

  const style: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    opacity,
    backgroundImage: `repeating-linear-gradient(
      0deg,
      transparent,
      transparent ${lineSpacing}px,
      rgba(0,0,0,0.4) ${lineSpacing}px,
      rgba(0,0,0,0.4) ${lineSpacing * 2}px
    )`,
    backgroundPositionY: offset,
    zIndex: 100,
  };

  return <div style={style} />;
};
