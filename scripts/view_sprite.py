#!/usr/bin/env python3
"""
Terminal Sprite Viewer - Preview RPG avatars in the terminal
Usage:
    python3 scripts/view_sprite.py                    # Show current avatar
    python3 scripts/view_sprite.py --tier 3           # Show tier 3 (early variant)
    python3 scripts/view_sprite.py --tier 3 --advanced # Show tier 3 advanced
    python3 scripts/view_sprite.py --tier 3 --action  # Show action animation
    python3 scripts/view_sprite.py --tier 3 --animate # Animate the GIF
    python3 scripts/view_sprite.py --all              # Show all tiers
"""

from PIL import Image
import sys
import os
import time
import argparse

AVATARS_DIR = "data/progression/avatars"

def render_frame_terminal(img, scale=1):
    """Render a single frame using ANSI color blocks"""
    w, h = img.size
    
    # Optionally scale
    if scale != 1:
        w, h = w // scale, h // scale
        img = img.resize((w, h), Image.NEAREST)
    
    lines = []
    for y in range(0, h, 2):
        line = ""
        for x in range(w):
            top = img.getpixel((x, y))
            bottom = img.getpixel((x, y+1)) if y+1 < h else (0,0,0,0)
            
            # Handle transparency
            if top[3] < 50 and bottom[3] < 50:
                line += ' '
            elif bottom[3] < 50:
                r, g, b = top[:3]
                line += f'\033[38;2;{r};{g};{b}m▀\033[0m'
            elif top[3] < 50:
                r, g, b = bottom[:3]
                line += f'\033[38;2;{r};{g};{b}m▄\033[0m'
            else:
                r1, g1, b1 = top[:3]
                r2, g2, b2 = bottom[:3]
                line += f'\033[38;2;{r1};{g1};{b1};48;2;{r2};{g2};{b2}m▀\033[0m'
        lines.append(line)
    return '\n'.join(lines)

def animate_gif(path, loops=3, scale=1):
    """Animate a GIF in the terminal"""
    img = Image.open(path)
    frames = []
    
    try:
        while True:
            frames.append(img.copy().convert('RGBA'))
            img.seek(img.tell() + 1)
    except EOFError:
        pass
    
    duration = img.info.get('duration', 100) / 1000.0
    
    for _ in range(loops):
        for frame in frames:
            # Clear screen and move cursor to top
            print('\033[2J\033[H', end='')
            print(render_frame_terminal(frame, scale))
            time.sleep(duration)

def show_static(path, scale=1):
    """Show a static image"""
    img = Image.open(path).convert('RGBA')
    print(render_frame_terminal(img, scale))

def show_tier(tier, variant='early', animation='idle', scale=1, animate=False):
    """Show a specific tier avatar"""
    variant_suffix = '-advanced' if variant == 'advanced' else ''
    
    if animate:
        path = f"{AVATARS_DIR}/tier-{tier}-{animation}{variant_suffix}.gif"
        if os.path.exists(path):
            print(f"\n🎮 Tier {tier} ({variant}) - {animation.upper()} animation")
            print("=" * 50)
            animate_gif(path, loops=3, scale=scale)
        else:
            print(f"❌ Not found: {path}")
    else:
        path = f"{AVATARS_DIR}/tier-{tier}-static{variant_suffix}.png"
        if os.path.exists(path):
            print(f"\n🎮 Tier {tier} ({variant})")
            print("=" * 30)
            show_static(path, scale=scale)
        else:
            print(f"❌ Not found: {path}")

def show_all_tiers(variant='early', scale=2):
    """Show all tiers side by side"""
    print(f"\n🎮 All Tiers ({variant} variant)")
    print("=" * 60)
    
    for tier in range(1, 7):
        variant_suffix = '-advanced' if variant == 'advanced' else ''
        path = f"{AVATARS_DIR}/tier-{tier}-static{variant_suffix}.png"
        
        if os.path.exists(path):
            print(f"\nTier {tier}:")
            show_static(path, scale=scale)
        else:
            print(f"\nTier {tier}: ❌ Not found")

def main():
    parser = argparse.ArgumentParser(description='View RPG sprites in terminal')
    parser.add_argument('--tier', type=int, help='Tier number (1-6)')
    parser.add_argument('--advanced', action='store_true', help='Show advanced variant')
    parser.add_argument('--action', action='store_true', help='Show action animation')
    parser.add_argument('--animate', action='store_true', help='Animate GIFs')
    parser.add_argument('--scale', type=int, default=1, help='Scale factor (1=full size)')
    parser.add_argument('--all', action='store_true', help='Show all tiers')
    
    args = parser.parse_args()
    
    variant = 'advanced' if args.advanced else 'early'
    animation = 'action' if args.action else 'idle'
    
    if args.all:
        show_all_tiers(variant=variant, scale=args.scale or 2)
    elif args.tier:
        show_tier(args.tier, variant=variant, animation=animation, 
                 scale=args.scale, animate=args.animate)
    else:
        # Show current avatar
        path = f"{AVATARS_DIR}/current.png"
        if os.path.exists(path):
            print("\n🎮 Current Avatar")
            print("=" * 30)
            show_static(path, scale=args.scale)
        else:
            print("❌ No current avatar found")
            print("\nTry: python3 scripts/view_sprite.py --tier 1")

if __name__ == '__main__':
    main()
