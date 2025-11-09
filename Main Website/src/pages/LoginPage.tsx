import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CoffeeIcon, LogIn, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, logout, isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Log for debugging
  useEffect(() => {
    console.log('🔵 LoginPage Component RENDERED', { 
      loading, 
      isAuthenticated, 
      pathname: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [loading, isAuthenticated, location.pathname]);
  
  // Always log when component mounts
  useEffect(() => {
    console.log('✅ LoginPage MOUNTED - Route is working!');
    return () => {
      console.log('❌ LoginPage UNMOUNTED');
    };
  }, []);

  // Don't auto-redirect if authenticated - show a message instead
  // This allows users to see the login page even when logged in

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful');
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Failed to log in. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      // Page will update automatically via auth state change
    } catch (err: any) {
      console.error('Logout error:', err);
      toast.error('Failed to logout');
    }
  };

  // Show login form - if loading, show it with a loading indicator
  // Only redirect if authenticated (handled by useEffect)
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999, 
        backgroundColor: '#0F0F0F',
        padding: '20px'
      }}
    >
      <div 
        className="max-w-md w-full rounded-lg shadow-lg p-8" 
        style={{ 
          backgroundColor: '#1E1E1E',
          border: '1px solid #D4A76A40',
          position: 'relative', 
          zIndex: 10000 
        }}
      >
        {loading && (
          <div className="text-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Checking authentication...</p>
          </div>
        )}
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <CoffeeIcon className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-2xl font-bold font-serif text-white">Bear&Bean</h1>
          </Link>
          <p className="text-gray-400 mt-2">Admin Dashboard Login</p>
        </div>

        {/* Show message if already authenticated */}
        {!loading && isAuthenticated && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-500 font-medium">You're already logged in</p>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Logged in as: <span className="text-white font-medium">{user?.name || user?.email}</span>
            </p>
            <div className="flex flex-col gap-2">
              <Link 
                to="/admin" 
                className="w-full btn btn-primary flex items-center justify-center"
              >
                Go to Admin Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <button
                onClick={handleLogoutClick}
                className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
              >
                Logout and Login as Different User
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        {/* Only show login form if not authenticated */}
        {!loading && !isAuthenticated && (
          <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-medium text-white">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-medium text-white">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-400">
              Demo accounts: owner@coffee.com, manager@coffee.com, 
              supervisor@coffee.com, waiter@coffee.com (any password)
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full btn btn-primary flex items-center justify-center"
            disabled={isLoading || loading}
          >
            {isLoading ? (
              <span className="animate-pulse">Logging in...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Log In
              </>
            )}
          </button>
        </form>
        )}
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-primary hover:underline">
            Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;