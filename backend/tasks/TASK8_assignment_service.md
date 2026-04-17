# TASK 8: Assignment Service

## Objective
Create assignment service - connects donors to emergencies with status tracking.

## Files to Create

### 8.1 Assignment Service (`src/services/assignment.service.js`)

```javascript
import { db, admin } from '../config/firebase.js';

/**
 * Generate assignment ID
 */
function generateAssignmentId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ASN-${timestamp.slice(-4)}${random}`;
}

/**
 * Create assignment (called by matching engine)
 */
export async function createAssignment(emergencyId, donorId, hospitalId, priorityScore, distanceKm, eta) {
  const id = generateAssignmentId();
  
  const assignmentData = {
    id,
    emergencyId,
    donorId,
    hospitalId,
    status: 'NOTIFIED',
    priorityScore,
    distanceKm,
    eta,
    notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    respondedAt: null,
    arrivedAt: null,
    completedAt: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await db.collection('assignments').doc(id).set(assignmentData);
  
  // Update donor's active assignment
  await db.collection('donors').doc(donorId).update({
    activeAssignmentId: id,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { id, ...assignmentData };
}

/**
 * Get assignment by ID
 */
export async function getAssignmentById(id) {
  const doc = await db.collection('assignments').doc(id).get();
  
  if (!doc.exists) {
    throw new Error('Assignment not found');
  }
  
  return { id: doc.id, ...doc.data() };
}

/**
 * Get assignments for donor
 */
export async function getAssignmentsByDonor(donorId, status = null) {
  let query = db.collection('assignments')
    .where('donorId', '==', donorId)
    .orderBy('createdAt', 'desc');
  
  const snapshot = await query.get();
  const assignments = [];
  
  snapshot.forEach(doc => {
    const data = { id: doc.id, ...doc.data() };
    if (status === null || data.status === status) {
      assignments.push(data);
    }
  });
  
  return assignments;
}

/**
 * Get assignments for emergency
 */
export async function getAssignmentsByEmergency(emergencyId) {
  const snapshot = await db.collection('assignments')
    .where('emergencyId', '==', emergencyId)
    .orderBy('priorityScore', 'desc')
    .get();
  
  const assignments = [];
  snapshot.forEach(doc => {
    assignments.push({ id: doc.id, ...doc.data() });
  });
  
  return assignments;
}

/**
 * Get assignments for hospital
 */
export async function getAssignmentsByHospital(hospitalId, status = null) {
  let query = db.collection('assignments')
    .where('hospitalId', '==', hospitalId)
    .orderBy('createdAt', 'desc');
  
  const snapshot = await query.get();
  const assignments = [];
  
  snapshot.forEach(doc => {
    const data = { id: doc.id, ...doc.data() };
    if (status === null || data.status === status) {
      assignments.push(data);
    }
  });
  
  return assignments;
}

/**
 * Donor responds to assignment
 */
export async function respondToAssignment(id, donorId, response) {
  // response: 'ACCEPTED' | 'DECLINED'
  
  const assignment = await getAssignmentById(id);
  
  // Verify ownership
  if (assignment.donorId !== donorId) {
    throw new Error('Not authorized');
  }
  
  // Verify status
  if (assignment.status !== 'NOTIFIED') {
    throw new Error('Assignment already responded to');
  }
  
  const updates = {
    status: response,
    respondedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await db.collection('assignments').doc(id).update(updates);
  
  if (response === 'DECLINED') {
    // Clear donor's active assignment
    await db.collection('donors').doc(donorId).update({
      activeAssignmentId: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Trigger next donor (will be handled by matching engine)
  } else if (response === 'ACCEPTED') {
    // Update emergency status
    const emergency = await db.collection('emergencies').doc(assignment.emergencyId).get();
    if (emergency.exists) {
      await emergency.ref.update({
        status: 'IN_PROGRESS',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
  
  return getAssignmentById(id);
}

/**
 * Update assignment status to EN_ROUTE
 */
export async function startRoute(id) {
  await db.collection('assignments').doc(id).update({
    status: 'EN_ROUTE',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return getAssignmentById(id);
}

/**
 * Update assignment status to ARRIVED
 */
export async function markArrived(id) {
  await db.collection('assignments').doc(id).update({
    status: 'ARRIVED',
    arrivedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return getAssignmentById(id);
}

/**
 * Complete assignment
 */
export async function completeAssignment(id) {
  const assignment = await getAssignmentById(id);
  
  const updates = {
    status: 'COMPLETED',
    completedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await db.collection('assignments').doc(id).update(updates);
  
  // Clear donor's active assignment
  await db.collection('donors').doc(assignment.donorId).update({
    activeAssignmentId: null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Increment fulfilled units on emergency
  await db.collection('emergencies').doc(assignment.emergencyId).update({
    unitsFulfilled: admin.firestore.FieldValue.increment(1),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Check if emergency is fulfilled
  const emergency = await db.collection('emergencies').doc(assignment.emergencyId).get();
  if (emergency.exists) {
    const data = emergency.data();
    if (data.unitsFulfilled >= data.unitsRequired) {
      await emergency.ref.update({
        status: 'FULFILLED',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
  
  return getAssignmentById(id);
}

/**
 * Expire assignment (donor not responding)
 */
export async function expireAssignment(id) {
  const assignment = await getAssignmentById(id);
  
  const updates = {
    status: 'EXPIRED',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await db.collection('assignments').doc(id).update(updates);
  
  // Clear donor's active assignment
  await db.collection('donors').doc(assignment.donorId).update({
    activeAssignmentId: null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return getAssignmentById(id);
}
```

### 8.2 Assignment Controller (`src/controllers/assignment.controller.js`)

```javascript
import { 
  getAssignmentById,
  getAssignmentsByDonor,
  getAssignmentsByEmergency,
  getAssignmentsByHospital,
  respondToAssignment,
  startRoute,
  markArrived,
  completeAssignment
} from '../services/assignment.service.js';

/**
 * GET /donor/assignments
 * Get donor's assignments
 */
export async function getDonorAssignments(req, res) {
  try {
    const { status } = req.query;
    const assignments = await getAssignmentsByDonor(
      req.user.uid,
      status || null
    );
    res.json({ assignments, count: assignments.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /donor/assignment/:id
 * Get specific assignment
 */
export async function getDonorAssignment(req, res) {
  try {
    const { id } = req.params;
    const assignment = await getAssignmentById(id);
    
    // Verify ownership
    if (assignment.donorId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /donor/assignment/:id/respond
 * Respond to assignment (accept/decline)
 */
export async function respond(req, res) {
  try {
    const { id } = req.params;
    const { response } = req.body;  // 'ACCEPTED' or 'DECLINED'
    
    if (!['ACCEPTED', 'DECLINED'].includes(response)) {
      return res.status(400).json({ error: 'Invalid response' });
    }
    
    const assignment = await respondToAssignment(id, req.user.uid, response);
    res.json(assignment);
  } catch (error) {
    if (error.message === 'Not authorized') {
      return res.status(403).json({ error: error.message });
    }
    if (error.message === 'Assignment already responded to') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /donor/assignment/:id/en-route
 * Start heading to hospital
 */
export async function enRoute(req, res) {
  try {
    const { id } = req.params;
    const assignment = await startRoute(id);
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /donor/assignment/:id/arrived
 * Mark as arrived
 */
export async function arrived(req, res) {
  try {
    const { id } = req.params;
    const assignment = await markArrived(id);
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /donor/assignment/:id/complete
 * Complete donation
 */
export async function complete(req, res) {
  try {
    const { id } = req.params;
    const assignment = await completeAssignment(id);
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /hospital/emergency/:id/assignments
 * Get assignments for emergency
 */
export async function getEmergencyAssignments(req, res) {
  try {
    const { id } = req.params;
    const assignments = await getAssignmentsByEmergency(id);
    res.json({ assignments, count: assignments.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 8.3 Add Routes to server.js

```javascript
import { 
  getDonorAssignments,
  getDonorAssignment,
  respond,
  enRoute,
  arrived,
  complete
} from './src/controllers/assignment.controller.js';
import { requireDonor, requireHospital, requireAuth } from './src/middleware/auth.middleware.js';

// Donor assignment routes
app.get('/api/donor/assignments', requireAuth, getDonorAssignments);
app.get('/api/donor/assignment/:id', requireAuth, getDonorAssignment);
app.post('/api/donor/assignment/:id/respond', requireAuth, respond);
app.post('/api/donor/assignment/:id/en-route', requireAuth, enRoute);
app.post('/api/donor/assignment/:id/arrived', requireAuth, arrived);
app.post('/api/donor/assignment/:id/complete', requireAuth, complete);

// Hospital routes
app.get('/api/hospital/emergency/:id/assignments', requireAuth, getEmergencyAssignments);
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/donor/assignments | Donor | List donor's assignments |
| GET | /api/donor/assignment/:id | Donor | Get assignment details |
| POST | /api/donor/assignment/:id/respond | Donor | Accept/decline |
| POST | /api/donor/assignment/:id/en-route | Donor | Start heading |
| POST | /api/donor/assignment/:id/arrived | Donor | Mark arrived |
| POST | /api/donor/assignment/:id/complete | Donor | Complete donation |
| GET | /api/hospital/emergency/:id/assignments | Hospital | List assignments |

## Status
- [ ] Assignment service created
- [ ] Assignment controller created
- [ ] Routes added
- [ ] Tested assignment creation (from matching)
- [ ] Tested response flow
