/**
 * Admin Dashboard
 * Overview with stats cards, charts, and high-priority alerts
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, AlertTriangle, CheckCircle, Clock, Users, TrendingUp, BarChart3, RefreshCw,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { StatCard, LoadingSpinner, AlertBanner, PriorityBadge, StatusBadge } from '../../components/common/index.jsx';
import { formatDate, truncate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/dashboard');
      setStats(res.data.stats);
    } catch {
      toast.error('Failed to load dashboard stats.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar alertCount={stats?.highPriorityComplaints} />

      <main className="flex-1 ml-16 md:ml-60 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-2">
          <div>
            <h1 className="font-heading text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Police Grievance Portal Overview</p>
          </div>
          <button
            onClick={() => { setRefreshing(true); fetchStats(); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* High Priority Alert */}
        {stats?.highPriorityComplaints > 0 && (
          <div className="mb-6">
            <AlertBanner count={stats.highPriorityComplaints} />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Complaints" value={stats?.totalComplaints} icon={FileText} color="blue" index={0} subtitle="All time" />
          <StatCard title="High Priority" value={stats?.highPriorityComplaints} icon={AlertTriangle} color="red" index={1} subtitle="Needs attention" />
          <StatCard title="Resolved" value={stats?.resolvedComplaints} icon={CheckCircle} color="green" index={2} subtitle={`${stats?.resolutionRate}% rate`} />
          <StatCard title="Pending" value={stats?.pendingComplaints} icon={Clock} color="amber" index={3} subtitle="Awaiting action" />
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard title="In Progress" value={stats?.inProgressComplaints} icon={TrendingUp} color="purple" index={4} />
          <StatCard title="Rejected" value={stats?.rejectedComplaints} icon={FileText} color="red" index={5} />
          <StatCard title="Total Citizens" value={stats?.totalCitizens} icon={Users} color="blue" index={6} />
          <StatCard title="Resolution Rate" value={`${stats?.resolutionRate}%`} icon={BarChart3} color="green" index={7} />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Trend Chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-6">
              Monthly Complaint Trend
            </h2>
            {stats?.monthlyTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={stats.monthlyTrend}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="total" name="Total" stroke="#1e3a8a" fill="url(#totalGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" fill="url(#resolvedGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="highPriority" name="High Priority" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">Not enough data yet</div>
            )}
          </div>

          {/* Priority Donut */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-6">
              Priority Distribution
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.priorityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats?.priorityDistribution?.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Bar Chart + Status Pie */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-6">
              Complaints by Category
            </h2>
            {stats?.categoryStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.categoryStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="count" name="Complaints" fill="#1e3a8a" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">No data yet</div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-6">
              Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats?.statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                >
                  {stats?.statusDistribution?.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent High Priority Complaints */}
        {stats?.recentHighPriority?.length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Recent High Priority
              </h2>
              <Link to="/admin/complaints?priority=High" className="text-sm text-blue-900 dark:text-blue-400 hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentHighPriority.map((c) => (
                <div key={c._id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-red-700 dark:text-red-400">{c.complaintId}</span>
                      <PriorityBadge priority={c.priority} />
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{truncate(c.title, 50)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.complainant?.name} • {formatDate(c.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <StatusBadge status={c.status} />
                    <Link to={`/admin/complaints/${c._id}`} className="text-sm text-blue-900 dark:text-blue-400 font-medium hover:underline shrink-0">
                      Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
