import React from 'react';
import { Img, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from 'remotion';
import { useReelScale } from '../lib/useReelScale';
import { NioSpriteSheet } from './NioSpriteSheet';
import type { AnimationCue } from '../lib/nio-animation-state';

type Reaction = 'idle' | 'alert' | 'alarm' | 'celebrate' | 'action';

interface NioSpriteProps {
  tier?: 1 | 2 | 3 | 4 | 5;
  size?: number;
  reaction?: Reaction;
  reactionFrame?: number;
  /** Override position — otherwise centered */
  x?: number;
  y?: number;
  /** Entrance delay in frames */
  enterDelay?: number;
  /** When true, delegates to NioSpriteSheet for frame-based animation */
  spriteSheet?: boolean;
  /** Animation cues for sprite sheet mode */
  animationCues?: AnimationCue[];
}

const SPRITE_MAP: Record<number, string> = {
  1: 'avatars/tier-1-static-256.png',
  2: 'avatars/tier-2-static-256.png',
  3: 'avatars/tier-3-static-256.png',
};

/**
 * Reusable Nio sprite with idle bob, spring entrance, and reaction triggers.
 *
 * Two modes:
 * - Default (spriteSheet=false): static PNGs with CSS reactions (backward compat)
 * - Sprite sheet (spriteSheet=true): delegates to NioSpriteSheet for frame-based animation
 */
export const NioSprite: React.FC<NioSpriteProps> = ({
  tier = 1,
  size = 200,
  reaction = 'idle',
  reactionFrame = 0,
  x,
  y,
  enterDelay = 0,
  spriteSheet = false,
  animationCues,
}) => {
  // Sprite sheet mode — delegate entirely
  if (spriteSheet) {
    return (
      <NioSpriteSheet
        tier={tier as 1 | 2 | 3 | 4 | 5}
        size={size}
        animationCues={animationCues}
        x={x}
        y={y}
        enterDelay={enterDelay}
      />
    );
  }

  // Original CSS-reaction mode below
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

  // Idle bob — gentle sine wave
  const bobY = Math.sin(frame * 0.1) * sv(5);

  // Reaction effects
  let reactionScale = 1;
  let reactionRotate = 0;
  let glowColor = 'transparent';
  let glowOpacity = 0;

  if (reaction !== 'idle' && frame >= reactionFrame) {
    const rf = frame - reactionFrame;

    switch (reaction) {
      case 'alert':
        // Quick pulse
        reactionScale = 1 + Math.sin(rf * 0.3) * 0.08;
        glowColor = '#F59E0B';
        glowOpacity = 0.3 + Math.sin(rf * 0.3) * 0.15;
        break;
      case 'alarm':
        // Rapid shake + red glow
        reactionScale = 1 + Math.sin(rf * 0.5) * 0.12;
        reactionRotate = Math.sin(rf * 0.8) * 5;
        glowColor = '#E05555';
        glowOpacity = 0.4 + Math.sin(rf * 0.5) * 0.2;
        break;
      case 'celebrate':
        // Big bounce + green glow
        reactionScale = 1 + Math.max(0, Math.sin(rf * 0.2)) * 0.15;
        glowColor = '#4EC373';
        glowOpacity = interpolate(rf, [0, 10, 40], [0.6, 0.4, 0.2], {
          extrapolateRight: 'clamp',
        });
        break;
      case 'action':
        // Lean forward
        reactionScale = 1.05;
        reactionRotate = -3;
        glowColor = '#6B8AFF';
        glowOpacity = 0.3;
        break;
    }
  }

  const posStyle: React.CSSProperties = x !== undefined && y !== undefined
    ? { position: 'absolute' as const, left: s(x), top: sv(y) }
    : { position: 'relative' as const };

  return (
    <div style={posStyle}>
      {/* Glow ring behind sprite */}
      {glowOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: spriteSize * 1.6,
            height: spriteSize * 1.6,
            marginLeft: -(spriteSize * 1.6) / 2,
            marginTop: -(spriteSize * 1.6) / 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${glowColor}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Sprite image */}
      <div
        style={{
          width: spriteSize,
          height: spriteSize,
          transform: `scale(${enterScale * reactionScale}) translateY(${bobY}px) rotate(${reactionRotate}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <Img
          src={staticFile(SPRITE_MAP[tier] ?? SPRITE_MAP[1])}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </div>
  );
};
