# TASK 11: Tracking Service

## Objective
Create real-time location tracking for donors heading to hospitals.

## Files to Create

### 11.1 Tracking Service (`src/services/tracking.service.js`)

```javascript
import { db, admin } from '../config/firebase.js';

/**
 * Update donor location
 */
export async function updateLocation(emergencyId, donorId, location, heading, speed, eta) {
  const trackingRef = db
    .collection('tracking')
    .doc(emergencyId)
    .collection('donors')
    .doc(donorId);
  
  await trackingRef.set({
    location,
    heading: heading || 0,
    speed: speed || 0,
    eta: eta || 0,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  
  return trackingRef.get();
}

/**
 * Get all tracked locations for an emergency
 */
export async function getTrackedLocations(emergencyId) {
  const snapshot = await db
    .collection('tracking')
    .doc(emergencyId)
    .collection('donors')
    .get();
  
  const locations = [];
  snapshot.forEach(doc => {
    locations.push({
      donorId: doc.id,
      ...doc.data(),
    });
  });
  
  return locations;
}

/**
 * Get specific donor's tracking data
 */
export async function getDonorTracking(emergencyId, donorId) {
  const doc = await db
    .collection('tracking')
    .doc(emergencyId)
    .collection('donors')
    .doc(donorId)
    .get();
  
  if (!doc.exists) {
    return null;
  }
  
  return { donorId: doc.id, ...doc.data() };
}

/**
 * Clear tracking for an emergency
 */
export async function clearTracking(emergencyId) {
  const snapshot = await db
    .collection('tracking')
    .doc(emergencyId)
    .collection('donors')
    .get();
  
  const batch = db.batch();
  
  snapshot.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  
  // Delete the parent document
  await db.collection('tracking').doc(emergencyId).delete();
  
  return { deleted: snapshot.size };
}

/**
 * Clear specific donor's tracking
 */
export async function clearDonorTracking(emergencyId, donorId) {
  await db
    .collection('tracking')
    .doc(emergencyId)
    .collection('donors')
    .doc(donorId)
    .delete();
  
  return { deleted: true };
}
```

### 11.2 Tracking Controller (`src/controllers/tracking.controller.js`)

```javascript
import { 
  updateLocation,
  getTrackedLocations,
  getDonorTracking,
  clearTracking,
  clearDonorTracking
} from '../services/tracking.service.js';

/**
 * POST /donor/track
 * Update donor location
 */
export async function updateDonorLocation(req, res) {
  try {
    const { emergencyId, location, heading, speed, eta } = req.body;
    
    if (!emergencyId || !location) {
      return res.status(400).json({ error: 'Emergency ID and location required' });
    }
    
    await updateLocation(emergencyId, req.user.uid, location, heading, speed, eta);
    
    res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /hospital/emergency/:id/tracking
 * Get all tracked locations for emergency
 */
export async function getLocations(req, res) {
  try {
    const { id } = req.params;
    
    const locations = await getTrackedLocations(id);
    
    res.json({ locations, count: locations.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /hospital/emergency/:id/tracking/:donorId
 * Get specific donor's location
 */
export async function getLocation(req, res) {
  try {
    const { id, donorId } = req.params;
    
    const location = await getDonorTracking(id, donorId);
    
    if (!location) {
      return res.status(404).json({ error: 'Tracking data not found' });
    }
    
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * DELETE /hospital/emergency/:id/tracking
 * Clear all tracking for emergency
 */
export async function clearAllTracking(req, res) {
  try {
    const { id } = req.params;
    
    const result = await clearTracking(id);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 11.3 Add Routes to server.js

```javascript
import { 
  updateDonorLocation,
  getLocations,
  getLocation,
  clearAllTracking
} from './src/controllers/tracking.controller.js';
import { requireDonor, requireHospital, requireAuth } from './src/middleware/auth.middleware.js';

// Tracking routes
app.post('/api/donor/track', requireAuth, updateDonorLocation);
app.get('/api/hospital/emergency/:id/tracking', requireAuth, getLocations);
app.get('/api/hospital/emergency/:id/tracking/:donorId', requireAuth, getLocation);
app.delete('/api/hospital/emergency/:id/tracking', requireAuth, clearAllTracking);
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/donor/track | Donor | Update location |
| GET | /api/hospital/emergency/:id/tracking | Hospital | Get all locations |
| GET | /api/hospital/emergency/:id/tracking/:donorId | Hospital | Get specific location |
| DELETE | /api/hospital/emergency/:id/tracking | Hospital | Clear tracking |

## Frontend Implementation

```javascript
// In donor app - send location every 5 seconds
let locationWatch;

function startTracking(emergencyId) {
  locationWatch = navigator.geolocation.watchPosition(
    (position) => {
      socket.emit('donor:location', {
        donorId: currentUser.uid,
        hospitalId: currentAssignment.hospitalId,
        emergencyId,
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        eta: calculateETA(position.coords.latitude, position.coords.longitude)
      });
    },
    (error) => console.error('Location error:', error),
    { enableHighAccuracy: true }
  );
}

function stopTracking() {
  if (locationWatch) {
    navigator.geolocation.clearWatch(locationWatch);
  }
}
```

## Status
- [ ] Tracking service created
- [ ] Tracking controller created
- [ ] Routes added
- [ ] Frontend integration guide provided
