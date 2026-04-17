Alright—now we’re going to treat this like a **production-grade, life-critical system**, not a hackathon project.

I’ll give you a **combined donor + hospital backend architecture**, the way someone with decades of systems experience would design it: **event-driven, fault-tolerant, observable, and scalable**.

---

# 🧠 0. First Principles (Non-Negotiable)

Before design, accept these truths:

* This is a **real-time coordination system**, not a CRUD app
* **Latency matters** (seconds = lives)
* **Reliability > features**
* **State consistency is critical**
* **Failures WILL happen** → design for them

---

# 🏗️ 1. System Architecture (Clean & Real)

```id="arch001"
Clients (Donor App / Hospital Dashboard)
        ↓
API Layer (Express)
        ↓
-----------------------------------------
| Domain Services Layer                 |
|---------------------------------------|
| Auth Service (Firebase)              |
| Donor Service                        |
| Hospital Service                     |
| Emergency Service                    |
| Matching Engine                      |
| Assignment Service                   |
| Tracking Service                     |
| Notification Service                 |
-----------------------------------------
        ↓
-----------------------------------------
| Data Layer                           |
|---------------------------------------|
| Firestore (source of truth)          |
| Redis (cache + queues + locks)       |
-----------------------------------------
        ↓
Realtime Layer (Socket.io)
        ↓
External Services (FCM, Twilio, Mapbox)
```

---

# 🧱 2. Core Domain Model (Unified)

This is where most systems fail—they don’t define relationships cleanly.

---

## 👤 Users (Single source of identity)

```js id="model_users"
users/{uid}
  role: "DONOR" | "HOSPITAL"
  name
  phone
  email
  verified
  createdAt
```

---

## 🩸 Donors

```js id="model_donors"
donors/{uid}
  bloodType
  location { lat, lng, geohash }
  availability
  reliabilityScore
  totalDonations
  lastDonationDate
  activeAssignmentId
```

---

## 🏥 Hospitals

```js id="model_hospitals"
hospitals/{uid}
  name
  location
  licenseNumber
  verified
  trustScore
```

---

## 🚨 Emergencies (Core Entity)

```js id="model_emergency"
emergencies/{id}
  hospitalId
  bloodType
  unitsRequired
  unitsFulfilled
  urgencyLevel
  status:
    "OPEN"
    "MATCHING"
    "IN_PROGRESS"
    "FULFILLED"
    "CANCELLED"
  radiusKm
  createdAt
  expiresAt
```

---

## 🔗 Assignments (THE MOST IMPORTANT TABLE)

This connects donors ↔ emergencies.

```js id="model_assignments"
assignments/{id}
  emergencyId
  donorId
  hospitalId
  status:
    "NOTIFIED"
    "ACCEPTED"
    "EN_ROUTE"
    "ARRIVED"
    "COMPLETED"
    "DECLINED"
    "EXPIRED"
  priorityScore
  eta
  createdAt
  updatedAt
```

---

## 📍 Tracking

```js id="model_tracking"
tracking/{emergencyId}/donors/{donorId}
  location
  lastUpdated
  eta
```

---

## 🧪 Inventory

```js id="model_inventory"
inventory/{hospitalId}
  bloodGroups: {
    "O+": 5,
    "A-": 2
  }
```

---

# 🔁 3. End-to-End Flow (Donor + Hospital Combined)

This is the **actual system heartbeat**.

---

## 🚨 STEP 1: Hospital Creates Emergency

```http id="api_create_emergency"
POST /hospital/emergency
```

### Backend does:

```js id="flow_create"
1. Validate hospital
2. Create emergency (status = OPEN)
3. Push job → MATCHING_QUEUE
4. Emit → hospital dashboard
```

---

## 🧠 STEP 2: Matching Engine (Async Worker)

```js id="flow_matching"
1. Fetch eligible donors
2. Filter:
   - blood type
   - availability
   - distance (geohash)
3. Score donors
4. Sort + pick top N
5. Create assignments
6. Push notification jobs
```

---

## 📡 STEP 3: Alert Dispatch

Multi-channel:

```js id="flow_alerts"
- Socket.io → instant
- FCM → push notification
- Twilio → SMS fallback
```

Assignment status:

```js id="flow_assign_status"
NOTIFIED
```

---

## 👤 STEP 4: Donor Responds

```http id="api_donor_response"
POST /donor/alert/respond
```

---

### If ACCEPT:

```js id="flow_accept"
1. Lock emergency (Redis lock)
2. Check slots available
3. Update assignment → ACCEPTED
4. Increment unitsFulfilled
5. Emit to hospital
6. Start tracking
```

---

### If DECLINE:

```js id="flow_decline"
assignment → DECLINED
trigger next donor batch
```

---

## 📍 STEP 5: Live Tracking

```js id="flow_tracking"
Donor → sends location every 5s

Server:
- updates tracking collection
- emits to hospital room
```

---

## 🏥 STEP 6: Hospital Dashboard Updates

Real-time:

```js id="flow_dashboard"
- accepted donors
- live map updates
- ETA
- fulfillment %
```

---

## ✅ STEP 7: Completion

```js id="flow_completion"
if (unitsFulfilled >= unitsRequired):
  emergency → FULFILLED
  stop notifications
  close tracking
  update inventory
```

---

# ⚙️ 4. API Design (Unified)

---

## 👤 Donor APIs

```http id="api_donor"
GET    /donor/me
PATCH  /donor/availability
GET    /donor/alerts
POST   /donor/alert/respond
POST   /donor/location/update
```

---

## 🏥 Hospital APIs

```http id="api_hospital"
POST   /hospital/emergency
GET    /hospital/emergencies
GET    /hospital/emergency/:id
POST   /hospital/emergency/:id/cancel
GET    /hospital/dashboard
GET    /hospital/inventory
```

---

# 📡 5. Socket.io Design

---

## Rooms

```js id="socket_rooms"
donor:{uid}
hospital:{hospitalId}
emergency:{emergencyId}
```

---

## Events

### Donor receives:

```js id="socket_donor"
EMERGENCY_ALERT
ALERT_CANCELLED
```

---

### Hospital receives:

```js id="socket_hospital"
DONOR_ACCEPTED
DONOR_LOCATION
EMERGENCY_UPDATED
```

---

# 🧠 6. Matching Engine (Realistic v1)

```js id="matching_algo"
score =
  (distance * -0.4) +
  (reliability * 0.3) +
  (availability * 0.2) +
  (recentActivity * 0.1)
```

---

Use:

* Geo queries (Firestore)
* Radius expansion

---

# 🔁 7. Queue System (CRITICAL)

Use **BullMQ + Redis**

---

## Queues

```js id="queues"
MATCHING_QUEUE
ALERT_QUEUE
ESCALATION_QUEUE
EXPIRY_QUEUE
```

---

## Jobs

### Matching Job

```js id="job_matching"
triggered on emergency creation
```

---

### Escalation Job

```js id="job_escalation"
if no response:
  increase radius
  notify more donors
```

---

### Expiry Job

```js id="job_expiry"
auto cancel after timeout
```

---

# 🔐 8. Concurrency Control (VERY IMPORTANT)

Problem:
👉 10 donors accept at same time

Solution:

```js id="locking"
Use Redis lock:

lock:emergency:{id}

if locked:
  process safely
```

---

# 📉 9. Failure Handling

Design for failure, not success.

---

## Cases:

### ❌ Socket fails

→ fallback: FCM / SMS

### ❌ SMS fails

→ retry queue

### ❌ Donor disappears

→ timeout → reassign

---

# 📊 10. Observability (Most Ignored)

You NEED:

* Logs (Winston)
* Metrics:

  * response time
  * match success rate
* Alerts (if system delays > threshold)

---

# 🧱 11. Folder Structure

```id="folder_structure"
src/
  controllers/
  services/
    matching.service.js
    emergency.service.js
    donor.service.js
    hospital.service.js
    notification.service.js
  sockets/
  jobs/
  queues/
  middleware/
  utils/
```

---

# ⚠️ 12. Hard Truths

If you skip these:

* ❌ No queue → system collapses under load
* ❌ No locking → overbooking donors
* ❌ No tracking → hospital loses visibility
* ❌ No escalation → delays = deaths

---

# 🚀 Final Thought (Engineer to Engineer)

Right now your project is:

> “A very good frontend simulation”

This design turns it into:

> “A distributed real-time emergency response system”

---

# 👉 What I Recommend You Do Next

Don’t try to build everything at once.

Start in this order:

1. ✅ Firestore schema
2. ✅ Emergency + assignment logic
3. ✅ Matching engine (basic)
4. ✅ Socket events
5. ✅ Queue system
6. ✅ Notifications

---

If you want, next I can:

* Write **actual production-level Express + Socket code**
* Build your **matching engine step-by-step**
* Or convert your current backend into this architecture

Just say:
👉 *“implement step 1”* or *“write backend code”*
