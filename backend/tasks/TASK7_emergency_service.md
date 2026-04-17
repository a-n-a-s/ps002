# TASK 7: Emergency Service

## Objective
Create emergency management - create, read, update, cancel emergencies.

## Files to Create

### 7.1 Emergency Service (`src/services/emergency.service.js`)

```javascript
import { db, admin } from '../config/firebase.js';

/**
 * Generate emergency ID
 */
function generateEmergencyId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `EMG-${timestamp.slice(-4)}${random}`;
}

/**
 * Create new emergency
 */
export async function createEmergency(hospitalId, data) {
  const id = generateEmergencyId();
  
  const emergencyData = {
    id,
    hospitalId,
    hospitalName: data.hospitalName || '',
    bloodType: data.bloodType,
    unitsRequired: data.unitsRequired || 1,
    unitsFulfilled: 0,
    urgencyLevel: data.urgencyLevel || 'STANDARD',  // CRITICAL, URGENT, STANDARD
    status: 'OPEN',
    radiusKm: data.radiusKm || 5,
    location: data.location,
    patientInfo: data.patientInfo || {},
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.FieldValue.serverTimestamp(
      Date.now() + (data.expiresInMinutes || 60) * 60 * 1000
    ),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await db.collection('emergencies').doc(id).set(emergencyData);
  
  // Emit socket event for real-time updates
  // Will be handled in socket setup
  
  return { id, ...emergencyData };
}

/**
 * Get emergency by ID
 */
export async function getEmergencyById(id) {
  const doc = await db.collection('emergencies').doc(id).get();
  
  if (!doc.exists) {
    throw new Error('Emergency not found');
  }
  
  return { id: doc.id, ...doc.data() };
}

/**
 * Get emergencies by hospital
 */
export async function getEmergenciesByHospital(hospitalId, status = null) {
  let query = db.collection('emergencies')
    .where('hospitalId', '==', hospitalId)
    .orderBy('createdAt', 'desc');
  
  const snapshot = await query.get();
  const emergencies = [];
  
  snapshot.forEach(doc => {
    const data = { id: doc.id, ...doc.data() };
    if (status === null || data.status === status) {
      emergencies.push(data);
    }
  });
  
  return emergencies;
}

/**
 * Get active emergencies (all hospitals)
 */
export async function getActiveEmergencies(bloodType = null) {
  let query = db.collection('emergencies')
    .where('status', 'in', ['OPEN', 'MATCHING', 'IN_PROGRESS'])
    .orderBy('createdAt', 'desc');
  
  const snapshot = await query.get();
  const emergencies = [];
  
  snapshot.forEach(doc => {
    const data = { id: doc.id, ...doc.data() };
    if (bloodType === null || data.bloodType === bloodType) {
      emergencies.push(data);
    }
  });
  
  return emergencies;
}

/**
 * Update emergency status
 */
export async function updateEmergencyStatus(id, status) {
  const validStatuses = ['OPEN', 'MATCHING', 'IN_PROGRESS', 'FULFILLED', 'CANCELLED', 'EXPIRED'];
  
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }
  
  await db.collection('emergencies').doc(id).update({
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return getEmergencyById(id);
}

/**
 * Increment fulfilled units
 */
export async function incrementFulfilledUnits(id, units = 1) {
  await db.collection('emergencies').doc(id).update({
    unitsFulfilled: admin.firestore.FieldValue.increment(units),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  const emergency = await getEmergencyById(id);
  
  // Check if fulfilled
  if (emergency.unitsFulfilled >= emergency.unitsRequired) {
    await updateEmergencyStatus(id, 'FULFILLED');
  } else if (emergency.status === 'IN_PROGRESS' && emergency.unitsFulfilled === 0) {
    // All donors declined, go back to matching
    await updateEmergencyStatus(id, 'MATCHING');
  }
  
  return getEmergencyById(id);
}

/**
 * Cancel emergency
 */
export async function cancelEmergency(id, hospitalId) {
  const emergency = await getEmergencyById(id);
  
  // Verify ownership
  if (emergency.hospitalId !== hospitalId) {
    throw new Error('Not authorized to cancel this emergency');
  }
  
  await db.collection('emergencies').doc(id).update({
    status: 'CANCELLED',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return getEmergencyById(id);
}

/**
 * Check and expire old emergencies
 */
export async function checkExpiredEmergencies() {
  const now = admin.firestore.Timestamp.now();
  
  const snapshot = await db.collection('emergencies')
    .where('status', 'in', ['OPEN', 'MATCHING', 'IN_PROGRESS'])
    .where('expiresAt', '<', now)
    .get();
  
  const expired = [];
  
  snapshot.forEach(async (doc) => {
    await doc.ref.update({
      status: 'EXPIRED',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    expired.push(doc.id);
  });
  
  return expired;
}

/**
 * Update emergency radius (for escalation)
 */
export async function expandRadius(id, newRadiusKm) {
  await db.collection('emergencies').doc(id).update({
    radiusKm: newRadiusKm,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return getEmergencyById(id);
}
```

### 7.2 Emergency Controller (`src/controllers/emergency.controller.js`)

```javascript
import { 
  createEmergency,
  getEmergencyById,
  getEmergenciesByHospital,
  getActiveEmergencies,
  updateEmergencyStatus,
  cancelEmergency,
  expandRadius
} from '../services/emergency.service.js';
import { getHospitalByUid } from '../services/hospital.service.js';

/**
 * POST /hospital/emergency
 * Create new emergency
 */
export async function create(req, res) {
  try {
    const { bloodType, unitsRequired, urgencyLevel, location, patientInfo, radiusKm } = req.body;
    
    if (!bloodType || !location) {
      return res.status(400).json({ 
        error: 'Blood type and location are required' 
      });
    }
    
    const hospital = await getHospitalByUid(req.user.uid);
    
    const emergency = await createEmergency(req.user.uid, {
      bloodType,
      unitsRequired,
      urgencyLevel,
      location,
      patientInfo,
      hospitalName: hospital.name,
      radiusKm,
    });
    
    res.status(201).json(emergency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /hospital/emergencies
 * Get hospital's emergencies
 */
export async function list(req, res) {
  try {
    const { status } = req.query;
    const emergencies = await getEmergenciesByHospital(
      req.user.uid, 
      status || null
    );
    res.json({ emergencies, count: emergencies.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /hospital/emergency/:id
 * Get specific emergency
 */
export async function getOne(req, res) {
  try {
    const { id } = req.params;
    const emergency = await getEmergencyById(id);
    res.json(emergency);
  } catch (error) {
    if (error.message === 'Emergency not found') {
      return res.status(404).json({ error: 'Emergency not found' });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /hospital/emergency/:id/cancel
 * Cancel emergency
 */
export async function cancel(req, res) {
  try {
    const { id } = req.params;
    const emergency = await cancelEmergency(id, req.user.uid);
    res.json({ message: 'Emergency cancelled', emergency });
  } catch (error) {
    if (error.message === 'Not authorized') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /emergencies/active
 * Get all active emergencies (public for dashboard)
 */
export async function getActive(req, res) {
  try {
    const { bloodType } = req.query;
    const emergencies = await getActiveEmergencies(bloodType || null);
    res.json({ emergencies, count: emergencies.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * PATCH /hospital/emergency/:id/escalate
 * Expand search radius
 */
export async function escalate(req, res) {
  try {
    const { id } = req.params;
    const { radiusKm } = req.body;
    
    const emergency = await expandRadius(id, radiusKm);
    res.json(emergency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 7.3 Add Routes to server.js

```javascript
import { 
  create,
  list,
  getOne,
  cancel,
  getActive,
  escalate
} from './src/controllers/emergency.controller.js';
import { requireHospital, requireAuth } from './src/middleware/auth.middleware.js';

// Emergency routes (hospital only)
app.post('/api/hospital/emergency', requireAuth, create);
app.get('/api/hospital/emergencies', requireAuth, list);
app.get('/api/hospital/emergency/:id', requireAuth, getOne);
app.post('/api/hospital/emergency/:id/cancel', requireAuth, cancel);
app.patch('/api/hospital/emergency/:id/escalate', requireAuth, escalate);

// Public/Shared routes
app.get('/api/emergencies/active', getActive);
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/hospital/emergency | Hospital | Create emergency |
| GET | /api/hospital/emergencies | Hospital | List hospital's emergencies |
| GET | /api/hospital/emergency/:id | Hospital | Get specific emergency |
| POST | /api/hospital/emergency/:id/cancel | Hospital | Cancel emergency |
| PATCH | /api/hospital/emergency/:id/escalate | Hospital | Expand radius |
| GET | /api/emergencies/active | No | List active emergencies |

## Status
- [ ] Emergency service created
- [ ] Emergency controller created
- [ ] Routes added
- [ ] Tested emergency creation
