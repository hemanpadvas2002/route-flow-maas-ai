
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
    <div className="flex flex-col items-center justify-center p-6 rounded-xl" style={{ background: 'linear-gradient(to bottom, #222831, #393E46)' }}>
      <div className="mb-6 text-xl font-semibold text-white">
        Pay ₹{amount.toFixed(2)}
      </div>
      
      <div 
        className={`
          relative p-8 rounded-full mb-8 cursor-pointer
          ${paymentStatus === 'processing' ? 'nfc-pulse' : ''}
          ${paymentStatus === 'processing' ? 'ai-glow' : 'bg-[#2C5364]'}
        `}
        onClick={startPaymentSimulation}
      >
        <Nfc 
          className={`
            h-20 w-20 text-white
            ${paymentStatus === 'processing' ? 'animate-rotate-nfc' : ''}
          `}
        />
        {paymentStatus === 'success' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#00ADB5] rounded-full ai-glow">
            <Check className="h-14 w-14 text-white" />
          </div>
        )}
      </div>
      
      {paymentStatus === 'processing' && (
        <div className="w-full h-1 bg-[#393E46] rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-[#00ADB5] animate-pulse" style={{
            width: '60%',
            animation: 'progress 2s ease-in-out infinite'
          }}></div>
        </div>
      )}
      
      <div className="text-center">
        <p className={`text-lg ${paymentStatus === 'success' ? 'text-[#00ADB5] font-medium' : 'text-white'}`}>
          {statusMessage}
        </p>
        <p className="text-sm text-gray-300 mt-2">
          {paymentStatus === 'idle' ? 'Hold your phone near the card' : ''}
        </p>
      </div>
      
      {paymentStatus === 'idle' && (
        <div className="mt-8 w-full">
          <button
            className="w-full py-4 rounded-lg text-white font-medium maas-button-glow"
            onClick={startPaymentSimulation}
          >
            Simulate NFC Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default NfcPayment;
