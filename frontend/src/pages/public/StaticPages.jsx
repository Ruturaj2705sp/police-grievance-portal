/**
 * About Page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Eye, Heart } from 'lucide-react';
import Footer from '../../components/layout/Footer';

export const AboutPage = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
    <section className="bg-blue-900 text-white py-24 pt-32">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Shield className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h1 className="font-heading text-4xl font-bold mb-4">About the Portal</h1>
          <p className="text-blue-200 text-lg">
            A digital initiative by the Government of India to modernize citizen-police interaction.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="py-20 max-w-5xl mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: Target, title: 'Our Mission', text: 'To empower citizens with a transparent, efficient, and accessible platform to report crimes and grievances, ensuring every complaint receives timely attention from law enforcement.' },
          { icon: Eye, title: 'Our Vision', text: 'A crime-free India where citizens and police work in partnership, enabled by technology that brings transparency, accountability, and trust to the justice system.' },
          { icon: Heart, title: 'Our Values', text: 'Transparency in every step. Accountability from all stakeholders. Speed in resolution. Respect for every complainant. Technology for inclusive access.' },
        ].map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-8"
      >
        <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-white mb-4">
          About This Project
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
          <p>
            The Police Station Grievance Portal was developed as a college project to demonstrate how
            modern web technologies can bridge the gap between citizens and law enforcement authorities.
          </p>
          <p>
            Built with React.js, Node.js, Express, and MongoDB, this portal incorporates AI-based
            priority detection that automatically classifies complaints into High, Medium, and Low
            priority categories based on the nature of the crime.
          </p>
          <p>
            The platform features JWT-based authentication, role-based access control, real-time
            status tracking, evidence upload, and a powerful analytics dashboard for police officers
            and administrators.
          </p>
        </div>
      </motion.div>
    </section>
    <Footer />
  </div>
);

/**
 * Services Page
 */
export const ServicesPage = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
    <section className="bg-blue-900 text-white py-24 pt-32">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-blue-200 text-lg">Comprehensive grievance management for every citizen</p>
        </motion.div>
      </div>
    </section>

    <section className="py-20 max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { emoji: '📝', title: 'Online Complaint Registration', desc: 'File FIR-equivalent complaints from home. Available 24/7 with instant complaint ID generation and auto-priority assignment.' },
          { emoji: '🔍', title: 'Real-Time Status Tracking', desc: 'Track your complaint at any time using your Complaint ID. Get updates as officers take action on your case.' },
          { emoji: '📁', title: 'Evidence Upload', desc: 'Attach photos, videos, documents, and other evidence securely. Supports images, PDFs, and video files up to 5MB.' },
          { emoji: '🤖', title: 'AI Priority Detection', desc: 'Our smart keyword-based system automatically categorizes complaints as High, Medium, or Low priority for faster response.' },
          { emoji: '🛡️', title: 'Secure & Confidential', desc: 'End-to-end encryption with JWT authentication ensures your personal information and complaints remain private.' },
          { emoji: '📊', title: 'Police Analytics Dashboard', desc: 'Officers get a powerful dashboard with charts, filters, and real-time stats to manage complaints efficiently.' },
          { emoji: '🔔', title: 'Priority Alerts', desc: 'High-priority complaints automatically trigger alerts for police officers, ensuring urgent cases get immediate attention.' },
          { emoji: '📱', title: 'Mobile Responsive', desc: 'Fully optimized for all devices — smartphones, tablets, and desktops. File complaints from anywhere.' },
          { emoji: '🌙', title: 'Dark Mode Support', desc: 'Comfortable viewing in any lighting condition with our built-in dark mode toggle.' },
        ].map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="text-3xl mb-3">{s.emoji}</div>
            <h3 className="font-heading text-lg font-semibold text-slate-800 dark:text-white mb-2">{s.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

/**
 * FAQ Page
 */
const faqs = [
  { q: 'How do I file a complaint?', a: 'Register for a free account, log in, click "New Complaint" from your dashboard, fill in the details and submit. You will receive a unique Complaint ID instantly.' },
  { q: 'What is a Complaint ID?', a: 'A Complaint ID (e.g., GRV-2024-001234) is a unique identifier auto-generated when you submit a complaint. Use it to track your complaint status publicly without logging in.' },
  { q: 'How is priority assigned?', a: 'Our AI system automatically detects priority based on the crime category and keywords in your complaint. Murder, kidnapping, assault, terrorism, and robbery are High priority. Harassment, fraud, and cybercrime are Medium. Traffic, noise, and minor disputes are Low.' },
  { q: 'Can I track my complaint without logging in?', a: 'Yes! Visit the "Track Complaint" page and enter your Complaint ID. You will see real-time status, officer notes, and full activity history.' },
  { q: 'What files can I upload as evidence?', a: 'You can upload images (JPG, PNG, GIF), PDFs, Word documents, and videos (MP4, AVI). Maximum 5 files, 5MB each.' },
  { q: 'Is my personal information secure?', a: 'Yes. We use JWT authentication, password hashing (bcrypt), and HTTPS. Your data is stored in a secure database and never shared without authorization.' },
  { q: 'How long does it take to resolve a complaint?', a: 'Response time depends on complaint severity. High-priority complaints are flagged immediately. Most complaints receive initial action within 48 hours.' },
  { q: 'Can I edit my complaint after submitting?', a: 'Once submitted, complaints cannot be edited to maintain integrity. However, you can add comments through your dashboard or contact the assigned officer directly.' },
  { q: 'What if my complaint is rejected?', a: 'If a complaint is rejected, the officer will provide remarks explaining the reason. You may re-file with additional evidence or contact the police station directly.' },
  { q: 'Is this service available 24/7?', a: 'Yes. You can file and track complaints at any time. Officers review complaints during working hours, with high-priority cases monitored around the clock.' },
];

export const FAQPage = () => {
  const [open, setOpen] = React.useState(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="bg-blue-900 text-white py-24 pt-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-blue-200 text-lg">Everything you need to know about the portal</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 max-w-3xl mx-auto px-4">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
              >
                <span className="font-semibold text-slate-800 dark:text-white">{faq.q}</span>
                <span className={`text-blue-900 dark:text-blue-400 text-xl font-bold transition-transform ${open === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="px-6 pb-5"
                >
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

/**
 * Contact Page
 */
export const ContactPage = () => {
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="bg-blue-900 text-white py-24 pt-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-blue-200 text-lg">Get in touch with our support team</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-white mb-6">Get in Touch</h2>
            {submitted ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-slate-600 dark:text-slate-400">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
                {[
                  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                  { name: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.name]}
                      onChange={(e) => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your query..."
                    value={form.message}
                    onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                    className="input-field resize-none"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-3">Send Message</button>
              </form>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-white mb-6">Contact Information</h2>
            {[
              { emoji: '🏛️', title: 'Headquarters', info: 'Central Police Station\nConnaught Place, New Delhi — 110001' },
              { emoji: '📞', title: 'Phone', info: '1800-XXX-XXXX (Toll Free)\nMon–Sat: 9 AM – 6 PM' },
              { emoji: '📧', title: 'Email', info: 'grievance@police.gov.in\nSupport: help@police.gov.in' },
              { emoji: '🚨', title: 'Emergency', info: 'Police: 100\nWomen Helpline: 1091\nCyber Crime: 1930' },
            ].map(c => (
              <div key={c.title} className="glass-card rounded-2xl p-5 flex gap-4">
                <div className="text-3xl">{c.emoji}</div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{c.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-line">{c.info}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
