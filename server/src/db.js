import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure reliable DNS resolution for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const cleanEmptyState = {
  users: [],
  properties: [],
  amenities: [],
  maintenanceRequests: [],
  amenityBookings: [],
  activityLogs: []
};

let dbCache = null;
let isMongoConnected = false;

// Mongoose Schemas for MongoDB Atlas
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'tenant' },
  phone: String,
  propertyId: String,
  propertyName: String,
  unitNumber: String,
  createdAt: { type: Date, default: Date.now }
});

const PropertySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  totalUnits: { type: Number, default: 1 },
  occupiedUnits: { type: Number, default: 0 },
  managerId: String,
  managerName: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const AmenitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  propertyId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  description: String,
  capacity: { type: Number, default: 10 },
  openTime: { type: String, default: '08:00' },
  closeTime: { type: String, default: '22:00' },
  slotDuration: { type: Number, default: 60 },
  rules: [String],
  createdAt: { type: Date, default: Date.now }
});

const MaintenanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  propertyId: { type: String, required: true },
  propertyName: String,
  unitNumber: { type: String, required: true },
  tenantId: { type: String, required: true },
  tenantName: { type: String, required: true },
  tenantPhone: String,
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  priority: { type: String, default: 'Medium' },
  status: { type: String, default: 'Pending' },
  assignedTo: { type: String, default: 'Unassigned' },
  description: { type: String, required: true },
  resolutionNotes: { type: String, default: '' },
  resolvedAt: Date,
  comments: [{
    id: String,
    senderId: String,
    senderName: String,
    senderRole: String,
    message: String,
    timestamp: Date
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const BookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  amenityId: { type: String, required: true },
  amenityName: { type: String, required: true },
  propertyId: { type: String, required: true },
  tenantId: { type: String, required: true },
  tenantName: { type: String, required: true },
  unitNumber: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  guestCount: { type: Number, default: 1 },
  purpose: String,
  status: { type: String, default: 'Confirmed' },
  checkInTime: Date,
  checkOutTime: Date,
  createdAt: { type: Date, default: Date.now }
});

const ActivityLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: String,
  title: String,
  description: String,
  userId: String,
  userName: String,
  timestamp: { type: Date, default: Date.now }
});

export const MongoModels = {
  User: mongoose.models.User || mongoose.model('User', UserSchema),
  Property: mongoose.models.Property || mongoose.model('Property', PropertySchema),
  Amenity: mongoose.models.Amenity || mongoose.model('Amenity', AmenitySchema),
  Maintenance: mongoose.models.MaintenanceRequest || mongoose.model('MaintenanceRequest', MaintenanceSchema),
  Booking: mongoose.models.AmenityBooking || mongoose.model('AmenityBooking', BookingSchema),
  Activity: mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema)
};

// Sync local cache to MongoDB Atlas
export const syncToMongo = async () => {
  if (!isMongoConnected) return;
  try {
    const db = getDb();
    // Bulk upsert for each collection
    for (const u of db.users) {
      await MongoModels.User.findOneAndUpdate({ id: u.id }, u, { upsert: true });
    }
    for (const p of db.properties) {
      await MongoModels.Property.findOneAndUpdate({ id: p.id }, p, { upsert: true });
    }
    for (const a of db.amenities) {
      await MongoModels.Amenity.findOneAndUpdate({ id: a.id }, a, { upsert: true });
    }
    for (const m of db.maintenanceRequests) {
      await MongoModels.Maintenance.findOneAndUpdate({ id: m.id }, m, { upsert: true });
    }
    for (const b of db.amenityBookings) {
      await MongoModels.Booking.findOneAndUpdate({ id: b.id }, b, { upsert: true });
    }
    for (const l of db.activityLogs) {
      await MongoModels.Activity.findOneAndUpdate({ id: l.id }, l, { upsert: true });
    }
  } catch (err) {
    console.error('[MongoDB Sync Error]:', err.message);
  }
};

// Connect to MongoDB Atlas
export const connectMongo = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) return false;

  try {
    console.log('[Database] Connecting to MongoDB Atlas cluster...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    isMongoConnected = true;
    console.log(`✅ [Database] Live Connected to MongoDB Atlas! (Database: "${mongoose.connection.name}")`);

    // Load any existing remote data into cache
    const [users, properties, amenities, reqs, bookings, logs] = await Promise.all([
      MongoModels.User.find({}),
      MongoModels.Property.find({}),
      MongoModels.Amenity.find({}),
      MongoModels.Maintenance.find({}),
      MongoModels.Booking.find({}),
      MongoModels.Activity.find({})
    ]);

    if (users.length > 0 || properties.length > 0) {
      const merged = {
        users: users.map(d => d.toObject()),
        properties: properties.map(d => d.toObject()),
        amenities: amenities.map(d => d.toObject()),
        maintenanceRequests: reqs.map(d => d.toObject()),
        amenityBookings: bookings.map(d => d.toObject()),
        activityLogs: logs.map(d => d.toObject())
      };
      saveDb(merged);
      console.log(`[Database] Loaded ${users.length} users and ${properties.length} properties from MongoDB Atlas.`);
    } else {
      // Sync current local store to Atlas
      await syncToMongo();
    }
    return true;
  } catch (err) {
    console.error('⚠️ [Database] MongoDB connection error:', err.message);
    isMongoConnected = false;
    return false;
  }
};

export const initDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    dbCache = JSON.parse(JSON.stringify(cleanEmptyState));
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } else {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
    } catch (err) {
      dbCache = JSON.parse(JSON.stringify(cleanEmptyState));
      fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
    }
  }

  // Connect to MongoDB Atlas asynchronously
  connectMongo().catch(err => {
    console.warn('[Database] Running in persistent fallback mode:', err.message);
  });

  return dbCache;
};

export const getDb = () => {
  if (!dbCache) return initDb();
  return dbCache;
};

export const saveDb = (newData) => {
  dbCache = newData;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database] File persist error:', err.message);
  }

  // Push updates to MongoDB Atlas
  if (isMongoConnected) {
    syncToMongo().catch(() => {});
  }

  return dbCache;
};

export const clearDatabase = () => {
  dbCache = JSON.parse(JSON.stringify(cleanEmptyState));
  fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  return dbCache;
};

export const logActivity = (type, title, description, user) => {
  const db = getDb();
  const logEntry = {
    id: `ACT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
    type,
    title,
    description,
    timestamp: new Date().toISOString(),
    userId: user?.id || user?._id || 'SYSTEM',
    userName: user?.name || 'System'
  };
  db.activityLogs = [logEntry, ...(db.activityLogs || [])].slice(0, 100);
  saveDb(db);
  return logEntry;
};
