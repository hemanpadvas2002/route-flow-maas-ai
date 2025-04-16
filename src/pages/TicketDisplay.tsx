
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bus, Train, CalendarClock, MapPin, QrCode, Share2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const TicketDisplay = () => {
  const navigate = useNavigate();
  const [isQRVisible, setIsQRVisible] = useState(false);
  
  // Simulate a random route selection for demonstration
  const routeTypes = ["bus", "metro"];
  const [routeType] = useState(routeTypes[Math.floor(Math.random() * routeTypes.length)]);
  
  // Sample ticket data
  const ticketData = {
    routeName: routeType === "bus" ? "5C Chennai Central to T. Nagar" : "M1 Chennai Central to Vadapalani",
    date: new Date().toLocaleDateString('en-IN', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    time: new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    from: "Chennai Central",
    to: routeType === "bus" ? "T. Nagar" : "Vadapalani",
    fare: routeType === "bus" ? "₹25" : "₹15",
    ticketId: "ARGO-" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
  };
  
  // Show QR code with animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsQRVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const TransitIcon = routeType === "bus" ? Bus : Train;
  
  return (
    <div className="min-h-screen urban-dusk-gradient flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className="text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-white ml-2">E-Ticket</h1>
      </div>

      {/* Ticket content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4">
            <div className="flex items-center">
              <TransitIcon className={`mr-2 h-5 w-5 ${routeType === "bus" ? "bus-icon" : "metro-icon"}`} />
              <CardTitle className="text-lg">ARGO {routeType === "bus" ? "Bus" : "Metro"}</CardTitle>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">Ticket ID</p>
              <p className="text-sm font-mono">{ticketData.ticketId}</p>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Ticket details */}
            <div className="p-4 space-y-4">
              <div className="text-center">
                <h2 className="font-semibold text-xl">{ticketData.routeName}</h2>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-1 opacity-60" />
                  <span className="text-sm">{ticketData.date}</span>
                </div>
                <div className="text-sm font-medium">{ticketData.time}</div>
              </div>
              
              <div className="flex justify-between items-start pt-2 pb-2 border-t border-b border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs opacity-60">From</p>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-green-500" />
                      <p className="font-medium">{ticketData.from}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-l border-gray-200 dark:border-gray-700 h-12 mx-4"></div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs opacity-60">To</p>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-red-500" />
                      <p className="font-medium">{ticketData.to}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs opacity-60">Fare</p>
                  <p className="font-bold text-lg">{ticketData.fare}</p>
                </div>
                
                <div>
                  <p className="text-xs opacity-60">Status</p>
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                    <span className="font-medium text-green-500">Confirmed</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* QR Code Section */}
            <div className={`p-4 flex flex-col items-center space-y-3 transition-all duration-500 ${isQRVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-white p-2 rounded-lg">
                <QrCode className="h-40 w-40 p-1 text-black" />
              </div>
              <p className="text-xs text-center opacity-70">
                Show this QR code to the conductor <br/> or scan at the terminal
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex space-x-2 p-4 bg-gray-50 dark:bg-gray-800/50">
              <Button className="flex-1" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="flex-1 mobility-blue-gradient text-white">
                    <QrCode className="h-4 w-4 mr-2" />
                    Show QR
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0 bg-white">
                  <div className="p-2">
                    <QrCode className="h-64 w-64 p-2 text-black" />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketDisplay;
