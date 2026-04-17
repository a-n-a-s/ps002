# UI-TASK3: Animation System

## Status: PENDING

## Description
Implement Framer Motion + CSS animations

## Animations

### Fader Motion Variants
```typescript
const smooth = { type: "spring", stiffness: 300, damping: 30 }
const snappy = { type: "spring", stiffness: 400, damping: 40 }
const slow = { type: "tween", duration: 0.5 }
```

### Keyframe Animations
| Name | Use | Duration | Easing |
|------|-----|----------|--------|
| heartbeat | Logo pulse | 1400ms | ease-in-out |
| pulseDot | Live badges | 1200ms | ease-in-out |
| criticalPulse | Alert card glow | 2000ms | ease-in-out |
| donorPulse | Map donor dots | 2000ms | ease-in-out |
| emergRing | Emergency rings | 2000ms | linear |
| tickScroll | Ticker scroll | 22s | linear |
| aiThink | AI "thinking" | 1500ms | ease-in-out |
| screenShake | Alert takeover | 500ms | ease-in-out |
| survivalShimmer | Survival arc | 1500ms | ease-in-out |

### Custom Hooks
- `usePulse()` - pulsing animation
- `useCountUp()` - animated number counter
- `useTicker()` - scrolling ticker

### Common Animation Components
- `AnimateIn.tsx` - fade/slide in on mount
- `PulseDot.tsx` - pulsing dot
- `CountUp.tsx` - animated number
- `Shimmer.tsx` - loading shimmer

## Implementation
- Install framer-motion
- Export reusable motion props
- Add CSS keyframes to globals.css
- Create animation hooks

## Progress
- [ ] Framer Motion setup
- [ ] CSS keyframes
- [ ] Motion variants
- [ ] Animation hooks
- [ ] Common components