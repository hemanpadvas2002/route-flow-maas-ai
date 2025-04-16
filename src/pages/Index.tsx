
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, MapPin, Navigation, CreditCard, User, Search } from "lucide-react";
import Map from '@/components/Map';

const Index = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      navigate('/route-options');
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
      <div className="absolute bottom-20 left-0 right-0 px-4">
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-full flex items-center px-4 py-2 shadow-lg">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Where to?"
            className="flex-1 bg-transparent border-none outline-none px-2 text-black dark:text-white"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button type="submit" className="p-1.5 bg-blue-500 rounded-full">
            <Navigation className="h-4 w-4 text-white" />
          </button>
        </form>
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
      
      {/* Content overlay */}
      <div className="container px-4 py-6 -mt-16">
        <Card className="shadow-xl border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center">ARGO Chennai</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Actions */}
            <div className="mt-6">
              <Button 
                className="w-full mobility-blue-gradient text-white py-6 h-auto"
                onClick={() => navigate('/route-options')}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Find Routes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
