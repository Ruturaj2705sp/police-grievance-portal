/**
 * NotificationBell — Shows real-time complaint status notifications
 * Add to your existing Navbar next to the user avatar
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BellIcon = ({ hasUnread }) => (
  <div className="relative">
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
    {hasUnread && (
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
    )}
  </div>
);

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString();
};

const statusColor = (status) => {
  const map = {
    Resolved: 'text-green-600',
    'In Progress': 'text-blue-600',
    Rejected: 'text-red-600',
    Pending: 'text-amber-600',
  };
  return map[status] || 'text-slate-600';
};

const NotificationBell = ({ notifications = [], unreadCount = 0, onMarkAllRead }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(prev => !prev);
    if (!open && unreadCount > 0) {
      onMarkAllRead?.();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
        title="Notifications"
      >
        <BellIcon hasUnread={unreadCount > 0} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <p className="font-semibold text-slate-800 dark:text-white text-sm">Notifications</p>
                {notifications.length > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-sm">
                    <div className="text-3xl mb-2">🔔</div>
                    No notifications yet.
                    <p className="text-xs mt-1">You'll be notified when your complaint status changes.</p>
                  </div>
                ) : (
                  notifications.slice(0, 20).map(n => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        !n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      {!n.read && (
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 mb-0.5" />
                      )}
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {n.complaintId}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {n.title}
                      </p>
                      <p className="text-xs mt-1">
                        <span className="text-slate-400">Status: </span>
                        <span className={`font-semibold ${statusColor(n.newStatus)}`}>
                          {n.newStatus}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.timestamp)}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
import React, { useState } from 'react';
