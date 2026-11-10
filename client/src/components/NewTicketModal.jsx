import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  X,
  Wrench,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const NewTicketModal = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser, selectedProperty } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [unitNumber, setUnitNumber] = useState(currentUser?.unitNumber || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = [
    { name: 'Plumbing', icon: '🚰' },
    { name: 'HVAC', icon: '❄️' },
    { name: 'Electrical', icon: '⚡' },
    { name: 'Appliance', icon: '🍳' },
    { name: 'Structural', icon: '🚪' },
    { name: 'General', icon: '🔧' },
  ];

  const priorities = [
    { level: 'Low', color: 'border-slate-300 text-slate-700 hover:border-slate-400' },
    { level: 'Medium', color: 'border-blue-400 text-blue-700 bg-blue-50/50' },
    { level: 'High', color: 'border-orange-400 text-orange-700 bg-orange-50/50' },
    { level: 'Emergency', color: 'border-rose-500 text-rose-700 bg-rose-50 font-bold' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a title and detailed issue description.');
      return;
    }

    if (!unitNumber.trim()) {
      setError('Please enter your unit or apartment number.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await api.createMaintenance({
        propertyId: selectedProperty?.id,
        unitNumber: unitNumber.trim(),
        title: title.trim(),
        category,
        priority,
        description: description.trim(),
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit maintenance request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">New Maintenance Request</h3>
              <p className="text-xs text-blue-100">
                {selectedProperty ? selectedProperty.name : 'Real Property Work Order'} • Real-Time Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Unit Number & Tenant */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit / Apartment Number
              </label>
              <input
                type="text"
                required
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Unit 4B"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requested By
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.name || 'Logged-In Resident'}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Issue Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Service Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition ${
                    category === cat.name
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-base mb-0.5">{cat.icon}</div>
                  <div className="font-semibold">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Urgency Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  key={p.level}
                  type="button"
                  onClick={() => setPriority(p.level)}
                  className={`p-2 rounded-xl text-center border text-xs transition ${
                    priority === p.level
                      ? `${p.color} ring-2 ring-offset-1 ring-blue-500 font-bold shadow-xs`
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold">{p.level}</div>
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
              <Info className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Target resolution SLA: ≤ 48 hours. Emergency repairs dispatched with priority.</span>
            </div>
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issue Summary
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kitchen sink faucet leaking under counter"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, exact location, when it started, and if emergency shutoff was used..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 disabled:opacity-50 transition"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
