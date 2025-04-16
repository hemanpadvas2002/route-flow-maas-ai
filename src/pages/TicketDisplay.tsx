
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bus, Clock, MapPin, Download, Share2, QrCode } from "lucide-react";

const generateQRCode = () => {
  // This would typically use a library like qrcode.react
  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="grid grid-cols-5 grid-rows-5 gap-1 w-48 h-48">
        {/* Simplified QR Code for visualization */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={i} 
            className={`${Math.random() > 0.7 ? 'bg-black' : 'bg-white'} 
                      ${i === 0 || i === 4 || i === 20 || i === 24 ? 'border-2 border-black bg-white' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

const TicketDisplay: React.FC = () => {
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(3600); // 1 hour in seconds
  const qrRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Countdown timer for ticket validity
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format remaining time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E1E2F] to-[#3E3E55] text-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Your Ticket</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </header>

      {/* Ticket card */}
      <div className="px-4 py-6">
        <Card className="bg-gradient-to-b from-gray-900 to-gray-800 border-none overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-2"></div>
          <CardContent className="p-0">
            {/* QR code section */}
            <div className="flex flex-col items-center py-8 border-b border-gray-700" ref={qrRef}>
              <div className="relative">
                {generateQRCode()}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-full p-1">
                    <Bus className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-300">Scan to validate</p>
            </div>
            
            {/* Ticket details */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-xs">Ticket Type</p>
                  <p className="font-semibold">Single Journey - Bus</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Price</p>
                  <p className="font-semibold">₹30.00</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-xs">Route</p>
                  <div className="flex items-center">
                    <Bus className="h-4 w-4 mr-1 text-amber-500" />
                    <p className="font-semibold">292 - Des Érables</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Valid until</p>
                  <div className="flex items-center justify-end">
                    <Clock className="h-4 w-4 mr-1 text-blue-400" />
                    <p className="font-semibold text-blue-400">{formatTime(remainingTime)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-gray-400 text-xs">Journey</p>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-semibold">Des Érables</p>
                    <p className="text-xs text-gray-400">Starting point</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
                  <div>
                    <p className="font-semibold">Saint-Augustin</p>
                    <p className="text-xs text-gray-400">Destination</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-gray-400">Ticket #ARG0-2025-04016-292</p>
                <p className="text-xs text-gray-400">16 April 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-6 flex justify-center space-x-4">
        <Button variant="outline" className="flex-1 py-6 h-auto border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10">
          <Download className="h-5 w-5 mr-2" />
          Save
        </Button>
        <Button variant="outline" className="flex-1 py-6 h-auto border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10">
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>
      </div>

      {/* Help text */}
      <div className="px-6 py-4 text-center">
        <p className="text-sm text-gray-400">
          Show this ticket to the driver or scan at station gates
        </p>
      </div>
    </div>
  );
};

export default TicketDisplay;
