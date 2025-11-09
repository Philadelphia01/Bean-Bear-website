import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import trackingService, { TrackingData } from '../services/trackingService';
import { SHOP_ADDRESS } from '../services/trackingService';

// Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoicGhpbGFzIiwiYSI6ImNtaHMyNW8xdDE3YmsybHM0bW14cXQ4eTcifQ.BUG_qicEG4n1PV2DjnCK0w';
mapboxgl.accessToken = MAPBOX_TOKEN;

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routeLayerRef = useRef<string | null>(null);
  const mapInitializedRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    // Subscribe to tracking updates
    const unsubscribe = trackingService.subscribeToTracking(orderId, (trackingData) => {
      console.log('📡 Tracking data received:', trackingData);
      if (trackingData) {
        setTracking(trackingData);
        setError(null);
      } else {
        setError('Tracking not available for this order');
        setTracking(null);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [orderId]);

  // Initialize Mapbox map - always initialize, even without tracking
  useEffect(() => {
    if (!mapContainer.current) {
      console.log('⏳ Map container not ready');
      return;
    }

    if (mapInitializedRef.current || map.current) {
      console.log('⏳ Map already initialized');
      return;
    }

    console.log('🗺️ Initializing Mapbox map...');

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [SHOP_ADDRESS.lng, SHOP_ADDRESS.lat],
        zoom: 13,
        attributionControl: false,
        antialias: true
      });

      mapInitializedRef.current = true;

      // Add error handler
      map.current.on('error', (e) => {
        console.error('❌ Mapbox error:', e);
        setError('Failed to load map');
      });

      // Add compact navigation controls
      map.current.addControl(new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: false
      }), 'top-right');

      // Wait for map to load
      const handleLoad = () => {
        console.log('✅ Map loaded successfully');
        setMapLoaded(true);
      };

      map.current.on('load', handleLoad);
      map.current.on('style.load', handleLoad);

      // Force set loaded after a delay if event doesn't fire
      const loadTimeout = setTimeout(() => {
        if (map.current) {
          console.log('⏰ Map load timeout - forcing loaded state');
          setMapLoaded(true);
        }
      }, 2000);

      return () => {
        clearTimeout(loadTimeout);
        if (map.current) {
          map.current.remove();
          map.current = null;
          mapInitializedRef.current = false;
          setMapLoaded(false);
        }
      };
    } catch (error) {
      console.error('❌ Error initializing map:', error);
      setError('Failed to load map');
      mapInitializedRef.current = false;
    }
  }, []); // Empty dependency array - only run once

  // Helper function to create motorbike marker (red with yellow outline) - like Google Maps
  const createMotorbikeMarker = () => {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '44px';
    container.style.height = '44px';
    container.className = 'driver-marker-container';
    
    // Glowing outer ring (neon effect) - GREEN
    const glowRing = document.createElement('div');
    glowRing.className = 'glow-ring';
    glowRing.style.position = 'absolute';
    glowRing.style.width = '100%';
    glowRing.style.height = '100%';
    glowRing.style.borderRadius = '50%';
    glowRing.style.opacity = '0.6';
    glowRing.style.zIndex = '8';
    glowRing.style.top = '0';
    glowRing.style.left = '0';
    container.appendChild(glowRing);
    
    // Yellow outline circle with glowing effect
    const outline = document.createElement('div');
    outline.className = 'glowing-outline';
    outline.style.position = 'absolute';
    outline.style.width = '100%';
    outline.style.height = '100%';
    outline.style.top = '0';
    outline.style.left = '0';
    outline.style.borderRadius = '50%';
    outline.style.backgroundColor = '#FFD700'; // Bright yellow
    outline.style.border = '2px solid white';
    outline.style.zIndex = '10';
    
    // Red motorbike icon with buzzing animation - larger and perfectly centered
    const motorbikeIcon = document.createElement('div');
    motorbikeIcon.innerHTML = '🏍️';
    motorbikeIcon.className = 'buzzing-icon';
    motorbikeIcon.style.position = 'absolute';
    motorbikeIcon.style.top = '50%';
    motorbikeIcon.style.left = '50%';
    motorbikeIcon.style.fontSize = '34px';
    motorbikeIcon.style.lineHeight = '1';
    motorbikeIcon.style.width = '34px';
    motorbikeIcon.style.height = '34px';
    motorbikeIcon.style.display = 'flex';
    motorbikeIcon.style.alignItems = 'center';
    motorbikeIcon.style.justifyContent = 'center';
    motorbikeIcon.style.margin = '0';
    motorbikeIcon.style.padding = '0';
    motorbikeIcon.style.zIndex = '11';
    motorbikeIcon.style.pointerEvents = 'none';
    // Set initial transform to center immediately (animation will override but maintain centering)
    motorbikeIcon.style.transform = 'translate(-50%, -50%)';
    outline.appendChild(motorbikeIcon);
    
    container.appendChild(outline);
    return container;
  };

  // Helper function to create red location pin marker - like Google Maps
  const createLocationPinMarker = () => {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '50px';
    container.style.height = '64px';
    
    // Red pin SVG (matching Google Maps style)
    const pinSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pinSvg.setAttribute('width', '50');
    pinSvg.setAttribute('height', '64');
    pinSvg.setAttribute('viewBox', '0 0 50 64');
    pinSvg.style.position = 'absolute';
    pinSvg.style.top = '0';
    pinSvg.style.left = '0';
    
    // Pin shadow
    const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shadow.setAttribute('d', 'M25 58C25 58 10 45 10 28C10 14 17 4 25 4C33 4 40 14 40 28C40 45 25 58 25 58Z');
    shadow.setAttribute('fill', 'rgba(0,0,0,0.2)');
    shadow.setAttribute('transform', 'translate(2, 2)');
    pinSvg.appendChild(shadow);
    
    // Red pin body
    const pinBody = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pinBody.setAttribute('d', 'M25 56C25 56 10 43 10 26C10 12 17 2 25 2C33 2 40 12 40 26C40 43 25 56 25 56Z');
    pinBody.setAttribute('fill', '#EA4335'); // Bright red (Google Maps red)
    pinBody.setAttribute('stroke', '#C5221F');
    pinBody.setAttribute('stroke-width', '1');
    pinSvg.appendChild(pinBody);
    
    // White center circle
    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', '25');
    centerCircle.setAttribute('cy', '26');
    centerCircle.setAttribute('r', '8');
    centerCircle.setAttribute('fill', 'white');
    centerCircle.setAttribute('stroke', '#EA4335');
    centerCircle.setAttribute('stroke-width', '2');
    pinSvg.appendChild(centerCircle);
    
    // Inner dot
    const innerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerDot.setAttribute('cx', '25');
    innerDot.setAttribute('cy', '26');
    innerDot.setAttribute('r', '4');
    innerDot.setAttribute('fill', '#EA4335');
    pinSvg.appendChild(innerDot);
    
    container.appendChild(pinSvg);
    
    // Set anchor point to bottom center of pin
    container.style.transform = 'translate(-50%, -100%)';
    
    return container;
  };

  // Update map when tracking data changes
  useEffect(() => {
    if (!map.current || !mapLoaded) {
      console.log('⏳ Map not ready yet', { mapExists: !!map.current, mapLoaded });
      return;
    }

    // Function to update markers and route
    const updateMapMarkers = () => {
      if (!map.current || !mapLoaded) {
        console.log('⏳ Map not ready for markers');
        return;
      }

      // If no tracking, show shop location with a marker
      if (!tracking || !tracking.isActive) {
        console.log('📍 No active tracking, showing shop location');
        
        // Remove existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Remove route if exists
        if (routeLayerRef.current) {
          const routeLayerId = routeLayerRef.current;
          if (map.current.getLayer(routeLayerId)) {
            map.current.removeLayer(routeLayerId);
          }
          if (map.current.getLayer(routeLayerId + '-outline')) {
            map.current.removeLayer(routeLayerId + '-outline');
          }
        }
        if (map.current.getSource('route')) {
          map.current.removeSource('route');
        }
        routeLayerRef.current = null;

        // Show shop marker - Red motorbike with yellow outline (like Google Maps)
        const shopMarkerEl = createMotorbikeMarker();
        const shopMarker = new mapboxgl.Marker({
          element: shopMarkerEl,
          anchor: 'center'
        })
          .setLngLat([SHOP_ADDRESS.lng, SHOP_ADDRESS.lat])
          .addTo(map.current);
        markersRef.current.push(shopMarker);

        // Center on shop
        map.current.setCenter([SHOP_ADDRESS.lng, SHOP_ADDRESS.lat]);
        map.current.setZoom(13);
        return;
      }

      console.log('📍 Updating map with tracking data:', tracking);

      const driverLat = tracking.driverLocation.lat;
      const driverLng = tracking.driverLocation.lng;
      const customerLat = tracking.customerLocation.lat;
      const customerLng = tracking.customerLocation.lng;
      const shopLat = tracking.shopLocation.lat;
      const shopLng = tracking.shopLocation.lng;

      // Remove existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Remove existing route layers if they exist
      if (routeLayerRef.current) {
        const routeLayerId = routeLayerRef.current;
        if (map.current.getLayer(routeLayerId)) {
          map.current.removeLayer(routeLayerId);
        }
      }
      if (map.current.getSource('route')) {
        map.current.removeSource('route');
      }
      routeLayerRef.current = null;

      // Add driver/shop marker - Red motorbike with yellow outline (like Google Maps)
      const driverMarkerEl = createMotorbikeMarker();
      const driverMarker = new mapboxgl.Marker({
        element: driverMarkerEl,
        anchor: 'center'
      })
        .setLngLat([driverLng, driverLat])
        .addTo(map.current);
      markersRef.current.push(driverMarker);
      console.log('✅ Driver marker (motorbike) added at:', driverLat, driverLng);

      // Add customer marker - Bright red location pin (like Google Maps)
      const customerMarkerEl = createLocationPinMarker();
      const customerMarker = new mapboxgl.Marker({
        element: customerMarkerEl,
        anchor: 'bottom'
      })
        .setLngLat([customerLng, customerLat])
        .addTo(map.current);
      markersRef.current.push(customerMarker);
      console.log('✅ Customer marker (red pin) added at:', customerLat, customerLng);

      // Calculate bounds to fit driver and customer markers only
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([driverLng, driverLat]);
      bounds.extend([customerLng, customerLat]);
      map.current.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 50, right: 50 },
        maxZoom: 15,
        duration: 1000
      });

      // Draw route line - from driver to customer (direct route)
      if (showRoute) {
        console.log('🛣️ Drawing route line...');
        // Route goes directly from driver's current location to customer
        const coordinates = [
          [driverLng, driverLat],
          [customerLng, customerLat]
        ];

        const routeSourceId = 'route';
        const routeLayerId = 'route-layer';

        // Add route source
        map.current.addSource(routeSourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          }
        });

        // Add route layer - Light blue like Google Maps
        routeLayerRef.current = routeLayerId;
        map.current.addLayer({
          id: routeLayerId,
          type: 'line',
          source: routeSourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4285F4', // Light blue (Google Maps route color)
            'line-width': 6,
            'line-opacity': 0.9
          }
        });

        console.log('✅ Route line added');
      }
    };

    // Wait for map to be fully loaded before updating markers
    const checkAndUpdate = () => {
      if (map.current && map.current.isStyleLoaded()) {
        updateMapMarkers();
      } else if (map.current) {
        map.current.once('style.load', updateMapMarkers);
        // Also try after a short delay
        setTimeout(() => {
          if (map.current && map.current.isStyleLoaded()) {
            updateMapMarkers();
          }
        }, 500);
      }
    };

    checkAndUpdate();
  }, [tracking, showRoute, mapLoaded]);

  // Calculate ETA
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

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ border: '2px solid #D4A76A', height: '350px', backgroundColor: '#1a1a1a' }}>
      {/* Mapbox Map Container - Always show */}
      <div 
        ref={mapContainer} 
        className="w-full h-full" 
        style={{ minHeight: '350px' }}
      />
      
      {/* Loading overlay - only show if map not loaded */}
      {isLoading && !mapLoaded && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: '#D4A76A' }} />
            <p className="text-gray-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Info message when waiting for tracking - don't block map */}
      {!tracking && !isLoading && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 pointer-events-none z-30">
          <p className="text-white text-xs text-center font-medium">
            {error || 'Waiting for driver assignment and order completion'}
          </p>
      </div>
      )}
      
      {/* ETA Badge - Only show when tracking is active */}
      {tracking && tracking.isActive && (
        <div className="absolute top-2 right-2 bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-white/30 pointer-events-none z-30 shadow-lg">
          <div className="text-center">
            <div className="font-bold text-sm" style={{ color: '#D4A76A' }}>{calculateETA()}</div>
            <div className="text-gray-300 text-[9px] font-medium">ETA</div>
          </div>
        </div>
      )}

      {/* Live Status Indicator - Only show when tracking is active */}
      {tracking && tracking.isActive && (
        <div className="absolute top-2 left-2 bg-green-500/95 backdrop-blur-sm rounded-full px-3 py-1.5 pointer-events-none z-30 shadow-lg border-2 border-white/30">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-[10px] font-bold">LIVE</span>
          </div>
        </div>
      )}

      {/* Add CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.9;
          }
        }
        
        /* Glowing animation for neon effect - BRIGHT GREEN */
        @keyframes glow {
          0%, 100% {
            box-shadow: 
              0 0 5px rgba(0, 255, 0, 0.9),
              0 0 10px rgba(0, 255, 0, 0.7),
              0 0 15px rgba(0, 255, 0, 0.5),
              0 0 20px rgba(0, 255, 0, 0.4),
              inset 0 0 10px rgba(0, 255, 0, 0.3);
          }
          50% {
            box-shadow: 
              0 0 10px rgba(0, 255, 0, 1),
              0 0 20px rgba(0, 255, 0, 0.9),
              0 0 30px rgba(0, 255, 0, 0.7),
              0 0 40px rgba(0, 255, 0, 0.5),
              inset 0 0 15px rgba(0, 255, 0, 0.4);
          }
        }
        
        /* Glow ring animation (outer glow) - BRIGHT GREEN */
        @keyframes glowRing {
          0%, 100% {
            box-shadow: 
              0 0 8px rgba(0, 255, 0, 0.7),
              0 0 16px rgba(0, 255, 0, 0.5),
              0 0 24px rgba(0, 255, 0, 0.3);
            transform: scale(1.2);
            opacity: 0.6;
          }
          50% {
            box-shadow: 
              0 0 12px rgba(0, 255, 0, 0.9),
              0 0 24px rgba(0, 255, 0, 0.7),
              0 0 36px rgba(0, 255, 0, 0.5);
            transform: scale(1.3);
            opacity: 0.8;
          }
        }
        
        /* Buzzing/vibration animation - works with translate(-50%, -50%) centering */
        @keyframes buzz {
          0%, 100% {
            transform: translate(-50%, -50%) translate(0, 0) rotate(0deg);
          }
          5% {
            transform: translate(-50%, -50%) translate(-0.5px, -0.5px) rotate(-0.3deg);
          }
          10% {
            transform: translate(-50%, -50%) translate(0.5px, 0.5px) rotate(0.3deg);
          }
          15% {
            transform: translate(-50%, -50%) translate(-0.5px, 0.5px) rotate(-0.3deg);
          }
          20% {
            transform: translate(-50%, -50%) translate(0.5px, -0.5px) rotate(0.3deg);
          }
          25% {
            transform: translate(-50%, -50%) translate(-0.3px, -0.3px) rotate(-0.2deg);
          }
          30% {
            transform: translate(-50%, -50%) translate(0.3px, 0.3px) rotate(0.2deg);
          }
          35% {
            transform: translate(-50%, -50%) translate(-0.3px, 0.3px) rotate(-0.2deg);
          }
          40% {
            transform: translate(-50%, -50%) translate(0.3px, -0.3px) rotate(0.2deg);
          }
          45% {
            transform: translate(-50%, -50%) translate(-0.5px, -0.5px) rotate(-0.3deg);
          }
          50% {
            transform: translate(-50%, -50%) translate(0.5px, 0.5px) rotate(0.3deg);
          }
          55% {
            transform: translate(-50%, -50%) translate(-0.5px, 0.5px) rotate(-0.3deg);
          }
          60% {
            transform: translate(-50%, -50%) translate(0.5px, -0.5px) rotate(0.3deg);
          }
          65% {
            transform: translate(-50%, -50%) translate(-0.3px, -0.3px) rotate(-0.2deg);
          }
          70% {
            transform: translate(-50%, -50%) translate(0.3px, 0.3px) rotate(0.2deg);
          }
          75% {
            transform: translate(-50%, -50%) translate(-0.3px, 0.3px) rotate(-0.2deg);
          }
          80% {
            transform: translate(-50%, -50%) translate(0.3px, -0.3px) rotate(0.2deg);
          }
          85% {
            transform: translate(-50%, -50%) translate(-0.5px, -0.5px) rotate(-0.3deg);
          }
          90% {
            transform: translate(-50%, -50%) translate(0.5px, 0.5px) rotate(0.3deg);
          }
          95% {
            transform: translate(-50%, -50%) translate(-0.5px, 0.5px) rotate(-0.3deg);
          }
        }
        
        /* Driver marker container - no animation, let the icon handle it */
        .driver-marker-container {
          /* Container doesn't buzz, only the icon */
        }
        
        /* Buzzing icon - applies animation while maintaining centering - BRIGHT GREEN glow */
        .buzzing-icon {
          animation: buzz 0.15s infinite;
          display: inline-block;
          filter: drop-shadow(0 2px 4px rgba(0, 255, 0, 0.9)) 
                  drop-shadow(0 0 8px rgba(0, 255, 0, 0.7));
        }
        
        /* Glowing outline effect - faster bright green glow */
        .glowing-outline {
          animation: glow 1s ease-in-out infinite;
        }
        
        /* Glow ring effect - BRIGHT GREEN and faster */
        .glow-ring {
          background: radial-gradient(circle, rgba(0, 255, 0, 0.5) 0%, transparent 70%);
          animation: glowRing 1s ease-in-out infinite;
        }
        
        .mapboxgl-map {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default DeliveryMap;

