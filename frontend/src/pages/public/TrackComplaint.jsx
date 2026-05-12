/**
 * Track Complaint Page (Public)
 * Allows anyone to track a complaint using its ID
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Clock, AlertTriangle, MapPin, Calendar, User } from 'lucide-react';
import api from '../../services/api';
import { PriorityBadge, StatusBadge } from '../../components/common/index.jsx';
import { formatDate, formatDateTime, categoryLabels } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Footer from '../../components/layout/Footer';

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!complaintId.trim()) return toast.error('Please enter a Complaint ID.');
    setLoading(true);
    setSearched(false);
    try {
      const res = await api.get(`/complaints/track/${complaintId.trim().toUpperCase()}`);
      setComplaint(res.data.complaint);
      setSearched(true);
    } catch (err) {
      setComplaint(null);
      setSearched(true);
      toast.error(err.response?.data?.message || 'Complaint not found.');
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = ['Pending', 'In Progress', 'Resolved'];
  const currentStepIdx = statusSteps.indexOf(complaint?.status);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-blue-900 text-white py-20 pt-32">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-amber-400/20 border border-amber-400/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Track Your Complaint</h1>
            <p className="text-blue-200 text-lg mb-10">
              Enter your complaint ID to get real-time status updates.
            </p>

            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="text"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                placeholder="e.g. GRV-2024-000001"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono text-sm uppercase"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
                ) : (
                  <><Search className="w-4 h-4" /> Track</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {searched && !complaint && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-10 text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Complaint Not Found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                No complaint found with ID <strong className="font-mono">{complaintId.toUpperCase()}</strong>.
                Please check the ID and try again.
              </p>
            </motion.div>
          )}

          {complaint && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Status Progress Bar */}
              {complaint.status !== 'Rejected' && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-6">
                    Progress
                  </h2>
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-5 h-1 bg-slate-200 dark:bg-slate-700 z-0" />
                    <div
                      className="absolute left-0 top-5 h-1 bg-blue-900 z-0 transition-all duration-500"
                      style={{ width: `${currentStepIdx >= 0 ? (currentStepIdx / (statusSteps.length - 1)) * 100 : 0}%` }}
                    />
                    {statusSteps.map((step, i) => (
                      <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          i <= currentStepIdx
                            ? 'bg-blue-900 border-blue-900 text-white'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                        }`}>
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-medium ${
                          i <= currentStepIdx ? 'text-blue-900 dark:text-blue-400' : 'text-slate-400'
                        }`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complaint Card */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="font-mono text-sm font-bold text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                      {complaint.complaintId}
                    </span>
                    <h3 className="font-heading text-xl font-semibold text-slate-800 dark:text-white mt-3">
                      {complaint.title}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 text-blue-900 dark:text-blue-400 mt-0.5 shrink-0" />
                    <span>{complaint.incidentLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4 text-blue-900 dark:text-blue-400 shrink-0" />
                    <span>{formatDate(complaint.incidentDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <User className="w-4 h-4 text-blue-900 dark:text-blue-400 shrink-0" />
                    <span>Filed by: {complaint.complainant?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4 text-blue-900 dark:text-blue-400 shrink-0" />
                    <span>Filed: {formatDateTime(complaint.createdAt)}</span>
                  </div>
                </div>

                {complaint.assignedOfficer && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-sm">
                    <span className="text-blue-700 dark:text-blue-400 font-semibold">Assigned to: </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {complaint.assignedOfficer.name} — {complaint.assignedOfficer.stationName}
                    </span>
                  </div>
                )}

                {complaint.remarks && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 text-sm">
                    <span className="text-green-700 dark:text-green-400 font-semibold">Remarks: </span>
                    <span className="text-slate-700 dark:text-slate-300">{complaint.remarks}</span>
                  </div>
                )}
              </div>

              {/* Status History */}
              {complaint.statusHistory?.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Activity Log
                  </h2>
                  <div className="space-y-4">
                    {[...complaint.statusHistory].reverse().map((h, i) => (
                      <div key={i} className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                          h.status === 'Resolved' ? 'bg-green-500' :
                          h.status === 'In Progress' ? 'bg-blue-500' :
                          h.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{h.status}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{h.note}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(h.updatedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Enter your complaint ID above to track status</p>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TrackComplaint;
