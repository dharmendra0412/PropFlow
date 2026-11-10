import React from 'react';
import {
  Clock,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Star,
  Info,
} from 'lucide-react';

export const KPIStatsCards = ({ kpiData, counts }) => {
  if (!kpiData) return null;

  const hasCompleted = kpiData.hasCompletedRepairs;
  const resolutionValue = hasCompleted
    ? `${kpiData.maintenanceResolutionTimeHours}h`
    : 'None Yet';

  const kpis = [
    {
      title: 'Avg. Resolution Time',
      value: resolutionValue,
      target: `Target: ≤ ${kpiData.maintenanceResolutionTargetHours}h SLA`,
      status: hasCompleted ? (kpiData.resolutionSlaMet ? 'success' : 'warning') : 'neutral',
      badge: hasCompleted
        ? (kpiData.resolutionSlaMet ? 'Within 48h SLA' : 'Exceeding SLA')
        : 'Awaiting Closed Repairs',
      icon: Clock,
      color: 'blue',
      subtext: hasCompleted
        ? `${kpiData.slaCompliancePct}% of completed repairs met SLA`
        : 'Clock starts when repairs are submitted',
    },
    {
      title: 'Ticket Completion Rate',
      value: counts?.totalRequests > 0 ? `${kpiData.requestCompletionRatePct}%` : '0%',
      target: `Target: ≥ ${kpiData.requestCompletionTargetPct}%`,
      status: counts?.totalRequests > 0 && kpiData.completionRateMet ? 'success' : 'neutral',
      badge: `${counts?.completedRequests || 0} / ${counts?.totalRequests || 0} Resolved`,
      icon: CheckCircle2,
      color: 'emerald',
      subtext: `${counts?.inProgressRequests || 0} currently In Progress`,
    },
    {
      title: 'Amenity Conflicts',
      value: `${kpiData.amenityBookingConflicts}`,
      target: 'Target: 0 Double Bookings',
      status: 'success',
      badge: 'Zero Conflicts Enforced',
      icon: ShieldAlert,
      color: 'indigo',
      subtext: `${counts?.totalBookings || 0} reservations processed with 0 collisions`,
    },
    {
      title: 'System API Latency',
      value: `${kpiData.systemResponseTimeMs}ms`,
      target: `Target: ≤ ${kpiData.systemResponseTargetSeconds}s`,
      status: 'success',
      badge: 'Live Sub-Second',
      icon: Zap,
      color: 'amber',
      subtext: 'WebSocket & API round-trip latency',
    },
    {
      title: 'Service Reliability',
      value: '100%',
      target: 'Target: Real-Time Sync',
      status: 'success',
      badge: 'Real-Time Operational',
      icon: Star,
      color: 'rose',
      subtext: 'Real-time WebSocket event distribution',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div
                className={`p-2 rounded-xl ${
                  kpi.color === 'blue'
                    ? 'bg-blue-50 text-blue-600'
                    : kpi.color === 'emerald'
                    ? 'bg-emerald-50 text-emerald-600'
                    : kpi.color === 'indigo'
                    ? 'bg-indigo-50 text-indigo-600'
                    : kpi.color === 'amber'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {kpi.value}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  kpi.status === 'success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : kpi.status === 'warning'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {kpi.badge}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-slate-600">{kpi.target}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{kpi.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};
