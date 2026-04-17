# TASK 13: Inventory Service

## Objective
Create blood inventory management service.

## Files to Create

### 13.1 Inventory Service (`src/services/inventory.service.js`)

```javascript
import { db, admin } from '../config/firebase.js';

const BLOOD_TYPES = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

/**
 * Initialize inventory for a hospital
 */
export async function initializeInventory(hospitalId) {
  const bloodGroups = {};
  BLOOD_TYPES.forEach(type => {
    bloodGroups[type] = 10; // Start with 10 units each
  });
  
  await db.collection('inventory').doc(hospitalId).set({
    hospitalId,
    bloodGroups,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { hospitalId, bloodGroups };
}

/**
 * Get hospital inventory
 */
export async function getInventory(hospitalId) {
  const doc = await db.collection('inventory').doc(hospitalId).get();
  
  if (!doc.exists) {
    // Initialize if not exists
    return initializeInventory(hospitalId);
  }
  
  return { id: doc.id, ...doc.data() };
}

/**
 * Update blood unit count
 */
export async function updateBloodUnits(hospitalId, bloodType, change) {
  const validTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  
  if (!validTypes.includes(bloodType)) {
    throw new Error('Invalid blood type');
  }
  
  const inventory = await getInventory(hospitalId);
  
  const currentUnits = inventory.bloodGroups[bloodType] || 0;
  const newUnits = Math.max(0, currentUnits + change); // Can't go below 0
  
  await db.collection('inventory').doc(hospitalId).update({
    [`bloodGroups.${bloodType}`]: newUnits,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Check for low stock alert
  if (newUnits < 3) {
    // Could trigger alert here
    console.log(`[Inventory] Low stock alert: ${bloodType} at ${hospitalId} - ${newUnits} units`);
  }
  
  return getInventory(hospitalId);
}

/**
 * Add blood units (after donation)
 */
export async function addBloodUnits(hospitalId, bloodType, units = 1) {
  return updateBloodUnits(hospitalId, bloodType, units);
}

/**
 * Use blood units (for patient)
 */
export async function useBloodUnits(hospitalId, bloodType, units = 1) {
  return updateBloodUnits(hospitalId, bloodType, -units);
}

/**
 * Transfer blood between hospitals
 */
export async function transferBlood(fromHospitalId, toHospitalId, bloodType, units) {
  // Remove from source
  await useBloodUnits(fromHospitalId, bloodType, units);
  
  // Add to destination
  await addBloodUnits(toHospitalId, bloodType, units);
  
  return {
    from: fromHospitalId,
    to: toHospitalId,
    bloodType,
    units,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get low stock hospitals
 */
export async function getLowStockHospitals(threshold = 3) {
  const snapshot = await db.collection('inventory').get();
  const lowStock = [];
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const lowTypes = [];
    
    BLOOD_TYPES.forEach(type => {
      if ((data.bloodGroups[type] || 0) < threshold) {
        lowTypes.push({ type, units: data.bloodGroups[type] });
      }
    });
    
    if (lowTypes.length > 0) {
      lowStock.push({
        hospitalId: doc.id,
        lowTypes,
      });
    }
  });
  
  return lowStock;
}

/**
 * Get all hospital inventories (for admin dashboard)
 */
export async function getAllInventories() {
  const snapshot = await db.collection('inventory').get();
  const inventories = [];
  
  snapshot.forEach(doc => {
    inventories.push({ id: doc.id, ...doc.data() });
  });
  
  return inventories;
}
```

### 13.2 Inventory Controller (`src/controllers/inventory.controller.js`)

```javascript
import { 
  getInventory, 
  addBloodUnits, 
  useBloodUnits,
  transferBlood,
  getLowStockHospitals,
  getAllInventories
} from '../services/inventory.service.js';

/**
 * GET /hospital/inventory
 * Get hospital's inventory
 */
export async function getMyInventory(req, res) {
  try {
    const inventory = await getInventory(req.user.uid);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /hospital/inventory/add
 * Add blood units
 */
export async function addUnits(req, res) {
  try {
    const { bloodType, units } = req.body;
    
    if (!bloodType || !units) {
      return res.status(400).json({ error: 'Blood type and units required' });
    }
    
    const inventory = await addBloodUnits(req.user.uid, bloodType, units);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /hospital/inventory/use
 * Use blood units
 */
export async function useUnits(req, res) {
  try {
    const { bloodType, units } = req.body;
    
    if (!bloodType || !units) {
      return res.status(400).json({ error: 'Blood type and units required' });
    }
    
    const inventory = await useBloodUnits(req.user.uid, bloodType, units);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /hospital/inventory/transfer
 * Transfer blood to another hospital
 */
export async function transfer(req, res) {
  try {
    const { toHospitalId, bloodType, units } = req.body;
    
    if (!toHospitalId || !bloodType || !units) {
      return res.status(400).json({ 
        error: 'Destination hospital, blood type, and units required' 
      });
    }
    
    const result = await transferBlood(
      req.user.uid, 
      toHospitalId, 
      bloodType, 
      units
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /inventory/low-stock (admin)
 * Get hospitals with low stock
 */
export async function getLowStock(req, res) {
  try {
    const threshold = parseInt(req.query.threshold) || 3;
    const lowStock = await getLowStockHospitals(threshold);
    res.json({ lowStock, count: lowStock.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /inventory/all (admin)
 * Get all hospital inventories
 */
export async function getAll(req, res) {
  try {
    const inventories = await getAllInventories();
    res.json({ inventories, count: inventories.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 13.3 Add Routes to server.js

```javascript
import { 
  getMyInventory,
  addUnits,
  useUnits,
  transfer,
  getLowStock,
  getAll
} from './src/controllers/inventory.controller.js';
import { requireHospital, requireAuth } from './src/middleware/auth.middleware.js';

// Inventory routes (hospital)
app.get('/api/hospital/inventory', requireAuth, getMyInventory);
app.post('/api/hospital/inventory/add', requireAuth, addUnits);
app.post('/api/hospital/inventory/use', requireAuth, useUnits);
app.post('/api/hospital/inventory/transfer', requireAuth, transfer);

// Admin routes
app.get('/api/inventory/low-stock', requireAuth, getLowStock);
app.get('/api/inventory/all', requireAuth, getAll);
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/hospital/inventory | Hospital | Get inventory |
| POST | /api/hospital/inventory/add | Hospital | Add units |
| POST | /api/hospital/inventory/use | Hospital | Use units |
| POST | /api/hospital/inventory/transfer | Hospital | Transfer blood |
| GET | /api/inventory/low-stock | Admin | Get low stock alerts |
| GET | /api/inventory/all | Admin | Get all inventories |

## Status
- [ ] Inventory service created
- [ ] Inventory controller created
- [ ] Routes added
- [ ] Low stock alerts implemented
