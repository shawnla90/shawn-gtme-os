import React from 'react';
import { useCurrentFrame, useVideoConfig, Sequence, staticFile, spring } from 'remotion';
import { useReelScale } from '../lib/useReelScale';
import { EvolutionFlash } from './EvolutionFlash';
import { getAnimFrameCount, spriteFrameToRemotionFrames } from '../lib/nio-animation-state';
import { NioSpriteSheet } from './NioSpriteSheet';
import { COLORS } from '../lib/tokens';

interface NioEvolutionProps {
  tierFrom: 1 | 2 | 3 | 4;
  tierTo: 2 | 3 | 4 | 5;
  /** Frame when the evolution trigger fires */
  triggerFrame?: number;
  size?: number;
  x?: number;
  y?: number;
  accentColor?: string;
}

/**
 * Nio evolution sequence: idle old tier → evolve_out → flash → evolve_in → idle new tier.
 * Composes NioSpriteSheet + EvolutionFlash for a full tier-up animation.
 */
export const NioEvolution: React.FC<NioEvolutionProps> = ({
  tierFrom,
  tierTo,
  triggerFrame = 30,
  size = 200,
  x,
  y,
  accentColor = COLORS.green,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useReelScale();

  // Calculate durations in Remotion frames
  const evolveOutSpriteFrames = getAnimFrameCount('evolve_out');
  const evolveInSpriteFrames = getAnimFrameCount('evolve_in');
  const framesPerEvolveOut = spriteFrameToRemotionFrames('evolve_out', fps);
  const framesPerEvolveIn = spriteFrameToRemotionFrames('evolve_in', fps);
  const evolveOutDuration = evolveOutSpriteFrames * framesPerEvolveOut;
  const evolveInDuration = evolveInSpriteFrames * framesPerEvolveIn;

  // The flash happens at the midpoint (where evolve_out ends / evolve_in begins)
  const flashFrame = triggerFrame + evolveOutDuration;
  const evolveInStart = flashFrame;
  const newTierIdleStart = evolveInStart + evolveInDuration;

  const isBeforeTrigger = frame < triggerFrame;
  const isEvolving = frame >= triggerFrame && frame < newTierIdleStart;
  const isNewTier = frame >= newTierIdleStart;

  const posStyle: React.CSSProperties =
    x !== undefined && y !== undefined
      ? { position: 'absolute' as const, left: s(x), top: sv(y) }
      : { position: 'relative' as const };

  return (
    <div style={posStyle}>
      {/* Phase 1: Idle old tier before trigger */}
      {isBeforeTrigger && (
        <NioSpriteSheet
          tier={tierFrom}
          size={size}
          animationCues={[{ animation: 'idle', startFrame: 0, loop: true }]}
        />
      )}

      {/* Phase 2: Evolve out (old tier brightening) */}
      {isEvolving && frame < flashFrame && (
        <NioSpriteSheet
          tier={tierFrom}
          size={size}
          animationCues={[
            { animation: 'evolve_out', startFrame: triggerFrame, loop: false },
          ]}
        />
      )}

      {/* Phase 3: Evolve in (new tier emerging) */}
      {isEvolving && frame >= flashFrame && (
        <NioSpriteSheet
          tier={tierTo}
          size={size}
          animationCues={[
            { animation: 'evolve_in', startFrame: evolveInStart, loop: false },
          ]}
        />
      )}

      {/* Phase 4: Idle new tier after completion */}
      {isNewTier && (
        <NioSpriteSheet
          tier={tierTo}
          size={size}
          animationCues={[
            { animation: 'idle', startFrame: newTierIdleStart, loop: true },
          ]}
        />
      )}

      {/* EvolutionFlash overlay timed to the white-flash midpoint */}
      <EvolutionFlash flashFrame={flashFrame} accentColor={accentColor} />
    </div>
  );
};
