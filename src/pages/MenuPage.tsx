import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuItems } from '../data/menuItems';
import { Plus, ChevronLeft } from 'lucide-react';

const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const navigate = useNavigate();
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'hot beverages', name: 'Hot Beverages' },
    { id: 'cold drinks', name: 'Cold Drinks' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (item: any) => {
    navigate(`/item/${item.id}`);
  };

  return (
    <div className="pt-4 pb-16 min-h-screen bg-dark">
      {/* Header Outside Container */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center p-2 rounded-xl transition-all duration-200"
            style={{ color: '#D4A76A' }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        </div>
        <div className="text-center mt-4">
          <h1 className="text-title font-serif text-white">Our Menu</h1>
          <p className="text-caption text-gray-400 mt-2">
            Indulge in our carefully crafted selection of breakfast dishes, pastries,
            and beverages.
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-dark-light rounded-xl p-4 group hover:bg-dark-light/80 transition-colors">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Failed to load image:', item.image, item.title);
                      (e.target as HTMLImageElement).src = '/images/donuts.png'; // fallback
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-body font-semibold text-white flex-1 mr-2">{item.title}</h3>
                    <span className="text-primary font-bold text-lg">R {item.price}</span>
                  </div>
                  <p className="text-caption text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                  {item.allergens && item.allergens.length > 0 && (
                    <p className="text-small mb-4" style={{ color: '#D4A76A' }}>
                      Contains: {item.allergens.join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full py-3 bg-primary text-dark rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-body font-medium">Add to Cart</span>
                </button>
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