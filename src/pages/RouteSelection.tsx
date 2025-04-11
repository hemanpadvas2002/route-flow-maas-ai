
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Map from '../components/Map';
import TransportModeSelector from '../components/TransportModeSelector';
import RouteTimeline from '../components/RouteTimeline';
import NavigationBar from '../components/NavigationBar';
import StatusBar from '../components/StatusBar';
import { Button } from '../components/ui/button';

interface LocationState {
  fromLocation: string;
  toLocation: string;
}

const RouteSelection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fromLocation, toLocation } = (location.state as LocationState) || {};
  
  const [selectedMode, setSelectedMode] = useState('bus');
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(undefined);
  const [expandedView, setExpandedView] = useState(false);
  const [mapCollapsed, setMapCollapsed] = useState(false);

  // Mock route data
  const routes = [
    {
      id: 'route1',
      segments: [
        {
          id: 'segment1',
          mode: 'walking' as const,
          startTime: '09:00',
          endTime: '09:10',
          startLocation: fromLocation || 'Home',
          endLocation: 'Bus Stop A',
          duration: 10,
          distance: 0.8,
        },
        {
          id: 'segment2',
          mode: 'bus' as const,
          startTime: '09:15',
          endTime: '09:45',
          startLocation: 'Bus Stop A',
          endLocation: 'Bus Stop B',
          duration: 30,
          distance: 5.2,
          routeIdentifier: 'Route 42',
          price: 25,
        },
        {
          id: 'segment3',
          mode: 'walking' as const,
          startTime: '09:45',
          endTime: '09:55',
          startLocation: 'Bus Stop B',
          endLocation: toLocation || 'Office',
          duration: 10,
          distance: 0.7,
        },
      ],
      totalDuration: 55,
      totalDistance: 6.7,
      totalPrice: 25,
      departureTime: '09:00',
      arrivalTime: '09:55',
    },
    {
      id: 'route2',
      segments: [
        {
          id: 'segment1',
          mode: 'walking' as const,
          startTime: '09:00',
          endTime: '09:08',
          startLocation: fromLocation || 'Home',
          endLocation: 'Metro Station A',
          duration: 8,
          distance: 0.6,
        },
        {
          id: 'segment2',
          mode: 'metro' as const,
          startTime: '09:15',
          endTime: '09:35',
          startLocation: 'Metro Station A',
          endLocation: 'Metro Station B',
          duration: 20,
          distance: 7.5,
          routeIdentifier: 'Blue Line',
          price: 35,
        },
        {
          id: 'segment3',
          mode: 'walking' as const,
          startTime: '09:35',
          endTime: '09:50',
          startLocation: 'Metro Station B',
          endLocation: toLocation || 'Office',
          duration: 15,
          distance: 1.2,
        },
      ],
      totalDuration: 50,
      totalDistance: 9.3,
      totalPrice: 35,
      departureTime: '09:00',
      arrivalTime: '09:50',
    },
    {
      id: 'route3',
      segments: [
        {
          id: 'segment1',
          mode: 'walking' as const,
          startTime: '09:05',
          endTime: '09:15',
          startLocation: fromLocation || 'Home',
          endLocation: 'Taxi Pickup Point',
          duration: 10,
          distance: 0.8,
        },
        {
          id: 'segment2',
          mode: 'taxi' as const,
          startTime: '09:15',
          endTime: '09:40',
          startLocation: 'Taxi Pickup Point',
          endLocation: toLocation || 'Office',
          duration: 25,
          distance: 8.5,
          price: 150,
        },
      ],
      totalDuration: 35,
      totalDistance: 9.3,
      totalPrice: 150,
      departureTime: '09:05',
      arrivalTime: '09:40',
    },
  ];

  useEffect(() => {
    if (!location.state) {
      navigate('/');
    } else {
      // Auto-select the first route
      setSelectedRouteId(routes[0]?.id);
    }
  }, [location.state, navigate]);

  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
    setMapCollapsed(expandedView ? false : true);
  };

  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    setExpandedView(true);
    setMapCollapsed(true);
  };

  const handleBookTicket = () => {
    const selectedRoute = routes.find(route => route.id === selectedRouteId);
    if (selectedRoute) {
      navigate('/ticket-booking', { state: { 
        route: selectedRoute,
        fromLocation,
        toLocation
      }});
    }
  };

  // Find the selected route to display on map
  const selectedRoute = routes.find(route => route.id === selectedRouteId);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      <StatusBar style="light" />
      
      {/* Top section with map */}
      <div className={`relative transition-all duration-300 ease-in-out ${mapCollapsed ? 'h-32' : 'h-[40vh]'}`}>
        <Map 
          collapsed={mapCollapsed}
          startLocation={[77.2090, 28.6139]} // Dummy coordinates for Delhi
          endLocation={[77.2300, 28.6600]} 
          routePoints={[
            [77.2090, 28.6139],
            [77.2150, 28.6250],
            [77.2200, 28.6400],
            [77.2300, 28.6600]
          ]}
        />
        
        {/* Route summary header */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 rounded-t-xl shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">{fromLocation} to {toLocation}</h2>
              <p className="text-sm text-gray-500">
                {selectedRoute?.totalDuration || 0} min · 
                {selectedRoute?.totalDistance.toFixed(1) || 0} km
              </p>
            </div>
            <button 
              className="p-2 bg-gray-100 rounded-full"
              onClick={toggleExpandedView}
            >
              {expandedView ? <ChevronDown /> : <ChevronUp />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Transport mode selector */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <TransportModeSelector 
          selectedMode={selectedMode}
          onSelectMode={(mode) => {
            setSelectedMode(mode);
            // In a real app, this would filter routes by transport mode
          }}
        />
      </div>
      
      {/* Route timeline section */}
      <div className="flex-grow bg-gray-50 overflow-y-auto">
        <RouteTimeline 
          routes={routes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={handleSelectRoute}
          expanded={expandedView}
        />
      </div>
      
      {/* Bottom action button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
        <Button
          className="w-full py-6 rounded-lg bg-blue-600 text-white font-medium text-lg"
          onClick={handleBookTicket}
        >
          Book Ticket
        </Button>
      </div>
      
      <NavigationBar />
    </div>
  );
};

export default RouteSelection;
