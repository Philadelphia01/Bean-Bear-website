import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { UserCircle, CoffeeIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Show branding only on non-home pages
  const showBranding = location.pathname !== '/';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark shadow-lg' : 'bg-transparent'}`}>
      <div className="container py-4 mx-auto">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {showBranding && (
              <>
                <CoffeeIcon className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-white font-serif">Bear&Bean</span>
              </>
            )}
          </Link>

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
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/admin" className="text-primary hover:text-primary-dark transition-colors">
                  Dashboard
                </Link>
                <Link to="/order" className="btn btn-primary">
                  Order Now
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center text-white hover:text-primary transition-colors">
                  <UserCircle className="w-5 h-5 mr-1" />
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Nav - No Cart Icon */}
          <div className="flex items-center space-x-2 md:hidden">
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;