import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { COLORS, SITE_ACCENTS } from './lib/tokens';
import { AUDIO, VOLUMES } from './lib/sounds';
import {
  GTM_OS_MONTAGE,
  GTM_OS_TOTAL,
  GTM_OS_CONCEPTS,
  GTM_OS_REVEAL,
  GTM_OS_BLITZ,
} from './lib/data';

import { SiteHook } from './scenes/SiteHook';
import { SiteBootBlitz } from './scenes/SiteBootBlitz';
import { SiteShowcase } from './scenes/SiteShowcase';
import { ToolPlatformBlitz } from './scenes/ToolPlatformBlitz';
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
 * theGTMOS.ai Highlight Video — ~8.2s, 5 scenes, audio, transitions.
 *
 * Scene 1 (Hook):            28f  — stat punch
 *   ↓ fade 8f
 * Scene 2 (Boot+Blitz):     80f  — fast boot + wiki cards
 *   ↓ wipe 8f
 * Scene 3 (Showcase):       58f  — tool concept montage + flash + stats
 *   ↓ fade 8f
 * Scene 4 (Tool Blitz):     54f  — rapid-fire GTM tools + MCP servers
 *   ↓ wipe 8f
 * Scene 5 (CTA):            58f  — network + CTA
 *
 * Total: 28 + 80 + 58 + 54 + 58 - 4×8 = 246 frames = 8.2s
 */

const TRANSITION = 8;

const SCENES = {
  hook: 28,
  bootBlitz: 80,
  showcase: 58,
  toolBlitz: 54,
  cta: 58,
} as const;

export const GTM_OS_TOTAL_FRAMES =
  SCENES.hook + SCENES.bootBlitz + SCENES.showcase +
  SCENES.toolBlitz + SCENES.cta - 4 * TRANSITION; // 246

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
        <TransitionSeries.Sequence durationInFrames={SCENES.hook}>
          <SiteHook
            totalEntries={GTM_OS_TOTAL}
            subtitle="free GTM guides, plays & terms"
            accentColor={ACCENT}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 2: Boot + Blitz */}
        <TransitionSeries.Sequence durationInFrames={SCENES.bootBlitz}>
          <SiteBootBlitz
            montage={GTM_OS_MONTAGE}
            bootCommand="$ ./boot thegtmos.ai"
            terminalTitle="thegtmos.ai"
            accentColor={ACCENT}
            accentColors={BLITZ_COLORS}
            bootEnd={14}
            framesPerWiki={12}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 3: Showcase — tool concepts */}
        <TransitionSeries.Sequence durationInFrames={SCENES.showcase}>
          <SiteShowcase
            concepts={GTM_OS_CONCEPTS}
            revealStats={REVEAL_STATS}
            holdText="The complete GTM stack. One system."
            framesPerConcept={8}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 4: Tool + MCP Blitz */}
        <TransitionSeries.Sequence durationInFrames={SCENES.toolBlitz}>
          <ToolPlatformBlitz
            items={GTM_OS_BLITZ}
            framesPerItem={6}
            labelGroups={{ first: 'tools', second: 'MCP', divider: 5 }}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 5: CTA + Network */}
        <TransitionSeries.Sequence durationInFrames={SCENES.cta}>
          <SiteCta
            ctaUrl="thegtmos.ai"
            subtitle="Free. Open. Built for operators."
            accentColor={ACCENT}
            stats={[
              { value: `${Math.floor(GTM_OS_TOTAL / 10) * 10}+`, label: 'guides' },
              { value: '100%', label: 'free' },
              { value: 'Updated', label: 'daily' },
            ]}
            statsStart={18}
            ctaStart={28}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const BgmLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const total = GTM_OS_TOTAL_FRAMES;

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
