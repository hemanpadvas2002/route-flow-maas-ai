
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, MapPin, Navigation } from "lucide-react";
import Map from '@/components/Map';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Map background */}
      <div className="w-full h-[65vh]">
        <Map 
          startLocation={[80.2707, 13.0827]} // Chennai Central
          endLocation={[80.2338, 13.0416]}   // T. Nagar
        />
      </div>
      
      {/* Content overlay */}
      <div className="container px-4 py-6 -mt-16">
        <Card className="shadow-xl border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center">ARGO Transit Chennai</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Popular routes */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Bus className="mr-2 h-5 w-5 text-primary" />
                Popular Routes
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/route/route-1">
                  <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <CardContent className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Chennai Central to T. Nagar</p>
                        <p className="text-xs text-muted-foreground">35 mins · 7.2 km</p>
                      </div>
                      <Navigation className="h-4 w-4 text-primary" />
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/route/route-2">
                  <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <CardContent className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Chennai Central to Marina Beach</p>
                        <p className="text-xs text-muted-foreground">20 mins · 4.5 km</p>
                      </div>
                      <Navigation className="h-4 w-4 text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Popular locations */}
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                Popular Destinations
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {["Chennai Central", "T. Nagar", "Marina Beach", "Anna Nagar", "Velachery", "Guindy"].map((place) => (
                  <Button 
                    key={place} 
                    variant="outline" 
                    className="justify-start h-auto py-2"
                  >
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {place}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
