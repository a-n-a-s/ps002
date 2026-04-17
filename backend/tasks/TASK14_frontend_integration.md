# TASK 14: Frontend Integration

## Objective
Connect the frontend to the new backend APIs.

## Steps

### 14.1 Create API Service

Create `src/services/api.ts`:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
```

### 14.2 Create Auth Hook

Create `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { setAuthToken } from '../services/api';
import { getIdToken, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await getIdToken(firebaseUser);
        setAuthToken(token);
        setUser(firebaseUser);
      } else {
        setAuthToken(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await getIdToken(result.user);
    setAuthToken(token);
    setUser(result.user);
    return result.user;
  };

  const register = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const token = await getIdToken(result.user);
    setAuthToken(token);
    setUser(result.user);
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
    setAuthToken(null);
    setUser(null);
  };

  return { user, loading, login, register, logout };
}
```

### 14.3 Create API Service Files

Create service files for each domain:

**`src/services/donorApi.ts`**
```typescript
import api from './api';

export const donorApi = {
  getProfile: () => api.get('/donor/me'),
  createProfile: (data: any) => api.post('/donor/profile', data),
  updateProfile: (data: any) => api.patch('/donor/profile', data),
  setAvailability: (available: boolean) => 
    api.patch('/donor/availability', { availability: available }),
  updateLocation: (location: { lat: number; lng: number }) =>
    api.post('/donor/location', location),
  getAssignments: () => api.get('/donor/assignments'),
  respondToAssignment: (id: string, response: 'ACCEPTED' | 'DECLINED') =>
    api.post(`/donor/assignment/${id}/respond`, { response }),
  markEnRoute: (id: string) => api.post(`/donor/assignment/${id}/en-route`),
  markArrived: (id: string) => api.post(`/donor/assignment/${id}/arrived`),
  complete: (id: string) => api.post(`/donor/assignment/${id}/complete`),
  updateLocation: (emergencyId: string, location: any) =>
    api.post('/donor/track', { emergencyId, location }),
};
```

**`src/services/hospitalApi.ts`**
```typescript
import api from './api';

export const hospitalApi = {
  getProfile: () => api.get('/hospital/me'),
  createProfile: (data: any) => api.post('/hospital/profile', data),
  updateProfile: (data: any) => api.patch('/hospital/profile', data),
  getStats: () => api.get('/hospital/stats'),
  createEmergency: (data: any) => api.post('/hospital/emergency', data),
  getEmergencies: (status?: string) => 
    api.get('/hospital/emergencies', { params: { status } }),
  getEmergency: (id: string) => api.get(`/hospital/emergency/${id}`),
  cancelEmergency: (id: string) => api.post(`/hospital/emergency/${id}/cancel`),
  getMatches: (id: string) => api.get(`/hospital/emergency/${id}/matches`),
  triggerMatch: (id: string) => api.post(`/hospital/emergency/${id}/match`),
  escalateMatch: (id: string) => api.post(`/hospital/emergency/${id}/escalate`),
  getAssignments: (emergencyId: string) => 
    api.get(`/hospital/emergency/${emergencyId}/assignments`),
  getTracking: (emergencyId: string) => 
    api.get(`/hospital/emergency/${emergencyId}/tracking`),
  getInventory: () => api.get('/hospital/inventory'),
  addInventory: (bloodType: string, units: number) =>
    api.post('/hospital/inventory/add', { bloodType, units }),
  useInventory: (bloodType: string, units: number) =>
    api.post('/hospital/inventory/use', { bloodType, units }),
};
```

### 14.4 Create Socket Hook

Create `src/hooks/useSocket.ts`:

```typescript
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      setConnected(true);
      console.log('[Socket] Connected');
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
      console.log('[Socket] Disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  const joinHospital = (hospitalId: string) => {
    socketRef.current?.emit('hospital:join', hospitalId);
  };

  const joinDonor = (donorId: string) => {
    socketRef.current?.emit('donor:join', donorId);
  };

  const joinEmergency = (emergencyId: string) => {
    socketRef.current?.emit('emergency:join', emergencyId);
  };

  const sendLocation = (data: any) => {
    socketRef.current?.emit('donor:location', data);
  };

  return {
    socket: socketRef.current,
    connected,
    joinHospital,
    joinDonor,
    joinEmergency,
    sendLocation,
  };
}
```

### 14.5 Update Environment Files

Frontend `.env`:
```
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
```

### 14.6 Integration Checklist

- [ ] Install axios: `npm install axios socket.io-client`
- [ ] Create API service
- [ ] Create auth hook
- [ ] Create socket hook
- [ ] Update donor pages to use API
- [ ] Update hospital pages to use API
- [ ] Update socket events
- [ ] Test full flow

## Status
- [ ] API service created
- [ ] Auth hook created
- [ ] Socket hook created
- [ ] API service files created
- [ ] Environment configured
