# BloodLink — Complete UI/UX Design Guide
> For vibecoding the life-or-death emergency blood coordination system

---

## Philosophy

This is not a dashboard. This is an **emergency control system**. Every pixel must feel like it matters. The UI should make a judge feel:

> *"If I don't act right now, someone dies."*

Three emotional pillars:
- 🚑 Emergency control room — cinematic, high-stakes
- ❤️ Human + emotional — lives behind every number
- ⚡ Real-time + alive — nothing is static, everything breathes

---

## Color System

### Primary Palette (Non-negotiable)

```css
--bg-primary:     #080B12;   /* Deep cinematic black */
--bg-secondary:   #0C1020;   /* Map/panel backgrounds */
--bg-glass:       rgba(255, 255, 255, 0.04);  /* Card fills */
--border-glass:   rgba(255, 255, 255, 0.08);  /* Card borders */

--red:            #FF3B3B;   /* URGENCY — alerts, blood, CTA */
--red-dim:        rgba(255, 59, 59, 0.15);
--red-glow:       rgba(255, 59, 59, 0.35);

--green:          #22C55E;   /* SUCCESS — accepted, arrived, saved */
--green-dim:      rgba(34, 197, 94, 0.12);

--amber:          #FACC15;   /* WARNING — alerting, pending, urgent */
--amber-dim:      rgba(250, 204, 21, 0.12);

--blue:           #3B82F6;   /* INFO — standby, routes, hospital pins */
--blue-dim:       rgba(59, 130, 246, 0.12);

--purple:         #A78BFA;   /* AI — matching engine, neural indicators */
--purple-dim:     rgba(167, 139, 250, 0.08);

--text-primary:   #F0F4FF;
--text-sub:       rgba(240, 244, 255, 0.70);
--text-muted:     rgba(240, 244, 255, 0.45);
```

### Usage Rules

| Color | Use For | Never Use For |
|-------|---------|---------------|
| `--red` | Critical alerts, blood type badges, CTAs | General information |
| `--green` | Donor accepted, life saved, success states | Warnings |
| `--amber` | Alerting in progress, donor en route, pending | Success |
| `--blue` | Standby donors, info panels, hospital markers | Urgency |
| `--purple` | AI/neural engine indicators only | Medical status |

> **Rule:** Red is used sparingly but dramatically. One red element on screen = maximum impact.

---

## Typography

```css
font-family: 'Inter', sans-serif;

/* Scale */
--text-xs:   9px;    /* Labels, badges, ALL CAPS tracking */
--text-sm:   11px;   /* Timestamps, secondary info */
--text-base: 13px;   /* Body content */
--text-md:   16px;   /* Card values */
--text-lg:   18px;   /* Blood type display */
--text-xl:   24px;   /* Impact numbers (lives saved, survival %) */
--text-2xl:  32px;   /* Hero stats */
--text-hero: 48px+;  /* Full-screen emergency countdowns */

/* Weights */
--weight-normal: 400;
--weight-bold:   700;
--weight-black:  800;  /* Numbers that MUST hit hard */

/* Letter spacing */
--tracking-tight:  -0.02em;   /* Hero numbers */
--tracking-normal:  0;
--tracking-wide:    0.06em;   /* Ticker items */
--tracking-widest:  0.12em;   /* ALL CAPS section labels */
```

### Rules
- Blood types (`O-`, `AB+`) → `font-size: 18-28px; font-weight: 800`
- Impact metrics (lives saved, survival %) → `font-size: 24-32px; font-weight: 800`
- Section labels → `text-transform: uppercase; letter-spacing: 0.12em; font-size: 9px`
- Timestamps → `font-size: 10-11px; color: var(--text-muted)`

---

## Design Language

### Glassmorphism Cards

```css
/* Standard glass card */
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Critical state */
.glass-card.critical {
  border-color: rgba(255, 59, 59, 0.4);
  box-shadow: 0 0 20px rgba(255, 59, 59, 0.15);
}

/* AI/neural state */
.glass-card.ai {
  background: rgba(167, 139, 250, 0.06);
  border-color: rgba(167, 139, 250, 0.2);
}
```

### Depth Layers

```
Layer 0: #080B12           — App background
Layer 1: #0C1020           — Map/panel fill
Layer 2: rgba(w, 0.04)     — Glass cards
Layer 3: rgba(w, 0.07)     — Hovered cards
Layer 4: rgba(w, 0.10)     — Active/selected cards
```

---

## Animation System

### Core Keyframes

```css
/* Heartbeat logo pulse */
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14%       { transform: scale(1.18); }
  28%       { transform: scale(1); }
}

/* Donor dot breathing */
@keyframes donorPulse {
  0%, 100% { r: 5; opacity: 1; }
  50%       { r: 8; opacity: 0.5; }
}

/* Emergency expanding ring */
@keyframes emergRing {
  0%   { r: 12; opacity: 0.9; stroke-width: 2; }
  100% { r: 48; opacity: 0;   stroke-width: 0.5; }
}

/* Live badge pulse */
@keyframes pulseDot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 59, 59, 0.7); }
  70%       { box-shadow: 0 0 0 8px transparent; }
}

/* Alert card critical glow */
@keyframes criticalPulse {
  0%, 100% { box-shadow: 0 0 0 0 transparent; }
  50%       { box-shadow: 0 0 12px rgba(255, 59, 59, 0.25); }
}

/* Survival % arc shimmer */
@keyframes survivalShimmer {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.8; }
}

/* Count-up animation — use JS + CSS transition */
.counter-value {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Scrolling ticker */
@keyframes tickScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }  /* duplicate content for loop */
}

/* AI shimmer "thinking" */
@keyframes aiThink {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
}

/* Screen shake for emergency takeover */
@keyframes screenShake {
  0%, 100% { transform: translate(0, 0); }
  20%       { transform: translate(-3px, 2px); }
  40%       { transform: translate(3px, -2px); }
  60%       { transform: translate(-2px, 3px); }
  80%       { transform: translate(2px, -1px); }
}

/* Ambulance on map */
@keyframes ambulanceMove {
  0%   { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}
```

### Animation Speeds

| Use Case | Duration | Easing |
|----------|----------|--------|
| Button hover | 150ms | ease |
| Card hover | 200ms | ease |
| Emergency ring expand | 2000ms | linear, infinite |
| Heartbeat logo | 1400ms | ease-in-out, infinite |
| Donor dot pulse | 2000ms | ease-in-out, infinite |
| Ticker scroll | 22s | linear, infinite |
| Count-up numbers | 600ms | cubic-bezier(0.34, 1.56, 0.64, 1) |
| Alert banner slide | 400ms | ease |
| Screen shake | 500ms | ease-in-out |
| AI thinking shimmer | 1500ms | ease-in-out, infinite |

> **Rule:** If data updates → it animates. Nothing just "appears."

---

## Screen-by-Screen Specs

---

### 1. Live Ticker Bar

**Position:** Fixed top, above everything  
**Height:** 32px  
**Background:** `rgba(255, 59, 59, 0.08)`, `border-bottom: 1px solid rgba(255, 59, 59, 0.2)`

```
| ● LIVE | ✓ 23 lives saved · ⚡ 142 donors online · Avg: 8.4 min · ⚠ O- critical → |
```

**Implementation:**
- Duplicate content inside the ticker for seamless loop
- `animation: tickScroll 22s linear infinite`
- Color coding: green for success, amber for warnings, red for critical, white for info
- `font-size: 11px; font-weight: 600; letter-spacing: 0.06em`

---

### 2. Navigation Bar

**Height:** 48px  
**Background:** `rgba(8, 11, 18, 0.95)`, `backdrop-filter: blur(20px)`  
**Position:** Sticky, z-index 100

```
[🩸 BLOODLINK COMMAND]    [3 Emerg] [142 Donors] [8.4min Avg] [23 Saved]    [● LIVE  21:34:07]
```

**Logo:** Animated blood drop — `border-radius: 50% 50% 50% 10%`, heartbeat animation  
**Metrics:** 4 live counters, each updating via JS interval  
**Right:** Pulse dot + LIVE badge + real-time clock

---

### 3. Hospital Command Center (Main Screen)

**Layout:** CSS Grid 3 columns

```
┌─────────────────────────────────────────────────────────┐
│  TICKER BAR (32px)                                      │
├─────────────────────────────────────────────────────────┤
│  NAVBAR (48px)                                          │
├──────────────┬──────────────────────────┬───────────────┤
│              │                          │               │
│  LEFT PANEL  │      LIVE MAP            │  RIGHT PANEL  │
│  240px       │      (flex: 1)           │  220px        │
│              │                          │               │
│  Emergencies │  SVG city map:           │  Blood        │
│  AI Matching │  - Donor dots (green)    │  Inventory    │
│              │  - Hospital pins (blue)  │               │
│              │  - Emergency rings (red) │  Survival     │
│              │  - Ambulance (animated)  │  Meter        │
│              │  - Heatmap blobs         │               │
│              │  - Road grid             │  Hospital     │
│              │                          │  Trust        │
├──────────────┴──────────────────────────┴───────────────┤
│  BOTTOM ACTIVITY FEED (48px)                            │
└─────────────────────────────────────────────────────────┘
```

**Grid CSS:**
```css
.main-layout {
  display: grid;
  grid-template-columns: 240px 1fr 220px;
  grid-template-rows: 1fr 48px;
  height: calc(100vh - 80px); /* minus ticker + nav */
}
```

---

### 4. Emergency Cards (Left Panel)

```
┌─────────────────────────────────┐
│ #EMG-0041         [● CRITICAL]  │
│ O−                              │
│ KIMS Hospital · ICU 3B          │
│ 00:03:12          Surv: 42%     │
│ ████░░░░░░░░░░░░░ 30%           │
└─────────────────────────────────┘
```

**States:**
- `critical` → red border, `criticalPulse` animation, red progress bar
- `warning` → amber border, amber progress bar  
- `stable` → green border, green progress bar

**Progress bar** = survival probability fill

**Click behavior:** Pan/zoom map to hospital location

**Urgency badge styles:**
```css
.badge-critical { background: rgba(255,59,59,0.15); color: #FF3B3B; border: 1px solid rgba(255,59,59,0.3); }
.badge-warning  { background: rgba(250,204,21,0.12); color: #FACC15; border: 1px solid rgba(250,204,21,0.3); }
.badge-stable   { background: rgba(34,197,94,0.12);  color: #22C55E; border: 1px solid rgba(34,197,94,0.3); }
```

---

### 5. Live Map (Center)

**Background:** `#0C1020`  
**Tech:** SVG-based city grid (or Mapbox/Google Maps with dark theme)

**Map Layers (bottom to top):**
1. Dark base tiles
2. Grid lines — `rgba(255,255,255,0.025)`, 0.5px
3. City block fills — `rgba(26,34,53,0.18)` rectangles
4. Road network — `rgba(255,255,255,0.08)`, 4px width
5. Heatmap blobs — radial gradients (red for demand, blue for supply)
6. Hospital pins — blue squares with cross icon
7. Donor dots — green animated circles (pulsing)
8. Emergency rings — red expanding circles, infinite animation
9. Ambulance — emoji/SVG on `motion-path`, moving along road
10. Route line — dashed amber line from donor to hospital

**Donor Dots:**
```svg
<circle r="5" fill="#22C55E" opacity="0.8">
  <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
</circle>
<!-- outer glow ring -->
<circle r="12" fill="none" stroke="#22C55E" stroke-width="0.5" opacity="0.3">
  <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite"/>
</circle>
```

**Emergency Hospital:**
```svg
<!-- Expanding ring burst (3 rings at staggered delays) -->
<circle r="12" fill="none" stroke="#FF3B3B" stroke-width="2">
  <animate attributeName="r" from="12" to="50" dur="2s" repeatCount="indefinite"/>
  <animate attributeName="opacity" from="0.9" to="0" dur="2s" repeatCount="indefinite"/>
</circle>
<circle r="12" fill="none" stroke="#FF3B3B" stroke-width="2">
  <animate attributeName="r" from="12" to="50" dur="2s" begin="0.6s" repeatCount="indefinite"/>
  <animate attributeName="opacity" from="0.9" to="0" dur="2s" begin="0.6s" repeatCount="indefinite"/>
</circle>
```

**Ambulance:**
```css
.ambulance {
  offset-path: path('M 350 400 L 350 300 L 420 300 L 420 210');
  animation: ambulanceMove 8s linear infinite;
  font-size: 18px; /* emoji: 🚑 */
}
@keyframes ambulanceMove {
  0%   { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}
```

**Map Overlay HUD:**
- Top-left: "LIVE MAP · HYDERABAD" label
- Top-right: legend (green = donors, red = emergency, blue = hospital)
- Bottom: zoom controls + "Center City" button

---

### 6. Blood Inventory Panel (Right)

```
BLOOD INVENTORY
──────────────────────────────
O−  ████████████░░░  2 units  ⚠
O+  ████████████████  18 units
A+  ███████████░░░░░  12 units
A−  ████░░░░░░░░░░░░  4 units
B+  █████████░░░░░░░  9 units
B−  ██░░░░░░░░░░░░░░  2 units ⚠
AB+ ██████░░░░░░░░░░  6 units
AB− ████████████████  14 units
──────────────────────────────
```

**Critical threshold:** < 3 units → `criticalPulse` animation, red bar

**Bar color:** 
- Green if `>= 8 units`
- Amber if `3–7 units`
- Red if `< 3 units`

---

### 7. Survival Probability Arc (Right Panel)

```
       ╭────────╮
      /   78%    \
     |   ↑ +36%   |
      \           /
       ╰──SURV.──╯
   "Your match is working"
```

**Implementation:** SVG arc (stroke-dasharray trick)

```svg
<circle r="40" cx="60" cy="60" fill="none"
  stroke="rgba(255,255,255,0.08)" stroke-width="6"/>
<circle r="40" cx="60" cy="60" fill="none"
  stroke="#22C55E" stroke-width="6"
  stroke-dasharray="251.2" 
  stroke-dashoffset="55"    /* (1 - 0.78) * 251.2 */
  stroke-linecap="round"
  transform="rotate(-90 60 60)"
  style="transition: stroke-dashoffset 1s ease"/>
<text x="60" y="56" text-anchor="middle" font-size="20" font-weight="800" fill="#22C55E">78%</text>
<text x="60" y="72" text-anchor="middle" font-size="9" fill="rgba(240,244,255,0.45)">SURVIVAL</text>
```

**Update:** Every 3s, increment survival % as donors confirm. Transition is smooth via CSS.

---

### 8. AI Matching Section

```
╔══════════════════════════════╗
║  ● NEURAL MATCH ENGINE       ║
║                              ║
║  Ravi K. — O−               ║
║  2.1km · Score 91  ✓ ARRIVED ║
║                              ║
║  Priya S. — O−              ║
║  3.4km · Score 84  ⚡ ALERTING║
║                              ║
║  Arjun M. — O−              ║
║  4.2km · Score 79  ● STANDBY ║
║                              ║
║  Recalculating optimal...    ║
╚══════════════════════════════╝
```

**Donor status colors:**
- `ARRIVED` → `#22C55E`
- `ALERTING` → `#FACC15`, pulsing
- `STANDBY` → `#3B82F6`
- `DECLINED` → `#FF3B3B`, strikethrough name

**"Recalculating" text:** `animation: aiThink 1.5s ease-in-out infinite; font-style: italic`

---

### 9. Emergency Alert Screen (Full Screen Takeover)

**Trigger:** New critical emergency raised

```
╔══════════════════════════════════════════════╗
║▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓║
║                                              ║
║         🔴 EMERGENCY ALERT                   ║
║                                              ║
║              O −                             ║
║           BLOOD NEEDED                       ║
║                                              ║
║   KIMS Hospital · ICU 3B · 2.1km away        ║
║                                              ║
║   ████████████████████████ Survival: 42%     ║
║                                              ║
║   "Your response could raise survival to 78%"║
║                                              ║
║          ┌──────────┐                        ║
║          │  00:38   │  ← countdown           ║
║          └──────────┘                        ║
║                                              ║
║   [✓ ACCEPT — I CAN DONATE]  [✗ DECLINE]    ║
║                                              ║
╚══════════════════════════════════════════════╝
```

**Visual treatment:**
- Full-viewport overlay, `z-index: 9999`
- Red pulsing border: `animation: criticalPulse 0.8s ease-in-out infinite`
- Screen shake on appear: `animation: screenShake 0.5s ease-in-out`
- Blood type: `font-size: 64px; font-weight: 900; color: #FF3B3B`
- Countdown: `font-size: 48px; font-weight: 800; font-variant-numeric: tabular-nums`
- Accept button: `background: #22C55E; font-size: 16px; font-weight: 700; padding: 18px 36px`
- Decline button: `background: transparent; border: 1px solid rgba(255,255,255,0.2)`
- Haptic feedback on mobile: `navigator.vibrate([200, 100, 200])`

---

### 10. Failure Cascade Screen

```
TIMELINE — EMG-0041
─────────────────────────────────────────
00:00  ● Request raised                  ✓
00:03  ▶ Ravi alerted (O-, 2.1km)        ●── alerting...
00:48  ✗ No response — Auto-escalating   ✗
00:51  ▶ Priya alerted (O-, 3.4km)       ●── alerting...
01:10  ✗ Declined — Recalculating...     ✗
01:13  ▶ Arjun alerted (O-, 4.2km)       ●── alerting...
01:45  ✓ ACCEPTED — ETA: 7 min           ✓ ← green glow
─────────────────────────────────────────
    "AI selected next best match in 0.3s"
```

**Each row animates in sequentially** (150ms delay between rows)

**Left indicator dots:**
- Green circle = success
- Red circle = failed
- Amber pulsing = in progress

**AI reasoning text** appears between failure steps in purple/italic

---

### 11. Donor Dashboard

```
┌────────────────────────────────────────┐
│  ⭐ 91%                    🩸 23 Lives  │
│  RELIABILITY SCORE             SAVED   │
│  ████████████████████░          ↑      │
│                                count-up│
├────────────────────────────────────────┤
│           [MINI LIVE MAP]              │
│     Shows nearby hospitals + needs     │
├────────────────────────────────────────┤
│  🔥 12-Day Streak      🏅 Hero Badge   │
│                         (unlocking...) │
├────────────────────────────────────────┤
│  [UPCOMING EVENTS]                     │
│  Apollo Blood Drive · 3 days · 2.4km  │
└────────────────────────────────────────┘
```

**Reliability Score:** Circular SVG arc, same technique as survival meter  
**Lives Saved:** Count-up animation on mount  
**Streak:** Horizontal calendar dots (filled = donated, empty = not)  
**Badge unlock:** Scale + glow animation when milestone hit

---

### 12. Donation Mode Screen

```
┌────────────────────────────────────────┐
│  DONATION IN PROGRESS                  │
│  ████████████████░░░░░  73% complete   │
├────────────────────────────────────────┤
│  🤖 AI Companion                        │
│  ┌──────────────────────────────────┐  │
│  │ "You're doing great, Ravi! Did   │  │
│  │  you know O- blood can save      │  │
│  │  newborns in emergencies? 🩸"    │  │
│  └──────────────────────────────────┘  │
│  [Type a message...]      [Send]       │
├────────────────────────────────────────┤
│  [💬 Chat] [🎵 Music] [🧠 Trivia] [❤️ Impact]  │
└────────────────────────────────────────┘
```

**Post-donation:** Badge unlock animation + shareable card generation

---

## Component Library

### Buttons

```css
/* Primary CTA */
.btn-primary {
  background: #FF3B3B;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
}
.btn-primary:hover {
  background: #E02020;
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(255, 59, 59, 0.4);
}
.btn-primary:active {
  transform: scale(0.98);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: rgba(240, 244, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 150ms ease;
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* Danger CTA (emergency accept) */
.btn-accept {
  background: #22C55E;
  font-size: 16px;
  padding: 18px 36px;
  border-radius: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
}
.btn-accept:hover {
  transform: scale(1.04);
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
}
```

### Section Label

```css
.section-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(240, 244, 255, 0.45);
  padding: 0 14px;
  margin-bottom: 10px;
}
```

### Live Badge

```css
.live-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.10em;
  color: #FF3B3B;
  background: rgba(255, 59, 59, 0.12);
  border: 1px solid rgba(255, 59, 59, 0.3);
  padding: 3px 10px;
  border-radius: 20px;
}
```

### Status Indicators

```css
/* Pulse dot */
.pulse-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #FF3B3B;
  animation: pulseDot 1.2s ease-in-out infinite;
}

/* Donor status */
.status-arrived  { color: #22C55E; font-size: 9px; font-weight: 700; }
.status-alerting { color: #FACC15; font-size: 9px; font-weight: 700; animation: aiThink 1s ease-in-out infinite; }
.status-standby  { color: #3B82F6; font-size: 9px; font-weight: 700; }
.status-declined { color: #FF3B3B; font-size: 9px; font-weight: 700; }
```

### Progress Bar

```css
.progress-track {
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
}
.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s ease;
}
.progress-fill.critical { background: #FF3B3B; }
.progress-fill.warning  { background: #FACC15; }
.progress-fill.success  { background: #22C55E; }
```

---

## Scrollbar Styling

```css
::-webkit-scrollbar       { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
```

---

## Alert Banner (Top Flash)

Appears when a new critical emergency fires:

```css
.alert-banner {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  background: #FF3B3B;
  color: #fff;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 8px;
  transform: translateY(-100%);
  transition: transform 0.4s ease;
}
.alert-banner.show {
  transform: translateY(0);
}
```

---

## Dark Map Theme (If using Mapbox or Google Maps)

**Mapbox style:** `mapbox://styles/mapbox/dark-v11`  
**Google Maps custom style:**

```json
[
  { "elementType": "geometry", "stylers": [{ "color": "#0C1020" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "rgba(240,244,255,0.45)" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1A2235" }] },
  { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#1E2A42" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#080B12" }] }
]
```

---

## Micro-interaction Checklist

Before shipping any screen, verify:

- [ ] Every button has hover + active state
- [ ] All status changes animate (no instant jumps)
- [ ] Donor dots pulse on the map
- [ ] Emergency rings expand infinitely
- [ ] Survival % arc transitions smoothly
- [ ] Counter numbers count up (never just appear)
- [ ] Ticker scrolls without pause/flicker
- [ ] Cards slide in on mount (stagger 50ms each)
- [ ] Heartbeat logo pulses
- [ ] AI "thinking" indicator shimmer
- [ ] Alert banner slides down from top
- [ ] Ambulance moves along route
- [ ] Progress bars have CSS transitions

---

## What to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|--------------|
| Light background | Always dark (`#080B12`) |
| Multiple colors competing | Red for urgency only |
| Static dashboards | Everything breathes + updates |
| Text-heavy cards | Lead with numbers and blood types |
| More than 1 primary action per screen | One CTA king per screen |
| Non-animated state changes | Transition all state |
| Cluttered layouts | Glass cards with generous padding |
| Flat progress bars (no transition) | `transition: width 1s ease` |
| Round numbers that never change | Live JS intervals updating all stats |

---

## Tech Stack Recommendations

| Layer | Recommendation |
|-------|---------------|
| Framework | React + Vite |
| Styling | Tailwind CSS (with custom tokens above) |
| Animation | Framer Motion + CSS `@keyframes` |
| Map | Mapbox GL JS (dark-v11 theme) |
| Real-time | Socket.io |
| Charts | Recharts or Chart.js |
| State | Zustand |
| AI Companion | OpenAI GPT-4o streaming |
| Routing | React Router v6 |
| Icons | Lucide React |

---

## Tailwind Config (Custom Tokens)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary':   '#080B12',
        'bg-secondary': '#0C1020',
        'blood':        '#FF3B3B',
        'success':      '#22C55E',
        'warning':      '#FACC15',
        'info':         '#3B82F6',
        'ai':           '#A78BFA',
      },
      animation: {
        'heartbeat':     'heartbeat 1.4s ease-in-out infinite',
        'pulse-dot':     'pulseDot 1.2s ease-in-out infinite',
        'critical':      'criticalPulse 2s ease-in-out infinite',
        'tick-scroll':   'tickScroll 22s linear infinite',
        'ai-think':      'aiThink 1.5s ease-in-out infinite',
        'screen-shake':  'screenShake 0.5s ease-in-out',
      },
      backdropBlur: {
        'glass': '12px',
      },
      fontWeight: {
        'black': '800',
      },
    }
  }
}
```

---

## Final Mindset

> Every pixel should feel like it matters.  
> Every number represents a real human life.  
> Every animation communicates urgency, not decoration.

The UI should make anyone looking at it feel:  
**"This system is intelligent, alive, and already deployed in a real city."**

---

*BloodLink Design Guide v1.0 — Built for hackathon-winning UI execution*