
import React, { useState, useEffect } from 'react';
import { Nfc, Check } from 'lucide-react';

interface NfcPaymentProps {
  onPaymentComplete: () => void;
  amount: number;
  cardType?: 'credit' | 'transit';
}

const NfcPayment: React.FC<NfcPaymentProps> = ({ 
  onPaymentComplete, 
  amount, 
  cardType = 'transit' 
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('Tap your NFC card to pay');

  // Simulate NFC payment process
  const startPaymentSimulation = () => {
    setPaymentStatus('processing');
    setStatusMessage('Processing payment...');
    
    setTimeout(() => {
      // Simulate successful payment
      setPaymentStatus('success');
      setStatusMessage('Payment successful!');
      
      setTimeout(() => {
        onPaymentComplete();
      }, 1500);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 rounded-xl" 
      style={{ background: 'linear-gradient(to bottom, #222831, #393E46)' }}>
      <div className="mb-6 text-xl font-semibold text-white">
        Pay ₹{amount.toFixed(2)}
      </div>
      
      {/* Centered NFC animation */}
      <div className="flex flex-col items-center justify-center flex-grow w-full">
        <div 
          className={`
            relative p-10 rounded-full mb-8 cursor-pointer
            ${paymentStatus === 'processing' ? 'nfc-pulse' : ''}
            ${paymentStatus === 'processing' ? 'ai-glow' : 'bg-[#2C5364]'}
          `}
          onClick={startPaymentSimulation}
        >
          <Nfc 
            className={`
              h-24 w-24 text-white
              ${paymentStatus === 'processing' ? 'animate-rotate-nfc' : ''}
            `}
          />
          {paymentStatus === 'success' && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#00ADB5] rounded-full ai-glow">
              <Check className="h-16 w-16 text-white" />
            </div>
          )}
        </div>
      </div>
      
      {paymentStatus === 'processing' && (
        <div className="w-full h-2 bg-[#393E46] rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-[#00ADB5] animate-pulse" style={{
            width: '60%',
            animation: 'progress 2s ease-in-out infinite'
          }}></div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <p className={`text-lg ${paymentStatus === 'success' ? 'text-[#00ADB5] font-medium' : 'text-white'}`}>
          {statusMessage}
        </p>
        <p className="text-sm text-gray-300 mt-2">
          {paymentStatus === 'idle' ? 'Hold your phone near the card' : ''}
        </p>
      </div>
      
      {paymentStatus === 'idle' && (
        <div className="w-full">
          <button
            className="w-full py-4 rounded-lg text-white font-medium maas-button-glow"
            onClick={startPaymentSimulation}
          >
            Tap to Pay
          </button>
        </div>
      )}
    </div>
  );
};

export default NfcPayment;
