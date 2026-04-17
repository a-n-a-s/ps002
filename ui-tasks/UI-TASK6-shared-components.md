# UI-TASK6: Shared Components

## Status: PENDING

## Description
Build shared components used across both portals

## Components to Build

### LiveTicker
- Location: `src/components/shared/LiveTicker.tsx`
- Fixed top, 32px height
- Duplicate content for seamless loop
- Animation: tickScroll 22s linear infinite
- Color coding by metric type

### NavigationBar
- Location: `src/components/shared/NavigationBar.tsx`
- 48px height, sticky
- Logo with heartbeat animation
- 4 live counters
- Live badge + clock

### BloodDrop
- Location: `src/components/shared/BloodDrop.tsx`
- SVG teardrop shape
- Sizes: 24px, 32px, 48px
- Fills: blood group color

### LiveBadge
- Location: `src/components/shared/LiveBadge.tsx`
- Pill shape, pulseDot animation
- Text: LIVE

### StatusIndicator
- Location: `src/components/shared/StatusIndicator.tsx`
- Variants: arrived, alerting, standby, declined
- Color-coded + animation

### GatewayLayout
- Location: `src/components/shared/GatewayLayout.tsx`
- Split screen: left donor, right hospital
- Center: city heatmap
- Bottom: comparison banner

### Countdown
- Location: `src/components/shared/Countdown.tsx`
- Timer display (48px mono font)
- Red when < 10s
- Pulse animation

### ImpactCard
- Location: `src/components/shared/ImpactCard.tsx`
- Shareable card template
- 400x600px
- Gradient background
- Stats + badge + AI story

### EmergencyBanner
- Location: `src/components/shared/EmergencyBanner.tsx`
- Full width, slides down from top
- Red background, pulse animation
- Critical emergency alert

### TrustBadge
- Location: `src/components/shared/TrustBadge.tsx`
- Hospital trust score
- Star icon
- Score display

## Design Specs (from design.md)
- Ticker: 11px, letter-spacing 0.06em
- Navbar: backdrop-blur 20px
- BloodDrop: 50% 50% 50% 10% border-radius
- Live badge: 10px font, pulseDot animation
- Countdown: tabular-nums, red when < 10s

## Progress
- [ ] LiveTicker
- [ ] NavigationBar
- [ ] BloodDrop
- [ ] LiveBadge
- [ ] StatusIndicator
- [ ] GatewayLayout
- [ ] Countdown
- [ ] ImpactCard
- [ ] EmergencyBanner
- [ ] TrustBadge