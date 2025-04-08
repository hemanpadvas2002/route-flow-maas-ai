
import React from 'react';
import { Bus, Train, Car, UserRound, Ship, Bike } from 'lucide-react';

interface RouteSegment {
  id: string;
  mode: 'bus' | 'train' | 'metro' | 'taxi' | 'walking' | 'ferry' | 'cycling';
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  duration: number; // in minutes
  distance: number; // in km
  routeIdentifier?: string; // e.g., Bus #42, Yellow Line, etc.
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

interface RouteTimelineProps {
  routes: RouteOption[];
  selectedRouteId?: string;
  onSelectRoute: (routeId: string) => void;
  expanded?: boolean;
}

const RouteTimeline: React.FC<RouteTimelineProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  expanded = false,
}) => {
  const getIconForMode = (mode: string) => {
    switch (mode) {
      case 'bus':
        return <Bus className="h-5 w-5" />;
      case 'train':
      case 'metro':
        return <Train className="h-5 w-5" />;
      case 'taxi':
        return <Car className="h-5 w-5" />;
      case 'walking':
        return <UserRound className="h-5 w-5" />;
      case 'ferry':
        return <Ship className="h-5 w-5" />;
      case 'cycling':
        return <Bike className="h-5 w-5" />;
      default:
        return <Bus className="h-5 w-5" />;
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

  return (
    <div className="route-timeline py-4">
      {routes.map((route) => {
        const isSelected = route.id === selectedRouteId;
        
        return (
          <div
            key={route.id}
            className={`
              route-option p-4 mb-3 mx-3 rounded-xl border
              transition-all duration-300 ease-in-out
              ${isSelected ? 'border-blue-500 shadow-md scale-[1.02]' : 'border-gray-200'}
              ${isSelected && expanded ? 'bg-blue-50' : 'bg-white'}
            `}
            onClick={() => onSelectRoute(route.id)}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-3">
                <div className="font-bold text-lg">
                  {route.departureTime} - {route.arrivalTime}
                </div>
                <div className="text-sm text-gray-500">
                  {route.totalDuration} min
                </div>
              </div>
              <div className="font-semibold">
                ₹{route.totalPrice.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {route.segments.map((segment, index) => (
                <React.Fragment key={segment.id}>
                  <div
                    className="flex-shrink-0 p-1.5 rounded-full"
                    style={{ backgroundColor: getColorForMode(segment.mode) }}
                  >
                    {getIconForMode(segment.mode)}
                  </div>
                  {index < route.segments.length - 1 && (
                    <div className="flex-grow h-0.5 bg-gray-300"></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {(isSelected && expanded) && (
              <div className="mt-4 space-y-4 pt-3 border-t border-gray-100">
                {route.segments.map((segment) => (
                  <div key={segment.id} className="segment-details">
                    <div className="flex items-center mb-2">
                      <div
                        className="flex-shrink-0 mr-3 p-1.5 rounded-full"
                        style={{ backgroundColor: getColorForMode(segment.mode) }}
                      >
                        {getIconForMode(segment.mode)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {segment.mode.charAt(0).toUpperCase() + segment.mode.slice(1)}
                          {segment.routeIdentifier && ` (${segment.routeIdentifier})`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {segment.duration} min · {segment.distance} km
                        </div>
                      </div>
                    </div>
                    <div className="ml-10 pl-4 border-l-2 border-gray-200">
                      <div className="mb-2">
                        <div className="text-sm text-gray-500">{segment.startTime}</div>
                        <div className="font-medium">{segment.startLocation}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{segment.endTime}</div>
                        <div className="font-medium">{segment.endLocation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RouteTimeline;
