import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../lib/tokens';

interface MatrixRainProps {
  opacity?: number;
  color?: string;
  columns?: number;
  speed?: number;
}

/**
 * Deterministic matrix-rain effect. Each column has a seeded offset
 * so the same frame always produces the same output.
 */
export const MatrixRain: React.FC<MatrixRainProps> = ({
  opacity = 0.12,
  color = COLORS.green,
  columns = 30,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const colWidth = width / columns;
  const charHeight = 18;
  const rows = Math.ceil(height / charHeight) + 4;

  // Deterministic pseudo-random from column index and row
  const seededChar = (col: number, row: number, f: number): string => {
    const seed = ((col * 997 + row * 131 + Math.floor(f * speed) * 7) % 94) + 33;
    return String.fromCharCode(seed);
  };

  const seededOpacity = (col: number, row: number, f: number): number => {
    const v = ((col * 373 + row * 59 + Math.floor(f * speed) * 13) % 100) / 100;
    const rowFade = 1 - row / rows;
    return v * rowFade;
  };

  const containerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    opacity,
    pointerEvents: 'none',
  };

  const colElements: React.ReactNode[] = [];

  for (let c = 0; c < columns; c++) {
    const chars: React.ReactNode[] = [];
    const offset = ((c * 47) % rows) + Math.floor(frame * speed * 0.3);
    for (let r = 0; r < rows; r++) {
      const adjustedRow = (r + offset) % (rows + 8);
      const charOpacity = seededOpacity(c, adjustedRow, frame);
      chars.push(
        <div
          key={r}
          style={{
            height: charHeight,
            fontSize: 14,
            lineHeight: `${charHeight}px`,
            color,
            opacity: charOpacity,
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
        >
          {seededChar(c, adjustedRow, frame)}
        </div>,
      );
    }
    colElements.push(
      <div
        key={c}
        style={{
          position: 'absolute',
          left: c * colWidth,
          top: 0,
          width: colWidth,
        }}
      >
        {chars}
      </div>,
    );
  }

  return <div style={containerStyle}>{colElements}</div>;
};
