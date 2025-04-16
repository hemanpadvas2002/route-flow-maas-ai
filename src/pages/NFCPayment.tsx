
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Animated NFC Component
const NFCAnimation: React.FC = () => {
  return (
    <div className="relative flex justify-center items-center h-40 w-40 mx-auto">
      <div className="absolute h-40 w-40 bg-[#00ADB5]/10 rounded-full animate-ping"></div>
      <div className="absolute h-32 w-32 bg-[#00ADB5]/20 rounded-full animate-ping animation-delay-300"></div>
      <div className="absolute h-24 w-24 bg-[#00ADB5]/30 rounded-full animate-ping animation-delay-600"></div>
      <div className="absolute h-16 w-16 bg-[#00ADB5]/40 rounded-full animate-ping animation-delay-900"></div>
      <div className="absolute flex justify-center items-center h-12 w-12 bg-gradient-to-r from-[#222831] to-[#393E46] rounded-full shadow-lg">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#00ADB5" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-6 w-6"
        >
          <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
          <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
          <path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" />
          <path d="M16.37 2a20.16 20.16 0 0 1 0 20" />
        </svg>
      </div>
    </div>
  );
};

const NFCPayment: React.FC = () => {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'processing' | 'success' | 'failed'>('waiting');
  const [statusMessage, setStatusMessage] = useState('Place your phone near the NFC reader');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Simulate payment process for demo purposes
    if (paymentStatus === 'processing') {
      const timer = setTimeout(() => {
        setPaymentStatus('success');
        setStatusMessage('Payment successful!');
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Redirect after successful payment
    if (paymentStatus === 'success') {
      const timer = setTimeout(() => {
        if (countdown <= 0) {
          navigate('/ticket');
        } else {
          setCountdown(prev => prev - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate, countdown]);

  const handleTapToPay = () => {
    setPaymentStatus('processing');
    setStatusMessage('Processing payment...');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#222831] via-[#302e3a] to-[#393E46] text-white">
      {/* Header */}
      <header className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="ml-4 text-xl font-semibold">NFC Payment</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col justify-center items-center p-6">
        {/* Card with glowing effect */}
        <div className="max-w-md w-full mx-auto bg-gradient-to-br from-[#222831] to-[#393E46] rounded-2xl shadow-xl overflow-hidden border border-[#00ADB5]/20">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-center mb-4">Complete Your Payment</h2>
            
            {/* Payment amount */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-300">Fare Amount</p>
              <p className="text-4xl font-bold">₹30.00</p>
            </div>
            
            {/* NFC Animation - centered */}
            <div className="flex justify-center items-center py-8">
              <NFCAnimation />
            </div>
            
            {/* Status message */}
            <div className="text-center mt-6 mb-4">
              <p className="text-sm text-gray-300">Status</p>
              <p className={`text-lg font-medium ${paymentStatus === 'success' ? 'text-green-400' : paymentStatus === 'failed' ? 'text-red-400' : 'text-[#00ADB5]'}`}>
                {statusMessage}
              </p>
              {paymentStatus === 'success' && (
                <p className="text-sm text-gray-300 mt-2">
                  Redirecting to ticket in {countdown} seconds...
                </p>
              )}
            </div>
            
            {/* Action button */}
            {paymentStatus === 'waiting' && (
              <Button 
                className="w-full py-6 h-auto mt-4 bg-gradient-to-r from-[#222831] to-[#393E46] hover:from-[#262d36] hover:to-[#434952] border border-[#00ADB5] text-[#00ADB5]"
                onClick={handleTapToPay}
              >
                Tap to Pay
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-400">
        <p>Secured by ARGO Transit Pay</p>
      </footer>
    </div>
  );
};

export default NFCPayment;
