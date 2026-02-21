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
import { TerminalChrome } from '../components/TerminalChrome';
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
}

const BOOT_END = 22;
const WIKI_START = 22;
const FRAMES_PER_WIKI = 15;

/**
 * Generic Boot + Blitz scene (110 frames / ~3.7s).
 * Terminal boot → rapid-fire content cards.
 */
export const SiteBootBlitz: React.FC<SiteBootBlitzProps> = ({
  montage,
  bootCommand,
  terminalTitle,
  accentColor = COLORS.teal,
  accentColors,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useScale();

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

  const barProgress = interpolate(frame, [8, 20], [0, 100], {
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

  const slideInX = interpolate(localFrame, [0, 3], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideInOpacity = interpolate(localFrame, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const wipeOutOpacity = interpolate(localFrame, [11, 15], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wipeOutX = interpolate(localFrame, [11, 15], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardOpacity = slideInOpacity * wipeOutOpacity;
  const cardTranslateX = slideInX + wipeOutX;

  const highlightProgress = interpolate(localFrame, [3, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Running counter
  const runningTotal = items.slice(0, wikiIndex + 1).reduce((sum, w) => sum + w.count, 0);
  const prevTotal = items.slice(0, wikiIndex).reduce((sum, w) => sum + w.count, 0);
  const counterValue = Math.round(
    interpolate(localFrame, [1, 10], [prevTotal, runningTotal], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const isBootPhase = frame < BOOT_END;
  const showTerminal = frame < BOOT_END + 8;

  const terminalOpacity = interpolate(frame, [BOOT_END, BOOT_END + 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={accent} particleCount={25}>
      {/* Key click SFX during boot */}
      {[3, 5, 7].map((f) => (
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
            <TerminalChrome
              title={terminalTitle}
              accentColor={accentColor}
              glowColor={accentColor}
              titleBarHeight={s(40)}
              contentPadding={s(24)}
              borderRadius={s(8)}
              trafficLightSize={s(12)}
              titleFontSize={s(13)}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: s(16),
                  minHeight: s(120),
                }}
              >
                {frame >= 3 && (
                  <TypewriterText
                    text={bootCommand}
                    startFrame={3}
                    speed={1.5}
                    color={accentColor}
                    fontSize={s(20)}
                    showCursor={frame < 8}
                    cursorColor={accentColor}
                  />
                )}

                {frame >= 8 && (
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
            </TerminalChrome>
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
