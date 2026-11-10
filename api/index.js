import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { initDb } from '../server/src/db.js';
import authRoutes from '../server/src/routes/auth.js';
import propertiesRoutes from '../server/src/routes/properties.js';
import maintenanceRoutes from '../server/src/routes/maintenance.js';
import amenitiesRoutes from '../server/src/routes/amenities.js';
import analyticsRoutes from '../server/src/routes/analytics.js';

const app = express();

// Initialize DB (MongoDB Atlas Connection)
initDb();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PropFlow Real-Time Property Rental, Maintenance & Amenity API',
    database: 'Real-World Production Mode (Zero Simulation Data)',
    platform: 'Vercel Serverless / Cloud Hosting',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/amenities', amenitiesRoutes);
app.use('/api/analytics', analyticsRoutes);

export default app;
