
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Calendar, User, Plus, Minus } from 'lucide-react';
import NfcPayment from '../components/NfcPayment';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
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

  const bgColor = theme === 'dark' 
    ? 'linear-gradient(to bottom, #1E1E2F, #2C2C3A, #3E3E55)'
    : '#f5f5f5';
  
  const cardBgColor = theme === 'dark'
    ? 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)'
    : 'white';
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subtextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="min-h-screen" style={{ background: bgColor }}>
      {/* Header */}
      <div className="p-4" style={{ 
        background: theme === 'dark' 
          ? 'linear-gradient(to right, #0F2027, #203A43, #2C5364)'
          : 'linear-gradient(to right, #e0e0e0, #f5f5f5)'
      }}>
        <div className="flex items-center">
          <button className={`mr-2 ${textColor}`} onClick={handleBack}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className={`text-xl font-bold ${textColor}`}>Book Ticket</h1>
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
          <div className="p-4 mb-4 rounded-lg shadow-sm" style={{ background: cardBgColor }}>
            <h2 className={`text-lg font-semibold mb-2 ${textColor}`}>Trip Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={subtextColor}>From</p>
                <p className={`font-medium ${textColor}`}>{fromLocation}</p>
              </div>
              <div>
                <p className={subtextColor}>To</p>
                <p className={`font-medium ${textColor}`}>{toLocation}</p>
              </div>
              <div>
                <p className={subtextColor}>Date</p>
                <p className={`font-medium ${textColor}`}>Today</p>
              </div>
              <div>
                <p className={subtextColor}>Time</p>
                <p className={`font-medium ${textColor}`}>{route.departureTime} - {route.arrivalTime}</p>
              </div>
            </div>
          </div>
          
          {/* Transport Mode */}
          <div className="p-4 mb-4 rounded-lg shadow-sm" style={{ background: cardBgColor }}>
            <h2 className={`text-lg font-semibold mb-2 ${textColor}`}>Transport Details</h2>
            <div>
              {route.segments
                .filter(segment => segment.mode !== 'walking')
                .map((segment, index) => (
                  <div key={segment.id} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <div className={`font-medium capitalize ${textColor}`}>{segment.mode} {segment.routeIdentifier}</div>
                      <div className={`font-semibold ${textColor}`}>₹{segment.price}</div>
                    </div>
                    <div className={subtextColor}>
                      {segment.startLocation} to {segment.endLocation} • {segment.duration} min
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          {/* Passenger Count */}
          <div className="p-4 mb-4 rounded-lg shadow-sm" style={{ background: cardBgColor }}>
            <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>Passengers</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className={`h-5 w-5 mr-2 ${subtextColor}`} />
                <span className={textColor}>Number of Passengers</span>
              </div>
              <div className="flex items-center">
                <button 
                  className={`p-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  onClick={decrementPassengerCount}
                  disabled={passengerCount <= 1}
                >
                  <Minus className={`h-4 w-4 ${textColor}`} />
                </button>
                <span className={`mx-3 font-medium ${textColor}`}>{passengerCount}</span>
                <button 
                  className={`p-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  onClick={incrementPassengerCount}
                  disabled={passengerCount >= 10}
                >
                  <Plus className={`h-4 w-4 ${textColor}`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="p-4 mb-4 rounded-lg shadow-sm" style={{ background: cardBgColor }}>
            <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <div 
                className={`border rounded-lg p-3 flex items-center ${
                  paymentMethod === 'nfc' 
                    ? 'border-[#00ADB5] bg-[#00ADB5]/10' 
                    : `${borderColor} ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}`
                }`}
                onClick={() => handlePaymentMethodChange('nfc')}
              >
                <div className={`w-5 h-5 rounded-full mr-2 border ${
                  paymentMethod === 'nfc' 
                    ? 'border-[#00ADB5] bg-[#00ADB5]' 
                    : `${borderColor} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`
                }`}>
                  {paymentMethod === 'nfc' && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className={`font-medium ${textColor}`}>NFC Payment</div>
              </div>
              
              <div 
                className={`border rounded-lg p-3 flex items-center ${
                  paymentMethod === 'card' 
                    ? 'border-[#00ADB5] bg-[#00ADB5]/10' 
                    : `${borderColor} ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}`
                }`}
                onClick={() => handlePaymentMethodChange('card')}
              >
                <div className={`w-5 h-5 rounded-full mr-2 border ${
                  paymentMethod === 'card' 
                    ? 'border-[#00ADB5] bg-[#00ADB5]' 
                    : `${borderColor} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`
                }`}>
                  {paymentMethod === 'card' && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className={`font-medium ${textColor}`}>Card</div>
              </div>
            </div>
          </div>
          
          {/* Price Summary */}
          <div className="p-4 mb-4 rounded-lg shadow-sm" style={{ background: cardBgColor }}>
            <h2 className={`text-lg font-semibold mb-2 ${textColor}`}>Price Summary</h2>
            <div className="flex justify-between py-2">
              <span className={textColor}>Base Fare</span>
              <span className={textColor}>₹{route.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className={textColor}>Passengers</span>
              <span className={textColor}>x {passengerCount}</span>
            </div>
            <div className={`flex justify-between py-2 font-semibold text-lg border-t ${borderColor} mt-2 pt-2`}>
              <span className={textColor}>Total</span>
              <span className={textColor}>₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="p-4">
            <button
              className="w-full py-3 rounded-lg text-white font-medium"
              onClick={handleProceedToPayment}
              style={{ 
                background: 'linear-gradient(to right, #0F2027, #203A43, #2C5364)',
                boxShadow: '0 0 10px rgba(0, 173, 181, 0.3)'
              }}
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
