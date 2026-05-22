"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  text: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface InlineTestimonialsProps {
  testimonials: Testimonial[];
  /** Blur amount applied to non-hovered items in px. @default 5 */
  blurAmount?: number;
  /** Opacity of non-hovered items (0–1). @default 0.25 */
  blurOpacity?: number;
  /** CSS color for the author name label. @default "#f97316" */
  accentColor?: string;
  /** Avatar diameter in pixels. @default 32 */
  avatarSize?: number;
  /** Font size in pixels. @default 30 */
  fontSize?: number;
  className?: string;
}

export function InlineTestimonials({
  testimonials,
  blurAmount = 5,
  blurOpacity = 0.25,
  accentColor = "#f97316",
  avatarSize = 32,
  fontSize = 30,
  className,
}: InlineTestimonialsProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <div
      className={cn("font-medium tracking-tight", className)}
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.35 }}
    >
      {testimonials.map((t, index) => {
        const isHovered = hoveredId === t.id;
        const isDimmed = hoveredId !== null && !isHovered;
        const isAlternate = index % 2 !== 0;
        const baseOpacity = isAlternate ? 0.7 : 1;

        return (
          <span
            key={t.id}
            onMouseEnter={() => setHoveredId(t.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              filter: isDimmed ? `blur(${blurAmount}px)` : "none",
              opacity: isDimmed ? blurOpacity : isHovered ? 1 : baseOpacity,
              transition: "filter 0.3s ease, opacity 0.3s ease",
              cursor: "default",
            }}
          >
            <span
              className="relative inline-block"
              style={{
                width: avatarSize,
                height: avatarSize,
                verticalAlign: "middle",
                marginRight: 3,
              }}
            >
              <Image
                src={t.author.avatar}
                alt={t.author.name}
                width={avatarSize}
                height={avatarSize}
                unoptimized
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: "50%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      left: avatarSize / 2,
                      bottom: "150%",
                      transform: "translateY(-50%)",
                      display: "inline-flex",
                      flexDirection: "column",
                      gap: 3,
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      zIndex: 20,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: accentColor,
                        lineHeight: 1.2,
                      }}
                    >
                      {t.author.name}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--muted-foreground, #6b7280)",
                        lineHeight: 1.2,
                      }}
                    >
                      {t.author.role}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span>{t.text} </span>
          </span>
        );
      })}
    </div>
  );
}