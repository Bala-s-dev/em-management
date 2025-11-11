import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function ProtectedRoute({ children, role }) {
  const { auth } = useAuth();

  if (!auth) {
    // Not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (auth.role !== role) {
    // Logged in, but wrong role
    // Redirect to their own dashboard
    const homePath = auth.role === 'admin' ? '/admin' : '/employee';
    return <Navigate to={homePath} />;
  }

  // Logged in and correct role, show the page
  return children;
}

export default ProtectedRoute;
