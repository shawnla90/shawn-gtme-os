"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Megaphone,
  MessageSquare,
  Sparkles,
  Target,
  Terminal,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AURA, AURA_COPY, ENTITIES } from "../lib/tokens";
import { AnimatedBeam } from "../primitives/animated-beam";
import { Backlight } from "../../../../components/magicui/backlight";

export type SceneFormat = "wide" | "vertical";

/** Stable array of RefObjects (safe to index; not a hook-in-a-loop). */
function useRefArray<T>(n: number) {
  const ref = useRef<React.RefObject<T | null>[]>(null);
  if (!ref.current) {
    ref.current = Array.from({ length: n }, () => ({ current: null }));
  }
  return ref.current;
}

const ENTITY_KEYS = ["lead", "competitor", "engage"] as const;
const ENTITY_ICON = { lead: Users, competitor: Target, engage: MessageSquare };
const OUTPUT_ICON = [Sparkles, FileText, Megaphone];

/**
 * AuraPipeline — THE hero. The owned ingestion flowchart: subreddits stream
 * into the Aura core, which extracts Leads / Competitors / Engagement
 * Opportunities, hands them to an agent CLI, and produces content — then the
 * loop feeds back. Beams route off measured node positions, so the same node
 * set reflows across wide / square / vertical.
 */
export function AuraPipeline({ format = "wide" }: { format?: SceneFormat }) {
  const vertical = format === "vertical";
  const container = useRef<HTMLDivElement>(null);
  const subRefs = useRefArray<HTMLDivElement>(AURA_COPY.subreddits.length);
  const auraRef = useRef<HTMLDivElement>(null);
  const entRefs = useRefArray<HTMLDivElement>(3);
  const cliRef = useRef<HTMLDivElement>(null);
  const outRefs = useRefArray<HTMLDivElement>(AURA_COPY.outputs.length);

  const groupDir = vertical ? "flex-row" : "flex-col";

  return (
    <div className="relative h-full w-full overflow-hidden text-foreground">
      {/* violet field glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 48% at 50% 44%, oklch(0.585 0.223 264.376 / 16%), transparent 72%)",
        }}
      />

      {/* flow + beams share one measured container */}
      <div
        ref={container}
        className={cn(
          "relative z-10 flex w-full items-center gap-6",
          vertical ? "flex-col gap-7 px-4 py-12" : "h-full flex-row justify-between px-16 py-28",
        )}
      >
        {/* eyebrow — inline on mobile, pinned top-left on desktop */}
        <div className={cn("z-20", vertical ? "text-center" : "absolute left-14 top-11")}>
          <p className="text-[13px] font-medium uppercase tracking-[0.28em] text-aura">
            {AURA_COPY.engine} Engine
          </p>
          <h2 className="mt-1 text-[22px] font-semibold tracking-tight sm:text-[26px]">
            The ingestion pipeline
          </h2>
        </div>

        <ColStage header="Subreddits" dir={groupDir}>
          {AURA_COPY.subreddits.map((s, i) => (
            <NodeChip key={s} ref={subRefs[i]}>
              {s}
            </NodeChip>
          ))}
        </ColStage>

        <AuraCore ref={auraRef} />

        <ColStage header="Extract" dir={groupDir}>
          {ENTITY_KEYS.map((k, i) => {
            const Icon = ENTITY_ICON[k];
            return (
              <NodeChip key={k} ref={entRefs[i]} color={ENTITIES[k].color}>
                <Icon className="size-4" style={{ color: ENTITIES[k].color }} />
                <span className="whitespace-nowrap">{vertical ? ENTITIES[k].short : ENTITIES[k].label}</span>
              </NodeChip>
            );
          })}
        </ColStage>

        <ColStage header="Agent CLI" dir={groupDir}>
          <div
            ref={cliRef}
            className="relative z-10 flex flex-col gap-1.5 rounded-xl border border-white/12 bg-card/90 px-4 py-3 shadow-xl backdrop-blur"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Terminal className="size-4 text-aura" /> CLI
            </div>
            {AURA_COPY.clis.map((c) => (
              <span key={c} className="text-xs text-muted-foreground">
                {c}
              </span>
            ))}
          </div>
        </ColStage>

        <ColStage header="Create" dir={groupDir}>
          {AURA_COPY.outputs.map((o, i) => {
            const Icon = OUTPUT_ICON[i];
            return (
              <NodeChip key={o} ref={outRefs[i]}>
                <Icon className="size-4 text-aura" />
                <span className="whitespace-nowrap">{o}</span>
              </NodeChip>
            );
          })}
        </ColStage>

        {/* ingestion beams (subreddits → aura) */}
        {subRefs.map((r, i) => (
          <AnimatedBeam
            key={`s${i}`}
            containerRef={container}
            fromRef={r}
            toRef={auraRef}
            duration={6.5}
            delay={i * 0.35}
            curvature={vertical ? 0 : (i - 2) * 20}
            gradientStartColor="#8b7cf6"
            gradientStopColor={AURA.aura}
          />
        ))}
        {/* extraction beams (aura → entities) */}
        {entRefs.map((r, i) => (
          <AnimatedBeam
            key={`e${i}`}
            containerRef={container}
            fromRef={auraRef}
            toRef={r}
            duration={5.5}
            delay={0.5 + i * 0.18}
            curvature={vertical ? 0 : (i - 1) * 26}
            gradientStartColor={AURA.aura}
            gradientStopColor={ENTITIES[ENTITY_KEYS[i]].color}
          />
        ))}
        {/* entities → CLI */}
        {entRefs.map((r, i) => (
          <AnimatedBeam
            key={`c${i}`}
            containerRef={container}
            fromRef={r}
            toRef={cliRef}
            duration={5.5}
            delay={0.9 + i * 0.18}
            curvature={vertical ? 0 : (1 - i) * 26}
            gradientStartColor={ENTITIES[ENTITY_KEYS[i]].color}
            gradientStopColor="#e6e6ff"
          />
        ))}
        {/* CLI → outputs */}
        {outRefs.map((r, i) => (
          <AnimatedBeam
            key={`o${i}`}
            containerRef={container}
            fromRef={cliRef}
            toRef={r}
            duration={5.5}
            delay={1.2 + i * 0.18}
            curvature={vertical ? 0 : (i - 1) * 24}
            gradientStartColor="#e6e6ff"
            gradientStopColor={AURA.aura}
          />
        ))}
        {/* the loop: outputs → back to subreddits (implied by layout in vertical) */}
        {!vertical && (
          <AnimatedBeam
            containerRef={container}
            fromRef={outRefs[1]}
            toRef={subRefs[2]}
            duration={9}
            delay={1.6}
            curvature={-240}
            reverse
            pathColor="oklch(0.585 0.223 264.376 / 35%)"
            pathOpacity={0.5}
            pathWidth={1.5}
            gradientStartColor={AURA.aura}
            gradientStopColor="#8b7cf6"
          />
        )}

        {/* processed stat + wordmark — inline on mobile, pinned bottom-right on desktop */}
        <div
          className={cn(
            "z-20 flex items-center gap-2",
            vertical ? "mt-1" : "absolute bottom-11 right-14",
          )}
        >
          <span className="text-xs text-muted-foreground">
            {AURA_COPY.processed} posts → intent-scored ·
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/clearbox-logo.svg"
            alt="Clearbox"
            className="h-4 w-auto opacity-85"
          />
        </div>
      </div>
    </div>
  );
}

function ColStage({
  header,
  dir,
  children,
}: {
  header: string;
  dir: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {header}
      </span>
      <div className={cn("flex flex-wrap items-center justify-center gap-2.5 max-w-[300px]", dir)}>
        {children}
      </div>
    </div>
  );
}

function NodeChip({
  ref,
  color,
  className,
  children,
}: {
  ref?: React.Ref<HTMLDivElement>;
  color?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 flex items-center gap-2 rounded-lg border border-white/12 bg-card/90 px-3 py-2 text-sm font-medium shadow-lg backdrop-blur",
        className,
      )}
      style={
        color
          ? { borderColor: `color-mix(in oklch, ${color} 55%, transparent)` }
          : undefined
      }
    >
      {children}
    </div>
  );
}

function AuraCore({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {AURA_COPY.engine}
      </span>
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: AURA.aura }}
          animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.18, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <Backlight blur={14} className="relative z-10">
          <div
            ref={ref}
            className="flex size-20 items-center justify-center rounded-2xl border bg-card"
            style={{
              borderColor: "color-mix(in oklch, var(--aura) 55%, transparent)",
              boxShadow: "0 0 44px -8px var(--aura)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/clearbox-icon.svg" alt="Aura" className="size-10" />
          </div>
        </Backlight>
      </div>
    </div>
  );
}
