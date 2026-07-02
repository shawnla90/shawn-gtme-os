"use client";

// Vendored from SmoothUI (educlopez/smoothui, MIT) — cva/radix-slot layer
// replaced with a plain variant map + minimal slot shim to avoid new deps.
import { cn } from "@shawnos/shared/lib/utils";
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const SIZES: Record<string, string> = {
  default: "h-10 px-5 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  icon: "h-10 w-10",
};

export type MagneticButtonProps = {
  children: ReactNode;
  strength?: number;
  radius?: number;
  springConfig?: { duration?: number; bounce?: number };
  disabled?: boolean;
  /** Render the single child element instead of a <button> (e.g. a Link). */
  asChild?: boolean;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const MagneticButton = ({
  children,
  strength = 0.3,
  radius = 150,
  springConfig = { duration: 0.4, bounce: 0.1 },
  disabled = false,
  asChild = false,
  variant = "default",
  size = "default",
  className,
  ...props
}: MagneticButtonProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const buttonRef = useRef<HTMLElement>(null);

  const x = useSpring(0, {
    duration: springConfig.duration ?? 0.4,
    bounce: springConfig.bounce ?? 0.1,
  });
  const y = useSpring(0, {
    duration: springConfig.duration ?? 0.4,
    bounce: springConfig.bounce ?? 0.1,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isEffectDisabled = disabled || shouldReduceMotion || !isHoverDevice;

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isEffectDisabled || !buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      if (distance < radius) {
        const factor = 1 - distance / radius;
        x.set(distanceX * strength * factor);
        y.set(distanceY * strength * factor);
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [isEffectDisabled, radius, strength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  let inner: ReactNode;
  if (asChild) {
    const child = React.Children.only(children) as ReactElement<
      Record<string, unknown>
    >;
    inner = React.cloneElement(child, {
      ...props,
      className: cn(classes, child.props.className as string | undefined),
      ref: buttonRef,
    });
  } else {
    inner = (
      <button
        className={classes}
        disabled={disabled}
        ref={buttonRef as React.RefObject<HTMLButtonElement>}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className="inline-block"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      role="presentation"
      style={{ padding: `${radius / 2}px`, margin: `-${radius / 2}px` }}
    >
      <motion.div style={{ x, y }}>{inner}</motion.div>
    </div>
  );
};

export default MagneticButton;
