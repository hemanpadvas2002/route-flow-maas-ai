
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  startLocation?: [number, number];
  endLocation?: [number, number];
  routePoints?: [number, number][];
  className?: string;
  collapsed?: boolean;
  hidden?: boolean;
}

const Map: React.FC<MapProps> = ({ 
  startLocation, 
  endLocation, 
  routePoints, 
  className = "", 
  collapsed = false,
  hidden = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    if (!mapContainer.current || hidden) return;
    
    // In a real app, this would be securely stored in environment variables
    // Using a temporary state variable for demo purposes only
    const token = mapboxToken || 'pk.placeholder';
    
    if (token === 'pk.placeholder') {
      console.error('Please set a valid Mapbox token');
      return;
    }

    if (map.current) return;

    // Initialize map
    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: startLocation || [78.9629, 20.5937], // Default to center of India
      zoom: 12,
      pitch: 40, // Add some pitch for a nicer 3D effect
      bearing: 20, // Slight rotation for better perspective
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
      }),
      'top-right'
    );

    // Add geolocation control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    // Cleanup
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken, startLocation, hidden]);

  // Update map if route changes
  useEffect(() => {
    if (!map.current || !startLocation || !endLocation || !routePoints || hidden) return;

    // Add markers for start and end locations
    new mapboxgl.Marker({ color: '#4CAF50' })
      .setLngLat(startLocation)
      .addTo(map.current);

    new mapboxgl.Marker({ color: '#F44336' })
      .setLngLat(endLocation)
      .addTo(map.current);

    // Add route line if route points are provided
    if (routePoints.length > 0) {
      if (map.current.getSource('route')) {
        // Update existing source
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routePoints,
          },
        });
      } else {
        // Add new source and layer
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routePoints,
            },
          },
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#1E88E5',
            'line-width': 5,
          },
        });
      }

      // Fit the map to the route
      const bounds = new mapboxgl.LngLatBounds();
      routePoints.forEach(point => bounds.extend(point as mapboxgl.LngLatLike));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [startLocation, endLocation, routePoints, hidden]);

  const handleTokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
  };

  if (hidden) {
    return null;
  }

  return (
    <div className={`relative ${className} ${collapsed ? 'h-32' : 'h-full min-h-[calc(100vh-116px)]'}`}>
      {!mapboxToken && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg">
          <p className="mb-4 text-center text-sm">Please enter your Mapbox token:</p>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter Mapbox token"
            onChange={handleTokenInput}
          />
          <p className="mt-2 text-xs text-gray-500">Get one at mapbox.com</p>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
