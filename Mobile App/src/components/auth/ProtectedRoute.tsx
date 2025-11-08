import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'waiter' // Default minimum role
}) => {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login\" replace />;
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    // User doesn't have required permissions
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;