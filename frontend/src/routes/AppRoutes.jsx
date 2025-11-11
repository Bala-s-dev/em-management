import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import AdminDashboard from '../pages/AdminDashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import useAuth from '../hooks/useAuth';

function AppRoutes() {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee"
        element={
          <ProtectedRoute role="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirect logic for the root path */}
      <Route
        path="/"
        element={
          !auth ? (
            <Navigate to="/login" />
          ) : auth.role === 'admin' ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/employee" />
          )
        }
      />
    </Routes>
  );
}

export default AppRoutes;
