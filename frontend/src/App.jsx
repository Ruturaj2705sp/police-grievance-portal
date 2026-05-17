/**
 * App.jsx
 * Root component with React Router, Context Providers, and all routes
 */
import AIChatbot from './components/common/AIChatbot';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Route Guards
import {
  ProtectedRoute,
  CitizenRoute,
  AdminRoute,
  GuestRoute,
} from './components/common/ProtectedRoute';

// Layout
import Navbar from './components/layout/Navbar';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import TrackComplaint from './pages/public/TrackComplaint';
import { AboutPage, ServicesPage, FAQPage, ContactPage } from './pages/public/StaticPages';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import SubmitComplaint from './pages/citizen/SubmitComplaint';
import ComplaintDetail from './pages/citizen/ComplaintDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminComplaintDetail from './pages/admin/AdminComplaintDetail';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';

// ─── Layout Wrapper (shows/hides navbar for admin routes) ────────────────────
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={!isAdminRoute ? '' : ''}>{children}</main>
      <AIChatbot />
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* ── Public Routes ─────────────────────────────────────────── */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/track-complaint" element={<TrackComplaint />} />

              {/* ── Auth Routes (redirect if logged in) ───────────────────── */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                }
              />

              {/* ── Citizen Routes ─────────────────────────────────────────── */}
              <Route
                path="/dashboard"
                element={
                  <CitizenRoute>
                    <CitizenDashboard />
                  </CitizenRoute>
                }
              />
              <Route
                path="/submit-complaint"
                element={
                  <CitizenRoute>
                    <SubmitComplaint />
                  </CitizenRoute>
                }
              />
              <Route
                path="/complaint/:id"
                element={
                  <ProtectedRoute>
                    <ComplaintDetail />
                  </ProtectedRoute>
                }
              />

              {/* ── Admin / Police Routes ──────────────────────────────────── */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <AdminRoute>
                    <AdminComplaints />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/complaints/:id"
                element={
                  <AdminRoute>
                    <AdminComplaintDetail />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminRoute>
                    <AdminAnalytics />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />

              {/* ── 404 Fallback ───────────────────────────────────────────── */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <div className="text-center">
                      <h1 className="font-heading text-8xl font-bold text-blue-900 dark:text-blue-400">404</h1>
                      <p className="text-slate-600 dark:text-slate-400 mt-4 mb-6">Page not found.</p>
                      <a href="/" className="btn-primary px-6 py-3">Go Home</a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </AppLayout>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                fontFamily: 'Source Sans 3, system-ui, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#1e3a8a', secondary: '#fff' },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
