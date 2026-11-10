import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [pushPermission, setPushPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  // Pure Web Audio API Chime (No external audio file needed)
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio playback silently ignored if blocked by autoplay policy
    }
  };

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        if (perm === 'granted') {
          playNotificationChime();
          new Notification('PropFlow Push Alerts Active', {
            body: 'You will now receive instant desktop alerts for maintenance updates and facility reservations.',
          });
        }
        return perm;
      } catch (err) {
        console.error('[Notification Error]:', err);
      }
    }
    return 'unsupported';
  };

  const addToast = (toast) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const newToast = { id, timestamp: new Date(), ...toast };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Play chime
    playNotificationChime();

    // Trigger Native Browser Desktop Notification if enabled
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(toast.title || 'PropFlow Notification', {
          body: toast.message,
        });
      } catch (err) {
        console.error('[Push Notification Trigger Error]:', err);
      }
    }

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    // In dev, target localhost:5000 if running on 5173
    const socketUrl = window.location.port === '5173' ? 'http://localhost:5000' : '/';
    const s = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    s.on('connect', () => {
      console.log('[Socket] Connected to server! Socket ID:', s.id);
      setIsConnected(true);
    });

    s.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
      setIsConnected(false);
    });

    // Real-time toast notifications
    s.on('maintenance_created', (data) => {
      addToast({
        type: 'info',
        title: 'New Maintenance Ticket',
        message: `${data.tenantName} (${data.unitNumber}): ${data.title} [${data.priority}]`,
      });
    });

    s.on('maintenance_updated', (data) => {
      addToast({
        type: 'success',
        title: 'Ticket Status Updated',
        message: `#${data.id} is now ${data.status.toUpperCase()}`,
      });
    });

    s.on('amenity_booked', (data) => {
      addToast({
        type: 'info',
        title: 'Amenity Reserved',
        message: `${data.tenantName} booked ${data.amenityName} on ${data.date} (${data.startTime} - ${data.endTime})`,
      });
    });

    s.on('amenity_status_changed', ({ booking, action }) => {
      addToast({
        type: 'warning',
        title: `Amenity ${action.toUpperCase()}`,
        message: `${booking.tenantName} ${action === 'checkin' ? 'checked into' : action === 'checkout' ? 'checked out of' : 'cancelled'} ${booking.amenityName}`,
      });
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        toasts,
        addToast,
        removeToast,
        pushPermission,
        requestPushPermission,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

