import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../lib/tokens';
import { useScale } from '../lib/useScale';

interface ChatBubbleProps {
  /** Message text */
  text: string;
  /** Who sent it */
  sender: 'user' | 'agent';
  /** Frame at which bubble appears */
  appearFrame?: number;
  /** Whether to typewriter the text (agent messages) */
  typewriter?: boolean;
  /** Typewriter speed in chars per frame */
  typewriterSpeed?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  text,
  sender,
  appearFrame = 0,
  typewriter = false,
  typewriterSpeed = 1.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s } = useScale();

  const localFrame = frame - appearFrame;
  if (localFrame < 0) return null;

  const isUser = sender === 'user';

  // Slide-in spring
  const slideProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  const translateX = isUser
    ? interpolate(slideProgress, [0, 1], [40, 0])
    : interpolate(slideProgress, [0, 1], [-40, 0]);

  // Typewriter effect
  const visibleText = typewriter
    ? text.slice(0, Math.floor(localFrame * typewriterSpeed))
    : text;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        opacity: slideProgress,
        transform: `translateX(${translateX}px)`,
        marginBottom: s(12),
      }}
    >
      <div
        style={{
          maxWidth: '75%',
          padding: `${s(12)}px ${s(16)}px`,
          borderRadius: s(14),
          borderTopRightRadius: isUser ? s(4) : s(14),
          borderTopLeftRadius: isUser ? s(14) : s(4),
          backgroundColor: isUser ? '#2563EB' : COLORS.canvasSubtle,
          border: isUser ? 'none' : `1px solid ${COLORS.border}`,
          fontFamily: FONTS.mono,
          fontSize: s(14),
          lineHeight: 1.5,
          color: isUser ? '#ffffff' : COLORS.textPrimary,
        }}
      >
        {visibleText}
      </div>
    </div>
  );
};
