/**
 * Admin Complaint Detail Page
 * Full view of a single complaint for police/admin
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, User, Shield, Download,
  Eye, Clock, Edit3, CheckCircle, FileText, AlertTriangle,
} from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { LoadingSpinner, PriorityBadge, StatusBadge } from '../../components/common/index.jsx';
import { formatDate, formatDateTime, categoryLabels } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ status: '', remarks: '' });
  const [updating, setUpdating] = useState(false);

  const fetchComplaint = async () => {
    try {
      const res = await api.get(`/complaints/${id}`);
      setComplaint(res.data.complaint);
      setFormData({ status: res.data.complaint.status, remarks: res.data.complaint.remarks || '' });
    } catch {
      toast.error('Complaint not found.');
      navigate('/admin/complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaint(); }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/admin/complaints/${complaint._id}/status`, formData);
      toast.success('Complaint updated!');
      setEditMode(false);
      fetchComplaint();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!complaint) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <main className="flex-1 ml-16 md:ml-60 p-6 lg:p-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-900 dark:hover:text-blue-400 mb-6 pt-2 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Complaints
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-sm font-bold text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                  {complaint.complaintId}
                </span>
                <PriorityBadge priority={complaint.priority} />
                {complaint.isAlertFlagged && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> ALERT FLAGGED
                  </span>
                )}
              </div>
              <h1 className="font-heading text-2xl font-bold text-slate-800 dark:text-white">{complaint.title}</h1>
              <p className="text-slate-500 text-sm mt-1">{formatDateTime(complaint.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={complaint.status} />
              <button
                onClick={() => setEditMode(!editMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  editMode ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : 'btn-primary'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {editMode ? 'Cancel Edit' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Update Form */}
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
                    className="input-field"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Official Remarks</label>
                  <input
                    type="text"
                    value={formData.remarks}
                    onChange={(e) => setFormData(p => ({ ...p, remarks: e.target.value }))}
                    placeholder="Action taken, notes..."
                    className="input-field"
                  />
                </div>
              </div>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="btn-primary mt-4 flex items-center gap-2 px-6 py-2.5"
              >
                {updating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Complaint Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Description
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
            </motion.div>

            {/* Incident Info */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Incident Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Category', value: categoryLabels[complaint.category] || complaint.category },
                  { label: 'Location', value: complaint.incidentLocation },
                  { label: 'Date of Incident', value: formatDate(complaint.incidentDate) },
                  { label: 'Filed On', value: formatDateTime(complaint.createdAt) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
                  </div>
                ))}
              </div>
              {complaint.remarks && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold uppercase tracking-wide mb-1">Official Remarks</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{complaint.remarks}</p>
                </div>
              )}
            </motion.div>

            {/* Evidence */}
            {complaint.evidence?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
                <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-900 dark:text-blue-400" />
                  Evidence Files ({complaint.evidence.length})
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {complaint.evidence.map((ev, i) => (
                    <a
                      key={i}
                      href={ev.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group border border-slate-200 dark:border-slate-700"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{ev.originalName}</p>
                        <p className="text-xs text-slate-400">{ev.mimetype}</p>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Complainant Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Complainant
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {complaint.complainant?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{complaint.complainant?.name}</p>
                  <p className="text-xs text-slate-500">{complaint.complainant?.email}</p>
                </div>
              </div>
              {complaint.complainant?.phone && (
                <p className="text-sm text-slate-600 dark:text-slate-400">📞 {complaint.complainant.phone}</p>
              )}
              {complaint.complainant?.address && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">📍 {complaint.complainant.address}</p>
              )}
            </motion.div>

            {/* Assigned Officer */}
            {complaint.assignedOfficer && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-6">
                <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Assigned Officer
                </h2>
                <p className="font-semibold text-slate-800 dark:text-white">{complaint.assignedOfficer.name}</p>
                <p className="text-sm text-slate-500">Badge: {complaint.assignedOfficer.badgeNumber}</p>
                <p className="text-sm text-slate-500">{complaint.assignedOfficer.stationName}</p>
              </motion.div>
            )}

            {/* Status Timeline */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Activity Log
              </h2>
              <div className="space-y-4">
                {[...( complaint.statusHistory || [])].reverse().map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      h.status === 'Resolved' ? 'bg-green-500' :
                      h.status === 'In Progress' ? 'bg-blue-500' :
                      h.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{h.status}</p>
                      {h.note && <p className="text-xs text-slate-500 mt-0.5">{h.note}</p>}
                      <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(h.updatedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminComplaintDetail;
