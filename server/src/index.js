import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

import { initDb } from './db.js';
import { initSocket } from './socket.js';
import authRoutes from './routes/auth.js';
import propertiesRoutes from './routes/properties.js';
import maintenanceRoutes from './routes/maintenance.js';
import amenitiesRoutes from './routes/amenities.js';
import analyticsRoutes from './routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Initialize DB (clean real-world structure, zero simulation data)
initDb();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
initSocket(io);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PropFlow Real-Time Property Rental, Maintenance & Amenity Management API',
    database: 'Real-World Production Mode (Zero Simulation Data)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/amenities', amenitiesRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve built frontend if exists
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('PropFlow Real-Time Platform API Running. Please build or run the client.');
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 PropFlow Real-Time Platform Server running on:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   WebSocket Server Ready`);
  console.log(`   MongoDB / Persistent Store Active (Clean Real State)`);
  console.log(`====================================================`);
});
