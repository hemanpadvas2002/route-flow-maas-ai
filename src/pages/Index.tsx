
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, Search } from "lucide-react";
import Map from '@/components/Map';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

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

const Index = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('Chennai Central');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeInput, setActiveInput] = useState<'origin' | 'destination' | null>(null);
  
  const handleSearch = () => {
    if (origin.trim() && destination.trim()) {
      navigate('/route-options');
    }
  };

  const handlePlaceSelect = (place: string) => {
    if (activeInput === 'origin') {
      setOrigin(place);
    } else if (activeInput === 'destination') {
      setDestination(place);
    }
    setActiveInput(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col urban-dusk-gradient">
      {/* Map background */}
      <div className="w-full h-screen absolute inset-0">
        <Map 
          startLocation={[80.2707, 13.0827]}
          endLocation={destination ? [80.2338, 13.0416] : undefined}
          attributionControl={false}
        />
      </div>
      
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between z-10">
        <div>
          <h1 className="text-white text-xl font-bold tracking-tight">ARGO</h1>
          <p className="text-white/70 text-sm">Chennai</p>
        </div>
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile')}
          className="bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/40"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
      
      {/* "Where To?" Button */}
      <Sheet>
        <SheetTrigger asChild>
          <div className="absolute bottom-20 left-0 right-0 px-4">
            <Button 
              className="w-full bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-full flex items-center justify-start px-4 h-12"
            >
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
              <span>Where to?</span>
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl p-0">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div 
                className="flex items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                onClick={() => setActiveInput('origin')}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <Input 
                  placeholder="From" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="border-none bg-transparent p-0 focus-visible:ring-0"
                  onFocus={() => setActiveInput('origin')}
                />
              </div>
              
              <div 
                className="flex items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                onClick={() => setActiveInput('destination')}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <Input 
                  placeholder="To" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="border-none bg-transparent p-0 focus-visible:ring-0"
                  onFocus={() => setActiveInput('destination')}
                />
              </div>
            </div>
            
            <Button 
              className="w-full mobility-blue-gradient text-white"
              onClick={handleSearch}
            >
              Find Routes
            </Button>
            
            {/* Popular places */}
            {activeInput && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Popular Places</h3>
                <div className="space-y-2">
                  {popularPlaces.map((place) => (
                    <button
                      key={place}
                      className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center"
                      onClick={() => handlePlaceSelect(place)}
                    >
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {place}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
