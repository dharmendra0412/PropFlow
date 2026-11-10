import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  LogIn,
  LogOut,
  ShieldCheck,
  Plus,
  Sparkles,
} from 'lucide-react';

export const AmenityDashboard = ({
  amenities = [],
  bookings = [],
  onBookAmenity,
  onOpenNewAmenity,
  onRefresh,
}) => {
  const { currentUser, isOwner } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('browse');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [processingId, setProcessingId] = useState(null);

  const handleCheckIn = async (bookingId) => {
    try {
      setProcessingId(bookingId);
      await api.checkInBooking(bookingId);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Check-in error: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      setProcessingId(bookingId);
      await api.checkOutBooking(bookingId);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Check-out error: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (bookingId) => {
    if (confirm('Are you sure you want to cancel this amenity reservation?')) {
      try {
        setProcessingId(bookingId);
        await api.cancelBooking(bookingId);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert('Cancel error: ' + err.message);
      } finally {
        setProcessingId(null);
      }
    }
  };

  const myBookings = bookings.filter((b) => b.tenantId === currentUser?.id);
  const dayBookings = bookings.filter((b) => b.date === selectedDate && b.status !== 'Cancelled');

  return (
    <div className="space-y-5">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Amenity & Facility Hub</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-800 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Zero-Conflict Guarantee</span>
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time conflict-prevention scheduling with check-in and check-out tracking
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isOwner && (
            <button
              onClick={onOpenNewAmenity}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Facility</span>
            </button>
          )}

          <div className="flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveSubTab('browse')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeSubTab === 'browse'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Facilities ({amenities.length})
            </button>
            <button
              onClick={() => setActiveSubTab('schedule')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeSubTab === 'schedule'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Schedule
            </button>
            <button
              onClick={() => setActiveSubTab('my-bookings')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeSubTab === 'my-bookings'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isOwner ? 'All Bookings' : 'My Bookings'} ({isOwner ? bookings.length : myBookings.length})
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Facilities List */}
      {activeSubTab === 'browse' && (
        <>
          {amenities.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Facilities Available Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {isOwner
                  ? 'You have not added any amenities to this property yet. Use our popular presets (Gym, Pool, Clubhouse, Conference Room) or create a custom one.'
                  : 'The property manager has not yet published any facilities for this building.'}
              </p>
              {isOwner && (
                <button
                  onClick={onOpenNewAmenity}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                >
                  + Add Building Facility
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {amenity.category}
                      </span>
                      <span className="text-xs font-medium text-slate-500 flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Up to {amenity.capacity} people</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {amenity.name}
                    </h3>
                    {amenity.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {amenity.description}
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{amenity.openTime} - {amenity.closeTime}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Max {amenity.slotDuration} min slots</span>
                      </div>
                    </div>

                    {amenity.rules?.length > 0 && (
                      <div className="mt-3 pt-2 text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-600">Rules: </span>
                        <span>{amenity.rules.slice(0, 2).join(' • ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-emerald-600 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Available</span>
                    </div>

                    <button
                      onClick={() => onBookAmenity(amenity)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                    >
                      Reserve Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Subtab 2: Daily Schedule View */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Daily Facility Schedule</h3>
              <p className="text-xs text-slate-500">Live booking timelines across all property facilities</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-600">Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>
          </div>

          {amenities.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No facilities registered yet.</div>
          ) : (
            <div className="space-y-4">
              {amenities.map((amenity) => {
                const amenityDayBookings = dayBookings.filter((b) => b.amenityId === amenity.id);
                return (
                  <div key={amenity.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-800">{amenity.name}</span>
                        <span className="text-[10px] text-slate-400">({amenity.openTime} - {amenity.closeTime})</span>
                      </div>
                      <button
                        onClick={() => onBookAmenity(amenity)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        + Book
                      </button>
                    </div>

                    {amenityDayBookings.length === 0 ? (
                      <div className="text-xs text-slate-400 italic py-1">
                        All time slots are open and available on this date.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {amenityDayBookings.map((b) => (
                          <div
                            key={b.id}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs shadow-2xs flex items-center space-x-2"
                          >
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-bold text-slate-800">{b.startTime} - {b.endTime}</span>
                            <span className="text-slate-500 text-[11px]">({b.tenantName} • {b.unitNumber})</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                                b.status === 'Checked In'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Subtab 3: Master Reservations & Live Check-in / Check-out Tracker */}
      {activeSubTab === 'my-bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {isOwner ? 'Master Facility Bookings' : 'My Reservations'}
              </h3>
              <p className="text-xs text-slate-500">
                Check-in on arrival and check-out on departure to verify building space utilization
              </p>
            </div>
          </div>

          {(isOwner ? bookings : myBookings).length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">No reservations found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(isOwner ? bookings : myBookings).map((booking) => {
                const isConfirmed = booking.status === 'Confirmed';
                const isCheckedIn = booking.status === 'Checked In';
                const isCheckedOut = booking.status === 'Checked Out';
                const isCancelled = booking.status === 'Cancelled';

                return (
                  <div
                    key={booking.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          #{booking.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{booking.amenityName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCheckedIn
                              ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                              : isConfirmed
                              ? 'bg-blue-100 text-blue-800'
                              : isCheckedOut
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{booking.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.guestCount} guests ({booking.tenantName} • {booking.unitNumber})</span>
                        </div>
                      </div>

                      {booking.purpose && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          "{booking.purpose}"
                        </p>
                      )}

                      {booking.checkInTime && (
                        <p className="text-[10px] text-emerald-600 mt-0.5 font-medium">
                          Checked In at {new Date(booking.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {booking.checkOutTime && ` • Checked Out at ${new Date(booking.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      {isConfirmed && (
                        <>
                          <button
                            type="button"
                            disabled={processingId === booking.id}
                            onClick={() => handleCheckIn(booking.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition flex items-center space-x-1"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Check-In</span>
                          </button>

                          <button
                            type="button"
                            disabled={processingId === booking.id}
                            onClick={() => handleCancel(booking.id)}
                            className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-semibold rounded-lg transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {isCheckedIn && (
                        <button
                          type="button"
                          disabled={processingId === booking.id}
                          onClick={() => handleCheckOut(booking.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition flex items-center space-x-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check-Out</span>
                        </button>
                      )}

                      {(isCheckedOut || isCancelled) && (
                        <span className="text-xs text-slate-400 font-medium">Completed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
