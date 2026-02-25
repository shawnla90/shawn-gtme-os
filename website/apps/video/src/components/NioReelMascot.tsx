import React from 'react';
import { useReelScale } from '../lib/useReelScale';
import { NioSpriteSheet } from './NioSpriteSheet';
import { NioEvolution } from './NioEvolution';
import type { AnimationCue } from '../lib/nio-animation-state';

type MascotPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center' | 'center-left';

interface NioReelMascotProps {
  tier?: 1 | 2 | 3 | 4 | 5;
  size?: number;
  position?: MascotPosition;
  animationCues?: AnimationCue[];
  enterDelay?: number;
  /** Evolution mode — renders NioEvolution instead of NioSpriteSheet */
  evolution?: {
    tierFrom: 1 | 2 | 3 | 4;
    tierTo: 2 | 3 | 4 | 5;
    triggerFrame: number;
    accentColor?: string;
  };
}

/**
 * NioReelMascot — positions animated Nio sprite in a reel scene.
 *
 * Drop-in for the old `<NioSprite>` CSS-reaction mode in reels.
 * Delegates to NioSpriteSheet (or NioEvolution) for frame-based animation.
 */
export const NioReelMascot: React.FC<NioReelMascotProps> = ({
  tier = 1,
  size = 140,
  position = 'bottom-right',
  animationCues,
  enterDelay = 0,
  evolution,
}) => {
  const { s, sv } = useReelScale();

  const posStyle = getPositionStyle(position, s, sv);

  if (evolution) {
    return (
      <div style={posStyle}>
        <NioEvolution
          tierFrom={evolution.tierFrom}
          tierTo={evolution.tierTo}
          triggerFrame={evolution.triggerFrame}
          size={size}
          accentColor={evolution.accentColor}
        />
      </div>
    );
  }

  return (
    <div style={posStyle}>
      <NioSpriteSheet
        tier={tier}
        size={size}
        animationCues={animationCues}
        enterDelay={enterDelay}
      />
    </div>
  );
};

function getPositionStyle(
  pos: MascotPosition,
  s: (v: number) => number,
  sv: (v: number) => number,
): React.CSSProperties {
  switch (pos) {
    case 'bottom-right':
      return { position: 'absolute', right: s(40), bottom: sv(30) };
    case 'bottom-left':
      return { position: 'absolute', left: s(40), bottom: sv(30) };
    case 'bottom-center':
      return { position: 'absolute', left: '50%', bottom: sv(30), transform: 'translateX(-50%)' };
    case 'center':
      return { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
    case 'center-left':
      return { position: 'absolute', left: s(200), top: '50%', transform: 'translateY(-50%)' };
  }
}
