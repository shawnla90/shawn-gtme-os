import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { COLORS, SITE_ACCENTS } from './lib/tokens';
import { SCENES_V2, TRANSITION_DURATION } from './lib/timing-v2';
import { AUDIO, VOLUMES } from './lib/sounds';
import {
  GTM_OS_MONTAGE,
  GTM_OS_TOTAL,
  GTM_OS_CONCEPTS,
  GTM_OS_REVEAL,
} from './lib/data';

import { SiteHook } from './scenes/SiteHook';
import { SiteBootBlitz } from './scenes/SiteBootBlitz';
import { SiteShowcase } from './scenes/SiteShowcase';
import { SiteCta } from './scenes/SiteCta';

const ACCENT = SITE_ACCENTS.gtmos; // teal

const BLITZ_COLORS = [
  COLORS.teal,   // Clay Wiki
  COLORS.green,  // Email Infrastructure
  COLORS.amber,  // GTM Playbooks
  COLORS.purple, // MCP Servers
  COLORS.teal,   // Engineering
];

const REVEAL_STATS = [
  ...GTM_OS_REVEAL,
  { value: `${Math.floor(GTM_OS_TOTAL / 10) * 10}+`, label: 'total guides' },
] as const;

/**
 * theGTMOS.ai Highlight Video — 10.3s, 4 scenes, audio, transitions.
 * Same timing as Lead Magnet V3.
 */
export const GtmOsVideo: React.FC = () => {
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
            totalEntries={GTM_OS_TOTAL}
            subtitle="free GTM guides, plays & terms"
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
            montage={GTM_OS_MONTAGE}
            bootCommand="$ ./boot thegtmos.ai"
            terminalTitle="thegtmos.ai"
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
            concepts={GTM_OS_CONCEPTS}
            revealStats={REVEAL_STATS}
            holdText="The complete GTM stack. One system."
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Scene 4: CTA + Network */}
        <TransitionSeries.Sequence durationInFrames={SCENES_V2.ctaNetwork.durationFrames}>
          <SiteCta
            ctaUrl="thegtmos.ai"
            subtitle="Free. Open. Built for operators."
            accentColor={ACCENT}
            stats={[
              { value: `${Math.floor(GTM_OS_TOTAL / 10) * 10}+`, label: 'guides' },
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
