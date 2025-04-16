
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, LocateFixed, CreditCard, Bus, Train, LucideIcon } from "lucide-react";
import Map from '@/components/Map';

// Sample route data
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
    transitMode: "bus" as const
  },
  "route-2": {
    id: "route-2",
    name: "Chennai Central to Marina Beach",
    startLocation: [80.2707, 13.0827] as [number, number], // Chennai Central
    endLocation: [80.2838, 13.0500] as [number, number], // Marina Beach
    routePoints: [
      [80.2707, 13.0827],
      [80.2757, 13.0780],
      [80.2790, 13.0700],
      [80.2823, 13.0627],
      [80.2838, 13.0500]
    ] as [number, number][],
    duration: "20 mins",
    distance: "4.5 km",
    fare: "₹15",
    nextBus: "2 mins",
    occupancy: "Low",
    transitMode: "metro" as const
  }
};

interface RouteDetailsParams {
  routeId: string;
}

const getTransitIcon = (mode: "bus" | "metro" | "walk"): LucideIcon => {
  switch (mode) {
    case "bus": return Bus;
    case "metro": return Train;
    default: return Bus;
  }
};

const getTransitColor = (mode: "bus" | "metro" | "walk"): string => {
  switch (mode) {
    case "bus": return "bus-icon"; // Uses the CSS class we defined
    case "metro": return "metro-icon";
    default: return "walking-icon";
  }
};

const RouteDetails: React.FC = () => {
  const { routeId } = useParams<keyof RouteDetailsParams>() as RouteDetailsParams;
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const route = routeData[routeId as keyof typeof routeData];

  useEffect(() => {
    if (!route) {
      navigate('/');
    }
  }, [route, navigate]);

  if (!route) {
    return <div>Loading...</div>;
  }

  const TransitIcon = getTransitIcon(route.transitMode);
  const transitColorClass = getTransitColor(route.transitMode);

  return (
    <div className="min-h-screen flex flex-col urban-dusk-gradient">
      {/* Map takes the full height */}
      <div className="w-full flex-grow">
        <Map
          startLocation={route.startLocation}
          endLocation={route.endLocation}
          routePoints={route.routePoints}
        />
      </div>

      {/* Route details panel */}
      <div className={`
        fixed bottom-0 left-0 right-0 bg-card text-card-foreground rounded-t-2xl shadow-lg
        transition-transform duration-300 ease-in-out transform z-10
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
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-2">{route.name}</h2>
        </div>

        {/* Content */}
        <CardContent className="grid gap-4 p-4 pt-0">
          <div className="grid grid-cols-3 gap-4">
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
                <TransitIcon className={`h-5 w-5 mr-2 ${transitColorClass}`} />
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
                  onClick={() => navigate('/payment/nfc')}
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Book
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </div>
    </div>
  );
};

export default RouteDetails;
