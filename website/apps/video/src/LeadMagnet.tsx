import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES } from './lib/timing';
import { COLORS, FONTS } from './lib/tokens';

import { Hook } from './scenes/Hook';
import { BootSequence } from './scenes/BootSequence';
import { WikiMontage } from './scenes/WikiMontage';
import { Progression } from './scenes/Progression';
import { NetworkReveal } from './scenes/NetworkReveal';
import { CTA } from './scenes/CTA';

/**
 * Main 60-second composition. Each scene is wrapped in a <Sequence>
 * that handles timing — scenes use useCurrentFrame() relative to
 * their own start (frame 0 = first frame of that scene).
 */
export const LeadMagnet: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: FONTS.mono,
      }}
    >
      {/* Scene 1 — Hook: scroll-stopping opener (0-3s) */}
      <Sequence
        from={SCENES.hook.startFrame}
        durationInFrames={SCENES.hook.durationFrames}
      >
        <Hook />
      </Sequence>

      {/* Scene 2 — Boot Sequence: terminal identity (3-8s) */}
      <Sequence
        from={SCENES.boot.startFrame}
        durationInFrames={SCENES.boot.durationFrames}
      >
        <BootSequence />
      </Sequence>

      {/* Scene 3 — Wiki Montage: 7 knowledge bases, fast cuts (8-25s) */}
      <Sequence
        from={SCENES.wikiMontage.startFrame}
        durationInFrames={SCENES.wikiMontage.durationFrames}
      >
        <WikiMontage />
      </Sequence>

      {/* Scene 4 — Progression: RPG system showcase (25-40s) */}
      <Sequence
        from={SCENES.progression.startFrame}
        durationInFrames={SCENES.progression.durationFrames}
      >
        <Progression />
      </Sequence>

      {/* Scene 5 — Network Reveal: 3-site system (40-52s) */}
      <Sequence
        from={SCENES.networkReveal.startFrame}
        durationInFrames={SCENES.networkReveal.durationFrames}
      >
        <NetworkReveal />
      </Sequence>

      {/* Scene 6 — CTA: shawnos.ai + cursor blink (52-60s) */}
      <Sequence
        from={SCENES.cta.startFrame}
        durationInFrames={SCENES.cta.durationFrames}
      >
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
