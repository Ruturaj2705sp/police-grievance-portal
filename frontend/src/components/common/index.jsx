/**
 * Common Reusable UI Components
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getPriorityClass, getStatusClass, categoryLabels } from '../../utils/helpers';

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export const LoadingSpinner = ({ size = 'md', fullPage = false }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin`} />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin`} />
    </div>
  );
};

// ─── Priority Badge ───────────────────────────────────────────────────────────
export const PriorityBadge = ({ priority }) => {
  const icons = {
    High: <AlertTriangle className="w-3 h-3" />,
    Medium: <AlertCircle className="w-3 h-3" />,
    Low: <CheckCircle className="w-3 h-3" />,
  };

  return (
    <span className={getPriorityClass(priority)}>
      {icons[priority]}
      {priority}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const icons = {
    Pending: <Clock className="w-3 h-3" />,
    'In Progress': <AlertCircle className="w-3 h-3" />,
    Resolved: <CheckCircle className="w-3 h-3" />,
    Rejected: <XCircle className="w-3 h-3" />,
  };

  return (
    <span className={getStatusClass(status)}>
      {icons[status]}
      {status}
    </span>
  );
};

// ─── Category Badge ───────────────────────────────────────────────────────────
export const CategoryBadge = ({ category }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
    {categoryLabels[category] || category}
  </span>
);

// ─── Stats Card ───────────────────────────────────────────────────────────────
export const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, index = 0 }) => {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
          <p className="text-3xl font-heading font-bold text-slate-800 dark:text-white mt-1">
            {value?.toLocaleString() ?? 0}
          </p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

// ─── Alert Banner ─────────────────────────────────────────────────────────────
export const AlertBanner = ({ count }) => {
  if (!count || count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3"
    >
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <AlertTriangle className="w-5 h-5 animate-pulse" />
        <span className="font-semibold">HIGH PRIORITY ALERT</span>
      </div>
      <span className="text-red-700 dark:text-red-300 text-sm">
        {count} high-priority complaint{count !== 1 ? 's' : ''} require immediate attention.
      </span>
    </motion.div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
      >
        ← Prev
      </button>

      {visiblePages.map((page, idx) => {
        const prev = visiblePages[idx - 1];
        return (
          <React.Fragment key={page}>
            {prev && page - prev > 1 && (
              <span className="px-2 text-slate-400">...</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                page === currentPage
                  ? 'bg-blue-900 text-white'
                  : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
      >
        Next →
      </button>
    </div>
  );
};
