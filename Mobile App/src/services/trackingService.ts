import { db } from '../firebase/config';
import { doc, setDoc, onSnapshot, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';

import { geocodeAddress, SHOP_COORDINATES } from '../utils/geocoding';

// Shop address coordinates (Rosebank Mall, Johannesburg)
export const SHOP_ADDRESS = {
  address: 'Bear & Bean Coffee, Rosebank Mall, Johannesburg, 2196',
  lat: SHOP_COORDINATES.lat,
  lng: SHOP_COORDINATES.lng
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
        // Try to geocode the address
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
      console.log('Tracking started for order:', orderId);
    } catch (error) {
      console.error('Error starting tracking:', error);
      throw error;
    }
  },

  // Update driver location
  updateDriverLocation: async (orderId: string, location: DriverLocation) => {
    try {
      const trackingRef = doc(db, 'orderTracking', orderId);
      await updateDoc(trackingRef, {
        'driverLocation': {
          lat: location.lat,
          lng: location.lng,
          timestamp: Date.now(),
          heading: location.heading,
          speed: location.speed
        },
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating driver location:', error);
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
      console.log('Tracking stopped for order:', orderId);
    } catch (error) {
      console.error('Error stopping tracking:', error);
      throw error;
    }
  },

  // Subscribe to tracking updates
  subscribeToTracking: (orderId: string, callback: (tracking: TrackingData | null) => void) => {
    const trackingRef = doc(db, 'orderTracking', orderId);
    
    return onSnapshot(trackingRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          callback(data as TrackingData);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error subscribing to tracking:', error);
        callback(null);
      }
    );
  },

  // Get tracking data
  getTracking: async (orderId: string): Promise<TrackingData | null> => {
    try {
      const trackingRef = doc(db, 'orderTracking', orderId);
      const snapshot = await getDoc(trackingRef);
      if (snapshot.exists()) {
        return snapshot.data() as TrackingData;
      }
      return null;
    } catch (error) {
      console.error('Error getting tracking data:', error);
      return null;
    }
  }
};

export default trackingService;

