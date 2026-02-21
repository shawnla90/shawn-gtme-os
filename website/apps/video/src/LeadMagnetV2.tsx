import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { COLORS, FONTS } from './lib/tokens';
import { SCENES_V2, TRANSITION_DURATION } from './lib/timing-v2';
import { AUDIO, VOLUMES } from './lib/sounds';

import { HookV2 } from './scenes/HookV2';
import { BootWikiBlitz } from './scenes/BootWikiBlitz';
import { ProgressionV2 } from './scenes/ProgressionV2';
import { CtaNetwork } from './scenes/CtaNetwork';

/**
 * V3 Lead Magnet — 11 seconds, 4 scenes, audio, transitions.
 *
 * Scene 1 (Hook):            36f  — stat punch
 *   ↓ fade 10f
 * Scene 2 (Boot+Wiki):      130f  — terminal boot + wiki cards
 *   ↓ wipe 10f
 * Scene 3 (Progression):    100f  — class montage + sequential avatar reveal
 *   ↓ fade 10f
 * Scene 4 (CTA+Network):     94f  — network reveal + CTA
 *
 * Total: 36 + 130 + 100 + 94 - 3×10 = 330 frames = 11s
 */
export const LeadMagnetV2: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: FONTS.mono,
      }}
    >
      {/* BGM — loops across entire video, fades in/out */}
      <BgmLayer />

      {/* Scene transitions */}
      <TransitionSeries>
        {/* Scene 1: Hook */}
        <TransitionSeries.Sequence durationInFrames={SCENES_V2.hook.durationFrames}>
          <HookV2 />
        </TransitionSeries.Sequence>

        {/* Transition: Hook → Boot+Wiki (fade) */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 2: Boot + Wiki Blitz */}
        <TransitionSeries.Sequence durationInFrames={SCENES_V2.bootWikiBlitz.durationFrames}>
          <BootWikiBlitz />
        </TransitionSeries.Sequence>

        {/* Transition: Boot+Wiki → Progression (wipe) */}
        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 3: Progression */}
        <TransitionSeries.Sequence durationInFrames={SCENES_V2.progression.durationFrames}>
          <ProgressionV2 />
        </TransitionSeries.Sequence>

        {/* Transition: Progression → CTA (fade) */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 4: CTA + Network */}
        <TransitionSeries.Sequence durationInFrames={SCENES_V2.ctaNetwork.durationFrames}>
          <CtaNetwork />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

/**
 * Background music layer with fade in/out.
 * BGM loop is 10s. Video is ~10.3s so just one loop with fade.
 */
const BgmLayer: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in over first 10 frames, fade out over last 10
  const volume = interpolate(
    frame,
    [0, 10, 300, 310],
    [0, VOLUMES.bgm, VOLUMES.bgm, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <>
      {/* Single loop covers the full video */}
      <Sequence from={0} durationInFrames={310}>
        <Audio src={AUDIO.bgmLoop} volume={volume} />
      </Sequence>
    </>
  );
};
