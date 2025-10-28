import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';

interface PaymentIconProps {
  type: 'paypal' | 'google' | 'apple' | 'mastercard' | 'visa' | 'amex' | 'cash';
  className?: string;
}

const PaymentIcon: React.FC<PaymentIconProps> = ({ type, className = "w-8 h-8" }) => {
  // Use the actual brand images the user provided
  const getImagePath = (type: string): string => {
    switch (type) {
      case 'paypal': return '/images/paypal.jpg';
      case 'google': return '/images/google.png';
      case 'apple': return '/images/apple%20pay.png';
      case 'mastercard': return '/images/master%20card.png';
      case 'visa': return '/images/master%20card.png'; // fallback to mastercard for visa/amex
      case 'amex': return '/images/master%20card.png'; // fallback to mastercard for visa/amex
      case 'cash': return '/images/cash%20payment.png';
      default: return '/images/master%20card.png';
    }
  };

  const imagePath = getImagePath(type);

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src={imagePath}
        alt={type}
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to icon if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallbackDiv = parent.querySelector('.fallback-icon') as HTMLElement;
            if (fallbackDiv) {
              fallbackDiv.style.display = 'flex';
            }
          }
        }}
      />
      <div
        className="fallback-icon absolute inset-0 flex items-center justify-center hidden"
        style={{ display: 'none' }}
      >
        {getFallbackIcon(type)}
      </div>
    </div>
  );
};

function getFallbackIcon(type: string): JSX.Element {
  switch (type) {
    case 'paypal':
      return <span className="text-blue-500 font-bold text-xs">P</span>;
    case 'google':
      return <span className="text-blue-600 font-bold text-xs">G</span>;
    case 'apple':
      return <span className="text-gray-800 font-bold text-xs">A</span>;
    case 'mastercard':
      return <CreditCard className="w-full h-full text-primary" />;
    case 'visa':
      return <CreditCard className="w-full h-full text-blue-500" />;
    case 'amex':
      return <CreditCard className="w-full h-full text-green-500" />;
    case 'cash':
      return <DollarSign className="w-full h-full text-green-500" />;
    default:
      return <CreditCard className="w-full h-full text-primary" />;
  }
}

export default PaymentIcon;
