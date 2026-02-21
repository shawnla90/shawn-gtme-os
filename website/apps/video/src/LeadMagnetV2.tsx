import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { COLORS, FONTS } from './lib/tokens';
import { AUDIO, VOLUMES } from './lib/sounds';

import { HookV2 } from './scenes/HookV2';
import { BootWikiBlitz } from './scenes/BootWikiBlitz';
import { ProgressionV2 } from './scenes/ProgressionV2';
import { ToolPlatformBlitz } from './scenes/ToolPlatformBlitz';
import { CtaNetwork } from './scenes/CtaNetwork';

/**
 * V4 Lead Magnet — ~8.2 seconds, 5 scenes, audio, transitions.
 * Compressed from V3 (10.3s) with new platform + tool blitz scene.
 *
 * Scene 1 (Hook):            28f  — stat punch
 *   ↓ fade 8f
 * Scene 2 (Boot+Wiki):       80f  — fast boot + wiki cards
 *   ↓ wipe 8f
 * Scene 3 (Progression):     58f  — class montage + flash + quick reveal
 *   ↓ fade 8f
 * Scene 4 (Tool+Platform):   54f  — 9-item blitz (6f each)
 *   ↓ wipe 8f
 * Scene 5 (CTA+Network):     58f  — network + CTA
 *
 * Total: 28 + 80 + 58 + 54 + 58 - 4×8 = 246 frames = 8.2s
 */

const TRANSITION = 8;

const SCENES = {
  hook: 28,
  bootWiki: 80,
  progression: 58,
  toolBlitz: 54,
  cta: 58,
} as const;

export const SHAWNOS_TOTAL_FRAMES =
  SCENES.hook + SCENES.bootWiki + SCENES.progression +
  SCENES.toolBlitz + SCENES.cta - 4 * TRANSITION; // 246

export const LeadMagnetV2: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: FONTS.mono,
      }}
    >
      <BgmLayer />

      <TransitionSeries>
        {/* Scene 1: Hook */}
        <TransitionSeries.Sequence durationInFrames={SCENES.hook}>
          <HookV2 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 2: Boot + Wiki Blitz */}
        <TransitionSeries.Sequence durationInFrames={SCENES.bootWiki}>
          <BootWikiBlitz />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 3: Progression */}
        <TransitionSeries.Sequence durationInFrames={SCENES.progression}>
          <ProgressionV2 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 4: Platform + Tool Blitz */}
        <TransitionSeries.Sequence durationInFrames={SCENES.toolBlitz}>
          <ToolPlatformBlitz />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 5: CTA + Network */}
        <TransitionSeries.Sequence durationInFrames={SCENES.cta}>
          <CtaNetwork />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const BgmLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const total = SHAWNOS_TOTAL_FRAMES;

  const volume = interpolate(
    frame,
    [0, 8, total - 10, total],
    [0, VOLUMES.bgm, VOLUMES.bgm, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <Sequence from={0} durationInFrames={total}>
      <Audio src={AUDIO.bgmLoop} volume={volume} />
    </Sequence>
  );
};
