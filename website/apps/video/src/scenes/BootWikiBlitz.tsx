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
import { WIKI_MONTAGE } from '../lib/data';
import { AUDIO, VOLUMES } from '../lib/sounds';
import { TerminalChrome } from '../components/TerminalChrome';
import { TypewriterText } from '../components/TypewriterText';
import { WikiCard } from '../components/WikiCard';
import { SceneWrapper } from '../components/SceneWrapper';
import { useScale } from '../lib/useScale';

/** Accent colors cycling through the palette */
const WIKI_ACCENTS = [
  COLORS.green,   // Clay Wiki
  COLORS.teal,    // Context Wiki
  COLORS.amber,   // How-To Wiki
  COLORS.purple,  // Content Wiki
  COLORS.green,   // GTM Knowledge
];

/** Use first 5 wikis */
const WIKIS = WIKI_MONTAGE.slice(0, 5);
const BOOT_END = 22;   // Boot phase: frames 0-22 (~0.73s)
const WIKI_START = 22;
const FRAMES_PER_WIKI = 15; // 0.5s per wiki — rapid-fire

/**
 * Scene 2 — Boot + Wiki Blitz (110 frames / ~3.7s)
 * Fast terminal boot, then wiki cards rapid-fire.
 */
export const BootWikiBlitz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, sv } = useScale();

  // ── Boot Phase (frames 0-22) ──

  const windowScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 220 },
  });

  const barProgress = interpolate(frame, [8, 20], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Wiki Phase (frames 22+) ──

  const wikiFrame = Math.max(0, frame - WIKI_START);
  const wikiIndex = Math.min(
    Math.floor(wikiFrame / FRAMES_PER_WIKI),
    WIKIS.length - 1,
  );
  const localFrame = wikiFrame - wikiIndex * FRAMES_PER_WIKI;

  const wiki = WIKIS[wikiIndex];
  const accent = WIKI_ACCENTS[wikiIndex] ?? COLORS.green;

  // Wiki card slide-in (rapid)
  const slideInX = interpolate(localFrame, [0, 3], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideInOpacity = interpolate(localFrame, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Wiki card wipe-out (rapid)
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

  // Highlight progress
  const highlightProgress = interpolate(localFrame, [3, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Running counter
  const runningTotal = WIKIS.slice(0, wikiIndex + 1).reduce((sum, w) => sum + w.count, 0);
  const prevTotal = WIKIS.slice(0, wikiIndex).reduce((sum, w) => sum + w.count, 0);
  const counterValue = Math.round(
    interpolate(localFrame, [1, 10], [prevTotal, runningTotal], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const isBootPhase = frame < BOOT_END;
  const showTerminal = frame < BOOT_END + 8;

  // Terminal fade-out
  const terminalOpacity = interpolate(frame, [BOOT_END, BOOT_END + 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={accent} particleCount={25}>
      {/* SFX: key clicks during boot typewriter */}
      {[3, 5, 7].map((f) => (
        <Sequence key={`click-${f}`} from={f} durationInFrames={3}>
          <Audio src={AUDIO.keyClick} volume={VOLUMES.keyClick} />
        </Sequence>
      ))}

      {/* SFX: card flip at start of each wiki card */}
      {WIKIS.map((_, i) => (
        <Sequence key={`flip-${i}`} from={WIKI_START + i * FRAMES_PER_WIKI} durationInFrames={10}>
          <Audio src={AUDIO.cardFlip} volume={VOLUMES.cardFlip} />
        </Sequence>
      ))}

      {/* Boot Terminal */}
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
              title="shawnos.ai"
              accentColor={COLORS.green}
              glowColor={COLORS.green}
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
                    text="$ ./boot shawnos.ai"
                    startFrame={3}
                    speed={1.5}
                    color={COLORS.green}
                    fontSize={s(20)}
                    showCursor={frame < 8}
                    cursorColor={COLORS.green}
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
                      <span style={{ color: COLORS.green, fontVariantNumeric: 'tabular-nums' }}>
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
                          backgroundColor: COLORS.green,
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

      {/* Wiki Cards Phase */}
      {!isBootPhase && (
        <>
          {/* Running counter — top right */}
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
              {wikiIndex + 1} / {WIKIS.length}
            </div>
          </div>

          {/* Wiki card — centered, slides horizontally */}
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
