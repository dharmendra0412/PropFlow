import express from 'express';
import { getDb, saveDb, logActivity } from '../db.js';
import { broadcast } from '../socket.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper to check if two time ranges [start1, end1] and [start2, end2] overlap
export const isTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// Preset catalog for real properties
export const amenityPresets = [
  {
    name: 'Fitness Center & Gym',
    category: 'Fitness & Health',
    description: 'Equipped with cardio machines, free weights, and stretching mats.',
    capacity: 20,
    openTime: '06:00',
    closeTime: '23:00',
    slotDuration: 60,
    rules: [
      'Wipe down equipment after each use',
      'Athletic footwear required',
      'Re-rack all weights and dumbbells'
    ]
  },
  {
    name: 'Swimming Pool & Sun Deck',
    category: 'Recreation',
    description: 'Outdoor heated swimming pool with lounge chairs and shaded umbrellas.',
    capacity: 25,
    openTime: '07:00',
    closeTime: '21:00',
    slotDuration: 90,
    rules: [
      'Shower required prior to entry',
      'No glass containers in pool deck zone',
      'Children must be supervised by an adult'
    ]
  },
  {
    name: 'Community Clubhouse & Lounge',
    category: 'Social',
    description: 'Resident lounge with seating, kitchen prep area, and high-definition TV.',
    capacity: 35,
    openTime: '08:00',
    closeTime: '23:00',
    slotDuration: 120,
    rules: [
      'Quiet hours start at 10:00 PM',
      'Leave kitchenette and tables clean',
      'Dispose of all party trash in designated bins'
    ]
  },
  {
    name: 'Coworking & Conference Room',
    category: 'Business',
    description: 'High-speed Wi-Fi, conference table for 10, presentation display, and power ports.',
    capacity: 10,
    openTime: '07:00',
    closeTime: '22:00',
    slotDuration: 60,
    rules: [
      'Keep conversational volume courteous',
      'Erase whiteboards after use',
      'No messy foods permitted'
    ]
  },
  {
    name: 'Outdoor BBQ & Picnic Pavilion',
    category: 'Dining & Grill',
    description: 'Commercial stainless steel barbecue grills and shaded dining tables.',
    capacity: 18,
    openTime: '10:00',
    closeTime: '21:30',
    slotDuration: 90,
    rules: [
      'Turn off gas valve firmly after grilling',
      'Scrape grill grates clean while warm',
      'Extinguish all fire sources before leaving'
    ]
  }
];

// GET presets list
router.get('/presets', (req, res) => {
  res.json({ success: true, presets: amenityPresets });
});

// GET all amenities (filtered by propertyId if passed)
router.get('/', optionalAuthMiddleware, (req, res) => {
  const db = getDb();
  const { propertyId } = req.query;
  let amenities = db.amenities;
  if (propertyId) {
    amenities = amenities.filter(a => a.propertyId === propertyId);
  }
  res.json({ success: true, count: amenities.length, amenities });
});

// GET single amenity with availability for a given date
router.get('/:id', optionalAuthMiddleware, (req, res) => {
  const db = getDb();
  const amenity = db.amenities.find(a => a.id === req.params.id);
  if (!amenity) {
    return res.status(404).json({ success: false, message: 'Amenity not found.' });
  }

  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];

  const bookings = db.amenityBookings.filter(
    b => b.amenityId === amenity.id &&
         b.date === targetDate &&
         ['Confirmed', 'Checked In'].includes(b.status)
  );

  res.json({
    success: true,
    amenity,
    date: targetDate,
    activeBookings: bookings
  });
});

// POST create custom amenity (Owner/Manager)
router.post('/', authMiddleware, (req, res) => {
  const {
    propertyId,
    name,
    category = 'General',
    description = '',
    capacity = 15,
    openTime = '08:00',
    closeTime = '22:00',
    slotDuration = 60,
    rules = []
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Amenity name is required.' });
  }

  const db = getDb();
  const resolvedPropertyId = propertyId || req.user.propertyId;

  if (!resolvedPropertyId && db.properties.length > 0) {
    resolvedPropertyId = db.properties[0].id;
  }

  const newAmenity = {
    id: `AMEN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 100)}`,
    propertyId: resolvedPropertyId || 'DEFAULT-PROP',
    name: name.trim(),
    category: category.trim(),
    description: description ? description.trim() : '',
    capacity: Number(capacity) || 10,
    openTime: openTime || '08:00',
    closeTime: closeTime || '22:00',
    slotDuration: Number(slotDuration) || 60,
    rules: Array.isArray(rules) ? rules.filter(r => r && r.trim()) : [],
    createdAt: new Date().toISOString()
  };

  db.amenities.push(newAmenity);
  saveDb(db);

  logActivity('AMENITY_CREATED', `Amenity Added: ${newAmenity.name}`, `${req.user.name} added ${newAmenity.name} facility`, req.user);

  res.status(201).json({ success: true, amenity: newAmenity, message: 'Amenity created successfully!' });
});

// POST add preset amenity
router.post('/preset', authMiddleware, (req, res) => {
  const { presetIndex, propertyId } = req.body;
  const preset = amenityPresets[Number(presetIndex)];

  if (!preset) {
    return res.status(400).json({ success: false, message: 'Invalid preset index.' });
  }

  const db = getDb();
  const targetPropertyId = propertyId || req.user.propertyId || (db.properties[0] ? db.properties[0].id : 'PROP-01');

  const newAmenity = {
    id: `AMEN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 100)}`,
    propertyId: targetPropertyId,
    name: preset.name,
    category: preset.category,
    description: preset.description,
    capacity: preset.capacity,
    openTime: preset.openTime,
    closeTime: preset.closeTime,
    slotDuration: preset.slotDuration,
    rules: [...preset.rules],
    createdAt: new Date().toISOString()
  };

  db.amenities.push(newAmenity);
  saveDb(db);

  logActivity('AMENITY_CREATED', `Preset Amenity Added: ${newAmenity.name}`, `${req.user.name} initialized ${newAmenity.name}`, req.user);

  res.status(201).json({ success: true, amenity: newAmenity, message: `${preset.name} added successfully!` });
});

// GET all bookings with filters
router.get('/bookings/all', optionalAuthMiddleware, (req, res) => {
  const db = getDb();
  const { tenantId, amenityId, propertyId, date, status } = req.query;
  let items = [...db.amenityBookings];

  if (tenantId) items = items.filter(b => b.tenantId === tenantId);
  if (amenityId) items = items.filter(b => b.amenityId === amenityId);
  if (propertyId) items = items.filter(b => b.propertyId === propertyId);
  if (date) items = items.filter(b => b.date === date);
  if (status && status !== 'All') {
    items = items.filter(b => b.status.toLowerCase() === status.toLowerCase());
  }

  items.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.startTime.localeCompare(b.startTime);
  });

  res.json({ success: true, count: items.length, bookings: items });
});

// POST create booking with STRICT CONFLICT DETECTION
router.post('/bookings', authMiddleware, (req, res) => {
  const {
    amenityId,
    date,
    startTime,
    endTime,
    guestCount = 1,
    purpose = 'Recreation'
  } = req.body;

  if (!amenityId || !date || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'Amenity, date, start time, and end time are required.'
    });
  }

  if (startTime >= endTime) {
    return res.status(400).json({
      success: false,
      message: 'End time must be later than start time.'
    });
  }

  const db = getDb();
  const amenity = db.amenities.find(a => a.id === amenityId);
  if (!amenity) {
    return res.status(404).json({ success: false, message: 'Amenity facility not found.' });
  }

  // Verify operating hours
  if (startTime < amenity.openTime || endTime > amenity.closeTime) {
    return res.status(400).json({
      success: false,
      message: `Selected hours must fall within facility operating hours (${amenity.openTime} - ${amenity.closeTime}).`
    });
  }

  // Strict Collision Detection
  const conflictingBooking = db.amenityBookings.find(b => {
    if (b.amenityId !== amenityId || b.date !== date) return false;
    if (!['Confirmed', 'Checked In'].includes(b.status)) return false;
    return isTimeOverlap(startTime, endTime, b.startTime, b.endTime);
  });

  if (conflictingBooking) {
    return res.status(409).json({
      success: false,
      conflict: true,
      message: `Collision detected: "${amenity.name}" is already reserved by ${conflictingBooking.tenantName} (${conflictingBooking.unitNumber}) from ${conflictingBooking.startTime} to ${conflictingBooking.endTime}.`,
      conflictingBooking
    });
  }

  const newBookingId = `BOOK-${db.amenityBookings.length + 1001}`;
  const newBooking = {
    id: newBookingId,
    amenityId,
    amenityName: amenity.name,
    propertyId: amenity.propertyId,
    tenantId: req.user.id,
    tenantName: req.user.name,
    unitNumber: req.user.unitNumber || 'Resident',
    date,
    startTime,
    endTime,
    guestCount: Number(guestCount) || 1,
    purpose: purpose ? purpose.trim() : 'Resident Leisure',
    status: 'Confirmed',
    checkInTime: null,
    checkOutTime: null,
    createdAt: new Date().toISOString()
  };

  db.amenityBookings.unshift(newBooking);
  saveDb(db);

  const log = logActivity(
    'AMENITY_BOOKED',
    `Amenity Reserved: ${amenity.name}`,
    `${newBooking.tenantName} booked ${amenity.name} for ${date} (${startTime} - ${endTime})`,
    req.user
  );

  broadcast('amenity_booked', newBooking);
  broadcast('activity_logged', log);

  res.status(201).json({
    success: true,
    booking: newBooking,
    message: `Reservation confirmed for ${amenity.name} on ${date} (${startTime} - ${endTime})!`
  });
});

// PATCH Check-in
router.patch('/bookings/:id/checkin', authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const booking = db.amenityBookings.find(b => b.id === id);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Reservation not found.' });
  }

  if (booking.status === 'Checked In') {
    return res.status(400).json({ success: false, message: 'Already checked in.' });
  }

  booking.status = 'Checked In';
  booking.checkInTime = new Date().toISOString();
  saveDb(db);

  const log = logActivity(
    'AMENITY_CHECKIN',
    `Check-in Confirmed: ${booking.amenityName}`,
    `${booking.tenantName} (${booking.unitNumber}) checked into ${booking.amenityName}`,
    req.user
  );

  broadcast('amenity_status_changed', { booking, action: 'checkin' });
  broadcast('activity_logged', log);

  res.json({ success: true, booking, message: `Successfully checked into ${booking.amenityName}!` });
});

// PATCH Check-out
router.patch('/bookings/:id/checkout', authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const booking = db.amenityBookings.find(b => b.id === id);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Reservation not found.' });
  }

  booking.status = 'Checked Out';
  booking.checkOutTime = new Date().toISOString();
  saveDb(db);

  const log = logActivity(
    'AMENITY_CHECKOUT',
    `Check-out Completed: ${booking.amenityName}`,
    `${booking.tenantName} completed check-out from ${booking.amenityName}`,
    req.user
  );

  broadcast('amenity_status_changed', { booking, action: 'checkout' });
  broadcast('activity_logged', log);

  res.json({ success: true, booking, message: `Check-out completed for ${booking.amenityName}.` });
});

// PATCH Cancel
router.patch('/bookings/:id/cancel', authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const booking = db.amenityBookings.find(b => b.id === id);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Reservation not found.' });
  }

  booking.status = 'Cancelled';
  saveDb(db);

  const log = logActivity(
    'AMENITY_CANCELLED',
    `Reservation Cancelled: ${booking.amenityName}`,
    `Reservation on ${booking.date} (${booking.startTime}-${booking.endTime}) was cancelled by ${req.user.name}`,
    req.user
  );

  broadcast('amenity_status_changed', { booking, action: 'cancel' });
  broadcast('activity_logged', log);

  res.json({ success: true, booking, message: 'Reservation cancelled.' });
});

export default router;
