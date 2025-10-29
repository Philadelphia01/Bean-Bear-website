import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ChevronLeft, MapPin, ChevronRight, Check, MoreVertical } from 'lucide-react';
import SuccessPopup from '../components/SuccessPopup';
import toast from 'react-hot-toast';
import PaymentIcon from '../components/PaymentIcon';

const CheckoutPage: React.FC = () => {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [localOrders, setLocalOrders] = useState(() => {
    const savedOrders = localStorage.getItem('userOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>(() => {
    const saved = localStorage.getItem('savedCards');
    return saved ? JSON.parse(saved) : [];
  });

  // Handle navigation state (when returning from delivery info page)
  const location = useLocation();

  React.useEffect(() => {
    // Check if we have state from navigation (e.g., returning from delivery info)
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
    if (location.state?.deliveryInfoCompleted) {
      setShowAddressDetails(true);
    }

    // Check if we have selected address from addresses page
    if (location.state?.selectedAddress) {
      setFormData(prev => ({
        ...prev,
        address: location.state.selectedAddress.address,
        city: location.state.selectedAddress.city,
        postalCode: location.state.selectedAddress.postalCode,
        phone: location.state.selectedAddress.phone || prev.phone
      }));
      setShowAddressDetails(true);
    }

    // Check if we have state from navigation (e.g., returning from payment methods)
    if (location.state?.selectedPaymentMethod) {
      setPaymentMethod(location.state.selectedPaymentMethod);
    }

    // Update saved cards when component mounts
    const updateSavedCards = () => {
      const saved = localStorage.getItem('savedCards');
      setSavedCards(saved ? JSON.parse(saved) : []);
    };

    updateSavedCards();
  }, [location.state]);

  const [formData, setFormData] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+27 81 234 5678',
    address: 'Bear & Bean Coffee, Rosebank Mall',
    city: 'Johannesburg',
    postalCode: '2196'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that user has expanded the information section
    if (!showAddressDetails) {
      toast.error('Please complete your information');
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please complete all required fields');
      return;
    }

    if (orderType === 'delivery' && (!formData.address || !formData.city || !formData.postalCode)) {
      toast.error('Please complete your delivery address');
      return;
    }

    setIsProcessing(true);

    // Simulate processing time
    setTimeout(() => {
      // Create new order
      const newOrder = {
        id: `ord-${Date.now()}`,
        customer: formData.name,
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          customizations: item.customizations
        })),
        total: orderType === 'delivery' ? total + 25 : total,
        orderType,
        status: 'pending' as const,
        date: new Date().toISOString(),
        address: orderType === 'delivery' ? `${formData.address}, ${formData.city}, ${formData.postalCode}` : 'Bear & Bean Coffee, Rosebank Mall, Johannesburg, 2196',
        paymentMethod
      };

      // Add order to local orders and save to localStorage
      const updatedOrders = [newOrder, ...localOrders];
      setLocalOrders(updatedOrders);
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

      // Show success popup and reset processing state
      setIsProcessing(false);
      console.log('🎉 Setting showSuccess to true');
      setShowSuccess(true);
      
      // Clear cart and navigate after popup is shown (5 seconds)
      setTimeout(() => {
        clearCart();
        navigate('/order-history');
      }, 5500);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-4 pb-16 min-h-screen bg-dark">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">No items in cart</h1>
            <p className="text-gray-400 mb-8">Add some items to your cart before checking out.</p>
            <button
              onClick={() => navigate('/menu')}
              className="bg-primary text-dark px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-16 min-h-screen bg-dark">
      <SuccessPopup 
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onAnimationComplete={() => navigate('/order-history')}
      />
      <div className="container">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="relative mb-8">
            <div className="absolute left-0 top-0">
              <button
                onClick={() => navigate('/order')}
                className="p-2 rounded-xl transition-all duration-200"
                style={{ color: '#D4A76A' }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            </div>
            
            <div className="text-center pt-8">
              <h1 className="text-2xl font-bold text-white">Checkout</h1>
            </div>
            
            <div className="absolute right-0 top-0">
              <button
                className="p-2 rounded-xl transition-all duration-200"
                style={{ color: '#D4A76A' }}
                onClick={() => toast('More options')}
              >
                <MoreVertical className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Order Type Toggle */}
          <div className="flex items-center justify-center mb-10">
            <div className="bg-dark-light rounded-full p-1 flex border border-gray-700">
              <button
                onClick={() => setOrderType('delivery')}
                className={`px-8 py-3 rounded-full font-medium transition-colors ${
                  orderType === 'delivery'
                    ? 'bg-primary text-dark'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setOrderType('pickup')}
                className={`px-8 py-3 rounded-full font-medium transition-colors ${
                  orderType === 'pickup'
                    ? 'bg-primary text-dark'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pickup
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="rounded-lg p-6" style={{ backgroundColor: '#1E1E1E', border: `1px solid #D4A76A40`, borderRadius: '20px' }}>
              <h2 className="text-subtitle text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.quantity}`} className="flex items-start">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{item.title}</h3>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      {item.customizations && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.customizations.size && `Size: ${item.customizations.size}`}
                          {item.customizations.addons && item.customizations.addons.length > 0 && `, Add-ons: ${item.customizations.addons.join(', ')}`}
                          {item.customizations.specialInstructions && `, Note: ${item.customizations.specialInstructions}`}
                        </div>
                      )}
                    </div>
                    <span style={{ color: '#D4A76A' }} className="font-bold">R {((item.price + (item.customizations?.size === 'Large' ? (item.category?.includes('beverages') ? 10 : 15) : 0) + (item.customizations?.addons?.reduce((sum, addon) => sum + parseInt(addon.match(/\(\+R(\d+)\)/)?.[1] || '0'), 0) || 0)) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2" style={{ borderColor: '#D4A76A40' }}>
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>R {total.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span>
                    <span>R 25.00</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl text-white pt-2 border-t" style={{ borderColor: '#D4A76A40' }}>
                  <span>Total</span>
                  <span style={{ color: '#D4A76A' }}>R {(orderType === 'delivery' ? total + 25 : total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="rounded-lg p-6" style={{ backgroundColor: '#1E1E1E', border: `1px solid #D4A76A40`, borderRadius: '20px' }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Delivery Information Section */}
                <div className={`w-full max-w-md mx-auto p-4 rounded-lg text-left ${
                  orderType === 'delivery'
                    ? 'bg-dark border cursor-pointer hover:bg-dark-light transition-colors'
                    : 'bg-dark-light border'
                }`}
                style={orderType === 'delivery' ? { border: `1px solid #D4A76A40` } : { border: `1px solid #D4A76A40`, backgroundColor: '#1E1E1E' }}
                onClick={orderType === 'delivery' ? () => navigate('/addresses') : undefined}
                >
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3" style={{ color: '#D4A76A' }} />
                    <div>
                      <span className="text-white font-medium">
                        {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                      </span>
                      {orderType === 'delivery' ? (
                        formData.address ? (
                          <p className="text-gray-400 text-sm">{formData.address}, {formData.city}</p>
                        ) : (
                          <p className="text-gray-500 text-sm">Click to select delivery address</p>
                        )
                      ) : (
                        <p className="text-gray-400 text-sm">Bear & Bean Coffee, Rosebank Mall, Johannesburg</p>
                      )}
                    </div>
                    {orderType === 'delivery' && (
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                    )}
                  </div>
                </div>

                {/* Payment Method Section */}
                <button
                  type="button"
                  onClick={() => navigate('/payment-methods')}
                  className="w-full max-w-md mx-auto flex items-center justify-between p-4 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: '#1E1E1E',
                    border: `1px solid #D4A76A40`
                  }}
                >
                  <div className="flex items-center">
                    <PaymentIcon
                      type="mastercard"
                      className="w-5 h-5 mr-3"
                    />
                    <div>
                      <span className="text-white font-medium">Payment Method</span>
                      <p className="text-gray-400 text-sm">
                        {paymentMethod === 'cash'
                          ? 'Pay with cash when you receive your order'
                          : paymentMethod === 'card'
                            ? savedCards.length > 0
                              ? `Use saved card (**** ${savedCards[0].last4})`
                              : 'Credit/Debit Card'
                            : paymentMethod.startsWith('card-')
                              ? (() => {
                                  const cardId = paymentMethod.replace('card-', '');
                                  const card = savedCards.find(c => c.id === cardId);
                                  return card ? `${card.brand} •••• ${card.last4}` : 'Credit/Debit Card';
                                })()
                              : 'Select payment method'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {paymentMethod && paymentMethod !== 'cash' && (
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                    )}
                  </div>
                </button>

                {/* Show Next button only when payment method is selected */}
                {paymentMethod ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: '#D4A76A',
                      color: '#000000',
                      borderRadius: '20px'
                    }}
                  >
                    {isProcessing ? 'Processing Order...' : `Place Order - R ${(orderType === 'delivery' ? total + 25 : total).toFixed(2)}`}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-4 rounded-lg cursor-not-allowed font-bold text-lg"
                    style={{
                      backgroundColor: '#2B2B2B',
                      color: '#666666',
                      borderRadius: '20px'
                    }}
                  >
                    Select Payment Method
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
