/**
 * Admin Analytics Page
 * Advanced charts and statistics view
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { LoadingSpinner, StatCard } from '../../components/common/index.jsx';
import toast from 'react-hot-toast';

const COLORS = ['#1e3a8a', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/stats/dashboard');
        setStats(res.data.stats);
      } catch {
        toast.error('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar alertCount={stats?.highPriorityComplaints} />

      <main className="flex-1 ml-16 md:ml-60 p-6 lg:p-8">
        <div className="pt-2 mb-8">
          <h1 className="font-heading text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-900 dark:text-blue-400" />
            Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            In-depth statistics and complaint analysis
          </p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard title="Resolution Rate" value={`${stats?.resolutionRate}%`} icon={TrendingUp} color="green" index={0} />
          <StatCard title="High Priority" value={stats?.highPriorityComplaints} icon={Activity} color="red" index={1} />
          <StatCard title="Medium Priority" value={stats?.mediumPriorityComplaints} icon={BarChart3} color="amber" index={2} />
          <StatCard title="Low Priority" value={stats?.lowPriorityComplaints} icon={PieIcon} color="blue" index={3} />
        </div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <h2 className="font-heading text-xl font-semibold text-slate-800 dark:text-white mb-6">
            Monthly Complaint Trends (Last 6 Months)
          </h2>
          {stats?.monthlyTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total Filed" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="highPriority" name="High Priority" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-slate-400">No trend data available yet</div>
          )}
        </motion.div>

        {/* Priority & Status Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-5">
              Priority Distribution
            </h2>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie
                    data={stats?.priorityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats?.priorityDistribution?.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {stats?.priorityDistribution?.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-5">
              Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} />
                <Bar dataKey="value" name="Complaints" radius={[8, 8, 0, 0]}>
                  {stats?.statusDistribution?.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-6">
            Top Complaint Categories
          </h2>
          {stats?.categoryStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }} />
                <Bar dataKey="count" name="Count" radius={[8, 8, 0, 0]}>
                  {stats.categoryStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-slate-400">No category data available yet</div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
