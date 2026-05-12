/**
 * Landing Page
 * Public homepage with hero, services, testimonials, and stats sections
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  Search,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Phone,
  Lock,
  Users,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import Footer from '../../components/layout/Footer';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen hero-pattern flex items-center pt-24 pb-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Government Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-900/10 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Government of India Initiative
              </div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 dark:text-white leading-tight mb-6">
                Your Voice,
                <span className="text-amber-500"> Our Priority</span>
                <br />— File Complaints
                <br />Online
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg">
                A secure, transparent, and efficient platform to register police complaints,
                track their status, and ensure justice is served. Available 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2 py-3 px-8 text-base">
                  File a Complaint
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/track-complaint" className="btn-secondary flex items-center justify-center gap-2 py-3 px-8 text-base">
                  <Search className="w-5 h-5" />
                  Track Status
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
                {[
                  { label: '10K+', desc: 'Complaints Filed' },
                  { label: '95%', desc: 'Resolution Rate' },
                  { label: '< 48h', desc: 'Avg Response Time' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-2xl font-heading font-bold text-blue-900 dark:text-white">{item.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {[
                { icon: FileText, title: 'Submit Complaint', desc: 'File complaints online with evidence upload', color: 'blue' },
                { icon: Search, title: 'Track Status', desc: 'Real-time complaint status tracking', color: 'amber' },
                { icon: Lock, title: 'Secure & Private', desc: 'End-to-end encrypted and confidential', color: 'green' },
                { icon: Zap, title: 'Smart Priority', desc: 'AI-powered auto priority assignment', color: 'purple' },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`glass-card rounded-2xl p-6 ${i % 2 === 0 ? '' : 'mt-6'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    card.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                    card.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                    card.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                    'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                  }`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-slate-800 dark:text-white mb-1">{card.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Three simple steps to register and track your complaint.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Users,
                title: 'Create Account',
                desc: 'Register with your email and basic details to create your secure citizen account.',
              },
              {
                step: '02',
                icon: FileText,
                title: 'Submit Complaint',
                desc: 'Fill out the complaint form with details, upload evidence, and get an instant complaint ID.',
              },
              {
                step: '03',
                icon: CheckCircle,
                title: 'Track Resolution',
                desc: 'Monitor your complaint status in real-time and receive updates as action is taken.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...fadeUp}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-8 text-center h-full">
                  <div className="text-6xl font-heading font-bold text-blue-100 dark:text-slate-700 absolute top-4 right-6">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-slate-800 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200 dark:bg-blue-800 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services Section ─────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="section-title mb-4">Our Services</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Comprehensive services for citizens and law enforcement.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: 'Complaint Registration', desc: 'File complaints for any category of crime with supporting evidence.', tag: 'Citizen' },
              { icon: Search, title: 'Complaint Tracking', desc: 'Track your complaint ID anytime, anywhere for real-time updates.', tag: 'Citizen' },
              { icon: AlertTriangle, title: 'Priority Detection', desc: 'Smart AI-powered system auto-assigns priority based on crime severity.', tag: 'AI-Powered' },
              { icon: Clock, title: '24/7 Access', desc: 'Submit complaints at any time of day from any device.', tag: 'Always Open' },
              { icon: Lock, title: 'Secure Evidence Upload', desc: 'Upload images, videos, and documents as evidence securely.', tag: 'Secure' },
              { icon: Shield, title: 'Admin Dashboard', desc: 'Police officers get a powerful dashboard to manage and resolve complaints.', tag: 'Police' },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-shadow group"
              >
                <div className="w-12 h-12 bg-blue-900 group-hover:bg-amber-500 transition-colors rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <div className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-3">
                  {service.tag}
                </div>
                <h3 className="font-heading font-semibold text-lg text-slate-800 dark:text-white mb-2">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="section-title mb-4">What Citizens Say</h2>
            <p className="text-slate-600 dark:text-slate-400">Real experiences from our users</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma',
                city: 'New Delhi',
                rating: 5,
                text: 'My fraud complaint was resolved within 3 days. The portal is incredibly easy to use and the tracking feature kept me informed throughout.',
              },
              {
                name: 'Rajesh Kumar',
                city: 'Mumbai',
                rating: 5,
                text: 'Filing a complaint used to take hours at the police station. Now I did it in 10 minutes from my phone. Excellent initiative!',
              },
              {
                name: 'Ananya Patel',
                city: 'Bengaluru',
                rating: 4,
                text: 'The cybercrime complaint I filed was assigned Medium priority automatically. The officer kept me updated. Great system!',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Emergency Banner ─────────────────────────────────────────────── */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Phone className="w-10 h-10 text-amber-400 shrink-0" />
            <div>
              <h3 className="font-heading text-xl font-bold">Emergency? Call 100</h3>
              <p className="text-blue-200 text-sm">For immediate police assistance, call the emergency number</p>
            </div>
          </div>
          <Link to="/register" className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-8 py-3 rounded-xl transition-all shrink-0">
            File Complaint Online →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
