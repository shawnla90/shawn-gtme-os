import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { SceneWrapper } from '../components/SceneWrapper';
import { GraphNode } from '../components/GraphNode';
import { TypewriterText } from '../components/TypewriterText';
import { COLORS } from '../lib/tokens';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { useScale } from '../lib/useScale';

/**
 * Scene 1: Genesis — 135f / 4.5s
 *
 * Dark canvas, single glowing core node fades in with Nio's pixel avatar.
 * Label "Nio" typewriter-reveals below.
 * Node pulses softly, subtle particle field behind.
 */
export const NioGenesis: React.FC = () => {
  const frame = useCurrentFrame();
  const { s, sv } = useScale();

  // Fade in the whole scene over first 30 frames
  const sceneOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper
      accentColor={COLORS.nioBlue}
      particleCount={20}
      scanlineOpacity={0.02}
    >
      {/* Boot beep at frame 15 */}
      <Sequence from={15} durationInFrames={30}>
        <Audio src={AUDIO.bootBeep} volume={VOLUMES.bootBeep} />
      </Sequence>

      <AbsoluteFill
        style={{
          opacity: sceneOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Core Nio node */}
        <GraphNode
          label=""
          color={COLORS.nioBlue}
          x={540}
          y={600}
          radius={50}
          appearFrame={10}
          avatar="nio-tier-2-static.png"
          pulse
        />

        {/* "Nio" typewriter label below core node */}
        <div
          style={{
            position: 'absolute',
            top: sv(700),
            textAlign: 'center',
            width: '100%',
          }}
        >
          <TypewriterText
            text="Nio"
            startFrame={40}
            speed={0.15}
            fontSize={s(36)}
            color={COLORS.textPrimary}
            cursorColor={COLORS.nioBlue}
          />
        </div>

        {/* Subtle tagline */}
        <div
          style={{
            position: 'absolute',
            top: sv(755),
            textAlign: 'center',
            width: '100%',
            opacity: interpolate(frame, [80, 100], [0, 0.6], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            fontSize: s(14),
            color: COLORS.textSecondary,
          }}
        >
          knowledge graph initializing...
        </div>
      </AbsoluteFill>
    </SceneWrapper>
  );
};
