import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import {
  ShoppingCart,
  User,
  Search,
  Plus,
  Star,
  LogOut,
  Settings
} from 'lucide-react';
import { menuItems } from '../data/menuItems';

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { cartItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Slideshow data
  const slides = [
    {
      id: 1,
      title: '20% Off On All Espresso!',
      subtitle: 'Today Only! Limited Offer.',
      image: '/images/slide.png',
      itemId: 'hot-1', // Espresso
      link: '/menu'
    },
    {
      id: 2,
      title: 'Free Donut with Every Large Coffee!',
      subtitle: 'Sweeten your morning with a perfect combo.',
      image: '/images/donuts.png',
      itemId: 'pastry-3', // Blueberry Muffin as donut alternative
      link: '/menu'
    },
    {
      id: 3,
      title: 'New! Caramel Bliss Latte',
      subtitle: 'Try It Today! A smooth, sweet twist on your favorite brew.',
      image: '/images/latte%20sale.png',
      itemId: 'cold-7', // Caramel Mocha as latte alternative
      link: '/menu'
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Get unique categories from menu items
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  // Get all products or filtered products
  const getFilteredProducts = () => {
    if (activeCategory === 'All') {
      return menuItems.slice(0, 4); // Show only first 4 menu items when "All" is selected
    }
    return menuItems.filter(product => product.category === activeCategory).slice(0, 4); // Show only first 4 items for specific category
  };

  const filteredProducts = getFilteredProducts();

  const handleLogout = () => {
    logout();
  };

  const handleAddToCart = (product: any) => {
    navigate(`/item/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header with Greeting and Profile */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary text-caption font-medium">Good Morning</p>
            <h1 className="text-white text-subtitle font-bold">
              {isAuthenticated ? (user?.name || 'Guest') : 'Guest'}
            </h1>
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

      {/* Promotional Slideshow */}
      <div className="relative mx-6 mb-6 rounded-2xl overflow-hidden">
        <div className="relative h-48">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Coffee gradient background - same as single banner */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-black backdrop-blur-md"></div>

              {/* Background blur overlay - same as single banner */}
              <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>

              {/* Coffee beans pattern overlay - same as single banner */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-amber-700"></div>
                <div className="absolute top-12 right-8 w-6 h-6 rounded-full bg-orange-800"></div>
                <div className="absolute bottom-8 left-12 w-10 h-10 rounded-full bg-amber-600"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-orange-700"></div>
                <div className="absolute top-8 left-20 w-5 h-5 rounded-full bg-amber-800"></div>
                <div className="absolute bottom-12 right-12 w-7 h-7 rounded-full bg-orange-600"></div>
              </div>

              {/* Coffee splash effect - same as single banner */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-30">
                <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 blur-sm"></div>
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-orange-400 blur-sm"></div>
              </div>

              {/* Content - optimized layout for compact slideshow */}
              <div className="relative z-10 h-full flex items-center p-3">
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-body font-bold text-white mb-1 font-serif leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-caption text-orange-300 mb-2 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <Link
                      to={`/item/${slide.itemId}`}
                      className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-4 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl text-xs"
                    >
                      Order Now
                    </Link>
                  </div>

                  {/* Coffee cup image - specific sizes for each slide */}
                  <div className="flex-shrink-0">
                    <img
                      src={slide.image}
                      alt="Coffee Cup"
                      className={`object-contain drop-shadow-2xl ${
                        slide.id === 3 ? 'w-40 h-40' : 'w-32 h-32'
                      }`}
                      onError={(e) => {
                        console.error('Failed to load slide image:', slide.image, slide.title);
                        (e.target as HTMLImageElement).src = '/images/donuts.png'; // fallback
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots - same style as before */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-primary' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-subtitle text-white">Category</h2>
          <Link to="/menu" className="text-primary text-caption hover:underline">
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
                  className="w-full h-40 object-cover rounded-xl"
                  onError={(e) => {
                    console.error('Failed to load product image:', product.image, product.title);
                    (e.target as HTMLImageElement).src = '/images/donuts.png'; // fallback
                  }}
                />
                <div className="absolute top-2 right-2 bg-primary/90 rounded-full p-1">
                  <Star className="w-4 h-4 text-dark fill-current" />
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="text-body font-semibold text-white mb-1 line-clamp-2">{product.title}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-primary font-bold">R {product.price}</span>
                  <span className="text-small text-primary bg-primary/20 px-2 py-1 rounded-full">
                    4.5 ★
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-primary text-dark py-2 rounded-full text-caption font-medium hover:bg-primary-dark transition-colors flex items-center justify-center mt-auto"
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