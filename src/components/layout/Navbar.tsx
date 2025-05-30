import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { CoffeeIcon, MenuIcon, X, UserCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
          <Link to="/" className="flex items-center space-x-2">
            <CoffeeIcon className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-white font-serif">Bear&Bean</span>
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
                <Link to="/admin\" className="text-primary hover:text-primary-dark transition-colors">
                  Dashboard
                </Link>
                <Link to="/order" className="relative btn btn-primary">
                  Order Now
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
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
              <Link to="/" className="flex items-center space-x-2 mb-8">
                <CoffeeIcon className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-white font-serif">Bear&Bean</span>
              </Link>
              
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
              
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="text-xl text-primary">
                    Dashboard
                  </Link>
                  <Link to="/order" className="btn btn-primary mt-4">
                    Order Now
                    {totalItems > 0 && (
                      <span className="ml-2 bg-red-500 px-2 py-1 rounded-full text-xs">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-xl flex items-center">
                    <UserCircle className="w-5 h-5 mr-2" />
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;