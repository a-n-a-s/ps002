# TASK 1: Project Setup

## Objective
Set up the backend folder structure and install dependencies.

## Steps

### 1.1 Create Folder Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── sockets/
│   ├── middleware/
│   ├── utils/
│   └── config/
├── tasks/
├── .env
├── .env.example
├── package.json
└── server.js
```

### 1.2 Update package.json
```json
{
  "name": "bloodlink-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "firebase-admin": "^12.0.0"
  }
}
```

### 1.3 Install Dependencies
```bash
npm install
```

### 1.4 Create .env.example
```
# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# Server
PORT=3001

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 1.5 Create basic server.js
```javascript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`BloodLink server running on port ${PORT}`);
});
```

## Verification
- Run `npm run dev`
- Visit `http://localhost:3001/api/health`
- Should return `{"status":"ok"}`

## Status
- [ ] Folder structure created
- [ ] Dependencies installed
- [ ] Server running
- [ ] Health endpoint working
