import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuItems } from '../data/menuItems';
import { Plus, ChevronLeft, Search, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'hot beverages', name: 'Hot Beverages' },
    { id: 'cold drinks', name: 'Cold Drinks' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item: any) => {
    navigate(`/item/${item.id}`);
  };

  return (
    <div className="pt-4 pb-16 min-h-screen bg-dark">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center p-2 rounded-xl transition-all duration-200"
            style={{ color: '#D4A76A' }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
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
        </div>
        <div className="text-center mt-4 px-4">
          <h1 className="text-title font-serif text-white">Our Menu</h1>
          <p className="text-caption text-gray-400 mt-2">
            Indulge in our carefully crafted selection of breakfast dishes, pastries,
            and beverages.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for coffee or pastry..."
            className="w-full bg-dark-light text-white rounded-full py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="container">
        <section className="py-8">
          <div className="max-w-6xl mx-auto">

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary text-dark font-medium'
                      : 'bg-dark-light text-gray-300 hover:bg-primary/20'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-2 gap-4 px-2">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-dark-light rounded-xl p-3 group hover:bg-dark-light/80 transition-colors relative"
                  onClick={() => handleAddToCart(item)}
                >
                  {/* Favorite Button */}
                  <button 
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/40 rounded-full"
                  >
                    <Heart 
                      className={`w-5 h-5 ${favorites.has(item.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                    />
                  </button>
                  
                  {/* Item Image */}
                  <div className="relative mb-3 overflow-hidden rounded-lg aspect-square">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Failed to load image:', item.image, item.title);
                        (e.target as HTMLImageElement).src = '/images/donuts.png'; // fallback
                      }}
                    />
                  </div>
                  
                  {/* Item Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-white line-clamp-1 pr-2">{item.title}</h3>
                      <span className="text-primary font-bold text-sm whitespace-nowrap">R {item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MenuPage;