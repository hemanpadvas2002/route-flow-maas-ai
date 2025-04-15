
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import RouteSearch from '../components/RouteSearch';
import RouteSummary from '../components/RouteSummary';
import TransitDashboard from '../components/TransitDashboard';
import HomeGreeting from '../components/HomeGreeting';
import NavigationBar from '../components/NavigationBar';
import { RouteOption, Vehicle, Station } from '@/types/transit';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Settings, Bell, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const ArgoMap: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // State for user interactions
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [dashboardExpanded, setDashboardExpanded] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [userName, setUserName] = useState<string>('Traveler');
  
  // Get username from localStorage if available
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);
  
  // Coordinates for routing
  const [startCoords, setStartCoords] = useState<[number, number] | undefined>(undefined);
  const [endCoords, setEndCoords] = useState<[number, number] | undefined>(undefined);
  const [routePoints, setRoutePoints] = useState<[number, number][] | undefined>(undefined);
  
  // Mock route data
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  
  // Handle search
  const handleSearch = (from: string, to: string, accessible: boolean) => {
    setFromLocation(from);
    setToLocation(to);
    setShowAccessibility(accessible);
    setSearched(true);
    setSearchExpanded(false);
    
    // Mock coordinates for Delhi landmarks
    const delhiCoordinates: Record<string, [number, number]> = {
      "Connaught Place": [77.2168, 28.6304],
      "India Gate": [77.2295, 28.6129],
      "Chandni Chowk": [77.2310, 28.6506],
      "Karol Bagh": [77.1858, 28.6516],
      "Lajpat Nagar": [77.2398, 28.5693],
      "Hauz Khas": [77.2090, 28.5457],
      "Rajiv Chowk": [77.2183, 28.6333],
      "AIIMS": [77.2090, 28.5665],
      "IGI Airport": [77.0881, 28.5562],
      "Dwarka": [77.0266, 28.5921],
      "Noida": [77.3910, 28.5355],
      "Gurugram": [77.0266, 28.4595]
    };
    
    // Set coordinates for map
    if (delhiCoordinates[from] && delhiCoordinates[to]) {
      setStartCoords(delhiCoordinates[from]);
      setEndCoords(delhiCoordinates[to]);
      
      // Generate some route points between the two locations
      const fromCoords = delhiCoordinates[from];
      const toCoords = delhiCoordinates[to];
      
      // Create an array of points to simulate a route
      const points: [number, number][] = [fromCoords];
      
      // Add some intermediate points
      const steps = 8;
      for (let i = 1; i < steps; i++) {
        const ratio = i / steps;
        points.push([
          fromCoords[0] + (toCoords[0] - fromCoords[0]) * ratio + (Math.random() - 0.5) * 0.01,
          fromCoords[1] + (toCoords[1] - fromCoords[1]) * ratio + (Math.random() - 0.5) * 0.01
        ]);
      }
      
      points.push(toCoords);
      setRoutePoints(points);
      
      // Generate route options
      generateRouteOptions(from, to, accessible);
    } else {
      toast({
        title: "Location not found",
        description: "One or both locations are not in our database.",
        variant: "destructive"
      });
    }
  };
  
  // Generate mock route options
  const generateRouteOptions = (from: string, to: string, accessible: boolean) => {
    // Calculate a base time and distance based on coordinates
    const baseTime = Math.floor(Math.random() * 30) + 30; // 30-60 minutes
    const baseDistance = Math.floor(Math.random() * 10) + 5; // 5-15 km
    
    // Different route options
    const mockRoutes: RouteOption[] = [
      {
        id: 'route1',
        segments: [
          {
            id: 'segment1',
            mode: 'walking',
            startTime: '09:00',
            endTime: '09:10',
            startLocation: from,
            endLocation: 'Bus Stop A',
            duration: 10,
            distance: 0.8,
          },
          {
            id: 'segment2',
            mode: 'bus',
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
            mode: 'walking',
            startTime: '09:45',
            endTime: '09:55',
            startLocation: 'Bus Stop B',
            endLocation: to,
            duration: 10,
            distance: 0.7,
          },
        ],
        totalDuration: 55,
        totalDistance: 6.7,
        totalPrice: 25,
        departureTime: '09:00',
        arrivalTime: '09:55',
        crowdLevel: 'medium'
      },
      {
        id: 'route2',
        segments: [
          {
            id: 'segment1',
            mode: 'walking',
            startTime: '09:00',
            endTime: '09:08',
            startLocation: from,
            endLocation: 'Metro Station A',
            duration: 8,
            distance: 0.6,
          },
          {
            id: 'segment2',
            mode: 'metro',
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
            mode: 'walking',
            startTime: '09:35',
            endTime: '09:50',
            startLocation: 'Metro Station B',
            endLocation: to,
            duration: 15,
            distance: 1.2,
          },
        ],
        totalDuration: 50,
        totalDistance: 9.3,
        totalPrice: 35,
        departureTime: '09:00',
        arrivalTime: '09:50',
        crowdLevel: 'low'
      },
      {
        id: 'route3',
        segments: [
          {
            id: 'segment1',
            mode: 'walking',
            startTime: '09:05',
            endTime: '09:15',
            startLocation: from,
            endLocation: 'Taxi Pickup Point',
            duration: 10,
            distance: 0.8,
          },
          {
            id: 'segment2',
            mode: 'taxi',
            startTime: '09:15',
            endTime: '09:40',
            startLocation: 'Taxi Pickup Point',
            endLocation: to,
            duration: 25,
            distance: 8.5,
            price: 150,
          },
        ],
        totalDuration: 35,
        totalDistance: 9.3,
        totalPrice: 150,
        departureTime: '09:00',
        arrivalTime: '09:35',
        crowdLevel: 'low'
      },
    ];
    
    // Filter for accessibility if needed
    const filteredRoutes = accessible 
      ? mockRoutes.filter(route => 
          route.segments.every(segment => 
            segment.mode !== 'metro' || segment.routeIdentifier === 'Blue Line'
          )
        )
      : mockRoutes;
    
    setRoutes(filteredRoutes);
    
    // Auto-select first route if results are found
    if (filteredRoutes.length > 0) {
      setSelectedRouteId(filteredRoutes[0].id);
      setDashboardExpanded(true);
    } else {
      toast({
        title: "No routes found",
        description: "Try adjusting your search criteria.",
        variant: "destructive"
      });
    }
  };
  
  // Handle route selection
  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    setDashboardExpanded(true);
  };
  
  // Handle vehicle selection
  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    toast({
      title: `${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}: ${vehicle.route}`,
      description: `Status: ${vehicle.status}. ETA: ${vehicle.eta}. Crowding: ${vehicle.capacity}.`,
    });
  };
  
  // Handle station selection
  const handleStationSelect = (station: Station) => {
    toast({
      title: station.name,
      description: `Lines: ${station.lines.join(', ')}. ${station.accessible ? 'Accessible ♿' : 'Not accessible'}`,
    });
  };
  
  // Handle location click on map
  const handleMapClick = (lngLat: [number, number]) => {
    // TODO: Implement reverse geocoding to get location name
    console.log('Map clicked at:', lngLat);
  };
  
  // Get the selected route
  const selectedRoute = routes.find(route => route.id === selectedRouteId);
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-maas-urban-dusk-1' : 'bg-gray-100'}`}>
      {/* Top controls for simulation mode */}
      <div className="fixed top-4 right-4 z-40 flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-1 bg-black/20 backdrop-blur-md border-[#00ADB5]/50 hover:bg-black/30"
          onClick={() => navigate('/profile')}
        >
          <User className="h-4 w-4 text-[#00ADB5]" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-1 bg-black/20 backdrop-blur-md border-[#00ADB5]/50 hover:bg-black/30"
          onClick={() => setSimulationMode(!simulationMode)}
        >
          <div className="flex items-center space-x-1">
            <span className={`h-2 w-2 rounded-full ${simulationMode ? 'bg-[#00ADB5] animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="text-xs text-white">Live</span>
          </div>
        </Button>
      </div>
      
      {/* Main Map */}
      <div className="h-screen">
        <Map
          startLocation={startCoords}
          endLocation={endCoords}
          routePoints={routePoints}
          simulationMode={simulationMode}
          showAccessibility={showAccessibility}
          onVehicleSelect={handleVehicleSelect}
          onStationSelect={handleStationSelect}
          onMapClick={handleMapClick}
        />
      </div>
      
      {/* Search container */}
      {!searched && (
        <div className="absolute top-16 left-4 right-4 z-30">
          <HomeGreeting userName={userName} />
        </div>
      )}
      
      {/* Search overlay */}
      <RouteSearch
        onSearch={handleSearch}
        expanded={searchExpanded}
        onToggleExpanded={() => setSearchExpanded(!searchExpanded)}
      />
      
      {/* Route results */}
      {searched && routes.length > 0 && (
        <div className={`fixed inset-x-0 top-24 bottom-16 z-20 transition-all duration-300 overflow-y-auto pb-32 ${
          dashboardExpanded ? 'translate-y-0' : 'translate-y-[70%]'
        }`}>
          <div className={`route-timeline-container ${theme}`}>
            <div className="h-1.5 w-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto my-2 cursor-pointer"
              onClick={() => setDashboardExpanded(!dashboardExpanded)}
            ></div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">{fromLocation} to {toLocation}</h2>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={showAccessibility}
                    onCheckedChange={(checked) => {
                      setShowAccessibility(checked);
                      // Re-run search with updated accessibility preference
                      handleSearch(fromLocation, toLocation, checked);
                    }}
                    className="data-[state=checked]:bg-[#00ADB5]"
                  />
                  <span className="text-sm">♿</span>
                </div>
              </div>
            </div>
            <RouteSummary
              routes={routes}
              selectedRouteId={selectedRouteId || undefined}
              onSelectRoute={handleSelectRoute}
              showDetails={dashboardExpanded}
            />
          </div>
        </div>
      )}
      
      {/* Bottom dashboard */}
      {selectedRoute && (
        <TransitDashboard
          route={selectedRoute}
          expanded={dashboardExpanded}
          onToggleExpanded={() => setDashboardExpanded(!dashboardExpanded)}
          onBookRoute={() => {
            toast({
              title: "Booking in progress",
              description: "Redirecting to ticket booking...",
            });
            // Navigate to ticket booking with selected route details
            setTimeout(() => {
              navigate('/ticket-booking', { 
                state: { 
                  route: selectedRoute,
                  fromLocation,
                  toLocation
                }
              });
            }, 1500);
          }}
          onSaveRoute={() => {
            toast({
              title: "Route saved",
              description: "Added to your daily commutes.",
            });
          }}
        />
      )}
      
      <NavigationBar />
    </div>
  );
};

export default ArgoMap;
