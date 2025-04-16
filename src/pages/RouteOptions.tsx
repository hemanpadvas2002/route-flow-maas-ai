
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Search, Star, Navigation } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import Map from '@/components/Map';

// Sample route options data
const routeOptions = [
  {
    id: "route-1",
    number: "801",
    transitMode: "bus",
    color: "#32CD32", // Green
    from: "Grand Théâtre",
    to: "Pointe-de-Sainte-Foy",
    duration: "15 min",
    stops: 2,
    nextDeparture: "5 min"
  },
  {
    id: "route-2",
    number: "11",
    transitMode: "metro",
    color: "#1976D2", // Blue
    from: "Turnbull",
    to: "Pointe-de-Sainte-Foy",
    duration: "20 min",
    stops: 2,
    nextDeparture: "7 min"
  },
  {
    id: "route-3",
    number: "292",
    transitMode: "bus",
    color: "#FF8C00", // Orange
    from: "Des Érables",
    to: "Ouest vers Saint-Augustin",
    duration: "35 min",
    stops: 3,
    nextDeparture: "12 min"
  }
];

const RouteOptions = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
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
  
  return (
    <div className="min-h-screen flex flex-col urban-dusk-gradient">
      {/* Map background */}
      <div className="w-full h-[65vh]">
        <Map 
          startLocation={[80.2707, 13.0827]} // Chennai Central
          endLocation={[80.2338, 13.0416]}   // T. Nagar
        />
      </div>
      
      {/* Search Bar */}
      <div className="absolute top-5 left-0 right-0 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-full flex items-center px-4 py-2 shadow-lg">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Where to?"
            className="flex-1 bg-transparent border-none outline-none px-2 text-black dark:text-white"
          />
          <button className="p-1 bg-blue-500 rounded-full">
            <Star className="h-4 w-4 text-white" />
          </button>
          <button className="p-1 bg-blue-500 rounded-full ml-2">
            <Navigation className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
      
      {/* Route options panel */}
      <div className="absolute bottom-0 left-0 right-0 p-0 rounded-t-2xl overflow-hidden">
        <div className="bg-gradient-to-b from-white/5 to-white/0 dark:from-black/5 dark:to-black/0 backdrop-blur-xl rounded-t-2xl">
          <div className="h-1.5 w-12 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto my-2"></div>
          
          <div className="overflow-auto max-h-[35vh] pb-4">
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
                      <button className="p-1 bg-white/20 rounded-full">
                        <Star className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                    <div className="flex justify-center mt-1 space-x-1">
                      {Array.from({ length: route.stops }).map((_, i) => (
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
