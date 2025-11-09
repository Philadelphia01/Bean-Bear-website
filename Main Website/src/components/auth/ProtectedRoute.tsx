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
  requiredRole // No default - if undefined, only require authentication
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

  // Check authentication - be more lenient with the check
  // Primary check: isAuthenticated and user object
  // Firebase currentUser might be slightly delayed, so don't require it immediately
  const firebaseUser = auth.currentUser;
  
  console.log('🔒 ProtectedRoute check:', {
    isAuthenticated,
    hasUser: !!user,
    hasFirebaseUser: !!firebaseUser,
    userRole: user?.role,
    requiredRole: requiredRole || 'none (auth only)'
  });

  // Primary authentication check - ALL protected routes require authentication
  if (!isAuthenticated || !user) {
    console.log('❌ ProtectedRoute: Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Optional: Check Firebase user (but don't block if it's temporarily null)
  // This can happen during auth state transitions
  if (!firebaseUser) {
    console.warn('⚠️ ProtectedRoute: Firebase user is null, but auth state says authenticated. Allowing access.');
    // Still allow access if isAuthenticated and user object exist
    // Firebase user might sync shortly
  }

  // Check permissions ONLY if a requiredRole is specified
  // If requiredRole is undefined, only authentication is required
  if (requiredRole && !hasPermission(requiredRole)) {
    console.log('❌ ProtectedRoute: Insufficient permissions. User role:', user.role, 'Required:', requiredRole);
    // Show a helpful message instead of redirecting
    return (
      <div className="flex justify-center items-center h-screen bg-dark">
        <div className="text-center max-w-md p-8 bg-dark-light rounded-lg border border-red-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-2">
            You don't have permission to access this page.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Your role: <span className="text-primary font-medium">{user.role}</span><br/>
            Required role: <span className="text-primary font-medium">{requiredRole}</span> or higher
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;