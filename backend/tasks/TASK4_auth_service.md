# TASK 4: Auth Service

## Objective
Create authentication service for Firebase Auth integration and middleware for protected routes.

## Files to Create

### 4.1 Auth Service (`src/services/auth.service.js`)

```javascript
import { auth, db } from '../config/firebase.js';
import admin from 'firebase-admin';

/**
 * Create a new user with Firebase Auth
 */
export async function createUser({ email, password, phone, role }) {
  // Create Firebase Auth user
  const userRecord = await auth.createUser({
    email,
    password,
    phone,
  });

  // Create user document in Firestore
  await db.collection('users').doc(userRecord.uid).set({
    role,
    name: '',
    phone,
    email,
    verified: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    uid: userRecord.uid,
    email: userRecord.email,
  };
}

/**
 * Get user by UID
 */
export async function getUserByUid(uid) {
  const userDoc = await db.collection('users').doc(uid).get();
  
  if (!userDoc.exists) {
    throw new Error('User not found');
  }
  
  return { id: userDoc.id, ...userDoc.data() };
}

/**
 * Update user profile
 */
export async function updateUser(uid, data) {
  await db.collection('users').doc(uid).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Verify Firebase ID token and return user
 */
export async function verifyToken(idToken) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token: ' + error.message);
  }
}

/**
 * Generate custom token for testing (optional)
 */
export async function generateCustomToken(uid) {
  return auth.createCustomToken(uid);
}
```

### 4.2 Auth Middleware (`src/middleware/auth.middleware.js`)

```javascript
import { verifyToken, getUserByUid } from '../services/auth.service.js';

/**
 * Protect route - requires valid Firebase token
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = await verifyToken(token);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: ' + error.message });
  }
}

/**
 * Protect route - requires specific role
 */
export function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      await requireAuth(req, res, async () => {
        const user = await getUserByUid(req.user.uid);
        
        if (!allowedRoles.includes(user.role)) {
          return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        
        req.userData = user;
        next();
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };
}

/**
 * Require hospital role
 */
export const requireHospital = requireRole('HOSPITAL');

/**
 * Require donor role
 */
export const requireDonor = requireRole('DONOR');
```

### 4.3 Auth Controller (`src/controllers/auth.controller.js`)

```javascript
import { createUser, getUserByUid, updateUser } from '../services/auth.service.js';

/**
 * POST /auth/register
 * Register new user (donor or hospital)
 */
export async function register(req, res) {
  try {
    const { email, password, phone, role } = req.body;
    
    if (!email || !password || !phone || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!['DONOR', 'HOSPITAL'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const user = await createUser({ email, password, phone, role });
    
    res.status(201).json({
      message: 'User created successfully',
      uid: user.uid,
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /auth/me
 * Get current user profile
 */
export async function getMe(req, res) {
  try {
    const user = await getUserByUid(req.user.uid);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

/**
 * PATCH /auth/profile
 * Update user profile
 */
export async function updateProfile(req, res) {
  try {
    const { name, phone } = req.body;
    await updateUser(req.user.uid, { name, phone });
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 4.4 Add Routes to server.js

```javascript
import { register, getMe, updateProfile } from './src/controllers/auth.controller.js';
import { requireAuth } from './src/middleware/auth.middleware.js';

// Public routes
app.post('/api/auth/register', register);

// Protected routes
app.get('/api/auth/me', requireAuth, getMe);
app.patch('/api/auth/profile', requireAuth, updateProfile);
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| GET | /api/auth/me | Yes | Get current user |
| PATCH | /api/auth/profile | Yes | Update profile |

## Status
- [ ] Auth service created
- [ ] Auth middleware created
- [ ] Auth controller created
- [ ] Routes added
- [ ] Tested registration
