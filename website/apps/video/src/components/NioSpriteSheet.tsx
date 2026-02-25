import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, staticFile } from 'remotion';
import { useReelScale } from '../lib/useReelScale';
import {
  type AnimationCue,
  type NioAnimationName,
  resolveAnimation,
  getAnimFrameCount,
} from '../lib/nio-animation-state';

interface NioSpriteSheetProps {
  tier?: 1 | 2 | 3 | 4 | 5;
  size?: number;
  animationCues?: AnimationCue[];
  /** Override position — otherwise relative */
  x?: number;
  y?: number;
  /** Entrance delay in frames */
  enterDelay?: number;
}

/** Build the sprite sheet filename for a tier + animation */
function sheetFile(tier: number, anim: NioAnimationName): string {
  return `avatars/nio-tier-${tier}-${anim}-sheet-256.png`;
}

/**
 * Frame-based Nio sprite renderer using horizontal sprite sheets.
 * Loads a PNG strip and clips to the correct frame using overflow:hidden + marginLeft.
 * Spring entrance animation, pixelated rendering.
 */
export const NioSpriteSheet: React.FC<NioSpriteSheetProps> = ({
  tier = 1,
  size = 200,
  animationCues = [],
  x,
  y,
  enterDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useReelScale();

  const spriteSize = s(size);

  // Spring entrance
  const enterScale = spring({
    frame: Math.max(0, frame - enterDelay),
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Resolve which animation + sprite frame to show
  const resolved = resolveAnimation(animationCues, frame, fps);
  const totalFrames = getAnimFrameCount(resolved.animation);

  const posStyle: React.CSSProperties =
    x !== undefined && y !== undefined
      ? { position: 'absolute' as const, left: s(x), top: sv(y) }
      : { position: 'relative' as const };

  return (
    <div style={posStyle}>
      <div
        style={{
          width: spriteSize,
          height: spriteSize,
          transform: `scale(${enterScale})`,
          transformOrigin: 'bottom center',
          overflow: 'hidden',
        }}
      >
        <img
          src={staticFile(sheetFile(tier, resolved.animation))}
          style={{
            width: spriteSize * totalFrames,
            height: spriteSize,
            marginLeft: -(resolved.spriteFrame * spriteSize),
            imageRendering: 'pixelated',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};
