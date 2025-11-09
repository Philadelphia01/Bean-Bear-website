import { db } from '../firebase/config';
import { doc, setDoc, onSnapshot, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';

// Shop address coordinates (Rosebank Mall, Johannesburg)
export const SHOP_ADDRESS = {
  address: 'Bear & Bean Coffee, Rosebank Mall, Johannesburg, 2196',
  lat: -26.1467,
  lng: 28.0436
};

export interface DriverLocation {
  lat: number;
  lng: number;
  timestamp: number;
  heading?: number;
  speed?: number;
}

export interface TrackingData {
  orderId: string;
  driverId: string;
  driverLocation: DriverLocation;
  shopLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  customerLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  isActive: boolean;
  startedAt: any;
  stoppedAt?: any;
}

// Simple geocoding function (for demo - use proper geocoding service in production)
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'BearNBeanCoffeeApp/1.0'
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return {
      lat: SHOP_ADDRESS.lat,
      lng: SHOP_ADDRESS.lng
    };
  }
};

const trackingService = {
  // Start tracking for an order
  startTracking: async (orderId: string, driverId: string, customerAddress: string, customerLat?: number, customerLng?: number) => {
    try {
      const trackingRef = doc(db, 'orderTracking', orderId);
      
      // Geocode customer address if coordinates not provided
      let customerLocation = {
        lat: customerLat || SHOP_ADDRESS.lat,
        lng: customerLng || SHOP_ADDRESS.lng,
        address: customerAddress
      };
      
      if (!customerLat || !customerLng) {
        const coords = await geocodeAddress(customerAddress);
        if (coords) {
          customerLocation.lat = coords.lat;
          customerLocation.lng = coords.lng;
        }
      }

      // Initialize tracking data
      const trackingData: TrackingData = {
        orderId,
        driverId,
        driverLocation: {
          lat: SHOP_ADDRESS.lat, // Start at shop
          lng: SHOP_ADDRESS.lng,
          timestamp: Date.now()
        },
        shopLocation: {
          lat: SHOP_ADDRESS.lat,
          lng: SHOP_ADDRESS.lng,
          address: SHOP_ADDRESS.address
        },
        customerLocation,
        isActive: true,
        startedAt: serverTimestamp()
      };

      await setDoc(trackingRef, trackingData);
      console.log('✅ Tracking started for order:', orderId);
    } catch (error) {
      console.error('Error starting tracking:', error);
      throw error;
    }
  },

  // Stop tracking
  stopTracking: async (orderId: string) => {
    try {
      const trackingRef = doc(db, 'orderTracking', orderId);
      await updateDoc(trackingRef, {
        isActive: false,
        stoppedAt: serverTimestamp()
      });
      console.log('🛑 Tracking stopped for order:', orderId);
    } catch (error) {
      console.error('Error stopping tracking:', error);
      throw error;
    }
  }
};

export default trackingService;

