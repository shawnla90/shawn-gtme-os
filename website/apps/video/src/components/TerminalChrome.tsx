import type { CSSProperties, ReactNode } from 'react';
import { COLORS, FONTS } from '../lib/tokens';

interface TerminalChromeProps {
  title?: string;
  children: ReactNode;
  scale?: number;
  accentColor?: string;
  glowColor?: string;
  titleBarHeight?: number;
  contentPadding?: number;
  borderRadius?: number;
  trafficLightSize?: number;
  titleFontSize?: number;
}

export const TerminalChrome: React.FC<TerminalChromeProps> = ({
  title = 'terminal',
  children,
  scale = 1,
  accentColor,
  glowColor,
  titleBarHeight = 40,
  contentPadding = 24,
  borderRadius = 8,
  trafficLightSize = 12,
  titleFontSize = 13,
}) => {
  const trafficLightGap = Math.round(trafficLightSize * 0.67);

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius,
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    fontFamily: FONTS.mono,
    ...(glowColor
      ? {
          boxShadow: `0 0 40px ${glowColor}22, 0 0 80px ${glowColor}11`,
        }
      : {}),
  };

  const titleBarStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: titleBarHeight,
    backgroundColor: COLORS.canvasSubtle,
    paddingLeft: Math.round(titleBarHeight * 0.4),
    paddingRight: Math.round(titleBarHeight * 0.4),
    position: 'relative',
  };

  const trafficLightsContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: trafficLightGap,
    flexShrink: 0,
  };

  const trafficLightBase: CSSProperties = {
    width: trafficLightSize,
    height: trafficLightSize,
    borderRadius: '50%',
  };

  const titleTextStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: titleFontSize,
    color: accentColor ?? COLORS.textSecondary,
    letterSpacing: 0.5,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const contentStyle: CSSProperties = {
    backgroundColor: COLORS.canvas,
    padding: contentPadding,
    flexGrow: 1,
    minHeight: 0,
  };

  return (
    <div style={containerStyle}>
      {/* Title bar */}
      <div style={titleBarStyle}>
        <div style={trafficLightsContainerStyle}>
          <div style={{ ...trafficLightBase, backgroundColor: COLORS.trafficRed }} />
          <div style={{ ...trafficLightBase, backgroundColor: COLORS.trafficYellow }} />
          <div style={{ ...trafficLightBase, backgroundColor: COLORS.trafficGreen }} />
        </div>
        <span style={titleTextStyle}>{title}</span>
      </div>

      {/* Content area */}
      <div style={contentStyle}>{children}</div>
    </div>
  );
};
