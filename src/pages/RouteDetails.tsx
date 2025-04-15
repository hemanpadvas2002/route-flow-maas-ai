
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import Map from '../components/Map';
import NavigationBar from '../components/NavigationBar';
import StatusBar from '../components/StatusBar';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import { Bus, Train, Car, UserRound, Ship, Bike } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface RouteSegment {
  id: string;
  mode: 'bus' | 'train' | 'metro' | 'taxi' | 'walking' | 'ferry' | 'cycling';
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  duration: number;
  distance: number;
  routeIdentifier?: string;
  price?: number;
}

interface RouteOption {
  id: string;
  segments: RouteSegment[];
  totalDuration: number;
  totalDistance: number;
  totalPrice: number;
  departureTime: string;
  arrivalTime: string;
}

interface LocationState {
  route: RouteOption;
  fromLocation: string;
  toLocation: string;
}

const RouteDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { routeId } = useParams<{ routeId: string }>();
  const [route, setRoute] = useState<RouteOption | null>(null);
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [detailsExpanded, setDetailsExpanded] = useState(true);

  useEffect(() => {
    // Get route data from location state
    const state = location.state as LocationState | undefined;
    
    if (state?.route) {
      setRoute(state.route);
      setFromLocation(state.fromLocation || '');
      setToLocation(state.toLocation || '');
    } else {
      // If no state, we could fetch the route by ID from an API
      // For now, navigate back if no data
      navigate('/route-selection');
    }
  }, [location, routeId, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleShareClick = () => {
    // Implement sharing functionality
    toast({
      title: "Sharing route",
      description: "This feature is coming soon!",
    });
  };

  const handleBookTicket = () => {
    if (route) {
      navigate('/ticket-booking', { 
        state: { 
          route,
          fromLocation,
          toLocation
        }
      });
    }
  };

  const toggleDetails = () => {
    setDetailsExpanded(!detailsExpanded);
  };

  const getIconForMode = (mode: string) => {
    switch (mode) {
      case 'bus':
        return <Bus className="h-5 w-5 text-white" />;
      case 'train':
      case 'metro':
        return <Train className="h-5 w-5 text-white" />;
      case 'taxi':
        return <Car className="h-5 w-5 text-white" />;
      case 'walking':
        return <UserRound className="h-5 w-5 text-white" />;
      case 'ferry':
        return <Ship className="h-5 w-5 text-white" />;
      case 'cycling':
        return <Bike className="h-5 w-5 text-white" />;
      default:
        return <Bus className="h-5 w-5 text-white" />;
    }
  };

  const getColorForMode = (mode: string) => {
    switch (mode) {
      case 'bus':
        return '#FFA500'; // Orange
      case 'train':
        return '#4CAF50'; // Green
      case 'metro':
        return '#1E88E5'; // Blue
      case 'taxi':
        return '#FFEB3B'; // Yellow
      case 'walking':
        return '#BDBDBD'; // Light Grey
      case 'ferry':
        return '#0D47A1'; // Navy Blue
      case 'cycling':
        return '#8BC34A'; // Lime Green
      default:
        return '#BDBDBD';
    }
  };

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1E1E2F] via-[#2C2C3A] to-[#3E3E55] flex flex-col items-center justify-center">
        <p className="text-white">Loading route details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E1E2F] via-[#2C2C3A] to-[#3E3E55] flex flex-col pb-16">
      <StatusBar style="dark" />
      
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between z-10 text-white">
        <button 
          className="p-2 rounded-full hover:bg-white/10" 
          onClick={handleBackClick}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="font-bold text-lg">{fromLocation} to {toLocation}</h1>
        <button 
          className="p-2 rounded-full hover:bg-white/10" 
          onClick={handleShareClick}
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
      
      {/* Map section - Now at the top */}
      <div className="h-[40vh] relative">
        <Map 
          collapsed={false}
          startLocation={[77.2090, 28.6139]} // Dummy coordinates
          endLocation={[77.2300, 28.6600]} 
          routePoints={[
            [77.2090, 28.6139],
            [77.2150, 28.6250],
            [77.2200, 28.6400],
            [77.2300, 28.6600]
          ]}
        />
      </div>
      
      {/* Route summary - Dropdown control */}
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-t-2xl shadow-lg -mt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold text-xl text-white">
            {route.departureTime} - {route.arrivalTime}
          </div>
          <div className="text-lg font-semibold text-white">
            ₹{route.totalPrice.toFixed(2)}
          </div>
        </div>
        <div className="flex items-center space-x-1 mb-3">
          {route.segments.map((segment, index) => (
            <React.Fragment key={segment.id}>
              <div
                className="flex-shrink-0 p-2 rounded-full"
                style={{ backgroundColor: getColorForMode(segment.mode) }}
              >
                {getIconForMode(segment.mode)}
              </div>
              {index < route.segments.length - 1 && (
                <div className="flex-grow h-0.5 bg-white/30"></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="text-sm text-gray-200">
          {route.totalDuration} min • {route.totalDistance.toFixed(1)} km
        </div>
        
        {/* Toggle button for details */}
        <button 
          className="mt-3 p-2 w-full flex items-center justify-center text-white rounded-md bg-white/10 hover:bg-white/20"
          onClick={toggleDetails}
        >
          {detailsExpanded ? (
            <>
              <span className="mr-2">Hide Details</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span className="mr-2">Show Details</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
      
      {/* Detailed segments - Collapsible */}
      {detailsExpanded && (
        <div className="flex-grow bg-gradient-to-b from-[#2C2C3A] to-[#3E3E55] overflow-y-auto">
          <div className="p-4">
            <Accordion type="single" collapsible className="w-full">
              {route.segments.map((segment, index) => (
                <AccordionItem key={segment.id} value={segment.id} className="border-white/10 mb-3">
                  <AccordionTrigger className="text-white py-3 hover:no-underline">
                    <div className="flex items-center w-full">
                      <div
                        className="flex-shrink-0 mr-3 p-2 rounded-full"
                        style={{ backgroundColor: getColorForMode(segment.mode) }}
                      >
                        {getIconForMode(segment.mode)}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">
                          {segment.mode.charAt(0).toUpperCase() + segment.mode.slice(1)}
                          {segment.routeIdentifier && ` (${segment.routeIdentifier})`}
                        </div>
                        <div className="text-sm text-gray-300">
                          {segment.duration} min • {segment.distance} km
                          {segment.price && ` • ₹${segment.price.toFixed(2)}`}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    <div className="ml-12 border-l-2 border-white/20 pl-4">
                      <div className="mb-4 relative">
                        <div className="absolute -left-[17px] top-1.5 w-6 h-6 rounded-full bg-[#2C2C3A] border-2 border-white/30 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-300">{segment.startTime}</div>
                          <div className="font-medium">{segment.startLocation}</div>
                        </div>
                      </div>
                      
                      {segment.mode !== 'walking' && segment.mode !== 'cycling' && (
                        <div className="mb-4 text-sm">
                          <div className="text-blue-200 font-medium">
                            Transit information:
                          </div>
                          <div>
                            {segment.routeIdentifier || segment.mode} towards {segment.endLocation}
                          </div>
                          <div className="mt-1">
                            {segment.duration} minutes ({segment.distance} km)
                          </div>
                        </div>
                      )}
                      
                      <div className="relative">
                        <div className="absolute -left-[17px] top-1.5 w-6 h-6 rounded-full bg-[#2C2C3A] border-2 border-white/30 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-300">{segment.endTime}</div>
                          <div className="font-medium">{segment.endLocation}</div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}
      
      {/* Book button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-[#1E1E2F]/90 backdrop-blur-sm border-t border-white/10 shadow-lg">
        <Button
          className="w-full py-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
          onClick={handleBookTicket}
        >
          Book Ticket
        </Button>
      </div>
      
      <NavigationBar />
    </div>
  );
};

export default RouteDetails;
