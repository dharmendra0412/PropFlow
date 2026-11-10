import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Building2,
  LogOut,
  LogIn,
  Plus,
  ChevronDown,
  CheckCircle,
  Bell,
  User,
  Shield,
} from 'lucide-react';

export const Header = ({ onRefreshData, activeTab, setActiveTab, onOpenNewProperty }) => {
  const {
    currentUser,
    properties,
    selectedProperty,
    switchProperty,
    isOwner,
    logout,
    setShowAuthModal,
  } = useAuth();
  const { isConnected, toasts, pushPermission, requestPushPermission } = useSocket();
  const [showPropMenu, setShowPropMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Real-time connection */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  PropFlow
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'
                  }`}
                />
                <span className="text-slate-500 text-[11px] font-medium">
                  {isConnected ? 'Live Sync Active' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          {currentUser && (
            <div className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              {isOwner ? (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Command Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('maintenance')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'maintenance'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Maintenance Tickets
                  </button>
                  <button
                    onClick={() => setActiveTab('amenities')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'amenities'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Amenities & Facilities
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'activity'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Audit Trail
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'reports'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Reports & Analytics
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('tenant-home')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'tenant-home'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Residence
                  </button>
                  <button
                    onClick={() => setActiveTab('maintenance')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'maintenance'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Maintenance Requests
                  </button>
                  <button
                    onClick={() => setActiveTab('amenities')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === 'amenities'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Amenity Bookings
                  </button>
                </>
              )}
            </div>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Real Property Switcher / Selector */}
            {currentUser && properties.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowPropMenu(!showPropMenu)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate max-w-[130px]">
                    {selectedProperty ? selectedProperty.name : 'Select Property'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showPropMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                      <span>Your Properties</span>
                      {isOwner && (
                        <button
                          onClick={() => {
                            setShowPropMenu(false);
                            if (onOpenNewProperty) onOpenNewProperty();
                          }}
                          className="text-blue-600 hover:text-blue-800 text-[10px] font-bold"
                        >
                          + New
                        </button>
                      )}
                    </div>
                    {properties.map((prop) => (
                      <button
                        key={prop.id}
                        onClick={() => {
                          switchProperty(prop);
                          setShowPropMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50/70 ${
                          selectedProperty?.id === prop.id
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{prop.name}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                            {prop.address}
                          </div>
                        </div>
                        {selectedProperty?.id === prop.id && (
                          <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* If Owner with 0 properties */}
            {isOwner && properties.length === 0 && (
              <button
                onClick={onOpenNewProperty}
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Property</span>
              </button>
            )}

            {/* Notification Bell */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                >
                  <Bell className="w-4 h-4" />
                  {toasts.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                      {toasts.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800">Real-Time Alerts</span>
                      <span className="text-[10px] text-slate-400">Live Listening</span>
                    </div>

                    {/* Native Desktop Push Notification Action */}
                    <div className="px-3 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] font-medium text-slate-700">
                        Browser Push Alerts
                      </div>
                      {pushPermission === 'granted' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ✓ Active
                        </span>
                      ) : (
                        <button
                          onClick={requestPushPermission}
                          className="text-[10px] font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg transition"
                        >
                          Enable Alerts
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {toasts.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-slate-400">
                          No notifications yet. Real-time updates appear when maintenance tickets or bookings change.
                        </div>
                      ) : (
                        toasts.map((t) => (
                          <div key={t.id} className="p-2.5 text-xs hover:bg-slate-50 transition">
                            <div className="font-semibold text-slate-800">{t.title}</div>
                            <div className="text-slate-600 text-[11px] mt-0.5">{t.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Real User Profile & Logout */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 pl-2.5 pr-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium leading-none">
                      {isOwner ? 'Property Owner' : `Tenant ${currentUser.unitNumber ? `• ${currentUser.unitNumber}` : ''}`}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Scrollable Tab Bar */}
        {currentUser && (
          <div className="md:hidden flex items-center space-x-1.5 overflow-x-auto py-2 border-t border-slate-100">
            {isOwner ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition ${
                    activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition ${
                    activeTab === 'maintenance' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  Maintenance
                </button>
                <button
                  onClick={() => setActiveTab('amenities')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition ${
                    activeTab === 'amenities' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  Amenities
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition ${
                    activeTab === 'activity' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  Audit Trail
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg shrink-0 transition ${
                    activeTab === 'reports'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  📊 Reports & Analytics
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('tenant-home')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition ${
                    activeTab === 'tenant-home' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  My Residence
                </button>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition ${
                    activeTab === 'maintenance' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  Maintenance
                </button>
                <button
                  onClick={() => setActiveTab('amenities')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition ${
                    activeTab === 'amenities' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  Amenities
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
