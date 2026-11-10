import React from 'react';
import {
  Wrench,
  Calendar,
  LogIn,
  LogOut,
  RefreshCw,
  Bell,
  CheckCircle,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export const ActivityFeed = ({ activities = [], onRefresh }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'MAINTENANCE_CREATED':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'STATUS_UPDATED':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'AMENITY_BOOKED':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'AMENITY_CHECKIN':
        return <LogIn className="w-4 h-4 text-emerald-600" />;
      case 'AMENITY_CHECKOUT':
        return <LogOut className="w-4 h-4 text-slate-600" />;
      default:
        return <Bell className="w-4 h-4 text-amber-600" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'MAINTENANCE_CREATED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'STATUS_UPDATED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'AMENITY_BOOKED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'AMENITY_CHECKIN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'AMENITY_CHECKOUT':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <span>Real-Time Audit & Event Stream</span>
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Listening</span>
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Immutable log of all maintenance dispatches, state updates, and facility check-ins
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          No recorded events yet. Submit a request or booking to see live audit logs.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 flex items-start space-x-3 text-xs hover:bg-slate-50 transition"
            >
              <div className="p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs mt-0.5 shrink-0">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-slate-900">{act.title}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{act.description}</p>
                <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400">
                  <span>Triggered by: <strong className="text-slate-600">{act.userName}</strong></span>
                  <span>•</span>
                  <span>ID: <code className="font-mono text-slate-500">{act.id}</code></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

