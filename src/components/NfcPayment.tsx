
import React, { useState, useEffect } from 'react';
import { Nfc } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-blue-50">
      <div className="mb-4 text-lg font-semibold">
        Pay ₹{amount.toFixed(2)}
      </div>
      
      <div 
        className={`
          relative bg-white p-8 rounded-full shadow-lg mb-4
          ${paymentStatus === 'processing' ? 'animate-pulse-light' : ''}
        `}
        onClick={startPaymentSimulation}
      >
        <Nfc 
          className={`
            h-14 w-14 text-blue-500
            ${paymentStatus === 'processing' ? 'animate-rotate-nfc' : ''}
          `}
        />
        {paymentStatus === 'success' && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-full">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <p className={`text-lg ${paymentStatus === 'success' ? 'text-green-600 font-medium' : 'text-gray-700'}`}>
          {statusMessage}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {paymentStatus === 'idle' ? 'Or use another payment method below' : ''}
        </p>
      </div>
      
      {paymentStatus === 'idle' && (
        <div className="mt-6 w-full">
          <button
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium"
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
