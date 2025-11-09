import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader } from 'lucide-react';
import trackingService, { TrackingData } from '../services/trackingService';
import { SHOP_ADDRESS } from '../services/trackingService';

interface DeliveryMapProps {
  orderId: string;
  showRoute?: boolean;
  customerAddress?: string;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  orderId, 
  showRoute = true,
  customerAddress 
}) => {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    // Subscribe to tracking updates
    const unsubscribe = trackingService.subscribeToTracking(orderId, (trackingData) => {
      if (trackingData) {
        setTracking(trackingData);
        setError(null);
      } else {
        setError('Tracking not available for this order');
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [orderId]);

  // Calculate ETA (simple distance-based estimation)
  const calculateETA = (): string => {
    if (!tracking || !tracking.driverLocation || !tracking.customerLocation) {
      return 'Calculating...';
    }

    const driverLat = tracking.driverLocation.lat;
    const driverLng = tracking.driverLocation.lng;
    const customerLat = tracking.customerLocation.lat;
    const customerLng = tracking.customerLocation.lng;

    // Simple distance calculation (Haversine formula)
    const R = 6371; // Earth's radius in km
    const dLat = (customerLat - driverLat) * Math.PI / 180;
    const dLng = (customerLng - driverLng) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(driverLat * Math.PI / 180) * Math.cos(customerLat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    // Estimate time (assuming average speed of 30 km/h in city)
    const estimatedMinutes = Math.round((distance / 30) * 60);
    return `${Math.max(5, estimatedMinutes)} min`;
  };

  // Generate Google Maps URL - Show area with both locations
  const getMapUrl = (): string => {
    if (!tracking) {
      // Show shop location if no tracking
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.714352417745!2d${SHOP_ADDRESS.lng}!3d${SHOP_ADDRESS.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95732cb5a3d97b%3A0xde6336359d73b224!2sBear%20%26%20Bean%20Coffee!5e0!3m2!1sen!2sza!4v1761775093158!5m2!1sen!2sza`;
    }

    const driverLat = tracking.driverLocation.lat;
    const driverLng = tracking.driverLocation.lng;
    const customerLat = tracking.customerLocation.lat;
    const customerLng = tracking.customerLocation.lng;

    // Calculate center and zoom to show both locations
    const centerLat = (driverLat + customerLat) / 2;
    const centerLng = (driverLng + customerLng) / 2;
    
    // Calculate approximate zoom level based on distance
    const latDiff = Math.abs(driverLat - customerLat);
    const lngDiff = Math.abs(driverLng - customerLng);
    const maxDiff = Math.max(latDiff, lngDiff);
    let zoom = 13;
    if (maxDiff > 0.1) zoom = 11;
    else if (maxDiff > 0.05) zoom = 12;
    else if (maxDiff > 0.02) zoom = 13;
    else if (maxDiff > 0.01) zoom = 14;
    else zoom = 15;
    
    // Use a simple Google Maps embed with center and zoom
    // Note: This is a basic view. For production, consider using Google Maps JavaScript API
    // or a mapping library like Leaflet.js with OpenStreetMap
    return `https://www.google.com/maps?q=${centerLat},${centerLng}&z=${zoom}&output=embed`;
  };

  if (isLoading) {
    return (
      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: '#D4A76A' }} />
          <p className="text-gray-400 text-sm">Loading tracking...</p>
        </div>
      </div>
    );
  }

  if (error || !tracking || !tracking.isActive) {
    return (
      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center rounded-2xl overflow-hidden" style={{ border: '1px solid #D4A76A40' }}>
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400 text-sm mb-2">
            {error || 'Live tracking not available'}
          </p>
          <p className="text-gray-500 text-xs">
            {!tracking?.isActive && tracking ? 'Tracking has ended' : 'Waiting for driver assignment and order completion'}
          </p>
        </div>
      </div>
    );
  }

  const eta = calculateETA();
  const mapUrl = getMapUrl();

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg" style={{ border: '1px solid #D4A76A40' }}>
      {/* Google Maps Embed */}
      <iframe 
        src={mapUrl}
        width="100%" 
        height="100%" 
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Live Delivery Tracking"
        className="w-full h-full"
      />
      
      {/* Overlay with tracking info */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
        {/* Driver status */}
        <div className="bg-dark/90 backdrop-blur-sm rounded-lg p-2 px-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">Driver on the way</span>
          </div>
        </div>

        {/* ETA */}
        <div className="bg-dark/90 backdrop-blur-sm rounded-lg p-2 px-3">
          <div className="text-center">
            <div className="font-bold text-sm md:text-base" style={{ color: '#D4A76A' }}>{eta}</div>
            <div className="text-gray-400 text-xs">ETA</div>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-2 left-2 right-2 bg-dark/90 backdrop-blur-sm rounded-lg p-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-300">Driver</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3" style={{ color: '#D4A76A' }}>
              <MapPin className="w-3 h-3" />
            </div>
            <span className="text-gray-300">Your Location</span>
          </div>
          {showRoute && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-gray-300">Route</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
