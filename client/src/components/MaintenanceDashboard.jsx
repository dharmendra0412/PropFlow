import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  Search,
  Plus,
  Clock,
  ChevronRight,
  User,
  MessageSquare,
} from 'lucide-react';

export const MaintenanceDashboard = ({
  requests = [],
  onOpenNewTicket,
  onSelectTicket,
}) => {
  const { currentUser, isOwner } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredRequests = requests.filter((r) => {
    // If tenant, only show their own tickets
    if (!isOwner && r.tenantId !== currentUser?.id) {
      return false;
    }

    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All' || r.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'All' || r.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Maintenance Operations</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800">
              {filteredRequests.length} {filteredRequests.length === 1 ? 'ticket' : 'tickets'}
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            {isOwner
              ? 'Real-time dispatching, status progression, and SLA tracking'
              : 'Submit repair requests and track progress in real time'}
          </p>
        </div>

        <button
          onClick={onOpenNewTicket}
          className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Maintenance Request</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, unit, issue..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed / Resolved</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="Emergency">🚨 Emergency</option>
              <option value="High">High Urgency</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC & Climate</option>
              <option value="Electrical">Electrical</option>
              <option value="Appliance">Appliance</option>
              <option value="Structural">Structural</option>
              <option value="General">General Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List View / Empty State */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {isOwner ? 'No Maintenance Requests Active' : 'No Repair Tickets Filed'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {isOwner
              ? 'There are currently zero open work orders for your property. When residents file maintenance requests, they will appear here in real time.'
              : 'Your residence is running smoothly! If you ever encounter an issue with plumbing, electricity, HVAC, or appliances, submit a ticket below.'}
          </p>
          <button
            onClick={onOpenNewTicket}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
          >
            Submit New Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredRequests.map((req) => {
            const isCompleted = req.status === 'Completed';
            const isInProgress = req.status === 'In Progress';

            return (
              <div
                key={req.id}
                onClick={() => onSelectTicket(req)}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      #{req.id}
                    </span>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {req.unitNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.priority === 'Emergency'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : req.priority === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : req.priority === 'Medium'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {req.priority}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      {req.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                    {req.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {req.description}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{req.tenantName}</span>
                    </div>
                    {req.comments?.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1 text-blue-600 font-medium">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{req.comments.length}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : isInProgress
                            ? 'bg-blue-500 animate-ping'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span>{req.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {req.assignedTo || 'Unassigned'}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
