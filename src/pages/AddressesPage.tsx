import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MoreVertical, MapPin, Home, Building, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import BottomNav from '../components/BottomNav';

// Get addresses from local storage or use empty array if none exist
const getAddresses = () => {
  if (typeof window !== 'undefined') {
    const savedAddresses = localStorage.getItem('userAddresses');
    return savedAddresses ? JSON.parse(savedAddresses) : [];
  }
  return [];
};

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
  const [addresses, setAddresses] = useState(getAddresses());

  const handleBack = () => {
    navigate('/checkout');
  };

  const handleSelectAddress = (address: any) => {
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

  const filteredAddresses = addresses.filter((address: any) =>
    address.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (address.city && address.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedAddresses = addresses.filter((addr: any) => addr.id !== id);
    setAddresses(updatedAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    toast.success('Address deleted successfully');
  };

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
        <div className="mt-6 space-y-4">
          {filteredAddresses.map((address: any) => (
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
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-medium">{address.title}</h3>
                    <div className="flex space-x-2">
                      {address.isDefault && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      <button 
                        onClick={(e) => handleDeleteAddress(address.id, e)}
                        className="text-red-500 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-caption text-gray-300 mb-1">{address.address}</p>
                  <p className="text-caption text-gray-300">{address.city}, {address.postalCode}</p>
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
