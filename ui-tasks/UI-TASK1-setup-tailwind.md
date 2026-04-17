# UI-TASK1: Setup Tailwind + Global Styles

## Status: PENDING

## Description
Configure Tailwind CSS with custom tokens from design.md

## Steps
1. Install Tailwind CSS
2. Configure tailwind.config.js with custom colors
3. Create globals.css with custom animations
4. Import Inter + Space Grotesk + JetBrains Mono fonts

## Design Tokens

### Colors
```js
colors: {
  'bg-primary':   '#080B12',
  'bg-secondary': '#0C1020',
  'blood':       '#FF3B3B',
  'success':     '#22C55E',
  'warning':     '#FACC15',
  'info':        '#3B82F6',
  'ai':          '#A78BFA',
}
```

### Animations
```js
animation: {
  'heartbeat':   'heartbeat 1.4s ease-in-out infinite',
  'pulse-dot':  'pulseDot 1.2s ease-in-out infinite',
  'critical':   'criticalPulse 2s ease-in-out infinite',
  'tick-scroll':'tickScroll 22s linear infinite',
  'ai-think':   'aiThink 1.5s ease-in-out infinite',
  'screen-shake':'screenShake 0.5s ease-in-out',
}
```

### CSS Keyframes
- heartbeat, pulseDot, criticalPulse
- tickScroll, aiThink, screenShake
- donorPulse, emergRing, survivalShimmer

## Verification
- npm run dev shows dark theme
- Colors match design.md hex values
- Fonts load correctly

## Progress
- [ ]