# TASK 3: Firestore Database Schema

## Objective
Define all Firestore collections and their structures.

## Collection Schemas

### 3.1 users Collection
**Path:** `users/{uid}`

```javascript
{
  role: 'DONOR' | 'HOSPITAL',
  name: string,
  phone: string,
  email: string,
  verified: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes:** `role`, `email`

### 3.2 donors Collection
**Path:** `donors/{uid}`

```javascript
{
  userId: string,           // matches auth uid
  bloodType: string,        // 'O-', 'A+', etc.
  location: {
    lat: number,
    lng: number,
    geohash: string         // for efficient geo queries
  },
  address: string,         // readable address
  availability: boolean,
  reliabilityScore: number,  // 0-100
  totalDonations: number,
  lastDonationDate: Timestamp | null,
  activeAssignmentId: string | null,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes:** `bloodType`, `availability`, `location.geohash`, `userId`

### 3.3 hospitals Collection
**Path:** `hospitals/{uid}`

```javascript
{
  userId: string,
  name: string,
  address: string,
  location: {
    lat: number,
    lng: number
  },
  licenseNumber: string,
  phone: string,
  verified: boolean,
  trustScore: number,       // 0-100
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes:** `userId`, `verified`

### 3.4 emergencies Collection
**Path:** `emergencies/{id}`

```javascript
{
  id: string,              // EMG-XXXX format
  hospitalId: string,
  hospitalName: string,
  bloodType: string,
  unitsRequired: number,
  unitsFulfilled: number,
  urgencyLevel: 'CRITICAL' | 'URGENT' | 'STANDARD',
  status: 'OPEN' | 'MATCHING' | 'IN_PROGRESS' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED',
  radiusKm: number,
  location: {
    lat: number,
    lng: number
  },
  patientInfo: {
    age: number,
    condition: string
  },
  createdAt: Timestamp,
  expiresAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes:** `hospitalId`, `status`, `bloodType`, `createdAt`

### 3.5 assignments Collection
**Path:** `assignments/{id}`

```javascript
{
  id: string,
  emergencyId: string,
  donorId: string,
  hospitalId: string,
  status: 'NOTIFIED' | 'ACCEPTED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'DECLINED' | 'EXPIRED',
  priorityScore: number,
  eta: number,              // minutes
  distanceKm: number,
  notifiedAt: Timestamp,
  respondedAt: Timestamp | null,
  arrivedAt: Timestamp | null,
  completedAt: Timestamp | null,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes:** `emergencyId`, `donorId`, `status`, `hospitalId`

### 3.6 tracking Collection
**Path:** `tracking/{emergencyId}/donors/{donorId}`

```javascript
{
  location: {
    lat: number,
    lng: number
  },
  heading: number,          // degrees
  speed: number,             // km/h
  lastUpdated: Timestamp,
  eta: number
}
```

### 3.7 inventory Collection
**Path:** `inventory/{hospitalId}`

```javascript
{
  hospitalId: string,
  bloodGroups: {
    'O-': number,
    'O+': number,
    'A-': number,
    'A+': number,
    'B-': number,
    'B+': number,
    'AB-': number,
    'AB+': number
  },
  lastUpdated: Timestamp
}
```

**Indexes:** `hospitalId`

### 3.8 metrics Collection (singleton)
**Path:** `metrics/global`

```javascript
{
  livesSaved: number,
  donorsOnline: number,
  avgTimeToBlood: number,
  totalEmergencies: number,
  updatedAt: Timestamp
}
```

## Status
- [ ] All collection schemas defined
- [ ] Firestore indexes created (manually in Firebase Console or via CLI)
