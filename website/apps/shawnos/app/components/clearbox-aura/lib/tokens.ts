/**
 * Aura design tokens — the single color vocabulary for every studio scene.
 *
 * Utilities (bg-aura, text-lead, border-competitor/30, from-aura, ...) come
 * from the @theme mappings in globals.css — use those in className. Use the
 * literals below only where a className can't reach: SVG gradient stops,
 * <canvas> fills, and JS-driven color. (getComputedStyle can't see var()
 * inside a detached probe canvas, so we ship oklch literals too.)
 *
 * Violet (aura) is the ENGINE/brand accent. The three extraction entities get
 * their own distinct hues so they stay legible against a violet-accented UI.
 */

export const AURA = {
  aura: "oklch(0.585 0.223 264.376)",
  auraStrong: "oklch(0.66 0.24 264.376)",
  lead: "oklch(0.72 0.17 155)",
  competitor: "oklch(0.65 0.2 18)",
  engage: "oklch(0.8 0.16 80)",
  ink: "oklch(0.985 0 0)",
  field: "oklch(0.145 0 0)",
  card: "oklch(0.205 0 0)",
  muted: "oklch(0.708 0 0)",
  border: "oklch(1 0 0 / 12%)",
} as const;

export type EntityKey = "lead" | "competitor" | "engage";

export const ENTITIES: Record<
  EntityKey,
  { label: string; short: string; color: string; cls: string }
> = {
  lead: { label: "Lead", short: "Lead", color: AURA.lead, cls: "lead" },
  competitor: {
    label: "Competitor",
    short: "Comp",
    color: AURA.competitor,
    cls: "competitor",
  },
  engage: {
    label: "Engagement Opportunity",
    short: "Engage",
    color: AURA.engage,
    cls: "engage",
  },
};

/** The Aura story vocabulary — reused across scenes so copy stays consistent. */
export const AURA_COPY = {
  domain: "clearbox.to",
  tagline: "Your Reddit inbox, filtered by intent",
  altTagline: "See your market. Move first.",
  footer: "Powered by Aura Engine",
  engine: "Aura",
  processed: "30,000",
  clis: ["Claude Code", "Codex", "Gemini"],
  outputs: ["Lead magnets", "Content", "Copy"],
  subreddits: ["r/SaaS", "r/startups", "r/Entrepreneur", "r/marketing", "r/sales"],
} as const;

/** Resolve a CSS custom property to its computed value (client-only). */
export function resolveToken(cssVar: string, fallback = AURA.aura): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
  return v || fallback;
}
