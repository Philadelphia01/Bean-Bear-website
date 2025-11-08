import React, { useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';

interface AddNewCardScreenProps {
  onBack: () => void;
  onSave: (cardData: any) => void;
}

const AddNewCardScreen: React.FC<AddNewCardScreenProps> = ({ onBack, onSave }) => {
  const [cardData, setCardData] = useState({
    number: '',
    holderName: '',
    expiryMonth: '',
    expiryYear: '',
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

  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    return 'unknown';
  };

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  const handleSave = () => {
    if (!cardData.number || !cardData.holderName || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvv) {
      alert('Please fill in all fields');
      return;
    }

    const cleanNumber = cardData.number.replace(/\s/g, '');
    const last4 = cleanNumber.slice(-4);

    const cardInfo = {
      ...cardData,
      number: cleanNumber,
      last4,
      type: getCardType(cleanNumber)
    };

    onSave(cardInfo);
  };

  const cardType = getCardType(cardData.number);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-primary hover:text-primary-dark transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-bold text-white">Add New Card</h2>
      </div>

      {/* Card Preview */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-3xl mr-2">
              {cardType !== 'unknown' ? getCardTypeIcon(cardType) : '💳'}
            </span>
            <span className="text-white font-medium">
              {cardType === 'visa' ? 'Visa' :
               cardType === 'mastercard' ? 'Mastercard' :
               cardType === 'amex' ? 'American Express' : 'Credit Card'}
            </span>
          </div>
          <CreditCard className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-3">
          <div className="text-white text-lg font-mono tracking-wider">
            {cardData.number || '•••• •••• •••• ••••'}
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-400 text-xs uppercase">Card Holder</p>
              <p className="text-white font-medium">
                {cardData.holderName || 'CARD HOLDER NAME'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs uppercase">Expires</p>
              <p className="text-white font-medium">
                {cardData.expiryMonth && cardData.expiryYear
                  ? `${cardData.expiryMonth.padStart(2, '0')}/${cardData.expiryYear}`
                  : 'MM/YY'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Details Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
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
          <label className="block text-sm font-medium text-gray-300 mb-2">
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expiry Date
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="expiryMonth"
                value={cardData.expiryMonth}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('expiryMonth')}
                onBlur={() => setFocusedField(null)}
                className={`flex-1 px-3 py-3 bg-dark border rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  focusedField === 'expiryMonth' ? 'border-primary' : 'border-primary/20'
                }`}
                placeholder="MM"
                maxLength={2}
              />
              <input
                type="text"
                name="expiryYear"
                value={cardData.expiryYear}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('expiryYear')}
                onBlur={() => setFocusedField(null)}
                className={`flex-1 px-3 py-3 bg-dark border rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  focusedField === 'expiryYear' ? 'border-primary' : 'border-primary/20'
                }`}
                placeholder="YY"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              value={cardData.cvv}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('cvv')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 bg-dark border rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                focusedField === 'cvv' ? 'border-primary' : 'border-primary/20'
              }`}
              placeholder="123"
              maxLength={4}
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
          <span className="text-gray-300 text-sm">Save card information for future orders</span>
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-4 bg-primary text-dark rounded-lg hover:bg-primary-dark transition-colors font-bold text-lg"
      >
        Save Card
      </button>
    </div>
  );
};

export default AddNewCardScreen;
