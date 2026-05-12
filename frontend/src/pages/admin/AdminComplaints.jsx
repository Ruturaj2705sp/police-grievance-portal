/**
 * Admin Complaints Management Page
 * View, filter, update status, and delete complaints
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Trash2, Eye, Edit3, X, CheckCircle, AlertTriangle, SlidersHorizontal,
} from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import {
  LoadingSpinner, PriorityBadge, StatusBadge, EmptyState, Pagination, AlertBanner,
} from '../../components/common/index.jsx';
import { formatDate, truncate, categoryLabels } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

// ─── Update Status Modal ──────────────────────────────────────────────────────
const UpdateStatusModal = ({ complaint, onClose, onUpdated }) => {
  const [status, setStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState(complaint.remarks || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.put(`/admin/complaints/${complaint._id}/status`, { status, remarks });
      toast.success('Status updated successfully!');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9 }}
        className="glass-card rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl font-semibold text-slate-800 dark:text-white">Update Complaint</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <p className="font-mono text-xs text-blue-900 dark:text-blue-400 font-bold">{complaint.complaintId}</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{truncate(complaint.title, 60)}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Remarks / Notes
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Add official remarks or action taken..."
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
          <button onClick={handleUpdate} disabled={loading} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
              <><CheckCircle className="w-4 h-4" /> Update</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ complaint, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/admin/complaints/${complaint._id}`);
      toast.success('Complaint removed.');
      onDeleted();
      onClose();
    } catch {
      toast.error('Failed to delete complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="glass-card rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-7 h-7 text-red-600" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-slate-800 dark:text-white">Delete Complaint?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            This will permanently remove <strong>{complaint.complaintId}</strong> from the system.
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
          <button onClick={handleDelete} disabled={loading} className="btn-danger flex-1 py-2.5 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
              <><Trash2 className="w-4 h-4" /> Delete</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminComplaints = () => {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [alertCount, setAlertCount] = useState(0);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    category: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const [updateModal, setUpdateModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchComplaints = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/admin/complaints', {
        params: { page, limit: 10, ...filters },
      });
      setComplaints(res.data.complaints);
      setPagination(res.data.pagination);
      setAlertCount(res.data.highPriorityAlertCount || 0);
    } catch {
      toast.error('Failed to fetch complaints.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchComplaints(1); }, [fetchComplaints]);

  const handleFilterChange = (key, value) => setFilters(p => ({ ...p, [key]: value }));
  const clearFilters = () => setFilters({ status: '', priority: '', category: '', search: '' });

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar alertCount={alertCount} />

      <main className="flex-1 ml-16 md:ml-60 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div>
            <h1 className="font-heading text-3xl font-bold text-slate-800 dark:text-white">Complaints</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{pagination.total} total complaints</p>
          </div>
        </div>

        {alertCount > 0 && <div className="mb-6"><AlertBanner count={alertCount} /></div>}

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, title, location..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10 py-2.5"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field py-2.5 w-auto min-w-36"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="input-field py-2.5 w-auto min-w-36"
            >
              <option value="">All Priority</option>
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field py-2.5 w-auto min-w-40"
            >
              <option value="">All Categories</option>
              {Object.entries(categoryLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-all">
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : complaints.length === 0 ? (
            <EmptyState icon={Filter} title="No Complaints Found" description="No complaints match your current filters." />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 text-left">
                      {['ID', 'Complainant', 'Title', 'Category', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {complaints.map((c, i) => (
                      <motion.tr
                        key={c._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          c.priority === 'High' && c.status !== 'Resolved' ? 'border-l-4 border-l-red-400' : ''
                        }`}
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-blue-900 dark:text-blue-400 font-bold">
                            {c.complaintId}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                              {c.complainant?.name}
                            </p>
                            <p className="text-xs text-slate-400">{c.complainant?.phone}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-sm text-slate-700 dark:text-slate-300">{truncate(c.title, 40)}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {categoryLabels[c.category] || c.category}
                        </td>
                        <td className="px-5 py-4"><PriorityBadge priority={c.priority} /></td>
                        <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                        <td className="px-5 py-4 text-sm text-slate-400">{formatDate(c.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/complaints/${c._id}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 transition-all"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setUpdateModal(c)}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 transition-all"
                              title="Update Status"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => setDeleteModal(c)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-700">
                {complaints.map((c) => (
                  <div key={c._id} className={`p-4 ${c.priority === 'High' && c.status !== 'Resolved' ? 'border-l-4 border-l-red-400' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-xs text-blue-900 dark:text-blue-400 font-bold">{c.complaintId}</span>
                      <div className="flex gap-1">
                        <PriorityBadge priority={c.priority} />
                        <StatusBadge status={c.status} />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white mb-1">{truncate(c.title, 55)}</p>
                    <p className="text-xs text-slate-500 mb-3">
                      {c.complainant?.name} · {formatDate(c.createdAt)}
                    </p>
                    <div className="flex gap-2">
                      <Link to={`/admin/complaints/${c._id}`} className="flex-1 text-center py-1.5 rounded-lg border border-blue-200 text-blue-700 text-xs font-medium">
                        View
                      </Link>
                      <button onClick={() => setUpdateModal(c)} className="flex-1 py-1.5 rounded-lg border border-green-200 text-green-700 text-xs font-medium">
                        Update
                      </button>
                      {isAdmin && (
                        <button onClick={() => setDeleteModal(c)} className="py-1.5 px-3 rounded-lg border border-red-200 text-red-600 text-xs">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => fetchComplaints(p)}
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {updateModal && (
          <UpdateStatusModal
            complaint={updateModal}
            onClose={() => setUpdateModal(null)}
            onUpdated={() => fetchComplaints(pagination.page)}
          />
        )}
        {deleteModal && (
          <DeleteModal
            complaint={deleteModal}
            onClose={() => setDeleteModal(null)}
            onDeleted={() => fetchComplaints(1)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminComplaints;
