#!/usr/bin/env python3
"""
Avatar GIF generator for the GTM OS RPG system.

Renders animated GIF sprites (idle + action) for each of the 6 avatar tiers
using the body-part layering system and frame transforms defined in
``rpg_sprites.py``.

Output per tier:
    tier-N-idle.gif       — looping idle animation (8-12 frames @ 150ms)
    tier-N-action.gif     — one-shot action burst  (12-16 frames @ 80ms)
    tier-N-static.png     — single key-frame for non-animated contexts

With --variant advanced, filenames use -advanced suffix:
    tier-N-idle-advanced.gif, tier-N-action-advanced.gif, tier-N-static-advanced.png

Each file is generated at 4 sizes: 64, 128, 256, 512 px (square).

Convenience copies (early variant only when --current/--all-current):
    current-idle.gif      — alias of the active tier's idle
    current-action.gif   — alias of the active tier's action
    current.png           — alias of the active tier's static

Usage:
    python3 scripts/avatar_generator.py                   # all 6 tiers (early)
    python3 scripts/avatar_generator.py --variant advanced  # advanced effects
    python3 scripts/avatar_generator.py --variant both      # both early + advanced + classes
    python3 scripts/avatar_generator.py --tier 3            # single tier
    python3 scripts/avatar_generator.py --tier 3 --current  # set as current
    python3 scripts/avatar_generator.py --all-current 2     # all tiers + set current=2
    python3 scripts/avatar_generator.py --classes           # class sprites only
"""

from __future__ import annotations

import argparse
import shutil
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional

from PIL import Image

# ── Sibling import — rpg_sprites lives in the same directory ──────────
sys.path.insert(0, str(Path(__file__).resolve().parent))

from rpg_sprites import (
    AVATAR_DIR,
    BG,
    GRID,
    OUTPUT_SIZES,
    AnimationSpec,
    Sprite,
    get_class_animation,
    get_class_sprite,
    get_tier_animation,
    get_tier_sprite,
    render_sprite,
    upscale,
)

# ══════════════════════════════════════════════════════════════════════
#  Constants
# ══════════════════════════════════════════════════════════════════════

DEFAULT_SIZE = 128               # website badge default
STATIC_FRAME_INDEX = 0           # which idle frame to use for the static PNG
CLASS_NAMES = ["builder", "scribe", "strategist", "alchemist", "polymath"]
CLASS_OUTPUT_SIZES = [64, 128, 256]  # class sprites are generated at 3 sizes


# ══════════════════════════════════════════════════════════════════════
#  Core Rendering
# ══════════════════════════════════════════════════════════════════════

def render_animation_frames(
    sprite: Sprite,
    spec: AnimationSpec,
    size: int = DEFAULT_SIZE,
) -> List[Image.Image]:
    """Generate all frames for an animation at *size* px.

    Each frame:
      1. Applies the per-frame transform from the AnimationSpec
      2. Renders to the 32×32 grid
      3. Upscales via nearest-neighbor for crispy pixel art
    """
    frames: List[Image.Image] = []
    for i in range(spec.frames):
        transformed = spec.transform(sprite, i, spec.frames)
        base = render_sprite(transformed)
        scaled = upscale(base, size)
        # Convert to RGBA for GIF transparency support, then to P mode
        frames.append(scaled.convert("RGBA"))
    return frames


def frames_to_gif(
    frames: List[Image.Image],
    duration_ms: int,
    loop: int = 0,
) -> Image.Image:
    """Pack RGBA frames into a single GIF-ready Image with append_images.

    Returns the first frame as the base Image with the rest attached as
    ``append_images`` metadata, ready for ``Image.save(save_all=True)``.

    GIF doesn't natively support alpha, so we quantize each frame to a
    256-color palette with a transparency index.  The dark background
    pixels are kept solid so no matte is needed.
    """
    # Quantize each frame to P (palette) mode for GIF output.
    # We convert RGBA → RGB first (compositing on BG) since our sprites
    # have a solid dark background and don't need GIF transparency.
    #
    # To prevent Pillow's GIF encoder from merging identical consecutive
    # frames (which doubles their duration), we stamp a near-invisible
    # 1-pixel "frame index" in the bottom-right corner.  The color
    # difference is ≤1 brightness step — invisible to the eye but
    # ensures every quantized frame is unique.
    p_frames: List[Image.Image] = []
    bg_layer = Image.new("RGBA", frames[0].size, BG + (255,))
    for idx, frame in enumerate(frames):
        composited = Image.alpha_composite(bg_layer, frame)
        rgb = composited.convert("RGB")
        # Stamp near-invisible uniqueness pixels (bottom-right corner).
        # We use TWO pixels with different channel encodings to guarantee
        # every frame index 0..N is unique even after quantization.
        w, h = rgb.size
        base_r, base_g, base_b = BG[:3]
        # Pixel 1: vary red channel by frame index (max 16 → +16 brightness)
        rgb.putpixel((w - 1, h - 1), (base_r + idx + 1, base_g, base_b))
        # Pixel 2: vary green channel inversely
        rgb.putpixel((w - 2, h - 1), (base_r, base_g + idx + 1, base_b))
        p_frame = rgb.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
        p_frames.append(p_frame)

    base = p_frames[0].copy()
    base.info["duration"] = duration_ms
    base.info["loop"] = loop
    # Store remaining frames for the caller to pass as append_images
    base._append_frames = p_frames[1:]  # type: ignore[attr-defined]
    return base


def save_gif(
    base_frame: Image.Image,
    path: Path,
    duration_ms: int,
    loop: int = 0,
) -> None:
    """Save a GIF assembled by ``frames_to_gif`` to disk."""
    append = getattr(base_frame, "_append_frames", [])
    base_frame.save(
        str(path),
        save_all=True,
        append_images=append,
        duration=duration_ms,
        loop=loop,
        optimize=False,
    )


# ══════════════════════════════════════════════════════════════════════
#  Per-Tier Generation
# ══════════════════════════════════════════════════════════════════════

def generate_tier(
    tier: int,
    sizes: Optional[List[int]] = None,
    output_dir: Optional[Path] = None,
    variant: str = "early",
    verbose: bool = True,
) -> Dict[str, Path]:
    """Generate all avatar assets for a single tier.

    Args:
        tier: Tier 1-6.
        sizes: Output pixel sizes (default: OUTPUT_SIZES).
        output_dir: Where to write files (default: AVATAR_DIR).
        variant: "early" or "advanced" — controls animation specs and filename suffix.
        verbose: Print per-tier output.

    Returns a dict mapping asset key to output path:
        ``{
            "idle-128":   Path("...tier-1-idle-128.gif"),
            "action-128": Path("...tier-1-action-128.gif"),
            "static-128": Path("...tier-1-static-128.png"),
            ...
        }``
    """
    if sizes is None:
        sizes = list(OUTPUT_SIZES)
    if output_dir is None:
        output_dir = AVATAR_DIR

    output_dir.mkdir(parents=True, exist_ok=True)

    sprite = get_tier_sprite(tier)
    anims = get_tier_animation(tier, variant)
    variant_suffix = "-advanced" if variant == "advanced" else ""

    outputs: Dict[str, Path] = {}

    for size in sizes:
        size_suffix = f"-{size}" if len(sizes) > 1 else ""

        # ── Idle GIF ──────────────────────────────────────────────
        idle_spec = anims["idle"]
        idle_frames = render_animation_frames(sprite, idle_spec, size)
        idle_gif = frames_to_gif(idle_frames, idle_spec.duration_ms, loop=0)
        idle_path = output_dir / f"tier-{tier}-idle{variant_suffix}{size_suffix}.gif"
        save_gif(idle_gif, idle_path, idle_spec.duration_ms, loop=0)
        outputs[f"idle-{size}"] = idle_path

        # ── Action GIF ────────────────────────────────────────────
        action_spec = anims["action"]
        action_frames = render_animation_frames(sprite, action_spec, size)
        action_gif = frames_to_gif(
            action_frames, action_spec.duration_ms, loop=0,
        )
        action_path = output_dir / f"tier-{tier}-action{variant_suffix}{size_suffix}.gif"
        save_gif(action_gif, action_path, action_spec.duration_ms, loop=0)
        outputs[f"action-{size}"] = action_path

        # ── Static PNG (key frame from idle) ──────────────────────
        static_frame = idle_frames[STATIC_FRAME_INDEX].convert("RGB")
        static_path = output_dir / f"tier-{tier}-static{variant_suffix}{size_suffix}.png"
        static_frame.save(str(static_path))
        outputs[f"static-{size}"] = static_path

        if verbose:
            print(
                f"  ✓ tier {tier} @ {size}px — "
                f"idle ({idle_spec.frames}f/{idle_spec.duration_ms}ms) · "
                f"action ({action_spec.frames}f/{action_spec.duration_ms}ms) · "
                f"static"
            )

    # ── Default-size convenience copies (no size suffix) ───────────
    # These are the canonical filenames referenced by rpg.ts and
    # AvatarBadge.tsx — always the DEFAULT_SIZE version.
    if DEFAULT_SIZE in sizes:
        for anim_type in ("idle", "action"):
            src = outputs[f"{anim_type}-{DEFAULT_SIZE}"]
            dst = output_dir / f"tier-{tier}-{anim_type}{variant_suffix}.gif"
            shutil.copy2(str(src), str(dst))
            outputs[anim_type] = dst

        src = outputs[f"static-{DEFAULT_SIZE}"]
        dst = output_dir / f"tier-{tier}-static{variant_suffix}.png"
        shutil.copy2(str(src), str(dst))
        outputs["static"] = dst

    return outputs


# ══════════════════════════════════════════════════════════════════════
#  Per-Class Generation
# ══════════════════════════════════════════════════════════════════════

def generate_class_sprite(
    class_name: str,
    sizes: Optional[List[int]] = None,
    output_dir: Optional[Path] = None,
    verbose: bool = True,
) -> Dict[str, Path]:
    """Generate all avatar assets for a single RPG class.

    Args:
        class_name: One of builder, scribe, strategist, alchemist, polymath.
        sizes: Output pixel sizes (default: CLASS_OUTPUT_SIZES = 64,128,256).
        output_dir: Where to write files (default: AVATAR_DIR).
        verbose: Print per-class output.

    Returns a dict mapping asset key to output path:
        ``{
            "idle-128":   Path("...class-builder-idle-128.gif"),
            "static-128": Path("...class-builder-static-128.png"),
            ...
        }``
    """
    if sizes is None:
        sizes = list(CLASS_OUTPUT_SIZES)
    if output_dir is None:
        output_dir = AVATAR_DIR

    output_dir.mkdir(parents=True, exist_ok=True)

    sprite = get_class_sprite(class_name)
    anims = get_class_animation(class_name)

    outputs: Dict[str, Path] = {}

    for size in sizes:
        size_suffix = f"-{size}" if len(sizes) > 1 else ""

        # ── Idle GIF ──────────────────────────────────────────────
        idle_spec = anims["idle"]
        idle_frames = render_animation_frames(sprite, idle_spec, size)
        idle_gif = frames_to_gif(idle_frames, idle_spec.duration_ms, loop=0)
        idle_path = output_dir / f"class-{class_name}-idle{size_suffix}.gif"
        save_gif(idle_gif, idle_path, idle_spec.duration_ms, loop=0)
        outputs[f"idle-{size}"] = idle_path

        # ── Static PNG (key frame from idle) ──────────────────────
        static_frame = idle_frames[STATIC_FRAME_INDEX].convert("RGB")
        static_path = output_dir / f"class-{class_name}-static{size_suffix}.png"
        static_frame.save(str(static_path))
        outputs[f"static-{size}"] = static_path

        if verbose:
            print(
                f"  ✓ class {class_name} @ {size}px — "
                f"idle ({idle_spec.frames}f/{idle_spec.duration_ms}ms) · "
                f"static"
            )

    # ── Default-size convenience copies (no size suffix) ───────────
    if DEFAULT_SIZE in sizes:
        src = outputs[f"idle-{DEFAULT_SIZE}"]
        dst = output_dir / f"class-{class_name}-idle.gif"
        shutil.copy2(str(src), str(dst))
        outputs["idle"] = dst

        src = outputs[f"static-{DEFAULT_SIZE}"]
        dst = output_dir / f"class-{class_name}-static.png"
        shutil.copy2(str(src), str(dst))
        outputs["static"] = dst

    return outputs


# ══════════════════════════════════════════════════════════════════════
#  Current-Tier Symlinking
# ══════════════════════════════════════════════════════════════════════

def set_current_tier(
    tier: int,
    output_dir: Optional[Path] = None,
    verbose: bool = True,
) -> None:
    """Copy the given tier's canonical GIFs/PNG to ``current-*`` files.

    Uses file copies (not symlinks) for maximum cross-platform compat.
    """
    if output_dir is None:
        output_dir = AVATAR_DIR

    mappings = {
        f"tier-{tier}-idle.gif":   "current-idle.gif",
        f"tier-{tier}-action.gif": "current-action.gif",
        f"tier-{tier}-static.png": "current.png",
    }

    for src_name, dst_name in mappings.items():
        src = output_dir / src_name
        dst = output_dir / dst_name
        if src.exists():
            shutil.copy2(str(src), str(dst))
            if verbose:
                print(f"  → {dst_name} ← {src_name}")
        else:
            if verbose:
                print(f"  ⚠ {src_name} not found — skipping {dst_name}")


# ══════════════════════════════════════════════════════════════════════
#  Sprite Sheet (all tiers side-by-side) — bonus utility
# ══════════════════════════════════════════════════════════════════════

def generate_idle_sprite_sheet(
    size_per: int = 128,
    output_dir: Optional[Path] = None,
) -> Path:
    """Render all 6 tiers' first idle frame side-by-side as a PNG sheet."""
    if output_dir is None:
        output_dir = AVATAR_DIR

    gap = 4
    w = 6 * size_per + 5 * gap
    h = size_per
    sheet = Image.new("RGB", (w, h), BG[:3])

    for i, tier in enumerate(range(1, 7)):
        sprite = get_tier_sprite(tier)
        anims = get_tier_animation(tier)
        idle_spec = anims["idle"]
        # Render frame 0 of idle
        transformed = idle_spec.transform(sprite, 0, idle_spec.frames)
        base = render_sprite(transformed)
        scaled = upscale(base, size_per)
        x = i * (size_per + gap)
        sheet.paste(scaled, (x, 0))

    out = output_dir / "idle-sprite-sheet.png"
    sheet.save(str(out))
    return out


# ══════════════════════════════════════════════════════════════════════
#  CLI
# ══════════════════════════════════════════════════════════════════════

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate animated avatar GIFs for the RPG system",
    )
    parser.add_argument(
        "--tier", type=int, choices=range(1, 7),
        help="Generate a specific tier (1-6). Omit for all.",
    )
    parser.add_argument(
        "--variant", type=str, choices=["early", "advanced", "both"],
        default="early",
        help="Animation variant: early (default), advanced (enhanced effects), or both.",
    )
    parser.add_argument(
        "--current", action="store_true",
        help="Set the generated tier as the current avatar (requires --tier).",
    )
    parser.add_argument(
        "--all-current", type=int, choices=range(1, 7), metavar="TIER",
        help="Generate all 6 tiers and set TIER as current.",
    )
    parser.add_argument(
        "--sizes", type=str, default=None,
        help="Comma-separated output sizes (default: 64,128,256,512).",
    )
    parser.add_argument(
        "--outdir", type=str, default=None,
        help=f"Output directory (default: {AVATAR_DIR}).",
    )
    parser.add_argument(
        "--classes", action="store_true",
        help="Generate class sprites (builder, scribe, strategist, alchemist, polymath).",
    )
    parser.add_argument(
        "--sheet", action="store_true",
        help="Also generate an idle sprite sheet of all tiers.",
    )
    parser.add_argument(
        "-q", "--quiet", action="store_true",
        help="Suppress per-tier output lines.",
    )
    args = parser.parse_args()

    verbose = not args.quiet
    output_dir = Path(args.outdir) if args.outdir else AVATAR_DIR
    sizes = (
        [int(s.strip()) for s in args.sizes.split(",")]
        if args.sizes
        else list(OUTPUT_SIZES)
    )

    # Validate flag combos
    if args.current and not args.tier:
        parser.error("--current requires --tier")

    tiers = (
        [args.tier]
        if args.tier
        else list(range(1, 7))
    )

    variants_to_run = (
        ["early", "advanced"] if args.variant == "both"
        else [args.variant]
    )

    # Include class generation when --classes or --variant both
    generate_classes = args.classes or args.variant == "both"

    if verbose:
        print(f"\n  ╔══ Avatar Generator ══════════════════════════╗")
        print(f"  ║  Tiers:   {', '.join(str(t) for t in tiers):>29s}    ║")
        print(f"  ║  Variant: {', '.join(variants_to_run):>29s}    ║")
        print(f"  ║  Classes: {'yes' if generate_classes else 'no':>29s}    ║")
        print(f"  ║  Sizes:   {', '.join(str(s) for s in sizes):>29s}    ║")
        print(f"  ║  Output:  {str(output_dir)[-29:]:>29s}    ║")
        print(f"  ╚═════════════════════════════════════════════════╝\n")

    t0 = time.time()
    total_files = 0

    for variant in variants_to_run:
        for tier in tiers:
            outputs = generate_tier(
                tier,
                sizes=sizes,
                output_dir=output_dir,
                variant=variant,
                verbose=verbose,
            )
            total_files += len(outputs)

    # ── Class sprites ─────────────────────────────────────────────
    if generate_classes:
        class_sizes = [s for s in sizes if s in CLASS_OUTPUT_SIZES] or list(CLASS_OUTPUT_SIZES)
        for class_name in CLASS_NAMES:
            cls_outputs = generate_class_sprite(
                class_name,
                sizes=class_sizes,
                output_dir=output_dir,
                verbose=verbose,
            )
            total_files += len(cls_outputs)

    # Handle --current / --all-current
    current_tier = args.all_current if args.all_current else (
        args.tier if args.current else None
    )
    if current_tier:
        set_current_tier(current_tier, output_dir=output_dir, verbose=verbose)
        total_files += 3  # current-idle.gif, current-action.gif, current.png

    # Optional sprite sheet
    if args.sheet:
        sheet_path = generate_idle_sprite_sheet(
            size_per=128, output_dir=output_dir,
        )
        total_files += 1
        if verbose:
            print(f"  ✓ sprite sheet → {sheet_path.name}")

    elapsed = time.time() - t0
    if verbose:
        print(
            f"\n  Done — {total_files} files generated "
            f"in {elapsed:.1f}s → {output_dir}/\n"
        )


if __name__ == "__main__":
    main()
