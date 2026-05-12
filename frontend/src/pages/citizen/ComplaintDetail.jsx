/**
 * Complaint Detail Page
 * Shows full complaint info with status history
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, FileText, MapPin, Calendar, User, Shield,
  Download, Eye, Clock, CheckCircle,
} from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, PriorityBadge, StatusBadge } from '../../components/common/index.jsx';
import { formatDate, formatDateTime, categoryLabels } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        setComplaint(res.data.complaint);
      } catch {
        toast.error('Complaint not found.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <LoadingSpinner fullPage />;
  if (!complaint) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm font-bold text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                  {complaint.complaintId}
                </span>
                <PriorityBadge priority={complaint.priority} />
              </div>
              <h1 className="font-heading text-2xl font-bold text-slate-800 dark:text-white">{complaint.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Filed on {formatDateTime(complaint.createdAt)}
              </p>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Description
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{complaint.description}</p>
            </motion.div>

            {/* Incident Info */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Incident Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Category</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {categoryLabels[complaint.category] || complaint.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Location</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{complaint.incidentLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Date of Incident</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{formatDate(complaint.incidentDate)}</p>
                </div>
                {complaint.assignedOfficer && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Assigned Officer</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {complaint.assignedOfficer.name} ({complaint.assignedOfficer.badgeNumber})
                    </p>
                  </div>
                )}
              </div>
              {complaint.remarks && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold mb-1">Official Remarks</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{complaint.remarks}</p>
                </div>
              )}
            </motion.div>

            {/* Evidence */}
            {complaint.evidence?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
                <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Evidence Files ({complaint.evidence.length})
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {complaint.evidence.map((ev, i) => (
                    <a
                      key={i}
                      href={ev.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{ev.originalName}</p>
                        <p className="text-xs text-slate-400">{ev.mimetype}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Status History Sidebar */}
          <div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Status Timeline
              </h2>
              <div className="space-y-4">
                {complaint.statusHistory?.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        h.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                        h.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                        h.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      {i < complaint.statusHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-1" />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{h.status}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{h.note}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDateTime(h.updatedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Complainant Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-2xl p-6 mt-6">
              <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Complainant
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                  {complaint.complainant?.name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{complaint.complainant?.name}</p>
                  <p className="text-xs text-slate-500">{complaint.complainant?.email}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
