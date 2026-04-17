# UI-TASK4: Donor Portal Components

## Status: PENDING

## Description
Build donor-specific UI components

## Components to Build

### AlertScreen
- Location: `src/components/donor/AlertScreen.tsx`
- Full viewport takeover
- Red pulsing border
- Countdown timer (45s)
- Accept/Decline buttons
- Animation: screenShake on mount

### BloodGroupSelector
- Location: `src/components/donor/BloodGroupSelector.tsx`
- Visual blood drop icons (8 groups)
- Color-coded per blood type
- Selection animation

### ReliabilityBadge
- Location: `src/components/donor/ReliabilityBadge.tsx`
- Circular progress (SVG arc)
- 80px, score in center
- Color: gradient red-500 to red-700

### LivesSavedCounter
- Location: `src/components/donor/LivesSavedCounter.tsx`
- Count-up animation
- Heart icon
- Large number display

### StreakTracker
- Location: `src/components/donor/StreakTracker.tsx`
- Calendar dots (filled/empty)
- 12-day horizontal display

### AvailabilityToggle
- Location: `src/components/donor/AvailabilityToggle.tsx`
- Large green/red switch
- Smooth transition animation

### NavigationMap
- Location: `src/components/donor/NavigationMap.tsx`
- Mapbox with route
- ETA countdown
- "I've Arrived" button

### DonationMode
- Location: `src/components/donor/DonationMode.tsx`
- Progress bar (donation %)
- AI Companion chat
- Tab navigation: Chat | Music | Trivia | Impact

### ImpactCard
- Location: `src/components/donor/ImpactCard.tsx`
- Shareable card (400x600px)
- Instagram ratio
- Badge unlock animation

### DonorDashboard
- Location: `src/pages/donor/Dashboard.tsx`
- Aggregates: ReliabilityBadge + LivesSavedCounter + MiniMap + StreakTracker

## Design Specs (from design.md)
- Alert: 64px blood type, 48px countdown
- Reliability: circular SVG, 80px badge
- Count-up: cubic-bezier(0.34,1.56,0.64,1), 600ms
- Glass cards with proper elevation

## Progress
- [ ] AlertScreen
- [ ] BloodGroupSelector
- [ ] ReliabilityBadge
- [ ] LivesSavedCounter
- [ ] StreakTracker
- [ ] AvailabilityToggle
- [ ] NavigationMap
- [ ] DonationMode
- [ ] ImpactCard
- [ ] DonorDashboard