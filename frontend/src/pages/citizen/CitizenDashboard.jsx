/**
 * Citizen Dashboard
 * Shows citizen's complaint overview and stats
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, AlertTriangle, Plus, Search, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { StatCard, LoadingSpinner, PriorityBadge, StatusBadge, EmptyState, Pagination } from '../../components/common/index.jsx';
import { formatDate, truncate, categoryLabels } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (page = 1) => {
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        api.get('/stats/citizen'),
        api.get('/complaints/my', {
          params: { page, limit: 8, ...filters },
        }),
      ]);
      setStats(statsRes.data.stats);
      setComplaints(complaintsRes.data.complaints);
      setPagination(complaintsRes.data.pagination);
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(1); }, [filters]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(pagination.page);
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-6"
        >
          <div>
            <h1 className="font-heading text-3xl font-bold text-slate-800 dark:text-white">
              Welcome, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage and track your complaints here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link to="/submit-complaint" className="btn-primary flex items-center gap-2 py-2.5 px-5">
              <Plus className="w-4 h-4" />
              New Complaint
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Complaints" value={stats?.total} icon={FileText} color="blue" index={0} />
          <StatCard title="Pending" value={stats?.pending} icon={Clock} color="amber" index={1} />
          <StatCard title="In Progress" value={stats?.inProgress} icon={AlertTriangle} color="purple" index={2} />
          <StatCard title="Resolved" value={stats?.resolved} icon={CheckCircle} color="green" index={3} />
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or complaint ID..."
                value={filters.search}
                onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                className="input-field pl-10 py-2.5"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))}
              className="input-field py-2.5 w-full sm:w-44"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(p => ({ ...p, priority: e.target.value }))}
              className="input-field py-2.5 w-full sm:w-40"
            >
              <option value="">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-slate-800 dark:text-white">
              My Complaints
            </h2>
            <span className="text-sm text-slate-500">{pagination.total} total</span>
          </div>

          {complaints.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Complaints Found"
              description="You haven't filed any complaints yet, or no results match your filters."
              action={
                <Link to="/submit-complaint" className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> File First Complaint
                </Link>
              }
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 text-left">
                      {['Complaint ID', 'Title', 'Category', 'Priority', 'Status', 'Date', 'Action'].map(h => (
                        <th key={h} className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {complaints.map((c, i) => (
                      <motion.tr
                        key={c._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-blue-900 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                            {c.complaintId}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200 max-w-xs">
                          {truncate(c.title, 45)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {categoryLabels[c.category] || c.category}
                        </td>
                        <td className="px-6 py-4"><PriorityBadge priority={c.priority} /></td>
                        <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/complaint/${c._id}`}
                            className="text-blue-900 dark:text-blue-400 text-sm font-medium hover:underline"
                          >
                            View →
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
                {complaints.map((c) => (
                  <div key={c._id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-xs text-blue-900 dark:text-blue-400 font-semibold">
                        {c.complaintId}
                      </span>
                      <PriorityBadge priority={c.priority} />
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                      {truncate(c.title, 60)}
                    </p>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={c.status} />
                      <Link to={`/complaint/${c._id}`} className="text-blue-900 dark:text-blue-400 text-sm font-medium">
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => fetchData(p)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
