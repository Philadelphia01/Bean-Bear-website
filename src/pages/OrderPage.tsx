import React, { useState } from 'react';
import { menuItems } from '../data/menuItems';
import { useCart } from '../contexts/CartContext';
import { Plus, Minus, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [step, setStep] = useState<number>(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit to a backend
    console.log('Order Submitted:', {
      customer: customerInfo,
      items: cartItems,
      total
    });
    
    toast.success('Order placed successfully!');
    clearCart();
    setStep(3);
  };

  return (
    <div className="pt-20 pb-16">
      <div className="container">
        <h1 className="text-4xl font-bold text-center mt-8 mb-4 font-serif">Place Your Order</h1>
        
        {/* Order Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-8">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-primary text-dark' : 'bg-dark-lighter'}`}>
                1
              </div>
              <span className="text-sm">Select Items</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-dark-lighter'}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-primary text-dark' : 'bg-dark-lighter'}`}>
                2
              </div>
              <span className="text-sm">Checkout</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-dark-lighter'}`}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-primary text-dark' : 'bg-dark-lighter'}`}>
                3
              </div>
              <span className="text-sm">Confirmation</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <div className="bg-dark-light p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-6 font-serif">Menu</h2>
                
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`tab whitespace-nowrap ${activeCategory === category.id ? 'active' : ''}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                
                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map(item => (
                    <div key={item.id} className="bg-dark rounded-lg p-4 flex">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-20 h-20 object-cover rounded-md mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold">{item.title}</h3>
                          <span className="text-primary">R {item.price}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="text-xs bg-primary text-dark px-3 py-1 rounded-full flex items-center w-fit"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Cart */}
            <div>
              <div className="bg-dark-light p-6 rounded-lg sticky top-24">
                <h2 className="text-2xl font-bold mb-6 font-serif">Your Order</h2>
                
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-400 my-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                      {cartItems.map(item => (
                        <div key={item.id} className="bg-dark p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">{item.title}</h3>
                            <span className="text-primary">R {item.price}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-dark-lighter rounded-full flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="mx-3">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-dark-lighter rounded-full flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-dark-lighter pt-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>R {total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Delivery Fee</span>
                        <span>R 25.00</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-4">
                        <span>Total</span>
                        <span className="text-primary">R {(total + 25).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => clearCart()} 
                        className="flex-1 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10"
                      >
                        Clear
                      </button>
                      <button 
                        onClick={() => setStep(2)} 
                        className="flex-1 py-2 bg-primary text-dark rounded-lg hover:bg-primary-dark"
                        disabled={cartItems.length === 0}
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark-light p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6 font-serif">Checkout</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Information */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Delivery Information</h3>
                  <form onSubmit={handleSubmitOrder}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block mb-1">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="input"
                          value={customerInfo.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="input"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="input"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block mb-1">Delivery Address</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className="input"
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="notes" className="block mb-1">Special Instructions</label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          className="input"
                          value={customerInfo.notes}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex gap-4">
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 border border-gray-600 rounded-lg hover:bg-dark-lighter"
                      >
                        Back to Menu
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-3 bg-primary text-dark rounded-lg hover:bg-primary-dark"
                      >
                        Place Order
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Order Summary */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  <div className="bg-dark p-4 rounded-lg mb-4">
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between py-2 border-b border-dark-lighter last:border-0">
                          <div>
                            <span className="font-medium">{item.title}</span>
                            <span className="text-gray-400 ml-2">x{item.quantity}</span>
                          </div>
                          <span>R {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-dark p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>R {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Delivery Fee</span>
                      <span>R 25.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-4 border-t border-dark-lighter mt-2">
                      <span>Total</span>
                      <span className="text-primary">R {(total + 25).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-dark-light p-8 rounded-lg">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 font-serif">Order Confirmed!</h2>
              <p className="text-gray-400 mb-8">
                Thank you for your order, {customerInfo.name}. We'll deliver your items to {customerInfo.address} as soon as possible.
              </p>
              <p className="text-gray-400 mb-8">
                A confirmation email has been sent to {customerInfo.email}.
              </p>
              <button 
                onClick={() => {
                  setStep(1);
                  setCustomerInfo({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    notes: ''
                  });
                }} 
                className="btn btn-primary"
              >
                Place Another Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;