import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService, userService } from '../firebase/services';
import { loyaltyService } from '../services/loyaltyService';
import { ChevronLeft, MapPin, ChevronRight, Check, MoreVertical, Clock, Gift } from 'lucide-react';
import SuccessPopup from '../components/SuccessPopup';
import toast from 'react-hot-toast';
import PaymentIcon from '../components/PaymentIcon';

const CheckoutPage: React.FC = () => {
  const { cartItems, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [savedCards, setSavedCards] = useState<any[]>([]);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [pickupTime, setPickupTime] = useState<string>('');
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loyaltyData, setLoyaltyData] = useState<any>(null);

  // Initialize formData
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  // Handle navigation state (when returning from delivery info page)
  const location = useLocation();

  // Initialize formData with user data when user is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  // Load loyalty points
  useEffect(() => {
    if (user) {
      loyaltyService.getUserLoyalty(user.id).then(loyalty => {
        if (loyalty) {
          setLoyaltyData(loyalty);
          setLoyaltyPoints(loyalty.availablePoints);
          setLoyaltyDiscount(loyaltyService.getDiscountForPoints(loyalty.availablePoints));
        }
      });
    }
  }, [user]);

  // Set default pickup address when order type changes to pickup
  useEffect(() => {
    if (orderType === 'pickup' && (!formData.address || !formData.city || !formData.postalCode)) {
      setFormData(prev => ({
        ...prev,
        address: 'Bear & Bean Coffee, Rosebank Mall',
        city: 'Johannesburg',
        postalCode: '2196'
      }));
      setShowAddressDetails(true);
    }
  }, [orderType]);

  // Generate available pickup time slots for today only (9 AM to 6 PM)
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const today = new Date();
    
    // Determine the starting hour for today
    let startHour = 9; // Store opens at 9 AM
    
    // If current time is before 9 AM, start from 9 AM
    if (currentHour < 9) {
      startHour = 9;
    } 
    // If current time is after 6 PM, no slots available for today
    else if (currentHour >= 18) {
      return []; // No slots available if it's past 6 PM
    }
    // If current time is between 9 AM and 6 PM, start from next available slot
    else {
      // If past :30, start from next hour, otherwise start from current hour
      startHour = currentMinute > 30 ? currentHour + 1 : currentHour;
      // Ensure we don't go past 6 PM
      if (startHour >= 18) {
        return []; // No slots available if next slot would be past 6 PM
      }
    }
    
    // Generate time slots for today only (9 AM to 6 PM, every 30 minutes)
    for (let hour = startHour; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip past times for the current hour
        if (hour === currentHour && minute <= currentMinute) {
          continue;
        }
        
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const dateTime = new Date(today);
        dateTime.setHours(hour, minute, 0, 0);
        
        slots.push({
          value: dateTime.toISOString(),
          label: `Today ${timeStr}`,
          display: timeStr
        });
      }
    }
    
    return slots;
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const [addresses, cards, orders] = await Promise.all([
            userService.getUserAddresses(user.id),
            userService.getUserPaymentMethods(user.id),
            orderService.getOrdersByUser(user.id)
          ]);
          setSavedAddresses(addresses);
          setSavedCards(cards);
          setUserOrders(orders);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [user]);

  React.useEffect(() => {
    // Check if we have state from navigation (e.g., returning from delivery info)
    if (location.state?.formData) {
      setFormData(location.state.formData);
      setShowAddressDetails(true);
    }
    if (location.state?.deliveryInfoCompleted) {
      setShowAddressDetails(true);
    }

    // Check if we have selected address from addresses page
    if (location.state?.selectedAddress) {
      const selectedAddress = location.state.selectedAddress;
      setFormData(prev => ({
        ...prev,
        address: selectedAddress.address || prev.address,
        city: selectedAddress.city || prev.city,
        postalCode: selectedAddress.postalCode || prev.postalCode,
        phone: selectedAddress.phone || prev.phone,
        // Ensure name and email are preserved - don't overwrite if they exist
        name: prev.name || user?.name || 'John Smith',
        email: prev.email || user?.email || 'john.smith@email.com'
      }));
      setShowAddressDetails(true);
    }

    // Check if we have state from navigation (e.g., returning from payment methods)
    if (location.state?.selectedPaymentMethod) {
      setPaymentMethod(location.state.selectedPaymentMethod);
    }
  }, [location.state, user]);

  const calculateItemPrice = (item: typeof cartItems[number]) => {
    let basePrice = item.price;

    if (item.customizations?.size === 'Large') {
      if (item.category?.includes('beverages')) {
        basePrice += 10;
      } else {
        basePrice += 15;
      }
    }

    if (item.customizations?.milk && item.customizations.milk !== 'Regular Milk') {
      basePrice += 5;
    }

    if (item.customizations?.addons) {
      item.customizations.addons.forEach(addon => {
        const priceMatch = addon.match(/\(\+R(\d+)\)/);
        if (priceMatch) {
          basePrice += parseInt(priceMatch[1]);
        }
      });
    }

    return basePrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate authentication first
    if (!user) {
      toast.error('Please sign in to place an order');
      navigate('/login', { state: { from: '/home/checkout' } });
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!formData.phone || !formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    // Handle address based on order type
    let finalAddress = '';
    if (orderType === 'delivery') {
      if (!formData.address || !formData.address.trim()) {
        toast.error('Please select a delivery address');
        return;
      }
      if (!formData.city || !formData.city.trim()) {
        toast.error('Please select a delivery address with city');
        return;
      }
      if (!formData.postalCode || !formData.postalCode.trim()) {
        toast.error('Please select a delivery address with postal code');
        return;
      }
      finalAddress = `${formData.address.trim()}, ${formData.city.trim()}, ${formData.postalCode.trim()}`;
    } else {
      // For pickup, use default address
      finalAddress = 'Bear & Bean Coffee, Rosebank Mall, Johannesburg, 2196';
      
      // Validate pickup time
      if (!pickupTime || !pickupTime.trim()) {
        toast.error('Please select a pickup time');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Calculate final total with loyalty discount
      const baseTotal = orderType === 'delivery' ? total + 25 : total;
      const appliedDiscount = useLoyaltyPoints && loyaltyPoints > 0 ? loyaltyDiscount : 0;
      const finalTotal = Math.max(0, baseTotal - appliedDiscount);

      // Create new order
      const newOrder = {
        customerId: user.id,
        userId: user.id, // Also include userId for compatibility
        customer: formData.name,
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          customizations: item.customizations
        })),
        total: finalTotal,
        baseTotal: baseTotal,
        loyaltyDiscount: appliedDiscount,
        orderType,
        status: 'pending' as const,
        date: new Date().toISOString(),
        address: finalAddress,
        paymentMethod,
        ...(orderType === 'pickup' && pickupTime ? { pickupTime } : {})
      };

      // Save order to Firebase
      const orderId = await orderService.addOrder(newOrder);

      // Handle loyalty points
      if (orderId && user.id) {
        // Earn points from order
        const pointsEarned = await loyaltyService.earnPoints(user.id, orderId, finalTotal);
        
        // If points were redeemed, redeem them
        if (useLoyaltyPoints && loyaltyPoints > 0) {
          const pointsToRedeem = loyaltyService.getPointsForDiscount(loyaltyDiscount);
          try {
            await loyaltyService.redeemPoints(user.id, pointsToRedeem, orderId);
            toast.success(`Redeemed ${pointsToRedeem} points!`);
          } catch (error: any) {
            console.error('Error redeeming points:', error);
            toast.error(error.message || 'Failed to redeem points');
          }
        }
        
        if (pointsEarned > 0) {
          toast.success(`Earned ${pointsEarned} loyalty points!`);
        }
      }

      // Show success popup and reset processing state
      setIsProcessing(false);
      setShowSuccess(true);

      // Clear cart and navigate after popup is shown (5 seconds)
      setTimeout(() => {
        clearCart();
        navigate('/home/order-history');
      }, 5500);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  // Check authentication - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to place an order');
      navigate('/login', { state: { from: '/home/checkout' } });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="pt-4 pb-16 min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-4 pb-16 min-h-screen bg-dark">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">No items in cart</h1>
            <p className="text-gray-400 mb-8">Add some items to your cart before checking out.</p>
            <button
        onClick={() => navigate('/home/menu')}
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
    <div className="pt-12 pb-16 min-h-screen bg-dark overflow-x-hidden">
      <SuccessPopup 
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onAnimationComplete={() => navigate('/home/order-history')}
      />
      <div className="container max-w-full px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="relative mb-6">
            <div className="absolute left-0 top-0">
              <button
                onClick={() => navigate('/home/order')}
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
          <div className="flex items-center justify-center mb-6">
            <div className="bg-dark-light rounded-full p-1 flex border border-gray-700">
              <button
                onClick={() => setOrderType('delivery')}
                className={`px-6 py-2.5 rounded-full font-medium transition-colors text-sm ${
                  orderType === 'delivery'
                    ? 'bg-primary text-dark'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setOrderType('pickup')}
                className={`px-6 py-2.5 rounded-full font-medium transition-colors text-sm ${
                  orderType === 'pickup'
                    ? 'bg-primary text-dark'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pickup
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Order Summary */}
            <div className="rounded-lg p-4 sm:p-6" style={{ backgroundColor: '#1E1E1E', border: `1px solid #D4A76A40`, borderRadius: '20px' }}>
              <h2 className="text-lg sm:text-xl text-white mb-4 sm:mb-6">Order Summary</h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-64 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.cartItemId} className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm sm:text-base break-words">{item.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Qty: {item.quantity}</p>
                      {item.customizations && (
                        <div className="text-xs text-gray-500 mt-1 break-words">
                          {item.customizations.size && `Size: ${item.customizations.size}`}
                          {item.customizations.addons && item.customizations.addons.length > 0 && `, Add-ons: ${item.customizations.addons.join(', ')}`}
                          {item.customizations.specialInstructions && `, Note: ${item.customizations.specialInstructions}`}
                        </div>
                      )}
                    </div>
                    <span style={{ color: '#D4A76A' }} className="font-bold text-sm sm:text-base flex-shrink-0 ml-2">
                      R {(calculateItemPrice(item) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 sm:pt-4 space-y-2" style={{ borderColor: '#D4A76A40' }}>
                <div className="flex justify-between text-gray-400 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>R {total.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-gray-400 text-sm sm:text-base">
                    <span>Delivery Fee</span>
                    <span>R 25.00</span>
                  </div>
                )}
                {useLoyaltyPoints && loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-green-400 text-sm sm:text-base">
                    <span>Loyalty Discount</span>
                    <span>-R {loyaltyDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg sm:text-xl text-white pt-2 border-t" style={{ borderColor: '#D4A76A40' }}>
                  <span>Total</span>
                  <span style={{ color: '#D4A76A' }}>
                    R {(() => {
                      const baseTotal = orderType === 'delivery' ? total + 25 : total;
                      const discount = useLoyaltyPoints && loyaltyPoints > 0 ? loyaltyDiscount : 0;
                      return Math.max(0, baseTotal - discount).toFixed(2);
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="rounded-lg p-4 sm:p-6" style={{ backgroundColor: '#1E1E1E', border: `1px solid #D4A76A40`, borderRadius: '20px' }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Delivery Information Section */}
                <div className={`w-full p-3 sm:p-4 rounded-lg text-left ${
                  orderType === 'delivery'
                    ? 'bg-dark border cursor-pointer hover:bg-dark-light transition-colors'
                    : 'bg-dark-light border'
                }`}
                style={orderType === 'delivery' ? { border: `1px solid #D4A76A40` } : { border: `1px solid #D4A76A40`, backgroundColor: '#1E1E1E' }}
                onClick={orderType === 'delivery' ? () => navigate('/addresses', { state: { fromCheckout: true } }) : undefined}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: '#D4A76A' }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-white font-medium block">
                        {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                      </span>
                      {orderType === 'delivery' ? (
                        formData.address && formData.address.trim() ? (
                          <p className="text-gray-400 text-sm break-words">
                            {formData.address}
                            {formData.city && `, ${formData.city}`}
                            {formData.postalCode && ` ${formData.postalCode}`}
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm">Click to select delivery address</p>
                        )
                      ) : (
                        <p className="text-gray-400 text-sm break-words">Bear & Bean Coffee, Rosebank Mall, Johannesburg, 2196</p>
                      )}
                    </div>
                    {orderType === 'delivery' && (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Pickup Time Selection */}
                {orderType === 'pickup' && (
                  <div className="w-full max-w-md mx-auto">
                    <label className="block text-white font-medium mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" style={{ color: '#D4A76A' }} />
                      Select Pickup Time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full p-4 rounded-lg bg-dark border text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ border: `1px solid #D4A76A40` }}
                      required={orderType === 'pickup'}
                    >
                      <option value="">Choose a pickup time...</option>
                      {generateTimeSlots().map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    {pickupTime && (
                      <p className="text-gray-400 text-xs mt-2">
                        Selected: {new Date(pickupTime).toLocaleString('en-ZA', { 
                          day: 'numeric', 
                          month: 'short', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    )}
                  </div>
                )}

                {/* Loyalty Points Redemption */}
                {loyaltyPoints > 0 && (
                  <div className="w-full max-w-md mx-auto p-3 sm:p-4 rounded-lg border" style={{ borderColor: '#D4A76A40', backgroundColor: '#1E1E1E' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Gift className="w-5 h-5 mr-2" style={{ color: '#D4A76A' }} />
                        <div>
                          <span className="text-white font-medium text-sm sm:text-base block">Loyalty Points</span>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {loyaltyPoints.toLocaleString()} points available (≈ R {loyaltyDiscount.toFixed(2)} discount)
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useLoyaltyPoints}
                          onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    {useLoyaltyPoints && (
                      <p className="text-green-400 text-xs mt-2">
                        You'll save R {loyaltyDiscount.toFixed(2)} on this order!
                      </p>
                    )}
                  </div>
                )}

                {/* Payment Method Section */}
                <button
                  type="button"
                  onClick={() => navigate('/payment-methods', { state: { fromCheckout: true } })}
                  className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: '#1E1E1E',
                    border: `1px solid #D4A76A40`
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <PaymentIcon
                      type="mastercard"
                      className="w-5 h-5 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-white font-medium block text-sm sm:text-base">Payment Method</span>
                      <p className="text-gray-400 text-xs sm:text-sm break-words">
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
                  <div className="flex items-center flex-shrink-0">
                    {paymentMethod && paymentMethod !== 'cash' && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </button>

                {/* Show Next button only when payment method is selected */}
                {paymentMethod ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full py-3 sm:py-4 rounded-lg cursor-not-allowed font-bold text-base sm:text-lg"
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
