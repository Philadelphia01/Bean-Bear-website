import React, { useState } from 'react';
import { menuItems } from '../data/menuItems';
import { useCart } from '../contexts/CartContext';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { addToCart } = useCart();
  
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
    addToCart(item);
    toast.success(`Added ${item.title} to cart`);
  };

  return (
    <div className="pt-20 pb-16">
      <section className="py-12 bg-dark-light">
        <div className="container">
          <h1 className="text-4xl font-bold text-center mb-4 font-serif">Our Menu</h1>
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-10">
            Indulge in our carefully crafted selection of breakfast dishes, pastries,
            and beverages.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`tab ${activeCategory === category.id ? 'active' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <div key={item.id} className="menu-item group">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <span className="text-primary font-bold">R {item.price}</span>
                  </div>
                  <p className="text-gray-400 mb-4">{item.description}</p>
                  {item.allergens && item.allergens.length > 0 && (
                    <p className="text-sm text-gray-500 mb-4">
                      Contains: {item.allergens.join(', ')}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="flex items-center justify-center w-full p-2 mt-2 bg-primary text-dark rounded transition-colors hover:bg-primary-dark"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Order
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuPage;