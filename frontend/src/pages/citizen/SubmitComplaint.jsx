/**
 * Submit Complaint Page
 * Form to file a new complaint with evidence upload
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, MapPin, Calendar, Upload, X, CheckCircle, AlertTriangle, Info,
} from 'lucide-react';
import api from '../../services/api';
import { categoryLabels } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CATEGORIES = Object.entries(categoryLabels);

const HIGH = ['murder','kidnapping','assault','terrorism','robbery','domestic_violence','missing_person'];
const MEDIUM = ['harassment','fraud','cybercrime','theft','vandalism'];

const getPriorityPreview = (cat) => {
  if (HIGH.includes(cat)) return { level: 'High', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' };
  if (MEDIUM.includes(cat)) return { level: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' };
  return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' };
};

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: '', incidentLocation: '', incidentDate: '',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(null);

  const priorityPreview = form.category ? getPriorityPreview(form.category) : null;

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > 5) return toast.error('Max 5 files allowed.');
    setFiles(p => [...p, ...newFiles]);
  };

  const removeFile = (idx) => setFiles(p => p.filter((_, i) => i !== idx));

  const validateStep1 = () => {
    if (!form.title.trim() || form.title.length < 10)
      return toast.error('Title must be at least 10 characters.');
    if (!form.category) return toast.error('Please select a complaint category.');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim() || form.description.length < 20)
      return toast.error('Description must be at least 20 characters.');
    if (!form.incidentLocation.trim()) return toast.error('Incident location is required.');
    if (!form.incidentDate) return toast.error('Incident date is required.');

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      files.forEach(f => formData.append('evidence', f));

      const res = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setSubmitted({
  ...response.data.complaint,
  aiAnalysis: response.data.aiAnalysis
});
        toast.success('Complaint submitted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-10 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Complaint Filed!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Your complaint has been successfully submitted.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6">
            <p className="text-xs text-slate-500 mb-1">Your Complaint ID</p>
            <p className="font-mono text-2xl font-bold text-blue-900 dark:text-blue-300">
              {submitted.complaintId}
            </p>
            <p className="text-xs text-slate-500 mt-1">Save this ID to track your complaint</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold mb-6 ${getPriorityPreview(submitted.category).bg} ${getPriorityPreview(submitted.category).color}`}>
            <AlertTriangle className="w-4 h-4" />
            Priority Assigned: {submitted.priority}
          </div>
          <div className="mt-4 p-4 rounded-lg bg-blue-900/20 border border-blue-500">
  <h3 className="text-blue-300 font-semibold mb-2">
    AI Analysis
  </h3>

  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
    {submitted.aiAnalysis}
  </pre>
</div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate(`/complaint/${submitted._id}`)} className="btn-primary">
              View Complaint Details
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary">
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-slate-800 dark:text-white">File a Complaint</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Provide accurate details for faster resolution.</p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? 'bg-blue-900 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {s}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
                {s === 1 ? 'Basic Info' : 'Details & Evidence'}
              </span>
              {s < 2 && <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-700" />}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-2xl p-6 sm:p-8"
        >
          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Complaint Title *
                </label>
                <input
                  type="text" name="title" value={form.title} onChange={handleChange}
                  placeholder="Brief title describing the incident (min 10 chars)"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Complaint Category *
                </label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  <option value="">-- Select Category --</option>
                  <optgroup label="🔴 High Priority">
                    {CATEGORIES.filter(([k]) => HIGH.includes(k)).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🟡 Medium Priority">
                    {CATEGORIES.filter(([k]) => MEDIUM.includes(k)).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🟢 Low Priority">
                    {CATEGORIES.filter(([k]) => !HIGH.includes(k) && !MEDIUM.includes(k)).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </optgroup>
                </select>

                {priorityPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${priorityPreview.bg} ${priorityPreview.color}`}
                  >
                    <Info className="w-4 h-4" />
                    This category will be assigned <strong>{priorityPreview.level} Priority</strong>
                  </motion.div>
                )}
              </div>

              <button onClick={validateStep1} className="btn-primary w-full py-3 mt-2">
                Continue →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe the incident in detail (min 20 characters). Include date, time, persons involved, and any other relevant details."
                  rows={5} className="input-field resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">{form.description.length}/2000 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <MapPin className="inline w-4 h-4 mr-1" /> Incident Location *
                </label>
                <input
                  type="text" name="incidentLocation" value={form.incidentLocation} onChange={handleChange}
                  placeholder="e.g. Gandhi Nagar Market, New Delhi"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <Calendar className="inline w-4 h-4 mr-1" /> Incident Date *
                </label>
                <input
                  type="date" name="incidentDate" value={form.incidentDate} onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              {/* Evidence Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <Upload className="inline w-4 h-4 mr-1" /> Upload Evidence (optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file" multiple accept="image/*,.pdf,.doc,.docx,video/*"
                    onChange={handleFiles} className="hidden" id="evidence-upload"
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Images, PDFs, Videos — Max 5MB each, up to 5 files
                    </p>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                        <span className="truncate text-slate-700 dark:text-slate-300">{f.name}</span>
                        <button type="button" onClick={() => removeFile(i)} className="ml-2 text-red-500 hover:text-red-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                    <><FileText className="w-4 h-4" /> Submit Complaint</>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
