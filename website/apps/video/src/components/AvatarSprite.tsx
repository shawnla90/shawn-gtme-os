import type { CSSProperties } from 'react';
import { useCurrentFrame, spring, useVideoConfig, Img } from 'remotion';

interface AvatarSpriteProps {
  src: string;
  size?: number;
  startFrame?: number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
}

/**
 * Renders an avatar image with a spring scale-in entrance.
 * Uses Remotion's <Img> for deterministic loading.
 */
export const AvatarSprite: React.FC<AvatarSpriteProps> = ({
  src,
  size = 192,
  startFrame = 0,
  springConfig = { damping: 12, stiffness: 180 },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: springConfig.damping ?? 12,
      stiffness: springConfig.stiffness ?? 180,
      mass: springConfig.mass ?? 1,
    },
  });

  const containerStyle: CSSProperties = {
    width: size,
    height: size,
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    imageRendering: 'pixelated',
  };

  return (
    <div style={containerStyle}>
      <Img src={src} style={imgStyle} />
    </div>
  );
};
