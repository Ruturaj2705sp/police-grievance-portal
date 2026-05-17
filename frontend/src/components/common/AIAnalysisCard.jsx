/**
 * AIAnalysisCard — Shows AI analysis results for a complaint
 * Safe: handles null/undefined aiAnalysis gracefully
 * Use in both citizen complaint detail and admin complaint detail
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RISK_COLORS = {
  Critical: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-300 dark:border-red-700', text: 'text-red-700 dark:text-red-400', badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  High:     { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-400', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' },
  Medium:   { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-700', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  Low:      { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-300 dark:border-green-700', text: 'text-green-700 dark:text-green-400', badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
};

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
  </svg>
);

const AIAnalysisCard = ({ aiAnalysis, loading = false, compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  // Don't render if no analysis and not loading
  if (!loading && (!aiAnalysis || !aiAnalysis.aiProcessed)) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-4 text-center">
        <SparkleIcon />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          AI analysis not available for this complaint.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Analyzing with AI...</p>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-3 bg-blue-100 dark:bg-blue-800 rounded animate-pulse mb-2" style={{ width: `${90 - i * 15}%` }} />
        ))}
      </div>
    );
  }

  const risk = aiAnalysis?.riskLevel || 'Low';
  const colors = RISK_COLORS[risk] || RISK_COLORS.Low;

  if (compact) {
    return (
      <div className={`rounded-xl border ${colors.border} ${colors.bg} p-3 flex items-start gap-2`}>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${colors.badge} shrink-0`}>
          <SparkleIcon />
          {risk}
        </span>
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
          {aiAnalysis?.summary || 'AI summary not available.'}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border-2 ${colors.border} ${colors.bg} overflow-hidden`}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.badge}`}>
            <SparkleIcon />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">AI Analysis</p>
            <p className="text-xs text-slate-500">Powered by Gemini</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
          {risk} Risk
        </span>
      </div>

      <div className="px-5 pb-5 space-y-4">
        {/* Summary */}
        {aiAnalysis?.summary && (
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              AI Summary
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {aiAnalysis.summary}
            </p>
          </div>
        )}

        {/* Priority Reason */}
        {aiAnalysis?.priorityReason && (
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Priority Reasoning
            </p>
            <p className={`text-sm font-medium ${colors.text} leading-relaxed`}>
              {aiAnalysis.priorityReason}
            </p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          {aiAnalysis?.category && (
            <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">AI Category</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white capitalize">
                {aiAnalysis.category.replace(/_/g, ' ')}
              </p>
            </div>
          )}
          {aiAnalysis?.priority && (
            <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">AI Priority</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {aiAnalysis.priority}
              </p>
            </div>
          )}
        </div>

        {/* Suggested Action (expandable) */}
        {aiAnalysis?.suggestedAction && (
          <div>
            <button
              onClick={() => setExpanded(prev => !prev)}
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
            >
              {expanded ? '▲ Hide' : '▼ Show'} Suggested Action
            </button>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-2 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl"
              >
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {aiAnalysis.suggestedAction}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIAnalysisCard;import React, { useState } from 'react';
