import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { FPS } from '../lib/timing';
import { TerminalChrome } from '../components/TerminalChrome';
import { TypewriterText } from '../components/TypewriterText';
import { ScanlineOverlay } from '../components/ScanlineOverlay';

/**
 * Scene 2 — Boot Sequence (150 frames / 5s)
 * Establish the terminal brand identity.
 */
export const BootSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // --- Terminal window scales in (frames 0-20) ---
  const windowScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  // --- Loading bar (frames 50-100) ---
  const barProgress = interpolate(frame, [50, 100], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- System loaded line visibility ---
  const systemLineVisible = frame >= 100;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.canvas,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.mono,
      }}
    >
      <div
        style={{
          width: '80%',
          transform: `scale(${windowScale})`,
          transformOrigin: 'center center',
        }}
      >
        <TerminalChrome title="shawnos.ai" accentColor={COLORS.green}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              minHeight: 200,
            }}
          >
            {/* Command line typed out (frames 20-50) */}
            {frame >= 20 && (
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <TypewriterText
                  text="$ ./boot shawnos.ai"
                  startFrame={20}
                  speed={0.7}
                  color={COLORS.green}
                  fontSize={20}
                  showCursor={frame < 50}
                  cursorColor={COLORS.green}
                />
              </div>
            )}

            {/* Loading bar (frames 50-100) */}
            {frame >= 50 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: COLORS.textSecondary,
                    }}
                  >
                    loading system
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: COLORS.green,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {Math.round(barProgress)}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 8,
                    backgroundColor: COLORS.canvasSubtle,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${barProgress}%`,
                      height: '100%',
                      backgroundColor: COLORS.green,
                      borderRadius: 4,
                      transition: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            {/* System loaded line (frames 100-150) */}
            {systemLineVisible && (
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <TypewriterText
                  text="> system loaded — 3 sites | 7 wikis | 1 repo"
                  startFrame={100}
                  speed={0.8}
                  color={COLORS.textPrimary}
                  fontSize={18}
                  showCursor={true}
                  cursorColor={COLORS.green}
                />
              </div>
            )}
          </div>
        </TerminalChrome>
      </div>

      {/* Scanline overlay — active throughout */}
      <ScanlineOverlay opacity={0.05} />
    </AbsoluteFill>
  );
};
