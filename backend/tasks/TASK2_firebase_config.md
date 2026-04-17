# TASK 2: Firebase Configuration

## Objective
Set up Firebase Admin SDK and create initialization module.

## Steps

### 2.1 Create Firebase Config File
Create `src/config/firebase.js`:

```javascript
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Check if already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
export default admin;
```

### 2.2 Create Firestore Index Request (Optional)
Create `firestore.indexes.json` for geo queries:

```json
{
  "indexes": [
    {
      "collectionGroup": "donors",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "bloodType", "order": "ASCENDING" },
        { "fieldPath": "availability", "order": "ASCENDING" },
        { "fieldPath": "location.geohash", "order": "ASCENDING" }
      ]
    }
  ]
}
```

### 2.3 Get Firebase Credentials

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Copy the JSON content to your `.env` file:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

### 2.4 Update .env
```
FIREBASE_PROJECT_ID=bloodlink-xxx
FIREBASE_CLIENT_EMAIL=xxx@yyy.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

## Verification
Add this to `server.js` and restart:
```javascript
import { db } from './src/config/firebase.js';

// Test endpoint
app.get('/api/test-firebase', async (req, res) => {
  try {
    const test = await db.collection('_test').add({ 
      message: 'Firebase connected!',
      timestamp: new Date() 
    });
    res.json({ success: true, id: test.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Visit `http://localhost:3001/api/test-firebase` - should create a document in Firestore.

## Status
- [ ] Firebase config created
- [ ] Credentials added to .env
- [ ] Test connection successful
