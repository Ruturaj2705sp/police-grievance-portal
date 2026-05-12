/**
 * Admin Sidebar Component
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ alertCount = 0 }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      to: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      to: '/admin/complaints',
      icon: FileText,
      label: 'Complaints',
      badge: alertCount > 0 ? alertCount : null,
    },
    ...(isAdmin
      ? [{ to: '/admin/users', icon: Users, label: 'Users' }]
      : []),
    {
      to: '/admin/analytics',
      icon: BarChart3,
      label: 'Analytics',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full bg-blue-900 dark:bg-slate-950 text-white flex flex-col z-40 shadow-2xl"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-blue-800">
        <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-blue-900" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="font-heading font-bold text-sm">Police Portal</div>
              <div className="text-xs text-blue-300 capitalize">{user?.role} Panel</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : ''}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && (
                <span className="absolute right-2 top-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-blue-800">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 py-2 mb-2"
            >
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-blue-300">{user?.stationName || 'HQ'}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-blue-200 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-blue-900 border-2 border-blue-700 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-white" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white" />
        )}
      </button>
    </motion.aside>
  );
};

export default AdminSidebar;
