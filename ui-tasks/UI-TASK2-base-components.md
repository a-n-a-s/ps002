# UI-TASK2: Base UI Components

## Status: PENDING

## Description
Build base reusable UI components

## Components to Build

### Button
- Location: `src/components/ui/Button.tsx`
- Variants: primary (red), secondary (ghost), accept (green), danger
- Props: variant, children, disabled, onClick
- Styles: rounded-lg, proper hover/active states

### Card
- Location: `src/components/ui/Card.tsx`
- Variants: default, critical, ai
- Glassmorphism: bg-glass, border-glass
- Hover: border-red-600/30 glow

### Input
- Location: `src/components/ui/Input.tsx`
- Styles: dark bg, focus ring
- States: default, focus, error, disabled

### Badge
- Location: `src/components/ui/Badge.tsx`
- Variants: critical, warning, stable, success, info, ai
- Pill shape, color-coded

### Progress
- Location: `src/components/ui/Progress.tsx`
- Variants: critical, warning, success
- Animated fill

### Section Label
- Location: `src/components/ui/SectionLabel.tsx`
- Uppercase, letter-spacing 0.12em, 9px

## Design Specs (from design.md)
- Button primary: bg-blood (#FF3B3B), hover scale 1.02
- Card: 10px radius, glass background
- Input: 8px radius, red focus ring
- Badge: pill, border, bg-glass variants

## Progress
- [ ] Button
- [ ] Card
- [ ] Input
- [ ] Badge
- [ ] Progress
- [ ] SectionLabel