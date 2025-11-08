import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Navigation, Globe, ArrowRight, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../firebase/services';

const NewAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: 'Johannesburg',
    postalCode: '',
    country: 'South Africa',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    navigate('/home/checkout');
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use OpenStreetMap Nominatim for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            
            setFormData(prev => ({
              ...prev,
              address: data.display_name.split(',')[0] || 'Current Location',
              city: data.address.city || data.address.town || data.address.village || 'Johannesburg',
              postalCode: data.address.postcode || '',
              country: data.address.country || 'South Africa'
            }));
            
            toast.success('Current location detected');
          } catch (error) {
            console.error('Error getting address from coordinates:', error);
            toast.error('Could not get address details');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not access your location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleSaveAddress = async () => {
    if (!formData.title || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create new address object
      const newAddress = {
        id: Date.now().toString(),
        title: formData.title,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone || '',
        isDefault: false, // Will be set by the service
        icon: formData.title.toLowerCase().includes('home') ? 'home' :
              formData.title.toLowerCase().includes('office') || formData.title.toLowerCase().includes('work') ? 'office' :
              'other'
      };

      if (!user) {
        toast.error('Please log in to save addresses');
        return;
      }
      await userService.addUserAddress(user.id, newAddress);
      toast.success('Address saved successfully!');
      // Navigate back to addresses page, which will then allow selection back to checkout
      navigate('/addresses');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-4 py-6" style={{ backgroundColor: '#000000' }}>
        <div className="relative">
          <div className="absolute left-0 top-0 flex items-center">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl transition-all duration-200"
              style={{ color: '#D4A76A' }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          </div>
          
          <div className="absolute right-0 top-0 flex items-center">
            <button
              className="p-2 rounded-xl transition-all duration-200"
              style={{ color: '#D4A76A' }}
              onClick={() => toast('More options')}
            >
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>

          <div className="pt-8 flex items-center justify-center">
            <h1 className="text-title text-white">New Address</h1>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-4 py-6 space-y-6">
        {/* Address Title */}
        <div>
          <label className="block text-caption font-medium text-gray-300 mb-2">
            Address Title
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: '#D4A76A' }} />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm shadow-lg"
              style={{
                backgroundColor: '#1E1E1E',
                border: `1px solid #D4A76A40`,
                borderRadius: '20px'
              }}
              placeholder="e.g., Home, Office, Mom's House"
            />
          </div>
        </div>

        {/* Map Preview */}
        <div>
          <label className="block text-caption font-medium text-gray-300 mb-2">
            Location
          </label>
          <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#1E1E1E', border: `1px solid #D4A76A40`, borderRadius: '20px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114584.73585386139!2d28.04002455!3d-26.1715215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c68f0406a51%3A0x238ac9d9b1d34041!2sJohannesburg!5e0!3m2!1sen!2sza!4v1761566230500!5m2!1sen!2sza"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            />
            {/* Location Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse" style={{ backgroundColor: '#D4A76A' }}></div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent mx-auto -mt-1" style={{ borderTopColor: '#D4A76A' }}></div>
            </div>
          </div>
        </div>

        {/* Use Current Location Button */}
        <button
          onClick={handleUseCurrentLocation}
          className="w-full py-4 rounded-2xl text-white transition-all duration-200 flex items-center justify-center backdrop-blur-sm shadow-lg"
          style={{
            backgroundColor: '#D4A76A20',
            border: `2px solid #D4A76A60`,
            borderRadius: '20px'
          }}
        >
          <Navigation className="w-5 h-5 mr-3" style={{ color: '#D4A76A' }} />
          <span className="text-body font-medium">Use my current location</span>
          <ArrowRight className="w-5 h-5 ml-3" style={{ color: '#D4A76A' }} />
        </button>

        {/* Address Details */}
        <div className="space-y-4">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm shadow-lg"
            style={{
              backgroundColor: '#1E1E1E',
              border: `1px solid #D4A76A40`,
              borderRadius: '20px'
            }}
            placeholder="Street address"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm shadow-lg"
              style={{
                backgroundColor: '#1E1E1E',
                border: `1px solid #D4A76A40`,
                borderRadius: '20px'
              }}
              placeholder="City"
            />
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm shadow-lg"
              style={{
                backgroundColor: '#1E1E1E',
                border: `1px solid #D4A76A40`,
                borderRadius: '20px'
              }}
              placeholder="Postal Code"
            />
          </div>
        </div>

        {/* Country/Region Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country/Region
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                   style={{ color: '#D4A76A' }} />
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 rounded-2xl text-white focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm shadow-lg appearance-none"
              style={{
                backgroundColor: '#1E1E1E',
                border: `1px solid #D4A76A40`,
                borderRadius: '20px'
              }}
            >
              <option value="South Africa">South Africa</option>
              <option value="Botswana">Botswana</option>
              <option value="Namibia">Namibia</option>
              <option value="Zimbabwe">Zimbabwe</option>
              <option value="Mozambique">Mozambique</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="px-4 pb-8">
        <button
          onClick={handleSaveAddress}
          className="w-full py-4 text-black rounded-2xl transition-all duration-200 font-bold text-lg shadow-lg"
          style={{
            backgroundColor: '#D4A76A',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(212, 167, 106, 0.3)'
          }}
        >
          <span className="text-body font-bold">Save Address</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default NewAddressPage;
