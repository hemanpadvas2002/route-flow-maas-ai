
import React, { useState } from 'react';
import { Search, MapPin, X, Filter, FigmaIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface RouteSearchProps {
  onSearch: (from: string, to: string, showAccessible: boolean) => void;
  className?: string;
  expanded?: boolean;
  onToggleExpanded?: () => void;
}

const RouteSearch: React.FC<RouteSearchProps> = ({
  onSearch,
  className = '',
  expanded = false,
  onToggleExpanded
}) => {
  const { theme } = useTheme();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [showAccessible, setShowAccessible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Popular locations in Delhi for suggestions
  const popularLocations = [
    "Connaught Place",
    "India Gate",
    "Chandni Chowk",
    "Karol Bagh",
    "Lajpat Nagar",
    "Hauz Khas",
    "Rajiv Chowk",
    "AIIMS",
    "IGI Airport",
    "Dwarka",
    "Noida",
    "Gurugram"
  ];
  
  const handleSearch = () => {
    if (fromLocation && toLocation) {
      onSearch(fromLocation, toLocation, showAccessible);
    }
  };
  
  const clearInput = (field: 'from' | 'to') => {
    if (field === 'from') {
      setFromLocation('');
    } else {
      setToLocation('');
    }
  };
  
  const handleLocationSelect = (location: string, field: 'from' | 'to') => {
    if (field === 'from') {
      setFromLocation(location);
    } else {
      setToLocation(location);
    }
  };

  return (
    <div className={cn(
      'route-search',
      'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
      expanded ? 'h-auto' : 'h-auto max-h-24',
      className
    )}>
      <div className={cn(
        'map-search-container',
        theme,
        'p-4 rounded-b-xl shadow-lg'
      )}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white flex items-center">
            <span className="bg-gradient-to-r from-[#00ADB5] to-[#2C5364] bg-clip-text text-transparent">ARGO</span>
            <FigmaIcon className="ml-1 h-5 w-5 text-[#00ADB5]" />
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-full hover:bg-white/10 text-white"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="mb-4 p-3 rounded-lg bg-white/10 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 text-white">♿</span>
                <span className="text-white">Show only accessible routes</span>
              </div>
              <Switch 
                checked={showAccessible}
                onCheckedChange={setShowAccessible}
                className="data-[state=checked]:bg-[#00ADB5]"
              />
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {/* From location input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent"
              placeholder="From"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
            />
            {fromLocation && (
              <button 
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => clearInput('from')}
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
          
          {/* To location input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent"
              placeholder="To"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
            />
            {toLocation && (
              <button 
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => clearInput('to')}
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Search button */}
          <Button
            className={cn(
              "w-full py-3 rounded-xl font-medium transition-colors",
              fromLocation && toLocation
                ? "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] hover:opacity-90 text-white"
                : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-50"
            )}
            onClick={handleSearch}
            disabled={!fromLocation || !toLocation}
          >
            <Search className="h-5 w-5 mr-2" />
            Find Routes
          </Button>
        </div>
        
        {/* Location suggestions - only shown when expanded */}
        {expanded && (
          <div className="mt-4 p-2 rounded-lg bg-white/10 max-h-60 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Popular Locations</h3>
            <div className="grid grid-cols-2 gap-2">
              {popularLocations.map((location, index) => (
                <div
                  key={index}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer text-white text-sm transition-colors"
                  onClick={() => {
                    if (!fromLocation) {
                      handleLocationSelect(location, 'from');
                    } else if (!toLocation) {
                      handleLocationSelect(location, 'to');
                    }
                  }}
                >
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-[#00ADB5]" />
                    {location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Toggle button to expand/collapse */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={onToggleExpanded}
            className="p-1 rounded-full hover:bg-white/10 text-white"
          >
            {expanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteSearch;
