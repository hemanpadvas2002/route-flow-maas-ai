
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bus, CheckCircle, Share2 } from "lucide-react";

const TicketDisplay: React.FC = () => {
  const navigate = useNavigate();
  
  // Sample ticket data - in a real app would come from state or API
  const ticketData = {
    route: "Chennai Central to T. Nagar",
    date: new Date().toLocaleDateString(),
    time: "10:45 AM",
    passengerName: "Alex Johnson",
    ticketType: "Single Journey",
    fare: "₹25",
    ticketId: "MAAS" + Math.floor(100000 + Math.random() * 900000)
  };
  
  return (
    <div className="min-h-screen w-full urban-dusk-gradient flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </Button>
        <h1 className="text-xl font-semibold">Your Ticket</h1>
        <Button variant="ghost" size="icon" aria-label="Share ticket">
          <Share2 className="h-5 w-5 text-foreground" />
        </Button>
      </div>
      
      {/* Success Message */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="bg-green-500/10 rounded-full p-2 mb-2">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-lg font-medium text-foreground">Ticket Issued Successfully</h2>
        <p className="text-sm text-muted-foreground">Ready for your journey</p>
      </div>
      
      {/* Ticket Card */}
      <div className="px-4 pb-4">
        <Card className="border-none shadow-lg overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-primary/10 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-[#FFA500] rounded-full p-2 mr-3">
                <Bus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">{ticketData.route}</h3>
                <p className="text-xs text-muted-foreground">{ticketData.date} • {ticketData.time}</p>
              </div>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="flex justify-center py-6 bg-white dark:bg-gray-800">
            <div className="bg-white p-2 rounded-lg">
              <svg 
                className="h-48 w-48" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simplified QR code for visualization */}
                <rect x="10" y="10" width="80" height="80" fill="white" />
                <rect x="20" y="20" width="20" height="20" fill="black" />
                <rect x="60" y="20" width="20" height="20" fill="black" />
                <rect x="20" y="60" width="20" height="20" fill="black" />
                <rect x="60" y="60" width="7" height="7" fill="black" />
                <rect x="73" y="60" width="7" height="7" fill="black" />
                <rect x="60" y="73" width="7" height="7" fill="black" />
                <rect x="73" y="73" width="7" height="7" fill="black" />
                <rect x="45" y="20" width="10" height="10" fill="black" />
                <rect x="45" y="70" width="10" height="10" fill="black" />
                <rect x="20" y="45" width="10" height="10" fill="black" />
                <rect x="70" y="45" width="10" height="10" fill="black" />
                <rect x="45" y="45" width="10" height="10" fill="black" />
              </svg>
              <p className="text-center text-sm text-black mt-2 font-mono">{ticketData.ticketId}</p>
            </div>
          </div>
          
          {/* Ticket Details */}
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Passenger</p>
                <p className="font-medium">{ticketData.passengerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ticket Type</p>
                <p className="font-medium">{ticketData.ticketType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fare</p>
                <p className="font-medium">{ticketData.fare}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Valid Until</p>
                <p className="font-medium">11:45 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 mt-auto">
        <Button 
          className="w-full mobility-blue-gradient text-white"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default TicketDisplay;
