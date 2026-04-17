# BloodLink - Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18+ 
- npm 9+

### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend  
cd ../backend
npm install
```

### 3. Environment Setup

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend (optional - works with demo data)
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```
Server runs on: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on: http://localhost:5173

---

## Features

### Donor Portal Flow
1. **Dashboard** → View reliability score, availability, blood group
2. **Alert Screen** (demo button) → Full-screen emergency with countdown
3. **Navigation** → Route map, ETA, "I've Arrived" button
4. **Donation Mode** → Progress bar, AI Companion chat, trivia, impact tracker

### Hospital Portal Flow
1. **Command Center** → Live map, AI matching, emergency list
2. **Live Tracking** → Real-time donor tracking, survival meter
3. **Cascade Timeline** → Step-by-step visualization
4. **Inventory** → Blood bank levels with alerts

---

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-----------|
| GET | `/api/health` | Server health check |
| GET | `/api/metrics` | Lives saved, donors online, avg time |
| GET | `/api/donors` | All donors |
| GET | `/api/inventory` | Blood inventory |
| GET | `/api/requests` | Emergency requests |
| GET | `/api/match/:bloodType` | Ranked donors for matching |
| POST | `/api/ai/score` | Score a donor |
| POST | `/api/ai/match` | AI donor matching |
| POST | `/api/ai/allocate` | Blood allocation |

---

## Optional Integrations

### Mapbox (for live maps)
1. Sign up at https://mapbox.com
2. Get public access token
3. Add to `frontend/.env`:
   ```
   VITE_MAPBOX_TOKEN=your_token_here
   ```

### Firebase (for real-time database)
1. Create project at https://console.firebase.google.com
2. Enable Authentication + Firestore
3. Add config to `frontend/.env`:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_PROJECT_ID=...
   ```
4. Install: `npm install firebase`

### OpenAI (for AI Companion)
1. Get API key at https://platform.openai.com
2. Add to `frontend/.env`:
   ```
   VITE_OPENAI_API_KEY=your_key
   ```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind + Framer Motion |
| Backend | Node.js + Express + Socket.io |
| Maps | Mapbox GL JS |
| State | Zustand |
| Real-time | Socket.io |
| DB | In-memory (demo) / Firebase (production) |

---

## Troubleshooting

**Port already in use:**
```bash
# Find process using port
netstat -ano | findstr ":5173"
# Kill process
taskkill /PID <pid> /F
```

**Mapbox not loading:**
Works in demo mode without token. Get one at mapbox.com for full functionality.

**Firebase errors:**
System works with demo data. Add Firebase config for real database.

---

## Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend  
cd ../backend
# Use PM2 or similar for production
pm2 start server.js
```

---

## Contact

For issues, check the console logs:
- Frontend: http://localhost:5173 (F12)
- Backend: Check terminal output