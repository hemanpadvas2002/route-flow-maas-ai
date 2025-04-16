
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, Geometry, GeoJsonProperties, FeatureCollection } from 'geojson';

// Define proper TypeScript interfaces
interface MapProps {
  startLocation?: [number, number];
  endLocation?: [number, number];
  routePoints?: [number, number][];
}

// Define the correct types for our vehicles and stations
interface Vehicle {
  id: string;
  coordinates: [number, number];
  heading: number;
  status: 'on-time' | 'delayed' | 'out-of-service' | 'en-route';
  occupancy: 'low' | 'medium' | 'high' | '30%' | '80%';
}

interface Station {
  id: string;
  name: string;
  coordinates: [number, number];
}

const Map: React.FC<MapProps> = ({ 
  startLocation, 
  endLocation, 
  routePoints = [] 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Create refs to store markers so we can remove them later
  const markers = useRef<mapboxgl.Marker[]>([]);
  const sourceAdded = useRef<boolean>(false);

  // Sample data for vehicles
  const vehicles: Vehicle[] = [
    {
      id: 'bus-1',
      coordinates: [80.2707, 13.0827],
      heading: 45,
      status: 'on-time',
      occupancy: 'low'
    },
    {
      id: 'bus-2',
      coordinates: [80.2541, 13.0550],
      heading: 190,
      status: 'en-route',
      occupancy: '30%'
    },
    {
      id: 'bus-3',
      coordinates: [80.2440, 13.0650],
      heading: 270,
      status: 'delayed',
      occupancy: '80%'
    }
  ];

  // Sample data for stations
  const stations: Station[] = [
    {
      id: 'station-1',
      name: 'Chennai Central',
      coordinates: [80.2707, 13.0827]
    },
    {
      id: 'station-2',
      name: 'T. Nagar',
      coordinates: [80.2338, 13.0416]
    }
  ];

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize map with correct token
    // Note: Using a placeholder token reference here - in a real app, use environment variables
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGVtYW4tMDciLCJhIjoiY2xuY3E0ZWl0MDlrejJrcXZ2em44OTQyaCJ9.5dJrr0KcvXS39vVLqPjKRg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [80.2707, 13.0827], // Chennai coordinates
      zoom: 10
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Listen for style.load event to ensure map is ready
    map.current.on('style.load', () => {
      setMapLoaded(true);
    });

    return () => {
      // Clean up markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      // Clean up map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Effect to handle all map operations once the map and style are loaded
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    // Now we can safely add sources and layers
    if (routePoints && routePoints.length > 0) {
      addRouteToMap(routePoints);
    }

    // Add vehicles to map
    addVehiclesToMap();

    // Add stations to map
    addStationsToMap();

    // Add markers
    updateMapMarkers();
  }, [mapLoaded, routePoints]);

  // Effect to update markers when start/end locations change
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    updateMapMarkers();
  }, [startLocation, endLocation, mapLoaded]);

  // Function to update map markers
  const updateMapMarkers = () => {
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add start marker if exists
    if (startLocation) {
      const startMarker = new mapboxgl.Marker({ color: '#00ff00' })
        .setLngLat(startLocation)
        .addTo(map.current!);
      markers.current.push(startMarker);
    }

    // Add end marker if exists
    if (endLocation) {
      const endMarker = new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat(endLocation)
        .addTo(map.current!);
      markers.current.push(endMarker);
    }

    // Fit bounds if both markers exist
    if (startLocation && endLocation && map.current) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend(startLocation)
        .extend(endLocation);
      
      map.current.fitBounds(bounds, { padding: 100 });
    }
  };

  // Function to add route to map
  const addRouteToMap = (points: [number, number][]) => {
    if (!map.current || !mapLoaded) return;
    
    // Create a GeoJSON object for the route
    const routeData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: points
      }
    } as Feature<Geometry>;

    // Add or update the route source
    if (!sourceAdded.current) {
      map.current.addSource('route', {
        type: 'geojson',
        data: routeData
      });
      
      // Add route layer
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
      
      sourceAdded.current = true;
    } else {
      // Update existing source
      const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
      if (source && source.setData) {
        source.setData(routeData);
      }
    }
  };

  // Function to add vehicles to map
  const addVehiclesToMap = () => {
    if (!map.current || !mapLoaded) return;

    // Create GeoJSON for vehicles
    const vehicleFeatures = vehicles.map(vehicle => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: vehicle.coordinates
      },
      properties: {
        id: vehicle.id,
        status: vehicle.status,
        occupancy: vehicle.occupancy,
        heading: vehicle.heading
      }
    })) as Feature<Geometry, GeoJsonProperties>[];

    // Add vehicles source
    map.current.addSource('vehicles', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: vehicleFeatures
      } as FeatureCollection
    });

    // Add vehicle layer
    map.current.addLayer({
      id: 'vehicles',
      type: 'symbol',
      source: 'vehicles',
      layout: {
        'icon-image': 'bus',
        'icon-size': 1.2,
        'icon-allow-overlap': true,
        'icon-rotate': ['get', 'heading'],
        'text-field': ['concat', ['get', 'id'], '\n', ['get', 'status']],
        'text-font': ['Open Sans Bold'],
        'text-offset': [0, 1.2],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1
      }
    });
  };

  // Function to add stations to map
  const addStationsToMap = () => {
    if (!map.current || !mapLoaded) return;

    // Create GeoJSON for stations
    const stationFeatures = stations.map(station => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: station.coordinates
      },
      properties: {
        id: station.id,
        name: station.name
      }
    })) as Feature<Geometry, GeoJsonProperties>[];

    // Add stations source
    map.current.addSource('stations', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: stationFeatures
      } as FeatureCollection
    });

    // Add station layer
    map.current.addLayer({
      id: 'stations',
      type: 'symbol',
      source: 'stations',
      layout: {
        'icon-image': 'bus-stop',
        'icon-size': 1.2,
        'icon-allow-overlap': true,
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Bold'],
        'text-offset': [0, 1.2],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1
      }
    });
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
