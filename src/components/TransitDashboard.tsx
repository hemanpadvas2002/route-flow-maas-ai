
import React, { useState } from 'react';
import { RouteOption } from '@/types/transit';
import { useTheme } from '@/contexts/ThemeContext';
import { Clock, DollarSign, Users, Map as MapIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TransitDashboardProps {
  route?: RouteOption;
  onBookRoute?: () => void;
  onSaveRoute?: () => void;
  expanded?: boolean;
  onToggleExpanded?: () => void;
  className?: string;
}

const TransitDashboard: React.FC<TransitDashboardProps> = ({
  route,
  onBookRoute,
  onSaveRoute,
  expanded = false,
  onToggleExpanded,
  className = ''
}) => {
  const { theme } = useTheme();
  
  if (!route) {
    return null;
  }
  
  const getCrowdIcon = (level?: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return <div className="flex items-center"><Users className="h-4 w-4 mr-1 text-green-500" /><span>Low</span></div>;
      case 'medium':
        return <div className="flex items-center"><Users className="h-4 w-4 mr-1 text-yellow-500" /><span>Medium</span></div>;
      case 'high':
        return <div className="flex items-center"><Users className="h-4 w-4 mr-1 text-red-500" /><span>High</span></div>;
      default:
        return <div className="flex items-center"><Users className="h-4 w-4 mr-1 text-gray-500" /><span>Unknown</span></div>;
    }
  };
  
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'bus':
        return (
          <div className="w-8 h-8 rounded-full bg-[#FFA500] flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="w-8 h-8 rounded-full bg-[#1E88E5] flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 11v5a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5v-5"/>
              <path d="m3 11 9-9 9 9"/>
              <path d="M16 16v-3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/>
            </svg>
          </div>
        );
      case 'walking':
        return (
          <div className="w-8 h-8 rounded-full bg-[#BDBDBD] flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="w-8 h-8 rounded-full bg-[#FFEB3B] flex items-center justify-center text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m16 10-4 4-4-4"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={cn(
      'transit-dashboard fixed bottom-16 left-0 right-0 z-20 transition-all duration-300',
      expanded ? 'h-auto max-h-[70vh]' : 'h-auto max-h-36',
      className
    )}>
      <div className={cn(
        'bottom-drawer',
        theme,
        'rounded-t-xl shadow-xl overflow-hidden'
      )}>
        {/* Pull tab indicator */}
        <div 
          className="h-1.5 w-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto my-2 cursor-pointer"
          onClick={onToggleExpanded}
        ></div>
        
        {/* Basic info - always visible */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Route Summary</div>
            <button 
              onClick={onToggleExpanded}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-1 text-[#00ADB5]" />
                <span className="font-medium">{route.totalDuration} min</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Time</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-1 text-[#00ADB5]" />
                <span className="font-medium">₹{route.totalPrice.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Fare</div>
            </div>
            
            <div className="flex flex-col items-center">
              {getCrowdIcon(route.crowdLevel)}
              <div className="text-xs text-gray-500 dark:text-gray-400">Crowding</div>
            </div>
          </div>
          
          {/* Route mode summary */}
          <div className="flex items-center space-x-1 mt-4">
            {route.segments.map((segment, index) => (
              <React.Fragment key={segment.id}>
                {getModeIcon(segment.mode)}
                {index < route.segments.length - 1 && (
                  <div className="flex-grow h-0.5 bg-gray-300 dark:bg-gray-700"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Expanded details */}
        {expanded && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              {route.segments.map((segment, index) => (
                <div key={segment.id} className="flex">
                  <div className="mr-4">
                    {getModeIcon(segment.mode)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {segment.mode.charAt(0).toUpperCase() + segment.mode.slice(1)}
                        {segment.routeIdentifier && ` (${segment.routeIdentifier})`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {segment.duration} min
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {segment.startLocation} → {segment.endLocation}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {segment.startTime} - {segment.endTime}
                    </div>
                    {segment.price && (
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                        Fare: ₹{segment.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button
                variant="outline"
                className="py-3 rounded-lg border border-[#00ADB5] text-[#00ADB5]"
                onClick={onSaveRoute}
              >
                Add to Commute
              </Button>
              <Button
                className="py-3 rounded-lg bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white"
                onClick={onBookRoute}
              >
                Book This Route
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransitDashboard;
