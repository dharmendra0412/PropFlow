const API_BASE = '/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err.message);
    throw err;
  }
};

export const api = {
  // Real Authentication
  register: (data) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => fetchApi('/auth/me'),
  getUsers: () => fetchApi('/auth/users'),

  // Properties
  getProperties: () => fetchApi('/properties'),
  getProperty: (id) => fetchApi(`/properties/${id}`),
  createProperty: (data) => fetchApi('/properties', { method: 'POST', body: JSON.stringify(data) }),

  // Maintenance
  getMaintenance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/maintenance${query ? `?${query}` : ''}`);
  },
  createMaintenance: (data) => fetchApi('/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  updateMaintenanceStatus: (id, data) => fetchApi(`/maintenance/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  addComment: (id, data) => fetchApi(`/maintenance/${id}/comments`, { method: 'POST', body: JSON.stringify(data) }),

  // Amenities
  getAmenities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/amenities${query ? `?${query}` : ''}`);
  },
  getPresets: () => fetchApi('/amenities/presets'),
  createAmenity: (data) => fetchApi('/amenities', { method: 'POST', body: JSON.stringify(data) }),
  addPresetAmenity: (presetIndex, propertyId) => fetchApi('/amenities/preset', { method: 'POST', body: JSON.stringify({ presetIndex, propertyId }) }),
  getAmenityAvailability: (id, date) => fetchApi(`/amenities/${id}?date=${date}`),
  getBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/amenities/bookings/all${query ? `?${query}` : ''}`);
  },
  createBooking: (data) => fetchApi('/amenities/bookings', { method: 'POST', body: JSON.stringify(data) }),
  checkInBooking: (id) => fetchApi(`/amenities/bookings/${id}/checkin`, { method: 'PATCH' }),
  checkOutBooking: (id) => fetchApi(`/amenities/bookings/${id}/checkout`, { method: 'PATCH' }),
  cancelBooking: (id) => fetchApi(`/amenities/bookings/${id}/cancel`, { method: 'PATCH' }),

  // Analytics, Reports & Export
  getKPIs: () => fetchApi('/analytics/kpis'),
  getActivityLogs: () => fetchApi('/analytics/activity'),
  getTechnicians: () => fetchApi('/analytics/technicians'),
  getMaintenanceCsvUrl: () => '/api/analytics/export/maintenance.csv',
  getAmenitiesCsvUrl: () => '/api/analytics/export/amenities.csv',
};
