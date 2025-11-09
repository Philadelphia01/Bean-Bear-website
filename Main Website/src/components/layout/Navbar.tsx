import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CoffeeIcon, MenuIcon, X, Globe } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useCart();
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Handle logo click with explicit navigation
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔵 Bear&Bean logo clicked', { 
      isAuthenticated, 
      loading, 
      user: user?.name,
      currentPath: location.pathname
    });
    
    // If already on the target page, don't navigate
    if (isAuthenticated && user && location.pathname === '/admin') {
      console.log('📍 Already on /admin, skipping navigation');
      return;
    }
    
    if (isAuthenticated && user && location.pathname === '/login') {
      console.log('📍 On /login but authenticated, navigating to /admin');
      navigate('/admin', { replace: true });
      return;
    }
    
    if (loading) {
      console.log('⏳ Auth still loading, waiting 100ms...');
      setTimeout(() => {
        if (isAuthenticated && user) {
          navigate('/admin', { replace: false });
        } else {
          navigate('/login', { replace: false });
        }
      }, 100);
      return;
    }
    
    if (isAuthenticated && user) {
      console.log('✅ User authenticated, navigating to /admin');
      navigate('/admin', { replace: false });
    } else {
      console.log('❌ User not authenticated, navigating to /login');
      navigate('/login', { replace: false });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark shadow-lg' : 'bg-transparent'}`}>
      <div className="container py-4 mx-auto">
        <nav className="flex items-center justify-between">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none outline-none focus:outline-none"
            type="button"
            aria-label="Navigate to admin dashboard or login"
          >
            <CoffeeIcon className="w-8 h-8 text-primary pointer-events-none" />
            <span className="text-xl font-bold text-white font-serif pointer-events-none">Bear&Bean</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              Home
            </NavLink>
            <NavLink to="/menu" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              Menu
            </NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              About
            </NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              Contact
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/download-app" className="btn btn-primary">
              Download Our App
            </Link>
          </div>

          {/* Mobile Nav Toggle */}
          <button 
            className="p-2 md:hidden" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden bg-dark">
          <div className="relative w-full h-full p-8">
            <button 
              className="absolute top-4 right-4" 
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleLogoClick(e);
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 mb-8 hover:opacity-80 transition-opacity cursor-pointer"
                type="button"
              >
                <CoffeeIcon className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-white font-serif">Bear&Bean</span>
              </button>
              
              <NavLink to="/" className="text-xl">
                Home
              </NavLink>
              <NavLink to="/menu" className="text-xl">
                Menu
              </NavLink>
              <NavLink to="/about" className="text-xl">
                About
              </NavLink>
              <NavLink to="/contact" className="text-xl">
                Contact
              </NavLink>
              
              <Link to="/download-app" className="btn btn-primary">
                Download Our App
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;