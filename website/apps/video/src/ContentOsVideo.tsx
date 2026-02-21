import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { COLORS, SITE_ACCENTS } from './lib/tokens';
import { SCENES_V2, TRANSITION_DURATION } from './lib/timing-v2';
import { AUDIO, VOLUMES } from './lib/sounds';
import {
  CONTENT_OS_MONTAGE,
  CONTENT_OS_TOTAL,
  CONTENT_OS_PLATFORMS,
  CONTENT_OS_REVEAL,
} from './lib/data';

import { SiteHook } from './scenes/SiteHook';
import { SiteBootBlitz } from './scenes/SiteBootBlitz';
import { SiteShowcase } from './scenes/SiteShowcase';
import { SiteCta } from './scenes/SiteCta';

const ACCENT = SITE_ACCENTS.contentos; // purple

const BLITZ_COLORS = [
  COLORS.purple, // Platform Playbooks
  COLORS.amber,  // Voice & Anti-Slop
  COLORS.green,  // Content Workflows
  COLORS.teal,   // Content Tools
  COLORS.purple, // How-To Guides
];

const REVEAL_STATS = [
  ...CONTENT_OS_REVEAL,
  { value: `${Math.floor(CONTENT_OS_TOTAL / 10) * 10}+`, label: 'total guides' },
] as const;

/**
 * theContentOS.ai Highlight Video — 10.3s, 4 scenes, audio, transitions.
 * Same timing as Lead Magnet V3.
 */
export const ContentOsVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: 'JetBrains Mono, ui-monospace, Cascadia Code, Fira Code, monospace',
      }}
    >
      <BgmLayer />

      <TransitionSeries>
        {/* Scene 1: Hook */}
        <TransitionSeries.Sequence durationInFrames={SCENES_V2.hook.durationFrames}>
          <SiteHook
            totalEntries={CONTENT_OS_TOTAL}
            subtitle="free playbooks, guides & how-tos"
            accentColor={ACCENT}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 2: Boot + Blitz */}
        <TransitionSeries.Sequence durationInFrames={SCENES_V2.bootWikiBlitz.durationFrames}>
          <SiteBootBlitz
            montage={CONTENT_OS_MONTAGE}
            bootCommand="$ ./boot thecontentos.ai"
            terminalTitle="thecontentos.ai"
            accentColor={ACCENT}
            accentColors={BLITZ_COLORS}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 3: Showcase */}
        <TransitionSeries.Sequence durationInFrames={SCENES_V2.progression.durationFrames}>
          <SiteShowcase
            concepts={CONTENT_OS_PLATFORMS}
            revealStats={REVEAL_STATS}
            holdText="Every platform. One voice."
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 4: CTA + Network */}
        <TransitionSeries.Sequence durationInFrames={SCENES_V2.ctaNetwork.durationFrames}>
          <SiteCta
            ctaUrl="thecontentos.ai"
            subtitle="One voice. Every platform. Zero slop."
            accentColor={ACCENT}
            stats={[
              { value: `${Math.floor(CONTENT_OS_TOTAL / 10) * 10}+`, label: 'guides' },
              { value: '100%', label: 'free' },
              { value: 'Updated', label: 'daily' },
            ]}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const BgmLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, 10, 300, 310],
    [0, VOLUMES.bgm, VOLUMES.bgm, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return (
    <Sequence from={0} durationInFrames={310}>
      <Audio src={AUDIO.bgmLoop} volume={volume} />
    </Sequence>
  );
};
