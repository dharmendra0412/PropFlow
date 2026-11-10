import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  FileText,
  Download,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Wrench,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const AdminReportsDashboard = () => {
  const [scorecards, setScorecards] = useState([]);
  const [kpiData, setKpiData] = useState(null);
  const [counts, setCounts] = useState(null);
  const [breakdowns, setBreakdowns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [techRes, kpiRes] = await Promise.all([
        api.getTechnicians(),
        api.getKPIs(),
      ]);
      if (techRes.success) setScorecards(techRes.scorecards || []);
      if (kpiRes.success) {
        setKpiData(kpiRes.kpis);
        setCounts(kpiRes.counts);
        setBreakdowns(kpiRes.breakdowns);
      }
    } catch (err) {
      console.error('Failed to load admin report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const handleDownload = (type, url, filename) => {
    setDownloading(type);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(null), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Operational Reporting & Admin Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Export verified CSV audit reports and evaluate technician turnaround performance against operational SLA targets.
          </p>
        </div>

        <button
          onClick={loadReportData}
          disabled={loading}
          className="flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* 1-Click Export Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Maintenance SLA Export Card */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                Work Order Telemetry
              </span>
              <Wrench className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Maintenance SLA & Turnaround Log
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full export including ticket ID, unit number, tenant details, reported issue, priority, technician notes, and exact turnaround duration calculated against the ≤ 48-hour SLA benchmark.
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center justify-between text-slate-300">
            <span>Total Recorded Tickets:</span>
            <span className="font-mono font-bold text-white">{counts?.totalRequests || 0}</span>
          </div>

          <button
            onClick={() =>
              handleDownload(
                'maintenance',
                api.getMaintenanceCsvUrl(),
                'propflow-maintenance-sla-report.csv'
              )
            }
            disabled={downloading === 'maintenance'}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25"
          >
            <Download className="w-4 h-4" />
            <span>
              {downloading === 'maintenance'
                ? 'Generating CSV...'
                : 'Download Maintenance Report (.CSV)'}
            </span>
          </button>
        </div>

        {/* Amenity Utilization Export Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                Facility Intelligence
              </span>
              <Calendar className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Amenity Utilization & Attendance Log
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detailed audit trail of all facility reservations with exact date intervals, guest attendance, 1-click arrival check-in timestamps, and departure check-out logs.
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center justify-between text-slate-300">
            <span>Total Recorded Bookings:</span>
            <span className="font-mono font-bold text-white">{counts?.totalBookings || 0}</span>
          </div>

          <button
            onClick={() =>
              handleDownload(
                'amenities',
                api.getAmenitiesCsvUrl(),
                'propflow-amenity-utilization-report.csv'
              )
            }
            disabled={downloading === 'amenities'}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/25"
          >
            <Download className="w-4 h-4" />
            <span>
              {downloading === 'amenities'
                ? 'Generating CSV...'
                : 'Download Amenity Report (.CSV)'}
            </span>
          </button>
        </div>
      </div>

      {/* Technician Scorecard Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Technician Turnaround Scorecard</span>
            </h3>
            <p className="text-xs text-slate-500">
              Measure maintenance efficiency and resolution times per assigned staff member against the ≤ 48-hour SLA
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {scorecards.length} {scorecards.length === 1 ? 'member' : 'members'} tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Assigned Technician</th>
                <th className="py-2.5 px-3">Total Assigned</th>
                <th className="py-2.5 px-3">In Progress</th>
                <th className="py-2.5 px-3">Completed</th>
                <th className="py-2.5 px-3">Avg Turnaround</th>
                <th className="py-2.5 px-3">SLA Compliance Rate</th>
                <th className="py-2.5 px-3 rounded-r-lg">Performance Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scorecards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    No assigned technician records yet. Assign technicians to tickets to populate this scorecard.
                  </td>
                </tr>
              ) : (
                scorecards.map((tech, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {tech.name}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {tech.totalAssigned}
                    </td>
                    <td className="py-3 px-3 text-amber-600 font-semibold">
                      {tech.inProgress}
                    </td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">
                      {tech.completed}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {tech.avgResolutionHours !== null
                        ? `${tech.avgResolutionHours}h`
                        : '—'}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-800">
                          {tech.slaCompliancePct}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (Target ≤ 48h)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          tech.performanceTier.includes('Top')
                            ? 'bg-emerald-100 text-emerald-800'
                            : tech.performanceTier.includes('Track')
                            ? 'bg-blue-100 text-blue-800'
                            : tech.performanceTier.includes('Awaiting')
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tech.performanceTier}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preventative Maintenance Advisory Insights */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Preventative Diagnostic & Category Breakdown
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            Operational Health: Normal
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {Object.entries(breakdowns?.category || {}).length === 0 ? (
            <div className="col-span-4 text-xs text-slate-400 py-3 text-center">
              Submit maintenance tickets to view live category diagnostics.
            </div>
          ) : (
            Object.entries(breakdowns?.category || {}).map(([cat, cnt]) => (
              <div
                key={cat}
                className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60"
              >
                <div className="text-[11px] font-medium text-slate-500">{cat}</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">{cnt}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {cnt >= 5
                    ? '⚠️ Advisory: Schedule preventative inspection'
                    : '✓ Within safe operational tolerance'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

