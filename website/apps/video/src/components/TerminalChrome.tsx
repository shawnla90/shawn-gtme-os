import type { CSSProperties, ReactNode } from 'react';
import { COLORS, FONTS } from '../lib/tokens';

interface TerminalChromeProps {
  title?: string;
  children: ReactNode;
  scale?: number;
  accentColor?: string;
}

const TRAFFIC_LIGHT_SIZE = 12;
const TRAFFIC_LIGHT_GAP = 8;
const TITLE_BAR_HEIGHT = 40;
const BORDER_RADIUS = 8;
const CONTENT_PADDING = 24;

export const TerminalChrome: React.FC<TerminalChromeProps> = ({
  title = 'terminal',
  children,
  scale = 1,
  accentColor,
}) => {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: BORDER_RADIUS,
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    fontFamily: FONTS.mono,
  };

  const titleBarStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: TITLE_BAR_HEIGHT,
    backgroundColor: COLORS.canvasSubtle,
    paddingLeft: 16,
    paddingRight: 16,
    position: 'relative',
  };

  const trafficLightsContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: TRAFFIC_LIGHT_GAP,
    flexShrink: 0,
  };

  const trafficLightBase: CSSProperties = {
    width: TRAFFIC_LIGHT_SIZE,
    height: TRAFFIC_LIGHT_SIZE,
    borderRadius: '50%',
  };

  const titleTextStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 13,
    color: accentColor ?? COLORS.textSecondary,
    letterSpacing: 0.5,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const contentStyle: CSSProperties = {
    backgroundColor: COLORS.canvas,
    padding: CONTENT_PADDING,
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
