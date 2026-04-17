# TASK 5: Donor Service

## Objective
Create donor-specific CRUD operations, availability management, and location updates.

## Files to Create

### 5.1 Donor Service (`src/services/donor.service.js`)

```javascript
import { db, admin } from '../config/firebase.js';

/**
 * Create donor profile
 */
export async function createDonor(uid, data) {
  const donorData = {
    userId: uid,
    bloodType: data.bloodType,
    location: data.location || null,
    address: data.address || '',
    availability: true,
    reliabilityScore: 75,  // default
    totalDonations: 0,
    lastDonationDate: null,
    activeAssignmentId: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await db.collection('donors').doc(uid).set(donorData);
  return { id: uid, ...donorData };
}

/**
 * Get donor by UID
 */
export async function getDonorByUid(uid) {
  const doc = await db.collection('donors').doc(uid).get();
  
  if (!doc.exists) {
    throw new Error('Donor not found');
  }
  
  return { id: doc.id, ...doc.data() };
}

/**
 * Update donor profile
 */
export async function updateDonor(uid, data) {
  const updates = {
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  delete updates.userId;  // Can't change userId
  delete updates.createdAt;
  
  await db.collection('donors').doc(uid).update(updates);
  return getDonorByUid(uid);
}

/**
 * Update donor availability
 */
export async function updateAvailability(uid, availability) {
  await db.collection('donors').doc(uid).update({
    availability,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { uid, availability };
}

/**
 * Update donor location
 */
export async function updateLocation(uid, location) {
  // Add geohash for efficient queries (simple version)
  const geohash = `${location.lat.toFixed(2)},${location.lng.toFixed(2)}`;
  
  await db.collection('donors').doc(uid).update({
    location: {
      ...location,
      geohash,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    },
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { uid, location };
}

/**
 * Find eligible donors by blood type and availability
 */
export async function findEligibleDonors(bloodType, limit = 10) {
  const snapshot = await db.collection('donors')
    .where('bloodType', '==', bloodType)
    .where('availability', '==', true)
    .where('activeAssignmentId', '==', null)
    .limit(limit)
    .get();
  
  const donors = [];
  snapshot.forEach(doc => {
    donors.push({ id: doc.id, ...doc.data() });
  });
  
  return donors;
}

/**
 * Increment donation count
 */
export async function incrementDonations(uid) {
  await db.collection('donors').doc(uid).update({
    totalDonations: admin.firestore.FieldValue.increment(1),
    lastDonationDate: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Update reliability score
 */
export async function updateReliabilityScore(uid, score) {
  await db.collection('donors').doc(uid).update({
    reliabilityScore: score,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Set active assignment
 */
export async function setActiveAssignment(uid, assignmentId) {
  await db.collection('donors').doc(uid).update({
    activeAssignmentId: assignmentId,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Clear active assignment
 */
export async function clearActiveAssignment(uid) {
  await db.collection('donors').doc(uid).update({
    activeAssignmentId: null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
```

### 5.2 Donor Controller (`src/controllers/donor.controller.js`)

```javascript
import { 
  getDonorByUid, 
  updateDonor, 
  updateAvailability, 
  updateLocation,
  findEligibleDonors,
  createDonor
} from '../services/donor.service.js';

/**
 * GET /donor/me
 * Get current donor profile
 */
export async function getMe(req, res) {
  try {
    const donor = await getDonorByUid(req.user.uid);
    res.json(donor);
  } catch (error) {
    if (error.message === 'Donor not found') {
      return res.status(404).json({ error: 'Donor profile not found' });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /donor/profile
 * Create donor profile
 */
export async function createProfile(req, res) {
  try {
    const { bloodType, location, address } = req.body;
    
    if (!bloodType) {
      return res.status(400).json({ error: 'Blood type is required' });
    }
    
    const validBloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    if (!validBloodTypes.includes(bloodType)) {
      return res.status(400).json({ error: 'Invalid blood type' });
    }
    
    const donor = await createDonor(req.user.uid, { bloodType, location, address });
    res.status(201).json(donor);
  } catch (error) {
    if (error.code === 6) {  // Already exists
      return res.status(400).json({ error: 'Profile already exists' });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * PATCH /donor/profile
 * Update donor profile
 */
export async function updateProfile(req, res) {
  try {
    const { bloodType, location, address } = req.body;
    const donor = await updateDonor(req.user.uid, { bloodType, location, address });
    res.json(donor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * PATCH /donor/availability
 * Toggle donor availability
 */
export async function setAvailability(req, res) {
  try {
    const { availability } = req.body;
    
    if (typeof availability !== 'boolean') {
      return res.status(400).json({ error: 'Availability must be boolean' });
    }
    
    const result = await updateAvailability(req.user.uid, availability);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /donor/location
 * Update donor location
 */
export async function updateDonorLocation(req, res) {
  try {
    const { lat, lng } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Lat and lng required' });
    }
    
    const result = await updateLocation(req.user.uid, { lat, lng });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /donor/eligible/:bloodType
 * Find eligible donors (for testing/admin)
 */
export async function getEligibleDonors(req, res) {
  try {
    const { bloodType } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const donors = await findEligibleDonors(bloodType, limit);
    res.json({ donors, count: donors.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 5.3 Add Routes to server.js

```javascript
import { 
  getMe, 
  createProfile, 
  updateProfile, 
  setAvailability, 
  updateDonorLocation,
  getEligibleDonors
} from './src/controllers/donor.controller.js';
import { requireDonor, requireAuth } from './src/middleware/auth.middleware.js';

// Donor routes
app.get('/donor/me', requireAuth, getMe);
app.post('/donor/profile', requireAuth, createProfile);
app.patch('/donor/profile', requireAuth, updateProfile);
app.patch('/donor/availability', requireAuth, setAvailability);
app.post('/donor/location', requireAuth, updateDonorLocation);
app.get('/donor/eligible/:bloodType', requireAuth, getEligibleDonors);
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/donor/me | Yes | Get donor profile |
| POST | /api/donor/profile | Yes | Create profile |
| PATCH | /api/donor/profile | Yes | Update profile |
| PATCH | /api/donor/availability | Yes | Toggle availability |
| POST | /api/donor/location | Yes | Update location |

## Status
- [ ] Donor service created
- [ ] Donor controller created
- [ ] Routes added
- [ ] Tested profile creation
- [ ] Tested availability toggle
