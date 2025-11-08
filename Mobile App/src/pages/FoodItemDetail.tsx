import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Plus, Minus, ShoppingCart, ChevronLeft } from 'lucide-react';
import { menuService } from '../firebase/services';

interface CustomizationOption {
  id: string;
  name: string;
  values: string[];
  selected: string;
}

const FoodItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCartWithCustomizations } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customizations, setCustomizations] = useState<{
    size?: string;
    sugar?: string;
    ice?: string;
    milk?: string;
    addons?: string[];
    specialInstructions?: string;
  }>({});

  useEffect(() => {
    const loadItem = async () => {
      try {
        const items = await menuService.getMenuItems();
        const foundItem = items.find(item => item.id === id) || null;
        setItem(foundItem);
      } catch (error) {
        console.error('Error loading item:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadItem();
    }
  }, [id]);

  useEffect(() => {
    if (!loading && !item) {
      navigate('/home/menu');
    }
  }, [item, loading, navigate]);

  if (loading) {
    return null;
  }

  if (!item) {
    return null;
  }

  // Define customization options based on category
  const getCustomizationOptions = () => {
    const options: CustomizationOption[] = [];

    switch (item.category) {
      case 'breakfast':
        options.push(
          {
            id: 'size',
            name: 'Size',
            values: ['Regular', 'Large'],
            selected: customizations.size || 'Regular'
          },
          {
            id: 'addons',
            name: 'Add-ons',
            values: ['Extra Bacon (+R15)', 'Extra Sausage (+R12)', 'Extra Egg (+R8)', 'Side Salad (+R20)'],
            selected: ''
          }
        );
        break;

      case 'pastries':
        options.push(
          {
            id: 'size',
            name: 'Size',
            values: ['Regular', 'Large'],
            selected: customizations.size || 'Regular'
          },
          {
            id: 'addons',
            name: 'Add-ons',
            values: ['Extra Filling (+R10)', 'Chocolate Sauce (+R8)', 'Whipped Cream (+R12)'],
            selected: ''
          }
        );
        break;

      case 'hot beverages':
      case 'cold drinks':
        options.push(
          {
            id: 'size',
            name: 'Size',
            values: ['Small', 'Medium', 'Large'],
            selected: customizations.size || 'Medium'
          },
          {
            id: 'sugar',
            name: 'Sugar',
            values: ['No Sugar', 'Half Sugar', 'Full Sugar', 'Extra Sweet'],
            selected: customizations.sugar || 'Half Sugar'
          }
        );

        if (item.category === 'cold drinks') {
          options.push({
            id: 'ice',
            name: 'Ice',
            values: ['No Ice', 'Light Ice', 'Regular Ice', 'Extra Ice'],
            selected: customizations.ice || 'Regular Ice'
          });
        }

        if (item.title.toLowerCase().includes('latte') || item.title.toLowerCase().includes('cappuccino')) {
          options.push({
            id: 'milk',
            name: 'Milk Type',
            values: ['Regular Milk', 'Oat Milk (+R5)', 'Almond Milk (+R5)', 'Soy Milk (+R5)'],
            selected: customizations.milk || 'Regular Milk'
          });
        }
        break;

      default:
        options.push({
          id: 'size',
          name: 'Size',
          values: ['Regular', 'Large'],
          selected: customizations.size || 'Regular'
        });
    }

    return options;
  };

  const customizationOptions = getCustomizationOptions();

  const handleCustomizationChange = (optionId: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const handleAddonToggle = (addon: string) => {
    setCustomizations(prev => ({
      ...prev,
      addons: prev.addons?.includes(addon)
        ? prev.addons.filter(a => a !== addon)
        : [...(prev.addons || []), addon]
    }));
  };

  const calculatePrice = () => {
    let basePrice = item.price;

    // Add price for size upgrades
    if (customizations.size === 'Large') {
      if (item.category.includes('beverages')) {
        basePrice += 10; // Large drinks cost more
      } else {
        basePrice += 15; // Large food items cost more
      }
    }

    // Add price for milk alternatives
    if (customizations.milk && customizations.milk !== 'Regular Milk') {
      basePrice += 5;
    }

    // Add price for addons
    if (customizations.addons) {
      customizations.addons.forEach(addon => {
        const priceMatch = addon.match(/\(\+R(\d+)\)/);
        if (priceMatch) {
          basePrice += parseInt(priceMatch[1]);
        }
      });
    }

    return basePrice * quantity;
  };

  const handleAddToCart = () => {
    addToCartWithCustomizations(item, customizations, quantity);
    navigate('/home/order');
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  return (
    <div className="min-h-screen bg-dark w-full overflow-x-hidden">
      {/* Hero Image with Overlays */}
      <div className="relative h-80 sm:h-96 w-full">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded-t-3xl"
          onError={(e) => {
            console.error('Failed to load image:', item.image, item.title);
            (e.target as HTMLImageElement).src = '/images/donuts.png'; // fallback
          }}
        />

        {/* Overlay Header */}
        <div className="absolute top-0 left-0 right-0 pt-4 z-10">
          <div className="flex items-center justify-between px-4 sm:px-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center p-2 sm:p-3 rounded-xl transition-all duration-200 bg-black/30 backdrop-blur-sm"
              style={{ color: '#D4A76A' }}
            >
              <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
            <Link to="/home/order" className="relative text-primary hover:text-primary-dark transition-colors p-2 sm:p-3 rounded-xl bg-black/30 backdrop-blur-sm">
              <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative -mt-6 sm:-mt-8 bg-dark rounded-t-[3rem] px-0 py-6 sm:py-8 shadow-2xl w-full min-w-full">
        {/* Item Details */}
        <div className="mb-6 sm:mb-8 px-4 sm:px-6">
          <h1 className="text-title font-semibold text-white mb-3">{item.title}</h1>
          <p className="text-body text-gray-300 mb-4 leading-relaxed">{item.description}</p>
          {item.allergens && item.allergens.length > 0 && (
            <div className="text-caption" style={{ color: '#D4A76A' }}>
              Contains: {item.allergens.join(', ')}
            </div>
          )}
        </div>

        {/* Customization Options */}
        <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6 px-4 sm:px-6">
          {customizationOptions.map(option => (
            <div key={option.id}>
              <h3 className="text-body font-semibold text-white mb-3 sm:mb-4">{option.name}</h3>

              {option.id === 'addons' ? (
                <div className="space-y-2 sm:space-y-3">
                  {option.values.map(addon => (
                    <label key={addon} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={customizations.addons?.includes(addon) || false}
                        onChange={() => handleAddonToggle(addon)}
                        className="mr-3 w-4 h-4 text-primary bg-dark border-primary rounded focus:ring-primary"
                      />
                      <span className="text-white text-sm">{addon}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {option.values.map(value => (
                    <button
                      key={value}
                      onClick={() => handleCustomizationChange(option.id, value)}
                      className={`py-2 sm:py-3 px-3 sm:px-4 rounded-full text-sm font-medium transition-colors ${
                        customizations[option.id as keyof typeof customizations] === value
                          ? 'bg-primary text-dark'
                          : 'bg-dark border border-primary/30 text-primary hover:bg-primary/10'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Special Instructions */}
          <div>
            <h3 className="text-body font-semibold text-white mb-3 sm:mb-4">Special Instructions</h3>
            <textarea
              value={customizations.specialInstructions || ''}
              onChange={(e) => setCustomizations(prev => ({ ...prev, specialInstructions: e.target.value }))}
              placeholder="Any special requests or modifications..."
              className="w-full bg-dark border border-primary/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 px-4 sm:px-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="text-body font-semibold text-white">Quantity:</span>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 sm:w-10 h-8 sm:h-10 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
              </button>
              <span className="text-body font-bold text-white px-3 sm:px-4 min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 sm:w-10 h-8 sm:h-10 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
              </button>
            </div>
          </div>

          <div className="text-right">
            <div className="text-title font-bold text-primary">R {calculatePrice().toFixed(2)}</div>
            {quantity > 1 && (
              <div className="text-caption text-gray-400">R {(calculatePrice() / quantity).toFixed(2)} each</div>
            )}
          </div>
        </div>

        {/* Add to Cart and Checkout Button */}
        <div className="px-4 sm:px-6">
          <button
            onClick={handleAddToCart}
            className="w-full max-w-sm mx-auto block bg-primary hover:bg-primary-dark text-dark font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl transition-colors duration-300 shadow-lg hover:shadow-xl text-body"
          >
            <span className="text-body font-bold">Add to Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItemDetail;
