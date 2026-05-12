/**
 * Protected Route Components
 * Guards routes based on authentication and role
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/index.jsx';

// ─── Require Login ────────────────────────────────────────────────────────────
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// ─── Require Citizen Role ─────────────────────────────────────────────────────
export const CitizenRoute = ({ children }) => {
  const { isAuthenticated, isCitizen, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage />;

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isCitizen) return <Navigate to="/admin/dashboard" replace />;

  return children;
};

// ─── Require Police or Admin Role ─────────────────────────────────────────────
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isPolice, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage />;

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isPolice) return <Navigate to="/dashboard" replace />;

  return children;
};

// ─── Redirect If Already Logged In ───────────────────────────────────────────
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isPolice, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;

  if (isAuthenticated) {
    return <Navigate to={isPolice ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};
