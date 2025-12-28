import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading, return a loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && user.role !== requiredRole) {
    // If user is not an admin, redirect to dashboard
    if (requiredRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    // Add more role checks as needed
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;