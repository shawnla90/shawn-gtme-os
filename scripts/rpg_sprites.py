#!/usr/bin/env python3
"""
RPG sprite definitions for the GTM OS avatar system.

Defines 6-tier pixel-art character sprites (32×32) using a body-part / equipment
layering system.  Each sprite is a dict of named ``BodyPart`` objects containing
``Rect`` and ``Pixel`` drawing primitives with z-ordering for proper overlap.

The base humanoid body is shared across tiers; each tier adds distinctive
equipment (hoods, robes, armor, weapons, wings) and a unique color palette.

Frame transformation functions let ``avatar_generator.py`` produce animated GIF
frames by shifting, recoloring, or adding/removing body parts per frame.

Used by:
    scripts/avatar_generator.py   — renders animated GIFs from these defs
    scripts/progression_engine.py — selects tier based on XP, triggers render

Standalone test:
    python3 scripts/rpg_sprites.py              # render all 6 tiers
    python3 scripts/rpg_sprites.py --tier 3     # render one tier
"""

from __future__ import annotations

import argparse
import copy
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Dict, List, Tuple

from PIL import Image

# ══════════════════════════════════════════════════════════════════════
#  Paths
# ══════════════════════════════════════════════════════════════════════

REPO_ROOT  = Path(__file__).resolve().parent.parent
AVATAR_DIR = REPO_ROOT / "data" / "progression" / "avatars"

# ══════════════════════════════════════════════════════════════════════
#  Grid Constants
# ══════════════════════════════════════════════════════════════════════

GRID          = 32                 # sprite canvas size (px)
UPSCALE       = 4                  # default 32 → 128
OUTPUT_SIZES  = [64, 128, 256, 512]

# ══════════════════════════════════════════════════════════════════════
#  Design-System Colors
# ══════════════════════════════════════════════════════════════════════

BG          = (12,  13,  17)       # terminal dark background
SKIN        = (200, 175, 150)      # base skin
SKIN_SHADOW = (160, 135, 110)      # skin shading
CLOTH_MID   = (70,  75,  88)      # default clothing
CLOTH_DARK  = (50,  54,  64)      # dark clothing
BOOT_MID    = (55,  58,  68)      # boots
BOOT_DARK   = (40,  42,  50)      # boot soles
HAIR_DARK   = (45,  35,  30)      # default hair
EYE         = (220, 235, 255)     # eye highlight
PARCHMENT   = (220, 210, 180)     # scroll / paper
PARCH_DARK  = (190, 180, 150)     # scroll shading
METAL_LIGHT = (180, 190, 205)     # metal highlights
METAL_MID   = (130, 140, 155)     # metal mid-tone
METAL_DARK  = (90,  95,  110)     # metal shadows

# ══════════════════════════════════════════════════════════════════════
#  Tier Palettes — maps to avatar_tier in rpg.ts TITLE_TABLE
# ══════════════════════════════════════════════════════════════════════

PALETTES: Dict[int, Dict[str, tuple]] = {
    1: {  # Terminal Initiate / Prompt Apprentice
        "primary":   (136, 146, 164),      # #8892A4 muted gray
        "secondary": (100, 108, 122),
        "dark":      (70,  76,  90),
        "highlight": (180, 190, 210),
        "glow":      (136, 146, 164),
        "accent":    (180, 70,  70),       # muted red
    },
    2: {  # Repo Architect / Pipeline Runner
        "primary":   (78,  195, 115),      # #4EC373 green
        "secondary": (55,  150, 85),
        "dark":      (35,  110, 60),
        "highlight": (120, 220, 155),
        "glow":      (78,  195, 115),
        "accent":    (220, 60,  60),       # bright red
    },
    3: {  # Context Weaver / Skill Forger
        "primary":   (80,  190, 220),      # #50BEDC cyan
        "secondary": (55,  150, 180),
        "dark":      (35,  110, 140),
        "highlight": (140, 220, 245),
        "glow":      (80,  190, 220),
        "accent":    (170, 65,  65),       # subtle red
    },
    4: {  # Voice Alchemist / System Sovereign
        "primary":   (220, 170, 60),       # #DCAA3C amber
        "secondary": (180, 135, 40),
        "dark":      (130, 100, 25),
        "highlight": (245, 205, 100),
        "glow":      (220, 170, 60),
        "accent":    (200, 75,  50),       # warm red
    },
    5: {  # OS Architect / Cursor Slayer
        "primary":   (160, 120, 220),      # #A078DC purple
        "secondary": (125, 90,  180),
        "dark":      (85,  60,  135),
        "highlight": (195, 160, 245),
        "glow":      (160, 120, 220),
        "accent":    (190, 70,  80),       # subtle red
    },
    6: {  # Grand Master Cursor Slayer
        "primary":   (255, 200, 60),       # #FFC83C gold
        "secondary": (210, 160, 30),
        "dark":      (165, 120, 10),
        "highlight": (255, 225, 120),
        "glow":      (255, 200, 60),
        "accent":    (240, 80,  60),       # most red (Grand Master)
    },
}

# ══════════════════════════════════════════════════════════════════════
#  Class Palettes — RPG class color identities
# ══════════════════════════════════════════════════════════════════════

CLASS_PALETTES: Dict[str, Dict[str, tuple]] = {
    "builder": {
        "primary":   (100, 140, 180),      # steel blue
        "secondary": (70,  105, 145),
        "dark":      (45,  70,  100),
        "highlight": (140, 175, 210),
        "accent":    (220, 150, 50),       # orange sparks
        "accent2":   (255, 180, 60),       # bright orange
    },
    "scribe": {
        "primary":   (65,  95,  165),      # ink blue
        "secondary": (45,  70,  130),
        "dark":      (30,  50,  95),
        "highlight": (100, 130, 200),
        "accent":    (220, 210, 180),      # parchment
        "accent2":   (190, 180, 150),      # parchment shadow
    },
    "strategist": {
        "primary":   (75,  110, 60),       # military green
        "secondary": (55,  85,  45),
        "dark":      (35,  60,  30),
        "highlight": (110, 150, 90),
        "accent":    (200, 170, 50),       # gold pins
        "accent2":   (220, 190, 70),       # bright gold
    },
    "alchemist": {
        "primary":   (110, 60,  150),      # deep purple
        "secondary": (80,  45,  115),
        "dark":      (55,  30,  80),
        "highlight": (150, 95,  190),
        "accent":    (80,  200, 120),      # green liquid glow
        "accent2":   (60,  170, 100),      # green shadow
    },
    "polymath": {
        "primary":   (140, 120, 170),      # blended purple-blue
        "secondary": (105, 90,  135),
        "dark":      (70,  60,  95),
        "highlight": (175, 155, 205),
        "accent":    (200, 170, 100),      # warm gold blend
        "accent2":   (100, 170, 160),      # teal blend
    },
}

# ══════════════════════════════════════════════════════════════════════
#  Nio Avatar Palette — Green Astro Bot (Website Guardian)
# ══════════════════════════════════════════════════════════════════════

NIO_PALETTE: Dict[str, tuple] = {
    "primary":     (78,  195, 115),   # #4EC373 main green plating
    "secondary":   (42,  139, 78),    # #2A8B4E darker green
    "dark":        (25,  80,  45),    # deep green joints / shadows
    "highlight":   (127, 255, 170),   # #7FFFAA bright mint glow
    "glow":        (78,  195, 115),   # #4EC373 energy glow
    "visor_bg":    (15,  20,  30),    # dark visor glass
    "visor_glow":  (100, 255, 150),   # bright green eye glow
    "metal":       (55,  65,  75),    # dark metal frame
    "metal_light": (90,  105, 120),   # lighter metal accents
    "energy":      (150, 255, 200),   # energy effects (sword / wings)
    "core":        (200, 255, 220),   # core power light
}

# ══════════════════════════════════════════════════════════════════════
#  Partner Tool Palettes
# ══════════════════════════════════════════════════════════════════════

CLAY_PALETTE: Dict[str, tuple] = {
    "primary":     (255, 120, 80),    # warm coral/orange
    "secondary":   (255, 200, 60),    # golden yellow
    "dark":        (120, 50, 30),     # deep brown shadow
    "highlight":   (120, 220, 255),   # sky blue highlight
    "glow":        (200, 100, 255),   # violet glow
    "accent":      (80, 220, 130),    # green accent
    # Rainbow cycle stops
    "rainbow_1":   (255, 120, 80),    # coral
    "rainbow_2":   (255, 200, 60),    # yellow
    "rainbow_3":   (80, 220, 130),    # green
    "rainbow_4":   (120, 220, 255),   # blue
    "rainbow_5":   (200, 100, 255),   # violet
}

INSTANTLY_PALETTE: Dict[str, tuple] = {
    "primary":     (85, 222, 252),    # #55DEFC cyan
    "secondary":   (40, 140, 200),    # deeper blue
    "dark":        (20, 60, 100),     # navy shadow
    "highlight":   (227, 244, 1),     # #E3F401 yellow
    "glow":        (120, 240, 255),   # bright cyan glow
    "accent":      (255, 255, 100),   # spark yellow
    "bolt":        (255, 255, 255),   # white-hot bolt center
}

HEYREACH_PALETTE: Dict[str, tuple] = {
    "primary":     (124, 58, 237),    # rich purple
    "secondary":   (90, 40, 180),     # deeper purple
    "dark":        (45, 20, 90),      # shadow purple
    "highlight":   (180, 140, 255),   # lavender highlight
    "glow":        (160, 100, 255),   # purple glow
    "accent":      (0, 119, 181),     # LinkedIn blue accent
    "ring":        (200, 170, 255),   # connection ring color
}

OUROBOROS_PALETTE: Dict[str, tuple] = {
    "primary":   (78,  195, 115),   # green scales
    "secondary": (45,  140, 75),    # darker green shading
    "dark":      (25,  80,  45),    # deep shadow
    "highlight": (127, 255, 170),   # mint glow
    "glow":      (90,  220, 130),   # energy glow
    "accent":    (220, 60,  50),    # red (eyes, jaw)
    "gold":      (220, 190, 60),    # gold (horns, belly, bite)
    "gold_dark": (170, 140, 30),    # darker gold
}

# ══════════════════════════════════════════════════════════════════════
#  Drawing Primitives & Types
# ══════════════════════════════════════════════════════════════════════

@dataclass
class Rect:
    """Filled rectangle from (x1, y1) to (x2, y2), inclusive."""
    x1: int; y1: int; x2: int; y2: int
    color: tuple

@dataclass
class Pixel:
    """Single pixel at (x, y)."""
    x: int; y: int
    color: tuple

@dataclass
class BodyPart:
    """Named sprite component with drawing primitives and z-order."""
    name: str
    primitives: list            # List[Rect | Pixel]
    z_order: int = 0            # lower = drawn first (behind)

# A complete sprite is a dict of part-name → BodyPart
Sprite = Dict[str, BodyPart]

# ══════════════════════════════════════════════════════════════════════
#  Core Drawing Engine
# ══════════════════════════════════════════════════════════════════════

def draw_sprite(img: Image.Image, sprite: Sprite,
                ox: int = 0, oy: int = 0) -> None:
    """Render every body part onto *img*, respecting z-order."""
    w, h = img.size
    for part in sorted(sprite.values(), key=lambda p: p.z_order):
        for prim in part.primitives:
            if isinstance(prim, Rect):
                for y in range(prim.y1, prim.y2 + 1):
                    for x in range(prim.x1, prim.x2 + 1):
                        px, py = x + ox, y + oy
                        if 0 <= px < w and 0 <= py < h:
                            img.putpixel((px, py), prim.color[:3])
            elif isinstance(prim, Pixel):
                px, py = prim.x + ox, prim.y + oy
                if 0 <= px < w and 0 <= py < h:
                    img.putpixel((px, py), prim.color[:3])


def render_sprite(sprite: Sprite, bg: tuple = BG) -> Image.Image:
    """Render a 32×32 sprite to an RGB PIL Image."""
    img = Image.new("RGB", (GRID, GRID), bg[:3])
    draw_sprite(img, sprite)
    return img


def upscale(img: Image.Image, size: int) -> Image.Image:
    """Nearest-neighbor upscale for crispy pixel art."""
    return img.resize((size, size), Image.NEAREST)

# ══════════════════════════════════════════════════════════════════════
#  Sprite Transform Utilities
# ══════════════════════════════════════════════════════════════════════

def deep_copy_sprite(sprite: Sprite) -> Sprite:
    """Deep-copy so transforms never mutate the original."""
    return {
        name: BodyPart(
            name=p.name,
            primitives=[copy.copy(pr) for pr in p.primitives],
            z_order=p.z_order,
        )
        for name, p in sprite.items()
    }


def _shift_prims(prims: list, dx: int, dy: int) -> list:
    """Return new list of primitives shifted by (dx, dy)."""
    out: list = []
    for pr in prims:
        if isinstance(pr, Rect):
            out.append(Rect(pr.x1 + dx, pr.y1 + dy,
                            pr.x2 + dx, pr.y2 + dy, pr.color))
        elif isinstance(pr, Pixel):
            out.append(Pixel(pr.x + dx, pr.y + dy, pr.color))
    return out


def shift_part(sprite: Sprite, part_name: str,
               dx: int = 0, dy: int = 0) -> Sprite:
    """Return new sprite with *part_name* shifted by (dx, dy)."""
    s = deep_copy_sprite(sprite)
    if part_name in s:
        s[part_name].primitives = _shift_prims(s[part_name].primitives, dx, dy)
    return s


def shift_all(sprite: Sprite, dx: int = 0, dy: int = 0) -> Sprite:
    """Shift every body part by (dx, dy)."""
    s = deep_copy_sprite(sprite)
    for part in s.values():
        part.primitives = _shift_prims(part.primitives, dx, dy)
    return s


def brightness(color: tuple, amount: int) -> tuple:
    """Clamp-shift color brightness."""
    return tuple(max(0, min(255, c + amount)) for c in color[:3])


def pulse_color(base: tuple, frame: int, total: int,
                amplitude: int = 40) -> tuple:
    """Sinusoidal brightness pulse over *total* frames."""
    t = math.sin(2 * math.pi * frame / total)
    return brightness(base, int(t * amplitude))


def brighten_part(sprite: Sprite, part_name: str, amount: int) -> Sprite:
    """Brightness-shift all colors in a body part."""
    s = deep_copy_sprite(sprite)
    if part_name not in s:
        return s
    new: list = []
    for pr in s[part_name].primitives:
        c = brightness(pr.color, amount)
        if isinstance(pr, Rect):
            new.append(Rect(pr.x1, pr.y1, pr.x2, pr.y2, c))
        elif isinstance(pr, Pixel):
            new.append(Pixel(pr.x, pr.y, c))
    s[part_name].primitives = new
    return s


def add_pixels(sprite: Sprite, part_name: str,
               pixels: List[Tuple[int, int, tuple]],
               z_order: int = 30) -> Sprite:
    """Add pixel primitives under *part_name* (creates part if missing)."""
    s = deep_copy_sprite(sprite)
    new_prims = [Pixel(x, y, c) for x, y, c in pixels]
    if part_name in s:
        s[part_name].primitives.extend(new_prims)
    else:
        s[part_name] = BodyPart(part_name, new_prims, z_order)
    return s


def remove_part(sprite: Sprite, part_name: str) -> Sprite:
    """Return sprite without the named part."""
    s = deep_copy_sprite(sprite)
    s.pop(part_name, None)
    return s

# ══════════════════════════════════════════════════════════════════════
#  Base Humanoid Body
# ══════════════════════════════════════════════════════════════════════
#
#  Layout on the 32×32 grid (approximate pixel ranges):
#
#      y  4      : hair top
#      y  5-9    : head / face (6 wide × 5 tall)
#      y  10     : neck
#      y  11-16  : torso (6 wide × 6 tall)
#      y  17-22  : legs (2 wide × 6 tall each, 2 px gap)
#      y  23     : feet (3 wide × 1 tall each)
#      x  11-20  : full width including arms
#      x  13-18  : core body width
#

def _base_body(cloth: tuple = CLOTH_MID,
               cloth_dark: tuple = CLOTH_DARK,
               boot: tuple = BOOT_MID,
               boot_dark: tuple = BOOT_DARK) -> Sprite:
    """Shared humanoid skeleton.  Tiers overlay/replace parts as needed."""
    return {
        "head": BodyPart("head", [
            Rect(13, 4, 18, 4, HAIR_DARK),         # hair top row
            Rect(13, 5, 18, 9, SKIN),              # face block
            Pixel(14, 7, EYE),                      # left eye
            Pixel(17, 7, EYE),                      # right eye
            Pixel(15, 9, SKIN_SHADOW),              # mouth L
            Pixel(16, 9, SKIN_SHADOW),              # mouth R
        ], z_order=20),

        "body": BodyPart("body", [
            Rect(15, 10, 16, 10, SKIN),             # neck
            Rect(13, 11, 18, 16, cloth),            # torso
            Rect(13, 15, 18, 15, cloth_dark),       # belt line
        ], z_order=10),

        "arms": BodyPart("arms", [
            Rect(11, 11, 12, 15, cloth),            # left arm
            Rect(19, 11, 20, 15, cloth),            # right arm
            Pixel(11, 16, SKIN),                    # left hand
            Pixel(20, 16, SKIN),                    # right hand
        ], z_order=15),

        "legs": BodyPart("legs", [
            Rect(13, 17, 14, 22, boot),             # left leg
            Rect(17, 17, 18, 22, boot),             # right leg
            Rect(12, 23, 14, 23, boot_dark),        # left foot
            Rect(17, 23, 19, 23, boot_dark),        # right foot
        ], z_order=5),
    }

# ══════════════════════════════════════════════════════════════════════
#  Tier 1 — Terminal Initiate  (hooded figure + cursor staff)
# ══════════════════════════════════════════════════════════════════════

def _tier1_sprite() -> Sprite:
    p = PALETTES[1]
    return {
        # ── Face (visible under hood) ──
        "face": BodyPart("face", [
            Rect(13, 6, 18, 9, SKIN),              # face area
            Pixel(14, 7, EYE),                      # left eye
            Pixel(17, 7, EYE),                      # right eye
            Pixel(15, 9, SKIN_SHADOW),              # mouth
            Pixel(16, 9, SKIN_SHADOW),
        ], z_order=20),

        # ── Hood ──
        "hood": BodyPart("hood", [
            # Peak
            Pixel(15, 2, p["dark"]),
            Pixel(16, 2, p["dark"]),
            Rect(14, 3, 17, 3, p["secondary"]),
            # Brim
            Rect(12, 4, 19, 5, p["primary"]),
            # Under-hood forehead shadow
            Rect(13, 5, 18, 5, (50, 45, 40)),
            # Side drapes
            Pixel(12, 6, p["secondary"]),
            Pixel(12, 7, p["secondary"]),
            Pixel(12, 8, p["dark"]),
            Pixel(12, 9, p["dark"]),
            Pixel(19, 6, p["secondary"]),
            Pixel(19, 7, p["secondary"]),
            Pixel(19, 8, p["dark"]),
            Pixel(19, 9, p["dark"]),
        ], z_order=25),

        # ── Robe (covers torso + legs) ──
        "robe": BodyPart("robe", [
            Rect(13, 10, 18, 10, p["dark"]),        # collar
            Rect(12, 11, 19, 21, p["secondary"]),   # main body
            Rect(11, 22, 20, 23, p["dark"]),        # hem flare
            # Center seam
            Pixel(15, 13, p["dark"]),
            Pixel(16, 13, p["dark"]),
            Pixel(15, 16, p["dark"]),
            Pixel(16, 16, p["dark"]),
            Pixel(15, 19, p["dark"]),
            Pixel(16, 19, p["dark"]),
        ], z_order=10),

        # ── Staff shaft ──
        "staff_shaft": BodyPart("staff_shaft", [
            Rect(22, 6, 22, 16, p["secondary"]),    # shaft
            Pixel(21, 14, SKIN),                     # grip hand upper
            Pixel(21, 15, SKIN),                     # grip hand lower
        ], z_order=22),

        # ── Cursor block (separate part for blink animation) ──
        "cursor_block": BodyPart("cursor_block", [
            Rect(21, 3, 23, 5, p["highlight"]),     # bright cursor
        ], z_order=23),
    }

# ══════════════════════════════════════════════════════════════════════
#  Tier 2 — Repo Architect  (adventurer + scroll + tool belt)
# ══════════════════════════════════════════════════════════════════════

def _tier2_sprite() -> Sprite:
    p = PALETTES[2]
    s = _base_body(cloth=p["secondary"], cloth_dark=p["dark"],
                   boot=p["dark"], boot_dark=(30, 32, 38))

    # Headband over hair
    s["head"] = BodyPart("head", [
        Rect(13, 4, 18, 4, HAIR_DARK),              # hair row
        Rect(13, 5, 18, 9, SKIN),                   # face
        Rect(13, 5, 18, 5, p["primary"]),            # headband (over hair)
        Pixel(14, 7, EYE),
        Pixel(17, 7, EYE),
        Pixel(15, 9, SKIN_SHADOW),
        Pixel(16, 9, SKIN_SHADOW),
    ], z_order=20)

    # Tunic with belt pouches
    s["body"] = BodyPart("body", [
        Rect(15, 10, 16, 10, SKIN),                 # neck
        Rect(13, 11, 18, 16, p["secondary"]),        # tunic
        Rect(13, 15, 18, 15, p["dark"]),             # belt
        Pixel(12, 15, p["dark"]),                    # pouch L top
        Pixel(12, 16, p["dark"]),                    # pouch L bot
        Pixel(19, 15, p["dark"]),                    # pouch R top
        Pixel(19, 16, p["dark"]),                    # pouch R bot
    ], z_order=10)

    # Arms in tunic color
    s["arms"] = BodyPart("arms", [
        Rect(11, 11, 12, 15, p["secondary"]),
        Rect(19, 11, 20, 15, p["secondary"]),
        Pixel(11, 16, SKIN),
        Pixel(20, 16, SKIN),
    ], z_order=15)

    # Code scroll (left hand)
    s["scroll"] = BodyPart("scroll", [
        Rect(8, 12, 10, 12, PARCH_DARK),            # top roll
        Rect(8, 13, 10, 18, PARCHMENT),             # parchment
        Rect(8, 19, 10, 19, PARCH_DARK),            # bottom roll
        # Text lines
        Pixel(9, 14, p["primary"]),
        Pixel(9, 15, p["primary"]),
        Pixel(9, 16, p["primary"]),
        Pixel(9, 17, p["primary"]),
    ], z_order=18)

    return s

# ══════════════════════════════════════════════════════════════════════
#  Tier 3 — Context Weaver  (mage + pointed hat + orb staff)
# ══════════════════════════════════════════════════════════════════════

def _tier3_sprite() -> Sprite:
    p = PALETTES[3]
    return {
        # ── Pointed wizard hat ──
        "hat": BodyPart("hat", [
            Pixel(16, 0, p["secondary"]),            # tip
            Rect(15, 1, 17, 1, p["primary"]),
            Rect(14, 2, 18, 2, p["primary"]),
            Rect(13, 3, 19, 3, p["secondary"]),
            Rect(12, 4, 20, 4, p["dark"]),           # brim
        ], z_order=25),

        # ── Face ──
        "face": BodyPart("face", [
            Rect(13, 5, 18, 9, SKIN),
            Pixel(14, 7, EYE),
            Pixel(17, 7, EYE),
            Pixel(15, 9, SKIN_SHADOW),
            Pixel(16, 9, SKIN_SHADOW),
        ], z_order=20),

        # ── Mage robes ──
        "robe": BodyPart("robe", [
            Rect(15, 10, 16, 10, SKIN),              # neck
            Rect(13, 11, 18, 13, p["primary"]),       # upper robe
            Rect(13, 14, 18, 14, p["highlight"]),     # sash
            Rect(12, 15, 19, 21, p["secondary"]),     # lower robe
            Rect(11, 22, 20, 23, p["dark"]),          # hem
        ], z_order=8),

        # ── Wide sleeves ──
        "sleeves": BodyPart("sleeves", [
            Rect(10, 11, 12, 14, p["primary"]),       # left sleeve
            Rect(10, 15, 12, 16, p["dark"]),           # left cuff
            Pixel(10, 17, SKIN),                       # left hand
            Rect(19, 11, 21, 14, p["primary"]),        # right sleeve
            Rect(19, 15, 21, 16, p["dark"]),            # right cuff
            Pixel(21, 17, SKIN),                        # right hand
        ], z_order=15),

        # ── Staff shaft ──
        "staff_shaft": BodyPart("staff_shaft", [
            Rect(23, 7, 23, 17, p["dark"]),            # shaft
            Pixel(22, 16, SKIN),                        # grip
        ], z_order=22),

        # ── Glowing orb (separate for pulse animation) ──
        "orb": BodyPart("orb", [
            Rect(22, 4, 24, 6, p["highlight"]),        # orb core
            Pixel(23, 3, p["primary"]),                 # corona top
            Pixel(21, 5, p["glow"]),                    # glow L
            Pixel(25, 5, p["glow"]),                    # glow R
            Pixel(23, 7, p["glow"]),                    # glow B
        ], z_order=24),
    }

# ══════════════════════════════════════════════════════════════════════
#  Tier 4 — Voice Alchemist  (shoulder armor + half cape + flask)
# ══════════════════════════════════════════════════════════════════════

def _tier4_sprite() -> Sprite:
    p = PALETTES[4]
    s = _base_body(cloth=p["secondary"], cloth_dark=p["dark"],
                   boot=p["dark"], boot_dark=(30, 28, 18))

    # Circlet with center gem
    s["head"] = BodyPart("head", [
        Rect(13, 4, 18, 4, HAIR_DARK),
        Rect(13, 5, 18, 9, SKIN),
        Rect(13, 4, 18, 4, p["primary"]),            # circlet
        Pixel(15, 4, p["highlight"]),                 # gem
        Pixel(16, 4, p["highlight"]),
        Pixel(14, 7, EYE),
        Pixel(17, 7, EYE),
        Pixel(15, 9, SKIN_SHADOW),
        Pixel(16, 9, SKIN_SHADOW),
    ], z_order=20)

    # Shoulder pauldrons
    s["armor"] = BodyPart("armor", [
        Rect(10, 10, 12, 12, p["primary"]),           # left pauldron
        Rect(19, 10, 21, 12, p["primary"]),           # right pauldron
        Pixel(10, 10, p["highlight"]),                 # L shine
        Pixel(21, 10, p["highlight"]),                 # R shine
    ], z_order=18)

    # Half cape (left side, behind body)
    s["cape"] = BodyPart("cape", [
        Rect(9, 12, 10, 20, p["secondary"]),          # cape body
        Rect(9, 21, 11, 23, p["dark"]),               # cape tail
    ], z_order=3)

    # Belt with vials
    s["belt_vials"] = BodyPart("belt_vials", [
        Rect(13, 15, 18, 15, p["dark"]),              # belt
        Pixel(14, 16, p["secondary"]),                 # vial 1
        Pixel(15, 16, p["primary"]),                   # vial 2
        Pixel(17, 16, p["secondary"]),                 # vial 3
    ], z_order=12)

    # Alchemist flask (right hand)
    s["flask"] = BodyPart("flask", [
        Pixel(22, 10, p["highlight"]),                 # cork
        Rect(22, 11, 22, 12, p["secondary"]),          # flask neck
        Rect(21, 13, 23, 16, p["primary"]),            # flask body
        Pixel(22, 15, p["highlight"]),                 # liquid glow
        Pixel(22, 16, p["highlight"]),
    ], z_order=22)

    return s

# ══════════════════════════════════════════════════════════════════════
#  Tier 5 — OS Architect  (knight + helmet + sword + shield + cape)
# ══════════════════════════════════════════════════════════════════════

def _tier5_sprite() -> Sprite:
    p = PALETTES[5]
    s = _base_body(cloth=METAL_MID, cloth_dark=METAL_DARK,
                   boot=METAL_DARK, boot_dark=(50, 48, 58))

    # Full helmet with visor
    s["head"] = BodyPart("head", [
        Rect(13, 3, 18, 9, METAL_MID),               # helmet shell
        Rect(12, 5, 19, 5, METAL_MID),                # wider brow
        Rect(13, 5, 18, 5, METAL_LIGHT),              # brow ridge
        # Plume
        Pixel(15, 2, p["primary"]),
        Pixel(16, 2, p["highlight"]),
        Pixel(16, 3, p["primary"]),
        # Visor slit with eye glow
        Rect(14, 7, 17, 7, (20, 18, 25)),
        Pixel(14, 7, p["highlight"]),                  # L eye glow
        Pixel(17, 7, p["highlight"]),                  # R eye glow
    ], z_order=20)

    # Chest armor overlay
    s["armor"] = BodyPart("armor", [
        Rect(13, 11, 18, 16, METAL_MID),              # chest plate
        Rect(14, 12, 17, 13, METAL_LIGHT),            # highlight
        Pixel(15, 14, p["primary"]),                   # emblem L
        Pixel(16, 14, p["primary"]),                   # emblem R
        # Pauldrons
        Rect(10, 10, 12, 12, METAL_MID),
        Rect(19, 10, 21, 12, METAL_MID),
        Pixel(10, 10, METAL_LIGHT),
        Pixel(21, 10, METAL_LIGHT),
    ], z_order=12)

    # Metal arms
    s["arms"] = BodyPart("arms", [
        Rect(11, 11, 12, 15, METAL_DARK),
        Rect(19, 11, 20, 15, METAL_DARK),
        Pixel(11, 16, METAL_MID),                     # gauntlet L
        Pixel(20, 16, METAL_MID),                     # gauntlet R
    ], z_order=15)

    # Flowing cape (both sides, behind body)
    s["cape"] = BodyPart("cape", [
        Rect(9,  12, 10, 22, p["secondary"]),          # left cape
        Rect(21, 12, 22, 22, p["secondary"]),          # right cape
        Rect(8,  22, 10, 24, p["dark"]),               # L tail
        Rect(21, 22, 23, 24, p["dark"]),               # R tail
    ], z_order=2)

    # Sword (right side, extending upward)
    s["sword_blade"] = BodyPart("sword_blade", [
        Rect(23, 1, 23, 12, METAL_LIGHT),             # blade
        Pixel(23, 0, (230, 240, 255)),                 # tip shine
    ], z_order=22)

    s["sword_hilt"] = BodyPart("sword_hilt", [
        Rect(22, 13, 24, 13, p["primary"]),            # cross-guard
        Rect(23, 14, 23, 16, p["dark"]),               # grip
        Pixel(23, 17, p["highlight"]),                  # pommel
    ], z_order=22)

    # Shield (left arm)
    s["shield"] = BodyPart("shield", [
        Rect(7,  12, 10, 18, p["primary"]),            # shield face
        Rect(8,  13, 9,  17, p["secondary"]),          # inner field
        Pixel(8, 15, p["highlight"]),                   # emblem
        Pixel(9, 15, p["highlight"]),
        Pixel(7, 12, p["highlight"]),                   # edge L
        Pixel(10, 12, p["highlight"]),                  # edge R
    ], z_order=18)

    return s

# ══════════════════════════════════════════════════════════════════════
#  Tier 6 — Grand Master  (crown + full armor + energy wings + aura)
# ══════════════════════════════════════════════════════════════════════

def _tier6_sprite() -> Sprite:
    p = PALETTES[6]
    s = _base_body(cloth=p["secondary"], cloth_dark=p["dark"],
                   boot=p["dark"], boot_dark=(100, 80, 10))

    # Crown
    s["crown"] = BodyPart("crown", [
        Rect(13, 3, 18, 4, p["primary"]),              # crown band
        Pixel(13, 2, p["highlight"]),                   # L point
        Pixel(15, 1, p["highlight"]),                   # center point L
        Pixel(16, 1, p["highlight"]),                   # center point R
        Pixel(18, 2, p["highlight"]),                   # R point
        Pixel(14, 3, (220, 50, 50)),                    # ruby
        Pixel(16, 3, (50, 180, 220)),                   # sapphire
    ], z_order=28)

    # Royal face with golden eyes
    s["head"] = BodyPart("head", [
        Rect(13, 4, 18, 9, SKIN),
        Pixel(14, 7, p["highlight"]),                   # golden eye L
        Pixel(17, 7, p["highlight"]),                   # golden eye R
        Pixel(15, 9, SKIN_SHADOW),
        Pixel(16, 9, SKIN_SHADOW),
    ], z_order=20)

    # Ornate full armor
    s["armor"] = BodyPart("armor", [
        Rect(13, 11, 18, 16, p["primary"]),            # chest plate
        Rect(14, 12, 17, 13, p["highlight"]),          # highlight
        Pixel(15, 14, (255, 255, 255)),                 # central gem L
        Pixel(16, 14, (255, 255, 255)),                 # central gem R
        # Grand pauldrons (wider than T5)
        Rect(9,  10, 12, 12, p["primary"]),
        Rect(19, 10, 22, 12, p["primary"]),
        Rect(9,  10, 10, 10, p["highlight"]),
        Rect(21, 10, 22, 10, p["highlight"]),
    ], z_order=14)

    # Gold-armored arms
    s["arms"] = BodyPart("arms", [
        Rect(11, 11, 12, 15, p["secondary"]),
        Rect(19, 11, 20, 15, p["secondary"]),
        Pixel(11, 16, p["primary"]),                   # gauntlet L
        Pixel(20, 16, p["primary"]),                   # gauntlet R
    ], z_order=15)

    # Armored legs
    s["legs"] = BodyPart("legs", [
        Rect(13, 17, 14, 22, p["secondary"]),
        Rect(17, 17, 18, 22, p["secondary"]),
        Rect(12, 23, 14, 23, p["dark"]),
        Rect(17, 23, 19, 23, p["dark"]),
    ], z_order=5)

    # Energy wings (widest tier — extends well beyond body)
    s["wings"] = BodyPart("wings", [
        # Left wing (ascending outward)
        Pixel(8,  12, p["highlight"]),
        Pixel(7,  11, p["primary"]),
        Pixel(6,  10, p["primary"]),
        Pixel(5,   9, p["highlight"]),
        Pixel(4,   8, p["glow"]),
        Pixel(8,  14, p["primary"]),
        Pixel(7,  13, p["highlight"]),
        Pixel(6,  12, p["primary"]),
        Pixel(5,  11, p["glow"]),
        Pixel(8,  16, p["secondary"]),
        Pixel(7,  15, p["primary"]),
        Pixel(6,  14, p["glow"]),
        # Right wing (mirror)
        Pixel(23, 12, p["highlight"]),
        Pixel(24, 11, p["primary"]),
        Pixel(25, 10, p["primary"]),
        Pixel(26,  9, p["highlight"]),
        Pixel(27,  8, p["glow"]),
        Pixel(23, 14, p["primary"]),
        Pixel(24, 13, p["highlight"]),
        Pixel(25, 12, p["primary"]),
        Pixel(26, 11, p["glow"]),
        Pixel(23, 16, p["secondary"]),
        Pixel(24, 15, p["primary"]),
        Pixel(25, 14, p["glow"]),
    ], z_order=1)

    # Static aura particles (animation adds dynamic ones)
    s["aura"] = BodyPart("aura", [
        Pixel(10, 5,  p["glow"]),
        Pixel(21, 5,  p["glow"]),
        Pixel(6,  17, p["glow"]),
        Pixel(25, 17, p["glow"]),
        Pixel(15, 26, p["glow"]),
        Pixel(16, 26, p["glow"]),
    ], z_order=0)

    return s

# ══════════════════════════════════════════════════════════════════════
#  Class Sprites — one per RPG class (32×32 grid)
# ══════════════════════════════════════════════════════════════════════

# ── Builder ───────────────────────────────────────────────────────────

def _class_builder_sprite() -> Sprite:
    """Builder class — hard hat, wrench in right hand, terminal monitor on left."""
    p = CLASS_PALETTES["builder"]
    s = _base_body(cloth=p["secondary"], cloth_dark=p["dark"],
                   boot=p["dark"], boot_dark=(35, 40, 50))

    # Hard hat (replaces default head)
    s["head"] = BodyPart("head", [
        Rect(13, 2, 18, 3, p["accent"]),             # hat dome
        Rect(12, 4, 19, 4, p["accent"]),             # hat brim (wide)
        Pixel(15, 2, p["accent2"]),                   # hat shine L
        Pixel(16, 2, p["accent2"]),                   # hat shine R
        # Face below hat
        Rect(13, 5, 18, 9, SKIN),
        Pixel(14, 7, EYE),
        Pixel(17, 7, EYE),
        Pixel(15, 9, SKIN_SHADOW),
        Pixel(16, 9, SKIN_SHADOW),
    ], z_order=20)

    # Arms in work clothes
    s["arms"] = BodyPart("arms", [
        Rect(11, 11, 12, 15, p["secondary"]),
        Rect(19, 11, 20, 15, p["secondary"]),
        Pixel(11, 16, SKIN),                          # left hand
        Pixel(20, 16, SKIN),                          # right hand
    ], z_order=15)

    # Wrench (right hand, extending upward)
    s["wrench"] = BodyPart("wrench", [
        Rect(21, 10, 21, 15, METAL_MID),             # wrench shaft
        Rect(21, 8, 22, 9, METAL_LIGHT),             # wrench jaw top
        Pixel(21, 7, METAL_LIGHT),                    # jaw upper
        Pixel(22, 10, METAL_LIGHT),                   # jaw lower
        Pixel(20, 14, SKIN),                          # grip hand upper
        Pixel(20, 15, SKIN),                          # grip hand lower
    ], z_order=22)

    # Terminal monitor (left side)
    s["terminal"] = BodyPart("terminal", [
        Rect(7, 11, 10, 16, p["dark"]),              # monitor frame
        Rect(8, 12, 9, 15, (20, 25, 35)),            # screen (dark)
        Pixel(8, 13, p["highlight"]),                 # cursor line 1
        Pixel(9, 13, p["highlight"]),
        Pixel(8, 14, p["primary"]),                   # text line 2
        Pixel(8, 15, p["primary"]),                   # text line 3
        Rect(8, 17, 9, 17, METAL_DARK),              # monitor stand
    ], z_order=18)

    return s


# ── Scribe ────────────────────────────────────────────────────────────

def _class_scribe_sprite() -> Sprite:
    """Scribe class — robed writer with quill pen and open scroll."""
    p = CLASS_PALETTES["scribe"]
    return {
        # Face
        "face": BodyPart("face", [
            Rect(13, 5, 18, 9, SKIN),
            Pixel(14, 7, EYE),
            Pixel(17, 7, EYE),
            Pixel(15, 9, SKIN_SHADOW),
            Pixel(16, 9, SKIN_SHADOW),
        ], z_order=20),

        # Scholarly cowl
        "hood": BodyPart("hood", [
            Rect(13, 3, 18, 4, p["secondary"]),      # hood top
            Pixel(12, 5, p["dark"]),                   # L drape
            Pixel(12, 6, p["dark"]),
            Pixel(19, 5, p["dark"]),                   # R drape
            Pixel(19, 6, p["dark"]),
        ], z_order=25),

        # Scribe robe (ink blue, long)
        "robe": BodyPart("robe", [
            Rect(13, 10, 18, 10, p["dark"]),          # collar
            Rect(12, 11, 19, 21, p["secondary"]),     # main robe
            Rect(11, 22, 20, 23, p["dark"]),          # hem
            # Center seam detail
            Pixel(15, 13, p["dark"]),
            Pixel(16, 13, p["dark"]),
            Pixel(15, 17, p["dark"]),
            Pixel(16, 17, p["dark"]),
        ], z_order=10),

        # Wide sleeves
        "sleeves": BodyPart("sleeves", [
            Rect(10, 11, 12, 15, p["primary"]),
            Rect(19, 11, 21, 15, p["primary"]),
            Pixel(10, 16, SKIN),                       # left hand
            Pixel(21, 16, SKIN),                       # right hand
        ], z_order=15),

        # Quill pen (right hand, angled upward)
        "quill": BodyPart("quill", [
            Pixel(22, 8, p["accent"]),                 # feather tip
            Pixel(22, 9, p["accent"]),                 # feather mid
            Pixel(23, 9, p["accent2"]),                # feather fluff
            Pixel(22, 10, (120, 100, 70)),             # quill shaft
            Pixel(22, 11, (120, 100, 70)),
            Pixel(22, 12, (100, 80, 50)),              # nib
        ], z_order=22),

        # Open scroll (left hand)
        "scroll": BodyPart("scroll", [
            Rect(6, 12, 9, 12, PARCH_DARK),           # top roll
            Rect(6, 13, 9, 18, PARCHMENT),            # parchment body
            Rect(6, 19, 9, 19, PARCH_DARK),           # bottom roll
            # Ink text lines
            Pixel(7, 14, p["primary"]),
            Pixel(8, 14, p["primary"]),
            Pixel(7, 15, p["secondary"]),
            Pixel(8, 15, p["secondary"]),
            Pixel(7, 16, p["primary"]),
            Pixel(7, 17, p["secondary"]),
        ], z_order=18),
    }


# ── Strategist ────────────────────────────────────────────────────────

def _class_strategist_sprite() -> Sprite:
    """Strategist class — commander figure with map and pointer."""
    p = CLASS_PALETTES["strategist"]
    s = _base_body(cloth=p["secondary"], cloth_dark=p["dark"],
                   boot=p["dark"], boot_dark=(25, 35, 20))

    # Commander beret with badge
    s["head"] = BodyPart("head", [
        Rect(13, 3, 19, 4, p["primary"]),            # beret
        Pixel(13, 3, p["highlight"]),                  # beret badge
        Rect(13, 5, 18, 9, SKIN),                     # face
        Pixel(14, 7, EYE),
        Pixel(17, 7, EYE),
        Pixel(15, 9, SKIN_SHADOW),
        Pixel(16, 9, SKIN_SHADOW),
    ], z_order=20)

    # Military tunic
    s["body"] = BodyPart("body", [
        Rect(15, 10, 16, 10, SKIN),                   # neck
        Rect(13, 11, 18, 16, p["secondary"]),          # tunic
        Rect(13, 11, 18, 11, p["primary"]),            # collar
        Rect(13, 15, 18, 15, p["dark"]),               # belt
        Pixel(15, 15, p["accent"]),                    # belt buckle L
        Pixel(16, 15, p["accent"]),                    # belt buckle R
    ], z_order=10)

    # Epaulettes on shoulders
    s["epaulettes"] = BodyPart("epaulettes", [
        Rect(10, 10, 12, 11, p["accent"]),             # L epaulette
        Rect(19, 10, 21, 11, p["accent"]),             # R epaulette
        Pixel(10, 10, p["accent2"]),                   # L shine
        Pixel(21, 10, p["accent2"]),                   # R shine
    ], z_order=18)

    # Arms
    s["arms"] = BodyPart("arms", [
        Rect(11, 11, 12, 15, p["secondary"]),
        Rect(19, 11, 20, 15, p["secondary"]),
        Pixel(11, 16, SKIN),
        Pixel(20, 16, SKIN),
    ], z_order=15)

    # Pointer/baton (right hand)
    s["pointer"] = BodyPart("pointer", [
        Rect(21, 8, 21, 15, p["dark"]),                # baton shaft
        Pixel(21, 7, p["accent"]),                     # baton tip (gold)
        Pixel(20, 14, SKIN),                           # grip
    ], z_order=22)

    # War map (spread at lower-left)
    s["map"] = BodyPart("map", [
        Rect(7, 18, 12, 22, PARCHMENT),               # map paper
        Rect(7, 18, 12, 18, PARCH_DARK),              # top edge
        Rect(7, 22, 12, 22, PARCH_DARK),              # bottom edge
        # Map markings
        Pixel(8, 19, p["primary"]),
        Pixel(9, 20, p["primary"]),
        Pixel(10, 19, p["primary"]),
        Pixel(9, 21, p["accent"]),                     # gold pin 1
        Pixel(11, 20, p["accent"]),                    # gold pin 2
    ], z_order=18)

    # Small flag (above map)
    s["flag"] = BodyPart("flag", [
        Pixel(8, 16, p["dark"]),                       # flagpole
        Pixel(8, 17, p["dark"]),
        Pixel(9, 16, p["accent"]),                     # flag cloth
        Pixel(10, 16, p["accent2"]),
    ], z_order=19)

    return s


# ── Alchemist ─────────────────────────────────────────────────────────

def _class_alchemist_sprite() -> Sprite:
    """Alchemist class — lab robe, bubbling flask, mortar & pestle."""
    p = CLASS_PALETTES["alchemist"]
    return {
        # Face
        "face": BodyPart("face", [
            Rect(13, 5, 18, 9, SKIN),
            Pixel(14, 7, EYE),
            Pixel(17, 7, EYE),
            Pixel(15, 9, SKIN_SHADOW),
            Pixel(16, 9, SKIN_SHADOW),
        ], z_order=20),

        # Lab goggles over headband
        "goggles": BodyPart("goggles", [
            Rect(13, 4, 18, 4, p["dark"]),             # headband
            Pixel(14, 5, p["accent"]),                  # L goggle lens (green)
            Pixel(17, 5, p["accent"]),                  # R goggle lens (green)
            Pixel(13, 5, p["secondary"]),               # L frame
            Pixel(15, 5, METAL_MID),                    # bridge
            Pixel(16, 5, METAL_MID),
            Pixel(18, 5, p["secondary"]),               # R frame
        ], z_order=25),

        # Lab robe (deep purple)
        "robe": BodyPart("robe", [
            Rect(15, 10, 16, 10, SKIN),                # neck
            Rect(12, 11, 19, 21, p["secondary"]),      # main robe
            Rect(11, 22, 20, 23, p["dark"]),           # hem
            # Stain marks (green splashes)
            Pixel(14, 14, p["accent"]),
            Pixel(17, 18, p["accent"]),
            Pixel(13, 20, p["accent2"]),
        ], z_order=8),

        # Sleeves
        "sleeves": BodyPart("sleeves", [
            Rect(10, 11, 12, 15, p["primary"]),
            Rect(19, 11, 21, 15, p["primary"]),
            Pixel(10, 16, SKIN),
            Pixel(21, 16, SKIN),
        ], z_order=15),

        # Bubbling flask (right hand)
        "flask": BodyPart("flask", [
            Pixel(23, 8, METAL_LIGHT),                  # cork
            Rect(23, 9, 23, 10, (180, 190, 200)),      # flask neck (glass)
            Rect(22, 11, 24, 14, (160, 175, 190)),     # flask body (glass)
            Rect(22, 12, 24, 13, p["accent"]),          # liquid inside
            Pixel(23, 11, p["highlight"]),               # liquid glow top
        ], z_order=22),

        # Mortar + pestle (left side)
        "mortar": BodyPart("mortar", [
            Rect(7, 14, 10, 16, METAL_MID),            # mortar bowl
            Rect(8, 13, 9, 13, METAL_DARK),            # mortar rim
            Rect(7, 16, 10, 16, METAL_DARK),           # mortar base
            Pixel(8, 12, p["secondary"]),               # pestle handle
            Pixel(7, 11, p["secondary"]),               # pestle top
            Pixel(8, 15, p["accent2"]),                 # ground contents
            Pixel(9, 15, p["accent"]),
        ], z_order=18),
    }


# ── Polymath ──────────────────────────────────────────────────────────

def _class_polymath_sprite() -> Sprite:
    """Polymath class — balanced figure with 3 orbiting symbols."""
    p = CLASS_PALETTES["polymath"]
    s = _base_body(cloth=p["secondary"], cloth_dark=p["dark"],
                   boot=p["dark"], boot_dark=(45, 40, 55))

    # Knowledge circlet
    s["head"] = BodyPart("head", [
        Rect(13, 4, 18, 4, HAIR_DARK),                # hair
        Rect(13, 5, 18, 9, SKIN),                     # face
        Rect(13, 4, 18, 4, p["primary"]),              # circlet (over hair)
        Pixel(15, 4, p["accent"]),                     # center gem L
        Pixel(16, 4, p["accent"]),                     # center gem R
        Pixel(14, 7, EYE),
        Pixel(17, 7, EYE),
        Pixel(15, 9, SKIN_SHADOW),
        Pixel(16, 9, SKIN_SHADOW),
    ], z_order=20)

    # Multi-color trimmed tunic
    s["body"] = BodyPart("body", [
        Rect(15, 10, 16, 10, SKIN),                   # neck
        Rect(13, 11, 18, 16, p["secondary"]),          # tunic
        Rect(13, 15, 18, 15, p["dark"]),               # belt
        # Multi-class color trim (one from each class)
        Pixel(13, 11, CLASS_PALETTES["builder"]["primary"]),
        Pixel(18, 11, CLASS_PALETTES["scribe"]["primary"]),
        Pixel(13, 13, CLASS_PALETTES["strategist"]["primary"]),
        Pixel(18, 13, CLASS_PALETTES["alchemist"]["primary"]),
    ], z_order=10)

    # Arms
    s["arms"] = BodyPart("arms", [
        Rect(11, 11, 12, 15, p["secondary"]),
        Rect(19, 11, 20, 15, p["secondary"]),
        Pixel(11, 16, SKIN),
        Pixel(20, 16, SKIN),
    ], z_order=15)

    # Orbiting gear symbol (static position: top-right)
    s["symbol_gear"] = BodyPart("symbol_gear", [
        Pixel(22, 5, CLASS_PALETTES["builder"]["accent"]),
        Pixel(21, 4, CLASS_PALETTES["builder"]["primary"]),
        Pixel(23, 4, CLASS_PALETTES["builder"]["primary"]),
        Pixel(21, 6, CLASS_PALETTES["builder"]["primary"]),
        Pixel(23, 6, CLASS_PALETTES["builder"]["primary"]),
    ], z_order=28)

    # Orbiting quill symbol (static position: left)
    s["symbol_quill"] = BodyPart("symbol_quill", [
        Pixel(8, 8, CLASS_PALETTES["scribe"]["accent"]),
        Pixel(8, 9, CLASS_PALETTES["scribe"]["primary"]),
        Pixel(8, 10, CLASS_PALETTES["scribe"]["secondary"]),
    ], z_order=28)

    # Orbiting compass symbol (static position: bottom-right)
    s["symbol_compass"] = BodyPart("symbol_compass", [
        Pixel(23, 18, CLASS_PALETTES["strategist"]["accent"]),
        Pixel(22, 17, CLASS_PALETTES["strategist"]["primary"]),
        Pixel(24, 19, CLASS_PALETTES["strategist"]["primary"]),
        Pixel(22, 19, CLASS_PALETTES["strategist"]["highlight"]),
        Pixel(24, 17, CLASS_PALETTES["strategist"]["highlight"]),
    ], z_order=28)

    return s


# ══════════════════════════════════════════════════════════════════════
#  Nio Tier 1 — Baby Astro Bot (cute compact green robot)
# ══════════════════════════════════════════════════════════════════════

def _nio_tier1_sprite() -> Sprite:
    """Nio Tier 1 — Baby Astro Bot. Small green robot, visor, antenna."""
    p = NIO_PALETTE
    return {
        "antenna": BodyPart("antenna", [
            Pixel(15, 2, p["highlight"]),            # L tip glow
            Pixel(16, 2, p["highlight"]),            # R tip glow
            Pixel(15, 3, p["primary"]),              # L stem
            Pixel(16, 3, p["primary"]),              # R stem
        ], z_order=26),

        "head": BodyPart("head", [
            Rect(13, 4, 18, 4, p["metal"]),          # head cap
            Rect(12, 5, 19, 9, p["primary"]),         # head block
            Rect(12, 5, 12, 9, p["metal"]),           # L side frame
            Rect(19, 5, 19, 9, p["metal"]),           # R side frame
            Rect(13, 9, 18, 9, p["metal"]),           # chin panel
        ], z_order=10),

        "visor": BodyPart("visor", [
            Rect(13, 6, 18, 7, p["visor_bg"]),       # visor glass
            Pixel(14, 6, p["visor_glow"]),            # L eye top
            Pixel(14, 7, p["visor_glow"]),            # L eye bot
            Pixel(17, 6, p["visor_glow"]),            # R eye top
            Pixel(17, 7, p["visor_glow"]),            # R eye bot
        ], z_order=20),

        "body": BodyPart("body", [
            Rect(15, 10, 16, 10, p["metal"]),         # neck connector
            Rect(13, 11, 18, 16, p["primary"]),       # chest plate
            Rect(14, 12, 17, 14, p["secondary"]),     # chest inset panel
            Pixel(15, 15, p["core"]),                  # core light L
            Pixel(16, 15, p["core"]),                  # core light R
        ], z_order=8),

        "arms": BodyPart("arms", [
            Rect(11, 11, 12, 15, p["secondary"]),    # L arm
            Rect(19, 11, 20, 15, p["secondary"]),    # R arm
            Pixel(11, 16, p["metal"]),                # L hand
            Pixel(20, 16, p["metal"]),                # R hand
        ], z_order=12),

        "legs": BodyPart("legs", [
            Rect(13, 17, 14, 22, p["secondary"]),    # L leg
            Rect(17, 17, 18, 22, p["secondary"]),    # R leg
            Rect(12, 23, 14, 23, p["dark"]),          # L foot
            Rect(17, 23, 19, 23, p["dark"]),          # R foot
        ], z_order=5),
    }

# ══════════════════════════════════════════════════════════════════════
#  Nio Tier 2 — Guardian Bot (shoulder plates + energy sword)
# ══════════════════════════════════════════════════════════════════════

def _nio_tier2_sprite() -> Sprite:
    """Nio Tier 2 — Guardian Bot. Shoulder plates + energy sword."""
    p = NIO_PALETTE
    return {
        "antenna": BodyPart("antenna", [
            Pixel(15, 2, p["highlight"]),
            Pixel(16, 2, p["highlight"]),
            Pixel(15, 3, p["primary"]),
            Pixel(16, 3, p["primary"]),
        ], z_order=26),

        "head": BodyPart("head", [
            Rect(13, 4, 18, 4, p["metal"]),
            Rect(12, 5, 19, 9, p["primary"]),
            Rect(12, 5, 12, 9, p["metal"]),
            Rect(19, 5, 19, 9, p["metal"]),
            Rect(13, 9, 18, 9, p["metal"]),
        ], z_order=10),

        "visor": BodyPart("visor", [
            Rect(13, 6, 18, 7, p["visor_bg"]),
            Pixel(14, 6, p["visor_glow"]),
            Pixel(14, 7, p["visor_glow"]),
            Pixel(17, 6, p["visor_glow"]),
            Pixel(17, 7, p["visor_glow"]),
        ], z_order=20),

        "body": BodyPart("body", [
            Rect(15, 10, 16, 10, p["metal"]),
            Rect(13, 11, 18, 16, p["primary"]),
            Rect(14, 12, 17, 14, p["secondary"]),
            Pixel(15, 15, p["core"]),
            Pixel(16, 15, p["core"]),
            Rect(13, 16, 18, 16, p["metal"]),         # belt armor line
        ], z_order=8),

        "shoulders": BodyPart("shoulders", [
            Rect(10, 10, 12, 12, p["primary"]),       # L pauldron
            Rect(19, 10, 21, 12, p["primary"]),       # R pauldron
            Pixel(10, 10, p["highlight"]),             # L shine
            Pixel(21, 10, p["highlight"]),             # R shine
        ], z_order=14),

        "arms": BodyPart("arms", [
            Rect(11, 11, 12, 15, p["secondary"]),
            Rect(19, 11, 20, 15, p["secondary"]),
            Pixel(11, 16, p["metal"]),
            Pixel(20, 16, p["metal"]),
        ], z_order=12),

        "sword": BodyPart("sword", [
            Rect(22, 4, 22, 14, p["energy"]),         # blade
            Pixel(22, 3, p["highlight"]),              # tip
            Rect(21, 15, 23, 15, p["metal_light"]),   # cross-guard
            Rect(22, 16, 22, 17, p["metal"]),          # grip
        ], z_order=22),

        "legs": BodyPart("legs", [
            Rect(13, 17, 14, 22, p["secondary"]),
            Rect(17, 17, 18, 22, p["secondary"]),
            Rect(12, 23, 14, 23, p["dark"]),
            Rect(17, 23, 19, 23, p["dark"]),
        ], z_order=5),
    }

# ══════════════════════════════════════════════════════════════════════
#  Nio Tier 3 — Winged Guardian (wings + cape + glowing sword)
# ══════════════════════════════════════════════════════════════════════

def _nio_tier3_sprite() -> Sprite:
    """Nio Tier 3 — Winged Guardian. Small wings, flowing cape, glowing sword."""
    p = NIO_PALETTE
    return {
        "antenna": BodyPart("antenna", [
            Pixel(15, 1, p["highlight"]),             # taller antenna tip L
            Pixel(16, 1, p["highlight"]),             # taller antenna tip R
            Pixel(15, 2, p["primary"]),
            Pixel(16, 2, p["primary"]),
            Pixel(15, 3, p["secondary"]),
            Pixel(16, 3, p["secondary"]),
        ], z_order=26),

        "head": BodyPart("head", [
            Rect(13, 4, 18, 4, p["metal"]),
            Rect(12, 5, 19, 9, p["primary"]),
            Rect(12, 5, 12, 9, p["metal"]),
            Rect(19, 5, 19, 9, p["metal"]),
            Rect(13, 9, 18, 9, p["metal"]),
            # Ear fins
            Pixel(11, 5, p["highlight"]),
            Pixel(11, 6, p["primary"]),
            Pixel(20, 5, p["highlight"]),
            Pixel(20, 6, p["primary"]),
        ], z_order=10),

        "visor": BodyPart("visor", [
            Rect(13, 6, 18, 7, p["visor_bg"]),
            Pixel(14, 6, p["visor_glow"]),
            Pixel(14, 7, p["visor_glow"]),
            Pixel(15, 6, p["visor_glow"]),            # wider glow center L
            Pixel(16, 6, p["visor_glow"]),            # wider glow center R
            Pixel(17, 6, p["visor_glow"]),
            Pixel(17, 7, p["visor_glow"]),
        ], z_order=20),

        "body": BodyPart("body", [
            Rect(15, 10, 16, 10, p["metal"]),
            Rect(13, 11, 18, 16, p["primary"]),
            Rect(14, 12, 17, 14, p["secondary"]),
            Pixel(15, 15, p["core"]),
            Pixel(16, 15, p["core"]),
            Rect(13, 16, 18, 16, p["metal"]),
        ], z_order=8),

        "shoulders": BodyPart("shoulders", [
            Rect(10, 10, 12, 12, p["primary"]),
            Rect(19, 10, 21, 12, p["primary"]),
            Pixel(10, 10, p["highlight"]),
            Pixel(21, 10, p["highlight"]),
        ], z_order=14),

        "arms": BodyPart("arms", [
            Rect(11, 11, 12, 15, p["secondary"]),
            Rect(19, 11, 20, 15, p["secondary"]),
            Pixel(11, 16, p["metal"]),
            Pixel(20, 16, p["metal"]),
        ], z_order=12),

        "wings": BodyPart("wings", [
            # Left wing (small, Hollow Knight style)
            Pixel(9,  11, p["primary"]),
            Pixel(8,  10, p["highlight"]),
            Pixel(7,   9, p["glow"]),
            Pixel(9,  13, p["secondary"]),
            Pixel(8,  12, p["primary"]),
            # Right wing (mirror)
            Pixel(22, 11, p["primary"]),
            Pixel(23, 10, p["highlight"]),
            Pixel(24,  9, p["glow"]),
            Pixel(22, 13, p["secondary"]),
            Pixel(23, 12, p["primary"]),
        ], z_order=2),

        "cape": BodyPart("cape", [
            Rect(9, 14, 10, 21, p["secondary"]),      # cape body
            Rect(9, 22, 11, 23, p["dark"]),            # cape tail
        ], z_order=1),

        "sword": BodyPart("sword", [
            Rect(23, 3, 23, 14, p["energy"]),          # longer blade
            Pixel(23, 2, p["highlight"]),               # tip glow
            Pixel(23, 1, (200, 255, 230)),              # tip shine
            Rect(22, 15, 24, 15, p["metal_light"]),
            Rect(23, 16, 23, 17, p["metal"]),
        ], z_order=22),

        "legs": BodyPart("legs", [
            Rect(13, 17, 14, 22, p["secondary"]),
            Rect(17, 17, 18, 22, p["secondary"]),
            Rect(12, 23, 14, 23, p["dark"]),
            Rect(17, 23, 19, 23, p["dark"]),
        ], z_order=5),
    }

# ══════════════════════════════════════════════════════════════════════
#  Nio Tier 4 — Armored Guardian (full armor + larger wings + particles)
# ══════════════════════════════════════════════════════════════════════

def _nio_tier4_sprite() -> Sprite:
    """Nio Tier 4 — Armored Guardian. Full armor, larger wings, orbiting code particles."""
    p = NIO_PALETTE
    return {
        "antenna": BodyPart("antenna", [
            Pixel(15, 1, p["highlight"]),
            Pixel(16, 1, p["highlight"]),
            Pixel(14, 2, p["energy"]),                # wider antenna array
            Pixel(15, 2, p["primary"]),
            Pixel(16, 2, p["primary"]),
            Pixel(17, 2, p["energy"]),
            Pixel(15, 3, p["secondary"]),
            Pixel(16, 3, p["secondary"]),
        ], z_order=26),

        "head": BodyPart("head", [
            Rect(13, 4, 18, 4, p["metal_light"]),     # polished helm cap
            Rect(12, 5, 19, 9, p["primary"]),
            Rect(12, 5, 12, 9, p["metal_light"]),
            Rect(19, 5, 19, 9, p["metal_light"]),
            Rect(13, 9, 18, 9, p["metal_light"]),
            # Larger ear fins
            Pixel(11, 4, p["energy"]),
            Pixel(11, 5, p["highlight"]),
            Pixel(11, 6, p["primary"]),
            Pixel(20, 4, p["energy"]),
            Pixel(20, 5, p["highlight"]),
            Pixel(20, 6, p["primary"]),
        ], z_order=10),

        "visor": BodyPart("visor", [
            Rect(13, 6, 18, 7, p["visor_bg"]),
            Rect(14, 6, 17, 7, p["visor_glow"]),      # wider brighter glow
        ], z_order=20),

        "armor": BodyPart("armor", [
            Rect(15, 10, 16, 10, p["metal_light"]),   # neck
            Rect(13, 11, 18, 16, p["primary"]),
            Rect(14, 12, 17, 13, p["highlight"]),      # chest highlight
            Pixel(15, 14, p["core"]),
            Pixel(16, 14, p["core"]),
            Pixel(15, 15, p["energy"]),                # brighter core
            Pixel(16, 15, p["energy"]),
            Rect(13, 16, 18, 16, p["metal_light"]),
        ], z_order=8),

        "shoulders": BodyPart("shoulders", [
            Rect(9,  10, 12, 12, p["primary"]),        # wider pauldrons
            Rect(19, 10, 22, 12, p["primary"]),
            Rect(9,  10, 10, 10, p["highlight"]),
            Rect(21, 10, 22, 10, p["highlight"]),
        ], z_order=14),

        "arms": BodyPart("arms", [
            Rect(11, 11, 12, 15, p["secondary"]),
            Rect(19, 11, 20, 15, p["secondary"]),
            Pixel(11, 16, p["metal_light"]),           # armored gauntlet L
            Pixel(20, 16, p["metal_light"]),           # armored gauntlet R
        ], z_order=12),

        "wings": BodyPart("wings", [
            # Left wing (3-feather spread)
            Pixel(8,  12, p["highlight"]),
            Pixel(7,  11, p["primary"]),
            Pixel(6,  10, p["primary"]),
            Pixel(5,   9, p["highlight"]),
            Pixel(8,  14, p["primary"]),
            Pixel(7,  13, p["highlight"]),
            Pixel(6,  12, p["primary"]),
            Pixel(8,  16, p["secondary"]),
            Pixel(7,  15, p["primary"]),
            # Right wing (mirror)
            Pixel(23, 12, p["highlight"]),
            Pixel(24, 11, p["primary"]),
            Pixel(25, 10, p["primary"]),
            Pixel(26,  9, p["highlight"]),
            Pixel(23, 14, p["primary"]),
            Pixel(24, 13, p["highlight"]),
            Pixel(25, 12, p["primary"]),
            Pixel(23, 16, p["secondary"]),
            Pixel(24, 15, p["primary"]),
        ], z_order=2),

        "cape": BodyPart("cape", [
            Rect(9,  14, 10, 21, p["secondary"]),      # L cape
            Rect(21, 14, 22, 21, p["secondary"]),      # R cape
            Rect(8,  22, 10, 24, p["dark"]),            # L tail
            Rect(21, 22, 23, 24, p["dark"]),            # R tail
        ], z_order=1),

        "sword": BodyPart("sword", [
            Rect(24, 2, 24, 14, p["energy"]),
            Pixel(24, 1, p["highlight"]),
            Pixel(24, 0, (220, 255, 240)),             # tip glow
            Rect(23, 15, 25, 15, p["metal_light"]),
            Rect(24, 16, 24, 17, p["metal"]),
        ], z_order=22),

        "particles": BodyPart("particles", [
            Pixel(5,  6,  p["glow"]),
            Pixel(26, 6,  p["glow"]),
            Pixel(3,  15, p["glow"]),
            Pixel(28, 15, p["glow"]),
        ], z_order=28),

        "legs": BodyPart("legs", [
            Rect(13, 17, 14, 22, p["primary"]),        # armored legs
            Rect(17, 17, 18, 22, p["primary"]),
            Rect(12, 23, 14, 23, p["metal"]),
            Rect(17, 23, 19, 23, p["metal"]),
        ], z_order=5),
    }

# ══════════════════════════════════════════════════════════════════════
#  Nio Tier 5 — Ascended Guardian (energy wings + floating + halo + aura)
# ══════════════════════════════════════════════════════════════════════

def _nio_tier5_sprite() -> Sprite:
    """Nio Tier 5 — Ascended Guardian. Energy wings, floating, crown/halo, aura."""
    p = NIO_PALETTE
    return {
        "halo": BodyPart("halo", [
            Pixel(14, 0, p["energy"]),
            Pixel(15, 0, p["highlight"]),
            Pixel(16, 0, p["highlight"]),
            Pixel(17, 0, p["energy"]),
            Pixel(13, 1, p["glow"]),
            Pixel(18, 1, p["glow"]),
        ], z_order=30),

        "antenna": BodyPart("antenna", [
            Pixel(14, 2, p["energy"]),
            Pixel(15, 2, p["highlight"]),
            Pixel(16, 2, p["highlight"]),
            Pixel(17, 2, p["energy"]),
            Pixel(15, 3, p["primary"]),
            Pixel(16, 3, p["primary"]),
        ], z_order=26),

        "head": BodyPart("head", [
            Rect(13, 4, 18, 4, p["highlight"]),       # luminous helm
            Rect(12, 5, 19, 9, p["primary"]),
            Rect(12, 5, 12, 9, p["highlight"]),        # glowing frame L
            Rect(19, 5, 19, 9, p["highlight"]),        # glowing frame R
            Rect(13, 9, 18, 9, p["highlight"]),
            # Large ear fins
            Pixel(10, 4, p["energy"]),
            Pixel(11, 4, p["highlight"]),
            Pixel(11, 5, p["highlight"]),
            Pixel(11, 6, p["primary"]),
            Pixel(21, 4, p["energy"]),
            Pixel(20, 4, p["highlight"]),
            Pixel(20, 5, p["highlight"]),
            Pixel(20, 6, p["primary"]),
        ], z_order=10),

        "visor": BodyPart("visor", [
            Rect(13, 6, 18, 7, p["visor_bg"]),
            Rect(13, 6, 18, 7, p["visor_glow"]),      # full visor glow
        ], z_order=20),

        "armor": BodyPart("armor", [
            Rect(15, 10, 16, 10, p["highlight"]),
            Rect(13, 11, 18, 16, p["primary"]),
            Rect(14, 12, 17, 13, p["highlight"]),
            Rect(15, 14, 16, 15, p["core"]),           # blazing core
            Rect(13, 16, 18, 16, p["highlight"]),
        ], z_order=8),

        "shoulders": BodyPart("shoulders", [
            Rect(9,  10, 12, 12, p["primary"]),
            Rect(19, 10, 22, 12, p["primary"]),
            Rect(9,  10, 10, 10, p["highlight"]),
            Rect(21, 10, 22, 10, p["highlight"]),
        ], z_order=14),

        "arms": BodyPart("arms", [
            Rect(11, 11, 12, 15, p["primary"]),
            Rect(19, 11, 20, 15, p["primary"]),
            Pixel(11, 16, p["highlight"]),             # energy gauntlet L
            Pixel(20, 16, p["highlight"]),             # energy gauntlet R
        ], z_order=12),

        "wings": BodyPart("wings", [
            # Left wing — fully extended energy wing
            Pixel(8,  12, p["highlight"]),
            Pixel(7,  11, p["primary"]),
            Pixel(6,  10, p["primary"]),
            Pixel(5,   9, p["highlight"]),
            Pixel(4,   8, p["energy"]),
            Pixel(3,   7, p["glow"]),
            Pixel(8,  14, p["primary"]),
            Pixel(7,  13, p["highlight"]),
            Pixel(6,  12, p["primary"]),
            Pixel(5,  11, p["energy"]),
            Pixel(8,  16, p["secondary"]),
            Pixel(7,  15, p["primary"]),
            Pixel(6,  14, p["glow"]),
            # Right wing — mirror
            Pixel(23, 12, p["highlight"]),
            Pixel(24, 11, p["primary"]),
            Pixel(25, 10, p["primary"]),
            Pixel(26,  9, p["highlight"]),
            Pixel(27,  8, p["energy"]),
            Pixel(28,  7, p["glow"]),
            Pixel(23, 14, p["primary"]),
            Pixel(24, 13, p["highlight"]),
            Pixel(25, 12, p["primary"]),
            Pixel(26, 11, p["energy"]),
            Pixel(23, 16, p["secondary"]),
            Pixel(24, 15, p["primary"]),
            Pixel(25, 14, p["glow"]),
        ], z_order=1),

        "cape": BodyPart("cape", [
            Rect(9,  14, 10, 21, p["secondary"]),
            Rect(21, 14, 22, 21, p["secondary"]),
            Rect(8,  22, 10, 24, p["dark"]),
            Rect(21, 22, 23, 24, p["dark"]),
        ], z_order=0),

        "sword": BodyPart("sword", [
            Rect(25, 1, 25, 14, p["energy"]),          # pure energy blade
            Pixel(25, 0, (255, 255, 255)),              # white tip
            Pixel(26, 3, p["highlight"]),               # blade glow
            Pixel(26, 7, p["highlight"]),
            Pixel(26, 11, p["highlight"]),
            Rect(24, 15, 26, 15, p["highlight"]),
            Rect(25, 16, 25, 17, p["metal_light"]),
        ], z_order=22),

        "aura": BodyPart("aura", [
            Pixel(10, 4,  p["glow"]),
            Pixel(21, 4,  p["glow"]),
            Pixel(6,  17, p["glow"]),
            Pixel(25, 17, p["glow"]),
            Pixel(15, 27, p["glow"]),
            Pixel(16, 27, p["glow"]),
            Pixel(3,  12, p["glow"]),
            Pixel(28, 12, p["glow"]),
        ], z_order=0),

        "legs": BodyPart("legs", [
            Rect(13, 17, 14, 22, p["primary"]),
            Rect(17, 17, 18, 22, p["primary"]),
            Rect(12, 23, 14, 23, p["highlight"]),      # energy boots L
            Rect(17, 23, 19, 23, p["highlight"]),      # energy boots R
        ], z_order=5),
    }


# ══════════════════════════════════════════════════════════════════════
#  Sprite Lookup
# ══════════════════════════════════════════════════════════════════════

_TIER_BUILDERS: Dict[int, Callable[[], Sprite]] = {
    1: _tier1_sprite,
    2: _tier2_sprite,
    3: _tier3_sprite,
    4: _tier4_sprite,
    5: _tier5_sprite,
    6: _tier6_sprite,
}


def get_tier_sprite(tier: int) -> Sprite:
    """Build and return the sprite for the given tier (1-6)."""
    builder = _TIER_BUILDERS.get(tier)
    if builder is None:
        raise ValueError(f"Invalid tier {tier}, must be 1-6")
    return builder()


_CLASS_BUILDERS: Dict[str, Callable[[], Sprite]] = {
    "builder":    _class_builder_sprite,
    "scribe":     _class_scribe_sprite,
    "strategist": _class_strategist_sprite,
    "alchemist":  _class_alchemist_sprite,
    "polymath":   _class_polymath_sprite,
}


def get_class_sprite(class_name: str) -> Sprite:
    """Build and return the sprite for the given RPG class name."""
    builder = _CLASS_BUILDERS.get(class_name.lower())
    if builder is None:
        valid = ", ".join(_CLASS_BUILDERS.keys())
        raise ValueError(f"Invalid class '{class_name}', must be one of: {valid}")
    return builder()


_NIO_BUILDERS: Dict[int, Callable[[], Sprite]] = {
    1: _nio_tier1_sprite,
    2: _nio_tier2_sprite,
    3: _nio_tier3_sprite,
    4: _nio_tier4_sprite,
    5: _nio_tier5_sprite,
}


def get_nio_sprite(tier: int) -> Sprite:
    """Build and return the Nio avatar sprite for the given tier (1-5)."""
    builder = _NIO_BUILDERS.get(tier)
    if builder is None:
        raise ValueError(f"Invalid Nio tier {tier}, must be 1-5")
    return builder()

# ══════════════════════════════════════════════════════════════════════
#  Partner Tool Sprites
# ══════════════════════════════════════════════════════════════════════

def _clay_sprite() -> Sprite:
    """Clay avatar: Rainbow gradient 'moldable' figure + data orb."""
    p = CLAY_PALETTE
    return {
        "head": BodyPart("head", [
            # Head with gradient effect
            Rect(13, 5, 18, 9, p["rainbow_1"]),
            Rect(13, 4, 18, 4, p["rainbow_5"]),  # top
            Pixel(14, 7, p["highlight"]),        # eye L
            Pixel(17, 7, p["highlight"]),        # eye R
        ], z_order=20),

        "body": BodyPart("body", [
            Rect(15, 10, 16, 10, p["rainbow_2"]), # neck
            Rect(13, 11, 18, 16, p["rainbow_3"]), # torso
        ], z_order=10),

        "arms": BodyPart("arms", [
            Rect(11, 11, 12, 15, p["rainbow_4"]), # arm L
            Rect(19, 11, 20, 15, p["rainbow_4"]), # arm R
            Pixel(11, 16, p["rainbow_2"]),        # hand L
            Pixel(20, 16, p["rainbow_2"]),        # hand R
        ], z_order=15),

        "legs": BodyPart("legs", [
            Rect(13, 17, 14, 22, p["rainbow_5"]), # leg L
            Rect(17, 17, 18, 22, p["rainbow_5"]), # leg R
            Rect(12, 23, 14, 23, p["dark"]),      # foot L
            Rect(17, 23, 19, 23, p["dark"]),      # foot R
        ], z_order=5),

        "orb": BodyPart("orb", [
            # Floating data orb in left hand
            Rect(9, 13, 11, 15, p["glow"]),
            Pixel(10, 14, p["highlight"]),
        ], z_order=25),
    }

def _instantly_sprite() -> Sprite:
    """Instantly avatar: Electric blue figure + lightning bolt staff."""
    p = INSTANTLY_PALETTE
    return {
        "head": BodyPart("head", [
            Rect(13, 5, 18, 9, p["primary"]),
            # Lightning bolt crest
            Pixel(15, 3, p["highlight"]),
            Pixel(16, 4, p["highlight"]),
            Pixel(14, 7, p["bolt"]),             # eye L (white hot)
            Pixel(17, 7, p["bolt"]),             # eye R
        ], z_order=20),

        "body": BodyPart("body", [
            Rect(15, 10, 16, 10, p["primary"]),
            Rect(13, 11, 18, 16, p["secondary"]),
            # Lightning bolt emblem on chest
            Pixel(16, 12, p["highlight"]),
            Pixel(15, 13, p["highlight"]),
            Pixel(16, 14, p["highlight"]),
        ], z_order=10),

        "arms": BodyPart("arms", [
            Rect(11, 11, 12, 15, p["primary"]),
            Rect(19, 11, 20, 15, p["primary"]),
            Pixel(11, 16, p["secondary"]),
            Pixel(20, 16, p["secondary"]),
        ], z_order=15),

        "legs": BodyPart("legs", [
            Rect(13, 17, 14, 22, p["secondary"]),
            Rect(17, 17, 18, 22, p["secondary"]),
            Rect(12, 23, 14, 23, p["dark"]),
            Rect(17, 23, 19, 23, p["dark"]),
        ], z_order=5),

        "staff": BodyPart("staff", [
            # Lightning bolt staff in right hand
            Rect(20, 6, 21, 22, p["dark"]),      # shaft
            Pixel(20, 5, p["highlight"]),        # tip
            Pixel(21, 7, p["bolt"]),             # spark
            Pixel(19, 8, p["highlight"]),        # jagged bit
        ], z_order=25),
    }

def _heyreach_sprite() -> Sprite:
    """HeyReach avatar: Purple figure + connection rings."""
    p = HEYREACH_PALETTE
    return {
        "head": BodyPart("head", [
            Rect(13, 5, 18, 9, p["primary"]),
            # Visor / Headset
            Rect(13, 6, 18, 7, p["secondary"]),
            Pixel(13, 6, p["accent"]),           # visor glow
            Pixel(18, 6, p["accent"]),
            # Antenna
            Pixel(18, 4, p["highlight"]),
            Pixel(18, 3, p["accent"]),
        ], z_order=20),

        "body": BodyPart("body", [
            Rect(15, 10, 16, 10, p["primary"]),
            Rect(13, 11, 18, 16, p["secondary"]),
            # Connection node emblem
            Pixel(15, 13, p["ring"]),
            Pixel(16, 13, p["ring"]),
        ], z_order=10),

        "arms": BodyPart("arms", [
            Rect(11, 11, 12, 15, p["primary"]),
            Rect(19, 11, 20, 15, p["primary"]),
            Pixel(11, 16, p["highlight"]),
            Pixel(20, 16, p["highlight"]),
        ], z_order=15),

        "legs": BodyPart("legs", [
            Rect(13, 17, 14, 22, p["secondary"]),
            Rect(17, 17, 18, 22, p["secondary"]),
            Rect(12, 23, 14, 23, p["dark"]),
            Rect(17, 23, 19, 23, p["dark"]),
        ], z_order=5),
    }


def _ouroboros_sprite() -> Sprite:
    """Ouroboros avatar: Infinity-shaped dragon biting its own tail."""
    p = OUROBOROS_PALETTE
    return {
        # Dragon head at crossover point (biting tail)
        "head": BodyPart("head", [
            Rect(14, 14, 17, 16, p["primary"]),
            Pixel(17, 14, p["accent"]),
            Pixel(14, 14, p["accent"]),
            Pixel(15, 17, p["gold"]),
            Pixel(16, 17, p["gold"]),
            Pixel(15, 13, p["gold"]),
            Pixel(16, 13, p["gold"]),
        ], z_order=20),

        # Seg 0: upper-right from crossover
        "seg_0": BodyPart("seg_0", [
            Rect(18, 12, 19, 13, p["primary"]),
            Rect(20, 10, 21, 11, p["primary"]),
        ], z_order=10),

        # Seg 1: top of right loop
        "seg_1": BodyPart("seg_1", [
            Rect(22, 8, 23, 9, p["primary"]),
            Rect(24, 7, 26, 8, p["secondary"]),
        ], z_order=10),

        # Seg 2: right side descending
        "seg_2": BodyPart("seg_2", [
            Rect(27, 9, 28, 11, p["primary"]),
            Rect(27, 12, 28, 14, p["secondary"]),
        ], z_order=10),

        # Seg 3: bottom-right back to center
        "seg_3": BodyPart("seg_3", [
            Rect(25, 15, 26, 16, p["primary"]),
            Rect(22, 16, 24, 17, p["secondary"]),
            Rect(18, 16, 21, 17, p["primary"]),
        ], z_order=8),

        # Seg 4: lower-left from crossover
        "seg_4": BodyPart("seg_4", [
            Rect(12, 18, 13, 19, p["primary"]),
            Rect(10, 20, 11, 21, p["primary"]),
        ], z_order=10),

        # Seg 5: bottom of left loop
        "seg_5": BodyPart("seg_5", [
            Rect(8, 22, 9, 23, p["primary"]),
            Rect(5, 23, 7, 24, p["secondary"]),
        ], z_order=10),

        # Seg 6: left side ascending
        "seg_6": BodyPart("seg_6", [
            Rect(3, 20, 4, 22, p["primary"]),
            Rect(3, 17, 4, 19, p["secondary"]),
        ], z_order=10),

        # Seg 7: upper-left back to center (tail end)
        "seg_7": BodyPart("seg_7", [
            Rect(5, 15, 6, 16, p["primary"]),
            Rect(7, 14, 9, 15, p["secondary"]),
            Rect(10, 14, 13, 15, p["primary"]),
        ], z_order=8),

        # Gold belly highlights along the body
        "belly": BodyPart("belly", [
            Pixel(21, 11, p["gold_dark"]),
            Pixel(25, 8, p["gold_dark"]),
            Pixel(28, 13, p["gold_dark"]),
            Pixel(23, 17, p["gold_dark"]),
            Pixel(11, 21, p["gold_dark"]),
            Pixel(6, 24, p["gold_dark"]),
            Pixel(4, 19, p["gold_dark"]),
            Pixel(8, 15, p["gold_dark"]),
        ], z_order=12),
    }


# ══════════════════════════════════════════════════════════════════════
#  Frame Transform Functions
# ══════════════════════════════════════════════════════════════════════

# Shared breathing bob patterns
_BOB_8  = [0, 0, -1, -1, 0, 0, 1, 1]
_BOB_10 = [0, 0, -1, -1, -1, 0, 0, 1, 1, 1]
_BOB_12 = [0, 0, -1, -1, -1, 0, 0, 0, 1, 1, 1, 0]


# ── Tier 1 ───────────────────────────────────────────────────────────

def tier1_idle(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Breathing bob + cursor staff blink on/off."""
    dy = _BOB_8[frame % 8]
    s = shift_all(sprite, dy=dy)
    # Blink cursor block off every other pair of frames
    if (frame // 2) % 2 == 1:
        s = remove_part(s, "cursor_block")
    return s


def tier1_action(sprite: Sprite, frame: int, total: int = 12) -> Sprite:
    """Matrix rain cascading from cursor staff top."""
    p = PALETTES[1]
    s = deep_copy_sprite(sprite)
    rain: List[Tuple[int, int, tuple]] = []
    # Several columns falling from staff area
    for col_off in [-1, 0, 1]:
        x = 22 + col_off
        start = 2 + abs(col_off)  # stagger start
        if frame >= start:
            age = frame - start
            for drop in range(min(age + 1, 10)):
                y = 6 + drop * 2
                if 0 <= y < GRID:
                    fade = max(30, 210 - drop * 30)
                    c = brightness(p["highlight"], -(210 - fade))
                    rain.append((x, y, c))
    if rain:
        s = add_pixels(s, "rain", rain, z_order=28)
    return s


# ── Tier 2 ───────────────────────────────────────────────────────────

def tier2_idle(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Head bob + orbiting green dot particles."""
    p = PALETTES[2]
    dy = _BOB_8[frame % 8]
    s = shift_part(sprite, "head", dy=dy)
    # Two particles orbit the figure
    particles: List[Tuple[int, int, tuple]] = []
    for i in range(2):
        angle = 2 * math.pi * (frame / total) + i * math.pi
        px = 16 + int(10 * math.cos(angle))
        py = 14 + int(8 * math.sin(angle))
        if 0 <= px < GRID and 0 <= py < GRID:
            particles.append((px, py, p["highlight"]))
    if particles:
        s = add_pixels(s, "particles", particles, z_order=30)
    return s


def tier2_action(sprite: Sprite, frame: int, total: int = 14) -> Sprite:
    """Scroll unfurls downward with streaming text."""
    p = PALETTES[2]
    s = deep_copy_sprite(sprite)
    max_extend = 8
    extend = min(max_extend, (frame * max_extend) // total + 1)
    scroll_px: List[Tuple[int, int, tuple]] = []
    for dy in range(extend):
        y = 20 + dy
        if y < GRID:
            for x in (8, 9, 10):
                scroll_px.append((x, y, PARCHMENT))
            # Text appears on unfurled area (except leading edge)
            if dy < extend - 1:
                scroll_px.append((9, y, p["primary"]))
    if scroll_px:
        s = add_pixels(s, "scroll_extend", scroll_px, z_order=19)
    return s


# ── Tier 3 ───────────────────────────────────────────────────────────

def tier3_idle(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Staff orb pulses cyan + expanding energy rings."""
    p = PALETTES[3]
    s = deep_copy_sprite(sprite)
    # Pulse orb brightness
    amt = int(40 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "orb", amt)
    # Ring effect around orb
    ring_phase = (frame % 5) / 5.0
    ring_r = 1 + int(ring_phase * 3)
    cx, cy = 23, 5
    ring_px: List[Tuple[int, int, tuple]] = []
    for step in range(8):
        a = 2 * math.pi * step / 8
        rx = cx + int(ring_r * math.cos(a))
        ry = cy + int(ring_r * math.sin(a))
        if 0 <= rx < GRID and 0 <= ry < GRID:
            c = brightness(p["glow"], -int(ring_phase * 80))
            ring_px.append((rx, ry, c))
    if ring_px:
        s = add_pixels(s, "rings", ring_px, z_order=26)
    return s


def tier3_action(sprite: Sprite, frame: int, total: int = 14) -> Sprite:
    """Cyan thread lines arc outward from staff tip."""
    p = PALETTES[3]
    s = deep_copy_sprite(sprite)
    threads: List[Tuple[int, int, tuple]] = []
    for t in range(5):
        base_angle = (2 * math.pi * t / 5) + 0.3
        length = min(frame + 1, 10)
        for step in range(length):
            angle = base_angle + step * 0.12
            dist = step * 1.5
            tx = 23 + int(dist * math.cos(angle))
            ty = 5 + int(dist * math.sin(angle))
            if 0 <= tx < GRID and 0 <= ty < GRID:
                c = brightness(p["highlight"], -step * 15)
                threads.append((tx, ty, c))
    if threads:
        s = add_pixels(s, "threads", threads, z_order=28)
    return s


# ── Tier 4 ───────────────────────────────────────────────────────────

def tier4_idle(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Cape sway (2-frame alternation) + flask bubbles rise."""
    p = PALETTES[4]
    s = deep_copy_sprite(sprite)
    # Cape sway
    cape_dx = 1 if (frame // 3) % 2 == 0 else -1
    s = shift_part(s, "cape", dx=cape_dx)
    # Flask bubbles
    bubbles: List[Tuple[int, int, tuple]] = []
    for i in range(3):
        by = 10 - ((frame + i * 3) % 6)
        bx = 22 + (i % 2)
        if 0 <= by < GRID:
            bubbles.append((bx, by, p["highlight"]))
    if bubbles:
        s = add_pixels(s, "bubbles", bubbles, z_order=24)
    return s


def tier4_action(sprite: Sprite, frame: int, total: int = 16) -> Sprite:
    """Golden burst radiates outward from flask."""
    p = PALETTES[4]
    s = deep_copy_sprite(sprite)
    cx, cy = 22, 14
    radius = (frame * 8) // total + 1
    burst: List[Tuple[int, int, tuple]] = []
    num_pts = 12 + frame
    for i in range(num_pts):
        a = 2 * math.pi * i / num_pts
        bx = cx + int(radius * math.cos(a))
        by = cy + int(radius * math.sin(a))
        if 0 <= bx < GRID and 0 <= by < GRID:
            c = brightness(p["highlight"], -frame * 8)
            burst.append((bx, by, c))
    if burst:
        s = add_pixels(s, "burst", burst, z_order=28)
    return s


# ── Tier 5 ───────────────────────────────────────────────────────────

def tier5_idle(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Sword glow pulses purple + cape wave."""
    s = deep_copy_sprite(sprite)
    amt = int(30 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "sword_blade", amt)
    cape_dx = [0, 0, 1, 1, 0, 0, -1, -1, 0, 0][frame % 10]
    s = shift_part(s, "cape", dx=cape_dx)
    return s


def tier5_action(sprite: Sprite, frame: int, total: int = 16) -> Sprite:
    """Sword slash arc with purple trail."""
    p = PALETTES[5]
    s = deep_copy_sprite(sprite)
    progress = min(frame / (total * 0.7), 1.0)
    max_angle = math.pi * 0.8
    cx, cy = 18, 12
    trail: List[Tuple[int, int, tuple]] = []
    for step in range(int(progress * 12)):
        t = step / 12.0
        angle = -0.3 + t * max_angle
        r = 8 + step * 0.3
        sx = cx + int(r * math.cos(angle))
        sy = cy + int(r * math.sin(angle))
        if 0 <= sx < GRID and 0 <= sy < GRID:
            c = brightness(p["highlight"], -step * 10)
            trail.append((sx, sy, c))
    if trail:
        s = add_pixels(s, "slash", trail, z_order=28)
    return s


# ── Tier 6 ───────────────────────────────────────────────────────────

def tier6_idle(sprite: Sprite, frame: int, total: int = 12) -> Sprite:
    """Wing pulse + gold aura particles orbit."""
    p = PALETTES[6]
    s = deep_copy_sprite(sprite)
    amt = int(25 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "wings", amt)
    # Four orbiting particles
    particles: List[Tuple[int, int, tuple]] = []
    for i in range(4):
        angle = 2 * math.pi * (frame / total) + i * (math.pi / 2)
        px = 16 + int(12 * math.cos(angle))
        py = 13 + int(10 * math.sin(angle))
        if 0 <= px < GRID and 0 <= py < GRID:
            particles.append((px, py, p["highlight"]))
    if particles:
        s = add_pixels(s, "orbit_particles", particles, z_order=32)
    return s


def tier6_action(sprite: Sprite, frame: int, total: int = 16) -> Sprite:
    """Wings flare outward + radial energy burst + edge flash."""
    p = PALETTES[6]
    s = deep_copy_sprite(sprite)

    # Wings extend further outward
    flare = min(3, (frame * 3) // total + 1)
    if "wings" in s:
        new_prims: list = []
        for pr in s["wings"].primitives:
            if isinstance(pr, Pixel):
                dx = -flare if pr.x < 16 else flare
                dy = -(flare // 2)
                new_prims.append(Pixel(pr.x + dx, pr.y + dy, pr.color))
            else:
                new_prims.append(pr)
        s["wings"].primitives = new_prims

    # Radial energy burst from center
    cx, cy = 16, 13
    radius = (frame * 12) // total + 1
    burst: List[Tuple[int, int, tuple]] = []
    for i in range(16):
        a = 2 * math.pi * i / 16
        for r in range(max(0, radius - 2), radius + 1):
            bx = cx + int(r * math.cos(a))
            by = cy + int(r * math.sin(a))
            if 0 <= bx < GRID and 0 <= by < GRID:
                dist_fade = max(0, 255 - r * 20)
                c = brightness(p["highlight"], -(255 - dist_fade))
                burst.append((bx, by, c))
    if burst:
        s = add_pixels(s, "energy_burst", burst, z_order=28)

    # Edge flash for first 2 frames
    if frame < 2:
        flash: List[Tuple[int, int, tuple]] = []
        for x in range(GRID):
            flash.append((x, 0, p["highlight"]))
            flash.append((x, GRID - 1, p["highlight"]))
        for y in range(1, GRID - 1):
            flash.append((0, y, p["highlight"]))
            flash.append((GRID - 1, y, p["highlight"]))
        s = add_pixels(s, "flash", flash, z_order=50)

    return s


# ══════════════════════════════════════════════════════════════════════
#  Class Idle Transforms
# ══════════════════════════════════════════════════════════════════════


def class_builder_idle(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Wrench tap animation + terminal cursor blink."""
    dy = _BOB_8[frame % 8]
    s = shift_all(sprite, dy=dy)
    # Wrench taps down every other frame pair
    wrench_dy = 1 if (frame // 2) % 2 == 0 else 0
    s = shift_part(s, "wrench", dy=wrench_dy)
    # Terminal cursor blink (dim the highlight lines on alternate frames)
    if (frame // 2) % 2 == 1:
        s = brighten_part(s, "terminal", -30)
    return s


def class_scribe_idle(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Quill writing motion + floating ink drops."""
    p = CLASS_PALETTES["scribe"]
    s = deep_copy_sprite(sprite)
    # Quill bobs as if writing
    qx = [0, 0, -1, 0, 0, 0, 1, 0][frame % 8]
    qy = [0, -1, 0, 0, 1, 0, 0, -1][frame % 8]
    s = shift_part(s, "quill", dx=qx, dy=qy)
    # Ink drops float upward from quill tip area
    drops: List[Tuple[int, int, tuple]] = []
    for i in range(2):
        dy_drop = 12 - ((frame + i * 3) % 6)
        dx_drop = 22 + (i * 2 - 1)
        if 0 <= dy_drop < GRID and 0 <= dx_drop < GRID:
            drops.append((dx_drop, dy_drop, p["primary"]))
    if drops:
        s = add_pixels(s, "ink_drops", drops, z_order=26)
    return s


def class_strategist_idle(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Pointer taps map + flag flutters."""
    s = deep_copy_sprite(sprite)
    # Pointer taps (oscillate down)
    ptr_dy = 1 if (frame // 2) % 2 == 0 else 0
    s = shift_part(s, "pointer", dy=ptr_dy)
    # Flag flutter (shift flag cloth horizontally)
    flag_dx = [0, 1, 1, 0, 0, -1, -1, 0][frame % 8]
    s = shift_part(s, "flag", dx=flag_dx)
    # Subtle head bob
    dy = _BOB_8[frame % 8]
    s = shift_part(s, "head", dy=dy)
    return s


def class_alchemist_idle(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Bubbles rising from flask + swirl in mortar."""
    p = CLASS_PALETTES["alchemist"]
    s = deep_copy_sprite(sprite)
    # Bubbles rise from flask
    bubbles: List[Tuple[int, int, tuple]] = []
    for i in range(3):
        by = 8 - ((frame + i * 3) % 7)
        bx = 23 + (i % 2)
        if 0 <= by < GRID:
            bubbles.append((bx, by, p["accent"]))
    if bubbles:
        s = add_pixels(s, "bubbles", bubbles, z_order=24)
    # Mortar swirl (rotating pixel)
    swirl: List[Tuple[int, int, tuple]] = []
    angle = 2 * math.pi * frame / total
    sx = 8 + int(1.5 * math.cos(angle))
    sy = 14 + int(1 * math.sin(angle))
    if 0 <= sx < GRID and 0 <= sy < GRID:
        swirl.append((sx, sy, p["highlight"]))
    if swirl:
        s = add_pixels(s, "swirl", swirl, z_order=19)
    return s


def class_polymath_idle(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Three symbols orbit the figure + gentle body pulse."""
    p = CLASS_PALETTES["polymath"]
    s = deep_copy_sprite(sprite)
    # Remove static symbol positions (replaced with dynamic orbit)
    s = remove_part(s, "symbol_gear")
    s = remove_part(s, "symbol_quill")
    s = remove_part(s, "symbol_compass")
    # Orbit center and radius
    cx, cy = 16, 12
    radius = 9
    # Three symbols at 120° apart, rotating over time
    symbols = [
        ("gear",    CLASS_PALETTES["builder"]["accent"]),
        ("quill",   CLASS_PALETTES["scribe"]["primary"]),
        ("compass", CLASS_PALETTES["strategist"]["accent"]),
    ]
    for i, (name, color) in enumerate(symbols):
        angle = 2 * math.pi * (frame / total) + i * (2 * math.pi / 3)
        ox = cx + int(radius * math.cos(angle))
        oy = cy + int(radius * math.sin(angle))
        if 0 <= ox < GRID and 0 <= oy < GRID:
            s = add_pixels(s, f"orbit_{name}", [(ox, oy, color)], z_order=28)
    # Gentle pulse on body brightness
    amt = int(15 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "body", amt)
    return s


# ══════════════════════════════════════════════════════════════════════
#  Nio Idle Transforms
# ══════════════════════════════════════════════════════════════════════


def nio_tier1_idle(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Breathing bob + antenna glow pulse."""
    dy = _BOB_8[frame % 8]
    s = shift_all(sprite, dy=dy)
    amt = int(40 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "antenna", amt)
    return s


def nio_tier2_idle(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Head bob + sword energy flicker + shoulder gleam."""
    dy = _BOB_8[frame % 8]
    s = shift_part(sprite, "head", dy=dy)
    s = shift_part(s, "antenna", dy=dy)
    amt = int(30 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "sword", amt)
    if (frame // 2) % 2 == 0:
        s = brighten_part(s, "shoulders", 20)
    return s


def nio_tier3_idle(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Wing flutter + cape sway + sword glow pulse."""
    s = deep_copy_sprite(sprite)
    wing_dy = [0, -1, -1, 0, 0, 1, 1, 0, 0, 0][frame % 10]
    s = shift_part(s, "wings", dy=wing_dy)
    cape_dx = 1 if (frame // 3) % 2 == 0 else -1
    s = shift_part(s, "cape", dx=cape_dx)
    amt = int(35 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "sword", amt)
    return s


def nio_tier4_idle(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Larger wing pulse + orbiting code particles + visor glow."""
    p = NIO_PALETTE
    s = deep_copy_sprite(sprite)
    amt = int(30 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "wings", amt)
    s = remove_part(s, "particles")
    particles: List[Tuple[int, int, tuple]] = []
    for i in range(4):
        angle = 2 * math.pi * (frame / total) + i * (math.pi / 2)
        px = 16 + int(11 * math.cos(angle))
        py = 13 + int(9 * math.sin(angle))
        if 0 <= px < GRID and 0 <= py < GRID:
            particles.append((px, py, p["highlight"]))
    if particles:
        s = add_pixels(s, "orbit_particles", particles, z_order=30)
    s = brighten_part(s, "visor", abs(amt) // 2)
    cape_dx = [0, 0, 1, 1, 0, 0, -1, -1, 0, 0][frame % 10]
    s = shift_part(s, "cape", dx=cape_dx)
    return s


def nio_tier5_idle(sprite: Sprite, frame: int, total: int = 12) -> Sprite:
    """Float bob + wing pulse + aura orbiting + halo shimmer."""
    p = NIO_PALETTE
    s = deep_copy_sprite(sprite)
    bob = _BOB_12[frame % 12]
    s = shift_all(s, dy=bob)
    amt = int(35 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "wings", amt)
    s = brighten_part(s, "halo", abs(amt))
    s = remove_part(s, "aura")
    particles: List[Tuple[int, int, tuple]] = []
    for i in range(6):
        angle = 2 * math.pi * (frame / total) + i * (math.pi / 3)
        px = 16 + int(12 * math.cos(angle))
        py = 13 + int(10 * math.sin(angle))
        if 0 <= px < GRID and 0 <= py < GRID:
            particles.append((px, py, p["glow"]))
    if particles:
        s = add_pixels(s, "aura_orbit", particles, z_order=32)
    return s


# ══════════════════════════════════════════════════════════════════════
#  Partner Tool Animations
# ══════════════════════════════════════════════════════════════════════

def clay_idle(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Clay: Rainbow color pulse + floating data orb bob."""
    s = deep_copy_sprite(sprite)
    p = CLAY_PALETTE
    
    # Body color cycle (moldable effect)
    phase = frame / total
    colors = [
        p["rainbow_1"], p["rainbow_2"], p["rainbow_3"], 
        p["rainbow_4"], p["rainbow_5"]
    ]
    idx = int(phase * len(colors)) % len(colors)
    # Apply subtle tint shift to body parts based on cycle
    if "body" in s:
        s["body"].primitives[1].color = colors[idx] # Torso
    
    # Orb bob
    dy = _BOB_10[frame % 10]
    s = shift_part(s, "orb", dy=dy)
    
    # Orb pulse
    amt = int(30 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "orb", amt)
    
    return s

def instantly_idle(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Instantly: Electric spark flicker + staff pulse."""
    s = deep_copy_sprite(sprite)
    p = INSTANTLY_PALETTE
    
    # Body bob
    dy = _BOB_8[frame % 8]
    s = shift_all(s, dy=dy)
    
    # Staff flicker (random-ish brightness)
    flicker = [0, 20, -10, 30, 0, -20, 10, 40][frame % 8]
    s = brighten_part(s, "staff", flicker)
    
    # Occasional spark
    if frame % 4 == 0:
        sparks: List[Tuple[int, int, tuple]] = []
        sx = 21 + int(2 * math.cos(frame))
        sy = 5 + int(2 * math.sin(frame))
        if 0 <= sx < GRID and 0 <= sy < GRID:
            sparks.append((sx, sy, p["bolt"]))
        s = add_pixels(s, "sparks", sparks, z_order=30)
            
    return s

def heyreach_idle(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """HeyReach: Connection rings expand + visor glow."""
    s = deep_copy_sprite(sprite)
    p = HEYREACH_PALETTE
    
    # Head/Visor glow pulse
    amt = int(40 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "head", amt // 2)
    
    # Expanding rings from body center
    ring_phase = (frame % 5) / 5.0
    ring_r = 2 + int(ring_phase * 6)
    cx, cy = 16, 13
    ring_px: List[Tuple[int, int, tuple]] = []
    
    # Only draw 4 points of the ring for a "connection node" feel
    angles = [0, math.pi/2, math.pi, 3*math.pi/2]
    for a in angles:
        rx = cx + int(ring_r * math.cos(a))
        ry = cy + int(ring_r * math.sin(a))
        if 0 <= rx < GRID and 0 <= ry < GRID:
            c = brightness(p["ring"], -int(ring_phase * 100))
            ring_px.append((rx, ry, c))
            
    if ring_px:
        s = add_pixels(s, "connection_rings", ring_px, z_order=25)
        
    return s

def ouroboros_idle(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Ouroboros: Color bands cycle along infinity path + glow pulse."""
    s = deep_copy_sprite(sprite)
    p = OUROBOROS_PALETTE

    seg_names = [f"seg_{i}" for i in range(8)]
    active = frame % 8

    s = brighten_part(s, seg_names[active], 60)
    s = brighten_part(s, seg_names[(active - 1) % 8], 25)

    head_glow = int(20 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "head", head_glow)

    glow_px: List[Tuple[int, int, tuple]] = []
    for i in range(3):
        angle = 2 * math.pi * (frame + i * total / 3) / total
        denom = 1 + math.sin(angle) ** 2
        gx = 16 + int(12 * math.cos(angle) / denom)
        gy = 16 + int(8 * math.sin(angle) * math.cos(angle) / denom)
        if 0 <= gx < GRID and 0 <= gy < GRID:
            fade = int(40 * math.sin(2 * math.pi * (frame + i * 2) / total))
            glow_px.append((gx, gy, brightness(p["glow"], fade)))

    if glow_px:
        s = add_pixels(s, "glow_particles", glow_px, z_order=5)

    return s


# ══════════════════════════════════════════════════════════════════════
#  Advanced Variant Transforms (enhanced glow, particles, intensity)
# ══════════════════════════════════════════════════════════════════════

# ── Tier 1 Advanced ─────────────────────────────────────────────────

def tier1_idle_advanced(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Base idle + stronger cursor glow + accent spark particles."""
    s = tier1_idle(sprite, frame, total)
    s = brighten_part(s, "cursor_block", 35)
    p = PALETTES[1]
    sparks: List[Tuple[int, int, tuple]] = []
    for i in range(2):
        angle = 2 * math.pi * (frame / total) + i * math.pi
        sx = 22 + int(3 * math.cos(angle))
        sy = 4 + int(2 * math.sin(angle))
        if 0 <= sx < GRID and 0 <= sy < GRID:
            sparks.append((sx, sy, brightness(p["accent"], -i * 20)))
    if sparks:
        s = add_pixels(s, "accent_sparks", sparks, z_order=29)
    return s


def tier1_action_advanced(sprite: Sprite, frame: int, total: int = 12) -> Sprite:
    """Base action + extra rain column + red-accented rain."""
    s = tier1_action(sprite, frame, total)
    p = PALETTES[1]
    rain: List[Tuple[int, int, tuple]] = []
    for col_off in [-2, 2]:
        x = 22 + col_off
        start = 2
        if frame >= start:
            age = frame - start
            for drop in range(min(age + 1, 12)):
                y = 6 + drop * 2
                if 0 <= y < GRID:
                    fade = max(50, 220 - drop * 25)
                    c = brightness(p["accent"], -(210 - fade))
                    rain.append((x, y, c))
    if rain:
        s = add_pixels(s, "rain_advanced", rain, z_order=28)
    return s


# ── Tier 2 Advanced ─────────────────────────────────────────────────

def tier2_idle_advanced(sprite: Sprite, frame: int, total: int = 8) -> Sprite:
    """Base idle + more orbiting dots (red accent) + brighter scroll glow."""
    s = tier2_idle(sprite, frame, total)
    s = brighten_part(s, "scroll", 25)
    p = PALETTES[2]
    extra: List[Tuple[int, int, tuple]] = []
    for i in range(2, 5):
        angle = 2 * math.pi * (frame / total) + i * (math.pi * 2 / 3)
        px = 16 + int(8 * math.cos(angle))
        py = 14 + int(6 * math.sin(angle))
        if 0 <= px < GRID and 0 <= py < GRID:
            extra.append((px, py, brightness(p["accent"], 30)))
    if extra:
        s = add_pixels(s, "particles_advanced", extra, z_order=31)
    return s


def tier2_action_advanced(sprite: Sprite, frame: int, total: int = 14) -> Sprite:
    """Base action + denser scroll extend + red-accented text glow."""
    s = tier2_action(sprite, frame, total)
    p = PALETTES[2]
    extra: List[Tuple[int, int, tuple]] = []
    max_extend = 10
    extend = min(max_extend, (frame * max_extend) // 14 + 1)
    for dy in range(max(0, extend - 6), extend):
        y = 20 + dy
        if y < GRID:
            extra.append((9, y, brightness(p["accent"], 25)))
    if extra:
        s = add_pixels(s, "scroll_glow", extra, z_order=20)
    return s


# ── Tier 3 Advanced ─────────────────────────────────────────────────

def tier3_idle_advanced(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Base idle + stronger orb pulse + red-accented ring segments."""
    s = tier3_idle(sprite, frame, total)
    amt = int(25 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "orb", amt)
    p = PALETTES[3]
    ring_phase = (frame % 5) / 5.0
    ring_r = 2 + int(ring_phase * 4)
    cx, cy = 23, 5
    ring_px: List[Tuple[int, int, tuple]] = []
    for step in range(12):
        a = 2 * math.pi * step / 12
        rx = cx + int(ring_r * math.cos(a))
        ry = cy + int(ring_r * math.sin(a))
        if 0 <= rx < GRID and 0 <= ry < GRID:
            c = brightness(p["accent"], -int(ring_phase * 60))
            ring_px.append((rx, ry, c))
    if ring_px:
        s = add_pixels(s, "rings_advanced", ring_px, z_order=26)
    return s


def tier3_action_advanced(sprite: Sprite, frame: int, total: int = 14) -> Sprite:
    """Base action + more thread lines + red-accented intensity."""
    s = tier3_action(sprite, frame, total)
    p = PALETTES[3]
    threads: List[Tuple[int, int, tuple]] = []
    for t in range(7, 10):
        base_angle = (2 * math.pi * t / 10) + 0.3
        length = min(frame + 2, 12)
        for step in range(length):
            angle = base_angle + step * 0.1
            dist = step * 1.5
            tx = 23 + int(dist * math.cos(angle))
            ty = 5 + int(dist * math.sin(angle))
            if 0 <= tx < GRID and 0 <= ty < GRID:
                c = brightness(p["accent"], -step * 12)
                threads.append((tx, ty, c))
    if threads:
        s = add_pixels(s, "threads_advanced", threads, z_order=27)
    return s


# ── Tier 4 Advanced ─────────────────────────────────────────────────

def tier4_idle_advanced(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Base idle + brighter flask + red-accented bubbles."""
    s = tier4_idle(sprite, frame, total)
    s = brighten_part(s, "flask", 30)
    p = PALETTES[4]
    bubbles: List[Tuple[int, int, tuple]] = []
    for i in range(5):
        by = 10 - ((frame + i * 2) % 8)
        bx = 22 + (i % 3) - 1
        if 0 <= bx < GRID and 0 <= by < GRID:
            bubbles.append((bx, by, brightness(p["accent"], 20)))
    if bubbles:
        s = add_pixels(s, "bubbles_advanced", bubbles, z_order=24)
    return s


def tier4_action_advanced(sprite: Sprite, frame: int, total: int = 16) -> Sprite:
    """Base action + denser burst + red-accented intensity."""
    s = tier4_action(sprite, frame, total)
    p = PALETTES[4]
    cx, cy = 22, 14
    radius = (frame * 10) // total + 1
    burst: List[Tuple[int, int, tuple]] = []
    num_pts = 20 + frame
    for i in range(num_pts):
        a = 2 * math.pi * i / num_pts
        bx = cx + int(radius * math.cos(a))
        by = cy + int(radius * math.sin(a))
        if 0 <= bx < GRID and 0 <= by < GRID:
            c = brightness(p["accent"], -frame * 5)
            burst.append((bx, by, c))
    if burst:
        s = add_pixels(s, "burst_advanced", burst, z_order=27)
    return s


# ── Tier 5 Advanced ─────────────────────────────────────────────────

def tier5_idle_advanced(sprite: Sprite, frame: int, total: int = 10) -> Sprite:
    """Base idle + stronger sword glow + brighter cape + accent ember particles."""
    s = tier5_idle(sprite, frame, total)
    amt = int(45 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "sword_blade", amt)
    s = brighten_part(s, "cape", 15)
    p = PALETTES[5]
    embers: List[Tuple[int, int, tuple]] = []
    for i in range(3):
        angle = 2 * math.pi * (frame / total) + i * (math.pi * 2 / 3)
        ex = 23 + int(3 * math.cos(angle))
        ey = 6 + int(4 * math.sin(angle))
        if 0 <= ex < GRID and 0 <= ey < GRID:
            embers.append((ex, ey, brightness(p["accent"], -i * 15)))
    if embers:
        s = add_pixels(s, "accent_embers", embers, z_order=29)
    return s


def tier5_action_advanced(sprite: Sprite, frame: int, total: int = 16) -> Sprite:
    """Base action + longer slash trail + red-accented particles."""
    s = tier5_action(sprite, frame, total)
    p = PALETTES[5]
    progress = min(frame / (16 * 0.7), 1.0)
    max_angle = math.pi * 0.85
    cx, cy = 18, 12
    trail: List[Tuple[int, int, tuple]] = []
    for step in range(int(progress * 16)):
        t = step / 16.0
        angle = -0.3 + t * max_angle
        r = 8 + step * 0.4
        sx = cx + int(r * math.cos(angle))
        sy = cy + int(r * math.sin(angle))
        if 0 <= sx < GRID and 0 <= sy < GRID:
            c = brightness(p["accent"], -step * 8)
            trail.append((sx, sy, c))
    if trail:
        s = add_pixels(s, "slash_advanced", trail, z_order=27)
    return s


# ── Tier 6 Advanced ─────────────────────────────────────────────────

def tier6_idle_advanced(sprite: Sprite, frame: int, total: int = 12) -> Sprite:
    """Base idle + stronger wing pulse + red-accented orbit particles + aura glow."""
    s = tier6_idle(sprite, frame, total)
    amt = int(40 * math.sin(2 * math.pi * frame / total))
    s = brighten_part(s, "wings", amt)
    s = brighten_part(s, "aura", 25)
    p = PALETTES[6]
    particles: List[Tuple[int, int, tuple]] = []
    for i in range(6):
        angle = 2 * math.pi * (frame / total) + i * (math.pi / 3)
        px = 16 + int(11 * math.cos(angle))
        py = 13 + int(9 * math.sin(angle))
        if 0 <= px < GRID and 0 <= py < GRID:
            particles.append((px, py, brightness(p["accent"], 20)))
    if particles:
        s = add_pixels(s, "orbit_advanced", particles, z_order=33)
    return s


def tier6_action_advanced(sprite: Sprite, frame: int, total: int = 16) -> Sprite:
    """Base action + denser energy burst (red accent) + stronger wing flare."""
    s = tier6_action(sprite, frame, total)
    p = PALETTES[6]
    cx, cy = 16, 13
    radius = (frame * 14) // total + 1
    burst: List[Tuple[int, int, tuple]] = []
    for i in range(24):
        a = 2 * math.pi * i / 24
        for r in range(max(0, radius - 3), radius + 2):
            bx = cx + int(r * math.cos(a))
            by = cy + int(r * math.sin(a))
            if 0 <= bx < GRID and 0 <= by < GRID:
                dist_fade = max(0, 255 - r * 15)
                c = brightness(p["accent"], -(255 - dist_fade))
                burst.append((bx, by, c))
    if burst:
        s = add_pixels(s, "energy_burst_advanced", burst, z_order=27)
    return s


# ══════════════════════════════════════════════════════════════════════
#  Animation Specs
# ══════════════════════════════════════════════════════════════════════

@dataclass
class AnimationSpec:
    """Config for one animation loop (idle or action)."""
    transform: Callable[[Sprite, int, int], Sprite]
    frames: int
    duration_ms: int      # per-frame duration

TIER_ANIMATIONS: Dict[int, Dict[str, AnimationSpec]] = {
    1: {
        "idle":   AnimationSpec(tier1_idle,   frames=8,  duration_ms=150),
        "action": AnimationSpec(tier1_action, frames=12, duration_ms=80),
    },
    2: {
        "idle":   AnimationSpec(tier2_idle,   frames=8,  duration_ms=150),
        "action": AnimationSpec(tier2_action, frames=14, duration_ms=80),
    },
    3: {
        "idle":   AnimationSpec(tier3_idle,   frames=10, duration_ms=150),
        "action": AnimationSpec(tier3_action, frames=14, duration_ms=80),
    },
    4: {
        "idle":   AnimationSpec(tier4_idle,   frames=10, duration_ms=150),
        "action": AnimationSpec(tier4_action, frames=16, duration_ms=80),
    },
    5: {
        "idle":   AnimationSpec(tier5_idle,   frames=10, duration_ms=150),
        "action": AnimationSpec(tier5_action, frames=16, duration_ms=80),
    },
    6: {
        "idle":   AnimationSpec(tier6_idle,   frames=12, duration_ms=150),
        "action": AnimationSpec(tier6_action, frames=16, duration_ms=80),
    },
}

TIER_ANIMATIONS_ADVANCED: Dict[int, Dict[str, AnimationSpec]] = {
    1: {
        "idle":   AnimationSpec(tier1_idle_advanced,   frames=8,  duration_ms=150),
        "action": AnimationSpec(tier1_action_advanced, frames=12, duration_ms=80),
    },
    2: {
        "idle":   AnimationSpec(tier2_idle_advanced,   frames=8,  duration_ms=150),
        "action": AnimationSpec(tier2_action_advanced, frames=14, duration_ms=80),
    },
    3: {
        "idle":   AnimationSpec(tier3_idle_advanced,   frames=10, duration_ms=150),
        "action": AnimationSpec(tier3_action_advanced, frames=14, duration_ms=80),
    },
    4: {
        "idle":   AnimationSpec(tier4_idle_advanced,   frames=10, duration_ms=150),
        "action": AnimationSpec(tier4_action_advanced, frames=16, duration_ms=80),
    },
    5: {
        "idle":   AnimationSpec(tier5_idle_advanced,   frames=10, duration_ms=150),
        "action": AnimationSpec(tier5_action_advanced, frames=16, duration_ms=80),
    },
    6: {
        "idle":   AnimationSpec(tier6_idle_advanced,   frames=12, duration_ms=150),
        "action": AnimationSpec(tier6_action_advanced, frames=16, duration_ms=80),
    },
}


CLASS_ANIMATIONS: Dict[str, Dict[str, AnimationSpec]] = {
    "builder": {
        "idle": AnimationSpec(class_builder_idle, frames=8, duration_ms=150),
    },
    "scribe": {
        "idle": AnimationSpec(class_scribe_idle, frames=8, duration_ms=150),
    },
    "strategist": {
        "idle": AnimationSpec(class_strategist_idle, frames=8, duration_ms=150),
    },
    "alchemist": {
        "idle": AnimationSpec(class_alchemist_idle, frames=10, duration_ms=150),
    },
    "polymath": {
        "idle": AnimationSpec(class_polymath_idle, frames=10, duration_ms=150),
    },
}


def get_tier_animation(tier: int, variant: str = "early") -> Dict[str, AnimationSpec]:
    """Return animation specs dict for the given tier (1-6) and variant (early|advanced)."""
    specs_map = TIER_ANIMATIONS_ADVANCED if variant == "advanced" else TIER_ANIMATIONS
    specs = specs_map.get(tier)
    if specs is None:
        raise ValueError(f"Invalid tier {tier}, must be 1-6")
    return specs


def get_class_animation(class_name: str) -> Dict[str, AnimationSpec]:
    """Return animation specs dict for the given RPG class name."""
    specs = CLASS_ANIMATIONS.get(class_name.lower())
    if specs is None:
        valid = ", ".join(CLASS_ANIMATIONS.keys())
        raise ValueError(f"Invalid class '{class_name}', must be one of: {valid}")
    return specs


NIO_ANIMATIONS: Dict[int, Dict[str, AnimationSpec]] = {
    1: {"idle": AnimationSpec(nio_tier1_idle, frames=8,  duration_ms=150)},
    2: {"idle": AnimationSpec(nio_tier2_idle, frames=8,  duration_ms=150)},
    3: {"idle": AnimationSpec(nio_tier3_idle, frames=10, duration_ms=150)},
    4: {"idle": AnimationSpec(nio_tier4_idle, frames=10, duration_ms=150)},
    5: {"idle": AnimationSpec(nio_tier5_idle, frames=12, duration_ms=150)},
}


def get_nio_animation(tier: int) -> Dict[str, AnimationSpec]:
    """Return animation specs dict for the given Nio tier (1-5)."""
    specs = NIO_ANIMATIONS.get(tier)
    return specs

# ══════════════════════════════════════════════════════════════════════
#  Partner Tool Lookups
# ══════════════════════════════════════════════════════════════════════

_TOOL_BUILDERS: Dict[str, Callable[[], Sprite]] = {
    "clay":      _clay_sprite,
    "instantly": _instantly_sprite,
    "heyreach":  _heyreach_sprite,
    "ouroboros": _ouroboros_sprite,
}

TOOL_ANIMATIONS: Dict[str, Dict[str, AnimationSpec]] = {
    "clay":      {"idle": AnimationSpec(clay_idle,      frames=10, duration_ms=150)},
    "instantly": {"idle": AnimationSpec(instantly_idle, frames=8,  duration_ms=100)},
    "heyreach":  {"idle": AnimationSpec(heyreach_idle,  frames=10, duration_ms=150)},
    "ouroboros": {"idle": AnimationSpec(ouroboros_idle,  frames=8,  duration_ms=150)},
}

def get_tool_sprite(tool_name: str) -> Sprite:
    """Build and return the sprite for the given partner tool."""
    builder = _TOOL_BUILDERS.get(tool_name.lower())
    if builder is None:
        valid = ", ".join(_TOOL_BUILDERS.keys())
        raise ValueError(f"Invalid tool '{tool_name}', must be one of: {valid}")
    return builder()

def get_tool_animation(tool_name: str) -> Dict[str, AnimationSpec]:
    """Return animation specs dict for the given partner tool."""
    specs = TOOL_ANIMATIONS.get(tool_name.lower())
    if specs is None:
        valid = ", ".join(TOOL_ANIMATIONS.keys())
        raise ValueError(f"Invalid tool '{tool_name}', must be one of: {valid}")
    return specs

# ══════════════════════════════════════════════════════════════════════
#  Animated GIF Renderer
# ══════════════════════════════════════════════════════════════════════


def render_animated_gif(
    sprite: Sprite,
    spec: AnimationSpec,
    output: Path,
    size: int = 256,
    bg: tuple = BG,
) -> None:
    """Render an animated GIF from a sprite + animation spec."""
    frames_img: List[Image.Image] = []
    for f in range(spec.frames):
        transformed = spec.transform(sprite, f, spec.frames)
        base = render_sprite(transformed, bg)
        frames_img.append(upscale(base, size))
    frames_img[0].save(
        str(output),
        save_all=True,
        append_images=frames_img[1:],
        duration=spec.duration_ms,
        loop=0,
        disposal=2,
    )

# ══════════════════════════════════════════════════════════════════════
#  CLI — standalone test render
# ══════════════════════════════════════════════════════════════════════

def _render_tier_preview(tier: int, size: int = 256) -> Image.Image:
    """Render a single tier's static sprite at the given output size."""
    sprite = get_tier_sprite(tier)
    base = render_sprite(sprite)
    return upscale(base, size)


def _render_sprite_sheet(size_per: int = 128) -> Image.Image:
    """Render all 6 tiers side-by-side in a horizontal sprite sheet."""
    gap = 4
    w = 6 * size_per + 5 * gap
    h = size_per
    sheet = Image.new("RGB", (w, h), BG[:3])
    for i, tier in enumerate(range(1, 7)):
        img = _render_tier_preview(tier, size_per)
        x = i * (size_per + gap)
        sheet.paste(img, (x, 0))
    return sheet


def _render_nio_assets(tiers: List[int], size: int = 256) -> None:
    """Render Nio static PNGs and idle GIFs for the given tiers."""
    AVATAR_DIR.mkdir(parents=True, exist_ok=True)

    for tier in tiers:
        sprite = get_nio_sprite(tier)

        # Static PNG
        base = render_sprite(sprite)
        img = upscale(base, size)
        static_path = AVATAR_DIR / f"nio-tier-{tier}-static.png"
        img.save(str(static_path))
        print(f"  ✓ nio tier {tier} static  → {static_path}  ({size}×{size})")

        # Idle GIF
        spec = get_nio_animation(tier)["idle"]
        gif_path = AVATAR_DIR / f"nio-tier-{tier}-idle.gif"
        render_animated_gif(sprite, spec, gif_path, size=size)
        print(f"  ✓ nio tier {tier} idle    → {gif_path}  ({spec.frames} frames)")


def _render_tool_assets(tool_names: List[str], size: int = 256) -> None:
    """Render tool avatar static PNGs and idle GIFs."""
    AVATAR_DIR.mkdir(parents=True, exist_ok=True)
    
    for name in tool_names:
        name_clean = name.lower()
        sprite = get_tool_sprite(name_clean)
        
        # Static PNG
        base = render_sprite(sprite)
        img = upscale(base, size)
        static_path = AVATAR_DIR / f"tool-{name_clean}-static.png"
        img.save(str(static_path))
        print(f"  ✓ tool {name_clean} static → {static_path} ({size}×{size})")
        
        # Idle GIF
        spec = get_tool_animation(name_clean)["idle"]
        gif_path = AVATAR_DIR / f"tool-{name_clean}-idle.gif"
        render_animated_gif(sprite, spec, gif_path, size=size)
        print(f"  ✓ tool {name_clean} idle   → {gif_path} ({spec.frames} frames)")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Render RPG avatar sprites (test / preview)")
    parser.add_argument("--tier", type=int, choices=range(1, 7),
                        help="Render a specific tier (1-6). Omit for all.")
    parser.add_argument("--nio", action="store_true",
                        help="Render Nio avatar sprites instead of humanoid tiers.")
    parser.add_argument("--nio-tier", type=int, choices=range(1, 6),
                        help="Render a specific Nio tier (1-5). Implies --nio.")
    parser.add_argument("--size", type=int, default=256,
                        help="Output size in px (default 256)")
    parser.add_argument("--tools", action="store_true",
                        help="Render all partner tool avatars (Clay, Instantly, HeyReach).")
    parser.add_argument("--tool", type=str, choices=["clay", "instantly", "heyreach", "ouroboros"],
                        help="Render a specific partner tool avatar.")
    args = parser.parse_args()

    AVATAR_DIR.mkdir(parents=True, exist_ok=True)

    # Tool rendering mode
    if args.tools or args.tool:
        tool_names = [args.tool] if args.tool else ["clay", "instantly", "heyreach", "ouroboros"]
        _render_tool_assets(tool_names, args.size)
        print(f"\n  Done — {len(tool_names)} tool avatar(s) rendered to {AVATAR_DIR}/")
        return

    # Nio rendering mode
    if args.nio or args.nio_tier:
        nio_tiers = [args.nio_tier] if args.nio_tier else list(range(1, 6))
        _render_nio_assets(nio_tiers, args.size)
        print(f"\n  Done — {len(nio_tiers)} Nio tier(s) rendered to {AVATAR_DIR}/")
        return

    tiers = [args.tier] if args.tier else list(range(1, 7))

    for tier in tiers:
        img = _render_tier_preview(tier, args.size)
        out = AVATAR_DIR / f"tier-{tier}-static.png"
        img.save(str(out))
        print(f"  ✓ tier {tier} → {out}  ({args.size}×{args.size})")

    # Sprite sheet (all 6 tiers at 128px)
    sheet = _render_sprite_sheet(128)
    sheet_path = AVATAR_DIR / "sprite-sheet.png"
    sheet.save(str(sheet_path))
    print(f"  ✓ sprite sheet → {sheet_path}")

    print(f"\n  Done — {len(tiers)} tier(s) rendered to {AVATAR_DIR}/")


if __name__ == "__main__":
    main()
