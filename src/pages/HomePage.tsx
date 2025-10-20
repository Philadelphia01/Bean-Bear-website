import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import {
  ShoppingCart,
  User,
  Search,
  Coffee,
  Plus,
  Star,
  LogOut,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { menuItems } from '../data/menuItems';

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart, cartItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Get unique categories from menu items
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  // Get all products or filtered products
  const getFilteredProducts = () => {
    if (activeCategory === 'All') {
      return menuItems; // Show all menu items when "All" is selected
    }
    return menuItems.filter(product => product.category === activeCategory);
  };

  const filteredProducts = getFilteredProducts();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header with Greeting and Profile */}
      <div className="bg-dark-light pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary text-sm font-medium">Good Morning</p>
            <h1 className="text-white text-xl font-bold">John Smith</h1>
          </div>
          <div className="flex items-center space-x-3">
            {/* Cart Icon */}
            <Link
              to="/order"
              className="relative p-2 text-primary hover:text-primary-dark transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Profile Avatar */}
            {isAuthenticated ? (
              <div className="relative group">
                <Link
                  to="/profile"
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors"
                  title="View Profile"
                >
                  <User className="w-6 h-6 text-dark" />
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-dark-light rounded-lg shadow-lg border border-primary/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-gray-300 border-b border-primary/20">
                      Welcome, {user?.name || 'User'}
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-white hover:bg-primary/10 rounded-md transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                    <Link
                      to="/order-history"
                      className="flex items-center px-3 py-2 text-white hover:bg-primary/10 rounded-md transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Order History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-white hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors"
                title="Login / Register"
              >
                <User className="w-6 h-6 text-dark" />
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
          <input
            type="text"
            placeholder="Search coffee..."
            className="w-full pl-12 pr-4 py-3 bg-dark border border-primary/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Promo Banner with Background */}
      <div
        className="mx-6 mb-6 rounded-2xl p-6 flex items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg?auto=compress&cs=tinysrgb&w=800')",
        }}
      >
        <div className="backdrop-blur-sm bg-dark/50 rounded-xl p-4 flex items-center w-full">
          <div className="flex-1">
            <h3 className="text-white text-lg font-bold mb-1">Buy 2 Coffee and</h3>
            <p className="text-primary text-sm">Treat Friends</p>
          </div>
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Coffee className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-bold">Category</h2>
          <Link to="/menu" className="text-primary text-sm hover:underline">
            View all
          </Link>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-dark'
                  : 'bg-dark-light text-primary border border-primary/30'
              }`}
            >
              {category === 'All' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 pb-6">
        <div className={`grid gap-4 ${
          activeCategory === 'All'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-2'
        }`}>
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-dark-light rounded-2xl p-4 h-full flex flex-col">
              <div className="relative mb-3 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-32 object-cover rounded-xl"
                />
                <div className="absolute top-2 right-2 bg-primary/90 rounded-full p-1">
                  <Star className="w-4 h-4 text-dark fill-current" />
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{product.title}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-primary font-bold">R {product.price}</span>
                  <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full">
                    4.5 ★
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-primary text-dark py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors flex items-center justify-center mt-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Space */}
      <div className="h-20"></div>
    </div>
  );
};

export default HomePage;