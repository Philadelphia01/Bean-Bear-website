import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../firebase/services';
import { ChevronLeft, Search, MoreVertical, MapPin, Home, Building, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import BottomNav from '../components/BottomNav';

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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAddresses = async () => {
      if (user) {
        try {
          const userAddresses = await userService.getUserAddresses(user.id);
          setAddresses(userAddresses);
        } catch (error) {
          console.error('Error loading addresses:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [user]);

  const handleBack = () => {
    navigate('/home/checkout');
  };

  const handleSelectAddress = (address: any) => {
    navigate('/home/checkout', {
      state: {
        selectedAddress: address
      }
    });
  };

  const filteredAddresses = addresses.filter((address: any) =>
    address.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (address.city && address.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteAddress = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await userService.deleteUserAddress(id);
      const updatedAddresses = addresses.filter((addr: any) => addr.id !== id);
      setAddresses(updatedAddresses);
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
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
            onFocus={() => {
              // Only navigate to new address if search is empty and user clicks to search
              // Don't auto-navigate on focus to avoid interfering with address selection
            }}
            className="w-full pl-12 pr-4 py-3 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm shadow-lg"
            style={{ backgroundColor: '#1E1E1E', border: `1px solid #D4A76A40`, borderRadius: '20px' }}
            placeholder="Search addresses or tap address to select"
          />
        </div>
      </div>

      {/* Add New Address Button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => navigate('/new-address')}
          className="w-full p-4 rounded-2xl transition-all duration-200 cursor-pointer backdrop-blur-sm shadow-lg flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#1E1E1E',
            border: `2px dashed #D4A76A60`,
            borderRadius: '20px'
          }}
        >
          <MapPin className="w-5 h-5" style={{ color: '#D4A76A' }} />
          <span className="text-white font-medium">Add New Address</span>
        </button>
      </div>

      {/* Address List */}
      <div className="px-4 pb-8">
        <div className="mt-2 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400">Loading addresses...</div>
            </div>
          ) : filteredAddresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400">No addresses found. Add a new address to continue.</div>
            </div>
          ) : filteredAddresses.map((address: any) => (
            <div
              key={address.id}
              onClick={() => {
                console.log('📍 Address card clicked:', address.id);
                handleSelectAddress(address);
              }}
              onTouchStart={(e) => {
                // Handle touch events for mobile
                e.currentTarget.style.opacity = '0.8';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
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
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Menu functionality can be added here if needed
                  }}
                  className="flex-shrink-0 transition-colors" 
                  style={{ color: '#D4A76A' }}
                >
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
