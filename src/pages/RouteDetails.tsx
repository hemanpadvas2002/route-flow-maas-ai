
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, LocateFixed, CreditCard, Bus, Train } from "lucide-react";
import Map from '@/components/Map';
import LastMileConnectivity from '@/components/LastMile/LastMileConnectivity';
import { LastMileServiceType } from '@/components/LastMile/types';
import { toast } from "sonner";

// Sample route data with Chennai locations
const routeData = {
  "route-1": {
    id: "route-1",
    name: "Chennai Central to T. Nagar",
    startLocation: [80.2707, 13.0827] as [number, number], // Chennai Central
    endLocation: [80.2338, 13.0416] as [number, number], // T. Nagar
    routePoints: [
      [80.2707, 13.0827],
      [80.2654, 13.0766],
      [80.2592, 13.0712],
      [80.2535, 13.0640],
      [80.2445, 13.0539],
      [80.2338, 13.0416]
    ] as [number, number][],
    duration: "35 mins",
    distance: "7.2 km",
    fare: "₹25",
    nextBus: "5 mins",
    occupancy: "Medium",
    transitMode: "bus" as const,
    color: "#FFA500" // Bus color
  },
  "route-2": {
    id: "route-2",
    name: "Chennai Central to Vadapalani",
    startLocation: [80.2707, 13.0827] as [number, number], // Chennai Central
    endLocation: [80.2159, 13.0476] as [number, number], // Vadapalani
    routePoints: [
      [80.2707, 13.0827],
      [80.2600, 13.0700],
      [80.2500, 13.0600],
      [80.2400, 13.0550],
      [80.2300, 13.0500],
      [80.2159, 13.0476]
    ] as [number, number][],
    duration: "20 mins",
    distance: "6.5 km",
    fare: "₹15",
    nextBus: "7 mins",
    occupancy: "Low",
    transitMode: "metro" as const,
    color: "#1E88E5" // Metro color
  },
  "route-3": {
    id: "route-3",
    name: "Anna Nagar to Adyar",
    startLocation: [80.2320, 13.0878] as [number, number], // Anna Nagar
    endLocation: [80.2574, 13.0012] as [number, number], // Adyar
    routePoints: [
      [80.2320, 13.0878],
      [80.2350, 13.0700],
      [80.2400, 13.0500],
      [80.2450, 13.0300],
      [80.2500, 13.0150],
      [80.2574, 13.0012]
    ] as [number, number][],
    duration: "45 mins",
    distance: "10.5 km",
    fare: "₹30",
    nextBus: "12 mins",
    occupancy: "High",
    transitMode: "bus" as const,
    color: "#FFA500" // Bus color
  },
  "route-4": {
    id: "route-4",
    name: "Koyambedu to Chennai Airport",
    startLocation: [80.2029, 13.0667] as [number, number], // Koyambedu
    endLocation: [80.1620, 12.9900] as [number, number], // Chennai Airport
    routePoints: [
      [80.2029, 13.0667],
      [80.1950, 13.0500],
      [80.1850, 13.0300],
      [80.1750, 13.0100],
      [80.1680, 13.0000],
      [80.1620, 12.9900]
    ] as [number, number][],
    duration: "25 mins",
    distance: "9.0 km",
    fare: "₹20",
    nextBus: "3 mins",
    occupancy: "Medium",
    transitMode: "metro" as const,
    color: "#1E88E5" // Metro color
  }
};

interface RouteDetailsParams {
  routeId: string;
}

const RouteDetails: React.FC = () => {
  const { routeId } = useParams<keyof RouteDetailsParams>() as RouteDetailsParams;
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const route = routeData[routeId as keyof typeof routeData];

  useEffect(() => {
    if (!route) {
      navigate('/route-options');
      return;
    }
    
    // Ensure map is visible after component mounts
    const timer = setTimeout(() => setMapVisible(true), 100);
    
    return () => clearTimeout(timer);
  }, [route, navigate]);

  if (!route) {
    return <div className="min-h-screen urban-dusk-gradient flex items-center justify-center">Loading...</div>;
  }

  const handleBooking = () => {
    toast.success("Route booked successfully!");
    navigate('/payment/nfc');
  };

  const handleLastMileBook = (service: LastMileServiceType, fare: number, eta: number) => {
    toast.success(`${service} booked! ₹${fare} • ETA ${eta} min`);
    navigate('/payment/nfc');
  };

  const getTransitIcon = () => {
    return route.transitMode === "bus" ? Bus : Train;
  };

  const TransitIcon = getTransitIcon();

  return (
    <div className="min-h-screen h-screen flex flex-col urban-dusk-gradient relative">
      {/* Map takes the full screen */}
      <div className="absolute inset-0 w-full h-full">
        {mapVisible && (
          <Map
            startLocation={route.startLocation}
            endLocation={route.endLocation}
            routePoints={route.routePoints}
            attributionControl={false}
          />
        )}
      </div>

      {/* Route details panel */}
      <div className={`
        fixed bottom-0 left-0 right-0 bg-card text-card-foreground rounded-t-2xl shadow-lg
        transition-transform duration-300 ease-in-out transform z-10
        max-w-2xl mx-auto max-h-[75vh] overflow-y-auto
        ${collapsed ? 'translate-y-[calc(100%-3.5rem)]' : ''}
      `}>
        {/* Handle for collapsing/expanding */}
        <div 
          className="h-6 w-full flex justify-center items-center cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="w-12 h-1 bg-muted rounded-full my-2"></div>
        </div>

        {/* Header with back button */}
        <div className="px-4 pb-2 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/route-options')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-2">{route.name}</h2>
        </div>

        {/* Content */}
        <CardContent className="grid gap-4 p-4 pt-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card>
              <CardContent className="p-2 text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold">{route.duration}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-2 text-center">
                <LocateFixed className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="font-semibold">{route.distance}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-2 text-center">
                <Users className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                <p className="text-xs text-muted-foreground">Occupancy</p>
                <p className="font-semibold">{route.occupancy}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="p-3 pb-1">
              <div className="flex items-center">
                <TransitIcon className={`h-5 w-5 mr-2 ${route.transitMode === "bus" ? "bus-icon" : "metro-icon"}`} />
                <CardTitle className="text-sm">Next {route.transitMode === "bus" ? "Bus" : "Train"}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Arrives in {route.nextBus}</p>
                  <p className="text-xs text-muted-foreground">Fare: {route.fare}</p>
                </div>
                <Button 
                  size="sm" 
                  className="self-center mobility-blue-gradient hover:opacity-90"
                  onClick={handleBooking}
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Book
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Last Mile Connectivity */}
          <LastMileConnectivity
            transitStopName={route.name.split(' to ')[1] || 'Transit Stop'}
            transitStopCoords={route.endLocation}
            destinationName="Your Destination"
            lastMileDistanceKm={2.5}
            onBook={handleLastMileBook}
          />
        </CardContent>
      </div>
    </div>
  );
};

export default RouteDetails;
