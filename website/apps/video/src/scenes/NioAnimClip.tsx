import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../lib/tokens';
import { NioSpriteSheet } from '../components/NioSpriteSheet';
import { NioEvolution } from '../components/NioEvolution';
import type { AnimationCue, NioAnimationName } from '../lib/nio-animation-state';

interface NioAnimClipProps {
  tier?: 1 | 2 | 3 | 4 | 5;
  animation?: NioAnimationName;
  size?: number;
}

interface NioEvolveClipProps {
  tierFrom?: 1 | 2 | 3 | 4;
  tierTo?: 2 | 3 | 4 | 5;
  size?: number;
}

/**
 * NioAnimClip — standalone short composition for a single animation.
 * Renders on transparent background (canvas bg optional for preview).
 * Each animation auto-starts at frame 0 and loops for the clip duration.
 */
export const NioAnimClip: React.FC<NioAnimClipProps> = ({
  tier = 1,
  animation = 'idle',
  size = 256,
}) => {
  const cues: AnimationCue[] = [
    { animation, startFrame: 0, loop: true },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <NioSpriteSheet
        tier={tier}
        size={size}
        animationCues={cues}
      />
    </AbsoluteFill>
  );
};

/**
 * NioEvolveClip — standalone evolution sequence.
 * Triggers at frame 15 (small idle lead-in).
 */
export const NioEvolveClip: React.FC<NioEvolveClipProps> = ({
  tierFrom = 1,
  tierTo = 2,
  size = 256,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <NioEvolution
        tierFrom={tierFrom}
        tierTo={tierTo}
        triggerFrame={15}
        size={size}
        accentColor={COLORS.green}
      />
    </AbsoluteFill>
  );
};

/** Animation durations in frames at 30fps for composition registration */
export const ANIM_CLIP_FRAMES: Record<NioAnimationName, number> = {
  idle: 60,        // 2s loop
  blink: 24,       // 0.8s one-shot
  think: 48,       // 1.6s one-shot
  chat: 36,        // 1.2s one-shot
  backflip: 36,    // 1.2s one-shot
  evolve_out: 30,  // 1s one-shot
  evolve_in: 30,   // 1s one-shot
};

/** Evolution clip duration: idle lead-in + evolve_out + flash + evolve_in + idle tail */
export const EVOLVE_CLIP_FRAMES = 90; // 3s

/** All 5 tiers */
export const ALL_TIERS = [1, 2, 3, 4, 5] as const;

/** Animations suitable for standalone clips (exclude evolve_out/in, they use EvolveClip) */
export const STANDALONE_ANIMS: NioAnimationName[] = ['idle', 'blink', 'think', 'chat', 'backflip'];

/** Evolution pairs */
export const EVOLVE_PAIRS: Array<{ from: 1 | 2 | 3 | 4; to: 2 | 3 | 4 | 5 }> = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
];
