import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, CreditCard, MapPin, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [localOrders, setLocalOrders] = useState(() => {
    const savedOrders = localStorage.getItem('userOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [formData, setFormData] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+27 81 234 5678',
    address: '123 Main Street, Cape Town',
    city: 'Cape Town',
    postalCode: '8001'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = 25;
  const finalTotal = total + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          quantity: item.quantity
        })),
        total: finalTotal,
        status: 'pending' as const,
        date: new Date().toISOString(),
        address: `${formData.address}, ${formData.city}, ${formData.postalCode}`
      };

      // Add order to local orders and save to localStorage
      const updatedOrders = [newOrder, ...localOrders];
      setLocalOrders(updatedOrders);
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

      // Clear the cart
      clearCart();

      // Show success message
      toast.success('Order placed successfully! You can track it in your order history.');

      // Navigate to order history page after a short delay
      setTimeout(() => {
        navigate('/order-history');
      }, 2000);

      setIsProcessing(false);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-dark">
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
    <div className="pt-20 pb-16 min-h-screen bg-dark">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/order')}
              className="flex items-center text-primary hover:text-primary-dark transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Order
            </button>
            <h1 className="text-3xl font-bold text-white">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-dark-light rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{item.title}</h3>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-primary font-bold">R {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-lighter pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>R {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span>R {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-white pt-2 border-t border-dark-lighter">
                  <span>Total</span>
                  <span className="text-primary">R {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-dark-light rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Delivery Information</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Address Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Postal Code"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-white">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-white">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-primary text-dark rounded-lg hover:bg-primary-dark transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing Order...' : `Place Order - R ${finalTotal.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
