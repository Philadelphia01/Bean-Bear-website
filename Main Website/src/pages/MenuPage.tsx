import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { menuService } from '../firebase/services';

const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await menuService.getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Error loading menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'hot beverages', name: 'Hot Beverages' },
    { id: 'cold drinks', name: 'Cold Drinks' }
  ];

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter((item: any) => item.category === activeCategory);

  const handleAddToCart = (item: any) => {
    navigate('/download-app');
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredItems.map(item => {
              // Fix image paths for specific items
              let imageSrc = item.image;
              if (item.image) {
                // Handle relative paths - convert to public folder path
                if (item.image.startsWith('/images/')) {
                  imageSrc = item.image;
                } else if (!item.image.startsWith('http') && !item.image.startsWith('https')) {
                  // If it's a relative path without leading slash, add it
                  imageSrc = item.image.startsWith('/') ? item.image : `/${item.image}`;
                }
                
                // Fix specific known image issues
                if (item.title?.toLowerCase().includes('sourdough') && item.title?.toLowerCase().includes('pesto')) {
                  imageSrc = '/images/sourdough cbasil pesto sadwith.jpeg';
                } else if (item.title?.toLowerCase().includes('iced tea')) {
                  imageSrc = '/images/icedcoffe.jpeg'; // Use iced coffee as fallback
                }
              }

              return (
                <div key={item.id} className="menu-item group bg-dark-light rounded-lg overflow-hidden flex flex-col">
                  <div className="relative overflow-hidden rounded-t-lg bg-dark-lighter" style={{ height: '180px' }}>
                    <img 
                      src={imageSrc} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ height: '180px' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try fallback image or show placeholder
                        const fallbackImage = '/images/coffee-icon.svg';
                        if (target.src !== fallbackImage && target.src !== window.location.origin + fallbackImage) {
                          target.src = fallbackImage;
                        } else {
                          // If fallback also fails, show placeholder
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.image-placeholder')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'image-placeholder w-full h-full flex items-center justify-center text-gray-500';
                            placeholder.style.height = '180px';
                            placeholder.innerHTML = '<div class="text-center"><svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="text-xs">No Image</p></div>';
                            parent.appendChild(placeholder);
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
                      <span className="text-primary font-bold text-lg whitespace-nowrap ml-2">R {item.price}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 flex-grow line-clamp-2">{item.description}</p>
                    {item.allergens && item.allergens.length > 0 && (
                      <p className="text-xs text-gray-500 mb-3">
                        Contains: {item.allergens.join(', ')}
                      </p>
                    )}
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center justify-center w-full py-2 px-3 mt-auto bg-primary text-dark rounded transition-colors hover:bg-primary-dark text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add to Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuPage;