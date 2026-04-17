# TASK12: Hospital Portal - AI Matching Screen

## Status: PENDING

## Description
Build AI matching screen with ranked donors

## Screens
### Screen 4: AI Matching Screen (DEMO GOLD)
- Shows AI working in real-time (animated)
- Ranked donor list appears one by one:
  - Ravi — O+, 2.1km, Score: 91, ETA: 8 min ✅ Alerting...
  - Sarah — O+, 3.4km, Score: 84, ETA: 11 min ⏳ Standby
- Survival Probability meter (live arc):
  - "42% → 58% → 78%" as donors confirm
- Multi-channel alert feed:
  - 📱 App notification sent — 2s ago
  - 💬 WhatsApp sent — 3s ago
  - 📞 Auto-call initiated — 4s ago

## Components
- `AIMatchingScreen.tsx`
- `RankedDonorList.tsx`
- `DonorCard.tsx`
- `SurvivalMeter.tsx`
- `AlertChannelFeed.tsx`

## Backend API
- `/api/match` - get ranked donors
- WebSocket: donor response updates

## Progress
- [ ]