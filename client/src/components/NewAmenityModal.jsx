import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  Sparkles,
  Clock,
  Users,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  FileText,
} from 'lucide-react';

export const NewAmenityModal = ({ isOpen, onClose, onSuccess, propertyId }) => {
  const [tab, setTab] = useState('presets'); // 'presets' | 'custom'
  const [presets, setPresets] = useState([]);
  const [loadingPresets, setLoadingPresets] = useState(false);

  // Custom form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Recreation');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(15);
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [slotDuration, setSlotDuration] = useState(60);
  const [rules, setRules] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoadingPresets(true);
      api.getPresets()
        .then((res) => {
          if (res.success) setPresets(res.presets || []);
        })
        .catch(console.error)
        .finally(() => setLoadingPresets(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddPreset = async (index) => {
    try {
      setSubmitting(true);
      setError('');
      await api.addPresetAmenity(index, propertyId);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add preset amenity.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCustom = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Amenity name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const parsedRules = rules
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      await api.createAmenity({
        propertyId,
        name: name.trim(),
        category,
        description: description.trim(),
        capacity: Number(capacity) || 10,
        openTime,
        closeTime,
        slotDuration: Number(slotDuration) || 60,
        rules: parsedRules,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create amenity.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Add Building Amenity</h3>
              <p className="text-xs text-slate-300">Set up reservable facilities for residents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => setTab('presets')}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
              tab === 'presets'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Facility Presets
          </button>
          <button
            type="button"
            onClick={() => setTab('custom')}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
              tab === 'custom'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Custom Facility
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'presets' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Select a standard amenity preset with preconfigured operating hours and rules:
              </p>

              {loadingPresets ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading presets...</div>
              ) : (
                presets.map((p, idx) => (
                  <div
                    key={p.name}
                    className="p-3.5 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-800">{p.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{p.description}</p>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-1.5">
                        <span>Hours: {p.openTime} - {p.closeTime}</span>
                        <span>•</span>
                        <span>Capacity: {p.capacity} persons</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleAddPreset(idx)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shrink-0 transition"
                    >
                      + Add
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amenity Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rooftop Terrace, Yoga Studio, Private Theater"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Fitness, Social, Business"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maximum Capacity (Persons)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Slot Duration (Min)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the facility..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Community Rules (One rule per line)
                </label>
                <textarea
                  rows={3}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="e.g.&#10;Quiet hours start at 10 PM&#10;No outside amplified speakers&#10;Clean tables after use"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

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
                  {submitting ? 'Saving...' : 'Create Facility'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

