import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface DeliveryMapProps {
  orderId: string;
  showRoute?: boolean;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ orderId, showRoute = true }) => {
  const [driverLocation, setDriverLocation] = useState({ lat: -33.9249, lng: 18.4241 }); // Cape Town coordinates
  const [userLocation] = useState({ lat: -33.9289, lng: 18.4174 }); // User location (nearby)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate driver movement
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 3000);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-gradient-to-br from-green-900 to-green-800 rounded-lg overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute w-full h-px bg-gray-600" style={{ top: `${i * 5}%` }} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute h-full w-px bg-gray-600" style={{ left: `${i * 5}%` }} />
          ))}
        </div>

        {/* Route line */}
        {showRoute && (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 20 80 Q 40 60 60 40 T 80 20"
              stroke="#10B981"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2,2"
              className="animate-pulse"
            />
          </svg>
        )}
      </div>

      {/* Driver Location */}
      <div className="absolute" style={{
        left: `${40 + (driverLocation.lng - 18.4241) * 1000}%`,
        top: `${40 + (driverLocation.lat + 33.9249) * 1000}%`,
        transform: 'translate(-50%, -50%)'
      }}>
        <div className="relative">
          <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50">
            <Navigation className="w-4 h-4 text-white absolute top-1 left-1" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-dark text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Driver
            </div>
          </div>
        </div>
      </div>

      {/* User Location */}
      <div className="absolute" style={{
        left: `${45 + (userLocation.lng - 18.4174) * 1000}%`,
        top: `${45 + (userLocation.lat + 33.9289) * 1000}%`,
        transform: 'translate(-50%, -50%)'
      }}>
        <div className="relative">
          <div className="w-6 h-6 bg-primary rounded-full shadow-lg shadow-primary/50">
            <MapPin className="w-4 h-4 text-white absolute top-1 left-1" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-dark text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              You
            </div>
          </div>
        </div>
      </div>

      {/* Map Legend - Mobile responsive */}
      <div className="absolute bottom-2 left-2 right-2 bg-dark/80 backdrop-blur-sm rounded-lg p-2 md:p-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Driver</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-gray-300">You</span>
          </div>
          {showRoute && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-gray-300">Route</span>
            </div>
          )}
        </div>
      </div>

      {/* ETA Info - Mobile responsive */}
      <div className="absolute top-2 right-2 bg-dark/80 backdrop-blur-sm rounded-lg p-2 md:p-3">
        <div className="text-center">
          <div className="text-primary font-bold text-sm md:text-base">15 min</div>
          <div className="text-gray-400 text-xs">ETA</div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
