import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MoreVertical, MapPin, Phone, Home, Building, Building2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';

// Mock address data with contextual icons
const mockAddresses = [
  {
    id: '1',
    title: 'Home',
    address: '123 Oak Avenue, Sandton',
    city: 'Johannesburg',
    postalCode: '2196',
    phone: '+27 81 234 5678',
    isDefault: true,
    icon: 'home'
  },
  {
    id: '2',
    title: 'Office',
    address: '45 Business Park Drive, Rosebank',
    city: 'Johannesburg',
    postalCode: '2196',
    phone: '+27 81 234 5679',
    isDefault: false,
    icon: 'office'
  },
  {
    id: '3',
    title: 'Mom\'s House',
    address: '78 Garden Street, Parktown',
    city: 'Johannesburg',
    postalCode: '2193',
    phone: '+27 81 234 5680',
    isDefault: false,
    icon: 'house'
  }
];

const getAddressIcon = (title: string, iconType: string) => {
  const titleLower = title.toLowerCase();

  if (iconType === 'home' || titleLower.includes('home')) {
    return <Home className="w-6 h-6" style={{ color: '#D4A76A' }} />;
  } else if (iconType === 'office' || titleLower.includes('office') || titleLower.includes('work')) {
    return <Building className="w-6 h-6" style={{ color: '#D4A76A' }} />;
  } else if (titleLower.includes('mom') || titleLower.includes('grandmother') || titleLower.includes('house')) {
    return <Building2 className="w-6 h-6" style={{ color: '#D4A76A' }} />;
  } else {
    return <MapPin className="w-6 h-6" style={{ color: '#D4A76A' }} />;
  }
};

const AddressesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleBack = () => {
    navigate('/checkout');
  };

  const handleSelectAddress = (address: typeof mockAddresses[0]) => {
    navigate('/checkout', {
      state: {
        selectedAddress: {
          title: address.title,
          address: address.address,
          city: address.city,
          postalCode: address.postalCode,
          phone: address.phone
        }
      }
    });
  };

  const filteredAddresses = mockAddresses.filter(address =>
    address.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-4 py-6 bg-gray-900/20">
        <div className="relative">
          <button
            onClick={handleBack}
            className="absolute left-0 top-0 flex items-center p-2 rounded-xl transition-all duration-200"
            style={{ color: '#D4A76A' }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="pt-8 flex items-center justify-center">
            <h1 className="text-title text-white">Addresses</h1>
          </div>

          <button className="absolute right-0 top-0 flex items-center transition-colors" style={{ color: '#D4A76A' }}>
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Search Field */}
      <div className="px-4 py-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#D4A76A' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => navigate('/new-address')}
            className="w-full pl-12 pr-4 py-3 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm shadow-lg cursor-pointer"
            style={{ backgroundColor: '#1E1E1E', border: `1px solid #D4A76A40`, borderRadius: '20px' }}
            placeholder="Find an Address"
          />
        </div>
      </div>

      {/* Address List */}
      <div className="px-4 pb-8">
        <div className="space-y-4">
          {filteredAddresses.map((address) => (
            <div
              key={address.id}
              onClick={() => handleSelectAddress(address)}
              className={`relative p-4 rounded-2xl transition-all duration-200 cursor-pointer backdrop-blur-sm shadow-lg ${
                address.isDefault ? 'shadow-orange-400/20' : ''
              }`}
              style={{
                backgroundColor: '#1E1E1E',
                border: address.isDefault ? `2px solid #D4A76A` : `1px solid #D4A76A40`,
                borderRadius: '20px'
              }}
            >
              {/* Default Badge */}
              {address.isDefault && (
                <div className="absolute -top-2 -right-2 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                     style={{ backgroundColor: '#D4A76A', fontSize: '10px', padding: '4px 8px', borderRadius: '12px' }}>
                  Default
                </div>
              )}

              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                     style={{
                       backgroundColor: address.isDefault ? '#D4A76A20' : '#2B2B2B',
                       border: `1px solid ${address.isDefault ? '#D4A76A60' : '#D4A76A40'}`
                     }}>
                  {getAddressIcon(address.title, address.icon)}
                </div>

                {/* Address Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-body font-semibold text-white mb-1">{address.title}</h3>
                  <p className="text-caption text-gray-300 mb-1">{address.address}</p>
                  <p className="text-caption text-gray-300 mb-1">{address.city}, {address.postalCode}</p>
                  <p className="text-small text-gray-400 flex items-center">
                    <Phone className="w-3 h-3 mr-1 text-gray-400" />
                    {address.phone}
                  </p>
                </div>

                {/* Menu Button */}
                <button className="flex-shrink-0 transition-colors" style={{ color: '#D4A76A' }}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default AddressesPage;
