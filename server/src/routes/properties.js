import express from 'express';
import { getDb, saveDb, logActivity } from '../db.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET all properties
router.get('/', optionalAuthMiddleware, (req, res) => {
  const db = getDb();
  res.json({ success: true, count: db.properties.length, properties: db.properties });
});

// GET single property
router.get('/:id', optionalAuthMiddleware, (req, res) => {
  const db = getDb();
  const property = db.properties.find(p => p.id === req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  res.json({ success: true, property });
});

// POST create real property (Owner only)
router.post('/', authMiddleware, (req, res) => {
  const { name, address, totalUnits, description } = req.body;

  if (!name || !name.trim() || !address || !address.trim()) {
    return res.status(400).json({ success: false, message: 'Property name and physical address are required.' });
  }

  const db = getDb();
  const propId = `PROP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 100)}`;

  const newProperty = {
    id: propId,
    name: name.trim(),
    address: address.trim(),
    totalUnits: Number(totalUnits) || 1,
    occupiedUnits: 0,
    managerId: req.user.id,
    managerName: req.user.name,
    description: description ? description.trim() : '',
    createdAt: new Date().toISOString()
  };

  db.properties.push(newProperty);

  // Link property to creating user if they don't have one
  const user = db.users.find(u => u.id === req.user.id);
  if (user && !user.propertyId) {
    user.propertyId = propId;
    user.propertyName = newProperty.name;
  }

  saveDb(db);

  logActivity('PROPERTY_CREATED', `Property Registered: ${newProperty.name}`, `${req.user.name} registered new property at ${newProperty.address}`, req.user);

  res.status(201).json({ success: true, property: newProperty, message: 'Property created successfully!' });
});

export default router;
