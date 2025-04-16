
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Smartphone, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const NFCPayment = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Animation for NFC waves
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleTapToPay = () => {
    setIsAnimating(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setCompleted(true);
      toast.success("Payment successful!");
      
      // Navigate to ticket after success
      setTimeout(() => {
        navigate('/ticket');
      }, 1200);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen urban-dusk-gradient flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-white ml-2">NFC Payment</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg bg-gradient-to-b from-[#222831] to-[#393E46]">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Contactless Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* NFC Animation centered */}
            <div className="relative h-60 w-60 flex items-center justify-center my-4">
              <div className={`absolute w-40 h-40 rounded-full border-2 border-[#00ADB5] opacity-60 transition-all duration-700 ${isAnimating ? 'scale-125 opacity-0' : 'scale-100'}`}></div>
              <div className={`absolute w-28 h-28 rounded-full border-2 border-[#00ADB5] opacity-80 transition-all duration-700 delay-200 ${isAnimating ? 'scale-150 opacity-10' : 'scale-100'}`}></div>
              <div className="bg-[#00ADB5] p-4 rounded-full z-10 shadow-lg shadow-[#00ADB5]/20">
                {completed ? (
                  <CheckCircle2 className="h-12 w-12 text-white animate-scale-in" />
                ) : (
                  <Smartphone className="h-12 w-12 text-white" />
                )}
              </div>
            </div>
            
            {/* Tap to pay button */}
            <div className="w-full mt-4 text-center">
              <Button 
                className="w-full bg-gradient-to-r from-[#222831] via-[#393E46] to-[#222831] border border-[#00ADB5]/30 hover:border-[#00ADB5] group relative overflow-hidden"
                size="lg"
                onClick={handleTapToPay}
                disabled={completed}
              >
                <div className="absolute inset-0 w-full h-full bg-[#00ADB5]/10 group-hover:bg-[#00ADB5]/20 transition-all duration-300"></div>
                <CreditCard className="h-5 w-5 mr-2 text-[#00ADB5]" />
                <span className="relative z-10 text-white font-medium">Tap to Pay</span>
              </Button>
              
              <p className="text-white/60 text-sm mt-4">
                Hold your device near the NFC reader to complete payment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NFCPayment;
