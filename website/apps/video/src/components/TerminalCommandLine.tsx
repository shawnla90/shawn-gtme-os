import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { useReelScale } from '../lib/useReelScale';
import { TypewriterText } from './TypewriterText';

interface CommandEntry {
  cmd: string;
  output: string;
  status: 'success' | 'error' | 'info';
}

interface TerminalCommandLineProps {
  commands: readonly CommandEntry[];
  /** Frames between each command appearing */
  interval?: number;
  startFrame?: number;
  width?: number;
}

const STATUS_COLORS: Record<string, string> = {
  success: COLORS.trafficGreen,
  error: COLORS.trafficRed,
  info: COLORS.nioBlue,
};

/**
 * Terminal frame with command typewriter + output slide-in + status indicator.
 */
export const TerminalCommandLine: React.FC<TerminalCommandLineProps> = ({
  commands,
  interval = 80,
  startFrame = 20,
  width = 800,
}) => {
  const frame = useCurrentFrame();
  const { s, sv } = useReelScale();

  const termWidth = s(width);

  // Terminal entrance
  const enterOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: termWidth,
        margin: '0 auto',
        opacity: enterOpacity,
      }}
    >
      {/* Terminal chrome */}
      <div
        style={{
          backgroundColor: COLORS.canvasSubtle,
          borderRadius: `${s(12)}px ${s(12)}px 0 0`,
          border: `1px solid ${COLORS.border}`,
          borderBottom: 'none',
          padding: `${sv(10)}px ${s(16)}px`,
          display: 'flex',
          alignItems: 'center',
          gap: s(8),
        }}
      >
        {/* Traffic lights */}
        {['#E05555', '#D2A53C', '#4EC373'].map((c) => (
          <div
            key={c}
            style={{
              width: s(12),
              height: s(12),
              borderRadius: '50%',
              backgroundColor: c,
              opacity: 0.8,
            }}
          />
        ))}
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: s(12),
            color: COLORS.textMuted,
            marginLeft: s(8),
          }}
        >
          claude-code
        </span>
      </div>

      {/* Terminal body */}
      <div
        style={{
          backgroundColor: '#0D1117F0',
          border: `1px solid ${COLORS.border}`,
          borderTop: 'none',
          borderRadius: `0 0 ${s(12)}px ${s(12)}px`,
          padding: `${sv(16)}px ${s(20)}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: sv(14),
          minHeight: sv(300),
        }}
      >
        {commands.map((entry, i) => {
          const cmdStart = startFrame + i * interval;
          const outputStart = cmdStart + 30; // output appears after cmd typewriter

          // Slide-in for each command block
          const blockOpacity = interpolate(frame, [cmdStart, cmdStart + 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const blockY = interpolate(frame, [cmdStart, cmdStart + 10], [sv(10), 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          if (frame < cmdStart) return null;

          const statusColor = STATUS_COLORS[entry.status] ?? COLORS.textSecondary;

          return (
            <div
              key={i}
              style={{
                opacity: blockOpacity,
                transform: `translateY(${blockY}px)`,
              }}
            >
              {/* Command line */}
              <TypewriterText
                text={entry.cmd}
                startFrame={cmdStart}
                speed={0.6}
                fontSize={s(16)}
                color={COLORS.textPrimary}
                cursorColor={COLORS.green}
                showCursor={i === commands.length - 1 || frame < cmdStart + interval}
              />

              {/* Output line */}
              {frame >= outputStart && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: s(8),
                    marginTop: sv(4),
                    opacity: interpolate(frame, [outputStart, outputStart + 10], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                  }}
                >
                  {/* Status dot */}
                  <div
                    style={{
                      width: s(8),
                      height: s(8),
                      borderRadius: '50%',
                      backgroundColor: statusColor,
                      boxShadow: `0 0 ${s(6)}px ${statusColor}80`,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: s(13),
                      color: statusColor,
                    }}
                  >
                    {entry.output}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
