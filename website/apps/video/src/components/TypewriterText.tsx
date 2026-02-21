import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  speed?: number;
  color?: string;
  fontSize?: number;
  showCursor?: boolean;
  cursorColor?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  speed = 0.5,
  color = COLORS.textPrimary,
  fontSize = 24,
  showCursor = true,
  cursorColor = COLORS.green,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Number of characters visible at the current frame
  const elapsed = Math.max(0, frame - startFrame);
  const charsToShow = Math.min(Math.floor(elapsed * speed), text.length);

  const visibleText = text.slice(0, charsToShow);

  // Cursor blinks at 1 Hz: visible for half a second, hidden for half a second.
  // At 30 fps that is 15 frames on, 15 frames off.
  const blinkCycle = Math.floor(fps / 2); // frames per half-cycle
  const cursorVisible = showCursor && frame % (blinkCycle * 2) < blinkCycle;

  // Once all characters are typed, the cursor still blinks.
  // Before typing starts, show only the cursor (no text).
  const typingComplete = charsToShow >= text.length;

  const textStyle: CSSProperties = {
    fontFamily: FONTS.mono,
    fontSize,
    color,
    whiteSpace: 'pre-wrap',
    lineHeight: 1.5,
    display: 'inline',
  };

  const cursorStyle: CSSProperties = {
    display: 'inline-block',
    width: Math.round(fontSize * 0.55),
    height: Math.round(fontSize * 1.15),
    backgroundColor: cursorColor,
    marginLeft: 2,
    verticalAlign: 'text-bottom',
    opacity: cursorVisible ? 1 : 0,
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      <span style={textStyle}>{visibleText}</span>
      {showCursor && <span style={cursorStyle} />}
    </span>
  );
};
