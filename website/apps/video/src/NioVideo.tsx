import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { COLORS } from './lib/tokens';
import { AUDIO, VOLUMES } from './lib/sounds';
import { SCENES_NIO, TRANSITION_NIO, NIO_TOTAL_FRAMES } from './lib/timing-nio';

import { NioGenesis } from './scenes/NioGenesis';
import { NioKnowledgeGraph } from './scenes/NioKnowledgeGraph';
import { NioGraphComplete } from './scenes/NioGraphComplete';
import { NioChatReveal } from './scenes/NioChatReveal';
import { NioCta } from './scenes/NioCta';

/**
 * NioVideo — ~43.7s knowledge graph construction + chat reveal.
 *
 * Scene 1 (Genesis):          135f / 4.5s  — core node fade-in
 *   ↓ fade 10f
 * Scene 2 (Knowledge Graph):  570f / 19s   — 16 nodes, 18 edges, counter
 *   ↓ fade 10f
 * Scene 3 (Graph Complete):   105f / 3.5s  — energy pulse + flash
 *   ↓ fade 10f
 * Scene 4 (Chat Reveal):      420f / 14s   — chat window + 2 exchanges
 *   ↓ fade 10f
 * Scene 5 (CTA):              120f / 4s    — "Meet Nio" + fade out
 *
 * Total: 1350 - 4×10 = 1310 frames
 */
export const NioVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: 'JetBrains Mono, ui-monospace, Cascadia Code, Fira Code, monospace',
      }}
    >
      <BgmLayer />

      <TransitionSeries>
        {/* Scene 1: Genesis */}
        <TransitionSeries.Sequence durationInFrames={SCENES_NIO.genesis}>
          <NioGenesis />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_NIO })}
        />

        {/* Scene 2: Knowledge Graph Construction */}
        <TransitionSeries.Sequence durationInFrames={SCENES_NIO.knowledgeGraph}>
          <NioKnowledgeGraph />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_NIO })}
        />

        {/* Scene 3: Graph Complete + Flash */}
        <TransitionSeries.Sequence durationInFrames={SCENES_NIO.graphComplete}>
          <NioGraphComplete />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_NIO })}
        />

        {/* Scene 4: Chat Reveal */}
        <TransitionSeries.Sequence durationInFrames={SCENES_NIO.chatReveal}>
          <NioChatReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_NIO })}
        />

        {/* Scene 5: CTA */}
        <TransitionSeries.Sequence durationInFrames={SCENES_NIO.cta}>
          <NioCta />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const BgmLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const total = NIO_TOTAL_FRAMES;

  const volume = interpolate(
    frame,
    [0, 15, total - 20, total],
    [0, VOLUMES.bgm, VOLUMES.bgm, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <Sequence from={0} durationInFrames={total}>
      <Audio src={AUDIO.bgmLoop} volume={volume} />
    </Sequence>
  );
};
