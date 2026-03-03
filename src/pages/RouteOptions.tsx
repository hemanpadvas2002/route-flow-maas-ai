
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Search, Navigation, MapPin } from "lucide-react";
import Map from '@/components/Map';

// Updated route options data with real Chennai locations
const routeOptions = [
  {
    id: "route-1",
    number: "5C",
    transitMode: "bus",
    color: "#FFA500", // Bus color
    from: "Chennai Central",
    to: "T. Nagar",
    duration: "35 min",
    stops: 12,
    nextDeparture: "5 min"
  },
  {
    id: "route-2",
    number: "M1",
    transitMode: "metro",
    color: "#1E88E5", // Metro color
    from: "Chennai Central",
    to: "Vadapalani",
    duration: "20 min",
    stops: 8,
    nextDeparture: "7 min"
  },
  {
    id: "route-3",
    number: "23C",
    transitMode: "bus",
    color: "#FFA500", // Bus color
    from: "Anna Nagar",
    to: "Adyar",
    duration: "45 min",
    stops: 15,
    nextDeparture: "12 min"
  },
  {
    id: "route-4",
    number: "M2",
    transitMode: "metro",
    color: "#1E88E5", // Metro color
    from: "Koyambedu",
    to: "Chennai Airport",
    duration: "25 min",
    stops: 10,
    nextDeparture: "3 min"
  }
];

// Popular Chennai locations for search suggestions
const popularPlaces = [
  "Chennai Central",
  "T. Nagar Bus Depot",
  "Marina Beach",
  "Anna Nagar",
  "Velachery",
  "Guindy",
  "Adyar", 
  "Vadapalani",
  "Koyambedu",
  "Chennai Airport Metro"
];

const RouteOptions = () => {
  const navigate = useNavigate();
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const handleRouteSelect = (routeId: string) => {
    navigate(`/route/${routeId}`);
  };
  
  const getTransitIcon = (mode: string) => {
    switch (mode) {
      case 'bus':
        return <span className="transport-icon text-bus">🚌</span>;
      case 'metro':
        return <span className="transport-icon text-metro">🚇</span>;
      default:
        return <span className="transport-icon text-walking">🚶</span>;
    }
  };

  const handleSearchFocus = () => {
    setShowSearchSuggestions(true);
  };

  const handlePlaceSelect = (place: string) => {
    setSearchInput(place);
    setShowSearchSuggestions(false);
    // In a real app, this would filter or search for routes
  };
  
  return (
    <div className="min-h-screen flex flex-col urban-dusk-gradient">
      {/* Map background */}
      <div className="w-full h-[60vh] md:h-[65vh] lg:h-[70vh]">
        <Map 
          startLocation={[80.2707, 13.0827]}
          endLocation={[80.2338, 13.0416]}
          attributionControl={false}
        />
      </div>
      
      {/* Search Bar */}
      <div className="absolute bottom-[40vh] left-0 right-0 px-4 z-20">
        <div className="bg-white dark:bg-gray-800 rounded-full flex items-center px-4 py-2 shadow-lg">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Where to?"
            className="flex-1 bg-transparent border-none outline-none px-2 text-black dark:text-white"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={handleSearchFocus}
          />
          <button className="p-1 bg-blue-500 rounded-full ml-2">
            <Navigation className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Search suggestions */}
        {showSearchSuggestions && (
          <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
            <div className="p-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 px-2">Popular Places</p>
              <div className="grid grid-cols-1 gap-1">
                {popularPlaces.map((place) => (
                  <button
                    key={place}
                    className="text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200"
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <MapPin className="h-4 w-4 inline mr-2 text-gray-500" />
                    {place}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Route options panel */}
      <div className="absolute bottom-0 left-0 right-0 p-0 rounded-t-2xl overflow-hidden max-w-2xl mx-auto">
        <div className="bg-gradient-to-b from-white/5 to-white/0 dark:from-black/5 dark:to-black/0 backdrop-blur-xl rounded-t-2xl">
          <div className="h-1.5 w-12 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto my-2"></div>
          
          <div className="overflow-auto max-h-[40vh] md:max-h-[35vh] pb-4">
            {routeOptions.map((route) => (
              <div
                key={route.id}
                onClick={() => handleRouteSelect(route.id)}
                className="cursor-pointer px-2 py-1"
              >
                <Card 
                  style={{ backgroundColor: route.color }}
                  className="text-white shadow-md transition-all hover:scale-[1.01] hover:shadow-lg"
                >
                  <div className="p-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold">
                        {route.number}
                      </div>
                      {getTransitIcon(route.transitMode)}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{route.duration}</div>
                      <div className="text-xs opacity-90">{route.nextDeparture}</div>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <div className="flex items-center">
                      <div className="flex-1 text-sm">
                        {route.from} → {route.to}
                      </div>
                    </div>
                    <div className="flex justify-center mt-1 space-x-1">
                      {Array.from({ length: Math.min(route.stops, 15) }).map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptions;
