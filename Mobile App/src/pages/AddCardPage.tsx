import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../firebase/services';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import PaymentIcon from '../components/PaymentIcon';
import BottomNav from '../components/BottomNav';

interface LocationState {
  fromPaymentMethods?: boolean;
}

const AddCardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const { user } = useAuth();
  const [cardData, setCardData] = useState({
    number: '',
    holderName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }

    // Format expiry month
    if (name === 'expiryMonth') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
      if (parseInt(formattedValue) > 12) formattedValue = '12';
    }

    // Format expiry year
    if (name === 'expiryYear') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const getCardBrand = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'Mastercard';
    if (cleanNumber.startsWith('3')) return 'American Express';
    return 'Unknown';
  };

  const handleSaveCard = async () => {
    // Validate required fields
    if (!cardData.number || !cardData.holderName || !cardData.expiryDate || !cardData.cvv) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Basic card validation
    const cardNumber = cardData.number.replace(/\s/g, '');
    if (cardNumber.length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }

    // Validate expiry date format (MMYY)
    if (cardData.expiryDate.length !== 4) {
      toast.error('Please enter a valid expiry date (MMYY)');
      return;
    }

    const month = parseInt(cardData.expiryDate.slice(0, 2));

    if (month < 1 || month > 12) {
      toast.error('Please enter a valid expiry month');
      return;
    }

    if (!user) {
      toast.error('Please log in to save payment methods');
      return;
    }

    try {
      // Save card to Firebase
      const newCard = {
        last4: cardNumber.slice(-4),
        brand: getCardBrand(cardNumber),
        holderName: cardData.holderName,
        expiryMonth: cardData.expiryDate.slice(0, 2),
        expiryYear: cardData.expiryDate.slice(2, 4),
        // Note: In production, card number should be tokenized/encrypted, not stored
        fullNumber: cardNumber // For demo purposes only
      };

      if (cardData.saveCard) {
        await userService.addUserPaymentMethod(user.id, newCard);
        toast.success('Card saved successfully!');
      } else {
        toast.success('Card added for this transaction!');
      }

      // Navigate back to payment methods or checkout
      if (locationState?.fromPaymentMethods) {
        navigate('/payment-methods', {
          state: { selectedPaymentMethod: cardData.saveCard ? 'card' : 'card' }
        });
      } else {
        navigate('/home/checkout', {
          state: { selectedPaymentMethod: 'card' }
        });
      }
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
    }
  };

  const cardType = getCardBrand(cardData.number);

  return (
    <div className="min-h-screen bg-dark pb-20">
      {/* Mobile App Header - Clean, no navbar styling */}
      <div className="px-4 py-6">
        <div className="relative">
          <button
            onClick={() => {
              if (locationState?.fromPaymentMethods) {
                navigate('/payment-methods');
              } else {
                navigate('/home/checkout');
              }
            }}
            className="absolute left-0 top-0 flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="pt-8 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-title text-white">Add New Card</h1>
              <p className="text-caption text-gray-400 mt-2">Enter your card details to save for future use</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-4">
        {/* Card Preview */}
        <div className="bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500 rounded-2xl p-6 border-2 border-purple-200 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-white font-bold text-lg drop-shadow-lg">
                {cardType === 'Visa' ? 'Visa' :
                 cardType === 'Mastercard' ? 'Mastercard' :
                 cardType === 'American Express' ? 'American Express' : 'Credit Card'}
              </span>
            </div>
            <PaymentIcon
              type={cardType === 'Visa' ? 'visa' : cardType === 'Mastercard' ? 'mastercard' : 'mastercard'}
              className="w-10 h-10 text-white drop-shadow-lg"
            />
          </div>

          <div className="space-y-4">
            <div className="text-white text-xl font-mono tracking-wider drop-shadow-md">
              {cardData.number || '•••• •••• •••• ••••'}
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-purple-100 text-xs uppercase drop-shadow-md">Card Holder</p>
                <p className="text-white font-medium text-sm drop-shadow-md">
                  {cardData.holderName || 'CARD HOLDER NAME'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-xs uppercase drop-shadow-md">Expires</p>
                <p className="text-white font-medium text-sm drop-shadow-md">
                  {cardData.expiryDate
                    ? `${cardData.expiryDate.slice(0, 2)}/${cardData.expiryDate.slice(2, 4)}`
                    : 'MM/YY'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Details Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-caption font-medium text-gray-300 mb-2">
              Card Number
            </label>
            <input
              type="text"
              name="number"
              value={cardData.number}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('number')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 bg-dark border rounded-lg text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                focusedField === 'number' ? 'border-primary' : 'border-primary/20'
              }`}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>

          <div>
            <label className="block text-caption font-medium text-gray-300 mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              name="holderName"
              value={cardData.holderName}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('holderName')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 bg-dark border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                focusedField === 'holderName' ? 'border-primary' : 'border-primary/20'
              }`}
              placeholder="John Smith"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <label className="block text-caption font-medium text-gray-300 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={cardData.expiryDate || ''}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('expiryDate')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 bg-dark border rounded-lg text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  focusedField === 'expiryDate' ? 'border-primary' : 'border-primary/20'
                }`}
                placeholder="MMYY"
                maxLength={4}
              />
            </div>

            <div>
              <label className="block text-caption font-medium text-gray-300 mb-2">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={cardData.cvv}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('cvv')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 bg-dark border rounded-lg text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  focusedField === 'cvv' ? 'border-primary' : 'border-primary/20'
                }`}
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>

          {/* Save Card Checkbox */}
          <label className="flex items-center">
            <input
              type="checkbox"
              name="saveCard"
              checked={cardData.saveCard}
              onChange={(e) => setCardData(prev => ({ ...prev, saveCard: e.target.checked }))}
              className="mr-3 w-4 h-4"
            />
            <span className="text-caption text-gray-300">Save card information for future orders</span>
          </label>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={handleSaveCard}
            className="w-full py-4 bg-primary text-dark rounded-lg hover:bg-primary-dark transition-colors font-bold text-body"
          >
            <span className="text-body font-bold">Save Card</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default AddCardPage;
