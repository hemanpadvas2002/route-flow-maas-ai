
import React from 'react';
import { RouteOption } from '@/types/transit';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

interface RouteSummaryProps {
  routes: RouteOption[];
  selectedRouteId?: string;
  onSelectRoute: (routeId: string) => void;
  showDetails?: boolean;
}

const RouteSummary: React.FC<RouteSummaryProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  showDetails = false
}) => {
  const { theme } = useTheme();
  
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'bus':
        return (
          <div className="w-6 h-6 rounded-full bg-[#FFA500] flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6v6"/>
              <path d="M15 6v6"/>
              <path d="M2 12h19.6"/>
              <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
              <circle cx="7" cy="18" r="2"/>
              <circle cx="15" cy="18" r="2"/>
            </svg>
          </div>
        );
      case 'metro':
      case 'train':
        return (
          <div className="w-6 h-6 rounded-full bg-[#1E88E5] flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 11v5a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5v-5"/>
              <path d="m3 11 9-9 9 9"/>
              <path d="M16 16v-3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/>
            </svg>
          </div>
        );
      case 'walking':
        return (
          <div className="w-6 h-6 rounded-full bg-[#BDBDBD] flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m13 8 2 2"/>
              <path d="m18 12-2-2"/>
              <path d="M19 15v-1a1 1 0 0 0-1-1h-2l-3-3-2.5 1.7a1.91 1.91 0 0 0-.5 1.7L11 15"/>
              <path d="m8 12 .4.9a1.3 1.3 0 0 0 1.5.7L11 13"/>
              <path d="M15 17a3 3 0 1 1-2.12-5.13"/>
              <path d="M11.8 7.3a1.92 1.92 0 0 0 .2-.8 2 2 0 0 0-4 0c0 .3.1.5.2.8"/>
              <path d="M12 16v-3"/>
            </svg>
          </div>
        );
      case 'taxi':
        return (
          <div className="w-6 h-6 rounded-full bg-[#FFEB3B] flex items-center justify-center text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.36 2H5.64a1 1 0 0 0-.81.41L2 6h20l-2.83-3.59A1 1 0 0 0 18.36 2z"/>
              <path d="M6.5 6h11l.76 5.29a1 1 0 0 1-.76 1.21H6.5a1 1 0 0 1-.76-1.21z"/>
              <path d="m14 13-4.5 2.5"/>
              <path d="M5 18h14"/>
              <path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
              <path d="M19 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m16 10-4 4-4-4"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="route-summary p-4 space-y-3">
      {routes.map((route) => {
        const isSelected = route.id === selectedRouteId;
        
        return (
          <Collapsible
            key={route.id}
            open={isSelected && showDetails}
            className={cn(
              "route-option p-4 rounded-xl border transition-all duration-300 shadow-sm",
              isSelected ? "border-[#00ADB5] shadow-md scale-[1.02]" : "border-gray-200 dark:border-gray-700",
              isSelected 
                ? theme === 'dark' 
                  ? "bg-gradient-to-r from-[#0F2027] to-[#2C5364]" 
                  : "bg-gray-100" 
                : theme === 'dark' 
                  ? "bg-[#1E1E2F]/70" 
                  : "bg-white",
              isSelected && "ai-glow"
            )}
            onClick={() => onSelectRoute(route.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="font-bold text-lg">
                  {route.departureTime} - {route.arrivalTime}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {route.totalDuration} min
                </div>
              </div>
              <div className="font-semibold">
                ₹{route.totalPrice.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-3">
              {route.segments.map((segment, index) => (
                <React.Fragment key={segment.id}>
                  {getModeIcon(segment.mode)}
                  {index < route.segments.length - 1 && (
                    <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <CollapsibleTrigger className="w-full pt-2 flex justify-center">
              {isSelected && showDetails ? (
                <ChevronUp className="h-5 w-5 text-[#00ADB5]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {route.segments.map((segment) => (
                <div key={segment.id} className="segment-details">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      {getModeIcon(segment.mode)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {segment.mode.charAt(0).toUpperCase() + segment.mode.slice(1)}
                        {segment.routeIdentifier && ` (${segment.routeIdentifier})`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {segment.duration} min · {segment.distance.toFixed(1)} km
                        {segment.price && ` · ₹${segment.price.toFixed(2)}`}
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-start">
                          <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 mt-1 mr-2"></div>
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{segment.startTime}</div>
                            <div className="font-medium">{segment.startLocation}</div>
                          </div>
                        </div>
                        <div className="ml-2 h-6 border-l border-dashed border-gray-300 dark:border-gray-600"></div>
                        <div className="flex items-start">
                          <div className="w-4 h-4 rounded-full bg-[#00ADB5] mt-1 mr-2"></div>
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{segment.endTime}</div>
                            <div className="font-medium">{segment.endLocation}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
      
      {routes.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">No routes found</div>
          <div className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Try adjusting your search criteria
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteSummary;
