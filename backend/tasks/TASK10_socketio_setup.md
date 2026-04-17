# TASK 10: Socket.io Setup

## Objective
Set up real-time Socket.io rooms and events for live updates.

## Files to Create

### 10.1 Socket Manager (`src/sockets/socketManager.js`)

```javascript
import { Server } from 'socket.io';

/**
 * Socket.io setup and event handlers
 */
export function setupSocket(io) {
  
  // Connection handler
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);
    
    // Join hospital room
    socket.on('hospital:join', (hospitalId) => {
      socket.join(`hospital:${hospitalId}`);
      console.log(`[Socket] ${socket.id} joined hospital:${hospitalId}`);
    });
    
    // Join donor room
    socket.on('donor:join', (donorId) => {
      socket.join(`donor:${donorId}`);
      console.log(`[Socket] ${socket.id} joined donor:${donorId}`);
    });
    
    // Join emergency room
    socket.on('emergency:join', (emergencyId) => {
      socket.join(`emergency:${emergencyId}`);
      console.log(`[Socket] ${socket.id} joined emergency:${emergencyId}`);
    });
    
    // Donor location update
    socket.on('donor:location', (data) => {
      const { donorId, emergencyId, location, eta } = data;
      
      // Emit to hospital dashboard
      io.to(`hospital:${data.hospitalId}`).emit('donor:location', {
        donorId,
        emergencyId,
        location,
        eta,
        timestamp: new Date().toISOString(),
      });
      
      // Emit to emergency room
      io.to(`emergency:${emergencyId}`).emit('donor:location', {
        donorId,
        location,
        eta,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Emergency created
    socket.on('emergency:created', (data) => {
      // Broadcast to all hospitals (for awareness)
      io.emit('emergency:new', data);
    });
    
    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
  
  return io;
}

/**
 * Emit events from services
 */

// Emit to specific donor
export function emitToDonor(io, donorId, event, data) {
  io.to(`donor:${donorId}`).emit(event, data);
}

// Emit to specific hospital
export function emitToHospital(io, hospitalId, event, data) {
  io.to(`hospital:${hospitalId}`).emit(event, data);
}

// Emit to emergency room
export function emitToEmergency(io, emergencyId, event, data) {
  io.to(`emergency:${emergencyId}`).emit(event, data);
}

// Emit to all connected clients
export function emitToAll(io, event, data) {
  io.emit(event, data);
}
```

### 10.2 Update server.js

```javascript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Setup socket handlers
import { setupSocket } from './src/sockets/socketManager.js';
setupSocket(io);

// ... rest of your routes ...

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`BloodLink server running on port ${PORT}`);
});
```

## Socket Events

### Donor Events (Client Receives)

| Event | Description | Data |
|-------|-------------|------|
| `EMERGENCY_ALERT` | New emergency alert | `{ assignment, emergency }` |
| `ALERT_CANCELLED` | Emergency was cancelled | `{ emergencyId }` |
| `ASSIGNMENT_UPDATED` | Assignment status changed | `{ assignment }` |
| `EMERGENCY_FULFILLED` | Emergency needs met | `{ emergency }` |

### Hospital Events (Client Receives)

| Event | Description | Data |
|-------|-------------|------|
| `DONOR_ACCEPTED` | Donor accepted alert | `{ assignment, donor }` |
| `DONOR_DECLINED` | Donor declined | `{ assignment }` |
| `DONOR_LOCATION` | Donor location update | `{ donorId, location, eta }` |
| `EMERGENCY_UPDATED` | Emergency status changed | `{ emergency }` |
| `ASSIGNMENT_COMPLETED` | Donation completed | `{ assignment }` |

### Client Emit Events

| Event | From | Description |
|-------|-------|-------------|
| `hospital:join` | Client | Join hospital room |
| `donor:join` | Client | Join donor room |
| `emergency:join` | Client | Join emergency room |
| `donor:location` | Client | Send location update |

## Frontend Socket Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// As donor
socket.emit('donor:join', donorId);

socket.on('EMERGENCY_ALERT', (data) => {
  console.log('New emergency alert:', data);
});

// As hospital
socket.emit('hospital:join', hospitalId);

socket.on('DONOR_ACCEPTED', (data) => {
  console.log('Donor accepted:', data);
});

// Send location update
socket.emit('donor:location', {
  donorId,
  hospitalId,
  emergencyId,
  location: { lat, lng },
  eta: 8
});
```

## Status
- [ ] Socket manager created
- [ ] Event handlers set up
- [ ] Helper functions created
- [ ] Server updated
