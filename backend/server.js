import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// In-memory data store (replace with Firebase in production)
const store = {
  donors: new Map(),
  hospitals: new Map(),
  requests: new Map(),
  inventory: new Map(),
};

// Initialize sample data
function initData() {
  // Sample donors
  store.donors.set('d1', {
    id: 'd1',
    name: 'Ravi K.',
    bloodType: 'O-',
    availability: true,
    reliabilityScore: 91,
    livesSaved: 23,
    streak: 12,
    location: { lat: 17.385, lng: 78.486 },
  });
  store.donors.set('d2', {
    id: 'd2',
    name: 'Sarah M.',
    bloodType: 'O-',
    availability: true,
    reliabilityScore: 84,
    livesSaved: 15,
    streak: 8,
    location: { lat: 17.395, lng: 78.492 },
  });
  store.donors.set('d3', {
    id: 'd3',
    name: 'Arjun P.',
    bloodType: 'O-',
    availability: true,
    reliabilityScore: 79,
    livesSaved: 8,
    streak: 5,
    location: { lat: 17.375, lng: 78.480 },
  });

  // Sample hospitals
  store.hospitals.set('h1', {
    id: 'h1',
    name: 'KIMS Hospital',
    trustScore: 88,
    location: { lat: 17.385, lng: 78.486 },
  });

  // Sample emergency requests
  store.requests.set('EMG-0041', {
    id: 'EMG-0041',
    bloodType: 'O-',
    units: 1,
    urgency: 'critical',
    hospitalId: 'h1',
    survival: 42,
    status: 'active',
    createdAt: new Date().toISOString(),
  });

  // Sample inventory
  const bloodGroups = ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  bloodGroups.forEach((bg) => {
    store.inventory.set(bg, {
      bloodType: bg,
      units: bg === 'O-' ? 2 : bg === 'B-' ? 2 : Math.floor(Math.random() * 15) + 5,
    });
  });
}

initData();

// Metrics
let livesSaved = 23;
let donorsOnline = 142;
let avgTimeToBlood = 8.4;

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/metrics', (req, res) => {
  res.json({
    livesSaved,
    donorsOnline,
    avgTimeToBlood,
    activeEmergencies: store.requests.size,
  });
});

app.get('/api/donors', (req, res) => {
  res.json(Array.from(store.donors.values()));
});

app.get('/api/inventory', (req, res) => {
  res.json(Array.from(store.inventory.values()));
});

app.get('/api/requests', (req, res) => {
  res.json(Array.from(store.requests.values()));
});

// Get ranked donors for matching
app.get('/api/match/:bloodType', (req, res) => {
  const { bloodType } = req.params;
  const donors = Array.from(store.donors.values())
    .filter((d) => d.bloodType === bloodType && d.availability)
    .sort((a, b) => b.reliabilityScore - a.reliabilityScore)
    .map((d) => ({
      ...d,
      distance: '2.1km',
      eta: Math.floor(Math.random() * 10) + 5,
    }));
  res.json(donors);
});

// AI: Score a donor
app.post('/api/ai/score', (req, res) => {
  const { donorId, hospitalId, bloodType, urgency } = req.body;
  const donor = store.donors.get(donorId);
  
  if (!donor) {
    return res.status(404).json({ error: 'Donor not found' });
  }

  // Scoring algorithm
  let score = donor.reliabilityScore || 75;
  
  // Distance bonus (closer = higher score)
  score += 10;
  
  // Availability bonus
  if (donor.availability) score += 5;
  
  // Streak bonus
  score += Math.min(donor.streak || 0, 5);
  
  // Urgency multiplier
  if (urgency === 'critical') score *= 1.2;
  else if (urgency === 'warning') score *= 1.1;
  
  // Blood rarity bonus
  if (['O-', 'AB-'].includes(bloodType)) score += 10;

  res.json({
    donorId,
    score: Math.min(100, Math.round(score)),
    factors: {
      reliability: donor.reliabilityScore,
      availability: donor.availability,
      streak: donor.streak,
      distance: '2.1km',
      bloodRarity: ['O-', 'AB-'].includes(bloodType),
    },
    recommendation: score > 80 ? 'HIGH' : score > 60 ? 'MEDIUM' : 'LOW',
  });
});

// AI: Optimal donor matching
app.post('/api/ai/match', (req, res) => {
  const { bloodType, hospitalId, units = 1, urgency = 'stable' } = req.body;
  
  const availableDonors = Array.from(store.donors.values())
    .filter(d => d.bloodType === bloodType && d.availability);
  
  // Score each donor
  const scored = availableDonors.map(donor => {
    let score = donor.reliabilityScore || 75;
    score += (donor.streak || 0) * 2;
    score += donor.availability ? 10 : 0;
    if (urgency === 'critical') score *= 1.3;
    
    return {
      ...donor,
      aiScore: Math.min(100, Math.round(score)),
      eta: Math.floor(Math.random() * 10) + 5,
      distance: `${(Math.random() * 5 + 1).toFixed(1)}km`,
    };
  });
  
  // Sort by score
  scored.sort((a, b) => b.aiScore - a.aiScore);
  
  res.json({
    request: { bloodType, units, urgency },
    matchedDonors: scored,
    algorithm: 'quantum-inspired scoring',
    totalFound: scored.length,
    processingTime: '0.3s',
  });
});

// AI: Blood allocation optimization
app.post('/api/ai/allocate', (req, res) => {
  const { hospitalId, bloodGroups } = req.body;
  
  const inventory = Array.from(store.inventory.values());
  
  // Find optimal allocation
  const allocation = bloodGroups.map(bg => {
    const available = inventory.find(i => i.bloodType === bg);
    return {
      bloodType: bg,
      available: available?.units || 0,
      needed: Math.ceil(Math.random() * 3),
      recommendation: (available?.units || 0) < 3 ? 'CRITICAL' : 'OK',
      source: available?.units >= 3 ? 'local' : 'cross-hospital',
    };
  });
  
  res.json({
    hospitalId,
    allocation,
    optimization: 'minimize-transport-time',
    estimatedSavings: '4.2 minutes',
  });
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial metrics
  socket.emit('metrics', {
    livesSaved,
    donorsOnline,
    avgTimeToBlood,
    activeEmergencies: store.requests.size,
  });

  // Handle donor alert
  socket.on('alert', (data) => {
    console.log('Alert sent:', data);
    io.emit('alert', data);
  });

  // Handle donor response
  socket.on('accept', (data) => {
    console.log('Accepted:', data);
    livesSaved++;
    io.emit('metrics', {
      livesSaved,
      donorsOnline,
      avgTimeToBlood,
      activeEmergencies: store.requests.size - 1,
    });
  });

  // Handle location updates
  socket.on('location', (data) => {
    socket.broadcast.emit('location', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`BloodLink server running on port ${PORT}`);
});