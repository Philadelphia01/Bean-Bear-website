import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, ChevronLeft, Check } from 'lucide-react';
import PaymentIcon from '../components/PaymentIcon';
import BottomNav from '../components/BottomNav';

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
}

const PaymentMethodsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState(
    location.state?.selectedPaymentMethod || ''
  );
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);

  // Load saved cards from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedCards');
    if (saved) {
      setSavedCards(JSON.parse(saved));
    }
  }, []);

  const paymentOptions = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'paypal',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: 'google',
      description: 'Pay with Google Pay'
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      icon: 'apple',
      description: 'Pay with Apple Pay'
    }
  ];

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleAddCard = () => {
    navigate('/add-card', {
      state: { fromPaymentMethods: true }
    });
  };

  const handleBack = () => {
    navigate('/checkout', {
      state: { selectedPaymentMethod: selectedMethod }
    });
  };

  const handleNext = () => {
    if (selectedMethod) {
      navigate('/checkout', {
        state: { selectedPaymentMethod: selectedMethod }
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark pb-20">
      {/* Mobile App Header - Clean, no navbar styling */}
      <div className="px-4 py-6">
        <div className="relative">
          <button
            onClick={handleBack}
            className="absolute left-0 top-0 flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="pt-8 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Payment Methods</h1>
              <p className="text-sm text-gray-400 mt-2">Choose payment method you would like to use</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-3 pb-6">
        {/* Payment Options List */}
        <div className="px-3 py-3 space-y-4">
          {/* Digital Payment Options */}
          {paymentOptions.map(option => (
            <div
              key={option.id}
              onClick={() => handleMethodSelect(option.id)}
              className="bg-dark-light rounded-2xl p-4 shadow-sm border border-primary/20 cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                {/* Left: Logo Container */}
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                    <PaymentIcon
                      type={option.icon as any}
                      className="w-8 h-8 text-primary"
                    />
                  </div>

                  {/* Middle: Payment Method Name */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{option.name}</h3>
                  </div>
                </div>

                {/* Right: Radio Button */}
                <div className="ml-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedMethod === option.id
                      ? 'border-primary bg-primary'
                      : 'border-primary/30'
                  }`}>
                    {selectedMethod === option.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Saved Cards */}
          {savedCards.length > 0 && savedCards.map(card => (
            <div
              key={card.id}
              onClick={() => handleMethodSelect(`card-${card.id}`)}
              className="bg-dark-light rounded-2xl p-4 shadow-sm border border-primary/20 cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                {/* Left: Logo Container */}
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                    <PaymentIcon
                      type={card.brand.toLowerCase() as any}
                      className="w-8 h-8 text-primary"
                    />
                  </div>

                  {/* Middle: Card Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {card.brand} •••• {card.last4}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {card.holderName} • {card.expiryMonth}/{card.expiryYear}
                    </p>
                  </div>
                </div>

                {/* Right: Radio Button */}
                <div className="ml-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedMethod === `card-${card.id}`
                      ? 'border-primary bg-primary'
                      : 'border-primary/30'
                  }`}>
                    {selectedMethod === `card-${card.id}` && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Card Payment Option (if no saved cards) */}
          {savedCards.length === 0 && (
            <div
              onClick={() => handleMethodSelect('card')}
              className="bg-dark-light rounded-2xl p-4 shadow-sm border border-primary/20 cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                {/* Left: Logo Container */}
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                    <PaymentIcon
                      type="mastercard"
                      className="w-8 h-8 text-primary"
                    />
                  </div>

                  {/* Middle: Card Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">Credit/Debit Card</h3>
                    <p className="text-sm text-gray-300">Add a new card to pay</p>
                  </div>
                </div>

                {/* Right: Radio Button */}
                <div className="ml-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedMethod === 'card'
                      ? 'border-primary bg-primary'
                      : 'border-primary/30'
                  }`}>
                    {selectedMethod === 'card' && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cash Payment Option */}
          <div
            onClick={() => handleMethodSelect('cash')}
            className="bg-dark-light rounded-2xl p-4 shadow-sm border border-primary/20 cursor-pointer hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Left: Logo Container */}
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                  <PaymentIcon
                    type="cash"
                    className="w-8 h-8 text-primary"
                  />
                </div>

                {/* Middle: Cash Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Cash on Delivery</h3>
                  <p className="text-sm text-gray-300">Pay with cash when you receive your order</p>
                </div>
              </div>

              {/* Right: Radio Button */}
              <div className="ml-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedMethod === 'cash'
                    ? 'border-primary bg-primary'
                    : 'border-primary/30'
                }`}>
                  {selectedMethod === 'cash' && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Card Button */}
      <div className="px-3 pb-6">
        <button
          onClick={handleAddCard}
          className="w-full bg-gray-100 hover:bg-gray-200 rounded-2xl py-4 px-6 transition-colors duration-200 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700 font-semibold">Add New Card</span>
        </button>
      </div>

      {/* Next Button - No grey container */}
      <div className="px-3 pb-6">
        <button
          onClick={handleNext}
          disabled={!selectedMethod}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
            selectedMethod
              ? 'bg-primary text-black hover:bg-primary-dark shadow-lg hover:shadow-xl'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default PaymentMethodsPage;
