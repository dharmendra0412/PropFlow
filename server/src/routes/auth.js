import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, saveDb, logActivity } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'propflow_super_secure_jwt_secret_key_2026_production';

// Helper to sanitize user (remove password before sending to client)
const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

// POST /api/auth/register - Real User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'tenant', phone, propertyId, unitNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = getDb();

    // Check if email already registered
    const existing = db.users.find(u => u.email === cleanEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `USR-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

    // Resolve property details if provided
    let propertyName = '';
    if (propertyId) {
      const prop = db.properties.find(p => p.id === propertyId);
      if (prop) propertyName = prop.name;
    }

    const newUser = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: ['owner', 'manager'].includes(role) ? 'owner' : 'tenant',
      phone: phone ? phone.trim() : '',
      propertyId: propertyId || '',
      propertyName: propertyName || '',
      unitNumber: unitNumber ? unitNumber.trim() : (role === 'owner' ? 'Management Office' : ''),
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDb(db);

    logActivity('USER_REGISTERED', 'New Account Created', `${newUser.name} registered as a ${newUser.role}`, newUser);

    // Sign JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: sanitizeUser(newUser),
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Registration failed: ' + err.message });
  }
});

// POST /api/auth/login - Real User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = getDb();
    const user = db.users.find(u => u.email === cleanEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Welcome back!',
      user: sanitizeUser(user),
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed: ' + err.message });
  }
});

// GET /api/auth/me - Current User
router.get('/me', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  res.json({ success: true, user: sanitizeUser(user) });
});

// GET /api/auth/users - List users for owner/manager view
router.get('/users', authMiddleware, (req, res) => {
  const db = getDb();
  const safeUsers = db.users.map(sanitizeUser);
  res.json({ success: true, users: safeUsers });
});

export default router;
