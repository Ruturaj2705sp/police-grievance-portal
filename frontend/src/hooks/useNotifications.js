/**
 * useNotifications — Real-time complaint status notifications
 * Uses smart polling (no Socket.io required — works on Vercel + Render)
 * Automatically shows toast when complaint status changes
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api'; // adjust to your api service path

const POLL_INTERVAL = 30000; // 30 seconds

const STATUS_MESSAGES = {
  'In Progress': '🔍 Your complaint is now being investigated.',
  Resolved: '✅ Great news! Your complaint has been resolved.',
  Rejected: 'ℹ️ Your complaint has been reviewed and rejected.',
  Pending: '📋 Your complaint is pending review.',
};

const useNotifications = (userId, enabled = true) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevStatusMap = useRef({});
  const intervalRef = useRef(null);

  const checkForUpdates = useCallback(async () => {
    if (!userId || !enabled) return;

    try {
      const res = await api.get('/complaints/my', {
        params: { limit: 20, page: 1 },
      });

      const complaints = res.data?.complaints || [];
      const newNotifications = [];

      complaints.forEach(c => {
        const prevStatus = prevStatusMap.current[c._id];
        const currentStatus = c.status;

        // First load — just save statuses, don't notify
        if (prevStatus === undefined) {
          prevStatusMap.current[c._id] = currentStatus;
          return;
        }

        // Status changed — create notification
        if (prevStatus !== currentStatus) {
          prevStatusMap.current[c._id] = currentStatus;

          const notification = {
            id: `${c._id}-${Date.now()}`,
            complaintId: c.complaintId,
            title: c.title,
            oldStatus: prevStatus,
            newStatus: currentStatus,
            timestamp: new Date(),
            read: false,
          };

          newNotifications.push(notification);

          // Show toast
          const message = STATUS_MESSAGES[currentStatus] || `Status updated to ${currentStatus}`;
          if (currentStatus === 'Resolved') {
            toast.success(`${c.complaintId}: ${message}`, { duration: 5000 });
          } else if (currentStatus === 'Rejected') {
            toast.error(`${c.complaintId}: ${message}`, { duration: 5000 });
          } else {
            toast(`${c.complaintId}: ${message}`, { icon: '📋', duration: 4000 });
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 50));
        setUnreadCount(prev => prev + newNotifications.length);
      }
    } catch {
      // Silently fail — notifications are non-critical
    }
  }, [userId, enabled]);

  useEffect(() => {
    if (!userId || !enabled) return;

    // Initial check
    checkForUpdates();

    // Poll every 30 seconds
    intervalRef.current = setInterval(checkForUpdates, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId, enabled, checkForUpdates]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAllRead,
    clearNotifications,
  };
};

export default useNotifications;
import { useState, useRef, useCallback, useEffect } from 'react';
