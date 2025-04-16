
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const NFCPayment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleTapToPay = () => {
    setIsAnimating(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your ticket has been issued",
      });
      
      // Navigate to ticket display
      setTimeout(() => {
        navigate("/ticket");
      }, 1000);
    }, 2000);
  };
  
  useEffect(() => {
    // Cleanup animation state when component unmounts
    return () => {
      setIsAnimating(false);
    };
  }, []);
  
  return (
    <div className="min-h-screen w-full urban-dusk-gradient flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </Button>
        <h1 className="text-xl font-semibold ml-2">NFC Payment</h1>
      </div>
      
      {/* Main Content - NFC Tap Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div 
          className={`nfc-glow-gradient rounded-full w-64 h-64 flex items-center justify-center mb-10 transition-all duration-500 relative
            ${isAnimating ? 'scale-110 shadow-lg' : 'scale-100'}`}
        >
          {/* NFC Waves Animation */}
          <div className={`absolute inset-0 rounded-full border-4 border-[#00ADB5] opacity-0 
            ${isAnimating ? 'animate-ping' : ''}`}>
          </div>
          
          {/* Inner Circle */}
          <div className="rounded-full bg-[#333] w-48 h-48 flex items-center justify-center shadow-inner">
            <div className="text-center">
              <svg 
                className={`w-24 h-24 mx-auto nfc-glow-accent transition-all duration-300
                  ${isAnimating ? 'scale-110 opacity-80' : 'opacity-100'}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12Z" />
                <path d="M15 9C14.4 8.4 13.7 8 13 8" />
                <path d="M17 7C15.9 5.9 14.5 5 13 5" />
                <path d="M9 15L9 9L13 9" />
              </svg>
              <p className="mt-2 text-[#00ADB5] font-medium">Ready to Scan</p>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <Button
          className="mobility-blue-gradient mt-6 text-white px-8 py-6 h-auto text-lg shadow-lg transition-all hover:shadow-xl"
          onClick={handleTapToPay}
          disabled={isAnimating}
        >
          {isAnimating ? "Processing..." : "Tap to Pay"}
        </Button>
        
        <p className="mt-4 text-muted-foreground text-sm text-center max-w-xs">
          Hold your phone near the payment terminal to complete the transaction
        </p>
      </div>
    </div>
  );
};

export default NFCPayment;
