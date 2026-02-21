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
 * V2 Lead Magnet — 30 seconds, 4 scenes, audio, transitions.
 *
 * Scene 1 (Hook):           90f  — stat punch
 *   ↓ fade 15f
 * Scene 2 (Boot+Wiki):     350f  — terminal boot + wiki cards
 *   ↓ wipe 15f
 * Scene 3 (Progression):   250f  — RPG wow moment
 *   ↓ fade 15f
 * Scene 4 (CTA+Network):   255f  — network reveal + CTA
 *
 * Total: 90 + 350 + 250 + 255 - 3×15 = 900 frames = 30s
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
 * BGM loop is 10s, so it'll naturally loop ~3 times across 30s.
 */
const BgmLayer: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in over first 15 frames, fade out over last 15
  const volume = interpolate(
    frame,
    [0, 15, 885, 900],
    [0, VOLUMES.bgm, VOLUMES.bgm, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <>
      {/* First loop: 0-300 (10s) */}
      <Sequence from={0} durationInFrames={300}>
        <Audio src={AUDIO.bgmLoop} volume={volume} />
      </Sequence>
      {/* Second loop: 300-600 */}
      <Sequence from={300} durationInFrames={300}>
        <Audio src={AUDIO.bgmLoop} volume={volume} />
      </Sequence>
      {/* Third loop: 600-900 */}
      <Sequence from={600} durationInFrames={300}>
        <Audio src={AUDIO.bgmLoop} volume={volume} />
      </Sequence>
    </>
  );
};
