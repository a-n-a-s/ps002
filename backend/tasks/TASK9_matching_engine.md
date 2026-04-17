# TASK 9: Matching Engine

## Objective
Create the AI-powered donor matching engine with scoring algorithm.

## Files to Create

### 9.1 Matching Service (`src/services/matching.service.js`)

```javascript
import { db, admin } from '../config/firebase.js';
import { getEmergencyById } from './emergency.service.js';
import { createAssignment } from './assignment.service.js';
import { getDonorByUid } from './donor.service.js';

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Calculate ETA based on distance
 * Assumes average speed of 30 km/h in city
 */
function calculateETA(distanceKm) {
  return Math.ceil(distanceKm / 30 * 60); // minutes
}

/**
 * Score a donor for an emergency
 * 
 * Formula:
 * score = 
 *   (distance_factor * -0.4) +    // closer = higher score
 *   (reliability * 0.3) +          // more reliable = higher
 *   (availability * 0.2) +         // available bonus
 *   (recent_activity * 0.1)        // active recently = higher
 */
export async function scoreDonor(donorId, emergencyId) {
  const donor = await getDonorByUid(donorId);
  const emergency = await getEmergencyById(emergencyId);
  
  // Distance score (max 40 points)
  let distanceScore = 0;
  if (donor.location && emergency.location) {
    const distance = calculateDistance(
      donor.location.lat,
      donor.location.lng,
      emergency.location.lat,
      emergency.location.lng
    );
    
    // Closer donors get higher scores
    // Max distance of 50km = 0 points
    // 0km = 100 points
    distanceScore = Math.max(0, 100 - (distance * 2));
  }
  
  // Reliability score (max 30 points)
  const reliabilityScore = donor.reliabilityScore || 75;
  
  // Availability bonus (max 20 points)
  const availabilityScore = donor.availability ? 20 : 0;
  
  // Recent activity bonus (max 10 points)
  let activityScore = 10;
  if (donor.lastDonationDate) {
    const daysSinceDonation = Math.floor(
      (Date.now() - donor.lastDonationDate.toDate().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceDonation < 7) {
      activityScore = 2; // recently donated, lower priority
    } else if (daysSinceDonation < 30) {
      activityScore = 5;
    } else if (daysSinceDonation < 90) {
      activityScore = 8;
    } else {
      activityScore = 10; // haven't donated in a while, higher priority
    }
  }
  
  // Blood type rarity bonus
  const rarityBonus = ['O-', 'AB-'].includes(donor.bloodType) ? 5 : 0;
  
  // Urgency multiplier
  let urgencyMultiplier = 1;
  if (emergency.urgencyLevel === 'CRITICAL') {
    urgencyMultiplier = 1.2;
    distanceScore *= 1.1; // Distance matters more in critical cases
  } else if (emergency.urgencyLevel === 'URGENT') {
    urgencyMultiplier = 1.1;
  }
  
  const totalScore = Math.round(
    (distanceScore * 0.4 + reliabilityScore * 0.3 + availabilityScore * 0.2 + activityScore * 0.1 + rarityBonus) 
    * urgencyMultiplier
  );
  
  return {
    donorId,
    donor,
    distance: donor.location && emergency.location 
      ? calculateDistance(donor.location.lat, donor.location.lng, emergency.location.lat, emergency.location.lng)
      : null,
    scores: {
      distance: Math.round(distanceScore),
      reliability: Math.round(reliabilityScore * 0.3),
      availability: availabilityScore,
      activity: activityScore,
      rarity: rarityBonus,
    },
    totalScore: Math.min(100, totalScore),
    urgencyMultiplier,
  };
}

/**
 * Find and score eligible donors for an emergency
 */
export async function findMatchingDonors(emergencyId, limit = 5) {
  const emergency = await getEmergencyById(emergencyId);
  
  // Get eligible donors
  const snapshot = await db.collection('donors')
    .where('bloodType', '==', emergency.bloodType)
    .where('availability', '==', true)
    .get();
  
  const scoredDonors = [];
  
  for (const doc of snapshot.docs) {
    const donor = { id: doc.id, ...doc.data() };
    
    // Skip if already has active assignment
    if (donor.activeAssignmentId) {
      continue;
    }
    
    // Skip if not in radius
    if (donor.location && emergency.location && emergency.radiusKm) {
      const distance = calculateDistance(
        donor.location.lat,
        donor.location.lng,
        emergency.location.lat,
        emergency.location.lng
      );
      
      if (distance > emergency.radiusKm) {
        continue;
      }
    }
    
    // Score the donor
    const scoring = await scoreDonor(donor.id, emergencyId);
    scoredDonors.push(scoring);
  }
  
  // Sort by score descending
  scoredDonors.sort((a, b) => b.totalScore - a.totalScore);
  
  // Return top N
  return scoredDonors.slice(0, limit);
}

/**
 * Match and notify donors for an emergency
 * This is called when an emergency is created
 */
export async function matchDonorsForEmergency(emergencyId, maxDonors = 5) {
  const emergency = await getEmergencyById(emergencyId);
  
  if (emergency.status !== 'OPEN') {
    throw new Error('Emergency is not open for matching');
  }
  
  // Update emergency status
  await db.collection('emergencies').doc(emergencyId).update({
    status: 'MATCHING',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Find matching donors
  const matches = await findMatchingDonors(emergencyId, maxDonors);
  
  // Create assignments
  const assignments = [];
  for (const match of matches) {
    const assignment = await createAssignment(
      emergencyId,
      match.donorId,
      emergency.hospitalId,
      match.totalScore,
      match.distance,
      calculateETA(match.distance || 5)
    );
    assignments.push({ ...assignment, matchScore: match });
  }
  
  return {
    emergencyId,
    matchesFound: matches.length,
    assignments,
  };
}

/**
 * Trigger next batch of donors if current batch declined
 */
export async function escalateAndMatch(emergencyId) {
  const emergency = await getEmergencyById(emergencyId);
  
  // Expand radius by 2km
  const newRadius = (emergency.radiusKm || 5) + 2;
  
  await db.collection('emergencies').doc(emergencyId).update({
    radiusKm: newRadius,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Find new donors with expanded radius
  return matchDonorsForEmergency(emergencyId, 3);
}
```

### 9.2 Matching Controller (`src/controllers/matching.controller.js`)

```javascript
import { 
  scoreDonor, 
  findMatchingDonors, 
  matchDonorsForEmergency,
  escalateAndMatch 
} from '../services/matching.service.js';
import { requireHospital, requireAuth } from '../src/middleware/auth.middleware.js';

/**
 * GET /hospital/emergency/:id/matches
 * Get matching donors for emergency
 */
export async function getMatches(req, res) {
  try {
    const { id } = req.params;
    const { limit } = req.query;
    
    const matches = await findMatchingDonors(
      id, 
      parseInt(limit) || 5
    );
    
    res.json({ matches, count: matches.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /hospital/emergency/:id/match
 * Trigger matching for emergency
 */
export async function triggerMatch(req, res) {
  try {
    const { id } = req.params;
    
    const result = await matchDonorsForEmergency(id);
    
    res.json(result);
  } catch (error) {
    if (error.message === 'Emergency is not open for matching') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /hospital/emergency/:id/escalate
 * Escalate and find more donors
 */
export async function escalate(req, res) {
  try {
    const { id } = req.params;
    
    const result = await escalateAndMatch(id);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /donor/score/:emergencyId
 * Get donor's score for an emergency
 */
export async function getDonorScore(req, res) {
  try {
    const { emergencyId } = req.params;
    
    const scoring = await scoreDonor(req.user.uid, emergencyId);
    
    res.json(scoring);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 9.3 Add Routes to server.js

```javascript
import { 
  getMatches, 
  triggerMatch, 
  escalate,
  getDonorScore
} from './src/controllers/matching.controller.js';
import { requireHospital, requireDonor, requireAuth } from './src/middleware/auth.middleware.js';

// Matching routes
app.get('/api/hospital/emergency/:id/matches', requireAuth, getMatches);
app.post('/api/hospital/emergency/:id/match', requireAuth, triggerMatch);
app.post('/api/hospital/emergency/:id/escalate', requireAuth, escalate);
app.get('/api/donor/score/:emergencyId', requireAuth, getDonorScore);
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/hospital/emergency/:id/matches | Hospital | Get matching donors |
| POST | /api/hospital/emergency/:id/match | Hospital | Trigger matching |
| POST | /api/hospital/emergency/:id/escalate | Hospital | Expand radius & re-match |
| GET | /api/donor/score/:emergencyId | Donor | Get donor's match score |

## Status
- [ ] Matching service created
- [ ] Matching controller created
- [ ] Routes added
- [ ] Tested matching flow
