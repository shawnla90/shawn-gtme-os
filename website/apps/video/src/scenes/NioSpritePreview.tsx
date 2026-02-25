import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../lib/tokens';
import { FONTS } from '../lib/tokens';
import { NioSpriteSheet } from '../components/NioSpriteSheet';
import { NioEvolution } from '../components/NioEvolution';
import type { AnimationCue } from '../lib/nio-animation-state';

/**
 * Preview composition: showcases all Nio sprite sheet animations.
 * Layout: 5 tiers across the top doing different anims, evolution sequence at bottom.
 *
 * Timeline (at 30fps):
 *   0–90:    All 5 tiers idle
 *   90–120:  Tier 1 blinks
 *   120–180: Tier 2 thinks
 *   180–240: Tier 3 chats
 *   240–300: Tier 4 backflips
 *   300–450: Evolution 1→2 at center
 */
export const NioSpritePreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const tierSize = 150;
  const spacing = width / 5;

  // Cues for each tier's demo
  const tier1Cues: AnimationCue[] = [
    { animation: 'idle', startFrame: 0, loop: true },
    { animation: 'blink', startFrame: 90, loop: false },
  ];

  const tier2Cues: AnimationCue[] = [
    { animation: 'idle', startFrame: 0, loop: true },
    { animation: 'think', startFrame: 120, loop: false },
  ];

  const tier3Cues: AnimationCue[] = [
    { animation: 'idle', startFrame: 0, loop: true },
    { animation: 'chat', startFrame: 180, loop: false },
  ];

  const tier4Cues: AnimationCue[] = [
    { animation: 'idle', startFrame: 0, loop: true },
    { animation: 'backflip', startFrame: 240, loop: false },
  ];

  const tier5Cues: AnimationCue[] = [
    { animation: 'idle', startFrame: 0, loop: true },
  ];

  const labelStyle: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 24,
          fontWeight: 700,
          color: COLORS.green,
          letterSpacing: 2,
        }}
      >
        NIO SPRITE ANIMATION PREVIEW
      </div>

      {/* Top row: 5 tiers with their animations */}
      {([
        { tier: 1 as const, cues: tier1Cues, label: 'T1: idle → blink' },
        { tier: 2 as const, cues: tier2Cues, label: 'T2: idle → think' },
        { tier: 3 as const, cues: tier3Cues, label: 'T3: idle → chat' },
        { tier: 4 as const, cues: tier4Cues, label: 'T4: idle → backflip' },
        { tier: 5 as const, cues: tier5Cues, label: 'T5: idle (ascended)' },
      ]).map(({ tier, cues, label }, i) => (
        <div
          key={tier}
          style={{
            position: 'absolute',
            left: spacing * i + (spacing - tierSize) / 2,
            top: 100,
            width: tierSize,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <NioSpriteSheet
            tier={tier}
            size={tierSize}
            animationCues={cues}
            enterDelay={i * 5}
          />
          <div style={labelStyle}>{label}</div>
        </div>
      ))}

      {/* Bottom: Evolution sequence */}
      {frame >= 300 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 450,
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ ...labelStyle, marginBottom: 10, fontSize: 16, color: COLORS.green }}>
            EVOLUTION: Tier 1 → Tier 2
          </div>
          <NioEvolution
            tierFrom={1}
            tierTo={2}
            triggerFrame={330}
            size={200}
            accentColor={COLORS.green}
          />
        </div>
      )}

      {/* Frame counter */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          color: COLORS.textMuted,
        }}
      >
        frame {frame}
      </div>
    </AbsoluteFill>
  );
};
