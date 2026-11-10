import express from 'express';
import { getDb, saveDb, logActivity } from '../db.js';
import { broadcast, emitToRoom } from '../socket.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET all maintenance requests with optional filters
router.get('/', optionalAuthMiddleware, (req, res) => {
  const db = getDb();
  let items = [...db.maintenanceRequests];
  const { propertyId, tenantId, status, priority, category } = req.query;

  if (propertyId) items = items.filter(r => r.propertyId === propertyId);
  if (tenantId) items = items.filter(r => r.tenantId === tenantId);
  if (status && status !== 'All') {
    items = items.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }
  if (priority && priority !== 'All') {
    items = items.filter(r => r.priority.toLowerCase() === priority.toLowerCase());
  }
  if (category && category !== 'All') {
    items = items.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, count: items.length, requests: items });
});

// GET single request by ID
router.get('/:id', optionalAuthMiddleware, (req, res) => {
  const db = getDb();
  const request = db.maintenanceRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ success: false, message: 'Maintenance request not found.' });
  }
  res.json({ success: true, request });
});

// POST create real maintenance request
router.post('/', authMiddleware, (req, res) => {
  const {
    propertyId,
    unitNumber,
    title,
    category,
    priority = 'Medium',
    description
  } = req.body;

  if (!title || !title.trim() || !description || !description.trim()) {
    return res.status(400).json({ success: false, message: 'Title and detailed issue description are required.' });
  }

  const db = getDb();
  const resolvedPropertyId = propertyId || req.user.propertyId || (db.properties[0] ? db.properties[0].id : 'PROP-01');
  const property = db.properties.find(p => p.id === resolvedPropertyId);

  const nextNumber = db.maintenanceRequests.length + 1001;
  const newId = `REQ-${nextNumber}`;

  const newRequest = {
    id: newId,
    propertyId: resolvedPropertyId,
    propertyName: property ? property.name : 'Community Property',
    unitNumber: unitNumber || req.user.unitNumber || 'Unit 1A',
    tenantId: req.user.id,
    tenantName: req.user.name,
    tenantPhone: req.user.phone || 'N/A',
    title: title.trim(),
    category: category || 'General',
    priority: priority || 'Medium',
    status: 'Pending',
    assignedTo: 'Unassigned',
    description: description.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedAt: null,
    resolutionNotes: '',
    comments: [
      {
        id: `CMT-${Date.now().toString(36)}`,
        senderId: req.user.id,
        senderName: req.user.name,
        senderRole: req.user.role,
        message: 'Maintenance ticket created.',
        timestamp: new Date().toISOString()
      }
    ]
  };

  db.maintenanceRequests.unshift(newRequest);
  saveDb(db);

  const log = logActivity(
    'MAINTENANCE_CREATED',
    `New Ticket Filed: #${newId}`,
    `${newRequest.tenantName} (${newRequest.unitNumber}) requested [${newRequest.priority}] ${newRequest.title}`,
    req.user
  );

  broadcast('maintenance_created', newRequest);
  broadcast('activity_logged', log);

  res.status(201).json({ success: true, request: newRequest });
});

// PATCH update status & resolution notes & assignment (Managers/Owners)
router.patch('/:id/status', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status, resolutionNotes, assignedTo } = req.body;

  const validStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const db = getDb();
  const reqIndex = db.maintenanceRequests.findIndex(r => r.id === id);
  if (reqIndex === -1) {
    return res.status(404).json({ success: false, message: 'Maintenance request not found.' });
  }

  const oldItem = db.maintenanceRequests[reqIndex];
  const oldStatus = oldItem.status;

  const updatedItem = {
    ...oldItem,
    status: status || oldItem.status,
    resolutionNotes: resolutionNotes !== undefined ? resolutionNotes : oldItem.resolutionNotes,
    assignedTo: assignedTo !== undefined ? assignedTo : oldItem.assignedTo,
    updatedAt: new Date().toISOString()
  };

  if (status === 'Completed' && !updatedItem.resolvedAt) {
    updatedItem.resolvedAt = new Date().toISOString();
  } else if (status && status !== 'Completed') {
    updatedItem.resolvedAt = null;
  }

  if (status && status !== oldStatus) {
    updatedItem.comments.push({
      id: `CMT-${Date.now().toString(36)}`,
      senderId: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message: `Status updated from "${oldStatus}" to "${status}".${resolutionNotes ? ` Resolution: ${resolutionNotes}` : ''}`,
      timestamp: new Date().toISOString()
    });
  }

  db.maintenanceRequests[reqIndex] = updatedItem;
  saveDb(db);

  const log = logActivity(
    'STATUS_UPDATED',
    `Ticket #${id} is now ${updatedItem.status}`,
    `${req.user.name} changed status of #${id} (${updatedItem.unitNumber}) to "${updatedItem.status}"`,
    req.user
  );

  broadcast('maintenance_updated', updatedItem);
  emitToRoom(`ticket:${id}`, 'ticket_updated', updatedItem);
  broadcast('activity_logged', log);

  res.json({ success: true, request: updatedItem });
});

// POST add comment / discussion message
router.post('/:id/comments', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message text is required.' });
  }

  const db = getDb();
  const reqIndex = db.maintenanceRequests.findIndex(r => r.id === id);
  if (reqIndex === -1) {
    return res.status(404).json({ success: false, message: 'Maintenance request not found.' });
  }

  const newComment = {
    id: `CMT-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    senderId: req.user.id,
    senderName: req.user.name,
    senderRole: req.user.role,
    message: message.trim(),
    timestamp: new Date().toISOString()
  };

  db.maintenanceRequests[reqIndex].comments.push(newComment);
  db.maintenanceRequests[reqIndex].updatedAt = new Date().toISOString();
  saveDb(db);

  broadcast('maintenance_comment_added', { ticketId: id, comment: newComment });
  emitToRoom(`ticket:${id}`, 'new_comment', newComment);

  res.status(201).json({ success: true, comment: newComment });
});

export default router;
