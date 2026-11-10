import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Wrench,
  Calendar,
  CheckCircle,
  ArrowRight,
  Shield,
  Building,
} from 'lucide-react';

export const TenantOverview = ({
  myRequests = [],
  myBookings = [],
  onOpenNewTicket,
  onOpenBookAmenity,
  onSelectTicket,
  onNavigateTab,
}) => {
  const { currentUser, selectedProperty } = useAuth();

  const activeTickets = myRequests.filter((r) => r.status !== 'Completed');
  const upcomingBookings = myBookings.filter((b) => ['Confirmed', 'Checked In'].includes(b.status));

  return (
    <div className="space-y-6">
      {/* Resident Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md text-blue-200 text-xs font-semibold mb-3">
            <Home className="w-3.5 h-3.5" />
            <span>
              {selectedProperty ? selectedProperty.name : 'Resident Portal'}
              {currentUser?.unitNumber ? ` • ${currentUser.unitNumber}` : ''}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Resident'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Submit maintenance repair requests with real-time status updates and reserve building facilities with conflict-free scheduling.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={onOpenNewTicket}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center space-x-1.5"
            >
              <Wrench className="w-4 h-4" />
              <span>Submit Repair Request</span>
            </button>
            <button
              onClick={() => onNavigateTab('amenities')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition backdrop-blur-md flex items-center space-x-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Browse Facilities</span>
            </button>
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Active Maintenance Tickets */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Maintenance
              </span>
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Wrench className="w-4 h-4" />
              </span>
            </div>

            <div className="text-2xl font-extrabold text-slate-900 mb-1">
              {activeTickets.length} {activeTickets.length === 1 ? 'Request' : 'Requests'}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {activeTickets.length === 0
                ? 'No active repair requests. Click below to file one.'
                : 'Technicians tracking in real time'}
            </p>

            {activeTickets.length > 0 && (
              <div className="space-y-2 mb-4">
                {activeTickets.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTicket(t)}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs hover:border-blue-300 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="truncate max-w-[160px]">{t.title}</span>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Priority: {t.priority} • {t.assignedTo || 'Unassigned'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('maintenance')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 pt-3 border-t border-slate-100"
          >
            <span>View All Maintenance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Upcoming Amenity Reservations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Facility Bookings
              </span>
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Calendar className="w-4 h-4" />
              </span>
            </div>

            <div className="text-2xl font-extrabold text-slate-900 mb-1">
              {upcomingBookings.length} {upcomingBookings.length === 1 ? 'Booking' : 'Bookings'}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {upcomingBookings.length === 0
                ? 'No active facility reservations'
                : 'Check-in available during your reserved slot'}
            </p>

            {upcomingBookings.length > 0 && (
              <div className="space-y-2 mb-4">
                {upcomingBookings.slice(0, 2).map((b) => (
                  <div
                    key={b.id}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="truncate max-w-[150px]">{b.amenityName}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          b.status === 'Checked In'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {b.date} • {b.startTime} - {b.endTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('amenities')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 pt-3 border-t border-slate-100"
          >
            <span>Amenity Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Resident Info & Property Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Property Details
              </span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Building className="w-4 h-4" />
              </span>
            </div>

            <div className="text-sm font-bold text-slate-800 mb-1">
              {selectedProperty ? selectedProperty.name : 'Real Estate Complex'}
            </div>
            <div className="text-xs text-slate-500 mb-3">
              {selectedProperty?.address || 'Community Facility'}
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Unit Number:</span>
                <span className="font-semibold text-slate-700">
                  {currentUser?.unitNumber || 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Resident Email:</span>
                <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                  {currentUser?.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Account Type:</span>
                <span className="font-semibold text-emerald-600">Verified Tenant</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1.5 pt-3 border-t border-slate-100">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Real-Time Sync Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
