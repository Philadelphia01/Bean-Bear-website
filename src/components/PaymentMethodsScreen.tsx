import React from 'react';
import { CreditCard, Plus, Check, Smartphone, Apple, DollarSign } from 'lucide-react';

interface PaymentMethodsScreenProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
  onAddCard: () => void;
  savedCards: any[];
}

const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({
  isOpen,
  onToggle,
  selectedMethod,
  onMethodSelect,
  onAddCard,
  savedCards
}) => {
  const paymentOptions = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: CreditCard,
      description: 'Pay with your PayPal account'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: Smartphone,
      description: 'Pay with Google Pay'
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      icon: Apple,
      description: 'Pay with Apple Pay'
    }
  ];

  return (
    <>
      {/* Payment Method Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full max-w-md mx-auto flex items-center justify-between p-4 bg-dark border border-primary/20 rounded-lg text-left hover:bg-dark-light transition-colors"
      >
        <div className="flex items-center">
          <CreditCard className="w-5 h-5 text-primary mr-3" />
          <div>
            <span className="text-body font-medium text-white">Payment Method</span>
            <p className="text-caption text-gray-400">
              {selectedMethod === 'cash'
                ? 'Pay with cash when you receive your order'
                : selectedMethod === 'card'
                  ? savedCards.length > 0
                    ? `Use saved card (**** ${savedCards[0].last4})`
                    : 'Add a new card to pay'
                  : paymentOptions.find(opt => opt.id === selectedMethod)?.name || 'Select payment method'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {selectedMethod !== 'cash' && savedCards.length > 0 && (
            <Check className="w-4 h-4 text-green-500 mr-2" />
          )}
        </div>
      </button>

      {/* Payment Methods Content */}
      {isOpen && (
        <div className="space-y-4 mt-4">
          {/* Digital Payment Options */}
          <div className="space-y-3">
            {paymentOptions.map(option => (
              <label key={option.id} className="flex items-center justify-between p-4 bg-dark border border-primary/10 rounded-lg cursor-pointer hover:bg-dark-light transition-colors">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={selectedMethod === option.id}
                    onChange={(e) => onMethodSelect(e.target.value)}
                    className="mr-3"
                  />
                  <option.icon className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <span className="text-body font-medium text-white">{option.name}</span>
                    <p className="text-caption text-gray-400">{option.description}</p>
                  </div>
                </div>
                {selectedMethod === option.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </label>
            ))}
          </div>

          {/* Card Payment Option */}
          <label className="flex items-center justify-between p-4 bg-dark border border-primary/10 rounded-lg cursor-pointer hover:bg-dark-light transition-colors">
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={selectedMethod === 'card'}
                onChange={(e) => onMethodSelect(e.target.value)}
                className="mr-3"
              />
              <CreditCard className="w-5 h-5 text-primary mr-3" />
              <div>
                <span className="text-body font-medium text-white">Credit/Debit Card</span>
                <p className="text-caption text-gray-400">
                  {savedCards.length > 0
                    ? `Use saved card (**** ${savedCards[0].last4})`
                    : 'Add a new card to pay'
                  }
                </p>
              </div>
            </div>
            {selectedMethod === 'card' && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </label>

          {/* Add New Card Button */}
          <button
            onClick={onAddCard}
            className="w-full flex items-center justify-center p-4 bg-primary/10 border-2 border-primary/20 rounded-lg text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-body font-medium">Add New Card</span>
          </button>

          {/* Cash Option */}
          <label className="flex items-center justify-between p-4 bg-dark border border-primary/10 rounded-lg cursor-pointer hover:bg-dark-light transition-colors">
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={selectedMethod === 'cash'}
                onChange={(e) => onMethodSelect(e.target.value)}
                className="mr-3"
              />
              <DollarSign className="w-5 h-5 text-primary mr-3" />
              <div>
                <span className="text-body font-medium text-white">Cash on Delivery</span>
                <p className="text-caption text-gray-400">Pay with cash when you receive your order</p>
              </div>
            </div>
            {selectedMethod === 'cash' && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </label>
        </div>
      )}
    </>
  );
};

export default PaymentMethodsScreen;
