import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CoffeeIcon, LogIn, UserPlus, AlertCircle, Eye, EyeOff, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const CustomerLoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (formData.email && formData.password) {
        await login(formData.email, formData.password);
        toast.success('Login successful! Welcome back.');
        navigate('/home');
      } else {
        setError('Please enter email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      await register(formData.email, formData.password, formData.name, formData.phone);

      toast.success('Registration successful! Welcome to Bear & Bean.');
      navigate('/home');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4 pb-20">
      <div className="max-w-md w-full bg-dark-light rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <CoffeeIcon className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-title font-serif">Bear&Bean</h1>
            <p className="text-caption text-gray-400 mt-2">
              {isLogin ? 'Welcome back!' : 'Join our coffee community'}
            </p>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-caption font-medium">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-caption font-medium">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-caption font-medium">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-2 text-caption font-medium">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="address" className="block mb-2 text-caption font-medium">Delivery Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your delivery address"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-dark py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                {isLogin ? 'Log In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-caption text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        {isLogin && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-caption text-primary text-center">
              Demo: Use any email/password combination to login
            </p>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link to="/" className="text-primary text-caption hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
