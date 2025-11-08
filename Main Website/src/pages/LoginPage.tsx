import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CoffeeIcon, LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Navigate immediately after successful login
      toast.success('Login successful');
      navigate('/admin', { replace: true });
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="max-w-md w-full bg-dark-light rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <CoffeeIcon className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-2xl font-bold font-serif">Bear&Bean</h1>
          </Link>
          <p className="text-gray-400 mt-2">Admin Dashboard Login</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Demo accounts: owner@coffee.com, manager@coffee.com, 
              supervisor@coffee.com, waiter@coffee.com (any password)
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full btn btn-primary flex items-center justify-center"
            disabled={isLoading}
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