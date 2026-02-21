import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  Sequence,
} from 'remotion';
import { COLORS } from '../lib/tokens';
import { AUDIO, VOLUMES } from '../lib/sounds';

import { TypewriterText } from '../components/TypewriterText';
import { WikiCard } from '../components/WikiCard';
import { SceneWrapper } from '../components/SceneWrapper';
import { useScale } from '../lib/useScale';

interface MontageItem {
  name: string;
  count: number;
  label: string;
  highlights: string[];
}

interface SiteBootBlitzProps {
  montage: MontageItem[];
  bootCommand: string;
  terminalTitle: string;
  accentColor?: string;
  accentColors?: string[];
  bootEnd?: number;
  framesPerWiki?: number;
}

/**
 * Generic Boot + Blitz scene.
 * Terminal boot → rapid-fire content cards.
 * Timing configurable via bootEnd / framesPerWiki props.
 */
export const SiteBootBlitz: React.FC<SiteBootBlitzProps> = ({
  montage,
  bootCommand,
  terminalTitle,
  accentColor = COLORS.teal,
  accentColors,
  bootEnd: bootEndProp,
  framesPerWiki: framesPerWikiProp,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useScale();

  const BOOT_END = bootEndProp ?? 22;
  const WIKI_START = BOOT_END;
  const FRAMES_PER_WIKI = framesPerWikiProp ?? 15;

  // Derive boot timing from bootEnd
  const compressed = BOOT_END <= 16;
  const typewriterStart = compressed ? 2 : 3;
  const cursorEnd = compressed ? 5 : 8;
  const barShowFrame = compressed ? 5 : 8;
  const barEndFrame = BOOT_END - 1;
  const keyClickFrames = compressed ? [2, 3, 4] : [3, 5, 7];

  // Derive wiki timing from framesPerWiki
  const slideInEnd = compressed ? 2 : 3;
  const wipeOutStart = FRAMES_PER_WIKI - 3;
  const highlightEnd = compressed ? 8 : 10;
  const counterEnd = highlightEnd;

  const items = montage.slice(0, 5);
  const colors = accentColors ?? [
    COLORS.teal,
    COLORS.green,
    COLORS.amber,
    COLORS.purple,
    COLORS.teal,
  ];

  // Boot phase
  const windowScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 220 },
  });

  const barProgress = interpolate(frame, [barShowFrame, barEndFrame], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Wiki/card phase
  const wikiFrame = Math.max(0, frame - WIKI_START);
  const wikiIndex = Math.min(
    Math.floor(wikiFrame / FRAMES_PER_WIKI),
    items.length - 1,
  );
  const localFrame = wikiFrame - wikiIndex * FRAMES_PER_WIKI;

  const wiki = items[wikiIndex];
  const accent = colors[wikiIndex] ?? COLORS.green;

  const slideInX = interpolate(localFrame, [0, slideInEnd], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideInOpacity = interpolate(localFrame, [0, slideInEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const wipeOutOpacity = interpolate(localFrame, [wipeOutStart, FRAMES_PER_WIKI], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wipeOutX = interpolate(localFrame, [wipeOutStart, FRAMES_PER_WIKI], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardOpacity = slideInOpacity * wipeOutOpacity;
  const cardTranslateX = slideInX + wipeOutX;

  const highlightProgress = interpolate(localFrame, [slideInEnd, highlightEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Running counter
  const runningTotal = items.slice(0, wikiIndex + 1).reduce((sum, w) => sum + w.count, 0);
  const prevTotal = items.slice(0, wikiIndex).reduce((sum, w) => sum + w.count, 0);
  const counterValue = Math.round(
    interpolate(localFrame, [1, counterEnd], [prevTotal, runningTotal], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const isBootPhase = frame < BOOT_END;
  const terminalFadeDuration = compressed ? 6 : 8;
  const showTerminal = frame < BOOT_END + terminalFadeDuration;

  const terminalOpacity = interpolate(frame, [BOOT_END, BOOT_END + terminalFadeDuration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={accent} particleCount={25}>
      {/* Key click SFX during boot */}
      {keyClickFrames.map((f) => (
        <Sequence key={`click-${f}`} from={f} durationInFrames={3}>
          <Audio src={AUDIO.keyClick} volume={VOLUMES.keyClick} />
        </Sequence>
      ))}

      {/* Card flip SFX */}
      {items.map((_, i) => (
        <Sequence key={`flip-${i}`} from={WIKI_START + i * FRAMES_PER_WIKI} durationInFrames={10}>
          <Audio src={AUDIO.cardFlip} volume={VOLUMES.cardFlip} />
        </Sequence>
      ))}

      {/* Boot terminal */}
      {showTerminal && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isBootPhase ? 1 : terminalOpacity,
            zIndex: isBootPhase ? 20 : 5,
          }}
        >
          <div
            style={{
              width: '80%',
              transform: `scale(${windowScale})`,
              transformOrigin: 'center center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: s(8),
                border: `1px solid ${accentColor}33`,
                overflow: 'hidden',
                boxShadow: `0 0 40px ${accentColor}22, 0 0 80px ${accentColor}11`,
                backgroundColor: COLORS.canvas,
                padding: s(24),
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: s(16),
                  minHeight: s(120),
                }}
              >
                {frame >= typewriterStart && (
                  <TypewriterText
                    text={bootCommand}
                    startFrame={typewriterStart}
                    speed={compressed ? 2.0 : 1.5}
                    color={accentColor}
                    fontSize={s(20)}
                    showCursor={frame < cursorEnd}
                    cursorColor={accentColor}
                  />
                )}

                {frame >= barShowFrame && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: s(14),
                        color: COLORS.textSecondary,
                      }}
                    >
                      <span>loading system</span>
                      <span style={{ color: accentColor, fontVariantNumeric: 'tabular-nums' }}>
                        {Math.round(barProgress)}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: s(8),
                        backgroundColor: COLORS.canvasSubtle,
                        borderRadius: s(4),
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${barProgress}%`,
                          height: '100%',
                          backgroundColor: accentColor,
                          borderRadius: s(4),
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card blitz phase */}
      {!isBootPhase && (
        <>
          <div
            style={{
              position: 'absolute',
              top: s(40),
              right: s(40),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: s(4),
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: s(14),
                color: COLORS.textMuted,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              total entries
            </div>
            <div
              style={{
                fontSize: s(40),
                fontWeight: 800,
                color: COLORS.textPrimary,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {counterValue}
            </div>
            <div style={{ fontSize: s(13), color: COLORS.textMuted, marginTop: s(4) }}>
              {wikiIndex + 1} / {items.length}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              transform: `translateX(${cardTranslateX}px)`,
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
              glowColor={accent}
              padding={s(32)}
              minWidth={s(400)}
              maxWidth={s(520)}
              nameFontSize={s(28)}
              countFontSize={s(56)}
              labelFontSize={s(18)}
              highlightFontSize={s(16)}
              gap={s(16)}
            />
          </div>
        </>
      )}
    </SceneWrapper>
  );
};
