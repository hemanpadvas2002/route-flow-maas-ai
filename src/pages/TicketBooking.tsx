
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Calendar, User, Plus, Minus } from 'lucide-react';
import NfcPayment from '../components/NfcPayment';

interface RouteSegment {
  id: string;
  mode: 'bus' | 'train' | 'metro' | 'taxi' | 'walking' | 'ferry' | 'cycling';
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  duration: number;
  distance: number;
  routeIdentifier?: string;
  price?: number;
}

interface RouteOption {
  id: string;
  segments: RouteSegment[];
  totalDuration: number;
  totalDistance: number;
  totalPrice: number;
  departureTime: string;
  arrivalTime: string;
}

interface LocationState {
  route: RouteOption;
  fromLocation: string;
  toLocation: string;
}

const TicketBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { route, fromLocation, toLocation } = (location.state as LocationState) || {};
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'nfc'>('nfc');
  const [passengerCount, setPassengerCount] = useState(1);
  const [showNfcPayment, setShowNfcPayment] = useState(false);

  const getTotalPrice = () => {
    return route ? route.totalPrice * passengerCount : 0;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePaymentMethodChange = (method: 'card' | 'nfc') => {
    setPaymentMethod(method);
  };

  const handleProceedToPayment = () => {
    if (paymentMethod === 'nfc') {
      setShowNfcPayment(true);
    } else {
      // In a real app, would redirect to card payment
      // For demo, we'll simulate success
      handlePaymentComplete();
    }
  };

  const handlePaymentComplete = () => {
    const ticketId = `TIX${Date.now().toString().substring(6)}`;
    navigate('/ticket-view', { 
      state: { 
        ticket: {
          id: ticketId,
          route,
          fromLocation,
          toLocation,
          passengerCount,
          paymentMethod,
          purchaseDate: new Date().toISOString(),
          totalPrice: getTotalPrice(),
        }
      }
    });
  };

  const incrementPassengerCount = () => {
    if (passengerCount < 10) {
      setPassengerCount(passengerCount + 1);
    }
  };

  const decrementPassengerCount = () => {
    if (passengerCount > 1) {
      setPassengerCount(passengerCount - 1);
    }
  };

  if (!route) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center">
          <button className="mr-2" onClick={handleBack}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Book Ticket</h1>
        </div>
      </div>
      
      {showNfcPayment ? (
        <div className="p-4">
          <NfcPayment 
            amount={getTotalPrice()} 
            onPaymentComplete={handlePaymentComplete}
          />
        </div>
      ) : (
        <>
          {/* Trip Summary */}
          <div className="p-4 bg-white mb-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Trip Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{fromLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{toLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">Today</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{route.departureTime} - {route.arrivalTime}</p>
              </div>
            </div>
          </div>
          
          {/* Transport Mode */}
          <div className="p-4 bg-white mb-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Transport Details</h2>
            <div>
              {route.segments
                .filter(segment => segment.mode !== 'walking')
                .map((segment, index) => (
                  <div key={segment.id} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium capitalize">{segment.mode} {segment.routeIdentifier}</div>
                      <div className="font-semibold">₹{segment.price}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {segment.startLocation} to {segment.endLocation} • {segment.duration} min
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          {/* Passenger Count */}
          <div className="p-4 bg-white mb-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Passengers</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <span>Number of Passengers</span>
              </div>
              <div className="flex items-center">
                <button 
                  className="p-1 bg-gray-200 rounded-full"
                  onClick={decrementPassengerCount}
                  disabled={passengerCount <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-3 font-medium">{passengerCount}</span>
                <button 
                  className="p-1 bg-gray-200 rounded-full"
                  onClick={incrementPassengerCount}
                  disabled={passengerCount >= 10}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="p-4 bg-white mb-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <div 
                className={`border rounded-lg p-3 flex items-center ${
                  paymentMethod === 'nfc' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onClick={() => handlePaymentMethodChange('nfc')}
              >
                <div className={`w-5 h-5 rounded-full mr-2 border ${
                  paymentMethod === 'nfc' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'nfc' && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="font-medium">NFC Payment</div>
              </div>
              
              <div 
                className={`border rounded-lg p-3 flex items-center ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onClick={() => handlePaymentMethodChange('card')}
              >
                <div className={`w-5 h-5 rounded-full mr-2 border ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'card' && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="font-medium">Card</div>
              </div>
            </div>
          </div>
          
          {/* Price Summary */}
          <div className="p-4 bg-white mb-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Price Summary</h2>
            <div className="flex justify-between py-2">
              <span>Base Fare</span>
              <span>₹{route.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Passengers</span>
              <span>x {passengerCount}</span>
            </div>
            <div className="flex justify-between py-2 font-semibold text-lg border-t border-gray-200 mt-2 pt-2">
              <span>Total</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="p-4">
            <button
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketBooking;
