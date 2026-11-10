import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  X,
  Calendar,
  Clock,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const BookAmenityModal = ({ amenity, isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [guestCount, setGuestCount] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [existingBookings, setExistingBookings] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [conflictWarning, setConflictWarning] = useState(null);

  useEffect(() => {
    if (!isOpen || !amenity) return;

    const fetchDaySchedule = async () => {
      try {
        setLoadingSchedule(true);
        const res = await api.getAmenityAvailability(amenity.id, date);
        if (res.success) {
          setExistingBookings(res.activeBookings || []);
        }
      } catch (err) {
        console.error('Error fetching amenity availability:', err);
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchDaySchedule();
  }, [isOpen, amenity, date]);

  useEffect(() => {
    if (!existingBookings || existingBookings.length === 0) {
      setConflictWarning(null);
      return;
    }

    const conflict = existingBookings.find((b) => {
      return startTime < b.endTime && b.startTime < endTime;
    });

    if (conflict) {
      setConflictWarning(
        `Collision: Already reserved by ${conflict.tenantName} (${conflict.unitNumber}) from ${conflict.startTime} to ${conflict.endTime}. Please pick another slot.`
      );
    } else {
      setConflictWarning(null);
    }
  }, [startTime, endTime, existingBookings]);

  if (!isOpen || !amenity) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (startTime >= endTime) {
      setErrorMessage('Check-out end time must be after check-in start time.');
      return;
    }

    if (conflictWarning) {
      setErrorMessage(conflictWarning);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      await api.createBooking({
        amenityId: amenity.id,
        date,
        startTime,
        endTime,
        guestCount: Number(guestCount) || 1,
        purpose: purpose.trim() || 'Resident Recreation',
      });

      onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shrink-0 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
              {amenity.category || 'Facility'}
            </span>
            <h3 className="text-base font-bold text-white mt-1 leading-tight">{amenity.name}</h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Hours: {amenity.openTime} - {amenity.closeTime} • Max {amenity.capacity} guests
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {conflictWarning && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Collision Prevention Engine</strong>
                <span>{conflictWarning}</span>
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reservation Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Active Bookings on this date */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Existing Bookings on {date}</span>
            </div>
            {loadingSchedule ? (
              <div className="text-xs text-slate-400 py-1">Checking availability...</div>
            ) : existingBookings.length === 0 ? (
              <div className="text-xs text-emerald-700 py-1 font-medium flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All time slots are open and available on this date!</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {existingBookings.map((b) => (
                  <span
                    key={b.id}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200"
                  >
                    <Clock className="w-3 h-3 text-rose-500" />
                    <span>{b.startTime} - {b.endTime}</span>
                    <span className="text-[10px] text-rose-600 font-normal">({b.tenantName})</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Time Interval Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Check-in Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Check-out End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Number of Attendees (Capacity: {amenity.capacity} max)
            </label>
            <input
              type="number"
              min="1"
              max={amenity.capacity}
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Purpose / Notes (Optional)
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Family gathering, study session, workout"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rules */}
          {amenity.rules?.length > 0 && (
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-0.5">Facility Guidelines:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                {amenity.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !!conflictWarning}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 disabled:opacity-50 transition"
            >
              {submitting ? 'Confirming...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
