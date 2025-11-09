// Geocoding utility to convert addresses to coordinates
// For production, use Google Geocoding API or similar service

export interface Coordinates {
  lat: number;
  lng: number;
}

// Simple geocoding using a basic service (for demo)
// In production, use Google Geocoding API
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    // Use OpenStreetMap Nominatim API (free, no key required)
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'BearNBeanCoffeeApp/1.0' // Required by Nominatim
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
    // Return default coordinates (Johannesburg center) if geocoding fails
    return {
      lat: -26.2041,
      lng: 28.0473
    };
  }
};

// Shop address coordinates (Rosebank Mall, Johannesburg)
export const SHOP_COORDINATES: Coordinates = {
  lat: -26.1467,
  lng: 28.0436
};

