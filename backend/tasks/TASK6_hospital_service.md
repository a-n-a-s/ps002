# TASK 6: Hospital Service

## Objective
Create hospital-specific CRUD operations and verification workflow.

## Files to Create

### 6.1 Hospital Service (`src/services/hospital.service.js`)

```javascript
import { db, admin } from '../config/firebase.js';

/**
 * Create hospital profile
 */
export async function createHospital(uid, data) {
  const hospitalData = {
    userId: uid,
    name: data.name,
    address: data.address || '',
    location: data.location || null,
    licenseNumber: data.licenseNumber,
    phone: data.phone,
    verified: false,  // requires admin approval
    trustScore: 50,  // default
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await db.collection('hospitals').doc(uid).set(hospitalData);
  return { id: uid, ...hospitalData };
}

/**
 * Get hospital by UID
 */
export async function getHospitalByUid(uid) {
  const doc = await db.collection('hospitals').doc(uid).get();
  
  if (!doc.exists) {
    throw new Error('Hospital not found');
  }
  
  return { id: doc.id, ...doc.data() };
}

/**
 * Update hospital profile
 */
export async function updateHospital(uid, data) {
  const updates = {
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  delete updates.userId;
  delete updates.createdAt;
  delete updates.verified;  // can't update via this method
  
  await db.collection('hospitals').doc(uid).update(updates);
  return getHospitalByUid(uid);
}

/**
 * Verify hospital (admin only)
 */
export async function verifyHospital(uid, verified = true) {
  await db.collection('hospitals').doc(uid).update({
    verified,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return getHospitalByUid(uid);
}

/**
 * Update trust score
 */
export async function updateTrustScore(uid, score) {
  await db.collection('hospitals').doc(uid).update({
    trustScore: Math.min(100, Math.max(0, score)),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return getHospitalByUid(uid);
}

/**
 * Get all hospitals (admin only)
 */
export async function getAllHospitals(verified = null) {
  let query = db.collection('hospitals');
  
  if (verified !== null) {
    query = query.where('verified', '==', verified);
  }
  
  const snapshot = await query.get();
  const hospitals = [];
  
  snapshot.forEach(doc => {
    hospitals.push({ id: doc.id, ...doc.data() });
  });
  
  return hospitals;
}

/**
 * Get hospital stats
 */
export async function getHospitalStats(uid) {
  const hospital = await getHospitalByUid(uid);
  
  // Count emergencies
  const emergenciesSnapshot = await db.collection('emergencies')
    .where('hospitalId', '==', uid)
    .get();
  
  const totalEmergencies = emergenciesSnapshot.size;
  
  // Count fulfilled emergencies
  let fulfilledCount = 0;
  emergenciesSnapshot.forEach(doc => {
    if (doc.data().status === 'FULFILLED') {
      fulfilledCount++;
    }
  });
  
  return {
    ...hospital,
    stats: {
      totalEmergencies,
      fulfilledEmergencies: fulfilledCount,
      fulfillmentRate: totalEmergencies > 0 
        ? Math.round((fulfilledCount / totalEmergencies) * 100) 
        : 0,
    },
  };
}
```

### 6.2 Hospital Controller (`src/controllers/hospital.controller.js`)

```javascript
import { 
  getHospitalByUid, 
  createHospital, 
  updateHospital,
  verifyHospital,
  getAllHospitals,
  getHospitalStats
} from '../services/hospital.service.js';

/**
 * GET /hospital/me
 * Get current hospital profile
 */
export async function getMe(req, res) {
  try {
    const hospital = await getHospitalByUid(req.user.uid);
    res.json(hospital);
  } catch (error) {
    if (error.message === 'Hospital not found') {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /hospital/profile
 * Create hospital profile
 */
export async function createProfile(req, res) {
  try {
    const { name, address, location, licenseNumber, phone } = req.body;
    
    if (!name || !licenseNumber || !phone) {
      return res.status(400).json({ 
        error: 'Name, license number, and phone are required' 
      });
    }
    
    const hospital = await createHospital(req.user.uid, {
      name, address, location, licenseNumber, phone
    });
    
    res.status(201).json(hospital);
  } catch (error) {
    if (error.code === 6) {  // Already exists
      return res.status(400).json({ error: 'Profile already exists' });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * PATCH /hospital/profile
 * Update hospital profile
 */
export async function updateProfile(req, res) {
  try {
    const { name, address, location, phone } = req.body;
    const hospital = await updateHospital(req.user.uid, {
      name, address, location, phone
    });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /hospital/stats
 * Get hospital statistics
 */
export async function getStats(req, res) {
  try {
    const stats = await getHospitalStats(req.user.uid);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /hospital/all (admin only)
 * Get all hospitals
 */
export async function getAll(req, res) {
  try {
    const { verified } = req.query;
    const hospitals = await getAllHospitals(
      verified === 'true' ? true : verified === 'false' ? false : null
    );
    res.json({ hospitals, count: hospitals.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /hospital/verify/:uid (admin only)
 * Verify a hospital
 */
export async function verify(req, res) {
  try {
    const { uid } = req.params;
    const hospital = await verifyHospital(uid);
    res.json({ message: 'Hospital verified', hospital });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 6.3 Add Routes to server.js

```javascript
import { 
  getMe, 
  createProfile, 
  updateProfile, 
  getStats,
  getAll,
  verify
} from './src/controllers/hospital.controller.js';
import { requireHospital, requireAuth } from './src/middleware/auth.middleware.js';

// Hospital routes
app.get('/api/hospital/me', requireAuth, getMe);
app.post('/api/hospital/profile', requireAuth, createProfile);
app.patch('/api/hospital/profile', requireAuth, updateProfile);
app.get('/api/hospital/stats', requireAuth, getStats);

// Admin routes (would need admin middleware)
app.get('/api/hospital/all', requireAuth, getAll);
app.post('/api/hospital/verify/:uid', requireAuth, verify);
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/hospital/me | Yes | Get hospital profile |
| POST | /api/hospital/profile | Yes | Create profile |
| PATCH | /api/hospital/profile | Yes | Update profile |
| GET | /api/hospital/stats | Yes | Get statistics |
| GET | /api/hospital/all | Admin | List all hospitals |
| POST | /api/hospital/verify/:uid | Admin | Verify hospital |

## Status
- [ ] Hospital service created
- [ ] Hospital controller created
- [ ] Routes added
- [ ] Tested profile creation
