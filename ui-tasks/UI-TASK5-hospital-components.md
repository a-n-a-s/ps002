# UI-TASK5: Hospital Portal Components

## Status: PENDING

## Description
Build hospital-specific UI components

## Components to Build

### CommandCenterLayout
- Location: `src/components/hospital/CommandCenterLayout.tsx`
- Grid: left 240px | center flex | right 220px
- Structure: ticker + nav + main + bottom feed

### LiveMap
- Location: `src/components/hospital/LiveMap.tsx`
- Mapbox dark theme
- Layers: grid, heatmap, donor dots, hospital pins, emergency rings, ambulance
- SVG animations for pulsing

### DonorDot
- Location: `src/components/hospital/DonorDot.tsx`
- Animated pulsing circle
- Color: success green
- Outer glow ring animation

### EmergencyRing
- Location: `src/components/hospital/EmergencyRing.tsx`
- Red expanding circles (3 rings, staggered)
- Infinite animation

### EmergencyCard
- Location: `src/components/hospital/EmergencyCard.tsx`
- Shows: ID, blood type, hospital, survival %, progress bar
- States: critical (red), warning (amber), stable (green)
- Click: pan map to location

### InventoryPanel
- Location: `src/components/hospital/InventoryPanel.tsx`
- 8 blood groups with progress bars
- Critical threshold: < 3 units = red bar
- Animation: criticalPulse

### SurvivalMeter
- Location: `src/components/hospital/SurvivalMeter.tsx`
- SVG arc (stroke-dasharray)
- 78% example display
- Smooth transition

### AIDonorCard
- Location: `src/components/hospital/AIDonorCard.tsx`
- Shows: name, blood type, distance, score, status
- Status colors: arrived (green), alerting (amber), standby (blue)

### CascadeTimeline
- Location: `src/components/hospital/CascadeTimeline.tsx`
- Vertical timeline
- Sequential row reveal (150ms delay)
- Indicators: success (green), failed (red), in-progress (amber)

### EmergencyForm
- Location: `src/components/hospital/EmergencyForm.tsx`
- Blood group selector
- Units required input
- Urgency selector (green/yellow/red)
- Submit + critical warning modal

### BloodBankTable
- Location: `src/components/hospital/BloodBankTable.tsx`
- Table: group × bank × units × expiry
- Red highlight: expiring soon
- Smart suggestion card

### LiveTracking
- Location: `src/components/hospital/LiveTracking.tsx`
- Real-time route display
- ETA countdown
- Fallback option

### HospitalDashboard
- Location: `src/pages/hospital/Dashboard.tsx`
- Aggregates all hospital components

## Design Specs (from design.md)
- Emergency card: progress bar = survival probability
- Inventory: 8 groups, critical < 3 units
- Survival arc: 40px radius, stroke-width 6px
- Cascade: 150ms stagger between rows

## Progress
- [ ] CommandCenterLayout
- [ ] LiveMap
- [ ] DonorDot
- [ ] EmergencyRing
- [ ] EmergencyCard
- [ ] InventoryPanel
- [ ] SurvivalMeter
- [ ] AIDonorCard
- [ ] CascadeTimeline
- [ ] EmergencyForm
- [ ] BloodBankTable
- [ ] LiveTracking
- [ ] HospitalDashboard