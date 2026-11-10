import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useSocket } from './context/SocketContext';
import { api } from './utils/api';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { KPIStatsCards } from './components/KPIStatsCards';
import { MaintenanceDashboard } from './components/MaintenanceDashboard';
import { NewTicketModal } from './components/NewTicketModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { AmenityDashboard } from './components/AmenityDashboard';
import { BookAmenityModal } from './components/BookAmenityModal';
import { NewPropertyModal } from './components/NewPropertyModal';
import { NewAmenityModal } from './components/NewAmenityModal';
import { ActivityFeed } from './components/ActivityFeed';
import { TenantOverview } from './components/TenantOverview';
import { LandingView } from './components/LandingView';
import { AdminReportsDashboard } from './components/AdminReportsDashboard';
import {
  Building2,
  Wrench,
  Calendar,
  LogIn,
  UserPlus,
  ShieldCheck,
  Zap,
  FileText,
} from 'lucide-react';

export default function App() {
  const {
    currentUser,
    isOwner,
    selectedProperty,
    refreshProperties,
    loading: authLoading,
    showAuthModal,
    setShowAuthModal,
  } = useAuth();
  const { socket } = useSocket();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState(isOwner ? 'dashboard' : 'tenant-home');

  // Application real-world data
  const [requests, setRequests] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [kpiData, setKpiData] = useState(null);
  const [counts, setCounts] = useState(null);
  const [breakdowns, setBreakdowns] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [bookingAmenity, setBookingAmenity] = useState(null);
  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);
  const [isNewAmenityOpen, setIsNewAmenityOpen] = useState(false);

  useEffect(() => {
    if (isOwner) {
      if (activeTab === 'tenant-home') setActiveTab('dashboard');
    } else {
      if (activeTab === 'dashboard') setActiveTab('tenant-home');
    }
  }, [isOwner]);

  const loadData = useCallback(async () => {
    try {
      const [reqRes, amenRes, bookRes, kpiRes, actRes] = await Promise.all([
        api.getMaintenance({ propertyId: selectedProperty?.id }),
        api.getAmenities({ propertyId: selectedProperty?.id }),
        api.getBookings({ propertyId: selectedProperty?.id }),
        api.getKPIs(),
        api.getActivityLogs(),
      ]);

      if (reqRes.success) setRequests(reqRes.requests || []);
      if (amenRes.success) setAmenities(amenRes.amenities || []);
      if (bookRes.success) setBookings(bookRes.bookings || []);
      if (kpiRes.success) {
        setKpiData(kpiRes.kpis);
        setCounts(kpiRes.counts);
        setBreakdowns(kpiRes.breakdowns);
      }
      if (actRes.success) setActivities(actRes.activities || []);
    } catch (err) {
      console.error('Failed to load real platform data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedProperty?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time Socket.IO listeners
  useEffect(() => {
    if (!socket) return;

    const handleMaintenanceCreated = (newReq) => {
      setRequests((prev) => [newReq, ...prev]);
      api.getKPIs().then((res) => {
        if (res.success) {
          setKpiData(res.kpis);
          setCounts(res.counts);
          setBreakdowns(res.breakdowns);
        }
      });
    };

    const handleMaintenanceUpdated = (updatedReq) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === updatedReq.id ? updatedReq : r))
      );
      if (selectedTicket && selectedTicket.id === updatedReq.id) {
        setSelectedTicket(updatedReq);
      }
      api.getKPIs().then((res) => {
        if (res.success) {
          setKpiData(res.kpis);
          setCounts(res.counts);
          setBreakdowns(res.breakdowns);
        }
      });
    };

    const handleAmenityBooked = (newBooking) => {
      setBookings((prev) => [newBooking, ...prev]);
      api.getKPIs().then((res) => {
        if (res.success) {
          setKpiData(res.kpis);
          setCounts(res.counts);
          setBreakdowns(res.breakdowns);
        }
      });
    };

    const handleAmenityStatusChanged = ({ booking }) => {
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? booking : b))
      );
      api.getKPIs().then((res) => {
        if (res.success) {
          setKpiData(res.kpis);
          setCounts(res.counts);
          setBreakdowns(res.breakdowns);
        }
      });
    };

    const handleActivityLogged = (newLog) => {
      setActivities((prev) => [newLog, ...prev].slice(0, 50));
    };

    socket.on('maintenance_created', handleMaintenanceCreated);
    socket.on('maintenance_updated', handleMaintenanceUpdated);
    socket.on('amenity_booked', handleAmenityBooked);
    socket.on('amenity_status_changed', handleAmenityStatusChanged);
    socket.on('activity_logged', handleActivityLogged);

    return () => {
      socket.off('maintenance_created', handleMaintenanceCreated);
      socket.off('maintenance_updated', handleMaintenanceUpdated);
      socket.off('amenity_booked', handleAmenityBooked);
      socket.off('amenity_status_changed', handleAmenityStatusChanged);
      socket.off('activity_logged', handleActivityLogged);
    };
  }, [socket, selectedTicket]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        onRefreshData={loadData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewProperty={() => setIsNewPropertyOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* If user is not logged in: Show Comprehensive Real-World Landing View */}
        {!currentUser && !authLoading && (
          <LandingView onOpenAuth={() => setShowAuthModal(true)} />
        )}

        {/* When Logged In */}
        {currentUser && (
          <>
            {/* KPI Cards on Manager Overview */}
            {isOwner && activeTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      Property Operations Command Center
                    </h1>
                    <p className="text-xs text-slate-500">
                      Real-time SLA tracking, zero amenity double-booking assurance, and dispatch status
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0 self-start sm:self-auto"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>View Reports & Export CSV</span>
                  </button>
                </div>

                <KPIStatsCards kpiData={kpiData} counts={counts} />

                {/* Priority & Category Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Urgency Distribution
                    </span>
                    <div className="space-y-2 text-xs">
                      {Object.entries(breakdowns?.priority || {}).map(([p, count]) => (
                        <div key={p} className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">{p}</span>
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Service Categories
                    </span>
                    <div className="space-y-2 text-xs">
                      {Object.entries(breakdowns?.category || {}).length === 0 ? (
                        <div className="text-slate-400 text-xs py-2">No category data yet</div>
                      ) : (
                        Object.entries(breakdowns?.category || {}).map(([cat, count]) => (
                          <div key={cat} className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">{cat}</span>
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              {count}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Facility Bookings
                    </span>
                    <div className="space-y-2 text-xs">
                      {Object.entries(breakdowns?.amenity || {}).length === 0 ? (
                        <div className="text-slate-400 text-xs py-2">No facility bookings yet</div>
                      ) : (
                        Object.entries(breakdowns?.amenity || {}).map(([am, count]) => (
                          <div key={am} className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium truncate max-w-[170px]">{am}</span>
                            <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                              {count}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Switcher based on Active Tab */}
            {activeTab === 'tenant-home' && (
              <TenantOverview
                myRequests={requests}
                myBookings={bookings}
                onOpenNewTicket={() => setIsNewTicketOpen(true)}
                onOpenBookAmenity={(amenity) => setBookingAmenity(amenity)}
                onSelectTicket={(ticket) => setSelectedTicket(ticket)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {(activeTab === 'maintenance' || (isOwner && activeTab === 'dashboard')) && (
              <div className={activeTab === 'dashboard' ? 'pt-2' : ''}>
                <MaintenanceDashboard
                  requests={requests}
                  onOpenNewTicket={() => setIsNewTicketOpen(true)}
                  onSelectTicket={(ticket) => setSelectedTicket(ticket)}
                />
              </div>
            )}

            {activeTab === 'amenities' && (
              <AmenityDashboard
                amenities={amenities}
                bookings={bookings}
                onBookAmenity={(amenity) => setBookingAmenity(amenity)}
                onOpenNewAmenity={() => setIsNewAmenityOpen(true)}
                onRefresh={loadData}
              />
            )}

            {activeTab === 'activity' && (
              <ActivityFeed activities={activities} onRefresh={loadData} />
            )}

            {activeTab === 'reports' && (
              <AdminReportsDashboard />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <NewPropertyModal
        isOpen={isNewPropertyOpen}
        onClose={() => setIsNewPropertyOpen(false)}
        onSuccess={() => {
          refreshProperties();
          loadData();
        }}
      />

      <NewAmenityModal
        isOpen={isNewAmenityOpen}
        onClose={() => setIsNewAmenityOpen(false)}
        onSuccess={loadData}
        propertyId={selectedProperty?.id}
      />

      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSuccess={loadData}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdated={loadData}
      />

      <BookAmenityModal
        amenity={bookingAmenity}
        isOpen={!!bookingAmenity}
        onClose={() => setBookingAmenity(null)}
        onSuccess={loadData}
      />
    </div>
  );
}
