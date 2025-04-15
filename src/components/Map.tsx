import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Vehicle, Station } from '@/types/transit';
import { useTheme } from '@/contexts/ThemeContext';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  startLocation?: [number, number];
  endLocation?: [number, number];
  routePoints?: [number, number][];
  simulationMode?: boolean;
  showAccessibility?: boolean;
  onVehicleSelect?: (vehicle: Vehicle) => void;
  onStationSelect?: (station: Station) => void;
  onMapClick?: (lngLat: [number, number]) => void;
}

const Map: React.FC<MapProps> = ({
  startLocation,
  endLocation,
  routePoints = [],
  simulationMode = false,
  showAccessibility = false,
  onVehicleSelect,
  onStationSelect,
  onMapClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const { theme } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiaGVtYW4tMDciLCJhIjoiY205aTVxbGdxMGE4ZzJqcXY5d2R0a2M3aCJ9.YCbFWOjZehRjsyQ7DyU49w';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [80.2707, 13.0827], // Chennai coordinates
      zoom: 11,
      pitch: 45,
      bearing: 20,
    });

    // Setup an event listener for when the map style is fully loaded
    map.current.on('style.load', () => {
      if (!map.current) return;
      console.log('Map style loaded, initializing features');
      setMapLoaded(true);
      
      // Initialize map features here
      initializeMapFeatures();
    });

    // Cleanup function
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  // Initialize map features once style is loaded
  const initializeMapFeatures = () => {
    if (!map.current || !mapLoaded) return;
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add atmosphere and fog effects
    map.current.setFog({
      'color': 'rgb(186, 210, 235)',
      'high-color': 'rgb(36, 92, 223)',
      'horizon-blend': 0.02,
      'space-color': 'rgb(11, 11, 25)',
      'star-intensity': 0.6
    });
    
    // Add initial layers and sources
    addDefaultLayers();
  };

  // Add default layers
  const addDefaultLayers = () => {
    if (!map.current || !mapLoaded) return;

    // Add source for route line
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

    // Add layer for route line
    map.current.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#00ADB5',
        'line-width': 6,
        'line-opacity': 0.7,
      },
    });
    
    // Add source for vehicle locations
    map.current.addSource('vehicles', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    
    // Add layer for vehicle icons
    map.current.addLayer({
      id: 'vehicle-icons',
      type: 'symbol',
      source: 'vehicles',
      layout: {
        'icon-image': 'bus-15',
        'icon-rotate': ['get', 'bearing'],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
    });
    
    // Add source for station locations
    map.current.addSource('stations', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    
    // Add layer for station icons
    map.current.addLayer({
      id: 'station-icons',
      type: 'symbol',
      source: 'stations',
      layout: {
        'icon-image': 'rail-15',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
    });
  };

  // Update route layer
  const updateRouteLayer = (points: [number, number][]) => {
    if (!map.current || !mapLoaded) return;

    map.current.getSource('route').setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: points,
      },
    });
  };

  // Mock vehicle data
  useEffect(() => {
    if (!map.current || !mapLoaded || !simulationMode) return;

    const interval = setInterval(() => {
      const newVehicles: Vehicle[] = [
        {
          id: 'bus1',
          type: 'bus',
          route: '42',
          location: [80.2607 + (Math.random() - 0.5) * 0.02, 13.0827 + (Math.random() - 0.5) * 0.02],
          bearing: Math.floor(Math.random() * 360),
          status: 'en route',
          eta: '5 mins',
          capacity: '30%',
        },
        {
          id: 'bus2',
          type: 'bus',
          route: '27B',
          location: [80.2807 + (Math.random() - 0.5) * 0.02, 13.0927 + (Math.random() - 0.5) * 0.02],
          bearing: Math.floor(Math.random() * 360),
          status: 'delayed',
          eta: '12 mins',
          capacity: '80%',
        },
      ];

      // Update vehicle locations on the map
      updateVehicleLocations(newVehicles);
    }, 3000);

    return () => clearInterval(interval);
  }, [simulationMode, mapLoaded]);

  // Update vehicle locations
  const updateVehicleLocations = (vehicles: Vehicle[]) => {
    if (!map.current || !mapLoaded) return;

    const features = vehicles.map(vehicle => ({
      type: 'Feature',
      properties: {
        bearing: vehicle.bearing,
      },
      geometry: {
        type: 'Point',
        coordinates: vehicle.location,
      },
    }));

    map.current.getSource('vehicles').setData({
      type: 'FeatureCollection',
      features: features,
    });
  };

  // Mock station data
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const stations: Station[] = [
      {
        id: 'station1',
        name: 'T. Nagar Bus Terminus',
        location: [80.2407, 13.0627],
        lines: ['42', '27B'],
        accessible: true,
      },
      {
        id: 'station2',
        name: 'Anna Salai Metro',
        location: [80.2757, 13.0977],
        lines: ['Blue Line', 'Green Line'],
        accessible: false,
      },
    ];

    // Add markers for stations
    addStationMarkers(stations);
  }, [mapLoaded]);

  // Add station markers
  const addStationMarkers = (stations: Station[]) => {
    if (!map.current || !mapLoaded) return;

    stations.forEach(station => {
      const el = document.createElement('div');
      el.className = 'station-marker';
      el.innerHTML = '<div class="station-icon pulse"></div>';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(station.location)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onStationSelect && onStationSelect(station);
      });
    });
  };

  // Update route when points change
  useEffect(() => {
    if (!map.current || !mapLoaded || routePoints.length === 0) return;

    updateRouteLayer(routePoints);
  }, [routePoints, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10" />
    </div>
  );
};

export default Map;
