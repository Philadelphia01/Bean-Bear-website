import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon, History, Minus, ChevronLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderPage: React.FC = () => {
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Check authentication when trying to proceed to checkout
  useEffect(() => {
    if (!authLoading && cartItems.length > 0 && !user) {
      // Don't redirect immediately, just show a message when they try to checkout
    }
  }, [user, authLoading, cartItems.length]);

  const calculateItemPrice = (item: any) => {
    let basePrice = item.price;

    // Add price for size upgrades
    if (item.customizations?.size === 'Large') {
      if (item.category?.includes('beverages')) {
        basePrice += 10; // Large drinks cost more
      } else {
        basePrice += 15; // Large food items cost more
      }
    }

    // Add price for milk alternatives
    if (item.customizations?.milk && item.customizations.milk !== 'Regular Milk') {
      basePrice += 5;
    }

    // Add price for addons
    if (item.customizations?.addons) {
      item.customizations.addons.forEach((addon: string) => {
        const priceMatch = addon.match(/\(\+R(\d+)\)/);
        if (priceMatch) {
          basePrice += parseInt(priceMatch[1]);
        }
      });
    }

    return basePrice;
  };

  const getCustomizationText = (item: any) => {
    const customizations = [];

    if (item.customizations?.size && item.customizations.size !== 'Regular') {
      customizations.push(`Size: ${item.customizations.size}`);
    }

    if (item.customizations?.addons && item.customizations.addons.length > 0) {
      customizations.push(`Add-ons: ${item.customizations.addons.join(', ')}`);
    }

    if (item.customizations?.specialInstructions) {
      customizations.push(`Note: ${item.customizations.specialInstructions}`);
    }

    return customizations;
  };

  const handleQuantityChange = (cartItemId: string, change: number) => {
    const item = cartItems.find(item => item.cartItemId === cartItemId);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(cartItemId, newQuantity);
    }
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
          <Link
            to="/home/order-history"
            className="p-2 text-primary hover:text-primary-dark transition-colors"
            title="View Order History"
          >
            <History className="w-6 h-6" />
          </Link>
        </div>
        <div className="text-center mt-4">
          <h1 className="text-title text-white">Your Order</h1>
          <p className="text-caption text-gray-400">Review your items and checkout</p>
        </div>
      </div>

      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="bg-dark-light rounded-lg p-6 md:p-8">

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-subtitle">You don't have any orders</h2>
                <p className="text-caption text-gray-400 mb-8">
                  Your cart is empty. Add some delicious items from our menu to get started!
                </p>
                <Link
                  to="/home/menu"
                  className="inline-flex items-center px-6 py-3 bg-primary text-dark rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  <span className="text-body font-medium">Browse Menu</span>
                </Link>
              </div>
            ) : (
              <div>
                <div className="space-y-4 mb-8">
                  {cartItems.map(item => {
                    const itemPrice = calculateItemPrice(item);
                    const customizations = getCustomizationText(item);

                    return (
                      <div key={item.cartItemId} className="bg-dark p-4 rounded-lg">
                        <div className="flex items-start">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                            onError={(e) => {
                              console.error('Failed to load image:', item.image, item.title);
                              (e.target as HTMLImageElement).src = '/images/donuts.png'; // fallback
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-body font-semibold">{item.title}</h3>
                                <p className="text-caption text-gray-400">{item.category}</p>
                                {customizations.length > 0 && (
                                  <div className="text-small text-gray-500 mt-1">
                                    {customizations.map((customization, index) => (
                                      <div key={index}>{customization}</div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => removeFromCart(item.cartItemId)}
                                className="text-red-400 hover:text-red-300 transition-colors p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleQuantityChange(item.cartItemId, -1)}
                                  className="w-8 h-8 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center transition-colors"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4 text-primary" />
                                </button>
                                <span className="text-body font-bold text-white px-3">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.cartItemId, 1)}
                                  className="w-8 h-8 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center transition-colors"
                                >
                                  <PlusIcon className="w-4 h-4 text-primary" />
                                </button>
                              </div>
                              <span className="text-primary font-bold">R {(itemPrice * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-6 mb-8" style={{ borderColor: '#D4A76A40' }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-body">Subtotal</span>
                    <span className="text-body">R {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-body">Delivery Fee</span>
                    <span className="text-body">R 25.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-subtitle mt-4 pt-4 border-t" style={{ borderColor: '#D4A76A40' }}>
                    <span>Total</span>
                    <span className="text-primary">R {(total + 25).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    to="/home/menu"
                    className="flex-1 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-center"
                  >
                    <span className="text-body font-medium">Add More Items</span>
                  </Link>
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error('Please sign in to proceed to checkout');
                        navigate('/login', { state: { from: '/home/checkout' } });
                      } else {
                        navigate('/home/checkout');
                      }
                    }}
                    className="flex-1 py-3 bg-primary text-dark rounded-lg hover:bg-primary-dark transition-colors text-center"
                  >
                    <span className="text-body font-bold">Proceed to Checkout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;