import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { FPS } from '../lib/timing';
import { WIKI_MONTAGE } from '../lib/data';
import { WikiCard } from '../components/WikiCard';
import { AnimatedCounter } from '../components/AnimatedCounter';

/** Accent colors cycling through the palette for visual variety */
const WIKI_ACCENTS = [
  COLORS.green,   // Clay Wiki
  COLORS.teal,    // Context Wiki
  COLORS.amber,   // How-To Wiki
  COLORS.purple,  // Content Wiki
  COLORS.green,   // GTM Knowledge
  COLORS.teal,    // Email Infrastructure
  COLORS.amber,   // Engineering Terms
];

const FRAMES_PER_WIKI = 73;

/**
 * Scene 3 — Wiki Montage (510 frames / 17s)
 * Show the sheer volume and depth. Each cut = "wait, there's MORE?"
 */
export const WikiMontage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wikiIndex = Math.min(
    Math.floor(frame / FRAMES_PER_WIKI),
    WIKI_MONTAGE.length - 1,
  );
  const localFrame = frame - wikiIndex * FRAMES_PER_WIKI;

  const wiki = WIKI_MONTAGE[wikiIndex];
  const accent = WIKI_ACCENTS[wikiIndex] ?? COLORS.green;

  // --- Per-wiki card animation ---
  // Slide in: frames 0-10 of local
  const slideInY = interpolate(localFrame, [0, 10], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideInOpacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out: frames 60-73 of local
  const fadeOutOpacity = interpolate(localFrame, [60, 73], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOutY = interpolate(localFrame, [60, 73], [0, -20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Combined opacity & translateY
  const cardOpacity = slideInOpacity * fadeOutOpacity;
  const cardTranslateY = slideInY + fadeOutY;

  // Highlight animation progress (0-1 across the visible window)
  const highlightProgress = interpolate(localFrame, [10, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Running counter (top-right) ---
  // Cumulative total up to and including current wiki
  const runningTotal = WIKI_MONTAGE.slice(0, wikiIndex + 1).reduce(
    (sum, w) => sum + w.count,
    0,
  );
  const prevTotal = WIKI_MONTAGE.slice(0, wikiIndex).reduce(
    (sum, w) => sum + w.count,
    0,
  );

  // Counter animates within local frames 5-40
  const counterValue = Math.round(
    interpolate(localFrame, [5, 40], [prevTotal, runningTotal], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  // Wiki index badge
  const indexLabel = `${wikiIndex + 1} / ${WIKI_MONTAGE.length}`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        fontFamily: FONTS.mono,
      }}
    >
      {/* Running counter — top right */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 4,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: COLORS.textMuted,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          total entries
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: COLORS.textPrimary,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {counterValue}
        </div>
        <div
          style={{
            fontSize: 13,
            color: COLORS.textMuted,
            marginTop: 4,
          }}
        >
          {indexLabel}
        </div>
      </div>

      {/* Wiki card — centered */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          transform: `translateY(${cardTranslateY}px)`,
          opacity: cardOpacity,
        }}
      >
        <WikiCard
          name={wiki.name}
          count={wiki.count}
          label={wiki.label}
          highlights={wiki.highlights}
          accentColor={accent}
          animationProgress={highlightProgress}
        />
      </div>
    </AbsoluteFill>
  );
};
