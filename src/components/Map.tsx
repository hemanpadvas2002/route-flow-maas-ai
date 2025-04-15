
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from '@/contexts/ThemeContext';
import { Vehicle, Station, Route as TransitRoute } from '@/types/transit';
import { cn } from '@/lib/utils';

interface MapProps {
  startLocation?: [number, number];
  endLocation?: [number, number];
  routePoints?: [number, number][];
  className?: string;
  collapsed?: boolean;
  hidden?: boolean;
  simulationMode?: boolean;
  showAccessibility?: boolean;
  selectedVehicle?: Vehicle | null;
  onVehicleSelect?: (vehicle: Vehicle) => void;
  onStationSelect?: (station: Station) => void;
  onMapClick?: (lngLat: [number, number]) => void;
}

const Map: React.FC<MapProps> = ({ 
  startLocation, 
  endLocation, 
  routePoints, 
  className = "", 
  collapsed = false,
  hidden = false,
  simulationMode = false,
  showAccessibility = false,
  selectedVehicle = null,
  onVehicleSelect,
  onStationSelect,
  onMapClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const vehicleMarkersRef = useRef<{[id: string]: mapboxgl.Marker}>({});
  const stationMarkersRef = useRef<{[id: string]: mapboxgl.Marker}>({});
  const { theme } = useTheme();
  
  const [mapboxToken, setMapboxToken] = useState<string>(
    'pk.eyJ1IjoiaGVtYW4tMDciLCJhIjoiY205aTVxbGdxMGE4ZzJqcXY5d2R0a2M3aCJ9.YCbFWOjZehRjsyQ7DyU49w'
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [transitRoutes, setTransitRoutes] = useState<TransitRoute[]>([]);

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || hidden) return;
    
    // Use the permanently integrated token
    const token = mapboxToken;
    
    if (token === 'pk.placeholder') {
      console.error('Please set a valid Mapbox token');
      return;
    }

    if (map.current) return;

    // Initialize map with dark or light style based on theme
    mapboxgl.accessToken = token;
    
    console.log('Initializing map...');
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11' 
        : 'mapbox://styles/mapbox/light-v10',
      center: startLocation || [78.9629, 20.5937], // Default to center of India
      zoom: 12,
      pitch: 40, // Add some pitch for a nicer 3D effect
      bearing: 20, // Slight rotation for better perspective
    });

    // Setup an event listener for when the map style is fully loaded
    map.current.on('style.load', () => {
      if (!map.current) return;
      console.log('Map style loaded, adding custom layers');
      setMapLoaded(true);
      
      // Add a custom layer on top of the map with a slight gradient overlay
      map.current.addLayer({
        id: 'gradient-overlay',
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {}, // Required properties field
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90]
                ]
              ]
            }
          }
        },
        paint: {
          'fill-color': theme === 'dark' ? '#1E1E2F' : '#f5f5f5',
          'fill-opacity': 0.15
        }
      });
      
      // Setup click handler on the map
      map.current.on('click', (e) => {
        if (onMapClick) {
          onMapClick([e.lngLat.lng, e.lngLat.lat]);
        }
      });
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
        visualizePitch: true
      }),
      'top-right'
    );

    // Add geolocation control with custom styling
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
      // Clear all markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Clear vehicle markers
      Object.values(vehicleMarkersRef.current).forEach(marker => marker.remove());
      vehicleMarkersRef.current = {};
      
      // Clear station markers
      Object.values(stationMarkersRef.current).forEach(marker => marker.remove());
      stationMarkersRef.current = {};
      
      map.current?.remove();
      map.current = null;
      setMapLoaded(false);
    };
  }, [mapboxToken, startLocation, hidden, theme, onMapClick]);

  // Update map theme when theme changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    map.current.setStyle(
      theme === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11' 
        : 'mapbox://styles/mapbox/light-v10'
    );
  }, [theme, mapLoaded]);

  // Update map if route changes AND map style is loaded
  useEffect(() => {
    if (!map.current || !mapLoaded || !startLocation || !endLocation || !routePoints || hidden) {
      console.log('Map update conditions not met:', { 
        mapExists: !!map.current, 
        mapLoaded, 
        hasStartLocation: !!startLocation, 
        hasEndLocation: !!endLocation, 
        hasRoutePoints: !!routePoints,
        hidden
      });
      return;
    }

    console.log('Updating map with route and markers');
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for start and end locations
    const startMarker = new mapboxgl.Marker({ color: '#00ADB5' }) // AI Glow accent color for start
      .setLngLat(startLocation)
      .addTo(map.current);
      
    const endMarker = new mapboxgl.Marker({ color: '#FFA500' }) // Orange for destination
      .setLngLat(endLocation)
      .addTo(map.current);
      
    // Store references to markers for cleanup
    markersRef.current.push(startMarker, endMarker);

    // Add route line if route points are provided
    if (routePoints.length > 0) {
      // Check if the map has the route source already
      if (map.current.getSource('route')) {
        // Update existing source
        console.log('Updating existing route source');
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
        console.log('Adding new route source and layers');
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

        // Create an animated flow effect along the route
        map.current.addLayer({
          id: 'route-base',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#203A43', // Mobility Blue base
            'line-width': 6,
            'line-opacity': 0.8,
          },
        });

        map.current.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#00ADB5', // AI Glow accent
            'line-width': 3,
            'line-opacity': 0.9,
          },
        });
      }

      // Fit the map to the route
      const bounds = new mapboxgl.LngLatBounds();
      routePoints.forEach(point => bounds.extend(point as mapboxgl.LngLatLike));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [mapLoaded, startLocation, endLocation, routePoints, hidden]);

  // Fetch and update transit vehicles on the map
  useEffect(() => {
    if (!map.current || !mapLoaded || hidden || !simulationMode) return;
    
    // Mock data for simulation
    const mockVehicles: Vehicle[] = [
      {
        id: 'bus-1',
        type: 'bus',
        route: 'Route 42',
        position: [78.9629, 20.5937],
        heading: 45,
        status: 'on-time',
        capacity: 'medium',
        accessible: true,
        eta: '5 min',
      },
      {
        id: 'metro-1',
        type: 'metro',
        route: 'Blue Line',
        position: [78.9700, 20.6000],
        heading: 90,
        status: 'delayed',
        capacity: 'high',
        accessible: true,
        eta: '8 min',
      },
      {
        id: 'train-1',
        type: 'train',
        route: 'Express 101',
        position: [78.9550, 20.5850],
        heading: 180,
        status: 'on-time',
        capacity: 'low',
        accessible: false,
        eta: '12 min',
      },
    ];
    
    setVehicles(mockVehicles);
    
    // Simulation interval for moving vehicles
    const interval = setInterval(() => {
      setVehicles(prev => 
        prev.map(vehicle => ({
          ...vehicle,
          position: [
            vehicle.position[0] + (Math.random() * 0.002 - 0.001),
            vehicle.position[1] + (Math.random() * 0.002 - 0.001)
          ]
        }))
      );
    }, 2000);
    
    return () => clearInterval(interval);
  }, [mapLoaded, hidden, simulationMode]);

  // Update vehicle markers on the map
  useEffect(() => {
    if (!map.current || !mapLoaded || hidden) return;
    
    // Update or add vehicle markers
    vehicles.forEach(vehicle => {
      let marker = vehicleMarkersRef.current[vehicle.id];
      
      const el = document.createElement('div');
      el.className = cn(
        'vehicle-marker',
        vehicle.type,
        simulationMode ? 'simulation-mode' : '',
        vehicle.accessible ? 'accessible' : ''
      );
      
      // Add vehicle type icon to the marker
      const icon = document.createElement('div');
      icon.className = cn(
        'vehicle-icon',
        `vehicle-${vehicle.type}`,
        vehicle.status === 'delayed' ? 'delayed' : '',
        vehicle.status === 'out-of-service' ? 'out-of-service' : '',
        theme
      );
      
      // Define vehicle color based on type
      let color = '#BDBDBD'; // Default gray
      switch(vehicle.type) {
        case 'bus':
          color = '#FFA500'; // Orange
          icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg>';
          break;
        case 'metro':
          color = '#1E88E5'; // Blue
          icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 11v5a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5v-5"/><path d="m3 11 9-9 9 9"/><path d="M16 16v-3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>';
          break;
        case 'train':
          color = '#4CAF50'; // Green
          icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h10.5a.5.5 0 0 1 .5.5V11H6V4z"/><path d="M4 11h16"/><path d="M6 11v8.5a.5.5 0 0 0 .5.5h1.67a.5.5 0 0 0 .33-.13l1-1a.5.5 0 0 1 .34-.13h4.32a.5.5 0 0 1 .34.13l1 1a.5.5 0 0 0 .33.13H17.5a.5.5 0 0 0 .5-.5V11"/><path d="M11 4v7"/><path d="M6 15h12"/><path d="M12 15v2"/></svg>';
          break;
      }
      
      // Style the icon with the appropriate color
      icon.style.color = color;
      el.appendChild(icon);
      
      // Add vehicle info tooltip
      const info = document.createElement('div');
      info.className = 'vehicle-info';
      info.innerHTML = `
        <div class="vehicle-route">${vehicle.route}</div>
        <div class="vehicle-eta">ETA: ${vehicle.eta}</div>
        <div class="vehicle-status">${vehicle.status.toUpperCase()}</div>
        <div class="vehicle-capacity">Capacity: ${vehicle.capacity}</div>
        ${vehicle.accessible ? '<div class="vehicle-accessible">♿ Accessible</div>' : ''}
      `;
      el.appendChild(info);
      
      // Create or update marker
      if (marker) {
        marker.setLngLat(vehicle.position);
        marker.getElement().className = el.className;
        marker.getElement().innerHTML = el.innerHTML;
      } else {
        marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center',
          rotation: vehicle.heading
        })
          .setLngLat(vehicle.position)
          .addTo(map.current!);
          
        // Add click handler
        el.addEventListener('click', () => {
          if (onVehicleSelect) onVehicleSelect(vehicle);
        });
        
        vehicleMarkersRef.current[vehicle.id] = marker;
      }
    });
    
    // Remove any vehicle markers that are no longer in the data
    Object.keys(vehicleMarkersRef.current).forEach(id => {
      if (!vehicles.some(v => v.id === id)) {
        vehicleMarkersRef.current[id].remove();
        delete vehicleMarkersRef.current[id];
      }
    });
  }, [vehicles, mapLoaded, hidden, theme, simulationMode, onVehicleSelect]);

  // Load and display station data
  useEffect(() => {
    if (!map.current || !mapLoaded || hidden) return;
    
    // Mock station data
    const mockStations: Station[] = [
      {
        id: 'station-1',
        name: 'Central Station',
        type: 'metro',
        position: [78.9629, 20.5937],
        accessible: true,
        lines: ['Blue Line', 'Green Line'],
        arrivals: [
          { line: 'Blue Line', destination: 'Airport', eta: '3 min' },
          { line: 'Green Line', destination: 'University', eta: '7 min' }
        ]
      },
      {
        id: 'station-2',
        name: 'Market Square',
        type: 'bus',
        position: [78.9700, 20.6000],
        accessible: false,
        lines: ['Route 42', 'Route 15'],
        arrivals: [
          { line: 'Route 42', destination: 'Business Park', eta: '5 min' },
          { line: 'Route 15', destination: 'Shopping Mall', eta: '12 min' }
        ]
      },
      {
        id: 'station-3',
        name: 'Suburban Junction',
        type: 'train',
        position: [78.9550, 20.5850],
        accessible: true,
        lines: ['Express 101', 'Local 202'],
        arrivals: [
          { line: 'Express 101', destination: 'Downtown', eta: '15 min' },
          { line: 'Local 202', destination: 'Beach Front', eta: '22 min' }
        ]
      }
    ];
    
    setStations(mockStations);
  }, [mapLoaded, hidden]);

  // Update station markers on the map
  useEffect(() => {
    if (!map.current || !mapLoaded || hidden) return;
    
    // Add or update station markers
    stations.forEach(station => {
      let marker = stationMarkersRef.current[station.id];
      
      const el = document.createElement('div');
      el.className = cn(
        'station-marker',
        station.type,
        station.accessible ? 'accessible' : '',
        showAccessibility && !station.accessible ? 'filtered-out' : ''
      );
      
      // Style according to accessibility filter
      if (showAccessibility && !station.accessible) {
        el.style.opacity = '0.3';
      }
      
      // Add station type icon and pulse effect
      const icon = document.createElement('div');
      icon.className = cn(
        'station-icon',
        `station-${station.type}`,
        'pulse',
        theme
      );
      
      // Define station color based on type
      let color = '#FFFFFF';
      switch(station.type) {
        case 'bus':
          color = '#FFA500'; // Orange
          break;
        case 'metro':
          color = '#1E88E5'; // Blue
          break;
        case 'train':
          color = '#4CAF50'; // Green
          break;
      }
      
      // Apply accessibility indicator if needed
      if (station.accessible) {
        const accessibleIcon = document.createElement('div');
        accessibleIcon.className = 'accessible-icon';
        accessibleIcon.innerHTML = '♿';
        el.appendChild(accessibleIcon);
      }
      
      icon.style.backgroundColor = color;
      el.appendChild(icon);
      
      // Create info tooltip
      const info = document.createElement('div');
      info.className = 'station-info';
      info.innerHTML = `
        <div class="station-name">${station.name}</div>
        <div class="station-lines">${station.lines.join(', ')}</div>
        <div class="station-arrivals">
          ${station.arrivals.map(arrival => `
            <div class="arrival">
              ${arrival.line} to ${arrival.destination}: ${arrival.eta}
            </div>
          `).join('')}
        </div>
      `;
      el.appendChild(info);
      
      // Create or update marker
      if (marker) {
        marker.setLngLat(station.position);
        marker.getElement().className = el.className;
        marker.getElement().innerHTML = el.innerHTML;
      } else {
        marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center'
        })
          .setLngLat(station.position)
          .addTo(map.current!);
          
        // Add click handler
        el.addEventListener('click', () => {
          if (onStationSelect) onStationSelect(station);
        });
        
        stationMarkersRef.current[station.id] = marker;
      }
    });
    
    // Remove any station markers that are no longer in the data
    Object.keys(stationMarkersRef.current).forEach(id => {
      if (!stations.some(s => s.id === id)) {
        stationMarkersRef.current[id].remove();
        delete stationMarkersRef.current[id];
      }
    });
  }, [stations, mapLoaded, hidden, theme, showAccessibility, onStationSelect]);

  // Load and display transit route lines
  useEffect(() => {
    if (!map.current || !mapLoaded || hidden) return;
    
    // Mock transit route data
    const mockRoutes: TransitRoute[] = [
      {
        id: 'route-1',
        name: 'Blue Line',
        type: 'metro',
        color: '#1E88E5',
        path: [
          [78.9629, 20.5937],
          [78.9650, 20.5950],
          [78.9700, 20.6000],
          [78.9750, 20.6050]
        ]
      },
      {
        id: 'route-2',
        name: 'Route 42',
        type: 'bus',
        color: '#FFA500',
        path: [
          [78.9629, 20.5937],
          [78.9600, 20.5900],
          [78.9550, 20.5850],
          [78.9500, 20.5800]
        ]
      },
      {
        id: 'route-3',
        name: 'Express 101',
        type: 'train',
        color: '#4CAF50',
        path: [
          [78.9550, 20.5850],
          [78.9500, 20.5800],
          [78.9450, 20.5750],
          [78.9400, 20.5700]
        ]
      }
    ];
    
    setTransitRoutes(mockRoutes);
    
    // Add routes to the map - only if the map style is loaded
    mockRoutes.forEach(route => {
      // Skip if source already exists
      if (map.current?.getSource(`route-${route.id}`)) return;
      
      // Add route path source
      map.current?.addSource(`route-${route.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.path
          }
        }
      });
      
      // Add route base layer
      map.current?.addLayer({
        id: `route-${route.id}-base`,
        type: 'line',
        source: `route-${route.id}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': route.color,
          'line-width': 5,
          'line-opacity': 0.7
        }
      });
      
      // Add animated flow effect for simulation mode
      if (simulationMode) {
        map.current?.addLayer({
          id: `route-${route.id}-flow`,
          type: 'line',
          source: `route-${route.id}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#00ADB5',
            'line-width': 2,
            'line-opacity': 0.9,
            'line-dasharray': [2, 4],
            'line-gap-width': 1
          }
        });
      }
    });
    
    // Cleanup - remove route layers and sources when component unmounts
    return () => {
      if (!map.current) return;
      
      mockRoutes.forEach(route => {
        if (map.current?.getLayer(`route-${route.id}-flow`)) {
          map.current.removeLayer(`route-${route.id}-flow`);
        }
        if (map.current?.getLayer(`route-${route.id}-base`)) {
          map.current.removeLayer(`route-${route.id}-base`);
        }
        if (map.current?.getSource(`route-${route.id}`)) {
          map.current.removeSource(`route-${route.id}`);
        }
      });
    };
  }, [mapLoaded, hidden, simulationMode]);

  if (hidden) {
    return null;
  }

  return (
    <div className={`relative ${className} ${collapsed ? 'h-32' : 'h-full min-h-[calc(100vh-116px)]'}`}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map mode indicator */}
      {simulationMode && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-[#222831] to-[#393E46] px-4 py-2 rounded-lg text-white border border-[#00ADB5] shadow-lg z-10">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00ADB5] animate-pulse mr-2"></span>
          Live Simulation Mode
        </div>
      )}
      
      {/* Accessibility filter indicator */}
      {showAccessibility && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#222831] to-[#393E46] px-4 py-2 rounded-lg text-white border border-[#00ADB5] shadow-lg z-10">
          <span className="inline-block mr-2">♿</span>
          Accessibility Filter On
        </div>
      )}
      
      {/* CSS styling for markers and animations */}
      <style>
        {`
        .vehicle-marker {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: transform 0.3s;
        }
        
        .vehicle-marker:hover {
          transform: scale(1.2);
          z-index: 10;
        }
        
        .vehicle-marker.simulation-mode {
          box-shadow: 0 0 10px #00ADB5;
        }
        
        .vehicle-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .vehicle-icon.delayed {
          animation: pulse 1.5s infinite;
        }
        
        .vehicle-icon.out-of-service {
          opacity: 0.5;
        }
        
        .vehicle-icon.light {
          background-color: #FFFFFF;
          color: #333333;
        }
        
        .vehicle-icon.dark {
          background-color: #222831;
          color: #FFFFFF;
        }
        
        .vehicle-info {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px;
          border-radius: 4px;
          width: 150px;
          display: none;
          z-index: 1000;
        }
        
        .vehicle-marker:hover .vehicle-info {
          display: block;
        }
        
        .station-marker {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: transform 0.3s;
        }
        
        .station-marker:hover {
          transform: scale(1.2);
          z-index: 10;
        }
        
        .station-icon {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .station-marker.accessible::after {
          content: '';
          position: absolute;
          top: -3px;
          right: -3px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #00ADB5;
        }
        
        .station-info {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px;
          border-radius: 4px;
          width: 200px;
          display: none;
          z-index: 1000;
        }
        
        .station-marker:hover .station-info {
          display: block;
        }
        
        .station-name {
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 173, 181, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 173, 181, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 173, 181, 0);
          }
        }
        `}
      </style>
    </div>
  );
};

export default Map;
