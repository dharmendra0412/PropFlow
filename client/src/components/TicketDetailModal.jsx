import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { api } from '../utils/api';
import {
  X,
  Clock,
  CheckCircle,
  MessageSquare,
  Send,
  Wrench,
  ShieldCheck,
} from 'lucide-react';

export const TicketDetailModal = ({ ticket, isOpen, onClose, onUpdated }) => {
  const { currentUser, isOwner } = useAuth();
  const { socket } = useSocket();
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const [commentText, setCommentText] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setCurrentTicket(ticket);
    if (ticket) {
      setResolutionNotes(ticket.resolutionNotes || '');
      setAssignedTo(ticket.assignedTo || 'Unassigned');
    }
  }, [ticket]);

  // Real-time socket room
  useEffect(() => {
    if (!socket || !ticket?.id) return;

    socket.emit('join_ticket', ticket.id);

    const handleCommentAdded = ({ ticketId, comment }) => {
      if (ticketId === ticket.id) {
        setCurrentTicket((prev) => {
          if (!prev) return prev;
          if (prev.comments.some((c) => c.id === comment.id)) return prev;
          return {
            ...prev,
            comments: [...prev.comments, comment],
          };
        });
      }
    };

    const handleTicketUpdated = (updated) => {
      if (updated.id === ticket.id) {
        setCurrentTicket(updated);
        setResolutionNotes(updated.resolutionNotes || '');
      }
    };

    socket.on('maintenance_comment_added', handleCommentAdded);
    socket.on('maintenance_updated', handleTicketUpdated);

    return () => {
      socket.emit('leave_ticket', ticket.id);
      socket.off('maintenance_comment_added', handleCommentAdded);
      socket.off('maintenance_updated', handleTicketUpdated);
    };
  }, [socket, ticket?.id]);

  if (!isOpen || !currentTicket) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      const res = await api.updateMaintenanceStatus(currentTicket.id, {
        status: newStatus,
        resolutionNotes,
        assignedTo,
      });
      setCurrentTicket(res.request);
      if (onUpdated) onUpdated();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await api.addComment(currentTicket.id, {
        message: commentText.trim(),
      });

      setCommentText('');
      setCurrentTicket((prev) => ({
        ...prev,
        comments: [...prev.comments, res.comment],
      }));
      if (onUpdated) onUpdated();
    } catch (err) {
      alert('Failed to send comment: ' + err.message);
    }
  };

  let turnaroundHours = null;
  if (currentTicket.resolvedAt) {
    const diff = new Date(currentTicket.resolvedAt).getTime() - new Date(currentTicket.createdAt).getTime();
    turnaroundHours = +(diff / (1000 * 60 * 60)).toFixed(1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-blue-600 rounded-md">
              #{currentTicket.id}
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                {currentTicket.title}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span>{currentTicket.propertyName}</span>
                <span>•</span>
                <span className="font-semibold text-slate-300">{currentTicket.unitNumber}</span>
                <span>•</span>
                <span>{currentTicket.category}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Stepper */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />

              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentTicket.status === 'Pending'
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {currentTicket.status === 'Pending' ? '1' : <CheckCircle className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-1.5">Pending</span>
                <span className="text-[10px] text-slate-400">Intake</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentTicket.status === 'In Progress'
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : currentTicket.status === 'Completed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentTicket.status === 'Completed' ? <CheckCircle className="w-4 h-4" /> : '2'}
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-1.5">In Progress</span>
                <span className="text-[10px] text-slate-400">Dispatched</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentTicket.status === 'Completed'
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentTicket.status === 'Completed' ? <CheckCircle className="w-4 h-4" /> : '3'}
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-1.5">Completed</span>
                <span className="text-[10px] text-slate-400">Resolved</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Submitted: {new Date(currentTicket.createdAt).toLocaleString()}</span>
              </div>
              {turnaroundHours !== null ? (
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">
                    Resolved in {turnaroundHours} hours ({turnaroundHours <= 48 ? 'Met ≤48h SLA' : 'Exceeded 48h SLA'})
                  </span>
                </div>
              ) : (
                <div className="text-amber-700 font-medium">
                  Resolution Target: ≤ 48 hours SLA
                </div>
              )}
            </div>
          </div>

          {/* Description & Resident info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Issue Description
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed whitespace-pre-wrap">
                {currentTicket.description}
              </p>
            </div>

            <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Priority</span>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                    currentTicket.priority === 'Emergency'
                      ? 'bg-rose-100 text-rose-800'
                      : currentTicket.priority === 'High'
                      ? 'bg-orange-100 text-orange-800'
                      : currentTicket.priority === 'Medium'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {currentTicket.priority} Priority
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Resident</span>
                <span className="font-semibold text-slate-800">{currentTicket.tenantName}</span>
                <span className="text-[11px] text-slate-500 block">{currentTicket.tenantPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Assigned Staff</span>
                <span className="font-semibold text-slate-800">{currentTicket.assignedTo || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Property Manager Action Controls */}
          {isOwner && (
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center space-x-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-600" />
                <span>Property Manager Action Center</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Assigned Technician / Contractor
                  </label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g. Master Plumber, Maintenance Staff"
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Closure Resolution Notes
                  </label>
                  <input
                    type="text"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="e.g. Replaced faulty gasket, verified no leaks"
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-semibold text-slate-600 mr-1">Update Status:</span>
                <button
                  type="button"
                  disabled={isUpdating || currentTicket.status === 'Pending'}
                  onClick={() => handleStatusChange('Pending')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 disabled:opacity-40 transition"
                >
                  Mark Pending
                </button>
                <button
                  type="button"
                  disabled={isUpdating || currentTicket.status === 'In Progress'}
                  onClick={() => handleStatusChange('In Progress')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100 disabled:opacity-40 transition"
                >
                  Set In Progress
                </button>
                <button
                  type="button"
                  disabled={isUpdating || currentTicket.status === 'Completed'}
                  onClick={() => handleStatusChange('Completed')}
                  className="px-3 py-1 text-xs font-bold rounded-lg border border-emerald-400 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 shadow-xs transition"
                >
                  ✓ Complete & Close Ticket
                </button>
              </div>
            </div>
          )}

          {/* Threaded Discussion */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Real-Time Discussion ({currentTicket.comments?.length || 0})</span>
            </h4>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {currentTicket.comments?.map((c) => {
                const isStaff = c.senderRole === 'owner' || c.senderRole === 'manager';
                return (
                  <div
                    key={c.id}
                    className={`p-3 rounded-xl text-xs ${
                      isStaff
                        ? 'bg-blue-50/80 border border-blue-100 text-slate-800 ml-4'
                        : 'bg-slate-100 border border-slate-200/70 text-slate-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900">{c.senderName}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                            isStaff ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isStaff ? 'Management' : 'Resident'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{c.message}</p>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAddComment} className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type a real-time message..."
                className="flex-1 text-xs px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-40 transition flex items-center space-x-1 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
