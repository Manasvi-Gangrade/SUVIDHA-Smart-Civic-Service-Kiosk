import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// =========================================================================
// 1. TYPE DEFINITIONS
// =========================================================================
export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface GeocodedAddress {
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  road?: string;
  suburb?: string;
  displayName: string;
}

export interface LocationTrackerContextValue {
  coords: LocationCoords | null;
  address: GeocodedAddress | null;
  isDetecting: boolean;
  error: string | null;
  source: 'gps' | 'ip' | 'cache' | null;
  detectLocation: () => void;
}

// =========================================================================
// 2. CONTEXT DECLARATION
// =========================================================================
const LocationTrackerContext = createContext<LocationTrackerContextValue>({
  coords: null,
  address: null,
  isDetecting: false,
  error: null,
  source: null,
  detectLocation: () => {},
});

// =========================================================================
// 3. PROVIDER COMPONENT
// =========================================================================
export const LocationTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [address, setAddress] = useState<GeocodedAddress | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'gps' | 'ip' | 'cache' | null>(null);

  // --- Helper: IP Geolocation Fallback ---
  const detectByIP = useCallback(async () => {
    try {
      setSource('ip');
      // Using ipapi.co (Free, no API key required for low volume testing)
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('IP geolocation service response failed');
      const data = await res.json();
      
      const ipCoords = {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude)
      };

      const ipAddress: GeocodedAddress = {
        city: data.city,
        state: data.region,
        country: data.country_name,
        postcode: data.postal,
        displayName: `${data.city ? data.city + ', ' : ''}${data.region}, ${data.country_name}`
      };

      setCoords(ipCoords);
      setAddress(ipAddress);
      
      // Cache values
      localStorage.setItem('kiosk_cached_coords', JSON.stringify(ipCoords));
      localStorage.setItem('kiosk_cached_address', JSON.stringify(ipAddress));
      localStorage.setItem('kiosk_cached_source', 'ip');
      setError(null);
    } catch (err: any) {
      setError(`IP detection failed: ${err.message}`);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  // --- Helper: Reverse Geocode via Nominatim (OpenStreetMap) ---
  const reverseGeocode = useCallback(async (latitude: number, longitude: number): Promise<GeocodedAddress> => {
    // Free Nominatim endpoint - Requires user-agent parameter or header to prevent rate-limiting in production
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (!res.ok) throw new Error('OSM Reverse Geocoding failed');
    const data = await res.json();

    const addr = data.address || {};
    const city = addr.city || addr.town || addr.village || addr.county || addr.suburb;
    const state = addr.state;
    const country = addr.country;
    const postcode = addr.postcode;
    const road = addr.road;
    const suburb = addr.suburb;

    return {
      city,
      state,
      country,
      postcode,
      road,
      suburb,
      displayName: data.display_name
    };
  }, []);

  // --- Main Trigger: Detect Location ---
  const detectLocation = useCallback(() => {
    setIsDetecting(true);
    setError(null);

    if (typeof window === 'undefined') {
      setIsDetecting(false);
      return;
    }

    if (!('geolocation' in navigator)) {
      console.warn('GPS Geolocation not supported by browser. Falling back to IP.');
      detectByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const gpsCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setCoords(gpsCoords);
          setSource('gps');

          // Convert coordinates to address
          const gpsAddress = await reverseGeocode(gpsCoords.latitude, gpsCoords.longitude);
          setAddress(gpsAddress);

          // Cache values
          localStorage.setItem('kiosk_cached_coords', JSON.stringify(gpsCoords));
          localStorage.setItem('kiosk_cached_address', JSON.stringify(gpsAddress));
          localStorage.setItem('kiosk_cached_source', 'gps');
        } catch (err: any) {
          console.warn('Reverse geocoding failed. Using raw coordinates + IP Fallback.', err.message);
          detectByIP();
        } finally {
          setIsDetecting(false);
        }
      },
      (geoError) => {
        console.warn(`GPS failed (${geoError.message}). Trying IP address location.`, geoError);
        detectByIP();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds timeout
        maximumAge: 60000 // Accept cached coords up to 60 seconds old
      }
    );
  }, [detectByIP, reverseGeocode]);

  // Load cached location on load (saves API calls & improves performance)
  useEffect(() => {
    const cachedC = localStorage.getItem('kiosk_cached_coords');
    const cachedA = localStorage.getItem('kiosk_cached_address');
    const cachedS = localStorage.getItem('kiosk_cached_source');

    if (cachedC && cachedA) {
      setCoords(JSON.parse(cachedC));
      setAddress(JSON.parse(cachedA));
      setSource(cachedS as any);
    } else {
      detectLocation(); // Auto detect on initial load
    }
  }, [detectLocation]);

  return (
    <LocationTrackerContext.Provider value={{ coords, address, isDetecting, error, source, detectLocation }}>
      {children}
    </LocationTrackerContext.Provider>
  );
};

// =========================================================================
// 4. CUSTOM HOOK
// =========================================================================
export const useLocationTracker = () => useContext(LocationTrackerContext);
