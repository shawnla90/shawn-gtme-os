"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

export interface VercelSnapTextProps {
  items: string[];
  /** @default "We Design" */
  prefix?: string;
  /** row height in px — also the snap unit — @default 80 */
  itemHeight?: number;
  /** @default 32 */
  gap?: number;
  /** show neighbours above/below the active item — @default true */
  showNeighbors?: boolean;
  /** @default 280 */
  stiffness?: number;
  /** @default 30 */
  damping?: number;
  className?: string;
}

export function VercelSnapText({
  items,
  prefix = "We Design",
  itemHeight = 80,
  gap = 32,
  showNeighbors = true,
  stiffness = 280,
  damping = 30,
  className,
}: VercelSnapTextProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [continuousIndex, setContinuousIndex] = React.useState(0);
  const [sectionHeight, setSectionHeight] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);

  // font size scales with container width (caps 72px, floors 20px) so text never overflows on narrow previews
  const fontSize =
    containerWidth > 0
      ? Math.min(Math.max(containerWidth * 0.055, 20), 72)
      : 48;
  // row height tracks font size only when itemHeight is at its default
  const rowHeight = itemHeight === 80 ? Math.round(fontSize * 1.6) : itemHeight;
  const resolvedGap = Math.min(gap, containerWidth * 0.04);

  const rawY = useMotionValue(0);
  const trackY = useSpring(rawY, { stiffness, damping, mass: 0.8 });

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const sync = () => {
      setSectionHeight(el.clientHeight);
      setContainerWidth(el.clientWidth);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.clientHeight === 0) return;
    const raw = el.scrollTop / el.clientHeight;
    const clamped = Math.min(Math.max(raw, 0), items.length - 1);
    const snapped = Math.round(clamped);

    setContinuousIndex(clamped);
    setActiveIndex(snapped);
    rawY.set(-snapped * rowHeight);
  }, [items.length, rowHeight, rawY]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* transparent z-10 overlay that captures scroll; scroll-snap snaps to integer indexes */}
      <div
        ref={scrollRef}
        className="absolute inset-0 z-10 overflow-y-scroll"
        style={
          {
            scrollSnapType: "y mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties
        }
        onScroll={handleScroll}
      >
        {sectionHeight > 0 &&
          items.map((_, i) => (
            <div
              key={i}
              style={{ height: sectionHeight, scrollSnapAlign: "start" }}
            />
          ))}
      </div>

      {/* z-0 visual layer; pointer-events-none so scroll driver captures events */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="flex items-center" style={{ gap: resolvedGap }}>
          <span
            className="font-semibold tracking-tight leading-none text-foreground select-none whitespace-nowrap"
            style={{ fontSize }}
          >
            {prefix}
          </span>

          {/* items track — overflow-hidden clips to one row only when neighbors are hidden */}
          <div
            className={showNeighbors ? undefined : "overflow-hidden"}
            style={{ height: rowHeight }}
          >
            <motion.div style={{ y: trackY }}>
              {items.map((item, i) => {
                const isActive = i === activeIndex;
                const dist = Math.abs(i - continuousIndex);
                const opacity = Math.max(0.15, 1 - dist * 0.82);

                return (
                  <div
                    key={i}
                    className="flex items-center whitespace-nowrap"
                    style={{ height: rowHeight, opacity }}
                  >
                    <span
                      className="font-semibold tracking-tight leading-none select-none"
                      style={{
                        fontSize,
                        color: isActive
                          ? "hsl(var(--foreground))"
                          : "hsl(var(--foreground) / 0.35)",
                        transition: "color 150ms ease",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}