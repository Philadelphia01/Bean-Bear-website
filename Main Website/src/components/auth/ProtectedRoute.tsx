import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebase/config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'waiter' // Default minimum role
}) => {
  const { isAuthenticated, hasPermission, loading, user } = useAuth();

  // Wait for authentication to finish loading before making decisions
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Strict check: must have both isAuthenticated flag AND a user object AND Firebase currentUser
  // This ensures we don't allow access if any check fails
  // Double-checking with Firebase's currentUser for extra security
  const firebaseUser = auth.currentUser;
  if (!isAuthenticated || !user || !firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    // User doesn't have required permissions
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;